/**
 * The one-shot signal that the homepage intro has handed the screen over.
 *
 * `Preloader` fires this the moment its clip-path reveal starts sweeping, and
 * `Hero` holds its entrance timeline paused until it resolves. The two are on
 * opposite sides of the tree with no common client ancestor — `layout.tsx` is a
 * server component with no providers at all — so this is a module global for
 * the same reasons `lenisInstance.ts` is one: the value is a de-facto singleton
 * (there is only ever one homepage intro), and a context would imply a nesting
 * and scoping story that does not exist here.
 *
 * WHY A PROMISE AND NOT A BOOLEAN. The consumer is always racing the producer.
 * `Hero` and `Preloader` are siblings in `page.tsx`, so their effects run in
 * tree order — but that order is not something either file should have to know
 * or depend on. A promise makes the race a non-issue in both directions: await
 * it before the sweep and you are queued, await it after and you resolve on the
 * next microtask.
 *
 * IDEMPOTENT BY CONSTRUCTION. `markIntroDone` can legitimately be called more
 * than once — the reveal's `onStart` fires it, and `release()` fires it again
 * on completion so the reduced-motion path (which never runs the reveal) is
 * covered by the same funnel. Resolving an already-settled promise is a no-op
 * per spec, so this needs no guard. Do not "fix" this into a boolean check;
 * the redundancy is what makes the reduced-motion path free.
 */

let resolveIntro!: () => void;

/** Resolves once the intro has yielded the screen. Never rejects. */
export const introDone = new Promise<void>((resolve) => {
  resolveIntro = resolve;
});

/**
 * Announce that the intro is done. Safe to call repeatedly; only the first
 * call has any effect. Called by `Preloader` only.
 */
export const markIntroDone = () => {
  resolveIntro();
};

/**
 * Whether a curtain exists that intends to release the gate itself.
 *
 * NOTHING GUARANTEES A PRELOADER EVER MOUNTS. It lives in `page.tsx`, not the
 * root layout, precisely so sub-routes skip it (see that file's "homepage only"
 * note). On a route without one, `introDone` would stay pending forever — and
 * because every gated element carries `motion-safe:opacity-0` in its markup to
 * prevent a FOUC, a gate that never resolves does not merely skip an animation.
 * It leaves the content permanently invisible: a silent, total failure.
 *
 * So consumers need a fallback — but a fallback on a *timer* is wrong, and was
 * the original bug here. The curtain deliberately holds the screen for ~2.3s
 * before its reveal begins, which is far longer than any sane timeout, so a
 * timed fallback fires on the homepage too and plays the hero entrance behind
 * the curtain: exactly the defect the gate exists to prevent, reintroduced by
 * its own safety net.
 *
 * The honest signal is not "has enough time passed" but "is anyone going to
 * call this". `Preloader` claims the gate synchronously during its render,
 * before any consumer effect runs — React renders `<Preloader />` ahead of
 * `<Hero />` in `page.tsx`, and all effects run after all renders in a commit,
 * so by the time `Hero` looks, the claim is always already there when a
 * curtain is on the page.
 */
let claimed = false;

/** Called by `Preloader` during render. Idempotent across re-renders. */
export const claimIntro = () => {
  claimed = true;
};

/**
 * The gate, as every consumer should await it.
 *
 * With a curtain on the page this is simply `introDone` — no deadline, because
 * the curtain owns the timing and is trusted to release it (both its normal
 * and reduced-motion paths funnel through one `release()`). With no curtain it
 * resolves immediately, so an un-gated route animates on mount as it always
 * did.
 */
export const waitForIntro = (): Promise<void> =>
  claimed ? introDone : Promise.resolve();
