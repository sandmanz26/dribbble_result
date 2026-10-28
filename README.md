# Golden Stone Logistics: Ghana and China freight website

Design and front-end prototype for a freight forwarder between China (Guangzhou, Yiwu, Shenzhen) and
Ghana (Tema, Accra, Kumasi). One page, responsive, English and Simplified Chinese. Sample content,
no backend.

Live on the portfolio hub at `/project12/` (password protected, never indexed).

## What is on the page
- **Hero**: a moon gate (the round garden doorway) holding a turning globe that moves between Ghana
  and southern China; floating cards with the next sea consolidation cut-off (always the coming
  Friday), air departure days, live clocks for Accra and Guangzhou, and a sample shipment. Hovering
  the route under the headline turns the globe to that end. Kente weave and key-fret band below.
- **Services** (interactive): sea freight, air freight, warehouse, cargo collection, shipment
  enquiries, freight quotations, each in plain words with who it suits, typical time and a next step.
- **How it works**: many suppliers into one shipment, drawn as loose parcels, one container line,
  then neat delivered rows.
- **Quote calculator**: sea or air, collection city, delivery, goods type, volume or weight; shows
  a price range, time on the way and the lines that make it up; blocks liquids by air; "send to our
  team" gives a reference. Rates are labelled as sample.
- **Tracking**: sample number `GSL-24817` with loading, not-found and found states; full timeline
  and position on the route.
- **Offices**: Accra and Guangzhou with live dials, open or closed now, hours, overlap.
- **FAQ** as filed index cards; **contact** as a coupon form with validation and success state.
- **Future features shown honestly**: language switch works now (Chinese copy is a draft for
  review); sign in and WhatsApp are marked "Coming soon"; tracking says live tracking arrives with
  accounts.

## Stack
React 18, Vite 5 (`base: './'`), akar-icons, cobe (WebGL globe), Gloock + Instrument Sans +
Noto Serif SC (Fontsource, self-hosted). Language choice in localStorage under `gs-lang-v1`.
Single page, no router (section buttons scroll).

```bash
npm ci && npm run dev
npm run build
```
