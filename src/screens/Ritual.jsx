import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Back } from '../ui/kit.jsx'
import { buildRitual, prompt } from '../data/ritual.js'
import { BREATHS, HERBS, SITS } from '../data/library.js'

const PATH = { breath: '/ritual/breath', herb: '/ritual/herb', sit: '/ritual/sit', journal: '/journal/new' }
const LABEL = { breath: 'Breathe', herb: 'Brew', sit: 'Sit', journal: 'Write' }

// Today's ritual as a path of coloured steps. Each step can say why it was chosen.
export default function Ritual() {
  const { s } = useStore()
  const [why, setWhy] = useState(null)
  if (!s.checkin) return <Navigate to="/check-in" replace />
  const r = buildRitual(s.checkin, s.flags)
  const next = r.steps.find((st) => !s.done.includes(st.kind))

  const detail = (st) => {
    if (st.kind === 'breath') { const b = BREATHS[st.id]; return `${b.counts[0]} in${b.counts[1] ? `, hold ${b.counts[1]}` : ''}, ${b.counts[2]} out${b.counts[3] ? `, hold ${b.counts[3]}` : ''}` }
    if (st.kind === 'herb') return `${HERBS[st.id].latin} · steeps ${st.minutes} min`
    if (st.kind === 'sit') return SITS[st.id].kind
    return prompt(s.checkin)
  }

  return (
    <div className="ritual">
      <header className="bar"><Back to="/" label="Back to today" /><span className="bar-title">Today’s ritual</span><span className="iconbtn-space" /></header>
      <div className="ritual-head">
        <h1 className="serif">{r.name}</h1>
        <p className="meta">{r.minutes} minutes in all. The tea steeps while you sit, so it adds no time.</p>
      </div>
      <ol className="path">
        {r.steps.map((st, i) => {
          const done = s.done.includes(st.kind)
          return (
            <li key={st.kind} className={`step f-${st.field} ${done ? 'done' : ''} ${next?.kind === st.kind ? 'next' : ''}`}>
              <span className="step-n num" aria-hidden="true">{done ? <Icon name="check" size={16} /> : i + 1}</span>
              <div className="step-body">
                <span className="step-kind">{LABEL[st.kind]} · <span className="num">{st.minutes} min</span>{st.parallel ? ' · while you sit' : ''}</span>
                <strong className="serif">{st.title}</strong>
                <span className="step-detail">{detail(st)}</span>
                {st.swapped && <span className="swap"><Icon name="shield" size={16} /> Swapped for your profile</span>}
                <div className="step-actions">
                  <Link to={PATH[st.kind]} className={`btn small ${next?.kind === st.kind ? 'primary' : 'soft'}`}>{done ? 'Again' : next?.kind === st.kind ? 'Start' : 'Open'}</Link>
                  <button className="btn small text" aria-expanded={why === st.kind} onClick={() => setWhy(why === st.kind ? null : st.kind)}>Why this?</button>
                </div>
                {why === st.kind && <p className="why">{st.why}{st.swapped ? ` ${st.swapped.reason}` : ''}</p>}
              </div>
            </li>
          )
        })}
      </ol>
      {!next && <p className="note ok"><Icon name="sparkle" /> Ritual complete. Same time tomorrow?</p>}
      <Link to="/check-in" className="btn quiet block"><Icon name="refresh" size={18} /> Check in again</Link>
    </div>
  )
}
