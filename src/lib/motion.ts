import type { EasingFunction } from "framer-motion";

/**
 * "The Dhak Beat" — the Hero's motion character, shared site-wide.
 *
 * This is GSAP's `back.out(1.7)` transcribed as a plain easing function so the
 * GSAP surfaces (Hero, Navbar) and the framer-motion surfaces (everything else)
 * animate on the identical curve. Do NOT substitute framer-motion's built-in
 * `backOut`: it overshoots to 1.0839 where GSAP reaches 1.0998, which reads as a
 * softer snap. This peaks at 1.0998 at t≈0.58 and lands exactly on 0 and 1.
 *
 * It must be used with a tween + explicit duration. No spring reproduces it.
 */
export const easeDhak: EasingFunction = (t) =>
  1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;

/** The standard beat — matches the Hero's text elements. */
export const DHAK = { duration: 0.6, ease: easeDhak } as const;

/** The slower beat, for large or heavy elements — matches the Hero artwork. */
export const DHAK_HEAVY = { duration: 0.8, ease: easeDhak } as const;

/** The Hero's stagger cadence, so grouped children land as one beat. */
export const STAGGER = 0.08;

/**
 * Cap the stagger tail so a long grid doesn't trail for half a second.
 * `i` is the child's index within its group.
 */
export const stagger = (i: number) => Math.min(i, 5) * STAGGER;

/** Shared viewport config so every section reveals at the same threshold. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
