// Pharmacy catalogue with batches (stock is the sum of batches; never typed separately).
// `kfa` is the national drug catalogue code SATUSEHAT needs for MedicationRequest (synthetic codes).
export type Batch = { no: string; exp: string; qty: number }
export type Drug = { id: string; name: string; form: string; unit: string; kfa: string; price: number; min: number; fornas: boolean; batches: Batch[]; group?: 'antibiotic' | 'psychotropic' }

export const DRUGS: Drug[] = [
  { id: 'd01', name: 'Paracetamol 500 mg', form: 'Tablet', unit: 'tab', kfa: '93000126', price: 300, min: 600, fornas: true, batches: [{ no: 'PCT2406A', exp: '2027-03-31', qty: 840 }, { no: 'PCT2411C', exp: '2027-10-31', qty: 1200 }] },
  { id: 'd02', name: 'Amoxicillin 500 mg', form: 'Capsule', unit: 'cap', kfa: '93000841', price: 650, min: 400, fornas: true, group: 'antibiotic', batches: [{ no: 'AMX2405B', exp: '2026-12-31', qty: 150 }, { no: 'AMX2409A', exp: '2027-06-30', qty: 120 }] },
  { id: 'd03', name: 'Amlodipine 10 mg', form: 'Tablet', unit: 'tab', kfa: '93001570', price: 450, min: 300, fornas: true, batches: [{ no: 'AML2403D', exp: '2027-01-31', qty: 610 }] },
  { id: 'd04', name: 'Metformin 500 mg', form: 'Tablet', unit: 'tab', kfa: '93001033', price: 250, min: 600, fornas: true, batches: [{ no: 'MTF2402A', exp: '2026-11-30', qty: 90 }, { no: 'MTF2408B', exp: '2027-08-31', qty: 980 }] },
  { id: 'd05', name: 'Cetirizine 10 mg', form: 'Tablet', unit: 'tab', kfa: '93000311', price: 400, min: 200, fornas: true, batches: [{ no: 'CTZ2407A', exp: '2027-07-31', qty: 340 }] },
  { id: 'd06', name: 'Omeprazole 20 mg', form: 'Capsule', unit: 'cap', kfa: '93000955', price: 900, min: 200, fornas: true, batches: [{ no: 'OMZ2404C', exp: '2027-04-30', qty: 260 }] },
  { id: 'd07', name: 'Oralit sachet', form: 'Sachet', unit: 'sachet', kfa: '93001844', price: 1200, min: 100, fornas: true, batches: [{ no: 'ORL2401A', exp: '2026-11-15', qty: 40 }, { no: 'ORL2410A', exp: '2028-01-31', qty: 120 }] },
  { id: 'd08', name: 'Zinc 20 mg', form: 'Dispersible tablet', unit: 'tab', kfa: '93002210', price: 700, min: 150, fornas: true, batches: [{ no: 'ZNC2405A', exp: '2027-05-31', qty: 95 }] },
  { id: 'd09', name: 'Captopril 25 mg', form: 'Tablet', unit: 'tab', kfa: '93000277', price: 200, min: 300, fornas: true, batches: [{ no: 'CPT2406B', exp: '2027-06-30', qty: 520 }] },
  { id: 'd10', name: 'Glibenclamide 5 mg', form: 'Tablet', unit: 'tab', kfa: '93000699', price: 200, min: 200, fornas: true, batches: [{ no: 'GLB2403A', exp: '2026-12-31', qty: 230 }] },
  { id: 'd11', name: 'Ibuprofen 400 mg', form: 'Tablet', unit: 'tab', kfa: '93000733', price: 350, min: 300, fornas: true, batches: [{ no: 'IBU2408A', exp: '2027-08-31', qty: 410 }] },
  { id: 'd12', name: 'Cefadroxil 500 mg', form: 'Capsule', unit: 'cap', kfa: '93000290', price: 1500, min: 150, fornas: true, group: 'antibiotic', batches: [{ no: 'CFD2407A', exp: '2027-07-31', qty: 180 }] },
  { id: 'd13', name: 'Salbutamol 2 mg', form: 'Tablet', unit: 'tab', kfa: '93001255', price: 250, min: 200, fornas: true, batches: [{ no: 'SLB2404A', exp: '2027-04-30', qty: 260 }] },
  { id: 'd14', name: 'Vitamin B complex', form: 'Tablet', unit: 'tab', kfa: '93002011', price: 150, min: 500, fornas: false, batches: [{ no: 'VBC2409A', exp: '2028-09-30', qty: 1450 }] },
  { id: 'd15', name: 'Hydrocortisone cream 2.5%', form: 'Cream 5 g', unit: 'tube', kfa: '93000722', price: 6500, min: 30, fornas: true, batches: [{ no: 'HCC2402A', exp: '2026-12-31', qty: 22 }] },
  { id: 'd16', name: 'Folic acid 400 mcg + iron', form: 'Tablet', unit: 'tab', kfa: '93001901', price: 200, min: 600, fornas: true, batches: [{ no: 'FAF2406A', exp: '2027-12-31', qty: 900 }] },
]
export const drug = (id: string) => DRUGS.find((d) => d.id === id)!
export const stockOf = (d: Drug) => d.batches.reduce((s, b) => s + b.qty, 0)
// First expiry, first out: the batch to pick from next.
export const fefo = (d: Drug) => [...d.batches].filter((b) => b.qty > 0).sort((a, b) => a.exp.localeCompare(b.exp))[0]
export const daysTo = (iso: string) => Math.round((new Date(iso).getTime() - Date.now()) / 86400000)

export const SERVICES = [
  { id: 't01', name: 'Doctor consultation', price: 75000 },
  { id: 't02', name: 'Dental consultation', price: 85000 },
  { id: 't03', name: 'Wound dressing, small', price: 45000 },
  { id: 't04', name: 'Tooth extraction, simple', price: 175000 },
  { id: 't05', name: 'Blood glucose (point of care)', price: 30000 },
  { id: 't06', name: 'Cholesterol (point of care)', price: 40000 },
  { id: 't07', name: 'Antenatal visit', price: 90000 },
  { id: 't08', name: 'Nebulizer', price: 60000 },
]
export const service = (id: string) => SERVICES.find((s) => s.id === id)!
export const LAB_TESTS = [
  { id: 'l01', name: 'Blood glucose, random', unit: 'mg/dL', range: [70, 199] as [number, number], price: 30000 },
  { id: 'l02', name: 'Blood glucose, fasting', unit: 'mg/dL', range: [70, 125] as [number, number], price: 30000 },
  { id: 'l03', name: 'Total cholesterol', unit: 'mg/dL', range: [0, 199] as [number, number], price: 40000 },
  { id: 'l04', name: 'Uric acid', unit: 'mg/dL', range: [3.4, 7.0] as [number, number], price: 35000 },
  { id: 'l05', name: 'Haemoglobin', unit: 'g/dL', range: [12, 16] as [number, number], price: 30000 },
  { id: 'l06', name: 'Urinalysis, dipstick', unit: '', range: [0, 0] as [number, number], price: 35000 },
]
export const labTest = (id: string) => LAB_TESTS.find((l) => l.id === id)!
