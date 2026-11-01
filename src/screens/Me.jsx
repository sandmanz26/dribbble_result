import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiPlay, BiPause, BiChevronRight } from 'react-icons/bi'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Frame, IconButton, Section, Sheet, gbp } from '../ui/kit.jsx'

const credits = [
  { y: 2026, title: 'Saltmarsh', kind: 'Feature film', role: 'Gaffer', now: true },
  { y: 2026, title: 'The Long Field', kind: 'Series, 4 episodes', role: 'Gaffer' },
  { y: 2025, title: 'Glass Harbour', kind: 'Feature film', role: 'Best boy electric' },
  { y: 2025, title: 'Copper', kind: 'Commercial', role: 'Gaffer' },
  { y: 2024, title: 'Night Bus', kind: 'Short film', role: 'Gaffer' },
  { y: 2024, title: 'Under the Pier', kind: 'Music video', role: 'Gaffer' },
  { y: 2023, title: 'Two Rivers', kind: 'Series, 6 episodes', role: 'Electrician' },
  { y: 2022, title: 'Lantern', kind: 'Short film', role: 'Spark' },
]
const kit = ['Aputure 600d, pair', 'Astera Titan tubes, 8', 'Creamsource Vortex4', 'Van with tail lift']

export default function Me() {
  const { s, set } = useStore()
  const me = people[s.as === 'production' ? 'kofi' : 'mara']
  const [reel, setReel] = useState(false)
  const [roll, setRoll] = useState(true)
  const [rateOpen, setRateOpen] = useState(true)

  return (
    <div className="page page--me">
      <header className="me">
        <Frame name={me.photo} alt={me.name} burn={me.dept ? me.dept.toUpperCase() : ''} tc={me.city} className="me__frame" />
        <h1 className="display me__name">{me.name}</h1>
        <p className="mono me__role">{me.role}{me.union ? ` / ${me.union}` : ''}</p>
      </header>

      {s.as === 'crew' ? (
        <>
          <p className="avail"><i className="live" aria-hidden="true" /><span><b>Available from 14 Dec.</b> Productions see this. Pencils do not hide you.</span></p>

          <Section no="01" title="Showreel" id="reel" aside={<span className="mono">2:14</span>}>
            <div className="reel">
              <Frame name="set-lights" alt="Frame from the showreel: three LED panels on stands" burn="REEL / MARA ILIĆ" tc="00:00:12:08" className="reel__frame" />
              <IconButton icon={BiPlay} label="Play showreel" className="reel__play" onClick={() => setReel(true)} />
            </div>
          </Section>

          <Section
            no="02"
            title="End credits"
            id="cr"
            aside={<button className="textbtn" onClick={() => setRoll(!roll)} aria-pressed={!roll}>{roll ? <><BiPause aria-hidden="true" /> Pause</> : <><BiPlay aria-hidden="true" /> Roll</>}</button>}
          >
            <div className={`crawl${roll ? '' : ' is-paused'}`} tabIndex={0} aria-label="Credits, rolling. Focus or hover to pause">
              <div className="crawl__in">
                {[0, 1].map((k) => (
                  <ul key={k} className="crawl__list" aria-hidden={k === 1}>
                    {credits.map((c) => (
                      <li key={c.title + k}>
                        <span className="crawl__role">{c.role}</span>
                        <span className="crawl__title">{c.title}{c.now && <sup className="mono"> now</sup>}</span>
                        <span className="crawl__meta mono">{c.kind}, {c.y}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </Section>

          <Section no="03" title="Rate" id="rate">
            <p className="ratebig"><span className="mono">{gbp(520)}</span><span className="row__s">a day, 10 + 1</span></p>
            <label className="switch">
              <input type="checkbox" checked={rateOpen} onChange={(e) => setRateOpen(e.target.checked)} />
              <span className="switch__track" aria-hidden="true" />
              <span>Show to productions I have worked with</span>
            </label>
            <p className="row__s small">{rateOpen ? 'Hidden from everyone else.' : 'Hidden from everyone. You share it when they pencil you.'}</p>
          </Section>

          <Section no="04" title="Kit" id="kit">
            <ol className="notes">{kit.map((k, i) => <li key={k}><span className="mono">{i + 1}</span>{k}</li>)}</ol>
          </Section>
        </>
      ) : (
        <Section no="01" title="Productions" id="prods">
          <div className="billing billing--page">
            <p><span>Line producer, shooting</span><b>Saltmarsh</b></p>
            <p><span>Line producer, crewing up</span><b>Northlight</b></p>
          </div>
        </Section>
      )}

      <Section no={s.as === 'crew' ? '05' : '02'} title="Appearance" id="app">
        <div className="seg4 seg4--words seg4--3" role="group" aria-label="Appearance">
          {[['system', 'Phone'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => (
            <button key={v} aria-pressed={s.theme === v} onClick={() => set({ theme: v })}>{l}</button>
          ))}
        </div>
      </Section>

      <Link to="/credits" className="rowlink">Photo credits <BiChevronRight aria-hidden="true" /></Link>

      <Sheet open={reel} onClose={() => setReel(false)} title="Showreel">
        <Frame name="set-lights" alt="" burn="REEL / MARA ILIĆ" tc="00:00:12:08" className="reel__frame" />
        <p className="row__s">The reel plays here, full screen, with a chapter for each credit. This prototype shows a still.</p>
      </Sheet>
    </div>
  )
}
