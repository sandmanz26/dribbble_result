import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BiBus, BiCar, BiChevronRight, BiCloudDrizzle, BiDirections, BiHourglass, BiInfoCircle,
  BiMapPin, BiMoon, BiPlusMedical, BiSun, BiTime, BiCheckCircle, BiSend,
} from 'react-icons/bi'
import { callSheet as cs, production, pages } from '../data/day.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, Button, Photo, Sheet, Stack } from '../ui/kit.jsx'

const nickTip = {
  'Abby Singer': 'The second to last shot of the day, named after the assistant director who always called it.',
  'Martini shot': 'The last shot of the day. The next one is in a glass.',
}

const totalEighths = cs.scenes.reduce((n, x) => n + x.eighths, 0)

export default function Today() {
  const { s } = useStore()
  const me = people[s.as === 'production' ? 'kofi' : 'mara']
  const [late, setLate] = useState(false)
  const [crew, setCrew] = useState(false)

  return (
    <div className="page">
      <header className="top">
        <div>
          <p className="top__date">Tuesday 17 November</p>
          <h1 className="h1">{s.scene === 'wrapped' ? 'Good work today' : `Morning, ${me.name.split(' ')[0]}`}</h1>
        </div>
        <Link to="/me" aria-label="Your profile"><Avatar id={me.id} size={44} /></Link>
      </header>

      <section className="prod" aria-label="Production">
        <Photo name={production.photo} small className="prod__img" alt="" />
        <div className="prod__text">
          <p className="prod__title">{production.title}</p>
          <p className="muted small">{production.kind}, day {production.day} of {production.days}</p>
        </div>
        <div className="prod__bar" role="img" aria-label={`Day ${production.day} of ${production.days}`}>
          <span style={{ width: `${(production.day / production.days) * 100}%` }} />
        </div>
      </section>

      {s.scene === 'precall' && <PreCall onLate={() => setLate(true)} />}
      {s.scene === 'rolling' && <Rolling />}
      {s.scene === 'wrapped' && <Wrapped />}

      {s.as === 'production' && <Arrivals />}

      {s.scene !== 'wrapped' && <Location />}

      {s.scene === 'wrapped' ? (
        <p className="summary"><BiCheckCircle aria-hidden="true" /><span>All 5 scenes shot, <span className="mono">{pages(totalEighths)}</span> pages. Martini shot called at <span className="mono">19:02</span>.</span></p>
      ) : (
      <section className="block" aria-labelledby="sch">
        <div className="block__head">
          <h2 id="sch" className="h2">Today's scenes</h2>
          <span className="muted small mono">{pages(totalEighths)} pages</span>
        </div>
        <ol className="strips">
          {cs.scenes.map((sc) => <Strip key={sc.id} sc={sc} scene={s.scene} />)}
        </ol>
        <p className="legend small muted">
          <span className="sw sw--di" /> Day interior <span className="sw sw--de" /> Day exterior <span className="sw sw--ni" /> Night interior
        </p>
      </section>
      )}

      {s.scene !== 'wrapped' && (
      <section className="block" aria-labelledby="notes">
        <h2 id="notes" className="h2">From the ADs</h2>
        <ul className="notes">
          {cs.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </section>
      )}

      <button className="crewrow" onClick={() => setCrew(true)}>
        <Stack ids={cs.onSet} size={30} max={5} />
        <span className="crewrow__text"><b>{cs.onSet.length} people you know</b> are on today's call sheet</span>
        <BiChevronRight aria-hidden="true" />
      </button>

      <LateSheet open={late} onClose={() => setLate(false)} />
      <Sheet open={crew} onClose={() => setCrew(false)} title="On today's call sheet">
        <ul className="people">
          {cs.onSet.map((id) => (
            <li key={id} className="person">
              <Avatar id={id} size={40} />
              <div><p className="person__name">{people[id].name}</p><p className="muted small">{people[id].role}</p></div>
            </li>
          ))}
        </ul>
      </Sheet>
    </div>
  )
}

function PreCall({ onLate }) {
  const { s, toast } = useStore()
  return (
    <section className="call" aria-labelledby="call-h">
      <div className="call__row">
        <h2 id="call-h" className="call__label">Your call</h2>
        <span className="call__in"><BiHourglass aria-hidden="true" /> in 48 min</span>
      </div>
      <p className="call__time mono" aria-label={`Call time ${cs.myCall}`}>{cs.myCall.slice(0, 2)}<span className="call__colon">:</span>{cs.myCall.slice(3)}</p>
      <p className="call__note">{cs.myCallNote}</p>
      <dl className="call__facts">
        <div><dt>Unit call</dt><dd className="mono">{cs.unitCall}</dd></div>
        <div><dt>Breakfast</dt><dd className="mono">06:00</dd></div>
        <div><dt>Lunch</dt><dd className="mono">{cs.lunch}</dd></div>
        <div><dt>Est. wrap</dt><dd className="mono">{cs.wrap}</dd></div>
      </dl>
      {s.late && (
        <p className="call__late" role="status"><BiCheckCircle aria-hidden="true" /> Ines knows you are {s.late.mins} min late ({s.late.reason.toLowerCase()})</p>
      )}
      <div className="call__actions">
        <Button icon={BiDirections} onClick={() => toast('Opens your maps app with the unit base, not the set')}>Directions</Button>
        <Button variant="ghost-dark" icon={BiTime} onClick={onLate}>{s.late ? 'Update' : 'Running late'}</Button>
      </div>
    </section>
  )
}

function Rolling() {
  const done = cs.scenes.filter((x) => x.status === 'done').reduce((n, x) => n + x.eighths, 0)
  return (
    <section className="call call--rolling" aria-labelledby="roll-h">
      <div className="call__row">
        <h2 id="roll-h" className="call__label"><span className="live" aria-hidden="true" /> Rolling</h2>
        <span className="call__in">15 min behind</span>
      </div>
      <p className="call__big">Scene 42</p>
      <p className="call__note">Ada and Pell argue over the ledger. Main floor, haze in.</p>
      <div className="meter" role="img" aria-label={`${pages(done)} of ${pages(totalEighths)} pages shot`}>
        <span style={{ width: `${(done / totalEighths) * 100}%` }} />
        <span className="meter__now" style={{ width: `${(7 / totalEighths) * 100}%` }} />
      </div>
      <p className="small call__sub"><span className="mono">{pages(done)}</span> of <span className="mono">{pages(totalEighths)}</span> pages shot</p>
      <div className="next">
        <p className="next__label">Next for lighting</p>
        <p className="next__what">Scene 18, warehouse yard at <span className="mono">11:30</span>. One 4K through the side gate, the rest is daylight.</p>
      </div>
    </section>
  )
}

function Wrapped() {
  const { toast } = useStore()
  return (
    <section className="call call--wrap" aria-labelledby="wrap-h">
      <div className="call__row">
        <h2 id="wrap-h" className="call__label">Wrapped at <span className="mono">19:20</span></h2>
        <span className="call__in">Day 14 done</span>
      </div>
      <p className="call__big">That's a wrap</p>
      <dl className="call__facts call__facts--two">
        <div><dt>On the clock</dt><dd className="mono">12h 50m</dd></div>
        <div><dt>Overtime</dt><dd className="mono">1h 50m</dd></div>
        <div><dt>Turnaround</dt><dd className="mono">11h</dd></div>
        <div><dt>Earliest call</dt><dd className="mono">06:20</dd></div>
      </dl>
      <div className="next">
        <p className="next__label">Tomorrow, day 15</p>
        <p className="next__what">Call sheet is out. Your call is <span className="mono">07:30</span>, same location.</p>
      </div>
      <div className="call__actions">
        <Button icon={BiSend} onClick={() => toast('Timesheet sent to Kofi for approval')}>Send timesheet</Button>
      </div>
    </section>
  )
}

function Location() {
  const l = cs.location
  return (
    <section className="block loc" aria-labelledby="loc-h">
      <Photo name={l.photo} small className="loc__img" alt="Brick warehouse on Wharf Road" />
      <div className="loc__body">
        <h2 id="loc-h" className="h2">{l.name}</h2>
        <p className="muted">{l.address}</p>
        <ul className="facts">
          <li><BiMapPin aria-hidden="true" /><span>{l.base}</span></li>
          <li><BiCar aria-hidden="true" /><span>{l.parking}</span></li>
          <li><BiBus aria-hidden="true" /><span>{l.transit}</span></li>
          <li className="facts__safety"><BiPlusMedical aria-hidden="true" /><span>Nearest A&E: {l.hospital}</span></li>
        </ul>
        <div className="sky">
          <div><BiSun aria-hidden="true" /><span className="mono">{cs.sunrise}</span><small>Sunrise</small></div>
          <div><BiMoon aria-hidden="true" /><span className="mono">{cs.sunset}</span><small>Sunset</small></div>
          <div><BiCloudDrizzle aria-hidden="true" /><span className="mono">{cs.weather.temp}°C</span><small>Drizzle to 10:00</small></div>
        </div>
      </div>
    </section>
  )
}

function Strip({ sc, scene }) {
  const [info, setInfo] = useState(false)
  const tone = sc.dn === 'NIGHT' ? 'ni' : sc.ie === 'EXT' ? 'de' : 'di'
  let status = 'next'
  if (scene === 'rolling') status = sc.status
  if (scene === 'wrapped') status = 'done'
  return (
    <li className={`strip strip--${tone} strip--${status}`}>
      <span className="strip__no mono">{sc.id}</span>
      <div className="strip__main">
        <p className="strip__set"><span className="strip__tag mono">{sc.ie}/{sc.dn}</span> {sc.set}</p>
        <p className="strip__what">{sc.what}</p>
        <p className="strip__meta small">
          <span className="mono">{pages(sc.eighths)} pg</span>
          <span>Cast {sc.cast.join(', ')}</span>
          {sc.nick && (
            <button className="martini" onClick={() => setInfo((v) => !v)} aria-expanded={info}>
              {sc.nick} <BiInfoCircle aria-hidden="true" />
            </button>
          )}
        </p>
        {info && <p className="strip__tip small">{nickTip[sc.nick]}</p>}
      </div>
      <div className="strip__side">
        <span className="mono">{sc.start}</span>
        {status === 'now' && <Badge tone="live">Now</Badge>}
        {status === 'done' && <Badge tone="done">Shot</Badge>}
      </div>
    </li>
  )
}

function Arrivals() {
  return (
    <section className="block" aria-labelledby="arr">
      <div className="block__head">
        <h2 id="arr" className="h2">Arrivals</h2>
        <span className="small muted"><span className="mono">61</span> of <span className="mono">64</span> in</span>
      </div>
      <ul className="people">
        <li className="person"><Avatar id="mara" size={40} /><div><p className="person__name">Mara Ilić, gaffer</p><p className="muted small">20 min late, traffic. Arlo starts the pre-rig</p></div></li>
        <li className="person"><Avatar id="theo" size={40} /><div><p className="person__name">Theo Lund, electrician</p><p className="muted small">On the DLR, due 06:38</p></div></li>
      </ul>
    </section>
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
    <Sheet
      open={open}
      onClose={onClose}
      title="Running late"
      footer={<Button className="btn--block" icon={BiSend} onClick={send}>Tell Ines, 2nd AD</Button>}
    >
      <p className="muted">One message to the person who needs it. They see your new arrival time on the call sheet.</p>
      <fieldset className="field">
        <legend>How late</legend>
        <div className="chips">
          {[10, 20, 30, 45].map((m) => (
            <button key={m} className="chip" aria-pressed={mins === m} onClick={() => setMins(m)}>
              <span className="mono">{m}</span> min
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="field">
        <legend>Why</legend>
        <div className="chips">
          {['Traffic', 'Train', 'Parking', 'Other'].map((r) => (
            <button key={r} className="chip" aria-pressed={reason === r} onClick={() => setReason(r)}>{r}</button>
          ))}
        </div>
      </fieldset>
      <p className="small muted">New arrival <span className="mono">{addMins(cs.myCall, mins)}</span>. Arlo, your best boy, can start the pre-rig.</p>
    </Sheet>
  )
}

const addMins = (t, m) => {
  const [h, mm] = t.split(':').map(Number)
  const x = h * 60 + mm + m
  return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`
}
