import { SiteFooter } from "@/components/site/site-footer"
import { SiteGallery } from "@/components/site/site-gallery"
import { SiteHeader } from "@/components/site/site-header"
import { SiteHero } from "@/components/site/site-hero"
import { SiteAbout } from "@/components/site/site-about"
import { SiteCombos } from "@/components/site/site-combos"
import { SiteContact } from "@/components/site/site-contact"
import { SiteServices } from "@/components/site/site-services"
import { SiteTestimonials } from "@/components/site/site-testimonials"
import { SiteWhyUs } from "@/components/site/site-why-us"
import { getHomeCombos, groupCombos, makeupSpecial } from "@/lib/salon-combos"

/* The combos band reads the services cache, which every service/combo save
   in the dashboard revalidates by tag. This bounds staleness if that tag is
   ever missed (and lets a database-outage fallback heal itself). */
export const revalidate = 300

/**
 * Section-by-section rebuild: navbar, hero, services, combos, about, why us,
 * gallery, testimonials, contact. Combos are owner-managed on
 * /dashboard/combos and shown one block per poster; the Makeup Special
 * block reads the Makeup services' prices. Testimonials only render once real client
 * quotes are added to lib/salon-testimonials.ts. Backgrounds
 * alternate between brand-bg and brand-surface so each section reads as its
 * own band without a divider.
 */
export default async function Home() {
  const combos = await getHomeCombos()

  return (
    <div className="flex flex-1 flex-col bg-brand-bg text-brand-text selection:bg-brand-accent selection:text-brand-on-accent">
      <SiteHeader active="Home" logoHref="/login" />

      <SiteHero />
      <SiteServices />
      <SiteCombos groups={groupCombos(combos)} makeupSpecial={makeupSpecial} />
      <SiteAbout />
      <SiteWhyUs />
      <SiteGallery />
      <SiteTestimonials />
      <SiteContact />

      <SiteFooter />
    </div>
  )
}
