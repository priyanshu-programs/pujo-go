"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials, testimonialsIntro } from "@/content/testimonials";
import type { Testimonial } from "@/content/testimonials";

/** Pixels per second the marquee travels — tune feel here, not per-card. */
const SPEED_PX_PER_S = 40;

/** Generic person silhouette, standing in for a real avatar photo. */
function PersonAvatarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[60%] w-[60%] text-ink/70"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const gradient = `linear-gradient(${item.angle}deg, #1a1a1a, #fe0000)`;

  return (
    <figure className="group relative flex h-full min-h-[23.75rem] flex-col justify-between overflow-hidden rounded-card border border-soft bg-surface p-8">
      <span
        aria-hidden="true"
        className="bg-card-glow pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80"
      />
      <div className="relative flex flex-col gap-6">
        <span
          aria-hidden="true"
          className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full"
          style={{ background: gradient }}
        >
          <PersonAvatarIcon />
        </span>
        <blockquote className="text-body-lg text-ink">{item.quote}</blockquote>
      </div>
      <figcaption className="relative text-body-lg font-bold text-ink">
        {item.name}
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [loopWidth, setLoopWidth] = useState(0);
  const x = useMotionValue(0);

  // The track renders the testimonial list twice back to back; looping `x`
  // by exactly one list's width (list + its gap to the second copy) makes
  // the seam invisible — the moment copy 1 has scrolled fully out of view,
  // copy 2 sits exactly where copy 1 started.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setLoopWidth(track.scrollWidth / 2);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Runs one leg from x's current value down to -loopWidth, then wraps back
  // to 0 and starts the next leg — reading as one seamless, uninterrupted
  // loop across every hover pause/resume rather than a repeating tween that
  // would snap back to 0 whenever it restarts. Held in a ref so the hover
  // handlers below can resume the same loop on demand.
  const activeAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const runLeg = useRef<() => void>(() => {});

  useEffect(() => {
    runLeg.current = () => {
      const from = x.get();
      const remaining = loopWidth + from;
      activeAnimation.current = animate(x, [from, -loopWidth], {
        duration: remaining / SPEED_PX_PER_S,
        ease: "linear",
        onComplete: () => {
          x.set(0);
          runLeg.current();
        },
      });
    };
  }, [loopWidth, x]);

  // Only runs while the section is on screen — an always-on marquee costs
  // frames on phones even when nobody can see it.
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // WCAG 2.2.2: auto-moving content needs a way to stop it. Hover and keyboard
  // focus pause it for the moment; the button pauses it until pressed again
  // (the only option on touch screens).
  const [userPaused, setUserPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const running = !reduced && loopWidth > 0 && inView && !userPaused && !held;

  useEffect(() => {
    if (!running) return;
    runLeg.current();
    return () => activeAnimation.current?.stop();
  }, [running]);

  return (
    <section ref={sectionRef} id="testimonials" className="rounded-section py-20 md:py-32">
      <div className="shell flex flex-col gap-20">
        <Reveal className="flex items-end justify-between gap-6">
          <h2 className="text-display-2 font-display text-ink">
            {testimonialsIntro.title}
          </h2>
          {!reduced && (
            <button
              type="button"
              aria-pressed={userPaused}
              aria-label={userPaused ? "Play testimonials" : "Pause testimonials"}
              onClick={() => setUserPaused((p) => !p)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-soft bg-surface text-ink transition-colors hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                {userPaused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zm6 0h4v14h-4z" />}
              </svg>
            </button>
          )}
        </Reveal>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          <motion.div ref={trackRef} className="flex w-max gap-4" style={{ x }}>
            {[...testimonials, ...testimonials].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="w-[min(20rem,calc(100vw-2.5rem))] shrink-0 md:w-[22.5rem]"
                aria-hidden={i >= testimonials.length}
              >
                <TestimonialCard item={item} />
              </div>
            ))}
          </motion.div>

          {/* Edge fades — mask the hard clip from overflow-hidden so cards
              dissolve into the page background instead of cutting off. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-paper to-transparent md:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-paper to-transparent md:w-32"
          />
        </div>
      </div>
    </section>
  );
}
