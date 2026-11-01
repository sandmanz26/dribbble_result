import { useState } from 'react'
import { BiHourglass, BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { statusLabel } from '../data/avails.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, Button, Photo, Segmented } from '../ui/kit.jsx'

const TODAY = '2026-11-17'
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function holdsOn(holds, day) {
  const d = new Date(day + 'T12:00:00')
  const wk = d.getDay() > 0 && d.getDay() < 6
  return holds.filter((h) => h.status !== 'released' && day >= h.from && day <= h.to && (!h.weekdays || wk))
}

function Month({ y, m, holds }) {
  const first = new Date(y, m, 1)
  const lead = (first.getDay() + 6) % 7 // weeks start on Monday
  const n = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => iso(new Date(y, m, i + 1)))]
  return (
    <div className="cal" role="grid" aria-label={first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="cal__dow" aria-hidden="true">{d}</span>)}
      {cells.map((day, i) => {
        if (!day) return <span key={`x${i}`} />
        const on = holdsOn(holds, day)
        const booked = on.find((h) => h.status === 'confirmed')
        const p1 = on.find((h) => h.status === 'pencil1')
        const p2 = on.find((h) => h.status === 'pencil2' || h.status === 'waiting')
        const label = [Number(day.slice(8)), ...on.map((h) => `${h.title} ${statusLabel[h.status]}`)].join(', ')
        return (
          <span
            key={day}
            role="gridcell"
            aria-label={label}
            className={`cal__day${booked ? ' is-booked' : ''}${day === TODAY ? ' is-today' : ''}${day < TODAY ? ' is-past' : ''}`}
          >
            <span className="cal__n mono">{Number(day.slice(8))}</span>
            <span className="cal__marks" aria-hidden="true">
              {p1 && <i className="pen pen--1">1</i>}
              {p2 && <i className={`pen pen--2${p2.status === 'waiting' ? ' pen--wait' : ''}`}>2</i>}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export default function Avails() {
  const { s, sendChallenge, declineChallenge, releaseHold, toast } = useStore()
  const [month, setMonth] = useState('dec')
  const visible = s.holds.filter((h) => h.status !== 'released')

  return (
    <div className="page">
      <header className="top">
        <div>
          <h1 className="h1">Avails</h1>
          <p className="muted">Booked until 11 Dec. Free from 14 Dec except for pencils.</p>
        </div>
      </header>

      <Challenge s={s} onChallenge={() => { sendChallenge(); toast('Paper Moon has 24 hours to confirm or release you') }} onDecline={() => { declineChallenge(); toast('Halfway House released. Paper Moon keeps 1st pencil') }} />

      <Segmented
        label="Month"
        value={month}
        onChange={setMonth}
        options={[{ value: 'nov', label: 'November' }, { value: 'dec', label: 'December' }]}
      />
      <Month y={2026} m={month === 'nov' ? 10 : 11} holds={s.holds} />
      <p className="legend small muted">
        <span className="sw sw--booked" /> Booked <i className="pen pen--1">1</i> 1st pencil <i className="pen pen--2">2</i> 2nd pencil
      </p>

      <section className="block" aria-labelledby="holds">
        <h2 id="holds" className="h2">Holds</h2>
        <ul className="holds">
          {visible.map((h) => (
            <li key={h.id} className="hold">
              <Photo name={h.photo} small className="hold__img" alt="" />
              <div className="hold__body">
                <p className="hold__title">{h.title}</p>
                <p className="small muted">{h.kind}, {fmt(h.from)} to {fmt(h.to)}</p>
                {h.expires && <p className="small muted">They confirm by {h.expires}</p>}
                <div className="hold__row">
                  <Badge tone={h.status}>{statusLabel[h.status]}</Badge>
                  {(h.status === 'pencil1' || h.status === 'pencil2') && (
                    <Button variant="ghost" size="sm" onClick={() => { releaseHold(h.id); toast(`${h.title} released. They have been told`) }}>Release</Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Challenge({ s, onChallenge, onDecline }) {
  if (s.challenge === 'declined') return null
  if (s.challenge === 'won') {
    return (
      <section className="challenge challenge--won" aria-live="polite">
        <BiCheckCircle aria-hidden="true" className="challenge__icon" />
        <div>
          <p className="challenge__title">Halfway House it is</p>
          <p className="small">Paper Moon released you. 14 to 22 Dec is now confirmed and the deal memo is in your inbox.</p>
        </div>
      </section>
    )
  }
  if (s.challenge === 'sent') {
    return (
      <section className="challenge" aria-live="polite">
        <div className="challenge__head">
          <BiHourglass aria-hidden="true" className="challenge__icon" />
          <p className="challenge__title">Waiting on Paper Moon</p>
        </div>
        <p className="small">They have until <b>18:00 tomorrow</b> to confirm 14 to 23 Dec or let you go. If they let go, Halfway House books you.</p>
        <div className="clockbar" role="img" aria-label="23 hours 58 minutes left"><span style={{ width: '99%' }} /></div>
        <p className="small mono">23:58 left</p>
      </section>
    )
  }
  return (
    <section className="challenge" aria-labelledby="ch-h">
      <div className="challenge__head">
        <Avatar id="milo" size={36} />
        <p id="ch-h" className="challenge__title">Halfway House wants to book you</p>
      </div>
      <p className="small">They are on 2nd pencil for 14 to 22 Dec. Paper Moon has 1st pencil on the same days. You can challenge Paper Moon: they get 24 hours to confirm you or let you go.</p>
      <div className="challenge__actions">
        <Button size="sm" onClick={onChallenge}>Challenge Paper Moon</Button>
        <Button size="sm" variant="ghost" icon={BiXCircle} onClick={onDecline}>Not this time</Button>
      </div>
    </section>
  )
}

const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
