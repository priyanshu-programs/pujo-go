---
title: Layout sizes are rem; html font-size scales past 1600px for large screens
author: L
date: 2026-11-03
branch: master
cost: { minutes: 15, tokens: 155555 }
id: l-a1132373
scope: repo
status: active
src: agent
touches:
  - plan.md
  - src/components/ui/PhoneFrame.tsx
  - src/lib/useRootScale.ts
  - src/components/mockups/FeatureVisuals.tsx
  - src/app/globals.css
---

## Decided
- For 2560×1440 and other wide screens the user chose proportional scale-up, not a wider layout. `src/app/globals.css` sets `html { font-size: max(100%, 1vw) }`: 16px up to 1600px, then 1vw (2560 = 1.6×). Everything sized in rem grows with it.
- Media-query breakpoints stay in px on purpose; they don't read the root size.
- JS px values (framer-motion animate sizes, canvases) use `useRootScale()` in `src/lib/useRootScale.ts` (see `Community`/`PhoneTrio` in `FeatureVisuals.tsx`). `PhoneFrame`'s `width` prop is px but renders as rem.

## Tried and ruled out
- CSS `zoom` on `<html>`: vw units and pointer coordinates (CustomCursor, ClickSpark) get scaled too, which breaks the many `vw` clamps and the cursor overlay.

## Watch out
- New `[Npx]` Tailwind values or px in globals.css won't scale and will look tiny at 2560. Use rem (N/16). Keep only hairlines, shadows, borders and breakpoints in px.
- Fixed-px `next/image` `sizes` need a `(min-width: 1600px) N/16 vw` entry or the image looks soft on large screens.
