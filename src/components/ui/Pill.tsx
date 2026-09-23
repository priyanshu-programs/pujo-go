import type { ReactNode } from "react";

/**
 * The blush eyebrow badge — used for "Trusted by 100 000+ users" and the
 * "Latest article" tag. Backdrop-blurred with a 40%-opacity blush fill, which
 * is how the source layers it over photography.
 */
export function Pill({
  children,
  tone = "blush",
  className = "",
}: {
  children: ReactNode;
  tone?: "blush" | "light";
  className?: string;
}) {
  const fill =
    tone === "blush" ? "bg-blush/40 border-soft" : "bg-surface/80 border-soft";

  return (
    <span
      className={`relative inline-flex items-center overflow-hidden rounded-full border px-6 py-2 backdrop-blur-[7px] ${fill} ${className}`}
    >
      <span className="text-eyebrow text-ink">{children}</span>
    </span>
  );
}
