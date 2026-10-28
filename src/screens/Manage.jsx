import { useState } from 'react'
import { useStore } from '../store.jsx'
import { CATS, ITEMS, money } from '../data/menu.js'
import { Tile, Sheet, Toast, useToast, day, clock } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// The owner's side: change a price, mark a dish sold out, pick the special, then publish one new
// menu version to every phone. Nothing reaches customers until it is published.
export default function Manage() {
  const { s, dispatch, draftMenu, changes, online } = useStore()
  const [cat, setCat] = useState('fried')
  const [edit, setEdit] = useState(null)
  const [specialOpen, setSpecialOpen] = useState(false)
  const [toast, show] = useToast()
  const base = (id) => ITEMS.find((i) => i.id === id)
  const special = draftMenu.find((i) => i.id === s.draft.special)

  const publish = () => {
    dispatch({ type: 'publish', now: new Date().toISOString() })
    show(<span>Version {s.live.v + 1} is live. Phones pick it up next time they open the app.</span>, { ms: 4200 })
  }

  return (
    <div className="manage">
      <h1 className="page-title">Menu manager</h1>
      <p className="lede">Live on customers&apos; phones: version {s.live.v}, published {day(s.live.at)} at {clock(s.live.at)}.</p>

      <div className={`publish ${changes ? 'has-changes' : ''}`}>
        <p>{changes ? <><b>{changes} {changes === 1 ? 'change' : 'changes'}</b> not published yet</> : <>No changes. Customers see what you see.</>}</p>
        {changes > 0 && <div className="publish-actions">
          <button className="btn is-ghost is-small" onClick={() => dispatch({ type: 'discard' })}>Discard</button>
          <button className="btn is-small" onClick={publish} disabled={!online}><I.Publish size={16} /> Publish</button>
        </div>}
        {changes > 0 && !online && <p className="publish-off"><I.Offline size={15} /> Publishing needs signal. Your edits are saved on this phone.</p>}
      </div>

      <button className="setting special-pick" onClick={() => setSpecialOpen(true)}>
        <I.Star size={20} /><span><small>Today&apos;s special</small>{special?.name}</span><I.Right size={18} />
      </button>

      <div className="seg is-cats" role="tablist" aria-label="Menu sections">
        {CATS.map((c) => <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}>{c.name}</button>)}
      </div>

      <ul className="m-rows">
        {draftMenu.filter((i) => i.cat === cat).map((it) => {
          const b = base(it.id)
          const livePrice = s.live.items[it.id]?.price ?? b.price
          const liveOut = s.live.items[it.id]?.soldOut ?? false
          const dirty = it.price !== livePrice || !!it.soldOut !== liveOut
          return (
            <li key={it.id} className="m-row">
              <Tile item={it} size="sm" />
              <span className="m-text">
                <b>{it.name}{dirty && <i className="dirty" title="Edited, not published">Edited</i>}</b>
                <button className="m-price" onClick={() => setEdit(it)} aria-label={`Change price of ${it.name}, now ${money(it.price)}`}>
                  {money(it.price)} <I.Edit size={14} />
                </button>
              </span>
              <label className="switch">
                <input type="checkbox" checked={!it.soldOut} onChange={(e) => dispatch({ type: 'draftItem', id: it.id, patch: { soldOut: !e.target.checked } })} />
                <span aria-hidden="true" /><small>{it.soldOut ? 'Sold out' : 'On sale'}</small>
              </label>
            </li>
          )
        })}
      </ul>

      <PriceSheet item={edit} onClose={() => setEdit(null)} onSave={(p) => { dispatch({ type: 'draftItem', id: edit.id, patch: { price: p } }); setEdit(null) }} />

      <Sheet open={specialOpen} onClose={() => setSpecialOpen(false)} title="Today's special">
        <div className="options" role="radiogroup" aria-label="Special">
          {draftMenu.filter((i) => !i.soldOut).map((i) => (
            <button key={i.id} role="radio" aria-checked={s.draft.special === i.id} className="option" onClick={() => { dispatch({ type: 'draftSpecial', id: i.id }); setSpecialOpen(false) }}>
              <span className="radio" aria-hidden="true" />{i.name}<span className="option-price">{money(i.price)}</span>
            </button>
          ))}
        </div>
      </Sheet>
      <Toast toast={toast} />
    </div>
  )
}

// Price entry with a keypad built for one job: cents typed from the right, like a till.
function PriceSheet({ item, onClose, onSave }) {
  const [cents, setCents] = useState(null)
  const open = !!item
  const val = cents ?? (item ? Math.round(item.price * 100) : 0)
  const press = (k) => setCents((c) => {
    const cur = c ?? Math.round(item.price * 100)
    if (k === 'del') return Math.floor(cur / 10)
    const next = cur * 10 + k
    return next > 99999 ? cur : next
  })
  const close = () => { setCents(null); onClose() }
  return (
    <Sheet open={open} onClose={close} title={item ? item.name : ''}>
      <p className="till" aria-live="polite">{money(val / 100)}</p>
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <button key={n} onClick={() => press(n)}>{n}</button>)}
        <button onClick={() => setCents(0)} aria-label="Clear">C</button>
        <button onClick={() => press(0)}>0</button>
        <button onClick={() => press('del')} aria-label="Delete last digit"><I.Back size={20} /></button>
      </div>
      <button className="btn is-wide" disabled={val === 0} onClick={() => { onSave(val / 100); setCents(null) }}>Save price</button>
    </Sheet>
  )
}
