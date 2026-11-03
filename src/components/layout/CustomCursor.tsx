"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Pujogo alta-hand cursor, drawn as a fixed overlay rather than via the
 * native CSS `cursor` property.
 *
 * Why not `cursor: url(...)`: browsers only reliably honour custom cursor
 * images up to roughly 32x32. The alta-hand art is 68x92, and past the cap the
 * browser silently falls back to the keyword (`auto`/`pointer`) instead of
 * erroring — which is why the cursor kept reverting to a plain system arrow,
 * most visibly near the bottom of the page where Lenis/ScrollTrigger's
 * transformed wrapper (see `SmoothScroll`) forces the cursor image to be
 * re-evaluated. An overlay keeps the art at its intended size everywhere.
 *
 * Only runs where there is a real pointer to replace; touch devices keep their
 * native behaviour and never get `cursor: none` (see the matching media query
 * in globals.css). Also gated on viewport width so it never shows below the
 * smallest real laptop screens (~1280-1366px), only on narrower windows,
 * tablets, and phones.
 */

/**
 * The interactive elements that get the hover cursor. Mirrors the selector list
 * that `cursor: none` is applied to in globals.css — keep the two in step, or
 * an element will show a native arrow under the overlay.
 */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, summary, [onclick], [tabindex]:not([tabindex="-1"])';

/**
 * Any element with `data-cursor-label="..."` swaps the hand for a red tooltip
 * pill carrying that text (e.g. team cards show the member's handle). Labels
 * win over the interactive hover hand.
 */
const LABEL_ATTR = "data-cursor-label";

const FINE_POINTER = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

// Each state's hotspot is its extended fingertip, in px at the drawn size. The
// two arts differ: default is x=20,y=10 in a 0 0 468 635 viewBox (68x92), while
// the hover hand's raised finger tops out at x~209,y~6 in a 0 0 455 626 viewBox
// (67x92) — so it can't share the default's offset.
const DEFAULT_HOTSPOT = { x: 3, y: 1.5 };
const HOVER_HOTSPOT = { x: 31, y: 1 };

export function CustomCursor() {
  // Gates rendering on an actual fine pointer. Resolved in an effect, never
  // during render, so the server and first client pass agree.
  const [enabled, setEnabled] = useState(false);
  // Held back until the first move, otherwise the cursor paints at 0,0 before
  // the pointer has ever reported a position.
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  // Last non-empty label, kept so the pill can fade out with its text intact.
  const [shownLabel, setShownLabel] = useState("");

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER);
    setEnabled(query.matches);

    const onChange = (event: MediaQueryListEvent) => setEnabled(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Position is written straight to the node on a rAF rather than kept in
    // state: a pointermove-driven setState would re-render on every frame of
    // every mouse movement.
    let frame = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      frame = 0;
      const node = cursorRef.current;
      if (!node) return;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      setVisible(true);

      const target = event.target;
      const el = target instanceof Element ? target : null;
      setHovering(el ? el.closest(INTERACTIVE_SELECTOR) !== null : false);
      const next = el?.closest(`[${LABEL_ATTR}]`)?.getAttribute(LABEL_ATTR) || null;
      setLabel(next);
      if (next) setShownLabel(next);

      if (!frame) frame = requestAnimationFrame(render);
    };

    // Leaving the window entirely (not just crossing into a child element)
    // should take the overlay with it.
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };
    const onPointerOver = () => setVisible(true);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("pointerover", onPointerOver);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerover", onPointerOver);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Plain <img>: next/image adds nothing for a fixed-size local SVG, and
          both states stay mounted so swapping hover never costs a fetch. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Images/pujogo_cursor_logo.svg"
        alt=""
        width={68}
        height={92}
        style={{
          display: hovering || label ? "none" : "block",
          maxWidth: "none",
          transform: `translate(${-DEFAULT_HOTSPOT.x}px, ${-DEFAULT_HOTSPOT.y}px)`,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pujogo_alta_hover_cursor.svg"
        alt=""
        width={67}
        height={92}
        style={{
          display: hovering && !label ? "block" : "none",
          maxWidth: "none",
          transform: `translate(${-HOVER_HOTSPOT.x}px, ${-HOVER_HOTSPOT.y}px)`,
        }}
      />
      {/* Tooltip pill: its top-left tail sits on the pointer, and it grows
          out of that corner with the same soft expo-out ease as the photos. */}
      <div
        className="absolute left-0 top-0 origin-top-left transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: label ? 1 : 0,
          transform: label ? "translate(6px, 8px) scale(1)" : "translate(6px, 8px) scale(0.6)",
        }}
      >
        <span
          className="absolute -top-1 left-0 size-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-accent"
          style={{ left: 6 }}
        />
        <span className="block whitespace-nowrap rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(254,0,0,0.55)]">
          {shownLabel}
        </span>
      </div>
    </div>
  );
}
