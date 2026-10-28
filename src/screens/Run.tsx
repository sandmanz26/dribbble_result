import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useStore } from '@/store'
import { RUNS } from '@/data/demo'
import type { JobState, Run, Step } from '@/data/types'
import { Indeterminate, StateGlyph, StatePill } from '@/components/flow'
import { Button } from '@/components/ui/button'
import { Empty, PageHead } from '@/components/page'
import { clockAgo, cn } from '@/lib/utils'

// A run is the workflow behind a queue item: every step is its own job, with its own state,
// attempts and output. The run follows the task, so approving in the queue moves it on here.
function live(run: Run, taskState: JobState | undefined): Step[] {
  const s = run.steps.map((x) => ({ ...x }))
  const gate = s.findIndex((x) => x.state === 'needs_review' || x.state === 'failed')
  if (gate < 0 || !taskState) return s
  if (taskState === 'approving' || (taskState === 'running' && s[gate].state === 'failed')) s[gate].state = taskState === 'approving' ? 'approving' : 'running'
  if (taskState === 'done') { s[gate].state = 'done'; s[gate].detail += ' Resolved by a person.'; if (s[gate + 1]) s[gate + 1].state = run.id === 'R-5576' ? 'done' : 'running'; if (run.id === 'R-5576') s.forEach((x) => (x.state = 'done')) }
  if (taskState === 'cancelled') s.slice(gate).forEach((x) => (x.state = 'cancelled'))
  return s
}

export default function RunView() {
  const { id } = useParams()
  const { task, recover } = useStore()
  const run = RUNS.find((r) => r.id === id)
  if (!run) return <div className="p-6"><Empty title={`Run ${id} isn't in this prototype`} action={<Button asChild><Link to="/referrals">See referrals</Link></Button>}>Two runs are drawn in full: R-5583 (a referral waiting on a patient match) and R-5576 (an insurance check that failed and retries).</Empty></div>
  const t = task(run.taskId)
  const steps = live(run, t?.state)
  const doneCount = steps.filter((x) => x.state === 'done').length
  return (
    <div className="grid gap-6 p-5 md:p-6">
      <Link to={`/queue/${run.taskId}`} className="flex items-center gap-1 text-[13px] text-muted hover:text-ink"><ArrowLeftIcon />Back to {run.taskId}</Link>
      <PageHead title={run.title} sub={<><span className="font-mono">{run.id}</span> · {run.source} · <span className="tnum">{doneCount} of {steps.length} steps done</span></>}>
        {t && <StatePill state={t.state} />}
      </PageHead>

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <ol className="relative grid" aria-label="Steps">
          {steps.map((s, i) => (
            <li key={s.id} className="relative grid grid-cols-[24px_1fr] gap-x-4 pb-6 last:pb-0">
              {i < steps.length - 1 && <span className={cn('absolute left-[11px] top-6 bottom-0 w-0.5', s.state === 'done' ? 'bg-positive/40' : 'bg-rule')} aria-hidden="true" />}
              <span className="relative z-10 pt-0.5"><StateGlyph state={s.state} size={22} /></span>
              <div className={cn('grid gap-2', (s.state === 'queued' || s.state === 'cancelled') && 'opacity-80')}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-[15px] font-semibold">{s.name}</h3>
                  {s.startedMin !== undefined && <span className="tnum text-[12.5px] text-muted">{clockAgo(s.startedMin)}{s.durationSec !== undefined ? ` · ${s.durationSec} s` : ''}</span>}
                  <span className="ml-auto"><StatePill state={s.state} /></span>
                </div>
                <p className="text-[13.5px] text-muted">{s.detail}</p>
                {(s.state === 'running' || s.state === 'approving') && <Indeterminate />}
                {s.output && <dl className="grid gap-1 text-[13px]">{s.output.map((o) => <div key={o.label} className="flex gap-2"><dt className="text-muted">{o.label}:</dt><dd>{o.value}</dd></div>)}</dl>}
                {s.attempts && (
                  <table className="w-full max-w-[520px] text-[13px]">
                    <thead><tr className="text-left text-[12px] text-muted"><th className="py-1 font-normal">Attempt</th><th className="font-normal">Time</th><th className="font-normal">Result</th></tr></thead>
                    <tbody>{s.attempts.map((a, j) => <tr key={j} className="border-t border-rule"><td className="tnum py-1.5">{j + 1}</td><td className="tnum">{a.at}</td><td className={a.ok ? 'text-positive' : 'text-negative'}>{a.result}</td></tr>)}</tbody>
                  </table>
                )}
                {s.state === 'failed' && t?.failure && (
                  <div className="flex flex-wrap gap-2">{t.failure.options.map((o) => <Button key={o.id} size="sm" variant={o.primary ? 'primary' : 'secondary'} onClick={() => recover(t.id, o.id)}>{o.label}</Button>)}</div>
                )}
                {s.state === 'needs_review' && <Button asChild size="sm" variant="primary" className="justify-self-start"><Link to={`/queue/${run.taskId}`}>Review in the queue</Link></Button>}
              </div>
            </li>
          ))}
        </ol>

        <aside className="grid content-start gap-5 text-[13.5px]">
          <section className="grid gap-2">
            <h2 className="text-[16px] font-semibold">How this run works</h2>
            <p className="text-muted">Each step is a separate background job. A step that fails retries with growing waits (1, 2, 4, 8 minutes) up to its limit, then stops and asks a person with the options shown. Later steps never start on a guess.</p>
          </section>
          <section className="grid gap-2">
            <h2 className="text-[16px] font-semibold">Systems touched</h2>
            <ul className="grid gap-1.5">
              {(run.workflow === 'referral' ? ['Fax line (inbound)', 'Document reader', 'Patient records (EHR)', 'Payer clearinghouse', 'Schedule', 'Text messages'] : ['Patient records (EHR)', 'Payer clearinghouse']).map((x) => <li key={x} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-faint" />{x}</li>)}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
