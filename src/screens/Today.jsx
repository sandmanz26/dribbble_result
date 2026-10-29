import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { useOpen } from '../App.jsx'
import { STORES, YESTERDAY, MTD, OCTOBER, SELL_THROUGH, COVER_WEEKS, TODAY_SO_FAR, APPOINTMENTS, ROSTER, PRODUCTS, CLIENTS, PEOPLE, idr, pct, signPct, clientOf, productOf, storeOf } from '../data/world.js'
import { BRIEF, DECISIONS, KIRANA_DAYS } from '../data/ai.js'
import { AiTag, Avatar, ClientAvatar, Delta, Photo, Pill } from '../ui/kit.jsx'
import { MonthLine, Bullet } from '../ui/charts.jsx'
import { AskBox } from './Ask.jsx'
import * as I from '../ui/icons.js'

export default function Today() {
  const { role } = useStore()
  if (role.id === 'manager') return <ManagerToday />
  if (role.id === 'advisor') return <AdvisorToday />
  return <OwnerToday />
}

const fmtAxis = (v, long) => (long ? idr(v) : v >= 1e9 ? `${(v / 1e9).toFixed(0)}B` : '0')

function OwnerToday() {
  const open = useOpen()
  const nav = useNavigate()
  const value = open.reduce((t, d) => t + d.value, 0)
  const mtdGap = MTD.sales / MTD.plan - 1
  return (
    <div className="page">
      <header className="title-row">
        <div>
          <h1>Today across the group</h1>
          <p>Thursday 29 October, 10:40. Boutiques opened at 10:00 and have sold {idr(TODAY_SO_FAR.sales)} in {TODAY_SO_FAR.transactions} sales so far.</p>
        </div>
        <div className="title-actions"><span className="stamp">Books closed 28 Oct, 23:10</span></div>
      </header>

      <AskBox context="owner" placeholder="Ask about the business, for example why a boutique is under plan" />

      <div className="grid">
        <section className="card ai s7 brief" aria-labelledby="h-brief">
          <div className="card-head"><h2 id="h-brief">Morning brief</h2><AiTag when={BRIEF.written} sources={['Sales and plan by boutique, 28 Oct', 'Footfall and conversion', 'Roster and sick leave', 'Stock on hand, 29 Oct 07:00', 'October plan by day']} /></div>
          <ol className="brief-lines">
            {BRIEF.lines.map((l, i) => <BriefLine key={i} l={l} />)}
          </ol>
          <div className="brief-foot">
            <p>{open.length ? <><b>{open.length} decisions need you</b>, together {idr(value)} of stock and orders.</> : <>Nothing is waiting for you. Every proposal has an answer.</>}</p>
            {open.length > 0 && <button className="btn is-primary" onClick={() => nav(`/decisions/${open[0].id}`)}>Review decisions</button>}
          </div>
        </section>

        <section className="card is-flush s5 wait-card" aria-labelledby="h-wait">
          <div className="card-head"><h2 id="h-wait">Waiting for you</h2><Link className="meta" to="/decisions">All decisions</Link></div>
          {open.length ? (
            <ul className="rows">
              {open.map((d) => (
                <li key={d.id}>
                  <Link to={`/decisions/${d.id}`} className="row-link">
                    {d.product ? <Photo id={d.product} size="sm" /> : <span className="ph is-sm ph-icon"><I.Person /></span>}
                    <span className="cell-2"><span className="clamp2">{d.title}</span><small>{d.id} · {kindName[d.kind]}</small></span>
                    <span className="num">{idr(d.value)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="empty-line">No decisions waiting. New proposals arrive at 07:00 and when stock moves.</p>}
          <p className="wait-foot"><span>This week Selvedge also acted on its own 3 times, inside your limits.</span><Link className="link" to="/autopilot">Activity log</Link></p>
        </section>

        <section className="s12 kpis" aria-label="The group in figures">
          <div className="kpi is-lead"><p className="kpi-l">Sales yesterday</p><p className="kpi-v">{idr(YESTERDAY.sales)}</p><p className="kpi-s"><Delta value={YESTERDAY.sales / YESTERDAY.plan - 1} /> against plan of {idr(YESTERDAY.plan)}</p></div>
          <div className="kpi"><p className="kpi-l">October to date</p><p className="kpi-v">{idr(MTD.sales)}</p><p className="kpi-s"><Delta value={mtdGap} /> against plan to date</p></div>
          <div className="kpi"><p className="kpi-l">Full-price sell-through, season</p><p className="kpi-v">{pct(SELL_THROUGH.actual)}</p><Bullet value={SELL_THROUGH.actual} target={SELL_THROUGH.plan} label={`${pct(SELL_THROUGH.actual)} against a plan of ${pct(SELL_THROUGH.plan)}`} /><p className="kpi-s">Plan {pct(SELL_THROUGH.plan, 0)} by 31 Jan</p></div>
          <div className="kpi"><p className="kpi-l">Stock cover</p><p className="kpi-v">{COVER_WEEKS}<span className="unit"> weeks</span></p><p className="kpi-s">At the last 4 weeks’ rate of sale</p></div>
        </section>

        <section className="card s7" aria-labelledby="h-month">
          <div className="card-head"><h2 id="h-month">October, running total against plan</h2><span className="meta">IDR, group</span></div>
          <MonthLine days={OCTOBER} fmt={fmtAxis} endLabel={`Lands near ${idr(MTD.landing)}`} />
          <p className="chart-note"><span className="ai-tag"><I.Spark />Forecast</span> by Selvedge for 29 to 31 October from the same weekdays this season. Saturday moves it most.</p>
        </section>

        <section className="card is-flush s5" aria-labelledby="h-stores">
          <div className="card-head"><h2 id="h-stores">Boutiques yesterday</h2><span className="meta">Against plan</span></div>
          <table className="tbl">
            <thead><tr><th>Boutique</th><th className="num">Sales</th><th className="num">Plan</th><th className="num">Conversion</th></tr></thead>
            <tbody>
              {STORES.map((st) => (
                <tr key={st.id}>
                  <td><span className="cell-2">{st.name}<small>{st.city} · {PEOPLE[st.manager].short}</small></span></td>
                  <td className="num">{(st.sales / 1e6).toFixed(0)}M</td>
                  <td className="num"><Delta value={st.sales / st.plan - 1} d={0} /></td>
                  <td className="num">{Math.round(st.conv * 100)}%{st.conv < st.usual - 0.03 && <span className="flag" title={`Usual ${Math.round(st.usual * 100)}%`}> <I.Warning /></span>}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td>Group</td><td className="num">{(YESTERDAY.sales / 1e6).toFixed(0)}M</td><td className="num"><Delta value={YESTERDAY.sales / YESTERDAY.plan - 1} d={0} /></td><td /></tr></tfoot>
          </table>
        </section>
      </div>
    </div>
  )
}
// One line of the brief. Its evidence opens in place: the rows the sentence was written from.
function BriefLine({ l }) {
  const [open, setOpen] = useState(false)
  const ev = l.source === 'stores' ? 'stores' : l.source === 'month' ? 'month' : null
  return (
    <li>
      <span className="bl-text">{l.text}
        {ev && <button className="ev-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide figures' : 'Show figures'}</button>}
        {open && ev === 'stores' && (
          <span className="ev">
            {STORES.map((st) => <span key={st.id} className="ev-row"><span>{st.name}</span><span className="num">{(st.sales / 1e6).toFixed(0)}M of {(st.plan / 1e6).toFixed(0)}M</span></span>)}
            <span className="ev-row is-total"><span>Group</span><span className="num">{(YESTERDAY.sales / 1e6).toFixed(0)}M of {(YESTERDAY.plan / 1e6).toFixed(0)}M</span></span>
          </span>
        )}
        {open && ev === 'month' && (
          <span className="ev">
            <span className="ev-row"><span>Sold, 1 to 28 Oct</span><span className="num">{idr(MTD.sales)}</span></span>
            <span className="ev-row"><span>Forecast, 29 to 31 Oct</span><span className="num">{idr(MTD.landing - MTD.sales)}</span></span>
            <span className="ev-row is-total"><span>Lands near</span><span className="num">{idr(MTD.landing)}</span></span>
            <span className="ev-row"><span>Plan for October</span><span className="num">{idr(MTD.monthPlan)}</span></span>
          </span>
        )}
      </span>
      {l.source.startsWith('D-') && <Link className="src-link" to={`/decisions/${l.source}`}>{l.source}</Link>}
    </li>
  )
}

export const kindName = { transfer: 'Transfer', allocation: 'Allocation', reorder: 'Reorder', staffing: 'Staffing', markdown: 'Markdown request' }

function ManagerToday() {
  const { s } = useStore()
  const nav = useNavigate()
  const psn = storeOf('psn')
  const decided = (id) => s.decided[id]?.status
  const watch = ['kirana-top-handle', 'tirta-pump-nero', 'laras-mini', 'arunika-structured', 'aruna-boot'].map((id) => ({ p: productOf(id) }))
  const matters = [
    { icon: I.Person, title: 'Anindya Paramitha at 11:00, private viewing', body: 'Platinum, on the Arunika waitlist since 3 Aug. Two arrive Monday; who is offered them is still open.', act: decided('D-119') ? null : { label: 'Help decide', to: '/decisions/D-119' }, link: { label: 'Briefing', to: '/clients/anindya' } },
    { icon: I.Transfer, title: `Kirana top-handle in rosso: about ${KIRANA_DAYS} days left`, body: decided('D-118') === 'approved' ? 'Ratna approved the transfer of 2 from Pacific Place. They arrive Friday 14:00.' : '2 can come from Pacific Place, waiting for Ratna. Approved before 12:00, they arrive Friday 14:00.', link: { label: 'D-118', to: '/decisions/D-118' } },
    { icon: I.Clock, title: 'Wulan Sasmita’s hold ends at 17:00', body: 'Laras mini crossbody. Sekar has a message drafted; it has not been sent.', link: { label: 'Wulan', to: '/clients/wulan' } },
    { icon: I.Stock, title: 'Tirta pump in nero: sizes 37 and 38 sold out here', body: '2 pairs of 37 at Pondok Indah. A reorder of 18 pairs is with Ratna.', link: { label: 'Product', to: '/stock/tirta-pump-nero' } },
    { icon: I.Learn, title: 'Sekar’s first solo client at 16:30', body: 'Ayu Wardhani collects her altered coat. The coach is on for Sekar.', link: { label: 'Ayu', to: '/clients/ayu' } },
  ]
  return (
    <div className="page">
      <header className="title-row">
        <div>
          <h1>Plaza Senayan today</h1>
          <p>Thursday 29 October, 10:40. Open since 10:00: {idr(TODAY_SO_FAR.psn.sales)} in {TODAY_SO_FAR.psn.transactions} sale. {psn.floor} on the floor, {psn.appts} appointments.</p>
        </div>
        <div className="title-actions"><button className="btn is-primary" onClick={() => nav('/selling')}><I.Selling /> New sale</button></div>
      </header>
      <AskBox context="manager" placeholder="Ask about Plaza Senayan, stock or a client" />
      <div className="grid">
        <section className="card ai s7" aria-labelledby="h-matters">
          <div className="card-head"><h2 id="h-matters">What matters today</h2><AiTag text="Ranked by Selvedge" when="10:35" sources={['Appointments', 'Stock on hand', 'Holds', 'Decisions waiting', 'Roster']} /></div>
          <ol className="matters">
            {matters.map((m, i) => (
              <li key={i}>
                <span className="rank num">{i + 1}</span>
                <span className="cell-2"><b>{m.title}</b><small>{m.body}</small></span>
                <span className="row-acts">{m.act && <Link className="btn is-sm is-primary" to={m.act.to}>{m.act.label}</Link>}<Link className="btn is-sm" to={m.link.to}>{m.link.label}</Link></span>
              </li>
            ))}
          </ol>
        </section>
        <section className="card is-flush s5" aria-labelledby="h-appts">
          <div className="card-head"><h2 id="h-appts">Appointments</h2><span className="meta">{APPOINTMENTS.length} today</span></div>
          <ul className="rows">
            {APPOINTMENTS.map((a) => {
              const c = clientOf(a.client)
              return (
                <li key={a.time}>
                  <Link to={`/clients/${a.client}`} className="row-link">
                    <span className="time num">{a.time}</span>
                    <span className="cell-2"><span>{c.name} <Pill>{c.tier}</Pill></span><small>{a.what} · {PEOPLE[a.with].short}{a.also ? ` with ${PEOPLE[a.also].short}` : ''}</small></span>
                    <Avatar id={a.with} size="sm" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="s12 kpis" aria-label="Plaza Senayan in figures">
          <div className="kpi is-lead"><p className="kpi-l">Sales yesterday</p><p className="kpi-v">{idr(psn.sales)}</p><p className="kpi-s"><Delta value={psn.sales / psn.plan - 1} /> against plan of {idr(psn.plan)}</p></div>
          <div className="kpi"><p className="kpi-l">Conversion yesterday</p><p className="kpi-v">{Math.round(psn.conv * 100)}%</p><p className="kpi-s">Usual {Math.round(psn.usual * 100)}% on a Wednesday</p></div>
          <div className="kpi"><p className="kpi-l">Group rank yesterday</p><p className="kpi-v">1<span className="unit"> of 6</span></p><p className="kpi-s">By sales against plan</p></div>
          <div className="kpi"><p className="kpi-l">Holds open</p><p className="kpi-v">{1 + s.holds.length}</p><p className="kpi-s">1 ends today at 17:00</p></div>
        </section>
        <section className="card is-flush s7" aria-labelledby="h-watch">
          <div className="card-head"><h2 id="h-watch">Stock to watch here</h2><Link className="meta" to="/stock">All stock</Link></div>
          <table className="tbl">
            <thead><tr><th>Piece</th><th className="num">Here</th><th className="num">Group</th><th>Note</th></tr></thead>
            <tbody>
              {watch.map(({ p }) => (
                <tr key={p.id} className="is-link" onClick={() => nav(`/stock/${p.id}`)}>
                  <td><span className="with-ph"><Photo id={p.id} size="sm" /><span className="cell-2">{p.name}<small>{p.variant}</small></span></span></td>
                  <td className="num">{p.stock[0]}</td>
                  <td className="num">{p.stock.reduce((t, n) => t + n, 0)}</td>
                  <td className="note-cell">{p.id === 'kirana-top-handle' ? `About ${KIRANA_DAYS} days left` : p.broken ? 'Sizes 37, 38 out' : p.inbound ? `${p.inbound} arriving Monday, ${p.waitlist} waiting` : p.id === 'laras-mini' ? '1 on hold for Wulan' : 'Size 37 asked for twice'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card is-flush s5" aria-labelledby="h-team">
          <div className="card-head"><h2 id="h-team">On the floor</h2><span className="meta">{ROSTER.length} today</span></div>
          <ul className="rows">
            {ROSTER.map((r) => (
              <li key={r.who} className="row-static">
                <Avatar id={r.who} size="sm" />
                <span className="cell-2">{PEOPLE[r.who].name}<small>{PEOPLE[r.who].role}{r.note ? ` · ${r.note}` : ''}</small></span>
                <span className="num muted">{r.from} to {r.to}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function AdvisorToday() {
  const { s, dispatch } = useStore()
  const nav = useNavigate()
  const anindya = clientOf('anindya')
  const lessons = [
    { id: 'hold-intro', title: 'Place a hold for a client', done: true },
    { id: 'find', title: 'Find a size in another boutique', done: true },
    { id: 'sell', title: 'Sell to a client and attach the sale', done: s.sales.length > 0 },
    { id: 'hold', title: 'Hold a piece that is in another boutique', guide: 'hold', done: s.learned.includes('hold') },
    { id: 'alteration', title: 'Hand over an alteration', done: false },
    { id: 'appointment', title: 'Book an appointment', done: false },
  ]
  const done = lessons.filter((l) => l.done).length
  return (
    <div className="page">
      <header className="title-row">
        <div>
          <h1>Your day, Sekar</h1>
          <p>Day 4 at Plaza Senayan. You shadow Melati at 11:00 and see Ayu Wardhani on your own at 16:30. Two follow-ups are drafted for you.</p>
        </div>
      </header>
      <AskBox context="advisor" placeholder="Ask how to do anything, for example how to hold a bag" />
      <div className="grid">
        <section className="card ai s7" aria-labelledby="h-next">
          <div className="card-head"><h2 id="h-next">Next: Anindya Paramitha at 11:00</h2><AiTag text="Briefing by Selvedge" sources={['Client profile', 'Purchases since 2019', 'Waitlist', 'Melati’s notes']} /></div>
          <div className="client-brief">
            <ClientAvatar client={anindya} size="lg" />
            <div>
              <p className="lead-line">Platinum since 2019, Melati’s client. You are shadowing; Melati leads.</p>
              <ul className="facts">
                <li><b>Likes</b>{anindya.likes}</li>
                <li><b>Sizes</b>{anindya.sizes}</li>
                <li><b>Waiting for</b>Arunika structured in slate, since {anindya.waitlist.since}. Do not promise one: allocation is decided by Ratna.</li>
                <li><b>Good to know</b>{anindya.note}</li>
              </ul>
            </div>
          </div>
          <div className="owns"><span className="muted">She owns</span>{anindya.owns.map((id) => <Link key={id} to={`/stock/${id}`} title={productOf(id).name}><Photo id={id} size="sm" alt={productOf(id).name} /></Link>)}</div>
        </section>
        <section className="card is-flush s5" aria-labelledby="h-follow">
          <div className="card-head"><h2 id="h-follow">Follow-ups</h2><span className="meta">Drafted, not sent</span></div>
          <ul className="rows">
            <li><Link className="row-link" to="/clients/wulan"><ClientAvatar client={clientOf('wulan')} size="sm" /><span className="cell-2">Wulan Sasmita<small>Hold on the Laras mini ends today 17:00</small></span><Pill tone="warn">Today</Pill></Link></li>
            <li><Link className="row-link" to="/clients/nadia"><ClientAvatar client={clientOf('nadia')} size="sm" /><span className="cell-2">Nadia Prameswari<small>Thank-you note, two weeks after her first purchase</small></span><Pill>This week</Pill></Link></li>
            <li><Link className="row-link" to="/clients/ayu"><ClientAvatar client={clientOf('ayu')} size="sm" /><span className="cell-2">Ayu Wardhani<small>Coat ready; she collects at 16:30</small></span><Pill tone="pos">Confirmed</Pill></Link></li>
          </ul>
        </section>
        <section className="card s7" aria-labelledby="h-learn">
          <div className="card-head"><h2 id="h-learn">Learn as you go</h2><span className="meta num">{done} of {lessons.length} done</span></div>
          <div className="progress" role="img" aria-label={`${done} of ${lessons.length} lessons done`}><i style={{ width: `${(done / lessons.length) * 100}%` }} /></div>
          <ul className="lessons">
            {lessons.map((l) => (
              <li key={l.id} className={l.done ? 'is-done' : ''}>
                <span className="check-dot">{l.done && <I.Check />}</span>
                <span>{l.title}</span>
                {!l.done && (l.guide ? <button className="btn is-sm" onClick={() => { dispatch({ type: 'guide', guide: { id: l.guide, step: 0 } }); nav('/stock/laras-mini') }}><I.Eye /> Show me</button> : l.id === 'sell' ? <Link className="btn is-sm" to="/selling">Try it</Link> : <span className="muted small">After your 16:30</span>)}
              </li>
            ))}
          </ul>
        </section>
        <section className="card s5" aria-labelledby="h-help">
          <div className="card-head"><h2 id="h-help">Help, right where you are</h2></div>
          <p className="muted">Ask in your own words from any screen with Ctrl J, or the Ask button. Selvedge answers from the store handbook and the live data, and can show you on the screen.</p>
          <ul className="help-list">
            <li><I.Tip /> Holds last 48 hours, or 24 more with an appointment.</li>
            <li><I.Tip /> You can see stock in every boutique, but only Dimas can approve a transfer.</li>
            <li><I.Tip /> Selvedge drafts messages; you always send them yourself.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
export { CLIENTS }
