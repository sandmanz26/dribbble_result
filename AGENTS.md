# AGENTS.md: technical brief for AI assistants

Read this before changing anything in this repository. It explains how the repo is organised,
the rules that keep projects separate, and how a project gets from a branch to a live URL.

## 1. What this repository is

A portfolio of **design + front-end responses to client briefs** (mostly Dribbble project briefs).
Each brief becomes one self-contained project: researched, designed and built as a clickable
prototype with mock data, then shared with the client behind a password.

The owner works as a senior UX designer who also delivers front-end code. Scope per project is
always: **UI design + front-end code (React). No backend, no database, no real payments.**

Everything discussed with the owner (preferences, history, open items) is recapped in
`docs/RECAP.md`. Read it after this file.

**Two Claude sessions work on this repository at the same time** (`cloud` on the web and `desktop` on
the owner's computer). Before changing anything, read `docs/COLLABORATION.md` and check
`docs/CLAIMS.md` on a freshly pulled `main`. Never push to a branch the other session has claimed.

## 2. The core rule: one project = one branch = one codebase

```
GitHub repo: sandmanz26/dribbble_result
│
├── main                                  ← deploy hub only. NO project code here.
│     build.mjs, middleware.js, projects.json, vercel.json
│
├── claude/modest-mayer-eyddvw            ← project1: Wanderlog Gang (own code, own design)
├── claude/photo-video-marketplace-app    ← project2: Proof (own code, own design)
├── claude/nubrakes-dual-brand            ← project3: NuBrakes dual-brand (own code, own design)
├── claude/busticated-audio-plugin        ← project4: Scrapyard BC-01 (own code, own design)
├── claude/student-portal-bilingual       ← project5: Nelum Vidyalaya SMS (own code, own design)
├── claude/westpoint-case-study           ← project6: Westpoint case study (owner's page, served as-is)
├── claude/caravan-group-travel           ← project7: Caravan group travel app (own code, own design)
├── claude/tend-wellness-ritual           ← project8: Tend wellness ritual app (own code, own design)
├── claude/globaltrade-broker             ← project9: GlobalTrade broker website and dashboards (own code, own design)
├── claude/planogram-restock-app          ← project10: Faceup planogram restock app (own code, own design)
├── claude/flock-flame-menu-app           ← project11: Flock & Flame chicken and grill menu app (own code, own design)
├── claude/golden-stone-logistics         ← project12: Golden Stone Logistics China and Ghana website (own code, own design)
├── claude/golf-exercise-layout          ← project13: Oppsett golf exercise setups on the real photo (own code, own design)
├── claude/darb-saudi-logistics          ← project14: Darb bilingual Arabic and English Saudi logistics website (own code, own design)
├── claude/skill-research-bridge         ← project15: Skill-to-Research Bridge, student and lab dashboards with a passport (own code, own design)
├── claude/myelin-ai-brain               ← project16: Myelin AI brain platform, web, desktop and mobile (own code, own design)
├── claude/school-student-records        ← project17: Roll school student records app (own code, own design)
├── claude/selvedge-retail-os            ← selvedge: Selvedge AI retail OS, portfolio case for the retail ERP brief (own code, own design)
├── claude/flow-director-clinic-ops       ← rawat (and old /flowdirector/): Rawat clinic operations, owner's portfolio piece (own code, own design)
└── <new branch per new brief>            ← project5, project6, ...
```

- Every project lives on **its own branch**, created as an **orphan branch** (no shared history).
- Projects **never share code, components, styles, tokens, fonts, icons or copy.** The owner wants
  zero visual or structural bias between projects. Do not create a shared UI package, do not copy
  components from one project branch into another, do not "reuse the design system".
- Each project has its own `package.json`, lockfile, dependencies and visual language.
- `main` contains no project code. It only assembles the branches into one site.

If a task says "work on project X", check out that project's branch and stay on it.

## 3. Current projects

| Slug (URL) | Password | Branch | Project | Type | Stack and design notes |
|---|---|---|---|---|---|
| `/project1/` | `PR001` | `claude/modest-mayer-eyddvw` | Wanderlog Gang: retro illustrated travel blog | Website | React 18, Vite 5, react-router (HashRouter), Motion, Phosphor icons. Big Shoulders Display + Figtree. Paper/navy ink + one cobalt accent. Light/dark. Photos self-hosted in `public/photos/` |
| `/project2/` | `PR002` | `claude/photo-video-marketplace-app` | Proof: photography and videography marketplace | **Mobile app** | React 18, Vite 5, react-router (HashRouter), Motion, Tabler icons. Geist. Monochrome + one vermilion accent. Light/dark. On desktop renders inside a phone frame; on phones runs full screen. Portfolio images self-hosted in `public/portfolio/` |
| `/project3/` | `PR003` | `claude/nubrakes-dual-brand` | NuBrakes + Valvoline: dual-brand reskin and quote/booking redesign | Website + flow | React 18, Vite 5, react-router (HashRouter), Lucide icons, no animation library. Archivo (variable width) + Public Sans. One component set, two brand token sets (NuBrakes yellow, Valvoline red/navy), light/dark. Brand colours are placeholders. Numbered UX notes layer (recommendation, reason, metric) from the role description PDF. Two design directions switchable in the Prototype panel: V1 Editorial and V2 Job ticket (IBM Plex + Plex Mono, square, ruled). After-booking flows: receipt, warranty claim, past visits, returning NuBrakes customer (NB-/VMB- booking numbers; demo: plate LKD4821, ZIP 78704, booking NB-41873 + 0142). No photos yet (image hosts were blocked) |
| `/project4/` | `PR004` | `claude/busticated-audio-plugin` | Scrapyard BC-01: hardware-style audio plugin UI for The Busticated Co. | Plugin UI + handoff | React 18, Vite 5, react-router (HashRouter), Web Audio, iconoir icons, no animation library. Anybody (variable width) + Martian Mono. Cream enamel, bakelite, black ink, one signal-orange accent. Page light/dark; the plugin keeps its materials. Exported sprite sheets in `public/sprites/` (scripted export) |
| `/project5/` | `DRI05` | `claude/student-portal-bilingual` | Nelum Vidyalaya: bilingual (English/Sinhala) Student Management System | Web app, two versions | React 18, Vite 5, react-router (HashRouter), Remix Icon, no animation library. V1 Brief: client's #0B2545/#134074, Inter + Noto Sans Sinhala, achromatic-ledger portal (overview, students). V2 Concept: Gemunu Libre + Yaldevi, paper/ink + one marigold, grade picker as a chart of the school, the school day as the dashboard, every label in both scripts. Switch in the Prototype panel. Demo clock Thu 23 Oct 2026 10:05. Deep links `#/v2/today?lang=si&grade=12`. No photos (drawn motif) |
| `/project6/` | `wp-3xsf-qcya` | `claude/westpoint-case-study` | Westpoint: the owner's private case study (charter bus ERP, driver and passenger apps) | Case study page | Not a prototype: the owner's own single self-contained HTML (images inlined, no scripts), hosted here because Dribbble limits proposal domains. `npm run build` only copies `index.html` to `dist/`. Client work under NDA: do not edit or reuse its copy or images |
| `/project7/` | `cv-cqkr-rhyg` | `claude/caravan-group-travel` | Caravan: group travel app (discover, join verified groups, plan together, travel safely) | **Mobile app** | React 18, Vite 5, react-router (HashRouter), Hugeicons, d3-geo + world-atlas, no animation library. Bricolage Grotesque (display) + Manrope. Brand: "convergence map" (dashed routes from each member's home city to the destination on a night-navy field), ticket-style group cards, three-dots-on-an-arc mark, cool white ground + one rose accent (#d81f5c). Destination art drawn from real Natural Earth coastlines (photo hosts were blocked). Phone frame + reviewer panel on desktop, full screen on phones. Demo SMS code 2468; "Explore as Nadia" skips sign-up. Light/dark |
| `/project8/` | `td-9ymu-nhd4` | `claude/tend-wellness-ritual` | Tend: wellness app where a one-minute check-in becomes a ritual of breathwork, meditation and herbal guidance | **Mobile app** + research PDF | React 18, Vite 5, react-router (HashRouter), Heroicons, Web Audio (rain, hum, bell made in the browser), no animation library. Newsreader + Onest. Idea: each day is a cyanotype (sun print); the check-in weather sets one of five exposures of a single Prussian blue, and the day's herb is printed on it as a white silhouette drawn in code (`src/ui/Print.jsx`). Paper and ink, one 6px corner. Mood as weather, check-in that develops today's print one question at a time, two weeks as a row of prints, "Why this?" on every ritual step, herbs checked against health flags, apothecary-label protocol, tide breath player, moon meditation player. `#/system` design system page with the decision log (`docs/design-decisions.md`); `research.pdf` ten-competitor report with strengths and weaknesses (source `docs/report/research.html`). Review links `#/ritual?demo=stormy`, `?demo=evening`, `?demo=fresh`. Phone frame + panel on desktop, full screen on phones. Light/dark, morning/evening |
| `/project9/` | `gt-m3bk-20lf` | `claude/globaltrade-broker` | GlobalTrade: premium black-and-gold forex, gold and crypto broker | Website + client and staff dashboards | React 18, Vite 5, react-router (HashRouter), Tailwind v4 (no preflight, layered over the old CSS) with shadcn/ui-style components on Radix (`src/components/ui/`), Recharts, Carbon icons, Stack Sans Headline (light, sentence case) + Stack Sans Text. Landing (v4) follows the owner's Starlight-style dark fintech reference: headline "Trade gold on world time" with the live gold price chip in it, floating currency tiles with parallax, the client area leaning back and straightening on scroll, live market marquee, feature panels (card fan, cost calculator), payments, bento, animated FAQ, metal-card closing section (`src/pages/Home.jsx`, `src/landing.css`). Client and staff areas: shadcn sidebar shell, KPI cards with sparklines, live area charts with crosshair, queue-age chart. Warm black, one champagne gold (#d4ae62). Restrained glows and gradients are the owner's explicit choice for this project. Higgsfield image slots and prompts are in the branch's `docs/recap.md` (read it first). Live trading-session clock from the visitor's real time; simulated, labelled demo price feed. Sign-up with experience check, two-step log-in (demo code 482913, demo accounts on the page), client area (live equity, open trades, history, deposits and withdrawals), staff area (queues, identity checks, payments held by written rules, clients, support). Review links `#/client?demo=client`, `#/staff?demo=staff`. No password fields or file uploads anywhere (Chrome flagged the page as phishing): demo-account picker, sample ID only, fixed prototype bar. Regulatory and company details are bracketed placeholders: never fill them with invented claims. The brief's reference (Crest Peak Markets) could not be found; similar names are on regulator warning lists |
| `/project10/` | `fu-p6pu-f2la` | `claude/planogram-restock-app` | Faceup: restock walk from a planogram and a stock count | **Mobile app** | React 18, Vite 5, react-router (HashRouter), Bootstrap Icons, papaparse + read-excel-file, no animation library. Rethink Sans + JetBrains Mono (SKUs only). taste-skill app style "pastel consumer": large titles, white cards on grey, every choice in a bottom sheet (shared `Sheet` in `src/ui/kit.jsx`; custom column picker, no native selects). Colour is the store's wayfinding: one sign colour per aisle (blue, orange, green, magenta, grey for endcaps) as a pale tile with its dark as ink, status in words. CSV/Excel upload, column matching, SKU join in the browser, route-ordered walk (endcaps, then a snake through the aisles), missing-SKU and extra-SKU checks, items in two places split by room. Messy sample files in `public/samples/` (`npm run samples`). Review link `#/?demo=walk`. Phone frame + panel on desktop, full screen on phones |
| `/project11/` | `ck-7rmz-q4hp` | `claude/flock-flame-menu-app` | Flock & Flame: chicken and grill menu app (fried, grilled, mayo, grill specials) with offline ordering and easy menu updates | **Mobile app** | React 18, Vite 5, react-router (HashRouter), MingCute icons (`@mingcute/react`), no animation library. Funnel Display + Funnel Sans. v2: warm cream, ink, one tomato red (#d32a1f). 32 real food photos in `public/food/` (Open Images, CC BY 2.0, credits at `#/credits`). Picks carousel, photo menu grid with quick add, heat levels, dips, sides. v3 ordering modelled on the big chains (research and sources in branch `docs/strategy.md`): order setup sheet first (saved addresses with zone check, three branches with hours, curbside with car and bay), checkout (card charged on accept or cash, tip, minimum order, scheduled or cook on arrival), lifecycle sent, accepted, kitchen, rider, hand-off code, delivered, with sold-out answer, rider delay, refunds. Offline: browse and check out, order waits as not sent, rechecked against the live menu, sent once with one order key (`src/data/service.js`, `src/store.jsx`). Menu manager with draft and numbered published versions. Store `ff-state-v3`. Review links `#/?demo=offline`, `#/?demo=weak`, `#/?demo=reset`. Phone frame + reviewer panel (network online, weak, none; trigger failures) on desktop |
| `/project12/` | `gs-k2vx-9dnb` | `claude/golden-stone-logistics` | Golden Stone Logistics: China (Guangzhou, Yiwu, Shenzhen) to Ghana (Tema, Accra, Kumasi) freight website | Website | React 18, Vite 5, no router (one page), akar-icons, cobe (WebGL globe). v2: Host Grotesk + Noto Sans SC (owner dislikes Gloock; never use it). Deep green, gold, warm neutral. 12 real port, ship and warehouse photos in `public/photos/` (Open Images, CC BY 2.0, credited in footer). Photo hero with live cut-off card, services with photos, globe route band, consolidation flow, quote calculator (sample rates), tracking demo `GSL-24817`, gallery, offices with live clocks, FAQ accordion, enquiry form. English and Chinese switch (`gs-lang-v1`); sign in and WhatsApp marked Coming soon |
| `/project13/` | `og-7q0a-vvo8` | `claude/golf-exercise-layout` | Oppsett: golf coach's app (Oslo Golf Club). Photograph an area, pick an exercise from the bank (Øvelsesbanken), get the equipment layout drawn on the real photo | **Mobile app** | React 18, Vite 5, HashRouter, Ionicons 5 (react-icons), no animation library. Schibsted Grotesk + DM Mono. v2 (livelier): deep fairway green surfaces (#12402d: photo hero, band headers, saved setup cards, legend, floating tab bar), pale green ground, grass-tint chips, one pin-flag yellow (#f2d50c) for equipment on the photo and the main action. Per-photo camera model (`src/lib/geo.js`): exercises place equipment in ground metres from their rules (`src/data/exercises.js`), `src/ui/Overlay.jsx` projects it with perspective; drag markers (stay on the ground), other option, export PNG, save for a group. "What it saw" with Sure/Estimate labels; own photo calibrated with two taps and a distance. Build plan for a non-coder at `#/plan`. Real photos Open Images CC BY 2.0. Store `og-state-v1`. Review links `#/new?area=putting`, `#/new?area=range&exercise=OB-009`, `#/new?area=pitching&exercise=OB-022`. Phone frame + panel on desktop |
| `/project14/` | `db-2mmw-55ap` | `claude/darb-saudi-logistics` | Darb: premium bilingual (Arabic first, English) website for a Saudi shipping and logistics company. Placeholder name until the client's brand arrives | Website, RTL | React 18, Vite 5, HashRouter, Solar icons (`@solar-icons/react`), no animation library. Readex Pro (one family for Arabic and Latin). Limestone ground #eeede9, basalt ink, Red Sea night field #0e2430, one roshan teal #0b7a71. Square corners, logical CSS properties only, arrows mirror. Direction "the name as a monument": the Arabic name pinned while the route (sea, quay, yard, road, Riyadh) scrolls under it. Route planner by port of entry (Jeddah, Dammam, Rabigh) with distance, clearance and trucking days; Saudi map projected once from Natural Earth (`src/data/map.json`). Pages: home, services and six service pages, track (`DRB-240117` on the road, `DRB-240233` held for SABER, `DRB-239981` delivered, not found), four-step quote, network with live Riyadh office hours, about, careers, guides with sources, contact, developer handoff `#/handoff`, credits. Arabic-Indic digits in Arabic text, Latin in IDs; Hijri dates beside Gregorian. Language `darb-lang-v1`, quotes `darb-quotes-v1`; `?lang=en` deep links. 23 real photos Open Images CC BY 2.0 |
| `/project15/` | `br-5zo1-i3nv` | `claude/skill-research-bridge` | Skill-to-Research Bridge: university students' demonstrated skills matched to research projects | Website + web app | React 18, Vite 5, HashRouter, Octicons (`@primer/octicons-react`), no animation library on app screens. Atkinson Hyperlegible Next. Client palette: warm off-white #f6f3ec, deep navy #14213d, one lime #c6f432 used as a highlighter for verified evidence and the primary action. Landing "the sentence is the layout" (photo set in the headline) with a live readiness matcher. App style "editorial greeting". Readiness = weighted evidence (verified 100%, linked 70%, claimed 30%, half below level), 75% counts as ready, every score shows its table. Missing skills with closers (reviewed Bridge tasks). Blind review for labs, CRediT-role Contribution Passport with share link, expiry and view log, privacy settings, keyboard shortcuts (g + letter, /, ?). Routes `#/app`, `#/app/projects/bus-stop-heat`, `#/lab`, `#/lab/applicants`, `#/p/BRG-7Q4-LH2`. Store `brg-state-v1`. Sample university Northgate; photos Open Images CC BY 2.0 |
| `/project16/` | `my-t6qe-8vzd` | `claude/myelin-ai-brain` | Myelin (placeholder name): AI that answers by the cheapest path that is good enough, for the "AI Brain UI/UX for Web/Desktop/Mobile" brief | Website + web app + desktop + mobile | React 18, Vite 5, HashRouter, Tailwind v4 with shadcn-style components on Radix (`src/components/ui/`), Pixelarticons (`pixelarticons/react`), no animation library. Red Hat Text, Display and Mono (figures). taste-skill app style "data terminal": dark ground #141416, light ink, one amber #f0b04a as the only selection mark; path colours (Reflex green, Recall blue, Reason ink) are data, not accents. Paths Reflex (habit), Recall (memory + small model), Reason (large model); router with a confidence threshold that escalates on its own; savings against one baseline (all work by Reason); habits approved by a person; nightly Sleep report with a memory conflict. Signature: the day as a three-lane polygraph trace. Routes `#/` overview, `#/app`, `#/app/tasks/T-2177`, `#/app/memory`, `#/app/habits`, `#/app/spend`, `#/app/settings`, `#/app/sleep`, `#/desktop` (quick ask, Alt Space), `#/mobile`. Docs `docs/research.md`, `roast.md`, `prd.md`, `design-plan.md`. Store `myl-state-v1`. Sample workspace Fernwood Studio; photos Open Images CC BY 2.0 |
| `/project17/` | `rl-i0oh-4gkf` | `claude/school-student-records` | Roll: phone app for school office staff and teachers, student personal details and exam records ("School Student Database App Design" brief) | **Mobile app** | React 18, Vite 5, HashRouter, Iconsax (`iconsax-react`), no animation library. Mona Sans (variable width, expanded headings) + Spline Sans Mono (IDs, marks). Neutral grey ground, white surfaces, ink; the one accent is the school brand token (default plum #a3195b, three sample schools switchable). Forgiving search (typos, admission no., class, parent name or phone ending), role scoping (registrar vs teacher), masked IDs and health details revealed with a reason, access log, suggest-a-correction, five-step add student with duplicate check and autosaved draft, marks roster with registrar review and lock, offline queue, PIN 1357 and idle lock. Initials instead of photos (minors). Store `roll-state-v1`. Review links `#/?as=teacher`, `#/search?q=amra`, `#/marks/9B-math?as=teacher`. Demo clock 18 Feb 2027. Phone frame + reviewer panel on desktop |
| `/rawat/` (also `/flowdirector/`) | `fd-w8tq-3jxc` | `claude/flow-director-clinic-ops` | Rawat: clinic operations for an Indonesian primary clinic (FKTP, BPJS). Started as the Flow Director Upwork brief, now the owner's own portfolio piece; both slugs serve the same build | Web app | React 18 + **TypeScript**, Vite 5, HashRouter, Tailwind v4, Radix (dialog, popover, select, tabs, tooltip, switch), Radix Icons. Plus Jakarta Sans + Commit Mono (IDs). Klinik Pratama Kenanga Medika, Bandung, Indonesian names throughout. Modules: Today, registration (NIK, BPJS eligibility), queue board + `#/display` TV, vitals, SOAP consult with ICD-10, lab, pharmacy (FEFO), cashier, patients, schedule, inventory, PCare / Mobile JKN / SATUSEHAT sync with retry, KBK reports, assistant Asa with approvals, activity, settings, role switch (`rw-role`). Fixed bottom demo banner. Research `docs/research.md`. Synthetic data |
| `/selvedge/` | `sv-4rkx-msbd` | `claude/selvedge-retail-os` | Selvedge: AI operating system for a luxury fashion group in Indonesia (owner, store manager, new advisor). Dribbble "Retail Management ERP" brief (ORVUM), presented as the owner's portfolio case under NDA: client name redacted, about 30% of modules shown as redacted (Buying, Finance, Cash flow, Analytics, Settings) | Web app + case notes | React 18, Vite 5, HashRouter, Fluent UI System Icons, hand-drawn SVG charts. Albert Sans + Fragment Mono (figures). taste-skill app style achromatic ledger on an open-plane shell; warm grey ground, ink chrome; the one hue, selvedge red (#a32a24), marks only what the AI wrote (stitched edge). Indonesian names, English UI, IDR. Case notes at `#/`; role homes `#/today?as=owner|manager|advisor`; Ask panel (Ctrl J) with scripted answers that show what they looked at and their sources; Decisions with evidence, approve/edit/decline, undo; Autopilot autonomy levels and log; "Show me" guide `#/stock/laras-mini`. Store `sv-state-v1`. Research `docs/research.md`. Product photos Open Images CC BY 2.0 |

Live site: `https://proposal-virid-eight.vercel.app/<slug>/` (the domain may be renamed in Vercel).
The root `/` and any unknown path intentionally return "Nothing to see here." There is no index page.

## 4. How deployment works

```
push to main ──► Vercel builds main ──► node build.mjs
                                          for each entry in projects.json:
                                            git clone --depth 1 --branch <branch>
                                            npm ci && npm run build
                                            copy dist/ → out/<slug>/
                                        ──► middleware.js gates every request
```

- **Hosting:** Vercel. Production Branch must be `main`.
- **`projects.json`:** the list of projects to build (`slug`, `branch`, `title`).
- **`build.mjs`:** clones each branch from the public GitHub repo and builds it. If the repo becomes
  private, set the `PROJECTS_REPO` env var in Vercel to an authenticated clone URL.
- **`middleware.js`:** Vercel Routing Middleware (`@vercel/functions`). Runs on every path:
  - `/<slug>/...` without a valid cookie → password page (401). This also blocks JS, CSS and images.
  - Correct password (POST to `/<slug>/`) → sets an HttpOnly cookie `gate_<slug>` scoped to
    `Path=/<slug>/` for 30 days, then 303 redirects back (keeps the `#hash` deep link).
  - Anything else → "Nothing to see here." (404).
  - Passwords are hardcoded in `PASSWORDS`; env var `PASSWORD_<SLUG>` (e.g. `PASSWORD_PROJECT1`)
    overrides them. Changing `SECRET` signs everyone out.
- **Never indexed.** Everything on this site is private. `vercel.json` sends
  `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` on every path, the middleware
  sends the same header on its own pages and serves `/robots.txt` as `Disallow: /`, and `build.mjs`
  adds a robots noindex meta to every built HTML page that lacks one. Keep all three.
- **`vercel.json`:** `buildCommand: node build.mjs`, `outputDirectory: out`, `trailingSlash: true`
  (needed so `/project1` becomes `/project1/` and relative asset paths resolve).
- **Important:** pushing to a project branch does **not** redeploy the live site. After changing a
  project branch, redeploy `main` in Vercel (or push any commit to `main`, or call a Deploy Hook).

## 5. Requirements every project must meet (or the hub breaks)

1. Vite `base: './'` so all asset URLs are relative. Never use absolute paths like `/assets/x.png`
   or `/photos/x.webp` in code; use `photos/x.webp` (relative).
2. **HashRouter** (URLs like `/project2/#/creator/amara-okafor`). The site is static with no SPA
   rewrites, so BrowserRouter routes would 404 on refresh.
3. `npm run build` outputs to `dist/`, and a committed `package-lock.json` exists (`npm ci` is used).
4. localStorage keys are **prefixed per project** (all projects share one origin).
   In use: `wg-*` (project1), `proof-state-v1` (project2), `nb-*` (project3), `bz-*` (project4), `sp-state-v1` (project5), `cv-state-v1` (project7), `td-state-v1` (project8), `gt-state-v1` (project9), `fu-state-v1` (project10), `ff-state-v3` (project11), `gs-lang-v1` (project12), `og-state-v1` (project13), `darb-lang-v1` and `darb-quotes-v1` (project14), `brg-state-v1` (project15), `myl-state-v1` (project16), `rw-role` (rawat), `sv-state-v1` (selvedge), `roll-state-v1` and `roll-queries-v1` (project17).
5. No backend calls. Data is mock data in `src/data/`. State may persist to localStorage.
6. Images are **self-hosted** in the project's `public/` folder (WebP renditions), with credits in
   the app. Do not hotlink Wikimedia/Picsum/Unsplash at runtime: Wikimedia rate-limits hotlinks.

## 6. Adding a new project (checklist)

```bash
# 1. New orphan branch in its own worktree (no shared history or files)
git fetch origin
git worktree add --orphan -b claude/<short-project-name> ../<folder>
cd ../<folder>

# 2. Scaffold a fresh Vite + React app (do not copy from other project branches)
#    vite.config.js: base: './'   router: HashRouter   build → dist/
npm install && npm run build      # must succeed; commit package-lock.json

# 3. Commit and push the project branch
git push -u origin claude/<short-project-name>

# 4. On main: register it
#    projects.json  → { "slug": "project3", "branch": "claude/<short-project-name>", "title": "..." }
#    middleware.js  → PASSWORDS: project3: 'PR003'
npm test && node build.mjs        # on main, before pushing
git push origin main              # triggers the Vercel deploy
```

Passwords follow `PR001`, `PR002`, `PR003`, ... matching `project1`, `project2`, `project3`, ...
From project5 on, each project gets its own unrelated password (project5: `DRI05`, project6: a random
`wp-xxxx-xxxx`) so knowing one password does not let anyone guess the others.

Slugs are `projectN` for Dribbble briefs, unless the owner asks for a named URL (as for `selvedge`). Briefs from other platforms (Upwork) get their own name as
the slug, letters only, no hyphens (for example `flowdirector`), because the env override is
`PASSWORD_<SLUG>`.

## 7. Per-project working method (what the owner expects)

1. **Read the brief** (usually a Dribbble screenshot: title, budget, timeline, description).
2. **Design read** in one line: page kind, audience, visual language. Pick a visual language that is
   new for this project. Different fonts, palette, icon library and layout from earlier projects.
3. **Research**: competitors and how they work. Keep notes in `docs/strategy.md` on the project
   branch (problem, goals, IA, UX decisions, business model, competitor frame). The owner may supply
   screenshots/PDFs of competitor research; turn them into findings and design changes.
4. **Build** the prototype: real flows, mock data, and full UI states (loading, empty, error, success),
   responsive, light/dark, `prefers-reduced-motion` respected, accessible labels and focus states.
5. **Verify** with real screenshots (Playwright/Chromium) before claiming it works.
6. **Ship**: push the project branch, register it on `main`, redeploy, test the live URL with its password.

### Design quality bar ("no AI slop")
The owner explicitly rejects generic AI-looking output. Avoid:
- em dashes (—) and en dashes (–) anywhere in visible copy; use commas, periods or a hyphen
- a small uppercase "eyebrow" label above every section heading
- three equal feature cards in a row; repeating the same section layout
- purple/blue AI gradients, glows, emoji used as icons, hand-drawn fake screenshots
- pills or stamps overlaid on photos; cute or forced copy; fake-precise numbers presented as real
- a section that flips the page theme mid-scroll; more than one accent colour per project
- Inter or a default serif as the automatic font choice
Use one accent colour, one corner-radius system, real photos, an icon library (never hand-drawn icon
SVGs), and plain, specific copy.

## 8. Client-facing constraints (Dribbble)

- Dribbble blocks proposals that contain **contact details or direct payment methods** before the
  project is paid. In proposal text avoid: emails, phone numbers, social handles, "DM me", and payment
  brand names such as PayPal, Apple Pay, Stripe or bank transfer. External links may also be flagged;
  if so, show the work as a Dribbble shot instead. Never obfuscate links to get around the filter.
- Do not show photos of real public figures (politicians, celebrities) as a fictional creator's work.

## 9. Repository conventions

- Commit messages: imperative summary line, short body explaining why. No AI model names or IDs in
  commits, code or docs.
- Never force-push or rewrite history on these branches.
- Never commit `node_modules/`, `dist/`, `out/` or `.projects/` (see `.gitignore`).
- Keep each project's `README.md` and `docs/strategy.md` current on its own branch.

## 10. Known gotchas

| Symptom | Cause | Fix |
|---|---|---|
| Live site shows a project at `/` and 404 at `/project2/` | Vercel is deploying a project branch, not `main` | Vercel → Settings → Git → Production Branch = `main`, then redeploy |
| Project change not visible live | Pushing a project branch does not rebuild `main` | Redeploy `main` |
| Assets 404 at `/project1` (no trailing slash) | Relative paths resolve against `/` | Keep `trailingSlash: true`; middleware also redirects |
| Images fail to load | Hotlinked third-party images got rate-limited | Download once, convert to WebP, serve from `public/` |
| Two projects overwrite each other's saved state | Same localStorage key on the shared origin | Prefix keys per project |
| Dribbble shows "Contact details and direct payment methods can't be shared" | Payment brand names, links or contact info in the text | See section 8 |
