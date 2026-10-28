import { useState } from 'react'
import { patientOf, useStore } from '@/store'
import { PAYER } from '@/data/clinic'
import { Empty, PageHead, Panel, PatientLine, PayerPill, Segmented } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { bill, rp } from '@/lib/billing'
import { cn } from '@/lib/utils'

// One bill per visit. BPJS visits show what capitation covers (nothing to pay) and anything outside
// the national formulary; insurance is billed to the insurer; self-pay pays here.
export default function Cashier() {
  const { visits } = useStore()
  const ready = visits.filter((v) => v.stage === 'cashier')
  const paid = visits.filter((v) => v.stage === 'done' && v.paid)
  const cash = paid.reduce((s, v) => s + (['cash', 'qris', 'debit'].includes(v.paid!.method) ? v.paid!.amount : 0), 0)
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Cashier" sub={<>Bills for finished visits. Taken today: <b className="tnum font-semibold text-ink">{rp(cash)}</b> from {paid.filter((v) => ['cash', 'qris', 'debit'].includes(v.paid!.method)).length} self-pay visits.</>} />
      {ready.length === 0 ? <Panel><Empty title="Nobody to bill">Patients arrive here after the doctor or the pharmacy.</Empty></Panel> : ready.map((v) => <BillCard key={v.id} id={v.id} />)}
      <Panel title="Closed today" pad={false}>
        <table className="w-full text-[13.5px]">
          <thead><tr className="text-left text-[12px] text-muted"><th className="px-4 py-2 font-normal">Queue</th><th className="py-2 font-normal">Patient</th><th className="py-2 font-normal">Payer</th><th className="py-2 font-normal">How</th><th className="px-4 py-2 text-right font-normal">Amount</th></tr></thead>
          <tbody>{paid.map((v) => <PaidRow key={v.id} id={v.id} />)}</tbody>
        </table>
      </Panel>
    </div>
  )
}

function PaidRow({ id }: { id: string }) {
  const { visit, patients } = useStore()
  const v = visit(id)!
  const how = { cash: 'Cash', qris: 'QRIS', debit: 'Debit card', claim: 'Claim', capitation: 'Capitation' }[v.paid!.method]
  return <tr className="border-t border-rule"><td className="px-4 py-2.5 font-mono text-[13px]">{v.no}</td><td>{patientOf(patients, v.patientId).name}</td><td>{PAYER[v.payer]}</td><td>{how}</td><td className="tnum px-4 text-right">{rp(v.paid!.amount)}</td></tr>
}

function BillCard({ id }: { id: string }) {
  const { visit, patients, pay } = useStore()
  const v = visit(id)!
  const b = bill(v)
  const [method, setMethod] = useState<'cash' | 'qris' | 'debit'>('qris')
  const [given, setGiven] = useState('')
  const change = Math.max(0, (parseInt(given.replace(/\D/g, '')) || 0) - b.due)
  return (
    <Panel title={<span className="flex items-center gap-3"><span className="font-mono">{v.no}</span><span className="font-normal text-muted">waiting {v.stageMin} min</span></span>} action={<PayerPill payer={v.payer} check={v.bpjsCheck} />}>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid content-start gap-3">
          <PatientLine p={patientOf(patients, v.patientId)} />
          <table className="w-full text-[13.5px]">
            <tbody>{b.lines.map((l, i) => (
              <tr key={i} className="border-t border-rule"><td className="py-2 pr-3">{l.label}{l.qty > 1 && <span className="text-muted"> × {l.qty}</span>}</td><td className={cn('tnum py-2 text-right', l.covered && 'text-muted line-through decoration-1')}>{rp(l.total)}</td><td className="w-28 py-2 pl-3 text-right text-[12px] text-muted">{l.covered ? (b.nonCapitation ? 'BPJS claim' : 'Capitation') : ''}</td></tr>
            ))}</tbody>
            <tfoot>
              <tr className="border-t border-ink/70"><td className="pt-2 text-muted">Clinic tariff</td><td className="tnum pt-2 text-right text-muted">{rp(b.gross)}</td><td /></tr>
              {b.covered > 0 && <tr><td className="text-muted">{b.nonCapitation ? 'Claimed from BPJS (non-capitation)' : 'Covered by BPJS capitation'}</td><td className="tnum text-right text-muted">− {rp(b.covered)}</td><td /></tr>}
              <tr><td className="pt-1 text-[15px] font-semibold">{v.payer === 'asuransi' ? 'Billed to the insurer' : 'To pay'}</td><td className="tnum pt-1 text-right text-[18px] font-semibold">{rp(b.due)}</td><td /></tr>
            </tfoot>
          </table>
        </div>
        <div className="grid content-start gap-3 rounded-card bg-raised/60 p-4">
          {v.payer === 'bpjs' && b.due === 0 ? (
            <>
              <p className="text-[13.5px]">{b.nonCapitation ? 'Antenatal and family-planning visits are claimed from BPJS outside capitation. The claim is prepared from this visit.' : 'Everything is covered by capitation. Nothing to pay; close the visit and the patient may go.'}</p>
              <Button variant="primary" onClick={() => pay(id, b.nonCapitation ? 'claim' : 'capitation', 0)}>Close visit</Button>
            </>
          ) : v.payer === 'asuransi' ? (
            <>
              <p className="text-[13.5px]">Billed to Asuransi Mitra Sehat with the patient&apos;s card and signature. The claim is sent at the end of the day.</p>
              <Button variant="primary" onClick={() => pay(id, 'claim', b.due)}>Bill the insurer</Button>
            </>
          ) : (
            <>
              <Segmented label="Payment method" value={method} onChange={setMethod} options={[{ value: 'qris', label: 'QRIS' }, { value: 'cash', label: 'Cash' }, { value: 'debit', label: 'Debit card' }]} />
              {method === 'cash' && (
                <label className="grid gap-1 text-[13px]"><span className="text-muted">Cash received</span><input value={given} onChange={(e) => setGiven(e.target.value)} inputMode="numeric" className="h-9 rounded-control border border-control bg-sheet px-3 tnum" placeholder={String(b.due)} /><span className="text-muted">Change: <b className="tnum text-ink">{rp(change)}</b></span></label>
              )}
              {method === 'qris' && <p className="text-[13px] text-muted">Show the clinic&apos;s QRIS on the counter screen. Payment confirms here automatically.</p>}
              <Button variant="primary" disabled={method === 'cash' && (parseInt(given.replace(/\D/g, '')) || 0) < b.due} onClick={() => pay(id, method, b.due)}>Take {rp(b.due)} and print receipt</Button>
            </>
          )}
        </div>
      </div>
    </Panel>
  )
}
