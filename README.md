# Tend: a ritual from a one-minute check-in (project8)

Mobile wellness app prototype: a one-minute check-in shapes a short ritual of breathwork,
meditation and a herbal cup, with a journal and a history. React 18, Vite 5, react-router
(HashRouter), Heroicons, Newsreader + Onest, Web Audio for ambient sound.

The idea: each day is a cyanotype (a sun print). The check-in's weather sets how deep the
Prussian blue goes, and the day's herb is printed on it as a white silhouette, drawn in code
from how the plant grows (`src/ui/Print.jsx`).
No backend; sample content in `src/data/`.

- On a computer: phone frame plus a reviewer panel (walkthrough, morning or evening, theme,
  design system page, research PDF). On a phone: full screen.
- `#/system` is the design system page (milestone one of the brief).
- `public/research.pdf` (also `docs/research.pdf`) is the research report; its source is
  `docs/report/research.html`.
- Saved state: one localStorage key, `td-state-v1`.

Herbal content is sample text in the tone of NIH NCCIH summaries and must be reviewed by a
qualified herbalist and clinician before any real use.

```bash
npm ci && npm run dev
npm run build   # dist/
```
