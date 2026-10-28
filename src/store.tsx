import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AS, PATIENTS, type Patient, type Payer, type Poli, type Role, staff } from '@/data/clinic'
import { DRUGS, type Drug } from '@/data/pharmacy'
import { VISITS, type LabOrder, type RxLine, type Stage, type Visit, type Vitals } from '@/data/visits'
import { ASA, JOBS, type AsaTask, type SyncJob, type SyncKind } from '@/data/ops'

// Client-side stand-in for the API. Writes are optimistic, then confirmed; anything that talks to
// BPJS or SATUSEHAT is a background job with its own state. Timings are short so every state shows.
export const SEND_MS = 1200
export const UNDO_MS = 8000

export type LogEntry = { id: string; at: number; who: string; verb: string; object: string; result: 'ok' | 'failed' | 'asked' | 'undone'; link?: string }
type Toast = { id: number; text: string; tone?: 'ok' | 'err'; undo?: () => void }

type Ctx = {
  role: Role; setRole: (r: Role) => void; me: ReturnType<typeof staff>
  visits: Visit[]; patients: Patient[]; drugs: Drug[]; jobs: SyncJob[]; asa: AsaTask[]; log: LogEntry[]; toasts: Toast[]
  visit: (id: string) => Visit | undefined
  register: (p: { patientId: string; poli: Poli; doctorId: string; payer: Payer; complaint: string }) => string
  checkIn: (id: string) => void
  setPayer: (id: string, payer: Payer) => void
  saveVitals: (id: string, v: Vitals) => void
  callNext: (doctorId: string) => string | undefined
  finishConsult: (id: string, d: { soap: Visit['soap']; dx: string[]; rx: RxLine[]; labs: LabOrder[]; referral?: Visit['referral']; services: string[] }) => void
  saveLab: (id: string, labs: LabOrder[]) => void
  dispense: (id: string) => void
  pay: (id: string, method: NonNullable<Visit['paid']>['method'], amount: number) => void
  retryJob: (id: string) => void
  decideAsa: (id: string, decision: 'approve' | 'decline' | 'mine') => void
  addPatient: (p: Omit<Patient, 'id' | 'rm'>) => Patient
  setIhs: (staffId: string, ihs: string) => void
  addLog: (e: Omit<LogEntry, 'id' | 'at'>) => void
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}
const C = createContext<Ctx | null>(null)
let seq = 1
const now = () => Date.now()

const START_LOG: LogEntry[] = [
  { id: 'l1', at: now() - 5 * 60000, who: 'Asa', verb: 'checked BPJS status for', object: '20 arrivals (18 active, 1 inactive, 1 other FKTP)', result: 'ok' },
  { id: 'l2', at: now() - 6 * 60000, who: 'dr. Rina Kusumawati', verb: 'finished the consultation of', object: 'Rahmat Hidayat (A-009)', result: 'ok', link: '/visits/K-26052' },
  { id: 'l3', at: now() - 17 * 60000, who: 'Asa', verb: 'asked the front desk about', object: 'inactive BPJS for Wahyu Pratama', result: 'asked', link: '/asa' },
  { id: 'l4', at: now() - 40 * 60000, who: 'Asa', verb: 'asked the pharmacist about', object: 'a purchase order for Amoxicillin 500 mg', result: 'asked', link: '/asa' },
  { id: 'l5', at: now() - 62 * 60000, who: 'Asa', verb: 'asked to message', object: '12 Prolanis patients due this week', result: 'asked', link: '/asa' },
  { id: 'l6', at: now() - 196 * 60000, who: 'Asa', verb: 'sent', object: '14 finished visits to PCare and SATUSEHAT', result: 'ok', link: '/integrations' },
  { id: 'l7', at: now() - 226 * 60000, who: 'Asa', verb: 'could not send', object: 'the dental encounter of Hadi Gunawan (no practitioner IHS number)', result: 'failed', link: '/integrations' },
  { id: 'l8', at: now() - 300 * 60000, who: 'Bdn. Sri Wahyuni', verb: 'finished the antenatal visit of', object: 'Indah Permata (C-001)', result: 'ok' },
]

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => { try { return (localStorage.getItem('rw-role') as Role) || 'manager' } catch { return 'manager' } })
  const [visits, setVisits] = useState<Visit[]>(VISITS)
  const [patients, setPatients] = useState<Patient[]>(PATIENTS)
  const [drugs, setDrugs] = useState<Drug[]>(DRUGS)
  const [jobs, setJobs] = useState<SyncJob[]>(JOBS)
  const [asa, setAsa] = useState<AsaTask[]>(ASA)
  const [log, setLog] = useState<LogEntry[]>(START_LOG)
  const [toasts, setToasts] = useState<Toast[]>([])
  const vRef = useRef(visits); vRef.current = visits

  const setRole = (r: Role) => { setRoleState(r); try { localStorage.setItem('rw-role', r) } catch { /* private mode */ } }
  const me = staff(AS[role])
  const addLog = useCallback((e: Omit<LogEntry, 'id' | 'at'>) => setLog((l) => [{ id: `n${seq++}`, at: now(), ...e }, ...l]), [])
  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = now() + Math.random()
    setToasts((ts) => [...ts.slice(-2), { id, ...t }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), t.undo ? UNDO_MS : 4500)
  }, [])
  const patchVisit = (id: string, p: Partial<Visit>) => setVisits((vs) => vs.map((v) => (v.id === id ? { ...v, ...p } : v)))
  const move = (id: string, stage: Stage) => patchVisit(id, { stage, stageMin: 0 })
  const visit = useCallback((id: string) => visits.find((v) => v.id === id), [visits])
  const pName = (id: string) => vRef.current.find((v) => v.id === id) && patients.find((p) => p.id === vRef.current.find((v) => v.id === id)!.patientId)?.name

  // Jobs: queued -> running -> done, or failed for the known broken case (dental IHS number).
  const enqueue = (kind: SyncKind, visitId: string, fail?: SyncJob['error']) => {
    const id = `J-${9500 + seq++}`
    setJobs((js) => [{ id, kind, visitId, state: 'running', attempts: 1, min: 0 }, ...js])
    setTimeout(() => setJobs((js) => js.map((x) => (x.id === id ? { ...x, state: fail ? 'failed' : 'done', error: fail } : x))), 1400 + Math.random() * 1600)
  }

  // The clock: minutes in station grow, and bookings arrive on time.
  useEffect(() => {
    const t = setInterval(() => setVisits((vs) => vs.map((v) => (v.stage === 'done' || v.stage === 'booked' ? v : { ...v, stageMin: v.stageMin + 1, arrivedMin: v.arrivedMin + 1 }))), 60000)
    return () => clearInterval(t)
  }, [])

  const memberCheck = (visitId: string, patientId: string) => {
    const p = patients.find((x) => x.id === patientId)
    patchVisit(visitId, { bpjsCheck: 'pending' })
    enqueue('pcare_member', visitId)
    setTimeout(() => patchVisit(visitId, { bpjsCheck: !p?.bpjs ? undefined : !p.bpjs.active ? 'inactive' : p.bpjs.fktp === 'other' ? 'other_fktp' : 'active' }), 1500)
  }

  const register: Ctx['register'] = (r) => {
    const prefix = r.poli === 'gigi' ? 'B' : r.poli === 'kia' ? 'C' : 'A'
    const poliCount = Math.max(0, ...vRef.current.filter((v) => v.no.startsWith(prefix)).map((v) => parseInt(v.no.slice(2)))) + 1
    const id = `K-${26100 + seq++}`
    const no = `${prefix}-${String(poliCount).padStart(3, '0')}`
    setVisits((vs) => [...vs, { id, no, ...r, source: 'walkin', arrivedMin: 0, stageMin: 0, stage: 'vitals' }])
    if (r.payer === 'bpjs') memberCheck(id, r.patientId)
    addLog({ who: me.name, verb: 'registered', object: `${patients.find((p) => p.id === r.patientId)?.name} (${no})`, result: 'ok', link: `/visits/${id}` })
    toast({ text: `Registered. Queue number ${no}.` })
    return id
  }
  const checkIn = (id: string) => {
    const v = visit(id); if (!v) return
    patchVisit(id, { stage: 'vitals', stageMin: 0, arrivedMin: 0 })
    if (v.payer === 'bpjs') memberCheck(id, v.patientId)
    enqueue('mjkn_queue', id)
    addLog({ who: me.name, verb: 'checked in', object: `${pName(id)} (${v.no}), booked on Mobile JKN`, result: 'ok', link: `/visits/${id}` })
    toast({ text: `${pName(id)} checked in. Mobile JKN updated.` })
  }
  const setPayer = (id: string, payer: Visit['payer']) => {
    patchVisit(id, { payer, bpjsCheck: payer === 'bpjs' ? visit(id)?.bpjsCheck : undefined })
    addLog({ who: me.name, verb: 'changed payer to', object: `${payer === 'umum' ? 'Self-pay' : payer} for ${pName(id)}`, result: 'ok', link: `/visits/${id}` })
  }
  const saveVitals = (id: string, vit: Vitals) => {
    patchVisit(id, { vitals: vit, stage: 'doctor_queue', stageMin: 0 })
    addLog({ who: me.name, verb: 'recorded vital signs for', object: `${pName(id)}${vit.triage === 'red' ? ', triage RED' : ''}`, result: 'ok', link: `/visits/${id}` })
    toast({ text: vit.triage === 'red' ? 'Saved. Triage red: moved to the front of the doctor queue.' : 'Saved. Patient is in the doctor queue.' })
  }
  const callNext = (doctorId: string) => {
    const q = vRef.current.filter((v) => v.doctorId === doctorId && v.stage === 'doctor_queue')
      .sort((a, b) => (a.vitals?.triage === 'red' ? -1 : 0) - (b.vitals?.triage === 'red' ? -1 : 0) || b.stageMin - a.stageMin)
    const next = q[0]; if (!next) return undefined
    move(next.id, 'consult')
    enqueue('mjkn_queue', next.id)
    addLog({ who: staff(doctorId).name, verb: 'called', object: `${pName(next.id)} (${next.no})`, result: 'ok', link: `/visits/${next.id}` })
    return next.id
  }
  const finishConsult: Ctx['finishConsult'] = (id, d) => {
    const v = visit(id); if (!v) return
    const pendingLabs = d.labs.some((l) => !l.result)
    const next: Stage = pendingLabs ? 'lab' : d.rx.length ? 'pharmacy' : 'cashier'
    patchVisit(id, { soap: d.soap, dx: d.dx, rx: d.rx, labs: d.labs, referral: d.referral, services: d.services, stage: next, stageMin: 0 })
    if (!pendingLabs) {
      if (v.payer === 'bpjs') { enqueue('pcare_visit', id); if (d.referral) enqueue('pcare_referral', id) }
      const noIhs = staff(v.doctorId).ihs === null
      const err = noIhs ? { code: 'PRACTITIONER_NOT_FOUND', message: `Practitioner reference is empty: ${staff(v.doctorId).name} has no IHS number on file.`, fix: 'Add the IHS number in Settings, Staff, then retry.' } : undefined
      enqueue('ss_encounter', id, err); if (d.dx.length) enqueue('ss_condition', id, err); if (v.vitals) enqueue('ss_observation', id, err); if (d.rx.length) enqueue('ss_medication', id, err)
    }
    addLog({ who: staff(v.doctorId).name, verb: 'finished the consultation of', object: `${pName(id)} (${v.no})${d.referral ? `, referred to ${d.referral.to}` : ''}`, result: 'ok', link: `/visits/${id}` })
    toast({ text: pendingLabs ? 'Signed. Lab orders sent.' : d.rx.length ? 'Signed. Prescription sent to the pharmacy.' : 'Signed. Patient goes to the cashier.' })
  }
  const saveLab = (id: string, labs: LabOrder[]) => {
    patchVisit(id, { labs, stage: 'consult', stageMin: 0 })
    addLog({ who: me.name, verb: 'entered lab results for', object: `${pName(id)}${labs.some((l) => l.flag) ? ', with flagged values' : ''}`, result: 'ok', link: `/visits/${id}` })
    toast({ text: 'Results saved. The doctor sees them now.' })
  }
  const dispense = (id: string) => {
    const v = visit(id); if (!v?.rx) return
    // Take each line from batches in expiry order (FEFO).
    setDrugs((ds) => ds.map((d) => {
      const line = v.rx!.find((r) => r.drugId === d.id); if (!line) return d
      let need = line.qty
      const batches = [...d.batches].sort((a, b) => a.exp.localeCompare(b.exp)).map((b) => { const take = Math.min(b.qty, need); need -= take; return { ...b, qty: b.qty - take } })
      return { ...d, batches }
    }))
    move(id, 'cashier')
    addLog({ who: me.name, verb: 'dispensed', object: `${v.rx.length} items for ${pName(id)} (${v.no})`, result: 'ok', link: `/visits/${id}` })
    toast({ text: 'Dispensed and counselled. Stock updated, earliest batches first.' })
  }
  const pay: Ctx['pay'] = (id, method, amount) => {
    const v = visit(id); if (!v) return
    patchVisit(id, { paid: { method, amount }, stage: 'done', stageMin: 0 })
    enqueue('mjkn_queue', id)
    addLog({ who: me.name, verb: method === 'capitation' ? 'closed (covered by capitation)' : method === 'claim' ? 'closed and queued a claim for' : 'received payment for', object: `${pName(id)} (${v.no})`, result: 'ok', link: `/visits/${id}` })
    toast({ text: method === 'capitation' ? 'Closed. Nothing to pay.' : method === 'claim' ? 'Closed. Claim queued.' : 'Paid. Receipt printed.' })
  }
  const retryJob = (id: string) => {
    const j = jobs.find((x) => x.id === id); if (!j) return
    setJobs((js) => js.map((x) => (x.id === id ? { ...x, state: 'running', attempts: x.attempts + 1 } : x)))
    const stillBroken = j.error?.code === 'PRACTITIONER_NOT_FOUND' && staff('s5').ihs === null
    setTimeout(() => {
      setJobs((js) => js.map((x) => (x.id === id ? { ...x, state: stillBroken ? 'failed' : 'done', error: stillBroken ? x.error : undefined } : x)))
      if (!stillBroken && j.error?.code === 'PRACTITIONER_NOT_FOUND') setAsa((a) => a.map((x) => (x.id === 'AS-310' ? { ...x, state: 'done', title: 'Dental encounters sent to SATUSEHAT', detail: 'The IHS number was added and the failed encounters went through on retry.' } : x)))
    }, 1600)
    addLog({ who: me.name, verb: 'retried', object: `${id} to ${j.kind.startsWith('ss') ? 'SATUSEHAT' : 'BPJS'}`, result: 'ok', link: '/integrations' })
  }
  const decideAsa: Ctx['decideAsa'] = (id, decision) => {
    const t = asa.find((x) => x.id === id); if (!t) return
    if (decision === 'approve') {
      setAsa((a) => a.map((x) => (x.id === id ? { ...x, state: 'approving' } : x)))
      setTimeout(() => {
        setAsa((a) => a.map((x) => (x.id === id ? { ...x, state: 'done' } : x)))
        if (id === 'AS-311') setPayer('K-26060', 'umum')
        addLog({ who: me.name, verb: 'approved', object: `${t.proposal}`, result: 'ok', link: '/asa' })
        toast({ text: `Done: ${t.title}`, undo: () => { setAsa((a) => a.map((x) => (x.id === id ? { ...x, state: 'needs_review' } : x))); addLog({ who: me.name, verb: 'undid', object: t.title, result: 'undone' }) } })
      }, SEND_MS)
    } else {
      setAsa((a) => a.map((x) => (x.id === id ? { ...x, state: decision === 'decline' ? 'cancelled' : 'needs_review', title: decision === 'mine' ? `${t.title} (taken by ${me.name})` : t.title } : x)))
      addLog({ who: me.name, verb: decision === 'decline' ? 'declined' : 'took over', object: t.title, result: 'ok', link: '/asa' })
      toast({ text: decision === 'decline' ? 'Declined. Asa will not ask again today.' : 'It is yours. Asa will not act on it.' })
    }
  }
  const addPatient: Ctx['addPatient'] = (p) => {
    const np: Patient = { ...p, id: `p${100 + seq++}`, rm: `RM-0${24130 + seq}` }
    setPatients((ps) => [...ps, np])
    addLog({ who: me.name, verb: 'created a medical record for', object: np.name, result: 'ok' })
    return np
  }

  // Staff master data lives in the module (a prototype stand-in for the staff table).
  const setIhs = (staffId: string, ihs: string) => {
    const s = staff(staffId); s.ihs = ihs
    addLog({ who: me.name, verb: 'added the IHS number for', object: s.name, result: 'ok', link: '/settings' })
    toast({ text: `${s.name} can now be referenced in SATUSEHAT. Retry the failed jobs.` })
  }

  const value: Ctx = { role, setRole, me, visits, patients, drugs, jobs, asa, log, toasts, visit, register, checkIn, setPayer, saveVitals, callNext, finishConsult, saveLab, dispense, pay, retryJob, decideAsa, addPatient, setIhs, addLog, toast, dismiss: (id) => setToasts((ts) => ts.filter((x) => x.id !== id)) }
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useStore() {
  const c = useContext(C)
  if (!c) throw new Error('useStore outside StoreProvider')
  return c
}
export const patientOf = (ps: Patient[], id: string) => ps.find((p) => p.id === id)!
