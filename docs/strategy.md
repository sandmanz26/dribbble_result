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

## Round 3: delivery, pickup and offline made real
Owner: the offline and delivery requests were too simple and not how it really works; check how big
brands do it.

What the big brands do (sources below):
- **Offline is browse and build, not send.** The Starbucks web app (built offline-first) lets people
  browse the menu, customise and add to the cart with no connection; location pricing and placing
  the order need the network again. No chain sends an order to a kitchen without a connection.
- **Where first, then the menu.** McDonald's and Chick-fil-A start a mobile order by choosing the
  restaurant and how you get it (curbside, carry-out, drive-thru, table, delivery); options differ by
  restaurant and time.
- **Cook on arrival.** Chick-fil-A uses location to tell the kitchen you are close, with a manual
  check-in when that fails; McDonald's asks for the curbside spot or table number when you arrive,
  and its UK app has an "I'm here" button for when the phone cannot detect arrival.
- **Few, plain stages.** The Domino's Tracker moved to placed, make, deliver or pick up, and done,
  with detail underneath, plus the driver's live position.
- **Accept before courier.** On Uber Eats a courier is matched once the restaurant accepts; the
  customer sees accepted, preparing, the courier's name and route; the courier checks the order
  number at pickup.

What we built from it:
- Order setup sheet before checkout, zone check with a pickup offer, curbside with car and bay,
  "start cooking when I arrive".
- Outbox with honest states (not sent yet, sending, try 2, held back because the menu changed), a
  recheck against the live menu that the customer confirms, and one idempotent order key on every
  try. Card charged only when the shop accepts.
- Four milestones over a timed history; rider card and hand-off code; out-of-stock answer before
  cooking; delay with a new time; refunds by item.

Sources:
- Formidable, Starbucks Progressive Web App: https://formidable.com/work/starbucks-progressive-web-app
- McDonald's US, Mobile Ordering FAQs: https://www.mcdonalds.com/us/en-us/contact-us/help-center/mobile-ordering.html
- McDonald's UK, app FAQ: https://mcdonalds.com/gb/en-gb/good-to-know/in-our-restaurants/app-faq.html
- Restaurant Business, McDonald's preparing orders as customers arrive: https://www.restaurantbusinessonline.com/technology/mcdonalds-will-soon-start-preparing-orders-customers-arrive
- Chick-fil-A, curbside: https://www.chick-fil-a.com/customer-support/ordering-and-payment/digital-ordering-and-payment/how-do-i-place-an-order-on-the-chick-fil-a-app-to-do-curbside-pick-up
- Chick-fil-A, knowing when your order is ready: https://www.chick-fil-a.com/customer-support/ordering-and-payment/digital-ordering-and-payment/how-do-i-know-when-my-order-is-ready
- Domino's Tracker update (press release): https://www.nasdaq.com/press-release/dominosr-updates-its-iconic-industry-first-tracker-even-better-customer-experience
- Uber Eats merchant delivery practices: https://merchants.ubereats.com/au/en/academy/delivery

Prototype choices that a real build would replace: sample branches, addresses and rider; the demo
plays one real minute in two seconds; the network and failures are switched from the reviewer panel.
