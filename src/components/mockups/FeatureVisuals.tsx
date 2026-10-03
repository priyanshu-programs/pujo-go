"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { DiscoverDemoScreen, MoodDemoScreen, ToiletDemoScreen } from "./Screens";
import { leaderboard, notifications } from "@/content/features";
import type { FeatureVisual } from "@/content/features";

/**
 * Heavy, no-bounce deceleration for the leaderboard's hover reorder — reads
 * as premium/weighted rather than the Hero's snap-and-overshoot beat, which
 * is tuned for entrances, not list reordering. A single shared transition
 * object drives framer-motion's `layout` animation on every render, so the
 * same heavy ease applies identically on the way up (hover-in) and the way
 * back down (hover-out) — there's no separate "reverse" transition to tune.
 */
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const REORDER = { duration: 0.85, ease: EASE_PREMIUM } as const;
const GLORY_FADE = { duration: 0.5, ease: EASE_PREMIUM } as const;

/**
 * The phone fan's hover shift. Uses the same heavy ease-out as the leaderboard
 * reorder (fast start, long soft settle), over a longer duration so the
 * deceleration is clearly visible on the short 10px move.
 */
const FAN_SHIFT = { duration: 0.7, ease: EASE_PREMIUM } as const;

/**
 * The six bento-tile visuals. All decorative, so they are hidden from the
 * accessibility tree — the tile's heading and body carry the meaning.
 *
 * Gradients stand in for the source's photography; rotations and offsets match
 * the original layout.
 */

/**
 * Dark-to-red swatch standing in for photography. Variety comes from the
 * angle and opacity, not hue rotation — every swatch stays on-palette.
 */
function Gradient({
  angle = 150,
  opacity = 1,
  className = "",
}: {
  angle?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <span
      className={`block h-full w-full ${className}`}
      style={{
        background: `linear-gradient(${angle}deg, #1a1a1a, #fe0000)`,
        opacity,
      }}
    />
  );
}

/**
 * Three tilted photo cards, fanned out. On hover they rise and the outer two
 * splay further apart — same heavy ease-out shift as the phone fan
 * (`FAN_SHIFT`), just a smaller-scale nudge.
 *
 * Photography: three Durga Puja location shots supplied for this tile,
 * served from `public/Images/locations`.
 */
const PHOTO_STACK_CARDS: { rotate: number; left: string; dx: number; src: string }[] = [
  { rotate: -11, left: "7%", dx: -8, src: "/Images/locations/location-1.webp" },
  { rotate: -3, left: "33%", dx: 0, src: "/Images/locations/location-2.webp" },
  { rotate: 8, left: "59%", dx: 8, src: "/Images/locations/location-3.webp" },
];

function PhotoStack({ isHovered }: { isHovered: boolean }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-full w-full">
      {PHOTO_STACK_CARDS.map((card, i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 h-[75%] w-[34%] -translate-y-1/2 overflow-hidden rounded-3xl shadow-[0_10px_20px_-6px_rgba(0,0,0,0.5)]"
          style={{ left: card.left, rotate: `${card.rotate}deg` }}
          animate={
            reduced ? undefined : { x: isHovered ? card.dx : 0, y: isHovered ? -10 : 0 }
          }
          transition={FAN_SHIFT}
        >
          <span className="relative block h-full w-full">
            <Image src={card.src} alt="" fill sizes="180px" className="object-cover" />
          </span>
        </motion.span>
      ))}
    </div>
  );
}

/**
 * Rest/hover geometry for the community cluster, derived from the source
 * site's inlined CSS (`.framer-Eqqnh` "FloatingHeads" component, hover
 * variant `.framer-v-1wv413n`). The outer avatars sit ON the outer ring's
 * circumference — confirmed by solving for the container's true rendered
 * height against the source's raw percentages, which converges (variance
 * ~7px²) on every avatar landing within a few px of the ring's own radius.
 * Positions here are expressed as polar coordinates (angle + radius in px)
 * around the shared ring center, then converted to pixel `top`/`left` using
 * the container's OWN measured size — not a hardcoded percentage — so the
 * avatars land exactly on the ring regardless of the tile's actual rendered
 * aspect ratio. On hover the four outer avatars grow and drift further out
 * along their angle (radius grows); the centre avatar and rings grow in
 * place without moving.
 */
const RING_CENTER = { xPct: 50, yPct: 68.0272 };

/** Opacities bumped well past the source's own faint 0.6/0.4/0.2 so the orbit paths actually register. */
const COMMUNITY_RINGS: { restSize: number; hoverSize: number; opacity: number }[] = [
  { restSize: 313, hoverSize: 403, opacity: 0.95 },
  { restSize: 252, hoverSize: 303, opacity: 0.75 }, // halfway between centre avatar (192/204) and outer ring
  { restSize: 120, hoverSize: 155, opacity: 0.55 },
];

const OUTER_RING_REST_RADIUS = COMMUNITY_RINGS[0].restSize / 2; // 156.5px
const OUTER_RING_HOVER_RADIUS = COMMUNITY_RINGS[0].hoverSize / 2; // 201.5px

/** Cropped circular headshots sliced from `public/Avatar images.png`, served as WebP. */
const CENTER_AVATAR_SRC = "/Images/community/avatar-6.webp";

/** Angle measured clockwise from the positive x-axis (standard atan2 convention). */
const COMMUNITY_AVATARS: {
  angleDeg: number;
  restSize: number;
  hoverSize: number;
  gradientAngle: number;
  src: string;
}[] = [
  { angleDeg: -90, restSize: 62, hoverSize: 72, gradientAngle: 130, src: "/Images/community/avatar-1.webp" }, // top
  { angleDeg: -132, restSize: 62, hoverSize: 72, gradientAngle: 150, src: "/Images/community/avatar-2.webp" }, // upper-left
  { angleDeg: -48, restSize: 62, hoverSize: 72, gradientAngle: 170, src: "/Images/community/avatar-3.webp" }, // upper-right
  { angleDeg: -172, restSize: 62, hoverSize: 72, gradientAngle: 190, src: "/Images/community/avatar-4.webp" }, // lower-left
  { angleDeg: -12, restSize: 62, hoverSize: 72, gradientAngle: 210, src: "/Images/community/avatar-5.webp" }, // lower-right
];

/** Framer's default hover-variant spring — matches the source's motion feel. */
const COMMUNITY_SPRING = { type: "spring", stiffness: 500, damping: 60, mass: 1 } as const;

/**
 * Five avatars orbiting three concentric rings; bursts outward on hover.
 * `isHovered` is driven by the whole tile (see `Card`), so the burst plays
 * no matter where inside the card the pointer is — not just over the avatars.
 */
function Community({ isHovered }: { isHovered: boolean }) {
  const [box, setBox] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : COMMUNITY_SPRING;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () =>
      setBox({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cx = (RING_CENTER.xPct / 100) * box.width;
  const cy = (RING_CENTER.yPct / 100) * box.height;

  /**
   * Clamp the hover burst to the room actually available above/beside the
   * ring centre. Top/left/right are hard-clipped by the tile's
   * `overflow-hidden` with no fade mask (unlike the bottom, which fades),
   * so an unclamped burst can get sliced off on shorter or narrower tiles.
   */
  const RING_EDGE_PADDING = 12;
  /** The band's `pt-8` sits above this container, so that much extra room exists before the clip edge. */
  const TOP_PAD = 32;
  /** Avatars are centred on the orbit, so their own half-size sticks out past it. */
  const avatarHalf = Math.max(...COMMUNITY_AVATARS.map((a) => a.hoverSize)) / 2;
  const maxBurstRadius =
    box.width > 0 && box.height > 0
      ? Math.min(cx - avatarHalf, box.width - cx - avatarHalf, cy + TOP_PAD - avatarHalf) -
        RING_EDGE_PADDING
      : OUTER_RING_HOVER_RADIUS;
  const outerHoverRadius = Math.max(
    OUTER_RING_REST_RADIUS,
    Math.min(OUTER_RING_HOVER_RADIUS, maxBurstRadius)
  );
  const burstScale =
    (outerHoverRadius - OUTER_RING_REST_RADIUS) /
    (OUTER_RING_HOVER_RADIUS - OUTER_RING_REST_RADIUS);

  /** Places a circle's centre at `radius` px from the ring centre along `angleDeg`. */
  function orbitPosition(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { left: cx + radius * Math.cos(rad), top: cy + radius * Math.sin(rad) };
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Rings, anchored low like the source; grow in place on hover */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: cx, top: cy }}
      >
        {COMMUNITY_RINGS.map((ring, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-blush"
            style={{ opacity: ring.opacity }}
            animate={{
              width: isHovered ? ring.restSize + (ring.hoverSize - ring.restSize) * burstScale : ring.restSize,
              height: isHovered ? ring.restSize + (ring.hoverSize - ring.restSize) * burstScale : ring.restSize,
            }}
            transition={transition}
          />
        ))}
      </div>

      {/* Centre avatar; grows in place on hover */}
      <motion.span
        className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-blush"
        style={{ left: cx, top: cy }}
        animate={{
          width: isHovered ? 204 : 192,
          height: isHovered ? 204 : 192,
        }}
        transition={transition}
      >
        <span className="relative block h-full w-full">
          <Image
            src={CENTER_AVATAR_SRC}
            alt=""
            fill
            sizes="204px"
            className="object-cover"
          />
        </span>
      </motion.span>

      {box.width > 0 &&
        COMMUNITY_AVATARS.map((a, i) => {
          const rest = orbitPosition(a.angleDeg, OUTER_RING_REST_RADIUS);
          const hover = orbitPosition(
            a.angleDeg,
            OUTER_RING_REST_RADIUS + (OUTER_RING_HOVER_RADIUS - OUTER_RING_REST_RADIUS) * burstScale
          );
          const pos = isHovered ? hover : rest;
          return (
            <motion.span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-blush"
              animate={{
                left: pos.left,
                top: pos.top,
                width: isHovered ? a.restSize + (a.hoverSize - a.restSize) * burstScale : a.restSize,
                height: isHovered ? a.restSize + (a.hoverSize - a.restSize) * burstScale : a.restSize,
              }}
              transition={transition}
            >
              <span className="relative block h-full w-full">
                <Image
                  src={a.src}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </span>
            </motion.span>
          );
        })}
    </div>
  );
}

const leaderboardBase = leaderboard.slice(0, 5);

/** The row that always climbs to #1 on hover, and its boosted Glory value —
 * fixed by design (not derived from whichever row is hovered), landing just
 * above the resting #1's score so the new lead reads as believable. */
const RISING_ROW = "Pujopaglu";
const RISING_GLORY = 24900;

/**
 * Committee leaderboard rows, ranked by Glory points.
 *
 * Badge art is a placeholder: the reference screenshot's icons (octopus, fox,
 * globe, unicorn, sunglasses face, robot, each with its own colored ring)
 * couldn't be found in the project or sourced as exact matches online, so
 * Unicode emoji on a matching colored ring stand in until real assets land.
 *
 * Hovering anywhere on the tile sends the fixed RISING_ROW to #1 — the two
 * rows originally above it shift down one slot each; the row below it holds.
 * Its Glory number animates up to RISING_GLORY while risen. Mouse-out
 * restores the resting order and value. framer-motion's `layout` prop
 * FLIP-animates the position change on a smooth, no-bounce ease.
 */
function Leaderboard({ isHovered }: { isHovered: boolean }) {
  const reduced = useReducedMotion();

  const displayed = isHovered
    ? [
        leaderboardBase.find((row) => row.name === RISING_ROW)!,
        ...leaderboardBase.filter((row) => row.name !== RISING_ROW),
      ]
    : leaderboardBase;

  return (
    <div className="flex h-full w-full flex-col gap-1.5 px-8 pt-6">
      {displayed.map((row, index) => {
        const glory =
          isHovered && row.name === RISING_ROW ? RISING_GLORY : row.glory;

        return (
          <motion.div
            key={row.name}
            layout={!reduced}
            transition={{ layout: REORDER }}
            className="flex h-16 shrink-0 items-center gap-3 rounded-full border border-soft bg-surface pl-3 pr-4"
          >
            <span className="w-4 shrink-0 text-center text-sm text-muted">
              {index + 1}
            </span>
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-paper text-base leading-none"
              style={{ borderColor: row.ring }}
            >
              {row.emoji}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
              {row.name}
            </span>
            <span className="relative shrink-0 text-sm text-muted">
              <span className="relative inline-block overflow-hidden align-bottom">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={glory}
                    className="block"
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -6 }}
                    transition={GLORY_FADE}
                  >
                    {glory.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
              </span>
              {" Glory"}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * The phone fan's design canvas, transcribed from the source. Phones sit at
 * absolute `top`/`left` inside a fixed-size box rather than in a flex row, so
 * the fan's internal spacing is exact; the box is centred in the tile and the
 * tile's own `overflow-hidden` + fade mask crop it. 624×462 is the extent the
 * source's three 229px phones span.
 */
const TRIO_CANVAS = { width: 749, height: 554 } as const;
const PHONE_WIDTH = 275;

/**
 * Below `below` px of tile width the fan is scaled up past the fit-to-width
 * size by `boost`, so the phones (and the videos in them) stay legible on
 * phones. The tile keeps its size; the extra width bleeds off the sides and is
 * cropped by the band's `overflow-hidden`. Capped at natural size, so it
 * meets the unboosted scale at the threshold with no jump.
 */
const SMALL_TILE = { below: 520, boost: 1.7 } as const;

/**
 * Three phones at −7°, 0° and +12°, matching the source's fan.
 *
 * `top`/`left` are the source's resting offsets. On hover every phone rises
 * 10px and the outer two fan outward 10px (the middle only rises), which the
 * source does by swapping `top`/`left` outright — here it's a transform offset
 * instead, so the browser composites it without re-laying-out the fan.
 * Rotation is unchanged by hover, as in the source.
 */
const PHONES = [
  { rotate: -7, Screen: MoodDemoScreen, top: 30, left: 52, dx: -10 },
  { rotate: 0, Screen: DiscoverDemoScreen, top: 18, left: 247, dx: 0 },
  { rotate: 12, Screen: ToiletDemoScreen, top: 39, left: 422, dx: 10 },
] as const;

function PhoneTrio({ isHovered }: { isHovered: boolean }) {
  const reduced = useReducedMotion();
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /** Fits the fan to narrower tiles (boosted on small ones, see `SMALL_TILE`); never enlarges past its natural size. */
  const fit = containerWidth / TRIO_CANVAS.width;
  const scale =
    containerWidth > 0
      ? Math.min(1, containerWidth < SMALL_TILE.below ? fit * SMALL_TILE.boost : fit)
      : 1;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div
        className="absolute left-1/2 top-1/2"
        style={{ ...TRIO_CANVAS, transform: `translate(-50%, -30%) scale(${scale})` }}
      >
        {PHONES.map(({ rotate, Screen, top, left, dx }, i) => (
          <motion.div
            key={i}
            className={`absolute ${i === 2 ? "z-10" : ""}`}
            style={{ top, left, rotate: `${rotate}deg` }}
            animate={
              reduced ? undefined : { x: isHovered ? dx : 0, y: isHovered ? -10 : 0 }
            }
            transition={FAN_SHIFT}
          >
            <PhoneFrame
              width={PHONE_WIDTH}
              underlay={<Screen playing={isHovered} />}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Two landscape cards tilted −6° and +6°. */
function CardPair() {
  return (
    <div className="relative h-full w-full">
      <span
        className="absolute left-[8%] top-1/2 h-[58%] w-[72%] -translate-y-1/2 overflow-hidden rounded-3xl shadow-[0_10px_20px_-6px_rgba(0,0,0,0.5)]"
        style={{ rotate: "-6deg" }}
      >
        <Gradient angle={130} />
      </span>
      <span
        className="absolute left-[26%] top-1/2 h-[58%] w-[72%] -translate-y-1/2 overflow-hidden rounded-3xl shadow-[0_10px_20px_-6px_rgba(0,0,0,0.5)]"
        style={{ rotate: "6deg" }}
      >
        <Gradient angle={170} />
      </span>
    </div>
  );
}

/** Stacked notification toasts at 0.6 / 0.8 / 1.0 opacity. */
function Notifications() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 px-5">
      {notifications.map((n) => (
        <div
          key={n.title}
          className="flex items-center gap-3 rounded-3xl border border-soft bg-surface/55 p-3.5 backdrop-blur-[4px]"
          style={{ opacity: n.opacity }}
        >
          <span className="h-[53px] w-[53px] shrink-0 overflow-hidden rounded-[8.5px]">
            <Gradient angle={150} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate text-body-lg font-bold text-ink">
                {n.title}
              </span>
              <span className="shrink-0 text-sm text-muted">{n.time}</span>
            </span>
            <span className="mt-1 block truncate text-sm text-muted">
              {n.body}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

const visuals: Record<
  FeatureVisual,
  (props: { isHovered: boolean }) => React.JSX.Element
> = {
  photoStack: PhotoStack,
  community: Community,
  leaderboard: Leaderboard,
  phoneTrio: PhoneTrio,
  cardPair: CardPair,
  notifications: Notifications,
};

export function FeatureVisualRenderer({
  visual,
  isHovered,
}: {
  visual: FeatureVisual;
  /** Hover state of the whole tile (title + body included), not just this band. */
  isHovered: boolean;
}) {
  const Visual = visuals[visual];
  return (
    <div aria-hidden="true" className="h-full w-full">
      <Visual isHovered={isHovered} />
    </div>
  );
}
