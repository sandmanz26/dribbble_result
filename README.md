# Kartenregal TCG, redesign prototype

Review and redesign of kartenregal.ch (a Swiss Pokémon card shop in Wetzikon) for the Dribbble brief
"Swiss TCG Card Shop Website Design". React 18, Vite 5, HashRouter, Grommet icons (`react-icons/gr`),
Switzer (Fontshare, self-hosted), no animation library. Products, prices, stock and the shop's own
photos are copied from the live shop on 3 Nov 2026. No backend: basket and orders live in
localStorage (`kr-state-v1`, theme `kr-theme-v1`).

```bash
npm ci
npm run dev
npm run build   # dist/
```

Routes: `#/` home, `#/fach/booster`, `#/fach/bundles-boxen`, `#/p/pitch-black-etb-en` (two copies),
`#/p/makuhita-mep-068-nm-en` (flip and foil), `#/p/151-mini-tin-en` (sold out), `#/kasse`,
`#/abholung`, `#/versand`, `#/review` (design review, English), `#/system` (components and motion,
English). Strategy, research and roasts: `docs/strategy.md`.
