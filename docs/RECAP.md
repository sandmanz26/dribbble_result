# Portfolio recap: everything discussed with the owner

A plain record of the owner's preferences, the working method and the state of every project, so
another tool or person can continue from the repository alone. Technical rules for the repository
itself are in `AGENTS.md`; each project branch keeps its own `README.md` and `docs/strategy.md`
(project9 also has `docs/recap.md` with its full history).

## 1. Who the owner is and how they work

- Senior UX / product designer and head of UI/UX who also delivers front-end code. Writes to the
  assistant in Indonesian; client-facing text is in English.
- Responds to Dribbble project briefs. Each brief becomes one project here: researched, designed and
  built as a clickable React prototype with good-quality mock data, then shared behind a password.
- Scope per project: UI design + front-end only. No backend, no database, no real payments.

## 2. Standing preferences (apply to every project)

- **No AI slop.** No em or en dashes in visible copy, no eyebrow labels over every heading, no three
  equal feature cards, no purple/blue AI gradients, no emoji icons, no fake screenshots, no invented
  proof, statistics, logos, reviews or regulatory claims. One accent colour, one radius system, an
  icon library, plain specific copy. Later, explicit owner direction wins (for example the project9
  v4 reference, which uses restrained glows and gradients).
- **Every project has its own visual language**: fonts, palette, icons and layout never repeat
  between projects. Fonts already used are listed in the AGENTS.md table; check it before choosing.
- **Design skill**: use `/design-taste-frontend` (taste-skill) for direction, then lint and inspect
  to 0 FAIL. App screens use its app styles. The owner also asked for shadcn/ui as the base for
  dashboards in project9.
- **Roast once before marking a project done**, with real screenshots (Playwright/Chromium) at
  desktop, tablet and phone widths.
- **Mobile apps** render inside a phone frame with a reviewer panel on desktop and full screen on a
  phone. Native-looking controls: no browser-default dropdowns; use custom pickers or bottom sheets.
- **Websites** must look like the web on desktop (not a stretched phone layout) and stay responsive.
- **Private**: every project has its own unrelated password, and nothing may be indexed by search
  engines (noindex header, meta and robots.txt, see AGENTS.md section 4).
- **Recaps in markdown**: keep decisions in the repository, because the owner may switch tools.
- **Fonts the owner dislikes**: Gloock and decorative or display serifs in general ("tolong ingat
  saya tidak suka font itu"). For corporate and service work use a modern, minimal sans.
- **Premium means real pictures**: real photographs (credited, self-hosted) beat food or objects
  drawn in code, which the owner read as lo-fi. Premium quality, not wireframe-level polish.

## 3. Dribbble client communication

- Proposals and messages must not contain contact details or payment brand names (emails, phone
  numbers, social handles, "DM me", PayPal, Stripe, bank transfer and so on). Never obfuscate links;
  if a link is flagged, show the work as a Dribbble shot instead.
- Ready-to-paste proposals for project11, project12, project13 and selvedge are in `docs/proposals.md`.
- Proposals explain the approach in words (the owner sees describing as proof of seriousness), then
  give the prototype link and password, and always include the owner's portfolio:
  createdybdaniel.com.
- Tone the owner wants: natural, casual but professional, straightforward and polite. No forced or
  cute lines.
- For projects 8, 9 and 10 the proposals say plainly that the prototype is an early exploration made
  in limited time, so it is not fully polished, but it shows the owner is serious; they mention the
  research done (project8: ten-competitor report; project9: broker landscape and the missing
  reference; project10: planogram tools versus spreadsheet joins) and give the link and password.
- Project4 client asked for a mood board. The reply explained that the delivered work came purely
  from reading the requirements in limited time, that more back-and-forth is needed, and that while
  waiting the owner may try a few more explorations to help sharpen the needs. An offer to make two
  or three visual explorations on the project4 branch is still open.

## 4. Projects, links and passwords

Live site: `https://proposal-virid-eight.vercel.app/<slug>/` (root and unknown paths show
"Nothing to see here.").

| Slug | Password | Project | Type |
|---|---|---|---|
| project1 | PR001 | Wanderlog Gang, retro illustrated travel blog | Website |
| project2 | PR002 | Proof, photo and video marketplace | Mobile app |
| project3 | PR003 | NuBrakes + Valvoline dual-brand quote and booking | Website + flow |
| project4 | PR004 | Scrapyard BC-01, hardware-style audio plugin UI | Plugin UI + handoff |
| project5 | DRI05 | Nelum Vidyalaya, bilingual school management | Web app, two versions |
| project6 | wp-3xsf-qcya | Westpoint, the owner's own case study (NDA, served as-is) | Case study page |
| project7 | cv-cqkr-rhyg | Caravan, group travel app | Mobile app |
| project8 | td-9ymu-nhd4 | Tend, wellness check-in to ritual | Mobile app + research PDF |
| project9 | gt-m3bk-20lf | GlobalTrade, premium broker site + client and staff areas | Website + dashboards |
| project10 | fu-p6pu-f2la | Faceup, restock walk from planogram and stock count | Mobile app |
| project11 | ck-7rmz-q4hp | Flock & Flame, chicken and grill menu app with offline ordering | Mobile app |
| project12 | gs-k2vx-9dnb | Golden Stone Logistics, China and Ghana freight website (English and Chinese) | Website |
| project13 | og-7q0a-vvo8 | Oppsett, golf exercise setups drawn on the real photo | Mobile app |
| project14 | db-2mmw-55ap | Darb, premium Arabic and English website for a Saudi logistics company | Website, RTL |
| project15 | br-5zo1-i3nv | Skill-to-Research Bridge, student and lab dashboards with a Contribution Passport | Website + web app |
| project16 | my-t6qe-8vzd | Myelin AI brain platform (web, desktop, mobile) | Website + web app + desktop + mobile |
| rawat | fd-w8tq-3jxc | Rawat, clinic operations for an Indonesian primary clinic (owner's portfolio piece) | Web app |
| flowdirector | fd-w8tq-3jxc | Old link, serves the same Rawat build | Web app |
| selvedge | sv-4rkx-msbd | Selvedge, AI retail operating system for a luxury fashion group (portfolio case under NDA) | Web app + case notes |

Upwork briefs get their own slug instead of `projectN` (owner's request), letters only.

Stack and design notes for each are in the AGENTS.md table.

## 5. Recent history (projects 8 to 10)

### project8, Tend
- Owner: "the UI is very ugly" led to a full redesign with the taste-skill: each day is a cyanotype
  (sun print) whose exposure is set by the check-in weather; the day's herb is printed on it.
- Owner: "find another font" led to Newsreader + Onest.
- Includes a ten-competitor research PDF and a design-system page with a decision log.

### project9, GlobalTrade
Five rounds; full detail in `docs/recap.md` on the `claude/globaltrade-broker` branch.
1. v1 "dark room" with a live gold chart. Owner: looks cheap, not premium.
2. v2 watch-counter world-time dial, Bodoni Moda + Jost. Owner: looks rough; wants luxury, interaction,
   tidy desktop layout, competitor research, one roast.
3. v3 "the sentence is the layout": live gold price inside the headline, working market screen, typed
   cost line. Owner: type still stiff and classic.
4. v3.1 Stack Sans Headline light, sentence case.
5. v4 (current): landing rebuilt after the owner's Starlight-style dark fintech reference with
   transition animations; client and staff areas rebuilt on Tailwind + shadcn/ui patterns (Radix,
   Recharts), modern and futuristic. Higgsfield image generation was requested (20 credits) but the
   connector only exposed read tools in that session, so image slots and prompts are documented for
   later.
- The brief's reference "Crest Peak Markets" could not be found; similar names are on regulator
  warning lists. All regulatory and company facts are bracketed placeholders.

### project10, Faceup
- First pass used a desktop-admin app style inside a phone frame. Owner: UI still not good, dropdowns
  are browser defaults; they must be custom components like a real mobile app.
- Rebuilt with the taste-skill app style "pastel consumer": large titles, white cards, aisle colours
  as pale tiles, every choice in a bottom sheet, and a custom column picker (keyboard support, drag to
  close, moves a column already in use). No native selects remain.

### projects 11, 12 and Flow Director (one request, three briefs)
The owner asked for all three at once, as senior UI/UX designer and head of creative, with
`/design-taste-frontend`, references treated only as direction ("jangan tangkap mentah mentah"),
and real impact. Reference pages (Dribbble, Behance) and every photo host were blocked from the
build environment, and the Higgsfield connector only exposed read tools again, so none of the 15
image credits for project11 were used. Each branch's `docs/recap.md` has the photo slots and prompts.
- **project11, Flock & Flame** (Dribbble, under $100): four menu boards in the colours of the four
  sauces on the counter; food drawn in code; heat, dips, sides; kitchen-ticket tracking; real
  offline (service worker, outbox that sends when back online, "Simulate no signal" switch); Menu
  manager that publishes numbered menu versions for "easy content updates".
- **project12, Golden Stone Logistics**: one motif, the circle: moon gate with a turning WebGL
  globe, coin-shaped mark, kente and key fret as edges; quote calculator, tracking demo, offices
  with live dials; full English and Chinese switch; future features marked Coming soon.
- **flowdirector** (Upwork, Nick Murphy): owner asked for shadcn as a base but improved, deep
  research first, only critical pages built and the rest shown as Upcoming. Built on their stack
  (React, TypeScript, Tailwind, Radix) with a job-state system, approvals with evidence and the rule
  that triggered them, recovery paths, activity log with undo, autonomy rules and a handoff page
  with the async API spec. Research in the branch's `docs/research.md`.

### Round after that: Rawat, Flock & Flame v2, Golden Stone v2, project9 warning
Owner: "the design review is very poor, not premium, still looks like AI slop" for all three.
- **Rawat** (was Flow Director): renamed and repositioned as the owner's own portfolio work, so the
  slug is `rawat` (password unchanged, `/flowdirector/` still works). Full module set for an
  Indonesian FKTP (Klinik Pratama Kenanga Medika, Bandung): registration with NIK and BPJS
  eligibility, queue board and TV display, vitals, SOAP consult with ICD-10 (144 FKTP diagnoses
  flagged), lab, pharmacy with FEFO batches, cashier (capitation vs. paid), patients, schedule,
  inventory, PCare / Mobile JKN / SATUSEHAT sync with failure and retry, KBK capitation scorecard,
  reports, an assistant (Asa) with approvals, activity log, settings, role-based access. All people
  have Indonesian names. A fixed bottom banner says it is a design prototype with synthetic data,
  not connected to BPJS. Research with sources in the branch's `docs/research.md`. Plus Jakarta Sans.
- **Flock & Flame v2**: code-drawn food replaced by 32 real food photos (Open Images, CC BY 2.0,
  credited on `#/credits`); warm cream, ink and one tomato red; Funnel Display + Funnel Sans;
  store key `ff-state-v2`.
- **Golden Stone v2**: Gloock dropped for Host Grotesk (+ Noto Sans SC); moon gate, eyebrows and
  numbering removed; 12 real port, ship and warehouse photos (Open Images, CC BY 2.0, credited in
  the footer); globe kept as a route band.
- **project9 Chrome "Dangerous" warning**: Google Safe Browsing flagged the page as possible
  phishing (a broker brand, a password form and an ID upload on a shared vercel.app domain). Removed
  every password field and the file upload (demo-account picker, "fill in demo code", sample ID
  only) and added a fixed prototype bar. A custom domain and a review request in Google Search
  Console are the owner's next step if the flag stays.
- Photo source for both: Open Images (Google), downloaded once, converted to WebP; Higgsfield still
  had no generation tool.

### project11 round 3: ordering made real
Owner: offline ordering and delivery were too simple and unreal; study how big brands do it. Rebuilt
from McDonald's, Chick-fil-A, Domino's, Uber Eats and the Starbucks offline-first web app: order setup
first with a zone check, curbside and cook on arrival, a real checkout, a full order lifecycle with
failures, and an honest offline outbox that rechecks the menu and sends once. Sources in the
branch's `docs/strategy.md`.

### Selvedge (Dribbble retail ERP brief, ORVUM)
Owner asked for a named URL like the Upwork ones, a senior product designer and PM approach with deep research first, English with Indonesian names, about 70% built so the rest reads as under NDA, the AI experience shown in full, and a roast before finishing. Built as a portfolio case: research with sources (branch `docs/research.md`), three role homes (owner, store manager, advisor on day 4), an assistant that starts from where you are and shows its sources, AI proposals with evidence and undo, autonomy limits per decision, and "Show me" lessons. Buying, Finance, Cash flow, Analytics and Settings are shown as redacted; the client name is a black bar. Two roast rounds are recorded in the branch's `docs/recap.md`.

### project13, Oppsett (Golf Exercise Gen)
A coach photographs an area at Oslo Golf Club, picks an exercise, and sees the equipment drawn on the photo in perspective and in metres. The scale comes from known objects (cup, ball, mat), or from two taps when none is in the photo. Every position has a reason, estimates are labelled, markers can be dragged, and exercises that cannot fit say why. A plain-language build plan at `#/plan` answers the brief's "explain each step simply". Research and IA are in the branch's `docs/strategy.md`.

UI refresh (owner: "make it livelier, it feels only white", with a golf app reference): deep fairway green surfaces (photo hero, band headers, saved setup cards, setup legend, floating tab bar), pale green ground, grass-tint chips with icons, photo tiles and thumbnails, filled active tab icons. Pin-flag yellow stays the one accent.

### project14, Darb (Premium Arabic UI/UX for Saudi Logistics, $350)
Arabic-first, English mirror, one font family for both scripts (Readex Pro). The Arabic name درب ("a path walked until it is known") is pinned as a monument while the route a container takes scrolls under it. Route planner by port of entry, tracking with a SABER hold state, four-step quote, network with live Riyadh office hours, guides with sourced facts (SABER and FASAH, the Jeddah to Riyadh corridor), and a developer handoff page with tokens and RTL rules. Brief asks for Figma: the proposal offers the code prototype now and Figma files built from the same tokens after award. Research and taste-skill notes in the branch's `docs/strategy.md`.

### project15, Skill-to-Research Bridge (under $100)
Landing with a live readiness matcher, student home, project page with the score worked out, evidence, applications, Contribution Passport (CRediT roles, share link with expiry, view log, PDF and JSON), privacy settings, and a researcher side (blind applicant review, pool coverage, contribution signing). Client palette kept (warm off-white, navy, lime). Accessibility led: Atkinson Hyperlegible Next, keyboard shortcuts, focus management. Notes in the branch's `docs/strategy.md`.

### project16, Myelin (AI Brain UI/UX for Web/Desktop/Mobile, $10,000)
Owner asked for deep research, a roast, a PRD and a design plan before the build (all in the branch's `docs/`). The concept turns the brief's "emulates the human brain, up to 80% cheaper" into something a user can see and check: every request takes one of three paths (Reflex habit, Recall memory, Reason large model), shows its confidence, cost and the saving against one stated baseline, and escalates on its own when unsure. Repeated work becomes a habit only after a person approves it; a nightly Sleep report merges, fades and flags memory conflicts. Surfaces: overview page, web app (Today, tasks, task detail, memory, habits, spend, settings, sleep), desktop quick ask over a mail app, mobile (today, voice ask, approve, report). shadcn-style components on Radix with Tailwind v4, as the brief asked. Placeholders: the name Myelin and the sample workspace Fernwood Studio.

### Working with two Claude sessions (from 30 Oct 2026)
The owner now runs a second Claude on their own computer next to the web session. Rules for sharing the repository without collisions are in `docs/COLLABORATION.md`: one owner per branch recorded in `docs/CLAIMS.md` on `main`, project numbers reserved before scaffolding, small pulled-first commits on `main`, a Status hand-over section in each branch README, and a `Session: cloud|desktop` line in commit bodies.

## 6. Open items

- project9: generate the hero tiles, metal card and panel renders in Higgsfield once the generation
  tool is allowed (prompts in the branch's `docs/recap.md`); restyle the sign-in pages to match the
  new dashboards if the owner wants; client must fill all bracketed regulatory placeholders.
- project5: an earlier partial UX-roast edit in a local working copy was never committed; ask the
  owner before finishing it.
- project4: optional two or three visual explorations for the client's mood board conversation.
- project11 and project12: generate food and logistics photos once Higgsfield generation is
  enabled (allow the generation tool in the connector settings on claude.ai); slots and prompts are
  in each branch's `docs/recap.md`. project12's Chinese copy needs a native speaker's review.
- rawat: a Bahasa Indonesia UI version if the owner wants it (UI copy is English with Indonesian
  context).
- rawat (old Upwork brief): proposal text for Upwork answering the screening questions (pending work, errors,
  approvals, recovery; walkthrough to design; API and async constraints) can be drawn from the
  branch's `docs/research.md` and the handoff screen.

## 7. Tooling notes for whoever continues

- Each project builds alone (`npm ci && npm run build` on its branch); `main` builds all of them with
  `node build.mjs` and redeploys on push. Pushing a project branch alone does not redeploy.
- The build environment blocks many image hosts and some websites; images are self-hosted in each
  project's `public/` folder, or drawn in code when no honest picture exists.
- Commit messages: imperative summary, short why. No AI model names in commits, code or docs. Never
  force-push.
