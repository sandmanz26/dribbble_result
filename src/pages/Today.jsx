import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UilCheck from '@iconscout/react-unicons/icons/uil-check'
import UilAngleRight from '@iconscout/react-unicons/icons/uil-angle-right'
import { useStore } from '../store.jsx'
import { STEPS, OFFERS, STAGES, BRANDS, TODAY, day, daysBetween, relDay, fmtDay, rp, rpShort, paymentsOf, cashByMonth, MONTHS } from '../data/studio.js'
import { food, Logo, Pill } from '../ui.jsx'
import { verdictOf } from '../logic.js'

const GOAL = 60000000 // monthly take-home goal the creator set with Bima
const STEP_VERB = { script: 'Script', draft: 'Draft', post: 'Goes live', insight: 'Send insight' }
// "Reel 2 of 2" when a deal asks for the same format more than once.
function nth(x) {
  const same = x.deal.deliverables.filter((d) => d.fmt === x.deliverable.fmt)
  return same.length > 1 ? ` ${same.indexOf(x.deliverable) + 1} of ${same.length}` : ''
}

export function useOpenPayments() {
  const { deals } = useStore()
  return useMemo(() => deals.flatMap(paymentsOf).filter((p) => p.state !== 'paid').sort((a, b) => day(a.due) - day(b.due)), [deals])
}

export default function Today() {
  const { s, dispatch, deals } = useStore()
  const nav = useNavigate()
  const open = useOpenPayments()
  const late = open.filter((p) => p.state === 'late')
  const firstLate = late[0]
  const steps = STEPS.filter((x) => !x.done && daysBetween(TODAY, x.due) <= 7).sort((a, b) => day(a.due) - day(b.due))
  const goingLive = steps.find((x) => x.kind === 'post' && x.due === TODAY)
  const nov = cashByMonth()[MONTHS.length - 1]
  const dueNov = open.filter((p) => p.due.startsWith('2026-11') && p.state === 'due').reduce((t, p) => t + p.net, 0)
  const lateSum = late.reduce((t, p) => t + p.net, 0)
  const next30 = open.filter((p) => p.state === 'due' && daysBetween(TODAY, p.due) <= 30).reduce((t, p) => t + p.net, 0)
  const waiting = OFFERS.filter((o) => !s.offers[o.id])
  const remind = (p) => dispatch({ type: 'remind', id: p.deal.id, date: TODAY, toast: `Reminder drafted for ${BRANDS[p.deal.brand].pic}. Bima will send it from Riuh.` })

  return (
    <>
      <div className="title-row">
        <div>
          <h1>Today</h1>
          <p className="sub">Tuesday 3 November.{firstLate && <> <b>{BRANDS[firstLate.deal.brand].name}’s final payment is {firstLate.lateBy} days late</b>,</>}{goingLive && <> and your {BRANDS[goingLive.deal.brand].name} TikTok goes live at 18:00.</>}</p>
        </div>
        <div className="actions">
          <Link to="/offers" className="btn">Check an offer</Link>
          {firstLate && <button className="btn primary" onClick={() => remind(firstLate)} disabled={!!s.reminded[firstLate.deal.id]}>{s.reminded[firstLate.deal.id] ? 'Reminder drafted' : `Chase ${BRANDS[firstLate.deal.brand].name}`}</button>}
        </div>
      </div>

      <div className="grid">
        <section className="panel span-8" aria-labelledby="next-h">
          <div className="panel-head"><h2 id="next-h">Up next</h2><Link to="/calendar" className="link">Calendar</Link></div>
          <ul className="rows">
            {steps.slice(0, 7).map((x) => {
              const done = !!s.done[x.key]
              const n = daysBetween(TODAY, x.due)
              return (
                <li key={x.key} className={`task${done ? ' done' : ''}`}>
                  <img className="thumb" src={food(x.deliverable.thumb)} alt="" width="48" height="48" />
                  <Link to={`/deals/${x.deal.id}`} className="what"><b>{STEP_VERB[x.kind]}: {x.fmt.name}{nth(x)}</b><span>{BRANDS[x.deal.brand].name} · {x.deal.title}</span></Link>
                  <span className={`when num${n < 0 && !done ? ' late' : ''}`}>{x.kind === 'post' && n === 0 ? 'Today, 18:00' : relDay(x.due)}</span>
                  <span className="check-cell"><button className={`check${done ? ' on' : ''}`} aria-pressed={done} aria-label={`${done ? 'Undo' : 'Mark done'}: ${STEP_VERB[x.kind]} for ${BRANDS[x.deal.brand].name}`} onClick={() => dispatch({ type: 'done', key: x.key, date: TODAY, toast: `${STEP_VERB[x.kind]} done for ${BRANDS[x.deal.brand].name}. Bima can see it.` })}><UilCheck size={18} /></button></span>
                </li>
              )
            })}
          </ul>
          {!steps.length && <p className="empty">Nothing due this week. New briefs land here as soon as a deal is signed.</p>}
        </section>

        <div className="span-4 stack">
        <section className="panel" aria-labelledby="month-h">
          <div className="panel-head"><h2 id="month-h">November</h2><span className="meta">take-home</span></div>
          <p className="num" style={{ fontSize: 30, lineHeight: '36px', fontWeight: 600, letterSpacing: '-0.02em' }}>{rp(nov.takeHome)}</p>
          <p className="muted" style={{ marginTop: 2 }}>so far, after PPh 23 and Riuh’s 20%</p>
          <div className="track two" style={{ marginTop: 18 }} role="img" aria-label={`${rp(nov.takeHome)} received and ${rp(dueNov)} due, against a goal of ${rp(GOAL)}`}>
            <span className="due" style={{ width: `${Math.min(100, ((nov.takeHome + dueNov) / GOAL) * 100)}%` }} />
            <span style={{ width: `${Math.max(1.5, Math.min(100, (nov.takeHome / GOAL) * 100))}%` }} />
          </div>
          <dl style={{ marginTop: 14, display: 'grid', gap: 8 }}>
            <Row k="Still due in November" v={rp(dueNov)} />
            <Row k="Late, not counted" v={rp(lateSum)} tone={lateSum ? 'neg' : ''} />
            <Row k="Goal you set with Bima" v={rp(GOAL)} />
          </dl>
          <p className="small muted" style={{ marginTop: 12 }}>The light part of the bar is money due this month. {Math.round(((nov.takeHome + dueNov) / GOAL) * 100)}% of the goal if it all lands.</p>
        </section>

        <section className="panel" aria-labelledby="st-h">
          <div className="panel-head"><h2 id="st-h">Deals by stage</h2><Link to="/deals" className="link">Board</Link></div>
          <StageBars deals={deals} />
        </section>
        </div>

        <MoneyLanding open={open} next30={next30} onOpen={(p) => nav(`/deals/${p.deal.id}`)} reminded={s.reminded} onRemind={remind} />

        <section className="panel span-7 fill" aria-labelledby="off-h">
          <div className="panel-head"><h2 id="off-h">Offers waiting <span className="muted" style={{ fontWeight: 400 }}>{waiting.length}</span></h2><Link to="/offers" className="link">All offers</Link></div>
          <ul className="rows">
            {waiting.slice(0, 4).map((o) => {
              const v = verdictOf(o, s.rates)
              return (
                <li key={o.id}>
                  <Link to={`/offers/${o.id}`} style={{ display: 'grid', gridTemplateColumns: '32px minmax(0,1fr) auto', gap: 12, alignItems: 'center', padding: '11px 0' }}>
                    <Logo name={o.brand} hue={o.hue} />
                    <span style={{ minWidth: 0 }}><b style={{ fontWeight: 600 }}>{o.brand}</b><span className="muted" style={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.budget ? rp(o.budget) : 'No budget'} · {o.channel}</span></span>
                    <Pill tone={v.tone}>{v.short}</Pill>
                  </Link>
                </li>
              )
            })}
          </ul>
          {!waiting.length && <p className="empty">Every offer has an answer. New ones from email, WhatsApp and DMs collect here.</p>}
        </section>

        <FollowUps deals={deals} />

      </div>
    </>
  )
}

function Row({ k, v, tone }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><dt className="muted">{k}</dt><dd className="num" style={{ color: tone === 'neg' ? 'var(--negative)' : undefined, fontWeight: 500 }}>{v}</dd></div>
}

export function StageBars({ deals }) {
  const rows = STAGES.map((st) => { const list = deals.filter((d) => d.stage === st.key); return { ...st, n: list.length, sum: list.reduce((t, d) => t + d.fee, 0) } })
  const max = Math.max(...rows.map((r) => r.sum))
  return (
    <ul style={{ display: 'grid', gap: 12 }}>
      {rows.map((r) => (
        <li key={r.key}>
          <Link to={`/deals?stage=${r.key}`} style={{ display: 'block' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>{r.name} <span className="muted">{r.n}</span></span><span className="num">{r.sum ? rp(r.sum) : '-'}</span></span>
            <span className="track" style={{ display: 'block', height: 6, marginTop: 6, background: 'var(--raised)' }}><span style={{ width: `${max ? (r.sum / max) * 100 : 0}%` }} /></span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

// Signature: when the money lands. Each payment sits on its due date; late ones before the today line.
function MoneyLanding({ open, next30, onOpen, onRemind, reminded }) {
  const start = '2026-10-25'; const end = '2027-01-04'
  const span = daysBetween(start, end)
  const x = (d) => (Math.max(0, Math.min(span, daysBetween(start, d))) / span) * 100
  const at = (d) => Math.min(88, x(d))
  // Greedy rows so chips never overlap: a chip takes ~12% of the width.
  const placed = []
  const rowsEnd = []
  open.forEach((p) => {
    const left = at(p.due)
    let r = rowsEnd.findIndex((e) => left > e + 1)
    if (r === -1) { r = rowsEnd.length; rowsEnd.push(-100) }
    rowsEnd[r] = left + 13
    placed.push({ p, left, r })
  })
  const weeks = []
  for (let d = day('2026-11-02'); d <= day(end); d = new Date(d.getTime() + 7 * 86400000)) weeks.push(d.toISOString().slice(0, 10))
  const [hover, setHover] = useState(null)
  const late = open.filter((p) => p.state === 'late')
  return (
    <section className="panel span-12" aria-labelledby="land-h">
      <div className="panel-head">
        <h2 id="land-h">When the money lands</h2>
        <span className="meta"><b className="num" style={{ color: 'var(--text)', fontWeight: 600 }}>{rp(next30)}</b> to you in the next 30 days</span>
      </div>
      <div className="landing" style={{ height: 32 + rowsEnd.length * 46 }}>
        {weeks.map((w) => <span key={w} className="wk" style={{ left: `${x(w)}%` }}>{x(w) < 92 && Math.abs(daysBetween(TODAY, w)) > 2 && <span className="num">{fmtDay(w)}</span>}</span>)}
        <span className="today" style={{ left: `${x(TODAY)}%` }}><span>Today</span></span>
        {placed.map(({ p, left, r }) => (
          <button key={p.deal.id + p.label} className={`chip ${p.state}`} style={{ left: `${left}%`, top: 30 + r * 46 }} onClick={() => onOpen(p)} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p)} onBlur={() => setHover(null)}
            aria-label={`${BRANDS[p.deal.brand].name}, ${p.label}, ${rp(p.net)} to you, due ${fmtDay(p.due)}${p.state === 'late' ? `, ${p.lateBy} days late` : ''}`}>
            <Logo brand={p.deal.brand} size={22} /><span className="num">{rpShort(p.net)}</span>
          </button>
        ))}
      </div>
      <p className="small muted landing-note" aria-live="polite">
        {hover ? <>{BRANDS[hover.deal.brand].name}, {hover.label.toLowerCase()} · due {fmtDay(hover.due)} · brand pays {rp(hover.gross)}, {rp(hover.tax)} PPh 23 and {rp(hover.cut)} to Riuh, <b style={{ color: 'var(--text)' }}>{rp(hover.net)} to you</b></>
          : <>Amounts are what reaches you after PPh 23 (2%) and Riuh’s 20%. Point at a payment to see the whole trail.</>}
      </p>
      <ul className="rows landing-list">
        {open.slice(0, 6).map((p) => (
          <li key={p.deal.id + p.label}><Link to={`/deals/${p.deal.id}`} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr) auto', gap: 12, alignItems: 'center', padding: '10px 0' }}>
            <Logo brand={p.deal.brand} size={28} />
            <span style={{ minWidth: 0 }}><b style={{ fontWeight: 600 }}>{BRANDS[p.deal.brand].name}</b><span className="muted" style={{ display: 'block', fontSize: 13, color: p.state === 'late' ? 'var(--negative)' : undefined }}>{p.label} · {p.state === 'late' ? `${p.lateBy} days late` : relDay(p.due)}</span></span>
            <b className="num" style={{ fontWeight: 600 }}>{rp(p.net)}</b>
          </Link></li>
        ))}
      </ul>
      {late.map((p) => (
        <div key={p.deal.id} className="err" style={{ marginTop: 12 }}>
          <span><b>{BRANDS[p.deal.brand].name}</b> owes the final {rp(p.gross)} since {fmtDay(p.due)}, {p.lateBy} days. Insight was sent on 20 Oct.</span>
          <button className="btn sm" onClick={() => onRemind(p)} disabled={!!reminded[p.deal.id]}>{reminded[p.deal.id] ? 'Reminder drafted' : 'Draft a reminder'}</button>
          <Link to={`/deals/${p.deal.id}`} className="btn sm ghost" aria-label="Open the deal"><UilAngleRight size={18} /></Link>
        </div>
      ))}
    </section>
  )
}

function FollowUps({ deals }) {
  const rows = Object.entries(BRANDS).map(([key, b]) => {
    const late = deals.filter((d) => d.brand === key).flatMap(paymentsOf).some((p) => p.state === 'late')
    return { key, b, late, quiet: daysBetween(b.lastContact, TODAY) }
  }).filter((r) => r.b.next !== '-').sort((a, z) => Number(z.late) - Number(a.late) || z.quiet - a.quiet).slice(0, 4)
  return (
    <section className="panel span-5 fill" aria-labelledby="fu-h">
      <div className="panel-head"><h2 id="fu-h">Brands to follow up</h2><Link to="/brands" className="link">Brands</Link></div>
      <ul className="rows">
        {rows.map(({ key, b, late, quiet }) => (
          <li key={key}><Link to={`/brands?b=${key}`} style={{ display: 'grid', gridTemplateColumns: '32px minmax(0,1fr) auto', gap: 12, alignItems: 'center', padding: '11px 0' }}>
            <Logo brand={key} />
            <span style={{ minWidth: 0 }}><b style={{ fontWeight: 600 }}>{b.name}</b><span className="muted" style={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: late ? 'var(--negative)' : undefined }}>{b.next}</span></span>
            <span className="small muted num" style={{ whiteSpace: 'nowrap' }}>{quiet === 0 ? 'Today' : `${quiet} d quiet`}</span>
          </Link></li>
        ))}
      </ul>
    </section>
  )
}
