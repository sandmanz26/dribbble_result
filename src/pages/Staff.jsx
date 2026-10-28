import { useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Chat, Dashboard, Identification, Money, Search, UserMultiple, Warning } from '@carbon/icons-react'
import { useStore } from '../store.jsx'
import Shell from '../ui/Shell.jsx'
import { usd } from '../data/market.js'
import { CLIENTS, KYC, KYC_TARGET_H, MOVES, RULES, TICKETS } from '../data/staff.js'

// The back office on the demo morning: Wednesday 28 October 2026, 11:00 UTC. Every count on
// the overview is computed from the queues below it, after the decisions made in this demo.
const NOW = Date.parse('2026-10-28T11:00:00Z')
const hoursSince = (at) => (NOW - Date.parse(at.replace(' ', 'T') + ':00Z')) / 3600000
const ageLabel = (h) => (h < 1 ? `${Math.round(h * 60)} min` : h < 48 ? `${Math.floor(h)} h` : `${Math.floor(h / 24)} days`)
const ITEMS = [
  ['/staff', 'Overview', Dashboard, true],
  ['/staff/kyc', 'Identity checks', Identification],
  ['/staff/money', 'Money movements', Money],
  ['/staff/clients', 'Clients', UserMultiple],
  ['/staff/support', 'Support', Chat],
]
const PILL = { Verified: 'ok', Approved: 'ok', Completed: 'ok', Released: 'ok', Pending: 'wait', 'In review': 'wait', Held: 'wait', 'More info': 'wait', Open: 'wait', Rejected: 'bad', Returned: 'bad', Restricted: 'bad', 'Waiting on client': '', Solved: '' }
const Pill = ({ v }) => <span className={`st ${PILL[v] ?? ''}`}>{v}</span>

function useBackOffice() {
  const { s, set, notify } = useStore()
  const clients = useMemo(() => CLIENTS.map((c) => {
    const k = KYC.find((x) => x.client === c.id)
    const d = k && s.kyc[k.id]
    const base = d === 'Approved' ? 'Verified' : d === 'Rejected' ? 'Rejected' : c.status
    return { ...c, status: s.access[c.id] || base }
  }), [s.kyc, s.access])
  const byClient = Object.fromEntries(clients.map((c) => [c.id, c]))
  const kyc = KYC.map((k) => ({ ...k, decision: s.kyc[k.id] || null, age: hoursSince(k.submitted) }))
  const waiting = kyc.filter((k) => !k.decision || k.decision === 'More info').sort((a, b) => b.age - a.age)
  // Withdrawals the demo client asks for in the client area arrive in this queue too.
  const extra = s.funds.filter((f) => f.kind === 'Withdrawal' && f.status === 'In review' && !MOVES.some((m) => m.id === f.id))
    .map((f) => ({ id: f.id, client: 'GT-104882', at: `${f.date} 10:58`, kind: 'Withdrawal', amount: f.amount, method: 'Bank transfer', flags: [], status: 'In review' }))
  const moves = [...extra, ...MOVES].map((m) => {
    const fund = s.funds.find((f) => f.id === m.id)
    const status = s.moves[m.id] || (fund && fund.status !== 'In review' ? (fund.status === 'Completed' ? 'Released' : fund.status) : m.status)
    return { ...m, status }
  })
  const tickets = TICKETS.map((t) => {
    const thread = [...t.thread, ...(s.replies[t.id] || [])]
    const last = thread[thread.length - 1].from
    return { ...t, thread, status: s.solved[t.id] ? 'Solved' : last === 'staff' && t.status !== 'Solved' ? 'Waiting on client' : t.status }
  })
  const decideMove = (m, v) => {
    set((c) => ({ moves: { ...c.moves, [m.id]: v }, funds: c.funds.map((f) => (f.id === m.id ? { ...f, status: v === 'Released' ? 'Completed' : 'Rejected' } : f)) }))
    notify({ text: `${m.id} ${v === 'Released' ? 'released' : 'returned to sender'}.`, undo: () => set((c) => { const n = { ...c.moves }; delete n[m.id]; return { moves: n, funds: c.funds.map((f) => (f.id === m.id ? { ...f, status: 'In review' } : f)) } }) })
  }
  return { s, set, notify, clients, byClient, kyc, waiting, moves, tickets, decideMove }
}

function Overview() {
  const b = useBackOffice()
  const late = b.waiting.filter((k) => k.age > KYC_TARGET_H)
  const held = b.moves.filter((m) => m.status === 'Held' || m.status === 'In review')
  const flagged = held.filter((m) => m.flags.length)
  const open = b.tickets.filter((t) => t.status === 'Open')
  return (
    <>
      <div className="titlerow">
        <div>
          <h1>Back office</h1>
          <p className="finding">{late.length ? `${late.length} identity ${late.length === 1 ? 'check is' : 'checks are'} past the ${KYC_TARGET_H}-hour target; the oldest has waited ${ageLabel(late[0].age)}.` : `Every identity check is inside the ${KYC_TARGET_H}-hour target.`} {flagged.length} payments are held by a rule.</p>
        </div>
        <span className="stamp">Wed 28 Oct, 11:00 UTC</span>
      </div>
      <section className="card" aria-label="Queues">
        <div className="kpis">
          <div><small>Identity checks waiting</small><b className="num">{b.waiting.length}</b><span>{late.length} past {KYC_TARGET_H} h</span></div>
          <div><small>Payments to review</small><b className="num">{held.length}</b><span className="num">{usd(held.reduce((a, m) => a + m.amount, 0), 0)} in total</span></div>
          <div><small>Held by a rule</small><b className="num">{flagged.length}</b><span>Need a decision</span></div>
          <div><small>Tickets waiting on us</small><b className="num">{open.length}</b><span>{b.tickets.filter((t) => t.status === 'Waiting on client').length} waiting on clients</span></div>
        </div>
      </section>
      <div className="grid2">
        <section className="card" aria-labelledby="kq-h">
          <div className="card-h"><h2 id="kq-h">Identity checks, oldest first</h2><Link to="/staff/kyc">Open queue</Link></div>
          {b.waiting.length === 0 ? <p className="empty">No checks waiting.</p> : (
<div className="wrap"><table className="tbl"><thead><tr><th>Client</th><th>What the check found</th><th className="r">Waiting</th></tr></thead>
              <tbody>{b.waiting.slice(0, 5).map((k) => (
                <tr key={k.id}><td>{b.byClient[k.client].name}<span className="sub">{k.id} · {b.byClient[k.client].country}</span></td><td>{k.check}</td><td className={`r ${k.age > KYC_TARGET_H ? 'neg' : ''}`}>{ageLabel(k.age)}</td></tr>
              ))}</tbody></table></div>
          )}
        </section>
        <section className="card" aria-labelledby="tq-h">
          <div className="card-h"><h2 id="tq-h">Support tickets, open first</h2><Link to="/staff/support">Open inbox</Link></div>
          {b.tickets.length === 0 ? <p className="empty">Inbox clear.</p> : (
            <ul className="ilist">{[...b.tickets].sort((x, y) => (y.status === 'Open') - (x.status === 'Open')).map((t) => <li key={t.id}><Link to={`/staff/support?t=${t.id}`} style={{ display: 'grid', gap: 2, padding: '10px 0', borderBottom: '1px solid #1d1a15', textDecoration: 'none' }}><span>{t.subject}</span><small>{b.byClient[t.client].name} · {t.status} · {ageLabel(hoursSince(t.opened))} ago</small></Link></li>)}</ul>
          )}
        </section>
      </div>
      <section className="card" aria-labelledby="mq-h">
        <div className="card-h"><h2 id="mq-h">Payments held by a rule</h2><Link to="/staff/money">All payments</Link></div>
        {flagged.length === 0 ? <p className="empty">Nothing held. New flags appear here as payments arrive.</p> : (
          <div className="wrap"><table className="tbl"><thead><tr><th>Payment</th><th>Client</th><th>Why it is held</th><th className="r">Amount</th></tr></thead>
            <tbody>{flagged.map((m) => <tr key={m.id}><td>{m.kind}<span className="sub">{m.id} · {m.at.slice(11)}</span></td><td>{b.byClient[m.client].name}</td><td>{m.flags.map((f) => RULES[f]).join('; ')}</td><td className="r">{usd(m.amount)}</td></tr>)}</tbody>
          </table></div>
        )}
      </section>
    </>
  )
}

function Kyc() {
  const b = useBackOffice()
  const [tab, setTab] = useState('Waiting')
  const lists = { Waiting: b.waiting, Decided: b.kyc.filter((k) => k.decision && k.decision !== 'More info') }
  const list = lists[tab]
  const [sel, setSel] = useState(b.waiting[0]?.id)
  const k = b.kyc.find((x) => x.id === sel) || list[0]
  const decide = (v) => {
    b.set((c) => ({ kyc: { ...c.kyc, [k.id]: v } }))
    b.notify({ text: `${b.byClient[k.client].name}: ${v === 'More info' ? 'asked for another document' : v.toLowerCase()}.`, undo: () => b.set((c) => { const n = { ...c.kyc }; delete n[k.id]; return { kyc: n } }) })
    const nextUp = b.waiting.find((x) => x.id !== k.id && x.decision !== 'More info')
    if (nextUp) setSel(nextUp.id)
  }
  return (
    <>
      <div className="titlerow"><div><h1>Identity checks</h1><p>Target: a decision within {KYC_TARGET_H} hours of the documents arriving.</p></div></div>
      <div className="tabs" role="tablist">{Object.keys(lists).map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}<span className="count">{lists[t].length}</span></button>)}</div>
      <div className="inbox">
        <section className="card" style={{ padding: 0 }} aria-label="Checks">
          {list.length === 0 ? <p className="empty" style={{ padding: 16 }}>{tab === 'Waiting' ? 'No checks waiting.' : 'Nothing decided yet today.'}</p> : (
            <ul className="ilist">{list.map((x) => (
              <li key={x.id} className={k?.id === x.id ? 'on' : ''}><button onClick={() => setSel(x.id)}>
                <span className="row1"><span>{b.byClient[x.client].name}</span><span className={x.age > KYC_TARGET_H && !x.decision ? 'neg' : 'dash'}>{ageLabel(x.age)}</span></span>
                <small>{x.check}{x.decision ? ` · ${x.decision}` : ''}</small>
              </button></li>
            ))}</ul>
          )}
        </section>
        {k && (
          <section className="card" aria-labelledby="kd-h">
            <div className="card-h"><h2 id="kd-h">{b.byClient[k.client].name}, {b.byClient[k.client].country}</h2><span className="stamp">{k.id} · sent {k.submitted} UTC</span></div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div className="grid2 even">{k.docs.map((d) => <div key={d} className="doc"><b>{d}</b>Image opens in the secure viewer</div>)}</div>
              <p className={k.risk === 'Clear' ? '' : 'notice'}>{k.risk === 'Clear' ? '' : <Warning size={16} />}Automatic check: {k.check}.</p>
              <table className="tbl"><tbody>
                <tr><td className="dash">Client number</td><td>{k.client}</td></tr>
                <tr><td className="dash">Joined</td><td>{b.byClient[k.client].joined}</td></tr>
                <tr><td className="dash">Waiting</td><td className={k.age > KYC_TARGET_H ? 'neg' : ''}>{ageLabel(k.age)} (target {KYC_TARGET_H} h)</td></tr>
                <tr><td className="dash">Decision</td><td>{k.decision ? <Pill v={k.decision} /> : <span className="dash">None yet</span>}</td></tr>
              </tbody></table>
              <div className="row-btns">
                <button className="abtn primary" onClick={() => decide('Approved')} disabled={k.decision === 'Approved'}>Approve</button>
                <button className="abtn" onClick={() => decide('More info')} disabled={k.decision === 'More info'}>Ask for another document</button>
                <button className="abtn quiet" onClick={() => decide('Rejected')} disabled={k.decision === 'Rejected'}>Reject</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

const MTABS = ['To review', 'Released', 'Returned', 'All']
function MoneyPage() {
  const b = useBackOffice()
  const [tab, setTab] = useState('To review')
  const pick = (t) => b.moves.filter((m) => t === 'All' || (t === 'To review' ? ['Held', 'In review'].includes(m.status) : m.status === t))
  const list = pick(tab)
  return (
    <>
      <div className="titlerow"><div><h1>Money movements</h1><p>Payments wait here until a person releases them. A rule can hold one; the reason is written next to it.</p></div></div>
      <div className="tabs" role="tablist">{MTABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}<span className="count">{pick(t).length}</span></button>)}</div>
      <section className="card">
        {list.length === 0 ? <p className="empty">Nothing in this view.</p> : (
          <div className="wrap"><table className="tbl">
            <thead><tr><th>Payment</th><th>Client</th><th>Method</th><th>Why it is here</th><th>Status</th><th className="r">Amount</th><th /></tr></thead>
            <tbody>{list.map((m) => (
              <tr key={m.id}>
                <td>{m.kind}<span className="sub">{m.id} · {m.at} UTC</span></td>
                <td>{b.byClient[m.client].name}<span className="sub">{m.client}</span></td>
                <td>{m.method}</td>
                <td style={{ whiteSpace: 'normal', minWidth: 220 }}>{m.flags.length ? m.flags.map((f) => RULES[f]).join('; ') : <span className="dash">Routine check</span>}</td>
                <td><Pill v={m.status} /></td>
                <td className="r">{m.kind === 'Deposit' ? '+' : '−'}{usd(m.amount)}</td>
                <td className="r">{['Held', 'In review'].includes(m.status) ? <span className="row-btns" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap' }}><button className="abtn" onClick={() => b.decideMove(m, 'Released')}>Release</button><button className="abtn quiet" onClick={() => b.decideMove(m, 'Returned')}>Return</button></span> : null}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
      <section className="card" aria-labelledby="ru-h">
        <div className="card-h"><h2 id="ru-h">Rules that hold a payment</h2><span className="stamp">Sample rules for the prototype</span></div>
        <ul style={{ display: 'grid', gap: 6 }}>{Object.values(RULES).map((r) => <li key={r}>{r}</li>)}</ul>
      </section>
    </>
  )
}

const CTABS = ['All', 'Verified', 'Pending', 'Restricted', 'Rejected']
function Clients() {
  const b = useBackOffice()
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')
  const match = (c) => !q || `${c.name} ${c.id} ${c.country}`.toLowerCase().includes(q.toLowerCase())
  const pick = (t) => b.clients.filter((c) => (t === 'All' || c.status === t) && match(c))
  const list = pick(tab)
  const total = list.reduce((a, c) => a + c.balance, 0)
  // A restricted client can log in and withdraw, but cannot open new trades.
  const access = (c, v) => {
    const before = b.s.access[c.id]
    b.set((x) => ({ access: { ...x.access, [c.id]: v } }))
    b.notify({ text: v === 'Restricted' ? `${c.name} can no longer open trades. Withdrawals stay open.` : `${c.name} can trade again.`, undo: () => b.set((x) => ({ access: { ...x.access, [c.id]: before } })) })
  }
  return (
    <>
      <div className="titlerow">
        <div><h1>Clients</h1><p className="num">{list.length} {list.length === 1 ? 'client' : 'clients'} in this view, {usd(total)} in balances.</p></div>
        <label className="search"><Search size={16} /><input placeholder="Name, number or country" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search clients" /></label>
      </div>
      <div className="tabs" role="tablist">{CTABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}<span className="count">{pick(t).length}</span></button>)}</div>
      <section className="card">
        {list.length === 0 ? <p className="empty">No clients match “{q}”.</p> : (
          <div className="wrap"><table className="tbl">
            <thead><tr><th>Client</th><th>Country</th><th>Joined</th><th>Status</th><th className="r">Balance</th><th /></tr></thead>
            <tbody>{list.map((c) => (
              <tr key={c.id}><td>{c.name}<span className="sub">{c.id}</span></td><td>{c.country}</td><td>{c.joined}</td><td><Pill v={c.status} /></td><td className="r">{c.balance ? usd(c.balance) : <span className="dash">$0.00</span>}</td>
                <td className="r">{c.status === 'Verified' ? <button className="abtn quiet" onClick={() => access(c, 'Restricted')}>Restrict</button> : c.status === 'Restricted' ? <button className="abtn quiet" onClick={() => access(c, 'Verified')}>Lift restriction</button> : null}</td></tr>
            ))}</tbody>
            <tfoot><tr><td colSpan={4} className="dash">Total</td><td className="r">{usd(total)}</td><td /></tr></tfoot>
          </table></div>
        )}
      </section>
    </>
  )
}

function Support() {
  const b = useBackOffice()
  const initial = new URLSearchParams(window.location.hash.split('?')[1]).get('t')
  const [sel, setSel] = useState(initial || b.tickets[0].id)
  const [text, setText] = useState('')
  const t = b.tickets.find((x) => x.id === sel)
  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const msg = { from: 'staff', at: '2026-10-28 11:00', text: text.trim() }
    b.set((c) => ({ replies: { ...c.replies, [t.id]: [...(c.replies[t.id] || []), msg] } }))
    setText('')
    b.notify({ text: `Reply sent to ${b.byClient[t.client].name}.` })
  }
  return (
    <>
      <div className="titlerow"><div><h1>Support</h1><p>{b.tickets.filter((x) => x.status === 'Open').length} tickets waiting on us. Oldest first.</p></div></div>
      <div className="inbox">
        <section className="card" style={{ padding: 0 }} aria-label="Tickets">
          <ul className="ilist">{[...b.tickets].sort((x, y) => (x.status === 'Open') === (y.status === 'Open') ? x.opened.localeCompare(y.opened) : x.status === 'Open' ? -1 : 1).map((x) => (
            <li key={x.id} className={x.id === sel ? 'on' : ''}><button onClick={() => setSel(x.id)}>
              <span className="row1"><span>{x.subject}</span></span>
              <small>{b.byClient[x.client].name} · {x.status} · {ageLabel(hoursSince(x.opened))}</small>
            </button></li>
          ))}</ul>
        </section>
        <section className="card" aria-labelledby="tk-h">
          <div className="card-h"><h2 id="tk-h">{t.subject}</h2><Pill v={t.status} /></div>
          <p className="stamp" style={{ marginBottom: 14 }}>{b.byClient[t.client].name} · {t.client} · <Pill v={b.byClient[t.client].status} /></p>
          <div className="thread">{t.thread.map((m, i) => <div key={i} className={`msg ${m.from}`}><small>{m.from === 'staff' ? 'GlobalTrade support' : b.byClient[t.client].name} · {m.at} UTC</small>{m.text}</div>)}</div>
          {t.status !== 'Solved' ? (
            <form onSubmit={send} style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              <label className="afield">Reply<textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={`Write to ${b.byClient[t.client].name.split(' ')[0]}`} /></label>
              <div className="row-btns">
                <button className="abtn primary" disabled={!text.trim()}>Send reply</button>
                <button type="button" className="abtn quiet" onClick={() => b.set((c) => ({ solved: { ...c.solved, [t.id]: true } }))}>Mark as solved</button>
              </div>
            </form>
          ) : <p className="empty">Solved. The client can reopen it by replying to the email.</p>}
          <div className="ctx">
            <h3>About this client</h3>
            <dl>
              <div><dt>Status</dt><dd><Pill v={b.byClient[t.client].status} /></dd></div>
              <div><dt>Balance</dt><dd>{usd(b.byClient[t.client].balance)}</dd></div>
              <div><dt>Joined</dt><dd>{b.byClient[t.client].joined}</dd></div>
              <div><dt>Payments in review</dt><dd>{b.moves.filter((m) => m.client === t.client && ['Held', 'In review'].includes(m.status)).map((m) => `${m.id} ${usd(m.amount, 0)}`).join(', ') || 'None'}</dd></div>
            </dl>
          </div>
        </section>
      </div>
    </>
  )
}

export default function Staff() {
  return (
    <Shell items={ITEMS} label="Staff area">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="kyc" element={<Kyc />} />
        <Route path="money" element={<MoneyPage />} />
        <Route path="clients" element={<Clients />} />
        <Route path="support" element={<Support />} />
      </Routes>
    </Shell>
  )
}
