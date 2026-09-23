"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "./lenisInstance";
import { claimIntro, markIntroDone } from "./introGate";

/**
 * The homepage-only curtain: mounted first in `src/app/page.tsx`, ahead of
 * `<Hero />`, so its markup is in the initial HTML before anything else the
 * page renders gets a chance to paint. This component never conditionally
 * hides its own root behind client state before first paint — that would
 * reopen the exact flash it exists to prevent — it only ever hides itself
 * *after* mount, once its own exit animation has finished.
 *
 * Pairs with `lenisInstance.ts`, which was built specifically so this
 * component can reach the page's Lenis instance once it is ready (see that
 * file's comment on ordering), and with `introGate.ts`, which is how the hero
 * learns it may start animating.
 *
 * The transition is the brand mark and nothing else: the logo snaps in, the
 * wordmark follows, they hold, and the whole curtain fades to reveal the
 * homepage. An earlier version swept an organic clip-path wave across the
 * screen with an accent-red edge tracing it; that was removed deliberately in
 * favour of this simpler read. If a shaped reveal is ever wanted again it goes
 * back in around step 4 below — the gate and scroll-lock plumbing are
 * independent of how the curtain leaves.
 */

export function Preloader() {
  /*
   * Claim the gate during render, not in an effect. `Hero` reads the claim in
   * its own effect, and React runs every effect in a commit after every render
   * in that commit — so claiming here is the only placement guaranteed to be
   * visible to a sibling by the time it looks. Claiming from an effect would
   * race: whichever effect ran first would win, and tree order would silently
   * become load-bearing. Idempotent, so StrictMode's double render and any
   * re-render are both harmless.
   */
  claimIntro();

  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Scroll is locked for the entire life of the curtain, released only
    // once the exit animation completes (see the timeline's onComplete).
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

      /*
       * The single exit funnel. `markIntroDone()` is called here as well as at
       * the fade's start so the reduced-motion branch — which never runs the
       * fade — still releases the hero. The second call is a no-op by design;
       * see `introGate.ts`.
       */
      const release = () => {
        markIntroDone();
        getLenis()?.start();
        document.body.style.overflow = "";
        setHidden(true);
      };

      if (prefersReduced.matches) {
        // Skip the animated sequence entirely; clear the curtain near-
        // instantly so a reduced-motion visitor is never held up by it.
        gsap.set([markRef.current, wordmarkRef.current], { opacity: 1 });
        const tl = gsap.timeline({ onComplete: release });
        tl.to(rootRef.current, { opacity: 0, duration: 0.2, delay: 0.1 });
        return;
      }

      const tl = gsap.timeline({ onComplete: release });

      // 1. Logo mark snaps in with a heavy overshoot beat.
      tl.fromTo(
        markRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        0,
      );

      // 2. Wordmark follows right after, as one block.
      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
        0.3,
      );

      // 3. Hold briefly, then mark + wordmark drop away together.
      tl.to(
        [markRef.current, wordmarkRef.current],
        { opacity: 0, y: -12, duration: 0.35, ease: "power2.in" },
        "+=0.5",
      );

      // 4. The curtain fades out. `onStart` — not the timeline's onComplete —
      // releases the hero, so the hero is already animating as the curtain
      // dissolves over it. Gating on completion instead leaves a dead beat
      // where the revealed page sits motionless.
      tl.to(
        rootRef.current,
        {
          opacity: 0,
          duration: 0.55,
          ease: "power2.inOut",
          onStart: markIntroDone,
        },
        "+=0.1",
      );
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-paper"
    >
      <div ref={markRef} className="relative opacity-0">
        <Image
          src="/images/pujogo-logo.webp"
          alt=""
          width={1182}
          height={1181}
          sizes="88px"
          loading="eager"
          fetchPriority="high"
          className="size-[88px] rounded-full"
        />
      </div>
      <div ref={wordmarkRef} className="relative opacity-0">
        <span className="font-jakarta text-4xl font-bold tracking-tight text-white">
          PUJO <span className="text-accent">GO</span>
        </span>
      </div>
    </div>
  );
}
