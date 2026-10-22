# NuBrakes and Valvoline: dual-brand customer experience

Brief: *Redesign Our Customer Experience* (UI UX, budget $6,500). NuBrakes, a mobile brake repair service now
owned by Valvoline, needs its website and quote/booking flows moved onto Valvoline's design system, with the
system extended to serve both brands, and key flows redesigned from path-to-purchase research.

This prototype answers it in code:
- **Website reskin:** home, services and prices, service detail, my bookings.
- **Redesigned quote and booking flow:** six steps, price before contact details, pay after the job.
- **Visit tracker:** technician card, live status, approving extra work remotely, reschedule and cancel,
  then a receipt with payment, a warranty card and a free warranty check.
- **Brand migration:** past NuBrakes visits and warranties inside the Valvoline account, and old `NB-`
  booking numbers that still find a booking (turn on "Returning NuBrakes customer" in the Prototype panel).
- **Dual-brand system:** one component set, NuBrakes and Valvoline token sets, light and dark each.
  The System page shows both brands side by side and downloads the tokens as DTCG JSON.
- **UX notes:** numbered markers on the screens, each a small recommendation with its reason and the
  metric to watch. The Notes page lists all of them against the role description.
- **Two design directions:** V1 Editorial and V2 Job ticket, switchable in the Prototype panel (or `#/?v=2`).
  Same components and colour tokens; V2 changes type (IBM Plex, mono figures), shape and a few layouts.
- **States:** loading, empty and error on every data surface. Use the Prototype panel (bottom right on
  desktop, the sliders icon in the header on phones) to switch brand, scheme, and to simulate a slow
  network or failing requests.

Stack: React 18, Vite, react-router (HashRouter), Lucide icons, Archivo + Public Sans. No backend: mock
data in `src/data/`, state in `localStorage`.

```
npm install
npm run dev
npm run build   # static output in dist/
```

Demo: plate `LKD4821` (TX), ZIP `78704` (any ZIP outside Texas metros shows the out-of-area path).
Returning customer demo: booking `NB-41873`, phone ending `0142`. Brand colours are placeholders until the Valvoline design
system is shared. Prices, reviews, technicians and availability are sample data.

> Isolation rule: this project lives on its own orphan branch with its own codebase and visual
> language. Nothing is shared with other project branches.

See [`docs/strategy.md`](docs/strategy.md) for the reasoning.
