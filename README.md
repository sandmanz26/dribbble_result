# Nelum Vidyalaya: Student Management System (project5)

Bilingual (English and Sinhala) school portal, front end only. React 18, Vite 5, react-router
(HashRouter), Remix Icon. Mock data generated in `src/data/`. No backend.

Two versions, switched from the **Prototype** button (bottom right):

| | V1 Brief | V2 Concept |
|---|---|---|
| Routes | `#/v1` language and grade, `#/v1/portal`, `#/v1/portal/students` | `#/v2` language and grade, `#/v2/today` |
| Type | Inter (client's choice) + Noto Sans Sinhala | Gemunu Libre + Yaldevi (Sri Lankan faces, both scripts) |
| Colour | #0B2545, #134074 on a blue-grey ground | Paper white, ink, one marigold for "needs you" |
| Idea | The brief as written, done properly | The school day is the screen; every label in both scripts |

Deep links: `#/v1/portal?lang=si&grade=12`, `#/v2/today?lang=en&grade=5`.

Demo clock: Thursday 23 October 2026, 10:05 (period 4). The Prototype panel switches theme
and data state (live, loading, error, before registers are marked).

Saved state: one localStorage key, `sp-state-v1` (language, grade, relief assignments, theme).

```bash
npm ci
npm run dev
npm run build   # dist/
```

Sample data to replace with real records: the school name, every student and teacher name,
admission numbers, marks, attendance, timetable, the term and test dates. The Sinhala copy is a
first draft and should be proofread by a native speaker.

See `docs/strategy.md` for the design reasoning.
