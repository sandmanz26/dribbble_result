import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { chf, title, langText } from '../data/catalog.js'
import { Delivery, Meter, totals } from '../ui.jsx'

const PAY = ['TWINT', 'Karte', 'Apple Pay', 'Google Pay']

export default function Checkout() {
  const { lines, delivery, window: win, dispatch } = useStore()
  const nav = useNavigate()
  const [v, setV] = useState({ email: '', name: '', street: '', plz: '', city: '', pay: 'TWINT' })
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const t = totals(lines, delivery)
  const up = (k) => (e) => { setV({ ...v, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]: null }) }
  if (!lines.length) {
    return (
      <div className="wrap doc">
        <h1 className="lead-h">Der Korb ist leer.</h1>
        <p className="lead-p">Leg zuerst etwas aus dem Regal hinein. Booster reisen ab CHF 2 im Brief.</p>
        <Link className="btn buy" to="/fach/booster" style={{ marginTop: 24 }}>Zu den Boostern</Link>
      </div>
    )
  }
  const check = () => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Bitte eine E-Mail-Adresse wie name@beispiel.ch eingeben. Dorthin kommt die Bestätigung.'
    if (v.name.trim().length < 2) e.name = 'Bitte Vor- und Nachname eingeben.'
    if (delivery === 'post') {
      if (v.street.trim().length < 3) e.street = 'Bitte Strasse und Hausnummer eingeben.'
      const n = Number(v.plz)
      if (!/^\d{4}$/.test(v.plz) || n < 1000 || n > 9658) e.plz = 'Vier Ziffern, wir liefern nur in die Schweiz.'
      if (v.city.trim().length < 2) e.city = 'Bitte den Ort eingeben.'
    }
    return e
  }
  const submit = (ev) => {
    ev.preventDefault()
    const e = check()
    setErr(e)
    const first = Object.keys(e)[0]
    if (first) { document.getElementById(`f-${first}`)?.focus(); return }
    setBusy(true)
    setTimeout(() => {
      const no = `KR-${String(1000 + Math.floor((Date.now() / 1000) % 9000))}`
      dispatch({ type: 'order', order: { no, at: new Date().toISOString(), lines: lines.map((l) => ({ id: l.id, copy: l.copy, qty: l.qty, price: l.p.price })), delivery, window: win, pay: v.pay, total: t.total, ship: t.ship, method: delivery === 'pickup' ? 'Abholung in Wetzikon' : t.post?.name, email: v.email, city: v.city } })
      nav(`/danke/${no}`)
    }, 1100)
  }
  const F = ({ k, label, cls = '', type = 'text', auto, help, inputMode }) => (
    <div className={`field ${cls}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} type={type} value={v[k]} onChange={up(k)} autoComplete={auto} inputMode={inputMode} aria-invalid={!!err[k]} aria-describedby={err[k] ? `e-${k}` : help ? `h-${k}` : undefined} />
      {err[k] ? <span className="err" id={`e-${k}`}>{err[k]}</span> : help ? <span className="help" id={`h-${k}`}>{help}</span> : null}
    </div>
  )
  return (
    <form className="wrap co" onSubmit={submit} noValidate>
      <div>
        <nav className="crumbs" aria-label="Pfad"><Link to="/">Regal</Link><span aria-hidden="true">/</span><span aria-current="page">Kasse</span></nav>
        <h1>Kasse</h1>
        <fieldset>
          <legend><b>1</b>Kontakt</legend>
          <div className="fields">
            {F({ k: 'email', label: 'E-Mail', type: 'email', auto: 'email', help: 'Für die Bestätigung und, bei Abholung, die Adresse.' })}
            {F({ k: 'name', label: 'Vor- und Nachname', auto: 'name' })}
          </div>
        </fieldset>
        <fieldset>
          <legend><b>2</b>Lieferung</legend>
          <Delivery />
          {delivery === 'post' && (
            <div className="fields">
              {F({ k: 'street', label: 'Strasse und Nr.', auto: 'street-address' })}
              {F({ k: 'plz', label: 'PLZ', cls: 'third plz', auto: 'postal-code', inputMode: 'numeric' })}
              {F({ k: 'city', label: 'Ort', cls: 'twothird ort', auto: 'address-level2' })}
            </div>
          )}
        </fieldset>
        <fieldset>
          <legend><b>3</b>Bezahlen</legend>
          <div className="paybox" role="radiogroup" aria-label="Zahlungsart">
            {PAY.map((m) => <label key={m}><input type="radio" name="pay" checked={v.pay === m} onChange={() => setV({ ...v, pay: m })} />{m}</label>)}
          </div>
          <p className="demo-note">Prototyp: hier würde die Zahlungsseite öffnen. Es wird nichts belastet und keine Daten verlassen diesen Browser.</p>
        </fieldset>
      </div>
      <aside className="summary" aria-label="Bestellung">
        <h2>Deine Bestellung</h2>
        <ul>
          {lines.map((l) => (
            <li key={l.key} className="line" style={{ gridTemplateColumns: '48px minmax(0,1fr) auto' }}>
              <img src={l.p.hero.replace('.webp', '-s.webp')} alt="" style={{ width: 48, height: 48 }} />
              <span><span className="n">{l.qty} × {title(l.p)}</span><span className="s">{langText(l.p.lang)}{l.copy ? `, Exemplar ${l.copy}` : ''}</span></span>
              <b className="num">{chf(l.qty * l.p.price)}</b>
            </li>
          ))}
        </ul>
        {delivery === 'post' && <Meter lines={lines} />}
        <div className="totals" style={{ marginTop: 16 }}>
          <div><span>Zwischensumme</span><span className="num">{chf(t.sub)}</span></div>
          <div><span>{delivery === 'pickup' ? `Abholung${win ? `, ${win}` : ''}` : t.post?.name}</span><span className="num">{delivery === 'pickup' ? 'gratis' : t.post?.price == null ? 'folgt' : chf(t.ship)}</span></div>
          <div className="t"><span>Total</span><span className="num">{chf(t.total)}</span></div>
        </div>
        <button className="btn buy wide" style={{ marginTop: 16 }} disabled={busy} aria-live="polite">{busy ? <><span className="busy" aria-hidden="true" />Wird bestellt</> : `Mit ${v.pay} bezahlen, ${chf(t.total)}`}</button>
        {Object.values(err).some(Boolean) && <p className="err small" role="alert" style={{ color: 'var(--warn)', marginTop: 10, fontWeight: 500 }}>Bitte prüf die markierten Felder.</p>}
      </aside>
    </form>
  )
}
