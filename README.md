# Caravan: travel with people you can trust

Mobile app prototype for a Dribbble brief: discover destinations, join verified travel groups,
plan trips together and travel safely. React 18, Vite 5, react-router (HashRouter), Hugeicons,
Bricolage Grotesque + Manrope, d3-geo with world-atlas for the maps. No backend; sample data in `src/data/`.

- On a computer it renders inside a phone frame, with a reviewer panel (tours, slow or failing
  network, theme, reset). On a phone it runs full screen.
- Demo SMS code: `2468`. "Explore as Nadia" skips sign-up.
- Saved state: one localStorage key, `cv-state-v1`.

```bash
npm ci
npm run dev
npm run build   # dist/
```

See `docs/strategy.md` for research, the roast of the brief and design decisions.
