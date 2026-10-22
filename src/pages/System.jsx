import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarPlus, ChevronUp, Download, MapPinOff } from 'lucide-react'
import { BrandScope, useBrand } from '../brand/BrandContext.jsx'
import {
  BRAND_META, BRANDS, CONTRAST_PAIRS, contrastFor, SEMANTIC_DOCS, STYLE_META, semantic, shapeFor, toDTCG,
} from '../brand/tokens.js'
import { money, priceQuote } from '../data/services.js'
import { TECHNICIANS } from '../data/schedule.js'
import {
  ApprovalRequest, ArrivalWindowPicker, FindBooking, LocationSummary, QuoteBreakdown, Receipt, ServiceAreaCheck, StatusTimeline,
  TechnicianCard, VehicleChip, WarrantyCard,
} from '../service/index.jsx'
import { Alert, Button, Choice, Empty, Field, Input, Segmented, Sheet, Wordmark } from '../ui/index.jsx'
import { UXNote } from '../ui/UXNote.jsx'

const sampleQuote = {
  standard: priceQuote({ service: 'pads', axle: 'front', size: 'suv', tier: 'standard' }),
  premium: priceQuote({ service: 'pads', axle: 'front', size: 'suv', tier: 'premium' }),
}
const sampleVehicle = { year: 2019, make: 'Toyota', model: 'RAV4' }
const tech = TECHNICIANS.austin[0]
const finding = { title: 'Front rotors below minimum thickness', reading: 'Measured 25.1 mm. Minimum is 26.0 mm.', why: 'New pads on thin rotors can shake and wear out early.', price: 210 }

// Every exported component, its Figma variants and properties, and the routes that use it.
// The Figma table on this page is generated from this one list.
const COMPONENTS = [
  ['Button', 'variant: primary, secondary, ghost, danger', 'size: sm, md, lg. state: default, hover, focus, disabled, loading. icon start/end. Danger is filled or outline per brand', ['/', '/quote/details']],
  ['IconButton', 'state: default, hover, focus', 'icon, label', ['/']],
  ['Field', 'state: default, focus, error, disabled', 'label, hint, error text, optional', ['/quote/details']],
  ['Input / Select', 'state: default, hover, focus, invalid, disabled', 'placeholder', ['/quote/vehicle']],
  ['Choice', 'checked, disabled', 'title, detail, aside slot', ['/quote/location']],
  ['Check', 'checked', 'title, detail', ['/quote/issue']],
  ['Segmented', 'size: md, sm', 'options, icon per option', ['/quote/vehicle']],
  ['Alert', 'tone: info, success, warning, danger', 'title, body, action slot', ['/quote/issue']],
  ['Empty', 'with or without action', 'icon, title, body', ['/bookings']],
  ['Skeleton / Loading', 'shape: line, block', 'width, height, radius, label', ['/quote/price']],
  ['Sheet', 'open, closed', 'title, body, footer', ['/bookings']],
  ['Wordmark', 'brand: NuBrakes, Valvoline. compact', '', ['/']],
  ['VehicleChip', 'editable or not', 'vehicle, size', ['/quote/price']],
  ['ServiceAreaCheck', 'state: idle, checking, in area, out of area, waitlist sent, error', 'ZIP prefilled', ['/']],
  ['OutOfArea / WaitlistForm', 'state: idle, invalid, sending, sent', 'ZIP, action slot', ['/']],
  ['ArrivalWindowPicker', 'state: loading, open, last spot, soonest, full day, closed day, error', 'selected day, selected window, urgent', ['/quote/time']],
  ['QuoteBreakdown', 'status: loading, ready, error', 'tiers on/off, per axle or per visit, hold date', ['/quote/price']],
  ['LocationSummary', '', 'address, location type, access notes', ['/bookings']],
  ['Quote summary sheet', 'collapsed, open', 'rows with Change links, total', ['/quote/issue']],
  ['TechnicianCard', 'status: assigned, on the way, working, done', 'ETA, van, livery', ['/bookings']],
  ['StatusTimeline', 'step: booked to done', '', ['/bookings']],
  ['ApprovalRequest', 'state: pending, sending, approved, declined', 'reading, reason, price', ['/bookings']],
  ['Receipt', 'state: unpaid, paying, failed, paid. extra: approved, declined', 'lines, statement name', ['/bookings']],
  ['WarrantyCard', 'status: active, expiring, expired. migrated', 'service, axle, end date, origin brand', ['/bookings']],
  ['FindBooking', 'state: idle, invalid, loading, not found, error', 'booking number, last 4 of phone', ['/bookings']],
]

const sampleBooking = {
  id: 'NB-41873', brand: 'nubrakes', service: 'pads', axle: 'front', size: 'suv', tier: 'standard',
  lines: { parts: sampleQuote.standard.parts, labor: sampleQuote.standard.labor, tax: sampleQuote.standard.tax, total: sampleQuote.standard.total },
  extra: 'declined', paid: false,
}
const inDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const PROPOSED = [
  { name: 'ServiceAreaCheck', why: 'A shop system never has to say "we do not come to you". Covers in area, out of area with a waitlist, invalid ZIP and lookup error.', demo: () => <ServiceAreaCheck initialZip="73301" /> },
  { name: 'ArrivalWindowPicker', why: 'Mobile service sells a window, not a slot at a bay. Day strip plus windows, with closed day, fully booked day, last spot and load error. One tab stop; arrow keys move between open days.', demo: () => <DemoPicker /> },
  { name: 'VehicleChip', why: 'The vehicle drives price, so it stays visible and editable through the flow.', demo: () => <VehicleChip vehicle={sampleVehicle} size="suv" onEdit={() => {}} /> },
  { name: 'QuoteBreakdown', why: 'Itemised parts, labor and tax with an optional parts tier and the date the price is held until. Answers "what will this cost" before contact details.', demo: () => <DemoQuote /> },
  { name: 'Quote summary sheet', why: 'On phones the running quote sits behind one line with the total. Every row links back to its step.', demo: () => <DemoSummarySheet /> },
  { name: 'LocationSummary', why: 'The spot, its type and the access notes the technician reads before driving out.', demo: () => <LocationSummary address="4500 Duval St, Apt lot B" type="Apartment lot" notes="Gate code 4412. Visitor spaces by the leasing office" /> },
  { name: 'TechnicianCard', why: 'Someone is coming to your home. Name, credentials, the van to look for, including its livery during the rebrand, and live arrival status.', demo: () => <TechnicianCard tech={tech} status="en_route" eta={14} window="10 am to 12 pm" livery="NuBrakes livery" /> },
  { name: 'StatusTimeline', why: 'Booked to done in five steps, so customers do not have to call to ask where the technician is.', demo: () => <StatusTimeline status="en_route" /> },
  { name: 'ApprovalRequest', why: 'Extra work found on site is approved remotely with the measurement and price. Declining is always allowed.', demo: () => <DemoApproval /> },
  { name: 'Receipt', why: 'The bill uses the quote lines, shows what was approved or declined on site, how it appears on the card statement, and pays in place.', demo: () => <DemoReceipt /> },
  { name: 'WarrantyCard', why: 'What is covered and until when, with a way to report a problem. Visits made under NuBrakes say who issued and who honors the warranty.', demo: () => <DemoWarranty /> },
  { name: 'FindBooking', why: 'Booking number plus the last 4 digits of the phone. Old NB- numbers keep working after the move to Valvoline.', demo: () => <FindBooking /> },
]

function DemoPicker() {
  const [v, setV] = useState(null)
  return <ArrivalWindowPicker metro="austin" value={v} onChange={setV} />
}
function DemoQuote() {
  const [tier, setTier] = useState('standard')
  return <QuoteBreakdown service="pads" axle="front" quote={sampleQuote} tier={tier} onTier={setTier} holdLabel="Price held until Thu, Oct 29" />
}
function DemoApproval() {
  const [d, setD] = useState(null)
  return <ApprovalRequest finding={finding} techName="Marcus" decided={d} onDecide={setD} />
}
function DemoSummarySheet() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className="summary-trigger" aria-expanded={open} onClick={() => setOpen(true)}>
        <span>Your quote</span>
        <span className="num">{money(sampleQuote.standard.total)}</span>
        <ChevronUp size={18} aria-hidden />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Your quote">
        <dl className="lines lines-review">
          <div><dt>Vehicle</dt><dd>2019 Toyota RAV4 <button type="button" className="link-btn change-link">Change<span className="sr-only"> vehicle</span></button></dd></div>
          <div><dt>Service</dt><dd>Brake pads, front axle <button type="button" className="link-btn change-link">Change<span className="sr-only"> service</span></button></dd></div>
          <div className="lines-total"><dt>Total</dt><dd className="num">{money(sampleQuote.standard.total)}</dd></div>
        </dl>
        <p className="small muted">Pay after the job. Price held until Thu, Oct 29.</p>
      </Sheet>
    </>
  )
}
function DemoReceipt() {
  const [b, setB] = useState(sampleBooking)
  return (
    <Receipt
      booking={b}
      finding={finding}
      onPay={async () => {
        await new Promise((r) => setTimeout(r, 600))
        setB((x) => ({ ...x, paid: true, paidAt: new Date().toISOString() }))
      }}
    />
  )
}
function DemoWarranty() {
  const { brand } = useBrand()
  return (
    <div className="stack-sm">
      <WarrantyCard originBrand={brand} currentBrand={brand} service="pads-rotors" axle="front" endDate={inDays(500)} status="active" onReport={() => {}} />
      <WarrantyCard originBrand={brand} currentBrand={brand} service="pads" axle="both" endDate={inDays(30)} status="expiring" onReport={() => {}} />
      <WarrantyCard originBrand={brand} currentBrand={brand} service="fluid" endDate={inDays(-90)} status="expired" />
      <WarrantyCard originBrand="nubrakes" currentBrand="valvoline" service="pads-rotors" axle="front" endDate={inDays(500)} status="active" onReport={() => {}} />
    </div>
  )
}

// Type ramp, read from the shape tokens of the current brand and direction.
const TYPE_ROWS = [
  ['Display XL', 'display-xl', 'display-xl-size', 'display-xl-leading'],
  ['Display L', 'display-lg', 'display-lg-size', '1.04'],
  ['Display M', 'display-md', 'display-md-size', '1.04'],
  ['Display S', 'display-sm', 'display-sm-size', '1.1'],
  ['Display XS', 'display-xs', 'display-xs-size', '1.15'],
]

function TypeTable({ brand, style }) {
  const t = shapeFor(brand, style)
  const family = (f) => f.split(',')[0].replace(/'/g, '').replace(' Variable', '')
  return (
    <div className="table-scroll" role="region" aria-label="Type ramp" tabIndex={0}>
      <table className="token-table type-table">
        <thead>
          <tr><th scope="col">Style</th><th scope="col">Specimen</th><th scope="col">Family</th><th scope="col">Size</th><th scope="col">Line height</th><th scope="col">Tracking</th><th scope="col">Case</th></tr>
        </thead>
        <tbody>
          {TYPE_ROWS.map(([name, cls, size, lead]) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td><span className={`${cls} type-spec`}>Brakes</span></td>
              <td>{family(t['font-display'])}, wdth {t['display-wdth']}, {t['display-wght']}</td>
              <td><code>{t[size]}</code></td>
              <td><code>{t[lead] || lead}</code></td>
              <td><code>{t['display-track']}</code></td>
              <td>{t['display-case'] === 'uppercase' ? 'Upper' : 'Sentence'}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">Body</th>
            <td><span className="type-body">Brakes fixed where you park.</span></td>
            <td>{family(t['font-body'])}</td>
            <td><code>16px</code></td>
            <td><code>{style === 'v2' ? '1.5' : '1.55'}</code></td>
            <td><code>0</code></td>
            <td>Sentence</td>
          </tr>
          <tr>
            <th scope="row">Button</th>
            <td><span className="btn btn-primary btn-sm type-btn">Book</span></td>
            <td>{family(t['font-body'])}, {t['button-wght']}</td>
            <td><code>{brand === 'valvoline' ? '14px' : '15px'}</code></td>
            <td><code>1</code></td>
            <td><code>{t['button-track']}</code></td>
            <td>{t['button-case'] === 'uppercase' ? 'Upper' : 'Sentence'}</td>
          </tr>
          <tr>
            <th scope="row">Figures</th>
            <td><span className="num type-num">$289.50</span></td>
            <td>{family(t['font-mono'])}, tabular</td>
            <td><code>inherit</code></td>
            <td><code>inherit</code></td>
            <td><code>{style === 'v2' ? '-0.01em' : '0'}</code></td>
            <td>n/a</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ContrastTable({ scheme }) {
  return (
    <div className="table-scroll" role="region" aria-label="Contrast checks" tabIndex={0}>
      <table className="token-table">
        <thead>
          <tr><th scope="col">Text on fill</th>{BRANDS.map((b) => <th scope="col" key={b}>{BRAND_META[b].name}, {scheme}</th>)}</tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((pair) => (
            <tr key={pair.join('/')}>
              <th scope="row"><code>{pair[0]}</code> on <code>{pair[1]}</code></th>
              {BRANDS.map((b) => {
                const r = contrastFor(b, scheme, pair)
                return <td key={b}><span className="num">{r.toFixed(2)}:1</span> <span className={r >= 4.5 ? 'ok' : 'field-error'}>{r >= 4.5 ? 'Pass AA' : 'Below 4.5'}</span></td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Specimen({ brand, style }) {
  const [axle, setAxle] = useState('front')
  return (
    <div className="specimen stack-md">
      <Wordmark brand={brand} />
      <p className="spec-h">Brakes fixed where you park.</p>
      <p className="muted">Body text in {style === 'v2' ? 'IBM Plex Sans' : 'Public Sans'}. Same size, weight and line height in both brands.</p>
      <div className="row-actions">
        <Button size="sm">Book</Button>
        <Button size="sm" variant="secondary">Reschedule</Button>
        <Button size="sm" variant="ghost">Back</Button>
        <Button size="sm" variant="danger">Cancel visit</Button>
      </div>
      <Field label="Mobile number" error="Enter a 10-digit mobile number">
        {(a) => <Input {...a} defaultValue="(512) 555-01" />}
      </Field>
      <div className="choice-grid">
        <Choice name={`axle-${brand}`} value="front" checked={axle === 'front'} onChange={setAxle} title="Front" />
        <Choice name={`axle-${brand}`} value="rear" checked={axle === 'rear'} onChange={setAxle} title="Rear" />
      </div>
      <Alert tone="warning" title="Apartment lot">Some complexes ban repairs. Check your lease.</Alert>
      <TechnicianCard tech={tech} status="en_route" eta={14} window="10 am to 12 pm" />
      <StatusTimeline status="working" />
    </div>
  )
}

// Before and after for the Valvoline selected-vs-error fix. "Before" re-points the selected tokens at
// accent-soft and forces a filled danger button, so both panes use the same components.
function SelectedFix({ scheme, style }) {
  const t = semantic.valvoline[scheme]
  const pane = (label, before) => (
    <figure className="fix-pane stack-sm">
      <figcaption className="field-label">{label}</figcaption>
      <BrandScope
        brand="valvoline"
        scheme={scheme}
        style={style}
        className="compare-pane stack-sm"
        dangerStyle={before ? 'filled' : undefined}
        vars={before ? { '--c-selected-bg': t['accent-soft'], '--c-selected-line': t.ink } : undefined}
      >
        <Choice name={`fix-${label}`} value="front" checked onChange={() => {}} title="Front axle" />
        <Field label="Mobile number" error="Enter a 10-digit mobile number">
          {(a) => <Input {...a} defaultValue="(512) 555-01" />}
        </Field>
        <div className="row-actions">
          <Button size="sm">Book</Button>
          <Button size="sm" variant="danger">Cancel visit</Button>
        </div>
      </BrandScope>
    </figure>
  )
  return (
    <div className="stack-sm note-anchor">
      <UXNote id="selected-state" className="uxnote-corner" />
      <div className="fix-pair">
        {pane('Before', true)}
        {pane('After', false)}
      </div>
      <p className="small muted">
        Red fill now only means the main action. Before, a chosen option and a field with an error were both pale red and
        the cancel button matched Book. After, selection is navy, errors keep a deeper red with an icon and text, and
        cancel is an outline.
      </p>
    </div>
  )
}

function download() {
  const blob = new Blob([JSON.stringify(toDTCG(), null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'brake-service-tokens.json'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export default function System() {
  const { scheme: appScheme, style, brand } = useBrand()
  const [scheme, setScheme] = useState(appScheme)

  return (
    <>
      <section className="section">
        <div className="wrap stack-lg">
          <div className="page-head">
            <h1 className="display-lg">One component set, two brands</h1>
            <p className="lede">
              Every screen in this prototype is built once. NuBrakes and Valvoline are token sets on top of the same components,
              each with light and dark. Switching brand changes values, never markup.
            </p>
            <div className="row-actions">
              <Button icon={Download} onClick={download}>Download tokens (JSON)</Button>
            </div>
            <p className="small muted">Colour values are placeholders until the Valvoline design system file is shared. The structure is what carries over.</p>
          </div>

          <div className="tiers" aria-label="Token tiers">
            <div>
              <p className="tier-name">Core</p>
              <p className="muted small">Raw brand values. Components never read these.</p>
              <code>valvoline/red-600</code>
            </div>
            <ArrowRight aria-hidden className="tier-arrow" />
            <div>
              <p className="tier-name">Semantic</p>
              <p className="muted small">Roles. One Figma collection, four modes: NuBrakes light and dark, Valvoline light and dark.</p>
              <code>color/accent</code>
            </div>
            <ArrowRight aria-hidden className="tier-arrow" />
            <div>
              <p className="tier-name">Component</p>
              <p className="muted small">Only where brands truly differ: button case, control radius, display width.</p>
              <code>button/primary/bg</code>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-sunken" aria-labelledby="compare-title">
        <div className="wrap stack-md">
          <div className="compare-head">
            <h2 id="compare-title" className="display-md">Same components, side by side</h2>
            <Segmented size="sm" label="Scheme for comparison" value={scheme} onChange={setScheme} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
          </div>
          <div className="compare">
            {BRANDS.map((b) => (
              <BrandScope key={b} brand={b} scheme={scheme} style={style} className="compare-pane" aria-label={`${BRAND_META[b].name} ${scheme}`}>
                <Specimen brand={b} style={style} />
              </BrandScope>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tokens-title">
        <div className="wrap stack-md">
          <h2 id="tokens-title" className="display-md">Semantic colour tokens, {scheme}</h2>
          <div className="table-scroll" role="region" aria-label="Colour tokens" tabIndex={0}>
            <table className="token-table">
              <thead>
                <tr><th scope="col">Token</th>{BRANDS.map((b) => <th scope="col" key={b}>{BRAND_META[b].name}</th>)}<th scope="col">Use</th></tr>
              </thead>
              <tbody>
                {Object.keys(SEMANTIC_DOCS).map((k) => (
                  <tr key={k}>
                    <th scope="row"><code>color/{k}</code></th>
                    {BRANDS.map((b) => (
                      <td key={b}><span className="swatch" style={{ background: semantic[b][scheme][k] }} aria-hidden /> <code>{semantic[b][scheme][k]}</code></td>
                    ))}
                    <td className="muted small">{SEMANTIC_DOCS[k]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="display-sm">Contrast, {scheme}</h2>
          <p className="muted">Computed from the tokens with the WCAG 2 formula. Tints with transparency are measured over the page background.</p>
          <ContrastTable scheme={scheme} />

          <h2 className="display-sm">Selected is not an error</h2>
          <SelectedFix scheme={scheme} style={style} />

          <h2 className="display-sm">Type, {BRAND_META[brand].name}, {STYLE_META[style].name} {STYLE_META[style].label.toLowerCase()}</h2>
          <TypeTable brand={brand} style={style} />

          <h2 className="display-sm">Type, shape and space tokens, {STYLE_META[style].name} {STYLE_META[style].label.toLowerCase()}</h2>
          <div className="table-scroll" role="region" aria-label="Type and shape tokens" tabIndex={0}>
            <table className="token-table">
              <thead><tr><th scope="col">Token</th>{BRANDS.map((b) => <th scope="col" key={b}>{BRAND_META[b].name}</th>)}</tr></thead>
              <tbody>
                {Object.keys(shapeFor('nubrakes', style)).map((k) => (
                  <tr key={k}>
                    <th scope="row"><code>{k}</code></th>
                    {BRANDS.map((b) => <td key={b}><code>{shapeFor(b, style)[k]}</code></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section-sunken" aria-labelledby="new-title">
        <div className="wrap stack-lg">
          <div className="page-head">
            <h2 id="new-title" className="display-md">Proposed components for mobile service</h2>
            <p className="muted">Gaps a shop-based system does not cover. Each one is built from existing primitives and themes with the tokens above. Shown in the current brand.</p>
          </div>
          {PROPOSED.map((p) => (
            <article key={p.name} className="proposed">
              <div className="proposed-text">
                <h3 className="proposed-name"><code>{p.name}</code></h3>
                <p className="muted">{p.why}</p>
              </div>
              <div className="proposed-demo">{p.demo()}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="states-title">
        <div className="wrap stack-md">
          <h2 id="states-title" className="display-md">Loading, empty and error</h2>
          <p className="muted">Every data surface has all three. In the live flows, turn on Slow network or Errors in the Prototype panel.</p>
          <div className="states">
            <div><p className="field-label">Loading</p><QuoteBreakdown status="loading" service="pads" /></div>
            <div><p className="field-label">Error, with retry and nothing lost</p><QuoteBreakdown status="error" service="pads" onRetry={() => {}} /></div>
            <div>
              <p className="field-label">Empty</p>
              <Empty icon={CalendarPlus} title="No visits yet" action={<Button size="sm">Get a quote</Button>}>Once you book, the visit shows up here.</Empty>
            </div>
            <div>
              <p className="field-label">Out of area</p>
              <Empty icon={MapPinOff} title="We are not in 73301 yet">Leave an email and we will tell you when we arrive.</Empty>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-sunken" aria-labelledby="handoff-title">
        <div className="wrap split">
          <div className="split-side">
            <h2 id="handoff-title" className="display-md">Handoff</h2>
          </div>
          <div className="stack-md">
            <ul className="dash-list">
              <li>Figma: one Semantic collection with four modes. Frames switch brand by changing the mode, not by swapping components.</li>
              <li>Code: tokens become CSS variables on a brand scope element. Components read only <code>--c-*</code> and shape variables.</li>
              <li>Component props match Figma properties one to one (<code>variant</code>, <code>size</code>, <code>loading</code>, <code>tone</code>).</li>
              <li>Every interactive component has hover, focus-visible, disabled and error states. Text pairs are checked in the contrast table above for each mode.</li>
              <li>Motion is limited to state changes and turns off with reduced motion.</li>
            </ul>
            <p className="muted">The token download above is in W3C DTCG format with <code>$type</code> wherever DTCG defines one (colour, dimension, font family, weight, shadow) and semantic colours as aliases of core colours, ready for Tokens Studio or Style Dictionary.</p>
            <div className="table-scroll" role="region" aria-label="Figma component properties" tabIndex={0}>
              <table className="token-table figma-table">
                <thead><tr><th scope="col">Component</th><th scope="col">Variants</th><th scope="col">Other properties</th><th scope="col">Used on</th></tr></thead>
                <tbody>
                  {COMPONENTS.map(([c, v, o, routes]) => (
                    <tr key={c}>
                      <th scope="row"><code>{c}</code></th>
                      <td>{v}</td>
                      <td className="muted">{o}</td>
                      <td>{routes.map((to) => <Link key={to} to={to} className="text-link small">{to}</Link>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
