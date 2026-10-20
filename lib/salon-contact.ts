/* ══════════════════════════════════════════════════════════════════════
   THE SALON'S CONTACT DETAILS — one copy, imported by every public page.

   La-fe Beauty Parlor. Phone and location are from the salon's poster
   (public/La-fe-special-offer.jpeg).
   They are printed on the site, dialled from a phone and used to reach the
   business, so do not substitute a placeholder into any of them.

   lib/models/Settings.ts holds the same details as editable defaults for
   the dashboard. Kept in step by hand — that model cannot import this file.
   ══════════════════════════════════════════════════════════════════════ */

export const SALON_NAME = "La-fe Beauty Parlor"

/** The person customers deal with. */
export const SALON_CONTACT_PERSON = "Luyanda Thabethe"

/** Dialable form, for `tel:` links. International so it works from abroad. */
export const SALON_PHONE = "+27696238320"

/** Same number, spaced for reading. Never put this in an href. */
export const SALON_PHONE_DISPLAY = "069 623 8320"

/** wa.me wants the number with no "+", spaces or punctuation. */
export const SALON_WHATSAPP = "27696238320"

/** Mailbox the site links to. Not where the contact form delivers — that
    goes to OWNER_EMAIL, server-side. */
export const SALON_EMAIL = "lafebeauty0@gmail.com"

/* The dashboard owner's sign-in email and name are NOT here: they come from
   OWNER_EMAIL / OWNER_NAME in .env (lib/owner-account.ts), so no personal
   address is committed to the repository. */

/** As printed on the site. */
export const SALON_ADDRESS = "Phokeng"

/** What the map is asked to find — country spelled out so the geocoder
    doesn't pick a place of the same name elsewhere. */
export const SALON_MAP_ADDRESS = "Phokeng, North West, South Africa"

/** Pre-encoded, because both the map embed and the directions link use it. */
export const SALON_MAP_QUERY = encodeURIComponent(SALON_MAP_ADDRESS)

/**
 * Opening hours. Also the booking window: the wizard offers start times from
 * OPEN until the last half-hour slot before CLOSE.
 */
export const SALON_HOURS = {
  days: "Monday – Sunday",
  open: "08:30",
  close: "18:00",
} as const

export const SALON_HOURS_DISPLAY = `${SALON_HOURS.days}, ${SALON_HOURS.open}–${SALON_HOURS.close}`

/**
 * The salon's social profiles.
 *
 * A URL here is a public claim in the same way the phone number is, and a
 * wrong one is worse than a missing one: a guessed handle sends customers to
 * a stranger's page. So it starts empty and gets the real URL from the
 * client. While blank, the footer shows the icon as an inert mark rather
 * than a link.
 */
export type SalonSocial = {
  /** Used as the accessible name: "La-fe Beauty Parlor on Facebook". */
  label: string
  /** Full profile URL. Empty means "not set up yet" — the link is not shown. */
  url: string
}

export const SALON_SOCIALS: SalonSocial[] = [
  /* From the salon (2026-10-19), with share-tracking parameters removed. */
  { label: "Facebook", url: "https://www.facebook.com/share/19p1noKC37/" },
  { label: "Instagram", url: "https://www.instagram.com/lafebeautyparlor/" },
  { label: "TikTok", url: "https://www.tiktok.com/@lafebeauty2" },
]

/**
 * Opening lines for the WhatsApp links, written from the customer's side —
 * `?text=` prefills the customer's compose box. Kept short and easy to type
 * over.
 */
export const WHATSAPP_MESSAGES = {
  /** Header and contact section — no context beyond being on the site. */
  general: "Hi La-fe Beauty Parlor! I'd like to ask about your services.",
  /** Someone part-way through the booking flow who needs a hand. */
  booking: "Hi La-fe Beauty Parlor! I need some help with my booking.",
} as const

/**
 * wa.me link with the compose box prefilled.
 *
 * Always go through this rather than writing the URL inline — the message
 * has to be percent-encoded, and apostrophes are encoded too because some
 * Android link handlers end the URL at the first raw one.
 */
export const whatsappLink = (message: string) =>
  `https://wa.me/${SALON_WHATSAPP}?text=${encodeURIComponent(message).replace(/'/g, "%27")}`
