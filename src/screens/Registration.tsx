import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircledIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, PlusIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { age, maskBpjs, maskNik, PAYER, POLI, STAFF, type Patient, type Payer, type Poli } from '@/data/clinic'
import { SCHEDULE } from '@/data/ops'
import { Field, Input, PageHead, Panel, PatientLine, PayerPill, Segmented, Select, Sheet, Textarea, Empty } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/misc'
import { cn } from '@/lib/utils'

type Check = 'idle' | 'checking' | 'active' | 'inactive' | 'other_fktp' | 'none'

export default function Registration() {
  const { patients, visits, register, checkIn, setPayer } = useStore()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Patient | null>(null)
  const [poli, setPoli] = useState<Poli>('umum')
  const [doctor, setDoctor] = useState('s3')
  const [payer, setPayerSel] = useState<Payer>('bpjs')
  const [complaint, setComplaint] = useState('')
  const [check, setCheck] = useState<Check>('idle')
  const [ticket, setTicket] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [tried, setTried] = useState(false)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/[\s-]/g, '')
    if (s.length < 2) return []
    return patients.filter((p) => p.name.toLowerCase().replace(/\s/g, '').includes(s) || p.nik.includes(s) || p.rm.toLowerCase().replace('-', '').includes(s) || p.bpjs?.no.includes(s)).slice(0, 6)
  }, [q, patients])

  // Choosing a patient runs the BPJS participant check, the way PCare would on the counter.
  useEffect(() => {
    if (!sel) return
    if (!sel.bpjs) { setCheck('none'); setPayerSel(sel.insurer ? 'asuransi' : 'umum'); return }
    setPayerSel('bpjs'); setCheck('checking')
    const t = setTimeout(() => setCheck(!sel.bpjs!.active ? 'inactive' : sel.bpjs!.fktp === 'other' ? 'other_fktp' : 'active'), 1100)
    return () => clearTimeout(t)
  }, [sel])

  const doctors = STAFF.filter((s) => s.role === 'doctor' && s.poli === poli)
  useEffect(() => { if (!doctors.find((d) => d.id === doctor)) setDoctor(doctors[0]?.id ?? '') }, [poli]) // eslint-disable-line react-hooks/exhaustive-deps
  const dow = new Date().getDay()
  const onDuty = (id: string) => SCHEDULE.find((s) => s.staffId === id)?.days.find((d) => d[0] === dow)
  const open = sel ? visits.find((v) => v.patientId === sel.id && v.stage !== 'done' && v.stage !== 'booked') : undefined
  const blocked = (payer === 'bpjs' && (check === 'inactive' || check === 'checking')) || !!open
  const booked = visits.filter((v) => v.stage === 'booked')
  const recent = visits.filter((v) => v.stage !== 'booked').sort((a, b) => a.arrivedMin - b.arrivedMin).slice(0, 6)
  const focusVisit = params.get('visit')

  const submit = () => {
    setTried(true)
    if (!sel || !complaint.trim() || blocked || !doctor) return
    const id = register({ patientId: sel.id, poli, doctorId: doctor, payer, complaint: complaint.trim() })
    setTicket(id); setSel(null); setQ(''); setComplaint(''); setCheck('idle'); setTried(false)
  }

  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Front desk" sub="Find the patient, confirm BPJS status, and give a queue number. Online bookings from Mobile JKN are checked in on the right." />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel title="New visit">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Field label="Patient">
                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
                  <Input value={q} onChange={(e) => { setQ(e.target.value); setSel(null) }} placeholder="Name, NIK (16 digits), BPJS number or RM" className="pl-9" aria-invalid={tried && !sel} />
                </div>
              </Field>
              {tried && !sel && <p className="text-[12.5px] font-medium text-negative">Choose a patient, or create a new record.</p>}
              {q.length >= 2 && !sel && (
                <ul className="overflow-hidden rounded-card border border-edge">
                  {results.map((p) => (
                    <li key={p.id} className="border-b border-rule last:border-0">
                      <button onClick={() => { setSel(p); setQ(p.name) }} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-raised">
                        <PatientLine p={p} sub={<>{p.sex === 'L' ? 'M' : 'F'}, {age(p.dob)} y · NIK {maskNik(p.nik)}</>} />
                        <span className="font-mono text-[12px] text-muted">{p.rm}</span>
                      </button>
                    </li>
                  ))}
                  <li><button onClick={() => setCreating(true)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13.5px] font-medium text-accent hover:bg-raised"><PlusIcon />{results.length ? 'Not here? Create a new medical record' : `No patient matches "${q}". Create a new medical record`}</button></li>
                </ul>
              )}
            </div>

            {sel && (
              <div className="grid gap-3 rounded-card bg-raised p-4 fd-in">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <PatientLine p={sel} />
                  <Link to={`/patients/${sel.id}`} className="text-[13px] text-accent hover:underline">Open record</Link>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-4">
                  <div><dt className="text-muted">NIK</dt><dd className="whitespace-nowrap font-mono text-[12.5px]">{maskNik(sel.nik)}</dd></div>
                  <div><dt className="text-muted">BPJS</dt><dd className="whitespace-nowrap font-mono text-[12.5px]">{sel.bpjs ? maskBpjs(sel.bpjs.no) : 'None'}</dd></div>
                  <div><dt className="text-muted">Class</dt><dd>{sel.bpjs ? `${sel.bpjs.class}, ${sel.bpjs.segment}` : '-'}</dd></div>
                  <div><dt className="text-muted">Allergies</dt><dd className={sel.allergies.length ? 'font-medium text-negative' : ''}>{sel.allergies.join(', ') || 'None known'}</dd></div>
                </dl>
                {open ? <p className="flex items-center gap-2 rounded-control bg-warn-bg p-3 text-[13px] text-warn-ink"><ExclamationTriangleIcon />Already in the clinic today as <Link to={`/visits/${open.id}`} className="font-semibold underline">{open.no}</Link>. One open visit per patient; add another clinic from that visit.</p> : <BpjsResult check={check} onSelfPay={() => setPayerSel('umum')} />}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Clinic">
                <Segmented label="Clinic" value={poli} onChange={setPoli} options={(Object.keys(POLI) as Poli[]).map((p) => ({ value: p, label: POLI[p].name }))} />
              </Field>
              <Field label="Doctor" hint={onDuty(doctor) ? `On duty today ${onDuty(doctor)![1]} to ${onDuty(doctor)![2]}` : 'Not on the schedule today: the patient may wait for the next session'}>
                <Select label="Doctor" value={doctor} onChange={setDoctor} options={doctors.map((d) => ({ value: d.id, label: d.name, hint: onDuty(d.id) ? `Today ${onDuty(d.id)![1]} to ${onDuty(d.id)![2]}` : 'Not on duty today' }))} />
              </Field>
            </div>
            <Field label="Who pays">
              <Segmented label="Who pays" value={payer} onChange={setPayerSel} options={(['bpjs', 'umum', 'asuransi'] as Payer[]).map((p) => ({ value: p, label: PAYER[p] }))} />
            </Field>
            <Field label="Main complaint" error={tried && !complaint.trim() ? 'Write the main complaint in the patient\'s words.' : undefined}>
              <Textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="For example: fever and cough for three days" />
            </Field>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" onClick={submit} disabled={blocked}>Register and print queue number</Button>
              {blocked && <span className="text-[13px] text-muted">{open ? 'This patient already has an open visit.' : check === 'checking' ? 'Waiting for BPJS to answer.' : 'BPJS is inactive: choose another payer or ask the patient to reactivate.'}</span>}
            </div>
          </div>
        </Panel>

        <div className="grid content-start gap-6">
          <Panel title={<span className="flex items-center gap-2">Booked on Mobile JKN<Pill>{booked.length}</Pill></span>} pad={false}>
            {booked.length === 0 ? <Empty title="No bookings waiting">Patients who book on Mobile JKN appear here with their queue number.</Empty> : (
              <ul>{booked.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3 last:border-0">
                  <span className="flex min-w-0 items-center gap-3"><span className="font-mono text-[13px] font-semibold">{v.no}</span><PatientLine p={patientOf(patients, v.patientId)} sub={<>{POLI[v.poli].name} · expected in {-v.arrivedMin} min</>} /></span>
                  <Button size="sm" onClick={() => checkIn(v.id)}>Check in</Button>
                </li>
              ))}</ul>
            )}
          </Panel>
          <Panel title="Arrivals today" pad={false}>
            <ul>{recent.map((v) => {
              const p = patientOf(patients, v.patientId)
              return (
                <li key={v.id} className={cn('flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5 last:border-0', focusVisit === v.id && 'bg-warn-bg/60')}>
                  <span className="flex min-w-0 items-center gap-3"><span className="w-12 font-mono text-[13px]">{v.no}</span><Link to={`/visits/${v.id}`} className="truncate text-[13.5px] font-medium hover:underline">{p.name}</Link></span>
                  <span className="flex items-center gap-2">
                    <PayerPill payer={v.payer} check={v.bpjsCheck} />
                    {v.payer === 'bpjs' && v.bpjsCheck === 'inactive' && <Button size="sm" onClick={() => setPayer(v.id, 'umum')}>Switch to self-pay</Button>}
                  </span>
                </li>
              )
            })}</ul>
          </Panel>
        </div>
      </div>

      <TicketSheet id={ticket} onClose={() => setTicket(null)} />
      <NewPatient open={creating} onOpenChange={setCreating} initialName={/\d/.test(q) ? '' : q} onCreated={(p) => { setSel(p); setQ(p.name); setCreating(false) }} />
    </div>
  )
}

function BpjsResult({ check, onSelfPay }: { check: Check; onSelfPay: () => void }) {
  if (check === 'idle' || check === 'none') return check === 'none' ? <p className="flex items-center gap-2 text-[13px] text-muted"><InfoCircledIcon />No BPJS number on file. Self-pay or insurance.</p> : null
  if (check === 'checking') return <p className="flex items-center gap-2 text-[13px] text-muted"><span className="size-3.5 rounded-full border-2 border-accent border-r-transparent fd-spin" />Checking participant status with BPJS PCare</p>
  if (check === 'active') return <p className="flex items-center gap-2 text-[13px] font-medium text-positive"><CheckCircledIcon />BPJS active, registered at this clinic. Capitation covers today&apos;s visit.</p>
  if (check === 'other_fktp') return (
    <div className="grid gap-2 rounded-control bg-warn-bg p-3 text-[13px] text-warn-ink">
      <p className="flex items-center gap-2 font-semibold"><ExclamationTriangleIcon />Registered at another FKTP</p>
      <p>BPJS covers this visit here only in an emergency, while travelling outside the home city, or with a referral from the patient&apos;s own FKTP. Otherwise it is self-pay.</p>
      <Button size="sm" className="justify-self-start" onClick={onSelfPay}>Register as self-pay</Button>
    </div>
  )
  return (
    <div className="grid gap-2 rounded-control bg-neg-bg p-3 text-[13px] text-neg-ink">
      <p className="flex items-center gap-2 font-semibold"><ExclamationTriangleIcon />BPJS inactive since 30 Sep</p>
      <p>Usually unpaid contributions. Offer self-pay for today and give the reactivation steps (pay arrears in Mobile JKN or at a BPJS office).</p>
      <Button size="sm" className="justify-self-start" onClick={onSelfPay}>Register as self-pay</Button>
    </div>
  )
}

function TicketSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { visit, patients } = useStore()
  const v = id ? visit(id) : undefined
  return (
    <Sheet open={!!v} onOpenChange={(o) => !o && onClose()} title="Queue number" description="Printed on the thermal printer at the desk.">
      {v && (
        <div className="grid justify-items-center gap-4 p-6">
          <div className="grid w-[280px] justify-items-center gap-1 rounded-card border border-dashed border-control px-6 py-6 text-center font-mono">
            <span className="text-[12px] text-muted">KLINIK PRATAMA KENANGA MEDIKA</span>
            <span className="text-[12px] text-muted">{POLI[v.poli].name} clinic</span>
            <span className="my-2 text-[48px] font-semibold leading-none tracking-[-0.04em]">{v.no}</span>
            <span className="text-[13px]">{patientOf(patients, v.patientId).name}</span>
            <span className="text-[12px] text-muted">{new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            <span className="mt-2 text-[11.5px] text-muted">Please wait to be called for vital signs.</span>
          </div>
          <div className="flex gap-2"><Button variant="primary" onClick={onClose}>Done</Button><Button asChild><Link to={`/visits/${v.id}`}>Open visit</Link></Button></div>
        </div>
      )}
    </Sheet>
  )
}

function NewPatient({ open, onOpenChange, onCreated, initialName }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (p: Patient) => void; initialName: string }) {
  const { addPatient } = useStore()
  const [f, setF] = useState({ name: '', nik: '', dob: '', sex: 'P' as 'L' | 'P', phone: '', address: '', bpjs: '' })
  const [tried, setTried] = useState(false)
  useEffect(() => { if (open) setF((x) => ({ ...x, name: initialName })) }, [open, initialName])
  const err = {
    name: f.name.trim().length < 3 ? 'Full name as on the KTP.' : '',
    nik: !/^\d{16}$/.test(f.nik) ? 'NIK has 16 digits.' : '',
    dob: !f.dob ? 'Date of birth is required.' : '',
    phone: f.phone.replace(/\D/g, '').length < 10 ? 'A mobile number for reminders.' : '',
    bpjs: f.bpjs && !/^\d{13}$/.test(f.bpjs) ? 'BPJS number has 13 digits.' : '',
  }
  const ok = Object.values(err).every((e) => !e)
  const save = () => {
    setTried(true); if (!ok) return
    const p = addPatient({ name: f.name.trim(), nik: f.nik, dob: f.dob, sex: f.sex, phone: f.phone, address: f.address, allergies: [], bpjs: f.bpjs ? { no: f.bpjs, class: 3, fktp: 'here', active: true, segment: 'PBPU' } : undefined })
    onCreated(p); setTried(false); setF({ name: '', nik: '', dob: '', sex: 'P', phone: '', address: '', bpjs: '' })
  }
  const E = (k: keyof typeof err) => (tried ? err[k] || undefined : undefined)
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="New medical record" description="Identity follows the KTP. The national patient ID (IHS) is fetched from SATUSEHAT with the NIK.">
      <div className="grid gap-4 p-5">
        <Field label="Full name" error={E('name')}><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!E('name')} /></Field>
        <Field label="NIK" error={E('nik')} hint="16 digits from the KTP or family card"><Input inputMode="numeric" maxLength={16} value={f.nik} onChange={(e) => setF({ ...f, nik: e.target.value.replace(/\D/g, '') })} className="font-mono" aria-invalid={!!E('nik')} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date of birth" error={E('dob')}><Input type="date" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} aria-invalid={!!E('dob')} /></Field>
          <Field label="Sex"><Segmented label="Sex" value={f.sex} onChange={(v) => setF({ ...f, sex: v })} options={[{ value: 'P', label: 'Female' }, { value: 'L', label: 'Male' }]} /></Field>
        </div>
        <Field label="Mobile number" error={E('phone')}><Input inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="08xx" aria-invalid={!!E('phone')} /></Field>
        <Field label="Address"><Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="Street, kelurahan, kecamatan" /></Field>
        <Field label="BPJS number (optional)" error={E('bpjs')}><Input inputMode="numeric" maxLength={13} value={f.bpjs} onChange={(e) => setF({ ...f, bpjs: e.target.value.replace(/\D/g, '') })} className="font-mono" aria-invalid={!!E('bpjs')} /></Field>
        <p className="rounded-control bg-raised p-3 text-[12.5px] text-muted">Consent to treatment and to sharing the record with SATUSEHAT is signed at the desk and stored with the record.</p>
        <div className="flex gap-2"><Button variant="primary" onClick={save}>Create record</Button><Button onClick={() => onOpenChange(false)}>Cancel</Button></div>
      </div>
    </Sheet>
  )
}
