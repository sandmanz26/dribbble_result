import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useLang } from './i18n.jsx'
import * as I from './ui/icons.jsx'
import { OFFICES } from './data/site.js'
import Home from './pages/Home.jsx'
import Services, { Service } from './pages/Services.jsx'
import Track from './pages/Track.jsx'
import Quote from './pages/Quote.jsx'
import Network from './pages/Network.jsx'
import About from './pages/About.jsx'
import Careers from './pages/Careers.jsx'
import Insights, { Article } from './pages/Insights.jsx'
import Contact from './pages/Contact.jsx'
import Handoff from './pages/Handoff.jsx'
import Credits from './pages/Credits.jsx'
import NotFound from './pages/NotFound.jsx'
import { useReveal } from './ui/reveal.js'

export const NAV = [
  ['/services', { ar: 'الخدمات', en: 'Services' }],
  ['/track', { ar: 'تتبع شحنة', en: 'Track' }],
  ['/network', { ar: 'فروعنا', en: 'Network' }],
  ['/about', { ar: 'من نحن', en: 'About' }],
  ['/insights', { ar: 'أدلة', en: 'Guides' }],
]

export default function App() {
  const loc = useLocation()
  const { lang } = useLang()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  useReveal([loc.pathname, lang])
  const home = loc.pathname === '/'
  return (
    <>
      <a className="skip" href="#main">{lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a>
      <Header over={home} />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<Service />} />
          <Route path="/track" element={<Track />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/network" element={<Network />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:id" element={<Article />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/handoff" element={<Handoff />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function LangSwitch() {
  const { lang, setLang } = useLang()
  const next = lang === 'ar' ? 'en' : 'ar'
  return (
    <button className="lang" onClick={() => setLang(next)} lang={next} aria-label={next === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}>
      {next === 'en' ? 'English' : 'العربية'}
    </button>
  )
}

function Header({ over }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <header className={`bar ${over ? 'is-over' : ''}`}>
      <Link to="/" className="mark" aria-label={t({ ar: 'درب، الصفحة الرئيسية', en: 'Darb, home' })}>
        <span className="mark-ar" lang="ar">درب</span><span className="mark-en" lang="en">Darb</span>
      </Link>
      <nav className="nav" aria-label={t({ ar: 'الرئيسية', en: 'Main' })}>
        {NAV.map(([to, l]) => <NavLink key={to} to={to}>{t(l)}</NavLink>)}
      </nav>
      <div className="bar-end">
        <LangSwitch />
        <Link to="/quote" className="btn is-accent bar-cta">{t({ ar: 'اطلب عرض سعر', en: 'Get a quote' })}</Link>
        <button className="menu-btn" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="drawer" aria-label={t({ ar: 'القائمة', en: 'Menu' })}><I.Menu /></button>
      </div>
      {open && (
        <div className="drawer" id="drawer" role="dialog" aria-modal="true" aria-label={t({ ar: 'القائمة', en: 'Menu' })}>
          <div className="drawer-top">
            <span className="mark"><span className="mark-ar" lang="ar">درب</span></span>
            <button className="menu-btn" onClick={() => setOpen(false)} aria-label={t({ ar: 'إغلاق', en: 'Close' })} autoFocus><I.Close /></button>
          </div>
          <nav className="drawer-nav" aria-label={t({ ar: 'الرئيسية', en: 'Main' })}>
            {NAV.map(([to, l]) => <NavLink key={to} to={to}>{t(l)}</NavLink>)}
            <NavLink to="/careers">{t({ ar: 'الوظائف', en: 'Careers' })}</NavLink>
            <NavLink to="/contact">{t({ ar: 'تواصل معنا', en: 'Contact' })}</NavLink>
          </nav>
          <div className="drawer-foot"><LangSwitch /><Link to="/quote" className="btn is-accent">{t({ ar: 'اطلب عرض سعر', en: 'Get a quote' })}</Link></div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  const { t } = useLang()
  const cols = [
    [{ ar: 'الخدمات', en: 'Services' }, [['/services/sea', { ar: 'الشحن البحري', en: 'Sea freight' }], ['/services/land', { ar: 'النقل البري', en: 'Land freight' }], ['/services/air', { ar: 'الشحن الجوي', en: 'Air freight' }], ['/services/customs', { ar: 'التخليص الجمركي', en: 'Customs clearance' }], ['/services/warehousing', { ar: 'التخزين والتوزيع', en: 'Warehousing' }]]],
    [{ ar: 'العملاء', en: 'Customers' }, [['/track', { ar: 'تتبع شحنة', en: 'Track a shipment' }], ['/quote', { ar: 'اطلب عرض سعر', en: 'Get a quote' }], ['/insights', { ar: 'أدلة الاستيراد', en: 'Import guides' }], ['/contact', { ar: 'تواصل معنا', en: 'Contact' }]]],
    [{ ar: 'الشركة', en: 'Company' }, [['/about', { ar: 'من نحن', en: 'About' }], ['/careers', { ar: 'الوظائف', en: 'Careers' }], ['/handoff', { ar: 'دليل المطورين', en: 'Developer handoff' }], ['/credits', { ar: 'مصادر الصور', en: 'Photo credits' }]]],
  ]
  return (
    <footer className="foot">
      <p className="foot-name" lang="ar" aria-hidden="true">درب</p>
      <div className="foot-row">
        <ul className="foot-places">
          {OFFICES.map((o) => <li key={o.id}><Link to={`/network#${o.id}`}>{t(o.city)}</Link></li>)}
        </ul>
        <div className="foot-cols">
          {cols.map(([h, links]) => (
            <div key={h.en}>
              <h2>{t(h)}</h2>
              <ul>{links.map(([to, l]) => <li key={to}><Link to={to}>{t(l)}</Link></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="foot-legal">
        <p>{t({ ar: 'درب للخدمات اللوجستية. نموذج تصميم تفاعلي، الأرقام والعناوين للعرض فقط. السجل التجاري [يُضاف لاحقًا].', en: 'Darb Logistics. Interactive design prototype; figures and addresses are samples. Commercial registration [to be added].' })}</p>
        <button className="link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t({ ar: 'إلى الأعلى', en: 'Back to top' })}</button>
      </div>
    </footer>
  )
}
