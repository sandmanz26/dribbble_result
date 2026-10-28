# Flow Director: handoff notes for engineering

The live version of this document is the **Design handoff** screen in the prototype (`#/handoff`).

## Stack in the prototype
React 18 + TypeScript, Vite, Tailwind v4, Radix primitives (tabs, dialog, tooltip, switch, slot),
class-variance-authority. Components follow shadcn/ui and live in `src/components/ui`. Icons:
Radix Icons. Type: Mona Sans, Commit Mono for IDs.

## Job states
`queued, running, waiting, needs_review, approving, failed, done, cancelled`. Definitions,
transitions and UI rules are in `src/screens/Handoff.tsx`; the shared components are in
`src/components/flow.tsx` (`StateGlyph`, `StatePill`, `ActorMark`, `Progress`, `Indeterminate`).

## Approve sequence
1. Optimistic `approving` locally; other actions lock.
2. `POST /api/tasks/:id/approve` with `{ version }` and an `Idempotency-Key`; Laravel answers 202 and
   dispatches a queued job.
3. Result arrives as `task.updated` over Laravel Reverb / Echo, or by polling `GET /api/tasks/:id`
   every 5 s when the socket is down.
4. `done`: toast with 10 s undo (`DELETE /api/tasks/:id/approval` before commit, compensating action
   after). `failed`: recovery card with options. No answer at 15 s: "Still sending"; at 60 s: failed
   with Retry using the same key. 409: version conflict, reload and keep the user's note.

## Data shapes
See `src/data/types.ts` (Task, Run, Step, LogEntry, Proposal, Failure) and the JSON example on the
handoff screen. All data is synthetic (`src/data/demo.ts`).

## Not designed in this round (shown as Upcoming in the menu)
Schedule, Authorizations, Patients, Messages, Reports, Integrations.
