import { useStore } from '../store.jsx'
import { DAYS, MONTH, WORKSPACE, PATHS, PATH_ORDER, PEOPLE, TYPES, NOW, fmt, totals } from '../data/myelin.js'
import { Kpi, PathMark } from '../ui/kit.jsx'

// Actual spend against the same work done entirely by Reason, over 30 days. Hairline grid, dated ticks, a scale.
function SpendChart() {
  const W = 1000; const H = 230; const pad = { l: 44, r: 8, t: 10, b: 24 }
  const max = Math.ceil(Math.max(...DAYS.map((d) => d.base)) / 5) * 5
  const x = (i) => pad.l + (i / (DAYS.length - 1)) * (W - pad.l - pad.r)
  const y = (v) => pad.t + (1 - v / max) * (H - pad.t - pad.b)
  const line = (k) => DAYS.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d[k])}`).join('')
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-[230px] w-full" role="img" aria-label={`Daily spend over 30 days: ${fmt.usd(MONTH.cost)} actual against ${fmt.usd(MONTH.base)} if everything were reasoned`}>
      {ticks.map((t) => <g key={t}><line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(243,242,238,.07)" /><text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="num" fontSize="11" fill="#9a9ba1">${t}</text></g>)}
      {DAYS.map((d, i) => (i % 5 === 0 || i === DAYS.length - 1) && <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#9a9ba1" className="num">{fmt.day(d.d)}</text>)}
      <path d={line('base')} fill="none" stroke="#9a9ba1" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d={line('cost')} fill="none" stroke="var(--amber)" strokeWidth="2" />
    </svg>
  )
}

function Share({ title, rows, total }) {
  const max = Math.max(...rows.map((r) => r.v))
  return (
    <section className="min-w-0">
      <h3 className="mb-2 text-[14px] font-semibold">{title}</h3>
      <div className="grid grid-cols-[1fr_64px_64px] gap-x-3 px-2 text-[12px] text-muted"><span>Name</span><span className="text-right">Share</span><span className="text-right">Spent</span></div>
      <ul className="mt-1 grid gap-0.5">
        {rows.map((r) => (
          <li key={r.k} className="relative grid h-9 grid-cols-[1fr_64px_64px] items-center gap-x-3 px-2 text-[13px]">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 rounded-[3px] bg-raised" style={{ width: `${(r.v / max) * 100}%` }} />
            <span className="relative flex items-center gap-2 truncate">{r.mark}{r.k}</span>
            <span className="num relative text-right text-muted">{fmt.pct(r.v / total)}</span>
            <span className="num relative text-right">{fmt.usd(r.cost)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Spend() {
  const { tasks } = useStore()
  const from = new Date(NOW.getTime() - 24 * 3600 * 1000)
  const day = tasks.filter((t) => t.at >= from)
  const T = totals(day)
  const group = (key) => Object.entries(day.reduce((m, t) => { const k = key(t); m[k] = m[k] || { v: 0, cost: 0 }; m[k].v++; m[k].cost += t.cost; return m }, {})).map(([k, v]) => ({ k, ...v })).sort((a, b) => b.cost - a.cost)
  const cap = WORKSPACE.cap
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <header>
        <h1 className="text-[26px] font-semibold">Spend</h1>
        <p className="mt-1 max-w-[72ch] text-[14px] text-muted">The last 30 days cost <span className="num text-ink">{fmt.usd(MONTH.cost)}</span>. The same {MONTH.n.toLocaleString('en-US')} tasks done entirely by the reasoning model would have cost <span className="num text-ink">{fmt.usd(MONTH.base)}</span>, so this month ran <span className="num text-ink">{fmt.pct(1 - MONTH.cost / MONTH.base)}</span> cheaper.</p>
      </header>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        <Kpi label="Spent, 30 days" value={fmt.usd(MONTH.cost)} note={`of a ${fmt.usd(cap)} cap`} />
        <Kpi label="Reasoning everything" value={fmt.usd(MONTH.base)} note="the baseline" />
        <Kpi label="Cheaper than baseline" value={fmt.pct(1 - MONTH.cost / MONTH.base)} note="30 days" />
        <Kpi label="Tasks" value={MONTH.n.toLocaleString('en-US')} note={`${fmt.usd(MONTH.cost / MONTH.n)} a task`} />
        <Kpi label="Cap left" value={fmt.usd(cap - MONTH.cost)} note="resets 1 November" />
      </dl>
      <section aria-labelledby="ch-h">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="ch-h" className="text-[18px] text-muted">Daily spend</h2>
          <p className="flex items-center gap-4 text-[12.5px] text-muted"><span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-amber" />Actual</span><span className="flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed border-muted" />If everything were reasoned</span></p>
        </div>
        <div className="overflow-x-auto"><div className="min-w-[680px]"><SpendChart /></div></div>
        <p className="mt-2 text-[12.5px] text-muted">The gap widens as habits are approved: the first week ran about 70% under the baseline, the last week about 80%. Weekends are quiet.</p>
      </section>
      <section aria-labelledby="sh-h">
        <h2 id="sh-h" className="mb-1 text-[18px] text-muted">Last 24 hours, by share</h2>
        <p className="mb-4 text-[13px] text-muted">Share is the share of tasks; spent is what they cost. Reason is a small share of tasks and most of the bill.</p>
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
          <Share title="By path" total={T.n} rows={PATH_ORDER.map((p) => ({ k: PATHS[p].name, v: T.by[p].n, cost: T.by[p].cost, mark: <PathMark path={p} /> }))} />
          <Share title="By type of work" total={T.n} rows={group((t) => t.type).filter((r) => TYPES.includes(r.k))} />
          <Share title="By person" total={T.n} rows={group((t) => PEOPLE[t.who].name)} />
          <section>
            <h3 className="mb-2 text-[14px] font-semibold">Escalations</h3>
            {day.filter((t) => t.escalated).length ? (
              <ul className="grid gap-2 text-[13px]">{day.filter((t) => t.escalated).map((t) => <li key={t.id}><a className="underline-offset-4 hover:underline" href={`#/app/tasks/${t.id}`}>{t.ask}</a><span className="block text-muted">Recall was <span className="num">{Math.round(t.conf * 100)}%</span> sure, so Reason took over. Cost <span className="num">{fmt.usd(t.cost)}</span>.</span></li>)}</ul>
            ) : <p className="rounded-[4px] border border-dashed border-line p-3 text-[13px] text-muted">No fast answer escalated in the last 24 hours.</p>}
          </section>
        </div>
      </section>
    </div>
  )
}
