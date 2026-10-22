import { useState } from 'react'
import { ArrowRight, CalendarPlus, Download, MapPinOff } from 'lucide-react'
import { BrandScope, useBrand } from '../brand/BrandContext.jsx'
import { BRAND_META, BRANDS, SEMANTIC_DOCS, STYLE_META, semantic, shapeFor, toDTCG } from '../brand/tokens.js'
import { priceQuote } from '../data/services.js'
import { TECHNICIANS } from '../data/schedule.js'
import {
  ApprovalRequest, ArrivalWindowPicker, QuoteBreakdown, ServiceAreaCheck, StatusTimeline, TechnicianCard, VehicleChip,
} from '../service/index.jsx'
import { Alert, Button, Choice, Empty, Field, Input, Segmented, Wordmark } from '../ui/index.jsx'

const sampleQuote = {
  standard: priceQuote({ service: 'pads', axle: 'front', size: 'suv', tier: 'standard' }),
  premium: priceQuote({ service: 'pads', axle: 'front', size: 'suv', tier: 'premium' }),
}
const sampleVehicle = { year: 2019, make: 'Toyota', model: 'RAV4' }
const tech = TECHNICIANS.austin[0]
const finding = { title: 'Front rotors below minimum thickness', reading: 'Measured 25.1 mm. Minimum is 26.0 mm.', why: 'New pads on thin rotors can shake and wear out early.', price: 210 }

const FIGMA = [
  ['Button', 'variant: primary, secondary, ghost, danger', 'size: sm, md, lg. state: default, hover, focus, disabled, loading. icon start/end'],
  ['Field', 'state: default, focus, error, disabled', 'label, hint, error text, optional'],
  ['Choice / Check', 'checked, disabled', 'title, detail, aside slot'],
  ['Alert', 'tone: info, success, warning, danger', 'title, body, action slot'],
  ['ServiceAreaCheck', 'state: idle, checking, in area, out of area, waitlist sent, error', 'ZIP prefilled'],
  ['ArrivalWindowPicker', 'state: loading, open, last spot, full day, closed day, error', 'selected day, selected window'],
  ['QuoteBreakdown', 'status: loading, ready, error', 'tiers on/off, per axle or per visit'],
  ['TechnicianCard', 'status: assigned, on the way, working, done', 'ETA, van'],
  ['StatusTimeline', 'step: booked to done', ''],
  ['ApprovalRequest', 'state: pending, sending, approved, declined', 'reading, reason, price'],
]

const PROPOSED = [
  { name: 'ServiceAreaCheck', why: 'A shop system never has to say "we do not come to you". Covers in area, out of area with a waitlist, invalid ZIP and lookup error.', demo: () => <ServiceAreaCheck initialZip="73301" /> },
  { name: 'ArrivalWindowPicker', why: 'Mobile service sells a window, not a slot at a bay. Day strip plus windows, with closed day, fully booked day, last spot and load error.', demo: () => <DemoPicker /> },
  { name: 'VehicleChip', why: 'The vehicle drives price, so it stays visible and editable through the flow.', demo: () => <VehicleChip vehicle={sampleVehicle} size="suv" onEdit={() => {}} /> },
  { name: 'QuoteBreakdown', why: 'Itemised parts, labor and tax with an optional parts tier. Answers "what will this cost" before contact details.', demo: () => <DemoQuote /> },
  { name: 'TechnicianCard', why: 'Someone is coming to your home. Name, credentials, vehicle to look for and live arrival status.', demo: () => <TechnicianCard tech={tech} status="en_route" eta={14} window="10 am to 12 pm" /> },
  { name: 'StatusTimeline', why: 'Booked to done in five steps, so customers do not have to call to ask where the technician is.', demo: () => <StatusTimeline status="en_route" /> },
  { name: 'ApprovalRequest', why: 'Extra work found on site is approved remotely with the measurement and price. Declining is always allowed.', demo: () => <DemoApproval /> },
]

function DemoPicker() {
  const [v, setV] = useState(null)
  return <ArrivalWindowPicker metro="austin" value={v} onChange={setV} />
}
function DemoQuote() {
  const [tier, setTier] = useState('standard')
  return <QuoteBreakdown service="pads" axle="front" quote={sampleQuote} tier={tier} onTier={setTier} />
}
function DemoApproval() {
  const [d, setD] = useState(null)
  return <ApprovalRequest finding={finding} techName="Marcus" decided={d} onDecide={setD} />
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

function download() {
  const blob = new Blob([JSON.stringify(toDTCG(), null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'brake-service-tokens.json'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export default function System() {
  const { scheme: appScheme, style } = useBrand()
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
          <Alert tone="warning" title="Found while theming: Valvoline red is both the brand accent and the obvious error colour">
            If both use the same red, customers cannot tell a primary button from an error. Proposal: errors use a deeper red, always with an icon and
            text, and never colour alone. To confirm with the Valvoline UX lead.
          </Alert>

          <h2 className="display-sm">Type and shape tokens, {STYLE_META[style].name} {STYLE_META[style].label.toLowerCase()}</h2>
          <div className="table-scroll" role="region" aria-label="Type and shape tokens" tabIndex={0}>
            <table className="token-table">
              <thead><tr><th scope="col">Token</th>{BRANDS.map((b) => <th scope="col" key={b}>{BRAND_META[b].name}</th>)}</tr></thead>
              <tbody>
                {Object.keys(shapeFor('nubrakes', style)).filter((k) => !k.startsWith('font-')).map((k) => (
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
              <li>Every interactive component has hover, focus-visible, disabled and error states. Text meets WCAG AA in all four modes.</li>
              <li>Motion is limited to state changes and turns off with reduced motion.</li>
            </ul>
            <p className="muted">The token download above is in W3C DTCG format, ready for Tokens Studio or Style Dictionary.</p>
            <div className="table-scroll" role="region" aria-label="Figma component properties" tabIndex={0}>
              <table className="token-table figma-table">
                <thead><tr><th scope="col">Component</th><th scope="col">Variants</th><th scope="col">Other properties</th></tr></thead>
                <tbody>
                  {FIGMA.map(([c, v, o]) => <tr key={c}><th scope="row"><code>{c}</code></th><td>{v}</td><td className="muted">{o}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
