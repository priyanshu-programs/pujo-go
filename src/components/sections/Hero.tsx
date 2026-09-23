"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { PlayStoreIcon, WatchVideoIcon } from "@/components/ui/StoreIcons";
import { heroContent } from "@/content/site";
import { waitForIntro } from "@/components/layout/introGate";
import { useHeroParallax } from "./useHeroParallax";

/**
 * Hero — a direct build of the Figma "Hero section" frame (node 1063:55).
 *
 * The frame is 3552px wide, ~2.96x a 1200px design, so every Figma measurement
 * below is quoted at its 1200px-shell equivalent. The shell now caps at
 * 1340px and carries a real gutter, so those quoted figures are the design
 * baseline, not the live width.
 *
 * The defining trait of the layout is that the headline is NOT a centred block:
 * "EI PUJOTEY," is flush left, "PUJOGO?" is flush right, and the second line
 * sits at the same y as the top of the artwork so the two overlap. The artwork
 * is therefore pulled up under the headline rather than stacked beneath it.
 *
 * The 3-column body grid is a named theme token (`grid-cols-hero`, defined
 * as `--grid-template-columns-hero` in globals.css) rather than an inline
 * arbitrary value, so it reads as an explicit part of the design system.
 */

/**
 * Three overlapping avatars plus a count.
 *
 * The reference renders these at ~48px with a visible ring, roughly a third
 * larger than the earlier 36px, and the count pill matches that diameter.
 * Reduced 30% (48px -> 33.6px) with the overlap and count-pill text scaled
 * down proportionally (14px -> 9.8px, 13px -> ~9px).
 */
function AvatarCluster({ count }: { count: string }) {
  const faces = [
    "from-[#6b5b4f] to-[#3d332c]",
    "from-[#7a5c52] to-[#463029]",
    "from-[#5d6470] to-[#333940]",
  ];

  return (
    <div className="group flex items-center">
      {faces.map((gradient, i) => (
        <div
          key={gradient}
          className={`relative size-[33.6px] rounded-full border-2 border-black bg-gradient-to-br ${gradient} transition-[transform,margin,box-shadow] duration-300 ease-out will-change-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/70 ${i === 0 ? "" : "-ml-[9.8px] group-hover:-ml-[2px]"
            }`}
          style={{ zIndex: i, transitionDelay: `${i * 40}ms` }}
        />
      ))}
      {/* Sits on top of the last avatar so the leading "+" stays visible. */}
      <div
        className="relative -ml-[9.8px] flex h-[33.6px] min-w-[33.6px] items-center justify-center rounded-full border-2 border-black bg-surface px-2 text-[9px] font-bold whitespace-nowrap text-ink transition-transform duration-300 ease-out will-change-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/70"
        style={{ zIndex: faces.length, transitionDelay: `${faces.length * 40}ms` }}
      >
        {count}
      </div>
    </div>
  );
}

/*
 * Shared sizing for the two hero CTAs so they read as a matched pair: same
 * height, same width (sized to fit the longer "Watch Video" label plus its
 * icon), and shrink-0 + whitespace-nowrap so a tight flex-nowrap row can
 * never force either the button or its label to wrap.
 */
const heroCtaClass =
  "inline-flex h-control w-44 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-[15px] font-semibold text-white";

function PlayStoreButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`${heroCtaClass} bg-accent shadow-[0_10px_26px_-4px_rgba(254,0,0,0.35)] transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      <PlayStoreIcon className="size-icon shrink-0" />
      {label}
    </Link>
  );
}

function WatchVideoButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`${heroCtaClass} border-[3px] border-white transition-colors duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      <WatchVideoIcon className="size-[22px] shrink-0" />
      {label}
    </Link>
  );
}

export function Hero() {
  /*
   * Parallax wrappers: each ref sits on a plain div wrapping the actual content.
   * The GSAP scroll-linked transform applies to the outer wrapper, while our GSAP
   * "appear" timeline applies to the inner refs. This ensures they never write
   * to the same node's `transform` in the same frame.
   */
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax outer refs
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const introLedeRef = useRef<HTMLDivElement>(null);
  const avatarClusterRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);
  const asideLedeRef = useRef<HTMLDivElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);

  // Appear inner refs
  const headlineTopRef = useRef<HTMLSpanElement>(null);
  const headlineBottomRef = useRef<HTMLSpanElement>(null);
  const artworkInnerRef = useRef<HTMLDivElement>(null);
  const introLedeInnerRef = useRef<HTMLParagraphElement>(null);
  const avatarClusterInnerRef = useRef<HTMLDivElement>(null);
  const socialProofInnerRef = useRef<HTMLParagraphElement>(null);
  const asideLedeInnerRef = useRef<HTMLParagraphElement>(null);
  const ctaRowInnerRef = useRef<HTMLDivElement>(null);

  useHeroParallax({
    section: sectionRef,
    headline: headlineRef,
    artwork: artworkRef,
    introLede: introLedeRef,
    avatarCluster: avatarClusterRef,
    socialProof: socialProofRef,
    asideLede: asideLedeRef,
    ctaRow: ctaRowRef,
  });

  useEffect(() => {
    /*
     * The entrance is built paused and played only once the intro curtain
     * yields the screen (`waitForIntro`). Without that gate it fires on mount
     * and runs to completion in ~1s while the preloader is still up for ~3s,
     * so the first thing a visitor ever sees of the hero is its finished
     * resting state — the overshoot and the stagger are paid for and thrown
     * away. `waitForIntro` resolves the moment the curtain's wipe *starts*,
     * not when it ends, so the hero is already in motion as the wave edge
     * passes over it. On a route with no curtain it resolves immediately —
     * see `introGate.ts` for why that fallback is a claim and not a timeout.
     */
    let cancelled = false;

    // "The Dhak Beat" Concept (Energetic & Punchy)
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (prefersReduced.matches) return;

      const tl = gsap.timeline({ paused: true });

      // 1. Artwork: Snaps in with a heavy beat (overshoot)
      tl.fromTo(
        artworkInnerRef.current,
        {
          opacity: 0,
          scale: 0.85,
          y: 60
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)"
        },
        0 // Start immediately
      );

      // 2. The Typography "Beats": Hard, fast stagger
      const textElements = [
        headlineTopRef.current,
        headlineBottomRef.current,
        introLedeInnerRef.current,
        avatarClusterInnerRef.current,
        socialProofInnerRef.current,
        asideLedeInnerRef.current,
        ctaRowInnerRef.current
      ];

      tl.fromTo(
        textElements,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.08
        },
        0.2 // Slightly offset from artwork to simulate rapid syncopation
      );

      /*
       * `cancelled` is not belt-and-braces. The play is async, so a route
       * change during the curtain unmounts this component and runs
       * `ctx.revert()` before the gate settles — and `revert()` does not stop a
       * timeline that has not started yet. Playing afterwards animates nodes
       * GSAP has already torn down and restored.
       */
      void waitForIntro().then(() => {
        if (cancelled) return;
        tl.play();
      });
    }, sectionRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      /*
       * pb-[177px] is load-bearing, not decorative: useHeroParallax drifts
       * every layer DOWN into this padding. The widest drift consumes ~70px,
       * so the rest is headroom — do not reduce below ~120px or a blank band
       * appears under the content on scroll. Stays a literal because it has
       * exactly one consumer; a token here would be a rename, not a system.
       */
      className="relative overflow-hidden bg-black pt-navbar pb-[280px] font-jakarta md:pt-[150px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[220px] bg-gradient-to-b from-transparent to-paper"
      />

      <div className="shell relative">
        <h1
          ref={headlineRef}
          className="pointer-events-none relative z-10 text-hero-display"
        >
          <span
            ref={headlineTopRef}
            className="block ml-[3.33vw] text-left text-white motion-safe:opacity-0"
          >
            {heroContent.headline.top}
          </span>
          <span
            ref={headlineBottomRef}
            className="block mt-2 text-left text-accent md:mt-6 md:text-right motion-safe:opacity-0"
          >
            {heroContent.headline.bottom}
          </span>
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-10 md:-mt-[13vw] md:grid-cols-hero md:items-start md:gap-2 lg:-mt-[11vw]">
          {/* Left column */}
          <div className="order-2 flex flex-col md:order-1 md:pt-[3.79vw] lg:pt-[2.71vw]">
            <div ref={introLedeRef}>
              <p
                ref={introLedeInnerRef}
                className="max-w-measure text-justify text-hero-lede text-white motion-safe:opacity-0"
              >
                {heroContent.introLede}
              </p>
            </div>

            <div className="mt-16">
              <div ref={avatarClusterRef}>
                <div ref={avatarClusterInnerRef} className="motion-safe:opacity-0">
                  <AvatarCluster count={heroContent.avatarCount} />
                </div>
              </div>
            </div>

            <div ref={socialProofRef}>
              <p
                ref={socialProofInnerRef}
                className="mt-4 max-w-[250px] text-hero-lede text-white motion-safe:opacity-0"
              >
                <span className="font-semibold">{heroContent.socialProof.line1}</span>
                <br />
                {heroContent.socialProof.line2}
              </p>
            </div>
          </div>

          {/* Centre — the cut-out artwork; stacked above the headline (z-10) so it overlaps the type */}
          <div
            className="relative z-20 order-1 flex justify-center md:order-2 md:self-end"
          >
            {/*
             * Nudged left by the theme's `--spacing-hero-artwork-shift`
             * token (see globals.css) rather than a bare inline pixel
             * value, so the offset stays a named, themeable design
             * decision — the arbitrary-value bracket only wires that
             * token into `translate-x`, which Tailwind v4 has no
             * negative-token utility for.
             */}
            <div ref={artworkRef} className="translate-x-[calc(var(--spacing-hero-artwork-shift)*-1)]">
              <div ref={artworkInnerRef} className="motion-safe:opacity-0">
                <Image
                  src="/images/hero-central-tbc.webp"
                  alt=""
                  width={975}
                  height={1286}
                  sizes="(max-width: 810px) 92vw, (max-width: 1200px) 56vw, 668px"
                  loading="eager"
                  fetchPriority="high"
                  className="h-auto w-[92vw] max-w-[668px] md:w-full md:origin-top md:scale-[1.214]"
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="order-3 flex flex-col gap-16 md:pt-[11.2vw] lg:pt-[10vw]">
            <div ref={asideLedeRef}>
              <p
                ref={asideLedeInnerRef}
                className="mt-[4.17vw] max-w-measure text-justify text-hero-lede text-white motion-safe:opacity-0"
              >
                {heroContent.asideLede}
              </p>
            </div>

            <div ref={ctaRowRef}>
              <div
                ref={ctaRowInnerRef}
                className="flex flex-nowrap items-center gap-2 md:justify-start md:gap-3 motion-safe:opacity-0"
              >
                <PlayStoreButton {...heroContent.primaryCta} />
                <WatchVideoButton {...heroContent.secondaryCta} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
