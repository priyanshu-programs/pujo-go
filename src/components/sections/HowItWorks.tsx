"use client";
import { DHAK, STAGGER } from "@/lib/motion";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { screenMap } from "@/components/mockups/Screens";
import { howItWorksIntro, steps } from "@/content/steps";

/**
 * Three steps driving a stack of three phones. The active step's phone lifts
 * to the front and straightens; the others stay fanned out behind it.
 */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  return (
    <section
      id="howitworks"
      className="rounded-t-section bg-gradient-to-b from-blush to-paper py-20 md:py-32"
    >
      <div className="shell flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Reveal>
            <h2 className="text-display-2 max-w-[50%] font-display text-ink">
              {howItWorksIntro.title}
            </h2>
          </Reveal>
          <Reveal delay={STAGGER}>
            <p className="max-w-[362px] text-body-lg text-muted">
              {howItWorksIntro.body}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-split lg:items-stretch lg:gap-16">
          {/* Step cards */}
          <div className="flex w-full flex-col gap-3 lg:justify-center">
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-300 ${
                    isActive
                      ? "border-soft bg-surface"
                      : "border-transparent bg-transparent hover:bg-surface/40"
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="bg-card-glow pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80"
                    />
                  )}
                  <span className="relative flex flex-col gap-2">
                    <span className="text-body-lg font-bold text-ink">
                      {step.title}
                    </span>
                    <span
                      className={`text-base text-ink transition-opacity duration-300 ${
                        isActive ? "opacity-60" : "opacity-50"
                      }`}
                    >
                      {step.body}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Phone stack, masked to fade at the bottom edge */}
          <div
            className="relative h-[520px] w-full"
            style={{
              maskImage:
                "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%)",
              WebkitMaskImage:
                "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%)",
            }}
          >
            {steps.map((step, i) => {
              const Screen = screenMap[step.screen];
              const isActive = i === active;
              const offset = i - active;

              return (
                <motion.div
                  key={step.id}
                  className="absolute left-1/2 top-1/2"
                  animate={{
                    x: `calc(-50% + ${offset * 64}px)`,
                    y: "-50%",
                    rotate: isActive ? 0 : step.rotation,
                    scale: isActive ? 1 : 0.92,
                    opacity: isActive ? 1 : 0.65,
                    zIndex: isActive ? 30 : 10 - Math.abs(offset),
                  }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : DHAK
                  }
                >
                  <PhoneFrame width={280}>
                    <Screen />
                  </PhoneFrame>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile prev/next, matching the source's mobile variant */}
        <div className="flex items-center justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setActive((i) => (i - 1 + steps.length) % steps.length)}
            aria-label="Previous step"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink opacity-50 transition hover:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setActive((i) => (i + 1) % steps.length)}
            aria-label="Next step"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink transition hover:scale-105"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
