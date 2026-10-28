import { CLINIC } from './clinic'

// Background jobs that talk to BPJS (PCare, antrean Mobile JKN) and SATUSEHAT. Each is retried with
// growing waits and, when it cannot recover, becomes a task for a person.
export type JobState = 'queued' | 'running' | 'waiting' | 'needs_review' | 'approving' | 'failed' | 'done' | 'cancelled'
export type SyncKind = 'pcare_visit' | 'pcare_member' | 'mjkn_queue' | 'ss_encounter' | 'ss_condition' | 'ss_observation' | 'ss_medication' | 'pcare_referral'
export const SYNC: Record<SyncKind, { target: 'BPJS PCare' | 'Mobile JKN' | 'SATUSEHAT'; what: string }> = {
  pcare_visit: { target: 'BPJS PCare', what: 'Visit and diagnosis' },
  pcare_member: { target: 'BPJS PCare', what: 'Participant status' },
  pcare_referral: { target: 'BPJS PCare', what: 'Referral to hospital' },
  mjkn_queue: { target: 'Mobile JKN', what: 'Queue status update' },
  ss_encounter: { target: 'SATUSEHAT', what: 'Encounter' },
  ss_condition: { target: 'SATUSEHAT', what: 'Condition (ICD-10)' },
  ss_observation: { target: 'SATUSEHAT', what: 'Observation (vital signs)' },
  ss_medication: { target: 'SATUSEHAT', what: 'MedicationRequest' },
}
export type SyncJob = { id: string; kind: SyncKind; visitId: string; state: JobState; attempts: number; min: number; error?: { code: string; message: string; fix: string } }

let n = 9100
const j = (kind: SyncKind, visitId: string, state: JobState, min: number, attempts = 1, error?: SyncJob['error']): SyncJob => ({ id: `J-${n++}`, kind, visitId, state, attempts, min, error })
const IHS_MISSING = { code: 'PRACTITIONER_NOT_FOUND', message: 'Practitioner reference is empty: drg. Maya Lestari has no IHS number on file.', fix: 'Add her IHS number in Settings, Staff. It can be looked up on SATUSEHAT SDMK with her NIK.' }

export const JOBS: SyncJob[] = [
  j('pcare_visit', 'K-26041', 'done', 285), j('ss_encounter', 'K-26041', 'done', 284), j('ss_condition', 'K-26041', 'done', 284), j('ss_observation', 'K-26041', 'done', 284), j('ss_medication', 'K-26041', 'done', 284),
  j('pcare_visit', 'K-26042', 'done', 246), j('ss_encounter', 'K-26042', 'done', 245), j('ss_condition', 'K-26042', 'done', 245), j('ss_medication', 'K-26042', 'done', 245),
  j('ss_encounter', 'K-26043', 'failed', 228, 3, IHS_MISSING),
  j('ss_condition', 'K-26043', 'queued', 228),
  j('pcare_visit', 'K-26044', 'done', 206), j('ss_encounter', 'K-26044', 'done', 205), j('ss_observation', 'K-26044', 'done', 205),
  j('ss_encounter', 'K-26045', 'done', 198), j('ss_condition', 'K-26045', 'done', 198),
  j('pcare_member', 'K-26060', 'done', 18), j('pcare_member', 'K-26062', 'done', 6),
  j('mjkn_queue', 'K-26052', 'done', 6), j('mjkn_queue', 'K-26054', 'done', 9), j('mjkn_queue', 'K-26057', 'done', 14),
  j('pcare_visit', 'K-26054', 'running', 1),
  j('pcare_member', 'K-26065', 'failed', 3, 4, { code: 'PCARE_TIMEOUT', message: 'PCare did not answer within 30 seconds (4 attempts).', fix: 'Retries by itself every 5 minutes. Check status on arrival if it still fails.' }),
  j('pcare_member', 'K-26066', 'queued', 0),
]

// Asa is the clinic's AI assistant. It works in the background and asks people where a rule says so.
export type AsaTask = { id: string; title: string; detail: string; module: string; link: string; state: JobState; risk: 'low' | 'medium' | 'high'; rule: string; proposal?: string; effects?: string[]; min: number }
export const ASA: AsaTask[] = [
  { id: 'AS-311', title: 'Wahyu Pratama\'s BPJS is inactive', detail: 'PCare says his participation (PBPU, class 1) is inactive since 30 Sep, likely unpaid contributions. He is waiting for vitals now.', module: 'Front desk', link: '/registration?visit=K-26060', state: 'needs_review', risk: 'high', rule: 'Ask before changing how a patient pays', proposal: 'Tell the front desk to offer self-pay for today and print the BPJS reactivation steps', effects: ['Visit payer set to Self-pay after the patient agrees', 'Leaflet with reactivation steps printed at the counter'], min: 17 },
  { id: 'AS-310', title: 'SATUSEHAT rejected 1 dental encounter', detail: 'drg. Maya Lestari has no IHS number, so the encounter for Hadi Gunawan could not be sent. Every dental visit today will fail the same way.', module: 'Integrations', link: '/integrations', state: 'failed', risk: 'medium', rule: 'Stop and ask when the same error repeats', min: 226 },
  { id: 'AS-309', title: 'Amoxicillin 500 mg below minimum', detail: '270 capsules left, minimum is 400. At this week\'s pace (about 60 a day) it runs out on Monday.', module: 'Inventory', link: '/inventory?drug=d02', state: 'needs_review', risk: 'medium', rule: 'Ask before creating a purchase order', proposal: 'Draft a purchase order for 1,000 capsules from PBF Kimia Farma Trading (last price Rp 620)', effects: ['Purchase order PO-0412 created as a draft', 'Sent to the pharmacist for approval'], min: 40 },
  { id: 'AS-308', title: 'Oralit batch ORL2401A expires in 18 days', detail: '40 sachets left in the batch that expires first. They are picked first already (FEFO).', module: 'Inventory', link: '/inventory?drug=d07', state: 'done', risk: 'low', rule: 'Do it: flag near-expiry batches', min: 95 },
  { id: 'AS-307', title: '12 Prolanis patients are due this week', detail: 'Hypertension and diabetes participants whose monthly control is due by Saturday and who have not booked.', module: 'Patients', link: '/patients?filter=prolanis', state: 'needs_review', risk: 'medium', rule: 'Ask before messaging patients', proposal: 'Send each a reminder text with a Mobile JKN booking link', effects: ['12 text messages sent', 'Replies appear in Patient messages'], min: 62 },
  { id: 'AS-306', title: 'Checked BPJS status for 20 arrivals', detail: '18 active, 1 inactive (Wahyu Pratama), 1 registered at another FKTP (Eko Prasetyo).', module: 'Front desk', link: '/registration', state: 'done', risk: 'low', rule: 'Do it: check participant status on arrival', min: 5 },
  { id: 'AS-305', title: 'Sent 14 visits to PCare and SATUSEHAT', detail: 'All visits finished before 10:00. One dental encounter failed (see AS-310).', module: 'Integrations', link: '/integrations', state: 'done', risk: 'low', rule: 'Do it: sync finished visits', min: 196 },
]

// This month so far, for Reports and the KBK panel (Kapitasi Berbasis Kinerja). Targets from BPJS:
// contact rate ≥ 150 per mille, non-specialist referral ratio ≤ 2%, controlled Prolanis ratio ≥ 5%.
export const MONTH = {
  label: 'October 2026',
  dayOfMonth: 28,
  contacts: 1192, // participants with at least one contact (visit, home visit, phone consultation)
  referrals: 31, referralsNonSpecialist: 4, visitsBpjs: 1480,
  prolanis: 214, prolanisControlled: 9,
  visitsByPayer: { bpjs: 1480, umum: 402, asuransi: 96 },
  revenue: { capitation: CLINIC.registeredBpjs * CLINIC.capitationRate, nonCapitation: 18450000, umum: 61230000, asuransi: 14880000 },
  waitP50: 34, waitP90: 71,
}
export const KBK = {
  ak: (MONTH.contacts / CLINIC.registeredBpjs) * 1000,
  rrns: (MONTH.referralsNonSpecialist / MONTH.visitsBpjs) * 100,
  rppt: (MONTH.prolanisControlled / MONTH.prolanis) * 100,
}

// Last 14 days: visits per day and median wait (minutes from registration to doctor).
export const DAYS = [
  [62, 31], [71, 36], [0, 0], [66, 33], [74, 41], [69, 35], [58, 29], [77, 44], [0, 0], [64, 32], [70, 37], [72, 39], [67, 33], [75, 38],
].map(([visits, wait], i) => ({ i, visits, wait }))

export const TOP_DX = [
  { code: 'J06.9', n: 312 }, { code: 'I10', n: 268 }, { code: 'K30', n: 141 }, { code: 'E11.9', n: 133 }, { code: 'A09', n: 97 },
  { code: 'M79.1', n: 88 }, { code: 'L30.9', n: 64 }, { code: 'K04.0', n: 51 }, { code: 'Z34.9', n: 48 }, { code: 'R51', n: 39 },
]

// The week's practice schedule (also published to Mobile JKN so patients can book).
export const SCHEDULE = [
  { staffId: 's3', days: [[1, '07:00', '13:00'], [2, '07:00', '13:00'], [3, '07:00', '13:00'], [4, '07:00', '13:00'], [5, '07:00', '11:30'], [6, '07:00', '12:00']], quota: 40 },
  { staffId: 's4', days: [[1, '13:00', '21:00'], [2, '13:00', '21:00'], [3, '08:00', '14:00'], [4, '13:00', '21:00'], [5, '13:00', '21:00']], quota: 40 },
  { staffId: 's5', days: [[1, '09:00', '15:00'], [3, '09:00', '15:00'], [5, '13:00', '19:00'], [6, '08:00', '12:00']], quota: 16 },
  { staffId: 's6', days: [[1, '08:00', '14:00'], [2, '08:00', '14:00'], [4, '08:00', '14:00'], [6, '08:00', '12:00']], quota: 20 },
] as { staffId: string; days: [number, string, string][]; quota: number }[]

export const PO = [
  { id: 'PO-0409', supplier: 'PBF Kimia Farma Trading', items: 4, total: 2840000, state: 'received' as const, date: '21 Oct' },
  { id: 'PO-0410', supplier: 'PBF Anugrah Argon Medica', items: 2, total: 1325000, state: 'sent' as const, date: '25 Oct' },
  { id: 'PO-0411', supplier: 'PBF Kimia Farma Trading', items: 3, total: 980000, state: 'draft' as const, date: '27 Oct' },
]
