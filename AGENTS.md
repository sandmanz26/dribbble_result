# AGENTS.md: project1, Wanderlog Gang

This branch is **one project inside a multi-project repository**. The repo-wide rules (one project per
branch, no shared code, how deployment and passwords work) are in `AGENTS.md` on the `main` branch:
`git show origin/main:AGENTS.md`. Read it first.

## This project
- **Brief:** Retro illustrated travel blog for a group of friends: large photo banner of recent trips,
  yearly calendar linking to trip pages, a blog per trip, email subscription. Website. Mock data only.
- **Live:** `/project1/` on the hub site, password `PR001`.
- **Stack:** React 18, Vite 5 (`base: './'`), react-router `HashRouter`, Motion (`motion/react`),
  Phosphor icons, self-hosted fonts via Fontsource.
- **Design system** (do not reuse in other projects; do not import other projects' styles here):
  Big Shoulders Display (headings, uppercase) + Figtree (body). Paper `#f2efe8`, navy ink `#141a2e`,
  one accent cobalt `#2a45c2`. Interactive elements are pills, surfaces/images 6px radius.
  Light and dark themes via CSS variables in `src/styles/global.css` (+ toggle, key `wg-theme`).
  One fixed grain layer; photos get a light print filter.

## Code map
```
src/data/trips.js        trips + posts (mock), photo() helpers, date formatting
src/data/crew.js         the five friends (portraits from randomuser.me)
src/data/photos.json     photo metadata + credits; files in public/photos/<key>-0-{480,1600}.webp
src/components/          Header, Footer, PhotoBanner, YearCalendar, TripCard, SubscribeForm, Photo, Reveal
src/pages/               Home, CalendarPage, Trip, Post, Journal, SubscribePage, Credits, NotFound
src/styles/global.css    all tokens and styles
docs/strategy.md         UX/business notes, anti-slop audit, competitor research frame
```

## Conventions here
- localStorage keys start with `wg-` (shared origin with other projects).
- Photos: location-matched, openly licensed Wikimedia Commons images, self-hosted, credited on `/credits`.
- No em/en dashes in visible copy; no eyebrow labels above section headings.
- After pushing this branch, redeploy `main` on Vercel to update the live site.
