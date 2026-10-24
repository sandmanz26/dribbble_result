import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import MapArt from '../map/MapArt.jsx'
import { Seg, TopBar } from '../ui/kit.jsx'
import { PLACES, place } from '../data/places.js'
import { addDays, fmtRange, days, TODAY, usd } from '../data/groups.js'

// Start a group in three steps: where and when, who can join, and a check before it goes live.
export default function NewGroup() {
  const [params] = useSearchParams()
  const { s, set, notify } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [f, setF] = useState({
    place: params.get('place') || 'lisbon', title: '', start: addDays(TODAY, 40), end: addDays(TODAY, 46),
    cap: 5, budget: 900, who: 'verified', approve: true,
  })
  const up = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const p = place(f.place)
  const n = days(f.start, f.end)
  const datesOk = n >= 1 && f.start >= TODAY
  const title = f.title.trim() || `${p.name}, ${fmtRange(f.start, f.end)}`

  const publish = () => {
    const g = { id: `new${Date.now()}`, title, place: f.place, start: f.start, end: f.end, cap: f.cap, budget: f.budget, idOnly: f.who === 'id' }
    set({ created: [g, ...s.created] })
    notify({ text: `${title} is live. You approve every request.` })
    nav('/groups', { replace: true })
  }

  return (
    <div className="page detail has-cta">
      <TopBar title="Start a group" sub={`Step ${step + 1} of 3`} />
      <div className="onb-progress wide" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className={i <= step ? 'on' : ''} />)}</div>

      {step === 0 && (
        <div className="form">
          <label htmlFor="pl">Where</label>
          <select id="pl" value={f.place} onChange={(e) => up('place', e.target.value)}>
            {Object.keys(PLACES).map((id) => <option key={id} value={id}>{PLACES[id].name}, {PLACES[id].country}</option>)}
          </select>
          <div className="mini-map"><MapArt place={p} w={340} h={120} /></div>
          <div className="two">
            <div><label htmlFor="st">From</label><input id="st" type="date" min={TODAY} value={f.start} onChange={(e) => up('start', e.target.value)} /></div>
            <div><label htmlFor="en">To</label><input id="en" type="date" min={f.start} value={f.end} onChange={(e) => up('end', e.target.value)} /></div>
          </div>
          <p className={datesOk ? 'meta small' : 'err'} role={datesOk ? undefined : 'alert'}>{datesOk ? `${n} nights. Best months in ${p.name}: ${p.best.join(', ')}.` : 'The end date has to be after the start date.'}</p>
          <label htmlFor="ti">Name <span className="meta small">(optional)</span></label>
          <input id="ti" placeholder={`${p.name}, ${fmtRange(f.start, f.end)}`} maxLength={40} value={f.title} onChange={(e) => up('title', e.target.value)} />
        </div>
      )}

      {step === 1 && (
        <div className="form">
          <label>Who can join</label>
          <Seg label="Who can join" value={f.who} onChange={(v) => up('who', v)} options={[['verified', 'Phone and email'], ['id', 'ID verified only']]} />
          <p className="meta small">{f.who === 'id' ? 'Only travellers who passed an ID check can ask to join.' : 'Every member has a verified phone and email. ID check optional.'}</p>
          <label htmlFor="cap">Group size, including you</label>
          <div className="stepper">
            <button aria-label="Fewer" onClick={() => up('cap', Math.max(2, f.cap - 1))} disabled={f.cap <= 2}>-</button>
            <output id="cap" className="num">{f.cap}</output>
            <button aria-label="More" onClick={() => up('cap', Math.min(12, f.cap + 1))} disabled={f.cap >= 12}>+</button>
          </div>
          <label htmlFor="bu">Budget per person, no flights</label>
          <input id="bu" type="range" min={300} max={3000} step={50} value={f.budget} onChange={(e) => up('budget', Number(e.target.value))} />
          <p className="meta num">{usd(f.budget)} for {n} nights, about {usd(f.budget / Math.max(n, 1))} a day. A typical day in {p.name}: ${p.day[0]} to ${p.day[1]}.</p>
        </div>
      )}

      {step === 2 && (
        <div className="form">
          <div className="summary">
            <MapArt place={p} w={340} h={110} />
            <strong>{title}</strong>
            <span className="meta">{fmtRange(f.start, f.end)} · {n} nights · up to {f.cap} people · {usd(f.budget)} pp</span>
            <span className="meta">{f.who === 'id' ? 'ID verified travellers only' : 'Phone and email verified travellers'}</span>
          </div>
          <ul className="checklist">
            <li><Icon name="tick" /> You approve every request before anyone sees the chat</li>
            <li><Icon name="tick" /> Your phone number and email stay private</li>
            <li><Icon name="tick" /> You can remove a member or close the group at any time</li>
          </ul>
        </div>
      )}

      <div className="cta row2">
        {step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 2 ? (
          <button className="btn primary" disabled={step === 0 && !datesOk} onClick={() => setStep(step + 1)}>Continue</button>
        ) : (
          <button className="btn primary" onClick={publish}>Publish group</button>
        )}
      </div>
    </div>
  )
}
