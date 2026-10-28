import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, ChartLine, Dashboard, Money, Wallet, Scales, Locked } from '@carbon/icons-react'
import { usePrices, useStore } from '../store.jsx'
import Shell from '../ui/Shell.jsx'
import { INSTRUMENTS, byId, fmt, signedUsd, usd } from '../data/market.js'
import { CLIENT, balances, margin, pnl } from '../data/account.js'
import { sessionNow, SESSIONS, hhmm } from '../data/sessions.js'
import { useNow } from '../ui/Sessions.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Progress } from '@/components/ui/misc'
import { Empty, Kpi, Notice, PageHeader, PriceArea } from '@/components/dash'
import { cn } from '@/lib/utils'

const ITEMS = [
  ['/client', 'Overview', Dashboard, true],
  ['/client/trades', 'Trade history', ChartLine],
  ['/client/funds', 'Deposits and withdrawals', Money],
]
const TONE = { Completed: 'ok', 'In review': 'wait', Rejected: 'bad', Cancelled: 'neutral' }
const day = (iso) => new Date(iso.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const pct = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n * 100).toFixed(2)}%`

// Live account figures: equity moves with the demo prices; every total comes from the rows.
function useAccount() {
  const { s } = useStore()
  const { price, series } = usePrices()
  const isNew = s.who === 'new'
  const funds = isNew ? [] : s.funds
  const open = isNew ? [] : s.open
  const closed = isNew ? [] : s.closed
  const b = balances(funds, closed)
  const quoteAt = (p, mid) => { const ins = byId[p.ins]; const half = (ins.spread * ins.pip) / 2; return p.side === 'Buy' ? mid - half : mid + half }
  const rows = open.map((p) => { const now = quoteAt(p, price(p.ins)); return { ...p, now, pnl: pnl(p.ins, p.side, p.lots, p.open, now), margin: margin(p, now) } })
  const floating = rows.reduce((a, r) => a + r.pnl, 0)
  const used = rows.reduce((a, r) => a + r.margin, 0)
  const equity = b.balance + floating
  const free = equity - used
  const withdrawable = Math.max(0, Math.min(b.balance - b.held, free - b.held))
  // Equity over the last eight hours, recomputed from each open trade at each past price.
  const path = Array.from({ length: 48 }, (_, k) => {
    const i = k * 2 - 96
    return b.balance + open.reduce((a, p) => { const sr = series[p.ins]; const mid = sr[sr.length + i]?.p ?? price(p.ins); return a + pnl(p.ins, p.side, p.lots, p.open, quoteAt(p, mid)) }, 0)
  })
  return { s, isNew, funds, rows, closed, b, floating, used, equity, free, withdrawable, path, name: isNew ? s.signup?.name : CLIENT.name }
}

function Overview() {
  const a = useAccount()
  const { set, notify } = useStore()
  const { series, price, change } = usePrices()
  const [watch, setWatch] = useState('XAUUSD')
  const now = useNow(30000)
  const info = sessionNow(now)
  const pending = a.funds.filter((f) => f.status === 'In review')
  const best = [...a.rows].sort((x, y) => Math.abs(y.pnl) - Math.abs(x.pnl))[0]
  const close = (r) => {
    const t = { id: r.id, opened: r.opened, closed: new Date().toISOString().slice(0, 16).replace('T', ' '), ins: r.ins, side: r.side, lots: r.lots, open: r.open, close: r.now, pnl: Math.round(r.pnl * 100) / 100 }
    set((c) => ({ open: c.open.filter((p) => p.id !== r.id), closed: [...c.closed, t] }))
    notify({ text: `Closed ${byId[r.ins].name} at ${fmt(r.ins, r.now)}, ${signedUsd(t.pnl)}.`, undo: () => set((c) => ({ open: [...c.open, a.s.open.find((p) => p.id === r.id)], closed: c.closed.filter((x) => x.id !== r.id) })) })
  }
  const marginPct = a.equity > 0 ? (a.used / a.equity) * 100 : 0
  const wch = change(watch)
  return (
    <div className="dash-in grid gap-5">
      <PageHeader title={`${a.name}’s account`} finding={a.isNew ? 'Your identity check is in review. Deposits open once it is done.'
        : <>Equity {usd(a.equity)}.{best ? <> Your {byId[best.ins].name} trade is {best.pnl >= 0 ? 'up' : 'down'} {usd(Math.abs(best.pnl))}.</> : ''}{pending.length ? <> {usd(pending[0].amount, 0)} withdrawal in review.</> : ''}</>}>
        <Button variant="secondary" size="sm" asChild><a href="#/client/funds"><ArrowUpRight size={14} />Withdraw</a></Button>
        <Button size="sm" asChild><a href="#/client/funds"><ArrowDownLeft size={14} />Add money</a></Button>
      </PageHeader>
      {a.isNew && <Notice>We are checking your documents. Most checks are done within one business day.</Notice>}

      <section aria-label="Account summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Equity" icon={Wallet} value={usd(a.equity)} spark={a.rows.length ? a.path : null} tone={a.floating >= 0 ? 'gold' : 'neg'} sub={a.rows.length ? <>Open trades <span className={a.floating >= 0 ? 'text-positive' : 'text-destructive'}>{signedUsd(a.floating)}</span></> : 'No open trades'} />
        <Kpi label="Balance" icon={Scales} value={usd(a.b.balance)} sub={`${signedUsd(a.b.realised)} from closed trades`} />
        <Card className="p-5">
          <div className="flex items-center justify-between text-[12.5px] text-muted-foreground"><span>Used as margin</span><span className="tabular-nums">{marginPct.toFixed(0)}% of equity</span></div>
          <p className="mt-3 font-display text-[28px] font-light leading-none tracking-[-0.03em] tabular-nums">{usd(a.used)}</p>
          <Progress value={marginPct} className="mt-4" />
          <p className="mt-2.5 text-[12px] text-muted-foreground">Leverage {CLIENT.leverage}</p>
        </Card>
        <Kpi label="Free to withdraw" icon={Locked} value={usd(a.withdrawable)} sub={a.b.held ? `${usd(a.b.held, 0)} held for a withdrawal` : 'Nothing held'} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{byId[watch].name} <span className="text-muted-foreground">· {byId[watch].long}</span></CardTitle>
              <p className="mt-2 flex items-baseline gap-3"><span className="font-display text-[32px] font-light tracking-[-0.03em] tabular-nums">{fmt(watch, price(watch))}</span><span className={cn('text-[13px] tabular-nums', wch >= 0 ? 'text-positive' : 'text-destructive')}>{pct(wch)} today</span></p>
            </div>
            <Badge tone="neutral">Last 8 hours, UTC</Badge>
          </CardHeader>
          <CardContent><PriceArea id={watch} data={series[watch].slice(-96)} height={372} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Markets</CardTitle><CardDescription>Since 00:00 UTC</CardDescription></CardHeader>
          <ul className="grid grid-cols-1 p-2">{INSTRUMENTS.map((i) => {
            const ch = change(i.id)
            const on = watch === i.id
            return (
              <li key={i.id}>
                <button onClick={() => setWatch(i.id)} aria-pressed={on} className={cn('grid w-full grid-cols-[1fr_auto] items-center rounded-md px-3 py-2 text-left transition-colors hover:bg-white/[0.04]', on && 'bg-white/[0.06] ring-1 ring-inset ring-primary/30')}>
                  <span><span className="block text-[13.5px]">{i.name}</span><span className="block text-[11.5px] text-muted-foreground">{i.kind}</span></span>
                  <span className="text-right tabular-nums"><span className="block text-[13.5px]">{fmt(i.id, price(i.id))}</span><span className={cn('block text-[11.5px]', ch >= 0 ? 'text-positive' : 'text-destructive')}>{pct(ch)}</span></span>
                </button>
              </li>
            )
          })}</ul>
        </Card>
      </div>

      <div className="grid gap-5">
        <Card>
          <CardHeader><div><CardTitle>Open trades</CardTitle><CardDescription>Profit moves with the demo prices</CardDescription></div><Badge tone="gold">{a.rows.length} open</Badge></CardHeader>
          <div className="pt-4">
            {a.rows.length === 0 ? <Empty>No open trades. Positions you open appear here with their profit as it moves.</Empty> : (
              <Table>
                <TableHeader><TableRow><TableHead>Market</TableHead><TableHead className="text-right">Size</TableHead><TableHead className="text-right">Entry</TableHead><TableHead className="text-right">Now</TableHead><TableHead className="text-right">Stop</TableHead><TableHead className="text-right">Target</TableHead><TableHead className="text-right">Margin</TableHead><TableHead className="text-right">Profit</TableHead><TableHead /></TableRow></TableHeader>
                <TableBody>{a.rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell><span className="flex items-center gap-2"><Badge tone={r.side === 'Buy' ? 'ok' : 'bad'}>{r.side}</Badge>{byId[r.ins].name}</span><span className="mt-0.5 block text-[11.5px] text-muted-foreground">{r.id} · {day(r.opened)}</span></TableCell>
                    <TableCell className="text-right">{r.lots.toFixed(2)} lot</TableCell>
                    <TableCell className="text-right">{fmt(r.ins, r.open)}</TableCell>
                    <TableCell className="text-right">{fmt(r.ins, r.now)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt(r.ins, r.stop)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt(r.ins, r.target)}</TableCell>
                    <TableCell className="text-right">{usd(r.margin)}</TableCell>
                    <TableCell className={cn('text-right font-medium', r.pnl >= 0 ? 'text-positive' : 'text-destructive')}>{signedUsd(r.pnl)}</TableCell>
                    <TableCell className="text-right"><Button variant="secondary" size="sm" onClick={() => close(r)}>Close</Button></TableCell>
                  </TableRow>
                ))}</TableBody>
                <TableFooter><TableRow><TableCell colSpan={6} className="text-muted-foreground">Total</TableCell><TableCell className="text-right">{usd(a.used)}</TableCell><TableCell className={cn('text-right', a.floating >= 0 ? 'text-positive' : 'text-destructive')}>{signedUsd(a.floating)}</TableCell><TableCell /></TableRow></TableFooter>
              </Table>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Trading sessions</CardTitle><CardDescription>{info.line}</CardDescription></div></CardHeader>
          <CardContent className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2 xl:grid-cols-4">{SESSIONS.map((s) => {
            const on = info.open.includes(s)
            const left = (s.open / 24) * 100
            const w = (((s.close - s.open + 24) % 24) / 24) * 100
            return (
              <div key={s.id} className="grid gap-1.5">
                <div className="flex justify-between text-[12.5px]"><span className={on ? 'text-foreground' : 'text-muted-foreground'}>{s.city}</span><span className="tabular-nums text-muted-foreground">{hhmm(s.open)} to {hhmm(s.close)}</span></div>
                <div className="relative h-1.5 rounded-full bg-white/[0.05]">
                  <span className={cn('absolute inset-y-0 rounded-full', on ? 'bg-primary shadow-[0_0_10px_rgb(212_174_98/0.6)]' : 'bg-white/15')} style={{ left: `${left}%`, width: `${Math.min(w, 100 - left)}%` }} />
                  {left + w > 100 && <span className={cn('absolute inset-y-0 left-0 rounded-full', on ? 'bg-primary' : 'bg-white/15')} style={{ width: `${left + w - 100}%` }} />}
                  <span className="absolute -top-1 bottom-[-4px] w-px bg-foreground/70" style={{ left: `${(info.h / 24) * 100}%` }} />
                </div>
              </div>
            )
          })}</CardContent>
        </Card>
      </div>
    </div>
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
    <div className="dash-in grid gap-5">
      <PageHeader title="Trade history" finding={list.length ? `${list.length} closed trades, ${wins} in profit. Net ${signedUsd(total)}.` : 'No closed trades in this view.'}>
        <Tabs value={kind} onValueChange={setKind}>
          <TabsList>{KINDS.map((k) => <TabsTrigger key={k} value={k}>{k}<span className="text-muted-foreground tabular-nums">{k === 'All' ? a.closed.length : a.closed.filter((t) => byId[t.ins].kind === k).length}</span></TabsTrigger>)}</TabsList>
        </Tabs>
      </PageHeader>
      <section className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Net result" value={signedUsd(total)} tone={total >= 0 ? 'pos' : 'neg'} sub="For the trades in this view" spark={list.length > 1 ? [...list].reverse().reduce((acc, t) => [...acc, (acc[acc.length - 1] || 0) + t.pnl], [0]) : null} />
        <Kpi label="Trades in profit" value={list.length ? `${wins} of ${list.length}` : '0'} sub={list.length ? `${Math.round((wins / list.length) * 100)}% of closed trades` : 'Nothing closed yet'} />
        <Kpi label="Best market" value={byMarket[0] ? byId[byMarket[0][0]].name : 'None'} sub={byMarket[0] ? signedUsd(byMarket[0][1]) : 'No closed trades'} />
      </section>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader><CardTitle>Closed trades</CardTitle><Badge>{list.length}</Badge></CardHeader>
          <div className="pt-4">{list.length === 0 ? <Empty>{a.isNew ? 'You have not closed a trade yet.' : 'No closed trades in this group.'}</Empty> : (
            <Table>
              <TableHeader><TableRow><TableHead>Market</TableHead><TableHead>Opened</TableHead><TableHead>Closed</TableHead><TableHead className="text-right">Size</TableHead><TableHead className="text-right">Entry</TableHead><TableHead className="text-right">Exit</TableHead><TableHead className="text-right">Profit</TableHead></TableRow></TableHeader>
              <TableBody>{list.map((t) => (
                <TableRow key={t.id}>
                  <TableCell><span className="flex items-center gap-2"><Badge tone={t.side === 'Buy' ? 'ok' : 'bad'}>{t.side}</Badge>{byId[t.ins].name}</span><span className="mt-0.5 block text-[11.5px] text-muted-foreground">{t.id}</span></TableCell>
                  <TableCell className="text-muted-foreground">{t.opened}</TableCell><TableCell className="text-muted-foreground">{t.closed}</TableCell>
                  <TableCell className="text-right">{t.lots.toFixed(2)} lot</TableCell>
                  <TableCell className="text-right">{fmt(t.ins, t.open)}</TableCell>
                  <TableCell className="text-right">{fmt(t.ins, t.close)}</TableCell>
                  <TableCell className={cn('text-right font-medium', t.pnl >= 0 ? 'text-positive' : 'text-destructive')}>{signedUsd(t.pnl)}</TableCell>
                </TableRow>
              ))}</TableBody>
              <TableFooter><TableRow><TableCell colSpan={6} className="text-muted-foreground">Net for this view</TableCell><TableCell className={cn('text-right', total >= 0 ? 'text-positive' : 'text-destructive')}>{signedUsd(total)}</TableCell></TableRow></TableFooter>
            </Table>
          )}</div>
        </Card>
        {byMarket.length > 0 && (
          <Card>
            <CardHeader><div><CardTitle>Result by market</CardTitle><CardDescription>Sum of the closed trades in this view</CardDescription></div></CardHeader>
            <CardContent>
              <ul className="grid gap-3">{byMarket.map(([id, v]) => (
                <li key={id} className="grid grid-cols-[72px_1fr_84px] items-center gap-3 text-[13px]">
                  <span>{byId[id].name}</span>
                  <span className="relative h-2" aria-hidden="true"><span className="absolute inset-y-[-4px] left-1/2 w-px bg-white/10" /><span className={cn('absolute inset-y-0 rounded-full', v >= 0 ? 'bg-positive/80' : 'bg-destructive/80')} style={{ width: `${(Math.abs(v) / maxAbs) * 50}%`, [v >= 0 ? 'left' : 'right']: '50%' }} /></span>
                  <span className={cn('text-right tabular-nums', v >= 0 ? 'text-positive' : 'text-destructive')}>{signedUsd(v)}</span>
                </li>
              ))}</ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
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
  const quick = [100, 500, 1000, 2500]
  return (
    <div className="dash-in grid gap-5">
      <PageHeader title="Deposits and withdrawals" finding="Money goes back to where it came from: the card or bank account you paid in with." />
      <section className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Money in" icon={ArrowDownLeft} value={usd(a.b.dep)} sub="Completed deposits" />
        <Kpi label="Money out" icon={ArrowUpRight} value={usd(a.b.wd)} sub="Completed withdrawals" />
        <Kpi label="Free to withdraw" icon={Wallet} value={usd(a.withdrawable)} sub={a.b.held ? `${usd(a.b.held, 0)} held in review` : 'Nothing held'} />
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <form onSubmit={deposit} noValidate aria-labelledby="dp-h">
            <CardHeader><div><CardTitle id="dp-h">Add money</CardTitle><CardDescription>Arrives straight away. No GlobalTrade fee.</CardDescription></div><Badge tone="gold">Instant</Badge></CardHeader>
            <CardContent className="grid gap-4">
              <Label>Amount in USD<Input inputMode="decimal" placeholder="500" value={dep.amount} aria-invalid={!!err.dep} onChange={(e) => setDep({ ...dep, amount: e.target.value })} /></Label>
              <div className="flex flex-wrap gap-2">{quick.map((q) => <Button key={q} type="button" variant="outline" size="sm" onClick={() => setDep({ ...dep, amount: String(q) })}>{usd(q, 0)}</Button>)}</div>
              <div className="grid gap-1.5 text-xs text-muted-foreground"><span id="from-l">From</span><Select label="Pay from" value={dep.method} onValueChange={(v) => setDep({ ...dep, method: v })} options={METHODS} /></div>
              {err.dep && <p className="text-[13px] text-destructive" role="alert">{err.dep}</p>}
              <Button className="justify-self-start">Add money</Button>
            </CardContent>
          </form>
        </Card>
        <Card>
          <form onSubmit={withdraw} noValidate aria-labelledby="wd-h">
            <CardHeader><div><CardTitle id="wd-h">Withdraw</CardTitle><CardDescription>A person checks it, usually within one business day.</CardDescription></div><Badge>Up to {usd(a.withdrawable)}</Badge></CardHeader>
            <CardContent className="grid gap-4">
              <Label>Amount in USD<Input inputMode="decimal" placeholder="200" value={wd.amount} aria-invalid={!!err.wd} onChange={(e) => setWd({ amount: e.target.value })} disabled={a.isNew} /></Label>
              <div className="flex flex-wrap gap-2">{[0.25, 0.5, 1].map((f) => <Button key={f} type="button" variant="outline" size="sm" disabled={a.isNew || !a.withdrawable} onClick={() => setWd({ amount: (Math.floor(a.withdrawable * f * 100) / 100).toFixed(2) })}>{f === 1 ? 'All' : `${f * 100}%`}</Button>)}</div>
              <div className="grid gap-1 rounded-lg bg-white/[0.03] px-3 py-2.5 ring-1 ring-inset ring-white/5"><span className="text-xs text-muted-foreground">To</span><span className="text-[13.5px]">{a.isNew ? 'Available after your first deposit' : METHODS[1]}</span></div>
              {err.wd && <p className="text-[13px] text-destructive" role="alert">{err.wd}</p>}
              <Button variant="secondary" className="justify-self-start" disabled={a.isNew}>Request withdrawal</Button>
            </CardContent>
          </form>
        </Card>
      </div>
      <Card>
        <CardHeader><div><CardTitle>History</CardTitle><CardDescription>Every payment, newest first</CardDescription></div><Badge>{list.length}</Badge></CardHeader>
        <div className="pt-4">{list.length === 0 ? <Empty>No payments yet. Your first deposit will show here.</Empty> : (
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{list.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.date}<span className="mt-0.5 block text-[11.5px] text-muted-foreground">{f.id}</span></TableCell>
                <TableCell><span className="flex items-center gap-2">{f.kind === 'Deposit' ? <ArrowDownLeft size={14} className="text-positive" /> : <ArrowUpRight size={14} className="text-warning" />}{f.kind}</span></TableCell>
                <TableCell className="text-muted-foreground">{f.method}</TableCell>
                <TableCell><Badge tone={TONE[f.status]} dot>{f.status}</Badge></TableCell>
                <TableCell className={cn('text-right font-medium', f.kind === 'Deposit' ? 'text-positive' : '')}>{f.kind === 'Deposit' ? '+' : '−'}{usd(f.amount)}</TableCell>
                <TableCell className="text-right">{f.status === 'In review' && f.kind === 'Withdrawal' ? <Button variant="ghost" size="sm" onClick={() => cancel(f.id)}>Cancel</Button> : null}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}</div>
      </Card>
      <p className="text-[12.5px] text-muted-foreground">Need help with a payment? Write to <a className="text-primary hover:underline" href="mailto:support@globaltrade.example?subject=Payment%20question">support@globaltrade.example</a> with the reference shown under the date.</p>
    </div>
  )
}

export default function Client() {
  const { s } = useStore()
  const name = s.who === 'new' ? s.signup?.name || 'New client' : CLIENT.name
  return (
    <Shell items={ITEMS} label="Client area" area="Client" user={{ name, sub: s.who === 'new' ? 'Identity in review' : `${CLIENT.id} · live account` }}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="trades" element={<Trades />} />
        <Route path="funds" element={<Funds />} />
      </Routes>
    </Shell>
  )
}
