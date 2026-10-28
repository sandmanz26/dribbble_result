import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as A from 'akar-icons'
import { T, FAQ, useT, LangCtx } from './i18n.js'
import { SERVICES, RATES, ORIGINS, DESTS, GOODS, SHIPMENT, OFFICES } from './data/content.js'
import { Mark, Kente } from './ui/Ornament.jsx'
import Globe from './ui/Globe.jsx'
import credits from './data/credits.json'
import { useNow, timeIn, partsIn, dateFmt, scrollToId } from './ui/util.js'

const usd = (n) => `$${Math.round(n).toLocaleString('en-US')}`

const SVC_PHOTO = { sea: 'ship-sea', warehouse: 'warehouse', collection: 'yard', enquiry: 'port-night', quote: 'racks' }
export function Services() {
  const t = useT()
  const [sel, setSel] = useState('sea')
  const s = T.services[sel]
  const svc = SERVICES.find((x) => x.id === sel)
  const go = () => scrollToId(sel === 'enquiry' || sel === 'warehouse' || sel === 'collection' ? 'contact' : 'quote')
  return (
    <section className="services wrap" id="services" data-reveal>
      <div className="sec-head"><h2 className="h2">{t(T.services.h)}</h2></div>
      <div className="svc">
        <ul className="svc-list" role="tablist" aria-label={t(T.services.h)}>
          {SERVICES.map((x) => {
            const I = A[x.icon]
            return (
              <li key={x.id}>
                <button role="tab" id={`tab-${x.id}`} aria-selected={sel === x.id} aria-controls="svc-panel" onClick={() => setSel(x.id)} className="svc-tab">
                  <I size={22} className="svc-ico" />
                  <span className="svc-name"><b>{t(T.services[x.id].name)}</b><span>{t(T.services[x.id].line)}</span></span>
                  <A.ArrowRight size={18} className="svc-go" />
                </button>
              </li>
            )
          })}
        </ul>
        <div className="svc-panel" id="svc-panel" role="tabpanel" aria-labelledby={`tab-${sel}`} key={sel}>
          {SVC_PHOTO[sel] ? <figure className="svc-photo"><img src={`photos/${SVC_PHOTO[sel]}.webp`} alt="" /></figure> : (
            <div className="svc-air"><A.Plane size={28} /><p><b>CAN</b><span>Guangzhou Baiyun</span></p><span className="air-line" aria-hidden="true" /><p><b>ACC</b><span>Kotoka, Accra</span></p></div>
          )}
          <div className="svc-body">
            <h3>{t(s.name)}</h3>
            <p>{t(s.body)}</p>
            <dl className="svc-facts">
              <div><dt>{t(T.services.good)}</dt><dd>{t(s.fit)}</dd></div>
              <div><dt>{t(T.services.time)}</dt><dd>{t(svc.time)}</dd></div>
            </dl>
            <button className="btn" onClick={go}>{t(s.cta)}<A.ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

// The route band: the globe turning between the two ends, and the stops in between.
export function Route() {
  const t = useT()
  const [focus, setFocus] = useState(null)
  return (
    <section className="route" id="route" data-reveal>
      <Kente height={10} />
      <div className="route-in wrap">
        <div className="route-globe" onMouseLeave={() => setFocus(null)}><Globe focus={focus} /></div>
        <div className="route-copy">
          <h2 className="h2 is-light">{t(T.route.h)}</h2>
          <p className="route-p">{t(T.route.p)}</p>
          <ol className="stops">
            {T.route.stops.map((st, i) => (
              <li key={i} onMouseEnter={() => setFocus(i < 2 ? 'cn' : i > 2 ? 'gh' : null)} onFocus={() => setFocus(i < 2 ? 'cn' : i > 2 ? 'gh' : null)} tabIndex={0}>
                <i className={`dot ${i < 2 ? 'is-red' : i === 2 ? 'is-mid' : ''}`} />
                <span><b>{t(st)}</b><span>{t(T.route.stopNotes[i])}</span></span>
              </li>
            ))}
          </ol>
          <dl className="route-stats">
            <div><dt>{t(T.route.miles)}</dt><dd>{t(T.route.milesV)}</dd></div>
            <div><dt>{t(T.route.days)}</dt><dd>{t(T.facts.seaV)}</dd></div>
            <div><dt>{t(T.route.ships)}</dt><dd>1</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}

// Many into one, drawn with the page's one shape: loose parcels from many suppliers, one tight
// container line, then neat rows delivered.
function rng(seed) { let a = seed; return () => { a = (a * 16807) % 2147483647; return (a - 1) / 2147483646 } }
export function Flow() {
  const t = useT()
  const dots = useMemo(() => {
    const r = rng(7); const out = []
    for (let i = 0; i < 54; i++) out.push({ x: 20 + r() * 330, y: 20 + r() * 200, k: r() > 0.5 ? 'a' : 'b', d: r() })
    for (let i = 0; i < 60; i++) out.push({ x: 420 + (i % 20) * 17, y: 103 + Math.floor(i / 20) * 17, k: 'c', d: i / 60 })
    for (let i = 0; i < 48; i++) out.push({ x: 800 + (i % 8) * 22, y: 40 + Math.floor(i / 8) * 30, k: 'g', d: i / 48 })
    return out
  }, [])
  return (
    <section className="flow wrap" id="how" data-reveal>
      <div className="flow-head">
        <div><h2 className="h2">{t(T.flow.h)}</h2><p>{t(T.flow.p)}</p></div>
        <figure className="flow-photo"><img src="photos/warehouse.webp" alt="" loading="lazy" /></figure>
      </div>
      <svg className="flow-svg" viewBox="0 0 1000 240" role="img" aria-label={`${t(T.flow.s1)}, ${t(T.flow.s2)}, ${t(T.flow.s3)}`}>
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.k === 'c' ? 7 : 6.5} className={`fd fd-${d.k}`} style={{ transitionDelay: `${(d.x / 1000) * 1.2}s` }} />)}
      </svg>
      <ol className="flow-steps">
        {[['s1', 's1p'], ['s2', 's2p'], ['s3', 's3p']].map(([h, p], i) => <li key={h}><b><span>{i + 1}</span>{t(T.flow[h])}</b><p>{t(T.flow[p])}</p></li>)}
      </ol>
    </section>
  )
}

function Choice({ label, value, options, onChange, name }) {
  const t = useT()
  return (
    <fieldset className="choice">
      <legend>{label}</legend>
      <div className="choice-row">
        {options.map((o) => (
          <label key={o} className={value === o ? 'is-on' : ''}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />{t(T.q[o])}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Quote() {
  const t = useT()
  const [mode, setMode] = useState('sea')
  const [from, setFrom] = useState('guangzhou')
  const [to, setTo] = useState('accra')
  const [goods, setGoods] = useState('general')
  const [cbm, setCbm] = useState(3)
  const [kg, setKg] = useState(60)
  const [sent, setSent] = useState(null)
  const lang = useContext(LangCtx)
  useEffect(() => setSent(null), [mode, from, to, goods, cbm, kg])

  const collect = { guangzhou: 0, yiwu: 25, shenzhen: 30 }[from]
  const blocked = mode === 'air' && goods === 'liquid'
  let lo = 0, hi = 0, lines = []
  if (mode === 'sea') {
    const v = Math.max(RATES.sea.minCbm, cbm)
    const door = RATES.door[to] * v
    lo = v * RATES.sea.perCbm[0] + door + collect; hi = v * RATES.sea.perCbm[1] + door + collect
    lines = [[`${v} m³ × ${usd(RATES.sea.perCbm[0])} to ${usd(RATES.sea.perCbm[1])}`, `${usd(v * RATES.sea.perCbm[0])} to ${usd(v * RATES.sea.perCbm[1])}`], [t(T.q[to]), door ? usd(door) : '$0'], [t(T.q[from]), collect ? usd(collect) : '$0']]
  } else {
    const v = Math.max(RATES.air.minKg, kg)
    const extra = (goods === 'battery' ? RATES.air.battery : 0) + (to === 'kumasi' ? 0.6 : 0)
    lo = v * (RATES.air.perKg[0] + extra) + collect; hi = v * (RATES.air.perKg[1] + extra) + collect
    lines = [[`${v} kg × $${RATES.air.perKg[0]} to $${RATES.air.perKg[1]}`, `${usd(v * RATES.air.perKg[0])} to ${usd(v * RATES.air.perKg[1])}`], [t(T.q[goods]) + (to === 'kumasi' ? `, ${t(T.q.kumasi)}` : ''), extra ? usd(v * extra) : '$0'], [t(T.q[from]), collect ? usd(collect) : '$0']]
  }
  const days = mode === 'sea' ? [45, 60] : [7, 12]
  const plus = to === 'kumasi' ? 2 : 0

  return (
    <section className="quote wrap" id="quote" data-reveal>
      <div className="quote-head"><h2 className="h2">{t(T.q.h)}</h2><p>{t(T.q.p)}</p></div>
      <div className="quote-grid">
        <form className="quote-form" onSubmit={(e) => e.preventDefault()}>
          <div className="seg" role="radiogroup" aria-label={t(T.q.mode)}>
            {[['sea', A.Boat], ['air', A.Plane]].map(([m, I]) => <button type="button" key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)}><I size={18} />{t(T.q[m])}</button>)}
          </div>
          <Choice label={t(T.q.from)} name="from" value={from} options={ORIGINS} onChange={setFrom} />
          <Choice label={t(T.q.to)} name="to" value={to} options={DESTS} onChange={setTo} />
          <Choice label={t(T.q.goods)} name="goods" value={goods} options={GOODS} onChange={setGoods} />
          {mode === 'sea' ? (
            <label className="slider">
              <span className="slider-top"><span>{t(T.q.cbm)}</span><output>{cbm} m³</output></span>
              <input type="range" min="0.5" max="20" step="0.5" value={cbm} onChange={(e) => setCbm(+e.target.value)} style={{ '--p': `${((cbm - 0.5) / 19.5) * 100}%` }} />
              <small>{t(T.q.cbmHelp)}</small>
            </label>
          ) : (
            <label className="slider">
              <span className="slider-top"><span>{t(T.q.kg)}</span><output>{kg} kg</output></span>
              <input type="range" min="5" max="500" step="5" value={kg} onChange={(e) => setKg(+e.target.value)} style={{ '--p': `${((kg - 5) / 495) * 100}%` }} />
              <small>{t(T.q.kgHelp)}</small>
            </label>
          )}
        </form>

        <div className="quote-out" aria-live="polite">

          {blocked ? (
            <div className="quote-blocked"><A.Info size={22} /><p>{t(T.q.liquidAir)}</p><button className="btn is-gold" onClick={() => setMode('sea')}>{t(T.q.sea)}</button></div>
          ) : (
            <>
              <p className="out-price">{usd(lo)}<span> {lang === 'zh' ? '至' : 'to'} </span>{usd(hi)}</p>
              <p className="out-k">{t(T.q.est)}, {t(T.q[from])} {lang === 'zh' ? '至' : 'to'} {t(T.q[to])}</p>
              <p className="out-days"><A.Clock size={16} /> {t(T.q.days)}: {days[0] + plus} to {days[1] + plus} {lang === 'zh' ? '天' : 'days'}</p>
              <dl className="out-lines">{lines.map(([a, b], i) => <div key={i}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
              {sent ? (
                <p className="out-sent"><A.CircleCheck size={20} /><span><b>{t(T.q.sent)} {sent}</b>{t(T.q.sentP)}</span></p>
              ) : (
                <button className="btn is-gold" onClick={() => setSent(`GSQ-${(Math.round(lo) % 9000) + 1000}`)}>{t(T.q.send)}<A.Send size={17} /></button>
              )}
              <small className="out-sample">{t(T.q.sample)}</small>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export function Track() {
  const t = useT()
  const lang = useContext(LangCtx)
  const [val, setVal] = useState('')
  const [state, setState] = useState('idle')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const look = (e) => {
    e?.preventDefault()
    setState('loading')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState(val.trim().toUpperCase() === SHIPMENT.id ? 'found' : 'error'), 900)
  }
  const today = new Date()
  const at = (d) => { const x = new Date(today); x.setDate(x.getDate() + d); return x }
  const nowIdx = SHIPMENT.steps.findIndex((s) => s.now)
  return (
    <section className="track" id="track" data-reveal><div className="track-in wrap">
      <div className="track-head">
        <h2 className="h2">{t(T.t.h)}</h2>
        <p>{t(T.t.p)} <button className="link" onClick={() => setVal(SHIPMENT.id)}>{SHIPMENT.id}</button>.</p>
        <form className="track-form" onSubmit={look}>
          <label className="sr" htmlFor="trk">{t(T.t.h)}</label>
          <input id="trk" value={val} onChange={(e) => { setVal(e.target.value); if (state === 'error') setState('idle') }} placeholder="GSL-00000" autoComplete="off" aria-invalid={state === 'error'} aria-describedby={state === 'error' ? 'trk-err' : undefined} />
          <button className="btn" disabled={!val.trim() || state === 'loading'}>{state === 'loading' ? <><A.ArrowClockwise size={17} className="spin" />{t(T.t.loading)}</> : <><A.Search size={17} />{t(T.t.btn)}</>}</button>
        </form>
        {state === 'error' && <p className="err" id="trk-err" role="alert"><A.Info size={16} /> {t(T.t.err)}</p>}
        <p className="track-soon"><A.Person size={16} /> {t(T.t.soonAcc)}</p>
      </div>

      <div className={`track-card ${state === 'found' ? 'is-found' : ''}`} aria-live="polite">
        {state === 'found' ? (
          <>
            <div className="tc-top">
              <span className="tc-id">{SHIPMENT.id}</span>
              <span>{t(T.q.sea)} · {SHIPMENT.pieces} {t(T.t.pieces)} · {SHIPMENT.cbm} m³</span>
            </div>
            <div className="tc-route">
              <span><i className="dot is-red" />{t(T.q.guangzhou)}</span>
              <span className="tc-line"><i style={{ left: `${(nowIdx / (SHIPMENT.steps.length - 1)) * 100}%` }}><A.Boat size={16} /></i></span>
              <span><i className="dot" />{t(T.q.accra).split(',')[0]}</span>
            </div>
            <ol className="tc-steps">
              {SHIPMENT.steps.map((s, i) => (
                <li key={s.id} className={i < nowIdx ? 'is-done' : i === nowIdx ? 'is-now' : ''}>
                  <span className="tc-dot" />
                  <b>{t(T.t[s.id])}</b>
                  <time>{dateFmt(at(s.days), lang)}</time>
                </li>
              ))}
            </ol>
            <p className="tc-eta"><span>{t(T.t.eta)}</span><b>{dateFmt(at(15), lang)}</b></p>
          </>
        ) : (
          <div className="tc-empty">
            <span className="tc-empty-disc"><A.ShippingBoxV2 size={40} /></span>
            <p>{state === 'loading' ? t(T.t.loading) : `${t(T.t.p)} ${SHIPMENT.id}`}</p>
          </div>
        )}
      </div>
    </div></section>
  )
}

export function Gallery() {
  const t = useT()
  const items = [['harbour-aerial', T.gallery.a], ['cranes-dusk', T.gallery.b], ['ship-bow', T.gallery.c]]
  return (
    <section className="gallery wrap" data-reveal aria-labelledby="gal-h">
      <h2 className="h2" id="gal-h">{t(T.gallery.h)}</h2>
      <div className="gal-grid">{items.map(([f, cap], i) => <figure key={f} className={`gal g${i}`}><img src={`photos/${f}.webp`} alt="" loading="lazy" /><figcaption>{t(cap)}</figcaption></figure>)}</div>
    </section>
  )
}

function Dial({ tz }) {
  const now = useNow(1000)
  const [h, m] = timeIn(now, tz).split(':').map(Number)
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6
  return (
    <svg viewBox="0 0 100 100" className="dial" aria-hidden="true">
      <circle cx="50" cy="50" r="48" className="dial-face" />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={50 + Math.sin(i * Math.PI / 6) * 40} cy={50 - Math.cos(i * Math.PI / 6) * 40} r={i % 3 ? 1.4 : 2.6} className="dial-tick" />)}
      <line x1="50" y1="50" x2={50 + Math.sin(ha * Math.PI / 180) * 24} y2={50 - Math.cos(ha * Math.PI / 180) * 24} className="dial-h" />
      <line x1="50" y1="50" x2={50 + Math.sin(ma * Math.PI / 180) * 34} y2={50 - Math.cos(ma * Math.PI / 180) * 34} className="dial-m" />
      <circle cx="50" cy="50" r="3" className="dial-pin" />
    </svg>
  )
}

export function Offices() {
  const t = useT()
  const now = useNow(30000)
  return (
    <section className="offices wrap" id="offices" data-reveal>
      <h2 className="h2">{t(T.o.h)}</h2>
      <div className="off-grid">
        {OFFICES.map((o) => {
          const { hour, wd } = partsIn(now, o.tz)
          const open = wd >= o.days[0] && wd <= o.days[1] && hour >= o.hours[0] && hour < o.hours[1]
          return (
            <article key={o.id} className={`off off-${o.id}`}>
              <Dial tz={o.tz} />
              <div>
                <h3>{t(T.o[o.id])} <span className="off-time">{timeIn(now, o.tz)}</span></h3>
                <p className={`off-state ${open ? 'is-open' : ''}`}><i className="dot" />{open ? t(T.o.open) : t(T.o.closed)}</p>
                <p>{t(T.o[`${o.id}P`])}</p>
                <p className="off-addr">[{t(T.o.addr)}]</p>
              </div>
            </article>
          )
        })}
      </div>
      <p className="off-overlap"><A.Clock size={16} /> {t(T.o.overlap)}</p>
    </section>
  )
}

export function Faq() {
  const t = useT()
  const [open, setOpen] = useState(0)
  return (
    <section className="faq wrap" id="faq" data-reveal>
      <div className="faq-side"><h2 className="h2">{t(T.faq.h)}</h2><p>{t(T.c.p)}</p><button className="btn is-line" onClick={() => scrollToId('contact')}>{t(T.nav.contact)}<A.ArrowRight size={18} /></button></div>
      <ul className="faq-list">
        {FAQ.map((f, i) => (
          <li key={i} className={open === i ? 'is-open' : ''}>
            <button aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}><span className="faq-tab">{t(f.tab)}</span><span className="faq-q">{t(f.q)}</span><A.Plus size={18} className="faq-ico" /></button>
            <div className="faq-a" id={`faq-${i}`} hidden={open !== i}><p>{t(f.a)}</p></div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Contact() {
  const t = useT()
  const [f, setF] = useState({ name: '', phone: '', what: '' })
  const [err, setErr] = useState({})
  const [done, setDone] = useState(false)
  const [wa, setWa] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (!f.name.trim()) x.name = T.c.needName
    if (f.phone.replace(/\D/g, '').length < 7) x.phone = T.c.needPhone
    if (f.what.trim().length < 4) x.what = T.c.needWhat
    setErr(x)
    if (!Object.keys(x).length) setDone(true)
  }
  const field = (k, label, multi) => (
    <div className={`fld ${err[k] ? 'has-err' : ''}`}>
      <label htmlFor={`c-${k}`}>{t(label)}</label>
      {multi ? <textarea id={`c-${k}`} rows="3" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} />
        : <input id={`c-${k}`} value={f[k]} inputMode={k === 'phone' ? 'tel' : undefined} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} />}
      {err[k] && <small role="alert">{t(err[k])}</small>}
    </div>
  )
  return (
    <section className="contact wrap" id="contact" data-reveal>
      <div className="coupon">
        <div className="coupon-l">
          <h2>{t(T.c.h)}</h2>
          <p>{t(T.c.p)}</p>
          <button className="btn is-wa" type="button" onClick={() => setWa(!wa)} aria-expanded={wa}><A.WhatsappFill size={18} />{t(T.c.wa)}<em>{t(T.soon)}</em></button>
          {wa && <p className="wa-note">{t(T.c.waSoon)}</p>}
        </div>
                {done ? (
          <div className="coupon-r is-done" role="status"><A.CircleCheck size={36} /><p><b>{t(T.c.ok)}, {f.name.split(' ')[0]}.</b> {t(T.c.okP)}</p></div>
        ) : (
          <form className="coupon-r" onSubmit={submit} noValidate>
            {field('name', T.c.name)}
            {field('phone', T.c.phone)}
            {field('what', T.c.what, true)}
            <button className="btn is-gold is-block">{t(T.c.send)}<A.Send size={17} /></button>
          </form>
        )}
      </div>
    </section>
  )
}

export function Footer() {
  const t = useT()
  return (
    <footer className="foot">
      <div className="foot-in wrap">
        <div className="foot-mark"><Mark size={56} /><p>Golden Stone Logistics<span>金石物流</span></p></div>
        <div className="foot-cols">
          <p>{t(T.f.line)}</p>
          <ul>{['services', 'quote', 'track', 'offices', 'faq', 'contact'].map((id) => <li key={id}><button onClick={() => scrollToId(id)}>{t(T.nav[id])}</button></li>)}</ul>
          <p className="foot-small">[{t(T.f.reg)}]</p>
          <p className="foot-small">{t(T.credits)}: {[...new Set(credits.map((c) => c.author))].join(', ')}.</p>
          <p className="foot-small">{t(T.f.proto)}</p>
        </div>
      </div>
      <Kente height={8} />
    </footer>
  )
}
