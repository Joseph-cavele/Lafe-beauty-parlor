import "./db-env" // must stay first: loads env and refuses databases that aren't La-fe's
import { connectDB } from "../lib/db"
import { ServiceModel } from "../lib/models/Service"
import { UserModel } from "../lib/models/User"
import { salonServices, serviceSlug } from "../lib/salon-services"
import { ownerEmailFromEnv, ownerNameFromEnv } from "../lib/owner-account"

/* ══════════════════════════════════════════════════════════════════════
   La-fe seed — IDEMPOTENT. Run it as often as you like; it never creates
   duplicates and never deletes anything.

   Services   upserted on { category, slug } (slug from the name). Name and
              category are kept in step with lib/salon-services.ts. A
              confirmed price there is always applied; for a "price on
              request" service the seed never touches the price, so a price
              entered later in the dashboard survives a re-run. Description,
              duration and a combo's checklist are set only when the service
              is first created, so dashboard edits to those survive too.
   Stylists   not seeded. The team (Naledi, Oarabile, Ofentse) and which
              services each offers are managed on /dashboard/stylists; the
              seed used to upsert Luyanda Thabethe, who is no longer a
              stylist, and would have re-activated her on every run.
   Owner     dashboard login for OWNER_EMAIL (.env), upserted by email.
              No password: the owner signs in with a one-time code emailed
              to that address (features/auth/server/login-code.ts).

   No customers, bookings or notifications are created or copied.
   ══════════════════════════════════════════════════════════════════════ */

async function seed() {
  await connectDB()
  const ownerEmail = ownerEmailFromEnv()
  const ownerExists = !ownerEmail || !!(await UserModel.exists({ email: ownerEmail }))

  // ── Services ────────────────────────────────────────────────────────
  const result = await ServiceModel.bulkWrite(
    salonServices.map((s) => {
      const slug = serviceSlug(s.name)
      return {
        updateOne: {
          filter: { category: s.category, slug },
          update: {
            $set: {
              name: s.name,
              category: s.category,
              slug,
              ...(s.price !== null ? { price: s.price } : {}),
            },
            $setOnInsert: {
              description: s.description,
              duration: s.duration,
              ...(s.includes ? { includes: s.includes } : {}),
            },
          },
          upsert: true,
        },
      }
    })
  )
  // ── Owner login ─────────────────────────────────────────────────────
  if (!ownerExists) {
    await UserModel.create({
      name: ownerNameFromEnv(),
      email: ownerEmail,
      role: "owner",
    })
  }

  const total = await ServiceModel.countDocuments({ slug: { $exists: true } })
  // matchedCount = already existed (their updatedAt is refreshed on every run).
  console.log(
    `Services: ${result.upsertedCount} created, ${result.matchedCount} already existed ` +
      `(${total} seeded services in the database).`
  )
  console.log(
    !ownerEmail
      ? "Owner login skipped: set OWNER_EMAIL in .env."
      : ownerExists
        ? `Owner login ${ownerEmail} already exists.`
        : `Owner login created: ${ownerEmail} (signs in with an emailed code).`
  )
  /* The app caches the service list (unstable_cache, tag "services") on disk
     in .next/cache, so a seed run while the app is up isn't visible until
     that cache is cleared or its 300s revalidate passes. */
  console.log("If the app is running: rm -rf .next/cache and restart, or wait 5 minutes.")
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
