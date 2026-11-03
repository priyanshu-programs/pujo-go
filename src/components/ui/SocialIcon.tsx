/**
 * Brand glyphs shared by the footer socials and the team cards. Single-colour
 * (`fill-current`), so the caller's text colour paints them. Decorative only:
 * the surrounding link carries the accessible name.
 */
export type SocialName = "instagram" | "facebook" | "twitter" | "linkedin";

const icons: Record<SocialName, { viewBox: string; d: string }> = {
  instagram: {
    viewBox: "0 0 256 256",
    d: "M176 24H80a56.06 56.06 0 0 0-56 56v96a56.06 56.06 0 0 0 56 56h96a56.06 56.06 0 0 0 56-56V80a56.06 56.06 0 0 0-56-56Zm-48 152a48 48 0 1 1 48-48 48.05 48.05 0 0 1-48 48Zm60-96a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm-28 48a32 32 0 1 1-32-32 32 32 0 0 1 32 32Z",
  },
  facebook: {
    viewBox: "0 0 256 256",
    d: "M232 128a104.16 104.16 0 0 1-91.55 103.26 4 4 0 0 1-4.45-4V152h24a8 8 0 0 0 8-8.53 8.17 8.17 0 0 0-8.25-7.47H136v-24a16 16 0 0 1 16-16h16a8 8 0 0 0 8-8.53 8.17 8.17 0 0 0-8.27-7.47H152a32 32 0 0 0-32 32v24H96a8 8 0 0 0-8 8.53 8.17 8.17 0 0 0 8.27 7.47H120v75.28a4 4 0 0 1-4.44 4 104.15 104.15 0 0 1-91.49-107.19c2-54 45.74-97.9 99.78-100A104.12 104.12 0 0 1 232 128Z",
  },
  twitter: {
    viewBox: "0 0 24 24",
    d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.31 17.403Z",
  },
  // Bare "in" mark (no box), so it sits cleanly inside a round button.
  linkedin: {
    viewBox: "0 0 24 24",
    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z",
  },
};

export function SocialIcon({ name, className }: { name: SocialName; className?: string }) {
  const { viewBox, d } = icons[name];
  return (
    <svg viewBox={viewBox} className={`fill-current ${className ?? ""}`} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
