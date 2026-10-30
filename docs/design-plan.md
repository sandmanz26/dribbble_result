# Design plan

## Direction
**Retro instrument, contemporary product.** The reference is the neuroscience lab: polygraph and EEG chart
recorders, phosphor displays, ruled chart paper. The product's signature is the **trace**: a polygraph strip with
three lanes (Reflex, Recall, Reason) where every task leaves a mark, so a day of work reads like a recording of a
brain at work. It appears on the overview page as the hero, on Today as the main chart, small in the desktop tray,
and on the phone's home.

taste-skill app style: **Data terminal** (dark, dense, cards darker than the ground, every selection a 1px accent
line, signs instead of colour on numbers). Face chosen: every figure in a monospace (Red Hat Mono) beside
Red Hat Text, and the accent line taken from the instruments: phosphor amber.

## Tokens (Tailwind v4 theme, shadcn variables)
- Ground #141416, surface #111114, raised #1d1d21, border #26262b, text #f3f2ee, muted #8f9096.
- Accent (selection line, focus, primary action): phosphor amber #f0b04a.
- Path hues, data only: Reflex #5fc39c, Recall #6ea8e6, Reason #f3f2ee (the heavy, expensive path in full white).
- Negative #e5566f for failures and budget breaches only.
- Radius 6 for cards, full for controls. No shadows except menus, dialogs and the desktop overlay.
- Type: Red Hat Text 13 to 15 for UI, Red Hat Mono for every figure and ID, Red Hat Display for the overview page.
- Icons: Pixelarticons (pixel-grid icons, retro, readable at 16 and 24).

## Information architecture
Web workspace (icon rail): Today · Tasks · Memory · Habits · Spend · Settings. Sleep report opens from Today.
Desktop: quick-ask overlay (Alt Space), tray menu, full window is the web workspace.
Mobile: Today · Ask (voice, photo, text) · Approve · Report.

## Screens and their one question
| Screen | Question it answers first | Main element |
|---|---|---|
| Overview (`#/`) | Why is this AI cheaper and faster? | Live trace hero, the three paths, savings calculator, the three surfaces |
| Today | Did the brain work well and cheaply today? | Trace of the last 24 hours with the KPI row; habits to approve; morning report |
| Task | Why did it answer this way, and was it enough? | Answer with path chip, thought path panel, escalate, correct, make a habit |
| Memory | What does it know, how strongly, and where did that come from? | Table with strength, last use, source; edit, pin, forget |
| Habits | What has it learned to do on its own? | Proposals with evidence, active habits with runs, accuracy and savings |
| Spend | What did we spend, against what baseline? | Actual vs baseline chart, share tables by path, type and person |
| Settings | How much should it think, and how long should it remember? | Thinking budget with forecast, thresholds, retention, privacy |
| Desktop | Can I get an answer without leaving my app? | Overlay with path chip, paste back, hand over to the workspace |
| Mobile | What happened, and what needs me? | Today trace, capture, approvals, report |

## States to design
Loading (path chosen, answering), empty workspace (first day: no memory, no habits yet), error (Reason
unavailable: Recall answers with a warning), budget reached (Frugal mode forced, admin notified), offline on
mobile (captures queue), low confidence (auto-escalation shown).

## Prototype plan
One React app (Vite, Tailwind v4, shadcn-style components on Radix), HashRouter, mock data in `src/data/`,
state in `localStorage` key `myl-state-v1`. Routes: `#/` overview, `#/app/*` workspace, `#/desktop` desktop
scene, `#/mobile` phone frame around `#/m/*`. Review links for each state.

## Deliverables after award (the $10,000 scope)
Week 1: workshop, IA and flows, trace and path system. Week 2 and 3: high-fidelity web, desktop and mobile in
Figma on shadcn tokens, interactive prototype. Week 4: states, accessibility pass, handoff (tokens, components,
specs), revisions.
