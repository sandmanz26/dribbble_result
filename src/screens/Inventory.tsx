import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useStore } from '@/store'
import { daysTo, fefo, stockOf, type Drug } from '@/data/pharmacy'
import { PO } from '@/data/ops'
import { Input, PageHead, Panel, Segmented, Sheet } from '@/components/kit'
import { Pill } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { rp } from '@/lib/billing'
import { cn } from '@/lib/utils'

// Drugs and consumables by batch. Stock is always the sum of batches; near-expiry and below-minimum
// are flagged; dispensing takes the batch that expires first.
export default function Inventory() {
  const { drugs } = useStore()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [f, setF] = useState<'all' | 'low' | 'expiring'>('all')
  const [open, setOpen] = useState<Drug | null>(() => drugs.find((d) => d.id === params.get('drug')) ?? null)
  const rows = useMemo(() => drugs.filter((d) => {
    if (f === 'low' && stockOf(d) >= d.min) return false
    if (f === 'expiring' && !d.batches.some((b) => b.qty > 0 && daysTo(b.exp) < 90)) return false
    return !q || d.name.toLowerCase().includes(q.toLowerCase())
  }), [drugs, q, f])
  const low = drugs.filter((d) => stockOf(d) < d.min).length
  const expiring = drugs.filter((d) => d.batches.some((b) => b.qty > 0 && daysTo(b.exp) < 90)).length
  const value = drugs.reduce((s, d) => s + stockOf(d) * d.price, 0)
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Drug stock" sub="By batch and expiry. Monthly stock count on the last working day; psychotropics are reported to SIPNAP by the pharmacist.">
        <Button>Start stock count</Button><Button variant="primary">New purchase order</Button>
      </PageHead>
      <div className="grid grid-cols-2 gap-6 rounded-card border border-edge p-5 md:grid-cols-4">
        <div><p className="text-[12.5px] font-medium text-muted">Items</p><p className="tnum text-[26px] font-medium">{drugs.length}</p></div>
        <div><p className="text-[12.5px] font-medium text-muted">Below minimum</p><p className={cn('tnum text-[26px] font-medium', low && 'text-negative')}>{low}</p></div>
        <div><p className="text-[12.5px] font-medium text-muted">Batches expiring in 90 days</p><p className={cn('tnum text-[26px] font-medium', expiring && 'text-warning')}>{expiring}</p></div>
        <div><p className="text-[12.5px] font-medium text-muted">Stock value at sale price</p><p className="tnum text-[26px] font-medium">{rp(value)}</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a drug" className="pl-9" /></div>
        <Segmented label="Filter" value={f} onChange={setF} options={[{ value: 'all', label: 'All' }, { value: 'low', label: `Below minimum (${low})` }, { value: 'expiring', label: `Expiring (${expiring})` }]} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-[13.5px]">
          <thead><tr className="text-left text-[12px] text-muted"><th className="pb-2 font-normal">Drug</th><th className="pb-2 font-normal">KFA code</th><th className="pb-2 text-right font-normal">In stock</th><th className="pb-2 text-right font-normal">Minimum</th><th className="pb-2 pl-6 font-normal">Next batch out</th><th className="pb-2 text-right font-normal">Price</th></tr></thead>
          <tbody>{rows.map((d) => {
            const s = stockOf(d); const next = fefo(d)
            return (
              <tr key={d.id} className="cursor-pointer border-t border-rule hover:bg-raised" onClick={() => setOpen(d)}>
                <td className="py-2.5"><b className="font-medium">{d.name}</b> <span className="text-muted">{d.form}</span>{!d.fornas && <span className="ml-2"><Pill>Non-formulary</Pill></span>}{d.group === 'antibiotic' && <span className="ml-2"><Pill>Antibiotic</Pill></span>}</td>
                <td className="font-mono text-[12.5px] text-muted">{d.kfa}</td>
                <td className={cn('tnum text-right font-medium', s < d.min && 'text-negative')}>{s.toLocaleString('en')} {d.unit}</td>
                <td className="tnum text-right text-muted">{d.min.toLocaleString('en')}</td>
                <td className={cn('pl-6 font-mono text-[12.5px]', next && daysTo(next.exp) < 90 && 'text-warning')}>{next ? `${next.no} · exp ${next.exp} (${daysTo(next.exp)} d)` : '-'}</td>
                <td className="tnum text-right">{rp(d.price)}</td>
              </tr>
            )
          })}</tbody>
        </table>
      </div>
      <Panel title="Purchase orders" pad={false}>
        <table className="w-full text-[13.5px]"><tbody>{PO.map((o) => <tr key={o.id} className="border-t border-rule first:border-0"><td className="px-4 py-2.5 font-mono text-[13px]">{o.id}</td><td>{o.supplier}</td><td className="text-muted">{o.items} items · {o.date}</td><td className="tnum text-right">{rp(o.total)}</td><td className="px-4 text-right"><Pill tone={o.state === 'received' ? 'pos' : o.state === 'sent' ? 'info' : 'neu'}>{o.state === 'received' ? 'Received' : o.state === 'sent' ? 'Sent to supplier' : 'Draft'}</Pill></td></tr>)}</tbody></table>
      </Panel>
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)} title={open?.name ?? ''} description={open ? `${open.form} · KFA ${open.kfa} · ${stockOf(open)} ${open.unit} in ${open.batches.length} batches` : ''}>
        {open && (
          <div className="grid gap-4 p-5">
            <table className="w-full text-[13.5px]">
              <thead><tr className="text-left text-[12px] text-muted"><th className="pb-2 font-normal">Batch</th><th className="pb-2 font-normal">Expires</th><th className="pb-2 text-right font-normal">Quantity</th></tr></thead>
              <tbody>{[...open.batches].sort((a, b) => a.exp.localeCompare(b.exp)).map((b, i) => (
                <tr key={b.no} className="border-t border-rule"><td className="py-2.5 font-mono text-[13px]">{b.no}{i === 0 && <span className="ml-2 font-sans"><Pill tone="info">Picked next</Pill></span>}</td><td className={cn(daysTo(b.exp) < 90 && 'font-medium text-warning')}>{b.exp} ({daysTo(b.exp)} days)</td><td className="tnum text-right">{b.qty}</td></tr>
              ))}</tbody>
            </table>
            {stockOf(open) < open.min && <p className="rounded-control bg-warn-bg p-3 text-[13px] text-warn-ink">Below the minimum of {open.min}. Asa has drafted a purchase order for approval.</p>}
          </div>
        )}
      </Sheet>
    </div>
  )
}
