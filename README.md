# Fuwa Matcha Club, version 2 (concept)

A rework of Fuwa (branch `claude/fuwa-matcha-cafe`) at the owner's request, moved away from the reference (coupletcoffee.com) it resembled. Same cafe, same pages, new visual language.

- What changed: no pastel colour blocks per section, no chunky display type, no outlined cards with hard shadows, no spinning badge or ticker, no products on coloured backdrops.
- Now: "foam". Cream ground, one deep matcha green, Fraunces (soft and wonky axes) + Nunito, organic blob and arch shapes, foam bubbles that drift up, the word "fluffy" gets softer as you scroll, a green vine that draws itself between the field, the mill and the whisk, a wavy green visit section, a soft footer wordmark that firms up on hover.
- React 18, Vite 5, HashRouter, Simple Line Icons (`react-icons/sl`), plain CSS, no animation library.
- Pages: home, `#/menu` (item sheet, pick-up order), `#/about`.
- Photos: the drinks, sweets, hero bowl and tins were reshot (AI, Higgsfield) on cream linen and oak with soft window light; field, mill, whisk, sift, cafe and friends carried over from version 1. Brand, address, prices and sourcing details are samples.

`npm ci && npm run build` outputs to `dist/`.
