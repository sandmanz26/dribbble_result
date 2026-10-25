import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Mark } from '../ui/kit.jsx'
import { Print } from '../ui/Print.jsx'
import { MOODS } from '../data/library.js'
import { buildRitual } from '../data/ritual.js'
import { HISTORY, JOURNAL, TODAY, fmtDay, weekday, daySeed } from '../data/history.js'

const MIDWEEK = ['Tue', 'Wed', 'Thu']

// Screen question: has today been printed yet, and what is today's one thing to do?
export default function Home() {
  const { s } = useStore()
  const nav = useNavigate()
  const evening = s.time === 'evening'
  const ritual = s.checkin ? buildRitual(s.checkin, s.flags) : null
  const herb = ritual ? ritual.steps.find((st) => st.kind === 'herb').id : null
  const days = [...HISTORY, { date: TODAY, mood: s.checkin?.mood || null, minutes: s.minutesToday, herb }]
  const fortnight = days.slice(-14)
  const shown = fortnight.filter((d) => d.mood).length
  const doneCount = ritual ? ritual.steps.filter((st) => s.done.includes(st.kind)).length : 0
  const week = days.slice(-7)
  const weekMin = week.reduce((a, d) => a + d.minutes, 0)
  const maxMin = Math.max(20, ...week.map((d) => d.minutes))
  const storms = fortnight.filter((d) => d.mood === 'stormy')
  const midweek = storms.length > 1 && storms.every((d) => MIDWEEK.includes(weekday(d.date)))
  const latest = [...s.journal, ...JOURNAL][0]

  return (
    <div className="home">
      <section className="hello" aria-labelledby="hello-h">
        <div className="home-top"><span className="brand"><Mark size={26} />Tend</span><span className="meta">{fmtDay(TODAY)}</span></div>
        <h1 id="hello-h">{evening ? 'Good evening' : 'Good morning'}, {s.name}.</h1>
        <p className="hello-sub">You have checked in on {shown} of the last 14 days.</p>

        {!ritual ? (
          <>
            <Print mood="none" herb="chamomile" seed={daySeed(TODAY)} size="hero" className="copy-wide">
              <h2 className="print-title">What’s today’s weather?</h2>
            </Print>
            <div className="moods" role="group" aria-label="Today as weather. Starts the check-in">
              {MOODS.map((m) => (
                <button key={m.id} className={`ex-${m.id}`} onClick={() => nav('/check-in', { state: { mood: m.id } })}>
                  <span className="sw" aria-hidden="true" />{m.label}
                </button>
              ))}
            </div>
            <p className="meta" style={{ marginTop: -4 }}>How you feel, as weather. Tap one to start: five questions, about a minute.</p>
          </>
        ) : (
          <Link to="/ritual" className="today-print" aria-label={`Today’s ritual, ${ritual.name}, ${doneCount} of ${ritual.steps.length} done`}>
            <Print mood={s.checkin.mood} herb={herb} seed={daySeed(TODAY)} size="hero">
              <div style={{ display: 'grid', gap: 10 }}>
                <h2 className="print-title">{ritual.name}</h2>
                <p className="print-line num">{MOODS.find((m) => m.id === s.checkin.mood).label} · {ritual.minutes} minutes · {doneCount} of {ritual.steps.length} done</p>
                <span className="prog" style={{ '--n': ritual.steps.length }} aria-hidden="true">{ritual.steps.map((st) => <i key={st.kind} className={s.done.includes(st.kind) ? 'on' : ''} />)}</span>
              </div>
            </Print>
          </Link>
        )}
      </section>

      <section className="sec" aria-labelledby="hb-h">
        <div className="sec-head"><h2 id="hb-h">The last two weeks</h2><Link to="/journal" className="link">Journal</Link></div>
        <p className="finding">
          {storms.length === 0 ? 'No stormy days in the last two weeks.'
            : midweek ? `Stormy on ${storms.length} days, all between Tuesday and Thursday. Midweek is where the long exhale has been doing its work.`
              : `Stormy on ${storms.length} ${storms.length === 1 ? 'day' : 'days'} in the last two weeks.`}
        </p>
        <div className="herbarium-days" aria-hidden="true">{fortnight.slice(0, 7).map((d) => <span key={d.date}>{weekday(d.date).slice(0, 2)}</span>)}</div>
        <ol className="herbarium">
          {fortnight.map((d) => (
            <li key={d.date} className={`${d.date === TODAY ? 'today' : ''} ${d.mood ? '' : 'blank'}`} aria-label={`${fmtDay(d.date)}: ${d.mood ? MOODS.find((m) => m.id === d.mood).label : 'no check-in'}`}>
              <Print mood={d.mood || 'none'} herb={d.herb} seed={daySeed(d.date)} size="chip"><span className="d num">{Number(d.date.slice(8))}</span></Print>
            </li>
          ))}
        </ol>
        <div className="key" aria-label="Key">{MOODS.map((m) => <span key={m.id} className={`ex-${m.id}`}><i aria-hidden="true" />{m.label}</span>)}</div>
      </section>

      <section className="sec" aria-labelledby="min-h">
        <div className="sec-head"><h2 id="min-h">Time you gave yourself</h2></div>
        <p className="figure num">{weekMin}<small> min in the last 7 days</small></p>
        <div className="bars" role="img" aria-label={`Minutes per day: ${week.map((d) => `${weekday(d.date)} ${d.minutes}`).join(', ')}`}>
          {week.map((d) => (
            <div key={d.date} className={`mbar ${d.date === TODAY ? 'today' : ''} ${d.minutes ? '' : 'zero'}`}>
              <div className="mcol"><b className="num">{d.minutes}</b><span style={{ height: `${(d.minutes / maxMin) * 100}%` }} /></div>
              <small>{d.date === TODAY ? 'Today' : weekday(d.date)}</small>
            </div>
          ))}
        </div>
      </section>

      {latest && (
        <Link to="/journal" className="quote">
          <span className="meta small">From your journal, {fmtDay(latest.date)}</span>
          <p>“{latest.text}”</p>
          <span className="link">Open the journal <Icon name="next" size={16} /></span>
        </Link>
      )}
    </div>
  )
}
