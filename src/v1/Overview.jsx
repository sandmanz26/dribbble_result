import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiCheckLine, RiErrorWarningLine, RiTimeLine } from '@remixicon/react'
import { usePortal } from '../store.jsx'
import { useGradeView, pct } from '../useGradeView.js'
import { INTERVAL, NEXT_TEST, PERIODS, SUBJECTS, periodState } from '../data/school.js'

// Screen question: is this grade in class and covered right now?
// Grid: 12 columns, one 16px gutter. Rows: KPI strip (12), attendance (7) + relief (5),
// timetable (12), term test (7) + below 80% (5).
export default function Overview() {
  const { t, name, grade, mode, setMode, assign } = usePortal()
  const v = useGradeView()
  const reliefRef = useRef(null)
  const [openSlot, setOpenSlot] = useState(null)
  const { attendance: a, open } = v

  const lowRate = a.lowest ? (a.lowest.present / a.lowest.enrolled) * 100 : null
  const finding = [
    open.length === 0 ? t('findingCovered') : open.length === 1 ? t('findingRelief1') : t('findingRelief', { n: open.length }),
    !v.early && a.lowest ? t('findingLow', { c: name(a.lowest.c.name), r: Math.round(lowRate) }) : null,
  ].filter(Boolean).join(' ')

  const firstOpen = () => {
    reliefRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    if (open[0]) setOpenSlot(open[0].key)
  }

  const blockState = mode === 'loading' ? 'loading' : mode === 'error' ? 'error' : 'live'
  const retry = () => setMode('live')

  return (
    <div className="v1-page">
      <div className="v1-titlerow">
        <div>
          <h1>{t('gradeN', { n: grade })}</h1>
          <p className="v1-finding">{blockState === 'live' ? finding : '\u00a0'}</p>
        </div>
        <div className="v1-title-actions">
          <span className="v1-stamp"><RiTimeLine size={14} aria-hidden="true" />{t('demoTimeShort')}</span>
          <button className="v1-primary" onClick={firstOpen} disabled={!open.length || blockState !== 'live'}>
            {t('assignRelief')}{open.length > 0 && <span className="v1-count num">{open.length}</span>}
          </button>
        </div>
      </div>

      {/* KPI strip: one container split by hairlines. The lead figure answers the question. */}
      <section className="v1-card v1-kpis" aria-label={t('navOverview')}>
        <Kpi lead label={t('kPresent')} state={blockState}
          value={v.early ? null : a.total.present}
          sub={v.early ? t('notMarked') : `${t('kPresentOf', { n: a.total.enrolledMarked })} · ${pct(a.total.rate)}%`} />
        <Kpi label={t('kUnmarked')} state={blockState} value={a.total.unmarked} sub={t('kUnmarkedSub')} tone={a.total.unmarked && !v.early ? 'neg' : null} />
        <Kpi label={t('kRelief')} state={blockState} value={open.length} sub={t('kReliefSub', { n: v.relief.length })} tone={open.length ? 'neg' : null} />
        <Kpi label={t('kFloor')} state={blockState} value={v.floor.length} sub={t('kFloorSub', { n: a.total.enrolled })} />
        <Kpi label={t('kTest')} state={blockState} value={NEXT_TEST.daysAway} unit={t('days')} sub={t('kTestSub')} />
      </section>

      <div className="v1-row">
        <section className="v1-card v1-span-7" aria-labelledby="att-h">
          <header className="v1-card-head">
            <h2 id="att-h">{t('attTitle')}</h2>
            <span className="v1-card-meta">{t('attSub')}</span>
          </header>
          <Block state={blockState} rows={5} onRetry={retry}>
            <ul className="v1-att">
              {a.rows.map((r) => <AttRow key={r.c.id} r={r} lowest={a.lowest?.c.id === r.c.id} v={v} />)}
            </ul>
          </Block>
        </section>

        <section className="v1-card v1-span-5" aria-labelledby="rel-h" ref={reliefRef}>
          <header className="v1-card-head">
            <h2 id="rel-h">{t('reliefTitle')}</h2>
          </header>
          <Block state={blockState} rows={4} onRetry={retry}>
            {v.relief.length === 0 ? (
              <p className="v1-empty">{t('reliefNone')}</p>
            ) : (
              <>
                <p className="v1-card-note">{t('reliefSub', { names: v.leaveTeachers.map((x) => name(x)).join(', ') })}</p>
                <ul className="v1-relief">
                  {v.relief.map((s) => (
                    <ReliefRow key={s.key} s={s} v={v} open={openSlot === s.key}
                      onToggle={() => setOpenSlot(openSlot === s.key ? null : s.key)}
                      onAssign={(id) => { assign(grade, s.key, id); setOpenSlot(null) }} />
                  ))}
                </ul>
              </>
            )}
          </Block>
        </section>
      </div>

      <section className="v1-card" aria-labelledby="tt-h">
        <header className="v1-card-head">
          <h2 id="tt-h">{t('ttTitle')}</h2>
          <span className="v1-card-meta">{v.early ? t('demoTimeShort').replace(/\d\d:\d\d$/, '07:30') : t('ttSub', { n: 4 })}</span>
        </header>
        <Block state={blockState} rows={5} onRetry={retry}>
          <Timetable v={v} />
        </Block>
      </section>

      <div className="v1-row">
        <section className="v1-card v1-span-7" aria-labelledby="test-h">
          <header className="v1-card-head">
            <h2 id="test-h">{t('testTitle')}</h2>
            <span className="v1-card-meta">{t('vsFirst')}</span>
          </header>
          <Block state={blockState} rows={6} onRetry={retry}>
            <TestBars v={v} />
          </Block>
        </section>
        <section className="v1-card v1-span-5" aria-labelledby="floor-h">
          <header className="v1-card-head">
            <h2 id="floor-h">{t('floorTitle')}</h2>
            <Link className="v1-link" to="/v1/portal/students?floor=1">{t('viewAll', { n: v.floor.length })}</Link>
          </header>
          <Block state={blockState} rows={6} onRetry={retry}>
            <p className="v1-card-note">{grade >= 12 ? t('floorSubAL') : t('floorSub')}</p>
            <ul className="v1-floor">
              {v.floor.slice(0, 6).map(({ c, s }) => (
                <li key={s.id}>
                  <span className="v1-floor-name">{name(s.given)} {name(s.sur)}</span>
                  <span className="v1-floor-class">{name(c.name)}</span>
                  <span className={`num v1-floor-pct ${s.termAtt < 75 ? 'neg' : ''}`}>{s.termAtt}%</span>
                </li>
              ))}
            </ul>
          </Block>
        </section>
      </div>
    </div>
  )
}

function Kpi({ label, value, unit, sub, lead, tone, state }) {
  return (
    <div className={`v1-kpi ${lead ? 'lead' : ''}`}>
      <span className="v1-kpi-label">{label}</span>
      {state === 'loading' ? (
        <span className="v1-skel" style={{ height: lead ? 32 : 24, width: 64 }} />
      ) : state === 'error' ? (
        <span className="v1-kpi-value dash">-</span>
      ) : (
        <span className={`v1-kpi-value num ${tone === 'neg' ? 'neg' : ''} ${value == null ? 'dash' : ''}`}>
          {value == null ? '-' : value}
          {unit && value != null && <small> {unit}</small>}
        </span>
      )}
      <span className="v1-kpi-sub">{state === 'live' ? sub : '\u00a0'}</span>
    </div>
  )
}

// Loading keeps the final layout; an error stays inside the block that failed.
function Block({ state, rows, onRetry, children }) {
  const { t } = usePortal()
  if (state === 'loading')
    return (
      <div className="v1-skel-list" aria-busy="true" aria-label={t('loading')}>
        {Array.from({ length: rows }, (_, i) => <span key={i} className="v1-skel" style={{ width: `${88 - i * 7}%` }} />)}
      </div>
    )
  if (state === 'error')
    return (
      <div className="v1-error" role="alert">
        <RiErrorWarningLine size={16} aria-hidden="true" />
        <span>{t('loadError')}</span>
        <button className="v1-textbtn" onClick={onRetry}>{t('retry')}</button>
      </div>
    )
  return children
}

function AttRow({ r, lowest, v }) {
  const { t, name } = usePortal()
  const [sent, setSent] = useState(false)
  const ct = v.teacher(r.c.classTeacherId)
  const rate = r.marked ? (r.present / r.enrolled) * 100 : null
  return (
    <li className="v1-att-row">
      <div className="v1-att-id">
        <strong>{name(r.c.name)}</strong>
        <span>{name(ct)}</span>
      </div>
      {r.marked ? (
        <>
          <div className="v1-bar" role="img" aria-label={`${r.present} / ${r.enrolled}`}>
            <span style={{ width: `${rate}%` }} />
          </div>
          <div className="v1-att-fig num">
            <strong>{r.present}</strong><span> / {r.enrolled}</span>
            <small className={lowest ? 'neg' : ''}>{pct(rate)}%</small>
          </div>
        </>
      ) : (
        <>
          <div className="v1-bar unmarked" aria-hidden="true" />
          <div className="v1-att-fig v1-att-unmarked">
            {sent ? (
              <span className="v1-sent"><RiCheckLine size={14} aria-hidden="true" />{t('reminded', { t: name(ct) })}</span>
            ) : (
              <>
                <span>{t('notMarked')}</span>
                {!v.early && <button className="v1-textbtn" onClick={() => setSent(true)}>{t('remind', { t: name(ct) })}</button>}
              </>
            )}
          </div>
        </>
      )}
    </li>
  )
}

function ReliefRow({ s, v, open, onToggle, onAssign }) {
  const { t, name } = usePortal()
  const cover = s.coverId ? v.teacher(s.coverId) : null
  const free = open ? v.free(s.period.n) : []
  return (
    <li className={`v1-relief-row ${s.state}`}>
      <div className="v1-relief-main">
        <div className="v1-relief-when num">
          <strong>{t('period', { n: s.period.n })}</strong>
          <span>{s.period.start}-{s.period.end}</span>
        </div>
        <div className="v1-relief-what">
          <strong>{name(s.c.name)} · {name(SUBJECTS[s.subject])}</strong>
          <span>{cover ? t('covered', { t: name(cover) }) : s.state === 'past' ? t('over') : t('noTeacher')}</span>
        </div>
        {cover ? (
          s.state === 'past' ? <span className="v1-pill">{t('coveredShort')}</span> : (
            <button className="v1-ghost" onClick={() => onAssign(null)}>{t('undo')}</button>
          )
        ) : s.state !== 'past' ? (
          <button className="v1-ghost strong" aria-expanded={open} onClick={onToggle}>{t('assign')}</button>
        ) : null}
      </div>
      {open && (
        <div className="v1-picker">
          <p>{t('pickTeacher', { n: s.period.n })}</p>
          {free.length === 0 ? (
            <p className="v1-empty">{t('nobodyFree')}</p>
          ) : (
            <ul>
              {free.slice(0, 4).map(({ t: x, load }) => (
                <li key={x.id}>
                  <button onClick={() => onAssign(x.id)}>
                    <span>{name(x)}</span>
                    <span className="v1-picker-sub">{name(SUBJECTS[x.subject])} · {t('load', { n: load })}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  )
}

function Timetable({ v }) {
  const { t, name, other } = usePortal()
  const leave = new Set(v.data.onLeave)
  const coverFor = new Map(v.relief.map((s) => [s.key, s.coverId]))
  const cols = [...PERIODS.slice(0, 4), 'interval', ...PERIODS.slice(4)]
  return (
    <div className="v1-tt-wrap">
      <table className="v1-tt">
        <thead>
          <tr>
            <th scope="col" className="v1-tt-class"><span className="sr-only">{t('colClass')}</span></th>
            {cols.map((p) =>
              p === 'interval' ? (
                <th key="i" scope="col" className="v1-tt-int"><span className="sr-only">{t('interval')}</span></th>
              ) : (
                <th key={p.n} scope="col" className={periodState(p, v.now)}>
                  <span className="num">{p.n}</span>
                  <small className="num">{p.start}</small>
                  {periodState(p, v.now) === 'now' && <em>{t('nowLabel')}</em>}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {v.data.classes.map((c) => (
            <tr key={c.id}>
              <th scope="row" className="v1-tt-class">{name(c.name)}</th>
              {cols.map((p) => {
                if (p === 'interval') return <td key="i" className="v1-tt-int" aria-label={`${INTERVAL.start} ${t('interval')}`} />
                const x = c.timetable[p.n - 1]
                const off = leave.has(x.teacherId)
                const cov = off ? coverFor.get(`${c.id}:${p.n}`) : null
                const teacher = v.teacher(cov || x.teacherId)
                return (
                  <td key={p.n} className={`${periodState(p, v.now)} ${off ? (cov ? 'cover' : 'gap') : ''}`}>
                    <span className="v1-tt-sub" title={other(SUBJECTS[x.subject])}>{name(SUBJECTS[x.subject])}</span>
                    <span className="v1-tt-t">{off && !cov ? t('noTeacher') : name(teacher)}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TestBars({ v }) {
  const { t, name } = usePortal()
  const rows = v.results.rows.slice(0, 6)
  return (
    <ul className="v1-test">
      {rows.map((r, i) => (
        <li key={r.s}>
          <span className="v1-test-name">{name(SUBJECTS[r.s])}</span>
          <div className="v1-test-bar"><span className={i === 0 ? 'weak' : ''} style={{ width: `${r.avg}%` }} /></div>
          <span className="v1-test-avg num">{r.avg}</span>
          <span className={`v1-test-chg num ${r.change < 0 ? 'neg' : r.change > 0 ? 'pos' : ''}`}>{r.change > 0 ? '+' : ''}{r.change === 0 ? '0' : r.change}</span>
          <span className="v1-test-low num">{t('below35', { n: r.below35 })}</span>
        </li>
      ))}
    </ul>
  )
}
