# Hotshoe, pixel UI for a camera sync screen

## Status
- Done: simulator (boot animation, tutorial, home, pairing over USB and Wi-Fi, sync with resume,
  remote trigger and time-lapse, settings, system, alerts), design kit (palette, font, icon set,
  every screen at 1x, sprite sheet export), hardware rules page. Roast round 1 in `docs/strategy.md`.
- Next: owner review. Portfolio piece in the spirit of an Upwork brief for a pixel UI on a
  240x320 handheld; not built for that client.

A Raspberry Pi Zero 2 W with a 2.4" 240x320 SPI panel, clipped to a camera's hot shoe, that copies
photos off the camera over USB (PTP) or Wi-Fi. The whole UI is drawn by a small engine that
enforces the hardware rules: 16-colour RGB565 palette, 2bpp sprites (max 4 colours each), 1-bit
transparency, one 5x7 bitmap font, and a live count of SPI time per frame.

```
npm install
npm run dev      # local
npm run build    # checks sprites against the rules, then builds to dist/
npm run check    # sprite rules only
```

Routes: `#/` simulator, `#/kit` design kit, `#/spec` hardware rules. Keyboard: arrows, Z/Enter = A,
X/Esc = B, M menu, P power. No backend; nothing is stored.
