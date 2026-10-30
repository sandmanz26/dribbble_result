import { Link } from 'react-router-dom'
import { Moon, Repeat } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { NOW, PROPOSALS, SLEEP, fmt, totals } from '../data/myelin.js'
import { Card, CardHead } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import Composer from '../ui/Composer.jsx'
import { Trace, Kpi, PathChip, Avatar } from '../ui/kit.jsx'

export default function Today() {
  const { s, tasks, dispatch } = useStore()
  const from = new Date(NOW.getTime() - 24 * 3600 * 1000)
  const day = tasks.filter((t) => t.at >= from)
  const T = totals(day)
  const escal = day.filter((t) => t.escalated).length
  const recent = day.filter((t) => t.ask).slice(-6).reverse()
  const waiting = PROPOSALS.filter((p) => !s.approved.includes(p.id) && !s.declined.includes(p.id))
  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight">Today</h1>
          <p className="mt-1 max-w-[86ch] text-[14px] text-muted">
            <span className="num text-ink">{T.n}</span> tasks since yesterday {fmt.clock(from)}. <span className="num text-ink">{fmt.pct(T.fast)}</span> took a fast path; {escal} fast {escal === 1 ? 'answer was' : 'answers were'} not sure enough, so Reason took over.
          </p>
        </div>
        <Button variant="outline" asChild><Link to="/app/sleep"><Moon />Last night’s report</Link></Button>
      </header>

      <Composer />

      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6" aria-label="Last 24 hours">
        <Kpi label="Tasks" value={T.n} note="last 24 hours" />
        <Kpi label="On fast paths" value={fmt.pct(T.fast)} note="Reflex and Recall" />
        <Kpi label="Median answer" value={fmt.time(T.medianTime)} note="from send to answer" />
        <Kpi label="Spent" value={fmt.usd(T.cost)} note="actual" />
        <Kpi label="Reasoning everything" value={fmt.usd(T.base)} note="same tasks, large model only" />
        <Kpi label="Saved" value={fmt.pct(T.pct)} note={<span className="num">{fmt.usd(T.saved)} less</span>} />
      </dl>

      <Card aria-labelledby="trace-h">
        <CardHead id="trace-h" title="Last 24 hours, by path"><span className="text-[12.5px] text-muted">Each mark is a task. Point at one to see it; Reason marks are as wide as the time spent thinking.</span></CardHead>
        <Trace tasks={day} from={from} to={NOW} linkTo={(t) => `/app/tasks/${t.id}`} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card aria-labelledby="recent-h">
          <CardHead id="recent-h" title="Recent tasks"><Link to="/app/tasks" className="text-[12.5px] text-muted underline underline-offset-4 hover:text-ink">All {tasks.length} tasks</Link></CardHead>
          <ul className="grid">
            {recent.map((t) => (
              <li key={t.id} className="border-t border-rule first:border-0">
                <Link to={`/app/tasks/${t.id}`} className="grid grid-cols-[24px_1fr] items-start gap-3 py-3 hover:bg-raised/40 sm:grid-cols-[24px_1fr_auto]">
                  <Avatar who={t.who} />
                  <span className="min-w-0"><span className="block truncate text-[14px]">{t.ask}</span><PathChip t={t} className="mt-1" /></span>
                  <span className="num hidden text-[12.5px] text-muted sm:block">{fmt.clock(t.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid content-start gap-6">
          <Card aria-labelledby="sleep-h">
            <CardHead id="sleep-h" title="While you slept"><span className="num text-[12.5px] text-muted">{SLEEP.from} to {SLEEP.to}</span></CardHead>
            <dl className="grid grid-cols-3 gap-3">
              <div><dt className="text-[12.5px] text-muted">Merged</dt><dd className="num text-[20px]">{SLEEP.merged}</dd></div>
              <div><dt className="text-[12.5px] text-muted">Faded</dt><dd className="num text-[20px]">{SLEEP.faded}</dd></div>
              <div><dt className="text-[12.5px] text-muted">Strengthened</dt><dd className="num text-[20px]">{SLEEP.strengthened}</dd></div>
            </dl>
            {!s.conflict && <p className="mt-4 border-l border-warn pl-3 text-[13px]"><b className="font-semibold">1 conflict needs you.</b> {SLEEP.conflict.text}</p>}
            <Link to="/app/sleep" className="mt-3 inline-block text-[12.5px] text-muted underline underline-offset-4 hover:text-ink">Read the report</Link>
          </Card>

          <Card aria-labelledby="hab-h">
            <CardHead id="hab-h" title="Habits to approve">{waiting.length > 0 && <Badge tone="amber">{waiting.length} waiting</Badge>}</CardHead>
            {waiting.length ? (
              <ul className="grid gap-4">
                {waiting.map((p) => (
                  <li key={p.id} className="grid gap-2">
                    <p className="flex items-center gap-2 text-[14px] font-semibold"><Repeat width={14} height={14} className="text-reflex" />{p.name}</p>
                    <p className="text-[13px] text-muted">{p.evidence.split('. ')[0]}.</p>
                    <p className="num text-[12.5px]">{fmt.usd(p.perRun.now)} → {fmt.usd(p.perRun.then)} a run · about {p.perMonth} runs a month</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onClick={() => dispatch({ type: 'approve', id: p.id, name: p.name })}>Approve</Button>
                      <Button size="sm" variant="ghost" asChild><Link to="/app/habits">See the evidence</Link></Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-[13px] text-muted">Nothing waiting. New proposals arrive after the night’s consolidation.</p>}
          </Card>
        </div>
      </div>
    </div>
  )
}
