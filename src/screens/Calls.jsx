import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiBookmark, BiSolidBookmark, BiSearch, BiGridAlt, BiCarousel, BiRefresh } from 'react-icons/bi'
import { jobs, depts } from '../data/jobs.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Frame, IconButton, Tabs, gbp } from '../ui/kit.jsx'

export function fitText(job, offered) {
  if (offered) return { tone: 'sent', text: 'Avails sent' }
  if (job.fit === 'clash') return { tone: 'clash', text: `Clashes with ${job.clashWith}` }
  if (job.fit === 'pencil') return { tone: 'pencil', text: 'You are on 2nd pencil' }
  return { tone: 'free', text: 'Fits your diary' }
}

export function Fit({ job, offered }) {
  const f = fitText(job, offered)
  return <p className={`fit fit--${f.tone} mono`}><i aria-hidden="true" />{f.text}</p>
}

export default function Calls() {
  const { s, toggleSave } = useStore()
  const [tab, setTab] = useState('foryou')
  const [dept, setDept] = useState('Lighting')
  const [q, setQ] = useState('')
  const [view, setView] = useState('deck')
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState({})
  const deck = useRef(null)

  const list = useMemo(() => {
    let l = jobs
    if (tab === 'saved') l = l.filter((j) => s.saved.includes(j.id))
    if (tab === 'offered') l = l.filter((j) => s.offers[j.id])
    if (dept !== 'All') l = l.filter((j) => j.dept === dept)
    if (q.trim()) {
      const t = q.trim().toLowerCase()
      l = l.filter((j) => `${j.title} ${j.role} ${j.kind} ${j.where}`.toLowerCase().includes(t))
    }
    const order = { free: 0, pencil: 1, clash: 2 }
    return [...l].sort((a, b) => order[a.fit] - order[b.fit])
  }, [tab, dept, q, s.saved, s.offers])

  useEffect(() => { setIdx(0); deck.current?.scrollTo({ left: 0 }) }, [tab, dept, q])

  const onScroll = () => {
    const el = deck.current
    if (!el) return
    const card = el.querySelector('.poster')
    if (!card) return
    setIdx(Math.round(el.scrollLeft / (card.offsetWidth + 12)))
  }

  return (
    <div className="page page--calls">
      <header className="mast mast--big">
        <h1 className="display">Calls</h1>
        <div className="mast__tools">
          <IconButton icon={view === 'deck' ? BiGridAlt : BiCarousel} label={view === 'deck' ? 'Show as list' : 'Show as posters'} onClick={() => setView(view === 'deck' ? 'list' : 'deck')} />
        </div>
      </header>

      <label className="search">
        <BiSearch aria-hidden="true" />
        <span className="sr-only">Search calls</span>
        <input type="search" placeholder="Production, role or place" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>

      <Tabs
        label="Which calls"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'foryou', label: 'For you' },
          { value: 'saved', label: 'Saved', count: s.saved.length },
          { value: 'offered', label: 'Offered', count: Object.keys(s.offers).length },
        ]}
      />
      <div className="depts" role="group" aria-label="Department">
        {depts.map((d) => (
          <button key={d} className="dept" aria-pressed={dept === d} onClick={() => setDept(d)}>{d}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <p className="display display--sm">Quiet on set</p>
          <p className="row__s">{tab === 'saved' ? 'Save a call to keep it here.' : tab === 'offered' ? 'Calls you send avails to land here.' : 'No calls match. Try another department.'}</p>
        </div>
      ) : view === 'deck' ? (
        <>
          <div className="deck" ref={deck} onScroll={onScroll} aria-label="Calls, swipe sideways">
            {list.map((j, i) => {
              const f = fitText(j, s.offers[j.id])
              const flip = flipped[j.id]
              return (
                <article key={j.id} className={`poster${flip ? ' is-flipped' : ''}`} aria-label={`${j.role}, ${j.title}`}>
                  <div className="poster__in">
                    <div className="poster__front">
                      <Frame name={j.photo} small alt="" burn={`${String(i + 1).padStart(2, '0')} / ${j.kind.toUpperCase()}`} tc={j.where.split(',')[0]} className="poster__frame" />
                      <div className="poster__bill">
                        <p className="poster__prod">{j.title}</p>
                        <h2 className="poster__role">{j.role}</h2>
                        <p className={`poster__fit fit--${f.tone} mono`}><i aria-hidden="true" />{f.text}</p>
                        <dl className="poster__facts mono">
                          <div><dt>Dates</dt><dd>{j.dates}</dd></div>
                          <div><dt>Rate</dt><dd>{gbp(j.rate)}/day</dd></div>
                        </dl>
                      </div>
                    </div>
                    <div className="poster__back" aria-hidden={!flip}>
                      <p className="poster__prod">{j.title} / {j.format}</p>
                      <p className="poster__pitch">"{j.pitch}"</p>
                      <p className="mono small">{people[j.hod].name}, {people[j.hod].role.toLowerCase()}</p>
                      <div className="billing">
                        {j.booked.length ? j.booked.map((id) => (
                          <p key={id}><span>{people[id].role}</span><b>{people[id].name}</b></p>
                        )) : <p><span>Crew</span><b>Still crewing</b></p>}
                      </div>
                    </div>
                  </div>
                  <div className="poster__acts">
                    <button className="textbtn" onClick={() => setFlipped({ ...flipped, [j.id]: !flip })}><BiRefresh aria-hidden="true" /> {flip ? 'Front' : 'Who is on it'}</button>
                    <IconButton
                      icon={s.saved.includes(j.id) ? BiSolidBookmark : BiBookmark}
                      label={s.saved.includes(j.id) ? `Remove ${j.title} from saved` : `Save ${j.title}`}
                      aria-pressed={s.saved.includes(j.id)}
                      onClick={() => toggleSave(j.id)}
                    />
                    <Link to={`/calls/${j.id}`} className="btn btn--ink btn--sm">Open</Link>
                  </div>
                </article>
              )
            })}
          </div>
          <p className="deck__count mono" aria-live="polite"><b>{String(Math.min(idx + 1, list.length)).padStart(2, '0')}</b> / {String(list.length).padStart(2, '0')}</p>
        </>
      ) : (
        <ol className="rows rows--calls">
          {list.map((j, i) => (
            <li key={j.id}>
              <Link to={`/calls/${j.id}`} className="callrow">
                <span className="callrow__no mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="callrow__main">
                  <span className="callrow__role">{j.role}</span>
                  <span className="row__s">{j.title}, {j.kind.toLowerCase()}. {j.dates}</span>
                  <Fit job={j} offered={s.offers[j.id]} />
                </span>
                <span className="mono callrow__rate">{gbp(j.rate)}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
