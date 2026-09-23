import type Lenis from "lenis";

/**
 * The page's single Lenis instance, published for code that needs to pause it.
 *
 * `SmoothScroll` constructs Lenis inside an effect and is mounted exactly once
 * in the root layout, so the instance is already a de-facto singleton — it
 * binds to `window` and there is never more than one. Modelling it as a module
 * global is therefore honest; a React context would imply a nesting and
 * scoping story that does not exist, and would force `SmoothScroll` (which
 * renders `null`) to grow a provider for a value nothing renders.
 *
 * There is also an ordering reason. The preloader locks scrolling from a
 * *layout* effect, which React runs before `SmoothScroll`'s ordinary effect has
 * constructed Lenis — a context value would still be null at that moment. The
 * preloader instead reads `getLenis()` when it *unlocks*, ~1.75s later, by
 * which point the instance is always published.
 *
 * `null` IS A NORMAL STATE, NOT AN ERROR. `SmoothScroll` returns early under
 * `prefers-reduced-motion` and never constructs Lenis at all, so a reduced-
 * motion visitor runs the whole session with this unset. It is also null
 * before that first effect and after unmount. Every consumer must reach for it
 * optionally — `getLenis()?.stop()` — and must keep working when it is absent,
 * because for those visitors native scrolling is the correct behaviour anyway.
 */

let instance: Lenis | null = null;

/** Publish (or, with `null`, retract) the active instance. Called by `SmoothScroll` only. */
export const setLenis = (next: Lenis | null) => {
  instance = next;
};

/** The active instance, or `null` — see the note above; null is expected, not exceptional. */
export const getLenis = () => instance;
