// Settlement estimate under PP 35/2021. An estimate for planning only: legal and payroll confirm.
const MS_DAY = 86400000
const d = (s) => new Date(s + 'T12:00:00')

export function tenure(join, end) {
  const a = d(join), b = d(end)
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  if (b.getDate() < a.getDate()) months -= 1
  months = Math.max(0, months)
  return { months, years: months / 12, label: `${Math.floor(months / 12)} yr ${months % 12} mo` }
}

export const pesangonMonths = (y) => Math.min(Math.floor(y) + 1, 9)
export function upmkMonths(y) {
  if (y < 3) return 0
  if (y >= 24) return 10
  return Math.floor((y - 3) / 3) + 2
}
export const separationMonths = (y) => Math.min(Math.floor(y / 3), 3)

export function pph21Severance(gross) {
  const brackets = [[50e6, 0], [50e6, 0.05], [400e6, 0.15], [Infinity, 0.25]]
  let left = gross, tax = 0
  for (const [size, rate] of brackets) {
    const part = Math.min(left, size)
    tax += part * rate
    left -= part
    if (left <= 0) break
  }
  return Math.round(tax)
}

export function settlement(emp, c, settings = { workweek: 5 }) {
  const wage = emp.base + emp.allowance
  const t = tenure(emp.joinDate, c.lastDay || emp.contractEnd || '2026-12-31')
  const y = t.years
  const out = { wage, tenure: t, lines: [], deductions: [], vendorPays: false, basis: '' }
  if (emp.type === 'external') {
    out.vendorPays = true
    out.basis = `Paid by the vendor under the service agreement. No payment from ${'the company'}.`
    out.gross = 0; out.tax = 0; out.net = 0
    return out
  }
  const divisor = settings.workweek === 6 ? 25 : 21
  const P = pesangonMonths(y), U = upmkMonths(y), S = separationMonths(y)
  const pes = (f, why) => out.lines.push({ label: 'Severance pay (uang pesangon)', basis: `${f} × ${P} months${why ? ', ' + why : ''}`, amount: f * P * wage })
  const upmk = (f = 1) => U && out.lines.push({ label: 'Long service pay (UPMK)', basis: `${f} × ${U} months`, amount: f * U * wage })
  const pisah = () => S && out.lines.push({ label: 'Separation pay (uang pisah)', basis: `${S} months, per PKB`, amount: S * wage })
  const reason = c.reason || ''
  switch (c.type) {
    case 'resign': pisah(); out.basis = 'Resignation: leave payout and separation pay per PKB. No severance.'; break
    case 'termination':
      if (reason.includes('SP3')) { pes(0.5); upmk(); out.basis = 'Violation after SP3: 0.5 severance and 1 long service pay (art. 52).' }
      else if (reason.includes('Detained')) { upmk(); out.basis = 'Detention over 6 months: long service pay (art. 54).' }
      else { pisah(); out.basis = 'Urgent violation per PKB: leave payout and separation pay only.' }
      break
    case 'layoff':
      if (reason.includes('due to loss')) { pes(0.5); out.basis = 'Efficiency due to loss: 0.5 severance (art. 43).' }
      else { pes(1); out.basis = 'Efficiency to prevent loss, closure or restructuring: 1 severance (art. 43 and 44).' }
      upmk(); break
    case 'contract': {
      const m = Math.max(1, t.months)
      out.lines.push({ label: 'Contract compensation (uang kompensasi)', basis: `${m} of 12 months worked`, amount: Math.round((m / 12) * wage) })
      out.basis = 'PKWT ends: compensation in proportion to months worked (art. 15 and 16).'
      break
    }
    case 'mutual': pes(1, 'baseline'); upmk(); out.basis = 'Mutual agreement: amount is negotiated. Baseline shown is the layoff formula.'; break
    case 'retire': pes(1.75); upmk(); out.basis = 'Retirement: 1.75 severance and 1 long service pay (art. 56).'; break
  }
  if (emp.leaveLeft) out.lines.push({ label: 'Unused annual leave (UPH)', basis: `${emp.leaveLeft} days × wage / ${divisor}`, amount: Math.round(emp.leaveLeft * wage / divisor) })
  if (c.agreedExtra) out.lines.push({ label: 'Agreed additional amount', basis: 'From negotiation', amount: c.agreedExtra })
  out.gross = out.lines.reduce((s, l) => s + l.amount, 0)
  out.tax = pph21Severance(out.gross)
  if (emp.loan) out.deductions.push({ label: 'Outstanding cooperative loan', amount: emp.loan })
  for (const a of c.lostAssets || []) out.deductions.push({ label: `Unreturned asset: ${a.label}`, amount: a.value })
  out.net = out.gross - out.tax - out.deductions.reduce((s, x) => s + x.amount, 0)
  return out
}

export const addDays = (s, n) => { const x = d(s); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
export const diffDays = (a, b) => Math.round((d(a) - d(b)) / MS_DAY)
export function addWorkingDays(s, n) {
  const x = d(s); let k = 0
  while (k < n) { x.setDate(x.getDate() + 1); const w = x.getDay(); if (w !== 0 && w !== 6) k++ }
  return x.toISOString().slice(0, 10)
}
