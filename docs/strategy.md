# Flock & Flame: strategy notes

## Brief
Bold, colourful, modern mobile app for a chicken and grill business. Menu tabs for fried chicken,
grilled chicken, mayonnaise dishes and grill specials. Must work offline and be easy to update.
Budget under $100, so the prototype focuses on the screens that carry the brief.

## Reading the references (direction only, not copied)
- "Kinetic food delivery app, ordering and tracking flow": motion that explains (add to bag, live
  order progress). Taken: the dish dropping into the bag, a bag badge that pops, a live order rail.
- "Smart meat shopping app, AI recommendations and quality check": big product on a colour field,
  clear options. Taken: the dish large on its field, heat as a clear choice. Not taken: AI
  recommendations, which a small menu does not need.
- The reference pages could not be opened from the build environment, so the shot titles guided the
  direction.

## Idea (v2)
Round 1 used drawn food on sauce-coloured boards; the owner found it low fidelity and the colours
unappealing. v2 sells with the food itself: real photographs, large and cropped tight, on a warm
cream counter, near-black type and one chili red reserved for adding to the bag and sending the
order. The order is still the printed kitchen ticket the shop already uses.

## UX decisions
- One long menu with sticky tabs, not four separate pages: people compare across boards.
- Quick add uses sensible defaults (medium heat, garlic mayo); the dish page is for changing them.
- Heat is four named levels with a plain description, never a number.
- Offline is said in plain words: what still works and what happens to the order.
- No payment brands, no card form: pay at the counter or to the rider.
- Owner edits are a draft until published as a numbered version, so a half-done edit never reaches
  customers, and the version number tells staff which menu a customer is looking at.

## Design system
Warm cream ground #f7f1e8, white cards with a hairline edge, ink #1d1612, chili red #d32a1f only on
add, send and the current kitchen station. Funnel Display (names, prices) and Funnel Sans (text),
MingCute icons. Radius 22 for cards, 18 for photos, pills for controls. Motion: rotating picks,
photo that flies into the bag, staggered cards, heat flames that rise when chosen.

## What a real build adds
Shop photos in place of the drawings, a small content API or headless CMS behind Manage, push
notifications for "ready", real delivery addresses, allergens per dish.
