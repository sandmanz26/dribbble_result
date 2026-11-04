import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from './store.jsx'
import { BRANDS } from './data/brands.js'
import { Mark } from './ui.jsx'

// Phase 1 deliverables shown as pages: the audit, the information architecture, and the white-label system.

const AUDIT = [
  ['Language and direction', 'Mixed alignment: Arabic labels set left, prices and units breaking across lines, icons that point the wrong way in RTL.', 'One layout written with logical properties, mirrored as a whole; only direction-bearing icons flip. Digits follow the reader (Arabic-Indic by default, Latin as a setting).', 'High'],
  ['Search across scripts', 'Searching “labne” finds nothing when the product is named لبنة, and “لبنه” misses “لبنة”. Typos return an empty page.', 'Arabic normalisation (hamza, taa marbuta, alef maqsura), Latin transliterations per product, typo tolerance, and a “did you mean”. An empty result offers the assistant.', 'High'],
  ['Lists and basket are separate worlds', 'A shopping list is a note; turning it into an order means searching every item again.', 'Lists hold products, are shared with the family, sort by the aisles of the chosen branch, and go to the basket in one tap. Free-text items stay on the list as “ask staff”.', 'High'],
  ['Shareholder number typed at every order', 'The co-op’s most loyal members re-enter their number, and the dividend they earn is invisible until the year ends.', 'The number lives on the digital card and is added to every order. Home shows the dividend growing; every price shows roughly what comes back.', 'High'],
  ['Deep category trees', 'Four levels of categories before seeing a product; back buttons lose the scroll position.', 'Six departments, a chip bar to move sideways, and product cards with add on the card.', 'Medium'],
  ['Inconsistent product photos', 'Supplier images on different backgrounds and sizes make the shelf look like a flyer.', 'One packshot style (warm ground, soft top light, centred) is part of the design system, with a brief for suppliers.', 'Medium'],
  ['No substitution choice', 'Out-of-stock items disappear from the order without warning.', 'Each basket line says “swap if out” or “do not swap”, chosen before ordering.', 'Medium'],
  ['Assistant with nothing to act on', 'Chat that answers in paragraphs and leaves the user to find each product.', 'The assistant answers with a list or a basket, shows prices and dividend, and only suggests. Nothing is ordered without the member.', 'Medium'],
]

export function Audit() {
  useEffect(() => { document.title = 'UX audit · Cooperative app' }, [])
  return (
    <article className="doc">
      <h1>UX audit, Phase 1</h1>
      <p className="lede">The brief’s app was not attached, so this audit is built from the public listings and descriptions of Gulf co-op apps (Kuwait and the UAE) and from how members shop: family lists, shareholder numbers, delivery and branch pickup. Each finding is a hypothesis to confirm on your app in the first week, with the change the prototype makes.</p>
      <table className="dtable">
        <thead><tr><th>Area</th><th>What we expect to find</th><th>What the redesign does</th><th>Impact</th></tr></thead>
        <tbody>{AUDIT.map((r) => <tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td><span className={`imp ${r[3].toLowerCase()}`}>{r[3]}</span></td></tr>)}</tbody>
      </table>
      <h2>Method for the real audit</h2>
      <ol className="steps">
        <li><b>Walkthrough</b> of every flow in Arabic and English on iOS and Android, screen-recorded.</li>
        <li><b>Heuristic review</b> against Nielsen’s heuristics plus RTL checks (mirroring, digits, mixed-direction text).</li>
        <li><b>Data</b>: search terms with zero results, drop-off between basket and order, share of orders with a shareholder number.</li>
        <li><b>Five member interviews</b>: two shareholders, two non-shareholders, one family organiser who keeps the lists.</li>
      </ol>
    </article>
  )
}

const TREE = [
  ['Home', ['Dividend or points', 'From your list', 'Deals', 'Departments', 'Local produce']],
  ['Search', ['Recent', 'Results with matched spelling', 'Ask the assistant']],
  ['Lists', ['Shared family lists', 'Sort by aisle', 'Add all to basket', 'Free-text items']],
  ['Assistant', ['Plans (dinner, breakfast)', 'Deals', 'Restock from a list', 'Save as list / add to basket']],
  ['Basket', ['Substitution per line', 'Express, scheduled, pickup', 'Shareholder number', 'Order tracking']],
  ['Membership', ['Digital card', 'Dividend this year', 'Family on one number', 'Points for non-shareholders']],
]

const JOURNEYS = [
  ['The family organiser', 'Thursday gathering for six', ['Asks the assistant “dinner for six”', 'Saves the answer as a list and shares it', 'Family adds bread and laban', 'Adds all to the basket, keeps “swap if out”', 'Orders express; number added automatically']],
  ['The quick top-up', 'Laban and bread on the way home', ['Types “leban” in search', 'Finds لبن under another spelling', 'Adds from the result row', 'Picks up at the branch']],
  ['The in-store shopper', 'Walking the aisles', ['Opens the Home list', 'Sorts by the branch aisles', 'Ticks items aisle by aisle', 'Asks staff for the free-text item']],
]

export function IA() {
  useEffect(() => { document.title = 'IA and journeys · Cooperative app' }, [])
  return (
    <article className="doc">
      <h1>Information architecture and journeys</h1>
      <p className="lede">Five tabs, each with one job. The member’s own things (lists, basket, card) are never more than one tap away, and the assistant can reach everything the tabs can.</p>
      <div className="tree">{TREE.map(([h, items]) => <section key={h}><h3>{h}</h3><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></section>)}</div>
      <h2>Key journeys</h2>
      <div className="journeys">{JOURNEYS.map(([who, task, steps]) => (
        <section key={who}><h3>{who}</h3><p className="muted">{task}</p><ol>{steps.map((s) => <li key={s}>{s}</li>)}</ol></section>
      ))}</div>
    </article>
  )
}

export function System() {
  const { dispatch, brand: cur } = useStore()
  useEffect(() => { document.title = 'White-label design system · Cooperative app' }, [])
  return (
    <article className="doc">
      <h1>White-label design system</h1>
      <p className="lede">A co-op changes four colour tokens, a mark and its name. Type, spacing, components and every screen stay the same, so a new co-op is a new set of variables, not a redesign.</p>
      <h2>Brand tokens (Figma variable collection “Brand”, one mode per co-op)</h2>
      <div className="brandgrid">
        {Object.values(BRANDS).map((b) => (
          <button key={b.id} className={`bcard ${cur.id === b.id ? 'on' : ''}`} onClick={() => dispatch({ type: 'set', v: { brand: b.id } })} style={{ '--c': b.primary, '--t': b.tint }}>
            <span className="bc-head"><span style={{ color: b.primary }}><Mark brand={b} size={30} /></span><b>{b.name.en}</b><span dir="rtl">{b.name.ar}</span></span>
            <span className="sw">{[['brand', b.primary], ['on-brand', b.onPrimary], ['brand-tint', b.tint], ['brand-ink', b.ink]].map(([k, v]) => <span key={k}><i style={{ background: v }} />{k}<code>{v}</code></span>)}</span>
            <span className="muted sm">{cur.id === b.id ? 'Applied to the prototype' : 'Click to apply to the prototype'}</span>
          </button>
        ))}
      </div>
      <h2>Collections</h2>
      <table className="dtable">
        <thead><tr><th>Collection</th><th>Modes</th><th>Holds</th></tr></thead>
        <tbody>
          <tr><td><b>Brand</b></td><td>Nakheel, Bahar, Ward, … (one per co-op)</td><td>brand, on-brand, brand-tint, brand-ink, logo, name</td></tr>
          <tr><td><b>Theme</b></td><td>Light, Dark</td><td>ground, surface, ink, muted, line, positive (dividend)</td></tr>
          <tr><td><b>Direction</b></td><td>RTL (ar), LTR (en)</td><td>text align, icon flip, number system, font features</td></tr>
          <tr><td><b>Platform</b></td><td>iOS, Android</td><td>tab bar height, back icon, sheet corner, haptics notes</td></tr>
        </tbody>
      </table>
      <h2>Components (Auto Layout, variants)</h2>
      <table className="dtable">
        <thead><tr><th>Component</th><th>Variants and properties</th></tr></thead>
        <tbody>
          <tr><td><b>Product card</b></td><td>size (grid, rail, row) · state (default, in basket, deal, out of stock) · dividend line on/off</td></tr>
          <tr><td><b>Stepper</b></td><td>size (sm, md) · value · min reached (becomes remove)</td></tr>
          <tr><td><b>List item</b></td><td>product or free text · done · added by · price</td></tr>
          <tr><td><b>Search field</b></td><td>idle, typing, results, no results · mic</td></tr>
          <tr><td><b>Assistant message</b></td><td>member, assistant · with plan (items, total, dividend, actions) · typing</td></tr>
          <tr><td><b>Delivery option</b></td><td>express, scheduled, pickup · selected</td></tr>
          <tr><td><b>Member card</b></td><td>shareholder, points · brand token driven</td></tr>
          <tr><td><b>Tab bar</b></td><td>iOS, Android · badge</td></tr>
        </tbody>
      </table>
      <h2>RTL rules</h2>
      <ul className="rules">
        <li>Layout uses start and end, never left and right; the whole screen mirrors.</li>
        <li>Icons that show direction flip (back, send, chevrons); icons that show objects do not (basket, mic, check).</li>
        <li>Arabic-Indic digits by default in Arabic, Latin digits as a setting; product codes and phone numbers stay Latin.</li>
        <li>Mixed text (an English name inside Arabic) is isolated so punctuation lands on the right side.</li>
        <li>Alexandria covers Arabic and Latin in one family, so weights and heights match in both directions.</li>
      </ul>
      <h2>Motion</h2>
      <table className="dtable">
        <thead><tr><th>Moment</th><th>Behaviour</th></tr></thead>
        <tbody>
          <tr><td><b>Push and back</b></td><td>New screens slide in from the reading end (from the left in Arabic, from the right in English), back reverses; 320 ms, ease-out</td></tr>
          <tr><td><b>Tabs</b></td><td>Cross-fade with a 12 px rise, no slide</td></tr>
          <tr><td><b>Product picture</b></td><td>Carried from the card to the product page (shared element)</td></tr>
          <tr><td><b>Large title</b></td><td>Collapses into the bar as the screen scrolls</td></tr>
          <tr><td><b>Add to basket</b></td><td>Badge pops on the basket tab</td></tr>
          <tr><td><b>Assistant</b></td><td>Typing dots, then the answer writes itself, then the items rise in</td></tr>
          <tr><td><b>Reduced motion</b></td><td>All of the above become instant</td></tr>
        </tbody>
      </table>
      <p><Link className="btn primary" to="/">Back to the prototype</Link></p>
    </article>
  )
}
