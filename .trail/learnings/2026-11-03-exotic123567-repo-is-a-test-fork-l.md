---
title: "exotic123567 repo is a test fork; asurslayers/pujogo-landing-page is main, synced by merge + PR"
author: L
date: 2026-11-03
branch: master
cost: { minutes: 6, tokens: 28868 }
id: l-830ecac1
scope: repo
status: active
src: agent
touches:
  - src/app/privacy-policy/page.tsx
  - src/components/layout/CookieBanner.tsx
  - updates.md
  - plan.md
  - public/Images/Team/nirvik.avif
  - public/Images/Team/priyanshu.avif
  - public/Images/Team/rahul.avif
  - public/Images/Team/rudranil.avif
  - public/Images/Team/sashikant.avif
  - public/Images/Team/sourik.avif
---

## Decided
- `origin` (exotic123567/pujogo-landing-page) is a fork used to push and test; the main repo is `asurslayers/pujogo-landing-page`. Work reaches main via a PR from `exotic123567:master` into `asurslayers:master` (PR #1 set the pattern).
- To sync: fetch main's master, merge it into local master, fix anything the merge breaks, test, push to origin, then open the PR. Merging main into the fork first means the PR has no conflicts for the reviewers.

## Watch out
- Teammates commit straight to main (route renames, `next.config.ts` redirects, share pages). Check links after each sync: main renamed `/privacy` to `/privacy-policy`, which left the cookie banner link and `LegalPage`'s `path` pointing at a 404.
- After a route rename, `tsc` fails on stale `.next/types/validator.ts` from an old build; `npx next typegen` regenerates it.
- This machine has no global git identity; the repo's commits use Priyanshu Roy <priyanshuroy.academics@gmail.com>.
