import { useState } from 'react'
import { statusLabel } from '../data/avails.js'
import { useStore } from '../store.jsx'
import { Avatar, HoldButton, HoldHint, Section, Tabs } from '../ui/kit.jsx'

const TODAY = '2026-11-17'
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function weeksOf(y, m) {
  const first = new Date(y, m, 1)
  const d = new Date(y, m, 1 - ((first.getDay() + 6) % 7))
  const weeks = []
  while (true) {
    const days = []
    for (let i = 0; i < 7; i++) { days.push({ iso: iso(d), n: d.getDate(), inMonth: d.getMonth() === m }); d.setDate(d.getDate() + 1) }
    weeks.push(days)
    if (d.getMonth() !== m) break
  }
  return weeks
}

// Each hold becomes a strip across the days it covers, like a stripboard laid over a diary.
function strips(holds, week) {
  return holds
    .filter((h) => h.status !== 'released')
    .map((h) => {
      const idx = week
        .map((d, i) => (d.iso >= h.from && d.iso <= h.to && (!h.weekdays || i < 5) ? i : -1))
        .filter((i) => i >= 0)
      return idx.length ? { h, a: idx[0], b: idx[idx.length - 1] } : null
    })
    .filter(Boolean)
}

export default function Avails() {
  const { s, sendChallenge, declineChallenge, releaseHold, toast } = useStore()
  const [month, setMonth] = useState('dec')
  const weeks = weeksOf(2026, month === 'nov' ? 10 : 11)
  const visible = s.holds.filter((h) => h.status !== 'released')

  return (
    <div className="page">
      <header className="mast mast--big">
        <h1 className="display">Avails</h1>
        <p className="mast__sub">Booked to 11 Dec. Open from 14 Dec, two pencils on it.</p>
      </header>
      <HoldHint />

      <Challenge
        s={s}
        onChallenge={() => { sendChallenge(); toast('Paper Moon has 24 hours to confirm or let you go') }}
        onDecline={() => { declineChallenge(); toast('Halfway House released. Paper Moon keeps 1st pencil') }}
      />

      <Tabs label="Month" value={month} onChange={setMonth} options={[{ value: 'nov', label: 'November' }, { value: 'dec', label: 'December' }]} />

      <div className="diary" role="table" aria-label={`Diary, ${month === 'nov' ? 'November' : 'December'} 2026`}>
        <div className="diary__dow mono" aria-hidden="true">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        {weeks.map((w) => {
          const st = strips(s.holds, w)
          return (
            <div key={w[0].iso} className="week" role="row">
              {w.map((d) => (
                <span key={d.iso} role="cell" className={`day mono${d.inMonth ? '' : ' is-out'}${d.iso === TODAY ? ' is-today' : ''}${d.iso < TODAY ? ' is-past' : ''}`}>{d.n}</span>
              ))}
              {st.map(({ h, a, b }) => (
                <div key={h.id} className={`bar bar--${h.status}`} style={{ gridColumn: `${a + 1} / ${b + 2}` }} role="cell" aria-label={`${h.title}, ${statusLabel[h.status]}`}>
                  <span className="bar__t">{h.title}</span>
                  {b - a >= 2 && <span className="bar__s mono">{statusLabel[h.status]}</span>}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <p className="key mono"><i className="sw sw--booked" />Booked <i className="sw sw--p1" />1st pencil <i className="sw sw--p2" />2nd pencil</p>

      <Section no="01" title="Holds" id="holds" aside={<span className="mono">{visible.length}</span>}>
        <ol className="rows">
          {visible.map((h) => (
            <li key={h.id} className="holdrow">
              <span className={`holdrow__mark bar--${h.status}`} aria-hidden="true" />
              <div className="holdrow__main">
                <p className="row__t">{h.title}</p>
                <p className="small row__s">{h.kind}, {fmt(h.from)} to {fmt(h.to)}</p>
                <p className="holdrow__state mono">{statusLabel[h.status]}{h.expires ? ` / confirm by ${h.expires}` : ''}</p>
              </div>
              {(h.status === 'pencil1' || h.status === 'pencil2') && (
                <button className="textbtn" onClick={() => { releaseHold(h.id); toast(`${h.title} released. They have been told`) }}>Release</button>
              )}
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}

function Challenge({ s, onChallenge, onDecline }) {
  if (s.challenge === 'declined') return null
  if (s.challenge === 'won') {
    return (
      <section className="block-green" aria-live="polite">
        <p className="mono small">Booked</p>
        <p className="display display--md">Halfway House it is</p>
        <p>Paper Moon let you go. 14 to 22 Dec is confirmed and the deal memo is in your inbox.</p>
      </section>
    )
  }
  if (s.challenge === 'sent') {
    return (
      <section className="block-green" aria-live="polite">
        <p className="mono small">Challenge sent to Paper Moon</p>
        <p className="countdown mono">23:58<span>left</span></p>
        <p>They confirm 14 to 23 Dec by <b>18:00 tomorrow</b> or let you go. If they let go, Halfway House books you.</p>
        <div className="countbar" aria-hidden="true"><span style={{ width: '99.8%' }} /></div>
      </section>
    )
  }
  return (
    <section className="block-green" aria-labelledby="ch-h">
      <div className="block-green__who"><Avatar id="milo" size={32} /><p className="mono small">Milo Kerr, Halfway House</p></div>
      <h2 id="ch-h" className="display display--md">Wants to book you</h2>
      <p>They are your 2nd pencil for 14 to 22 Dec. Paper Moon holds 1st pencil on the same days. Challenge them and they get 24 hours to confirm you or let go.</p>
      <div className="block-green__acts">
        <HoldButton variant="ink" onDone={onChallenge}>Challenge Paper Moon</HoldButton>
        <button className="textbtn textbtn--on-green" onClick={onDecline}>Not this time</button>
      </div>
    </section>
  )
}
