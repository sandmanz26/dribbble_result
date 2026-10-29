import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { AREAS, areaOf, TYPE_NAME } from '../data/areas.js'
import { EXERCISES, exerciseOf } from '../data/exercises.js'
import { W, H, calibrate, unproject } from '../lib/geo.js'
import Overlay from '../ui/Overlay.jsx'
import Result from './Result.jsx'
import * as I from '../ui/icons.js'

const STEPS = ['Area', 'Photo', 'Read', 'Exercise', 'Setup']

export default function NewSetup() {
  const loc = useLocation()
  const nav = useNavigate()
  const { s, dispatch } = useStore()
  const q = new URLSearchParams(loc.search)
  const [areaId, setAreaId] = useState(q.get('area'))
  const [step, setStep] = useState(q.get('area') ? 1 : 0)
  const [own, setOwn] = useState(null) // { src, cam, anchor, second } for a photo taken now
  const [exId, setExId] = useState(q.get('exercise'))
  const [variant, setVariant] = useState(0)
  const [overrides, setOverrides] = useState({})
  const [saving, setSaving] = useState(false)
  const [group, setGroup] = useState('')
  const sample = areaId ? areaOf(areaId) : null

  // The area as the AI sees it now: the sample photo's reading, or the coach's own calibrated photo.
  const area = useMemo(() => {
    if (!sample) return null
    if (!own?.cam) return sample
    const a = unproject(own.cam, own.anchor.x, own.anchor.y); const b = unproject(own.cam, own.second.x, own.second.y)
    return { ...sample, cam: own.cam, hole: a, ball: a, start: b, bag: { X: 99, Z: 99 }, holePx: own.anchor, photo: own.src,
      seen: [{ what: 'Scale', how: `From your two taps, ${own.metres} m apart`, sure: 'Your measurement' }, { what: sample.type === 'putt' || sample.type === 'chip' ? 'Hole' : 'Ball spot', how: 'Where you tapped first', sure: 'Your mark' }, { what: 'Slope', how: 'Not read: no mowing lines or shadow to go on', sure: 'Unknown' }] }
  }, [sample, own])

  useEffect(() => { if (q.get('exercise') && areaId && step === 1 && sample?.photo) { setStep(4) } }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const go = (n) => setStep(n)
  const back = () => (step === 0 ? nav('/') : go(step === 4 && !exId ? 3 : step - 1))
  const ex = exId ? exerciseOf(exId) : null
  const photo = own?.src || sample?.photo

  return (
    <div className="flow">
      <header className="flow-top">
        <button className="icon-btn" onClick={back} aria-label="Back"><I.Back aria-hidden="true" /></button>
        <ol className="steps" aria-label="Steps">{STEPS.map((x, i) => <li key={x} className={i < step ? 'is-done' : i === step ? 'is-now' : ''} aria-current={i === step ? 'step' : undefined}><span>{x}</span></li>)}</ol>
        <Link to="/" className="icon-btn" aria-label="Close"><I.Close aria-hidden="true" /></Link>
      </header>

      {step === 0 && (
        <section className="pane">
          <h1>Where are you setting up?</h1>
          <ul className="area-list">
            {AREAS.map((a) => (
              <li key={a.id}><button className="area-row" onClick={() => { setAreaId(a.id); setOwn(null); setExId(null); go(1) }}>
                {a.photo ? <img src={`img/${a.photo}.webp`} alt="" /> : <span className="area-none"><I.Camera aria-hidden="true" /></span>}
                <span><b>{a.name}</b><small>{a.where} · {TYPE_NAME[a.type]}</small></span><I.Right aria-hidden="true" />
              </button></li>
            ))}
          </ul>
        </section>
      )}

      {step === 1 && sample && <PhotoStep area={sample} own={own} setOwn={setOwn} onUse={() => go(2)} />}

      {step === 2 && area && <ReadStep area={area} photo={photo} onNext={() => go(3)} />}

      {step === 3 && area && (
        <section className="pane">
          <h1>Pick the exercise</h1>
          <p className="lede"><I.Sync aria-hidden="true" /> From your bank in Øvelsesbanken, {TYPE_NAME[area.type].toLowerCase()} first.</p>
          <ul className="ex-list">
            {EXERCISES.filter((e) => e.type === area.type).map((e) => (
              <li key={e.id}><button className="ex-row" disabled={!e.layout} onClick={() => { setExId(e.id); setVariant(0); setOverrides({}); go(4) }}>
                <span><b>{e.name}</b><small>{e.minutes} min · {e.players} players · {e.id}</small>{!e.layout && <em>{e.needs || 'Needs another area'}</em>}</span>
                {e.layout ? <I.Right aria-hidden="true" /> : <I.Warn aria-hidden="true" />}
              </button></li>
            ))}
          </ul>
          <details className="other"><summary>Exercises for other areas</summary>
            <ul className="ex-list is-dim">{EXERCISES.filter((e) => e.type !== area.type).map((e) => <li key={e.id} className="ex-row is-static"><span><b>{e.name}</b><small>{TYPE_NAME[e.type]}</small></span></li>)}</ul>
          </details>
        </section>
      )}

      {step === 4 && area && ex && (
        <Result area={area} photo={photo} cam={area.cam} exercise={ex} variant={variant} setVariant={setVariant} overrides={overrides} setOverrides={setOverrides}
          actions={(
            <div className="savebar">
              {saving ? (
                <form className="save-form" onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'save', setup: { area: area.id, exercise: ex.id, variant, overrides, created: 'Today, just now', group, own: !!own } }); nav(`/setup/S-${String(s.seq + 1).padStart(3, '0')}`) }}>
                  <label><span>For which group? (optional)</span><input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Juniors U16, private lesson…" autoFocus /></label>
                  <button className="btn is-primary" type="submit"><I.Save aria-hidden="true" /> Save setup</button>
                </form>
              ) : <button className="btn is-primary is-wide" onClick={() => setSaving(true)}><I.Save aria-hidden="true" /> Save setup</button>}
            </div>
          )} />
      )}
    </div>
  )
}

function PhotoStep({ area, own, setOwn, onUse }) {
  const file = useRef(null)
  const [taps, setTaps] = useState([])
  const [metres, setMetres] = useState(2)
  const img = useRef(null)
  const pick = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    setTaps([]); setOwn({ src: URL.createObjectURL(f) })
  }
  const tap = (e) => {
    if (!own || taps.length >= 2) return
    const r = img.current.getBoundingClientRect()
    // The photo is shown as cover in a 4:3 box, the same box the markers are drawn in.
    const k = Math.max(r.width / W, r.height / H); const ox = (r.width - W * k) / 2; const oy = (r.height - H * k) / 2
    setTaps([...taps, { x: (e.clientX - r.left - ox) / k, y: (e.clientY - r.top - oy) / k }])
  }
  const first = area.type === 'putt' || area.type === 'chip' ? 'the hole' : 'where the ball sits'
  const second = area.type === 'chip' ? 'where the ball will be' : 'a spot you know the distance to'
  return (
    <section className="pane">
      <h1>{area.name}</h1>
      {!own ? (
        <>
          {area.photo ? (
            <>
              <div className="photo-wrap"><Overlay area={area.id} photo={area.photo} cam={area.cam} /></div>
              <p className="lede">Last photo {area.taken.toLowerCase()}. If the area looks the same today, use it.</p>
              <button className="btn is-primary is-wide" onClick={onUse}><I.Check aria-hidden="true" /> Use this photo</button>
            </>
          ) : (
            <div className="no-photo"><I.Camera aria-hidden="true" /><p>No photo of the {area.name.toLowerCase()} yet. Stand where the players will stand and take one, landscape, with the floor in view.</p></div>
          )}
          <button className="btn is-wide" onClick={() => file.current?.click()}><I.Camera aria-hidden="true" /> Take a new photo</button>
          <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
          <p className="fine">Tip: stand behind the ball, looking at the target, phone at chest height. Include the hole, a ball or the mat so the AI can measure.</p>
        </>
      ) : (
        <>
          <div className="photo-wrap tap-area" ref={img} onClick={tap} role="button" tabIndex={0} aria-label="Tap on the photo">
            <Overlay area={area.id} photo={own.src} cam={{ cx: 600, yh: 200, f: 1000, h: 1.5 }} />
            <svg className="taps" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">{taps.map((t, i) => <g key={i}><circle cx={t.x} cy={t.y} r="22" /><text x={t.x} y={t.y + 9}>{i + 1}</text></g>)}</svg>
          </div>
          <div className="note is-warn"><I.Info aria-hidden="true" /><p>I could not find a hole, a ball or a mat in this photo to measure from, so I need two taps from you.</p></div>
          <ol className="tap-steps">
            <li className={taps.length > 0 ? 'is-done' : 'is-now'}>Tap {first}.</li>
            <li className={taps.length > 1 ? 'is-done' : taps.length === 1 ? 'is-now' : ''}>Tap {second}.</li>
            <li className={taps.length > 1 ? 'is-now' : ''}>How far apart are they?
              <div className="chips">{[1, 2, 3, 5, 10].map((m) => <button key={m} className={`chip ${metres === m ? 'is-on' : ''}`} aria-pressed={metres === m} onClick={() => setMetres(m)}>{m} m</button>)}</div>
            </li>
          </ol>
          <div className="row">
            <button className="btn" onClick={() => setTaps([])} disabled={!taps.length}><I.Undo aria-hidden="true" /> Tap again</button>
            <button className="btn is-primary" disabled={taps.length < 2} onClick={() => { setOwn({ ...own, cam: calibrate(taps[0], taps[1], metres), anchor: taps[0], second: taps[1], metres }); onUse() }}>Measure</button>
          </div>
        </>
      )}
    </section>
  )
}

function ReadStep({ area, photo, onNext }) {
  const steps = ['Finding the ground', 'Measuring from something of known size', 'Reading the slope', 'Looking for anything in the way']
  const [k, setK] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setK(steps.length); return }
    const id = setInterval(() => setK((x) => { if (x >= steps.length) { clearInterval(id); return x } return x + 1 }), 450)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const done = k >= steps.length
  return (
    <section className="pane">
      <h1>Reading the photo</h1>
      <div className="photo-wrap"><Overlay area={area.id} photo={photo} cam={area.cam} seen={done && !area.photo?.startsWith?.('blob:')} />{!done && <span className="scanline" aria-hidden="true" />}</div>
      {!done ? (
        <ul className="reading" aria-live="polite">{steps.map((x, i) => <li key={x} className={i < k ? 'is-done' : i === k ? 'is-now' : ''}>{i < k ? <I.Check aria-hidden="true" /> : <I.Scan aria-hidden="true" />}{x}</li>)}</ul>
      ) : (
        <>
          <ul className="seen-list">{area.seen.map((x) => <li key={x.what}><span><b>{x.what}</b><small>{x.how}</small></span><span className={`sure ${x.sure === 'Sure' ? '' : 'is-est'}`}>{x.sure}</span></li>)}</ul>
          <button className="btn is-primary is-wide" onClick={onNext}>Looks right, pick the exercise</button>
        </>
      )}
    </section>
  )
}
