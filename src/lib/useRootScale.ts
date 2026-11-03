"use client";

import { useEffect, useState } from "react";

/**
 * The root font size as a multiple of 16px: 1 up to a 1600px viewport, then
 * growing with it (1.6 at 2560), per `html { font-size: max(100%, 1vw) }` in
 * globals.css. Use it to scale px numbers that JS feeds to inline styles or
 * framer-motion, so they grow in step with the rem-based layout around them.
 * Starts at 1 so the server and first client render agree.
 */
export function useRootScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const read = () =>
      setScale(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return scale;
}
