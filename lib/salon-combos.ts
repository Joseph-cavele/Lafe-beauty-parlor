import { COMBO_CATEGORY } from "@/features/services/schema"
import { getServices } from "@/features/services/server/get-services"
import { formatCurrency, formatPrice } from "./currency"
import { serviceImage } from "./salon-assets"
import { salonServices } from "./salon-services"

/* The home page's "Combo Specials" band. Combos are read from the database,
   so one the owner adds, edits or deletes on /dashboard/combos is what the
   home page shows — not the copy in lib/salon-services.ts, which only seeds
   them. That copy is the fallback when the database can't be reached, so
   the band never renders empty because of an outage. */

export type ComboCard = {
  /** The Service id, for its "Book" link. Absent only in the fallback. */
  id?: string
  name: string
  description: string
  /** Display string: "R 1 500", "From R 350", or "Price on request". */
  price: string
  includes: string[]
  image: string
  alt: string
}

/** Cheapest first, unpriced last — the order the posters list them in. */
const byPrice = (a: { price?: number | null }, b: { price?: number | null }) =>
  (a.price || Infinity) - (b.price || Infinity)

export async function getHomeCombos(): Promise<ComboCard[]> {
  try {
    const services = await getServices()
    return services
      .filter((s) => s.category === COMBO_CATEGORY)
      .sort(byPrice)
      .map((s) => {
        // An uploaded photo wins; otherwise the combo's own La-fe photo, or
        // the category's — never the logo.
        const fallback = serviceImage(s.name, s.category)
        return {
          id: s.id,
          name: s.name,
          description: s.description,
          price: formatPrice(s.price),
          includes: s.includes ?? [],
          image: s.image || fallback.src,
          alt: s.image ? s.name : fallback.alt,
        }
      })
  } catch (error) {
    console.error("Home combos: falling back to lib/salon-services.ts", error)
    return salonServices
      .filter((s) => s.category === COMBO_CATEGORY)
      .sort(byPrice)
      .map((s) => {
        const img = serviceImage(s.name, s.category)
        return {
          name: s.name,
          description: s.description,
          price: formatPrice(s.price),
          includes: s.includes ?? [],
          image: img.src,
          alt: img.alt,
        }
      })
  }
}

/* ── One block per poster ─────────────────────────────────────────────
   The home page groups combos the way the salon's posters do. Combos live
   in the database with no poster attached, so the group is read from the
   name: a combo the owner adds lands in the poster it obviously belongs to,
   and anything else in "More combos", which shows only when it has items. */

export type ComboGroup = { title: string; combos: ComboCard[] }

const POSTERS = [
  { title: "Combo Special", match: /wig/i },
  { title: "Nails & Lashes Combo Special", match: /nail|gel|tip|toe|lash/i },
]

export function groupCombos(combos: ComboCard[]): ComboGroup[] {
  const groups: ComboGroup[] = [...POSTERS, { title: "More combos", match: /.*/ }].map((g) => ({
    title: g.title,
    combos: [],
  }))
  for (const combo of combos) {
    const i = POSTERS.findIndex((p) => p.match.test(combo.name))
    groups[i === -1 ? POSTERS.length : i].combos.push(combo)
  }
  return groups.filter((g) => g.combos.length)
}

/* The Makeup Special poster's table: one row per look, one column per
   package. Its twelve packages are already bookable Makeup services (and
   priced in the hero's table too), so this reads their prices rather than
   duplicating them as combos. */
const LOOKS = [
  { name: "Natural Beat", label: "Natural", install: "Natural + Makeup" },
  { name: "Soft Glam", label: "Soft Glam", install: "Soft Glam + Makeup" },
  { name: "Full Glam", label: "Full Glam", install: "Full Glam + Makeup" },
]

const priceOf = (name: string) => {
  const price = salonServices.find((s) => s.name === name)?.price
  return price ? formatCurrency(price) : "—"
}

export type MakeupSpecialTable = {
  title: string
  columns: string[]
  rows: { label: string; prices: string[] }[]
  image: string
  alt: string
}

const makeupImage = serviceImage("Full Glam", "Makeup")

export const makeupSpecial: MakeupSpecialTable = {
  title: "Makeup Special",
  columns: ["For 1", "For 2", "For 4", "Install + makeup"],
  rows: LOOKS.map((look) => ({
    label: look.label,
    prices: [
      priceOf(look.name),
      priceOf(`${look.name} for 2`),
      priceOf(`${look.name} for 4`),
      priceOf(look.install),
    ],
  })),
  image: makeupImage.src,
  alt: makeupImage.alt,
}
