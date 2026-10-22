# AGENTS.md: project4, Scrapyard BC-01 (The Busticated Co.)

This branch is **one project inside a multi-project repository**. The repo-wide rules (one project per
branch, no shared code, how deployment and passwords work) are in `AGENTS.md` on the `main` branch:
`git show origin/main:AGENTS.md`. Read it first.

## This project
- **Brief:** "Hardware-Style Audio Plugin UI (VST3/AU/CLAP)", budget $2,000, a month or more. The Busticated Co.
  wants the interface for the first plugin in a suite of audio effects. Aesthetic: vintage test equipment, bakelite
  knobs, needle meters, phosphor CRTs, jacks and cables; circuit bending; worn objects; punk, Swiss design,
  Constructivism, screen-printed posters. The real UI is built in Rust with egui; the designer hands off assets.
  Deliverables: full fixed-aspect interface (~18 controls, 16-step sequencer, waveform display, meter, preset menu,
  hidden circuit-bend panel with its reveal), every control in idle/hover/dragging/dimmed across wear stages, a
  motion spec with frame counts and easing, @1x/@2x PNG filmstrips and sprite sheets plus layered sources, and a
  style spec for code-drawn widgets.
- **Live:** `/project4/` on the hub site, password `PR004`.
- **Stack:** React 18, Vite 5 (`base: './'`), react-router `HashRouter`, iconoir-react icons, Anybody (variable width)
  + Martian Mono via Fontsource. Web Audio for sound (AudioWorklet bit crusher from a Blob URL). No backend.
- **Design language (do not reuse in other projects):** cream enamel panel, black silkscreen, bakelite knobs, one
  signal-orange accent (`#F2620F`), amber phosphor for the scope. Page around it: poster paper and black ink,
  wide Anybody headings, 2 px radius. Light/dark applies to the page only; the plugin is a physical object.

## Code map
```
src/data/controls.js   panel layout (1200x700 logical units), every control, jacks, pads, screws, wear stages
src/data/presets.js    factory presets (values, 16 steps, patch cables)
src/data/assets.js     sprite sheet list (cell size, frames, states) for export and the Assets page
src/data/motion.js     motion spec (frames at 60 fps, cubic-bezier, springs) and curve helpers
src/audio/engine.js    Web Audio engine: synthesised loop > drive > tone > crush > filter > wobble > echo > mix
src/panel/parts.jsx    hardware parts (knob, selector, bat toggle, momentary, step, LED, jack, pad, screw, VU)
src/panel/Plugin.jsx   full panel, meter ballistics, step row, patch bay, preset menu; layer="background" for export
src/panel/Crt.jsx      code-drawn phosphor scope; CRT_SPEC is the widget style spec
src/panel/wear.js      seeded chips and scratches so wear is identical in every render
src/pages/             Instrument, States, Motion, Assets, Widgets, Notes, Render (export surface)
scripts/               export-assets.mjs (Playwright screenshots of /render), optimize-png.py (libimagequant)
public/sprites/        exported sheets: <id>/<id>-<wear>@<1|2>x.png, layered SVG, layout.json, manifest.json
```

## Conventions here
- localStorage keys: `bz-ui` (wear, page scheme), `bz-session` (current sound).
- Regenerating assets after a visual change:
  `npm run build && npx vite preview --port 4174 &` then
  `PLAYWRIGHT_PATH=<path to playwright> node scripts/export-assets.mjs http://localhost:4174` then
  `pip install imagequant && python3 scripts/optimize-png.py public/sprites`. Commit the results.
- Keep sprite cells centred on the control pivot; positions come from `controls.js` and ship in `layout.json`.
- No em/en dashes in visible copy. After pushing this branch, redeploy `main` on Vercel.
