import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { staff } from '@/data/clinic'
import { daysTo, drug } from '@/data/pharmacy'
import { Empty, PageHead, Panel, PatientLine, PayerPill } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/misc'
import { cn } from '@/lib/utils'

// The pharmacist reviews each prescription, picks from the batch that expires first, and counsels
// the patient before handing over. Every step is a checkbox the pharmacist confirms.
export default function Pharmacy() {
  const { visits } = useStore()
  const queue = visits.filter((v) => v.stage === 'pharmacy').sort((a, b) => b.stageMin - a.stageMin)
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Pharmacy" sub="Review, prepare and hand over prescriptions. Stock is taken from the batch that expires first; the pharmacist counsels every patient.">
        <Button asChild><Link to="/inventory">Drug stock</Link></Button>
      </PageHead>
      {queue.length === 0 ? <Panel><Empty title="No prescriptions waiting">Prescriptions arrive when a doctor signs a consultation.</Empty></Panel> : queue.map((v) => <RxCard key={v.id} id={v.id} />)}
    </div>
  )
}

function RxCard({ id }: { id: string }) {
  const { visit, patients, drugs, dispense } = useStore()
  const v = visit(id)!
  const p = patientOf(patients, v.patientId)
  const [steps, setSteps] = useState({ review: false, pick: false, label: false, counsel: false })
  const all = Object.values(steps).every(Boolean)
  const stepRow = (k: keyof typeof steps, label: string, hint: string) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-control px-2 py-2 hover:bg-raised">
      <input type="checkbox" className="mt-0.5 size-4 accent-[var(--color-accent)]" checked={steps[k]} onChange={(e) => setSteps({ ...steps, [k]: e.target.checked })} />
      <span><b className="block text-[13.5px] font-semibold">{label}</b><span className="text-[12.5px] text-muted">{hint}</span></span>
    </label>
  )
  return (
    <Panel title={<span className="flex items-center gap-3"><span className="font-mono">{v.no}</span><span className="font-normal text-muted">from {staff(v.doctorId).name} · waiting {v.stageMin} min</span></span>} action={<PayerPill payer={v.payer} check={v.bpjsCheck} />}>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid content-start gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><PatientLine p={p} />{p.allergies.length > 0 && <span className="rounded-full bg-negative px-2 text-[12px] font-semibold leading-5 text-white">Allergy: {p.allergies.join(', ')}</span>}</div>
          <table className="w-full text-[13.5px]">
            <thead><tr className="text-left text-[12px] text-muted"><th className="pb-1.5 font-normal">Drug</th><th className="pb-1.5 font-normal">Qty</th><th className="pb-1.5 font-normal">How to take</th><th className="pb-1.5 font-normal">Pick from batch</th></tr></thead>
            <tbody>{v.rx!.map((r) => {
              const d = drugs.find((x) => x.id === r.drugId)!
              let need = r.qty
              const picks = [...d.batches].sort((a, b) => a.exp.localeCompare(b.exp)).filter((b) => b.qty > 0).map((b) => { const take = Math.min(need, b.qty); need -= take; return { ...b, take } }).filter((b) => b.take > 0)
              const short = need > 0
              return (
                <tr key={r.drugId} className="border-t border-rule align-top">
                  <td className="py-2.5 pr-3"><b className="font-medium">{drug(r.drugId).name}</b>{d.group === 'antibiotic' && <span className="ml-1.5"><Pill>Antibiotic</Pill></span>}</td>
                  <td className="tnum py-2.5 pr-3">{r.qty} {d.unit}</td>
                  <td className="py-2.5 pr-3">{r.sig}, {r.days} days</td>
                  <td className="py-2.5">{picks.map((b) => <span key={b.no} className={cn('block font-mono text-[12px]', daysTo(b.exp) < 60 && 'text-warning')}>{b.no} × {b.take} · exp {b.exp.slice(0, 7)}</span>)}{short && <span className="flex items-center gap-1 text-[12px] font-semibold text-negative"><ExclamationTriangleIcon />Short by {need}</span>}</td>
                </tr>
              )
            })}</tbody>
          </table>
        </div>
        <div className="grid content-start gap-1 rounded-card bg-raised/60 p-2">
          {stepRow('review', 'Prescription reviewed', 'Dose, interactions, allergies and duplicates checked')}
          {stepRow('pick', 'Picked by batch', 'Earliest expiry first, quantities counted')}
          {stepRow('label', 'Labelled', 'Name, how to take, and the warning stickers')}
          {stepRow('counsel', 'Patient counselled', 'How and when to take, side effects, finishing antibiotics')}
          <Button variant="primary" className="mt-2" disabled={!all} onClick={() => dispense(id)}><CheckIcon />Hand over and send to the cashier</Button>
        </div>
      </div>
    </Panel>
  )
}
