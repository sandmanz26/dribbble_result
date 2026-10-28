import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore, linePrice } from '../store.jsx'
import { catOf, money, HEAT, DIPS, SIDES, FREE_DIPS, DIP_PRICE } from '../data/menu.js'
import Food from '../ui/Food.jsx'
import { Stepper } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

export default function Item() {
  const { id } = useParams()
  const nav = useNavigate()
  const { itemById, dispatch } = useStore()
  const item = itemById(id)
  const [heat, setHeat] = useState('medium')
  const [dips, setDips] = useState(['garlic'])
  const [side, setSide] = useState('none')
  const [qty, setQty] = useState(1)
  const [flying, setFlying] = useState(false)

  if (!item) return <div className="empty"><h1>That dish is not on the menu</h1><button className="btn" onClick={() => nav('/')}>Back to the menu</button></div>
  const c = catOf(item.cat)
  const h = HEAT.find((x) => x.id === heat)
  const line = { id: item.id, qty, heat: item.heat ? heat : null, dips, side }
  const total = linePrice(line, item)
  const toggleDip = (d) => setDips((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]))

  const add = () => {
    dispatch({ type: 'add', line })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFlying(true)
    setTimeout(() => nav('/', { state: { added: { qty, name: item.name } } }), reduce ? 0 : 520)
  }

  return (
    <article className="item" style={{ '--field': c.field, '--ink': c.ink }} data-heat={item.heat ? h.flames : 0}>
      <div className="item-field">
        <button className="icon-btn on-field" onClick={() => nav(-1)} aria-label="Back"><I.Back size={22} /></button>
        <span className="item-cat">{c.long}</span>
        <div className={`item-art ${flying ? 'is-flying' : ''}`}><Food art={item.art} heat={item.heat ? h.flames : 1} label={item.name} /></div>
      </div>

      <div className="item-body">
        <h1>{item.name}</h1>
        <p className="item-desc">{item.desc}</p>
        <p className="item-facts"><span>{money(item.price)}</span><span><I.Time size={15} /> About {item.mins} min on the line</span></p>
        {item.soldOut && <p className="note is-warn"><I.Hidden size={16} /> Sold out today. The kitchen marks it back when the next batch is ready.</p>}

        {item.heat && (
          <fieldset className="group">
            <legend>How hot</legend>
            <div className="heat" role="radiogroup" aria-label="Heat level">
              {HEAT.map((x) => (
                <button key={x.id} role="radio" aria-checked={heat === x.id} className="heat-opt" onClick={() => setHeat(x.id)}>
                  <span className="flames" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <I.Fire key={i} size={14} className={i < x.flames ? 'lit' : ''} />)}</span>
                  {x.name}
                </button>
              ))}
            </div>
            <p className="heat-note" key={h.id}>{h.note}</p>
          </fieldset>
        )}

        <fieldset className="group">
          <legend>Dips <small>{FREE_DIPS} free, then {money(DIP_PRICE)} each</small></legend>
          <div className="chips">
            {DIPS.map((d) => (
              <button key={d.id} className="chip" aria-pressed={dips.includes(d.id)} onClick={() => toggleDip(d.id)}>
                {dips.includes(d.id) && <I.Check size={15} />}{d.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="group">
          <legend>On the side</legend>
          <div className="options" role="radiogroup" aria-label="Side">
            {SIDES.map((x) => (
              <button key={x.id} role="radio" aria-checked={side === x.id} className="option" onClick={() => setSide(x.id)}>
                <span className="radio" aria-hidden="true" />{x.name}<span className="option-price">{x.price ? `+ ${money(x.price)}` : ''}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="addbar">
        <Stepper value={qty} min={1} onChange={setQty} label="Quantity" />
        <button className="btn is-wide" disabled={item.soldOut} onClick={add}>
          {item.soldOut ? 'Sold out today' : <>Add to bag <span className="btn-sum">{money(total)}</span></>}
        </button>
      </div>
    </article>
  )
}
