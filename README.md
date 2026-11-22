# ExamAce redesign prototype

The response to the Dribbble brief "User Design" for ExamAce, an A-Level revision platform. It covers three stages:

- a UX audit of the live site
- a marketing site and design system
- student, parent and teacher dashboards

The centre of the prototype is a route from the homepage to a first marked answer in about ten minutes, with no account.

## Status (22 Nov 2026, desktop session)

**Done:**

- Audit: 14 findings with screenshots of the live site, a before and after of the route, and the metrics to watch.
- Homepage and taster lesson: learn, check, answer, then the mark with AO margin codes, rewrite and tutor.
- Sign-up for student, parent and teacher.
- Pricing receipt, team page and design system page.
- Student, parent and teacher dashboards, and the teacher review screen.
- The taste-skill inspector passes with no FAILs on the app screens. The remaining page warnings are defended in `docs/strategy.md` section 5.

**Next, if the client goes ahead:**

- Taster lessons for Business, Psychology and Sociology, built on the same template. Only the Economics taster exists now.
- Examiner sign-off on the 9-mark split and the extract.
- Real team portraits.
- A Figma file built from the same tokens, if they want design files alongside the code.

## Run

```bash
npm install
npm run dev
```

Routes (HashRouter):

| Route | Screen |
|---|---|
| `#/audit` | Stage 1 UX audit |
| `#/` | Homepage |
| `#/taster/economics` | Free lesson, ending in a marked answer |
| `#/start` | Sign-up (`?from=taster`, `?role=teacher`, `?mode=signin`) |
| `#/pricing` | Pricing |
| `#/team` | Team |
| `#/system` | Design system |
| `#/app` | Student dashboard |
| `#/app/lesson` | Lesson in the app |
| `#/parent` | Parent dashboard |
| `#/teacher` | Teacher dashboard |
| `#/teacher/review` | Teacher review screen |

A "Prototype" tab on the right edge lists every screen.

## Stack

- React 18, Vite 5 (`base: './'`) and react-router (HashRouter), with plain CSS and no animation library.
- Type is Cabinet Grotesk, self-hosted in `src/assets/fonts`.
- Icons are Basil Icons. `npm run icons` extracts them into `src/ui/icons.js`.

Data:

| File | Contents |
|---|---|
| `src/data/taster.js` | Lesson, question and sample answers |
| `src/data/marker.js` | Prototype marker, rule-based, standing in for the live AI |
| `src/data/people.js` | Dashboard data, with totals computed from rows and checked by assertions |
| `src/data/audit.js` | Audit findings |

- State is kept in localStorage under `exa-state-v1`.
- Photos were generated with Higgsfield for this prototype, are stored in `public/img/` and are shown in greyscale.

Research, decisions and the roast log are in `docs/strategy.md`.
