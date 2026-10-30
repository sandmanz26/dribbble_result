# Hotshoe: strategy, constraints and roast

## Why this project
A portfolio piece for pixel-art UI on constrained hardware, shaped like the CircuitMess-style
brief (240x320 colour screen, limited colours per image, no semi-transparency, pixel fonts,
intro animation, tutorial, pairing, settings, system screens, input icon set, one themed device).
Instead of their controller, the device here is a Raspberry Pi that clips onto a camera.

## Design read
Small-screen device UI for photographers on a shoot, darkroom language: near-black ground, paper
text, one safelight orange. Dials: variance 2, motion 3 (budgeted by SPI), density 5.

## Research
- **Panel and bus:** ILI9341 panels take RGB565 over SPI. fbcp-ili9341 reaches about 60 fps only
  because it sends changed pixels; a full 240x320x16bpp frame needs about 74 MHz for 60 fps, and
  users report 32 to 64 MHz as stable. At 32 MHz a full frame is 38.4 ms, over one 30 fps frame.
- **Camera link:** gphoto2 over PTP. Cameras in mass storage mode can't be controlled; on Raspberry
  Pi OS, gvfs can grab the camera first; gphoto2 exits when the USB link blips, so a wrapper that
  waits and resumes is the reliable pattern.
- **CircuitMess devices** draw sprites and push a frame per loop (Chatter, ByteBoi guides), the
  same model this engine uses.

## Constraints turned into design rules
| Hardware fact | Design rule |
|---|---|
| RGB565 panel | 16-entry palette, each colour snapped and shown with its 565 value |
| Small flash, 2bpp sprites | Max 4 entries per sprite including the transparent key; checked before build |
| No alpha | 1-bit transparency; modal scrim is a checkerboard dither |
| No font rasteriser | One 5x7 bitmap font, uppercase, whole-number scales |
| SPI bandwidth | Screens change with a cut; only small regions animate; live SPI meter |
| Five buttons | Every screen ends with a hint bar of the buttons that work there |

## Flows and why
- Sync resumes at the next photo after a dropped cable, never restarts.
- Pairing names the PTP menu path when the camera is in storage mode.
- Wi-Fi pairing shows a code to compare, for shoots with two of the same camera.
- Stopping a sync asks first; copied photos stay.
- Battery and Pi card space live on Home.
- Remote trigger doubles as a time-lapse intervalometer, with duration and card use worked out.

## Roast (round 1) and what changed
| Finding | Change |
|---|---|
| Labels in list rows drew 120px to the right | A half-pixel y landed half a row off in the buffer. All drawing now snaps to whole pixels |
| Sub-lines in pairing rows overlapped the row edge | Rows take a `sub` line and size for it |
| The `<` before a selected value sat on the value | Placed after measuring the value |
| Icon previews in the kit were squashed | Fixed width on the preview |
| The device overflowed a phone screen | Scale from the viewport; keyboard hint hidden on phones |

Not verified: the live 30 fps loop only runs in a visible tab, so the animated simulator was
checked through the kit's static renders of the same engine. Open: sound, the real logo of a
client, and a portrait vs landscape decision with real hardware in hand.
