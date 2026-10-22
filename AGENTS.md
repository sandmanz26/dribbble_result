# AGENTS.md: project2, Proof

This branch is **one project inside a multi-project repository**. The repo-wide rules (one project per
branch, no shared code, how deployment and passwords work) are in `AGENTS.md` on the `main` branch:
`git show origin/main:AGENTS.md`. Read it first.

## This project
- **Brief:** Photography and videography marketplace. **Mobile app** (not a website): creators showcase
  portfolios, clients browse, book and pay. Registration, portfolio browsing, booking, payment.
  Minimal, elegant, modern. Mock data only; no backend, no real payments.
- **Live:** `/project2/` on the hub site, password `PR002`.
- **Stack:** React 18, Vite 5 (`base: './'`), react-router `HashRouter`, Motion (`motion/react`),
  Tabler icons, Geist via Fontsource.
- **Presentation:** at 860px and wider the app renders inside a phone frame with a list of flows
  beside it; on phones it runs full screen. Screens scroll inside `.screen`, not the window.
  Patterns follow Apple HIG: tab bar, bottom sheets, sticky bottom actions.
- **Design system** (do not reuse in other projects): Geist only. Monochrome UI, one accent vermilion
  `#e2502c` (dark `#ff6a48`) for selection, saved state and confirmations. Controls are pills,
  surfaces/images 14px, sheets 24px. Light/dark follow the system (`src/styles/app.css`).

## Code map
```
src/app/store.jsx        app state (user, saved, bookings, requests) persisted to localStorage `proof-state-v1`
src/data/creators.js     10 London creators, packages, reviews, money(), SERVICE_FEE (sample 6%)
src/data/media.js        portfolio image helpers; files in public/portfolio/*-{480,1280}.webp
src/data/portfolio.json  curated portfolio images + credits (Unsplash via Picsum, Wikimedia Commons)
src/components/ui.jsx    Img, TopBar, TabBar, Sheet, Toast, Empty, Rating, SaveButton, ...
src/screens/             Welcome, SignUp, Discover, Creator, Viewer, Book, Bookings, Saved, Me, Studio, Credits
docs/strategy.md         business model, flows, UX decisions, competitor research frame
```

## Conventions here
- Guests can browse; booking requires an account (redirects to `/signup?next=...`).
- Prototype payment: card `4242 4242 4242 4242` succeeds, any card ending `0002` is declined.
- Never show photos of real public figures as a creator's work.
- No em/en dashes in visible copy.
- After pushing this branch, redeploy `main` on Vercel to update the live site.
