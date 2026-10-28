import { Link } from 'react-router-dom'
import { STATE, StateGlyph, StatePill, ActorMark, Progress, Indeterminate } from '@/components/flow'
import { Button } from '@/components/ui/button'
import { Kbd, Pill } from '@/components/ui/misc'
import { PageHead } from '@/components/page'
import type { JobState } from '@/data/types'

// The page for the engineer: the state vocabulary, how each interaction behaves over an async
// API, the shapes the screens expect, every review link, and the components.
const ORDER: JobState[] = ['queued', 'running', 'waiting', 'needs_review', 'approving', 'failed', 'done', 'cancelled']
const RULES: Record<JobState, { who: string; next: string; ui: string }> = {
  queued: { who: 'Anyone can take it over', next: 'running, cancelled', ui: 'Grey ring. No spinner: nothing is happening yet.' },
  running: { who: 'Patrick; people may take over', next: 'done, failed, needs_review, waiting', ui: 'Spinning ring; progress bar when the total is known, an indeterminate bar when not.' },
  waiting: { who: 'Nobody in the clinic', next: 'running, failed', ui: 'Dashed ring. Always say who it waits on and when Patrick checks next.' },
  needs_review: { who: 'The owner shown on the item', next: 'approving, cancelled, running (taken over)', ui: 'Person glyph in amber. Shows the proposal, the evidence, the rule that made Patrick ask.' },
  approving: { who: 'Nobody; actions are locked', next: 'done, failed', ui: 'Optimistic. Button keeps its width and shows a spinner; after 15 s without an answer, becomes failed with Retry.' },
  failed: { who: 'The owner; Patrick may retry by itself', next: 'running (retry), needs_review (taken over), done (skipped)', ui: 'Red cross. Plain-language message, error code, attempt count, next automatic retry, and 2 or 3 recovery options with one suggested.' },
  done: { who: 'Undo for 10 s, then from Activity if reversible', next: 'needs_review (undo)', ui: 'Green tick. Toast with Undo and a countdown.' },
  cancelled: { who: 'Nobody', next: 'none', ui: 'Empty ring. The reason is in Activity.' },
}

const JSON_TASK = `{
  "id": "T-2086",
  "workflow": "scheduling",
  "state": "needs_review",          // queued | running | waiting | needs_review | approving | failed | done | cancelled
  "owner": { "type": "user", "id": "u1" },   // or { "type": "agent", "name": "Patrick" }
  "title": "Book the initial evaluation for Ana Torres",
  "patient_id": "p2",
  "priority": "urgent",
  "sla_due_at": "2026-10-28T14:21:00Z",
  "confidence": 0.92,
  "proposal": {
    "verb": "Book Tue 3 Nov, 09:30 ...",
    "effects": ["Appointment created", "Text message sent"],
    "reversible": true,
    "risk": "medium",
    "rule_id": "r4"
  },
  "evidence": [{ "label": "Authorization", "value": "...", "source": "Payer portal", "confidence": null }],
  "failure": null,                  // { code, message, attempts, max_attempts, next_retry_at, options[] }
  "run_id": "R-5579",
  "version": 7                      // optimistic concurrency: send back with every action
}`

const SEQ = [
  ['0 ms', 'Click Approve', 'State becomes approving locally. Other actions on the item lock.'],
  ['~50 ms', 'POST /api/tasks/T-2086/approve', 'Body { version: 7, note? }, header Idempotency-Key. Laravel validates and dispatches a queued job; answers 202 with the job id.'],
  ['live', 'Realtime event task.updated', 'Laravel Reverb (or Pusher) over Echo. If the socket is down, poll GET /api/tasks/T-2086 every 5 s.'],
  ['< 15 s', 'done or failed arrives', 'done: toast with Undo 10 s. failed: recovery card replaces the proposal; the original choice stays visible.'],
  ['> 15 s', 'No answer', 'Show "Still sending" and keep the lock; at 60 s show failed with Retry (same Idempotency-Key, so no double booking).'],
  ['409', 'Version conflict', 'Someone else changed the item. Reload it, keep the user\'s note, say what changed.'],
]

const LINKS: [string, string][] = [
  ['Approval with evidence and patient choice', '/queue/T-2088'],
  ['Approval that fails, then recovery (approve it)', '/queue/T-2086'],
  ['High-risk approval (money)', '/queue/T-2084'],
  ['Failed with automatic retry', '/queue/T-2079'],
  ['Failed, unreadable fax', '/queue/T-2077'],
  ['Handed to a clinician', '/queue/T-2081'],
  ['Running with progress', '/queue/T-2089'],
  ['Waiting on a payer', '/queue/T-2087'],
  ['Workflow run, waiting on a person', '/runs/R-5583'],
  ['Workflow run with failed attempts', '/runs/R-5576'],
  ['Queue loading', '/queue?state=loading'],
  ['Queue empty', '/queue?state=empty'],
  ['Queue error', '/queue?state=error'],
  ['Today empty', '/?state=empty'],
  ['Activity error', '/activity?state=error'],
  ['Upcoming menu item', '/upcoming/scheduling'],
]

export default function Handoff() {
  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-10 p-5 md:p-6">
      <PageHead title="Design handoff" sub="For engineering: how every async state looks and behaves, the API shapes the screens expect, and links to each state. Synthetic data throughout." />

      <section className="grid gap-3">
        <h2 className="text-[16px] font-semibold">1. One vocabulary for work in progress</h2>
        <p className="max-w-[72ch] text-[13.5px] text-muted">Every task, step and background job uses these eight states, with the same glyph and words everywhere. Shape carries the state as well as colour.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-[13.5px]">
            <thead><tr className="text-left text-[12.5px] text-muted"><th className="pb-2 font-normal">State</th><th className="pb-2 font-normal">Means</th><th className="pb-2 font-normal">Who can act</th><th className="pb-2 font-normal">Moves to</th><th className="pb-2 font-normal">On screen</th></tr></thead>
            <tbody>
              {ORDER.map((s) => (
                <tr key={s} className="border-t border-rule align-top">
                  <td className="py-3 pr-3"><span className="flex items-center gap-2"><StateGlyph state={s} /><StatePill state={s} /></span><code className="mt-1 block font-mono text-[12px] text-muted">{s}</code></td>
                  <td className="py-3 pr-3">{STATE[s].hint}</td>
                  <td className="py-3 pr-3">{RULES[s].who}</td>
                  <td className="py-3 pr-3 font-mono text-[12px]">{RULES[s].next}</td>
                  <td className="py-3 text-muted">{RULES[s].ui}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-[16px] font-semibold">2. Approve, over an asynchronous API</h2>
        <ol className="grid">
          {SEQ.map(([t, a, b]) => (
            <li key={a} className="grid gap-1 border-t border-rule py-3 sm:grid-cols-[80px_260px_1fr] sm:gap-4">
              <span className="tnum font-mono text-[12.5px] text-muted">{t}</span><b className="font-semibold">{a}</b><span className="text-[13.5px] text-muted">{b}</span>
            </li>
          ))}
        </ol>
        <p className="max-w-[72ch] text-[13.5px] text-muted">Undo inside the 10 s window cancels the job before it commits (DELETE /api/tasks/:id/approval). After that, undo is a new compensating action (cancel the booking, send a correction) and goes through the same approval rules.</p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-[16px] font-semibold">3. Task shape the screens expect</h2>
        <pre className="overflow-x-auto rounded-card bg-raised p-4 font-mono text-[12.5px] leading-relaxed">{JSON_TASK}</pre>
        <p className="max-w-[72ch] text-[13.5px] text-muted">Runs return ordered steps, each with its own state, attempts[] and output[]. The queue lists use cursor pagination and the same task.updated events, so rows change state in place without a refresh.</p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-[16px] font-semibold">4. Review every state</h2>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {LINKS.map(([l, to]) => <li key={to} className="border-t border-rule py-2"><Link to={to} className="flex justify-between gap-3 text-[13.5px] hover:underline"><span>{l}</span><span className="font-mono text-[12px] text-muted">#{to}</span></Link></li>)}
        </ul>
      </section>

      <section className="grid gap-4">
        <h2 className="text-[16px] font-semibold">5. Components (shadcn/ui base, extended)</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Spec name="Button, pending" note="shadcn Button plus pending: spinner replaces the icon, width holds, aria-busy set."><div className="flex gap-2"><Button variant="primary">Approve</Button><Button variant="primary" pending>Sending</Button></div></Spec>
          <Spec name="ActorMark" note="Patrick is a square with P; people are round initials. Used in every list, log and owner field."><div className="flex items-center gap-2"><ActorMark actor={{ kind: 'agent', name: 'Patrick' }} size={28} /><ActorMark actor={{ kind: 'human', id: 'x', name: 'Maya Okafor', role: '' }} size={28} /></div></Spec>
          <Spec name="Progress" note="Known total: bar and words. Unknown: indeterminate bar, never a fake percentage."><div className="grid gap-3"><Progress done={11} total={18} label="patients checked" /><Indeterminate /></div></Spec>
          <Spec name="Pill" note="One status mark per row. Words first; colour second."><div className="flex flex-wrap gap-2"><Pill tone="warn">19 min left</Pill><Pill tone="neg">Urgent</Pill><Pill tone="info">Suggested</Pill></div></Spec>
        </div>
        <p className="text-[13.5px] text-muted">Also: proposal card, evidence list with confidence, recovery card, decline dialog with reasons, toast with undo countdown, upcoming page. Stack: React, TypeScript, Tailwind, Radix (tabs, dialog, tooltip, switch), as in the brief.</p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-[16px] font-semibold">6. Keyboard</h2>
        <ul className="grid gap-2 text-[13.5px] sm:grid-cols-2">
          <li className="flex items-center gap-2"><Kbd>j</Kbd><Kbd>k</Kbd> next and previous item in the queue</li>
          <li className="flex items-center gap-2"><Kbd>a</Kbd> approve the open item</li>
          <li className="flex items-center gap-2"><Kbd>g</Kbd> then <Kbd>q</Kbd>, <Kbd>t</Kbd> or <Kbd>a</Kbd> go to queue, today, activity</li>
          <li className="flex items-center gap-2"><Kbd>Esc</Kbd> close any dialog</li>
        </ul>
      </section>
    </div>
  )
}

function Spec({ name, note, children }: { name: string; note: string; children: React.ReactNode }) {
  return <div className="grid gap-3 rounded-card p-4 border border-edge"><div><p className="font-semibold">{name}</p><p className="text-[13px] text-muted">{note}</p></div>{children}</div>
}
