import type { Metadata } from "next";
import { STAGGER, stagger } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/sections/Cta";
import { plans, pricingIntro } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: pricingIntro.body,
};

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-ink"
    >
      <circle cx="12" cy="12" r="11" className="fill-blush" />
      <path
        d="M7.5 12.5l3 3 6-6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="rounded-b-section bg-gradient-to-b from-surface to-blush pb-20 pt-navbar-lg">
        <div className="shell flex flex-col items-center gap-4">
          <Reveal>
            <h1 className="text-display-1 text-center font-display text-ink">
              {pricingIntro.title}
            </h1>
          </Reveal>
          <Reveal delay={STAGGER}>
            <p className="max-w-blurb text-center text-body-lg text-muted">
              {pricingIntro.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell grid grid-cols-cards gap-6">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={stagger(i)}>
              <div
                className={`group relative flex h-full flex-col gap-8 overflow-hidden rounded-card border p-8 ${
                  plan.featured
                    ? "border-accent/40 bg-surface shadow-[0_24px_60px_-30px_rgba(254,0,0,0.35)]"
                    : "border-soft bg-surface"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="bg-card-glow pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80"
                />
                <div className="relative flex flex-col gap-3">
                  <h5 className="text-eyebrow text-muted">{plan.name}</h5>
                  <h3 className="text-display-3 font-display text-ink">
                    {plan.price}
                  </h3>
                </div>

                <ul className="relative flex flex-1 flex-col gap-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check />
                      <span className="text-body-lg text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={plan.cta.href}
                  variant={plan.featured ? "filled" : "outline"}
                  className="relative w-full"
                >
                  {plan.cta.label}
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Cta />
    </>
  );
}
