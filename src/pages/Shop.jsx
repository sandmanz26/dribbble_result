import { Link } from 'react-router-dom'
import { SHOP, FLAVORS, usd } from '../data.js'
import { useReveal } from '../App.jsx'
import { AddBtn } from '../Twist.jsx'
import Device from '../Device.jsx'

export default function Shop() {
  const ref = useReveal()
  return (
    <div ref={ref} className="wrap page-pad">
      <header className="page-head"><h1 data-r>Shop</h1><p data-r>Two flavors, a Duo to try both, and a gift set. Free shipping on 2+ packs. Subscribe on any of them and save 20%.</p></header>
      <div className="shop-grid" id="bundles">
        {SHOP.map((p, i) => {
          const f = FLAVORS[p.flavor]
          return (
            <article key={p.id} className={`scard f-${p.flavor}`} style={{ '--field': f ? f.field : '#E7E4DC', '--accent': f ? f.accent : '#C8F04B', '--i': i }} data-r>
              <div className="scard-pic">{p.id === 'duo' ? <div className="duo-pic" role="img" aria-label="One Spearmint and one Arctic Mint device"><span><Device flavor={FLAVORS.spearmint} /></span><span><Device flavor={FLAVORS.arctic} /></span></div> : p.to ? <Link to={p.to}><img src={`img/${p.img}.webp`} alt={p.name} /></Link> : <img src={`img/${p.img}.webp`} alt={p.name} />}</div>
              <div className="scard-body">
                {(p.default || p.seasonal) && <p className="eyebrow">{p.default ? 'Try both' : 'Seasonal'}</p>}
                <h2>{p.to ? <Link to={p.to}>{p.name}</Link> : p.name}</h2>
                <p>{p.sub}</p>
                <div className="row"><b>{usd(p.price)}</b><AddBtn className="sm" line={{ id: p.id, name: p.name, flavor: p.flavor, img: p.img, packs: p.id === 'squad' ? 6 : p.id === 'duo' ? 2 : 1, price: p.price }}>Quick add</AddBtn></div>
              </div>
            </article>
          )
        })}
      </div>
      <p className="note">Stock-up (3 packs, $21.99) and Squad (6 packs, $39.99) are on each flavor page. Subscribe on any of them for 20% off. Prices are placeholders until the margin model is final.</p>
    </div>
  )
}
