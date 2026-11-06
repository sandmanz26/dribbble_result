# KUMO (concept)

The minimal one of a pair of matcha websites. A canned matcha latte: quiet, warm stone and ink, one soft matcha green for marks, slow reveals.

- React 18, Vite 5, HashRouter, Circum icons (`react-icons/ci`), plain CSS, no animation library. Shippori Mincho B1 + Zen Kaku Gothic New.
- Pages: home (hero, three ingredients, grown in shade with facts, three ways, open it slowly), `#/about` (name, field to can in four steps, what we will not do), `#/shop/:id` product page (flavour, pack, monthly 15% off, quantity, gallery, ingredients, nutrition, FAQ, bag drawer).
- Bag stored in `kumo-bag-v1`. 12 AI-generated photos; every can image uses one packshot as the reference so the can stays the same.
- Brand, sourcing details, nutrition and prices are samples.

`npm ci && npm run build` outputs to `dist/`.
