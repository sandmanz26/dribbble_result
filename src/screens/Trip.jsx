import { useState } from 'react'
import { Link, Navigate, NavLink, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Avatar, Faces, Seg, Sheet, TopBar } from '../ui/kit.jsx'
import { addDays, fmtDay, fmtRange, fmtWeekday, untilStart, usd, usd2 } from '../data/groups.js'
import { firstName } from '../data/people.js'
import { DATE_POLL, PLAN } from '../data/trip.js'
import { KYOTO, costs, itinerary, packing, poll } from '../data/plan.js'
import { todos } from './Trips.jsx'

const TABS = [['', 'Overview'], ['dates', 'Dates'], ['budget', 'Budget'], ['plan', 'Plan'], ['packing', 'Packing']]

// Plan Together for one trip. Each tab answers one question the group keeps asking in chat.
export default function Trip() {
  const { id, tab = '' } = useParams()
  if (id !== 'kyoto') return <Navigate to="/trips" replace />
  return (
    <div className="page detail">
      <TopBar title={KYOTO.title} sub={`${fmtRange(KYOTO.start, KYOTO.end)} · starts in ${untilStart(KYOTO)} days`}
        right={<Link to="/chats/kyoto" className="iconbtn" aria-label="Group chat"><Icon name="chats" size={22} /></Link>} />
      <nav className="tabs" aria-label="Trip">
        {TABS.map(([t, l]) => <NavLink key={t} to={`/trip/kyoto${t ? `/${t}` : ''}`} end className="tabs-item">{l}</NavLink>)}
      </nav>
      {tab === '' && <Overview />}
      {tab === 'dates' && <Dates />}
      {tab === 'budget' && <Budget />}
      {tab === 'plan' && <Plan />}
      {tab === 'packing' && <Packing />}
    </div>
  )
}

function Overview() {
  const { s } = useStore()
  const list = todos(s)
  const c = costs(s.expenses)
  const pl = poll(s.pollVotes)
  return (
    <div className="tabbody">
      <section aria-labelledby="todo-h">
        <div className="sechead"><h2 id="todo-h">Waiting on you</h2><span className="meta num">{list.length}</span></div>
        {list.length ? (
          <ul className="rows">
            {list.map((t) => (
              <li key={t.to}><Link to={t.to} className="row"><span className="row-main"><strong>{t.text}</strong><span className="meta small">{t.sub}</span></span><Icon name="next" /></Link></li>
            ))}
          </ul>
        ) : <p className="note ok"><Icon name="tick" /> Nothing is waiting on you. Nice.</p>}
      </section>
      <div className="facts">
        <Link to="/trip/kyoto/dates" className="fact-link">
          <span className="meta small">Dates, leading</span>
          <strong>{fmtRange(pl.lead.start, pl.lead.end)}</strong>
          <span className="meta small num">{pl.lead.yes} yes, {pl.lead.maybe} maybe</span>
        </Link>
        <Link to="/trip/kyoto/budget" className="fact-link">
          <span className="meta small">Your share so far</span>
          <strong className="num">{usd2(c.committed)}</strong>
          <span className="meta small num">of a {usd(c.planTotal)} plan</span>
        </Link>
      </div>
      <section aria-labelledby="crew-h">
        <div className="sechead"><h2 id="crew-h">The group</h2></div>
        <ul className="people">
          {KYOTO.members.map((m) => (
            <li key={m}><Link to={`/u/${m}`} className="person-row"><Avatar id={m} size={40} /><span className="person-main"><strong>{m === 'nadia' ? 'You' : firstName(m)}{m === KYOTO.host && <small className="host">Host</small>}</strong><span className="meta small">{c.net[m] > 0 ? `is owed ${usd2(c.net[m])}` : c.net[m] < 0 ? `owes ${usd2(-c.net[m])}` : 'settled up'}</span></span></Link></li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Dates() {
  const { s, set, notify } = useStore()
  const pl = poll(s.pollVotes)
  const vote = (w, v) => {
    const next = { ...s.pollVotes, [w]: v }
    set({ pollVotes: next })
    if (Object.keys(next).length === DATE_POLL.windows.length && Object.keys(s.pollVotes).length < DATE_POLL.windows.length) notify({ text: 'Your votes are in. Kenji locks the dates when the poll closes.' })
  }
  return (
    <div className="tabbody">
      <p className="meta">Mark each window. The poll closes {fmtWeekday(DATE_POLL.closes)} {fmtDay(DATE_POLL.closes)}, then {firstName(KYOTO.host)} locks the dates.{pl.waiting.length ? ` Waiting on ${pl.waiting.map((m) => (m === 'nadia' ? 'you' : firstName(m))).join(', ')}.` : ' Everyone has voted.'}</p>
      <ul className="polls">
        {pl.rows.map((w) => (
          <li key={w.id} className={`poll ${pl.lead.id === w.id ? 'lead' : ''}`}>
            <div className="poll-top">
              <div>
                <strong>{fmtRange(w.start, w.end)}</strong>
                <span className="meta small">{fmtWeekday(w.start)} to {fmtWeekday(w.end)}{pl.lead.id === w.id ? ' · leading' : ''}</span>
              </div>
              <span className="meta num">{w.yes} yes · {w.maybe} maybe</span>
            </div>
            <ul className="voters" aria-label="Votes">
              {w.by.map(({ m, v }) => (
                <li key={m} className={`v-${v || 'none'}`} title={`${firstName(m)}: ${v || 'not voted'}`}>
                  <Avatar id={m} size={30} />
                  <span className="sr-only">{firstName(m)}: {v || 'not voted'}</span>
                  <i aria-hidden="true">{v === 'yes' ? <Icon name="tick" size={10} stroke={3} /> : v === 'no' ? <Icon name="close" size={10} stroke={3} /> : v === 'maybe' ? '?' : ''}</i>
                </li>
              ))}
            </ul>
            <Seg label={`Your vote for ${fmtRange(w.start, w.end)}`} value={s.pollVotes[w.id] || ''} onChange={(v) => vote(w.id, v)}
              options={[['yes', 'Works'], ['maybe', 'Maybe'], ['no', 'Can’t']]} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Budget() {
  const { s, set, notify } = useStore()
  const c = costs(s.expenses)
  const [add, setAdd] = useState(false)
  const [f, setF] = useState({ what: '', amount: '', cat: 'food', split: [...KYOTO.members] })
  const owe = c.transfers.filter((t) => t.from === 'nadia')
  const owed = c.transfers.filter((t) => t.to === 'nadia')
  const pct = Math.min(100, (c.committed / c.planTotal) * 100)

  const save = () => {
    const amount = Math.round(Number(f.amount) * 100) / 100
    const e = { id: `x${Date.now()}`, what: f.what.trim(), cat: f.cat, paidBy: 'nadia', amount, split: f.split, on: '2026-10-24' }
    set({ expenses: [...s.expenses, e] })
    setAdd(false)
    setF({ what: '', amount: '', cat: 'food', split: [...KYOTO.members] })
    notify({ text: `${e.what} added. Each share is ${usd2(amount / e.split.length)}.`, undo: () => set((cur) => ({ expenses: cur.expenses.filter((x) => x.id !== e.id) })) })
  }
  const settle = (t) => {
    const e = { id: `s${Date.now()}`, kind: 'settle', what: `Paid ${firstName(t.to)}`, cat: 'settle', paidBy: 'nadia', amount: t.v, split: [t.to], on: '2026-10-24' }
    set({ expenses: [...s.expenses, e] })
    notify({ text: `Marked ${usd2(t.v)} to ${firstName(t.to)} as paid.`, undo: () => set((cur) => ({ expenses: cur.expenses.filter((x) => x.id !== e.id) })) })
  }
  const valid = f.what.trim() && Number(f.amount) > 0 && f.split.length > 0

  return (
    <div className="tabbody">
      <section className="card" aria-labelledby="share-h">
        <span className="meta small" id="share-h">Your share so far</span>
        <strong className="big num">{usd2(c.committed)}</strong>
        <div className="track" role="img" aria-label={`${usd2(c.committed)} of a ${usd(c.planTotal)} plan`}><span style={{ width: `${pct}%` }} /></div>
        <div className="track-ends meta small num"><span>$0</span><span>{usd(c.planTotal)} plan per person</span></div>
        <ul className="cats">
          {PLAN.map((p) => (
            <li key={p.id}>
              <span className="cat-name">{p.label}<small className="meta">{p.note}</small></span>
              <span className="num cat-fig">{c.mineByCat[p.id] ? usd2(c.mineByCat[p.id]) : '-'}<small className="meta"> / {usd(p.amount)}</small></span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="settle-h">
        <div className="sechead"><h2 id="settle-h">Settle up</h2></div>
        {owe.length === 0 && owed.length === 0 && <p className="note ok"><Icon name="tick" /> You are square with everyone.</p>}
        <ul className="rows">
          {owe.map((t) => (
            <li key={t.to} className="row">
              <Avatar id={t.to} size={36} />
              <span className="row-main"><strong>You owe {firstName(t.to)}</strong><span className="meta small">Pay outside the app, then mark it here</span></span>
              <span className="num money">{usd2(t.v)}</span>
              <button className="btn ghost small" onClick={() => settle(t)}>Mark paid</button>
            </li>
          ))}
          {owed.map((t) => (
            <li key={t.from} className="row">
              <Avatar id={t.from} size={36} />
              <span className="row-main"><strong>{firstName(t.from)} owes you</strong></span>
              <span className="num money pos">+{usd2(t.v)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="exp-h">
        <div className="sechead"><h2 id="exp-h">Shared costs</h2><span className="meta num">{usd2(c.total)}</span></div>
        <ul className="rows">
          {c.list.map((e) => (
            <li key={e.id} className="row">
              <Avatar id={e.paidBy} size={36} />
              <span className="row-main"><strong>{e.what}</strong><span className="meta small">{e.paidBy === 'nadia' ? 'You' : firstName(e.paidBy)} paid · split {e.split.length} ways · {fmtDay(e.on)}</span></span>
              <span className="num money">{usd2(e.amount)}</span>
            </li>
          ))}
        </ul>
        <button className="btn ghost block" onClick={() => setAdd(true)}><Icon name="add" size={18} /> Add a cost you paid</button>
      </section>

      <Sheet open={add} onClose={() => setAdd(false)} title="Add a cost you paid">
        <form className="sheet-body" onSubmit={(e) => { e.preventDefault(); if (valid) save() }}>
          <label htmlFor="ew">What for</label>
          <input id="ew" placeholder="Dinner at Pontochō" value={f.what} onChange={(e) => setF({ ...f, what: e.target.value })} />
          <label htmlFor="ea">Amount in USD</label>
          <input id="ea" inputMode="decimal" placeholder="0.00" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value.replace(/[^\d.]/g, '') })} />
          <label htmlFor="ec">Part of</label>
          <select id="ec" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>{PLAN.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
          <fieldset className="splitpick">
            <legend>Split between</legend>
            {KYOTO.members.map((m) => (
              <label key={m} className="check">
                <input type="checkbox" checked={f.split.includes(m)} onChange={(e) => setF({ ...f, split: e.target.checked ? [...f.split, m] : f.split.filter((x) => x !== m) })} />
                {m === 'nadia' ? 'You' : firstName(m)}
              </label>
            ))}
          </fieldset>
          <p className="meta small num">{valid ? `${f.split.length} people, ${usd2(Number(f.amount) / f.split.length)} each` : 'Add what it was for, the amount and who shares it.'}</p>
          <button className="btn primary block" disabled={!valid}>Add cost</button>
        </form>
      </Sheet>
    </div>
  )
}

function Plan() {
  const { s, set, notify } = useStore()
  const days = itinerary(s.itinVotes, s.itinAdded)
  const [adding, setAdding] = useState(null)
  const [f, setF] = useState({ time: '10:00', title: '', where: '' })
  const vote = (id, v) => set({ itinVotes: { ...s.itinVotes, [id]: s.itinVotes[id] === v ? undefined : v } })
  const save = () => {
    const it = { id: `a${Date.now()}`, day: adding, time: f.time, title: f.title.trim(), where: f.where.trim() || 'Kyoto', by: 'nadia', proposed: true, votes: { nadia: 'yes' } }
    set({ itinAdded: [...s.itinAdded, it] })
    setAdding(null)
    setF({ time: '10:00', title: '', where: '' })
    notify({ text: 'Idea added. The group can vote on it now.', undo: () => set((cur) => ({ itinAdded: cur.itinAdded.filter((x) => x.id !== it.id) })) })
  }
  return (
    <div className="tabbody">
      <ol className="days">
        {days.map((d) => {
          const date = addDays(KYOTO.start, d.day)
          return (
            <li key={d.day} className="day">
              <div className="day-head">
                <strong>Day {d.day + 1}</strong>
                <span className="meta">{fmtWeekday(date)} {fmtDay(date)}</span>
                <button className="iconbtn small" aria-label={`Add an idea to day ${d.day + 1}`} onClick={() => setAdding(d.day)}><Icon name="add" size={18} /></button>
              </div>
              <ul className="items">
                {d.items.map((it) => (
                  <li key={it.id} className={`item ${it.proposed ? 'proposed' : ''}`}>
                    <span className="item-time num">{it.time}</span>
                    <div className="item-main">
                      <strong>{it.title}</strong>
                      <span className="meta small">{it.where} · added by {it.by === 'nadia' ? 'you' : firstName(it.by)}{it.going ? ` · ${it.going.length} going` : ''}</span>
                      {it.proposed && (
                        <div className="votes">
                          <button aria-pressed={it.mine === 'yes'} onClick={() => vote(it.id, 'yes')}><Icon name="up" size={16} /> <span className="num">{it.yes}</span><span className="sr-only">in</span></button>
                          <button aria-pressed={it.mine === 'no'} onClick={() => vote(it.id, 'no')}><Icon name="nope" size={16} /> <span className="num">{it.no}</span><span className="sr-only">skip</span></button>
                          <span className="meta small">{it.yes >= 3 ? 'On the plan once the host confirms' : `Needs ${3 - it.yes} more to make the plan`}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>
      <Sheet open={adding !== null} onClose={() => setAdding(null)} title={adding !== null ? `Add an idea to day ${adding + 1}` : ''}>
        <form className="sheet-body" onSubmit={(e) => { e.preventDefault(); if (f.title.trim()) save() }}>
          <label htmlFor="it">What</label>
          <input id="it" placeholder="Philosopher's Path walk" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <div className="two">
            <div><label htmlFor="tm">Time</label><input id="tm" type="time" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></div>
            <div><label htmlFor="wh">Where</label><input id="wh" placeholder="Area" value={f.where} onChange={(e) => setF({ ...f, where: e.target.value })} /></div>
          </div>
          <p className="meta small">Ideas need three votes before the host adds them to the plan.</p>
          <button className="btn primary block" disabled={!f.title.trim()}>Add idea</button>
        </form>
      </Sheet>
    </div>
  )
}

function Packing() {
  const { s, set, notify } = useStore()
  const pk = packing(s.claims, s.mine)
  const [item, setItem] = useState('')
  const claim = (p) => {
    const by = p.by === 'nadia' ? null : 'nadia'
    if (p.by && p.by !== 'nadia') return
    set({ claims: { ...s.claims, [p.id]: by } })
    notify({ text: by ? `You are bringing the ${p.what.toLowerCase()}.` : `${p.what} is open again.` })
  }
  const toggle = (id) => set({ mine: s.mine.map((m) => (m.id === id ? { ...m, done: !m.done } : m)) })
  const addMine = (e) => {
    e.preventDefault()
    if (!item.trim()) return
    set({ mine: [...s.mine, { id: `my${Date.now()}`, what: item.trim(), done: false }] })
    setItem('')
  }
  return (
    <div className="tabbody">
      <section aria-labelledby="sh-h">
        <div className="sechead"><h2 id="sh-h">Shared, one each</h2><span className="meta num">{pk.open} open</span></div>
        <ul className="rows">
          {pk.shared.map((p) => (
            <li key={p.id} className="row">
              <span className="row-main"><strong>{p.what}</strong><span className="meta small">{p.by ? `${p.by === 'nadia' ? 'You are' : `${firstName(p.by)} is`} bringing it` : 'No one yet'}</span></span>
              {p.by && p.by !== 'nadia' ? <Avatar id={p.by} size={30} /> : (
                <button className={`btn small ${p.by === 'nadia' ? 'ghost' : 'primary'}`} onClick={() => claim(p)}>{p.by === 'nadia' ? 'Undo' : 'I’ll bring it'}</button>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="my-h">
        <div className="sechead"><h2 id="my-h">Your list</h2><span className="meta num">{pk.mineDone} of {pk.mineTotal} packed</span></div>
        <ul className="checks">
          {s.mine.map((m) => (
            <li key={m.id}>
              <label className={`check big ${m.done ? 'done' : ''}`}>
                <input type="checkbox" checked={m.done} onChange={() => toggle(m.id)} />
                <span>{m.what}</span>
              </label>
            </li>
          ))}
        </ul>
        <form className="addrow" onSubmit={addMine}>
          <label htmlFor="pi" className="sr-only">Add to your list</label>
          <input id="pi" placeholder="Add something to pack" value={item} onChange={(e) => setItem(e.target.value)} />
          <button className="iconbtn" aria-label="Add" disabled={!item.trim()}><Icon name="add" /></button>
        </form>
      </section>
    </div>
  )
}
