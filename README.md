# Rimba, restaurant landing page (project18)

## Status
- **v2 (Osier, fine dining, at `/v2/`)**: owner asked for Western fine dining, better scroll, a
  stronger hero, a minimal font and real research. Plan, research and three roasts in
  `docs/v2-plan.md`. 15 new photos. v1 below is unchanged.
- Done: one-page site with the scroll scenes (framed hero, words that light up as you read,
  five courses served on one pinned plate, horizontal walk through the rooms), menu with live
  photo, reviews, booking flow with confirmation and calendar file, pickup order drawer, visit
  and footer. 16 generated photos. Roast round 1 in `docs/strategy.md`.
- Next: owner review. The brief asks for Figma; offer Figma built from the same tokens after award.

Brief: Dribbble, restaurant landing page (brand, food and atmosphere, reservations or orders,
responsive, developer-friendly files). Rimba is a placeholder restaurant in Ubud.

Stack: React 18 + Vite 5, GSAP + ScrollTrigger, Lenis smooth scroll, Mynaui icons,
Instrument Sans (variable width). One page, no router. No backend; bookings and orders are local.

```
npm install
npm run dev
npm run build
npm run photos   # rebuild WebP renditions from raw/ (raw PNGs are not committed)
```
