# KhangoSupps landing page (draft)

Design and front-end response to the "KhangoSupps Landing Page Design" brief: bold, colourful, retro, with product images, video, reviews and storytelling, and a system for persona squeeze pages.

- React 18, Vite 5, HashRouter, Font Awesome 6 icons (`react-icons/fa6`), plain CSS, no animation library.
- Bowlby One (display), Barlow Condensed (labels and buttons), Barlow (text). Cream and deep ink; each flavour owns a field colour and a pop colour, and picking a flavour repaints the page. Ink is the action colour.
- Home: "Stay ready." poster hero with racing stripes and the tub (words split and stripes slide on scroll), speed-aware marquee, five-ingredient list with the nutrition panel, muted video band with pause, stacking day cards (05:00, 07:10, 06:30), four flavours with parallax, sample reviews, principles, the page system, starter pack form, FAQ.
- Squeeze pages: `#/for/athletes`, `#/for/shift-workers`, `#/for/parents`. Same blocks, different words: photo, promise, three reasons, label, one review, the offer. No navigation out.
- Product names, nutrition, prices and reviews are samples. Photos, packshots and the video are AI-generated (Higgsfield).

`npm ci && npm run build` outputs to `dist/`.
