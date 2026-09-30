"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hotlinked animated GIF that rests on its first frame and only plays while
 * `playing` is true — the GIF equivalent of `DemoVideo`. Native `<img>` GIFs
 * can't be paused/seeked, so the freeze frame is captured onto a canvas and
 * the animated `<img>` is mounted fresh — keyed by a counter bumped on every
 * rest→play transition — only while playing, which is what forces the browser
 * to redecode it from frame 0 each time.
 *
 * The canvas is never blanked: it stays painted and visible *underneath* the
 * `<img>`, which is revealed only once it has decoded. Otherwise the black
 * `PhoneFrame` underlay shows through for the length of a multi-megabyte
 * decode, which reads as a blink on every play.
 */

/** Decoded first frames, kept for the page's lifetime so a remounted DemoGif
 *  paints on its FIRST paint. The "How it works" conveyor unmounts a card and
 *  mounts a ghost on every step change, and re-fetching + redecoding a 19MB
 *  GIF to recover frame 0 is nowhere near same-frame work. */
const frameCache = new Map<string, HTMLImageElement>();

/** `object-fit` does not apply to a canvas bitmap — it would stretch to the
 *  box while the `<img>` beside it crops to cover, so the two would sit at
 *  different geometry and the swap would read as a jump. Crop here instead. */
function paintCover(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const box = canvas.getBoundingClientRect();
  if (!box.width || !box.height || !img.naturalWidth) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(box.width * dpr);
  canvas.height = Math.round(box.height * dpr);

  const scale = Math.max(
    canvas.width / img.naturalWidth,
    canvas.height / img.naturalHeight,
  );
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  canvas
    .getContext("2d")
    ?.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
}

/** Promotes the media to its own layer. Under a `mask-image` ancestor a GIF
 *  otherwise only repaints when something else on that layer animates, so it
 *  sits frozen once the surrounding motion settles. */
const PROMOTE = { willChange: "transform", transform: "translateZ(0)" } as const;

export function DemoGif({ src, playing }: { src: string; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [playKey, setPlayKey] = useState(0);
  const [gifReady, setGifReady] = useState(false);
  const wasPlaying = useRef(false);
  const reduced = useReducedMotion();

  /* Before the browser's first paint, so a remount with a warm cache never
     shows the black underlay. */
  useLayoutEffect(() => {
    const cached = frameCache.get(src);
    const canvas = canvasRef.current;
    if (cached?.complete && canvas) paintCover(canvas, cached);
  }, [src]);

  useEffect(() => {
    let img = frameCache.get(src);
    if (!img) {
      img = new window.Image();
      img.src = src;
      frameCache.set(src, img);
    }
    const frame = img;

    const draw = () => {
      const canvas = canvasRef.current;
      if (canvas && frame.complete) paintCover(canvas, frame);
    };

    if (frame.complete) draw();
    else frame.addEventListener("load", draw);

    /* The fan is fluid, so the box changes with the viewport. */
    const observer = new ResizeObserver(draw);
    if (canvasRef.current) observer.observe(canvasRef.current);

    return () => {
      frame.removeEventListener("load", draw);
      observer.disconnect();
    };
  }, [src]);

  useEffect(() => {
    if (playing && !wasPlaying.current) {
      setPlayKey((k) => k + 1);
      setGifReady(false);
    }
    wasPlaying.current = playing;
  }, [playing]);

  const showGif = playing && !reduced;

  /* A cached `<img>` can fire `load` before React attaches the handler, which
     would leave it revealed-never at opacity 0. */
  useLayoutEffect(() => {
    if (showGif && imgRef.current?.complete) setGifReady(true);
  }, [showGif, playKey]);

  return (
    <div className="absolute inset-0 h-full w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={PROMOTE}
      />
      {showGif && (
        // eslint-disable-next-line @next/next/no-img-element -- animated GIF hotlinked from third-party host, not a local asset
        <img
          key={playKey}
          ref={imgRef}
          src={src}
          alt=""
          aria-hidden="true"
          onLoad={() => setGifReady(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ ...PROMOTE, opacity: gifReady ? 1 : 0 }}
        />
      )}
    </div>
  );
}
