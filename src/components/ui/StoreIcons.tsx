/**
 * Glyphs for the Pujo Go store CTAs, shared by the hero and the navbar so the
 * two Play Store pills stay identical.
 */

/**
 * The Google Play mark, monochrome so it inherits the button's colour like the
 * other white glyphs. Official geometry from Simple Icons (CC0).
 */
export function PlayStoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"
      />
    </svg>
  );
}

/** White disc with a black play triangle — the "Watch Video" affordance. */
export function WatchVideoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 50"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="25" cy="25" r="25" fill="#ffffff" />
      <path d="M20 16.5 35 25l-15 8.5v-17Z" fill="#000000" />
    </svg>
  );
}
