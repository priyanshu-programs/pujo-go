---
title: "src/components/layout/CustomCursor.tsx tooltip can't hold links; team socials live on the card"
author: L
date: 2026-11-03
branch: master
cost: { minutes: 14, tokens: 33465 }
id: l-c4a3862d
scope: repo
status: active
src: agent
touches:
  - src/components/ui/SocialIcon.tsx
  - src/components/layout/CustomCursor.tsx
---

## Decided
- `src/components/layout/CustomCursor.tsx` shows a red tooltip pill for any element with `data-cursor-label` (closest one wins). It follows the pointer and is `pointer-events-none`, so it can only display text.
- Team LinkedIn/Instagram buttons therefore live on the card in `src/app/team/page.tsx` (top-right, fade in on hover/focus, always visible on touch), because links inside a cursor-following tooltip slide away from the pointer and are unreachable by keyboard/touch. User chose this over a "frozen tooltip" popup.
- A button renders only when the member's `linkedin`/`instagram` URL is set in `src/content/team.ts`, so no dead placeholder links ship.

## Watch out
- `npx eslint` on `src/components/layout/CustomCursor.tsx` reports `react-hooks/set-state-in-effect` at `setEnabled(query.matches)`; it predates the tooltip work, so a lint failure there is not a regression from new changes.
