import { useState } from 'react'
import { useStore } from '../store.jsx'
import { money } from '../data/menu.js'
import { BRANCHES, DELIVERY, LOOKUP, branchOf, feeFor, hour, isOpen, windowFor } from '../data/service.js'
import { Sheet } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// "How do you want it?" comes first in every big chain's app, because it decides the shop, the
// prices, the fee and the time. Here it is one sheet, reachable from the menu and from checkout.
export function summary(s, address) {
  if (s.setup.mode === 'delivery') {
    const b = branchOf(address.branch)
    const [a, z] = windowFor(b, address.km)
    return { k: `Delivery to ${address.label}`, v: address.line, sub: `${a} to ${z} min from ${b.name}` }
  }
  const b = branchOf(s.setup.branch)
  return { k: s.setup.style === 'curbside' ? 'Curbside pickup' : 'Pickup', v: b.name, sub: isOpen(b) ? `Ready in about ${b.wait} min` : `Closed, opens ${hour(b.opens)}` }
}

export default function SetupSheet({ open, onClose }) {
  const { s, dispatch } = useStore()
  const [adding, setAdding] = useState(false)
  const mode = s.setup.mode
  const set = (patch) => dispatch({ type: 'setup', patch })

  return (
    <Sheet open={open} onClose={() => { setAdding(false); onClose() }} title="How do you want it?">
      <div className="seg" role="radiogroup" aria-label="Delivery or pickup">
        {[['delivery', I.Scooter, 'Delivery'], ['pickup', I.Store, 'Pickup']].map(([id, Icon, label]) => (
          <button key={id} role="radio" aria-checked={mode === id} onClick={() => { set({ mode: id, when: 'asap' }); setAdding(false) }}><Icon size={18} />{label}</button>
        ))}
      </div>

      {mode === 'delivery' ? (
        adding ? <AddAddress onDone={() => setAdding(false)} onPickup={(branch) => { set({ mode: 'pickup', branch, when: 'asap' }); setAdding(false) }} />
          : <>
            <h3 className="sheet-sub">Deliver to</h3>
            <div className="options" role="radiogroup" aria-label="Address">
              {s.addresses.map((a) => {
                const b = branchOf(a.branch); const [lo, hi] = windowFor(b, a.km)
                return (
                  <button key={a.id} role="radio" aria-checked={s.setup.address === a.id} className="option is-tall" onClick={() => set({ address: a.id })}>
                    <span className="radio" aria-hidden="true" />
                    {a.id === 'work' ? <I.Work size={20} /> : <I.Home size={20} />}
                    <span className="opt-text"><b>{a.label}, {a.line}</b><small>{a.unit}. From {b.name}, {a.km} km, {lo} to {hi} min, delivery {money(feeFor(a.km))}</small></span>
                  </button>
                )
              })}
              <button className="option is-add" onClick={() => setAdding(true)}><I.Add size={20} /><span className="opt-text"><b>Add an address</b></span></button>
            </div>
            <h3 className="sheet-sub">At the door</h3>
            <div className="seg" role="radiogroup" aria-label="Hand-off">
              {[['hand', I.Hand, 'Hand it to me'], ['door', I.Door, 'Leave at the door']].map(([id, Icon, label]) => (
                <button key={id} role="radio" aria-checked={s.setup.drop === id} onClick={() => set({ drop: id })}><Icon size={18} />{label}</button>
              ))}
            </div>
            <p className="sheet-note">{s.setup.drop === 'hand' ? 'You get a four-digit code. The rider hands the bag over only when you say it.' : 'The rider leaves the sealed bag at the door and tells you. Cash is not possible with this option.'}</p>
          </>
      ) : (
        <>
          <h3 className="sheet-sub">Pick up from</h3>
          <div className="options" role="radiogroup" aria-label="Branch">
            {BRANCHES.map((b) => {
              const openNow = isOpen(b)
              return (
                <button key={b.id} role="radio" aria-checked={s.setup.branch === b.id} className="option is-tall" onClick={() => set({ branch: b.id, style: b.curbside ? s.setup.style : 'counter' })}>
                  <span className="radio" aria-hidden="true" />
                  <I.Store size={20} />
                  <span className="opt-text"><b>{b.name}</b><small>{b.area}. {openNow ? `Open until ${hour(b.closes)}, ready in about ${b.wait} min` : `Closed now, opens ${hour(b.opens)}`}{b.curbside ? '. Curbside bays' : ''}</small></span>
                </button>
              )
            })}
          </div>
          <h3 className="sheet-sub">How you collect</h3>
          <div className="seg" role="radiogroup" aria-label="Collect">
            <button role="radio" aria-checked={s.setup.style === 'counter'} onClick={() => set({ style: 'counter' })}><I.Package size={18} />Pickup shelf</button>
            <button role="radio" aria-checked={s.setup.style === 'curbside'} disabled={!branchOf(s.setup.branch).curbside} onClick={() => set({ style: 'curbside' })}><I.Car size={18} />Curbside</button>
          </div>
          {s.setup.style === 'curbside' ? (
            <label className="field">
              <span>Your car, so we can find you</span>
              <input value={s.setup.car} onChange={(e) => set({ car: e.target.value })} placeholder="For example: silver hatchback, GT 4471" />
            </label>
          ) : <p className="sheet-note">{branchOf(s.setup.branch).curbside ? 'Bags wait on a shelf by the door under your order number.' : `${branchOf(s.setup.branch).name} has no curbside bays. Harbour Street does.`}</p>}
        </>
      )}

      {!adding && <button className="btn is-wide sheet-done" onClick={onClose} disabled={mode === 'pickup' && s.setup.style === 'curbside' && !s.setup.car.trim()}>Done</button>}
    </Sheet>
  )
}

// Address search with a zone check. The prototype searches a short sample list.
function AddAddress({ onDone, onPickup }) {
  const { dispatch } = useStore()
  const [q, setQ] = useState('')
  const [pick, setPick] = useState(null)
  const [unit, setUnit] = useState('')
  const [note, setNote] = useState('')
  const hits = q.trim().length < 2 ? LOOKUP : LOOKUP.filter((a) => `${a.line} ${a.area}`.toLowerCase().includes(q.trim().toLowerCase()))

  if (pick) {
    const out = !pick.branch
    const near = BRANCHES.find((b) => b.id === 'ring')
    return (
      <div className="add-addr">
        <button className="link-btn" onClick={() => setPick(null)}><I.Back size={16} /> Search again</button>
        <p className="addr-picked"><I.Pin size={20} /><span><b>{pick.line}</b><small>{pick.area}</small></span></p>
        {out ? (
          <div className="note is-warn" role="alert">
            <I.Warning size={18} />
            <span><b>We don&apos;t deliver here yet.</b> It is {pick.km} km from the nearest kitchen and riders go up to {DELIVERY.radiusKm} km, so the food would arrive cold. You can still pick it up from {near.name}.</span>
          </div>
        ) : (
          <>
            <p className="sheet-note">Delivered from {branchOf(pick.branch).name}, {pick.km} km away. Delivery {money(feeFor(pick.km))}.</p>
            <label className="field"><span>Flat, floor or house name</span><input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Flat 2, ground floor" /></label>
            <label className="field"><span>Directions for the rider</span><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Green door, next to the pharmacy" /></label>
          </>
        )}
        {out ? <button className="btn is-wide" onClick={() => onPickup(near.id)}>Pick up from {near.name} instead</button>
          : <button className="btn is-wide" onClick={() => { dispatch({ type: 'addAddress', address: { id: `a-${pick.line}`, label: 'Other', line: pick.line, unit: unit || pick.area, note, branch: pick.branch, km: pick.km } }); onDone() }}>Deliver here</button>}
      </div>
    )
  }
  return (
    <div className="add-addr">
      <label className="field is-search"><I.Search size={18} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Street and number" aria-label="Search for an address" /></label>
      <ul className="hits">
        {hits.map((a) => <li key={a.line}><button onClick={() => setPick(a)}><I.Pin size={18} /><span><b>{a.line}</b><small>{a.area}</small></span></button></li>)}
        {!hits.length && <li className="hits-none">No address found. In the prototype, try Cedar, Market, Lagoon or Ridge.</li>}
      </ul>
      <button className="link-btn" onClick={onDone}><I.Back size={16} /> Back to saved addresses</button>
    </div>
  )
}
