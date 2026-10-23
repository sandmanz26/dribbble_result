import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiArrowRightLine } from '@remixicon/react'
import { usePortal } from '../store.jsx'
import { EXAMS, SCHOOL, STAGES, gradeSummary } from '../data/school.js'
import Dual from './Dual.jsx'
import './v2.css'

const SUMMARY = Array.from({ length: 13 }, (_, i) => gradeSummary(i + 1))
const MAX = Math.max(...SUMMARY.map((s) => s.students))

// V2 entry. Step one: the two scripts are the two buttons. Step two: the school's thirteen
// grades as a ruler, each column as tall as its headcount, with the national exams marked.
export default function Entry() {
  const { lang, setLang, grade, setGrade, t, both, name, other } = usePortal()
  const [step, setStep] = useState(lang ? 'grade' : 'lang')
  const [sel, setSel] = useState(grade || 10)
  const nav = useNavigate()
  const radios = useRef([])

  useEffect(() => {
    if (step === 'grade') radios.current[sel - 1]?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const choose = (l) => {
    setLang(l)
    setStep('grade')
  }
  const onKey = (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (e.key === 'Home' || e.key === 'End' || d) {
      e.preventDefault()
      const n = e.key === 'Home' ? 1 : e.key === 'End' ? 13 : Math.min(13, Math.max(1, sel + d))
      setSel(n)
      radios.current[n - 1]?.focus()
    }
  }
  const open = () => {
    setGrade(sel)
    nav('/v2/today')
  }
  const s = SUMMARY[sel - 1]
  const exam = EXAMS.find((e) => e.grade >= sel)

  return (
    <div className={`v2 v2-entry lang-${lang || 'en'}`}>
      <header className="v2-sign">
        <div className="v2-sign-school">
          <strong>{lang === 'si' ? SCHOOL.si : SCHOOL.en}</strong>
          <span>{lang === 'si' ? SCHOOL.en : SCHOOL.si}</span>
        </div>
        <div className="v2-sign-product">
          <span>Student Management System</span>
          <span lang="si">ශිෂ්‍ය කළමනාකරණ පද්ධතිය</span>
        </div>
        {step === 'grade' && (
          <div className="v2-langswap" role="group" aria-label="Language / භාෂාව">
            <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
            <button aria-pressed={lang === 'si'} onClick={() => setLang('si')} lang="si">සිං</button>
          </div>
        )}
      </header>

      {step === 'lang' ? (
        <main className="v2-split">
          <h1 className="v2-split-title">
            <span>Select your preferred language</span>
            <span lang="si">භාෂාව තෝරන්න</span>
          </h1>
          <button className="v2-half" onClick={() => choose('en')}>
            <span className="v2-half-word">English</span>
            <span className="v2-half-sub">Continue in English <RiArrowRightLine size={18} aria-hidden="true" /></span>
          </button>
          <button className="v2-half" onClick={() => choose('si')} lang="si">
            <span className="v2-half-word">සිංහල</span>
            <span className="v2-half-sub">සිංහලෙන් ඉදිරියට <RiArrowRightLine size={18} aria-hidden="true" /></span>
          </button>
        </main>
      ) : (
        <main className="v2-ruler-wrap">
          <div className="v2-ruler-head">
            <h1><Dual v={both('chooseGrade')} /></h1>
            <button className="v2-textbtn" onClick={() => setStep('lang')}>{t('changeLang')}</button>
          </div>

          <div className="v2-ruler" role="radiogroup" aria-label={t('v2Grades')} onKeyDown={onKey}>
            {SUMMARY.map((g) => (
              <button
                key={g.grade}
                ref={(el) => (radios.current[g.grade - 1] = el)}
                role="radio"
                aria-checked={sel === g.grade}
                tabIndex={sel === g.grade ? 0 : -1}
                className={`v2-col ${sel === g.grade ? 'on' : ''}`}
                onClick={() => setSel(g.grade)}
                onDoubleClick={open}
                aria-label={`${t('gradeN', { n: g.grade })}, ${t('v2Students', { n: g.students })}`}
              >
                <span className="v2-col-n num">{g.grade}</span>
                <span className="v2-col-bar" style={{ height: `${(g.students / MAX) * 100}%` }}>
                  <span className="v2-col-count num">{g.students}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Stages and national exams on the same 13-column grid as the ruler */}
          <div className="v2-stages" aria-hidden="true">
            {STAGES.map((st) => (
              <span key={st.id} style={{ gridColumn: `${st.from} / ${st.to + 1}` }}>
                <b>{name(st)}</b>
                <i>{other(st)}</i>
              </span>
            ))}
            {EXAMS.map((e) => (
              <em key={e.grade} style={{ gridColumn: `${e.grade} / ${e.grade + 1}` }}>{name(e.short)}</em>
            ))}
          </div>

          <div className="v2-pickbar">
            <div className="v2-pick-facts">
              <strong className="num">{t('gradeN', { n: sel })}</strong>
              <span>{t('v2Students', { n: s.students })} · {t('v2Classes', { n: s.classes })} · {name(s.stage)}</span>
              {exam && <span className="v2-pick-exam">{name(exam)}{exam.grade === sel ? ` · ${t('thisYear')}` : ` · ${exam.grade - sel === 1 ? t('nextYear') : t('inYears', { n: exam.grade - sel })}`}</span>}
            </div>
            <button className="v2-go" onClick={open}>
              <Dual v={both('enter')} />
              <RiArrowRightLine size={24} aria-hidden="true" />
            </button>
          </div>
        </main>
      )}
    </div>
  )
}
