"use client";

import { useState, type ReactNode } from "react";

/**
 * The bento tile shell: 32px radius, 1px soft border, surface fill, and the
 * radial blush glow anchored to the bottom edge at 40% opacity.
 *
 * Owns hover state for the whole tile (not just the visual band) and hands
 * it to `children` as a render prop, so a tile's mockup animation plays no
 * matter where inside the card the pointer enters — over the visual, the
 * title, or the body copy.
 */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode | ((isHovered: boolean) => ReactNode);
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative isolate overflow-hidden rounded-card border border-soft bg-surface ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        aria-hidden="true"
        className="bg-card-glow pointer-events-none absolute inset-0 -z-10 opacity-40 group-hover:opacity-80"
      />
      {typeof children === "function" ? children(isHovered) : children}
    </div>
  );
}
