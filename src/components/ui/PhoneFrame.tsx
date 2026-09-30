import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Real iPhone mockup (public/Images/phone.avif, 933×1685) with the screen
 * area cut out to transparency. Screen content is layered into that cutout
 * (measured bounds: x 14.04%–85.85%, y 9.2%–90.45% of the frame).
 */
export function PhoneFrame({
  children,
  underlay,
  className = "",
  style,
  width = 280,
}: {
  children?: ReactNode;
  /**
   * Full-phone content drawn BEHIND the frame image, so the bezel and dynamic
   * island sit over it instead of it being cropped to the cutout. When set,
   * the on-top screen layer is skipped and `children` is ignored.
   *
   * Its box is sized to the 0.4391 aspect of the app screen recordings, not to
   * the cutout's 0.4894 — matching the media means `object-cover` neither bars
   * nor crops it — then scaled 3% so it overlaps the cutout on every side and
   * the overflow tucks under the bezel.
   */
  underlay?: ReactNode;
  className?: string;
  style?: CSSProperties;
  width?: number;
}) {
  return (
    <div
      className={`relative shrink-0 drop-shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ${className}`}
      style={{ width, aspectRatio: 933 / 1685, ...style }}
    >
      {underlay && (
        <div
          className="absolute overflow-hidden bg-black"
          style={{
            left: "12.97%",
            right: "13.08%",
            top: "3.19%",
            bottom: "3.54%",
            borderRadius: width * 0.08,
          }}
        >
          {underlay}
        </div>
      )}

      <Image
        src="/Images/phone.avif"
        alt=""
        aria-hidden="true"
        fill
        sizes={`${width}px`}
        className="pointer-events-none select-none object-contain"
        priority={false}
      />

      {/* Screen — inset to the transparent cutout measured in the source image */}
      {!underlay && (
        <div
          className="absolute overflow-hidden bg-gradient-to-b from-surface to-paper"
          style={{
            left: "14.1%",
            right: "14.2%",
            top: "9.3%",
            bottom: "9.6%",
            borderRadius: width * 0.1,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** Status bar row — time left, signal cluster right. */
export function PhoneStatusBar({ time = "21:41" }: { time?: string }) {
  return (
    <div className="flex items-center justify-between px-[8%] pt-[4.5%] text-[8px] font-bold text-ink/80">
      <span>{time}</span>
      <span className="flex items-center gap-[3px]">
        <span className="inline-block h-[6px] w-[10px] rounded-[1px] bg-ink/60" />
        <span className="inline-block h-[6px] w-[6px] rounded-full bg-ink/60" />
        <span className="inline-block h-[6px] w-[12px] rounded-[2px] border border-ink/60" />
      </span>
    </div>
  );
}
