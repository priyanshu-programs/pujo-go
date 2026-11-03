---
title: Cookie banner is visual-only by user choice; it gates nothing
author: L
date: 2026-11-03
branch: master
cost: { minutes: 12, tokens: 166249 }
id: l-b02ac287
scope: repo
status: active
src: agent
touches:
  - src/lib/consent.ts
  - src/components/layout/CookieBanner.tsx
  - src/components/ui/YoutubeShort.tsx
---

## Decided
- `src/components/layout/CookieBanner.tsx` copies the user's reference design (bottom-right white card, Accept/Preferences). It only stores the choice in localStorage `pujogo-cookies` ({essential, optional}); nothing reads it.

## Tried and ruled out
- A full consent system (lib/consent.ts store, YouTube iframe gated until "media" consent, /cookies policy page, footer "Cookie settings") was built and the user asked to remove it entirely. Don't reintroduce it unasked.

## Watch out
- The YouTube-nocookie embed (`src/components/ui/YoutubeShort.tsx`) still loads before consent, which is a DPDP/GDPR gap the user accepted for now.
- Any future tracking pixel must load only when `pujogo-cookies.optional === true`.
- `npx tsc` can fail on stale `.next/types` pointing at the deleted /about route; `rm -rf .next/types` fixes it, it's not a code error.
