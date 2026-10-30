# Myelin: AI that thinks only when it has to

Design and front-end prototype for the Dribbble brief "AI Brain UI/UX for Web/Desktop/Mobile".
React 18, Vite 5, HashRouter, Tailwind v4 with shadcn-style components on Radix, Pixelarticons, Red Hat Text,
Display and Mono. Mock data only, no backend. "Myelin" and "Fernwood Studio" are placeholders.

## The idea
Every request takes the cheapest path that is good enough: **Reflex** (an approved habit or a verified answer),
**Recall** (memory plus a small model) or **Reason** (a large model). The router escalates on its own when
confidence falls below the workspace threshold. Savings are always shown against one baseline: the same work
done entirely by Reason. Repeated work becomes a habit only after a person approves it.

## Routes
| Route | What it shows |
|---|---|
| `#/` | Overview page: live trace, the three paths, savings calculator, surfaces |
| `#/app` | Web app, Today: composer, KPIs, the day as a three-lane trace, sleep report, habits to approve |
| `#/app/tasks`, `#/app/tasks/T-2177` | Task list, task detail with "How it got here" (an escalated task) |
| `#/app/memory`, `#/app/habits`, `#/app/spend`, `#/app/settings`, `#/app/sleep` | Memory, habits, spend vs baseline, thinking budget, night report with a conflict to resolve |
| `#/desktop` | Desktop: quick ask over a mail app (Alt Space), menu bar trace |
| `#/mobile` | Mobile in a phone frame: today, voice ask, approve habits, night report |

Keyboard in the web app: `g` + `t k m h s ,` moves between screens, `n` starts a task.
State persists in localStorage key `myl-state-v1`; the rail's reset button clears it.

## Docs
`docs/research.md` (market and science, with sources), `docs/roast.md` (what to avoid and what the brief gets
wrong), `docs/prd.md`, `docs/design-plan.md`.

## Run
```bash
npm ci && npm run dev    # npm run build → dist/
```

Photos: Open Images, CC BY 2.0, credited at `#/credits`.
