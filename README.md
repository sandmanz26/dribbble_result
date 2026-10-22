# NuBrakes and Valvoline: dual-brand customer experience

Brief: *Redesign Our Customer Experience* (UI UX, budget $6,500). NuBrakes, a mobile brake repair service now
owned by Valvoline, needs its website and quote/booking flows moved onto Valvoline's design system, with the
system extended to serve both brands, and key flows redesigned from path-to-purchase research.

This prototype answers it in code:
- **Website reskin:** home, services and prices, service detail, my bookings.
- **Redesigned quote and booking flow:** six steps, price before contact details, pay after the job.
- **Visit tracker:** technician card, live status, approving extra work remotely, reschedule and cancel.
- **Dual-brand system:** one component set, NuBrakes and Valvoline token sets, light and dark each.
  The System page shows both brands side by side and downloads the tokens as DTCG JSON.
- **UX notes:** numbered markers on the screens, each a small recommendation with its reason and the
  metric to watch. The Notes page lists all of them against the role description.
- **States:** loading, empty and error on every data surface. Use the Prototype panel (bottom corner)
  to switch brand, scheme, and to simulate a slow network or failing requests.

Stack: React 18, Vite, react-router (HashRouter), Lucide icons, Archivo + Public Sans. No backend: mock
data in `src/data/`, state in `localStorage`.

```
npm install
npm run dev
npm run build   # static output in dist/
```

Demo: plate `LKD4821` (TX), ZIP `78704`. Brand colours are placeholders until the Valvoline design
system is shared. Prices, reviews, technicians and availability are sample data.

> Isolation rule: this project lives on its own orphan branch with its own codebase and visual
> language. Nothing is shared with other project branches.

See [`docs/strategy.md`](docs/strategy.md) for the reasoning.
