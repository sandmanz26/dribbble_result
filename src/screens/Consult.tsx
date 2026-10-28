import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Cross2Icon, ExclamationTriangleIcon, MagicWandIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { age, icd, ICD10, STAFF, staff } from '@/data/clinic'
import { DRUGS, drug, LAB_TESTS, labTest, SERVICES, stockOf } from '@/data/pharmacy'
import type { LabOrder, RxLine, Visit } from '@/data/visits'
import { Avatar, Empty, Field, Input, PageHead, Panel, PayerPill, Select, Textarea } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/misc'
import { cn } from '@/lib/utils'

export default function Consult() {
  const { id } = useParams()
  const nav = useNavigate()
  const { visits, patients, role, me, callNext } = useStore()
  const doctors = STAFF.filter((s) => s.role === 'doctor')
  const [doc, setDoc] = useState(role === 'doctor' ? me.id : 's3')
  const mine = visits.filter((v) => v.doctorId === doc && (v.stage === 'doctor_queue' || v.stage === 'consult'))
    .sort((a, b) => (a.stage === 'consult' ? -1 : 0) - (b.stage === 'consult' ? -1 : 0) || (a.vitals?.triage === 'red' ? -1 : 0) - (b.vitals?.triage === 'red' ? -1 : 0) || b.stageMin - a.stageMin)
  const sel = visits.find((v) => v.id === id) ?? (id ? undefined : mine.find((v) => v.stage === 'consult'))
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Consultations" sub="The doctor's queue and the medical record for the patient in the room. Diagnoses use ICD-10; prescriptions are checked against allergies and stock.">
        {role !== 'doctor' && <div className="w-56"><Select label="Doctor" value={doc} onChange={setDoc} options={doctors.map((d) => ({ value: d.id, label: d.name }))} /></div>}
      </PageHead>
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Panel title={<span className="flex items-center gap-2">Queue<Pill>{mine.length}</Pill></span>} action={<Button size="sm" variant="primary" title={mine.some((v) => v.stage === 'consult') ? 'Finish the patient in the room first' : undefined} disabled={!mine.some((v) => v.stage === 'doctor_queue') || mine.some((v) => v.stage === 'consult')} onClick={() => { const n = callNext(doc); if (n) nav(`/consult/${n}`) }}>Call next</Button>} pad={false}>
          {mine.length === 0 ? <Empty title="Queue is empty">Patients appear here once vital signs are recorded.</Empty> : (
            <ul>{mine.map((v) => (
              <li key={v.id}><Link to={`/consult/${v.id}`} className={cn('grid gap-1 border-b border-rule px-4 py-3 last:border-0 hover:bg-raised', sel?.id === v.id && 'bg-active hover:bg-active')}>
                <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="font-mono text-[13px] font-semibold">{v.no}</span>{v.stage === 'consult' && <Pill tone="info">In the room</Pill>}{v.vitals?.triage === 'red' && <Pill tone="neg">Red</Pill>}{v.vitals?.triage === 'yellow' && <Pill tone="warn">Yellow</Pill>}</span><span className="tnum text-[12px] text-muted">{v.arrivedMin} min</span></span>
                <span className="truncate text-[13.5px] font-medium">{patientOf(patients, v.patientId).name}</span>
                <span className="truncate text-[12.5px] text-muted">{v.complaint}</span>
              </Link></li>
            ))}</ul>
          )}
        </Panel>
        {sel ? (sel.stage === 'consult' ? <Chart key={sel.id} v={sel} /> : <Panel><Empty title={sel.stage === 'doctor_queue' ? `${patientOf(patients, sel.patientId).name} is waiting` : 'This consultation is finished'} action={sel.stage === 'doctor_queue' ? <Button variant="primary" onClick={() => { const n = callNext(sel.doctorId); if (n) nav(`/consult/${n}`) }}>Call next patient</Button> : <Button asChild><Link to={`/visits/${sel.id}`}>Open the visit</Link></Button>}>{sel.stage === 'doctor_queue' ? 'Call the next patient to open the record. Red triage is called first, then the longest wait.' : undefined}</Empty></Panel>)
          : <Panel><Empty title="No patient in the room">Call the next patient from the queue.</Empty></Panel>}
      </div>
    </div>
  )
}

function Chart({ v }: { v: Visit }) {
  const { patients, visits, finishConsult, drugs } = useStore()
  const nav = useNavigate()
  const p = patientOf(patients, v.patientId)
  const history = visits.filter((x) => x.patientId === p.id && x.id !== v.id && x.stage === 'done')
  const labsBack = v.labs?.filter((l) => l.result)
  const [soap, setSoap] = useState({ s: v.complaint, o: '', a: '', p: '' })
  const [drafted, setDrafted] = useState(false)
  const [dx, setDx] = useState<string[]>(v.dx ?? [])
  const [dxQ, setDxQ] = useState('')
  const [rx, setRx] = useState<RxLine[]>([])
  const [rxQ, setRxQ] = useState('')
  const [labs, setLabs] = useState<LabOrder[]>(v.labs ?? [])
  const [services, setServices] = useState<string[]>([])
  const [refer, setRefer] = useState(false)
  const [ref, setRef] = useState({ to: 'RSUD Kota Bandung', poli: 'Internal medicine', reason: '' })
  const [override, setOverride] = useState<Record<string, string>>({})
  const [tried, setTried] = useState(false)

  const vt = v.vitals
  const draft = () => {
    // Asa drafts from what the nurse recorded; the doctor edits and signs. Nothing is saved unsigned.
    setSoap({
      s: `${v.complaint}.${p.chronic?.length ? ` Known ${p.chronic.map((c) => (c === 'HT' ? 'hypertension' : 'type 2 diabetes')).join(' and ')}, Prolanis participant.` : ''}`,
      o: vt ? `BP ${vt.sys}/${vt.dia} mmHg, pulse ${vt.hr}/min, RR ${vt.rr}/min, temp ${vt.temp} °C, SpO2 ${vt.spo2}%, weight ${vt.weight} kg. Pain ${vt.pain}/10.` : '',
      a: soap.a, p: soap.p,
    }); setDrafted(true)
  }
  const dxResults = useMemo(() => dxQ.length < 2 ? [] : ICD10.filter((d) => !dx.includes(d.code) && (d.code.toLowerCase().includes(dxQ.toLowerCase()) || d.name.toLowerCase().includes(dxQ.toLowerCase()))).slice(0, 6), [dxQ, dx])
  const rxResults = useMemo(() => rxQ.length < 2 ? [] : drugs.filter((d) => !rx.find((r) => r.drugId === d.id) && d.name.toLowerCase().includes(rxQ.toLowerCase())).slice(0, 6), [rxQ, rx, drugs])
  const allergyHit = (drugId: string) => p.allergies.find((a) => drug(drugId).name.toLowerCase().startsWith(a.toLowerCase()))
  const fktpDx = dx.filter((c) => icd(c).fktp)
  const issues: string[] = []
  if (!soap.a.trim()) issues.push('Assessment')
  if (!dx.length) issues.push('At least one diagnosis')
  rx.forEach((r) => { if (allergyHit(r.drugId) && !override[r.drugId]?.trim()) issues.push(`Reason to give ${drug(r.drugId).name} despite allergy`) })
  if (refer && fktpDx.length && ref.reason.trim().length < 10) issues.push('Medical indication for referring a primary-care diagnosis')
  const finish = () => {
    setTried(true); if (issues.length) return
    finishConsult(v.id, { soap, dx, rx, labs, services, referral: refer ? { ...ref, dx: dx[0] } : undefined })
    nav('/consult')
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_320px]">
      <div className="grid content-start gap-6">
        <section className="flex flex-wrap items-start justify-between gap-4 rounded-card border border-edge p-4">
          <div className="flex items-center gap-3">
            <Avatar name={p.name} size={44} />
            <div>
              <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{p.name}</h2>
              <p className="text-[13px] text-muted">{p.sex === 'L' ? 'Male' : 'Female'}, {age(p.dob)} years · <span className="font-mono text-[12.5px]">{p.rm}</span> · {v.no}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <PayerPill payer={v.payer} check={v.bpjsCheck} />
            {p.chronic?.map((c) => <Pill key={c} tone="info">Prolanis {c === 'HT' ? 'hypertension' : 'diabetes'}</Pill>)}
            {p.allergies.length ? <span className="rounded-full bg-negative px-2 text-[12px] font-semibold leading-5 text-white">Allergy: {p.allergies.join(', ')}</span> : <Pill>No known allergy</Pill>}
          </div>
          {vt && (
            <dl className="grid w-full grid-cols-3 gap-3 border-t border-rule pt-3 text-[13px] sm:grid-cols-7">
              {[['BP', `${vt.sys}/${vt.dia}`, vt.sys >= 140 || vt.dia >= 90], ['Pulse', vt.hr, vt.hr > 100], ['RR', vt.rr, vt.rr > 20], ['Temp', `${vt.temp}°`, vt.temp >= 37.6], ['SpO2', `${vt.spo2}%`, vt.spo2 < 95], ['Weight', `${vt.weight} kg`, false], ['Triage', vt.triage, vt.triage !== 'green']].map(([k, val, bad]) => (
                <div key={String(k)}><dt className="text-[12px] text-muted">{k}</dt><dd className={cn('tnum font-semibold', k === 'Triage' && 'capitalize', bad && 'text-negative')}>{String(val)}</dd></div>
              ))}
            </dl>
          )}
        </section>

        {labsBack && labsBack.length > 0 && (
          <Panel title="Lab results back">
            <ul className="grid gap-1.5 text-[13.5px]">{labsBack.map((l) => <li key={l.testId} className="flex justify-between gap-3"><span>{labTest(l.testId).name}</span><b className={cn('tnum', l.flag && 'text-negative')}>{l.result} {labTest(l.testId).unit} {l.flag && `(${l.flag === 'H' ? 'high' : 'low'})`}</b></li>)}</ul>
          </Panel>
        )}

        <Panel title="Notes (SOAP)" action={<Button size="sm" variant="ghost" onClick={draft}><MagicWandIcon />{drafted ? 'Redraft' : 'Draft from nurse notes'}</Button>}>
          {drafted && <p className="mb-3 flex items-center gap-2 rounded-control bg-accent-soft p-2.5 text-[12.5px] text-accent-ink"><Avatar name="Asa" size={18} />Drafted by Asa from the complaint and vital signs. Read and edit; it is saved only when you sign.</p>}
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Subjective"><Textarea value={soap.s} onChange={(e) => setSoap({ ...soap, s: e.target.value })} /></Field>
            <Field label="Objective"><Textarea value={soap.o} onChange={(e) => setSoap({ ...soap, o: e.target.value })} placeholder="Examination findings" /></Field>
            <Field label="Assessment" error={tried && !soap.a.trim() ? 'Required to sign' : undefined}><Textarea value={soap.a} onChange={(e) => setSoap({ ...soap, a: e.target.value })} /></Field>
            <Field label="Plan"><Textarea value={soap.p} onChange={(e) => setSoap({ ...soap, p: e.target.value })} placeholder="Treatment, education, follow-up" /></Field>
          </div>
        </Panel>

        <Panel title="Diagnosis (ICD-10)">
          <div className="grid gap-3">
            {dx.length > 0 && <ul className="grid gap-1.5">{dx.map((c, i) => (
              <li key={c} className="flex items-center justify-between gap-3 rounded-control bg-raised px-3 py-2 text-[13.5px]">
                <span><span className="mr-2 font-mono text-[12.5px] font-semibold">{c}</span>{icd(c).name}{i === 0 && <span className="ml-2 text-[12px] text-muted">primary</span>}{icd(c).fktp && <span className="ml-2 text-[12px] text-muted">· treat at primary care</span>}</span>
                <button onClick={() => setDx(dx.filter((x) => x !== c))} aria-label={`Remove ${c}`} className="text-muted hover:text-ink"><Cross2Icon /></button>
              </li>
            ))}</ul>}
            <div className="relative">
              <Input value={dxQ} onChange={(e) => setDxQ(e.target.value)} placeholder="Search code or name, e.g. I10 or hypertension" aria-invalid={tried && !dx.length} />
              {dxResults.length > 0 && <ul className="absolute inset-x-0 top-10 z-10 overflow-hidden rounded-card border border-edge bg-sheet">{dxResults.map((d) => <li key={d.code}><button onClick={() => { setDx([...dx, d.code]); setDxQ('') }} className="flex w-full gap-3 px-3 py-2 text-left text-[13.5px] hover:bg-raised"><span className="w-14 font-mono text-[12.5px] font-semibold">{d.code}</span>{d.name}</button></li>)}</ul>}
            </div>
          </div>
        </Panel>

        <Panel title="Prescription">
          <div className="grid gap-3">
            {rx.map((r, i) => {
              const d = drug(r.drugId); const al = allergyHit(r.drugId); const stock = stockOf(drugs.find((x) => x.id === d.id)!)
              return (
                <div key={r.drugId} className={cn('grid gap-2 rounded-card border p-3', al ? 'border-[#e3a39c] bg-neg-bg/40' : 'border-edge')}>
                  <div className="flex items-center justify-between gap-3">
                    <b className="text-[14px] font-semibold">{d.name}</b>
                    <span className="flex items-center gap-2 text-[12px] text-muted">{!d.fornas && v.payer === 'bpjs' && <Pill tone="warn">Not in national formulary: patient pays</Pill>}{d.group === 'antibiotic' && <Pill>Antibiotic</Pill>}<span className={cn('tnum', stock < r.qty && 'font-semibold text-negative')}>{stock} in stock</span><button onClick={() => setRx(rx.filter((_, k) => k !== i))} aria-label="Remove"><TrashIcon /></button></span>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_90px] gap-2">
                    <Input value={r.qty} inputMode="numeric" onChange={(e) => setRx(rx.map((x, k) => (k === i ? { ...x, qty: +e.target.value.replace(/\D/g, '') || 0 } : x)))} aria-label="Quantity" />
                    <Input value={r.sig} onChange={(e) => setRx(rx.map((x, k) => (k === i ? { ...x, sig: e.target.value } : x)))} aria-label="How to take" placeholder="3 × 1 after meals" />
                    <Input value={r.days} inputMode="numeric" onChange={(e) => setRx(rx.map((x, k) => (k === i ? { ...x, days: +e.target.value.replace(/\D/g, '') || 0 } : x)))} aria-label="Days" />
                  </div>
                  {al && (
                    <div className="grid gap-2 text-[13px] text-neg-ink">
                      <p className="flex items-center gap-2 font-semibold"><ExclamationTriangleIcon />Recorded allergy: {al}. Choose another drug, or give a reason.</p>
                      <Input value={override[r.drugId] ?? ''} onChange={(e) => setOverride({ ...override, [r.drugId]: e.target.value })} placeholder="Reason, for example: allergy history disproven by skin test" aria-invalid={tried && !override[r.drugId]?.trim()} />
                    </div>
                  )}
                </div>
              )
            })}
            <div className="relative">
              <Input value={rxQ} onChange={(e) => setRxQ(e.target.value)} placeholder="Add a drug by name" />
              {rxResults.length > 0 && <ul className="absolute inset-x-0 top-10 z-10 overflow-hidden rounded-card border border-edge bg-sheet">{rxResults.map((d) => (
                <li key={d.id}><button onClick={() => { setRx([...rx, { drugId: d.id, qty: 10, sig: '3 × 1 after meals', days: 3 }]); setRxQ('') }} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13.5px] hover:bg-raised"><span>{d.name} <span className="text-muted">{d.form}</span></span><span className={cn('tnum text-[12px]', stockOf(d) < d.min ? 'text-warning' : 'text-muted')}>{stockOf(d)} in stock</span></button></li>
              ))}</ul>}
            </div>
            <p className="text-[12px] text-muted">Columns: quantity, how to take, days.</p>
          </div>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="Lab orders">
            <div className="grid gap-2">{LAB_TESTS.map((t) => {
              const on = !!labs.find((l) => l.testId === t.id)
              const done = labs.find((l) => l.testId === t.id)?.result
              return <label key={t.id} className="flex items-center gap-2.5 text-[13.5px]"><input type="checkbox" className="size-4 accent-[var(--color-accent)]" checked={on} disabled={!!done} onChange={() => setLabs(on ? labs.filter((l) => l.testId !== t.id) : [...labs, { testId: t.id }])} />{t.name}{done && <span className="text-[12px] text-muted">(result in)</span>}</label>
            })}</div>
          </Panel>
          <Panel title="Procedures">
            <div className="grid gap-2">{SERVICES.filter((s) => !['t01', 't02', 't07'].includes(s.id)).map((s) => <label key={s.id} className="flex items-center gap-2.5 text-[13.5px]"><input type="checkbox" className="size-4 accent-[var(--color-accent)]" checked={services.includes(s.id)} onChange={() => setServices(services.includes(s.id) ? services.filter((x) => x !== s.id) : [...services, s.id])} />{s.name}</label>)}</div>
          </Panel>
        </div>

        <Panel title="Referral to hospital" action={<label className="flex items-center gap-2 text-[13px]"><input type="checkbox" className="size-4 accent-[var(--color-accent)]" checked={refer} onChange={(e) => setRefer(e.target.checked)} />Refer</label>}>
          {!refer ? <p className="text-[13px] text-muted">Referrals go to PCare and appear in the patient&apos;s Mobile JKN. Keep the non-specialist referral ratio under 2% for full capitation.</p> : (
            <div className="grid gap-3">
              {fktpDx.length > 0 && <p className="flex items-start gap-2 rounded-control bg-warn-bg p-3 text-[13px] text-warn-ink"><ExclamationTriangleIcon className="mt-0.5 shrink-0" />{fktpDx.map((c) => `${c} ${icd(c).name}`).join(', ')} is on the list of 144 diagnoses treated to completion at primary care. Referral is allowed with a medical indication (complication, comorbidity, no response to treatment, or the facility lacks the equipment). It counts toward the non-specialist referral ratio.</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Hospital"><Select label="Hospital" value={ref.to} onChange={(x) => setRef({ ...ref, to: x })} options={['RSUD Kota Bandung', 'RS Santo Borromeus', 'RS Al Islam Bandung', 'RSUP Dr. Hasan Sadikin'].map((h) => ({ value: h, label: h }))} /></Field>
                <Field label="Specialist clinic"><Select label="Specialist" value={ref.poli} onChange={(x) => setRef({ ...ref, poli: x })} options={['Internal medicine', 'Cardiology', 'Neurology', 'Ophthalmology', 'Obstetrics and gynaecology', 'Paediatrics', 'Oral surgery'].map((h) => ({ value: h, label: h }))} /></Field>
              </div>
              <Field label="Medical indication" error={tried && fktpDx.length > 0 && ref.reason.trim().length < 10 ? 'Required for a primary-care diagnosis' : undefined}><Textarea value={ref.reason} onChange={(e) => setRef({ ...ref, reason: e.target.value })} placeholder="Why this patient needs a specialist" /></Field>
            </div>
          )}
        </Panel>

        <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-card border border-edge bg-sheet/95 px-4 py-3 backdrop-blur">
          <Button variant="primary" size="lg" onClick={finish}>Sign and finish</Button>
          <span className="text-[13px] text-muted">{labs.some((l) => !l.result) ? 'Lab orders go first; the patient comes back to you with results.' : rx.length ? 'Prescription goes to the pharmacy, then the cashier.' : 'Patient goes to the cashier.'}</span>
          {tried && issues.length > 0 && <span className="text-[13px] font-medium text-negative">Missing: {issues.join('; ')}</span>}
        </div>
      </div>

      <aside className="grid content-start gap-6">
        <Panel title="Previous visits" pad={false}>
          {history.length === 0 ? <p className="p-4 text-[13px] text-muted">No earlier visits in this record today. Older visits are in the patient record.</p> : (
            <ul>{history.map((h) => <li key={h.id} className="border-b border-rule px-4 py-3 text-[13px] last:border-0"><b className="font-semibold">{h.dx?.map((c) => icd(c).name).join(', ')}</b><p className="text-muted">{staff(h.doctorId).name}</p></li>)}</ul>
          )}
          <Link to={`/patients/${p.id}`} className="block border-t border-rule px-4 py-2.5 text-[13px] text-accent hover:underline">Open the full record</Link>
        </Panel>
        <Panel title="Drugs">
          <ul className="grid gap-1.5 text-[13px]">{DRUGS.filter((d) => stockOf(d) < d.min).map((d) => <li key={d.id} className="flex justify-between gap-2"><span>{d.name}</span><span className="tnum font-medium text-warning">{stockOf(d)} left</span></li>)}</ul>
          <p className="mt-2 text-[12px] text-muted">Below minimum stock. Prescribe an alternative where you can.</p>
        </Panel>
        <Panel title="Quick add"><div className="flex flex-wrap gap-2">{['d01', 'd05', 'd06', 'd03'].map((id) => <Button key={id} size="sm" onClick={() => !rx.find((r) => r.drugId === id) && setRx([...rx, { drugId: id, qty: 10, sig: '3 × 1 after meals', days: 3 }])}><PlusIcon />{drug(id).name.split(' ')[0]}</Button>)}</div></Panel>
      </aside>
    </div>
  )
}
