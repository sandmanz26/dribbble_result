import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore, lineAt, dipName, sideOf, etaOf } from '../store.jsx'
import { money, HEAT, ITEMS } from '../data/menu.js'
import { CARD, MILESTONES, RIDER, branchOf, planFor } from '../data/service.js'
import { Sheet, Tile, Toast, useToast, clock } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const item = (id) => ITEMS.find((i) => i.id === id)

// Where the order stands, as the customer reads it. Each state answers: what is happening, when,
// and what (if anything) I need to do.
function headline(o, now) {
  const b = branchOf(o.branch).name
  const eta = clock(etaOf(o, now))
  const plan = planFor(o)
  const st = plan[o.step]
  switch (o.status) {
    case 'outbox': return { k: 'Not sent yet', t: 'Waiting for signal', s: `Saved on this phone at ${clock(o.createdAt)}. ${b} does not have it yet.`, tone: 'warn' }
    case 'sending': return { k: o.tries.length ? `Try ${o.tries.filter((x) => !x.ok).length + 1}` : 'Sending', t: `Sending to ${b}`, s: 'Hold on, this takes a moment on a slow signal.', tone: 'warn' }
    case 'review': return { k: 'Not sent yet', t: 'Check these changes', s: 'The menu changed while your order waited. Nothing goes to the shop until you agree.', tone: 'warn' }
    case 'needs': return { k: 'The shop needs you', t: `${b} ran out of something`, s: 'Choose below. Nothing is cooked or charged until you do.', tone: 'warn' }
    case 'sent': return { k: 'Sent', t: `Waiting for ${b} to accept`, s: 'Usually under a minute.', tone: '' }
    case 'cancelled': return { k: 'Cancelled', t: 'This order was cancelled', s: o.cancelReason, tone: 'muted' }
    case 'done': return { k: o.mode === 'delivery' ? 'Delivered' : 'Collected', t: st.title, s: `${clock(o.vclock)}. ${st.note}`, tone: 'done' }
    default: {
      if (st.wait === 'arrival' && !o.arrived) return { k: st.id === 'await' ? 'Accepted' : 'Ready', t: st.id === 'await' ? 'Tap I’m here when you arrive' : 'Ready. Tap I’m here when you park', s: st.id === 'await' ? 'We start cooking then. It is ready about 10 minutes later.' : `Your car: ${o.car}. We bring it out to your bay.`, tone: 'accent' }
      if (st.id === 'bringing') return { k: st.title, t: `Coming to bay ${o.bay}`, s: `${st.note} Your car: ${o.car}.`, tone: 'accent' }
      if (o.mode === 'delivery') return { k: st.title, t: `Arrives about ${eta}`, s: st.note, tone: 'accent' }
      return { k: st.title, t: `Ready about ${eta}`, s: st.note, tone: 'accent' }
    }
  }
}

export default function Order() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s, dispatch, online, now } = useStore()
  const [bay, setBay] = useState(false)
  const [problem, setProblem] = useState(false)
  const [toast, show] = useToast()
  const o = s.orders.find((x) => x.id === id)
  if (!o) return <div className="empty"><h1>We can&apos;t find order {id}</h1><p>It may have been cleared when the demo was reset.</p><Link className="btn" to="/orders">All orders</Link></div>

  const h = headline(o, now)
  const plan = planFor(o)
  const ms = MILESTONES[o.mode === 'delivery' ? 'delivery' : o.style]
  const m = o.status === 'done' ? 4 : o.status === 'active' ? plan[o.step].m : -1
  const delivery = o.mode === 'delivery'
  const live = o.status === 'active' || o.status === 'sent'
  const stale = !online && live
  const st = o.status === 'active' ? plan[o.step] : null
  const waitingArrival = st?.wait === 'arrival' && !o.arrived
  const canCancel = ['outbox', 'sending', 'review', 'sent', 'needs'].includes(o.status)
  const lastEvent = o.events[o.events.length - 1]
  const riding = delivery && o.status === 'active' && ['pickedup', 'near'].includes(st.id)
  const riderOn = delivery && (o.status === 'active' || o.status === 'done') && o.step >= plan.findIndex((x) => x.id === 'rider')
  const off = () => show(<span>Calls and messages are switched off in this prototype.</span>)

  return (
    <div className="order">
      <div className="order-top">
        <button className="icon-btn" onClick={() => nav('/orders')} aria-label="All orders"><I.Back size={22} /></button>
        <span>{o.id} · {delivery ? 'Delivery' : o.style === 'curbside' ? 'Curbside pickup' : 'Pickup'} · {branchOf(o.branch).name}</span>
      </div>

      <section className={`status is-${h.tone}`} aria-live="polite">
        <span className="status-k">{o.status === 'sending' && <I.Loading size={14} className="spin" />}{h.k}</span>
        <h1 className="status-t">{h.t}</h1>
        <p className="status-s">{h.s}</p>
        {stale && <p className="status-stale"><I.Offline size={15} /> No signal. Last update {clock(lastEvent?.t || o.createdAt)}. Text messages still bring updates.</p>}
        {o.status !== 'cancelled' && (
          <ol className="miles" aria-label="Progress">
            {ms.map((x, i) => <li key={x} className={i < m ? 'is-done' : i === m ? 'is-now' : ''}><i /><span>{x}</span></li>)}
          </ol>
        )}
      </section>

      {/* What the customer can or must do now */}
      {o.status === 'outbox' && (
        <section className="act">
          <p>It sends itself when the signal is back. Before it goes, we check prices and stock again. You can close the app; it tries again when you open it.</p>
          <div className="act-row">
            <button className="btn is-small" disabled={!online} onClick={() => dispatch({ type: 'skip', id: o.id, now: Date.now() })}>{online ? 'Send now' : 'Still no signal'}</button>
            <button className="btn is-small is-ghost" onClick={() => dispatch({ type: 'cancel', id: o.id })}>Cancel order</button>
          </div>
        </section>
      )}

      {o.status === 'review' && (
        <section className="act is-review">
          <ul className="diffs">
            {o.changes.map((c, i) => (
              <li key={i}>{c.kind === 'sold' ? <I.Warning size={18} /> : c.kind === 'price' ? <I.Coins size={18} /> : <I.Time size={18} />}<span>{c.text}</span>{c.d ? <b>{c.d > 0 ? '+' : '−'}{money(Math.abs(c.d))}</b> : null}</li>
            ))}
          </ul>
          <ReviewTotal o={o} />
          <div className="act-row">
            <button className="btn is-small is-accent" onClick={() => dispatch({ type: 'confirmChanges', id: o.id, now: Date.now() })}>Send updated order</button>
            <button className="btn is-small is-ghost" onClick={() => dispatch({ type: 'cancel', id: o.id })}>Cancel order</button>
          </div>
        </section>
      )}

      {o.status === 'needs' && <OutOfStock o={o} />}

      {o.status === 'sent' && (
        <section className="act"><p>If the shop does not accept in 5 minutes, the order is cancelled and nothing is charged.</p>
          <div className="act-row"><button className="btn is-small is-ghost" onClick={() => dispatch({ type: 'cancel', id: o.id })}>Cancel order</button></div>
        </section>
      )}

      {waitingArrival && (
        <section className="act is-here">
          {o.style === 'curbside'
            ? <button className="btn is-wide is-accent" onClick={() => setBay(true)}><I.Parking size={20} /> I&apos;m here, in a bay</button>
            : <button className="btn is-wide is-accent" onClick={() => dispatch({ type: 'arrive', id: o.id, now: Date.now() })}><I.Pin size={20} /> I&apos;m here</button>}
          <p className="fine">On a real phone this can happen by itself when you are close, if you allow location.</p>
        </section>
      )}

      {o.status === 'active' && o.style === 'curbside' && !waitingArrival && !o.arrived && (
        <section className="act"><p>When you park, tap I&apos;m here and choose your bay. We start bringing it out straight away.</p>
          <div className="act-row"><button className="btn is-small" onClick={() => setBay(true)}><I.Parking size={18} /> I&apos;m here</button></div>
        </section>
      )}

      {riderOn && (
        <section className="rider">
          <div className="rider-top">
            <span className="rider-av" aria-hidden="true">{RIDER.name[0]}</span>
            <span className="rider-who"><b>{RIDER.name}</b><small>{RIDER.ride} · {RIDER.plate}</small></span>
            <button className="icon-btn" aria-label={`Message ${RIDER.name}`} onClick={off}><I.Message size={20} /></button>
            <button className="icon-btn" aria-label={`Call ${RIDER.name}`} onClick={off}><I.Phone size={20} /></button>
          </div>
          {o.status !== 'done' && (
            <div className="track" aria-label={riding ? 'Rider on the way' : 'Rider at the shop'}>
              <span className="track-end"><I.Store size={16} /> {branchOf(o.branch).name}</span>
              <span className="track-bar"><i style={{ '--p': st.id === 'near' ? '82%' : riding ? '35%' : '0%' }}><I.Scooter size={18} /></i></span>
              <span className="track-end"><I.Home size={16} /> {o.address.label}</span>
            </div>
          )}
          {o.drop === 'hand' && o.status !== 'done' && (
            <p className="code"><span>Hand-off code<small>Say it to the rider. Only then is the bag handed over.</small></span><b>{o.code}</b></p>
          )}
        </section>
      )}

      {!delivery && (o.status === 'active' || o.status === 'done') && (
        <p className="pickup-no"><span>{o.style === 'curbside' ? (o.bay ? `Bay ${o.bay}` : 'Your number') : 'Show this at the shelf'}</span><b>{o.id}</b></p>
      )}

      {o.status === 'done' && (
        <section className="act">
          {o.problem ? (
            <p className="note is-ok"><I.Refund size={18} /> {money(o.problem.refund)} {o.pay === 'card' ? `refunded to ${CARD}. It usually shows in 3 to 5 working days.` : 'added as credit to your next order.'}</p>
          ) : <p>How was it? If something was missing, wrong or cold, tell us and we put it right.</p>}
          <div className="act-row">
            {!o.problem && <button className="btn is-small is-ghost" onClick={() => setProblem(true)}>Something wrong?</button>}
            <button className="btn is-small" onClick={() => { o.lines.forEach((l) => dispatch({ type: 'add', line: { ...l, key: undefined } })); nav('/bag') }}>Order again</button>
          </div>
        </section>
      )}

      {o.events.length > 0 && (
        <section className="timeline" aria-labelledby="h-tl">
          <h2 id="h-tl" className="sec-h">What happened</h2>
          <ol>{[...o.events].reverse().map((e, i) => <li key={`${e.id}-${i}`} className={i === 0 ? 'is-last' : ''}><time>{clock(e.t)}</time><span><b>{e.title}</b><small>{e.note}</small></span></li>)}</ol>
        </section>
      )}

      <section className="receipt" aria-labelledby="h-rc">
        <h2 id="h-rc" className="sec-h">Your order</h2>
        <ul className="ticket-lines">
          {o.lines.map((l) => {
            const it = item(l.id)
            const bits = [l.heat && HEAT.find((x) => x.id === l.heat)?.name, ...l.dips.map(dipName), l.side !== 'none' && sideOf(l.side)?.name].filter(Boolean)
            return <li key={l.key}><Tile item={it} size="xs" /><span><b>{l.qty} × {it.name}</b><small>{bits.join(', ')}</small></span><span className="p">{money(lineAt(l, o.unit[l.key]))}</span></li>
          })}
        </ul>
        <dl className="sums is-tight">
          <div><dt>Food</dt><dd>{money(o.priced.food)}</dd></div>
          {delivery && <div><dt>Delivery</dt><dd>{money(o.priced.fee)}</dd></div>}
          {o.priced.tip > 0 && <div><dt>Rider tip</dt><dd>{money(o.priced.tip)}</dd></div>}
          <div className="is-total"><dt>{o.pay === 'card' ? CARD : delivery ? 'Cash to the rider' : 'Pay at the counter'}</dt><dd>{money(o.priced.total)}</dd></div>
        </dl>
        <ul className="facts">
          {delivery ? <li><I.Pin size={16} />{o.address.line}, {o.address.unit}{o.address.note ? `. ${o.address.note}` : ''}</li> : <li><I.Store size={16} />{branchOf(o.branch).area}</li>}
          {o.car && o.style === 'curbside' && <li><I.Car size={16} />{o.car}</li>}
          {o.pay === 'cash' && o.change > 0 && <li><I.Coins size={16} />Rider brings change for {money(o.change)}</li>}
          {o.note && <li><I.Chef size={16} />{o.note}</li>}
          <li><I.Cutlery size={16} />{o.cutlery ? 'Cutlery and napkins included' : 'No cutlery'}</li>
        </ul>
        <details className="tech">
          <summary><I.Shield size={16} /> Sent once, even on a bad signal</summary>
          <p>Every try carries the same order key, <code>{o.key}</code>, so the shop can never receive this order twice.</p>
          <ol>{o.tries.map((t, i) => <li key={i} className={t.ok ? 'is-ok' : ''}><time>{clock(t.t)}</time>{t.why}</li>)}{!o.tries.length && <li>Not tried yet.</li>}</ol>
        </details>
      </section>

      {canCancel && o.status !== 'outbox' && o.status !== 'review' && o.status !== 'sent' && <button className="link-btn is-center" onClick={() => dispatch({ type: 'cancel', id: o.id })}>Cancel order</button>}
      {o.status === 'active' && !waitingArrival && <p className="fine is-center">The kitchen has started, so it can&apos;t be cancelled in the app. <button className="link-btn" onClick={off}>Call {branchOf(o.branch).name}</button></p>}

      <Sheet open={bay} onClose={() => setBay(false)} title="Which bay are you in?">
        <div className="bays">{[1, 2, 3, 4, 5, 6].map((n) => <button key={n} onClick={() => { dispatch({ type: 'arrive', id: o.id, bay: n, now: Date.now() }); setBay(false) }}>{n}</button>)}</div>
        <p className="sheet-note">The number is painted on the ground and on the sign in front of your car.</p>
      </Sheet>
      <Problem open={problem} onClose={() => setProblem(false)} o={o} />
      <Toast toast={toast} />
    </div>
  )
}

function ReviewTotal({ o }) {
  const sold = new Set(o.changes.filter((c) => c.kind === 'sold').map((c) => c.key))
  const d = o.changes.reduce((t, c) => t + c.d, 0)
  const left = o.lines.filter((l) => !sold.has(l.key)).length
  return <p className="review-total">{left ? <>New total <b>{money(o.priced.total + d)}</b> <span>was {money(o.priced.total)}</span></> : <>Everything in it sold out. Cancel and start again.</>}</p>
}

function OutOfStock({ o }) {
  const { dispatch } = useStore()
  const l = o.lines.find((x) => x.key === o.issue.key)
  const it = item(l.id); const alt = item(o.issue.alt)
  const diff = (alt.price - o.unit[l.key]) * l.qty
  return (
    <section className="act is-review">
      <div className="oos">
        <Tile item={{ ...it, soldOut: true }} size="sm" />
        <span><b>{it.name} just ran out</b><small>The last ones went a few minutes ago.</small></span>
      </div>
      <div className="options is-flat" role="group" aria-label="What should we do">
        <button className="option is-tall" onClick={() => dispatch({ type: 'resolve', id: o.id, choice: 'swap', now: Date.now() })}>
          <Tile item={alt} size="xs" /><span className="opt-text"><b>Swap for {alt.name}</b><small>{diff === 0 ? 'Same price' : `${diff > 0 ? 'Adds' : 'Saves'} ${money(Math.abs(diff))}`}, same heat and dips</small></span><I.Right size={18} />
        </button>
        <button className="option is-tall" onClick={() => dispatch({ type: 'resolve', id: o.id, choice: 'remove', now: Date.now() })}>
          <I.Trash size={20} /><span className="opt-text"><b>Remove it, keep the rest</b><small>{money(lineAt(l, o.unit[l.key]))} less</small></span><I.Right size={18} />
        </button>
        <button className="option is-tall" onClick={() => dispatch({ type: 'resolve', id: o.id, choice: 'cancel', now: Date.now() })}>
          <I.Close size={20} /><span className="opt-text"><b>Cancel the whole order</b><small>Nothing is charged</small></span><I.Right size={18} />
        </button>
      </div>
    </section>
  )
}

function Problem({ open, onClose, o }) {
  const { dispatch } = useStore()
  const [keys, setKeys] = useState([])
  const [reason, setReason] = useState('missing')
  const refund = o.lines.filter((l) => keys.includes(l.key)).reduce((t, l) => t + lineAt(l, o.unit[l.key]), 0) * (reason === 'cold' ? 0.5 : 1)
  return (
    <Sheet open={open} onClose={onClose} title="What went wrong?">
      <div className="seg" role="radiogroup" aria-label="Problem">
        {[['missing', 'Missing'], ['wrong', 'Wrong item'], ['cold', 'Cold or late']].map(([id, label]) => <button key={id} role="radio" aria-checked={reason === id} onClick={() => setReason(id)}>{label}</button>)}
      </div>
      <h3 className="sheet-sub">Which items?</h3>
      <div className="options" role="group" aria-label="Items">
        {o.lines.map((l) => {
          const on = keys.includes(l.key)
          return (
            <button key={l.key} role="checkbox" aria-checked={on} className="option" onClick={() => setKeys(on ? keys.filter((k) => k !== l.key) : [...keys, l.key])}>
              <span className="check" aria-hidden="true">{on && <I.Check size={14} />}</span>{l.qty} × {item(l.id).name}<span className="option-price">{money(lineAt(l, o.unit[l.key]))}</span>
            </button>
          )
        })}
      </div>
      <p className="sheet-note">{reason === 'cold' ? 'For cold or late food we refund half of the items you pick.' : 'We refund the items in full. No photos needed.'}</p>
      <button className="btn is-wide sheet-done" disabled={!keys.length} onClick={() => { dispatch({ type: 'problem', id: o.id, keys, reason, refund, now: Date.now() }); onClose() }}>Refund {money(refund)}</button>
    </Sheet>
  )
}
