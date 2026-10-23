import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import { usePortal } from '../store.jsx'
import { SCHOOL, TERM, STAGES } from '../data/school.js'
import Mark from './Mark.jsx'
import './v1.css'

// The letters of a classroom alphabet chart, both scripts, set faintly behind the panel.
const MOTIF = 'අආඇඈඉඊඋඌඑඒඔඕකගචජටඩතදපබමයරලවසහAaBbCcDdEeGgKkMmRrSs123+×÷=π√'.split('')
const MOTIF_SI = new Set('අආඇඈඉඊඋඌඑඒඔඕකගචජටඩතදපබමයරලවසහ'.split(''))

export default function Entry() {
  const { lang, setLang, grade, setGrade, t, L, name } = usePortal()
  const [step, setStep] = useState(lang ? 'grade' : 'lang')
  const [choice, setChoice] = useState(grade ? String(grade) : '')
  const [error, setError] = useState(false)
  const nav = useNavigate()
  const gradeHeading = useRef(null)

  useEffect(() => {
    if (step === 'grade') gradeHeading.current?.focus()
  }, [step])

  const pick = (l) => {
    setLang(l)
    setStep('grade')
  }
  const submit = (e) => {
    e.preventDefault()
    if (!choice) return setError(true)
    setGrade(Number(choice))
    nav('/v1/portal')
  }

  return (
    <div className="v1 v1-entry">
      <div className="v1-motif" aria-hidden="true">
        {Array.from({ length: 6 }, (_, k) => MOTIF.map((ch, i) => (
          <span key={`${k}-${i}`} className={MOTIF_SI.has(ch) ? 'si' : ''}>{ch}</span>
        )))}
      </div>

      <header className="v1-top">
        <div className="v1-brand">
          <Mark size={32} className="v1-mark-light" />
          <div>
            <strong>{name(SCHOOL)}</strong>
            <span>{L === 'si' ? SCHOOL.placeSi : SCHOOL.placeEn}</span>
          </div>
        </div>
        <div className="v1-langnav" role="group" aria-label="Language / භාෂාව">
          <button aria-pressed={lang === 'en'} onClick={() => pick('en')}>English</button>
          <button aria-pressed={lang === 'si'} onClick={() => pick('si')} lang="si">සිංහල</button>
        </div>
      </header>

      <main className="v1-entry-main">
        {step === 'lang' ? (
          <section className="v1-panel" aria-labelledby="v1-title">
            <h1 id="v1-title">Student Management System</h1>
            <p className="v1-sub">
              Select your preferred language <span aria-hidden="true">/</span> <span lang="si">භාෂාව තෝරන්න</span>
            </p>
            <div className="v1-langs">
              <button className="v1-lang" onClick={() => pick('en')}>
                <span className="v1-lang-name">English</span>
                <span className="v1-lang-sub">Continue in English</span>
                <RiArrowRightLine size={20} aria-hidden="true" />
              </button>
              <button className="v1-lang" onClick={() => pick('si')} lang="si">
                <span className="v1-lang-name">සිංහල</span>
                <span className="v1-lang-sub">සිංහලෙන් ඉදිරියට</span>
                <RiArrowRightLine size={20} aria-hidden="true" />
              </button>
            </div>
          </section>
        ) : (
          <section className="v1-panel" aria-labelledby="v1-grade-title">
            <h1 className="v1-h1-small">{t('product')}</h1>
            <h2 id="v1-grade-title" ref={gradeHeading} tabIndex={-1}>{t('chooseGrade')}</h2>
            <p className="v1-sub">{t('gradeHint')}</p>
            <form className="v1-gradeform" onSubmit={submit} noValidate>
              <label htmlFor="v1-grade">{t('gradeLabel')}</label>
              <div className="v1-select">
                <select
                  id="v1-grade"
                  value={choice}
                  aria-invalid={error}
                  aria-describedby={error ? 'v1-grade-err' : undefined}
                  onChange={(e) => { setChoice(e.target.value); setError(false) }}
                >
                  <option value="" disabled>{t('gradePlaceholder')}</option>
                  {STAGES.map((s) => (
                    <optgroup key={s.id} label={name(s)}>
                      {Array.from({ length: s.to - s.from + 1 }, (_, i) => s.from + i).map((g) => (
                        <option key={g} value={g}>{t('gradeN', { n: g })}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {error && <p id="v1-grade-err" className="v1-err" role="alert">{t('gradeRequired')}</p>}
              <button type="submit" className="v1-enter">
                {t('enter')}
                <RiArrowRightLine size={20} aria-hidden="true" />
              </button>
            </form>
            <button className="v1-back" onClick={() => setStep('lang')}>
              <RiArrowLeftLine size={16} aria-hidden="true" />
              {t('changeLang')}
            </button>
          </section>
        )}
      </main>

      <footer className="v1-entry-foot">
        <span>{t('termLine', { n: TERM.n, d: TERM.daysSoFar })}</span>
        <span>{t('demoTime')}</span>
      </footer>
    </div>
  )
}
