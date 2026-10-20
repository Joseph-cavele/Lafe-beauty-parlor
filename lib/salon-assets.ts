/* ══════════════════════════════════════════════════════════════════════
   IMAGE SLOTS — every photograph and the logo the site shows, in one place.

   ONLY La-fe Beauty Parlor's own photos are used (the owner's decision,
   2026-10-20) — no downloaded or stock images. Sources:
     /public/Lafe-images/  the salon's photos of its work (WhatsApp, 2026-10-19)
     /public/new-images/   the real salon, clients, hero and booking photos
     /public/assets/       now only the Gel toes photos, kept at the owner's
                           request

   A service with no suitable photo of its own shows the La-fe logo rather
   than a stock picture. To fill a slot: add the salon's photo to one of the
   folders above, change that one path below, and write an `alt` that says
   what the photo shows.
   ══════════════════════════════════════════════════════════════════════ */

/** The salon's own work photo in /public/Lafe-images. */
const lafe = (time: string) => encodeURI(`/Lafe-images/WhatsApp Image 2026-10-19 at ${time}.jpeg`)
/** The salon's own photos in /public/new-images (2026-10-20). */
const fresh = (file: string) => encodeURI(`/new-images/${file}`)
/** /public/assets — only the Gel toes photos remain there. */
const asset = (file: string) => encodeURI(`/assets/${file}`)

export type ImageSlot = { src: string; alt: string }

export const salonImages = {
  /** Square logo mark — header, login card, dashboard sidebar. */
  logo: { src: "/La-fe-logo.jpeg", alt: "La-fe Beauty Parlor logo" },

  /** Kept for lib/stock-photos.ts — the salon's own hero photo. */
  hero: {
    src: fresh("mobile-hero-image.jpeg"),
    alt: "Client with pink and purple glam makeup, full lashes and a matte pink lip, posing beside a ring light",
  },

  /** The hero collage's other two frames (the middle one is heroMobile).
      Interior 4:3, nails 4:5; tablets and up. Neither is in the gallery. */
  heroCollage: {
    interior: {
      src: fresh("WhatsApp Image 2026-10-20 at 09.59.35 (1).jpeg"),
      alt: "Six smiling La-fe clients dressed up for an event, in front of the La-fe Beauty Parlor banner",
    },
    nails: {
      src: fresh("WhatsApp Image 2026-10-20 at 10.10.01 (2).jpeg"),
      alt: "La-fe technician painting a client's toenails while a manicure goes on at the desk behind",
    },
  },

  /** About section main frame ("Take a look inside"), 4:3 crop of a 3:4
      photo — the real La-fe makeup station. Also the booking summary's
      fallback image. */
  salonInterior: {
    src: fresh("About-lafe-beauty-parlor.jpeg"),
    alt: "The La-fe makeup station: client chair in front of the La-fe Beauty Parlor banner, with a stocked makeup shelf and a ring light",
  },

  /** About section inset and login backdrop. Square crop — the real salon. */
  salonStation: {
    src: fresh("WhatsApp Image 2026-10-20 at 10.10.01.jpeg"),
    alt: "Inside La-fe Beauty Parlor: the nail desk by the window, a ring light and a black rug on a tiled floor",
  },

  /** The hero's glam portrait — alone on phones, the middle of the
      collage on larger screens. Kept out of the gallery. */
  heroMobile: {
    src: fresh("mobile-hero-image.jpeg"),
    alt: "Client with pink and purple glam makeup, full lashes and a matte pink lip, posing beside a ring light",
  },

  /** One photo per service category — the /services banner slides. Each
      is a photo no service card on that page uses. */
  category: {
    Makeup: {
      src: lafe("08.35.50 (2)"),
      alt: "Smiling client with gold eyes, a berry lip and red French-tip almond nails",
    },
    Lashes: {
      src: fresh("mobile-hero-image.jpeg"),
      alt: "Client with pink and purple glam makeup and full, fluffy lashes",
    },
    Nails: {
      src: lafe("08.35.48"),
      alt: "Long square nails in glossy red, some with nude French tips and polka-dot accents",
    },
    Wigs: {
      src: lafe("08.35.52 (2)"),
      alt: "Stylist melting the lace of a sleek bob wig install with a blow-dryer",
    },
  } as Record<string, ImageSlot>,

  /** Per-service photos — the salon's own work — keyed by the exact service
      name in lib/salon-services.ts. No two services share a photo. A
      service left out here shows the La-fe logo (Soft Glam for 2, Full
      Glam for 4 and Hybrid lashes: no suitable photo of the salon's own). */
  service: {
    // ── Makeup ──────────────────────────────────────────────────────────
    "Natural Beat": {
      src: lafe("08.35.49 (1)"),
      alt: "Client with a soft natural beat, full lashes and a pink nude lip, in front of the La-fe Beauty Parlor sign",
    },
    "Soft Glam": {
      src: lafe("08.35.49"),
      alt: "Client in a curly wig with soft glam makeup, full lashes and a berry lip, in front of the La-fe sign",
    },
    "Full Glam": {
      src: lafe("08.35.50"),
      alt: "Full glam with smoky brown eyes, full lashes and a matte nude lip, with a yellow head wrap",
    },
    "Natural Beat for 2": {
      src: lafe("08.35.50 (1)"),
      alt: "Bold blue eyeshadow with winged liner and a pink nude lip, worn with long twists",
    },
    "Full Glam for 2": {
      src: lafe("08.35.51"),
      alt: "Smiling bride with gold eyes, a red lip and a pearl hair crown, in front of the La-fe banner",
    },
    "Natural Beat for 4": {
      src: fresh("WhatsApp Image 2026-10-20 at 09.59.35 (1).jpeg"),
      alt: "A group of six La-fe clients with their makeup done, in front of the La-fe Beauty Parlor banner",
    },
    "Soft Glam for 4": {
      src: fresh("WhatsApp Image 2026-10-20 at 09.59.34 (2).jpeg"),
      alt: "Three La-fe clients outdoors in black dresses, with soft glam makeup",
    },
    "Natural + Makeup": {
      src: lafe("08.35.51 (2)"),
      alt: "Wig install with a smooth, melted lace hairline and lashes applied",
    },
    "Soft Glam + Makeup": {
      src: lafe("08.35.53"),
      alt: "Sleek straight bob wig being installed, with a natural hairline",
    },
    "Full Glam + Makeup": {
      src: lafe("08.35.51 (1)"),
      alt: "Stylist laying the lace of a wig install, with lashes already applied",
    },

    // ── Lashes ──────────────────────────────────────────────────────────
    "Classic lashes": {
      src: lafe("08.35.53 (2)"),
      alt: "La-fe lash technician applying extensions to a client under a ring light",
    },
    "Volume lashes": {
      src: lafe("08.35.53 (1)"),
      alt: "La-fe lash technician preparing extensions for a client under a ring light",
    },

    // ── Nails ───────────────────────────────────────────────────────────
    "Gel overlay": {
      src: lafe("08.35.46"),
      alt: "Short almond nails in sheer pink gel with black polka-dot French tips and white 3D flowers",
    },
    "Tips & Gel": {
      src: lafe("08.35.47"),
      alt: "Short almond nails in sheer pink with fine gold wire outlines, held over the La-fe Beauty Parlor sign",
    },
    "Polygel normal tips": {
      src: lafe("08.35.48 (1)"),
      alt: "Long coffin nails in hot pink and nude with polka dots and white snowflake art",
    },
    "Polygel XXL": {
      src: lafe("08.35.47 (2)"),
      alt: "Extra-long square nails in glossy black and black-and-white marble",
    },
    /* Kept at the owner's request. */
    "Gel toes": {
      src: asset("Gel toes.jpg"),
      alt: "Toes in mauve gel with white French tips and a diamond toe ring",
    },

    // ── Wigs ────────────────────────────────────────────────────────────
    "Wig installation": {
      src: lafe("08.35.52 (1)"),
      alt: "Finished curly lace wig install with a side part and a natural-looking hairline",
    },
  } as Record<string, ImageSlot>,

  /** The /book page hero and the "Book your visit" slide on /services —
      La-fe clients in their finished makeup. */
  bookingBanner: {
    src: fresh("booking-image.jpeg"),
    alt: "Five La-fe clients in black, each wearing a different colourful glam makeup look",
  },

  /** "Recent work" gallery (home page) — the salon's own photos. Nothing
      here repeats another photo on the home page: the Our Premium Services
      cards, the hero collage and the About photos are all kept out. */
  gallery: [
    { src: lafe("08.35.47"), label: "Gold Wire Nail Art", alt: "Short almond nails in sheer pink with fine gold wire outlines, held over the La-fe Beauty Parlor sign" },
    { src: lafe("08.35.46 (1)"), label: "Minimal Nail Art", alt: "Short natural nails with tiny minimalist line art and a blue accent dot" },
    { src: lafe("08.35.48 (1)"), label: "Pink Snowflake Nails", alt: "Long coffin nails in hot pink and nude with polka dots and white snowflake art" },
    { src: lafe("08.35.50"), label: "Smoky Glam", alt: "Smoky brown eyes, full lashes and a matte nude lip, with a yellow head wrap" },
    { src: lafe("08.35.51 (1)"), label: "Lace Wig Install", alt: "Stylist laying the lace of a wig install, with lashes already applied" },
    { src: lafe("08.35.47 (3)"), label: "Black & White Marble", alt: "Long square nails in glossy black and black-and-white marble, held over the La-fe sign" },
    { src: lafe("08.35.50 (1)"), label: "Blue Glam", alt: "Bold blue eyeshadow with winged liner and a pink nude lip, worn with long twists" },
    { src: lafe("08.35.48"), label: "Red Statement Nails", alt: "Long square nails in glossy red, some with nude French tips and polka-dot accents" },
    { src: lafe("08.35.51"), label: "Bridal Glam", alt: "Smiling bride with gold eyes, a red lip and a pearl hair crown, in front of the La-fe banner" },
    { src: lafe("08.35.52"), label: "Wig Install in Progress", alt: "Stylist melting the lace of a curly wig install with a blow-dryer" },
    { src: lafe("08.35.48 (2)"), label: "Neon Swirls", alt: "Long almond nails in coral and nude with neon orange and white swirls, over the La-fe sign" },
    { src: lafe("08.35.53 (1)"), label: "Lash Appointment", alt: "Lash technician in uniform preparing extensions for a client under a ring light" },
    { src: fresh("WhatsApp Image 2026-10-20 at 09.59.34 (2).jpeg"), label: "Glam Day Out", alt: "Three La-fe clients outdoors in black dresses, with soft glam makeup" },
    { src: lafe("08.35.47 (1)"), label: "Teal & Gold Foil", alt: "Long coffin nails in glossy teal with a gold-foil accent nail" },
    { src: lafe("08.35.51 (2)"), label: "Melted Lace Hairline", alt: "Wig install with a smooth, melted lace hairline" },
    { src: lafe("08.35.50 (2)"), label: "Glam & Red French", alt: "Smiling client with gold eyes, a berry lip and red French-tip almond nails" },
    { src: lafe("08.35.45"), label: "Polka-Dot French", alt: "Almond nails with polka-dot French tips and white 3D flowers, over the La-fe sign" },
    { src: lafe("08.35.53"), label: "Sleek Bob Install", alt: "Sleek straight bob wig being installed, with a natural hairline" },
  ],
}

/** A service's own photo if it has one, otherwise the La-fe logo — never
    a stock picture, and never another service's photo. */
export const serviceImage = (name: string): ImageSlot =>
  salonImages.service[name] ?? salonImages.logo
