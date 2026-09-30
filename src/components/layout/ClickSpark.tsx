"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type Easing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: Easing;
  extraScale?: number;
  children?: ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

const easeFunctions: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  "ease-in": (t) => t * t,
  "ease-out": (t) => t * (2 - t),
  "ease-in-out": (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

/**
 * Global click-spark effect. The canvas is an absolutely-positioned,
 * pointer-events-none overlay so it never intercepts clicks meant for
 * children — it only observes them via the wrapper's onClick.
 */
export function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number | null>(null);

  // Viewport-sized, not page-sized: a canvas the height of the whole document
  // (× DPR) blows past mobile canvas limits and is composited on every scroll
  // frame, which was the main cause of phone jank.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // The draw loop only runs while sparks are alive; `startLoop` kicks it off
  // from a click and it stops itself once the last spark has faded.
  const startLoop = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunctions[easing](progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1 - progress;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      ctx.globalAlpha = 1;
      rafRef.current =
        sparksRef.current.length > 0 ? requestAnimationFrame(draw) : null;
    };

    startLoop.current = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
    };

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // The canvas is fixed to the viewport, so client coords map directly.
      const x = event.clientX;
      const y = event.clientY;
      const now = performance.now();

      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));

      sparksRef.current = [...sparksRef.current, ...newSparks];
      startLoop.current();
    },
    [sparkCount],
  );

  return (
    <div className="relative flex flex-1 flex-col" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
      />
      {children}
    </div>
  );
}
