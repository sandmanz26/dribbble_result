// Synthetic data only. The clinic, staff, patients, NIK and BPJS numbers are invented; any match with
// a real person is a coincidence. Numbers that appear in more than one place are derived, not typed.

export const CLINIC = {
  name: 'Klinik Pratama Kenanga Medika',
  short: 'Kenanga Medika',
  city: 'Bandung',
  address: 'Jl. Cikutra No. 118, Bandung',
  hours: 'Mon to Sat, 07:00 to 21:00',
  bpjsCode: '0123K004', // FKTP code (synthetic)
  registeredBpjs: 6840, // participants registered to this FKTP
  capitationRate: 11000, // Rp per participant per month, inside the Permenkes 3/2023 range for klinik pratama
}

export type Role = 'admin' | 'frontdesk' | 'nurse' | 'doctor' | 'pharmacist' | 'cashier' | 'manager'
export type Staff = { id: string; name: string; title: string; role: Role; poli?: Poli; ihs?: string | null }

export const STAFF: Staff[] = [
  { id: 's1', name: 'Fitri Handayani', title: 'Front desk', role: 'frontdesk' },
  { id: 's2', name: 'Rudi Hartono', title: 'Nurse, Amd.Kep', role: 'nurse' },
  { id: 's3', name: 'dr. Rina Kusumawati', title: 'General practitioner', role: 'doctor', poli: 'umum', ihs: '10009880728' },
  { id: 's4', name: 'dr. Adi Pranoto', title: 'General practitioner', role: 'doctor', poli: 'umum', ihs: '10006926841' },
  { id: 's5', name: 'drg. Maya Lestari', title: 'Dentist', role: 'doctor', poli: 'gigi', ihs: null },
  { id: 's6', name: 'Bdn. Sri Wahyuni', title: 'Midwife', role: 'doctor', poli: 'kia', ihs: '10012004417' },
  { id: 's7', name: 'apt. Dewi Anggraini', title: 'Pharmacist in charge', role: 'pharmacist' },
  { id: 's8', name: 'Bayu Saputra', title: 'Cashier', role: 'cashier' },
  { id: 's9', name: 'Hendra Wijaya', title: 'Clinic manager', role: 'manager' },
]
export const staff = (id: string) => STAFF.find((s) => s.id === id)!

// Who the demo user is in each role.
export const AS: Record<Role, string> = { admin: 's9', frontdesk: 's1', nurse: 's2', doctor: 's3', pharmacist: 's7', cashier: 's8', manager: 's9' }
export const ROLE_LABEL: Record<Role, string> = { admin: 'Administrator', frontdesk: 'Front desk', nurse: 'Nurse', doctor: 'Doctor', pharmacist: 'Pharmacist', cashier: 'Cashier', manager: 'Clinic manager' }

export type Poli = 'umum' | 'gigi' | 'kia'
export const POLI: Record<Poli, { name: string; prefix: string }> = {
  umum: { name: 'General', prefix: 'A' },
  gigi: { name: 'Dental', prefix: 'B' },
  kia: { name: 'Mother and child', prefix: 'C' },
}

export type Payer = 'bpjs' | 'umum' | 'asuransi'
export const PAYER: Record<Payer, string> = { bpjs: 'BPJS', umum: 'Self-pay', asuransi: 'Insurance' }

export type Patient = {
  id: string; rm: string; name: string; sex: 'L' | 'P'; dob: string; nik: string; phone: string
  bpjs?: { no: string; class: 1 | 2 | 3; fktp: 'here' | 'other'; active: boolean; segment: string }
  insurer?: string; allergies: string[]; chronic?: ('HT' | 'DM')[]; ihs?: string; address: string
}

export const PATIENTS: Patient[] = [
  { id: 'p01', rm: 'RM-024118', name: 'Rahmat Hidayat', sex: 'L', dob: '1979-04-12', nik: '3273011204790007', phone: '0812-2xxx-4419', bpjs: { no: '0001437782210', class: 3, fktp: 'here', active: true, segment: 'PBI' }, allergies: [], chronic: ['HT'], ihs: 'P02280547535', address: 'Cikutra, Cibeunying Kidul' },
  { id: 'p02', rm: 'RM-024097', name: 'Nur Aini', sex: 'P', dob: '1991-07-02', nik: '3273024207910003', phone: '0857-2xxx-1180', bpjs: { no: '0002216650894', class: 2, fktp: 'here', active: true, segment: 'PPU' }, allergies: ['Amoxicillin'], ihs: 'P00813925071', address: 'Sukaluyu, Cibeunying Kaler' },
  { id: 'p03', rm: 'RM-019830', name: 'Wahyu Pratama', sex: 'L', dob: '1969-11-19', nik: '3273051911690002', phone: '0813-2xxx-7702', bpjs: { no: '0001895530127', class: 1, fktp: 'here', active: false, segment: 'PBPU' }, allergies: [], chronic: ['DM'], ihs: 'P01530988212', address: 'Padasuka, Cibeunying Kidul' },
  { id: 'p04', rm: 'RM-018702', name: 'Ratna Sari', sex: 'P', dob: '1958-01-27', nik: '3273016701580001', phone: '0812-2xxx-3306', bpjs: { no: '0000917746553', class: 3, fktp: 'here', active: true, segment: 'PBI' }, allergies: ['Sulfa'], chronic: ['HT', 'DM'], ihs: 'P02964410876', address: 'Cicadas, Cibeunying Kidul' },
  { id: 'p05', rm: 'RM-020156', name: 'Joko Susilo', sex: 'L', dob: '1977-09-08', nik: '3273010809770005', phone: '0878-2xxx-5521', insurer: 'Asuransi Mitra Sehat', allergies: [], address: 'Neglasari, Cibeunying Kaler' },
  { id: 'p06', rm: 'RM-024120', name: 'Putri Ayu Ramadhani', sex: 'P', dob: '2001-05-15', nik: '3273035505010004', phone: '0821-2xxx-0938', allergies: [], address: 'Cigadung, Cibeunying Kaler' },
  { id: 'p07', rm: 'RM-017665', name: 'Bambang Sutrisno', sex: 'L', dob: '1949-04-30', nik: '3273013004490001', phone: '0812-2xxx-8817', bpjs: { no: '0000546612097', class: 2, fktp: 'here', active: true, segment: 'PPU' }, allergies: [], chronic: ['HT'], ihs: 'P00172354890', address: 'Cikutra, Cibeunying Kidul' },
  { id: 'p08', rm: 'RM-023410', name: 'Yusuf Maulana', sex: 'L', dob: '2016-02-11', nik: '3273021102160006', phone: '0856-2xxx-2214', bpjs: { no: '0003391027746', class: 3, fktp: 'here', active: true, segment: 'PBI' }, allergies: [], ihs: 'P03012299817', address: 'Sukapada, Cibeunying Kidul' },
  { id: 'p09', rm: 'RM-022981', name: 'Lina Marlina', sex: 'P', dob: '1996-12-03', nik: '3273044312960002', phone: '0813-2xxx-6650', bpjs: { no: '0002980015633', class: 3, fktp: 'here', active: true, segment: 'PBI' }, allergies: [], ihs: 'P02455019922', address: 'Cicadas, Cibeunying Kidul' },
  { id: 'p10', rm: 'RM-021547', name: 'Eko Prasetyo', sex: 'L', dob: '1986-08-21', nik: '3273012108860003', phone: '0812-2xxx-4471', bpjs: { no: '0001772289104', class: 2, fktp: 'other', active: true, segment: 'PPU' }, allergies: ['Ibuprofen'], address: 'Sadang Serang, Coblong' },
  { id: 'p11', rm: 'RM-023998', name: 'Anisa Rahma', sex: 'P', dob: '1994-03-09', nik: '3273024903940005', phone: '0857-2xxx-9013', bpjs: { no: '0002664401758', class: 2, fktp: 'here', active: true, segment: 'PPU' }, allergies: [], ihs: 'P01077348120', address: 'Sukaluyu, Cibeunying Kaler' },
  { id: 'p12', rm: 'RM-016320', name: 'Kartika Dewi', sex: 'P', dob: '1972-10-14', nik: '3273015410720004', phone: '0878-2xxx-3390', insurer: 'Asuransi Mitra Sehat', allergies: [], chronic: ['DM'], address: 'Cikutra, Cibeunying Kidul' },
  { id: 'p13', rm: 'RM-024121', name: 'Hadi Gunawan', sex: 'L', dob: '1990-06-25', nik: '3273032506900001', phone: '0812-2xxx-1102', allergies: [], address: 'Pasirlayung, Cibeunying Kidul' },
  { id: 'p14', rm: 'RM-022205', name: 'Indah Permata', sex: 'P', dob: '1999-01-18', nik: '3273025801990002', phone: '0821-2xxx-5547', bpjs: { no: '0003012774598', class: 3, fktp: 'here', active: true, segment: 'PBI' }, allergies: [], ihs: 'P02904417733', address: 'Cigadung, Cibeunying Kaler' },
  { id: 'p15', rm: 'RM-020874', name: 'Fajar Nugroho', sex: 'L', dob: '1983-11-02', nik: '3273010211830006', phone: '0813-2xxx-8865', bpjs: { no: '0001548862031', class: 1, fktp: 'here', active: true, segment: 'PPU' }, allergies: [], ihs: 'P01990331425', address: 'Padasuka, Cibeunying Kidul' },
  { id: 'p16', rm: 'RM-023077', name: 'Mega Utami', sex: 'P', dob: '1997-09-29', nik: '3273026909970003', phone: '0856-2xxx-7781', bpjs: { no: '0002871094462', class: 3, fktp: 'here', active: true, segment: 'PBI' }, allergies: [], ihs: 'P02331908716', address: 'Sukapada, Cibeunying Kidul' },
  { id: 'p17', rm: 'RM-019442', name: 'Siti Aminah', sex: 'P', dob: '1964-07-07', nik: '3273014707640002', phone: '0812-2xxx-2093', bpjs: { no: '0000882137644', class: 3, fktp: 'here', active: true, segment: 'PBI' }, allergies: [], chronic: ['HT'], ihs: 'P00718826451', address: 'Cicadas, Cibeunying Kidul' },
  { id: 'p18', rm: 'RM-024122', name: 'Dimas Ardiansyah', sex: 'L', dob: '2003-04-04', nik: '3273030404030007', phone: '0822-2xxx-6612', bpjs: { no: '0003440921187', class: 3, fktp: 'here', active: true, segment: 'PBPU' }, allergies: [], ihs: 'P03190228745', address: 'Sukaluyu, Cibeunying Kaler' },
]
export const patient = (id: string) => PATIENTS.find((p) => p.id === id)!

export function age(dob: string) {
  const d = new Date(dob); const n = new Date()
  let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--
  return a
}
export const maskNik = (n: string) => `${n.slice(0, 4)} •••• •••• ${n.slice(12)}`
export const maskBpjs = (n: string) => `${n.slice(0, 4)} •••• ${n.slice(9)}`

// A short ICD-10 list for the diagnosis search. `fktp` marks diagnoses on the list of 144 that a
// primary clinic is expected to treat to completion (Kepmenkes HK.01.07/MENKES/1186/2022).
export const ICD10 = [
  { code: 'J06.9', name: 'Acute upper respiratory infection, unspecified', fktp: true },
  { code: 'J00', name: 'Acute nasopharyngitis (common cold)', fktp: true },
  { code: 'I10', name: 'Essential (primary) hypertension', fktp: true },
  { code: 'E11.9', name: 'Type 2 diabetes mellitus without complications', fktp: true },
  { code: 'A09', name: 'Diarrhoea and gastroenteritis of presumed infectious origin', fktp: true },
  { code: 'K30', name: 'Functional dyspepsia', fktp: true },
  { code: 'M79.1', name: 'Myalgia', fktp: true },
  { code: 'L30.9', name: 'Dermatitis, unspecified', fktp: true },
  { code: 'H10.9', name: 'Conjunctivitis, unspecified', fktp: true },
  { code: 'K04.0', name: 'Pulpitis', fktp: true },
  { code: 'K02.9', name: 'Dental caries, unspecified', fktp: true },
  { code: 'R50.9', name: 'Fever, unspecified', fktp: false },
  { code: 'E11.65', name: 'Type 2 diabetes mellitus with hyperglycaemia', fktp: false },
  { code: 'I20.9', name: 'Angina pectoris, unspecified', fktp: false },
  { code: 'N39.0', name: 'Urinary tract infection, site not specified', fktp: true },
  { code: 'Z34.9', name: 'Supervision of normal pregnancy, unspecified', fktp: true },
  { code: 'Z30.4', name: 'Surveillance of contraceptive drugs', fktp: true },
  { code: 'A15.0', name: 'Tuberculosis of lung, confirmed', fktp: true },
  { code: 'M54.5', name: 'Low back pain', fktp: true },
  { code: 'R51', name: 'Headache', fktp: true },
]
export const icd = (code: string) => ICD10.find((d) => d.code === code)!
