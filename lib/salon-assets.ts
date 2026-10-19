/* ══════════════════════════════════════════════════════════════════════
   IMAGE SLOTS — every photograph and the logo the site shows, in one place.

   Sources:
     /public/assets/   the service photos — one per service, named after it
                       where possible. Services read their photo from here,
                       never from the database (no Service document stores
                       an image; a photo uploaded in the dashboard would
                       still take priority on /book).
     /public/Lafe-images/  the salon's own photos of its work (WhatsApp,
                       2026-10-19) — the "Recent Work" gallery.
     /public/images/   makeup, lash and nail photos the site owner added and
     and /public/      confirmed (2026-10-18) as La-fe's own work, so they
                       may appear in "Recent Work". The hero-*.jpg files and
                       "Interior deco of salon.jpg" are mood images, not the
                       salon's work — keep them out of "Recent Work".

   To fill a slot: put the file in /public/images/, change that one path
   below, and update its `alt` so it describes what the photo shows.
   ══════════════════════════════════════════════════════════════════════ */

/** The salon's own work photo in /public/Lafe-images — see the note above. */
const lafe = (time: string) => encodeURI(`/Lafe-images/WhatsApp Image 2026-10-19 at ${time}.jpeg`)
/** Service photo in /public/assets — see the note above. */
const asset = (file: string) => encodeURI(`/assets/${file}`)
/** Owner-supplied image in /public/images — see the note above. */
const stock = (file: string) => encodeURI(`/images/${file}`)
/** Owner-supplied image at the root of /public — see the note above. */
const pub = (file: string) => encodeURI(`/${file}`)

export type ImageSlot = { src: string; alt: string }

export const salonImages = {
  /** Square logo mark — header, login card, dashboard sidebar. */
  logo: { src: "/La-fe-logo.jpeg", alt: "La-fe Beauty Parlor logo" },

  /** Full-bleed hero backdrop on the home page and /book. */
  hero: {
    src: pub("hero-lashes.jpg"),
    alt: "Client relaxing with her eyes closed during an eyelash extension",
  },

  /** About section main frame ("Take a look inside"). 4:3 crop of a 4:5
      image. Interior decor added by the site owner (2026-10-18) — swap for a
      photo of the La-fe salon itself when there is one. */
  salonInterior: {
    src: stock("Interior deco of salon.jpg"),
    alt: "Bright salon interior with curved cream walls, backlit mirrors, petal-shaped pendant lamps and grey styling chairs",
  },

  /** About section inset and login backdrop. Square. */
  salonStation: {
    src: pub("hero-interior.jpg"),
    alt: "Softly lit salon reception with an arched product shelf and a cream armchair",
  },

  /** One photo per service category: the /services banner slides and the
      fallback for any service without its own photo below. */
  category: {
    Makeup: {
      src: asset("9aca19b57ad9f49e2a391358da77aca7.jpg"),
      alt: "Bridal soft glam with bronze smoky eyes, full lashes and glossy nude lips",
    },
    Lashes: {
      src: asset("Volume lashes2.jpg"),
      alt: "Close-up of a client wearing a dense, dark volume lash set",
    },
    Nails: {
      src: asset("Nail.jpg"),
      alt: "Almond nails with red French tips and red flower art",
    },
    /** The salon's own photo — a bob install in progress (not in the gallery). */
    Wigs: {
      src: lafe("08.35.52 (2)"),
      alt: "Stylist melting the lace of a sleek bob wig install with a blow-dryer",
    },
  } as Record<string, ImageSlot>,

  /** Per-service photos from /public/assets, keyed by the exact service
      name in lib/salon-services.ts. */
  service: {
    // ── Makeup ──────────────────────────────────────────────────────────
    "Natural Beat": {
      // The salon's own work (Our Premium Services card).
      src: lafe("08.35.49 (1)"),
      alt: "Client with a soft natural beat, full lashes and a pink nude lip, in front of the La-fe Beauty Parlor sign",
    },
    "Soft Glam": {
      // The salon's own work (Our Premium Services card).
      src: lafe("08.35.49"),
      alt: "Client in a curly wig with soft glam makeup, full lashes and a berry lip, in front of the La-fe sign",
    },
    "Full Glam": {
      src: asset("Full Glam.jpg"),
      alt: "Full glam with shimmery eyes, dramatic lashes and a glossy pink lip",
    },
    "Natural Beat for 2": {
      src: asset("Natural Beat for 2.jpg"),
      alt: "Natural beat with bronze eyes, lashes and a glossy nude lip",
    },
    "Soft Glam for 2": {
      src: asset("596c1546d75abd6d1ca672f0ec33284c.jpg"),
      alt: "Soft glam with pink eyeshadow, winged liner, full lashes and a glossy nude lip",
    },
    "Full Glam for 2": {
      src: asset("Full Glam for 2.jpg"),
      alt: "Polished makeup with defined lashes and a glossy rose-nude lip",
    },
    "Natural Beat for 4": {
      src: asset("Natural Beat for 4.jpg"),
      alt: "Fluffy lashes, sculpted brows and a glossy brown lip",
    },
    "Soft Glam for 4": {
      src: asset("Soft Glam for 4.jpg"),
      alt: "Soft glam with pink eyeshadow, sleek waves and a diamond necklace",
    },
    /* "Full Glam for 4.jpg" is the same shot as "Soft Glam for 4.jpg", so
       this card uses a different full glam photo. */
    "Full Glam for 4": {
      src: asset("1c2be9c3583109a282857e664e90ee36.jpg"),
      alt: "Full glam with gold glitter eyes, a bold red lip and a high bun",
    },
    "Natural + Makeup": {
      src: asset("natural-plus-makeup.jpg"),
      alt: "Long wavy install with a pink-eyed natural glam look",
    },
    "Soft Glam + Makeup": {
      src: asset("5fc86b0ed0828183a5160e8ee045cece.jpg"),
      alt: "Side-swept updo with gold soft glam eyes and full lashes",
    },
    "Full Glam + Makeup": {
      src: asset("full-glam-plus-makeup.jpg"),
      alt: "Sleek bob install with bronze glam eyes and a glossy brown lip",
    },

    // ── Lashes ──────────────────────────────────────────────────────────
    "Classic lashes": {
      // The salon's own work (Our Premium Services card).
      src: lafe("08.35.53 (2)"),
      alt: "La-fe lash technician applying extensions to a client under a ring light",
    },
    "Hybrid lashes": {
      src: asset("1d2153e5e02c79106df4a6f6831339a9.jpg"),
      alt: "Wispy, textured lash set on a hazel eye",
    },
    "Volume lashes": {
      src: asset("Volume lashes.jpg"),
      alt: "Full volume lash set shown in a hand mirror during the appointment",
    },

    // ── Nails ───────────────────────────────────────────────────────────
    "Gel overlay": {
      // The salon's own work (Our Premium Services card).
      src: lafe("08.35.46"),
      alt: "Short almond nails in sheer pink gel with black polka-dot French tips and white 3D flowers",
    },
    "Tips & Gel": {
      src: asset("tips-and-gel.jpg"),
      alt: "Short square French tips with small white heart details",
    },
    "Polygel normal tips": {
      src: asset("Polygel normal tips.jpg"),
      alt: "Long coffin nails in red and white with snowflake art and glitter",
    },
    "Polygel XXL": {
      // The salon's own work (Our Premium Services card).
      src: lafe("08.35.47 (2)"),
      alt: "Extra-long square nails in glossy black and black-and-white marble",
    },
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

  /** Salon interior — the /book page hero and the "Book your visit" slide
      on /services. Interior decor, not the La-fe salon: replace with a photo
      of the real salon when there is one. */
  bookingBanner: {
    src: stock("Interior deco of salon.jpg"),
    alt: "Bright salon interior with curved cream walls, backlit mirrors, petal-shaped pendant lamps and grey styling chairs",
  },

  /** "Recent work" gallery — the salon's own photos (public/Lafe-images),
      mixed across nails, makeup, wig installs and lashes. Photos already on
      an Our Premium Services card (08.35.49, 08.35.49 (1), 08.35.46,
      08.35.47 (2), 08.35.53 (2), 08.35.52 (1)) and the Wigs category photo
      (08.35.52 (2)) are kept out so nothing shows twice. Also left out: the
      exact duplicate 08.35.45 (1) and the "Girl of the Moment" poster
      (08.35.49 (2)), whose text would crop badly. */
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
    { src: lafe("08.35.50 (3)"), label: "Pink Glam", alt: "Pink and purple eyeshadow with full lashes and a matte pink lip" },
    { src: lafe("08.35.47 (1)"), label: "Teal & Gold Foil", alt: "Long coffin nails in glossy teal with a gold-foil accent nail" },
    { src: lafe("08.35.51 (2)"), label: "Melted Lace Hairline", alt: "Wig install with a smooth, melted lace hairline" },
    { src: lafe("08.35.50 (2)"), label: "Glam & Red French", alt: "Smiling client with gold eyes, a berry lip and red French-tip almond nails" },
    { src: lafe("08.35.45"), label: "Polka-Dot French", alt: "Almond nails with polka-dot French tips and white 3D flowers, over the La-fe sign" },
    { src: lafe("08.35.53"), label: "Sleek Bob Install", alt: "Sleek straight bob wig being installed, with a natural hairline" },
  ],
}

/** The category photo for a service, falling back to the Makeup slot. */
export const categoryImage = (category: string | undefined): ImageSlot =>
  (category && salonImages.category[category]) || salonImages.category.Makeup

/** A service's own photo if it has one, otherwise its category's. */
export const serviceImage = (name: string, category: string | undefined): ImageSlot =>
  salonImages.service[name] ?? categoryImage(category)
