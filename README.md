# Riuh Studio

## Status
- Done: Today, Offers (offer checker), Deals board and list, deal detail, Calendar with exclusivity lanes, Money, Brands, Media kit, Credits. Inspector 0 FAIL on every screen at 1440, 768 and 390; lint clean (shadows only on floating menus, palette and toast).
- Next: real rates and tax treatment from the agency; connect platforms; a manager view for Riuh across the roster.

Design and front-end prototype for the Dribbble brief "Creator Dashboard": a dashboard and CRM for content
creators. Positioned as a portfolio piece for a Jakarta talent agency (Riuh Talent, sample name) and the
creators on its roster. English UI, Indonesian people and brands, rupiah.

React 18, Vite 5, HashRouter, Unicons (`@iconscout/react-unicons`), DM Sans, plain CSS. No backend. Data in
`src/data/studio.js` (totals computed from rows, checked with `console.assert`); state in localStorage
`rs-state-v1`.

## Screens
| Route | Question it answers |
|---|---|
| `#/` | What do I owe brands today, and when does my money land? |
| `#/offers/OF-117` | Which offers are worth taking? Priced on the rate card, exclusivity clash, a reply written for you |
| `#/deals`, `#/deals/RT-2611` | Where is every deal (drag between stages)? What is left, and what will I take home? |
| `#/calendar` | What goes live when, and which categories are blocked? |
| `#/money` | What did I really earn after PPh 23 and Riuh's 20%? |
| `#/brands` | Who needs a follow-up? |
| `#/kit` | What do brands see, and what do I charge? |

Ctrl K searches everything. The roster switcher sits top right; "Reset the demo" is in it.

Research, roast and data inventory: `docs/strategy.md`. Photos: Open Images, CC BY 2.0, at `#/credits`.
Every name, brand, amount, rate and tax assumption is a sample.

## Run
```bash
npm ci && npm run dev    # npm run build → dist/
```
