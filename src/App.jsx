import { useEffect, useState } from 'react'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Taster from './pages/Taster.jsx'
import Start from './pages/Start.jsx'
import Pricing from './pages/Pricing.jsx'
import Team from './pages/Team.jsx'
import System from './pages/System.jsx'
import Audit from './pages/Audit.jsx'
import StudentHome from './app/StudentHome.jsx'
import AppLesson from './app/AppLesson.jsx'
import ParentHome from './app/ParentHome.jsx'
import TeacherHome from './app/TeacherHome.jsx'
import TeacherReview from './app/TeacherReview.jsx'
import { Icon } from './ui/kit.jsx'
import { resetState } from './store.js'

const TITLES = {
  '/': 'ExamAce, A-Level revision marked like an examiner',
  '/taster/economics': 'Free lesson: price elasticity of demand · ExamAce',
  '/start': 'Get started · ExamAce',
  '/pricing': 'Pricing · ExamAce',
  '/team': 'The examiners · ExamAce',
  '/system': 'Design system · ExamAce',
  '/audit': 'UX audit · ExamAce',
  '/app': 'Today · ExamAce',
  '/app/lesson': 'Lesson · ExamAce',
  '/parent': 'Maya this week · ExamAce',
  '/teacher': '13E Economics · ExamAce',
  '/teacher/review': 'Check AI marks · ExamAce',
}

function ScrollAndTitle() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = TITLES[pathname] || 'ExamAce'
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const MAP = [
  ['Stage 1', [['/audit', 'UX audit: where people get stuck']]],
  ['Stage 2: site and system', [['/', 'Homepage'], ['/taster/economics', 'Taster lesson to first mark'], ['/start', 'Sign-up'], ['/pricing', 'Pricing'], ['/team', 'Team'], ['/system', 'Design system']]],
  ['Stage 3: dashboards', [['/app', 'Student'], ['/app/lesson', 'Lesson with tutor'], ['/parent', 'Parent'], ['/teacher', 'Teacher'], ['/teacher/review', 'Teacher checks AI marks']]],
]

function PrototypeMap() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  return (
    <div className={`pmap${open ? ' is-open' : ''}`}>
      {open && (
        <div className="pmap-panel" role="dialog" aria-label="Prototype screens">
          {MAP.map(([group, links]) => (
            <div key={group}>
              <p className="pmap-group">{group}</p>
              {links.map(([to, label]) => (
                <Link key={to} to={to} className={loc.pathname === to ? 'is-here' : ''}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
          <button className="pmap-reset" onClick={() => { resetState(); window.location.hash = '#/' }}>
            Reset demo data
          </button>
        </div>
      )}
      <button className="pmap-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name={open ? 'cross' : 'layout'} size={18} /> Prototype
      </button>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ScrollAndTitle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/taster/:subject" element={<Taster />} />
        <Route path="/start" element={<Start />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/team" element={<Team />} />
        <Route path="/system" element={<System />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/app" element={<StudentHome />} />
        <Route path="/app/lesson" element={<AppLesson />} />
        <Route path="/parent" element={<ParentHome />} />
        <Route path="/teacher" element={<TeacherHome />} />
        <Route path="/teacher/review" element={<TeacherReview />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <PrototypeMap />
    </HashRouter>
  )
}
