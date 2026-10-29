# Flock & Flame (project11): recap

- Brief: Dribbble "Chicken Menu Mobile App Design" (budget under $100). Owner asked for a senior
  UI/UX and head-of-creative approach with `/design-taste-frontend`, references used only as
  direction, and gave 15 Higgsfield image credits to use sparingly.
- Higgsfield: the connector in this session only exposed read tools (no generation), so no images
  were generated and no credits were used. The food is drawn in code as one flat sticker language.
- Slots for real or generated photos, if wanted later (save as WebP in `public/food/`, one per dish,
  square, the dish alone on a flat background of its board colour, top three-quarter view, no
  props, no text): crunch-2, bucket-4, wings-8, tenders-5, burger, quarter, half, whole, thigh-wrap,
  peri-skewers, mayo-salad, mayo-rice, mayo-roll, slaw, mayo-fries, platter, suya, chops, corn.
  Suggested Higgsfield prompt: "Studio food photo of [dish], top three-quarter view, isolated on a
  flat [board colour] background, hard soft-box light, appetising, no props, no text, square".
  Swap them in `Tile` (`src/ui/kit.jsx`) with the drawing as the fallback.
- Inspector: 0 FAIL on menu, dish, bag, orders and manage. The one warning, a strongly coloured
  first screen, is deliberate: the brief asks for bold and colourful.
- Roast before shipping: drawn drumsticks were mispositioned (fixed the SVG transforms); fried food
  disappeared on a gold field (moved to the sauce colours); the minus icon was wrong; the category
  icons in coloured circles read as generic (replaced by little sauce bottles); the reviewer panel
  showed on phones (fixed); a terracotta red was swapped for a ketchup red.
- Password on the hub: `ck-7rmz-q4hp`.

## Round 2 (owner feedback)
- Owner: the tone looked low fidelity and the colours were ugly.
- Fix: replaced every drawn dish with a real photograph (Open Images, Flickr, CC BY 2.0, credited at
  `#/credits`); new light warm theme with one chili red; new type (Funnel Display + Funnel Sans,
  replacing Unbounded + Hanken Grotesk); hero carousel of today's picks; photo tabs; two-column photo
  grid; photo fly-to-bag animation. Menu reorganised to 24 dishes that match the photos.
- Higgsfield generation is still unavailable in this environment; the photo slots can be swapped for
  the shop's own shots one file at a time (`public/food/<name>.webp`).

## Round 3 (owner feedback)
- Owner: offline ordering and delivery were too simple and not real; look at how big brands do it.
- Research (sources in `docs/strategy.md`): Starbucks offline-first web app, McDonald's and
  Chick-fil-A mobile order and curbside check-in, Domino's Tracker stages, Uber Eats accept then
  courier.
- Built: order setup sheet (addresses with zone check, branches with hours, curbside), separate
  checkout (card or cash, tip, cutlery, kitchen note, scheduled or cook on arrival), full order
  lifecycle with exceptions, honest outbox with recheck and one order key. Reviewer panel can switch
  the network to weak or none and trigger failures.
- Store key is now `ff-state-v3`. Branch Ring Road is open until 02:00 so the demo works late.
