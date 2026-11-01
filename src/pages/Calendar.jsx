import { useState } from 'react'
import { Link } from 'react-router-dom'
import UilAngleLeft from '@iconscout/react-unicons/icons/uil-angle-left'
import UilAngleRight from '@iconscout/react-unicons/icons/uil-angle-right'
import { useStore } from '../store.jsx'
import { STEPS, EXCLUSIVE, BRANDS, TODAY, day, daysBetween, fmtDay, rp, paymentsOf } from '../data/studio.js'
import { food, Logo } from '../ui.jsx'

const KINDS = {
  post: { name: 'Goes live', mark: 'post' },
  draft: { name: 'Draft or script due', mark: 'draft' },
  insight: { name: 'Insight due', mark: 'insight' },
  pay: { name: 'Payment due', mark: 'pay' },
}
const MONTHS = [['2026-11', 'November 2026'], ['2026-12', 'December 2026']]
const iso = (d) => { const x = new Date(d.getTime() + 7 * 3600000); return x.toISOString().slice(0, 10) }

export default function Calendar() {
  const { s, deals } = useStore()
  const [m, setM] = useState(0)
  const [layers, setLayers] = useState({ post: true, draft: true, insight: true, pay: true })
  const [sel, setSel] = useState(TODAY)
  const [ym, title] = MONTHS[m]
  const first = day(`${ym}-01`)
  const start = new Date(first.getTime() - ((first.getDay() + 6) % 7) * 86400000)
  const cells = Array.from({ length: 42 }, (_, i) => iso(new Date(start.getTime() + i * 86400000)))
  const weeks = cells[35].slice(0, 7) === ym ? 6 : 5
  const events = [
    ...STEPS.filter((x) => !x.done && !s.done[x.key]).map((x) => ({ date: x.due, kind: x.kind === 'post' ? 'post' : x.kind === 'insight' ? 'insight' : 'draft', label: `${x.name}: ${BRANDS[x.deal.brand].name}`, sub: x.fmt.name, deal: x.deal, thumb: x.deliverable.thumb })),
    ...deals.flatMap(paymentsOf).filter((p) => p.state !== 'paid').map((p) => ({ date: p.due, kind: 'pay', label: `${BRANDS[p.deal.brand].name} pays`, sub: `${p.label}, ${rp(p.net)} to you`, deal: p.deal, late: p.state === 'late' })),
  ].filter((e) => layers[e.kind])
  const on = (d) => events.filter((e) => e.date === d)
  const selEvents = on(sel)
  const monthDays = cells.slice(0, weeks * 7).filter((c) => c.startsWith(ym))
  const blocked = EXCLUSIVE.filter((x) => daysBetween(sel, x.until) >= 0 && daysBetween(x.from, sel) >= 0)
  return (
    <>
      <div className="title-row">
        <div>
          <h1>Calendar</h1>
          <p className="sub">What goes live, what is due, and the categories you cannot promote while an exclusivity runs.</p>
        </div>
        <div className="actions">
          <button className="btn ghost sm" onClick={() => setM(0)} disabled={m === 0} aria-label="Previous month"><UilAngleLeft size={18} /></button>
          <b style={{ minWidth: 130, textAlign: 'center' }}>{title}</b>
          <button className="btn ghost sm" onClick={() => setM(1)} disabled={m === 1} aria-label="Next month"><UilAngleRight size={18} /></button>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 24 }} aria-labelledby="ex-h">
        <div className="panel-head"><h2 id="ex-h">Exclusivity</h2><span className="meta">You cannot post for another brand in these categories</span></div>
        <div className="lanes">
          <div className="lane-axis">{monthDays.map((d) => <span key={d} className={`${d === TODAY ? 'is-today' : ''}${[0, 6].includes(day(d).getDay()) ? ' wknd' : ''}`}>{Number(d.slice(8))}</span>)}</div>
          {EXCLUSIVE.map((x) => {
            const a = Math.max(0, daysBetween(monthDays[0], x.from)); const z = Math.min(monthDays.length - 1, daysBetween(monthDays[0], x.until))
            return (
              <div key={x.deal.id} className="lane">
                <Link to={`/deals/${x.deal.id}`} className="lane-name"><Logo brand={x.deal.brand} size={24} /><span><b>{x.category}</b><span>{BRANDS[x.deal.brand].name}</span></span></Link>
                <div className="lane-track" style={{ gridTemplateColumns: `repeat(${monthDays.length}, 1fr)` }}>
                  {z >= 0 && a <= monthDays.length - 1 && <span className="lane-bar" style={{ gridColumn: `${a + 1} / ${z + 2}` }}>{z - a > 6 ? `Until ${fmtDay(x.until)}` : ''}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid">
        <section className="panel span-8 cal-panel" aria-labelledby="mo-h">
          <div className="panel-head">
            <h2 id="mo-h">{title}</h2>
            <div className="layers" role="group" aria-label="Show on the calendar">
              {Object.entries(KINDS).map(([k, v]) => <button key={k} aria-pressed={layers[k]} onClick={() => setLayers({ ...layers, [k]: !layers[k] })}><i className={`mk mk-${v.mark}`} />{v.name}</button>)}
            </div>
          </div>
          <div className="cal" aria-label={title}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => <span key={w} className="cal-w" aria-hidden="true">{w}</span>)}
            {cells.slice(0, weeks * 7).map((d) => {
              const ev = on(d); const out = !d.startsWith(ym)
              return (
                <button key={d} className={`cal-d${out ? ' out' : ''}${d === TODAY ? ' today' : ''}${d === sel ? ' sel' : ''}`} onClick={() => setSel(d)} aria-label={`${fmtDay(d)}, ${ev.length} ${ev.length === 1 ? 'item' : 'items'}`}>
                  <span className="n num">{Number(d.slice(8))}</span>
                  <span className="evs">
                    {ev.slice(0, 3).map((e, i) => <span key={i} className={`ev${e.late ? ' late' : ''}`} title={`${KINDS[e.kind].name}: ${e.label}`}><i className={`mk mk-${e.kind}`} /><span>{BRANDS[e.deal.brand].name}</span></span>)}
                    {ev.length > 3 && <span className="ev more">+{ev.length - 3} more</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="panel span-4" aria-labelledby="day-h">
          <div className="panel-head"><h2 id="day-h">{sel === TODAY ? 'Today' : fmtDay(sel)}</h2><span className="meta">{selEvents.length} {selEvents.length === 1 ? 'item' : 'items'}</span></div>
          {selEvents.length ? (
            <ul className="rows">
              {selEvents.map((e, i) => (
                <li key={i}><Link to={`/deals/${e.deal.id}`} className="agenda">
                  {e.thumb ? <img className="thumb" src={food(e.thumb)} alt="" width="44" height="44" /> : <Logo brand={e.deal.brand} size={44} />}
                  <span><b>{e.label}</b><span className={e.late ? 'late' : ''}>{e.sub}{e.late ? ', late' : ''}</span></span>
                </Link></li>
              ))}
            </ul>
          ) : <p className="empty">Nothing on this day. A good day to film ahead.</p>}
          {blocked.length > 0 && <p className="small muted" style={{ marginTop: 14 }}>Blocked on this day: {blocked.map((x) => `${x.category.toLowerCase()} (${BRANDS[x.deal.brand].name})`).join(', ')}.</p>}
          <h3 className="h3" style={{ marginTop: 22 }}>The next seven days</h3>
          <ul className="week">
            {Array.from({ length: 7 }, (_, i) => iso(new Date(day(sel).getTime() + (i + 1) * 86400000))).map((d) => {
              const ev = on(d)
              return <li key={d}><button onClick={() => setSel(d)}><span className="num">{fmtDay(d)}</span><span className="marks">{ev.length ? ev.slice(0, 5).map((e, i) => <i key={i} className={`mk mk-${e.kind}`} />) : <span className="muted">Free</span>}</span><span className="num muted">{ev.length || ''}</span></button></li>
            })}
          </ul>
        </section>
      </div>
    </>
  )
}
