# Roll, school student records (project17)

## Status
- Done: full prototype (Today, search, profile, add student, marks entry and review, access log,
  lock), research and roast round 1 in `docs/strategy.md`.
- Next: owner review; CSV import from an old SIS is not designed yet.

Brief: *School Student Database App Design* (Dribbble, mobile app). A phone app for school office
staff and teachers: student personal details and exam records, fast search, careful data entry,
role-based access with an access log, and the school's own branding.

Stack: React 18 + Vite 5 + react-router (HashRouter). No backend: about 240 sample students are generated
from a fixed seed in `src/data/`, and state is saved in `localStorage` (`roll-state-v1`).

```
npm install
npm run dev      # local
npm run build    # static output in dist/
```

On desktop the app sits in a phone frame with a reviewer panel (role, brand, theme, offline, demo
paths). On a phone it runs full screen. Demo PIN 1357.

Research, decisions and the roast are in [`docs/strategy.md`](docs/strategy.md).
