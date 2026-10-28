import { useState } from 'react'
import { patientOf, useStore } from '@/store'
import { labTest } from '@/data/pharmacy'
import type { LabOrder } from '@/data/visits'
import { Empty, Input, PageHead, Panel, PatientLine } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Point-of-care tests done in the clinic. Values outside the reference range are flagged as they are
// typed; the patient returns to the same doctor with the results.
export default function Lab() {
  const { visits, patients } = useStore()
  const orders = visits.filter((v) => v.stage === 'lab')
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Lab" sub="Point-of-care tests ordered by the doctor. Results go straight back to the doctor who ordered them." />
      {orders.length === 0 ? <Panel><Empty title="No tests waiting">Orders appear here when a doctor signs a consultation with lab tests.</Empty></Panel> : orders.map((v) => <LabCard key={v.id} id={v.id} />)}
      <p className="text-[12.5px] text-muted">{patients.length} patients on record. Tests sent to an outside laboratory are recorded in the visit as an external referral.</p>
    </div>
  )
}

function LabCard({ id }: { id: string }) {
  const { visit, patients, saveLab } = useStore()
  const v = visit(id)!
  const [vals, setVals] = useState<Record<string, string>>({})
  const flagOf = (o: LabOrder) => {
    const t = labTest(o.testId); const n = parseFloat(vals[o.testId])
    if (!t.unit || !Number.isFinite(n)) return null
    return n > t.range[1] ? 'H' : n < t.range[0] ? 'L' : null
  }
  const ready = v.labs!.every((o) => (vals[o.testId] ?? '').trim())
  return (
    <Panel title={<span className="flex items-center gap-3"><span className="font-mono">{v.no}</span><span className="font-normal text-muted">waiting {v.stageMin} min</span></span>}>
      <div className="grid gap-4">
        <PatientLine p={patientOf(patients, v.patientId)} />
        <div className="grid gap-3">
          {v.labs!.map((o) => {
            const t = labTest(o.testId); const f = flagOf(o)
            return (
              <div key={o.testId} className="grid items-center gap-2 sm:grid-cols-[1fr_200px_160px]">
                <span className="text-[14px] font-medium">{t.name}</span>
                <div className="relative">
                  <Input value={vals[o.testId] ?? ''} onChange={(e) => setVals({ ...vals, [o.testId]: e.target.value })} placeholder={t.unit ? 'Value' : 'Result'} className={cn('tnum', f && 'border-[#e3a39c] bg-neg-bg/40')} aria-label={`${t.name} result`} />
                  {t.unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted">{t.unit}</span>}
                </div>
                <span className={cn('text-[12.5px]', f ? 'font-semibold text-negative' : 'text-muted')}>{f ? (f === 'H' ? 'High' : 'Low') : t.unit ? `Reference ${t.range[0]} to ${t.range[1]}` : 'Free text'}</span>
              </div>
            )
          })}
        </div>
        <Button variant="primary" className="justify-self-start" disabled={!ready} onClick={() => saveLab(id, v.labs!.map((o) => ({ ...o, result: vals[o.testId], flag: flagOf(o) })))}>Send results to the doctor</Button>
      </div>
    </Panel>
  )
}
