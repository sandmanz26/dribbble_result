# Flow Director: clinic operations prototype

Clickable prototype for Flow Director, clinic operations software with an AI employee, Patrick, who
does referral intake, insurance checks, scheduling and prior authorizations, and hands work to
people when a rule or a failure requires it. Built for an Upwork brief (product designer for AI
operations software). Synthetic data only.

Hosted on the portfolio hub at `/flowdirector/` (password protected, never indexed).

## Screens
- **Today**: what needs a person, what Patrick is doing now, work per hour.
- **Queue**: inbox triage with views For people / Patrick working / Closed; each item shows Patrick's
  proposal, the effects, the rule that made it ask, the evidence with confidence, and Approve,
  Decline (with reason), or take over. Failed items show recovery options. Approving Ana Torres's
  booking meets a real conflict the first time, to show recovery.
- **Run**: every step of a workflow as its own job, with attempts, outputs and state.
- **Referrals**, **Activity** (audit log with undo), **Rules for Patrick** (Do it / Ask first / Never).
- **Design handoff**: state vocabulary, async interaction spec, API shapes, links to every state.
- Menu items not designed yet stay in the menu marked Upcoming.

Review links: `#/queue/T-2086`, `#/queue/T-2079`, `#/runs/R-5583`, `#/queue?state=loading`,
`#/queue?state=empty`, `#/queue?state=error`, `#/handoff`.

## Stack
React 18 + TypeScript, Vite 5 (`base: './'`), HashRouter, Tailwind v4, Radix, cva. Mona Sans and
Commit Mono (Fontsource). No backend; state lives in memory.

Docs: `docs/research.md`, `docs/handoff.md`, `docs/recap.md`.

```bash
npm ci && npm run dev
npm run build   # type-checks, then builds dist/
```
