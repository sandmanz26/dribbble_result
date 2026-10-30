import { FULL_FRAME_MS, msFor } from '../engine/gfx.js'
import { fontBytes } from '../engine/font.js'
import { SPRITES, spriteBytes } from '../engine/sprites.js'

const sheetBytes = Object.values(SPRITES).reduce((n, s) => n + spriteBytes(s), 0)

const RULES = [
  ['Screen', '240 x 320 pixels, portrait, 2.4" ILI9341 panel over SPI. Design at 1x. Every mock-up in this kit is the real pixel grid.'],
  ['Colour', '16-entry palette, each colour snapped to RGB565 (5 bits red, 6 green, 5 blue). Nothing outside the palette can be drawn: the framebuffer stores palette indexes, not colours.'],
  ['Per image', 'Sprites are 2 bits per pixel: at most 4 palette entries, one of them the transparent key. Two-tone icons by default, three tones only when a state needs it (the camera\'s red dot, the warning mark).'],
  ['Transparency', 'One-bit only: a pixel is drawn or it is not. No fades, no shadows, no glass. A modal dims the screen with a checkerboard of the background colour instead of a translucent scrim.'],
  ['Type', 'One bitmap font, 5x7, uppercase, 1 bit per pixel. Sizes are whole multiples only (1x body, 2x titles, 3x and 4x numbers). No anti-aliasing anywhere.'],
  ['Motion', `A full redraw is ${FULL_FRAME_MS.toFixed(1)} ms of SPI time at 32 MHz, longer than a 30 fps frame (33.3 ms). So screens change with a cut, and only small regions animate: a progress bar, a radar ring, one thumbnail. The simulator measures this live.`],
  ['Shapes', 'Rectangles with 1px chamfered corners, 1px borders, square progress bars. Circles only where drawn with the midpoint algorithm (radar) or baked into a sprite.'],
  ['Input', 'D-pad, A (select, right), B (back, left), MENU (home from anywhere), PWR (power and sleep). Every screen ends with a hint bar showing the buttons that work there, using the same icons.'],
  ['Text', 'Plain words, 40 characters per line at most. Say what to do next, not just what went wrong ("Set camera to PTP", "Resumes from photo 88").'],
]

export default function Spec() {
  return (
    <div className="page spec">
      <header className="page-head">
        <h1>Hardware rules</h1>
        <p>What the screen can and can't do, written so a pixel artist can work without reading the firmware.</p>
      </header>
      <dl className="rules">
        {RULES.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>

      <section className="kit-block">
        <h2>Memory budget</h2>
        <table className="budget">
          <tbody>
            <tr><th>Font</th><td>{fontBytes()} B</td></tr>
            <tr><th>All UI sprites (2bpp)</th><td>{sheetBytes.toLocaleString('en')} B</td></tr>
            <tr><th>Framebuffer (8-bit indexed)</th><td>76,800 B</td></tr>
            <tr><th>Previous frame, for diffing</th><td>76,800 B</td></tr>
            <tr><th>Thumbnail strip, 3 x 68x52</th><td>10,608 B</td></tr>
          </tbody>
        </table>
        <p className="lede">Small enough to live in the Pi's RAM next to gphoto2. The diff against the previous frame is what keeps SPI time low: a progress bar tick sends about {Math.round(msFor(216 * 6) * 100) / 100} ms of pixels, not {FULL_FRAME_MS.toFixed(0)} ms.</p>
      </section>

      <section className="kit-block">
        <h2>Why these flows</h2>
        <ul className="why">
          <li><b>Sync resumes, never restarts.</b> USB links to cameras drop (loose cables, the camera sleeping). gphoto2 exits when they do, so the device keeps a count and picks up at the next photo.</li>
          <li><b>Storage mode is the first failure people hit.</b> Cameras set to mass storage can't be controlled over PTP. The pairing screen names the exact menu path instead of "connection failed".</li>
          <li><b>Wi-Fi shows a code to compare.</b> Two cameras of the same model on one shoot is common; the code proves it's the right one.</li>
          <li><b>B never loses work.</b> Stopping a sync asks first, and photos already copied stay.</li>
          <li><b>Battery and card space are on Home</b> because both end a shoot.</li>
        </ul>
      </section>
    </div>
  )
}
