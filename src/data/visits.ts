import type { Payer, Poli } from './clinic'

// Where a patient is on the clinic floor. Every screen that shows a visit uses these stations.
export type Stage = 'booked' | 'vitals' | 'doctor_queue' | 'consult' | 'lab' | 'pharmacy' | 'cashier' | 'done'
export const STAGES: { id: Stage; name: string; short: string }[] = [
  { id: 'booked', name: 'Booked online', short: 'Booked' },
  { id: 'vitals', name: 'Waiting for vitals', short: 'Vitals' },
  { id: 'doctor_queue', name: 'Waiting for doctor', short: 'Doctor queue' },
  { id: 'consult', name: 'With the doctor', short: 'With doctor' },
  { id: 'lab', name: 'Lab', short: 'Lab' },
  { id: 'pharmacy', name: 'Pharmacy', short: 'Pharmacy' },
  { id: 'cashier', name: 'Cashier', short: 'Cashier' },
  { id: 'done', name: 'Finished', short: 'Done' },
]
export const stageName = (s: Stage) => STAGES.find((x) => x.id === s)!.name

export type Vitals = { sys: number; dia: number; hr: number; rr: number; temp: number; spo2: number; weight: number; height: number; pain: number; triage: 'green' | 'yellow' | 'red' }
export type RxLine = { drugId: string; qty: number; sig: string; days: number }
export type LabOrder = { testId: string; result?: string; flag?: 'H' | 'L' | null }

export type Visit = {
  id: string; no: string; patientId: string; poli: Poli; doctorId: string; payer: Payer; source: 'walkin' | 'mobilejkn'
  complaint: string; arrivedMin: number; stageMin: number; stage: Stage
  bpjsCheck?: 'active' | 'inactive' | 'other_fktp' | 'pending'
  vitals?: Vitals
  soap?: { s: string; o: string; a: string; p: string }
  dx?: string[]; rx?: RxLine[]; labs?: LabOrder[]; services?: string[]
  referral?: { to: string; poli: string; reason: string; dx: string }
  paid?: { method: 'cash' | 'qris' | 'debit' | 'claim' | 'capitation'; amount: number }
}

const v = (x: Visit) => x
export const VISITS: Visit[] = [
  // Finished this morning
  v({ id: 'K-26041', no: 'A-001', patientId: 'p17', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'mobilejkn', complaint: 'Monthly hypertension control, Prolanis', arrivedMin: 352, stageMin: 290, stage: 'done', bpjsCheck: 'active',
    vitals: { sys: 138, dia: 86, hr: 78, rr: 18, temp: 36.6, spo2: 98, weight: 61, height: 152, pain: 0, triage: 'green' },
    soap: { s: 'No complaints. Takes amlodipine daily.', o: 'BP 138/86, HR 78.', a: 'Essential hypertension, controlled.', p: 'Continue amlodipine 10 mg, 30 days. Low-salt diet. Return in 30 days.' }, dx: ['I10'], rx: [{ drugId: 'd03', qty: 30, sig: '1 × 1 in the morning', days: 30 }], paid: { method: 'capitation', amount: 0 } }),
  v({ id: 'K-26042', no: 'A-002', patientId: 'p07', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'walkin', complaint: 'Dizzy since yesterday', arrivedMin: 330, stageMin: 250, stage: 'done', bpjsCheck: 'active',
    vitals: { sys: 162, dia: 98, hr: 88, rr: 20, temp: 36.8, spo2: 97, weight: 70, height: 165, pain: 2, triage: 'yellow' },
    soap: { s: 'Dizziness, mild headache. Missed medication 3 days.', o: 'BP 162/98.', a: 'Essential hypertension, uncontrolled due to missed doses.', p: 'Restart captopril 25 mg 2×1. Education on adherence. Return in 7 days.' }, dx: ['I10', 'R51'], rx: [{ drugId: 'd09', qty: 14, sig: '2 × 1', days: 7 }, { drugId: 'd01', qty: 10, sig: '3 × 1 if headache', days: 3 }], paid: { method: 'capitation', amount: 0 } }),
  v({ id: 'K-26043', no: 'B-001', patientId: 'p13', poli: 'gigi', doctorId: 's5', payer: 'umum', source: 'walkin', complaint: 'Toothache lower right', arrivedMin: 318, stageMin: 230, stage: 'done',
    soap: { s: 'Throbbing pain lower right molar, 3 days.', o: 'Deep caries 46, percussion positive.', a: 'Pulpitis 46.', p: 'Open access, dressing. Ibuprofen. Return in 3 days.' }, dx: ['K04.0'], rx: [{ drugId: 'd11', qty: 10, sig: '3 × 1 after meals', days: 3 }], services: ['t02'], paid: { method: 'qris', amount: 88500 } }),
  v({ id: 'K-26044', no: 'C-001', patientId: 'p14', poli: 'kia', doctorId: 's6', payer: 'bpjs', source: 'mobilejkn', complaint: 'Antenatal check, 24 weeks', arrivedMin: 300, stageMin: 210, stage: 'done', bpjsCheck: 'active',
    vitals: { sys: 112, dia: 72, hr: 84, rr: 18, temp: 36.7, spo2: 99, weight: 58, height: 156, pain: 0, triage: 'green' },
    dx: ['Z34.9'], rx: [{ drugId: 'd16', qty: 30, sig: '1 × 1', days: 30 }], services: ['t07'], paid: { method: 'claim', amount: 0 } }),
  v({ id: 'K-26045', no: 'A-003', patientId: 'p05', poli: 'umum', doctorId: 's4', payer: 'asuransi', source: 'walkin', complaint: 'Cough and runny nose 4 days', arrivedMin: 286, stageMin: 200, stage: 'done',
    vitals: { sys: 124, dia: 80, hr: 82, rr: 20, temp: 37.4, spo2: 98, weight: 76, height: 170, pain: 1, triage: 'green' },
    dx: ['J06.9'], rx: [{ drugId: 'd01', qty: 10, sig: '3 × 1 if fever', days: 3 }, { drugId: 'd05', qty: 7, sig: '1 × 1 at night', days: 7 }], services: ['t01'], paid: { method: 'claim', amount: 80800 } }),

  // On the floor now
  v({ id: 'K-26052', no: 'A-009', patientId: 'p01', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'mobilejkn', complaint: 'Prolanis control, headache in the mornings', arrivedMin: 64, stageMin: 6, stage: 'cashier', bpjsCheck: 'active',
    vitals: { sys: 148, dia: 92, hr: 80, rr: 18, temp: 36.5, spo2: 98, weight: 72, height: 168, pain: 3, triage: 'yellow' },
    soap: { s: 'Morning headache for a week. Takes amlodipine irregularly.', o: 'BP 148/92. No neuro deficit.', a: 'Essential hypertension, not controlled.', p: 'Amlodipine 10 mg 1×1, 30 days. Paracetamol if needed. Prolanis exercise Saturday.' }, dx: ['I10'], rx: [{ drugId: 'd03', qty: 30, sig: '1 × 1 in the morning', days: 30 }, { drugId: 'd01', qty: 10, sig: '3 × 1 if headache', days: 3 }] }),
  v({ id: 'K-26053', no: 'A-010', patientId: 'p04', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'walkin', complaint: 'Blood sugar check, tingling feet', arrivedMin: 58, stageMin: 12, stage: 'lab', bpjsCheck: 'active',
    vitals: { sys: 142, dia: 88, hr: 76, rr: 18, temp: 36.6, spo2: 97, weight: 66, height: 150, pain: 2, triage: 'yellow' }, labs: [{ testId: 'l01' }, { testId: 'l03' }] }),
  v({ id: 'K-26054', no: 'A-011', patientId: 'p09', poli: 'umum', doctorId: 's4', payer: 'bpjs', source: 'mobilejkn', complaint: 'Diarrhoea since last night, 6 times', arrivedMin: 47, stageMin: 9, stage: 'pharmacy', bpjsCheck: 'active',
    vitals: { sys: 108, dia: 70, hr: 96, rr: 20, temp: 37.6, spo2: 98, weight: 52, height: 158, pain: 3, triage: 'yellow' },
    soap: { s: 'Watery diarrhoea 6×, no blood. Ate at a street stall.', o: 'Mild dehydration, bowel sounds increased.', a: 'Acute gastroenteritis.', p: 'Oral rehydration, zinc 10 days, return if blood in stool or unable to drink.' }, dx: ['A09'], rx: [{ drugId: 'd07', qty: 6, sig: 'After each loose stool', days: 2 }, { drugId: 'd08', qty: 10, sig: '1 × 1', days: 10 }] }),
  v({ id: 'K-26055', no: 'A-012', patientId: 'p11', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'walkin', complaint: 'Itchy rash on both arms', arrivedMin: 41, stageMin: 7, stage: 'consult', bpjsCheck: 'active',
    vitals: { sys: 116, dia: 74, hr: 74, rr: 16, temp: 36.6, spo2: 99, weight: 55, height: 160, pain: 1, triage: 'green' } }),
  v({ id: 'K-26056', no: 'B-004', patientId: 'p18', poli: 'gigi', doctorId: 's5', payer: 'bpjs', source: 'mobilejkn', complaint: 'Cavity, wants filling', arrivedMin: 38, stageMin: 21, stage: 'doctor_queue', bpjsCheck: 'active' }),
  v({ id: 'K-26057', no: 'A-013', patientId: 'p02', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'mobilejkn', complaint: 'Sore throat and fever 2 days', arrivedMin: 33, stageMin: 14, stage: 'doctor_queue', bpjsCheck: 'active',
    vitals: { sys: 118, dia: 76, hr: 92, rr: 20, temp: 38.4, spo2: 98, weight: 54, height: 157, pain: 4, triage: 'yellow' } }),
  v({ id: 'K-26058', no: 'A-014', patientId: 'p15', poli: 'umum', doctorId: 's4', payer: 'bpjs', source: 'walkin', complaint: 'Low back pain after lifting', arrivedMin: 26, stageMin: 8, stage: 'doctor_queue', bpjsCheck: 'active',
    vitals: { sys: 128, dia: 82, hr: 80, rr: 18, temp: 36.7, spo2: 98, weight: 80, height: 172, pain: 6, triage: 'yellow' } }),
  v({ id: 'K-26059', no: 'C-003', patientId: 'p16', poli: 'kia', doctorId: 's6', payer: 'bpjs', source: 'mobilejkn', complaint: 'Contraceptive injection, 3-monthly', arrivedMin: 22, stageMin: 22, stage: 'vitals', bpjsCheck: 'active' }),
  v({ id: 'K-26060', no: 'A-015', patientId: 'p03', poli: 'umum', doctorId: 's4', payer: 'bpjs', source: 'walkin', complaint: 'Diabetes control, ran out of medicine', arrivedMin: 18, stageMin: 18, stage: 'vitals', bpjsCheck: 'inactive' }),
  v({ id: 'K-26061', no: 'A-016', patientId: 'p08', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'walkin', complaint: 'Child, fever 3 days, cough', arrivedMin: 11, stageMin: 11, stage: 'vitals', bpjsCheck: 'active' }),
  v({ id: 'K-26062', no: 'A-017', patientId: 'p10', poli: 'umum', doctorId: 's4', payer: 'bpjs', source: 'walkin', complaint: 'Red, watery eyes', arrivedMin: 6, stageMin: 6, stage: 'vitals', bpjsCheck: 'other_fktp' }),
  v({ id: 'K-26063', no: 'A-018', patientId: 'p12', poli: 'umum', doctorId: 's3', payer: 'asuransi', source: 'walkin', complaint: 'Blood sugar and cholesterol check', arrivedMin: 4, stageMin: 4, stage: 'vitals' }),

  // Booked on Mobile JKN, not arrived yet (minutes negative = expected later)
  v({ id: 'K-26064', no: 'A-019', patientId: 'p06', poli: 'umum', doctorId: 's4', payer: 'umum', source: 'walkin', complaint: 'Medical certificate for work', arrivedMin: -10, stageMin: 0, stage: 'booked' }),
  v({ id: 'K-26065', no: 'B-005', patientId: 'p14', poli: 'gigi', doctorId: 's5', payer: 'bpjs', source: 'mobilejkn', complaint: 'Scaling', arrivedMin: -25, stageMin: 0, stage: 'booked', bpjsCheck: 'pending' }),
  v({ id: 'K-26066', no: 'A-020', patientId: 'p07', poli: 'umum', doctorId: 's3', payer: 'bpjs', source: 'mobilejkn', complaint: 'Blood pressure follow-up', arrivedMin: -40, stageMin: 0, stage: 'booked', bpjsCheck: 'pending' }),
]

// Patients per station, for the floor bar and the queue board.
export const atStage = (vs: Visit[], s: Stage) => vs.filter((x) => x.stage === s)
