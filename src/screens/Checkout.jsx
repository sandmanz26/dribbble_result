import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { money } from '../data/menu.js'
import { CARD, HOLD_MIN, TIPS, branchOf, hour, isOpen, windowFor } from '../data/service.js'
import { Sheet, clock } from '../ui/kit.jsx'
import SetupSheet, { summary } from './Setup.jsx'
import * as I from '../ui/icons.js'

// Times every 15 minutes from the next quarter hour after the lead time, inside opening hours.
function slots(now, lead, b) {
  const d = new Date(now + lead * 60000); d.setSeconds(0, 0)
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15)
  const out = []
  for (let i = 0; out.length < 8 && i < 160; i++) { const t = new Date(d.getTime() + i * 15 * 60000); if (isOpen(b, t) && isOpen(b, t.getTime() - lead * 60000)) out.push(t.getTime()) }
  return out
}

export default function Checkout() {
  const { s, dispatch, subtotal, fee, tip, total, short, net, online, now, address, itemById } = useStore()
  const nav = useNavigate()
  const [setup, setSetup] = useState(false)
  const [when, setWhen] = useState(false)
  const [placedId, setPlacedId] = useState(null)
  const c = s.checkout
  const delivery = s.setup.mode === 'delivery'
  const b = branchOf(delivery ? address.branch : s.setup.branch)
  const openNow = isOpen(b)
  const [lo, hi] = delivery ? windowFor(b, address.km) : [b.wait, b.wait + 5]
  const times = slots(now, hi, b)
  const sum = summary(s, address)

  // Leave-at-door and cash do not mix, and pickup cash is paid at the counter.
  useEffect(() => { if (delivery && s.setup.drop === 'door' && c.pay === 'cash') dispatch({ type: 'checkout', patch: { pay: 'card' } }) }, [delivery, s.setup.drop, c.pay]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!openNow && (s.setup.when === 'asap' || s.setup.when === 'arrive')) dispatch({ type: 'setup', patch: { when: times[0] } }) }, [openNow, b.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (placedId) nav(`/order/${placedId}`, { replace: true }) }, [placedId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!s.bag.length && !placedId) return <Navigate to="/bag" replace />
  const sold = s.bag.some((l) => itemById(l.id)?.soldOut)
  const needsCar = !delivery && s.setup.style === 'curbside' && !s.setup.car.trim()

  const whenLabel = s.setup.when === 'asap' ? (delivery ? `As soon as possible, ${lo} to ${hi} min` : `As soon as possible, about ${b.wait} min`)
    : s.setup.when === 'arrive' ? 'Start cooking when I arrive' : `Scheduled for ${clock(s.setup.when)}`

  const place = () => {
    dispatch({ type: 'place', now: Date.now(), net })
    setPlacedId(`A-${s.seq + 1}`)
  }

  return (
    <div className="bag checkout">
      <div className="order-top"><button className="icon-btn" onClick={() => nav('/bag')} aria-label="Back to bag"><I.Back size={22} /></button><span>Checkout</span></div>

      <section className="card">
        <button className="setting" onClick={() => setSetup(true)}>
          {delivery ? <I.Scooter size={20} /> : <I.Store size={20} />}
          <span><small>{sum.k}</small>{sum.v}{delivery && <small>{address.unit}{address.note ? `. ${address.note}` : ''}</small>}{!delivery && s.setup.style === 'curbside' && <small>{s.setup.car || 'Add your car'}</small>}</span>
          <I.Right size={18} />
        </button>
        {delivery && <div className="setting is-static"><I.Hand size={20} /><span><small>At the door</small>{s.setup.drop === 'hand' ? 'Hand it to me, with a code' : 'Leave it at the door'}</span></div>}
        <button className="setting" onClick={() => setWhen(true)}>
          <I.Time size={20} /><span><small>When</small>{whenLabel}{!openNow && <small>{b.name} is closed now. It opens at {hour(b.opens)}.</small>}</span><I.Right size={18} />
        </button>
      </section>

      <h2 className="sec-h">Payment</h2>
      <section className="card">
        <div className="options is-flat" role="radiogroup" aria-label="Payment">
          <button role="radio" aria-checked={c.pay === 'card'} className="option" onClick={() => dispatch({ type: 'checkout', patch: { pay: 'card' } })}>
            <span className="radio" aria-hidden="true" /><I.Card size={20} /><span className="opt-text"><b>{CARD}</b><small>Charged only when the shop accepts the order</small></span>
          </button>
          <button role="radio" aria-checked={c.pay === 'cash'} className="option" disabled={delivery && s.setup.drop === 'door'} onClick={() => dispatch({ type: 'checkout', patch: { pay: 'cash' } })}>
            <span className="radio" aria-hidden="true" /><I.Coins size={20} /><span className="opt-text"><b>{delivery ? 'Cash to the rider' : 'Pay at the counter'}</b><small>{delivery && s.setup.drop === 'door' ? 'Needs “Hand it to me”' : delivery ? 'Have the exact amount if you can' : 'Cash or card when you collect'}</small></span>
          </button>
        </div>
        {delivery && c.pay === 'cash' && (
          <div className="chips" role="radiogroup" aria-label="Change needed">
            <span>Change for</span>
            {[0, 20, 50].map((v) => <button key={v} role="radio" aria-checked={c.change === v} onClick={() => dispatch({ type: 'checkout', patch: { change: v } })}>{v ? money(v) : 'No change'}</button>)}
          </div>
        )}
      </section>

      {delivery && (
        <>
          <h2 className="sec-h">Tip for the rider</h2>
          <div className="chips is-row" role="radiogroup" aria-label="Rider tip">
            {TIPS.map((v) => <button key={v} role="radio" aria-checked={c.tip === v} onClick={() => dispatch({ type: 'checkout', patch: { tip: v } })}>{v ? money(v) : 'Not now'}</button>)}
          </div>
          <p className="fine">All of it goes to the rider. You can also tip after delivery.</p>
        </>
      )}

      <h2 className="sec-h">For the kitchen</h2>
      <section className="card">
        <label className="setting is-switch">
          <I.Cutlery size={20} /><span>Cutlery and napkins<small>Left out unless you ask, to save waste</small></span>
          <span className="switch"><input type="checkbox" checked={c.cutlery} onChange={(e) => dispatch({ type: 'checkout', patch: { cutlery: e.target.checked } })} /><span aria-hidden="true" /></span>
        </label>
        <label className="field is-inline"><span>Note for the kitchen</span><textarea rows={2} value={c.note} onChange={(e) => dispatch({ type: 'checkout', patch: { note: e.target.value } })} placeholder="Allergies, no onions, extra crispy" /></label>
      </section>

      <dl className="sums">
        <div><dt>Food</dt><dd>{money(subtotal)}</dd></div>
        {delivery && <div><dt>Delivery, {address.km} km</dt><dd>{money(fee)}</dd></div>}
        {tip > 0 && <div><dt>Rider tip</dt><dd>{money(tip)}</dd></div>}
        <div className="is-total"><dt>Total</dt><dd>{money(total)}</dd></div>
      </dl>

      {!online ? (
        <div className="note is-warn offline-plan">
          <I.Offline size={18} />
          <div>
            <b>No signal. Here is what happens if you save it:</b>
            <ol>
              <li>The order waits on this phone. The shop does not have it yet.</li>
              <li>It sends itself when the signal is back, using the same order key, so it can never arrive twice.</li>
              <li>Before it goes, prices and stock are checked again. If anything changed, you decide first.</li>
              <li>If it is still not sent by {clock(now + HOLD_MIN * 60000)}, we ask before sending.</li>
            </ol>
            Nothing is charged until the shop accepts it.
          </div>
        </div>
      ) : net === 'weak' ? <p className="note is-warn"><I.Signal size={18} /> Weak signal. Sending may take a few tries. You will see each try, and it can only be placed once.</p> : null}

      <div className="placebar">
        <button className="btn is-wide is-accent" onClick={place} disabled={sold || short > 0 || needsCar}>
          {online ? <>Place order <span className="btn-sum">{money(total)}</span></> : <>Save, send when online</>}
        </button>
      </div>

      <SetupSheet open={setup} onClose={() => setSetup(false)} />
      <Sheet open={when} onClose={() => setWhen(false)} title="When">
        <div className="options" role="radiogroup" aria-label="Time">
          {openNow && <button role="radio" aria-checked={s.setup.when === 'asap'} className="option" onClick={() => { dispatch({ type: 'setup', patch: { when: 'asap' } }); setWhen(false) }}>
            <span className="radio" aria-hidden="true" />As soon as possible<span className="option-price">{delivery ? `${lo} to ${hi} min` : `about ${b.wait} min`}</span>
          </button>}
          {!delivery && openNow && <button role="radio" aria-checked={s.setup.when === 'arrive'} className="option is-tall" onClick={() => { dispatch({ type: 'setup', patch: { when: 'arrive' } }); setWhen(false) }}>
            <span className="radio" aria-hidden="true" /><span className="opt-text"><b>Start cooking when I arrive</b><small>Tap I&apos;m here at the shop. Food is ready about 10 minutes later, fresh.</small></span>
          </button>}
          {times.map((t) => (
            <button key={t} role="radio" aria-checked={s.setup.when === t} className="option" onClick={() => { dispatch({ type: 'setup', patch: { when: t } }); setWhen(false) }}>
              <span className="radio" aria-hidden="true" />{new Date(t).getDate() !== new Date(now).getDate() ? 'Tomorrow, ' : 'Today, '}{clock(t)}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}
