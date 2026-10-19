import { SiteFooter } from "@/components/site/site-footer"
import { SiteGallery } from "@/components/site/site-gallery"
import { SiteHeader } from "@/components/site/site-header"
import { SiteHero } from "@/components/site/site-hero"
import { SiteAbout } from "@/components/site/site-about"
import { SiteContact } from "@/components/site/site-contact"
import { SiteServices } from "@/components/site/site-services"
import { SiteTestimonials } from "@/components/site/site-testimonials"
import { SiteWhyUs } from "@/components/site/site-why-us"

/**
 * Section-by-section rebuild: navbar, hero, services, about, why us,
 * gallery, testimonials, contact. Testimonials only render once real client
 * quotes are added to lib/salon-testimonials.ts. Backgrounds
 * alternate between brand-bg and brand-surface so each section reads as its
 * own band without a divider.
 */
export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-brand-bg text-brand-text selection:bg-brand-accent selection:text-brand-on-accent">
      <SiteHeader active="Home" logoHref="/login" />

      <SiteHero />
      <SiteServices />
      <SiteAbout />
      <SiteWhyUs />
      <SiteGallery />
      <SiteTestimonials />
      <SiteContact />

      <SiteFooter />
    </div>
  )
}
