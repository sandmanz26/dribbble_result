import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UilPlus from '@iconscout/react-unicons/icons/uil-plus'
import UilMinus from '@iconscout/react-unicons/icons/uil-minus'
import UilCopy from '@iconscout/react-unicons/icons/uil-copy'
import UilExclamationTriangle from '@iconscout/react-unicons/icons/uil-exclamation-triangle'
import UilArrowLeft from '@iconscout/react-unicons/icons/uil-arrow-left'
import { useStore } from '../store.jsx'
import { OFFERS, FORMATS, BRANDS, NOW, priceOf, rp, fmtDay } from '../data/studio.js'
import { Logo, Pill } from '../ui.jsx'
import { verdictFrom, ratesFrom } from '../logic.js'

const ago = (iso) => { const h = Math.round((NOW - new Date(`${iso}:00+07:00`)) / 3600000); return h < 1 ? 'Just now' : h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago` }
const roundUp = (v) => Math.ceil(v / 500000) * 500000

export default function Offers() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s } = useStore()
  const [tab, setTab] = useState('new')
  const list = OFFERS.filter((o) => (tab === 'new' ? !s.offers[o.id] : !!s.offers[o.id]))
  const current = OFFERS.find((o) => o.id === id) || (window.matchMedia('(min-width: 1101px)').matches ? list[0] : null)
  return (
    <>
      <div className="title-row">
        <div>
          <h1>Offers</h1>
          <p className="sub">Every brand request from email, WhatsApp, DMs and the Riuh inbox, checked against your rate card and your exclusivity before you answer.</p>
        </div>
      </div>
      <div className={`inbox${id ? ' has-detail' : ''}`}>
        <section className="panel inbox-list" aria-labelledby="ol-h">
          <h2 id="ol-h" className="sr-only">Offer list</h2>
          <div className="seg" role="tablist" aria-label="Offers">
            {[['new', 'To answer'], ['done', 'Answered']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l} <span className="muted">{OFFERS.filter((o) => (k === 'new' ? !s.offers[o.id] : !!s.offers[o.id])).length}</span></button>)}
          </div>
          <ul className="rows" style={{ marginTop: 8 }}>
            {list.map((o) => {
              const v = verdictFrom(o, priceOf(o, ratesFrom(s.rates)))
              return (
                <li key={o.id}>
                  <Link to={`/offers/${o.id}`} className={`offer-row${current?.id === o.id ? ' sel' : ''}`} aria-current={current?.id === o.id ? 'true' : undefined}>
                    <Logo name={o.brand} hue={o.hue} size={36} />
                    <span className="o-main"><b>{o.brand}</b><span>{o.message}</span><span className="o-meta"><Pill tone={v.tone}>{v.short}</Pill>{s.offers[o.id] && <Pill>{s.offers[o.id] === 'accepted' ? 'With Bima' : 'Declined'}</Pill>}</span></span>
                    <span className="o-side num"><b>{o.budget ? rp(o.budget) : '-'}</b><span className="muted">{ago(o.received)}</span></span>
                  </Link>
                </li>
              )
            })}
          </ul>
          {!list.length && <p className="empty" style={{ marginTop: 8 }}>{tab === 'new' ? 'All caught up. New offers collect here from every channel.' : 'Nothing answered yet.'}</p>}
        </section>
        {current ? <OfferDetail key={current.id} o={current} onBack={() => nav('/offers')} /> : <section className="panel inbox-detail empty-pane"><p className="muted">Choose an offer to check it.</p></section>}
      </div>
    </>
  )
}

function Stepper({ value, onChange, min = 0, max = 9, label }) {
  return (
    <span className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`}><UilMinus size={16} /></button>
      <span className="num" aria-live="polite">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}><UilPlus size={16} /></button>
    </span>
  )
}

function OfferDetail({ o, onBack }) {
  const { s, dispatch } = useStore()
  const [asks, setAsks] = useState(() => Object.fromEntries(Object.keys(FORMATS).map((k) => [k, o.asks.find(([f]) => f === k)?.[1] || 0])))
  const [usage, setUsage] = useState(o.usage)
  const [excl, setExcl] = useState(o.exclusivityMonths)
  const [wl, setWl] = useState(o.whitelisting)
  const [copied, setCopied] = useState(false)
  const shown = Object.keys(FORMATS).filter((k) => asks[k] > 0 || o.asks.some(([f]) => f === k))
  const [adding, setAdding] = useState(false)
  const offer = { ...o, asks: Object.entries(asks).filter(([, n]) => n > 0), usage, exclusivityMonths: excl, whitelisting: wl }
  const price = priceOf(offer, ratesFrom(s.rates))
  const v = verdictFrom(offer, price)
  const counter = roundUp(price.total)
  const max = Math.max(price.total, o.budget || 0) * 1.08
  const reply = useMemo(() => {
    const first = o.from.split(' ')[0]
    const items = offer.asks.map(([f, n]) => `${n} ${FORMATS[f].name}`).join(', ')
    if (v.clash) return `Hi ${first}, thank you for thinking of Kirana! She has a ${o.category.toLowerCase()} exclusivity until ${fmtDay(v.clash.until)}, so she can't post for another ${o.category.toLowerCase()} brand before then. Could the campaign go live after ${fmtDay(v.clash.until)}? For ${items}, her rate is ${rp(counter)}. Best, Bima (Riuh Talent)`
    if (o.budget == null) return `Hi ${first}, thanks for reaching out! For ${items}, Kirana's rate is ${rp(counter)}. Her media kit is attached with her audience and past partners. Best, Bima (Riuh Talent)`
    if (v.diff <= -0.1) return `Hi ${first}, thanks for the offer, Kirana would love to work with you. For ${items}${usage ? ` with ${usage} months of paid usage` : ''}, her rate is ${rp(counter)}. Happy to adjust the scope to fit ${rp(o.budget)}, for example by dropping the paid usage. Best, Bima (Riuh Talent)`
    return `Hi ${first}, great to hear from you! ${rp(o.budget)} works for ${items}. We'll send the contract today, with a 50% deposit and the rest 7 days after the insight report. Best, Bima (Riuh Talent)`
  }, [o, v, counter, usage, offer.asks])
  useEffect(() => { setCopied(false) }, [reply])
  const status = s.offers[o.id]
  return (
    <section className="panel inbox-detail" aria-labelledby="od-h">
      <button className="btn ghost sm back" onClick={onBack}><UilArrowLeft size={16} />All offers</button>
      <div className="od-head">
        <Logo name={o.brand} hue={o.hue} size={44} />
        <div><h2 id="od-h">{o.brand}</h2><p className="muted">{o.from} · {o.channel} · {ago(o.received)} · {o.category}</p></div>
        <Pill tone={v.tone}>{v.short}</Pill>
      </div>
      <blockquote className="bubble">{o.message}</blockquote>

      <div className="od-grid">
        <div>
          <h3 className="h3">What they asked</h3>
          <ul className="asks">
            {shown.map((k) => (
              <li key={k}><span>{FORMATS[k].name}<span className="muted num"> · {rp(s.rates[k])} each</span></span><Stepper value={asks[k]} onChange={(n) => setAsks({ ...asks, [k]: n })} label={FORMATS[k].name} /></li>
            ))}
          </ul>
          {adding ? (
            <div className="menu" style={{ position: 'static', marginTop: 8, boxShadow: 'none' }}>
              {Object.keys(FORMATS).filter((k) => !shown.includes(k)).map((k) => <button key={k} onClick={() => { setAsks({ ...asks, [k]: 1 }); setAdding(false) }}>{FORMATS[k].name}<span className="muted num" style={{ marginLeft: 'auto' }}>{rp(s.rates[k])}</span></button>)}
            </div>
          ) : <button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => setAdding(true)}><UilPlus size={16} />Add a format</button>}
          <h3 className="h3" style={{ marginTop: 20 }}>Terms</h3>
          <ul className="asks">
            <li><span>Paid ads usage <span className="muted">· +30% per 3 months</span></span><span className="stepper"><button onClick={() => setUsage(Math.max(0, usage - 3))} disabled={!usage} aria-label="Less usage"><UilMinus size={16} /></button><span className="num">{usage} mo</span><button onClick={() => setUsage(Math.min(12, usage + 3))} aria-label="More usage"><UilPlus size={16} /></button></span></li>
            <li><span>Category exclusivity <span className="muted">· +15% a month</span></span><Stepper value={excl} onChange={setExcl} max={6} label="months of exclusivity" /></li>
            <li><span>Whitelisting <span className="muted">· +40% on short videos</span></span><button className={`toggle${wl ? ' on' : ''}`} role="switch" aria-checked={wl} aria-label="Whitelisting" onClick={() => setWl(!wl)}><span /></button></li>
          </ul>
          <p className="small muted" style={{ marginTop: 10 }}>{o.postBy ? `They want it live by ${fmtDay(o.postBy)}.` : 'No date given yet.'}</p>
        </div>

        <div>
          <h3 className="h3">Your rate for this</h3>
          <dl className="lines">
            {price.lines.map((l) => <div key={l.label}><dt>{l.label}</dt><dd className="num">{rp(l.amount)}</dd></div>)}
            <div className="total"><dt>Rate card total</dt><dd className="num">{rp(price.total)}</dd></div>
          </dl>
          <div className="bullet" role="img" aria-label={`Their budget ${o.budget ? rp(o.budget) : 'not given'} against your rate ${rp(price.total)}`}>
            {o.budget != null && <span className={`fill ${v.tone}`} style={{ width: `${(o.budget / max) * 100}%` }} />}
            <span className="tick" style={{ left: `${(price.total / max) * 100}%` }} />
          </div>
          <p className="small" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><span>Their budget <b className="num">{o.budget ? rp(o.budget) : '-'}</b></span><span className="muted">Line: your rate</span></p>
          {v.clash && (
            <div className="err" style={{ marginTop: 14, alignItems: 'flex-start' }}>
              <UilExclamationTriangle size={18} style={{ flex: 'none', marginTop: 1 }} />
              <span>{v.text}. Posting on {fmtDay(o.postBy)} would break the contract. <Link className="link" to={`/deals/${v.clash.deal.id}`}>See the deal</Link></span>
            </div>
          )}
          <p style={{ marginTop: 14 }}><b>{v.clash ? 'Ask to move the date, then counter' : v.diff != null && v.diff <= -0.005 ? `Counter at ${rp(counter)}` : o.budget == null ? `Quote ${rp(counter)}` : 'Accept as offered'}</b></p>
        </div>
      </div>

      <h3 className="h3" style={{ marginTop: 22 }}>Reply, written for you</h3>
      <textarea className="reply" defaultValue={reply} key={reply} aria-label="Reply draft" rows={4} />
      <div className="od-actions">
        <button className="btn" onClick={async () => { try { await navigator.clipboard.writeText(reply) } catch { /* blocked */ } setCopied(true) }}><UilCopy size={16} />{copied ? 'Copied' : 'Copy reply'}</button>
        <span style={{ flex: 1 }} />
        <button className="btn ghost" disabled={!!status} onClick={() => dispatch({ type: 'offer', id: o.id, status: 'declined', toast: `${o.brand} declined. Bima will send a polite no.` })}>Decline</button>
        <button className="btn primary" disabled={!!status} onClick={() => dispatch({ type: 'offer', id: o.id, status: 'accepted', toast: `Sent to Bima. He opens a deal once ${o.brand} replies.` })}>{status === 'accepted' ? 'Sent to Bima' : 'Send to Bima'}</button>
      </div>
    </section>
  )
}
