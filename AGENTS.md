# AGENTS.md: hotshoe (pixel UI for a Raspberry Pi camera sync screen)

One project inside a multi-project repository. Repo-wide rules: `git show origin/main:AGENTS.md`
and `docs/COLLABORATION.md` on main. Read them first.

## This project
- **Brief:** owner's own portfolio piece, similar to an Upwork brief for pixel UI on a 240x320
  handheld (intro animation, tutorial, pairing, settings, system screens, input icon set, themed
  screens). Here the device is a Pi that syncs photos from a camera.
- **Stack:** React 18, Vite 5 (`base: './'`), HashRouter. No icon library on purpose: the pixel
  icon set is the deliverable (`src/engine/sprites.js`). Page chrome font Chivo Mono.
- **Device rules (enforced in code):** 240x320, 16-entry palette snapped to RGB565
  (`src/engine/palette.js`), indexed framebuffer so no colour outside it and no alpha
  (`src/engine/gfx.js`), sprites 2bpp max 4 entries incl. KEY (checked by `npm run check`,
  run before every build), one 5x7 bitmap font at whole scales (`src/engine/font.js`),
  SPI cost per frame at 32 MHz shown live in the simulator. Scrims are dither, not alpha.
- **Look:** darkroom. VOID ground, PAPER text, one accent SAFE (#ff5a2c, safelight). Page chrome
  follows light/dark; the device is always its own palette.
- **Storage:** none.

## Code map
```
src/engine/palette.js   16 colours, RGB565 snapping
src/engine/font.js      5x7 bitmap font
src/engine/sprites.js   icon set, input buttons, battery generator, colour checks
src/engine/gfx.js       indexed framebuffer, dither, diff + SPI cost
src/engine/scenes.js    dithered photo thumbnails
src/engine/device.js    state machine, input, every screen's drawing, alerts
src/pages/              Simulator, Kit, Spec
scripts/check-sprites.mjs
```
