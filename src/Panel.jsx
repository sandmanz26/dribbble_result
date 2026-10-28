import { useNavigate } from 'react-router-dom'
import { useStore } from './store.jsx'
import * as I from './ui/icons.js'

// Desktop only: what the prototype is, and the switches a reviewer needs to see every state.
export default function Panel() {
  const nav = useNavigate()
  const { s, dispatch, online, net } = useStore()
  const last = s.orders[0]
  const go = (to) => nav(to)
  return (
    <aside className="panel" aria-label="Prototype notes">
      <p className="panel-brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>Flock &amp; Flame</p>
      <h2 className="panel-title">A menu app for a chicken and grill shop that keeps working with no signal.</h2>
      <p>Four boards, each in the colour of one of the sauces on the counter: ketchup for fried, mustard for grilled, mayo for the mayo dishes and green herb for the grill specials. Pick a dish, set the heat, add dips and a side, then pick up or get it delivered. The order becomes a kitchen ticket you can watch move along the rail.</p>
      <p>The owner changes prices, sold-out dishes and the special in Manage and publishes one new menu version to every phone. The app and menu are stored on the phone, so browsing and ordering work offline; orders wait on the phone and send themselves when the signal is back.</p>

      <div className="panel-group">
        <h2>Try it</h2>
        <label className="switch is-panel">
          <input type="checkbox" checked={s.simOffline} onChange={(e) => dispatch({ type: 'set', patch: { simOffline: e.target.checked } })} />
          <span aria-hidden="true" /><small>Simulate no signal {!net && '(this computer is offline)'}</small>
        </label>
        <p className="panel-state">{online ? <><I.Online size={15} /> Online</> : <><I.Offline size={15} /> Offline, orders wait on the phone</>}</p>
        <div className="panel-links">
          <button onClick={() => go('/')}>Menu</button>
          <button onClick={() => go('/item/wings-8')}>Dish with heat</button>
          <button onClick={() => go('/bag')}>Bag</button>
          <button onClick={() => go(last ? `/order/${last.id}` : '/orders')}>Order ticket</button>
          <button onClick={() => go('/manage')}>Menu manager</button>
        </div>
        <button className="panel-reset" onClick={() => { dispatch({ type: 'reset' }); try { sessionStorage.removeItem('ff-checked') } catch { /* ignore */ } go('/') }}><I.Refresh size={15} /> Reset the demo</button>
      </div>
      <p className="panel-foot">Prototype with sample dishes and prices. Food is drawn in code until the shop&apos;s own photos are taken. Nothing is charged or sent anywhere.</p>
    </aside>
  )
}
