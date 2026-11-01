# Rolling (project20)

Prototype for the Dribbble brief "Film & TV Mobile App UI/UX Design": a phone app for film and TV crew,
creatives and production. Call sheet day, calls (jobs) that know your diary, avails with 1st and 2nd
pencils and challenges, profile with reel and credits, and a crew-up view for production.

- React 18, Vite 5, HashRouter, Boxicons (`react-icons/bi`), no animation library
- Sofia Sans Extra Condensed, Sofia Sans, Azeret Mono (self-hosted via Fontsource)
- Version 2: a call sheet set like a poster. Paper, ink rules, square corners, one chroma-key green
  as solid blocks; light and dark. Day timeline with a playhead, poster deck, stripboard diary,
  hold-to-confirm, end-credits crawl
- Mock data in `src/data/`, state in localStorage key `rol-state-v1`
- Photos: Unsplash, graded to one look, self-hosted WebP in `public/photos/`

```bash
npm install
npm run dev
npm run build   # outputs dist/
```

Review links: `#/?scene=rolling`, `#/?scene=wrapped`, `#/avails`, `#/calls/dry-creek-spark`,
`#/crew/gaffer?as=production`, `#/welcome`.

Design notes, research and roast log: `docs/strategy.md`.
