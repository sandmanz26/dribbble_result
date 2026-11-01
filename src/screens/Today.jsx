import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiBus, BiCar, BiDirections, BiMapPin, BiPlusMedical, BiSend, BiTime, BiInfoCircle } from 'react-icons/bi'
import { callSheet as cs, production, pages } from '../data/day.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Button, Frame, Section, Sheet } from '../ui/kit.jsx'

const NOW = { precall: '05:42', rolling: '10:05', wrapped: '19:20' }
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m) % 60).padStart(2, '0')}`
const span = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m} min`)

// The day as an edit timeline. Scenes end where the next block starts.
const T0 = toMin('05:00')
const T1 = toMin('21:00')
const PX = 1.5 // pixels per minute
const unit = [
  { id: 'bf', label: 'Breakfast', from: '06:00', to: '06:45' },
  { id: 'lunch', label: 'Lunch', from: '13:00', to: '14:00' },
]
const sceneEnds = { 41: '09:40', 42: '11:30', 18: '13:00', 57: '17:45', 58: '19:00' }
const scenes = cs.scenes.map((s) => ({ ...s, from: s.start, to: sceneEnds[s.id] }))
const totalEighths = cs.scenes.reduce((n, x) => n + x.eighths, 0)
const nickTip = {
  'Abby Singer': 'The second to last shot of the day, named after the assistant director who always called it.',
  'Martini shot': 'The last shot of the day. The next one is in a glass.',
}

function at(m) {
  const sc = scenes.find((s) => m >= toMin(s.from) && m < toMin(s.to))
  const u = unit.find((s) => m >= toMin(s.from) && m < toMin(s.to))
  const sun = m >= toMin(cs.sunrise) && m < toMin(cs.sunset)
  let what
  if (u) what = { title: u.label, line: u.id === 'lunch' ? 'Unit lunch at base. Blackout drapes must be up on the office set.' : 'At unit base, car park B.' }
  else if (sc) what = { title: `Scene ${sc.id}`, line: `${sc.ie}/${sc.dn}, ${sc.set}. ${sc.what}. Cast ${sc.cast.join(', ')}.` }
  else if (m < toMin(cs.myCall)) what = { title: 'Before your call', line: `You are due at ${cs.myCall}, unit call ${cs.unitCall}.` }
  else if (m < toMin(cs.unitCall)) what = { title: 'Pre-call', line: cs.myCallNote + '.' }
  else if (m >= toMin('19:00')) what = { title: 'Wrap', line: 'De-rig the office set, trucks loaded by 20:00.' }
  else what = { title: 'Turning over', line: 'Unit call. First setup on the main floor.' }
  const sunLine = sun ? `Daylight, ${span(toMin(cs.sunset) - Math.round(m))} left` : m < toMin(cs.sunrise) ? `Dark, sunrise ${cs.sunrise}` : `Dark since ${cs.sunset}`
  return { ...what, sunLine }
}

export default function Today() {
  const { s } = useStore()
  const me = people[s.as === 'production' ? 'kofi' : 'mara']
  const [late, setLate] = useState(false)
  const [crew, setCrew] = useState(false)
  const wrapped = s.scene === 'wrapped'

  return (
    <div className="page page--today">
      <header className="mast">
        <p className="mast__line mono">
          <span>Tue 17 Nov</span>
          <span>{production.title} / day {production.day} of {production.days}</span>
        </p>
        <Link to="/me" className="mast__me" aria-label="Your profile"><Avatar id={me.id} size={36} /></Link>
      </header>

      {s.scene === 'precall' && <PreCall onLate={() => setLate(true)} />}
      {s.scene === 'rolling' && <Rolling />}
      {wrapped && <Wrapped />}

      <Timeline key={s.scene} now={toMin(NOW[s.scene])} />

      {s.as === 'production' && (
        <Section no="02" title="Arrivals" id="arr" aside={<span className="mono">61/64 in</span>}>
          <ul className="rows">
            <li className="row"><Avatar id="mara" size={36} /><div><p className="row__t">Mara Ilić, gaffer</p><p className="row__s">20 min late, traffic. Arlo starts the pre-rig</p></div></li>
            <li className="row"><Avatar id="theo" size={36} /><div><p className="row__t">Theo Lund, electrician</p><p className="row__s">On the DLR, due 06:38</p></div></li>
          </ul>
        </Section>
      )}

      {!wrapped && <Location />}

      {!wrapped && (
        <Section no="04" title="Stripboard" id="sch" aside={<span className="mono">{pages(totalEighths)} pg</span>}>
          <ol className="board">
            {scenes.map((sc) => <Strip key={sc.id} sc={sc} scene={s.scene} />)}
          </ol>
          <p className="key mono"><i className="sw sw--di" />Day int <i className="sw sw--de" />Day ext <i className="sw sw--ni" />Night int</p>
        </Section>
      )}

      {!wrapped && (
        <Section no="05" title="From the ADs" id="notes">
          <ol className="notes">{cs.notes.map((n, i) => <li key={n}><span className="mono">{i + 1}</span>{n}</li>)}</ol>
        </Section>
      )}

      <Section no={wrapped ? '02' : '06'} title="On the call sheet" id="crew" aside={<button className="textbtn" onClick={() => setCrew(true)}>All {cs.onSet.length}</button>}>
        <div className="faces">
          {cs.onSet.slice(0, 6).map((id) => (
            <div key={id} className="face"><Avatar id={id} size={52} /><span>{people[id].name.split(' ')[0]}</span></div>
          ))}
        </div>
      </Section>

      <LateSheet open={late} onClose={() => setLate(false)} />
      <Sheet open={crew} onClose={() => setCrew(false)} title="On today's call sheet">
        <ul className="rows">
          {cs.onSet.map((id) => (
            <li key={id} className="row"><Avatar id={id} size={40} /><div><p className="row__t">{people[id].name}</p><p className="row__s">{people[id].role}</p></div></li>
          ))}
        </ul>
      </Sheet>
    </div>
  )
}

function PreCall({ onLate }) {
  const { s, toast } = useStore()
  return (
    <section className="hero-call" aria-labelledby="call-h">
      <h1 id="call-h" className="sr-only">Your call is {cs.myCall}</h1>
      <p className="hero-call__label mono"><span>Your call</span><span className="tally">in 48 min</span></p>
      <p className="giant" aria-hidden="true">06<span className="giant__colon">:</span>30</p>
      <p className="hero-call__note">{cs.myCallNote}. Unit call {cs.unitCall}, breakfast from 06:00.</p>
      {s.late && <p className="flag mono" role="status">Ines knows you are {s.late.mins} min late</p>}
      <div className="duo">
        <Button variant="green" icon={BiDirections} onClick={() => toast('Opens your maps app with the unit base, not the set')}>Directions</Button>
        <Button variant="line" icon={BiTime} onClick={onLate}>{s.late ? 'Update' : 'Running late'}</Button>
      </div>
    </section>
  )
}

function Rolling() {
  const done = scenes.filter((x) => x.status === 'done').reduce((n, x) => n + x.eighths, 0)
  return (
    <section className="hero-call" aria-labelledby="roll-h">
      <p className="hero-call__label mono"><span><i className="live" aria-hidden="true" />Rolling</span><span className="tally tally--line">15 min behind</span></p>
      <h1 id="roll-h" className="giant giant--word">Sc 42</h1>
      <p className="hero-call__note">Ada and Pell argue over the ledger. Main floor, haze in.</p>
      <div className="pagebar" role="img" aria-label={`${pages(done)} of ${pages(totalEighths)} pages shot`}>
        {scenes.map((x) => <span key={x.id} className={`pagebar__seg is-${x.status}`} style={{ flex: x.eighths }} />)}
      </div>
      <p className="hero-call__note"><b>{pages(done)} of {pages(totalEighths)} pages</b> in the can. Next for lighting: scene 18 at 11:30, one 4K through the side gate.</p>
    </section>
  )
}

function Wrapped() {
  const { toast } = useStore()
  return (
    <section className="hero-call" aria-labelledby="wrap-h">
      <p className="hero-call__label mono"><span>Wrapped 19:20</span><span className="tally">Day 14 done</span></p>
      <h1 id="wrap-h" className="giant giant--word">Wrap</h1>
      <dl className="ledger">
        <div><dt>On the clock</dt><dd>12h 50m</dd></div>
        <div><dt>Overtime</dt><dd>1h 50m</dd></div>
        <div><dt>Turnaround</dt><dd>11h</dd></div>
        <div><dt>Earliest call</dt><dd>06:20</dd></div>
      </dl>
      <p className="hero-call__note">All 5 scenes shot, {pages(totalEighths)} pages. Tomorrow's call sheet is out: you are on at 07:30, same location.</p>
      <div className="duo duo--one">
        <Button variant="green" icon={BiSend} onClick={() => toast('Timesheet sent to Kofi for approval')}>Send timesheet</Button>
      </div>
    </section>
  )
}

// Scrub the day: the playhead stays in the middle and the day slides under it.
function Timeline({ now }) {
  const ref = useRef(null)
  const [t, setT] = useState(now)
  const [pad, setPad] = useState(160)
  const width = (T1 - T0) * PX

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setPad(el.clientWidth / 2)
    requestAnimationFrame(() => { el.scrollLeft = (now - T0) * PX })
  }, [now])

  const onScroll = () => setT(Math.max(T0, Math.min(T1, T0 + ref.current.scrollLeft / PX)))
  const jump = (m) => ref.current?.scrollTo({ left: (m - T0) * PX, behavior: 'smooth' })
  const info = useMemo(() => at(t), [t])
  const away = Math.abs(t - now) > 4
  const hours = []
  for (let h = 5; h <= 21; h++) hours.push(h)
  const x = (m) => (m - T0) * PX

  return (
    <Section no="01" title="The day" id="day" aside={away ? <button className="textbtn" onClick={() => jump(now)}>Back to now</button> : <span className="mono">Now</span>}>
      <div className="tl">
        <div className="tl__readout" aria-live="polite">
          <p className="tl__time">{fmt(Math.round(t / 5) * 5)}</p>
          <div>
            <p className="tl__what">{info.title}</p>
            <p className="tl__line">{info.line}</p>
            <p className="tl__sun mono">{info.sunLine}</p>
          </div>
        </div>
        <div className="tl__view">
          <div
            className="tl__scroll"
            ref={ref}
            onScroll={onScroll}
            onPointerDown={(e) => {
              // Touch scrolls natively; a mouse drags the day like a scrub bar.
              if (e.pointerType !== 'mouse') return
              const el = ref.current
              const x0 = e.clientX, s0 = el.scrollLeft
              el.classList.add('is-drag')
              const move = (ev) => { el.scrollLeft = s0 - (ev.clientX - x0) }
              const up = () => { el.classList.remove('is-drag'); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
              window.addEventListener('pointermove', move)
              window.addEventListener('pointerup', up)
            }}
            tabIndex={0}
            role="slider"
            aria-label="Time of day. Scroll, drag or use the arrow keys"
            aria-valuemin={T0}
            aria-valuemax={T1}
            aria-valuenow={Math.round(t)}
            aria-valuetext={fmt(Math.round(t))}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); jump(t + 15) }
              if (e.key === 'ArrowLeft') { e.preventDefault(); jump(t - 15) }
            }}
          >
            <div className="tl__track" style={{ width: width + pad * 2, paddingInline: pad }}>
              <div className="tl__inner" style={{ width }}>
                <div className="tl__sunband" style={{ left: x(toMin(cs.sunrise)), width: (toMin(cs.sunset) - toMin(cs.sunrise)) * PX }} />
                <div className="tl__ruler">
                  {hours.map((h) => <span key={h} className="tl__hour mono" style={{ left: x(h * 60) }}>{String(h).padStart(2, '0')}</span>)}
                </div>
                <div className="tl__lane tl__lane--unit">
                  {unit.map((u) => (
                    <span key={u.id} className="tl__clip tl__clip--unit" style={{ left: x(toMin(u.from)), width: (toMin(u.to) - toMin(u.from)) * PX - 2 }}>{u.label}</span>
                  ))}
                  <span className="tl__pin tl__pin--me mono" style={{ left: x(toMin(cs.myCall)) }}>Call</span>
                  <span className="tl__pin mono" style={{ left: x(toMin(cs.unitCall)) }}>Unit</span>
                  <span className="tl__pin mono" style={{ left: x(toMin(cs.wrap)) }}>Wrap</span>
                </div>
                <div className="tl__lane">
                  {scenes.map((sc) => {
                    const tone = sc.dn === 'NIGHT' ? 'ni' : sc.ie === 'EXT' ? 'de' : 'di'
                    const st = toMin(sc.to) <= now ? ' is-done' : toMin(sc.from) <= now ? ' is-now' : ''
                    return (
                      <span key={sc.id} className={`tl__clip tl__clip--${tone}${st}`} style={{ left: x(toMin(sc.from)), width: (toMin(sc.to) - toMin(sc.from)) * PX - 2 }}>
                        <b className="mono">{sc.id}</b><span className="mono">{pages(sc.eighths)}</span>
                      </span>
                    )
                  })}
                </div>
                <span className="tl__now" style={{ left: x(now) }} aria-hidden="true" />
              </div>
            </div>
          </div>
          <span className="tl__head" aria-hidden="true" />
        </div>
        <p className="tl__help mono">Drag the day under the playhead</p>
      </div>
    </Section>
  )
}

function Location() {
  const l = cs.location
  return (
    <Section no="03" title="Location" id="loc">
      <Frame name={l.photo} small alt="Brick warehouse on Wharf Road" burn="LOC 04 / RECCE" tc="11.09.26" className="frame--loc" />
      <p className="loc__name">{l.name}</p>
      <p className="row__s">{l.address}</p>
      <p className="row__s small">{cs.weather.text}, wind {cs.weather.wind}.</p>
      <ul className="rows rows--icons">
        <li className="row"><BiMapPin aria-hidden="true" /><p>{l.base}</p></li>
        <li className="row"><BiCar aria-hidden="true" /><p>{l.parking}</p></li>
        <li className="row"><BiBus aria-hidden="true" /><p>{l.transit}</p></li>
        <li className="row row--safety"><BiPlusMedical aria-hidden="true" /><p><b>Nearest A&E</b> {l.hospital}</p></li>
      </ul>
      <dl className="ledger ledger--3">
        <div><dt>Sunrise</dt><dd>{cs.sunrise}</dd></div>
        <div><dt>Sunset</dt><dd>{cs.sunset}</dd></div>
        <div><dt>Weather</dt><dd>{cs.weather.temp}°C</dd></div>
      </dl>
    </Section>
  )
}

function Strip({ sc, scene }) {
  const [info, setInfo] = useState(false)
  const tone = sc.dn === 'NIGHT' ? 'ni' : sc.ie === 'EXT' ? 'de' : 'di'
  const status = scene === 'rolling' ? sc.status : 'next'
  return (
    <li className={`strip strip--${tone} is-${status}`}>
      <span className="strip__no mono">{sc.id}</span>
      <div className="strip__main">
        <p className="strip__set mono">{sc.ie}/{sc.dn} &nbsp;{sc.set}</p>
        <p className="strip__what">{sc.what}</p>
        {sc.nick && (
          <button className="nick mono" onClick={() => setInfo((v) => !v)} aria-expanded={info}>
            {sc.nick} <BiInfoCircle aria-hidden="true" />
          </button>
        )}
        {info && <p className="strip__tip">{nickTip[sc.nick]}</p>}
      </div>
      <div className="strip__side mono">
        <span>{sc.start}</span>
        <span>{pages(sc.eighths)}</span>
        {status === 'now' && <span className="tag tag--green">Now</span>}
        {status === 'done' && <span className="tag">Shot</span>}
      </div>
    </li>
  )
}

function LateSheet({ open, onClose }) {
  const { s, set, toast } = useStore()
  const [mins, setMins] = useState(s.late?.mins ?? 20)
  const [reason, setReason] = useState(s.late?.reason ?? 'Traffic')
  const send = () => {
    set({ late: { mins, reason } })
    toast(`Ines (2nd AD) knows you are ${mins} min late`)
    onClose()
  }
  return (
    <Sheet open={open} onClose={onClose} title="Running late" footer={<Button variant="green" className="btn--block" icon={BiSend} onClick={send}>Tell Ines, 2nd AD</Button>}>
      <p className="row__s">One message to the person who needs it. Your new arrival time shows on the call sheet.</p>
      <fieldset className="field">
        <legend>How late</legend>
        <div className="seg4">
          {[10, 20, 30, 45].map((m) => (
            <button key={m} aria-pressed={mins === m} onClick={() => setMins(m)}><b className="mono">{m}</b><span>min</span></button>
          ))}
        </div>
      </fieldset>
      <fieldset className="field">
        <legend>Why</legend>
        <div className="seg4 seg4--words">
          {['Traffic', 'Train', 'Parking', 'Other'].map((r) => (
            <button key={r} aria-pressed={reason === r} onClick={() => setReason(r)}>{r}</button>
          ))}
        </div>
      </fieldset>
      <p className="row__s">New arrival {fmt(toMin(cs.myCall) + mins)}. Arlo, your best boy, can start the pre-rig.</p>
    </Sheet>
  )
}
