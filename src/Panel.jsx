import { useNavigate } from 'react-router-dom'
import { useStore } from './store.jsx'
import * as I from './ui/icons.js'

// Desktop only: what the prototype is, and the switches a reviewer needs to reach every state.
export default function Panel() {
  const nav = useNavigate()
  const { s, dispatch, net } = useStore()
  const cur = s.orders.find((o) => !['done', 'cancelled'].includes(o.status)) || s.orders[0]
  const waiting = s.orders.some((o) => o.status === 'outbox')
  const go = (to) => nav(to)
  const now = () => Date.now()
  return (
    <aside className="panel" aria-label="Prototype notes">
      <p className="panel-brand">Flock <span>&amp;</span> Flame</p>
      <h2 className="panel-title">A chicken and grill ordering app that stays honest on a bad signal.</h2>
      <p>Choose delivery or pickup first, the way the big chains do: the address decides the kitchen, the fee and the time, and addresses outside the area are offered pickup instead. Checkout has card or cash, a rider tip, curbside with your car, and start cooking when I arrive.</p>
      <p>Without signal you can browse, build the bag and check out, but the order waits on the phone. When the signal returns it is checked against the live menu and sent once, with the same key on every try.</p>

      <div className="panel-group">
        <h2>Network</h2>
        <div className="panel-seg" role="radiogroup" aria-label="Network">
          {[['online', I.Online, 'Online'], ['weak', I.Signal, 'Weak'], ['offline', I.Offline, 'No signal']].map(([id, Icon, label]) => (
            <button key={id} role="radio" aria-checked={s.net === id} onClick={() => dispatch({ type: 'set', patch: { net: id } })}><Icon size={15} />{label}</button>
          ))}
        </div>
        {net === 'offline' && s.net !== 'offline' && <p className="panel-state"><I.Offline size={15} /> This computer is offline</p>}
        <h2>Make things go wrong</h2>
        <div className="panel-links">
          <button onClick={() => dispatch({ type: 'demoMenuChange', now: now() })} title="Raises one price and sells out one dish">{waiting ? 'Change the menu while it waits' : 'Change prices and stock'}</button>
          <button onClick={() => dispatch({ type: 'expire', now: now() })} disabled={!waiting}>Hold it 30 minutes</button>
          <button onClick={() => dispatch({ type: 'set', patch: { demoSold: true } })} aria-pressed={s.demoSold}>{s.demoSold ? 'Next order: a dish runs out' : 'Shop runs out of a dish'}</button>
          <button onClick={() => cur && dispatch({ type: 'delay', id: cur.id })} disabled={!cur || cur.status !== 'active'}>Rider stuck in traffic</button>
          <button onClick={() => cur && dispatch({ type: 'skip', id: cur.id, now: now() })} disabled={!cur || ['done', 'cancelled', 'outbox'].includes(cur.status)}>Skip to next step</button>
        </div>
        <h2>Go to</h2>
        <div className="panel-links">
          <button onClick={() => go('/')}>Menu</button>
          <button onClick={() => go('/item/wings-8')}>Dish with heat</button>
          <button onClick={() => go('/bag')}>Bag</button>
          <button onClick={() => go('/checkout')}>Checkout</button>
          <button onClick={() => go(cur ? `/order/${cur.id}` : '/orders')}>Latest order</button>
          <button onClick={() => go('/manage')}>Menu manager</button>
        </div>
        <button className="panel-reset" onClick={() => { dispatch({ type: 'reset' }); try { sessionStorage.removeItem('ff-checked') } catch { /* ignore */ } go('/') }}><I.Refresh size={15} /> Reset the demo</button>
      </div>
      <p className="panel-foot">Prototype with sample dishes, prices, branches and addresses. One real minute of an order plays in about two seconds. Food photos are real photographs (Open Images, CC BY 2.0) standing in for the shop&apos;s own. Nothing is charged or sent anywhere.</p>
    </aside>
  )
}
