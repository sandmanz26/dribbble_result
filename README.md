# Flock & Flame: chicken and grill menu app

A clickable mobile-app prototype for a fried and grilled chicken shop (Dribbble brief "Chicken Menu
Mobile App Design"). UI design and front-end only: sample menu data, no backend, nothing is charged.

Live on the portfolio hub at `/project11/` (password protected, never indexed).

## What it does
- **Menu** in four sections (fried, grilled, wraps and mayo, grill specials), 24 dishes, each a real
  photograph. Today's picks rotate at the top; sticky photo tabs jump between sections and follow
  the scroll; quick add on every card.
- **Dish**: heat level (Mild, Medium, Hot, Inferno) that changes the steam and the note, dips (one
  free), a side, quantity, then the photo flies into the bag.
- **Order setup first**, the way the big chains do it: delivery or pickup decides the kitchen,
  the fee and the time. Saved addresses (Home, Work) with the serving branch, distance, delivery
  window and fee; address search with a zone check (outside 6 km offers pickup instead); hand it
  to me (with a code) or leave at the door. Pickup: three branches with real opening hours (one
  open late), pickup shelf or curbside with your car.
- **Bag**: minimum order for delivery with a progress bar, "goes well with it" add-ons.
- **Checkout**: when (as soon as possible, a time slot, or start cooking when I arrive), card
  (charged only when the shop accepts) or cash with change, rider tip, cutlery off by default,
  note for the kitchen, fee breakdown.
- **Order tracking**: sent, accepted, in the kitchen, rider assigned, packed and sealed, on the
  way, almost there, delivered; or ready on the shelf, collected; or ready, I'm here in bay 3,
  brought to your car. Four milestones on top, a timed history below. Rider card with the
  hand-off code. Exceptions: the shop runs out of a dish (swap, remove or cancel before anything
  is charged), rider delayed (new time), scheduled orders, cancel only before the kitchen starts,
  something wrong after delivery (refund by item).
- **Offline, done honestly**: with no signal you can browse, build the bag and check out, but the
  order waits on the phone as "not sent yet". When the signal returns it is checked against the
  live menu (price changes, sold-out dishes, waited too long) and you confirm before it goes. Every
  try carries the same order key, so a weak signal cannot create two orders. With no signal during
  tracking the screen shows the last known step and when it was updated.
- **Menu manager** (easy content updates): change a price with a till keypad, mark a dish sold out,
  pick the special, then publish one new menu version to every phone. Nothing reaches customers
  until it is published; publishing waits for signal.
- All states: loading (checking for a newer menu), empty bag and orders, offline, weak signal,
  sold out, waiting to send, changes to confirm, shop needs you, cancelled, published.

Review links: `#/` · `#/item/wings-8` · `#/bag` · `#/manage` · `#/?demo=offline` · `#/?demo=reset` ·
`#/?demo=weak` · `#/credits` (photo credits). On desktop the reviewer panel switches the network
(online, weak, no signal) and can make things go wrong: change the menu while an order waits, hold
it 30 minutes, run out of a dish, delay the rider, skip to the next step.

## Stack
React 18, Vite 5 (`base: './'`), react-router HashRouter, MingCute icons (`@mingcute/react`),
Funnel Display + Funnel Sans (Fontsource, self-hosted), no animation library. State in localStorage
under `ff-state-v3`. Food photos in `public/food/` are real photographs from Open Images (Flickr,
CC BY 2.0), credited in the app (`src/data/credits.json`), standing in for the shop's own.

```bash
npm ci && npm run dev    # local
npm run build            # dist/, used by the hub
```
