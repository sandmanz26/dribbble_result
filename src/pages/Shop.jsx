import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COFFEES } from '../data.js'
import { useReveal } from '../motion.js'
import Card from '../Card.jsx'

const KINDS = [['all', 'All six'], ['fruity', 'Fruity'], ['chocolatey', 'Chocolatey'], ['decaf', 'Decaf']]
const SORTS = [['fruit', 'Most fruit first'], ['body', 'Most body first'], ['price', 'Lowest price first']]

export default function Shop() {
  const [sp, setSp] = useSearchParams()
  const kind = sp.get('k') || 'all'
  const [sort, setSort] = useState('fruit')
  const list = useMemo(() => {
    const l = COFFEES.filter((c) => kind === 'all' || c.kind === kind)
    return [...l].sort((a, b) => (sort === 'price' ? a.price[250] - b.price[250] : b[sort] - a[sort]))
  }, [kind, sort])
  const ref = useReveal([kind, sort])
  return (
    <div className="wrap shop" ref={ref}>
      <div className="shop-head">
        <h1>The coffees</h1>
        <p>Roasted on Tuesday, posted on Wednesday. Every bag 250 g or 1 kg, whole or ground for how you brew.</p>
      </div>
      <div className="shop-tools">
        <div className="seg" role="group" aria-label="Show">
          {KINDS.map(([k, l]) => <button key={k} aria-pressed={kind === k} onClick={() => setSp(k === 'all' ? {} : { k })}>{l}</button>)}
        </div>
        <label className="sort">Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        </label>
      </div>
      <p className="shop-count" aria-live="polite">{list.length} {list.length === 1 ? 'coffee' : 'coffees'}</p>
      <div className="grid" key={kind + sort}>{list.map((c, i) => <Card key={c.id} c={c} i={i} />)}</div>
      <section className="compare" aria-labelledby="cmp-h">
        <h2 id="cmp-h" data-r>Side by side</h2>
        <div className="cmp" role="table" aria-label="Taste of each coffee">
          <div className="cmp-row cmp-head" role="row"><span role="columnheader">Coffee</span><span role="columnheader">Fruit</span><span role="columnheader">Body</span><span role="columnheader">Sweetness</span></div>
          {list.map((c) => (
            <div key={c.id} className="cmp-row" role="row" style={{ '--c': c.colour }} data-r>
              <span role="cell"><i />{c.name}</span>
              {['fruit', 'body', 'sweet'].map((k) => <span key={k} role="cell" className="meter" aria-label={`${c[k]} of 10`}><b style={{ width: `${c[k] * 10}%` }} /></span>)}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
