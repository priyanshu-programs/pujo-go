---
title: "src/app/team/page.tsx gradient is background-only and fades to paper, no rounded edge"
author: L
date: 2026-11-03
branch: master
cost: { minutes: 1, tokens: 1025 }
id: l-47d73f00
scope: repo
status: active
src: agent
touches:
  - src/app/contact/page.tsx
---

## Decided
- `src/app/team/page.tsx` (TeamPage): the section gradient lives only in the section background (paper → surface → blush 60% → paper, plus two radial blooms). It ends in `--color-paper` so it blends into the `Cta` section below.

## Tried and ruled out
- Gradients/glow on the member cards (`bg-card-glow` overlay, blush photo fade) and gradient `#role` tags: user rejected; cards and tags stay plain (black/60 bottom fade, bg-black/50 pills).
- `rounded-b-section` with a gradient ending in blush (the `src/app/contact/page.tsx` pattern): user rejected it as a hard boundary against the CTA.

## Watch out
- Sections sitting directly above `Cta` should end their gradient on paper and skip the rounded bottom edge, or the seam shows.
