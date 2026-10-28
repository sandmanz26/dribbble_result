import { drug, labTest, service } from '@/data/pharmacy'
import type { Visit } from '@/data/visits'

// What a visit costs and who pays. BPJS participants registered here are covered by capitation for
// consultation, national-formulary drugs and basic point-of-care tests; antenatal and family planning
// visits are claimed separately (non-capitation). Self-pay and insurance pay the clinic's tariff.
export type BillLine = { label: string; qty: number; unit: number; total: number; covered: boolean; kind: 'service' | 'drug' | 'lab' }

export function bill(v: Visit) {
  const bpjs = v.payer === 'bpjs'
  const lines: BillLine[] = []
  const consult = v.poli === 'gigi' ? 't02' : v.poli === 'kia' ? 't07' : 't01'
  const svc = new Set([consult, ...(v.services ?? [])])
  svc.forEach((id) => { const s = service(id); lines.push({ label: s.name, qty: 1, unit: s.price, total: s.price, covered: bpjs, kind: 'service' }) })
  ;(v.labs ?? []).forEach((l) => { const t = labTest(l.testId); lines.push({ label: t.name, qty: 1, unit: t.price, total: t.price, covered: bpjs, kind: 'lab' }) })
  ;(v.rx ?? []).forEach((r) => { const d = drug(r.drugId); lines.push({ label: d.name, qty: r.qty, unit: d.price, total: d.price * r.qty, covered: bpjs && d.fornas, kind: 'drug' }) })
  const gross = lines.reduce((s, l) => s + l.total, 0)
  const covered = lines.filter((l) => l.covered).reduce((s, l) => s + l.total, 0)
  const nonCapitation = bpjs && v.poli === 'kia'
  return { lines, gross, covered, due: gross - covered, nonCapitation }
}

export const rp = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`
