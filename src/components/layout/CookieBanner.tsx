"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { waitForIntro } from "@/components/layout/introGate";

/**
 * Cookie card, bottom-right. Layout from the supplied reference, recoloured to
 * the site theme (surface card, blush offset shadow, accent Accept button), "Cookies" title with a close X, copy,
 * a black Accept and a grey Preferences button, and a cookie illustration.
 *
 * Shown once per device until the visitor chooses; the choice is kept in
 * localStorage. Closing with X counts as "essential only". On the homepage it
 * waits for the intro curtain so it never pops in underneath it.
 */
const STORAGE_KEY = "pujogo-cookies";
const SHOW_DELAY_MS = 2000;

type Choice = { essential: true; optional: boolean };

function save(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...choice, ts: Date.now() }));
  } catch {
    // Storage blocked: the card simply shows again next visit.
  }
}

function CookieArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="60" fill="#F2B06E" />
      {[
        [38, 18, 3.5], [60, 22, 4.5], [84, 26, 4.5], [40, 40, 6], [78, 50, 6.5],
        [24, 56, 4.5], [104, 56, 4.5], [52, 66, 4.5], [88, 76, 4.5], [26, 84, 6],
        [62, 92, 6], [90, 100, 4], [50, 110, 4.5],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#8A5039" />
      ))}
    </svg>
  );
}

export function CookieBanner() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [optional, setOptional] = useState(true);
  const titleId = useId();
  const switchId = useId();

  // Rolls in SHOW_DELAY_MS after the page (and, on the homepage, the intro
  // curtain) has settled, so it never competes with the first impression.
  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    waitForIntro().then(() => {
      if (!live) return;
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(STORAGE_KEY);
      } catch {}
      if (!stored) timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    });
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, []);

  const close = (choice: Choice) => {
    save(choice);
    setOpen(false);
  };

  const btn =
    "inline-flex h-8 flex-1 items-center justify-center rounded-full px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24, y: 24 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 left-4 z-[90] sm:left-auto sm:bottom-6 sm:right-6 sm:w-[18.75rem]"
        >
          <div className="relative rounded-2xl border border-soft bg-surface p-4 text-ink shadow-[6px_6px_0_0_var(--color-blush)]">
            <button
              type="button"
              aria-label="Close"
              onClick={() => close({ essential: true, optional: false })}
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <h2 id={titleId} className="font-body text-lg font-bold text-ink">
                  Cookies
                </h2>

                {prefs ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-4 rounded-lg bg-soft px-2.5 py-1.5">
                      <span className="text-xs font-semibold">Essential</span>
                      <span className="text-xs text-muted">Always on</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-lg bg-soft px-2.5 py-1.5">
                      <label htmlFor={switchId} className="text-xs font-semibold">
                        Media &amp; experience
                      </label>
                      <span className="relative inline-flex">
                        <input
                          id={switchId}
                          type="checkbox"
                          role="switch"
                          checked={optional}
                          onChange={(e) => setOptional(e.target.checked)}
                          className="peer h-4 w-7 cursor-pointer appearance-none rounded-full bg-muted/40 transition-colors checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-0.5 top-0.5 size-3 rounded-full bg-white transition-transform peer-checked:translate-x-3"
                        />
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs leading-snug text-muted">
                    We use cookies to run the site and play videos.{" "}
                    <Link href="/privacy" className="text-ink underline underline-offset-2 hover:text-accent">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                )}

                <div className="flex gap-2 pt-0.5">
                  {prefs ? (
                    <button
                      type="button"
                      className={`${btn} bg-accent text-white hover:bg-accent/90`}
                      onClick={() => close({ essential: true, optional })}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`${btn} bg-accent text-white hover:bg-accent/90`}
                      onClick={() => close({ essential: true, optional: true })}
                    >
                      Accept
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${btn} bg-soft text-ink hover:bg-soft/70`}
                    onClick={() => setPrefs((p) => !p)}
                    aria-expanded={prefs}
                  >
                    {prefs ? "Back" : "Preferences"}
                  </button>
                </div>
              </div>

              <CookieArt className="hidden size-14 shrink-0 sm:block" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
