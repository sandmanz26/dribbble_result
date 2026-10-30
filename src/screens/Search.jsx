import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SearchNormal1, Filter, CloseCircle, ScanBarcode, UserAdd, Clock, Health } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { GRADES, HOUSES } from '../data/school.js'
import { searchStudents, applyFilters, EMPTY_FILTERS, filterCount } from '../lib/search.js'
import { Avatar, Status, Sheet, Chip, Button, Empty, SkeletonRows, Highlight, useLoading, ICON } from '../ui/kit.jsx'

const QKEY = 'roll-queries-v1'
const readQ = () => { try { return JSON.parse(localStorage.getItem(QKEY)) || [] } catch { return [] } }

export default function Search() {
  const { visible, user, toast } = useStore()
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const input = useRef()
  const [q, setQ] = useState(params.get('q') || '')
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    flags: params.get('filter') ? [params.get('filter')] : [],
    grades: params.get('grade') ? [Number(params.get('grade'))] : [],
  }))
  const [sheet, setSheet] = useState(false)
  const [scan, setScan] = useState(false)
  const [recentQ, setRecentQ] = useState(readQ)
  const loading = useLoading(380)

  useEffect(() => { if (params.get('focus')) input.current?.focus() }, []) // eslint-disable-line

  const remember = (text) => {
    const t = text.trim()
    if (t.length < 2) return
    const next = [t, ...recentQ.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5)
    setRecentQ(next)
    try { localStorage.setItem(QKEY, JSON.stringify(next)) } catch {}
  }

  const includeWithdrawn = filters.status.includes('withdrawn')
  const pool = useMemo(() => applyFilters(visible, filters).filter((s) => includeWithdrawn || s.status !== 'withdrawn'), [visible, filters, includeWithdrawn])
  const results = useMemo(() => (q.trim() ? searchStudents(pool, q) : pool.map((student) => ({ student, why: null }))), [pool, q])
  const nf = filterCount(filters)
  const browsing = !q.trim() && !nf
  const classes = useMemo(() => [...new Set(visible.map((s) => s.cls))], [visible])

  const open = (id) => { remember(q); nav(`/students/${id}`) }

  return (
    <div className="page page-search">
      <div className="search-head">
        <h1>Students</h1>
        <div className="search-bar">
          <SearchNormal1 size={20} color="currentColor" />
          <input
            ref={input}
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setParams(e.target.value ? { q: e.target.value } : {}, { replace: true }) }}
            onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) open(results[0].student.id) }}
            placeholder="Name, admission no., class or parent"
            aria-label="Search students"
            autoComplete="off"
            enterKeyHint="search"
          />
          {q ? (
            <button className="icon-btn" onClick={() => { setQ(''); setParams({}, { replace: true }); input.current.focus() }} aria-label="Clear search"><CloseCircle {...ICON} /></button>
          ) : (
            <button className="icon-btn" onClick={() => setScan(true)} aria-label="Scan a student ID card"><ScanBarcode {...ICON} /></button>
          )}
        </div>
        <div className="search-tools">
          <button className={`filter-btn ${nf ? 'is-on' : ''}`} onClick={() => setSheet(true)}>
            <Filter size={16} color="currentColor" /> Filters{nf ? ` (${nf})` : ''}
          </button>
          {filters.flags.includes('incomplete') && <Chip on onClick={() => setFilters({ ...filters, flags: filters.flags.filter((f) => f !== 'incomplete') })}>Incomplete <CloseCircle size={14} color="currentColor" /></Chip>}
          {filters.grades.map((g) => <Chip key={g} on onClick={() => setFilters({ ...filters, grades: filters.grades.filter((x) => x !== g) })}>Grade {g} <CloseCircle size={14} color="currentColor" /></Chip>)}
          {!browsing && <span className="count">{results.length} {results.length === 1 ? 'student' : 'students'}</span>}
        </div>
      </div>

      {loading ? <SkeletonRows n={6} /> : browsing ? (
        <>
          {recentQ.length > 0 && (
            <section className="block">
              <h2 className="block-title">Recent searches</h2>
              <div className="chips-wrap">
                {recentQ.map((t) => <Chip key={t} onClick={() => { setQ(t); setParams({ q: t }, { replace: true }) }}><Clock size={14} color="currentColor" />{t}</Chip>)}
              </div>
            </section>
          )}
          <section className="block">
            <h2 className="block-title">{user.classes ? 'Your classes' : 'Browse by class'}</h2>
            <div className="class-grid">
              {classes.map((c) => {
                const n = visible.filter((s) => s.cls === c && s.status !== 'withdrawn').length
                return (
                  <button key={c} className="class-tile" onClick={() => { setQ(c); setParams({ q: c }, { replace: true }) }}>
                    <b>{c}</b><span>{n} students</span>
                  </button>
                )
              })}
            </div>
          </section>
          {user.role === 'registrar' && (
            <Link to="/students/new" className="add-student is-quiet"><UserAdd size={20} color="currentColor" /><span><strong>Add a student</strong></span></Link>
          )}
        </>
      ) : results.length ? (
        <div className="list results">
          {results.slice(0, 60).map(({ student: s, why }) => (
            <button key={s.id} className="row" onClick={() => open(s.id)}>
              <Avatar s={s} size={42} />
              <span className="row-main">
                <strong><Highlight text={`${s.first} ${s.last}`} query={q} /></strong>
                <small>{s.cls}, <span className="mono">{s.id}</span>{why && why !== 'Name' ? <em> · {why}</em> : null}</small>
              </span>
              <span className="row-end">
                {s.status !== 'enrolled' && <Status value={s.status} />}
                {(s.health.allergies.length + s.health.conditions.length > 0) && <Health size={16} color="currentColor" variant="Bold" className="health-dot" aria-label="Has a health alert" />}
              </span>
            </button>
          ))}
          {results.length > 60 && <p className="quiet center">Showing 60 of {results.length}. Add a filter or type more to narrow it down.</p>}
        </div>
      ) : (
        <Empty icon={<SearchNormal1 size={28} color="currentColor" />} title={`No student matches "${q}"`}>
          {user.classes ? 'You can only search your own classes. ' : ''}Try part of the surname, the admission number, or a parent's name.
          {nf ? ' Filters are on, which may hide them.' : ''}
        </Empty>
      )}

      <FilterSheet open={sheet} onClose={() => setSheet(false)} value={filters} onApply={(f) => { setFilters(f); setSheet(false) }} pool={visible} />

      <Sheet open={scan} onClose={() => setScan(false)} title="Scan ID card">
        <div className="scan-view" aria-hidden="true"><span /></div>
        <p className="quiet">Point the camera at the barcode on the back of a student card. In this prototype, the scan picks a student from your list.</p>
        <Button onClick={() => { const s = visible[17] || visible[0]; setScan(false); toast(`Card read: ${s.id}`, 'info'); open(s.id) }}>Simulate a scan</Button>
      </Sheet>
    </div>
  )
}

function FilterSheet({ open, onClose, value, onApply, pool }) {
  const [f, setF] = useState(value)
  useEffect(() => { if (open) setF(value) }, [open]) // eslint-disable-line
  const toggle = (key, v) => setF({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] })
  const grades = [...new Set(pool.map((s) => s.grade))]
  const n = applyFilters(pool, f).filter((s) => f.status.includes('withdrawn') || s.status !== 'withdrawn').length
  return (
    <Sheet open={open} onClose={onClose} title="Filters" tall footer={
      <div className="sheet-actions">
        <Button variant="ghost" onClick={() => setF(EMPTY_FILTERS)}>Clear all</Button>
        <Button onClick={() => onApply(f)}>Show {n} students</Button>
      </div>
    }>
      <fieldset className="fgroup"><legend>Grade</legend><div className="chips-wrap">{GRADES.filter((g) => grades.includes(g)).map((g) => <Chip key={g} on={f.grades.includes(g)} onClick={() => toggle('grades', g)}>Grade {g}</Chip>)}</div></fieldset>
      <fieldset className="fgroup"><legend>House</legend><div className="chips-wrap">{HOUSES.map((h) => <Chip key={h} on={f.houses.includes(h)} onClick={() => toggle('houses', h)}>{h}</Chip>)}</div></fieldset>
      <fieldset className="fgroup"><legend>Record status</legend><div className="chips-wrap">
        {[['enrolled', 'Enrolled'], ['pending', 'Incomplete'], ['withdrawn', 'Withdrawn']].map(([v, l]) => <Chip key={v} on={f.status.includes(v)} onClick={() => toggle('status', v)}>{l}</Chip>)}
      </div></fieldset>
      <fieldset className="fgroup"><legend>Needs attention</legend><div className="chips-wrap">
        {[['health', 'Health alert'], ['support', 'Learning support'], ['incomplete', 'Missing details'], ['noPhoto', 'No photo consent']].map(([v, l]) => <Chip key={v} on={f.flags.includes(v)} onClick={() => toggle('flags', v)}>{l}</Chip>)}
      </div></fieldset>
    </Sheet>
  )
}
