import { Preloader } from "@/components/layout/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Testimonials } from "@/components/sections/Testimonials";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";

/**
 * The landing page is just an ordered list of self-contained sections —
 * reordering the page means reordering these lines.
 *
 * `Preloader` lives here rather than in the root layout, and that placement is
 * the whole of the "homepage only" rule: the sub-routes never mount it, so
 * they never wait on its curtain. It renders first so its overlay is in the
 * markup ahead of the hero it covers.
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <Features />
      <Testimonials />
      <HowItWorks />
      <Faq />
      <Cta />
    </>
  );
}
