import { useState } from 'react'
import { Link } from 'react-router-dom'
import UilRedo from '@iconscout/react-unicons/icons/uil-redo'
import { useStore } from '../store.jsx'
import { MONTHS, PLATFORM_INCOME, BRANDS, TAX, AGENCY, TODAY, rp, rpShort, fmtDay, fmtMonth, relDay, daysBetween, paymentsOf, cashByMonth } from '../data/studio.js'
import { Logo, Pill } from '../ui.jsx'

// Slips the brands sent for PPh 23 withheld. Lumbung Pay's deposit slip has not come.
const SLIPS = { 'RT-2588-0': false }

export default function Money() {
  const { deals } = useStore()
  const months = cashByMonth()
  const oct = months[4]; const sep = months[3]
  const pays = deals.flatMap((d) => paymentsOf(d).map((p, i) => ({ ...p, idx: i })))
  const [tab, setTab] = useState('due')
  const [sync, setSync] = useState('error')
  const list = pays.filter((p) => (tab === 'due' ? p.state !== 'paid' : p.state === 'paid')).sort((a, b) => (tab === 'due' ? a.due.localeCompare(b.due) : (b.paid || '').localeCompare(a.paid || '')))
  const ytdTax = months.reduce((t, m) => t + m.tax, 0)
  const ytdCut = months.reduce((t, m) => t + m.cut, 0)
  const best = months.reduce((a, b) => (b.takeHome > a.takeHome ? b : a))
  const change = oct.takeHome - sep.takeHome
  const streams = [
    { name: 'Brand deals, after tax and Riuh', v: oct.brandNet },
    ...Object.values(PLATFORM_INCOME).map((x) => ({ name: x.name, v: x.values[4] })),
  ].sort((a, b) => b.v - a.v)
  const top = streams[0].v
  const paid = pays.filter((p) => p.state === 'paid')
  return (
    <>
      <div className="title-row">
        <div>
          <h1>Money</h1>
          <p className="sub"><b>{fmtMonth(best.month) === 'Oct' ? 'October' : fmtMonth(best.month)} was your best month: {rp(best.takeHome)} take-home</b>, {rp(change)} more than September. Figures are what reached you, after {TAX.name} and Riuh’s {Math.round(AGENCY.commission * 100)}%.</p>
        </div>
      </div>

      <dl className="kpis" style={{ marginTop: 24 }}>
        <div><dt>Take-home, October</dt><dd className="lead-fig">{rp(oct.takeHome)}</dd><p className="kpi-note"><span style={{ color: 'var(--positive)' }}>+{rp(change)}</span> on September</p></div>
        <div><dt>Brand deals billed, October</dt><dd>{rp(oct.brandGross)}</dd><p className="kpi-note">before tax and Riuh</p></div>
        <div><dt>{TAX.name} withheld since June</dt><dd>{rp(ytdTax)}</dd><p className="kpi-note">a credit on your annual return</p></div>
        <div><dt>Riuh’s share since June</dt><dd>{rp(ytdCut)}</dd><p className="kpi-note">{Math.round(AGENCY.commission * 100)}% of brand deals only</p></div>
      </dl>

      <div className="grid">
        <section className="panel span-8" aria-labelledby="ch-h">
          <div className="panel-head"><h2 id="ch-h">Take-home by month</h2><span className="legend"><span><i className="sw you" />Brand deals</span><span><i className="sw riuh" />Platforms</span></span></div>
          <MonthChart months={months} />
          <p className="small muted" style={{ marginTop: 8 }}>November so far: brand payments for November are still due. See them below.</p>
        </section>
        <section className="panel span-4" aria-labelledby="st-h">
          <div className="panel-head"><h2 id="st-h">October by stream</h2></div>
          <ul style={{ display: 'grid', gap: 14 }}>
            {streams.map((x, i) => (
              <li key={x.name}>
                <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><span>{x.name}</span><span className="num" style={{ fontWeight: i === 0 ? 600 : 400 }}>{rp(x.v)}</span></span>
                <span style={{ display: 'block', height: 2, marginTop: 6, width: `${(x.v / top) * 100}%`, background: i === 0 ? 'var(--accent)' : 'var(--control)' }} />
              </li>
            ))}
          </ul>
          {sync === 'error' ? (
            <div className="err" style={{ marginTop: 16, flexWrap: 'wrap' }}><span>Couldn’t load TikTok Shop payouts for November. Last updated 2 Nov, 21:00.</span><button className="btn sm" onClick={() => { setSync('loading'); setTimeout(() => setSync('ok'), 900) }}><UilRedo size={14} />Retry</button></div>
          ) : sync === 'loading' ? <p className="small muted" style={{ marginTop: 16 }} aria-live="polite">Loading TikTok Shop payouts…</p>
            : <p className="small muted" style={{ marginTop: 16 }} aria-live="polite">TikTok Shop synced just now. {rp(PLATFORM_INCOME.affiliate.values[5])} so far in November.</p>}
        </section>

        <section className="panel span-12" aria-labelledby="py-h">
          <div className="panel-head">
            <h2 id="py-h">Brand payments</h2>
            <div className="seg" role="tablist" aria-label="Payments">{[['due', 'Still due'], ['paid', 'Received']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l} <span className="muted">{pays.filter((p) => (k === 'due' ? p.state !== 'paid' : p.state === 'paid')).length}</span></button>)}</div>
          </div>
          <div className="table-wrap">
            <table className="t">
              <thead><tr><th>Brand</th><th>Payment</th><th className="r">{tab === 'due' ? 'Due' : 'Received'}</th><th className="r">Brand pays</th><th className="r">{TAX.name}</th><th className="r">Riuh</th><th className="r">To you</th><th className="r">Status</th></tr></thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.deal.id + p.label}>
                    <td><Link to={`/deals/${p.deal.id}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Logo brand={p.deal.brand} size={28} /><span><b style={{ fontWeight: 600 }}>{BRANDS[p.deal.brand].name}</b><span className="muted" style={{ display: 'block', fontSize: 12 }}>{p.deal.title}</span></span></Link></td>
                    <td className="muted">{p.label}</td>
                    <td className="r num">{fmtDay(p.paid || p.due)}</td>
                    <td className="r num">{rp(p.gross)}</td>
                    <td className="r num muted">{rp(p.tax)}</td>
                    <td className="r num muted">{rp(p.cut)}</td>
                    <td className="r num"><b style={{ fontWeight: 600 }}>{rp(p.net)}</b></td>
                    <td className="r"><Pill tone={p.state === 'paid' ? 'pos' : p.state === 'late' ? 'neg' : ''}>{p.state === 'paid' ? 'Received' : p.state === 'late' ? `${p.lateBy} days late` : daysBetween(TODAY, p.due) <= 7 ? 'Due soon' : 'Scheduled'}</Pill></td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan={3} style={{ fontWeight: 600, paddingTop: 12 }}>{tab === 'due' ? 'Still due' : 'Received'}</td><td className="r num" style={{ paddingTop: 12 }}>{rp(list.reduce((t, p) => t + p.gross, 0))}</td><td className="r num muted" style={{ paddingTop: 12 }}>{rp(list.reduce((t, p) => t + p.tax, 0))}</td><td className="r num muted" style={{ paddingTop: 12 }}>{rp(list.reduce((t, p) => t + p.cut, 0))}</td><td className="r num" style={{ paddingTop: 12, fontWeight: 600 }}>{rp(list.reduce((t, p) => t + p.net, 0))}</td><td /></tr></tfoot>
            </table>
          </div>
        </section>

        <section className="panel span-12" aria-labelledby="sl-h">
          <div className="panel-head"><h2 id="sl-h">Withholding slips</h2><span className="meta">Keep these for your annual tax return (SPT)</span></div>
          <ul className="slips">
            {paid.map((p) => {
              const ok = SLIPS[`${p.deal.id}-${p.idx}`] !== false
              return (
                <li key={p.deal.id + p.label}>
                  <Logo brand={p.deal.brand} size={28} />
                  <span><b>{BRANDS[p.deal.brand].name}</b><span className="muted"> · {p.label} · {rp(p.tax)} withheld</span></span>
                  {ok ? <Pill tone="pos">Slip received</Pill> : <Pill tone="warn">Slip missing</Pill>}
                </li>
              )
            })}
          </ul>
          <p className="small muted" style={{ marginTop: 10 }}>{TAX.note}</p>
        </section>
      </div>
    </>
  )
}

// Columns per month: brand take-home in the hue, platforms in its pale tint, the current month marked as so far.
function MonthChart({ months }) {
  const W = 720; const H = 250; const pad = { l: 56, r: 8, t: 12, b: 28 }
  const max = Math.ceil(Math.max(...months.map((m) => m.takeHome)) / 20000000) * 20000000
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f)
  const bw = (W - pad.l - pad.r) / months.length
  const y = (v) => pad.t + (1 - v / max) * (H - pad.t - pad.b)
  const [hover, setHover] = useState(null)
  return (
    <div className="chart-scroll">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Take-home per month: ${months.map((m) => `${fmtMonth(m.month)} ${rp(m.takeHome)}`).join(', ')}`}>
        {ticks.map((t) => <g key={t}><line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" /><text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">{t ? rpShort(t) : 'Rp0'}</text></g>)}
        {months.map((m, i) => {
          const x = pad.l + i * bw + bw * 0.22; const w = bw * 0.56
          const now = i === months.length - 1
          return (
            <g key={m.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
              <rect x={x} y={y(m.brandNet)} width={w} height={Math.max(0, y(0) - y(m.brandNet))} fill="var(--accent)" opacity={now ? 0.5 : 1} />
              <rect x={x} y={y(m.takeHome)} width={w} height={Math.max(0, y(m.brandNet) - y(m.takeHome) - (m.brandNet ? 2 : 0))} fill="var(--accent-track)" />
              <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="12" fill={now ? 'var(--text)' : 'var(--muted)'} fontWeight={now ? 600 : 400}>{fmtMonth(m.month)}{now ? ' so far' : ''}</text>
              {hover === i && <text x={x + w / 2} y={y(m.takeHome) - 8} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text)">{rp(m.takeHome)}</text>}
            </g>
          )
        })}
        <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke="var(--control)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
