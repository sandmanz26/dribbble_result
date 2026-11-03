import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { byId, chf, title } from '../data/catalog.js'
import { arrival, pickupReady, fmtDate } from '../data/shipping.js'

export default function Done() {
  const { no } = useParams()
  const { orders } = useStore()
  const o = orders.find((x) => x.no === no)
  if (!o) {
    return (
      <div className="wrap doc">
        <h1 className="lead-h">Diese Bestellung kennen wir nicht.</h1>
        <p className="lead-p">Bestellungen im Prototyp liegen nur in diesem Browser. Vielleicht wurde er zurückgesetzt.</p>
        <Link className="btn" to="/" style={{ marginTop: 24 }}>Zum Regal</Link>
      </div>
    )
  }
  const d = new Date(o.at)
  const pick = o.delivery === 'pickup'
  const a = arrival(d), r = pickupReady(d)
  const steps = pick
    ? [['Bezahlt', `mit ${o.pay}`], ['Wird bereitgelegt', `bis ${fmtDate(r.to)}`], ['E-Mail mit Adresse', o.window ? `für ${o.window}` : 'mit Terminvorschlag'], ['Abholen in Wetzikon', 'Bestellnummer mitbringen']]
    : [['Bezahlt', `mit ${o.pay}`], ['Fotografiert und verpackt', 'innert 3 Werktagen'], [`Mit ${o.method}`, 'Sendung unterwegs'], ['Bei dir', `${fmtDate(a.from)} bis ${fmtDate(a.to)}`]]
  return (
    <div className="wrap done">
      <p className="no">Bestellung {o.no}</p>
      <h1>{pick ? 'Wir legen es bereit.' : 'Es kommt zu dir.'}</h1>
      <p className="lead-p" style={{ marginTop: 20, fontSize: 'var(--step-lead)', maxWidth: '46ch' }}>Die Bestätigung geht an {o.email}. {pick ? 'Sobald alles bereitliegt, schicken wir die Adresse in Wetzikon.' : 'Vor dem Verpacken prüfen wir jedes Stück noch einmal gegen die Fotos.'}</p>
      <ol className="tl">{steps.map(([b, s], i) => <li key={b} className={i === 0 ? 'on' : ''}><b>{b}</b><span>{s}</span></li>)}</ol>
      <section style={{ marginTop: 64, maxWidth: 640 }}>
        <h2 style={{ fontSize: '1.375rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>Im Paket</h2>
        <ul>{o.lines.map((l) => { const p = byId(l.id); return <li key={l.id + (l.copy || '')} className="line" style={{ gridTemplateColumns: '56px minmax(0,1fr) auto' }}><img src={p.hero.replace('.webp', '-s.webp')} alt="" style={{ width: 56, height: 56 }} /><span className="n">{l.qty} × {title(p)}{l.copy ? `, Exemplar ${l.copy}` : ''}</span><b className="num">{chf(l.qty * l.price)}</b></li> })}</ul>
        <div className="totals" style={{ marginTop: 12 }}><div><span>{o.method}</span><span className="num">{o.ship ? chf(o.ship) : 'gratis'}</span></div><div className="t"><span>Bezahlt</span><span className="num">{chf(o.total)}</span></div></div>
      </section>
      <Link className="btn" to="/" style={{ marginTop: 40 }}>Zurück zum Regal</Link>
    </div>
  )
}
