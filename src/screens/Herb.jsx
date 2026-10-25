import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Back } from '../ui/kit.jsx'
import { FLAGS, HERBS } from '../data/library.js'
import { buildRitual } from '../data/ritual.js'
import { mmss } from '../data/history.js'

const EVIDENCE = {
  Some: 'Some human studies, mostly small',
  Limited: 'A few small studies',
  Tradition: 'Traditional use, little research',
}

// The herbal protocol reads like an apothecary label: the plant, how to make it,
// how much, when, and what to watch for, checked against this person's profile.
export default function Herb() {
  const { s, set, notify } = useStore()
  const nav = useNavigate()
  const step = s.checkin ? buildRitual(s.checkin, s.flags).steps[1] : { id: 'chamomile', swapped: null }
  const h = HERBS[step.id]
  const [left, setLeft] = useState(null)
  const [brewed, setBrewed] = useState(s.done.includes('herb'))

  useEffect(() => {
    if (left === null || left <= 0) return
    const id = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(id)
  }, [left])
  useEffect(() => {
    if (left === 0) notify({ text: `${h.name} is ready. Strain it and let it cool a little.` })
  }, [left, h.name, notify])

  const mine = h.cautions.filter((c) => s.flags.includes(c.flag))
  const others = h.cautions.filter((c) => !s.flags.includes(c.flag))
  const markBrewed = () => {
    setBrewed(true)
    set((c) => ({ done: [...new Set([...c.done, 'herb'])] }))
    nav('/ritual')
    notify({ text: 'Tea made. Take it with you into the sit.' })
  }

  return (
    <div className="herb">
      <header className="bar"><Back label="Back to the ritual" /><span className="bar-title">Herbal protocol</span><span className="iconbtn-space" /></header>

      {step.swapped && (
        <p className="note warn"><Icon name="shield" /> <span>We swapped {HERBS[step.swapped.from].name.toLowerCase()} for {h.name.toLowerCase()}. {step.swapped.reason}</span></p>
      )}

      <article className="label" aria-labelledby="herb-name">
        <div className="label-top">
          <span className="label-no num">No. {Object.keys(HERBS).indexOf(step.id) + 1}</span>
          <span className="label-part">{h.part} · {h.prep}</span>
        </div>
        <h1 id="herb-name" className="serif">{h.name}</h1>
        <p className="latin serif">{h.latin}</p>
        <p className="taste">{h.taste}</p>
        <dl className="label-grid">
          <div><dt>How much</dt><dd>{h.amount}</dd></div>
          <div><dt>Steep</dt><dd className="num">{Math.round(h.steep / 60)} minutes, covered</dd></div>
          <div><dt>When</dt><dd>{h.when}</dd></div>
          <div><dt>How often</dt><dd>One cup, most days. Take a week off after three.</dd></div>
        </dl>
      </article>

      <section className="block" aria-labelledby="brew-h">
        <div className="block-head"><h2 id="brew-h">Brew it</h2></div>
        <ol className="brew">
          <li>Boil water, then let it rest for a minute.</li>
          <li>{h.amount.charAt(0).toUpperCase() + h.amount.slice(1)}.</li>
          <li>Cover the cup so the oils stay in, and start the timer.</li>
        </ol>
        <div className="steep">
          <span className="steep-time num" aria-live="polite">{mmss(left ?? h.steep)}</span>
          {left === null || left === 0 ? (
            <button className="btn soft" onClick={() => setLeft(h.steep)}><Icon name="clock" size={18} /> {left === 0 ? 'Steep again' : 'Start steeping'}</button>
          ) : (
            <button className="btn soft" onClick={() => setLeft(null)}>Stop</button>
          )}
        </div>
      </section>

      <section className="block" aria-labelledby="safe-h">
        <div className="block-head"><h2 id="safe-h">Is it right for you?</h2></div>
        {mine.length > 0 ? mine.map((c) => <p key={c.flag} className="note warn"><Icon name="alert" /> {c.text}</p>) : (
          <p className="note ok"><Icon name="shield" /> Nothing in your profile clashes with {h.name.toLowerCase()}.{s.flags.length ? ` Checked against: ${s.flags.map((f) => FLAGS.find((x) => x.id === f).label.toLowerCase()).join(', ')}.` : ''}</p>
        )}
        {others.length > 0 && (
          <ul className="cautions">{others.map((c) => <li key={c.flag}>{c.text}</li>)}</ul>
        )}
        <p className="meta small">{h.use}</p>
        <div className="evidence">
          <span className="meta small">Evidence</span>
          <span className={`ev ev-${h.evidence}`} aria-label={`${h.evidence} evidence`}>{['Tradition', 'Limited', 'Some'].map((lv, i) => <i key={lv} className={i <= ['Tradition', 'Limited', 'Some'].indexOf(h.evidence) ? 'on' : ''} />)}</span>
          <span className="small">{EVIDENCE[h.evidence]}</span>
        </div>
        <p className="meta small">Summarised from NIH NCCIH “Herbs at a Glance”. Not medical advice. Stop if you feel unwell, and ask a clinician before using herbs with medicine.</p>
      </section>

      <button className="btn primary block" onClick={markBrewed}>{brewed ? 'Brewed, back to the ritual' : 'I’ve made my cup'}</button>
    </div>
  )
}
