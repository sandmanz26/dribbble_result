import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GrCart } from 'react-icons/gr'
import { byId, chf } from '../data/catalog.js'
import { AddButton, Qty, Meter } from '../ui.jsx'

const MOTION = [
  ['Hero object', 'Pointer over the hero', 'Box and three boosters lean toward the pointer on a damped spring, max 7°', 'rAF spring, settles in about 0.6 s', 'Static'],
  ['Hero entrance', 'Page load', 'Headline lines rise from a mask, boosters are dealt into a fan, the price tag swings in on its pin', '1.0 to 1.2 s, ease-out, staggered 110 ms', 'Shown at rest'],
  ['Shelf list', 'Hover, focus or scrolling a row to mid-screen', 'Photo on the left crossfades to that product standing on the shelf board', '350 ms fade, 600 ms rise', 'Instant swap'],
  ['Exact copy', 'Scroll through a 320 vh section', 'One frame, three distances: whole box, corner at 210%, seal at 150%', '900 ms ease-out per stage', 'Section shown as a still'],
  ['Post scene', 'Scroll or the stepper', 'Boosters drop into the letter one by one; at 7 the letter becomes a parcel; then the pickup sign', '700 ms spring, 40 ms stagger', 'Static stages'],
  ['Add to basket', 'Plus button or "In den Korb"', 'The product picture flies along an arc into the basket icon, the icon pops, a toast offers to open the basket', '720 ms arc, 320 ms pop', 'Toast only'],
  ['Product tilt and foil', 'Pointer over a card or box', 'Single cards tilt up to 14° with a foil sheen that follows the pointer; cards flip to the back', '800 ms flip', 'No tilt, flip instant'],
  ['Zoom', 'Click the main photo', 'Zooms to 220% around the click point and follows the pointer', '500 ms ease-out', 'Same, without easing'],
  ['Basket', 'Basket icon', 'Drawer slides in from the right, lines rise in', '500 ms ease-out', 'Instant'],
  ['Page change', 'Any link', 'Content rises 14 px and fades in; product pictures keep their place through a view transition where supported', '350 to 500 ms', 'Instant'],
]

export default function System() {
  const [q, setQ] = useState(2)
  const booster = byId('pitch-black-booster-en')
  useEffect(() => { document.title = 'Components and interactions | Kartenregal TCG' }, [])
  return (
    <div className="wrap review" lang="en">
      <nav className="crumbs" aria-label="Path"><Link to="/">Shop</Link><span aria-hidden="true">/</span><Link to="/review">Design review</Link><span aria-hidden="true">/</span><span aria-current="page">Components</span></nav>
      <div className="intro">
        <h1>Components and interactions</h1>
        <p>What the Figma file will hold: desktop frames at 1440 px and phone frames at 390 px for each page below, one component set, and the motion notes from this table. Everything here is live in the prototype.</p>
      </div>

      <h2 className="sec" style={{ marginTop: 56, fontSize: '1.5rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>Type, Switzer</h2>
      <div className="specimen">
        <div><span>Display, 800, -4.5%</span><b style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.9 }}>Pokémon-Karten</b></div>
        <div><span>Heading, 700, -3.5%</span><b style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1 }}>Das ganze Regal</b></div>
        <div><span>Lead, 400, 24 px</span><span style={{ fontSize: '1.5rem', color: 'var(--ink)' }}>Neu und versiegelt, jedes Stück fotografiert.</span></div>
        <div><span>Body, 400, 17 px</span><span style={{ color: 'var(--ink)', fontSize: '1.0625rem' }}>Booster reisen im gepolsterten Couvert, Einzelkarten in Sleeve und Toploader.</span></div>
        <div><span>Price, 700, tabular</span><b className="num" style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>CHF 169.00</b></div>
        <div><span>Small, 14 px</span><span className="small" style={{ color: 'var(--ink)' }}>Englisch · <span className="stock">18 im Fach</span> · <span className="stock low">Letztes Stück</span></span></div>
      </div>

      <h2 className="sec" style={{ marginTop: 56, fontSize: '1.5rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>Components</h2>
      <div className="comp" aria-label="Buttons">
        <button className="btn buy"><GrCart aria-hidden="true" />In den Korb</button>
        <button className="btn">Neu diese Woche</button>
        <button className="btn buy" disabled>Ausverkauft</button>
        <span data-item style={{ display: 'contents' }}><img src={booster.hero.replace('.webp', '-s.webp')} alt="" style={{ width: 0, height: 0 }} /><AddButton p={booster} /></span>
        <Qty value={q} max={5} onChange={setQ} label="Menge" />
        <div className="seg" style={{ marginTop: 0 }} role="group" aria-label="Sprache"><button aria-pressed="true">Alle</button><button aria-pressed="false">Deutsch</button><button aria-pressed="false">Englisch</button></div>
      </div>
      <div className="comp" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div><b style={{ display: 'block', marginBottom: 6 }}>Envelope meter, 3 boosters</b><Meter lines={[{ p: booster, qty: 3 }]} /></div>
        <div><b style={{ display: 'block', marginBottom: 6 }}>Envelope meter, with a box</b><Meter lines={[{ p: booster, qty: 2 }, { p: byId('30-jahre-ttb'), qty: 1 }]} /></div>
      </div>
      <table className="tbl">
        <thead><tr><th>Component</th><th>Variants</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Button</td><td>Buy (lime), Default (outline), On dark, Small, Disabled (dashed)</td><td>One shape, square, 1.5 px ink edge. Buy hovers into a 4 px offset shadow, like a stamped label.</td></tr>
          <tr><td>Add (square)</td><td>Default, Hover, Full ("Alle im Korb"), Sold out</td><td>44 px target. The only lime on lists.</td></tr>
          <tr><td>Shelf row</td><td>Default, Active, Sold out</td><td>Name, language, stock, price, add. Active row marks the name in red and moves the photo.</td></tr>
          <tr><td>Shelf item</td><td>Default, New, Low stock, Sold out</td><td>Stands on a 10 px shelf board, tilts on hover.</td></tr>
          <tr><td>Photo viewer</td><td>Manufacturer image, Own photo, Zoomed, Single card (flip, foil)</td><td>Every photo carries its label at the top left.</td></tr>
          <tr><td>Copy picker</td><td>2 copies, Copy in basket</td><td>Shown only when the shop photographed more than one copy.</td></tr>
          <tr><td>Envelope meter</td><td>Empty, Letter, Thick letter, Parcel, Registered</td><td>Says what the next booster changes.</td></tr>
          <tr><td>Delivery choice</td><td>Post, Pickup with time windows</td><td>Arrival dates computed from today and working days.</td></tr>
          <tr><td>Field</td><td>Default, Focus (lime ring), Error with message, Help</td><td>Errors say what to type, not only that it is wrong.</td></tr>
        </tbody>
      </table>

      <h2 className="sec" style={{ marginTop: 56, fontSize: '1.5rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>Motion</h2>
      <table className="tbl">
        <thead><tr><th>Moment</th><th>Trigger</th><th>What moves</th><th>Timing</th><th>Reduced motion</th></tr></thead>
        <tbody>{MOTION.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>

      <h2 className="sec" style={{ marginTop: 56, fontSize: '1.5rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>Pages in the file</h2>
      <table className="tbl">
        <thead><tr><th>Page</th><th>Route here</th><th>States</th></tr></thead>
        <tbody>
          <tr><td>Home</td><td><Link className="link" to="/">/</Link></td><td>Language filter, active row, empty basket</td></tr>
          <tr><td>Compartment</td><td><Link className="link" to="/fach/bundles-boxen">/fach/bundles-boxen</Link></td><td>Filters, no results, sold out item</td></tr>
          <tr><td>Product, box</td><td><Link className="link" to="/p/pitch-black-etb-en">/p/pitch-black-etb-en</Link></td><td>Two copies, zoom, copy in basket</td></tr>
          <tr><td>Product, single card</td><td><Link className="link" to="/p/makuhita-mep-068-nm-en">/p/makuhita-mep-068-nm-en</Link></td><td>Flip, foil, last piece</td></tr>
          <tr><td>Product, sold out</td><td><Link className="link" to="/p/151-mini-tin-en">/p/151-mini-tin-en</Link></td><td>Sold out</td></tr>
          <tr><td>Basket</td><td>Basket icon</td><td>Empty, letter, thick letter, parcel, pickup with window</td></tr>
          <tr><td>Checkout</td><td><Link className="link" to="/kasse">/kasse</Link></td><td>Errors, paying, empty basket</td></tr>
          <tr><td>Confirmation</td><td>after checkout</td><td>Post or pickup timeline</td></tr>
          <tr><td>Pickup, Shipping, 404</td><td><Link className="link" to="/abholung">/abholung</Link>, <Link className="link" to="/versand">/versand</Link></td><td></td></tr>
        </tbody>
      </table>
      <p className="muted" style={{ marginTop: 16 }}>Price example: one booster costs {chf(booster.price)} plus CHF 2 letter post.</p>
    </div>
  )
}
