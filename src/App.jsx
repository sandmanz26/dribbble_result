import { useEffect, useState } from 'react'
import * as A from 'akar-icons'
import { LangCtx, T } from './i18n.js'
import { Mark } from './ui/Ornament.jsx'
import { useNow, timeIn, nextFriday, dateFmt, scrollToId, useReveal } from './ui/util.js'
import { Services, Route, Flow, Quote, Track, Gallery, Offices, Faq, Contact, Footer } from './Sections.jsx'

const KEY = 'gs-lang-v1'

export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem(KEY) || 'en' } catch { return 'en' } })
  useEffect(() => { document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en'; try { localStorage.setItem(KEY, lang) } catch { /* private mode */ } }, [lang])
  useReveal()
  return (
    <LangCtx.Provider value={lang}>
      <Header lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <Services />
        <Route />
        <Flow />
        <Quote />
        <Track />
        <Gallery />
        <Offices />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </LangCtx.Provider>
  )
}

const tx = (lang) => (p) => p[lang === 'zh' ? 1 : 0]

function Header({ lang, setLang }) {
  const t = tx(lang)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const on = () => setScrolled(window.scrollY > 24); on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on) }, [])
  const links = [['services', T.nav.services], ['route', T.nav.how], ['quote', T.nav.quote], ['track', T.nav.track], ['offices', T.nav.offices], ['faq', T.nav.faq]]
  const go = (id) => { setOpen(false); scrollToId(id) }
  return (
    <header className={`top ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="top-in">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <Mark size={28} /><span>Golden Stone<small>{lang === 'zh' ? '金石物流' : 'Logistics'}</small></span>
        </a>
        <nav className="nav" aria-label="Main">{links.map(([id, l]) => <button key={id} onClick={() => go(id)}>{t(l)}</button>)}</nav>
        <div className="top-actions">
          <button className="lang" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}>{lang === 'en' ? '中文' : 'EN'}</button>
          <span className="signin" title={t(T.soon)} aria-disabled="true">{t(T.signin)}<em>{t(T.soon)}</em></span>
          <button className="btn is-small" onClick={() => go('quote')}>{t(T.getQuote)}</button>
          <button className="menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <A.Cross size={20} /> : <A.TextAlignJustified size={20} />}</button>
        </div>
      </div>
      {open && (
        <div className="drawer">
          {links.map(([id, l]) => <button key={id} onClick={() => go(id)}>{t(l)}<A.ArrowRight size={18} /></button>)}
          <button onClick={() => go('contact')}>{t(T.nav.contact)}<A.ArrowRight size={18} /></button>
          <p className="drawer-soon">{t(T.signin)}: {t(T.soon)}</p>
        </div>
      )}
    </header>
  )
}

function Hero({ lang }) {
  const t = tx(lang)
  const now = useNow(15000)
  const cut = nextFriday(now)
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-copy">
        <h1 id="hero-h">{t(T.hero.h1a)} <span>{t(T.hero.h1b)}</span></h1>
        <p className="lede">{t(T.hero.lede)}</p>
        <div className="hero-actions">
          <button className="btn" onClick={() => scrollToId('quote')}>{t(T.getQuote)}<A.ArrowRight size={18} /></button>
          <button className="btn is-line" onClick={() => scrollToId('track')}><A.Search size={17} />{t(T.trackCta)}</button>
        </div>
        <dl className="facts">
          {[['sea', 'seaV'], ['air', 'airV'], ['cons', 'consV']].map(([k, v]) => <div key={k}><dt>{t(T.facts[k])}</dt><dd>{t(T.facts[v])}</dd></div>)}
        </dl>
      </div>
      <div className="hero-media">
        <figure className="hero-photo"><img src="photos/ship-aerial.webp" alt={lang === 'zh' ? '从空中俯瞰满载集装箱的货船' : 'A loaded container ship seen from above'} /></figure>
        <div className="float f1">
          <span className="float-k"><A.Boat size={15} />{t(T.hero.cut)}</span>
          <b>{dateFmt(cut, lang)}</b>
          <span>{t(T.hero.cutWhere)}</span>
        </div>
        <button className="float f2" onClick={() => scrollToId('track')}>
          <span className="float-k"><A.ShippingBoxV2 size={15} />GSL-24817</span>
          <span>{t(T.hero.shipWhere)}</span>
          <span className="mini-bar" aria-hidden="true"><i style={{ width: '64%' }} /></span>
        </button>
        <div className="float f3">
          <span className="clock"><i className="dot" />{lang === 'zh' ? '阿克拉' : 'Accra'}<b>{timeIn(now, 'Africa/Accra')}</b></span>
          <span className="clock"><i className="dot is-red" />{lang === 'zh' ? '广州' : 'Guangzhou'}<b>{timeIn(now, 'Asia/Shanghai')}</b></span>
        </div>
      </div>
    </section>
  )
}
