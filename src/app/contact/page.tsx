import type { Metadata } from "next";
import { STAGGER } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/sections/Cta";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Reach out to us",
  description: "Got any questions? Reach out and we'll reply in 25 hours.",
};

export default function ContactPage() {
  return (
    <>
      <section className="rounded-b-section bg-gradient-to-b from-surface to-blush pb-20 pt-navbar-lg">
        <div className="shell flex flex-col items-center gap-4">
          <Reveal>
            <h1 className="text-display-1 text-center font-display text-ink">
              Reach out to us
            </h1>
          </Reveal>
          <Reveal delay={STAGGER}>
            <p className="max-w-blurb text-center text-body-lg text-muted">
              Got any questions? Reach out to us and we&apos;ll reply in 25
              hours.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell">
          <div className="mx-auto max-w-form">
            <ContactForm />
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
