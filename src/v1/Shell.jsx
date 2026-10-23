import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { RiCloseLine, RiDashboardLine, RiGroupLine, RiLogoutBoxLine, RiMenuLine, RiTranslate2 } from '@remixicon/react'
import { usePortal } from '../store.jsx'
import { SCHOOL } from '../data/school.js'
import Mark from './Mark.jsx'
import './v1.css'

export default function Shell() {
  const { t, name, L, lang, setLang, grade, setGrade } = usePortal()
  const [menu, setMenu] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  useEffect(() => setMenu(false), [loc.pathname])

  const screen = loc.pathname.endsWith('students') ? t('navStudents') : t('navOverview')

  const side = (
    <>
      <div className="v1-side-brand">
        <Mark size={28} className="v1-mark" />
        <div>
          <strong>{name(SCHOOL)}</strong>
          <span>{t('product')}</span>
        </div>
      </div>
      <label className="v1-switch">
        <span className="sr-only">{t('switchGrade')}</span>
        <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} aria-label={t('switchGrade')}>
          {Array.from({ length: 13 }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>{t('gradeN', { n: g })}</option>
          ))}
        </select>
      </label>
      <p className="v1-side-group">{t('navGroup')}</p>
      <nav className="v1-nav" aria-label={t('navGroup')}>
        <NavLink end to="/v1/portal"><RiDashboardLine size={16} aria-hidden="true" />{t('navOverview')}</NavLink>
        <NavLink to="/v1/portal/students"><RiGroupLine size={16} aria-hidden="true" />{t('navStudents')}</NavLink>
      </nav>
      <div className="v1-side-foot">
        <div className="v1-side-lang" role="group" aria-label={t('language')}>
          <RiTranslate2 size={16} aria-hidden="true" />
          <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
          <button aria-pressed={lang === 'si'} onClick={() => setLang('si')} lang="si">සිංහල</button>
        </div>
        <button className="v1-nav-btn" onClick={() => nav('/v1')}>
          <RiLogoutBoxLine size={16} aria-hidden="true" />
          {t('navSignOut')}
        </button>
      </div>
    </>
  )

  return (
    <div className={`v1 v1-app lang-${L}`}>
      <aside className="v1-side">{side}</aside>
      <header className="v1-phonebar">
        <Mark size={24} className="v1-mark" />
        <span className="v1-phonebar-title">{t('gradeN', { n: grade })} · {screen}</span>
        <button className="v1-iconbtn" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(true)}>
          <RiMenuLine size={20} aria-hidden="true" />
        </button>
      </header>
      {menu && (
        <div className="v1-sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="v1-iconbtn v1-sheet-close" aria-label={t('v2Close')} onClick={() => setMenu(false)}>
            <RiCloseLine size={20} aria-hidden="true" />
          </button>
          {side}
        </div>
      )}
      <main className="v1-canvas">
        <Outlet />
      </main>
    </div>
  )
}
