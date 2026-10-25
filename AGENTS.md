# AGENTS.md: technical brief for AI assistants

Read this before changing anything in this repository. It explains how the repo is organised,
the rules that keep projects separate, and how a project gets from a branch to a live URL.

## 1. What this repository is

A portfolio of **design + front-end responses to client briefs** (mostly Dribbble project briefs).
Each brief becomes one self-contained project: researched, designed and built as a clickable
prototype with mock data, then shared with the client behind a password.

The owner works as a senior UX designer who also delivers front-end code. Scope per project is
always: **UI design + front-end code (React). No backend, no database, no real payments.**

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
| `/project8/` | `td-9ymu-nhd4` | `claude/tend-wellness-ritual` | Tend: wellness app where a one-minute check-in becomes a ritual of breathwork, meditation and herbal guidance | **Mobile app** + research PDF | React 18, Vite 5, react-router (HashRouter), Heroicons, Web Audio (rain, hum, bell made in the browser), no animation library. Instrument Serif + Instrument Sans. taste-skill editorial-greeting style; one calm field per practice (sky, sage, clay, night, paper) + one teal accent. Mood as weather, conversational check-in, "Why this?" on every ritual step, herbs checked against health flags, apothecary-label protocol, tide breath player, moon meditation player. `#/system` design system page; `research.pdf` competitor report (source `docs/report/research.html`). Phone frame + panel on desktop, full screen on phones. Light/dark, morning/evening |

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
   In use: `wg-*` (project1), `proof-state-v1` (project2), `nb-*` (project3), `bz-*` (project4), `sp-state-v1` (project5), `cv-state-v1` (project7), `td-state-v1` (project8).
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
