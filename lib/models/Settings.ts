import { Schema, model, models, type InferSchemaType } from "mongoose"

const settingsSchema = new Schema(
  {
    // Singleton key so there is only ever one settings document.
    key: { type: String, default: "salon", unique: true },
    salonName: { type: String, default: "La-fe Beauty Parlor" },
    tagline: { type: String, default: "Your Beauty Is Our Priority" },
    /* Defaults are the salon's real details, not samples. Kept in step with
       lib/salon-contact.ts by hand — this model cannot import it, since the
       seed and the API both load the schema outside the app's module graph. */
    email: { type: String, default: "luyandathabethe2k@gmail.com" },
    phone: { type: String, default: "069 623 8320" },
    address: { type: String, default: "Phokeng" },
    openingHours: { type: String, default: "Monday – Sunday, 08:30 – 18:00" },
    notificationEmail: { type: String, default: "" },
    emailNotifications: { type: Boolean, default: true },
    /* The ONE address that can sign in to the dashboard (by emailed code).
       Empty = OWNER_EMAIL from .env (lib/owner-account.ts). Changed only
       through Settings → Sign-in email, which confirms the new address with
       a code first (features/auth/server/login-code.ts). */
    ownerLoginEmail: { type: String, default: "" },
  },
  { timestamps: true }
)

export type SettingsDoc = InferSchemaType<typeof settingsSchema>
export const SettingsModel = models.Settings || model("Settings", settingsSchema)
