# Flock & Flame: chicken and grill menu app

A clickable mobile-app prototype for a fried and grilled chicken shop (Dribbble brief "Chicken Menu
Mobile App Design"). UI design and front-end only: sample menu data, no backend, nothing is charged.

Live on the portfolio hub at `/project11/` (password protected, never indexed).

## What it does
- **Menu** with four boards in the colours of the four sauces on the counter (ketchup red for fried,
  mustard for grilled, mayo cream for mayo dishes, green herb for grill specials). Sticky tabs jump
  between boards and follow the scroll. Today's special on top. Quick add from the list.
- **Dish**: heat level (Mild, Medium, Hot, Inferno) that changes the steam and the note, dips (one
  free), a side, quantity, then the dish drops into the bag.
- **Bag**: pickup or delivery, time slot in a bottom sheet, pay at the counter or to the rider.
- **Order ticket**: the order as a printed kitchen ticket moving along the rail (Received, On the
  line, Cooking, Packed, Ready / On the way) with a ready time.
- **Offline**: a service worker keeps the app and menu on the phone. With no signal the menu still
  works, and an order is saved on the phone and sent by itself when the signal is back.
- **Menu manager** (easy content updates): change a price with a till keypad, mark a dish sold out,
  pick the special, then publish one new menu version to every phone. Nothing reaches customers
  until it is published; publishing waits for signal.
- All states: loading (checking for a newer menu), empty bag and orders, offline, sold out, waiting
  to send, published.

Review links: `#/` · `#/item/wings-8` · `#/bag` · `#/manage` · `#/?demo=offline` · `#/?demo=reset` ·
`#/art` (every drawn dish on one sheet). On desktop the reviewer panel has a "Simulate no signal"
switch.

## Stack
React 18, Vite 5 (`base: './'`), react-router HashRouter, MingCute icons (`@mingcute/react`),
Unbounded + Hanken Grotesk (Fontsource, self-hosted), no animation library. State in localStorage
under `ff-state-v1`. Food is drawn in code (`src/ui/Food.jsx`) until the shop's own photos exist.

```bash
npm ci && npm run dev    # local
npm run build            # dist/, used by the hub
```
