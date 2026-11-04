import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { MdAdd, MdRemove, MdArrowBack, MdArrowForward } from 'react-icons/md'
import { useStore } from './store.jsx'
import { priceOf } from './data/products.js'
import { kd, t } from './i18n.js'

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Navigation with a shared product picture where the browser supports view transitions.
export function useGo() {
  const nav = useNavigate()
  return (to, opts = {}) => {
    if (opts.shared && document.startViewTransition && !reduced()) {
      opts.shared.style.viewTransitionName = 'pimg'
      const t = document.startViewTransition(() => flushSync(() => nav(to)))
      t.finished.finally(() => { if (opts.shared) opts.shared.style.viewTransitionName = '' })
    } else nav(to)
  }
}

export function Mark({ brand, size = 28 }) {
  // The co-op's mark is a simple shape per brand: a palm frond, a wave, a petal. Only the colour token changes.
  const s = size
  const shapes = {
    palm: <path d="M14 26V14M14 14C10 9 5 9 3 11M14 14C18 9 23 9 25 11M14 14C11 6 8 4 6 3M14 14C17 6 20 4 22 3" />,
    wave: <path d="M3 16c3-4 6-4 8 0s5 4 8 0 5-4 6-2M3 22c3-4 6-4 8 0s5 4 8 0 5-4 6-2M8 9a6 6 0 0 1 12 0" />,
    petal: <path d="M14 25c-6-4-9-9-9-14a9 9 0 0 1 18 0c0 5-3 10-9 14ZM14 25V11" />,
  }
  return (
    <span className="mark" style={{ width: s, height: s }} aria-hidden="true">
      <svg viewBox="0 0 28 28" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{shapes[brand.mark]}</svg>
    </span>
  )
}

export function Price({ p, lang, latin, big }) {
  const now = priceOf(p)
  return (
    <span className={`price ${big ? 'big' : ''}`}>
      <b>{kd(now, lang, latin)}</b>
      {p.deal && <s>{kd(p.price, lang, latin)}</s>}
    </span>
  )
}

export function Stepper({ id, qty, small }) {
  const { dispatch, lang, latin } = useStore()
  return (
    <span className={`stepper ${small ? 'sm' : ''}`} role="group" aria-label={t('inCart', lang)}>
      <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'qty', id, qty: qty - 1 }) }} aria-label="-"><MdRemove /></button>
      <output aria-live="polite">{lang === 'ar' && !latin ? String(qty).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : qty}</output>
      <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'qty', id, qty: qty + 1 }) }} aria-label="+"><MdAdd /></button>
    </span>
  )
}

export function ProductCard({ p, wide }) {
  const { lang, latin, cart, dispatch, rate } = useStore()
  const go = useGo()
  const img = useRef(null)
  const line = cart.find((l) => l.id === p.id)
  return (
    <article className={`pcard ${wide ? 'wide' : ''}`} onClick={() => go(`/p/${p.id}`, { shared: img.current })}>
      <div className="pimg">
        <img ref={img} src={p.thumb} alt="" loading="lazy" width="360" height="360" />
        {p.deal && <span className="flag">{lang === 'ar' ? 'عرض' : 'Deal'}</span>}
        <div className="pact" onClick={(e) => e.stopPropagation()}>
        {line ? <Stepper id={p.id} qty={line.qty} small /> : (
          <button className="addbtn" onClick={() => dispatch({ type: 'add', id: p.id })} aria-label={`${t('add', lang)} ${p[lang]}`}><MdAdd /></button>
        )}
      </div>
      </div>
      <div className="pmeta">
        <span className="pname">{p[lang]}</span>
        <span className="punit">{p.unit[lang]}</span>
        <Price p={p} lang={lang} latin={latin} />
        {rate > 0 && <span className="back">+{kd(priceOf(p) * rate, lang, latin)}</span>}
      </div>
    </article>
  )
}

export function BackBtn() {
  const { lang } = useStore()
  const nav = useNavigate()
  const I = lang === 'ar' ? MdArrowForward : MdArrowBack
  return <button className="iconbtn" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} aria-label={t('back', lang)}><I /></button>
}
