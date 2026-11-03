import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../motion.js'

// Design review of kartenregal.ch as it was on 3 Nov 2026, written for the shop owner, in English as the brief was.
const KEEP = [
  ['The shelf idea', 'Regal, Fach 01 to 05, "im Fach", "Ganzes Fach". It is the best idea in the shop and it belongs to nobody else.'],
  ['Honest stock', '"2 im Fach" and "Letztes Stück" tell the truth and create urgency without a countdown.'],
  ['Photos of the exact copy', '"Was du siehst, liegt im Paket" is a promise none of the bigger Swiss shops make. It should lead.'],
  ['Three strong colours', 'Signal red, lime and shelf green on a rose ground. Most TCG shops are navy or black; this is recognisable.'],
  ['Plain, specific copy', 'Prices for letter post, pickup steps, the 14-day promise. Short and concrete, in good Swiss German.'],
  ['Square buttons with an ink edge', 'They fit the printed-label feel. Kept, with one change to how often lime appears.'],
]

const OBS = [
  { img: 'review/home-hero.webp', pin: [22, 34], h: 'The first screen names the category, not the shop', p: 'The headline "Pokémon-Karten: Booster, Bundles und Boxen" runs five lines at display size and could sit on any of the shops listed for "TCG Schweiz". What only Kartenregal offers (photos of the exact copy, letter post from CHF 2, free pickup in Wetzikon, a real stock count) is in 16px text under it.', fix: 'A two-line headline with the place in it, one sentence with the three reasons, the top product as the large object you can tilt, and its price tag with one buy button.', to: '/', label: 'See the new first screen' },
  { img: 'review/home-shelf.webp', pin: [25, 91], h: 'Fourteen lime bars, so lime stops meaning "buy"', p: 'Every card ends in a full-width lime "In den Korb". On the home page that is the loudest shape on the screen, repeated until it reads as a pattern. The price in heavy condensed type comes second, and the product name third.', fix: 'Lime is kept only for buying: one full button on the product page and in the basket, and a small square add button on lists. Names lead, prices are set large but in the text face.', to: '/fach/booster', label: 'See a compartment' },
  { img: 'review/home-shelf.webp', pin: [8, 42], h: 'The shelf exists only in words', p: '"02 Booster" and "Ganzes Fach" are lovely, but the page underneath is a standard product grid. With 14 products the shop is small enough to show the whole shelf at once.', fix: 'The home page shows the whole shelf as one list grouped by Fach, with the product standing on a shelf board beside it as you move down. Compartment pages put products on drawn shelf boards.', to: '/', label: 'See the whole shelf' },
  { img: 'review/pdp-top.webp', pin: [72, 26], h: 'The product title is a SKU in capitals', p: '"POKÉMON ASCENDED HEROES ETB DE – NEU & VERSIEGELT" takes four lines of condensed capitals and repeats what the details already say. The German set name, which a German buyer searches for, is missing from the title area.', fix: 'Short title in sentence case, the German name and language on one line below, condition in the details.', to: '/p/ascended-heroes-etb-de', label: 'See the product page' },
  { img: 'review/pdp-sticky.webp', pin: [50, 5], h: 'The exact-copy photos have no names', p: 'The section is called "Genau dieses Exemplar", but the photos are unlabelled and laid out at mixed sizes, with one left alone on its row. The buyer has to guess which is the manufacturer image and which side they are looking at.', fix: 'Every photo is labelled (Herstellerbild, Vorderseite, Rückseite, Siegel), the main view zooms on click, and where two copies exist with different flaws, the buyer picks the copy.', to: '/p/pitch-black-etb-en', label: 'See the copy picker' },
  { img: 'review/pdp-sticky.webp', pin: [50, 93], h: 'The sticky buy bar covers the text', p: 'On desktop the floating bar sits over "Gut zu wissen" and the delivery prices while you read them. It appears even though the real buy button is a short scroll away.', fix: 'No floating bar on desktop. On phones the bar appears only while the real button is off screen and never over the delivery block.', to: '/p/30-jahre-ttb', label: 'Try it on a phone width' },
  { img: 'review/home-shelf.webp', pin: [72, 17], h: 'The cheapest shipping in Switzerland is hidden', p: 'One booster for CHF 2 by letter is a real advantage over shops that ask CHF 79 to CHF 200 for free shipping, but the rules live on the policy page. Nobody learns that three to six boosters still go in a CHF 4 letter.', fix: 'The rules became a scroll scene on the home page (Brief, Dicker Brief, Paket, Abholen) and a live meter in the basket that says how many more boosters still fit in the same letter.', to: '/', label: 'Add boosters and open the basket' },
  { img: 'review/mobile-shelf.webp', pin: [50, 32], h: 'On a phone, 14 products are 5,500 pixels', p: 'Each product is a full-width card with a full-width button, so the home page is about six and a half screens of scrolling for a shop with 14 items. There is no way to choose German or English, which is the main choice buyers make.', fix: 'Rows instead of cards on the home page, a language filter on the shelf and on every compartment, and the product photo pinned at the top while the list moves under it.', to: '/', label: 'See it at phone width', mobile: true },
  { img: 'review/home-bundles.webp', pin: [30, 55], h: 'Three layouts in one compartment', p: 'Bundles & Boxen mixes a large feature tile, a two-column grid and a single wide row. It looks unplanned rather than designed, and the big tile makes one product look more important than the shop meant.', fix: 'One layout per page type, so the rhythm comes from the products, not from the grid changing.', to: '/fach/bundles-boxen', label: 'See Bundles & Boxen' },
  { img: 'review/home-hero.webp', pin: [74, 92], h: 'Pickup is an email exchange', p: 'Free pickup is a strength, but the flow is order, wait for an email, propose a time, wait for a reply. Two round trips before the buyer knows when.', fix: 'The buyer picks a preferred time window in the basket and the shop confirms it in one email. The windows in the prototype are examples to agree with you.', to: '/abholung', label: 'See pickup' },
]

export default function Review() {
  const ref = useReveal()
  useEffect(() => { document.title = 'Design review | Kartenregal TCG' }, [])
  return (
    <div className="wrap review" ref={ref} lang="en">
      <nav className="crumbs" aria-label="Path"><Link to="/">Shop</Link><span aria-hidden="true">/</span><span aria-current="page">Design review</span></nav>
      <div className="intro">
        <h1>Review of kartenregal.ch, and what changed in the prototype</h1>
        <p>Screens from the live site on 3 November 2026, desktop at 1440 px and phone at 390 px. Each point links to the redesigned screen in this prototype. The three brand colours stay; only their jobs changed.</p>
      </div>

      <h2 style={{ marginTop: 64, fontSize: '1.5rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>What already works and stays</h2>
      <ul className="keep">{KEEP.map(([b, p], i) => <li key={b} data-reveal style={{ '--i': i % 3 }}><b>{b}</b><p>{p}</p></li>)}</ul>

      <h2 style={{ marginTop: 96, fontSize: '1.5rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>What feels generic, and what changed</h2>
      <div className="obs">
        {OBS.map((o, i) => (
          <article className={`ob ${o.mobile ? 'mobile' : ''}`} key={o.h} data-reveal>
            <figure className="shot">
              <img src={o.img} alt={`Current site: ${o.h}`} loading="lazy" />
              <span className="pinmark" style={{ left: `${o.pin[0]}%`, top: `${o.pin[1]}%` }} aria-hidden="true">{i + 1}</span>
            </figure>
            <div>
              <span className="no num">{String(i + 1).padStart(2, '0')}</span>
              <h2>{o.h}</h2>
              <p>{o.p}</p>
              <div className="fix"><b>In the prototype</b>{o.fix}<br /><Link className="link" to={o.to}>{o.label}</Link></div>
            </div>
          </article>
        ))}
      </div>

      <h2 style={{ marginTop: 96, fontSize: '1.5rem', paddingBottom: 10, borderBottom: '3px solid var(--ink)' }}>Colour, kept and tuned</h2>
      <ul className="tokens">
        {[['#e10600', 'Signal red', 'Brand field and shelf numbers. Unchanged.'], ['#a30400', 'Red for text', 'Red on the rose ground, darkened slightly to pass 4.5:1.'], ['#bfe23a', 'Lime', 'Unchanged. Only for buying.'], ['#276642', 'Shelf green', 'Unchanged. Only for stock.'], ['#e4d3cf', 'Rose ground', 'Unchanged, with #f3e8e5 for surfaces.']].map(([c, n, d]) => <li key={c}><i style={{ '--c': c }} /><div><b>{n}</b><span className="num">{c}</span><p className="muted" style={{ marginTop: 4 }}>{d}</p></div></li>)}
      </ul>
      <p style={{ marginTop: 20, maxWidth: '68ch' }}>Type changes from Archivo to Switzer, a Swiss neo-grotesk with a free commercial licence: it is calmer at small sizes, its figures line up in price columns, and the heavy weight gives the headlines the poster feel the old condensed face had without the capitals. Dark mode keeps the same three colours on the shop's own brown.</p>
      <p style={{ marginTop: 24 }}><Link className="link" to="/system">Components and interactions for the Figma file</Link></p>
    </div>
  )
}
