"use client"

import NextImage from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Glint, laFePalette, laFeScript, Lotus } from "@/components/site/la-fe-brand"
import { fadeUp } from "@/lib/motion"
import type { ComboGroup, MakeupSpecialTable } from "@/lib/salon-combos"
import { galleryItems } from "@/lib/salon-services"

/* The collage: six diamond tiles on a lattice, centres in % of a square box.
   Side 26% → diagonal ≈ 36.8%, and neighbours sit (26 + 3) / √2 ≈ 20.5%
   apart on each axis, so every edge has an even ~3% gap. */
const TILE_SIDE = 26
const TILES = [
  { x: 29.5, y: 20 },
  { x: 70.5, y: 20 },
  { x: 50, y: 40.5 },
  { x: 29.5, y: 61 },
  { x: 70.5, y: 61 },
  { x: 50, y: 81.5 },
]

/* Small gold and rose diamonds in the lattice's empty corners — the
   poster's scattered frames, as ornament. */
const ORNAMENTS = [
  { x: 50, y: 8, size: 7, className: "border border-[var(--lf-gold)]/70" },
  { x: 88, y: 40.5, size: 9, className: "border border-[var(--lf-gold)]/60" },
  { x: 11, y: 40.5, size: 6, className: "bg-[var(--lf-rose)]/35" },
  { x: 88, y: 84, size: 5, className: "bg-[var(--lf-gold)]/40" },
  { x: 12, y: 86, size: 8, className: "border border-[var(--lf-rose)]/60" },
]

type Photo = { src: string; alt: string }

/* Straight to the booking wizard with this combo already chosen
   (app/book/page.tsx reads `service`). */
const bookHref = (id?: string) =>
  id ? `/book?service=${encodeURIComponent(id)}#booking` : "/book#booking"

const BOOK_BUTTON = "inline-flex shrink-0 items-center rounded-full bg-[var(--lf-gold)] px-5 py-2 font-ui text-xs font-semibold text-[var(--lf-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-10px_color-mix(in_srgb,var(--lf-gold)_90%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lf-gold-ink)] active:translate-y-0"

/** Combo photos first, then the Makeup Special's, then La-fe's own gallery,
    so the collage is always full even before every combo has a photo.
    Never the same photo twice. */
function collagePhotos(groups: ComboGroup[], makeup: MakeupSpecialTable, count: number): Photo[] {
  const seen = new Set<string>()
  const photos: Photo[] = []
  const pool = [
    ...groups.flatMap((g) => g.combos.map((c) => ({ src: c.image, alt: c.alt }))),
    { src: makeup.image, alt: makeup.alt },
    ...galleryItems,
  ]
  for (const p of pool) {
    if (seen.has(p.src)) continue
    seen.add(p.src)
    photos.push({ src: p.src, alt: p.alt })
    if (photos.length === count) break
  }
  return photos
}

/** A poster block's frame and heading: white card, rose pill, gold hairline. */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col rounded-[24px] border border-[var(--lf-gold)]/30 bg-[var(--lf-white)] p-5 shadow-[0_24px_60px_-40px_color-mix(in_srgb,var(--lf-rose)_85%,transparent)] sm:p-6">
      <h3>
        <span className="inline-flex rounded-r-full rounded-l-md bg-[var(--lf-rose)] px-4 py-1 font-display text-base font-medium text-[var(--lf-white)] sm:text-lg">
          {title}
        </span>
      </h3>
      <span aria-hidden className="mt-4 block h-px w-12 bg-[var(--lf-gold)]" />
      {children}
    </div>
  )
}

/**
 * "Combo Specials", laid out like a salon poster: a feature photo and the
 * title beside a cascade of diamond-framed photos, then one block per La-fe
 * poster — Combo Special, Nails & Lashes Combo Special and Makeup Special —
 * each combo with its own "Book Now" into the booking wizard. In the home
 * page's own ivory, gold and rose — a cream panel on the white ground that
 * "Our Premium Services" curves into, directly above.
 *
 * The combos come in as props — app/page.tsx reads them from the database
 * and groups them by poster (lib/salon-combos.ts), so the blocks show
 * whatever the owner keeps on /dashboard/combos. The Makeup Special table
 * reads the Makeup services' prices. This stays a client component for the
 * reveals only.
 */
export function SiteCombos({
  groups,
  makeupSpecial,
}: {
  groups: ComboGroup[]
  makeupSpecial: MakeupSpecialTable
}) {
  const reduce = !!useReducedMotion()
  const [feature, ...tiles] = collagePhotos(groups, makeupSpecial, TILES.length + 1)

  const reveal = (delay: number, distance = 20) => ({
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.2 },
    variants: fadeUp(reduce, delay, distance),
  })

  return (
    <section
      id="combos"
      style={laFePalette}
      className="relative isolate scroll-mt-24 overflow-hidden bg-[var(--lf-white)] pt-10 pb-20 text-[var(--lf-ink)] sm:pt-14 sm:pb-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-10 xl:px-16">
        {/* ── The poster ─────────────────────────────────────────────────
            One cream panel, gold-edged, with a rose bloom behind the collage
            and a gold one low left. */}
        <div className="relative isolate overflow-hidden rounded-[36px] border border-[var(--lf-gold)]/30 bg-[var(--lf-cream)] p-5 shadow-[0_30px_80px_-50px_color-mix(in_srgb,var(--lf-rose)_90%,transparent)] sm:p-10 lg:p-12">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_75%_25%,color-mix(in_srgb,var(--lf-rose)_18%,transparent),transparent_70%),radial-gradient(40%_40%_at_0%_100%,color-mix(in_srgb,var(--lf-gold)_14%,transparent),transparent_70%)]"
          />

          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* ── Title ─────────────────────────────────────────────────
                Feature photo in a circle, as on the poster's top corner —
                desktop only, where the column has the height for it. */}
            <motion.div {...reveal(0)} className="text-center lg:col-span-5 lg:text-left">
              {feature && (
                <div className="relative mx-auto mb-8 hidden size-56 lg:mx-0 lg:block xl:size-64">
                  <div aria-hidden className="absolute -inset-2 rounded-full border border-[var(--lf-gold)]/50" />
                  <div className="relative size-full overflow-hidden rounded-full border-4 border-[var(--lf-white)] bg-[var(--lf-ivory)] shadow-[0_24px_50px_-28px_color-mix(in_srgb,var(--lf-rose)_90%,transparent)]">
                    <NextImage src={feature.src} alt={feature.alt} fill sizes="256px" className="object-cover" />
                  </div>
                  <span className="text-[var(--lf-gold)]">
                    <Glint className="top-2 right-4 size-4" />
                    <Glint className="bottom-6 -left-3 size-2.5" />
                  </span>
                </div>
              )}

              <h2 className="font-display leading-none">
                <span
                  className={`${laFeScript.className} block text-[clamp(3.6rem,8vw,5.5rem)] leading-[0.9] font-normal text-[var(--lf-rose-ink)]`}
                >
                  Combo
                </span>
                <span className="mt-1 block text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium tracking-[0.18em] uppercase">
                  Specials
                </span>
              </h2>

              <div aria-hidden className="mt-4 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-12 bg-[var(--lf-gold)]/60 sm:w-16" />
                <Lotus />
                <span className="h-px w-12 bg-[var(--lf-gold)]/60 sm:w-16" />
              </div>

              <p className="mx-auto mt-4 max-w-sm font-ui text-sm leading-[1.8] text-[var(--lf-muted)] lg:mx-0">
                Your favourite treatments, bundled into one appointment at one
                price. Look good, feel good, be you.
              </p>
            </motion.div>

            {/* ── Collage ───────────────────────────────────────────────
                Each tile is a rounded square turned 45°; the photo inside is
                turned back and scaled by √2 so it stays upright and still
                fills the diamond's corners. */}
            <motion.div
              {...reveal(0.1, 28)}
              className="relative mx-auto aspect-square w-full max-w-[560px] lg:col-span-7 lg:max-w-none"
            >
              {ORNAMENTS.map((o, i) => (
                <span
                  key={i}
                  aria-hidden
                  style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.size}%` }}
                  className={`absolute aspect-square -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[22%] ${o.className}`}
                />
              ))}

              {tiles.map((photo, i) => {
                const t = TILES[i]
                return (
                  <div
                    key={photo.src}
                    style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${TILE_SIDE}%` }}
                    className="group absolute aspect-square -translate-x-1/2 -translate-y-1/2 rotate-45 overflow-hidden rounded-[22%] border-[3px] border-[var(--lf-white)] bg-[var(--lf-ivory)] shadow-[0_18px_40px_-22px_color-mix(in_srgb,var(--lf-ink)_55%,transparent)] outline outline-1 outline-offset-2 outline-[var(--lf-gold)]/50"
                  >
                    <div className="absolute inset-0 -rotate-45 scale-[1.42]">
                      <NextImage
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 22vw, 40vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* ── One block per poster ──────────────────────────────────────
              The combo posters first (from the database), the Makeup
              Special last. Three across on desktop; on tablets the table
              takes a full row of its own when it would otherwise sit alone
              in half of one. */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {groups.map((group, i) => (
              <motion.div key={group.title} {...reveal(i * 0.1, 24)} className="flex">
                <Block title={group.title}>
                  <ul className="mt-2 flex flex-col">
                    {group.combos.map((combo) => (
                      <li
                        key={combo.name}
                        className="border-b border-[var(--lf-gold)]/20 py-3.5 last:border-b-0 last:pb-0"
                      >
                        <span className="flex items-baseline gap-2.5 font-ui text-sm font-semibold">
                          <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-[var(--lf-rose)]" />
                          {combo.name}
                        </span>

                        {/* The checklist when the combo has one; otherwise
                            its description, so a combo added without items
                            still says what it is. */}
                        {combo.includes.length ? (
                          <ul className="mt-2.5 flex flex-col gap-1.5 pl-5">
                            {combo.includes.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 font-ui text-xs leading-snug text-[var(--lf-muted)] sm:text-[13px]"
                              >
                                <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--lf-gold-ink)]" strokeWidth={3} aria-hidden />
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1.5 pl-5 font-ui text-xs leading-[1.7] text-[var(--lf-muted)] sm:text-[13px]">
                            {combo.description}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-3 pl-5">
                          <span className="font-ui text-sm font-bold whitespace-nowrap text-[var(--lf-gold-ink)]">
                            {combo.price}
                          </span>
                          <Link href={bookHref(combo.id)} aria-label={`Book ${combo.name}`} className={BOOK_BUTTON}>
                            Book Now
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Block>
              </motion.div>
            ))}

            <motion.div
              {...reveal(groups.length * 0.1, 24)}
              className={`flex ${groups.length % 2 === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <Block title={makeupSpecial.title}>
                <p className="mt-3 font-ui text-xs text-[var(--lf-muted)] sm:text-[13px]">
                  Professional makeup for every occasion.
                </p>
                <div className="-mx-1 mt-3 overflow-x-auto">
                  <table className="w-full min-w-[300px] border-collapse font-ui text-xs sm:text-[13px]">
                    <caption className="sr-only">Makeup Special prices</caption>
                    <thead>
                      <tr>
                        <th scope="col" className="sr-only">
                          Look
                        </th>
                        {makeupSpecial.columns.map((col) => (
                          <th
                            key={col}
                            scope="col"
                            className="px-1 pb-2 text-right align-bottom text-[10px] font-semibold tracking-[0.08em] text-[var(--lf-gold-ink)] uppercase sm:text-[11px]"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {makeupSpecial.rows.map((row) => (
                        <tr key={row.label} className="border-t border-[var(--lf-gold)]/20">
                          <th scope="row" className="px-1 py-2.5 text-left font-semibold whitespace-nowrap">
                            {row.label}
                          </th>
                          {row.prices.map((price, i) => (
                            <td key={i} className="px-1 py-2.5 text-right whitespace-nowrap text-[var(--lf-muted)]">
                              {price}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <span className="font-ui text-xs text-[var(--lf-muted)]">House calls available.</span>
                  {/* The twelve packages are separate Makeup services, so this
                      opens the wizard on the Makeup tab to pick one. */}
                  <Link href="/book?category=Makeup#booking" aria-label={`Book the ${makeupSpecial.title}`} className={BOOK_BUTTON}>
                    Book Now
                  </Link>
                </div>
              </Block>
            </motion.div>
          </div>

          <p className="mt-10 text-center font-ui text-xs text-[var(--lf-muted)]">
            Secure your spot with a 50% deposit.
          </p>
        </div>
      </div>
    </section>
  )
}
