# AGENTS.md: project17, Roll (school student records)

This branch is one project inside a multi-project repository. Repo-wide rules are in `AGENTS.md`
on `main` (`git show origin/main:AGENTS.md`). Read it first.

## This project
- **Brief:** School Student Database App Design. Mobile app. Mock data only.
- **Stack:** React 18, Vite 5 (`base: './'`), HashRouter, Iconsax (`iconsax-react`), no animation
  library. Mona Sans (variable, `wdth.css`, expanded headings) + Spline Sans Mono (IDs, marks).
- **Design system** (do not reuse elsewhere): neutral grey ground, white surfaces, ink; the one
  accent is the school brand (`--accent`, default plum #a3195b; brands in `src/data/school.js`).
  Surfaces 14px radius, controls pills. Light/dark via `data-theme`. Initials instead of photos.
- **Store:** `roll-state-v1`, recent searches `roll-queries-v1`.
- **Review links:** `#/?as=teacher`, `#/search?q=amra`, `#/students/new?as=registrar`,
  `#/marks/9B-math?as=teacher`, `#/marks?as=registrar`, `#/activity`, `?brand=harbour`,
  `?offline=1`, `?reset=1`. Demo PIN 1357. Demo clock Thu 18 Feb 2027.

## Code map
```
src/data/school.js     brands, users and permissions, demo clock, PIN
src/data/students.js   seeded students and term 2 mark sheets
src/lib/search.js      forgiving search, filters, duplicate check
src/store.jsx          state, role scoping (visible), audit log, offline queue
src/ui/kit.jsx         TopBar, Sheet, Field, Chip, Segmented, Avatar, Status, Toast
src/ui/Panel.jsx       desktop reviewer panel
src/screens/           Today, Search, Student, NewStudent, Marks, MarkEntry, More, Activity, Lock
docs/strategy.md       research, decisions, roast
```
