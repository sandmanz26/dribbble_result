# Wanderlog Gang — Retro Illustrated Travel Blog

Brief: *Retro Illustrated Travel Blog Site* (Website Design, budget $350). A group of friends' travel
journal with a photo banner, yearly calendar, per-trip blogs and a subscription form.

Stack: React 18 + Vite + react-router (HashRouter, so it deploys to any static host). No backend — all
content is mock data in `src/data/`. Subscriptions are stored in `localStorage` only.

```
npm install
npm run dev      # local
npm run build    # static output in dist/
```

> **Isolation rule:** every brief lives on its own branch with its own codebase and visual language.
> Nothing here (tokens, components, copy) should be reused by other project branches.

See [`docs/strategy.md`](docs/strategy.md) for UX/business reasoning and the competitor research frame.
