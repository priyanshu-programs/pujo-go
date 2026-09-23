"use client";
import { DHAK, STAGGER, stagger } from "@/lib/motion";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { faq, faqIntro } from "@/content/faq";

/**
 * Single-open accordion, matching the source. The plus icon rotates to a minus
 * as an item opens; each row is a real <button> inside an <li> so keyboard and
 * screen-reader behaviour comes for free.
 */
export function Faq() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <section
      id="faq"
      className="relative overflow-hidden rounded-section py-20 md:py-32"
    >
      {/* Symmetrical red glows, bled in from both edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(50% 55% at 100% 53%, var(--color-accent) 0%, rgba(254,0,0,0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(50% 55% at 0% 50%, var(--color-accent) 0%, rgba(254,0,0,0) 100%)",
        }}
      />

      <div className="shell relative flex flex-col items-center gap-10">
        <div className="flex max-w-column flex-col items-center gap-4">
          <Reveal>
            <h2 className="text-display-2 text-center font-display text-ink">
              {faqIntro.title}
            </h2>
          </Reveal>
          <Reveal delay={STAGGER}>
            <p className="max-w-[640px] text-center text-body-lg text-muted">
              {faqIntro.body}
            </p>
          </Reveal>
        </div>

        <ul className="flex w-full max-w-column flex-col gap-6 pt-6">
          {faq.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <Reveal key={item.id} delay={stagger(i)}>
                <li>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    className="flex w-full items-start justify-between gap-6 text-left"
                  >
                    <h3 className="text-display-3 max-w-[90%] font-display text-ink">
                      {item.question}
                    </h3>
                    <span
                      aria-hidden="true"
                      className={`relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush transition-transform duration-300 ${
                        isOpen ? "-rotate-180" : ""
                      }`}
                    >
                      <span className="absolute h-[2px] w-3.5 rounded-full bg-ink" />
                      <span
                        className={`absolute h-[2px] w-3.5 rounded-full bg-ink transition-transform duration-300 ${
                          isOpen ? "rotate-0" : "rotate-90"
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${item.id}`}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{
                          // height must NOT overshoot: easeDhak would push the
                          // panel past its natural height and clip the copy.
                          height: { duration: 0.28, ease: "easeOut" },
                          opacity: DHAK,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-prose pr-10 pt-4 text-body-lg text-muted">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 h-px w-full bg-blush opacity-70" />
                </li>
              </Reveal>
            );
          })}
        </ul>

        <Reveal>
          <ButtonLink href="/contact">Contact us</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
