import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Badge } from '../ui.jsx'
import { SESSIONS, COACHES, TODAY, coach } from '../data.js'

const DAYS = [10, 11, 12, 13, 14]
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16]
const TONE = { '1:1 coaching': 'blue', 'Resume review': 'green', 'Mock interview': 'amber', 'Offer negotiation': 'pink', Kickoff: 'grey' }

// Side-by-side lanes for sessions that overlap in time.
function lanes(evs) {
  const out = []; let group = []; let end = 0
  const flush = () => { const ends = []; group.forEach((g) => { let i = ends.findIndex((e) => e <= +g.s.at); if (i < 0) { i = ends.length; ends.push(0) } ends[i] = +g.s.at + g.s.mins * 6e4; g.i = i }); group.forEach((g) => out.push({ ...g, n: ends.length })); group = [] }
  evs.forEach((s) => { if (+s.at >= end && group.length) flush(); group.push({ s }); end = Math.max(end, +s.at + s.mins * 6e4) })
  if (group.length) flush()
  return out
}

export default function Sessions() {
  const { people, isHR, toast } = useStore()
  const [co, setCo] = useState('c1')
  const list = SESSIONS.filter((s) => people.some((p) => p.id === s.person) && (co === 'all' || s.coach === co))
  const now = (TODAY.getHours() - 9 + TODAY.getMinutes() / 60) / HOURS.length
  const name = (s) => { const p = people.find((x) => x.id === s.person); return isHR && !p.consent ? 'Participant' : p.name }
  return (
    <>
      <div className="page-head">
        <div><h1>Sessions</h1><p>{list.length} sessions this week. Booked by participants from their coach's open slots.</p></div>
        <div className="head-actions">
          <select value={co} onChange={(e) => setCo(e.target.value)} aria-label="Coach"><option value="all">All coaches</option>{COACHES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          {!isHR && <button className="btn" onClick={() => toast('Open slots added for next week (prototype)')}><FiPlus aria-hidden="true" />Add slots</button>}
        </div>
      </div>
      <section className="card cal-card">
        <div className="cal-head">
          <button className="icon-btn sm" aria-label="Previous week" onClick={() => toast('Only this week is in the prototype')}><FiChevronLeft /></button>
          <b>October 10 to 14, 2022</b>
          <button className="icon-btn sm" aria-label="Next week" onClick={() => toast('Only this week is in the prototype')}><FiChevronRight /></button>
          <div className="legend">{Object.entries(TONE).map(([k, t]) => <span key={k}><i className={`dot ${t}`} />{k}</span>)}</div>
        </div>
        <div className="cal">
          <div className="cal-times">{HOURS.map((h) => <span key={h}>{h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}</span>)}</div>
          {DAYS.map((d) => {
            const day = new Date(2022, 9, d)
            const isToday = d === TODAY.getDate()
            return (
              <div key={d} className={`cal-day ${isToday ? 'today' : ''}`}>
                <p className="cal-dname"><span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span><b>{d}</b></p>
                <div className="cal-col">
                  {HOURS.map((h) => <i key={h} className="cal-line" />)}
                  {isToday && <span className="now-line" style={{ top: `${now * 100}%` }} />}
                  {lanes(list.filter((s) => s.at.getDate() === d)).map(({ s, i, n }) => {
                    const top = ((s.at.getHours() - 9 + s.at.getMinutes() / 60) / HOURS.length) * 100
                    const pos = { left: `calc(${(i / n) * 100}% + 3px)`, width: `calc(${100 / n}% - 6px)` }
                    const h = (s.mins / 60 / HOURS.length) * 100
                    const p = people.find((x) => x.id === s.person)
                    const inner = <><b>{name(s)}</b><small>{s.type}, {coach(s.coach).name.split(' ')[0]}</small></>
                    return (isHR && !p.consent)
                      ? <div key={s.id} className={`ev ${TONE[s.type]} ${s.status === 'No-show' ? 'miss' : ''}`} style={{ top: `${top}%`, height: `${h}%`, ...pos }}>{inner}</div>
                      : <Link key={s.id} to={`/participants/${s.person}`} className={`ev ${TONE[s.type]} ${s.status === 'No-show' ? 'miss' : ''}`} style={{ top: `${top}%`, height: `${h}%`, ...pos }} title={`${s.status}: ${s.type} with ${name(s)}`}>{inner}</Link>
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <ul className="cal-list">
          {list.filter((s) => s.at.getDate() >= TODAY.getDate()).slice(0, 14).map((s) => (
            <li key={s.id}><span className="time">{s.at.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span><span className="grow"><b>{name(s)}</b><small>{s.type} with {coach(s.coach).name}</small></span><Badge tone={TONE[s.type]}>{s.mins}m</Badge></li>
          ))}
        </ul>
      </section>
    </>
  )
}
