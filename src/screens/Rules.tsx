import { LockClosedIcon } from '@radix-ui/react-icons'
import { useStore, type Rule } from '@/store'
import { Pill } from '@/components/ui/misc'
import { PageHead } from '@/components/page'
import { cn } from '@/lib/utils'

// What Patrick may do alone. Three levels per action, set by risk, so people are asked only where
// a mistake would cost money, trust or care. Locked rows are clinic policy.
const MODES: { id: Rule['mode']; label: string }[] = [{ id: 'auto', label: 'Do it' }, { id: 'ask', label: 'Ask first' }, { id: 'never', label: 'Never' }]

export default function Rules() {
  const { rules, setRule, tasks } = useStore()
  const asks = tasks.filter((t) => t.state === 'needs_review' && t.proposal).length
  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-8 p-5 md:p-6">
      <PageHead title="Rules for Patrick" sub="What Patrick may do on its own, what it must ask about, and what it never does. Changes apply to new work straight away." />
      <section className="grid gap-6 border-b border-rule pb-8 lg:grid-cols-[360px_1fr]">
        <div className="grid content-start gap-1.5">
          <h2 className="text-[16px] font-medium">Actions</h2>
          <p className="text-[13.5px] text-muted">Keep "Ask first" where a mistake reaches a patient's wallet or their care. Every ask lands in the queue with what Patrick read and why it stopped. Right now {asks} asks are waiting.</p>
        </div>
        <ul className="grid gap-0 rounded-[16px] bg-raised p-2">
          {rules.map((r) => (
            <li key={r.id} className="grid gap-2 rounded-card p-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="grid gap-0.5">
                <p className="flex flex-wrap items-center gap-2 text-[14px] font-medium">{r.action}<Pill tone={r.risk === 'high' ? 'neg' : r.risk === 'medium' ? 'warn' : 'neu'}>{r.risk} risk</Pill>{r.locked && <span className="flex items-center gap-1 text-[12px] text-muted"><LockClosedIcon />Clinic policy</span>}</p>
                <p className="text-[13px] text-muted">{r.detail}</p>
              </div>
              <div className="flex rounded-control bg-sheet p-0.5 border border-edge" role="radiogroup" aria-label={r.action}>
                {MODES.map((m) => (
                  <button key={m.id} role="radio" aria-checked={r.mode === m.id} disabled={r.locked} onClick={() => setRule(r.id, m.id)}
                    className={cn('h-7 rounded-[5px] px-3 text-[13px] text-muted disabled:cursor-not-allowed', r.mode === m.id && 'bg-ink font-medium text-white', r.locked && r.mode !== m.id && 'opacity-40')}>{m.label}</button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="grid content-start gap-1.5">
          <h2 className="text-[16px] font-medium">When Patrick is unsure</h2>
          <p className="text-[13.5px] text-muted">Below these levels Patrick stops and asks, whatever the action rule says.</p>
        </div>
        <dl className="grid gap-0 rounded-[16px] bg-raised p-5 text-[14px]">
          {[['Patient match', '90% or higher'], ['Reading a fax field', '85% or higher'], ['Sorting a document', '95% or higher'], ['Retries before asking', '5 attempts, waits 1, 2, 4, 8 min']].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[1fr_auto] gap-4 py-2"><dt className="font-medium">{k}</dt><dd className="tnum text-muted">{v}</dd></div>
          ))}
        </dl>
      </section>
    </div>
  )
}
