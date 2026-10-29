import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { ANSWERS, SUGGEST, match, answerOf } from '../data/ask.js'
import { DECISIONS, LOG } from '../data/ai.js'
import { MTD, OCTOBER, clientOf, idr } from '../data/world.js'
import { AiTag, Pill, useToast, Toast } from '../ui/kit.jsx'
import { Bars, MonthLine } from '../ui/charts.jsx'
import * as I from '../ui/icons.js'

// Where the assistant is opened from decides what it starts with.
function useContextKey() {
  const loc = useLocation()
  const { role } = useStore()
  if (loc.pathname.startsWith('/stock/')) return 'product'
  if (loc.pathname.startsWith('/clients/')) return 'client'
  if (loc.pathname.startsWith('/decisions')) return 'decisions'
  return role.id
}
const CONTEXT_LABEL = { owner: 'Today across the group', manager: 'Plaza Senayan today', advisor: 'Your day', product: 'This piece', client: 'This client', decisions: 'Decisions' }

export function AskBox({ context, placeholder }) {
  const { dispatch } = useStore()
  const [q, setQ] = useState('')
  const send = (text, id) => { const a = id ? answerOf(id) : match(text); dispatch({ type: 'ask', q: text, answer: a?.id || null, panel: true }); setQ('') }
  return (
    <div className="askbox">
      <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) send(q.trim()) }}>
        <I.SparkLg className="askbox-icon" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Ask Selvedge" />
        <button className="btn is-sm" type="submit" disabled={!q.trim()}>Ask</button>
      </form>
      <div className="chips" aria-label="Suggested questions">
        {SUGGEST[context].slice(0, 3).map((id) => { const a = answerOf(id); return <button key={id} className="chip" onClick={() => send(a.q, id)}>{a.q}</button> })}
      </div>
    </div>
  )
}

export function AskPanel() {
  const { s, dispatch } = useStore()
  const ctx = useContextKey()
  if (!s.panel) return null
  return (
    <aside className="panel" aria-label="Ask Selvedge">
      <div className="panel-head">
        <span className="ai-tag"><I.Spark />Ask Selvedge</span>
        <span className="ctx">Looking at: {CONTEXT_LABEL[ctx]}</span>
        <Link to="/ask" className="btn is-quiet is-sm" onClick={() => dispatch({ type: 'panel', open: false })} aria-label="Open as a page"><I.Panel /></Link>
        <button className="btn is-quiet is-sm" onClick={() => dispatch({ type: 'panel', open: false })} aria-label="Close"><I.Close /></button>
      </div>
      <Thread ctx={ctx} />
    </aside>
  )
}

export default function AskPage() {
  const { dispatch } = useStore()
  useEffect(() => { dispatch({ type: 'panel', open: false }) }, [dispatch])
  return (
    <div className="page ask-page">
      <header className="title-row"><div><h1>Ask</h1><p>Questions about the business, the stock or a client, answered from the live data, with the sources and the next step.</p></div></header>
      <div className="ask-grid">
        <div className="card ask-card"><Thread ctx="owner" page /></div>
        <aside className="card ask-side">
          <h2 className="h3">What Selvedge can and cannot do</h2>
          <ul className="can">
            <li><I.Check /> Answer from sales, stock, clients, staffing and the store handbook</li>
            <li><I.Check /> Prepare transfers, holds and reorders for someone to approve</li>
            <li><I.Check /> Draft messages to clients in the advisor’s voice</li>
            <li><I.Check /> Show you how on the screen</li>
            <li className="no"><I.Close /> Send anything to a client</li>
            <li className="no"><I.Close /> Change a price, or raise its own limits</li>
            <li className="no"><I.Close /> See what your role cannot see</li>
          </ul>
          <p className="muted small">Every answer lists what it looked at. Figures come from the books, never from memory.</p>
        </aside>
      </div>
    </div>
  )
}

function Thread({ ctx, page }) {
  const { s, dispatch } = useStore()
  const [q, setQ] = useState('')
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }) }, [s.thread.length])
  const send = (text, id) => { const a = id ? answerOf(id) : match(text); dispatch({ type: 'ask', q: text, answer: a?.id || null }); setQ('') }
  return (
    <div className={`thread ${page ? 'is-page' : ''}`}>
      <div className="thread-body">
        {!s.thread.length && (
          <div className="thread-empty">
            <p>Ask in your own words. I answer from the live data and show where each figure comes from.</p>
            <div className="chips is-stack">{SUGGEST[ctx].map((id) => <button key={id} className="chip" onClick={() => send(answerOf(id).q, id)}>{answerOf(id).q}</button>)}</div>
          </div>
        )}
        {s.thread.map((t, i) => <Turn key={t.key} turn={t} last={i === s.thread.length - 1} onAsk={send} ctx={ctx} />)}
        <div ref={end} />
      </div>
      <form className="composer" onSubmit={(e) => { e.preventDefault(); if (q.trim()) send(q.trim()) }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything" aria-label="Your question" />
        <button className="btn is-primary is-sm" type="submit" disabled={!q.trim()} aria-label="Send"><I.Send /></button>
      </form>
      {s.thread.length > 0 && <button className="link-btn" onClick={() => dispatch({ type: 'clearThread' })}>Start over</button>}
    </div>
  )
}

function Turn({ turn, last, onAsk, ctx }) {
  const a = turn.answer ? answerOf(turn.answer) : null
  const [stage, setStage] = useState(last ? 0 : 99)
  useEffect(() => {
    if (!last || !a) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setStage(99); return }
    const steps = a.looked.length
    let k = 0
    const id = setInterval(() => { k += 1; setStage(k); if (k > steps) clearInterval(id) }, 380)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="turn">
      <p className="q">{turn.q}</p>
      {!a ? (
        <div className="a ai">
          <p>I can’t answer that from the data in this prototype. These are the questions it holds:</p>
          <div className="chips is-stack">{ANSWERS.slice(0, 5).map((x) => <button key={x.id} className="chip" onClick={() => onAsk(x.q, x.id)}>{x.q}</button>)}</div>
        </div>
      ) : (
        <div className="a ai">
          <ul className="looked" aria-label="What Selvedge looked at">
            {a.looked.map((l, i) => <li key={l} className={stage > i ? 'is-done' : stage === i ? 'is-now' : ''}>{stage > i ? <I.Check /> : <I.Sync className={stage === i ? 'spin' : ''} />}{l}</li>)}
          </ul>
          {stage > a.looked.length - 1 && (
            <div className="a-body">
              {a.blocks.map((b, i) => <Block key={i} b={b} />)}
              {a.sources.length > 0 && <AiTag text="Answered by Selvedge" sources={a.sources} />}
              <div className="follow">{(SUGGEST[ctx] || []).filter((id) => id !== a.id).slice(0, 2).map((id) => <button key={id} className="chip" onClick={() => onAsk(answerOf(id).q, id)}>{answerOf(id).q}</button>)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Block({ b }) {
  const { s, dispatch } = useStore()
  const nav = useNavigate()
  const [toast, show] = useToast()
  if (b.t === 'p') return <p>{b.text}</p>
  if (b.t === 'bars') return <figure className="a-fig"><figcaption>{b.title}</figcaption><Bars data={b.data} unit={b.unit} mark={b.mark} markLabel={b.markLabel} height={150} label={b.title} /></figure>
  if (b.t === 'month') return <figure className="a-fig"><figcaption>October, running total against plan</figcaption><MonthLine days={OCTOBER} fmt={(v, long) => (long ? idr(v) : v >= 1e9 ? `${(v / 1e9).toFixed(0)}B` : '0')} endLabel={`Near ${idr(MTD.landing)}`} /></figure>
  if (b.t === 'table') return (
    <div className="a-table"><table className="tbl is-compact"><thead><tr>{b.head.map((h, i) => <th key={h} className={b.num?.includes(i) ? 'num' : ''}>{h}</th>)}</tr></thead>
      <tbody>{b.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={b.num?.includes(i) ? 'num' : ''}>{c}</td>)}</tr>)}</tbody></table></div>
  )
  if (b.t === 'steps') return <ol className="a-steps">{b.items.map((x, i) => <li key={i}><span className="num">{i + 1}</span>{x}</li>)}</ol>
  if (b.t === 'decision') {
    const d = DECISIONS.find((x) => x.id === b.id)
    const st = s.decided[d.id]?.status
    return (
      <div className="a-card">
        <span className="cell-2"><b>{d.title}</b><small>{d.id} · {d.asks}</small></span>
        {st ? <Pill tone={st === 'approved' ? 'pos' : ''}>{st === 'approved' ? 'Approved' : st === 'declined' ? 'Declined' : 'Edited'}</Pill> : <button className="btn is-sm is-primary" onClick={() => { dispatch({ type: 'panel', open: false }); nav(`/decisions/${d.id}`) }}>Review</button>}
      </div>
    )
  }
  if (b.t === 'draft') {
    const c = clientOf(b.to)
    return (
      <div className="a-draft">
        <p className="draft-head"><span>Draft to {c.name}, by {b.via}</span><Pill tone="ai">Not sent</Pill></p>
        <p className="draft-text">{b.text}</p>
        <div className="row-acts">
          <button className="btn is-sm" onClick={() => { try { navigator.clipboard?.writeText(b.text) } catch { /* ignore */ } show('Copied. Paste it into WhatsApp and send it yourself.') }}><I.Copy /> Copy</button>
          <button className="btn is-sm is-quiet" onClick={() => show('In the product, this opens the draft for editing.')}><I.Edit /> Edit</button>
        </div>
        <Toast toast={toast} />
      </div>
    )
  }
  if (b.t === 'guide') return <button className="btn is-sm" onClick={() => { dispatch({ type: 'panel', open: false }); dispatch({ type: 'guide', guide: { id: b.id, step: 0 } }); nav('/stock/laras-mini') }}><I.Eye /> {b.label}</button>
  if (b.t === 'log') return (
    <ul className="a-log">{LOG.filter((l) => l.kind === 'act').map((l) => <li key={l.id}><span className="num muted">{l.when}</span><span>{l.what}</span></li>)}</ul>
  )
  if (b.t === 'limit') return <p className="a-limit"><I.Lock /> {b.text}</p>
  return null
}
