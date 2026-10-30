import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PATHS, PATH_ORDER, PEOPLE, fmt } from '../data/myelin.js'
import { cn } from '../lib/utils.js'

// Each path has a mark of its own, so it reads apart without colour: a tick, a dot, a solid block.
export function PathMark({ path, size = 10 }) {
  const c = PATHS[path].color
  if (path === 'reflex') return <span aria-hidden="true" className="inline-block shrink-0" style={{ width: 2, height: size, background: c }} />
  if (path === 'recall') return <span aria-hidden="true" className="inline-block shrink-0 rounded-full" style={{ width: size * 0.7, height: size * 0.7, background: c }} />
  return <span aria-hidden="true" className="inline-block shrink-0" style={{ width: size, height: size, background: c }} />
}

// The line every answer carries: which path, how long, what it cost, what it saved against reasoning everything.
export function PathChip({ t, className }) {
  const saved = t.base > 0 ? 1 - t.cost / t.base : 0
  return (
    <span className={cn('inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-muted', className)}>
      <span className="inline-flex items-center gap-1.5 font-semibold text-ink"><PathMark path={t.path} />{t.escalated ? `Recall, then ${PATHS[t.path].name}` : PATHS[t.path].name}</span>
      <span className="num">{fmt.time(t.time)}</span>
      <span className="num">{fmt.usd(t.cost)}</span>
      <span className="num">{saved > 0.995 ? `saved ${(Math.floor(saved * 1000) / 10).toFixed(1)}%` : saved > 0.005 ? `saved ${fmt.pct(saved)}` : 'full price'}</span>
    </span>
  )
}

export function Avatar({ who, size = 24 }) {
  const p = PEOPLE[who]
  const initials = p.name.split(' ').map((x) => x[0]).join('')
  return <span aria-hidden="true" className="inline-grid shrink-0 place-items-center rounded-full font-semibold" style={{ width: size, height: size, fontSize: size * 0.4, background: `hsl(${p.hue} 30% 22%)`, color: `hsl(${p.hue} 60% 78%)` }}>{initials}</span>
}

// The signature: a polygraph strip. Three lanes, one mark per task, the hours ruled behind it like chart paper.
export function Trace({ tasks, from, to, height = 132, labels = true, compact = false, linkTo }) {
  const [hover, setHover] = useState(null)
  const W = 1000; const lane = height / 3
  const x = (d) => ((d - from) / (to - from)) * W
  const hours = []
  for (let h = new Date(from); h <= to; h = new Date(h.getTime() + 3600 * 1000)) { const hh = new Date(h); hh.setMinutes(0, 0, 0); if (hh >= from) hours.push(hh) }
  const counts = Object.fromEntries(PATH_ORDER.map((p) => [p, tasks.filter((t) => t.path === p).length]))
  const h = hover && tasks.find((t) => t.id === hover)
  return (
    <div className="relative">
      <div className={cn('grid gap-3', labels ? 'grid-cols-[72px_1fr_44px]' : 'grid-cols-1')}>
        {labels && (
          <div className="grid" style={{ gridTemplateRows: `repeat(3, ${lane}px)` }}>
            {PATH_ORDER.map((p) => <span key={p} className="flex items-center gap-2 text-[12.5px] text-muted"><PathMark path={p} />{PATHS[p].name}</span>)}
          </div>
        )}
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="trace block w-full" style={{ height }} role="img"
          aria-label={`Activity trace: ${counts.reflex} on Reflex, ${counts.recall} on Recall, ${counts.reason} on Reason`}>
          {hours.map((hh, i) => <line key={i} x1={x(hh)} x2={x(hh)} y1="0" y2={height} stroke="rgba(243,242,238,.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          {[1, 2].map((i) => <line key={i} x1="0" x2={W} y1={lane * i} y2={lane * i} stroke="rgba(243,242,238,.07)" vectorEffect="non-scaling-stroke" />)}
          {tasks.map((t) => {
            const row = PATH_ORDER.indexOf(t.path); const cy = lane * row + lane / 2
            const w = t.path === 'reason' ? Math.max(3, (t.time / 60) * 10) : 2
            const hgt = t.path === 'reflex' ? lane * 0.4 : t.path === 'recall' ? lane * 0.6 : lane * 0.8
            const mark = <rect x={x(t.at) - w / 2} y={cy - hgt / 2} width={w} height={hgt} fill={PATHS[t.path].color} className={cn('trace-mark', hover === t.id && 'is-on')}
              onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)} />
            return t.ask && linkTo ? <Link key={t.id} to={linkTo(t)} aria-label={t.ask}>{mark}</Link> : <g key={t.id}>{mark}</g>
          })}
          <line x1={W} x2={W} y1="0" y2={height} stroke="var(--amber)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        {labels && (
          <div className="grid text-right" style={{ gridTemplateRows: `repeat(3, ${lane}px)` }}>
            {PATH_ORDER.map((p) => <span key={p} className="num flex items-center justify-end text-[13px]">{counts[p]}</span>)}
          </div>
        )}
      </div>
      {!compact && (
        <div className={cn('mt-2 flex justify-between text-[11.5px] text-faint num', labels && 'ml-[84px] mr-[56px]')}>
          {hours.filter((_, i) => i % 3 === 0).map((hh, i) => <span key={hh.toISOString()} className={i % 2 ? 'max-sm:hidden' : ''}>{fmt.clock(hh)}</span>)}
          <span className="text-amber">now</span>
        </div>
      )}
      {h && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 max-w-[320px] rounded-[4px] border border-line bg-raised px-3 py-2 text-xs shadow-[0_8px_20px_rgba(0,0,0,.4)]">
          <p className="font-semibold">{h.ask || `${h.type}, ${PEOPLE[h.who].name.split(' ')[0]}`}</p>
          <p className="mt-0.5 text-muted"><span className="num">{fmt.clock(h.at)}</span> · <PathChip t={h} /></p>
        </div>
      )}
    </div>
  )
}

// KPIs are type, not tiles: a grey label over a monospace value, a plain caption under it.
export function Kpi({ label, value, note, className }) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-[12.5px] text-muted">{label}</p>
      <p className="num mt-1 text-[26px] leading-tight">{value}</p>
      {note && <p className="mt-1 text-[12.5px] text-muted">{note}</p>}
    </div>
  )
}

export function Section({ title, sub, children, className, right, id }) {
  return (
    <section className={cn('min-w-0', className)} aria-labelledby={id}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div><h2 id={id} className="text-[18px] font-normal text-muted">{title}</h2>{sub && <p className="mt-0.5 text-[13px] text-faint">{sub}</p>}</div>
        {right}
      </div>
      {children}
    </section>
  )
}
