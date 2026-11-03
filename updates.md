# Updates

Log every code change or notable update here, most recent first. See `CLAUDE.md` for the workflow rules and `plan.md` for what's planned.

## 2026-11-03 — Team roles set

- `src/content/team.ts`: real role tags, in card order: Rahul (Graphic Designer), Sourik (Co-Creator, Backend Developer), Sashikant (Co-Creator, Lead App Developer), Nirvik (Co-Creator, Dev Ops Lead), Priyanshu (Website Designer, Developer), Rudranil (Co-Creator, Product Lead).

## 2026-11-03 — Team page: header and handle bubble removed

- `src/app/team/page.tsx`: removed the "Meet the team" title/lede hero section and the red `@handle` hover bubble on each card. The grid section now takes `pt-[208px]` (160px `pt-navbar-lg` + 30%, per the user) so cards clear the fixed navbar. `teamHeader.lede` is still used for page metadata; `handle` stays in `team.ts` data, unrendered.

## 2026-11-03 — Team photos optimised

- `public/Images/Team/`: replaced the 6 source JPEGs (~1.6 MB, Priyanshu's alone 1.4 MB) with AVIFs (`rahul`, `sourik`, `sashikant`, `nirvik`, `priyanshu`, `rudranil`), 41-94 KB each (~410 KB total). Center-cropped to 4:5 (same crop the card's `object-cover` applies), downscaled to max 840x1050 (2x the card), never upscaled, quality 84 / effort 6. Originals deleted.
- `src/content/team.ts`: `teamMembers` reordered to Rahul, Sourik, Sashikant, Nirvik, Priyanshu, Rudranil.

## 2026-11-03 — Team tab and `/team` page (placeholders)

- `src/content/site.ts`: `navLinks` gains **Team** (`/team`) between Features and Contact; also added to the footer Navigation column. Navbar desktop row and mobile sheet read the array, so no Navbar edit.
- `src/content/team.ts` (new): placeholder `teamHeader`, 6 `teamMembers` (name, roles, optional `handle`, optional `image`), 3 `teamStats`. Replace with real details later.
- `src/app/team/page.tsx` (new): header (same pattern as `/contact`), 3x2 portrait grid (1/2/3 cols by breakpoint) with bottom-left `#role` pills and an accent `@handle` speech-bubble, then 3 stat tiles (dark / accent / light), then `Cta`. Without an `image` a gradient placeholder shows; with one, it renders grayscale like the reference. The red accent stands in for the reference's orange. `/team/join` untouched.
- Not verified in a browser.
- Follow-up (same day): removed the three stat tiles (and `teamStats`/`TeamStat`). The red `@handle` bubble is now hidden by default and fades in on hover (`group-hover`) on any card; every placeholder member has a `handle`. Touch devices have no hover, so the handle won't show there.

- Photos (same day): the 6 files in `public/Images/Team/` were center-cropped to 4:5 (the card ratio), resized to max 840×1050 (never upscaled) and converted with `sharp` to AVIF q55 (3.8–41 KB each, down from 16 KB–1.6 MB originals). Originals deleted; only `nirvik/priyanshu/rahul/rudranil/sashikant/sourik.avif` remain. Wired through `image` in `src/content/team.ts`, and member names now come from the filenames (roles/handles still placeholders). `sashikant.avif` is only 160×200 because the source was 200×200, so it will look soft on large cards; a higher-res original would fix it.

- Removed the `grayscale` filter from team photos; they show in full colour.

## 2026-10-04 — CTA: only the central phone below `md`, enlarged

- `Cta.tsx`: each phone entry now carries its own `box`/`scale` classes. Side phones are `hidden md:block` (not shown below 768px). The central phone's scale goes `0.5/0.65` → `scale-[0.95] sm:scale-110`, then `md:scale-[0.65] lg:scale-100` as before. The stack wrapper is `h-[580px] sm:h-[680px]` below `md` (was `h-[460px]`) so the larger phone isn't clipped. `md`+ is unchanged.
- Not verified in a browser.

## 2026-10-04 — CTA side phones: static "get started" screens; stale assets removed

- Converted the user's `get started left/right screen.jpeg` (1264×2780, 699 KB / 1.19 MB) with `sharp` to `public/Images/get-started-left.avif` / `get-started-right.avif`: 640×1408 (the screen is ~237 CSS px wide, so 640 covers ~2.7× DPR), AVIF q55 effort 6 → 42.6 KB / 63.3 KB. Text and map labels checked visually, still sharp.
- `Screens.tsx`: `GetStartedScreen` became a private `StaticScreen({ src })`, exported as `GetStartedLeftScreen` / `GetStartedRightScreen`. `Cta.tsx`: side phones use them (they previously played the choose/progress demos); the `playing` flag on the phone entries is gone. Central YouTube phone untouched. `ChooseDemoScreen`/`ProgressDemoScreen` stay, as How It Works uses them.
- Deleted, all unreferenced: the two source JPEGs, `get-started.avif`, `breathe-demo.gif`, `daily-meditation.gif`, `mood-demo.gif`, `mood-demo.mp4`, `mood-demo-poster.jpg`, `phone.png`, `phone.webp`, `hero-route-texture.svg`, and `src/components/ui/DemoGif.tsx`. Kept `Avatar images.png` and `Images/source/*` (inputs to `scripts/slice-avatars.mjs` / `remove_bg.py`).
- `tsc --noEmit`: only a stale `.next/types` reference to the deleted `/about` page (clears when `.next` regenerates). Not verified in a browser.

## 2026-10-03 — CTA side phones frozen (temporary)

- `src/components/sections/Cta.tsx`: each phone entry has a `playing` flag. The two side phones are `playing: false`, so they rest on their poster frame (the video's first frame, not the frame that happened to be showing). To undo, set both back to `true`. The central YouTube phone ignores the flag.

## 2026-10-03 — Hero "Watch Video" scrolls to the CTA phones

- `src/content/site.ts`: `heroContent.secondaryCta.href` `/#howitworks` → `/#cta-phones`.
- `src/components/sections/Cta.tsx`: the phone-stack wrapper gets `id="cta-phones"` and `scroll-mt-24`, so the jump lands on the three phones (not the heading) with the navbar clear. It doesn't autoplay the video; the visitor taps play.
- Not verified in a browser.

## 2026-10-03 — CTA video: fix poster/controls painting over the phone bezel

- `src/components/ui/YoutubeShort.tsx`: the root is now `<div className="absolute inset-0 isolate">` instead of a fragment. The poster/buttons use `z-[5]`/`z-[6]`/`z-10`, and the `PhoneFrame` underlay box isn't a stacking context, so those z-indexes competed with the bezel image (which has none) and painted over it. `isolate` traps them inside the screen, so the bezel is on top again.
- Not verified in a browser.

## 2026-10-03 — CTA video: hide YouTube's own UI (title, prev/next, watermark)

- `src/components/ui/YoutubeShort.tsx`: removed `playlist` (it was what added the previous/next buttons) and the autoplay-then-pause trick. Looping is now manual (`seekTo(0)` + `playVideo` when the player reports "ended"). A local poster, `public/Images/demos/yt-short-poster.jpg` (the video's 1080×1920 thumbnail from `i.ytimg.com`), covers the iframe whenever it isn't playing, which hides the embed's paused UI (title bar, grey play circle). The iframe is 122% tall, offset -11%, so the title flash and watermark at the top/bottom are cropped by the phone screen.
- Only our red Shorts mark and sound button remain. Pausing mid-video shows the poster again (a live frame can't be read cross-origin).
- Not verified in a browser: if the title or logo still flashes at the start of playback, raise the crop or delay the poster fade.

## 2026-10-03 — CTA video: sound on when play is first clicked

- `src/components/ui/YoutubeShort.tsx`: the first click on play now sends `unMute` before `playVideo`, so the video plays with audio; the sound button still mutes it. `soundChosenRef` makes this happen once: after the first play or any sound-button use, later plays keep the visitor's choice (muting, pausing and resuming stays muted).
- Not verified in a browser: if a browser refuses to unmute inside the iframe, the sound button will show "off" (it follows the player's reported state) and one tap on it unmutes.

## 2026-10-03 — CTA video: paused by default, Shorts-style centre play button

- `src/components/ui/YoutubeShort.tsx`: the video now rests paused on its first frame. A big YouTube Shorts mark (red "S" with white play triangle) sits in the middle while paused and fades out while playing. The whole screen is the play/pause tap target. The sound button stays (bottom right); the old bottom play/pause button is gone.
- How "paused by default" works: an embed can't start paused without showing YouTube's own play UI, so it autoplays muted under an opaque cover, is paused + rewound on the first "playing" report, then the cover lifts. If autoplay is blocked, the cover stays and the first tap plays.
- Not verified in a browser (the first frame may flash for a moment under the cover; the Shorts icon is a hand-written SVG path of the logo).

## 2026-10-03 — CTA video: play/pause and sound buttons

- New `src/components/ui/YoutubeShort.tsx` (client): the iframe now has `enablejsapi=1` and two overlay buttons at the bottom of the phone screen, play/pause and sound on/off. Commands go through the IFrame API's `postMessage` protocol (no script loaded); the player's `infoDelivery` messages keep the icons in sync, e.g. if autoplay is blocked it shows "play".
- `YoutubeShortScreen` in `Screens.tsx` is now a thin wrapper around it. Starts muted (required for autoplay); the sound button unmutes.
- Not verified in a browser.

## 2026-10-03 — CTA central phone plays a YouTube Short

- `src/components/mockups/Screens.tsx`: new `YoutubeShortScreen({ id })`, a `youtube-nocookie.com` embed (autoplay, muted, loop via `playlist=id`, no controls). The iframe is 9:16 at full screen height, centered and cropped by the phone's `overflow-hidden`; `pointer-events-none` so it doesn't capture clicks.
- `src/components/sections/Cta.tsx`: the central phone (was `ListenDemoScreen`) now uses `CentralShortScreen` → video `OChieJOAgF8`. Side phones unchanged.
- Not verified in a browser: autoplay can be blocked by some browsers/mobile data-saver modes, and a YouTube title/overlay may flash before play.

## 2026-10-03 — Footer: nav columns align with legal links

- `src/components/layout/Footer.tsx`: the top and bottom rows are now one grid (`lg:grid-cols-[1fr_auto]`, cells: brand, nav columns, copyright, legal links). The auto-width right column is as wide as the legal row, so NAVIGATION/SUPPORT start at the same left edge as "Privacy Policy". The legal links stay flush right. Mobile stacking order is unchanged.
- Not verified in a browser.

## 2026-10-03 — Removed About from navbar and deleted /about page

- `src/content/site.ts`: removed the About entry from `navLinks`. The nav is now How It Works → Features → Contact. The desktop row and mobile sheet both read this array.
- `src/app/about/page.tsx`: deleted the `/about` route (and its `src/app/about/` folder). It was a placeholder page. About is to be added back later.
- Verified: `tsc --noEmit` (see the result reported in chat).

## 2026-10-03 — CTA: store badges side by side on mobile

- `src/components/sections/Cta.tsx`: badge wrapper `flex-col sm:flex-row` → `flex-row justify-center gap-2 sm:gap-3`, so App Store and Google Play share a row on phones. Both pills use `px-4 sm:px-6` (row ≈ 292px, fits ~360px). Desktop unchanged.
- Not verified in a browser (320px may need `flex-wrap`).

## 2026-10-03 — Bento phone trio: larger on small tiles

- `src/components/mockups/FeatureVisuals.tsx`: `PhoneTrio` scale was `min(1, width / 749)`, which shrank the fan to ~0.41x in a ~310px mobile tile. New `SMALL_TILE = { below: 520, boost: 1.7 }`: below 520px tile width the fit scale is multiplied by 1.7 (~0.70x at 310px), still capped at 1. The tile size is unchanged; the outer phones now bleed off the sides and are cropped by the band's `overflow-hidden`, as in the reference. Videos scale with the frames. Tiles ≥520px are unchanged (the boosted value is already capped at 1 at the threshold, so no jump).
- Not verified in a browser: framing/vertical offset at 390px (`translate(-50%, -30%)` may need a tweak).

## 2026-10-03 — Footer: legal links on the copyright line

- `src/components/layout/Footer.tsx`: the legal links (Privacy Policy / Terms & Conditions / Delete Account) moved out of the nav-column wrapper into the bottom row, on the same line as the copyright. Copyright sits left; legal links sit right, in one horizontal row. Below `lg` the row stacks, copyright first. Supersedes the 2026-09-30 (footer) placement under the nav columns. Classes and content unchanged otherwise.

## 2026-10-03 — Navbar links: How It Works, Features, About, Contact

- `src/content/site.ts`: `navLinks` reduced from Features / Testimonials / How it works / FAQ to **How It Works** (`/#howitworks`), **Features** (`/#features`), **About** (`/about`), **Contact** (`/contact`). The desktop row and the mobile sheet both read this array, so both update. The Play Store CTA is unchanged. Testimonials and FAQ sections remain on the homepage; they are just no longer in the nav.
- `src/app/about/page.tsx`: new minimal `/about` page, using the same header and CTA layout as `/contact`. **Placeholder copy:** the heading and one line were written as a stand-in because no About content existed. Replace with real copy.
- Verified: `tsc --noEmit` is clean. Not yet checked in a browser.

## 2026-10-03 — How It Works: mobile arrows show availability, one subtle style

- `src/components/sections/HowItWorks.tsx`: both mobile arrows now share one style, `arrowClass`. The previous solid red next button drew too much attention, and the prev button was permanently grey.
  - **Enabled** (a card exists in that direction): the site's outline-button style (`variants.outline` in `ui/Button.tsx`): `border-2 border-ink`, `text-ink`, transparent fill, `hover:bg-ink/5`. Same white as the rest of the site.
  - **Disabled** (`disabled` attribute): falls back to `bg-surface/40` with a muted glyph, so the end of the list reads as "nothing there."
- **Behaviour change:** the arrows no longer wrap. Previous is disabled on the first step and next on the last. Before, next wrapped from "Earn rewards" back to "Plan your Pujo". Wrapping would make both arrows always enabled, which defeats the availability signal.
- Verified: `tsc --noEmit` clean; the only ESLint error is the pre-existing `mounted.current` one. SSR markup has the `disabled` state and the `disabled:` variants. Not verified in a browser: the tint strength against the real background.

## 2026-10-03 — How It Works: mobile card fades and eases like the fan

Replaces the CSS slide from the entry below. A CSS keyframe can animate in but can't run an exit, so the outgoing card just vanished. The card now uses framer-motion, with the fan's own timings and easing, so the card and the phones above it move as one system.

- `src/components/sections/HowItWorks.tsx`:
  - **Two renders of the step list, split by breakpoint.** Desktop is `hidden lg:flex` with all three cards, as before. Mobile is a separate `lg:hidden` stack with only the active card. CSS handles the breakpoint, so no `matchMedia` hook is needed, matching the Navbar's pattern.
  - **`StepCard`** holds the card's copy (glow, title, body). The desktop list and the mobile card both render it, so they can't drift apart.
  - **`makeCardVariants`** builds the enter and exit from `SWEEP` and `EASE_*`. Enter fades in on `EASE_GLIDE` over `glideDuration` (0.7s), with opacity trailing by `enterDelay` (0.2s). Exit uses `EASE_SWEEP` over `exitDuration` (0.8s), holds full opacity until `fadeHoldUntil` (0.28), and dissolves by `fadeGoneBy` (0.85). These are the same curves the fan uses. The card travels `enterX` (46%) in the arrow's direction and exits the opposite way.
  - **`AnimatePresence mode="popLayout" initial={false}`** lets the outgoing and incoming cards overlap. `initial={false}` stops the first card from animating on page load. The mobile wrapper is `overflow-hidden`, so a traveling card can't spill past the gutter.
  - **Reduced motion** sets all durations to 0 through `makeCardVariants(reduced)`.
  - The `dir` state (`"next" | "prev" | null`) is unchanged. It is now passed as `custom` to the variants.
  - The desktop card no longer remounts on a step change, so its fade doesn't restart there. That was a side effect of the old CSS approach.
- `src/app/globals.css`: removed the `--animate-slide-in-*` tokens and their `@keyframes`.
- Verified: `tsc --noEmit` is clean. ESLint shows only the pre-existing `mounted.current` error, and the SSR markup has the desktop list and the mobile stack. Not verified in a browser: the fade and ease need a visual check at 390px.

## 2026-10-03 — How It Works: mobile card slides in from the arrow's side (superseded)

- `src/components/sections/HowItWorks.tsx`: below `lg`, the active step card now slides in from the side the arrow was pressed — from the right after **next**, from the left after **prev**. New `dir` state (`"next" | "prev" | null`), set only by the two arrow `onClick`s; step-title clicks keep the last direction. It starts as `null`, so nothing slides on page load: a CSS animation class present at mount would otherwise run then.
- The active card's `key` is now `${step.id}-active-${active}` so a step change remounts it and replays the animation. Inactive cards keep their plain `step.id` key. Side effect: the active card on desktop also remounts on a step change, so its bg/opacity fade restarts there. Acceptable; desktop layout is otherwise unchanged.
- The animation is `max-lg:animate-slide-in-right` / `max-lg:animate-slide-in-left`, plus `motion-reduce:animate-none`. The class names are written as full literals, since Tailwind won't generate a class assembled at runtime from a template.
- `src/app/globals.css`: two `--animate-*` tokens and their `@keyframes`. Each moves 40px and fades in over 380ms on `cubic-bezier(0.22, 1, 0.36, 1)`, the same EASE_GLIDE the fan uses, so the card and fan move as one system.
- Verified: `tsc --noEmit` clean. The only ESLint error is the pre-existing `mounted.current`-during-render one. The served CSS contains both slide classes and the reduced-motion override. Not verified in a browser: Browser MCP timed out on clicks, so the slide itself still needs a visual check at 390px.

## 2026-10-03 — How It Works: ported the source's mobile variant

`src/components/sections/HowItWorks.tsx` only. The desktop split (`lg:grid-cols-split`, step list left / phone fan right) is a faithful port of the Bloom Framer template; the **mobile** variant never was, and below `lg` the section degraded into a generic stack — all three step cards, *then* the fan, with the prev/next arrows orphaned a full `gap-20` (80px) below everything. Checked the source (`bloomtemplate.framer.website`) and the user's reference screenshots: its mobile variant reads **fan → arrows → the active step's card alone**, with a much larger fan whose 2nd/3rd phones run off the right edge. Now matched. Per the user: gate at `lg` (not `md`), next arrow takes the accent fill, and scale the fan up and let it bleed.

- **Reordered** via `order-*` rather than duplicated markup (the repo convention — the only `*:hidden` pairs in `src/` are the Navbar's). The split row's three children are now step list `order-3 lg:order-1`, fan `order-1 lg:order-2`, arrows `order-2 lg:hidden`. Grid items honour `order`, so the `lg:` pair cancels the mobile ordering and the desktop columns land exactly where they did — the DOM order is unchanged, so nothing about the desktop render moved.
- **The arrows moved inside the split row.** They were a sibling of it, which is why the row's `gap-20` stranded them; as `order-2` they now sit in the row's own gap, directly under the phones. Row gap tightened `gap-12` → `gap-8` below `lg` (`lg:gap-16` untouched) so they read as attached to the fan.
- **Only the active step's card shows below `lg`** — `max-lg:hidden` on the inactive ones. Deliberately `max-lg:hidden` and *not* `hidden lg:block`: the latter would force `display:block` onto a `<button>` at desktop and change how it renders. `display:none` also takes the two hidden steps out of the tab order, leaving the arrows as the sole control, which is the source's model and is fine for a11y since both already carry `aria-label`s. Card padding `p-5` → `+ max-lg:p-6`, since 20px is tight once the card is full-bleed.
- **Arrows restyled** 44px → 56px (`h-14 w-14`), text glyphs `‹`/`›` → a local inline `Chevron({dir})` SVG component (the repo has no icon set — `Logo`/`StoreIcons` are the only SVGs in `ui/` — and two paths don't justify a dependency; `currentColor` lets each button tint itself). Prev `bg-surface text-ink/60`, next `bg-accent text-white`: the source pairs a muted prev against its *primary button* colour for next, so this reads that pairing through this site's dark palette via `filled` in `ui/Button.tsx` rather than copying Bloom's pink/black. Added the `focus-visible:outline-accent` ring both were missing, matching `base` in `Button.tsx`.
- **Fan scaled up below `lg`**: `.phone` `w-[min(52%,330px)]` → `+ max-lg:w-[min(76%,330px)]`, applied to **both** the active card and the ghost card — they must stay identical or a sweeping phone would change size mid-flight. No fan *geometry* changed: `PHONE_FAN`'s `left` values (0%/27%/51%) are container-relative percentages on a full-size slot and are independent of phone width, so widening the phones is what pushes the 2nd and 3rd past the container, and the section's existing `overflow-x-clip` crops them at the viewport. At a 412px viewport: container 372px, phones 283px wide starting at 0/100/190px, so right edges at 283/383/473px — one partial phone at the right edge, as in the reference. Composition height raised to suit the now ~511px-tall phone: `h-[clamp(420px,50vw,560px)]` → `h-[clamp(440px,115vw,560px)]` (`lg:h-[...]` untouched).
- **Not touched:** `PHONE_FAN`, `SWEEP`, `FAN_RANKS`, the easings, the slot/card `motion.div` structure, the ghost list, `select()`. This was layout and ordering only — none of the tuned conveyor machinery (see the 2026-09-29/30 entries on judder and the black-flash regressions) was altered.
- Side effect worth knowing: `PhoneFrame` computes its corner radius from the `width={330}` prop while the rendered width comes from `style={{width:"100%"}}`. The mobile phone used to render ~193px against a radius meant for 330px (13.7% instead of the intended 8%); at 283px that's now 9.3%, so the over-rounding is **reduced**, not introduced.
- Verified in the SSR'd HTML: split-row children emit in DOM order step-list / fan / arrows with the `order-*` pairs above, `max-lg:hidden` on exactly the 2 inactive steps, `max-lg:w-[min(76%,330px)]` on all 3 phones. `tsc --noEmit` clean.
- **Known issue this makes more visible, deliberately not fixed:** `select()` bumps the *outgoing* step's generation regardless of direction, so **previous** replays the next-direction choreography (one survivor travels backwards against the conveyor, another crosses two planes). The sweep is hard-coded one-directional — see the 2026-09-29 entry. This change promotes "previous" from a rarely-used control to one of only two affordances on mobile, sitting right under the fan, so the glitch will now be hit far more often. Fixing it means making direction drive which slot the new card is dealt into.

## 2026-09-30 — corrupted get-started.avif

- `public/Images/get-started.avif` (the splash shown in the centered phone of the Cta "Get started for free" section, via `GetStartedScreen` in `Screens.tsx`) was truncated/corrupted — only 3,601 bytes, failed to decode through `sharp` with `bad seek to 3633`. That's why the section kept showing a broken/old image regardless of the code, which already pointed at the right path. No component code was wrong or changed.
- Replaced the file: converted the correct source image (splash graphic with the Pujogo logo mark and water-drop badge icon on black, supplied by the user) to AVIF via the project's existing `sharp` dependency, overwriting the corrupted file in place. New file: 831×1893, av1/AVIF, 5,110 bytes, confirmed decodable via `sharp(...).metadata()`.

## 2026-09-30 — mobile performance (phone lag, ~12 FPS)

- `src/components/layout/ClickSpark.tsx`: the spark canvas was sized to the whole document height × DPR (≈1170×30000px on a phone) and cleared in a rAF loop that never stopped — the main cause of mobile jank. It is now `fixed` and viewport-sized, DPR capped at 2, click coords taken straight from `clientX/Y`, and the rAF loop only runs while sparks are alive.
- `src/components/layout/Navbar.tsx`: scrolled navbar uses a solid `bg-black/85` below `md`; the backdrop blur/saturate (re-rendered every scroll frame, costly on phone GPUs) is now `md:`+ only.
- `src/components/layout/SmoothScroll.tsx`: Lenis + its GSAP ticker are skipped on `(pointer: coarse)` devices, which scroll natively anyway. Preloader already tolerates a null Lenis.
- `src/components/sections/Testimonials.tsx`: the infinite marquee now pauses via IntersectionObserver while the section is off screen.
- `src/components/ui/Button.tsx`: dropped the blanket `will-change-transform` (a permanent GPU layer per button).
- Deliberately NOT changed: `DemoVideo`'s `preload="auto"` and `will-change`/`translateZ(0)` — both were added on purpose (warm decodes to prevent blinking; own layer so frames update under `mask-image`).

## 2026-09-30

- **Custom cursor now hides on smaller screens.** `CustomCursor.tsx` and the matching `cursor: none` rule in `globals.css` were gated only on `(hover: hover) and (pointer: fine)`, so the alta-hand overlay showed on any window with a mouse/trackpad regardless of viewport width — including a narrow resized desktop window. Per the user, added a `(min-width: 1024px)` term to both the JS `FINE_POINTER` media-query string (`CustomCursor.tsx`) and the mirrored CSS `@media` block (`globals.css`), so the overlay and the `cursor: none` rule only apply at 1024px and up. Researched current smallest laptops before picking the number: mainstream small laptops (11.6", e.g. Asus VivoBook Go 11) run a ~1366px CSS viewport, and small 2-in-1s like the Surface Go 2 (12.45") run ~1280px at their recommended scaling — both clear 1024px comfortably, so the cursor still shows on real small-laptop hardware. Niche 7-8" UMPC/handheld "laptops" (e.g. GPD MicroPC 2) were deliberately excluded from that baseline. The existing `matchMedia` `change` listener in `CustomCursor.tsx` already reacts to the query's match state changing, so resizing across 1024px live-toggles the cursor with no extra wiring needed.

- **Demo media weight: the 6 hosted GIFs are now served as local MP4s (~3.7MB total instead of ~65MB).** Measured the postimg files: mood 8.86MB, discover 4.19MB, toilet 6.14MB, choose 18.63MB, listen 18.35MB, progress 8.57MB. `DemoGif` fetched every one of them in full on mount, so all ~65MB downloaded on page load. A URL-based converter wasn't possible: postimg rejects server-side proxies (wsrv.nl returns 400 for its URLs; its own control image works fine). So, with the user's go-ahead, and replacing the earlier "third-party links only" rule for these tiles:
  - Added `scripts/convert-demos.mjs` (`npm run demos`) plus the devDependency `ffmpeg-static` (its install script approved via `npm approve-scripts`). It downloads the GIFs from the `DEMO_SOURCES` map and writes `public/Images/demos/<name>.mp4` (H.264, 400px, CRF 28, faststart) and `<name>-poster.jpg`. Results: 574/345/442/716/809/424 KB MP4s, plus posters of about 70KB each.
  - `Screens.tsx`: all six `*DemoScreen`s now render `DemoVideo` through a local `Demo` helper, with `rate={1}` (the GIFs are real-time, unlike the half-speed breathe MP4) and `fit="cover"` (matches the GIFs' old crop). Exports and `screenMap` are unchanged.
  - `DemoVideo.tsx`: new optional `rate` and `fit` props (defaults keep `BreatheDemoScreen` as it was). Also added the same `translateZ(0)` layer promotion that `DemoGif` has, so video under the `mask-image` doesn't freeze.
  - `DemoGif.tsx` is now unused and kept only as a fallback. The posters are small and cached, so a remounted conveyor phone paints straight away with no black blink.

- `src/components/ui/DemoGif.tsx` + `src/components/sections/HowItWorks.tsx`: fixed the blink and the judder the user reported on every step change of the "How it works" fan. It was four separate defects, three of them black flashes caused by `PhoneFrame`'s `bg-black` underlay showing through an unpainted media surface:
  1. **Rest→play gap.** `DemoGif` set its freeze-frame `<canvas>` to `display:none` in the *same commit* that it mounted a fresh `<img key={playKey}>` — and `playKey` deliberately forces a redecode from frame 0. At 9–19.5MB that decode is not same-frame work, so the phone went black for its duration. Now the canvas is never blanked: it stays painted underneath, and the `<img>` is layered on top at `opacity: 0` and revealed only once it has actually decoded (`onLoad`, plus a `complete` check in a layout effect because a cached image can fire `load` before React attaches the handler). The frame-0 restart is kept — it's just no longer visible.
  2. **The ghost.** The outgoing phone mounts a brand-new `DemoGif` with `playing` false, so its canvas was blank for the whole 0.8s sweep at `zIndex: 40` — a black phone flying over everything on every click.
  3. **The re-dealt phone.** Exactly one card genuinely remounts per click (the `gen[]` key, by design), so it too mounted a blank canvas. Both 2 and 3 are fixed by a module-level `frameCache` of decoded first frames plus a `useLayoutEffect` that draws synchronously before first paint, so a remount with a warm cache paints immediately instead of refetching a 19MB GIF to recover frame 0.
  - Also in `DemoGif`: `object-fit` does nothing to a canvas bitmap, so the canvas stretched to its box while the `<img>` beside it cropped to cover — the two sat at different geometry and the swap read as a jump on top of the black. The canvas now cover-crops itself (bitmap sized to the box × DPR, 9-arg `drawImage`), with a `ResizeObserver` to repaint as the fluid fan resizes.
  - Restored the layer promotion the 2026-09-29 entry below describes: `will-change: transform` + `translateZ(0)` on the GIF layers. That code had been **lost** when `DemoGif` was introduced (a refactor that itself was never logged here), so the log described something the repo no longer contained. It matters more in the fan than in the bento: the fan's wrapper animation *ends*, so without promotion the masked layer goes quiet and the front GIF can sit frozen at rest.
  4. **The judder** (not a blink): `animate` included `left`/`top` as percentage strings, i.e. layout properties, so all three phones triggered layout + paint on every frame of the 0.7s glide — inside a `maskImage` group, with three `drop-shadow` filters, and no layer promotion anywhere in the file. Each phone is now wrapped in a full-size **slot** (`absolute inset-0`) that carries the pose as an `x`/`y` transform. That sidesteps the unit trap — framer's `x: "27%"` resolves against the element's own width, but a slot the size of the container makes that identical to the old container-relative `left: "27%"`, at every breakpoint, with nothing to measure (a `ResizeObserver` was rejected precisely because its first render would stack all three phones at `x: 0` and SSR would be wrong). `PHONE_FAN`'s tuned numbers are untouched and transfer 1:1; `SWEEP.enterX`/`exitX` stay on the inner card so they remain element-relative as tuned. `zIndex` stays inside the animated object with `{duration: 0, delay: settleDelay}` — moving it to static style would swap planes at t=0 while the fan is still at rest and pop the stacking order. Added `willChange` to the slots and cards and `translateZ(0)` to the masked `.phone-composition` wrapper.
  - Known remaining issue, pre-existing and deliberately not fixed: `select()` bumps the generation of the *outgoing* step regardless of direction, so "previous" replays the next-direction choreography — one survivor travels backwards against the conveyor and another crosses two planes. The sweep is hard-coded one-directional.

- `src/content/steps.ts`: renamed the three "How it works" step headings per user request — "Choose How You Feel" → "Plan your Pujo", "Listen, Breathe, and Unwind" → "Capture pandals", "Follow Your Progress" → "Earn rewards". Body copy and `screen`/`id` fields unchanged.
- `src/components/mockups/Screens.tsx` + `src/components/sections/HowItWorks.tsx`: the "How it works" phone fan's 3 static markup screens are now 3 third-party hosted GIFs, per user instruction (not bundled in the repo, same hotlink pattern as the 4th bento tile). Added `ChooseDemoScreen`, `ListenDemoScreen`, `ProgressDemoScreen` in `Screens.tsx`, each wrapping `DemoGif` around a postimg.cc URL (`screen-1`/`screen-2`/`screen-3`, ≈19.5MB/19.2MB/9MB), and repointed `screenMap`'s `mood`/`breathe`/`progress` keys at them (previously `MoodScreen`/`BreatheScreen`/`ProgressScreen`, which are left defined but unused). In `HowItWorks.tsx`, the active-fan render (`<Screen />`, inside `steps.map`) now passes `playing={rank === 0}` so only the front/active phone's GIF animates — the outgoing ghost phone's `<Screen />` is left without `playing` (defaults to `false`), since it's already unmounting. No URL-based compression was applied (postimg.cc has none, and re-encoding would require downloading the files, which the user explicitly ruled out).
  - Correction to the above: this entry originally claimed bandwidth was bounded by `DemoGif` loading "only the active one". That was wrong. `DemoGif`'s preload effect runs `new Image(); img.src = src` on mount regardless of `playing`, and all three phones mount immediately, so all ≈48MB is fetched up front. The `playing` gate saves animation/decode CPU, not bytes. Left as-is deliberately (per the user): warm decodes are what keep the fan from blinking, which is the more visible problem.
  - Follow-up: per the user, the GIFs weren't filling the phone screen — the two `PhoneFrame` call sites in `HowItWorks.tsx` were passing `Screen` as `children` (the inset-to-cutout layer, sized to the transparent hole's own measured bounds with a visible background/seam), not `underlay` (the full-bleed layer behind the bezel, sized to the recordings' own aspect and overscaled to tuck under the bezel — the technique already used, and seam-tuned, for the bento tile's GIFs). Switched both sites (`steps.map` and `ghosts.map`) to pass `underlay={<Screen .../>}` instead of children, so the new GIFs now render edge-to-edge the same way the bento ones do.

- `src/components/sections/Cta.tsx`: the two side phones in the "Get started for free" phone fan now render at the same size as the front phone (`PhoneFrame width={280}` for all three, was `250` for the side pair). Per the user, the side phones looked noticeably smaller than the front one. Horizontal `translateX` offsets were doubled (`±72px` → `±160px`) so the now-larger phones spread apart instead of crowding under the front phone, and the mobile/tablet scale steps (`scale-[0.62]/sm:scale-75` → `scale-[0.5]/sm:scale-[0.65]`) were nudged down slightly to keep the wider spread from clipping inside the section's `overflow-hidden` on small screens.
  - Follow-up: at the `lg` (desktop, scale-100) breakpoint the phones were getting clipped at the bottom of the section, because every phone is now 280 wide (≈506px tall at that width/aspect ratio, ≈540px once the ±8° rotation's bounding box is counted) but the stack wrapper was still only `480px` tall — sized for when only the front phone was that big. Bumped the wrapper to `md:h-[520px] lg:h-[600px]` (was `md:h-[480px]`, no `lg` override) so there's enough vertical room at every breakpoint.
  - Follow-up: per the user, made all three phones bigger still — `PhoneFrame width={280}` → `320`. Widened the fan spread to match (`x: ±160px` → `±190px`) and grew the stack wrapper again (`h-[420px]` → `h-[460px]`, `md:h-[520px]` → `md:h-[580px]`, `lg:h-[600px]` → `lg:h-[680px]`) to keep the now-larger, rotated phones from clipping at the bottom.

## 2026-09-29

- `src/components/sections/HowItWorks.tsx`: the step transition is now a **conveyor**, replacing the carousel-style swap shipped earlier the same day (which swept the front phone left and then flew it back in from the right). Per the user: the outgoing phone must leave and be gone, nothing may bounce, and the fade must happen mid-travel. Now, on a step change: the front phone glides left out of view on `EASE_SWEEP` (ease-in, 0.8s) — holding full opacity for the first 28% of the travel, dissolving mid-flight, fully gone by 85%, drifting −5°→−12° and scaling to 0.94, pinned at `zIndex: 40` so it passes over the others — and is then unmounted. The two survivors glide to their new planes on `EASE_GLIDE` (easeOutQuint, 0.7s, `delay: 0.14`), and a brand-new phone is dealt in from 46% right of its landing slot, fading up on the same curve. Three frames stay on screen throughout.
  - `DHAK`/`easeDhak` is gone from this component: it overshoots to 1.0998, which is exactly the bounce that was objected to. `EASE_GLIDE` never crosses its target.
  - "Never rejoins" is literal, not cosmetic: state is now `active` + a per-step `gen[]` counter + a `ghosts[]` list. Bumping `gen[active]` changes that card's React key, so the swept card is really unmounted and its replacement is a fresh element that merely carries the same screen; the outgoing one lives on as a *ghost* rendered outside the rank system, pinned to the front pose, and removes itself in `onAnimationComplete`. Rapid clicks simply queue more ghosts. This also let the previous `pass`-in-the-variant-name hack go — a freshly mounted ghost always animates, so there is nothing for framer to dedupe.
  - Which slot the new phone enters depends on the click: the *next* step puts it at the back (clean conveyor), the step *two ahead* at the middle plane, because the two survivors take front and back. Entering from the right at the slot's own `zIndex` covers both — it glides in over the back phone and under the front, like a card dealt into the fan — so there is no special case.
  - Note `initial` is spread from `pose` field by field: `pose.z` is a stacking plane, and framer would read a bare `z` as a 3D `translateZ`. A `mounted` ref suppresses the entry animation on first paint (the fan's arrival is already the surrounding `Reveal`s' job). Reduced motion skips the ghost entirely and snaps.

- `src/components/ui/PhoneFrame.tsx` + `src/components/mockups/Screens.tsx`: removed the dark seam between the phone bezel and the recording playing inside it (4th bento tile). The three hotlinked GIFs are all ~0.439 aspect (measured: 400×911, 400×911, 351×800) while the underlay box was 0.4918, so `object-contain` left ~3px bars down each side of the screen and `object-cover` would have clipped 5.4% off the top and bottom — more than the bezel could hide. The underlay box is now sized to the recordings' own 0.4391 aspect (insets 12.97%/13.08%/3.19%/3.54%), scaled 3% so it overlaps the cutout on all sides with the overflow tucked under the bezel; at a matched aspect `object-cover` fills it with neither bars nor crop. Underlay background also went `#131313` → black so no sub-pixel corner seam reads as grey.
- `src/components/mockups/FeatureVisuals.tsx`: `PhoneTrio` now measures its container with a `ResizeObserver` (same pattern as `Community`) and scales the fixed 749×554 phone canvas down to fit, capped at 1× so it never enlarges. Previously the canvas was always rendered at full size and merely centred, so on any tile narrower than 749px the outer two phones were clipped away and the middle one dominated the card.
- `src/components/sections/Features.tsx`: the visual band's `pt-8` is now skipped for the `phoneTrio` tile only, closing the empty space above the phone fan. Other tiles keep it — `Community`'s hover-burst math depends on that same 32px.
- `src/components/mockups/Screens.tsx`: the three demo-screen GIFs get `will-change-transform` + `translateZ(0)`. Under the band's `mask-image`, their layer only repainted when the hover transform animated, so they sat frozen at rest and appeared to "play on hover"; own-layer promotion decouples their frame updates from that repaint cycle.
- `src/components/mockups/Screens.tsx`: `MoodDemoScreen` (4th bento tile, "Daily meditations") no longer plays a local MP4 — it now hotlinks a GIF from a third-party host (`https://i.postimg.cc/rs98qpY1/normal-screen-(1).gif`) via a plain `<img>` tag. Per user instruction, this tile's media must be sourced from third-party links, not installed in the repo. `BreatheDemoScreen` and the Sessions screen are unchanged for now — 2 more URLs are pending from the user.
- Set up the `plan.md` / `updates.md` workflow and added workflow + graft-usage instructions to `CLAUDE.md`.

## 2026-09-30 (footer)

- `src/components/layout/Footer.tsx`: the legal links (Privacy Policy / Cookies / Terms & Conditions) now sit inside the same wrapper as the nav columns (NAVIGATION / SUPPORT / BLOG), directly beneath them, so both share one left edge. Previously the legal `ul` lived in a full-width bottom row with `md:justify-between`, which pushed it away from the nav columns' margin. The copyright line stays alone in the bottom row. Layout-only change (classNames and JSX nesting), no content or styling tokens changed.

## 2026-10-03 (graft init)

- Initialised graft: ran graft build (no LLM key, wiring graph only). Generated the local \graft/\ context graph: 164 nodes, 279 edges, 48 file cards across 48 TS/TSX files.
- \.gitignore\: graph added as \/graft/\ (graft appends this automatically). \.ignore\: created by graft so ripgrep still searches \graft/\ cards.
- No application code changed. Re-run \graft build\ after code changes to refresh the graph.

## 2026-11-03 (cookie banner + accessibility)

- Audit: site has no tracking pixels/analytics. Only third-party load is the YouTube-nocookie embed in the CTA.
- `src/components/layout/CookieBanner.tsx` (new, mounted in `layout.tsx`): bottom-right cookie card styled after the user's reference (white card, black outline, offset grey shadow, "Cookies" + X, Accept / Preferences, cookie illustration). Slides in from bottom-right (fade only under reduced motion), waits for the homepage intro. Preferences shows Essential (always on) + a "Media & experience" switch. Choice saved to localStorage `pujogo-cookies`; X = essential only. It does not gate any content.
  - A first version with a consent store (`lib/consent.ts`), YouTube gating, a `/cookies` policy page and a footer "Cookie settings" link was built and then fully reverted per the user; `YoutubeShort.tsx`, `site.ts`, `LegalPage.tsx`, `documents.json` are back to their committed state.
- Accessibility (WCAG 2.1 AA): skip-to-content link + `id="main"` on `<main>` (`layout.tsx`, `.skip-link` in `globals.css`); global `:focus-visible` outline; contact inputs get a focus ring and full-contrast placeholders; `/team` gets an sr-only `<h1>`, a list structure and visible member names (images now `alt=""`); testimonials marquee has a pause/play button and pauses on hover/focus (WCAG 2.2.2); footer column titles `h5` -> `h2` (no visual change); HowItWorks mobile step card is an `aria-live="polite"` region.

- Follow-up (2026-11-03): `CookieBanner.tsx` recoloured to the site theme (surface card, soft border, blush offset shadow, red accent Accept pill, soft Preferences pill, muted copy) and scaled to ~50% (300px wide, smaller type/buttons/cookie art). It now rolls in 2s after load (`SHOW_DELAY_MS`), counted after the homepage intro curtain.
- Follow-up (2026-11-03): restored the Team links in `src/content/site.ts` (navbar How It Works → Features → Team → Contact, and footer Navigation "Team"). They were uncommitted work that got wiped when `site.ts` was `git checkout`-ed during the cookie revert. Added a themed page scrollbar in `globals.css` (red accent thumb on the paper background; `scrollbar-color` + `::-webkit-scrollbar` for Safari).
- Follow-up (2026-11-03): `/team` section background now uses the site's gradient language (paper → surface → blush wash, `rounded-b-section`, plus a red bloom top-right and a blush bloom on the left). Per the user, the gradient is background-only: the cards, photo overlay and `#role` tags are unchanged (a card-glow/tag-gradient version was tried and reverted).
- Follow-up (2026-11-03): `/team` section no longer has `rounded-b-section`; its gradient now runs paper → surface → blush (60%) → paper, so it fades into the CTA below with no hard edge.
- Follow-up (2026-11-03): `src/content/team.ts` member names set to full names (Rahul Sinha, Sourik Ray, Sashikant Prasad, Nirvik Ghosh, Priyanshu Roy, Rudranil Bhattacharjee).
- Follow-up (2026-11-03): Sashikant's card showed his old photo after `public/Images/Team/sashikant.avif` was replaced under the same name. Cause: Next's image optimizer cache (`.next/dev/cache/images`, keyed by URL). Cleared it; no code change. Replacing a photo in place needs the same cache clear (or a new filename).
- Follow-up (2026-11-03): `/team` photos zoom subtly on card hover (scale 1.06 over 1.2s, expo-out `cubic-bezier(0.16,1,0.3,1)`, CSS transform only; off under reduced motion). Card got `isolate` so the rounded clip stays crisp in Safari during the transform.
- Follow-up (2026-11-03): `CookieBanner.tsx` copy cut from ~35 words to "We use cookies to run the site and play videos. Privacy Policy." The user found the old text cluttered in the 300px card. Dropped the "By clicking accept, you agree…" line; the Privacy Policy link stays.
- Follow-up (2026-11-03): cursor tooltip on team photos. `CustomCursor.tsx` now reads `data-cursor-label` from the hovered element and swaps the alta hand for a red (`bg-accent`) tooltip pill with an up-pointing tail at the pointer, scaling/fading in from its top-left corner (300ms expo-out). `/team` cards set it to the member's handle, falling back to their name while handles are the `@handle` placeholder. Desktop fine-pointer only, like the custom cursor itself.
- Follow-up (2026-11-03): team cards can show LinkedIn + Instagram buttons (top-right, red `bg-accent` circles) that fade/slide in on card hover or keyboard focus (500ms expo-out, 60ms stagger; always visible on touch screens). New optional `linkedin`/`instagram` URL fields on `TeamMember` in `src/content/team.ts`; a button renders only when its URL is set (none set yet). Over a button the cursor tooltip reads "LinkedIn"/"Instagram". Footer social SVGs moved into shared `src/components/ui/SocialIcon.tsx` (adds a LinkedIn glyph); footer looks the same.
- Follow-up (2026-11-03): filled `instagram` + `linkedin` for all six members in `src/content/team.ts`, so the card social buttons now render. Instagram share-tracking query strings (`?stkn=`, `?obrf=`) were stripped from the supplied URLs.
- Follow-up (2026-11-03): team order changed to Rudranil, Sashikant, Sourik, Nirvik, Rahul, Priyanshu (`src/content/team.ts`).

## 2026-11-03 (large-screen responsive pass)

- Problem: content stopped at the 1340px shell and nearly every size was fixed px, so on 2560×1440 the site sat small in the middle with wide empty margins. User chose proportional scale-up.
- `src/app/globals.css`: `html { font-size: max(100%, 1vw) }`. Root stays 16px (or the user's default) up to a 1600px viewport, then grows: 19.2px at 1920, 25.6px at 2560, so wide screens show the 1600px composition scaled up. All theme tokens (spacing, containers incl. shell `83.75rem`, radii, card grid min), display/eyebrow/body utilities, hero CSS and the clamp min/max caps moved px → rem (N/16). Breakpoints, hairlines, focus outlines, skip link and scrollbar stay px.
- Components: every arbitrary `[Npx]` Tailwind value (>2px; not shadows/borders/radii/blur) converted to rem across Navbar, Footer, Preloader, CookieBanner, Hero, HowItWorks, Features, Testimonials, Faq, Cta, Screens, PhoneFrame, FeatureVisuals, `/team`. CTA side-phone offsets `±190px` → `±11.875rem`; `/team` background gradient ellipses → rem. `CustomCursor`/`ClickSpark` intentionally untouched (pointer chrome).
- `src/components/ui/PhoneFrame.tsx`: `width` prop is still a px design value but renders as rem (box, corner radii), so phones grow with the root.
- New `src/lib/useRootScale.ts` (root font size / 16, updates on resize). `FeatureVisuals.tsx` `Community` multiplies its ring/avatar/padding px by it; `PhoneTrio` scales its 749×554 canvas and phone offsets by it so the canvas matches the rem-sized phones inside.
- `next/image` `sizes` hints that were fixed px now add a `(min-width: 1600px) N/16 vw` entry so the larger render picks a sharp source (Navbar, Footer, Preloader, Hero, FeatureVisuals, Screens, YoutubeShort, PhoneFrame, `/team`).
- Rule from here on: layout sizes go in rem, not px, or they won't scale on large screens. Px numbers fed through JS should be multiplied by `useRootScale()`.
- `tsc --noEmit` and eslint clean. Browser sweep (Browser MCP iframe emulation, 320–2560) pending: Browser MCP was paused.
