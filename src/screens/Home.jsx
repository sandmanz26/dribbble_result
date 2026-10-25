import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Mark, MoodIcon } from '../ui/kit.jsx'
import { MOODS } from '../data/library.js'
import { buildRitual } from '../data/ritual.js'
import { HISTORY, JOURNAL, TODAY, fmtDay, weekday } from '../data/history.js'

// Screen question: what is today's one thing to do for myself?
export default function Home() {
  const { s } = useStore()
  const nav = useNavigate()
  const evening = s.time === 'evening'
  const days = [...HISTORY, { date: TODAY, mood: s.checkin?.mood || null, minutes: s.minutesToday }]
  const fortnight = days.slice(-14)
  const shown = fortnight.filter((d) => d.mood).length
  const ritual = s.checkin ? buildRitual(s.checkin, s.flags) : null
  const doneCount = ritual ? ritual.steps.filter((st) => s.done.includes(st.kind)).length : 0
  const week = days.slice(-7)
  const weekMin = week.reduce((a, d) => a + d.minutes, 0)
  const maxMin = Math.max(20, ...week.map((d) => d.minutes))
  const counts = MOODS.map((m) => ({ ...m, n: fortnight.filter((d) => d.mood === m.id).length })).filter((m) => m.n).sort((a, b) => b.n - a.n)
  const latest = [...s.journal, ...JOURNAL][0]

  return (
    <div className="home">
      <section className={`hello ${evening ? 'f-night' : 'f-sky'}`}>
        <div className="hello-top"><Mark size={32} /><span className="meta">{fmtDay(TODAY)}</span></div>
        <h1 className="serif">{evening ? 'Good evening' : 'Good morning'}, {s.name}.</h1>
        <p className="hello-fact">You have checked in {shown} of the last 14 days. {evening ? 'Time to set the day down.' : 'One minute to begin.'}</p>

        {!ritual ? (
          <div className="hello-ask">
            <p>If today were weather, what would it be?</p>
            <div className="mini-wx">
              {MOODS.map((m) => <button key={m.id} onClick={() => nav('/check-in')} aria-label={`${m.label}, start check-in`}><Icon name={m.icon} size={22} /><span>{m.label}</span></button>)}
            </div>
            <Link to="/check-in" className="btn primary">Start the check-in</Link>
          </div>
        ) : (
          <Link to="/ritual" className="hello-ritual">
            <div>
              <span className="meta small">Today’s ritual</span>
              <strong className="serif">{ritual.name}</strong>
              <span className="meta small num">{ritual.minutes} minutes · {doneCount} of {ritual.steps.length} done</span>
            </div>
            <svg className="ring" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="27" className="ring-track" />
              <circle cx="32" cy="32" r="27" className="ring-fill" strokeDasharray={`${(doneCount / ritual.steps.length) * 169.6} 169.6`} transform="rotate(-90 32 32)" />
              <text x="32" y="37" textAnchor="middle" className="num">{doneCount}/{ritual.steps.length}</text>
            </svg>
          </Link>
        )}
      </section>

      <section className="block" aria-labelledby="wx-h">
        <div className="block-head"><h2 id="wx-h">Your fortnight, as weather</h2><span className="meta small">{counts[0] ? `Mostly ${counts[0].label.toLowerCase()}` : ''}</span></div>
        <div className="fortnight-days meta small" aria-hidden="true">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
        <ol className="fortnight">
          {days.slice(-14).map((d) => (
            <li key={d.date} className={`${d.date === TODAY ? 'today' : ''} ${d.mood ? '' : 'empty'}`} aria-label={`${fmtDay(d.date)}: ${d.mood ? MOODS.find((m) => m.id === d.mood).label : 'no check-in'}`}>
              <MoodIcon mood={d.mood} size={20} />
              <span className="d num">{Number(d.date.slice(8))}</span>
            </li>
          ))}
        </ol>
        <p className="meta small">Stormy days cluster midweek. Your evening rituals on those days ran longer, which is fine.</p>
      </section>

      <section className="block" aria-labelledby="min-h">
        <div className="block-head"><h2 id="min-h">Time you gave yourself</h2><span className="num big-figure">{weekMin}<small> min this week</small></span></div>
        <div className="bars" role="img" aria-label={`Minutes per day this week: ${week.map((d) => `${weekday(d.date)} ${d.minutes}`).join(', ')}`}>
          {week.map((d) => (
            <div key={d.date} className={`mbar ${d.date === TODAY ? 'today' : ''} ${d.minutes ? '' : 'zero'}`}>
              <div className="mcol"><b className="num">{d.minutes}</b><span style={{ height: `${(d.minutes / maxMin) * 100}%` }} /></div>
              <small className="meta tiny">{weekday(d.date)}</small>
            </div>
          ))}
        </div>
      </section>

      {latest && (
        <Link to="/journal" className="block jline">
          <span className="meta small">From your journal, {fmtDay(latest.date)}</span>
          <p className="serif">“{latest.text}”</p>
          <span className="link">Open the journal <Icon name="next" size={16} /></span>
        </Link>
      )}
    </div>
  )
}
