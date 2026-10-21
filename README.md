# Proof: Photography & Videography Marketplace App

Brief: *Photography & Videography Marketplace App* (Mobile App, budget under $100). A minimalist,
elegant, modern mobile app where photographers and videographers showcase portfolios and clients
browse, book and pay for services. Covers registration, portfolio browsing, booking and payment.

Stack: React 18 + Vite + react-router (HashRouter) + Motion + Tabler icons. No backend: mock data in
`src/data/`, state persisted to `localStorage`. On desktop the app renders inside a device frame with a
list of flows; on a phone it runs full screen.

```
npm install
npm run dev
npm run build   # static output in dist/
```

Prototype payment: use card `4242 4242 4242 4242`; a card ending in `0002` is declined to show the error state.

> Isolation rule: this project lives on its own orphan branch with its own codebase and visual
> language. Nothing is shared with other project branches.

See [`docs/strategy.md`](docs/strategy.md) for UX and business reasoning and the competitor research frame.
