import { Mark, Ribbon, photo } from '../ui.jsx'

const SWATCHES = [
  ['Sand', '#ddd6c6', 'The ground. Warm and calm, so portraits carry the colour.'],
  ['Paper', '#f5f2ea', 'Every card, slip and panel. The printed object.'],
  ['Charcoal', '#2a2a26', 'All text. 12.4:1 on paper, 9.6:1 on sand.'],
  ['Laurel', '#4f6238', 'The one accent: actions and the ribbon. The oldest sign of a win.'],
  ['Night', '#22231f', 'The ceremony room: photo grounds and the closing card.'],
]

export default function Notes() {
  return (
    <>
      <section className="page-head" aria-labelledby="ph">
        <h1 id="ph" data-rise>Design notes</h1>
        <p data-rise>For the awards team: what changed from a typical awards site and why, the palette, a proposal for the logo, and how to shoot the portraits.</p>
      </section>

      <section className="section wrap" aria-labelledby="pal-h" style={{ marginTop: 72 }}>
        <div className="two w48">
          <div>
            <h2 id="pal-h" className="head" data-rise>Palette</h2>
            <p style={{ marginTop: 20 }} data-rise>Awards default to black and gold, which reads as a plaque you can buy. This palette keeps the ceremony but trades gold for laurel, and lets the people in the photographs supply the rest of the colour. One accent only, on actions and the ribbon.</p>
            <p className="muted" style={{ marginTop: 16 }} data-rise>The two existing prototypes were not shared with this proposal. Send them and this page will show your current palette beside this one, with the contrast of each pair.</p>
          </div>
          <ul style={{ display: 'grid', gap: 6 }}>
            {SWATCHES.map(([n, hex, use]) => (
              <li key={n} data-rise style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, alignItems: 'center', background: 'var(--paper)', paddingRight: 20 }}>
                <span style={{ background: hex, height: 72 }} aria-hidden="true" />
                <span><b style={{ fontWeight: 600 }}>{n}</b><br /><span className="muted">{use}</span></span>
                <span className="muted">{hex}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="logo-h">
        <div className="two w48">
          <div>
            <h2 id="logo-h" className="head" data-rise>Logo</h2>
            <p style={{ marginTop: 20 }} data-rise>A suggestion, not a rebrand. The mark is a medal ribbon cut with a V: five stripes, laurel and paper. It reads at favicon size, works in one colour, and its stripes become the ribbon across every card on the site.</p>
            <ul className="rules" style={{ columns: 1, marginTop: 24 }} data-rise>
              <li>Keep the name in one weight, sentence case, no tracking tricks.</li>
              <li>Drop any trophy or star drawing: they say “award” without saying which one.</li>
              <li>The year sits beside the name, never inside the mark, so the mark lasts.</li>
            </ul>
          </div>
          <div className="logo-grid">
            <div className="panel" data-rise style={{ display: 'grid', placeItems: 'center', minHeight: 260 }}><span className="lockup" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, fontSize: 'var(--step-lead)', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '-0.03em' }}><Mark size={56} />Tech Leader Awards</span></div>
            <div data-rise style={{ display: 'grid', placeItems: 'center', minHeight: 260, background: 'var(--field)', color: 'var(--field-ink)' }}><span className="lockup" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, fontSize: 'var(--step-lead)', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '-0.03em' }}><svg width="40" height="56" viewBox="0 0 18 25" aria-hidden="true"><path d="M0 0H18V25L9 19L0 25Z" fill="var(--field-ink)" /></svg>Tech Leader Awards</span></div>
            <div data-rise style={{ display: 'grid', placeItems: 'center', minHeight: 200, background: 'var(--surface)' }}><Mark size={96} /></div>
            <div className="panel" data-rise style={{ padding: 0, display: 'grid', alignContent: 'start' }}><Ribbon /><p style={{ padding: 20 }}>The ribbon as a system: top of every card, bottom of the button on hover, the footer band.</p></div>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="ph-h">
        <div className="two w48">
          <div>
            <h2 id="ph-h" className="head" data-rise>Portraits</h2>
            <p style={{ marginTop: 20 }} data-rise>People lead, so their photographs have to look like one series, whoever took them.</p>
            <ul className="rules" style={{ columns: 1, marginTop: 24 }} data-rise>
              <li>Portrait 4:5, shoulders up, eyes on the upper third line.</li>
              <li>Plain background, any colour: the site shows them in black and white.</li>
              <li>At least 1600 px tall. One portrait per person, reused everywhere.</li>
              <li>Ceremony photographs: the room and the moment, never a sponsor wall.</li>
            </ul>
          </div>
          <div className="portrait-row">
            {['p-04', 'p-06', 'p-11', 'p-12'].map((k) => <img key={k} data-rise src={photo(k)} alt="" width="900" height="1125" loading="lazy" style={{ aspectRatio: '4 / 5', objectFit: 'cover', filter: 'grayscale(1)', width: '100%' }} />)}
          </div>
        </div>
      </section>
    </>
  )
}
