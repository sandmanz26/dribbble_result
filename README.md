# BRTH Labs website prototype

Response to the "BRTH Labs, Website Design Brief" (pocket twist-up breath spray, DTC Shopify store).
Front-end prototype only: React 18, Vite 5, HashRouter, Ionicons 4 (`react-icons/io`), Work Sans variable,
plain CSS, no animation library. Mock data in `src/data.js`; no backend, no real checkout.

## Three design directions, one codebase

Switch with the panel at the bottom right, or with `?v=` on any route (`#/?v=field`):

- **A Quiet** (`quiet`): brief default. Paper ground, flavour panels, editorial space.
- **B Field** (`field`): the flavour floods the hero and bands; giant vertical wordmark; pill buttons.
- **C Carton** (`carton`): laid out like the box. Ruled 1.5 px ink panels, vertical side panel, square corners.

The flavour picker (Spearmint green, Arctic Mint blue) repaints the field and accent in every direction.

## Signature

The hero twist: a short entrance spray plays once per session (skipped by any input), then scroll drives
the device: it grows, twists open, mists (canvas particles), and the field wipes to paper.
Reduced motion shows the open device with no pin.

## Routes

`#/`, `#/shop`, `#/products/spearmint`, `#/products/arctic`, `#/products/duo`, `#/products/squad`,
`#/how-it-works`, `#/moments`, `#/where-to-buy`, `#/about`, `#/faq`, `#/hello` (carton QR page),
`#/wholesale`.

## Storage

`brth-variant-v1`, `brth-cart-v1` (localStorage); `brth-intro`, `brth-pop` (sessionStorage).

## Images

Generated with Higgsfield in one art direction (`public/img/`), plus the client's device and carton
photos. Notes in `docs/strategy.md`.
