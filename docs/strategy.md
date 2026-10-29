# Darb: strategy and design notes

Brief (Dribbble, $350): premium Arabic/English website UI/UX for a Saudi shipping and logistics company. All
customer-facing pages, desktop and mobile, interactive prototype, developer handoff. Strong Arabic typography and RTL.
The client's brand guidelines, content drafts, photos and videos are not in hand yet, so this prototype uses a
placeholder name (Darb), sample copy and real CC BY photographs that stand in for theirs.

## Reading of the brief
- Page kind: multi-page company website with two working tools (tracking, quote request) and a route planner.
- Audience: Saudi importers and their procurement and supply chain teams, reading Arabic first; foreign suppliers and
  shippers reading English.
- What the site must get someone to do: request a quote; second, track a shipment.

## Research
- Import clearance in the Kingdom runs through two platforms: SABER (SASO conformity certificates, product PCoC and
  shipment SCoC) and FASAH (ZATCA customs declarations). SABER has been linked to FASAH since July 2020. Since October
  2025 the importer must request the shipment certificate on SABER; fee 0.15% of goods value, 15 to 500 riyals.
  Commonest rejections: wrong HS code, missing test reports (for example IECEE CB). Sources: GTAI customs report, QIMA.
- Corridor: Jeddah Islamic Port to Riyadh about 1,024 km, about a day by truck (MSC). Dammam to Riyadh 10 to 12 hours
  by truck or a day on the daily train to the Riyadh dry port (ONE). Jeddah congestion at peaks; King Abdullah Port at
  Rabigh as the quieter Red Sea alternative. The Landbridge rail is planned, not operational, so it is not promised.
- Competitor frame: Naqel (express, warehousing, own clearance licence), SMSA (parcel, COD, storage), Almajdouie
  (project and heavy cargo), Bahri Logistics. Their sites list services; none answers "how long, through which port,
  what paperwork" up front. That answer is the gap this design fills (route planner, itinerary slip, document lists).

## Idea
The name درب means a path walked until it is known. On this page the Arabic name becomes a monument, pinned while
the route a container takes (sea, quay, yard, road, Riyadh) scrolls under it as photographs. The live thing is the
route planner: pick the port of entry and the destination city, see the road distance, clearance days, trucking days
and berth-to-door time, with a hint when another port is faster.

## Design system
- One family for both scripts: Readex Pro (variable), drawn for Arabic and Latin together.
- Limestone ground #eeede9, basalt ink #121417, Red Sea night field #0e2430, one accent: roshan teal #0b7a71
  (the painted wood of Jeddah's old windows), only on the main action and the route.
- Square corners. Logical CSS properties only; arrows mirror, objects do not.
- Arabic-Indic digits in Arabic text, Latin digits in IDs, emails and phone fields; Gregorian dates with Hijri
  (Umm al-Qura) beside them.
- Full rules on the in-app handoff page `#/handoff`.

## Pages
Home, Services and six service pages, Track (on the road, held for a document, delivered, not found, loading),
Get a quote (four steps, validation, success), Network (map, live Riyadh clock and open or closed), About,
Careers, Guides (three articles with sources), Contact, Developer handoff, Photo credits, 404.

## Taste-skill run
Direction dealt: "The name as a monument" (seed 1652886076). Redraws: type (dealt Big Shoulders is already used by
project1 and has no Arabic) and palette (dealt forest and lime repeats project12 and project13 greens); both taken
from the subject instead. Inspector: 0 FAIL in Arabic and English. Defended warnings: pinned name over the photos is
the dealt hero; no video because the open video collections could not be reached from the build machine; ragged
left edges are the measure of right-aligned Arabic.

## Replace before launch
Name and mark, photos and video, addresses, email, licence numbers, cut-off schedule and transit times, tracking data.
