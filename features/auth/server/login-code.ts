import { createHmac, randomInt, timingSafeEqual } from "node:crypto"

import { connectDB } from "@/lib/db"
import { LoginCodeModel } from "@/lib/models/LoginCode"
import { SettingsModel } from "@/lib/models/Settings"
import { UserModel } from "@/lib/models/User"
import { ownerEmailFromEnv, ownerNameFromEnv } from "@/lib/owner-account"
import { emailFrom, resend } from "@/lib/resend"
import { loginCodeEmailHtml } from "@/emails/login-code"

/* ══════════════════════════════════════════════════════════════════════
   Passwordless dashboard sign-in, and changing the sign-in address.

   The dashboard has ONE sign-in address: Settings.ownerLoginEmail, or
   OWNER_EMAIL from .env while that is empty (lib/owner-account.ts).

   Sign in   requestLoginCode → code emailed to that address →
             verifyLoginCode (from the Credentials provider in auth.ts).
   Change    requestEmailChangeCode → code emailed to the NEW address →
             confirmEmailChange switches over only once that code is
             entered, so a typo can never lock the owner out.

   Codes are single-use, tied to one purpose, expire after CODE_TTL_MS, allow
   MAX_ATTEMPTS wrong guesses and can be re-sent after RESEND_COOLDOWN_MS.
   Only an HMAC of the code (keyed with AUTH_SECRET) is stored.
   ══════════════════════════════════════════════════════════════════════ */

const CODE_TTL_MS = 10 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
export const MAX_ATTEMPTS = 5

type Purpose = "login" | "change-email"

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

/** The address that can currently sign in to the dashboard. */
export async function getOwnerLoginEmail() {
  await connectDB()
  const settings = await SettingsModel.findOne({ key: "salon" }, { ownerLoginEmail: 1 }).lean<{
    ownerLoginEmail?: string
  }>()
  const email = normalizeEmail(settings?.ownerLoginEmail || ownerEmailFromEnv())
  if (!email) console.error("No dashboard sign-in email: set OWNER_EMAIL in .env")
  return email
}

/** True when `email` is the dashboard sign-in address. Also gates Google sign-in. */
export async function isOwnerEmail(email: string) {
  const owner = await getOwnerLoginEmail()
  return owner !== "" && normalizeEmail(email) === owner
}

/** A user's current name, for refreshing the session after a rename. */
export async function getUserById(id: string) {
  await connectDB()
  return UserModel.findById(id, { name: 1 })
    .lean<{ name: string }>()
    .catch(() => null)
}

/**
 * The owner's account for a verified sign-in address — created on first
 * sign-in if the seed hasn't made it yet, so a fresh database still lets
 * the owner in. Shared by the code and Google sign-in paths.
 */
export async function ensureOwnerUser(rawEmail: string) {
  await connectDB()
  const email = normalizeEmail(rawEmail)
  return UserModel.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, name: ownerNameFromEnv(), role: "owner" } },
    { upsert: true, returnDocument: "after" }
  )
}

function hashCode(email: string, code: string, purpose: Purpose) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET is not set")
  return createHmac("sha256", secret).update(`${purpose}:${normalizeEmail(email)}:${code}`).digest("hex")
}

type IssueResult =
  | { ok: true }
  | { ok: false; reason: "cooldown"; retryAfterSeconds: number }
  | { ok: false; reason: "send_failed" }

/** Create a code for `email` + `purpose`, replacing any earlier one, and email it. */
async function issueCode(email: string, purpose: Purpose): Promise<IssueResult> {
  await connectDB()

  const latest = await LoginCodeModel.findOne({ email, purpose })
    .sort({ createdAt: -1 })
    .lean<{ createdAt: Date }>()
  if (latest) {
    const waited = Date.now() - new Date(latest.createdAt).getTime()
    if (waited < RESEND_COOLDOWN_MS) {
      return { ok: false, reason: "cooldown", retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - waited) / 1000) }
    }
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0")
  await LoginCodeModel.deleteMany({ email, purpose })
  await LoginCodeModel.create({
    email,
    purpose,
    codeHash: hashCode(email, code, purpose),
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
  })

  if (!resend) {
    // No RESEND_API_KEY: in development, print the code so the flow can still
    // be tested locally. Never in production — that would leak it to logs.
    if (process.env.NODE_ENV !== "production") {
      console.log(`🔑 Dashboard ${purpose} code for ${email}: ${code} (RESEND_API_KEY not set, so not emailed)`)
      return { ok: true }
    }
    console.error("Code not sent: RESEND_API_KEY is not set")
    return { ok: false, reason: "send_failed" }
  }

  const minutes = CODE_TTL_MS / 60_000
  try {
    const { error } = await resend.emails.send({
      from: emailFrom(),
      to: email,
      subject:
        purpose === "login"
          ? `Your La-fe dashboard sign-in code: ${code}`
          : `Confirm your new La-fe sign-in email: ${code}`,
      html: loginCodeEmailHtml({ code, minutes, purpose }),
    })
    if (error) {
      console.error("Code email rejected by Resend:", error)
      await LoginCodeModel.deleteMany({ email, purpose })
      return { ok: false, reason: "send_failed" }
    }
  } catch (err) {
    console.error("Failed to send code email", err)
    await LoginCodeModel.deleteMany({ email, purpose })
    return { ok: false, reason: "send_failed" }
  }

  return { ok: true }
}

type CheckResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "too_many_attempts" }
  | { ok: false; reason: "invalid"; attemptsLeft: number }

/** Check `rawCode` against the latest code for `email` + `purpose`; single use. */
async function checkCode(email: string, rawCode: string, purpose: Purpose): Promise<CheckResult> {
  const code = rawCode.replace(/\D/g, "")

  await connectDB()
  const doc = await LoginCodeModel.findOne({ email, purpose }).sort({ createdAt: -1 })
  if (!doc || doc.expiresAt.getTime() <= Date.now()) {
    if (doc) await LoginCodeModel.deleteMany({ email, purpose })
    return { ok: false, reason: "expired" }
  }
  /* Reserve this attempt atomically BEFORE comparing. A read-then-save counter
     lets parallel guesses all read the same count and slip past the limit;
     $inc with an $lt guard can't hand out more than MAX_ATTEMPTS tries. */
  const reserved = await LoginCodeModel.findOneAndUpdate(
    { _id: doc._id, attempts: { $lt: MAX_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { returnDocument: "after" }
  )
  if (!reserved) {
    await LoginCodeModel.deleteMany({ email, purpose })
    return { ok: false, reason: "too_many_attempts" }
  }

  const expected = Buffer.from(reserved.codeHash, "hex")
  const actual = Buffer.from(hashCode(email, code, purpose), "hex")
  const match = code.length === 6 && expected.length === actual.length && timingSafeEqual(expected, actual)

  if (!match) {
    const attemptsLeft = MAX_ATTEMPTS - reserved.attempts
    if (attemptsLeft <= 0) {
      await LoginCodeModel.deleteMany({ email, purpose })
      return { ok: false, reason: "too_many_attempts" }
    }
    return { ok: false, reason: "invalid", attemptsLeft }
  }

  // Single use, even if the right code arrives twice at once: only the
  // request that actually deletes it succeeds.
  const consumed = await LoginCodeModel.deleteOne({ _id: reserved._id })
  if (consumed.deletedCount !== 1) return { ok: false, reason: "expired" }
  await LoginCodeModel.deleteMany({ email, purpose })
  return { ok: true }
}

/* ── Sign in ────────────────────────────────────────────────────────── */

export type RequestCodeResult = IssueResult | { ok: false; reason: "not_owner" }

export async function requestLoginCode(rawEmail: string): Promise<RequestCodeResult> {
  if (!(await isOwnerEmail(rawEmail))) return { ok: false, reason: "not_owner" }
  return issueCode(normalizeEmail(rawEmail), "login")
}

export type VerifyCodeResult = CheckResult | { ok: false; reason: "not_owner" }

export async function verifyLoginCode(rawEmail: string, rawCode: string): Promise<VerifyCodeResult> {
  if (!(await isOwnerEmail(rawEmail))) return { ok: false, reason: "not_owner" }
  return checkCode(normalizeEmail(rawEmail), rawCode, "login")
}

/* ── Change the sign-in address (owner only — callers must check) ───── */

export type EmailChangeRequestResult = IssueResult | { ok: false; reason: "same_email" | "in_use" }

export async function requestEmailChangeCode(rawNewEmail: string): Promise<EmailChangeRequestResult> {
  const newEmail = normalizeEmail(rawNewEmail)
  const current = await getOwnerLoginEmail()
  if (newEmail === current) return { ok: false, reason: "same_email" }
  if (await UserModel.exists({ email: newEmail })) return { ok: false, reason: "in_use" }
  return issueCode(newEmail, "change-email")
}

export type EmailChangeConfirmResult = CheckResult | { ok: false; reason: "in_use" }

export async function confirmEmailChange(rawNewEmail: string, rawCode: string): Promise<EmailChangeConfirmResult> {
  const newEmail = normalizeEmail(rawNewEmail)
  const checked = await checkCode(newEmail, rawCode, "change-email")
  if (!checked.ok) return checked

  const current = await getOwnerLoginEmail()
  if (await UserModel.exists({ email: newEmail })) return { ok: false, reason: "in_use" }

  // The owner's account moves with the address, so name and history stay.
  await UserModel.updateOne({ email: current, role: "owner" }, { $set: { email: newEmail } })
  await SettingsModel.updateOne(
    { key: "salon" },
    { $set: { ownerLoginEmail: newEmail }, $setOnInsert: { key: "salon" } },
    { upsert: true, setDefaultsOnInsert: true }
  )
  // Any sign-in code still pending for the old address is now useless.
  await LoginCodeModel.deleteMany({ email: current })
  return { ok: true }
}
