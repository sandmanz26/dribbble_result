# Scrapyard BC-01: hardware-style audio plugin interface

Brief: *Hardware-Style Audio Plugin UI (VST3/AU/CLAP)* for The Busticated Co. (budget $2,000). The interface for
the first effect in a suite, in the language of worn test equipment and screen-printed posters, handed off as
production assets for a Rust/egui build.

What is here:
- **Instrument:** the full panel at a fixed 12:7 ratio, playable in the browser. 18 controls, a 16-step sequencer,
  a phosphor scope, a VU meter with real ballistics, a preset display, and a service hatch held by four screws
  hiding a patch bay and three bend contacts. Press Play to hear a loop through the actual signal chain.
- **Control states:** every control in idle, hover, dragging and dimmed, in Mint, Worn and Busted.
- **Motion:** frame counts at 60 fps, cubic-bezier easing, plotted curves, meter physics, two live demos.
- **Assets:** 16 sprite sheets x 3 wear stages x @1x/@2x, layered SVG sources, `layout.json` with every position.
- **Code widgets:** style spec for the scope, readout and preset display, with an egui painter sketch.

```
npm install
npm run dev
npm run build   # static output in dist/
```

Stack: React 18, Vite, react-router (HashRouter), Web Audio, iconoir icons, Anybody + Martian Mono.
No backend. Audio is synthesised in the browser.

> Isolation rule: this project lives on its own orphan branch with its own codebase and visual
> language. Nothing is shared with other project branches.

See [`docs/strategy.md`](docs/strategy.md) for the reasoning.
