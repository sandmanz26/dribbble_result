# Strategy notes

## Brief
UI/UX for a coffee e-commerce website: natural and playful but professionally polished, with 3D components for engagement, prior coffee e-commerce experience, and development support. Budget $250, timeline days.

## Reading
No brand, products or site were supplied, so the draft invents a sample roaster (Ripe Coffee Co.) to show the system at full density. Everything is a sample for the client to replace.

## Idea
Coffee is a fruit. The bag is painted the colour of the fruit you taste, so the shelf works as a taste map, and the one 3D object (the bag) carries that colour everywhere: hero, product page, cards, subscription.

## 3D, used where it helps buying
- The bag is a real 3D model you can turn, not decoration. It shows the product as it arrives.
- One model, many coffees: tint and label are runtime, so new coffees need no new 3D work.
- Lightweight fallback: a poster image until WebGL loads, and on devices without WebGL.

## E-commerce decisions
- Buy from anywhere: add on cards, in the hero, in brew match, in the subscription box.
- Grind chosen by brew method, with a recipe, because "which grind" is the top question for coffee shoppers.
- Free-delivery meter in the bag to raise basket size; subscription at 10% off with free delivery.
- Roast-day countdown: the honest freshness promise (roasted Tuesday, posted Wednesday) and a reason to order now.
- Checkout on one page, three delivery options, no payment fields in the prototype.

## Competitor frame (from public sites, general patterns)
Specialty roasters (Onyx, Square Mile, Counter Culture style): taste notes, origin data, subscriptions. Gaps they often leave: grind guidance at the point of purchase and a playful brand voice. This draft keeps their data depth and adds play.
