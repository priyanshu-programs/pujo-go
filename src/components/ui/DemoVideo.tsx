"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** The MP4s are baked at half speed; 1.3× on top makes them 65% of the original. */
const PLAYBACK_RATE = 1.3;

/**
 * Looping screen recording that rests on its first frame and only plays while
 * `playing` is true. Leaving snaps back to the start frame.
 */
export function DemoVideo({
  src,
  poster,
  playing,
  rate = PLAYBACK_RATE,
  fit = "contain",
}: {
  src: string;
  poster: string;
  playing: boolean;
  /** The GIF-derived demos are real-time, so they pass 1. */
  rate?: number;
  fit?: "contain" | "cover";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing && !reduced) {
      video.playbackRate = rate;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [playing, reduced, rate]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    />
  );
}
