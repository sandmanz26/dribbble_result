import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RiSearchLine } from '@remixicon/react'
import { usePortal } from '../store.jsx'
import { useGradeView } from '../useGradeView.js'
import { ATTENDANCE_FLOOR, studentAverage } from '../data/school.js'

// Screen question: who in this grade needs following up?
export default function Students() {
  const { t, name, other, grade } = usePortal()
  const v = useGradeView()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [cls, setCls] = useState('all')
  const floorOnly = params.get('floor') === '1'

  const all = useMemo(
    () =>
      v.data.classes.flatMap((c) =>
        c.students.map((s) => ({
          c, s,
          avg: studentAverage(c, s),
          today: c.register.marked ? (c.register.absent.includes(s.id) ? 'absent' : 'present') : null,
        })),
      ),
    [v.data],
  )

  const needle = q.trim().toLowerCase()
  const rows = all
    .filter((r) => cls === 'all' || r.c.id === cls)
    .filter((r) => !floorOnly || r.s.termAtt < ATTENDANCE_FLOOR)
    .filter((r) => !needle || [r.s.given.en, r.s.sur.en, r.s.given.si, r.s.sur.si, r.s.admission].some((x) => x.toLowerCase().includes(needle)))
    .sort((a, b) => a.c.letter.localeCompare(b.c.letter) || a.s.sur.en.localeCompare(b.s.sur.en))

  const setFloor = (on) => {
    const p = new URLSearchParams(params)
    on ? p.set('floor', '1') : p.delete('floor')
    setParams(p, { replace: true })
  }
  const clear = () => { setQ(''); setCls('all'); setFloor(false) }

  return (
    <div className="v1-page">
      <div className="v1-titlerow">
        <div>
          <h1>{t('stTitle')}</h1>
          <p className="v1-finding">{t('gradeN', { n: grade })} · {t('stSub', { n: all.length, c: v.data.classes.length })}</p>
        </div>
      </div>

      <section className="v1-card v1-table-card" aria-label={t('stTitle')}>
        <div className="v1-toolbar">
          <label className="v1-search">
            <RiSearchLine size={14} aria-hidden="true" />
            <span className="sr-only">{t('search')}</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} />
          </label>
          <div className="v1-seg" role="group" aria-label={t('colClass')}>
            <button aria-pressed={cls === 'all'} onClick={() => setCls('all')}>{t('allClasses')}</button>
            {v.data.classes.map((c) => (
              <button key={c.id} aria-pressed={cls === c.id} onClick={() => setCls(c.id)}>{name(c.name)}</button>
            ))}
          </div>
          <label className="v1-check">
            <input type="checkbox" checked={floorOnly} onChange={(e) => setFloor(e.target.checked)} />
            {t('onlyFloor')}
          </label>
          <span className="v1-card-meta v1-showing num">{t('showing', { n: rows.length, t: all.length })}</span>
        </div>

        {rows.length === 0 ? (
          <div className="v1-empty-box">
            <span>{needle ? t('noMatch', { q }) : t('noMatch', { q: t('onlyFloor') })}</span>
            <button className="v1-textbtn" onClick={clear}>{t('clear')}</button>
          </div>
        ) : (
          <table className="v1-table">
            <thead>
              <tr>
                <th scope="col">{t('colName')}</th>
                <th scope="col" className="num">{t('colAdm')}</th>
                <th scope="col">{t('colClass')}</th>
                <th scope="col">{t('colToday')}</th>
                <th scope="col" className="num">{t('colTerm')}</th>
                <th scope="col" className="num">{t('colAvg')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ c, s, avg, today }) => (
                <tr key={s.id}>
                  <td>
                    <span className="v1-cell-name">{name(s.given)} {name(s.sur)}</span>
                    <span className="v1-cell-other" lang={other({ en: 'si', si: 'en' })}>{other(s.given)} {other(s.sur)}</span>
                  </td>
                  <td className="num v1-mono">{s.admission}</td>
                  <td>{name(c.name)}</td>
                  <td>
                    {today === 'absent' ? <span className="v1-pill neg">{t('absent')}</span> : today === 'present' ? <span className="v1-muted">{t('present')}</span> : <span className="v1-muted" title={t('unmarkedDash')}>-</span>}
                  </td>
                  <td className={`num ${s.termAtt < ATTENDANCE_FLOOR ? 'neg' : ''}`}>{s.termAtt}%</td>
                  <td className="num">{avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
