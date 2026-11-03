---
title: "src/content/team.ts photos: overwriting an image in place shows the old one until Next's image cache is cleared"
author: L
date: 2026-11-03
branch: master
cost: { minutes: 1, tokens: 978 }
id: l-5eef53a4
scope: repo
status: active
src: agent
---

## Decided
- `src/content/team.ts` points each member at `public/Images/Team/<name>.avif`, rendered by `next/image` in `src/app/team/page.tsx`, because the photos are pre-optimised AVIFs.

## Watch out
- Overwriting a photo under the same filename keeps showing the old picture, because `next/image` caches resized variants in `.next/dev/cache/images` keyed by URL, not by file contents.
- Fix: `rm -rf .next/dev/cache/images` and hard-reload. Otherwise give the new photo a new filename and update `src/content/team.ts`, which also avoids stale CDN copies in production.
