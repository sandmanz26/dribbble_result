import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Back } from '../ui/kit.jsx'
import { Print } from '../ui/Print.jsx'
import { buildRitual, prompt } from '../data/ritual.js'
import { BREATHS, HERBS, MOODS, SITS } from '../data/library.js'
import { TODAY, daySeed, fmtDay } from '../data/history.js'

const PATH = { breath: '/ritual/breath', herb: '/ritual/herb', sit: '/ritual/sit', journal: '/journal/new' }
const LABEL = { breath: 'Breathe', herb: 'Brew', sit: 'Sit', journal: 'Write' }

// Today's ritual reads like the label on the print: prepared for you, today, with each step's
// time in the margin. The step to do now is open and says why it was chosen; the others are lines.
export default function Ritual() {
  const { s } = useStore()
  const [open, setOpen] = useState(null)
  if (!s.checkin) return <Navigate to="/check-in" replace />
  const r = buildRitual(s.checkin, s.flags)
  const next = r.steps.find((st) => !s.done.includes(st.kind))
  const herb = r.steps.find((st) => st.kind === 'herb').id
  const mood = MOODS.find((m) => m.id === s.checkin.mood)

  const detail = (st) => {
    if (st.kind === 'breath') { const b = BREATHS[st.id]; return `${b.counts[0]} in${b.counts[1] ? `, hold ${b.counts[1]}` : ''}, ${b.counts[2]} out${b.counts[3] ? `, hold ${b.counts[3]}` : ''}` }
    if (st.kind === 'herb') return `${HERBS[st.id].latin}, steeps while you sit`
    if (st.kind === 'sit') return SITS[st.id].line
    return prompt(s.checkin)
  }

  return (
    <div className="ritual">
      <header className="bar"><Back to="/" label="Back to today" /><span className="bar-title">Today’s ritual</span><span className="iconbtn-space" /></header>
      <Print mood={s.checkin.mood} herb={herb} seed={daySeed(TODAY)} size="hero">
        <div style={{ display: 'grid', gap: 8 }}>
          <h1 className="print-title">{r.name}</h1>
          <p className="print-line">Prepared for {s.name}, {fmtDay(TODAY)}. {mood.label}.</p>
        </div>
      </Print>
      <p className="under-print num" style={{ margin: '12px 20px 0' }}>{r.minutes} minutes in all. The tea steeps while you sit, so it adds no time.</p>

      <ol className="steps">
        {r.steps.map((st) => {
          const done = s.done.includes(st.kind)
          const isNext = next?.kind === st.kind
          const showWhy = isNext || open === st.kind
          return (
            <li key={st.kind} className={`st ${done ? 'done' : ''} ${isNext ? 'next' : ''}`}>
              <span className="st-min"><b className="num">{st.minutes}</b><small>min</small></span>
              <div className="st-body">
                <span className="st-kind">{isNext ? `Now · ${LABEL[st.kind]}` : LABEL[st.kind]}{st.parallel ? ' · while you sit' : ''}{done ? ' · done' : ''}</span>
                <Link to={PATH[st.kind]}><strong>{st.title}</strong></Link>
                <span className="st-detail">{detail(st)}</span>
                {st.swapped && <span className="swap"><Icon name="shield" size={16} /> Swapped for your profile</span>}
                {showWhy ? <p className="why"><b>Why this</b>{st.why}{st.swapped ? ` ${st.swapped.reason}` : ''}</p> : null}
                <div className="st-actions">
                  {isNext && <Link to={PATH[st.kind]} className="btn primary">Start</Link>}
                  {!isNext && <button className="btn text" aria-expanded={showWhy} onClick={() => setOpen(showWhy ? null : st.kind)}>{showWhy ? 'Hide why' : 'Why this?'}</button>}
                </div>
              </div>
              <span className="st-state" aria-hidden="true">{done ? <Icon name="check" size={20} /> : <Icon name="next" size={18} />}</span>
            </li>
          )
        })}
      </ol>
      <div className="ritual-foot">
        {!next && <p className="note"><Icon name="check" /> All four steps done. Today’s print goes into the journal.</p>}
        <Link to="/check-in" className="btn text"><Icon name="refresh" size={18} /> Check in again</Link>
      </div>
    </div>
  )
}
