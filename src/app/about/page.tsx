import type { Metadata } from "next";
import { STAGGER } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/sections/Cta";

export const metadata: Metadata = {
  title: "About us",
  description: "Learn more about PujoGo and the team behind it.",
};

export default function AboutPage() {
  return (
    <>
      <section className="rounded-b-section bg-gradient-to-b from-surface to-blush pb-20 pt-navbar-lg">
        <div className="shell flex flex-col items-center gap-4">
          <Reveal>
            <h1 className="text-display-1 text-center font-display text-ink">
              About PujoGo
            </h1>
          </Reveal>
          <Reveal delay={STAGGER}>
            <p className="max-w-blurb text-center text-body-lg text-muted">
              PujoGo helps you discover, plan, and celebrate Durga Puja.
            </p>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
