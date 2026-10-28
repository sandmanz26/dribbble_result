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

## Idea
The four boards take the colours of the four sauces on the counter: ketchup, mustard, mayo, green
herb. That is the wayfinding (you always know which board you are on), the brand mark (four little
bottles) and the reason the food stands out (golden fried chicken on red, grilled meat on mustard).
The order is a printed kitchen ticket, the thing the shop already prints.

## UX decisions
- One long menu with sticky tabs, not four separate pages: people compare across boards.
- Quick add uses sensible defaults (medium heat, garlic mayo); the dish page is for changing them.
- Heat is four named levels with a plain description, never a number.
- Offline is said in plain words: what still works and what happens to the order.
- No payment brands, no card form: pay at the counter or to the rider.
- Owner edits are a draft until published as a numbered version, so a half-done edit never reaches
  customers, and the version number tells staff which menu a customer is looking at.

## Design system
taste-skill app style "true-black flat", warm: ground #0e0d0c, surfaces one lightness step up, white
inverted pill for every primary action. Colour lives only in the food fields. Unbounded for titles,
Hanken Grotesk for text, MingCute icons. Radius 24 for cards, 18 for tiles, pills for controls.

## What a real build adds
Shop photos in place of the drawings, a small content API or headless CMS behind Manage, push
notifications for "ready", real delivery addresses, allergens per dish.
