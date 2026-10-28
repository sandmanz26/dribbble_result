import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ChartLine, Dashboard, Money, Warning } from '@carbon/icons-react'
import { usePrices, useStore } from '../store.jsx'
import Shell from '../ui/Shell.jsx'
import Chart from '../ui/Chart.jsx'
import Sessions from '../ui/Sessions.jsx'
import { INSTRUMENTS, byId, fmt, signedUsd, usd } from '../data/market.js'
import { CLIENT, balances, margin, pnl } from '../data/account.js'

const ITEMS = [
  ['/client', 'Overview', Dashboard, true],
  ['/client/trades', 'Trade history', ChartLine],
  ['/client/funds', 'Deposits and withdrawals', Money],
]
const STATUS = { Completed: 'ok', 'In review': 'wait', Rejected: 'bad', Cancelled: '' }
const day = (iso) => new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const sideOf = (p) => (p.side === 'Buy' ? 'bid' : 'ask')

// Live account figures: equity moves with the demo prices; every total comes from the rows.
function useAccount() {
  const { s } = useStore()
  const { price } = usePrices()
  const isNew = s.who === 'new'
  const funds = isNew ? [] : s.funds
  const open = isNew ? [] : s.open
  const closed = isNew ? [] : s.closed
  const b = balances(funds, closed)
  const quote = (p) => { const ins = byId[p.ins]; const mid = price(p.ins); const half = (ins.spread * ins.pip) / 2; return p.side === 'Buy' ? mid - half : mid + half }
  const rows = open.map((p) => { const now = quote(p); return { ...p, now, pnl: pnl(p.ins, p.side, p.lots, p.open, now), margin: margin(p, now) } })
  const floating = rows.reduce((a, r) => a + r.pnl, 0)
  const used = rows.reduce((a, r) => a + r.margin, 0)
  const equity = b.balance + floating
  const free = equity - used
  const withdrawable = Math.max(0, Math.min(b.balance - b.held, free - b.held))
  return { s, isNew, funds, rows, closed, b, floating, used, equity, free, withdrawable, name: isNew ? s.signup?.name : CLIENT.name }
}

function Overview() {
  const a = useAccount()
  const { set, notify } = useStore()
  const { series, price, change } = usePrices()
  const [watch, setWatch] = useState('XAUUSD')
  const pending = a.funds.filter((f) => f.status === 'In review')
  const best = [...a.rows].sort((x, y) => Math.abs(y.pnl) - Math.abs(x.pnl))[0]
  const close = (r) => {
    const t = { id: r.id, opened: r.opened, closed: new Date().toISOString().slice(0, 16).replace('T', ' '), ins: r.ins, side: r.side, lots: r.lots, open: r.open, close: r.now, pnl: Math.round(r.pnl * 100) / 100 }
    set((c) => ({ open: c.open.filter((p) => p.id !== r.id), closed: [...c.closed, t] }))
    notify({ text: `Closed ${byId[r.ins].name} at ${fmt(r.ins, r.now)}, ${signedUsd(t.pnl)}.`, undo: () => set((c) => ({ open: [...c.open, a.s.open.find((p) => p.id === r.id)], closed: c.closed.filter((x) => x.id !== r.id) })) })
  }
  return (
    <>
      <div className="titlerow">
        <div>
          <h1>{a.name}’s account</h1>
          <p className="finding">
            {a.isNew ? 'Your identity check is in review. Deposits open once it is done.'
              : <>Equity {usd(a.equity)}.{best ? <> Your {byId[best.ins].name} trade is {best.pnl >= 0 ? 'up' : 'down'} {usd(Math.abs(best.pnl))}.</> : ''}{pending.length ? <> {usd(pending[0].amount, 0)} withdrawal in review.</> : ''}</>}
          </p>
        </div>
        <span className="stamp">Demo prices, updating every 1.5 s</span>
      </div>
      {a.isNew && <p className="notice"><Warning size={16} />We are checking your documents. Most checks are done within one business day.</p>}

      <section className="card" aria-label="Account summary">
        <div className="kpis">
          <div><small>Equity</small><b className="num big">{usd(a.equity)}</b><span className="num">{a.rows.length ? <>Open trades <span className={a.floating >= 0 ? 'pos' : 'neg'}>{signedUsd(a.floating)}</span> now</> : 'No open trades'}</span></div>
          <div><small>Balance</small><b className="num">{usd(a.b.balance)}</b><span className="num">{signedUsd(a.b.realised)} from closed trades</span></div>
          <div><small>Used as margin</small><b className="num">{usd(a.used)}</b><span>Leverage {CLIENT.leverage}</span></div>
          <div><small>Free to withdraw</small><b className="num">{usd(a.withdrawable)}</b><span className="num">{a.b.held ? `${usd(a.b.held, 0)} held for a withdrawal` : 'Nothing held'}</span></div>
        </div>
      </section>

      <div className="grid2 fill">
        <div className="col">
          <section className="card" aria-labelledby="op-h">
            <div className="card-h"><h2 id="op-h">Open trades</h2><span className="stamp num">{a.rows.length}</span></div>
            {a.rows.length === 0 ? <p className="empty">No open trades. Positions you open appear here with their profit as it moves.</p> : (
              <div className="wrap"><table className="tbl">
                <thead><tr><th>Market</th><th className="r">Size</th><th className="r">Entry</th><th className="r">Now ({a.rows.length > 1 ? 'bid or ask' : sideOf(a.rows[0])})</th><th className="r">Stop</th><th className="r">Target</th><th className="r">Margin</th><th className="r">Profit</th><th /></tr></thead>
                <tbody>{a.rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.side} {byId[r.ins].name}<span className="sub">{r.id} · {day(r.opened)}</span></td>
                    <td className="r">{r.lots.toFixed(2)} lot</td>
                    <td className="r">{fmt(r.ins, r.open)}</td>
                    <td className="r">{fmt(r.ins, r.now)}</td>
                    <td className="r">{fmt(r.ins, r.stop)}</td>
                    <td className="r">{fmt(r.ins, r.target)}</td>
                    <td className="r">{usd(r.margin)}</td>
                    <td className={`r ${r.pnl >= 0 ? 'pos' : 'neg'}`}>{signedUsd(r.pnl)}</td>
                    <td className="r"><button className="abtn" onClick={() => close(r)}>Close</button></td>
                  </tr>
                ))}</tbody>
                <tfoot><tr><td colSpan={6} className="dash">Total</td><td className="r">{usd(a.used)}</td><td className={`r ${a.floating >= 0 ? 'pos' : 'neg'}`}>{signedUsd(a.floating)}</td><td /></tr></tfoot>
              </table></div>
            )}
          </section>
          <section className="card grow" aria-labelledby="ch-h">
            <div className="card-h"><h2 id="ch-h">{byId[watch].name}, last 8 hours</h2><span className="stamp num">{fmt(watch, price(watch))} · demo, UTC</span></div>
            <Chart id={watch} data={series[watch].slice(-96)} height="fill" />
          </section>
        </div>
        <div className="col">
          <section className="card" aria-labelledby="wl-h">
            <div className="card-h"><h2 id="wl-h">Markets</h2><span className="stamp">Change since 00:00 UTC</span></div>
            <ul className="watch">{INSTRUMENTS.map((i) => {
              const ch = change(i.id)
              return (
                <li key={i.id} className={watch === i.id ? 'on' : ''}>
                  <button onClick={() => setWatch(i.id)} aria-pressed={watch === i.id}>
                    <span className="nm">{i.name}</span>
                    <span className="px">{fmt(i.id, price(i.id))}<small>{ch >= 0 ? '+' : '−'}{Math.abs(ch * 100).toFixed(2)}%</small></span>
                  </button>
                </li>
              )
            })}</ul>
          </section>
          <section className="card" aria-label="Trading sessions"><Sessions compact /></section>
        </div>
      </div>
    </>
  )
}

const KINDS = ['All', 'Forex', 'Metals', 'Crypto']
function Trades() {
  const a = useAccount()
  const [kind, setKind] = useState('All')
  const list = [...a.closed].reverse().filter((t) => kind === 'All' || byId[t.ins].kind === kind)
  const total = list.reduce((x, t) => x + t.pnl, 0)
  const wins = list.filter((t) => t.pnl > 0).length
  const byMarket = Object.entries(list.reduce((m, t) => ({ ...m, [t.ins]: Math.round(((m[t.ins] || 0) + t.pnl) * 100) / 100 }), {})).sort((x, y) => y[1] - x[1])
  const maxAbs = Math.max(1, ...byMarket.map(([, v]) => Math.abs(v)))
  return (
    <>
      <div className="titlerow"><div><h1>Trade history</h1><p>{list.length ? `${list.length} closed trades, ${wins} in profit. Net ${signedUsd(total)}.` : 'No closed trades in this view.'}</p></div></div>
      <div className="tabs" role="tablist">{KINDS.map((k) => <button key={k} role="tab" aria-selected={kind === k} onClick={() => setKind(k)}>{k}<span className="count">{k === 'All' ? a.closed.length : a.closed.filter((t) => byId[t.ins].kind === k).length}</span></button>)}</div>
      <section className="card">
        {list.length === 0 ? <p className="empty">{a.isNew ? 'You have not closed a trade yet.' : 'No closed trades in this group.'}</p> : (
          <div className="wrap"><table className="tbl">
            <thead><tr><th>Market</th><th>Opened</th><th>Closed</th><th className="r">Size</th><th className="r">Entry</th><th className="r">Exit</th><th className="r">Profit</th></tr></thead>
            <tbody>{list.map((t) => (
              <tr key={t.id}>
                <td>{t.side} {byId[t.ins].name}<span className="sub">{t.id}</span></td>
                <td>{t.opened}</td><td>{t.closed}</td>
                <td className="r">{t.lots.toFixed(2)} lot</td>
                <td className="r">{fmt(t.ins, t.open)}</td>
                <td className="r">{fmt(t.ins, t.close)}</td>
                <td className={`r ${t.pnl >= 0 ? 'pos' : 'neg'}`}>{signedUsd(t.pnl)}</td>
              </tr>
            ))}</tbody>
            <tfoot><tr><td colSpan={6} className="dash">Net for this view</td><td className={`r ${total >= 0 ? 'pos' : 'neg'}`}>{signedUsd(total)}</td></tr></tfoot>
          </table></div>
        )}
      </section>
      {byMarket.length > 0 && (
        <section className="card" aria-labelledby="bm-h">
          <div className="card-h"><h2 id="bm-h">Result by market</h2><span className="stamp">Sum of the closed trades above</span></div>
          <ul className="bars">{byMarket.map(([id, v]) => (
            <li key={id}>
              <span>{byId[id].name}</span>
              <span className="bar-track" aria-hidden="true"><i className={v >= 0 ? 'up' : 'down'} style={{ width: `${(Math.abs(v) / maxAbs) * 50}%`, [v >= 0 ? 'left' : 'right']: '50%' }} /></span>
              <span className={`r ${v >= 0 ? 'pos' : 'neg'}`}>{signedUsd(v)}</span>
            </li>
          ))}</ul>
        </section>
      )}
    </>
  )
}

const METHODS = ['Card ending 4417', 'Bank transfer, Sparkasse ending 0932']
function Funds() {
  const a = useAccount()
  const { set, notify } = useStore()
  const [dep, setDep] = useState({ amount: '', method: METHODS[0] })
  const [wd, setWd] = useState({ amount: '' })
  const [err, setErr] = useState({})
  const today = '2026-10-28'
  const nextId = (p) => `${p}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  const deposit = (e) => {
    e.preventDefault()
    const n = Number(dep.amount)
    if (a.isNew) { setErr({ dep: 'Deposits open once your identity check is done.' }); return }
    if (!(n >= 50)) { setErr({ dep: 'The smallest deposit is $50.' }); return }
    if (n > 20000) { setErr({ dep: 'For more than $20,000 in one go, contact support first.' }); return }
    const row = { id: nextId('D'), date: today, kind: 'Deposit', method: dep.method, amount: Math.round(n * 100) / 100, status: 'Completed' }
    set((c) => ({ funds: [...c.funds, row] }))
    setErr({}); setDep({ ...dep, amount: '' })
    notify({ text: `${usd(row.amount)} added from ${dep.method.toLowerCase()}.` })
  }
  const withdraw = (e) => {
    e.preventDefault()
    const n = Number(wd.amount)
    if (!(n >= 20)) { setErr({ wd: 'The smallest withdrawal is $20.' }); return }
    if (n > a.withdrawable) { setErr({ wd: `You can withdraw up to ${usd(a.withdrawable)} right now. Money used as margin for open trades stays in the account.` }); return }
    const row = { id: nextId('W'), date: today, kind: 'Withdrawal', method: METHODS[1], amount: Math.round(n * 100) / 100, status: 'In review' }
    set((c) => ({ funds: [...c.funds, row] }))
    setErr({}); setWd({ amount: '' })
    notify({ text: `Withdrawal of ${usd(row.amount)} requested. A person checks it, usually within one business day.` })
  }
  const cancel = (id) => set((c) => ({ funds: c.funds.map((f) => (f.id === id ? { ...f, status: 'Cancelled' } : f)) }))
  const list = [...a.funds].reverse()
  return (
    <>
      <div className="titlerow"><div><h1>Deposits and withdrawals</h1><p>Money goes back to where it came from: the card or bank account you paid in with.</p></div></div>
      <div className="grid2 even">
        <form className="card" onSubmit={deposit} noValidate aria-labelledby="dp-h">
          <div className="card-h"><h2 id="dp-h">Add money</h2><span className="stamp">No GlobalTrade fee</span></div>
          <div style={{ display: 'grid', gap: 12 }}>
            <label className={`afield ${err.dep ? 'bad' : ''}`}>Amount in USD<input inputMode="decimal" placeholder="500" value={dep.amount} onChange={(e) => setDep({ ...dep, amount: e.target.value })} />{err.dep && <span className="err">{err.dep}</span>}</label>
            <label className="afield">From<select value={dep.method} onChange={(e) => setDep({ ...dep, method: e.target.value })}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></label>
            <button className="abtn primary" style={{ justifySelf: 'start' }}>Add money</button>
          </div>
        </form>
        <form className="card" onSubmit={withdraw} noValidate aria-labelledby="wd-h">
          <div className="card-h"><h2 id="wd-h">Withdraw</h2><span className="stamp num">Up to {usd(a.withdrawable)}</span></div>
          <div style={{ display: 'grid', gap: 12 }}>
            <label className={`afield ${err.wd ? 'bad' : ''}`}>Amount in USD<input inputMode="decimal" placeholder="200" value={wd.amount} onChange={(e) => setWd({ amount: e.target.value })} disabled={a.isNew} />{err.wd && <span className="err">{err.wd}</span>}</label>
            <p className="afield"><span>To</span><span style={{ color: 'var(--ink)', fontSize: 15 }}>{a.isNew ? 'Available after your first deposit' : METHODS[1]}</span></p>
            <button className="abtn primary" style={{ justifySelf: 'start' }} disabled={a.isNew}>Request withdrawal</button>
          </div>
        </form>
      </div>
      <section className="card" aria-labelledby="hs-h">
        <div className="card-h"><h2 id="hs-h">History</h2><span className="stamp num">In {usd(a.b.dep)} · Out {usd(a.b.wd)}</span></div>
        {list.length === 0 ? <p className="empty">No payments yet. Your first deposit will show here.</p> : (
          <div className="wrap"><table className="tbl">
            <thead><tr><th>Date</th><th>Type</th><th>Method</th><th>Status</th><th className="r">Amount</th><th /></tr></thead>
            <tbody>{list.map((f) => (
              <tr key={f.id}>
                <td>{f.date}<span className="sub">{f.id}</span></td>
                <td>{f.kind}</td>
                <td>{f.method}</td>
                <td><span className={`st ${STATUS[f.status] ?? ''}`}>{f.status}</span></td>
                <td className="r">{f.kind === 'Deposit' ? '+' : '−'}{usd(f.amount)}</td>
                <td className="r">{f.status === 'In review' && f.kind === 'Withdrawal' ? <button className="abtn quiet" onClick={() => cancel(f.id)}>Cancel</button> : null}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
      <p className="stamp">Need help with a payment? Write to <a href="mailto:support@globaltrade.example?subject=Payment%20question">support@globaltrade.example</a> with the reference shown under the date.</p>
    </>
  )
}

export default function Client() {
  return (
    <Shell items={ITEMS} label="Client area">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="trades" element={<Trades />} />
        <Route path="funds" element={<Funds />} />
      </Routes>
    </Shell>
  )
}
