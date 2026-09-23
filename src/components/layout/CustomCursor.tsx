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
 * in globals.css).
 */

/**
 * The interactive elements that get the hover cursor. Mirrors the selector list
 * that `cursor: none` is applied to in globals.css — keep the two in step, or
 * an element will show a native arrow under the overlay.
 */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, summary, [onclick], [tabindex]:not([tabindex="-1"])';

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

// The art's hotspot — the extended index fingertip — sits at x=20, y=10 within
// the SVG's 0 0 468 635 viewBox, which is ~3px, ~1.5px once drawn at 68x92.
const HOTSPOT_X = 3;
const HOTSPOT_Y = 1.5;

export function CustomCursor() {
  // Gates rendering on an actual fine pointer. Resolved in an effect, never
  // during render, so the server and first client pass agree.
  const [enabled, setEnabled] = useState(false);
  // Held back until the first move, otherwise the cursor paints at 0,0 before
  // the pointer has ever reported a position.
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

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
      node.style.transform = `translate3d(${x - HOTSPOT_X}px, ${y - HOTSPOT_Y}px, 0)`;
    };

    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      setVisible(true);

      const target = event.target;
      setHovering(
        target instanceof Element
          ? target.closest(INTERACTIVE_SELECTOR) !== null
          : false,
      );

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
        style={{ display: hovering ? "none" : "block" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pujogo_alta_hover_cursor.svg"
        alt=""
        width={67}
        height={92}
        style={{ display: hovering ? "block" : "none" }}
      />
    </div>
  );
}
