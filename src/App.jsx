import { useEffect, useState } from 'react'
import * as A from 'akar-icons'
import { LangCtx, T } from './i18n.js'
import { Mark, Kente, Fret, Lattice } from './ui/Ornament.jsx'
import Globe from './ui/Globe.jsx'
import { useNow, timeIn, nextFriday, dateFmt, scrollToId, useReveal } from './ui/util.js'
import { Intro, Services, Flow, Quote, Track, Offices, Faq, Contact, Footer } from './Sections.jsx'

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
        <Intro />
        <Services />
        <Flow />
        <Quote />
        <Track />
        <Offices />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </LangCtx.Provider>
  )
}

function useTx(lang) { const i = lang === 'zh' ? 1 : 0; return (p) => p[i] }

function Header({ lang, setLang }) {
  const t = useTx(lang)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const on = () => setScrolled(window.scrollY > 24); on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on) }, [])
  const links = [['services', T.nav.services], ['quote', T.nav.quote], ['track', T.nav.track], ['how', T.nav.how], ['offices', T.nav.offices], ['faq', T.nav.faq]]
  const go = (id) => { setOpen(false); scrollToId(id) }
  return (
    <header className={`top ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <Mark size={30} /><span>Golden Stone<small>{lang === 'zh' ? '金石物流' : 'Logistics'}</small></span>
      </a>
      <nav className="nav" aria-label="Main">
        {links.map(([id, l]) => <button key={id} onClick={() => go(id)}>{t(l)}</button>)}
      </nav>
      <div className="top-actions">
        <button className="lang" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}>
          <A.Language size={17} />{t(T.lang)}
        </button>
        <span className="signin" title={t(T.soon)} aria-disabled="true"><A.Person size={17} />{t(T.signin)}<em>{t(T.soon)}</em></span>
        <button className="btn is-small" onClick={() => go('quote')}>{t(T.nav.quote)}</button>
        <button className="menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <A.Cross size={20} /> : <A.TextAlignJustified size={20} />}</button>
      </div>
      {open && (
        <div className="drawer">
          {links.map(([id, l]) => <button key={id} onClick={() => go(id)}>{t(l)}<A.ArrowRight size={18} /></button>)}
          <button onClick={() => go('contact')}>{t(T.nav.contact)}<A.ArrowRight size={18} /></button>
          <p className="drawer-soon"><A.Person size={16} /> {t(T.signin)}: {t(T.soon)}</p>
        </div>
      )}
    </header>
  )
}

function Hero({ lang }) {
  const t = useTx(lang)
  const now = useNow(15000)
  const [focus, setFocus] = useState(null)
  const cut = nextFriday(now)
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-text">
        <h1 id="hero-h"><span>{t(T.hero.h1a)}</span> <span className="gold-word">{t(T.hero.h1b)}</span></h1>
        <p className="lede">{t(T.hero.lede)}</p>
        <div className="hero-actions">
          <button className="btn" onClick={() => scrollToId('quote')}>{t(T.getQuote)}<A.ArrowRight size={18} /></button>
          <button className="btn is-quiet" onClick={() => scrollToId('track')}><A.Search size={17} />{t(T.trackCta)}</button>
        </div>
        <p className="hero-route" aria-label="Route">
          <button onMouseEnter={() => setFocus('cn')} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus('cn')} onBlur={() => setFocus(null)}><i className="dot is-red" />{lang === 'zh' ? '广州 · 义乌 · 深圳' : 'Guangzhou · Yiwu · Shenzhen'}</button>
          <span className="route-line" aria-hidden="true" />
          <button onMouseEnter={() => setFocus('gh')} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus('gh')} onBlur={() => setFocus(null)}><i className="dot" />{lang === 'zh' ? '特马 · 阿克拉 · 库马西' : 'Tema · Accra · Kumasi'}</button>
        </p>
      </div>

      <div className="gate" aria-hidden="false">
        <div className="gate-disc">
          <Lattice className="gate-lattice" />
          <Globe focus={focus} />
        </div>
        <div className="float f1">
          <span className="float-k"><A.Boat size={16} />{t(T.hero.cut)}</span>
          <b>{dateFmt(cut, lang)}</b>
          <span>{t(T.hero.cutWhere)}</span>
        </div>
        <div className="float f2">
          <span className="float-k"><A.Plane size={16} />{t(T.hero.air)}</span>
          <span>{t(T.hero.airWhen)}</span>
        </div>
        <div className="float f3">
          <span className="float-k"><A.Clock size={16} />{t(T.hero.now)}</span>
          <span className="clocks"><span><i className="dot" />{lang === 'zh' ? '阿克拉' : 'Accra'} <b>{timeIn(now, 'Africa/Accra')}</b></span><span><i className="dot is-red" />{lang === 'zh' ? '广州' : 'Guangzhou'} <b>{timeIn(now, 'Asia/Shanghai')}</b></span></span>
        </div>
        <button className="float f4" onClick={() => scrollToId('track')}>
          <span className="float-k"><A.ShippingBoxV2 size={16} />{t(T.hero.ship)} GSL-24817</span>
          <span>{t(T.hero.shipWhere)}</span>
          <span className="mini-bar" aria-hidden="true"><i style={{ width: '64%' }} /></span>
        </button>
      </div>
      <div className="hero-edge"><Kente height={16} /><Fret /></div>
    </section>
  )
}
