# PRD: Myelin (placeholder name), the AI that takes the cheapest path that is good enough

Status: design prototype. Scope: UI/UX and front-end prototype only (React, mock data, no backend).

## 1. Problem
Teams pay frontier-model prices for work they have done many times before: the weekly report, the supplier reply,
the refund answer, the product description. Conventional AI reasons from scratch every time, hides what it costs,
and forgets how it solved the task yesterday.

## 2. Product in one sentence
Myelin answers each request by the cheapest path that is good enough (a learned habit, a memory, or deliberate
reasoning), shows which path it took and what it saved, and turns repeated work into habits a person approves.

## 3. Users
| Persona | Context | Job to be done |
|---|---|---|
| Maya Okafor, operations lead, Fernwood Studio (40-person furniture brand, sample) | Daily, long sessions on web and desktop | Hand over routine work, trust the result, keep AI spend under the monthly cap |
| Theo Lindqvist, customer care | Desktop, all day in the help desk | Get answers inside the tool he is in, without switching apps |
| Ines Duarte, founder | Mobile, a glance in the morning | See what the AI did, what it cost, approve what it wants to learn |
| Workspace admin (Maya) | Weekly | Set budgets and thresholds, review memory, audit escalations |

## 4. Principles
1. Show the path, not the spinner. 2. Savings against a stated baseline. 3. Fast answers carry their confidence
and their memories. 4. Nothing is learned without a person. 5. Each surface has one job.

## 5. Concepts
- **Paths.** Reflex (habit or verified cached answer; tens of milliseconds; near zero cost). Recall (memory
  retrieval plus a small model; about a second). Reason (frontier model, deliberate; seconds to a minute).
- **Attention (router).** Chooses the path from novelty, confidence and the workspace's thinking budget.
- **Confidence threshold.** Below it, the fast path escalates on its own and says so.
- **Memory.** Facts (semantic), Events (episodic), Habits (procedural). Each has a strength that grows with use and
  fades without it.
- **Habit.** A routine first solved by Reason, proposed after repeated accepted results, approved by a person,
  then run by Reflex.
- **Sleep.** Nightly consolidation: merge duplicates, fade unused memories, propose habits, flag conflicts.
- **Baseline.** The cost and time if the same work had been done entirely by the Reason model.

## 6. Requirements
### P0 (in the prototype)
| ID | Requirement | Acceptance |
|---|---|---|
| P0-1 | Composer that takes questions and tasks, with attachments and an optional "Think it through" | Sending shows the chosen path within 300 ms, with the reason |
| P0-2 | Path chip on every answer: path, time, cost, saving vs baseline | Numbers add up to the workspace totals |
| P0-3 | Expandable thought path: attention decision, memories used, confidence, escalation if any | Each memory links to its record |
| P0-4 | Escalate ("Think it through") and correct ("That's wrong") on any fast answer | Escalation shows new cost; correction updates the memory and is logged |
| P0-5 | Today screen: activity trace by path, KPIs, tasks, habits to approve, morning report | Answers "did the brain work well and cheaply today?" first |
| P0-6 | Memory screen: facts, events, habits; strength, last used, source; edit, pin, forget | Forget asks for confirmation and shows affected habits |
| P0-7 | Habit proposals with evidence; approve, edit, decline, pause | An approved habit moves the next matching task to Reflex |
| P0-8 | Spend and savings: actual vs baseline over time, share by path, by task type, by person | Totals equal the sum of tasks |
| P0-9 | Thinking budget: Frugal, Balanced, Thorough, with the thresholds they set and an estimated monthly cost | Changing it updates the forecast |
| P0-10 | Desktop: quick-ask overlay over another app, paste back, tray with today's numbers | Opened by a shortcut, closed with Escape |
| P0-11 | Mobile: today, voice or photo capture, habit approvals, morning report | Usable with one thumb |
| P0-12 | States: loading, empty, error (model unavailable, budget reached), offline (mobile) | Each visible from a review link |

### P1 (designed, partly prototyped)
Team memory scopes and permissions, per-task-type overrides, spend alerts, audit export, integrations (mail,
help desk, drive) as sources for memory.

### Non-goals
Training models, a real router, real billing, admin of model providers, a marketplace of agents.

## 7. Metrics
- Share of tasks on fast paths (target 70% or more after four weeks for routine teams).
- Cost per task vs baseline; monthly spend vs cap.
- Escalation rate and correction rate on fast paths (quality guardrail: corrections under 2%).
- Time to answer (median), and time to first useful action on desktop.
- Habits approved per week; habit accuracy.

## 8. Risks
| Risk | Mitigation in the design |
|---|---|
| Confident wrong answers on the fast path | Confidence shown, threshold with auto-escalation, one-click "That's wrong" |
| Users distrust the savings figure | Baseline stated beside every saving; escalations listed openly |
| Privacy of memory | Scopes (me, team), visible sources, forget, retention settings |
| Learning the wrong habit | Habits proposed with evidence, approved by a person, paused at any time |
| Brain metaphor feels gimmicky | Brain words only where they explain behaviour; no brain imagery |

## 9. Open questions for the client
Which models sit behind Reason and Recall; real hit rates on pilot teams; pricing unit (per seat, per task, per
token); which integrations matter first; brand name and identity.
