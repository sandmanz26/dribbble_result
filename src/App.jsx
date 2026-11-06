import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { IoLogoInstagram, IoLogoYoutube, IoIosCart, IoIosPerson, IoIosMenu, IoIosClose, IoIosAdd, IoIosRemove, IoIosArrowRoundForward, IoIosCheckmark } from 'react-icons/io'
import { useStore, VARIANTS } from './store.jsx'
import { ANNOUNCE, FLAVORS, FREE_AT, usd } from './data.js'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Moments from './pages/Moments.jsx'
import { WhereToBuy, About, Faq, Hello, Wholesale, Legal } from './pages/More.jsx'
import Account from './pages/Account.jsx'

export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Subtle reveals only: 250 ms fades and short slides, no bounce.
export function useReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-r]:not([data-in])') || []
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach((e) => (e.dataset.in = '1')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.dataset.in = '1'; io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, deps) // eslint-disable-line
  return ref
}

export function Wordmark({ small }) {
  return <span className={`wordmark ${small ? 'sm' : ''}`}><b>BRTH</b><i>LABS</i><sup>™</sup></span>
}

function Announce() {
  const [i, setI] = useState(0)
  useEffect(() => { if (reduced()) return; const t = setInterval(() => setI((x) => (x + 1) % ANNOUNCE.length), 4000); return () => clearInterval(t) }, [])
  return <div className="announce"><Link key={i} to={ANNOUNCE[i][1]}>{ANNOUNCE[i][0]}</Link></div>
}

function Header() {
  const s = useStore()
  const [menu, setMenu] = useState(false)
  const loc = useLocation()
  useEffect(() => setMenu(false), [loc.pathname])
  const links = [['/shop', 'Shop'], ['/how-it-works', 'How it works'], ['/moments', 'Moments'], ['/where-to-buy', 'Where to buy']]
  return (
    <header className="hdr">
      <Link to="/" className="brand" aria-label="BRTH Labs, home"><Wordmark small /></Link>
      <nav className="nav" aria-label="Main">{links.map(([to, l]) => <NavLink key={to} to={to}>{l}</NavLink>)}</nav>
      <div className="hdr-r">
        <Link to="/account" className="ico acct" aria-label="Account"><IoIosPerson /></Link>
        <button className="ico cart" onClick={() => s.setOpen(true)} aria-label={`Bag, ${s.count} items`}><IoIosCart />{s.count > 0 && <b key={s.puff}>{s.count}</b>}</button>
        <button className="ico burger" onClick={() => setMenu(true)} aria-label="Menu" aria-expanded={menu}><IoIosMenu /></button>
      </div>
      {menu && (
        <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="ico close" onClick={() => setMenu(false)} aria-label="Close menu"><IoIosClose /></button>
          <nav>{[['/', 'Home'], ...links, ['/about', 'About'], ['/faq', 'FAQ'], ['/account', 'Account']].map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}</nav>
          <p className="menu-foot">Make every moment fresh.™</p>
        </div>
      )}
    </header>
  )
}

function Cart() {
  const s = useStore()
  const nav = useNavigate()
  const [done, setDone] = useState(false)
  const [code, setCode] = useState(false)
  const [bought, setBought] = useState(null)
  const [extra, setExtra] = useState(false)
  useEffect(() => { if (!s.open) { setDone(false); setExtra(false) } }, [s.open])
  useEffect(() => {
    if (!s.open) return
    const k = (e) => e.key === 'Escape' && s.setOpen(false)
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [s.open]) // eslint-disable-line
  const hasArctic = s.lines.some((l) => l.flavor === 'arctic' || l.flavor === 'duo')
  const hasMint = s.lines.some((l) => l.flavor === 'spearmint' || l.flavor === 'duo')
  const upsell = !hasArctic ? FLAVORS.arctic : !hasMint ? FLAVORS.spearmint : null
  return (
    <div className={`drawer ${s.open ? 'open' : ''}`} aria-hidden={!s.open}>
      <div className="scrim" onClick={() => s.setOpen(false)} />
      <aside className="panel" role="dialog" aria-modal="true" aria-label="Your bag" inert={s.open ? undefined : ''}>
        <div className="panel-head"><h2>Your bag</h2><button className="ico" onClick={() => s.setOpen(false)} aria-label="Close bag"><IoIosClose /></button></div>
        {done ? (
          <div className="empty">
            <IoIosCheckmark className="big-ok" aria-hidden="true" /><p className="done-h">Order placed. Lean in, you’re good.</p><small>Prototype: no payment was taken.</small>
            {bought && (extra ? <p className="ok">{bought.name} added to this order at 20% off.</p> : (
              <div className="post-up" style={{ '--field': bought.field }}>
                <img src={`img/${bought.img}.webp`} alt="" /><span><b>Add {bought.name} to this order</b><small>One click, 20% off: {usd(7.99 * 0.8)}</small></span>
                <button className="btn sm accent" onClick={() => setExtra(true)}>Add it</button>
              </div>
            ))}
          </div>
        ) : s.lines.length === 0 ? (
          <div className="empty"><p>Your bag is empty.</p><button className="btn" onClick={() => { s.setOpen(false); nav('/shop') }}>Shop the 2-pack</button></div>
        ) : (
          <>
            <div className="ship" role="status">
              <p>{s.freeShip ? 'You’ve got free shipping.' : `You’re ${usd(7.99 * (FREE_AT - s.packs))} away from free shipping.`}</p>
              <i><span style={{ width: `${Math.min(100, (s.packs / FREE_AT) * 100)}%` }} /></i>
            </div>
            <ul className="lines">{s.lines.map((l) => (
              <li key={l.key}>
                <span className="thumb" style={{ background: l.flavor === 'arctic' ? FLAVORS.arctic.field : l.flavor === 'spearmint' ? FLAVORS.spearmint.field : '#E7E4DC' }}><img src={`img/${l.img}.webp`} alt="" /></span>
                <span className="grow"><b>{l.name}</b><small>{l.packs} × 2-pack{l.every ? `, every ${l.every} month${l.every > 1 ? 's' : ''}` : ''}</small>
                  {!l.every && <button className="link sm" onClick={() => s.toSub(l.key)}>Subscribe and save 20%</button>}
                </span>
                <span className="qty sm"><button onClick={() => s.qty(l.key, -1)} aria-label="One less"><IoIosRemove /></button><output>{l.qty}</output><button onClick={() => s.qty(l.key, 1)} aria-label="One more"><IoIosAdd /></button></span>
                <b className="price">{usd(l.price * l.qty)}</b>
              </li>
            ))}</ul>
            {upsell && (
              <button className="upsell" onClick={() => s.add({ id: upsell.id, name: upsell.name, flavor: upsell.id, img: upsell.img, packs: 1, price: 7.99 }, { show: false })}>
                <span className="dot" style={{ background: upsell.field }} />Add {upsell.name} for $7.99<IoIosAdd aria-hidden="true" />
              </button>
            )}
            <div className="panel-foot">
              <button className="link sm" onClick={() => setCode((c) => !c)} aria-expanded={code}>Discount code</button>
              {code && <label className="field inline"><span className="sr">Discount code</span><input placeholder="Code" /><button className="btn sm ghost">Apply</button></label>}
              <p className="total"><span>Subtotal</span><b>{usd(s.sub)}</b></p>
              <div className="express" role="group" aria-label="Express checkout, placeholders"><span>Express checkout</span>{['Shop Pay', 'Apple Pay', 'Google Pay', 'PayPal'].map((x) => <button key={x} type="button" title="Placeholder: connects in the Shopify build">{x}</button>)}</div>
              <button className="btn wide" onClick={() => { setBought(upsell || FLAVORS.arctic); s.clear(); setDone(true) }}>Check out · {usd(s.sub)}</button>
              <small className="muted">One code per order. Taxes at checkout.</small>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

// 15% welcome offer: after 8 seconds on the first visit; bottom sheet on phones.
function EmailPop() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const loc = useLocation()
  useEffect(() => {
    let seen = false; try { seen = sessionStorage.getItem('brth-pop') } catch { /* */ }
    if (seen || loc.pathname === '/hello') return
    const go = () => { setShow(true); try { sessionStorage.setItem('brth-pop', '1') } catch { /* */ } ; cleanup() }
    const t = setTimeout(go, 8000)
    const leave = (e) => { if (e.clientY <= 0) go() }
    document.addEventListener('mouseout', leave)
    const cleanup = () => { clearTimeout(t); document.removeEventListener('mouseout', leave) }
    return cleanup
  }, []) // eslint-disable-line
  if (!show) return null
  return (
    <div className="pop-wrap" onClick={() => setShow(false)}>
      <div className="pop" role="dialog" aria-modal="true" aria-label="Get 15% off" onClick={(e) => e.stopPropagation()}>
        <button className="ico close" onClick={() => setShow(false)} aria-label="Close"><IoIosClose /></button>
        {step < 2 ? (
          <form onSubmit={(e) => { e.preventDefault(); setStep(step + 1) }}>
            <h2>Get 15% off your first order.</h2>
            <p>Plus first dibs on new flavors.</p>
            {step === 0 ? <label className="field"><span>Email</span><input type="email" required autoComplete="email" /></label> : <label className="field"><span>Phone for SMS (optional)</span><input type="tel" autoComplete="tel" /></label>}
            <button className="btn wide">{step === 0 ? 'Get my code' : 'Finish'}</button>
            {step === 1 && <button type="button" className="link sm" onClick={() => setStep(2)}>Skip SMS</button>}
          </form>
        ) : (
          <div className="code"><h2>Your code: FRESH15</h2><p>We also sent it to your inbox. Prototype: nothing was sent.</p><button className="btn wide" onClick={() => setShow(false)}>Start shopping</button></div>
        )}
      </div>
    </div>
  )
}

function Footer() {
  const [ok, setOk] = useState(false)
  const cols = [
    ['Shop', [['/products/spearmint', 'Spearmint'], ['/products/arctic-mint', 'Arctic Mint'], ['/shop#bundles', 'Bundles'], ['/products/spearmint?sub=1', 'Subscribe']]],
    ['Learn', [['/how-it-works', 'How it works'], ['/faq', 'FAQ'], ['/how-it-works#hiw-in', 'Ingredients']]],
    ['Company', [['/about', 'About'], ['/wholesale', 'Wholesale'], ['/wholesale#press', 'Press'], ['/wholesale#ws-h', 'Contact']]],
    ['Legal', [['/legal/privacy', 'Privacy'], ['/legal/terms', 'Terms'], ['/legal/accessibility', 'Accessibility'], ['/legal/shipping', 'Shipping & returns']]],
  ]
  return (
    <footer className="foot">
      <div className="foot-top">
        <form className="foot-sign" onSubmit={(e) => { e.preventDefault(); setOk(true) }}>
          <h2>Make every moment fresh.™</h2>
          {ok ? <p>You’re in. Watch your inbox.</p> : <label className="field inline"><span className="sr">Email</span><input type="email" required placeholder="Email address" autoComplete="email" /><button className="btn">Sign up</button></label>}
        </form>
        <div className="foot-cols">{cols.map(([h, ls]) => <div key={h}><b>{h}</b>{ls.map(([to, l]) => <Link key={l} to={to}>{l}</Link>)}</div>)}</div>
      </div>
      <div className="foot-bot">
        <Wordmark small />
        <span>BRTH is pronounced “breath.”</span>
        <span className="social" aria-label="Social, links at launch"><a href="#tiktok" onClick={(e) => e.preventDefault()}>TikTok</a><a href="#instagram" onClick={(e) => e.preventDefault()}><IoLogoInstagram aria-hidden="true" />Instagram</a><a href="#youtube" onClick={(e) => e.preventDefault()}><IoLogoYoutube aria-hidden="true" />YouTube</a></span>
        <span>© 2026 BRTH Labs LLC. New York, NY.</span>
      </div>
    </footer>
  )
}

// Reviewer panel: switch the design direction live. Not part of the shipped site.
function Switcher() {
  const s = useStore()
  const [open, setOpen] = useState(false)
  const cur = VARIANTS.find((v) => v.id === s.variant)
  return (
    <div className={`switcher ${open ? 'open' : ''}`} role="region" aria-label="Design direction switcher">
      <div className="sw-row">
        <button className="sw-tog" onClick={() => setOpen((o) => !o)} aria-expanded={open} title="What is this direction?">Design</button>
        <div className="sw-opts" role="radiogroup" aria-label="Design direction">
          {VARIANTS.map((v, i) => <button key={v.id} role="radio" aria-checked={s.variant === v.id} onClick={() => s.setVariant(v.id)} title={v.name}><b>{String.fromCharCode(65 + i)}</b><span>{v.name}</span></button>)}
        </div>
      </div>
      {open && <p>{cur.name}: {cur.note}</p>}
    </div>
  )
}

export default function App() {
  const loc = useLocation()
  const s = useStore()
  useEffect(() => {
    scrollTo(0, 0)
    const t = { '/': 'BRTH Labs™, make every moment fresh.', '/shop': 'Shop · BRTH Labs', '/how-it-works': 'How it works · BRTH Labs', '/moments': 'Moments · BRTH Labs', '/where-to-buy': 'Where to buy · BRTH Labs', '/about': 'About · BRTH Labs', '/faq': 'FAQ · BRTH Labs', '/account': 'Account · BRTH Labs', '/wholesale': 'Wholesale · BRTH Labs', '/products/spearmint': 'Spearmint · BRTH Labs', '/products/arctic-mint': 'Arctic Mint · BRTH Labs' }
    document.title = t[loc.pathname] || 'BRTH Labs'
    if (loc.hash) setTimeout(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView(), 80)
  }, [loc.pathname, loc.hash])
  return (
    <div className="app" data-flavor={s.flavor}>
      <a className="skip" href="#main">Skip to content</a>
      <Announce />
      <Header />
      <main id="main" key={loc.pathname + s.variant}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<Product />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/where-to-buy" element={<WhereToBuy />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/hello" element={<Hello />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/account" element={<Account />} />
          <Route path="/legal/:page" element={<Legal />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Cart />
      <EmailPop />
      <Switcher />
    </div>
  )
}

export function Arrow() { return <IoIosArrowRoundForward aria-hidden="true" className="arr" /> }
