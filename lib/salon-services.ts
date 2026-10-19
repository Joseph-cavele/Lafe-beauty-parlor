// La-fe Beauty Parlor's service list — the ONE copy.
//
// Both halves of the app read from here: the marketing pages (/, /services)
// render it directly, and `npm run seed` upserts it into the `Service`
// collection that drives booking. So a name, price or category changes in
// one place and the price list and the booking flow can never disagree.
//
// PRICES are the salon's own (makeup special, lashes and nails price lists,
// 2026-10-18). `price: null` would render as "Price on request" — never R0.
//
// DURATION: every appointment is booked as 2 hours (confirmed by the salon,
// 2026-10-18). It drives the booking calendar.

import { formatPrice } from "./currency"
import { salonImages, serviceImage } from "./salon-assets"

/** Must match SERVICE_CATEGORIES in features/services/schema.ts. */
export type SalonServiceCategory = "Makeup" | "Lashes" | "Nails" | "Wigs"

export type SalonService = {
  name: string
  category: SalonServiceCategory
  /** Rand. `null` = not confirmed yet, shown as "Price on request". */
  price: number | null
  /** Minutes — see the note at the top. */
  duration: number
  description: string
}

/** Minutes. Every service is a 2-hour appointment. */
const TWO_HOURS = 120

const MAKEUP = "Flawless finish with high-quality premium products. House calls available."
const LASHES = "Lasts 3–4 weeks — long-lasting, soft and natural."

export const salonServices: SalonService[] = [
  // ── Makeup Special — for 1 person ───────────────────────────────────
  { name: "Natural Beat", category: "Makeup", price: 350, duration: TWO_HOURS, description: `A light, natural makeup look that enhances your features. ${MAKEUP}` },
  { name: "Soft Glam", category: "Makeup", price: 450, duration: TWO_HOURS, description: `Soft glam with a polished, glowing finish. ${MAKEUP}` },
  { name: "Full Glam", category: "Makeup", price: 550, duration: TWO_HOURS, description: `Full glam for weddings, parties and big nights out. ${MAKEUP}` },

  // ── Makeup Special — for 2 people ───────────────────────────────────
  { name: "Natural Beat for 2", category: "Makeup", price: 600, duration: TWO_HOURS, description: `Natural Beat for two people. ${MAKEUP}` },
  { name: "Soft Glam for 2", category: "Makeup", price: 800, duration: TWO_HOURS, description: `Soft Glam for two people. ${MAKEUP}` },
  { name: "Full Glam for 2", category: "Makeup", price: 1000, duration: TWO_HOURS, description: `Full Glam for two people. ${MAKEUP}` },

  // ── Makeup Special — for 4 people (group) ───────────────────────────
  { name: "Natural Beat for 4", category: "Makeup", price: 1100, duration: TWO_HOURS, description: `Natural Beat for a group of four. ${MAKEUP}` },
  { name: "Soft Glam for 4", category: "Makeup", price: 1500, duration: TWO_HOURS, description: `Soft Glam for a group of four. ${MAKEUP}` },
  { name: "Full Glam for 4", category: "Makeup", price: 1900, duration: TWO_HOURS, description: `Full Glam for a group of four. ${MAKEUP}` },

  // ── Makeup Special — installation + makeup ──────────────────────────
  { name: "Natural + Makeup", category: "Makeup", price: 550, duration: TWO_HOURS, description: `Installation with a Natural Beat makeup look. ${MAKEUP}` },
  { name: "Soft Glam + Makeup", category: "Makeup", price: 650, duration: TWO_HOURS, description: `Installation with a Soft Glam makeup look. ${MAKEUP}` },
  { name: "Full Glam + Makeup", category: "Makeup", price: 750, duration: TWO_HOURS, description: `Installation with a Full Glam makeup look. ${MAKEUP}` },

  // ── Lashes ──────────────────────────────────────────────────────────
  { name: "Classic lashes", category: "Lashes", price: 300, duration: TWO_HOURS, description: `One extension on each natural lash for a clean, defined look. ${LASHES}` },
  { name: "Hybrid lashes", category: "Lashes", price: 350, duration: TWO_HOURS, description: `A mix of classic and volume lashes for texture and fullness. ${LASHES}` },
  { name: "Volume lashes", category: "Lashes", price: 400, duration: TWO_HOURS, description: `Fluffy fans of lightweight lashes for a full, dramatic look. ${LASHES}` },

  // ── Nails — gel ─────────────────────────────────────────────────────
  { name: "Gel overlay", category: "Nails", price: 230, duration: TWO_HOURS, description: "Gel over your natural nails for strength and shine." },
  { name: "Tips & Gel", category: "Nails", price: 250, duration: TWO_HOURS, description: "Tips for added length, finished in gel." },

  // ── Nails — polygel ─────────────────────────────────────────────────
  { name: "Polygel normal tips", category: "Nails", price: 250, duration: TWO_HOURS, description: "Polygel nails on normal-length tips." },
  { name: "Polygel XXL", category: "Nails", price: 300, duration: TWO_HOURS, description: "Polygel nails on extra-long XXL tips." },

  // ── Nails — toes ────────────────────────────────────────────────────
  { name: "Gel toes", category: "Nails", price: 150, duration: TWO_HOURS, description: "Gel polish on your toes." },

  // ── Wigs ────────────────────────────────────────────────────────────
  /* No price on the salon's lists yet → "Price on request". Set it here (and
     re-run the seed) or in the dashboard once the salon confirms it. The
     "+ Makeup" packages above cover an installation done with makeup. */
  { name: "Wig installation", category: "Wigs", price: null, duration: TWO_HOURS, description: "Lace wig installation with a natural-looking, melted hairline, styled to finish." },
]

/** URL segment for a service — also half of the seed's upsert key. */
export const serviceSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/* ── Marketing views ──────────────────────────────────────────────────── */

export type ServiceItem = {
  name: string
  /** Display string: Rand, or "Price on request". */
  price: string
}

export type ServiceCategory = {
  title: string
  items: ServiceItem[]
}

const CATEGORY_ORDER: SalonServiceCategory[] = ["Makeup", "Lashes", "Nails", "Wigs"]

export const serviceCategories: ServiceCategory[] = CATEGORY_ORDER.map((category) => ({
  title: category,
  items: salonServices
    .filter((s) => s.category === category)
    .map((s) => ({ name: s.name, price: formatPrice(s.price) })),
}))

export type FeaturedService = {
  name: string
  from: string
  description: string
  image: string
  alt: string
  /**
   * Aggregate score out of 5, and how many reviews it came from. Left unset:
   * the card shows a rating row only when both exist, and there are no real
   * La-fe reviews yet. Never fill these with invented numbers.
   */
  rating?: number
  reviewCount?: number
}

/** One service per category leads the home page and gets a detail page. */
// Six cards (two rows of three). Wig installation took Volume lashes' place,
// which is still on /services and in the price list.
const FEATURED = ["Natural Beat", "Soft Glam", "Wig installation", "Classic lashes", "Gel overlay", "Polygel XXL"]

export const featuredServices: FeaturedService[] = FEATURED.map((name) => {
  const s = salonServices.find((x) => x.name === name)
  if (!s) throw new Error(`salon-services: featured service "${name}" is not in the list`)
  const img = serviceImage(s.name, s.category)
  return { name: s.name, from: formatPrice(s.price), description: s.description, image: img.src, alt: img.alt }
})

export type CatalogItem = ServiceItem & {
  description?: string
  image?: string
  alt?: string
}

export type CatalogCategory = {
  title: string
  items: CatalogItem[]
}

export const serviceCatalog: CatalogCategory[] = CATEGORY_ORDER.map((category) => {
  return {
    title: category,
    items: salonServices
      .filter((s) => s.category === category)
      .map((s) => {
        const img = serviceImage(s.name, s.category)
        return {
          name: s.name,
          price: formatPrice(s.price),
          description: s.description,
          image: img.src,
          alt: img.alt,
        }
      }),
  }
})

/** Service name → its photo, for the booking wizard (which reads services from the DB). */
export const serviceImageByName: Record<string, { image: string; alt: string }> =
  Object.fromEntries(
    salonServices.map((s) => {
      const img = serviceImage(s.name, s.category)
      return [s.name, { image: img.src, alt: img.alt }]
    })
  )

/** "Recent work" gallery tiles — see lib/salon-assets.ts to fill them. */
export const galleryItems = salonImages.gallery
