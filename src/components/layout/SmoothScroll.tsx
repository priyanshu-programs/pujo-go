"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "./lenisInstance";

gsap.registerPlugin(ScrollTrigger);

// Runs at module-eval time (before first paint), not inside an effect — the
// browser restores its own remembered scroll position as part of navigating
// to the page, which happens before React even mounts, so waiting for a
// `useEffect` to disable it is already too late on a reload.
if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

/**
 * Lenis smooth scrolling, matching the source.
 *
 * Skipped entirely when the visitor prefers reduced motion, so native scrolling
 * (and native anchor jumps) stay intact.
 *
 * Also bridges Lenis to GSAP's ScrollTrigger: ScrollTrigger listens for native
 * scroll events by default, which Lenis never fires (it scrolls by transforming
 * a wrapper, not by moving the real scrollbar), so without this bridge any
 * ScrollTrigger-driven animation elsewhere on the page (e.g. the hero parallax)
 * would read stale positions and desync from what's on screen. Lenis's own
 * `raf` is driven from GSAP's ticker instead of a hand-rolled
 * `requestAnimationFrame` loop, so both stay on one shared clock.
 *
 * Also resets scroll to the top on every load/reload. Without this, reloading
 * mid-scroll restores that scroll position before hydration finishes; GSAP's
 * ScrollTrigger then initializes already past the hero and immediately snaps
 * its scroll-linked parallax to that "already scrolled" state, which masks
 * the hero's one-shot mount entrance (it still plays, just invisibly, under
 * a hero that's already scrolled/faded via the parallax transform). Starting
 * every load at the top keeps the hero fully in view so the entrance is
 * always visible.
 */
export function SmoothScroll() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReduced.matches) return;

    // Touch devices scroll natively anyway (Lenis doesn't smooth touch by
    // default), so skip its per-frame ticker there; ScrollTrigger falls back
    // to native scroll events on its own.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({ duration: 1.1 });

    // Publish the instance so code that needs to pause scrolling — the
    // preloader, while its curtain is up — can reach it. See lenisInstance.ts.
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Let in-page anchors drive Lenis rather than the browser's instant jump.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only handle same-page hashes; let the router own everything else.
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      const path = href.slice(0, hashIndex);
      if (path && path !== window.location.pathname && path !== "/") return;
      if (path === "/" && window.location.pathname !== "/") return;

      const target = document.querySelector(href.slice(hashIndex));
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -100 });
      history.pushState(null, "", href.slice(hashIndex));
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
