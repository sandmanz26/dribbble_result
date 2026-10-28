import { useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, Chat, Checkmark, Close, Dashboard, Document, Identification, Money, Rule, Search, Send, UserMultiple } from '@carbon/icons-react'
import { useStore } from '../store.jsx'
import Shell from '../ui/Shell.jsx'
import { usd } from '../data/market.js'
import { CLIENTS, KYC, KYC_TARGET_H, MOVES, RULES, TICKETS } from '../data/staff.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Avatar } from '@/components/ui/misc'
import { Empty, Kpi, Notice, PageHeader } from '@/components/dash'
import { cn } from '@/lib/utils'

// The back office on the demo morning: Wednesday 28 October 2026, 11:00 UTC. Every count on
// the overview is computed from the queues below it, after the decisions made in this demo.
const NOW = Date.parse('2026-10-28T11:00:00Z')
const hoursSince = (at) => (NOW - Date.parse(at.replace(' ', 'T') + ':00Z')) / 3600000
const ageLabel = (h) => (h < 1 ? `${Math.round(h * 60)} min` : h < 48 ? `${Math.floor(h)} h` : `${Math.floor(h / 24)} days`)
const ITEMS = [
  ['/staff', 'Overview', Dashboard, true],
  ['/staff/kyc', 'Identity checks', Identification],
  ['/staff/money', 'Money movements', Money],
  ['/staff/clients', 'Clients', UserMultiple],
  ['/staff/support', 'Support', Chat],
]
const TONE = { Verified: 'ok', Approved: 'ok', Completed: 'ok', Released: 'ok', Pending: 'wait', 'In review': 'wait', Held: 'wait', 'More info': 'wait', Open: 'wait', Rejected: 'bad', Returned: 'bad', Restricted: 'bad', 'Waiting on client': 'neutral', Solved: 'neutral' }
const Pill = ({ v }) => <Badge tone={TONE[v] ?? 'neutral'} dot>{v}</Badge>

function useBackOffice() {
  const { s, set, notify } = useStore()
  const clients = useMemo(() => CLIENTS.map((c) => {
    const k = KYC.find((x) => x.client === c.id)
    const d = k && s.kyc[k.id]
    const base = d === 'Approved' ? 'Verified' : d === 'Rejected' ? 'Rejected' : c.status
    return { ...c, status: s.access[c.id] || base }
  }), [s.kyc, s.access])
  const byClient = Object.fromEntries(clients.map((c) => [c.id, c]))
  const kyc = KYC.map((k) => ({ ...k, decision: s.kyc[k.id] || null, age: hoursSince(k.submitted) }))
  const waiting = kyc.filter((k) => !k.decision || k.decision === 'More info').sort((a, b) => b.age - a.age)
  // Withdrawals the demo client asks for in the client area arrive in this queue too.
  const extra = s.funds.filter((f) => f.kind === 'Withdrawal' && f.status === 'In review' && !MOVES.some((m) => m.id === f.id))
    .map((f) => ({ id: f.id, client: 'GT-104882', at: `${f.date} 10:58`, kind: 'Withdrawal', amount: f.amount, method: 'Bank transfer', flags: [], status: 'In review' }))
  const moves = [...extra, ...MOVES].map((m) => {
    const fund = s.funds.find((f) => f.id === m.id)
    const status = s.moves[m.id] || (fund && fund.status !== 'In review' ? (fund.status === 'Completed' ? 'Released' : fund.status) : m.status)
    return { ...m, status }
  })
  const tickets = TICKETS.map((t) => {
    const thread = [...t.thread, ...(s.replies[t.id] || [])]
    const last = thread[thread.length - 1].from
    return { ...t, thread, status: s.solved[t.id] ? 'Solved' : last === 'staff' && t.status !== 'Solved' ? 'Waiting on client' : t.status }
  })
  const decideMove = (m, v) => {
    set((c) => ({ moves: { ...c.moves, [m.id]: v }, funds: c.funds.map((f) => (f.id === m.id ? { ...f, status: v === 'Released' ? 'Completed' : 'Rejected' } : f)) }))
    notify({ text: `${m.id} ${v === 'Released' ? 'released' : 'returned to sender'}.`, undo: () => set((c) => { const n = { ...c.moves }; delete n[m.id]; return { moves: n, funds: c.funds.map((f) => (f.id === m.id ? { ...f, status: 'In review' } : f)) } }) })
  }
  return { s, set, notify, clients, byClient, kyc, waiting, moves, tickets, decideMove }
}

function Overview() {
  const b = useBackOffice()
  const late = b.waiting.filter((k) => k.age > KYC_TARGET_H)
  const held = b.moves.filter((m) => m.status === 'Held' || m.status === 'In review')
  const flagged = held.filter((m) => m.flags.length)
  const open = b.tickets.filter((t) => t.status === 'Open')
  const ages = b.waiting.map((k) => ({ name: b.byClient[k.client].name.split(' ')[0], h: Math.round(k.age * 10) / 10, late: k.age > KYC_TARGET_H }))
  return (
    <div className="dash-in grid gap-5">
      <PageHeader title="Back office" finding={<>{late.length ? `${late.length} identity ${late.length === 1 ? 'check is' : 'checks are'} past the ${KYC_TARGET_H}-hour target; the oldest has waited ${ageLabel(late[0].age)}.` : `Every identity check is inside the ${KYC_TARGET_H}-hour target.`} {flagged.length} payments are held by a rule.</>}>
        <Badge tone="neutral">Wed 28 Oct, 11:00 UTC</Badge>
      </PageHeader>
      <section aria-label="Queues" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Identity checks waiting" icon={Identification} value={b.waiting.length} sub={<span className={late.length ? 'text-destructive' : ''}>{late.length} past {KYC_TARGET_H} h</span>} />
        <Kpi label="Payments to review" icon={Money} value={held.length} sub={`${usd(held.reduce((a, m) => a + m.amount, 0), 0)} in total`} />
        <Kpi label="Held by a rule" icon={Rule} value={flagged.length} sub="Need a decision" />
        <Kpi label="Tickets waiting on us" icon={Chat} value={open.length} sub={`${b.tickets.filter((t) => t.status === 'Waiting on client').length} waiting on clients`} />
      </section>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader><div><CardTitle>Identity checks, oldest first</CardTitle><CardDescription>Hours waiting against the {KYC_TARGET_H}-hour target</CardDescription></div><Button variant="ghost" size="sm" asChild><Link to="/staff/kyc">Open queue<ArrowRight size={14} /></Link></Button></CardHeader>
          <CardContent>
            {ages.length === 0 ? <Empty>No checks waiting.</Empty> : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ages} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 0 }}>
                    <XAxis type="number" tick={{ fill: '#8b909a', fontSize: 11 }} axisLine={false} tickLine={false} unit=" h" />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#eceae4', fontSize: 12 }} axisLine={false} tickLine={false} width={64} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={({ active, payload }) => active && payload?.length ? <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs">{payload[0].payload.name}: {ageLabel(payload[0].payload.h)}</div> : null} />
                    <ReferenceLine x={KYC_TARGET_H} stroke="#d4ae62" strokeDasharray="4 4" label={{ value: 'Target', fill: '#d4ae62', fontSize: 11, position: 'top' }} />
                    <Bar dataKey="h" radius={[0, 4, 4, 0]} barSize={14}>{ages.map((a, i) => <Cell key={i} fill={a.late ? '#f0716b' : 'rgba(236,234,228,0.35)'} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Support tickets</CardTitle><CardDescription>Open first</CardDescription></div><Button variant="ghost" size="sm" asChild><Link to="/staff/support">Open inbox<ArrowRight size={14} /></Link></Button></CardHeader>
          <ul className="grid grid-cols-1 p-2 pt-3">{[...b.tickets].sort((x, y) => (y.status === 'Open') - (x.status === 'Open')).slice(0, 5).map((t) => (
            <li key={t.id}><Link to={`/staff/support?t=${t.id}`} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-white/[0.04]">
              <Avatar name={b.byClient[t.client].name} />
              <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px]">{t.subject}</span><span className="block truncate text-[11.5px] text-muted-foreground">{b.byClient[t.client].name} · {ageLabel(hoursSince(t.opened))} ago</span></span>
              <Pill v={t.status} />
            </Link></li>
          ))}</ul>
        </Card>
      </div>
      <Card>
        <CardHeader><div><CardTitle>Payments held by a rule</CardTitle><CardDescription>The rule that held each payment, in words</CardDescription></div><Button variant="ghost" size="sm" asChild><Link to="/staff/money">All payments<ArrowRight size={14} /></Link></Button></CardHeader>
        <div className="pt-4">{flagged.length === 0 ? <Empty>Nothing held. New flags appear here as payments arrive.</Empty> : (
          <Table>
            <TableHeader><TableRow><TableHead>Payment</TableHead><TableHead>Client</TableHead><TableHead>Why it is held</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
            <TableBody>{flagged.map((m) => <TableRow key={m.id}><TableCell>{m.kind}<span className="mt-0.5 block text-[11.5px] text-muted-foreground">{m.id} · {m.at.slice(11)}</span></TableCell><TableCell>{b.byClient[m.client].name}</TableCell><TableCell className="whitespace-normal text-muted-foreground">{m.flags.map((f) => RULES[f]).join('; ')}</TableCell><TableCell className="text-right font-medium">{usd(m.amount)}</TableCell></TableRow>)}</TableBody>
          </Table>
        )}</div>
      </Card>
    </div>
  )
}

function Kyc() {
  const b = useBackOffice()
  const [tab, setTab] = useState('Waiting')
  const lists = { Waiting: b.waiting, Decided: b.kyc.filter((k) => k.decision && k.decision !== 'More info') }
  const list = lists[tab]
  const [sel, setSel] = useState(b.waiting[0]?.id)
  const k = b.kyc.find((x) => x.id === sel) || list[0]
  const decide = (v) => {
    b.set((c) => ({ kyc: { ...c.kyc, [k.id]: v } }))
    b.notify({ text: `${b.byClient[k.client].name}: ${v === 'More info' ? 'asked for another document' : v.toLowerCase()}.`, undo: () => b.set((c) => { const n = { ...c.kyc }; delete n[k.id]; return { kyc: n } }) })
    const nextUp = b.waiting.find((x) => x.id !== k.id && x.decision !== 'More info')
    if (nextUp) setSel(nextUp.id)
  }
  return (
    <div className="dash-in grid gap-5">
      <PageHeader title="Identity checks" finding={`Target: a decision within ${KYC_TARGET_H} hours of the documents arriving.`}>
        <Tabs value={tab} onValueChange={setTab}><TabsList>{Object.keys(lists).map((t) => <TabsTrigger key={t} value={t}>{t}<span className="text-muted-foreground tabular-nums">{lists[t].length}</span></TabsTrigger>)}</TabsList></Tabs>
      </PageHeader>
      <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          {list.length === 0 ? <Empty>{tab === 'Waiting' ? 'No checks waiting.' : 'Nothing decided yet today.'}</Empty> : (
            <ul className="grid grid-cols-1 p-2">{list.map((x) => (
              <li key={x.id}><button onClick={() => setSel(x.id)} className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left hover:bg-white/[0.04]', k?.id === x.id && 'bg-white/[0.06] ring-1 ring-inset ring-primary/30')}>
                <Avatar name={b.byClient[x.client].name} />
                <span className="min-w-0 flex-1"><span className="flex justify-between gap-2 text-[13.5px]"><span className="truncate">{b.byClient[x.client].name}</span><span className={cn('shrink-0 tabular-nums text-[12px]', x.age > KYC_TARGET_H && !x.decision ? 'text-destructive' : 'text-muted-foreground')}>{ageLabel(x.age)}</span></span><span className="block truncate text-[11.5px] text-muted-foreground">{x.check}{x.decision ? ` · ${x.decision}` : ''}</span></span>
              </button></li>
            ))}</ul>
          )}
        </Card>
        {k && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3"><Avatar name={b.byClient[k.client].name} className="size-10" /><div><CardTitle>{b.byClient[k.client].name}, {b.byClient[k.client].country}</CardTitle><CardDescription>{k.id} · sent {k.submitted} UTC</CardDescription></div></div>
              {k.decision ? <Pill v={k.decision} /> : <Badge tone={k.age > KYC_TARGET_H ? 'bad' : 'wait'} dot>{ageLabel(k.age)} waiting</Badge>}
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">{k.docs.map((d) => (
                <div key={d} className="grid h-36 place-content-center gap-2 rounded-lg border border-dashed border-white/15 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.02)_0_10px,transparent_10px_20px)] text-center">
                  <Document size={22} className="mx-auto text-muted-foreground" /><b className="text-[13px] font-medium">{d}</b><span className="text-[11.5px] text-muted-foreground">Opens in the secure viewer</span>
                </div>
              ))}</div>
              {k.risk === 'Clear' ? <Notice tone="info">Automatic check: {k.check}.</Notice> : <Notice>Automatic check: {k.check}.</Notice>}
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[['Client number', k.client], ['Joined', b.byClient[k.client].joined], ['Waiting', `${ageLabel(k.age)} (target ${KYC_TARGET_H} h)`], ['Decision', k.decision || 'None yet']].map(([t, v]) => (
                  <div key={t} className="rounded-lg bg-white/[0.03] px-3 py-2.5 ring-1 ring-inset ring-white/5"><dt className="text-[11.5px] text-muted-foreground">{t}</dt><dd className="mt-0.5 text-[13px] tabular-nums">{v}</dd></div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => decide('Approved')} disabled={k.decision === 'Approved'}><Checkmark size={16} />Approve</Button>
                <Button variant="secondary" onClick={() => decide('More info')} disabled={k.decision === 'More info'}>Ask for another document</Button>
                <Button variant="destructive" onClick={() => decide('Rejected')} disabled={k.decision === 'Rejected'}><Close size={16} />Reject</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

const MTABS = ['To review', 'Released', 'Returned', 'All']
function MoneyPage() {
  const b = useBackOffice()
  const [tab, setTab] = useState('To review')
  const pick = (t) => b.moves.filter((m) => t === 'All' || (t === 'To review' ? ['Held', 'In review'].includes(m.status) : m.status === t))
  const list = pick(tab)
  return (
    <div className="dash-in grid gap-5">
      <PageHeader title="Money movements" finding="Payments wait here until a person releases them. A rule can hold one; the reason is written next to it.">
        <Tabs value={tab} onValueChange={setTab}><TabsList>{MTABS.map((t) => <TabsTrigger key={t} value={t}>{t}<span className="text-muted-foreground tabular-nums">{pick(t).length}</span></TabsTrigger>)}</TabsList></Tabs>
      </PageHeader>
      <Card>
        <div className="pt-1">{list.length === 0 ? <Empty>Nothing in this view.</Empty> : (
          <Table>
            <TableHeader><TableRow><TableHead>Payment</TableHead><TableHead>Client</TableHead><TableHead>Method</TableHead><TableHead>Why it is here</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{list.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.kind}<span className="mt-0.5 block text-[11.5px] text-muted-foreground">{m.id} · {m.at} UTC</span></TableCell>
                <TableCell><span className="flex items-center gap-2.5"><Avatar name={b.byClient[m.client].name} className="size-7" /><span>{b.byClient[m.client].name}<span className="block text-[11.5px] text-muted-foreground">{m.client}</span></span></span></TableCell>
                <TableCell className="text-muted-foreground">{m.method}</TableCell>
                <TableCell className="min-w-[220px] whitespace-normal text-muted-foreground">{m.flags.length ? m.flags.map((f) => RULES[f]).join('; ') : 'Routine check'}</TableCell>
                <TableCell><Pill v={m.status} /></TableCell>
                <TableCell className={cn('text-right font-medium', m.kind === 'Deposit' && 'text-positive')}>{m.kind === 'Deposit' ? '+' : '−'}{usd(m.amount)}</TableCell>
                <TableCell className="text-right">{['Held', 'In review'].includes(m.status) ? <span className="flex justify-end gap-1.5"><Button size="sm" onClick={() => b.decideMove(m, 'Released')}>Release</Button><Button size="sm" variant="ghost" onClick={() => b.decideMove(m, 'Returned')}>Return</Button></span> : null}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}</div>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>Rules that hold a payment</CardTitle><CardDescription>Sample rules for the prototype</CardDescription></div></CardHeader>
        <CardContent><ul className="grid gap-2 sm:grid-cols-2">{Object.values(RULES).map((r) => <li key={r} className="flex items-start gap-2.5 rounded-lg bg-white/[0.03] px-3 py-2.5 text-[13px] ring-1 ring-inset ring-white/5"><Rule size={16} className="mt-0.5 shrink-0 text-primary" />{r}</li>)}</ul></CardContent>
      </Card>
    </div>
  )
}

const CTABS = ['All', 'Verified', 'Pending', 'Restricted', 'Rejected']
function Clients() {
  const b = useBackOffice()
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')
  const match = (c) => !q || `${c.name} ${c.id} ${c.country}`.toLowerCase().includes(q.toLowerCase())
  const pick = (t) => b.clients.filter((c) => (t === 'All' || c.status === t) && match(c))
  const list = pick(tab)
  const total = list.reduce((a, c) => a + c.balance, 0)
  // A restricted client can log in and withdraw, but cannot open new trades.
  const access = (c, v) => {
    const before = b.s.access[c.id]
    b.set((x) => ({ access: { ...x.access, [c.id]: v } }))
    b.notify({ text: v === 'Restricted' ? `${c.name} can no longer open trades. Withdrawals stay open.` : `${c.name} can trade again.`, undo: () => b.set((x) => ({ access: { ...x.access, [c.id]: before } })) })
  }
  return (
    <div className="dash-in grid gap-5">
      <PageHeader title="Clients" finding={`${list.length} ${list.length === 1 ? 'client' : 'clients'} in this view, ${usd(total)} in balances.`}>
        <span className="relative"><Search size={16} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="w-64 pl-8" placeholder="Name, number or country" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search clients" /></span>
      </PageHeader>
      <Tabs value={tab} onValueChange={setTab}><TabsList>{CTABS.map((t) => <TabsTrigger key={t} value={t}>{t}<span className="text-muted-foreground tabular-nums">{pick(t).length}</span></TabsTrigger>)}</TabsList></Tabs>
      <Card>
        <div className="pt-1">{list.length === 0 ? <Empty>No clients match “{q}”.</Empty> : (
          <Table>
            <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Country</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Balance</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{list.map((c) => (
              <TableRow key={c.id}>
                <TableCell><span className="flex items-center gap-2.5"><Avatar name={c.name} className="size-7" /><span>{c.name}<span className="block text-[11.5px] text-muted-foreground">{c.id}</span></span></span></TableCell>
                <TableCell className="text-muted-foreground">{c.country}</TableCell>
                <TableCell className="text-muted-foreground">{c.joined}</TableCell>
                <TableCell><Pill v={c.status} /></TableCell>
                <TableCell className={cn('text-right', !c.balance && 'text-muted-foreground')}>{usd(c.balance)}</TableCell>
                <TableCell className="text-right">{c.status === 'Verified' ? <Button variant="ghost" size="sm" onClick={() => access(c, 'Restricted')}>Restrict</Button> : c.status === 'Restricted' ? <Button variant="ghost" size="sm" onClick={() => access(c, 'Verified')}>Lift restriction</Button> : null}</TableCell>
              </TableRow>
            ))}</TableBody>
            <TableFooter><TableRow><TableCell colSpan={4} className="text-muted-foreground">Total</TableCell><TableCell className="text-right">{usd(total)}</TableCell><TableCell /></TableRow></TableFooter>
          </Table>
        )}</div>
      </Card>
    </div>
  )
}

function Support() {
  const b = useBackOffice()
  const initial = new URLSearchParams(window.location.hash.split('?')[1]).get('t')
  const [sel, setSel] = useState(initial || b.tickets[0].id)
  const [text, setText] = useState('')
  const t = b.tickets.find((x) => x.id === sel)
  const who = b.byClient[t.client]
  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const msg = { from: 'staff', at: '2026-10-28 11:00', text: text.trim() }
    b.set((c) => ({ replies: { ...c.replies, [t.id]: [...(c.replies[t.id] || []), msg] } }))
    setText('')
    b.notify({ text: `Reply sent to ${who.name}.` })
  }
  const sorted = [...b.tickets].sort((x, y) => (x.status === 'Open') === (y.status === 'Open') ? x.opened.localeCompare(y.opened) : x.status === 'Open' ? -1 : 1)
  return (
    <div className="dash-in grid gap-5">
      <PageHeader title="Support" finding={`${b.tickets.filter((x) => x.status === 'Open').length} tickets waiting on us. Oldest first.`} />
      <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_280px]">
        <Card className="overflow-hidden">
          <ul className="grid grid-cols-1 p-2">{sorted.map((x) => (
            <li key={x.id}><button onClick={() => setSel(x.id)} className={cn('flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-white/[0.04]', x.id === sel && 'bg-white/[0.06] ring-1 ring-inset ring-primary/30')}>
              <Avatar name={b.byClient[x.client].name} />
              <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px]">{x.subject}</span><span className="block truncate text-[11.5px] text-muted-foreground">{b.byClient[x.client].name} · {ageLabel(hoursSince(x.opened))}</span></span>
              {x.status === 'Open' && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgb(212_174_98/0.8)]" />}
            </button></li>
          ))}</ul>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>{t.subject}</CardTitle><CardDescription>{who.name} · {t.client}</CardDescription></div><Pill v={t.status} /></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3">{t.thread.map((m, i) => (
              <div key={i} className={cn('max-w-[62ch] rounded-xl px-4 py-3 text-[13.5px]', m.from === 'staff' ? 'justify-self-end bg-primary/[0.09] ring-1 ring-inset ring-primary/20' : 'bg-white/[0.04] ring-1 ring-inset ring-white/5')}>
                <p className="mb-1 text-[11.5px] text-muted-foreground">{m.from === 'staff' ? 'GlobalTrade support' : who.name} · {m.at} UTC</p>{m.text}
              </div>
            ))}</div>
            {t.status !== 'Solved' ? (
              <form onSubmit={send} className="grid gap-3">
                <Label>Reply<Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={`Write to ${who.name.split(' ')[0]}`} /></Label>
                <div className="flex flex-wrap gap-2">
                  <Button disabled={!text.trim()}><Send size={14} />Send reply</Button>
                  <Button type="button" variant="ghost" onClick={() => b.set((c) => ({ solved: { ...c.solved, [t.id]: true } }))}>Mark as solved</Button>
                </div>
              </form>
            ) : <Empty>Solved. The client can reopen it by replying to the email.</Empty>}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader><CardTitle>About this client</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-3"><Avatar name={who.name} className="size-10" /><div><p className="text-[13.5px]">{who.name}</p><p className="text-[11.5px] text-muted-foreground">{who.country} · joined {who.joined}</p></div></div>
            <dl className="grid gap-2">
              {[['Status', <Pill key="s" v={who.status} />], ['Balance', usd(who.balance)], ['Payments in review', b.moves.filter((m) => m.client === t.client && ['Held', 'In review'].includes(m.status)).map((m) => `${m.id} ${usd(m.amount, 0)}`).join(', ') || 'None']].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5 text-[13px] ring-1 ring-inset ring-white/5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right tabular-nums">{v}</dd></div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Staff() {
  return (
    <Shell items={ITEMS} label="Staff area" area="Back office" user={{ name: 'Kwame Asante', sub: 'Operations, back office' }}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="kyc" element={<Kyc />} />
        <Route path="money" element={<MoneyPage />} />
        <Route path="clients" element={<Clients />} />
        <Route path="support" element={<Support />} />
      </Routes>
    </Shell>
  )
}
