# Strategy notes: Scrapyard BC-01

## 1. Read of the brief
The Busticated Co. makes audio software "for discerning creatives searching for new sounds" and wants the interface
for the first plugin in a suite of "fun and immersive" effects. The interface should draw people in, quiet their inner
critic and invite experimentation. It is built in Rust with egui (immediate mode, OpenGL); the designer does not code
it but hands off assets a developer can wire up directly.

Design read: a desktop plugin window for producers and musicians; a worn piece of analog test equipment with a
hidden service hatch, dressed in two-colour poster typography.

## 2. Deliverables and where they are answered
| Brief | Answer |
|---|---|
| Full interface, fixed ratio, ~18 controls, 16-step sequencer, waveform display, meter, preset menu | 1200x700 panel, 18 controls, playable (`/`) |
| Hidden panel of circuit-bend controls and its reveal | Service hatch: 4 screws, slide reveal, patch bay (3 out, 3 in) and 3 touch contacts |
| Every control in each state across stages of wear | `/states`: 9 control types x 4 states x 3 wear stages |
| Motion spec with frame counts and easing | `/motion`, data in `src/data/motion.js` |
| @1x/@2x PNG filmstrips and sprite sheets, layered sources | `/assets`, files in `public/sprites/` |
| Style spec for code-drawn widgets | `/widgets`, `CRT_SPEC` in `src/panel/Crt.jsx` |

## 3. Panel information architecture
```
Header   SCRAPYARD title slab | BC-01 | preset display | power LED | bypass
Row A    01 Input (Drive, Tone) | Scope | Level (VU, Chaos) | 07 Out (Mix, Output)
Row B    06 Steps: Target selector, Rate toggle, Swing, Amount | 16 steps with LEDs
Row C    02 Crush (Bits, Rate) | 03 Filter (Cutoff, Reso) | 04 Wobble (Depth, Speed) | 05 Echo (Time, Repeats) | Service hatch
Hatch    Out: Steps, Noise, Wobble  In: Time, Cutoff, Bits  Contacts: Freeze, Starve, Spit
```
Signal flows left to right through the numbered modules, which match the order of the DSP chain.

## 4. UX decisions
- Sound first: one Play button and the whole chain is audible, so every gesture has a result.
- Safe experiments: bend contacts are momentary, cables pull with one click, knobs double-click home.
- Dimmed states are honest: Bypass dims everything but Output; Speed dims at zero Depth; sequencer controls dim at
  zero Amount.
- Accessibility: every control is focusable with arrow keys, Home/End and Delete-to-default; sliders expose value
  text (for example "14.2 dB"); hold controls work with Space.
- Wear is seeded per control so scars are stable across renders and exports.

## 5. Visual language
- Materials: cream enamel, bakelite with fluted skirts, nickel hardware, copper contacts, paper VU face, amber tube.
- Type: Anybody (wide, heavy) for slabs and the title; Martian Mono for numbers and small print.
- Colour: black ink plus one signal orange, like a two-colour screen print. Amber phosphor is the tube's own light.
- Constructivist cues: slanted orange bar, numbered modules on a strict grid, heavy black title bands.

## 6. Handoff
- Sheets: rows = frames, columns = states, cells centred on the pivot. Frame = round(value * (frames - 1)).
- `layout.json`: positions, kinds, hit radii, sprite ids. `manifest.json`: files, frames, states.
- Export is scripted (`scripts/export-assets.mjs`) and compressed with libimagequant (`scripts/optimize-png.py`),
  20 MB for 96 PNGs plus SVG sources.

## 7. Open questions
1. Host window sizes and whether resizing is free or stepped.
2. Should wear be a user choice, tied to presets, or grow with time played?
3. What the sequencer drives in the real DSP, and whether Rate syncs to host tempo.
4. 64 knob frames, or 128 for large displays.
