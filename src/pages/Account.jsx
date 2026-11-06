import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FLAVORS, FREQ, SAMPLE_SUB, usd } from '../data.js'

// Self-serve subscription portal from the brief: skip, pause, swap flavor, change frequency, cancel.
// No email to support needed for any of it. Sample subscriber, nothing is saved.
export default function Account() {
  const [sub, setSub] = useState({ ...SAMPLE_SUB, state: 'active' })
  const [msg, setMsg] = useState('')
  const [ask, setAsk] = useState(false)
  const f = FLAVORS[sub.flavor]
  const say = (m) => setMsg(m)
  const set = (k, v, m) => { setSub((x) => ({ ...x, [k]: v })); say(m) }
  return (
    <div className="wrap page-pad account">
      <header className="page-head"><h1>Your subscription</h1><p>Sample account. Change anything here, any time. No email needed.</p></header>
      {sub.state === 'cancelled' ? (
        <section className="sub-card off">
          <h2>Cancelled.</h2>
          <p>Nothing more will ship or be charged. Your last order still arrives.</p>
          <div className="row"><button className="btn" onClick={() => { set('state', 'active', 'Welcome back. Your next 2-pack ships Dec 4, 2026.') }}>Restart my subscription</button><Link to="/shop" className="btn ghost">Shop one-time</Link></div>
        </section>
      ) : (
        <section className="sub-card" style={{ '--field': f.field, '--accent': f.accent }}>
          <div className="sub-pic"><img src={`img/${f.img}.webp`} alt={`${f.name} device`} /></div>
          <div className="sub-body">
            <p className="eyebrow">{sub.state === 'paused' ? 'Paused' : 'Active'} · {usd(sub.price)} every {sub.every} month{sub.every > 1 ? 's' : ''}</p>
            <h2>{f.name}, {sub.packs} × 2-pack</h2>
            <p className="next">{sub.state === 'paused' ? 'Paused. Nothing ships until you resume.' : <>Next 2-pack ships <b>{sub.next}</b>.</>}</p>
            <div className="sub-actions">
              <fieldset className="seg"><legend>Flavor</legend>
                {Object.values(FLAVORS).map((x) => <button key={x.id} aria-pressed={sub.flavor === x.id} onClick={() => set('flavor', x.id, `Swapped to ${x.name} from your next delivery.`)} style={{ '--c': x.field }}><i />{x.name}</button>)}
              </fieldset>
              <fieldset className="seg"><legend>How often</legend>
                {FREQ.map((n) => <button key={n} aria-pressed={sub.every === n} onClick={() => set('every', n, `Now every ${n} month${n > 1 ? 's' : ''}.`)}>Every {n} mo</button>)}
              </fieldset>
            </div>
            <div className="row wrap-row">
              <button className="btn accent" onClick={() => set('next', sub.next === 'Dec 4, 2026' ? 'Jan 4, 2027' : 'Feb 4, 2027', 'Skipped. We moved your next 2-pack one month.')} disabled={sub.state === 'paused'}>Skip next delivery</button>
              {sub.state === 'paused'
                ? <button className="btn ghost" onClick={() => set('state', 'active', 'Resumed. Your next 2-pack ships Dec 4, 2026.')}>Resume</button>
                : <button className="btn ghost" onClick={() => set('state', 'paused', 'Paused. Resume whenever you like.')}>Pause</button>}
              <button className="link" onClick={() => setAsk(true)}>Cancel subscription</button>
            </div>
            {ask && (
              <div className="confirm" role="alertdialog" aria-label="Cancel subscription">
                <p>Cancel for good? You can also skip or pause instead.</p>
                <div className="row"><button className="btn sm" onClick={() => { setAsk(false); set('state', 'cancelled', '') }}>Yes, cancel</button><button className="btn sm ghost" onClick={() => setAsk(false)}>Keep it</button></div>
              </div>
            )}
          </div>
        </section>
      )}
      <p className="ok" role="status" aria-live="polite">{msg}</p>
      <section className="orders">
        <h2>Orders</h2>
        <table className="otable"><thead><tr><th scope="col">Order</th><th scope="col">Date</th><th scope="col">Items</th><th scope="col">Total</th></tr></thead>
          <tbody><tr><td>#1002</td><td>Nov 4, 2026</td><td>Spearmint 2-pack, subscription</td><td>{usd(6.39)}</td></tr><tr><td>#1001</td><td>Oct 4, 2026</td><td>Duo</td><td>{usd(14.99)}</td></tr></tbody></table>
        <p className="note">Sample orders. In the Shopify build this is the subscription app’s customer portal.</p>
      </section>
    </div>
  )
}
