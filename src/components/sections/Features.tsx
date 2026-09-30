"use client";

import { Card } from "@/components/ui/Card";
import { STAGGER, stagger } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureVisualRenderer } from "@/components/mockups/FeatureVisuals";
import { featureRows, featuresIntro } from "@/content/features";
import type { Feature } from "@/content/features";

/**
 * Feature bento. Three flex rows of two tiles, matching the source: tiles carry
 * `width:1px` + a flex-grow ratio so their split is independent of content, and
 * a fixed height rather than a content-driven one. Below 810px rows stack.
 *
 * Grow classes are spelled out rather than interpolated so Tailwind's scanner
 * sees them. The 810-1199px bump to 1.5 is a no-op for the 1:1 rows; it only
 * loosens row 2 from 1:2 to 1.5:2.
 */
const growClass = {
  1: "md:grow-[1.5] lg:grow",
  2: "grow-[2]",
} as const;

/** Default fade start; a tile opts out via `maskStop` when its visual needs it. */
const MASK_STOP = 70;

const maskFor = (feature: Feature) =>
  `linear-gradient(to bottom, black ${feature.maskStop ?? MASK_STOP}%, transparent 100%)`;

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="shell flex flex-col gap-20">
        <div className="flex flex-col gap-10 md:flex-row md:gap-10">
          <Reveal className="flex-1">
            <h2 className="text-display-2 font-display text-ink">
              {featuresIntro.title[0]}
              <br />
              {featuresIntro.title[1]}
            </h2>
          </Reveal>
          <Reveal className="flex-1" delay={STAGGER}>
            <p className="text-body-lg text-muted">{featuresIntro.body}</p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {featureRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              {row.map((feature, i) => (
                <Reveal
                  key={feature.id}
                  delay={stagger(i)}
                  className={`h-[520px] w-full md:h-[480px] md:w-px ${growClass[feature.grow]}`}
                >
                  <Card className="flex h-full flex-col">
                    {(isHovered) => (
                      <>
                        {/*
                          Visual band absorbs the slack so copy sits on a common baseline.
                          The mask fades content out over its last 30% instead of letting
                          overflow-hidden hard-clip it into a flat edge.
                        */}
                        <div
                          className={`relative min-h-0 flex-1 overflow-hidden ${feature.visual === "phoneTrio" ? "" : "pt-8"}`}
                          style={{
                            maskImage: maskFor(feature),
                            WebkitMaskImage: maskFor(feature),
                          }}
                        >
                          <FeatureVisualRenderer
                            visual={feature.visual}
                            isHovered={isHovered}
                          />
                        </div>
                        <div className="flex shrink-0 flex-col gap-4 p-8">
                          <h3 className="text-display-3 font-display text-ink">
                            {feature.title}
                          </h3>
                          <p className="text-body-lg text-muted text-justify">
                            {feature.body}
                          </p>
                        </div>
                      </>
                    )}
                  </Card>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
