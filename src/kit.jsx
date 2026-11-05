import { useEffect, useRef, useState } from 'react'
import { FaStar, FaCheck, FaArrowRight, FaPlay, FaPause } from 'react-icons/fa6'
import { FLAVOURS, flavour } from './data.js'

export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// One rAF loop for scroll effects.
const subs = new Set(); let raf = 0
const tick = () => { raf = 0; subs.forEach((f) => f()) }
if (typeof window !== 'undefined') { addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick) }, { passive: true }); addEventListener('resize', tick) }
export function useScroll(fn) {
  const f = useRef(fn); f.current = fn
  useEffect(() => { const run = () => f.current(); subs.add(run); run(); return () => subs.delete(run) }, [])
}
export const through = (el) => { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height))) }

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

export function Logo({ small }) {
  return <span className={`logo ${small ? 'sm' : ''}`} aria-hidden="true"><b>Khango</b><i>Supps</i></span>
}

// The tub swaps with a quarter turn whenever the flavour changes.
export function Tub({ id, className = '', style }) {
  const f = flavour(id)
  return (
    <div className={`tub ${className}`} style={style}>
      <img key={f.id} src={`img/${f.img}.webp`} alt={`KhangoSupps whey protein, ${f.name}`} width="620" height="900" />
    </div>
  )
}

export function Picker({ value, onChange, label = 'Pick a flavour' }) {
  return (
    <div className="picker" role="radiogroup" aria-label={label}>
      {FLAVOURS.map((f) => (
        <button key={f.id} role="radio" aria-checked={value === f.id} onClick={() => onChange(f.id)} style={{ '--f': f.field, '--p': f.pop }}>
          <i aria-hidden="true" /><span>{f.short}</span>
        </button>
      ))}
    </div>
  )
}

// The panel from the back of the tub, set large.
export function Label({ id, compact }) {
  const f = flavour(id)
  const x = f.facts
  return (
    <div className={`label ${compact ? 'compact' : ''}`} aria-label={`Nutrition facts, ${f.name}`} role="group">
      <p className="lb-title">Nutrition Facts</p>
      <p className="lb-serv"><span>1 scoop (32 g)</span><span>30 servings</span></p>
      <div className="lb-cal"><span>Calories</span><b>{x.kcal}</b></div>
      <dl>
        <div><dt>Protein</dt><dd>{x.protein} g</dd></div>
        <div><dt>Total carbohydrate</dt><dd>{x.carbs} g</dd></div>
        <div className="in"><dt>Total sugars</dt><dd>{x.sugar} g</dd></div>
        <div><dt>Total fat</dt><dd>{x.fat} g</dd></div>
      </dl>
      {!compact && <p className="lb-ings"><b>Ingredients:</b> {f.ings.map(([n]) => n).join(', ')}.</p>}
      <p className="lb-note">Sample panel. Final values come from the client's lab sheet.</p>
    </div>
  )
}

export function Stars({ n }) {
  return <span className="stars" aria-label={`${n} of 5 stars`}>{[0, 1, 2, 3, 4].map((i) => <FaStar key={i} aria-hidden="true" className={i < n ? 'on' : ''} />)}</span>
}

export function Review({ r, i = 0 }) {
  const f = flavour(r.flavour)
  return (
    <figure className="review" style={{ '--f': f.field, '--fi': f.ink, '--i': i }} data-r>
      <Stars n={r.stars} />
      <blockquote>{r.t}</blockquote>
      <figcaption><b>{r.name}</b><span>{r.who}, {r.where}</span><em>{f.short}</em></figcaption>
    </figure>
  )
}

export function Video({ src, poster, children }) {
  const v = useRef(null)
  const [playing, setPlaying] = useState(!reduced())
  useEffect(() => {
    const el = v.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && playing) el.play().catch(() => {}); else el.pause() })
    io.observe(el); return () => io.disconnect()
  }, [playing])
  return (
    <div className="video">
      <video ref={v} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label="A hand shakes a KhangoSupps shaker and sets it down next to a tub" />
      {children}
      <button className="vid-btn" onClick={() => { setPlaying((p) => { const n = !p; n ? v.current.play() : v.current.pause(); return n }) }} aria-label={playing ? 'Pause the video' : 'Play the video'}>
        {playing ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  )
}

// The starter pack form: one email, one decision.
export function Offer({ id, onFlavour, persona }) {
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const f = flavour(id)
  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr('An email so we can send your code.'); return }
    if (!/^\d{5}$/.test(zip)) { setErr('A 5-digit ZIP code, so we know it ships to you.'); return }
    setErr(''); setDone(true)
  }
  return (
    <div className="offer" style={{ '--f': f.field, '--fi': f.ink, '--p': f.pop }}>
      <div className="of-art" aria-hidden="true">
        {FLAVOURS.map((x, k) => <img key={x.id} src={`img/${x.img}.webp`} alt="" style={{ '--k': k }} className={x.id === id ? 'lead' : ''} />)}
        <img src="img/shaker.webp" alt="" className="of-shaker" />
      </div>
      <div className="of-body" aria-live="polite">
        {done ? (
          <div className="of-done">
            <span className="of-tick" aria-hidden="true"><FaCheck /></span>
            <h3>Check your inbox.</h3>
            <p>Your code for the starter pack is on its way to {email}. It ships to {zip} in two to four days.</p>
            <p className="tiny">Prototype: nothing was sent.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h3>The starter pack</h3>
            <p>Four single-serve sachets, one of every flavour, and the shaker. <b>$9.99</b> with free delivery{persona ? `, made for ${persona.toLowerCase()}` : ''}.</p>
            {onFlavour && <><p className="of-q">Which one are you most curious about?</p><Picker value={id} onChange={onFlavour} label="Flavour to try first" /></>}
            <div className="of-fields">
              <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!err && !/^\S+@\S+\.\S+$/.test(email)} /></label>
              <label>ZIP code<input inputMode="numeric" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} autoComplete="postal-code" /></label>
            </div>
            {err && <p className="err" role="alert">{err}</p>}
            <button className="btn">Send me the code<FaArrowRight aria-hidden="true" /></button>
            <p className="tiny">One email with the code. No subscription.</p>
          </form>
        )}
      </div>
    </div>
  )
}
