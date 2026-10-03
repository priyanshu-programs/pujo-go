"use client";
import { STAGGER } from "@/lib/motion";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { screenMap } from "@/components/mockups/Screens";
import { howItWorksIntro, steps } from "@/content/steps";

/**
 * Three steps driving a fan of three phones. The active step's phone lifts to
 * the front (leftmost, largest, least tilted); the other two fan out to its
 * right on recessed depth planes with progressively stronger clockwise tilt.
 *
 * Rank mapping keeps the fan direction stable no matter which step is active:
 *   rank = (i - active + N) % N  →  0 = front, 1 = middle, 2 = back.
 * so the composition always reads as one fanned stack, never three separate
 * cards and never a single collapsed phone.
 */

/* ==========================================================================
 * PHONE FAN — tune the composition ONLY here.
 *
 * The fan OPENS to the right (like the reference): the front phone leans
 * slightly COUNTERclockwise, the middle stands near-upright, and the back
 * leans furthest clockwise. That increasing-tilt progression is what reads
 * as a fan — uniform clockwise tilt makes the phones look like parallel
 * posts. So: rotate must satisfy front < middle < back with front negative.
 *
 * FRONT  — active step. Leftmost + largest + z 30. Slight CCW lean, top edge
 *          starts highest of the three (stepped tops descend toward back).
 * MIDDLE — one plane behind. Right of front, ~96% scale, z 20.
 * BACK   — furthest plane. Further right, ~92% scale, z 10. Its right edge
 *          may bleed ~4% past the container (absorbed by the section's
 *          overflow-x-clip), echoing how the reference phone nears the edge.
 *
 * Knobs per phone:
 *   left / top … position inside .phone-composition (percent of container).
 *                Overlap is driven by these: front covers ~50% of the
 *                middle's width, middle covers ~50% of the back's width —
 *                dense, with no background gaps between frames.
 *                Applied as an `x`/`y` transform on a full-size slot, NOT as
 *                CSS left/top — see the slot comment in the render. The
 *                numbers stay container-relative percentages either way.
 *   rotate    … tilt in degrees, CCW negative / CW positive.
 *   scale     … relative size (front 1.0 > middle > back, kept close so the
 *               three read as one family photographed together).
 *   z         … layering. Front must stay highest.
 *   fadeStop  … bottom dissolve height as % of the composition (soft mask).
 *               The container is deliberately SHORTER than the phones, so
 *               their bottoms run past it and dissolve — never a hard end.
 * ========================================================================== */
const PHONE_FAN = {
  /** Base frame width (px) — passed to PhoneFrame for its cutout math; the
   *  visible size difference comes from `scale`, so corner radii stay exact.
   *  Kept small enough that the back phone's rotated corners stay inside the
   *  viewport at narrow desktop widths (see the composition margin note). */
  baseWidth: 330,
  /** Bottom dissolve: mask stays opaque above this, fading out below it. */
  fadeStop: 30,
  front: { left: "0%", top: "2%", rotate: -5, scale: 1, z: 30 },
  middle: { left: "27%", top: "5%", rotate: 3, scale: 0.96, z: 20 },
  back: { left: "51%", top: "8%", rotate: 11, scale: 0.92, z: 10 },
} as const;

/** Rank → pose lookup: index 0 = front, 1 = middle, 2 = back. */
const FAN_RANKS = [PHONE_FAN.front, PHONE_FAN.middle, PHONE_FAN.back] as const;

/* ==========================================================================
 * SWEEP — how a step change is performed.
 *
 * The fan is a CONVEYOR, not a carousel. On a step change the front phone is
 * swept out of the card to the left and destroyed — it never flies back in
 * and never rejoins the stack. The other two glide left into the space it
 * left, and a BRAND-NEW phone is dealt in from the right, so three frames are
 * on screen throughout. (Each card's React key carries a per-step generation
 * counter, so the swept card is genuinely unmounted and its replacement is a
 * fresh element — "never rejoins" literally, not cosmetically.)
 *
 * The three motions overlap: the exit starts immediately, the survivors
 * follow after `settleDelay` — which is what makes them read as closing a gap
 * rather than travelling with it — and the new card trails by `enterDelay`.
 *
 * Nothing here overshoots. `EASE_GLIDE` decelerates for a long time and stops
 * dead; the Dhak beat used elsewhere on the site peaks past its target, which
 * reads as a bounce on frames this large.
 * ========================================================================== */

/** easeOutQuint — decisive start, long settle, never crosses its target. */
const EASE_GLIDE = [0.22, 1, 0.36, 1] as const;
/** Plain ease-in, so the exit accelerates away instead of drifting off. */
const EASE_SWEEP = [0.42, 0, 1, 1] as const;

const SWEEP = {
  /* ---- the phone leaving --------------------------------------------- */
  exitDuration: 0.8,
  /** Far enough left to clear the card entirely, in its own widths. */
  exitX: "-150%",
  /** It holds full opacity until here (fraction of the exit), then dissolves
   *  MID-FLIGHT and is gone by `fadeGoneBy` — it fades while moving, and is
   *  never seen stopping. This fade, not a clip, is also what keeps it from
   *  being seen drifting over the step copy: nothing clips this composition
   *  horizontally, since overflow must stay visible for the frames to run
   *  past the bottom mask. */
  fadeHoldUntil: 0.28,
  fadeGoneBy: 0.85,
  /** A gentle extra CCW drift on the way out — a glide, not a flick. */
  exitRotate: -12,
  /** Slight shrink, so leaving reads as depth as well as distance. */
  exitScale: 0.94,
  /** Above every fan plane, so it passes over the others, never under. */
  liftZ: 40,

  /* ---- the phones staying, and the one arriving ------------------------ */
  glideDuration: 0.7,
  /** Beat before the survivors move into the freed space. */
  settleDelay: 0.14,
  /** Where the new phone is dealt in from, right of its landing slot. */
  enterX: "46%",
  /** It trails the survivors slightly, so the stack re-forms front-to-back. */
  enterDelay: 0.2,
} as const;

/** A phone mid-sweep: already out of the fan, still on screen, about to be
 *  unmounted. Rendered outside the rank system entirely. */
type Ghost = { uid: number; step: number };

/** Direction the last arrow press moved, or `null` before any press. */
type Dir = "next" | "prev" | null;

/** Mobile card motion. Built from the fan's own numbers (`SWEEP`, `EASE_*`)
 *  so the card and the phones above it fade and ease identically:
 *  - enter: fades in on EASE_GLIDE, opacity trailing by `enterDelay`
 *  - exit: fades out on EASE_SWEEP, holding full opacity until `fadeHoldUntil`
 *    then dissolving by `fadeGoneBy` — the same curve as the phone leaving.
 *  The card travels the same distance it enters from (`enterX`), in the
 *  direction of the arrow, and exits the opposite way, along the conveyor. */
function makeCardVariants(reduced: boolean): Variants {
  const t = (seconds: number) => (reduced ? 0 : seconds);
  const travel = (dir: Dir) => (dir === "prev" ? `-${SWEEP.enterX}` : SWEEP.enterX);
  return {
    enter: (dir: Dir) => ({ x: travel(dir), opacity: 0 }),
    center: {
      x: "0%",
      opacity: 1,
      transition: {
        x: { duration: t(SWEEP.glideDuration), ease: EASE_GLIDE },
        opacity: {
          duration: t(SWEEP.glideDuration),
          ease: EASE_GLIDE,
          delay: t(SWEEP.enterDelay),
        },
      },
    },
    exit: (dir: Dir) => ({
      x: travel(dir === "prev" ? "next" : "prev"),
      opacity: [1, 1, 0, 0],
      transition: {
        x: { duration: t(SWEEP.exitDuration), ease: EASE_SWEEP },
        opacity: {
          duration: t(SWEEP.exitDuration),
          times: [0, SWEEP.fadeHoldUntil, SWEEP.fadeGoneBy, 1],
          ease: ["linear", "easeInOut", "linear"],
        },
      },
    }),
  };
}

/** A step's copy. Used by the desktop list and the mobile card, so the two
 *  can't drift apart. The glow is only on the active step. */
function StepCard({
  title,
  body,
  isActive,
}: {
  title: string;
  body: string;
  isActive: boolean;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`bg-card-glow pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isActive ? "opacity-40" : "opacity-0 group-hover:opacity-40"
        }`}
      />
      <span className="relative flex flex-col gap-2">
        <span className="text-body-lg font-bold text-ink">{title}</span>
        <span
          className={`text-base text-ink transition-opacity duration-300 ${
            isActive ? "opacity-60" : "opacity-50"
          }`}
        >
          {body}
        </span>
      </span>
    </>
  );
}

/** One style for both mobile arrows. Enabled matches the site's outline button
 *  (`variants.outline` in ui/Button.tsx): an `ink` ring and glyph, transparent
 *  fill, `ink/5` on hover. Disabled drops to the surface with a muted glyph,
 *  so the end of the list reads as "nothing there". */
const arrowClass =
  "flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-transparent text-ink transition-colors duration-300 hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default disabled:border-soft disabled:bg-surface/40 disabled:text-muted/50 disabled:hover:bg-surface/40";

/** Chevron for the mobile prev/next arrows. Written inline because the repo
 *  carries no icon set — `Logo` and `StoreIcons` are the only SVGs in `ui/`,
 *  and two paths don't justify a dependency. `currentColor` lets each button
 *  own its own tint. */
function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === "prev" ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  /* One generation per step. Bumping a step's counter changes its card's key,
     which unmounts that card and mounts a fresh one in its place — the swept
     phone is destroyed, and what arrives on the right is a new element. */
  const [gen, setGen] = useState(() => steps.map(() => 0));
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const uid = useRef(0);
  /* `initial` only applies at mount, so it would deal all three cards in on
     first paint. The fan's arrival is already handled by the Reveals around
     it, so the entry animation is armed only after that first render. */
  const mounted = useRef(false);
  const reduced = useReducedMotion();
  /* Which arrow was last pressed. Below `lg` the mobile card travels in that
     direction. `null` until the first press; `AnimatePresence initial={false}`
     then keeps the first card from animating on page load. */
  const [dir, setDir] = useState<Dir>(null);
  const cardVariants = makeCardVariants(!!reduced);

  useEffect(() => {
    mounted.current = true;
  }, []);

  const select = (next: number) => {
    if (next === active) return;
    if (!reduced) {
      /* The outgoing front phone leaves the rank system here and lives on as
         a ghost until its sweep finishes. Fast clicks just queue more. */
      setGhosts((g) => [...g, { uid: uid.current++, step: active }]);
      setGen((g) => g.map((v, i) => (i === active ? v + 1 : v)));
    }
    setActive(next);
  };

  return (
    <section
      id="howitworks"
      className="overflow-x-clip rounded-t-section bg-gradient-to-b from-blush to-paper py-20 md:py-32"
    >
      <div className="shell flex flex-col gap-20">
        <div className="flex flex-col gap-6">
          <Reveal>
            <h2 className="text-display-2 max-w-full font-display text-ink">
              {howItWorksIntro.title}
            </h2>
          </Reveal>
          <Reveal delay={STAGGER}>
            <p className="max-w-[362px] text-body-lg text-muted">
              {howItWorksIntro.body}
            </p>
          </Reveal>
        </div>

        {/*
         * Below `lg` this reads fan → arrows → active step card (the source's
         * mobile variant); at `lg` it becomes the two-column split with the
         * step list on the left. `order-*` does both: grid items honour it, so
         * the `lg:order-*` pair simply cancels the mobile ordering and the
         * columns land in DOM-independent positions.
         */}
        <div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-split lg:items-stretch lg:gap-16">
          {/* Step list — desktop only. Below `lg` the active step is shown alone
              in the stack beside it, which is what carries the animation. */}
          <div className="hidden lg:order-1 lg:flex lg:w-full lg:flex-col lg:justify-center lg:gap-9">
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-colors duration-300 ${
                    isActive ? "bg-surface" : "hover:bg-surface/40"
                  }`}
                >
                  <StepCard title={step.title} body={step.body} isActive={isActive} />
                </button>
              );
            })}
          </div>

          {/* Mobile card — the active step alone. It animates with the same
              fade and easing as the fan above it (see `CARD`). `overflow-hidden`
              clips the card as it travels, so it never spills past the gutter. */}
          <div className="relative order-3 w-full overflow-hidden lg:hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full overflow-hidden rounded-2xl bg-surface p-6 text-left"
              >
                <StepCard
                  title={steps[active].title}
                  body={steps[active].body}
                  isActive
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/*
           * .phone-composition — the fan's dedicated relative wrapper, anchored
           * to the right of the split row so the left column stays open for
           * copy. Each .phone inside is absolutely positioned from PHONE_FAN
           * (never flex-spaced), so the three frames overlap as one object.
           * The wrapper is deliberately SHORTER than the phones: their bottoms
           * run past it and the bottom mask dissolves them into the section
           * background over the lower `fadeStop`% — a dissolve, never a cut.
           * The right margin keeps the back phone's rotated corners (which
           * reach past its layout box) inside the viewport; without it the
           * section's overflow-x-clip would slice the edge phone.
           * Fluid heights via clamp(): same fan shape on desktop, tablet and
           * mobile (scaled, not vertically stacked).
           */}
          <div
            aria-hidden="true"
            className="phone-composition relative order-1 ml-auto h-[clamp(440px,115vw,560px)] w-full min-w-0 max-w-[680px] lg:order-2 lg:mr-[clamp(32px,4vw,64px)] lg:h-[clamp(480px,38vw,580px)]"
            style={{
              maskImage: `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) ${PHONE_FAN.fadeStop}%)`,
              WebkitMaskImage: `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) ${PHONE_FAN.fadeStop}%)`,
              /* The mask makes this one composited group; without its own layer
                 the whole group re-rasterizes on every frame of a sweep. */
              transform: "translateZ(0)",
            }}
          >
            {steps.map((step, i) => {
              const Screen = screenMap[step.screen];
              /* Rank, not index, owns the pose — the active phone is always
                 front, the next wraps to middle, the last to back. */
              const rank = (i - active + steps.length) % steps.length;
              const pose = FAN_RANKS[rank];

              return (
                /*
                 * SLOT — exactly the size of .phone-composition, which is what
                 * lets the pose be a composited transform instead of animated
                 * left/top (layout on every frame, under a mask, with three
                 * drop-shadows: the judder). A percentage `x` resolves against
                 * the element's OWN width, so a full-size slot makes `x` a 1:1
                 * replacement for the old container-relative `left` at every
                 * viewport width — with nothing to measure, so the resting
                 * pose is already correct in the SSR'd HTML.
                 */
                <motion.div
                  /* The generation is what makes a swept phone gone for good:
                     its key changes, React unmounts it, and the card that
                     arrives on the right is a new element that happens to
                     carry the same screen. */
                  key={`${step.id}-${gen[i]}`}
                  className="pointer-events-none absolute inset-0"
                  style={{ willChange: "transform" }}
                  /* A freshly keyed card must APPEAR in its slot — the deal-in
                     belongs to the inner card. Survivors keep their key, so
                     for them this is the glide. */
                  initial={false}
                  /* `pose` is spread field by field on purpose: its `z` is a
                     stacking plane, and framer would read a bare `z` as a 3D
                     translateZ. */
                  animate={{ x: pose.left, y: pose.top, zIndex: pose.z }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          duration: SWEEP.glideDuration,
                          ease: EASE_GLIDE,
                          delay: SWEEP.settleDelay,
                          /* Layering must swap cleanly — a tweened zIndex
                             would cross planes mid-flight and flicker — but it
                             stays delayed to the moment the glide starts, or
                             the planes pop while the fan is still at rest. */
                          zIndex: { duration: 0, delay: SWEEP.settleDelay },
                        }
                  }
                >
                  <motion.div
                    className="phone absolute left-0 top-0 w-[min(52%,330px)] max-lg:w-[min(76%,330px)]"
                    /* Centre origin: the slot owns the position, so rotation
                       tilts each frame in place instead of swinging the whole
                       stack (which would break the tuned overlap). */
                    style={{
                      transformOrigin: "center center",
                      willChange: "transform, opacity",
                    }}
                    /* Applied at mount only — so the two survivors ignore it
                       and just glide, while the freshly keyed card is dealt in
                       from the right. Off on first paint (see `mounted`). */
                    initial={
                      mounted.current && !reduced
                        ? {
                            x: SWEEP.enterX,
                            opacity: 0,
                            rotate: pose.rotate,
                            scale: pose.scale,
                          }
                        : false
                    }
                    animate={{
                      x: "0%",
                      opacity: 1,
                      rotate: pose.rotate,
                      scale: pose.scale,
                    }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: SWEEP.glideDuration,
                            ease: EASE_GLIDE,
                            delay: SWEEP.settleDelay,
                            /* The arriving card trails the survivors, so the
                               stack re-forms front-to-back. */
                            opacity: {
                              duration: SWEEP.glideDuration,
                              ease: EASE_GLIDE,
                              delay: SWEEP.enterDelay,
                            },
                          }
                    }
                  >
                    {/*
                     * Frame + screen contents are existing assets, rendered
                     * untouched: only wrapper position / scale / rotation /
                     * layering change. width:100% lets the wrapper own the
                     * fluid size while baseWidth keeps the cutout math exact
                     * (visual sizing comes from animated `scale`, so the
                     * aspect ratio is never distorted).
                     */}
                    <PhoneFrame
                      width={PHONE_FAN.baseWidth}
                      style={{ width: "100%" }}
                      underlay={<Screen playing={rank === 0} />}
                    />
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Phones on their way out. They sit outside the rank system —
                pinned to the front pose they were holding when they were
                dropped — and are unmounted the moment the sweep ends. */}
            {ghosts.map((ghost) => {
              const Screen = screenMap[steps[ghost.step].screen];
              const from = PHONE_FAN.front;

              return (
                /* Same slot structure as the fan cards, so both express a pose
                   the one way. This one never animates — the ghost is pinned to
                   the front slot and only its card moves. */
                <div
                  key={`ghost-${ghost.uid}`}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    transform: `translate(${from.left}, ${from.top})`,
                    zIndex: SWEEP.liftZ,
                  }}
                >
                  <motion.div
                    className="phone absolute left-0 top-0 w-[min(52%,330px)] max-lg:w-[min(76%,330px)]"
                    style={{
                      transformOrigin: "center center",
                      willChange: "transform, opacity",
                    }}
                    initial={{
                      x: "0%",
                      opacity: 1,
                      rotate: from.rotate,
                      scale: from.scale,
                    }}
                    animate={{
                      x: SWEEP.exitX,
                      /* Keyframes, not a plain target: the hold-then-dissolve
                         shape below needs its own `times`. */
                      opacity: [1, 1, 0, 0],
                      rotate: SWEEP.exitRotate,
                      scale: SWEEP.exitScale,
                    }}
                    transition={{
                      duration: SWEEP.exitDuration,
                      ease: EASE_SWEEP,
                      /* Opacity runs its own clock: solid for the first stretch
                         of the travel, then dissolving mid-flight, fully gone
                         before the motion ends. Never seen stopping. */
                      opacity: {
                        duration: SWEEP.exitDuration,
                        times: [0, SWEEP.fadeHoldUntil, SWEEP.fadeGoneBy, 1],
                        ease: ["linear", "easeInOut", "linear"],
                      },
                    }}
                    onAnimationComplete={() =>
                      setGhosts((g) => g.filter((x) => x.uid !== ghost.uid))
                    }
                  >
                    <PhoneFrame
                      width={PHONE_FAN.baseWidth}
                      style={{ width: "100%" }}
                      underlay={<Screen />}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/*
           * Mobile prev/next, matching the source's mobile variant. It lives
           * INSIDE the split row (order-2, between the fan and the card) so the
           * row's own gap keeps it tucked under the phones; as a sibling of the
           * row it was a full `gap-20` adrift from everything. `lg:hidden`
           * drops it from the grid entirely at desktop.
           */}
          <div className="order-2 flex items-center justify-center gap-3 lg:hidden">
            {/* Both arrows share one style. Enabled means there is a card that
                way; at the ends the arrow goes quiet and is disabled rather than
                wrapping. The tint is a low-alpha accent, so it reads as part of
                the section's dark-red glow instead of a focal point. */}
            <button
              type="button"
              disabled={active === 0}
              onClick={() => {
                setDir("prev");
                select(active - 1);
              }}
              aria-label="Previous step"
              className={arrowClass}
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              disabled={active === steps.length - 1}
              onClick={() => {
                setDir("next");
                select(active + 1);
              }}
              aria-label="Next step"
              className={arrowClass}
            >
              <Chevron dir="next" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
