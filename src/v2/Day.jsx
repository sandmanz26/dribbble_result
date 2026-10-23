import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiCloseLine, RiErrorWarningLine } from '@remixicon/react'
import { usePortal } from '../store.jsx'
import { useGradeView } from '../useGradeView.js'
import { ATTENDANCE_FLOOR, DAY, INTERVAL, NEXT_TEST, PERIODS, SCHOOL, SUBJECTS, periodState, toMin } from '../data/school.js'
import Dual from './Dual.jsx'
import './v2.css'

const D0 = toMin(DAY.start)
const SPAN = toMin(DAY.end) - D0
const x = (m) => ((m - D0) / SPAN) * 100
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']

function useNarrow() {
  const q = '(max-width: 1024px)'
  const [n, setN] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setN(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return n
}

// Screen question: what does this grade's day need from me right now?
// The day itself is the screen: every class is a lane through 07:30 to 13:30,
// its register sits at the head of the lane, and the gaps are the work.
export default function Day() {
  const { t, both, name, grade, setGrade, lang, setLang, mode, setMode, assign } = usePortal()
  const v = useGradeView()
  const nav = useNavigate()
  const narrow = useNarrow()
  const [slot, setSlot] = useState(null) // relief slot being assigned
  const [roll, setRoll] = useState(null) // class whose register is open
  const [lane, setLane] = useState(0) // phone: one class at a time

  useEffect(() => { setSlot(null); setRoll(null); setLane(0) }, [grade])

  const { attendance: a, open } = v
  const lowRate = a.lowest ? Math.round((a.lowest.present / a.lowest.enrolled) * 100) : null
  const findingKey = open.length === 0 ? 'findingCovered' : open.length === 1 ? 'findingRelief1' : 'findingRelief'
  const state = mode === 'loading' ? 'loading' : mode === 'error' ? 'error' : 'live'
  const slotKey = (c, n) => `${c.id}:${n}`
  const reliefByKey = new Map(v.relief.map((s) => [s.key, s]))

  return (
    <div className={`v2 v2-day lang-${lang}`}>
      <header className="v2-bar">
        <button className="v2-wordmark" onClick={() => nav('/v2')} aria-label={t('navSignOut')}>
          <RiArrowLeftLine size={18} aria-hidden="true" />
          <span>
            <strong>{name(SCHOOL)}</strong>
            <small>{lang === 'si' ? SCHOOL.en : SCHOOL.si}</small>
          </span>
        </button>
        <nav className="v2-minirule" aria-label={t('switchGrade')}>
          {Array.from({ length: 13 }, (_, i) => i + 1).map((g) => (
            <button key={g} aria-current={g === grade ? 'true' : undefined} onClick={() => setGrade(g)} aria-label={t('gradeN', { n: g })}>
              <span className="num">{g}</span>
            </button>
          ))}
        </nav>
        <div className="v2-langswap" role="group" aria-label={t('language')}>
          <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          <button aria-pressed={lang === 'si'} onClick={() => setLang('si')} lang="si">සිං</button>
        </div>
      </header>

      <main className="v2-main">
        <div className="v2-head">
          <h1><Dual v={both('v2Today', { n: grade })} /></h1>
          <p className="v2-finding">
            {state === 'live' ? (
              <>
                <mark>{t(findingKey, { n: open.length })}</mark>{' '}
                {!v.early && a.lowest && t('findingLow', { c: name(a.lowest.c.name), r: lowRate })}
              </>
            ) : ' '}
          </p>
          <dl className="v2-facts">
            <div><dt>{t('kPresent')}</dt><dd className="num">{state !== 'live' || v.early ? '-' : a.total.present}<small> / {a.total.enrolledMarked || '-'}</small></dd></div>
            <div><dt>{t('kUnmarked')}</dt><dd className="num">{state !== 'live' ? '-' : a.total.unmarked}</dd></div>
            <div><dt>{t('kFloor')}</dt><dd className="num">{state !== 'live' ? '-' : v.floor.length}</dd></div>
            <div><dt>{t('kTest')}</dt><dd className="num">{NEXT_TEST.daysAway}<small> {t('days')}</small></dd></div>
          </dl>
        </div>

        <section className="v2-board" aria-labelledby="v2-board-h">
          <div className="v2-board-head">
            <h2 id="v2-board-h"><Dual v={both('ttTitle')} /></h2>
            <ul className="v2-key">
              <li><i className="k-now" />{t('nowLabel')} {v.early ? '07:30' : '10:05'}</li>
              <li><i className="k-gap" />{t('noTeacher')}</li>
              <li><i className="k-cover" />{t('coveredShort')}</li>
              <li><i className="k-abs" />{t('absent')}</li>
            </ul>
          </div>

          {state === 'loading' && <div className="v2-skel" aria-busy="true" aria-label={t('loading')}>{v.data.classes.map((c) => <span key={c.id} />)}</div>}
          {state === 'error' && (
            <div className="v2-error" role="alert">
              <RiErrorWarningLine size={18} aria-hidden="true" />{t('loadError')}
              <button className="v2-textbtn" onClick={() => setMode('live')}>{t('retry')}</button>
            </div>
          )}

          {state === 'live' && !narrow && (
            <div className="v2-lanes">
              <div className="v2-axis" aria-hidden="true">
                {HOURS.map((h) => <span key={h} style={{ left: `${x(toMin(h))}%` }} className="num">{h}</span>)}
                <span className="v2-now-tag num" style={{ left: `${x(v.now)}%` }}>{v.early ? '07:30' : '10:05'}</span>
              </div>
              {v.data.classes.map((c) => (
                <div className="v2-lane" key={c.id}>
                  <Register c={c} v={v} onOpen={() => setRoll(c)} />
                  <div className="v2-track">
                    <span className="v2-interval" style={{ left: `${x(toMin(INTERVAL.start))}%`, width: `${x(toMin(INTERVAL.end)) - x(toMin(INTERVAL.start))}%` }} aria-hidden="true" />
                    {c.timetable.map((p) => {
                      const P = PERIODS[p.period - 1]
                      const r = reliefByKey.get(slotKey(c, p.period))
                      return (
                        <Block key={p.period} c={c} p={p} P={P} r={r} v={v}
                          style={{ left: `${x(toMin(P.start))}%`, width: `calc(${x(toMin(P.end)) - x(toMin(P.start))}% - 4px)` }}
                          onAssign={() => setSlot(r)} />
                      )
                    })}
                    <span className="v2-nowline" style={{ left: `${x(v.now)}%` }} aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {state === 'live' && narrow && (
            <div className="v2-phone">
              <div className="v2-tabs" role="tablist" aria-label={t('colClass')}>
                {v.data.classes.map((c, i) => (
                  <button key={c.id} role="tab" aria-selected={lane === i} onClick={() => setLane(i)}>
                    {name(c.name)}
                    {v.relief.some((s) => s.c.id === c.id && !s.coverId && s.state !== 'past') && <i className="v2-dot" aria-label={t('noTeacher')} />}
                  </button>
                ))}
              </div>
              {(() => {
                const c = v.data.classes[lane]
                return (
                  <div role="tabpanel">
                    <Register c={c} v={v} onOpen={() => setRoll(c)} />
                    <ol className="v2-plist">
                      {c.timetable.map((p) => {
                        const P = PERIODS[p.period - 1]
                        const r = reliefByKey.get(slotKey(c, p.period))
                        return (
                          <li key={p.period}>
                            <span className="v2-plist-time num">{P.start}</span>
                            <Block c={c} p={p} P={P} r={r} v={v} onAssign={() => setSlot(r)} />
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                )
              })()}
            </div>
          )}
        </section>

        <section className="v2-test" aria-labelledby="v2-test-h">
          <div className="v2-board-head">
            <h2 id="v2-test-h"><Dual v={both('testTitle')} /></h2>
            <p className="v2-note">{t('v2Dist')}. {state === 'live' && t('v2Weakest', { s: name(SUBJECTS[v.results.weakest.s]), a: v.results.weakest.avg })}</p>
          </div>
          {state === 'live' ? <Swarm v={v} /> : <div className="v2-skel short" aria-hidden="true"><span /><span /><span /></div>}
        </section>
      </main>

      {slot && (
        <Sheet title={`${name(slot.c.name)} · ${t('period', { n: slot.period.n })}`} onClose={() => setSlot(null)}>
          <p className="v2-sheet-sub">
            {name(SUBJECTS[slot.subject])} · {slot.period.start}-{slot.period.end} · {t('v2Hatch')}: {name(v.teacher(slot.absentTeacherId))}
          </p>
          {slot.coverId ? (
            <div className="v2-sheet-row">
              <span>{t('covered', { t: name(v.teacher(slot.coverId)) })}</span>
              <button className="v2-textbtn" onClick={() => { assign(grade, slot.key, null); setSlot(null) }}>{t('undo')}</button>
            </div>
          ) : (
            <>
              <h3>{t('pickTeacher', { n: slot.period.n })}</h3>
              {v.free(slot.period.n).length === 0 ? <p>{t('nobodyFree')}</p> : (
                <ul className="v2-free">
                  {v.free(slot.period.n).slice(0, 5).map(({ t: tc, load }) => (
                    <li key={tc.id}>
                      <button onClick={() => { assign(grade, slot.key, tc.id); setSlot(null) }}>
                        <strong>{name(tc)}</strong>
                        <span>{name(SUBJECTS[tc.subject])} · {t('load', { n: load })}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Sheet>
      )}

      {roll && (
        <Sheet title={t('v2ClassSheet', { c: name(roll.name) })} onClose={() => setRoll(null)}>
          <RollList c={roll} v={v} />
        </Sheet>
      )}
    </div>
  )
}

// One square per enrolled student: filled is in school, hollow is away, dashed is not marked.
function Register({ c, v, onOpen }) {
  const { t, name } = usePortal()
  const absent = new Set(c.register.absent)
  const present = c.students.length - absent.size
  const ct = v.teacher(c.classTeacherId)
  return (
    <button className={`v2-reg ${c.register.marked ? '' : 'unmarked'}`} onClick={onOpen}
      aria-label={`${name(c.name)}. ${c.register.marked ? t('v2RollOf', { p: present, n: c.students.length }) : t('notMarked')}`}>
      <span className="v2-reg-name">{name(c.name)}</span>
      <span className="v2-reg-t">{name(ct)}</span>
      <span className="v2-units" aria-hidden="true">
        {c.students.map((s) => <i key={s.id} className={!c.register.marked ? 'u' : absent.has(s.id) ? 'a' : 'p'} />)}
      </span>
      <span className="v2-reg-fig num">{c.register.marked ? t('v2RollOf', { p: present, n: c.students.length }) : t('notMarked')}</span>
    </button>
  )
}

function Block({ c, p, P, r, v, style, onAssign }) {
  const { t, name, other } = usePortal()
  const st = periodState(P, v.now)
  const subj = SUBJECTS[p.subject]
  if (r) {
    const cover = r.coverId ? v.teacher(r.coverId) : null
    const gap = !cover && st !== 'past'
    return (
      <button className={`v2-blk ${st} ${gap ? 'gap' : 'cover'}`} style={style} onClick={onAssign}
        aria-label={`${name(subj)}, ${t('period', { n: P.n })}, ${cover ? t('covered', { t: name(cover) }) : t('noTeacher')}`}>
        <b>{name(subj)}</b>
        <span>{cover ? name(cover) : gap ? t('assign') : t('over')}</span>
      </button>
    )
  }
  return (
    <div className={`v2-blk ${st}`} style={style} title={`${other(subj)} · ${P.start}-${P.end}`}>
      <b>{name(subj)}</b>
      <span>{name(v.teacher(p.teacherId))}</span>
    </div>
  )
}

function RollList({ c, v }) {
  const { t, name, other } = usePortal()
  const away = c.students.filter((s) => c.register.absent.includes(s.id))
  const low = [...c.students].filter((s) => s.termAtt < ATTENDANCE_FLOOR).sort((a, b) => a.termAtt - b.termAtt)
  return (
    <>
      <p className="v2-sheet-sub">{c.register.marked ? t('v2RollOf', { p: c.students.length - away.length, n: c.students.length }) : t('notMarked')} · {t('classTeacher')}: {name(v.teacher(c.classTeacherId))}</p>
      <h3>{t('v2Away')}</h3>
      {!c.register.marked ? <p>{t('notMarked')}</p> : away.length === 0 ? <p>{t('v2AwayNone')}</p> : (
        <ul className="v2-roll">
          {away.map((s) => (
            <li key={s.id}>
              <span><strong>{name(s.given)} {name(s.sur)}</strong><small>{other(s.given)} {other(s.sur)}</small></span>
              <span className={`num ${s.termAtt < ATTENDANCE_FLOOR ? 'v2-low' : ''}`}>{t('v2TermAtt', { n: s.termAtt })}</span>
            </li>
          ))}
        </ul>
      )}
      <h3>{t('floorTitle')}</h3>
      {low.length === 0 ? <p>-</p> : (
        <ul className="v2-roll">
          {low.map((s) => (
            <li key={s.id}>
              <span><strong>{name(s.given)} {name(s.sur)}</strong><small>{other(s.given)} {other(s.sur)}</small></span>
              <span className="num v2-low">{s.termAtt}%</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

// Every student's mark as one dot on a 0-100 line, a tick at the subject average,
// the pass mark of 35 as a dashed line through all rows.
function Swarm({ v }) {
  const { t, name } = usePortal()
  const rows = v.results.rows
  return (
    <div className="v2-swarm">
      <div className="v2-swarm-axis num" aria-hidden="true">
        {[0, 25, 75, 100].map((n) => <span key={n} style={{ left: `${n}%` }}>{n}</span>)}
        <em style={{ left: '35%' }}>{t('v2Pass')}</em>
      </div>
      {rows.map((r, i) => {
        const marks = v.data.classes.flatMap((c) => (c.subjects.includes(r.s) ? c.students.map((s) => s.marks[r.s]) : []))
        const seen = {}
        return (
          <div className={`v2-swarm-row ${i === 0 ? 'weak' : ''}`} key={r.s}>
            <span className="v2-swarm-name"><span>{name(SUBJECTS[r.s])}</span></span>
            <div className="v2-swarm-plot" role="img" aria-label={`${name(SUBJECTS[r.s])}: ${r.avg}, ${t('below35', { n: r.below35 })}`}>
              <span className="v2-pass" style={{ left: '35%' }} />
              {marks.map((m, k) => {
                const n = (seen[m] = (seen[m] || 0) + 1)
                return <i key={k} className={m < 35 ? 'f' : ''} style={{ left: `${m}%`, bottom: `${4 + ((n - 1) % 6) * 5}px` }} />
              })}
              <b style={{ left: `${r.avg}%` }} />
            </div>
            <span className="v2-swarm-avg num">{r.avg}</span>
            <span className="v2-swarm-chg num">{r.change > 0 ? '+' : ''}{r.change}</span>
          </div>
        )
      })}
    </div>
  )
}

function Sheet({ title, onClose, children }) {
  const { t } = usePortal()
  useEffect(() => {
    const f = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [onClose])
  return (
    <div className="v2-scrim" onClick={onClose}>
      <aside className="v2-sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="v2-sheet-head">
          <h2>{title}</h2>
          <button className="v2-x" onClick={onClose} aria-label={t('v2Close')} autoFocus><RiCloseLine size={22} aria-hidden="true" /></button>
        </div>
        {children}
      </aside>
    </div>
  )
}
