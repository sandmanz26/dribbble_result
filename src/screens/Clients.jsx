import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { CLIENTS, PEOPLE, APPOINTMENTS, clientOf, productOf, placeName, idr } from '../data/world.js'
import { AiTag, ClientAvatar, Photo, Pill, Toast, useToast } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

// The next thing to do for a client, as Selvedge sees it.
export function nextFor(c) {
  if (c.hold) return { text: `Hold on the ${productOf(c.hold.item).name} ends ${c.hold.until.toLowerCase()}`, tone: 'warn' }
  if (c.alteration) return { text: 'Alteration ready, collecting at 16:30', tone: 'pos' }
  const appt = APPOINTMENTS.find((a) => a.client === c.id)
  if (appt) return { text: `In today at ${appt.time}`, tone: '' }
  if (c.visits === 1) return { text: 'Thank-you note due this week', tone: '' }
  if (c.waitlist) return { text: `Waiting for the ${productOf(c.waitlist.item).name} since ${c.waitlist.since}`, tone: '' }
  return { text: '-', tone: '' }
}

// A draft in the advisor's voice. Never sent by Selvedge.
export function draftFor(c) {
  const adv = PEOPLE[c.advisor]?.short || 'your advisor'
  const first = c.name.split(' ')[0]
  if (c.hold) return `Hello Ibu ${first}, a gentle reminder that the ${productOf(c.hold.item).name} in ${productOf(c.hold.item).variant.toLowerCase()} is held for you at Plaza Senayan until 17:00 today. If it suits you better, I can keep it until Saturday when you visit. ${adv}`
  if (c.alteration) return `Hello Ibu ${first}, your officer coat is ready, with the hem taken up 3 cm as we discussed. See you at 16:30 today; I will have it pressed and waiting. ${adv}`
  if (c.visits === 1) return `Hello Ibu ${first}, I hope the wedding was lovely and the slip dress felt right. The blush tweed jacket has just arrived, and I thought of you. No rush at all; I am here whenever you would like to see it. ${adv}`
  if (c.id === 'anindya') return `Good morning, Ibu Anindya. See you at 11:00 today. Alongside the new season pieces, I would love to show you the Arunika in slate box calf, very close to what you described in August. I have set the viewing room aside for us. ${adv}`
  return `Hello ${c.id === 'rizal' || c.id === 'kevin' ? 'Bapak' : 'Ibu'} ${first}, a few new season pieces arrived that I think you would like. Would you like me to set them aside for a visit? ${adv}`
}

export default function Clients() {
  const { role, me } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const scope = role.id === 'owner' ? CLIENTS : role.id === 'manager' ? CLIENTS.filter((c) => c.store === 'psn') : CLIENTS.filter((c) => c.advisor === 'sekar' || APPOINTMENTS.some((a) => a.client === c.id && (a.with === 'sekar' || a.also === 'sekar')))
  const rows = scope.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="page">
      <header className="title-row">
        <div><h1>{role.id === 'advisor' ? 'Your clients' : 'Clients'}</h1><p>{role.id === 'owner' ? `Top clients across the group: ${scope.length} shown.` : role.id === 'manager' ? `Plaza Senayan’s client book: ${scope.length} shown.` : `${scope.length} clients you look after or see today, ${me.short}.`} Every conversation stays here, not on personal phones.</p></div>
      </header>
      <div className="toolbar"><label className="search"><I.Search /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients" aria-label="Search clients" /></label></div>
      <section className="card is-flush" aria-label="Clients">
        <table className="tbl">
          <thead><tr><th>Client</th><th>Advisor</th><th>Boutique</th><th className="num">Spend, 12 months</th><th className="num">Last visit</th><th>Next</th></tr></thead>
          <tbody>
            {rows.map((c) => {
              const n = nextFor(c)
              return (
                <tr key={c.id} className="is-link" onClick={() => nav(`/clients/${c.id}`)}>
                  <td><span className="with-ph"><ClientAvatar client={c} size="sm" /><span className="cell-2"><Link to={`/clients/${c.id}`} onClick={(e) => e.stopPropagation()}>{c.name}</Link><small>{c.tier} · client since {c.since}</small></span></span></td>
                  <td>{PEOPLE[c.advisor]?.short}</td>
                  <td>{placeName(c.store)}</td>
                  <td className="num">{idr(c.spend)}</td>
                  <td className="num">{c.last}</td>
                  <td>{n.tone ? <Pill tone={n.tone}>{n.text}</Pill> : <span className={n.text === '-' ? 'muted' : ''}>{n.text}</span>}</td>
                </tr>
              )
            })}
            {!rows.length && <tr><td colSpan={6} className="empty-row">No client matches “{q}”.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export function Client() {
  const { id } = useParams()
  const { dispatch } = useStore()
  const [toast, show] = useToast()
  const c = clientOf(id)
  if (!c) return <div className="page"><h1>Client not found</h1><Link className="link" to="/clients">Back to clients</Link></div>
  const appt = APPOINTMENTS.find((a) => a.client === c.id)
  const suggest = suggestionsFor(c)
  return (
    <div className="page">
      <nav className="crumbs"><Link to="/clients">Clients</Link><I.Right /><span>{c.name}</span></nav>
      <header className="obj-head card">
        <ClientAvatar client={c} size="lg" />
        <div className="obj-main">
          <h1>{c.name}</h1>
          <p className="muted">{c.tier} · client since {c.since} · {placeName(c.store)} · advisor {PEOPLE[c.advisor]?.name}</p>
        </div>
        <dl className="obj-figs">
          <div><dt>Spend, 12 months</dt><dd className="num">{idr(c.spend)}</dd></div>
          <div><dt>Visits</dt><dd className="num">{c.visits}</dd></div>
          <div><dt>Last visit</dt><dd className="num">{c.last}</dd></div>
        </dl>
      </header>

      <div className="grid">
        <section className="card ai s7" aria-labelledby="h-before">
          <div className="card-head"><h2 id="h-before">{appt ? `Before ${appt.time} today` : 'What to know'}</h2><AiTag text="Briefing by Selvedge" sources={['Purchases', 'Advisor notes', 'Holds and waitlists', 'Message history']} /></div>
          <ul className="brief-points">
            {c.hold && <li><b>Hold ends {c.hold.until.toLowerCase()}.</b> {productOf(c.hold.item).name}, placed {c.hold.placed}. A reminder is drafted below.</li>}
            {c.alteration && <li><b>{c.alteration}.</b> Check the hem with her before she leaves.</li>}
            {c.waitlist && <li><b>Waiting for the {productOf(c.waitlist.item).name}</b> since {c.waitlist.since}{c.waitlist.gift ? `, a gift: ${c.waitlist.gift}` : ''}. Allocation is decided by Ratna, so do not promise one.</li>}
            <li><b>Likes</b> {c.likes.toLowerCase()}. <b>Sizes</b> {c.sizes.toLowerCase()}.</li>
            {c.note && <li>{c.note}</li>}
          </ul>
          {suggest.length > 0 && <div className="suggest"><span className="muted small">Pieces to show, in stock here</span><div className="suggest-row">{suggest.map((p) => <Link key={p.id} to={`/stock/${p.id}`} className="suggest-item"><Photo id={p.id} size="sm" /><span className="cell-2">{p.name}<small>{p.variant}</small></span></Link>)}</div></div>}
        </section>
        <section className="card s5" aria-labelledby="h-draft">
          <div className="card-head"><h2 id="h-draft">Message</h2><Pill tone="ai">Drafted, not sent</Pill></div>
          <p className="draft-text">{draftFor(c)}</p>
          <div className="row-acts">
            <button className="btn is-primary is-sm" onClick={() => show(`In the product this opens WhatsApp with the draft. ${PEOPLE[c.advisor]?.short} sends it.`)}>Open in WhatsApp</button>
            <button className="btn is-sm" onClick={() => { try { navigator.clipboard?.writeText(draftFor(c)) } catch { /* ignore */ } show('Copied.') }}><I.Copy /> Copy</button>
            <button className="btn is-sm is-quiet" onClick={() => dispatch({ type: 'ask', q: `Draft a message to ${c.name.split(' ')[0]}`, answer: c.id === 'anindya' ? 'draft' : null, panel: true })}><I.Ask /> Rewrite</button>
          </div>
          <p className="muted small">Contact by {c.contact}. Consent recorded {c.since}.</p>
        </section>
        <section className="card s12" aria-labelledby="h-owns">
          <div className="card-head"><h2 id="h-owns">Bought</h2><span className="meta">{c.owns.length} pieces shown</span></div>
          <ul className="owns-grid">
            {c.owns.map((pid) => { const p = productOf(pid); return <li key={pid}><Link to={`/stock/${pid}`}><Photo id={pid} size="lg" /><span className="cell-2">{p.name}<small>{p.variant} · {idr(p.price)}</small></span></Link></li> })}
          </ul>
        </section>
      </div>
      <Toast toast={toast} />
    </div>
  )
}

function suggestionsFor(c) {
  const map = { anindya: ['arunika-structured', 'kirana-top-handle', 'tirta-pump-rosso'], wulan: ['laras-mini', 'card-holder'], nadia: ['tweed-jacket', 'plaid-scarf'], ayu: ['tweed-jacket', 'plaid-scarf'], rizal: ['pearl-collar', 'pendant', 'plaid-scarf'], dewi: ['aruna-boot', 'gending-sandal', 'envelope-wallet'] }
  return (map[c.id] || []).map(productOf)
}
