# Ripe Coffee Co. (sample brand)

Design and front-end response to the "Coffee E-Commerce UI/UX Design & Dev" brief: a playful, professional coffee shop with real 3D.

- React 18, Vite 5, HashRouter, Ant Design icons (`react-icons/ai`), plain CSS, `@google/model-viewer` for the 3D bag.
- Caprasimo (display) and Gabarito (text). Oat ground, coffee-brown ink, one cherry red for actions. Each coffee's bag is painted the colour of the fruit in the cup (data, not accent).
- 3D: `public/3d/bag.glb` is built in code by `tools/make-bag.html` (three.js): a pouch with a rolled top, tin tie and round label. Materials are named `paper`, `label`, `tie`; the site tints the paper per coffee and redraws the label on a canvas (`src/Bag3D.jsx`). It turns with scroll in the hero and by drag on product pages; the poster image shows until WebGL is ready.
- Pages: home (hero picker, tasting-note band, pinned "from cherry to cup", shelf, brew match, subscription builder, origins, FAQ, roast countdown), `#/shop` (filter, sort, compare), `#/coffee/:id` (size, grind, subscribe, recipes), bag drawer with free-delivery meter, `#/checkout` (validation, delivery options, no payment fields), `#/order/:no`.
- Cart stored in `ripe-cart-v1`. Roast day and cut-off come from the visitor's clock.
- Images are AI-generated (Higgsfield) in one soft 3D clay style, in `public/img/`.

Regenerate the bag: serve the project root (`python3 -m http.server 4400`), open `/tools/make-bag.html`, run `make()` and save the base64 GLB to `public/3d/bag.glb`.

`npm ci && npm run build` outputs to `dist/`.
