import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { icd, PAYER, POLI, staff } from '@/data/clinic'
import { drug, labTest } from '@/data/pharmacy'
import { STAGES } from '@/data/visits'
import { SYNC } from '@/data/ops'
import { Empty, PageHead, Panel, PatientLine, PayerPill, StagePath, StatePill } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { bill, rp } from '@/lib/billing'
import { can } from '@/lib/access'

// Everything about one visit: where the patient is, what was recorded at each station, the bill,
// and what was sent to BPJS and SATUSEHAT.
export default function VisitView() {
  const { id } = useParams()
  const { visit, patients, jobs, role } = useStore()
  const v = visit(id ?? '')
  if (!v) return <div className="p-7"><Empty title={`Visit ${id} not found`} action={<Button asChild><Link to="/queue">Queue board</Link></Button>}>It may belong to another day. Search the patient instead.</Empty></div>
  const p = patientOf(patients, v.patientId)
  const vjobs = jobs.filter((j) => j.visitId === v.id)
  const b = bill(v)
  const next = { vitals: ['vitals', `/vitals/${v.id}`, 'Record vital signs'], doctor_queue: ['consult', '/consult', 'Open the doctor queue'], consult: ['consult', `/consult/${v.id}`, 'Open consultation'], lab: ['lab', '/lab', 'Enter lab results'], pharmacy: ['pharmacy', '/pharmacy', 'Prepare prescription'], cashier: ['cashier', '/cashier', 'Take payment'] }[v.stage as 'vitals']
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <Link to="/queue" className="flex items-center gap-1 text-[13px] text-muted hover:text-ink"><ArrowLeftIcon />Queue board</Link>
      <PageHead title={<span className="flex items-center gap-3"><span className="font-mono">{v.no}</span>{p.name}</span>} sub={<>{POLI[v.poli].name} clinic · {staff(v.doctorId).name} · arrived {v.arrivedMin > 0 ? `${v.arrivedMin} min ago` : 'not yet'} · <span className="font-mono">{v.id}</span></>}>
        {next && can(role, next[0] as 'vitals') && <Button asChild variant="primary"><Link to={next[1]}>{next[2]}</Link></Button>}
      </PageHead>
      <div className="flex flex-wrap items-center gap-4 rounded-card border border-edge p-4">
        <StagePath stage={v.stage} />
        <span className="text-[13.5px] font-medium">{STAGES.find((s) => s.id === v.stage)!.name}</span>
        <span className="text-[13px] text-muted">{v.stage !== 'done' && v.stage !== 'booked' ? `${v.stageMin} min at this station` : ''}</span>
        <span className="ml-auto"><PayerPill payer={v.payer} check={v.bpjsCheck} /></span>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="grid content-start gap-6">
          <Panel title="Patient"><div className="flex flex-wrap items-center justify-between gap-3"><PatientLine p={p} /><Link to={`/patients/${p.id}`} className="text-[13px] text-accent hover:underline">Full record</Link></div><p className="mt-3 text-[13.5px]"><span className="text-muted">Complaint: </span>{v.complaint}</p></Panel>
          <Panel title="Vital signs">{v.vitals ? <dl className="grid grid-cols-3 gap-3 text-[13.5px] sm:grid-cols-5">{[['BP', `${v.vitals.sys}/${v.vitals.dia} mmHg`], ['Pulse', `${v.vitals.hr}/min`], ['Temperature', `${v.vitals.temp} °C`], ['SpO2', `${v.vitals.spo2}%`], ['Triage', v.vitals.triage]].map(([k, x]) => <div key={k}><dt className="text-[12px] text-muted">{k}</dt><dd className="tnum font-medium capitalize">{x}</dd></div>)}</dl> : <p className="text-[13.5px] text-muted">Not recorded yet.</p>}</Panel>
          <Panel title="Consultation">
            {v.soap || v.dx ? (
              <div className="grid gap-3 text-[13.5px]">
                {v.soap && <dl className="grid gap-2">{(['s', 'o', 'a', 'p'] as const).map((k) => <div key={k} className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-muted">{{ s: 'Subjective', o: 'Objective', a: 'Assessment', p: 'Plan' }[k]}</dt><dd>{v.soap![k] || '-'}</dd></div>)}</dl>}
                {v.dx && <p><span className="text-muted">Diagnosis: </span>{v.dx.map((c) => <span key={c} className="mr-3"><span className="font-mono text-[12.5px] font-semibold">{c}</span> {icd(c).name}</span>)}</p>}
                {v.rx && v.rx.length > 0 && <ul className="grid gap-1">{v.rx.map((r) => <li key={r.drugId}>{drug(r.drugId).name} × {r.qty}, {r.sig}</li>)}</ul>}
                {v.labs && v.labs.length > 0 && <p><span className="text-muted">Lab: </span>{v.labs.map((l) => `${labTest(l.testId).name}${l.result ? ` ${l.result} ${labTest(l.testId).unit}` : ' (pending)'}`).join(', ')}</p>}
                {v.referral && <p className="rounded-control bg-raised p-3"><b className="font-semibold">Referred</b> to {v.referral.to}, {v.referral.poli}. {v.referral.reason}</p>}
              </div>
            ) : <p className="text-[13.5px] text-muted">Not seen by the doctor yet.</p>}
          </Panel>
        </div>
        <div className="grid content-start gap-6">
          <Panel title="Bill">
            <dl className="grid gap-1.5 text-[13.5px]">
              <div className="flex justify-between"><dt className="text-muted">Clinic tariff</dt><dd className="tnum">{rp(b.gross)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">{PAYER[v.payer]} covers</dt><dd className="tnum">{rp(b.covered)}</dd></div>
              <div className="flex justify-between font-semibold"><dt>{v.paid ? 'Paid' : 'Due'}</dt><dd className="tnum">{rp(v.paid ? v.paid.amount : b.due)}</dd></div>
            </dl>
          </Panel>
          <Panel title="Sent to BPJS and SATUSEHAT" pad={false}>
            {vjobs.length === 0 ? <p className="p-4 text-[13.5px] text-muted">Sent automatically when the doctor signs. Nothing yet.</p> : (
              <ul>{vjobs.map((j) => <li key={j.id} className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5 text-[13.5px] last:border-0"><span><b className="font-medium">{SYNC[j.kind].target}</b> <span className="text-muted">{SYNC[j.kind].what}</span></span><StatePill state={j.state} /></li>)}</ul>
            )}
            {vjobs.some((j) => j.state === 'failed') && <Link to="/integrations" className="block border-t border-rule px-4 py-2.5 text-[13px] text-accent hover:underline">See why and fix</Link>}
          </Panel>
        </div>
      </div>
    </div>
  )
}
