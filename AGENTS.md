# AGENTS.md: project3, NuBrakes dual-brand redesign

This branch is **one project inside a multi-project repository**. The repo-wide rules (one project per
branch, no shared code, how deployment and passwords work) are in `AGENTS.md` on the `main` branch:
`git show origin/main:AGENTS.md`. Read it first.

## This project
- **Brief:** "Redesign Our Customer Experience" (UI UX, $6,500, within weeks). NuBrakes, a mobile brake
  repair service acquired by Valvoline, wants its website and quote/booking flows reskinned to Valvoline's
  design system, the system extended for dual branding (shared components, brand themes and tokens for
  NuBrakes and Valvoline), and key flows redesigned from a path-to-purchase study. Deliverables: responsive
  hi-fi screens with empty, loading and error states, proposed mobile-service components, dev-ready files.
- **Role description:** a PDF supplied by the owner ("Contract Product Designer (UI/UX)"). Key point: flows
  already exist; the job is a reskin plus small, reasoned, measurable UX recommendations, delivered in Figma.
  See `docs/strategy.md` section 1.
- **Live:** `/project3/` on the hub site, password `PR003`.
- **Stack:** React 18, Vite 5 (`base: './'`), react-router `HashRouter`, Lucide icons, Archivo (variable,
  with width axis) + Public Sans via Fontsource for V1; IBM Plex Sans (variable width) + Plex Mono for V2. CSS transitions only, no animation library.
- **Not available at build time:** the Valvoline design system site and the path-to-purchase study.
  Brand colour values are placeholders and research findings are labelled hypotheses. Keep it that way
  until the real sources are shared.

## Design system (do not reuse in other projects)
- One component set. Brands are token sets: `src/brand/tokens.js` holds core, semantic (brand x scheme)
  and shape tokens. `BrandProvider` writes them to `<html>` as CSS variables; `BrandScope` scopes another
  brand to one element (used on the System page). Components read only `--c-*` and shape variables.
- NuBrakes: brake-caliper yellow accent on near-black ink, rounded (12px controls), sentence case.
- Valvoline: red accent on navy, condensed uppercase display (`wdth` 72), 4px controls, uppercase buttons.
  Error red is deliberately deeper than the brand red and always carries an icon and text.
- One accent per brand. Light and dark for both. Text pairs are checked by `contrast()` in tokens.js and shown in
  the System page contrast table (all pass AA today).
- Selection uses `selected-bg` / `selected-line`, never `accent-soft` (that is for tags). Destructive buttons
  follow the `button-danger-style` token (`data-danger-style` on `<html>` and on `BrandScope`): filled on
  NuBrakes, outline on Valvoline, always with an icon.
- Display sizes and spacing are tokens (`display-*-size`, `space-1..8`). Do not add per-brand size overrides in CSS.
- Brand content (booking prefix, statement name, full name, van livery) lives in `BRAND_META`.

## Code map
```
src/brand/          tokens.js (tokens + DTCG export), BrandContext.jsx (provider, scope, prototype switches)
src/data/           mock data and api.js (delayed promises, simulated failures, bookings in localStorage),
                    history.js (seeded 2025 NuBrakes visits for the migration demo)
src/ui/index.jsx    primitives: Button, Field, Input, Select, Choice, Check, Segmented, Alert, Empty, Skeleton, Sheet, Wordmark
src/service/        proposed mobile-service components: ServiceAreaCheck, OutOfArea, WaitlistForm, ArrivalWindowPicker,
                    VehicleChip, QuoteBreakdown, TechnicianCard, StatusTimeline, ApprovalRequest, LocationSummary,
                    Receipt, WarrantyCard, WarrantyClaimSheet, FindBooking
src/flows/          quote draft context (hold, price-change and resume helpers), QuoteStarter (hero widget, checks
                    plate and ZIP together), QuoteFlow (6 steps, 3 when out of area), ResumeQuote
src/pages/          Home, Services, ServicePage, Booking (visit tracker), Bookings, System, Notes, Chrome, PrototypePanel,
                    PriceBySize (phone price board)
docs/strategy.md    brief read, hypotheses, IA, flow decisions, competitor frame, open questions
```

## Conventions here
- localStorage keys: `nb-prefs`, `nb-quote-draft`, `nb-bookings`, `nb-migr-dismissed`.
- Quote draft fields worth knowing: `quotedAt` (7-day hold, re-priced on load when expired), `lastStep` (resume),
  `priceChange` (set through `invalidateQuote(d, reason)`, never a bare `quote: null`), `noBooking`
  (out-of-area price-only flow), `spotOk`, `keysAt`, `slotDropped`.
- Review links pass `state: { returnTo: 'details' }`; `next()` returns there and redirects keep the state.
- Day strings are local `YYYY-MM-DD`; parse with `toDate()` from `src/data/schedule.js`, never `new Date(str)`.
- Demo data: plate `LKD4821` (TX) finds a 2019 Toyota RAV4; ZIPs 786/787 (Austin), 770-775 (Houston),
  750-752/760-761 (DFW), 780-782 (San Antonio); anything else is out of area. The third open day is always
  fully booked; Sundays are closed.
- Design directions: `style` in `BrandContext` (`v1` Editorial, `v2` Job ticket), persisted in `nb-prefs`,
  URL `#/?v=2`. Type/shape overrides in `styleShape` (`src/brand/tokens.js`), layout rules in
  `src/styles/v2.css` scoped to `[data-style='v2']`, and `src/pages/HomeV2.jsx`. Everything else is shared.
- UX notes: numbered recommendation markers (`src/ui/UXNote.jsx`, content in `src/data/uxnotes.js`), on by
  default, toggled in the Prototype panel. Keep the numbering in sync with the Notes page (it reads the same list).
- The Prototype panel switches brand and scheme, can make the mock API slow or fail the first attempt of
  every call, and can seed a returning NuBrakes customer. Desktop: bottom right toggle. Under 820px: an icon
  in the header that opens a bottom sheet. It is a reviewer tool, not product UI.
- Photos: none yet. Image hosts were blocked in the build environment. If added, self-host WebP in
  `public/photos/` with credits, per the repo rules.
- Real company names appear because this is a response to their brief. No logos: wordmarks are plain text.
  The footer states it is a concept prototype with sample data.
- No em/en dashes in visible copy. After pushing this branch, redeploy `main` on Vercel.
