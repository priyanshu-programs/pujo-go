"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Layer = {
  ref: RefObject<HTMLElement | null>;
  /** Percent of the element's own height it drifts down by. */
  yPercent: number;
  /** Extra scale applied alongside the drift — used sparingly, for the artwork. */
  scale?: number;
  /** Opacity to fade to. */
  opacity?: number;
  /** CSS filter (like blur) for cinematic depth of field. */
  filter?: string;
  /** Subtle rotation in degrees. */
  rotation?: number;
  /** Horizontal drift. */
  xPercent?: number;
};

type ParallaxRefs = {
  section: RefObject<HTMLElement | null>;
  headline: RefObject<HTMLElement | null>;
  artwork: RefObject<HTMLElement | null>;
  introLede: RefObject<HTMLElement | null>;
  avatarCluster: RefObject<HTMLElement | null>;
  socialProof: RefObject<HTMLElement | null>;
  asideLede: RefObject<HTMLElement | null>;
  ctaRow: RefObject<HTMLElement | null>;
};

/**
 * Scroll-linked parallax for the hero's layered content.
 *
 * This runs independently of the GSAP mount entrance already in Hero.tsx (the
 * "Dhak Beat" timeline) — that animation only ever plays once, on load. This
 * effect is a *separate* transform layer that only starts moving once the
 * visitor scrolls, driven by GSAP's
 * ScrollTrigger with `scrub` so it tracks scroll position directly instead of
 * playing on a timer.
 *
 * Each ref should point to a wrapper `div` around the entrance-animated
 * block it targets, not the same node Framer Motion writes `transform` to —
 * both libraries move things via CSS transforms, and applying both to one
 * element would have them clobber each other's values every frame.
 *
 * Every layer drifts DOWN (positive yPercent) as the visitor scrolls, never
 * up. `#hero` is a fixed-height black section with its own bottom padding
 * below the content. That padding is a LOWER BOUND, not an exact figure:
 * each layer moves by a percent of its OWN height, so the widest drift here
 * consumes roughly 70px and anything above ~120px of bottom padding is
 * safe. Translating anything upward instead vacates its
 * original footprint while the section itself keeps scrolling past for a
 * while longer, which exposes a blank band of hero background under the
 * content — a visible gap that shows up regardless of where the
 * ScrollTrigger's `end` is set, since it's caused by the translation itself,
 * not by when it finishes. Drifting down instead moves layers deeper into
 * space the section already reserves (that same bottom padding), so nothing
 * is ever left empty above.
 *
 * Depths (how far each layer travels) are deliberately uneven and increase
 * the further an element is from the "front" of the composition — every
 * distinct piece of hero content gets its own rate rather than a few
 * elements moving as one grouped block, so scrolling reveals depth between
 * individual lines/widgets, not just between broad regions:
 *
 *   headline (foreground, largest/closest)         ->  8%
 *   artwork (mid, + a slow scale-up)                ->  6%
 *   intro lede / aside lede (body copy)             -> 14%
 *   avatar cluster / CTA row (small interactive UI) -> 20%
 *   social-proof caption (furthest back)            -> 24%
 *
 * The layers that move furthest appear to lag behind the ones that move
 * least — that mismatch is what reads as parallax rather than everything
 * scrolling together.
 */
export function useHeroParallax({
  section,
  headline,
  artwork,
  introLede,
  avatarCluster,
  socialProof,
  asideLede,
  ctaRow,
}: ParallaxRefs) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReduced.matches) return;
    if (!section.current) return;

    const ctx = gsap.context(() => {
      // Runs for the section's full time on screen — content drifting down
      // stays inside the section's own footprint/padding the whole way, so
      // there's no dead-space edge case to work around at the end.
      const scrollTrigger: ScrollTrigger.Vars = {
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2, // Extremely smooth, slightly delayed lag for premium feel
      };

      // Subtle but unique:
      // Clean, conservative Y-drifts with a very slight focal blur on the
      // artwork as it recedes, creating a sense of physical depth without
      // overwhelming the layout.
      const layers: Layer[] = [
        { ref: headline, yPercent: 12 },
        { ref: artwork, yPercent: 8, scale: 1.04, opacity: 0.6, filter: "blur(5px)" },
        { ref: introLede, yPercent: 18 },
        { ref: asideLede, yPercent: 18 },
        { ref: avatarCluster, yPercent: 24, opacity: 0.2 },
        { ref: ctaRow, yPercent: 24, opacity: 0.2 },
        { ref: socialProof, yPercent: 28, opacity: 0 },
      ];

      for (const layer of layers) {
        if (!layer.ref.current) continue;
        
        const animationProps: gsap.TweenVars = {
          yPercent: layer.yPercent,
          ease: "none",
          scrollTrigger,
        };

        if (layer.scale !== undefined) animationProps.scale = layer.scale;
        if (layer.opacity !== undefined) animationProps.opacity = layer.opacity;
        if (layer.filter !== undefined) animationProps.filter = layer.filter;
        if (layer.rotation !== undefined) animationProps.rotation = layer.rotation;
        if (layer.xPercent !== undefined) animationProps.xPercent = layer.xPercent;

        gsap.to(layer.ref.current, animationProps);
      }

      // Ambient depth cue: the whole hero dims slightly as it scrolls away.
      gsap.to(section.current, {
        opacity: 0.5,
        ease: "none",
        scrollTrigger,
      });
    }, section);

    return () => ctx.revert();
  }, [
    section,
    headline,
    artwork,
    introLede,
    avatarCluster,
    socialProof,
    asideLede,
    ctaRow,
  ]);
}

