"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { PlayStoreIcon, WatchVideoIcon } from "@/components/ui/StoreIcons";
import { heroContent } from "@/content/site";
import { waitForIntro } from "@/components/layout/introGate";

/** Shared hero content stacks on phones and uses three columns on wide screens. */
const AVATAR_SRCS = [
  "/Images/community/avatar-1.webp",
  "/Images/community/avatar-2.webp",
  "/Images/community/avatar-3.webp",
];

function AvatarCluster({ count }: { count: string }) {
  return (
    <div className="group flex items-center [--avatar:clamp(2.5rem,2.1rem+1.2vw,3.0625rem)]">
      {AVATAR_SRCS.map((src, i) => (
        <div
          key={src}
          className={`relative size-(--avatar) overflow-hidden rounded-full border-2 border-black transition-[transform,margin,box-shadow] duration-300 ease-out will-change-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/70 ${i === 0 ? "" : "-ml-[calc(var(--avatar)*0.29)] group-hover:-ml-0.5"}`}
          style={{ zIndex: i, transitionDelay: `${i * 40}ms` }}
        >
          <Image src={src} alt="" fill sizes="(min-width: 1600px) 3.0625vw, 49px" className="object-cover" />
        </div>
      ))}
      {/* Sits on top of the last avatar so the leading "+" stays visible. */}
      <div
        className="relative -ml-[calc(var(--avatar)*0.29)] flex h-(--avatar) min-w-[calc(var(--avatar)*1.06)] items-center justify-center rounded-full border-2 border-black bg-surface px-2 text-[calc(var(--avatar)*0.22)] font-bold whitespace-nowrap text-ink transition-transform duration-300 ease-out will-change-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/70"
        style={{ zIndex: AVATAR_SRCS.length, transitionDelay: `${AVATAR_SRCS.length * 40}ms` }}
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
  "inline-flex h-control w-full max-w-44 min-w-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-[0.9375rem] font-semibold text-white";

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
      <WatchVideoIcon className="size-[1.375rem] shrink-0" />
      {label}
    </Link>
  );
}

export function Hero() {
  /*
   * Entrance refs: the GSAP "appear" timeline animates these inner nodes.
   * Scroll parallax was removed, so these are the only transforms on hero
   * content — the outer wrappers below are plain layout divs.
   */
  const sectionRef = useRef<HTMLElement>(null);

  // Appear inner refs
  const headlineTopRef = useRef<HTMLSpanElement>(null);
  const headlineBottomRef = useRef<HTMLSpanElement>(null);
  const artworkInnerRef = useRef<HTMLDivElement>(null);
  const introLedeInnerRef = useRef<HTMLParagraphElement>(null);
  const avatarClusterInnerRef = useRef<HTMLDivElement>(null);
  const socialProofInnerRef = useRef<HTMLParagraphElement>(null);
  const asideLedeInnerRef = useRef<HTMLParagraphElement>(null);
  const ctaRowInnerRef = useRef<HTMLDivElement>(null);

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
    <section id="hero" ref={sectionRef} className="hero-section font-jakarta">
      <div className="shell relative">
        <h1 className="hero-heading">
          <span ref={headlineTopRef} className="block text-white motion-safe:opacity-0">
            {heroContent.headline.top}
          </span>
          <span ref={headlineBottomRef} className="hero-heading-bottom block text-accent motion-safe:opacity-0">
            {heroContent.headline.bottom}
          </span>
        </h1>

        <div className="hero-grid">
          <div className="hero-intro">
            <p ref={introLedeInnerRef} className="hero-copy motion-safe:opacity-0">
              {heroContent.introLede}
            </p>
            <div ref={avatarClusterInnerRef} className="hero-avatars motion-safe:opacity-0">
              <AvatarCluster count={heroContent.avatarCount} />
            </div>
            <p ref={socialProofInnerRef} className="hero-copy mt-4 motion-safe:opacity-0">
              <span className="font-semibold">{heroContent.socialProof.line1}</span>
              <br />
              {heroContent.socialProof.line2}
            </p>
          </div>

          <div className="hero-aside">
            <p ref={asideLedeInnerRef} className="hero-copy motion-safe:opacity-0">
              {heroContent.asideLede}
            </p>
            <div ref={ctaRowInnerRef} className="hero-actions motion-safe:opacity-0">
              <PlayStoreButton {...heroContent.primaryCta} />
              <WatchVideoButton {...heroContent.secondaryCta} />
            </div>
          </div>

          <div className="hero-artwork">
            <div ref={artworkInnerRef} className="motion-safe:opacity-0">
              <Image
                src="/Images/hero-central-tbc.webp"
                alt="PujoGo pandal map on a phone held in front of Durga Puja artwork"
                width={975}
                height={1286}
                sizes="(max-width: 600px) 100vw, (min-width: 1600px) 35vw, 560px"
                loading="eager"
                fetchPriority="high"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
