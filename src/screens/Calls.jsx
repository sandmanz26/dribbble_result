import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiBookmark, BiSolidBookmark, BiCheckCircle, BiErrorCircle, BiSearch, BiPencil, BiSend } from 'react-icons/bi'
import { jobs, depts } from '../data/jobs.js'
import { useStore } from '../store.jsx'
import { Photo, Segmented, gbp } from '../ui/kit.jsx'

export function Fit({ job, offered }) {
  if (offered) return <p className="fit fit--sent"><BiSend aria-hidden="true" /> Avails sent</p>
  if (job.fit === 'clash') return <p className="fit fit--clash"><BiErrorCircle aria-hidden="true" /> Clashes with {job.clashWith}. You can offer as 2nd pencil</p>
  if (job.fit === 'pencil') return <p className="fit fit--pencil"><BiPencil aria-hidden="true" /> You are on 2nd pencil</p>
  return <p className="fit fit--free"><BiCheckCircle aria-hidden="true" /> Fits your diary</p>
}

export default function Calls() {
  const { s, toggleSave } = useStore()
  const [tab, setTab] = useState('foryou')
  const [dept, setDept] = useState('Lighting')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    let l = jobs
    if (tab === 'saved') l = l.filter((j) => s.saved.includes(j.id))
    if (tab === 'offered') l = l.filter((j) => s.offers[j.id])
    if (dept !== 'All') l = l.filter((j) => j.dept === dept)
    if (q.trim()) {
      const t = q.trim().toLowerCase()
      l = l.filter((j) => `${j.title} ${j.role} ${j.kind} ${j.where}`.toLowerCase().includes(t))
    }
    // Work that fits the diary first, clashes last.
    const order = { free: 0, pencil: 1, clash: 2 }
    return [...l].sort((a, b) => order[a.fit] - order[b.fit])
  }, [tab, dept, q, s.saved, s.offers])

  return (
    <div className="page">
      <header className="top">
        <h1 className="h1">Calls</h1>
      </header>
      <label className="search">
        <BiSearch aria-hidden="true" />
        <span className="sr-only">Search calls</span>
        <input type="search" placeholder="Production, role or place" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <Segmented
        label="Which calls"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'foryou', label: 'For you' },
          { value: 'saved', label: 'Saved', count: s.saved.length },
          { value: 'offered', label: 'Offered', count: Object.keys(s.offers).length },
        ]}
      />
      <div className="chips chips--scroll" role="group" aria-label="Department">
        {depts.map((d) => (
          <button key={d} className="chip" aria-pressed={dept === d} onClick={() => setDept(d)}>{d}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <p className="h3">Nothing here yet</p>
          <p className="muted">{tab === 'saved' ? 'Save a call to keep it here.' : tab === 'offered' ? 'Calls you send avails to show up here.' : 'No calls match. Try another department.'}</p>
        </div>
      ) : (
        <ul className="jobs">
          {list.map((j) => (
            <li key={j.id} className="job">
              <Link to={`/calls/${j.id}`} className="job__link">
                <Photo name={j.photo} small className="job__img" alt="" />
                <div className="job__body">
                  <p className="job__prod">{j.title} <span className="muted">{j.kind}</span></p>
                  <p className="job__role">{j.role}</p>
                  <p className="job__meta small">{j.dates}, {j.where}</p>
                  <p className="job__rate"><span className="mono">{gbp(j.rate)}</span><span className="muted small"> a day</span></p>
                  <Fit job={j} offered={s.offers[j.id]} />
                </div>
              </Link>
              <button
                className="job__save"
                aria-pressed={s.saved.includes(j.id)}
                aria-label={s.saved.includes(j.id) ? `Remove ${j.title} from saved` : `Save ${j.title}`}
                onClick={() => toggleSave(j.id)}
              >
                {s.saved.includes(j.id) ? <BiSolidBookmark aria-hidden="true" /> : <BiBookmark aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
