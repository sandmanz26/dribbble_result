# GlobalTrade (project9): full recap

Everything discussed and decided for this project, in order, so another tool or person can pick
it up from the repository alone. Live at `/project9/` on the hub, password `gt-m3bk-20lf`.

## 1. The brief (Dribbble, budget $20,000, "within the next few days")

Premium black-and-gold cryptocurrency and forex trading broker website for GlobalTrade:
- Homepage: attractive hero, market information, live charts, company details, FAQs, contact.
- Client registration, secure login, personal trading dashboard (balances, trading history,
  deposits, withdrawal requests).
- Administrator dashboard: manage client accounts, verify identities, monitor transactions,
  respond to support tickets.
- Responsive across mobile, tablet and desktop. Clean navigation, secure data handling,
  professional experience.
- Inspiration "Crest Peak Markets", but original layout and identity, **no fabricated results or
  unverified regulatory claims**. The project "also requires development support".

Scope as always for this portfolio: UI design and front-end code (React) only. No backend, no
database, no real payments. All data is mock data in `src/data/`.

## 2. Standing rules from the owner

- Good-quality mock data, no backend. Numbers must add up (balances, statements, totals).
- Roast the design once before calling it done; verify with real screenshots.
- No AI slop (see AGENTS.md section 7). The owner's later, explicit requests win over the house
  rules where they conflict (see section 6 below).
- Desktop web first for this project ("this is web design, so it must look like the web, not
  mobile"), still responsive.
- Never invent regulatory or company facts. They stay as bracketed placeholders, rendered with a
  dotted underline and the title "To be confirmed by GlobalTrade before launch".
- The reference "Crest Peak Markets" could not be found. Similar names (CrestPoint Markets, Global
  Crest Markets) are on UK FCA / IOSCO warning lists. Nothing is taken from them.
- Recap everything in markdown in the repository (this file), because the owner may read the repo
  with other tools.

## 3. Iterations and the feedback that drove them

| Round | Owner feedback | What changed |
|---|---|---|
| v1 | (first build) | taste-skill direction "the dark room": live gold chart hero, session bars, Work Sans. Client and staff areas in a "data terminal" app style. |
| v2 | "Looks cheap, not really premium, re-read the brief" | Direction "dressed as something else" (watch counter): world-time dial hero (`src/ui/Dial.jsx`), paperwork on paper, Bodoni Moda + Jost. |
| v3 | "Looks very rough. I want luxury first impression, interaction, tidier layout, web not mobile; do competitor research; roast once" | Direction "the sentence is the layout": headline with the live gold price set where the word gold would be, working market screen with crosshair, typed cost line, stage slider. Imbue + Albert Sans. |
| v3.1 | "Font size still stiff, not modern, feels classic" | Type changed to Stack Sans Headline (light, sentence case, tight tracking) + Stack Sans Text. |
| v4 (current) | "Landing still stiff. Use Higgsfield (20 credits) to generate images, follow my reference (Starlight-style dark fintech page), steal visually from competitors, add transition animations. Dashboards are stiff: make them modern and futuristic, use shadcn as the base. Keep it mock. Recap everything in md." | Landing rebuilt after the reference; client and staff areas rebuilt on Tailwind + shadcn/ui patterns. See sections 4 and 5. |

## 4. Current landing page (v4)

Reference supplied by the owner: a dark "Financial OS for Web3 teams" page (Starlight; the
company has since shut down, so only its visual language is borrowed). Its anatomy, mapped to
GlobalTrade:

| Reference | GlobalTrade |
|---|---|
| Small announcement pill above the headline | "Live · Forex, gold and crypto in one account" pill, links to the markets |
| Big centred light headline | "Trade [live gold chip] on world time", Stack Sans Headline light |
| Floating 3D crypto icons around the hero | Four floating currency tiles (Au, €, ₿, Ξ) with mouse parallax and a slow float. **CSS for now, meant to be replaced by Higgsfield renders, see section 7** |
| Product dashboard screenshot under the hero | The real client area (live equity, balance, open-trade profit, live XAU/USD chart, market list) in a window frame that leans back 26° and straightens as you scroll |
| Partner logo strip | A marquee of the eight markets with live demo prices (no fake partner logos) |
| Large feature cards with 3D objects | "Every market in one account" with a fan of live instrument cards that spreads on hover; "Know the cost before you trade" with a working cost calculator (market chips + amount slider → largest position at the retail leverage limit, spread cost, effect of a 1% move) |
| "Payments for every use case" cards | Card, bank transfer, withdrawals (checked by a person), client money kept apart (placeholder) |
| Bento grid "a few more things" | World-time dial, trade confirmation, withdrawal tracker, $10,000 practice account, identity checked by a person, human support, risk explained |
| FAQ two-column | Heading and contact left, six questions right (animated accordion) |
| Closing CTA with a 3D card | "Open an account in minutes" with a brushed black metal GlobalTrade card that tilts and catches a light that follows the cursor |
| Footer columns + status dot | Columns, regulatory placeholders, risk warning, "Demo price feed live" dot |

Motion and transitions: hero parts rise out of a blur one after another; currency tiles float and
follow the mouse; the product preview straightens with scroll; sections reveal with a staggered
rise-and-sharpen; marquee pauses on hover; a light follows the cursor on panels and bento tiles;
cards lift on hover; FAQ rows expand smoothly. All honour `prefers-reduced-motion`.

Code: `src/pages/Home.jsx`, effects in `src/landing.css`, Tailwind utilities with the dashboard
tokens (`.dash` root).

## 5. Current client and staff areas (v4)

Built on Tailwind v4 (no preflight, layered so the old CSS cannot override it) with shadcn/ui
component patterns, written by hand in `src/components/ui/` because the shadcn CLI registry is not
reachable from the build environment:
`button` (CVA variants), `card`, `badge` (status tones), `table`, `tabs` (Radix), `input` /
`textarea` / `label`, `select` (Radix listbox), `misc` (Radix avatar, progress, tooltip, dropdown
menu). Helpers: `src/lib/utils.js` (`cn`), `src/components/dash.jsx` (`PageHeader`, `Kpi` with
Recharts sparkline, `PriceArea` live area chart with crosshair tooltip, `Notice`, `Empty`).

Look: near-black ground with a faint grid and one warm light at the top, glass cards with a lit
top edge, champagne gold as the only accent, positive green and negative red for money only.

- Shell (`src/ui/Shell.jsx`): shadcn-style sidebar (brand, area badge, nav with a glowing active
  bar, live market-state card, user dropdown with website and log out), sticky blurred header with
  breadcrumb, "Demo prices" badge and live UTC clock. Icon rail below 1024px, bottom bar below 768px.
- Client (`src/pages/Client.jsx`): KPI cards (equity with an 8-hour equity sparkline recomputed
  from each open trade at past prices, balance, margin used with a progress bar, free to withdraw),
  live chart with market switcher, open trades table with close and undo, trading sessions bars;
  trade history with tabs, KPIs and result-by-market bars; deposits and withdrawals with quick
  amounts, Radix select, validation and history.
- Staff (`src/pages/Staff.jsx`): queue KPIs, identity-check age chart against the 24-hour target,
  support list, payments held by a rule; identity checks two-pane review with approve, ask for
  another document, reject (with undo); money movements with release/return; clients with search,
  tabs and restrict/lift; three-pane support inbox with client context.

All logic, mock data and demo accounts are unchanged from v1:
- Client: `sofia.brandt@example.com` / `demo-trader-2026`; staff: `k.asante@globaltrade.example` /
  `demo-staff-2026`; second-step code `482913`.
- Review links: `#/client?demo=client`, `#/staff?demo=staff`.
- State persists in `localStorage` under `gt-state-v1`.

## 6. Where the owner's direction overrides the house rules

The taste-skill house rules ban gradients, glows, shadows at rest, pill badges above headlines
and glass. The owner's reference uses all of them in a restrained way, and the owner asked to
follow it, so v4 uses: radial warm light behind the hero, soft glow under the preview, glossy
tiles, a pill above the headline, glass cards with a lit edge, and small shadows on the gold
button and the metal card. Still kept from the rules: one accent colour (champagne gold), no
violet or blue AI gradients, no emoji icons (Carbon icons), no invented proof or regulatory
claims, no em dashes in copy.

## 7. Images and Higgsfield

The owner connected Higgsfield and allowed 20 credits for image generation. In this session the
Higgsfield connector only exposed read tools (workspaces, models, balance, history), so nothing
was generated. To enable it, allow the generation tool in the connector's permissions on
claude.ai (Settings, Connectors, Higgsfield). When it is available, generate these and save them
as WebP in `public/renders/` (self-hosted, never hotlinked):

| Slot | Where | Prompt |
|---|---|---|
| `tile-gold.webp` (1:1) | Hero, top left | "Glossy 3D app-icon style rounded square tile made of polished gold with an embossed 'Au' and a small gold bar, soft studio light from above, subtle reflection, isolated on pure black, product render, no text other than Au" |
| `tile-euro.webp` (1:1) | Hero, left | Same style, deep cobalt glass tile with a chrome euro sign |
| `tile-btc.webp` (1:1) | Hero, top right | Same style, warm orange glass tile with a chrome bitcoin symbol |
| `tile-eth.webp` (1:1) | Hero, right | Same style, graphite tile with a chrome ether diamond |
| `card-metal.webp` (16:10) | Closing CTA | "Matte black brushed-metal payment card with a champagne-gold edge and chip, floating at a 3/4 angle, warm rim light, black background, premium product render, no logos, no text" |
| `panel-markets.webp` (4:3) | Feature panel 1 | "Three translucent dark glass cards stacked in a fan, each with a thin gold line chart, floating in darkness with a warm glow underneath, minimal, premium fintech render, no text" |

Model suggestion: `nano_banana_pro` or `gpt_image_2` (high quality, transparent or black
background), 2k. Swap the CSS tiles in `Hero()` and the card in `Closing()` for `<img>` with alt
text; keep the CSS versions as the fallback.

## 8. Competitor research notes (all rounds)

- Large brokers (IG, Saxo, Swissquote, Pepperstone, eToro, Exness) lead with live prices, the
  platform itself, low costs and regulation; risk warnings are legally required, often in a strip.
- Coinbase and Kraken: calm language, strong on security and verification steps.
- Luxury finance (Citi Private Bank, Goldman Sachs' dark pages): black ground, one refined face,
  gold as a material, never a gradient.
- Black-and-gold trading templates (SuperDesign "JeetForeXx", Framer fintech templates) look cheap
  because of bright yellow gradients and glows; we use flat champagne gold.
- Dark fintech landing patterns (Ledgerline, shadcn "Bento 45", the Starlight reference): dark
  base, one accent, a product dashboard in the hero, bento grid for smaller promises.
- Gap GlobalTrade fills: most brokers sell excitement; GlobalTrade shows costs, hours and checks in
  plain numbers.
- Broker sites could not be opened from the build environment (network policy); research came from
  search results.

## 9. Placeholders the client must fill before launch

Registered company name and address, regulator and licence number with a link to the public
register, segregated client money arrangement and banks, regulator-required risk figure, leverage
limits under GlobalTrade's licence (the cost calculator uses EU/UK retail limits: 1:30 major
pairs, 1:20 gold and minor pairs, 1:10 silver, 1:2 crypto), support hours, legal documents,
complaints process. The price feed is a seeded random walk in the browser and must be replaced by
the broker's real feed.

## 10. How to run

```bash
npm ci
npm run dev        # local
npm run build      # outputs dist/, used by the hub's build.mjs
```

Stack: React 18, Vite 5 (`base: './'`), react-router HashRouter, Tailwind v4 (`@tailwindcss/vite`),
Radix UI primitives, class-variance-authority, tailwind-merge, Recharts, Carbon icons, Stack Sans
Headline and Stack Sans Text (Fontsource, self-hosted).

## 11. Chrome "Dangerous" warning (round 6)
The owner saw Chrome mark the hub as deceptive ("Check your passwords") only on project9; other
projects open normally. A broker look-alike with email and password fields, ID upload and deposits on
a free `vercel.app` domain is exactly the pattern Google Safe Browsing treats as phishing. Changes:
- No password field anywhere: log in is a choice of demo accounts, then the demo code step (with a
  "fill in the demo code" button). Registration explains the password step instead of asking for one.
- No real file upload: the identity step only accepts a sample document.
- Every page shows a fixed bar: design prototype with demo data, not a real broker, do not enter real
  personal, login or payment details.
- The owner could not file the false-positive report; a custom domain for the hub would also separate
  its reputation from `vercel.app`.
