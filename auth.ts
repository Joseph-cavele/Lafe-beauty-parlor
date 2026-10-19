import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { loginCodeSchema } from "@/features/auth/schema"
import {
  ensureOwnerUser,
  getUserById,
  isOwnerEmail,
  verifyLoginCode,
} from "@/features/auth/server/login-code"

/* A failed sign-in reaches the client as `result.code`, which the sign-in
   card turns into a message (features/auth/components/sign-in-card.tsx).
   The codes say only what the owner needs to fix — never the code itself. */
class LoginCodeError extends CredentialsSignin {
  constructor(code: string) {
    super()
    this.code = code
  }
}

/* Google OAuth client from Google Cloud Console. CLIENT_ID / CLIENT_SECRET
   are the names in this project's .env; AUTH_GOOGLE_* (Auth.js's own
   convention) also work. Its Authorized redirect URI must be
   <AUTH_URL>/api/auth/callback/google. Without both, Google sign-in is off. */
const googleId = process.env.AUTH_GOOGLE_ID ?? process.env.CLIENT_ID
const googleSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.CLIENT_SECRET
export const googleSignInEnabled = Boolean(googleId && googleSecret)

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Trust the deployment host (Vercel serves behind a proxy). Without this,
  // Auth.js rejects requests as UntrustedHost in production and login fails.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    /* Passwordless: email + the one-time code emailed by /api/login-code. */
    Credentials({
      credentials: {
        email: {},
        code: {},
      },
      authorize: async (credentials) => {
        const parsed = loginCodeSchema.safeParse(credentials)
        if (!parsed.success) throw new LoginCodeError("invalid_format")

        const result = await verifyLoginCode(parsed.data.email, parsed.data.code)
        if (!result.ok) {
          throw new LoginCodeError(
            result.reason === "invalid" ? `invalid_${result.attemptsLeft}` : result.reason
          )
        }

        const user = await ensureOwnerUser(parsed.data.email)
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role as "owner" | "stylist",
        }
      },
    }),
    /* "Sign in with Google" — the same single owner, proven by Google. */
    ...(googleSignInEnabled
      ? [Google({ clientId: googleId, clientSecret: googleSecret })]
      : []),
  ],
  callbacks: {
    /* Google may only sign in the dashboard's sign-in address, and only
       once Google has verified it. Anyone else goes back to /login with a
       reason the card explains (GoogleNotOwner / GoogleUnverified). */
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true
      const email = profile?.email
      if (!email || profile?.email_verified !== true) return "/login?error=GoogleUnverified"
      return (await isOwnerEmail(email)) ? true : "/login?error=GoogleNotOwner"
    },
    async jwt({ token, user, account, trigger }) {
      /* Settings → Account renamed the owner: re-read the name from the
         database. The client only signals that something changed — it never
         supplies the value, so it can't write its own session. */
      if (trigger === "update" && token.sub) {
        const fresh = await getUserById(token.sub)
        if (fresh) token.name = fresh.name
        return token
      }
      if (account?.provider === "google" && token.email) {
        // Google's user object has no role: use the owner's own account, so
        // both sign-in methods land in the same session identity.
        const owner = await ensureOwnerUser(token.email)
        token.sub = String(owner._id)
        token.name = owner.name
        token.email = owner.email
        token.role = owner.role as "owner" | "stylist"
      } else if (user) {
        token.role = user.role as "owner" | "stylist"
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.role) {
        ;(session.user as { role: "owner" | "stylist" }).role = token.role as
          | "owner"
          | "stylist"
      }
      return session
    },
  },
})
