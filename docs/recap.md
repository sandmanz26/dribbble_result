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
