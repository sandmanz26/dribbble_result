import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiPlay, BiLockAlt, BiCheckCircle, BiChevronRight } from 'react-icons/bi'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, IconButton, Photo, Sheet, Stack, gbp } from '../ui/kit.jsx'

const credits = [
  { y: 2026, title: 'Saltmarsh', kind: 'Feature film', role: 'Gaffer', photo: 'set-warehouse-2', now: true },
  { y: 2026, title: 'The Long Field', kind: 'Series, 4 episodes', role: 'Gaffer', photo: 'set-operator' },
  { y: 2025, title: 'Glass Harbour', kind: 'Feature film', role: 'Best boy electric', photo: 'set-monitor' },
  { y: 2025, title: 'Copper', kind: 'Commercial', role: 'Gaffer', photo: 'set-lights' },
  { y: 2024, title: 'Night Bus', kind: 'Short film', role: 'Gaffer', photo: 'set-sunset' },
]

const kit = ['Aputure 600d pair', 'Astera Titan tubes, 8', 'Creamsource Vortex4', 'Van with tail lift']

export default function Me() {
  const { s, set } = useStore()
  const me = people[s.as === 'production' ? 'kofi' : 'mara']
  const [reel, setReel] = useState(false)
  const [rateOpen, setRateOpen] = useState(true)

  return (
    <div className="page">
      <header className="me">
        <Avatar id={me.id} size={88} />
        <div>
          <h1 className="h1">{me.name}</h1>
          <p className="muted">{me.role}{me.dept ? `, ${me.dept.toLowerCase()}` : ''}</p>
          <p className="small muted">{me.city}{me.union ? `, ${me.union}` : ''}</p>
        </div>
      </header>

      {s.as === 'crew' ? (
        <>
          <div className="status">
            <span className="status__dot" aria-hidden="true" />
            <p><b>Available from 14 Dec</b><br /><span className="small muted">Productions see this on your profile. Pencils do not hide you.</span></p>
          </div>

          <section className="block" aria-labelledby="reel-h">
            <div className="block__head"><h2 id="reel-h" className="h2">Showreel</h2><span className="small muted mono">2:14</span></div>
            <div className="reel">
              <Photo name="set-lights" className="reel__img" alt="Frame from the showreel: three LED panels on stands in a warm room" />
              <IconButton icon={BiPlay} label="Play showreel" className="reel__play" onClick={() => setReel(true)} />
            </div>
          </section>

          <section className="block" aria-labelledby="cr-h">
            <h2 id="cr-h" className="h2">Credits</h2>
            <ul className="credits">
              {credits.map((c) => (
                <li key={c.title} className="credit">
                  <Photo name={c.photo} small className="credit__img" alt="" />
                  <div>
                    <p className="credit__title">{c.title} {c.now && <Badge tone="live">Shooting</Badge>}</p>
                    <p className="small muted">{c.kind}, {c.role.toLowerCase()}</p>
                  </div>
                  <span className="mono small muted">{c.y}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="block" aria-labelledby="rate-h">
            <h2 id="rate-h" className="h2">Rate</h2>
            <div className="rate">
              <p><span className="mono rate__n">{gbp(520)}</span> <span className="muted">a day, 10 + 1</span></p>
              <label className="switch">
                <input type="checkbox" checked={rateOpen} onChange={(e) => setRateOpen(e.target.checked)} />
                <span className="switch__track" aria-hidden="true" />
                <span className="small">Show to productions I have worked with</span>
              </label>
              <p className="small muted"><BiLockAlt aria-hidden="true" /> {rateOpen ? 'Hidden from everyone else.' : 'Hidden from everyone. You share it when they pencil you.'}</p>
            </div>
          </section>

          <section className="block" aria-labelledby="kit-h">
            <h2 id="kit-h" className="h2">Kit</h2>
            <ul className="kit">{kit.map((k) => <li key={k}><BiCheckCircle aria-hidden="true" /> {k}</li>)}</ul>
          </section>

          <section className="block" aria-labelledby="wk-h">
            <h2 id="wk-h" className="h2">Worked with</h2>
            <div className="crewrow crewrow--static">
              <Stack ids={['june', 'ruben', 'dele', 'arlo', 'milo', 'noor', 'theo']} size={32} />
              <span className="crewrow__text"><b>48 people</b> across 11 productions</span>
            </div>
          </section>
        </>
      ) : (
        <section className="block">
          <h2 className="h2">Productions</h2>
          <ul className="credits">
            <li className="credit"><Photo name="set-warehouse" small className="credit__img" alt="" /><div><p className="credit__title">Saltmarsh <Badge tone="live">Shooting</Badge></p><p className="small muted">Feature film, line producer</p></div><span className="mono small muted">2026</span></li>
            <li className="credit"><Photo name="set-night" small className="credit__img" alt="" /><div><p className="credit__title">Northlight</p><p className="small muted">Series 2, crewing up</p></div><span className="mono small muted">2027</span></li>
          </ul>
        </section>
      )}

      <section className="block" aria-labelledby="app-h">
        <h2 id="app-h" className="h2">Appearance</h2>
        <div className="chips" role="group" aria-label="Appearance">
          {[['system', 'Match phone'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => (
            <button key={v} className="chip" aria-pressed={s.theme === v} onClick={() => set({ theme: v })}>{l}</button>
          ))}
        </div>
      </section>

      <Link to="/credits" className="rowlink">Photo credits <BiChevronRight aria-hidden="true" /></Link>

      <Sheet open={reel} onClose={() => setReel(false)} title="Showreel">
        <Photo name="set-lights" className="reel__img reel__img--sheet" alt="" />
        <p className="muted">The reel plays here, full screen, with chapters for each credit. This prototype shows a still.</p>
      </Sheet>
    </div>
  )
}
