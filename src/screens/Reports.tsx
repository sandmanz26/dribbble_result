import { CLINIC, icd } from '@/data/clinic'
import { DAYS, KBK, MONTH, TOP_DX } from '@/data/ops'
import { PageHead, Panel, Stat } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { rp } from '@/lib/billing'
import { cn } from '@/lib/utils'

// The month for the clinic manager: the three KBK indicators that decide how much capitation BPJS
// pays, where the money comes from, how long people wait, and the LB1 diagnosis report.
export default function Reports() {
  const rev = MONTH.revenue
  const total = rev.capitation + rev.nonCapitation + rev.umum + rev.asuransi
  const maxV = Math.max(...DAYS.map((d) => d.visits))
  const kbk = [
    { label: 'Contact rate (AK)', value: `${KBK.ak.toFixed(0)}‰`, target: '≥ 150‰', ok: KBK.ak >= 150, note: `${MONTH.contacts.toLocaleString('en')} of ${CLINIC.registeredBpjs.toLocaleString('en')} registered participants had a contact this month.` },
    { label: 'Non-specialist referral ratio (RRNS)', value: `${KBK.rrns.toFixed(2)}%`, target: '≤ 2%', ok: KBK.rrns <= 2, note: `${MONTH.referralsNonSpecialist} of ${MONTH.visitsBpjs.toLocaleString('en')} BPJS visits referred for a primary-care diagnosis.` },
    { label: 'Controlled Prolanis ratio (RPPT)', value: `${KBK.rppt.toFixed(1)}%`, target: '≥ 5%', ok: KBK.rppt >= 5, note: `${MONTH.prolanisControlled} of ${MONTH.prolanis} hypertension and diabetes participants with readings in target. Asa has 12 overdue patients to remind.` },
  ]
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Reports" sub={`${MONTH.label}, day ${MONTH.dayOfMonth}. Figures update every night; KBK is assessed by BPJS on the full month.`}>
        <Button>Export LB1 (Excel)</Button><Button>Export for the health office</Button>
      </PageHead>

      <section className="grid gap-3">
        <h2 className="text-[15px] font-semibold">Performance-based capitation (KBK)</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {kbk.map((k) => (
            <div key={k.label} className={cn('grid gap-2 rounded-card border p-4', k.ok ? 'border-edge' : 'border-[#ecd3a6] bg-warn-bg/40')}>
              <div className="flex items-start justify-between gap-2"><p className="text-[13px] font-medium text-muted">{k.label}</p><span className={cn('text-[12px] font-semibold', k.ok ? 'text-positive' : 'text-warning')}>{k.ok ? 'On target' : 'Below target'}</span></div>
              <p className="tnum text-[28px] font-medium leading-tight tracking-[-0.02em]">{k.value}<span className="ml-2 text-[13px] font-normal text-muted">target {k.target}</span></p>
              <p className="text-[12.5px] text-muted">{k.note}</p>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] text-muted">Missing a target reduces the capitation paid for the month. Capitation here: {CLINIC.registeredBpjs.toLocaleString('en')} participants × {rp(CLINIC.capitationRate)} = {rp(rev.capitation)} before adjustment.</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Income this month">
          <div className="grid gap-4">
            <div className="flex h-3 overflow-hidden rounded-full">{[['capitation', 'bg-chart-1'], ['nonCapitation', 'bg-[#4f8b7d]'], ['umum', 'bg-chart-2'], ['asuransi', 'bg-chart-3']].map(([k, c]) => <span key={k} className={c} style={{ width: `${(rev[k as keyof typeof rev] / total) * 100}%` }} />)}</div>
            <dl className="grid gap-2 text-[13.5px]">
              {[['BPJS capitation', rev.capitation, 'bg-chart-1'], ['BPJS non-capitation claims', rev.nonCapitation, 'bg-[#4f8b7d]'], ['Self-pay', rev.umum, 'bg-chart-2'], ['Insurance', rev.asuransi, 'bg-chart-3']].map(([l, v, c]) => (
                <div key={String(l)} className="flex items-center justify-between gap-3"><dt className="flex items-center gap-2"><span className={cn('size-2.5 rounded-[3px]', String(c))} />{l}</dt><dd className="tnum">{rp(Number(v))} <span className="text-muted">({((Number(v) / total) * 100).toFixed(0)}%)</span></dd></div>
              ))}
              <div className="flex justify-between border-t border-rule pt-2 font-semibold"><dt>Total</dt><dd className="tnum">{rp(total)}</dd></div>
            </dl>
            <p className="text-[12.5px] text-muted">Capitation is paid whether or not participants visit, so the clinic&apos;s cost per BPJS visit matters more than volume.</p>
          </div>
        </Panel>
        <Panel title="Visits per day and median wait, last 14 days">
          <p className="mb-3 text-[13.5px]">Busy days push the median wait toward 40 minutes; the clinic&apos;s limit is 60. The 90th percentile this month is {MONTH.waitP90} minutes, so about one patient in ten waits too long.</p>
          <div className="grid h-[160px] grid-cols-14 items-end gap-1.5" style={{ gridTemplateColumns: 'repeat(14, minmax(0,1fr))' }} role="img" aria-label="Visits per day for the last 14 days">
            {DAYS.map((d) => (
              <div key={d.i} className="grid h-full content-end justify-items-center gap-1">
                <span className="tnum text-[10.5px] text-muted">{d.visits || ''}</span>
                <span className={cn('w-full rounded-t-[4px]', d.visits ? 'bg-chart-1' : 'bg-active')} style={{ height: d.visits ? `${(d.visits / maxV) * 120}px` : '4px' }} />
                <span className={cn('tnum text-[10.5px]', d.wait >= 40 ? 'font-semibold text-warning' : 'text-faint')}>{d.wait ? `${d.wait}′` : 'Sun'}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-muted">Bars: visits. Under each bar: median wait in minutes.</p>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel title="Top 10 diagnoses (LB1)" pad={false}>
          <table className="w-full text-[13.5px]"><tbody>{TOP_DX.map((d, i) => (
            <tr key={d.code} className="border-t border-rule first:border-0"><td className="tnum w-8 px-4 py-2 text-muted">{i + 1}</td><td className="w-16 font-mono text-[12.5px] font-semibold">{d.code}</td><td className="py-2">{icd(d.code).name}</td><td className="w-40 px-4"><div className="flex items-center gap-2"><span className="h-1.5 rounded-full bg-chart-1" style={{ width: `${(d.n / TOP_DX[0].n) * 90}px` }} /><span className="tnum text-[12.5px]">{d.n}</span></div></td></tr>
          ))}</tbody></table>
        </Panel>
        <div className="grid content-start gap-6">
          <Panel title="Visits by payer">
            <div className="grid grid-cols-3 gap-4">
              <Stat label="BPJS" value={MONTH.visitsByPayer.bpjs.toLocaleString('en')} />
              <Stat label="Self-pay" value={MONTH.visitsByPayer.umum.toLocaleString('en')} />
              <Stat label="Insurance" value={MONTH.visitsByPayer.asuransi.toLocaleString('en')} />
            </div>
          </Panel>
          <Panel title="Waiting time">
            <div className="grid grid-cols-2 gap-4"><Stat label="Median, registration to doctor" value={`${MONTH.waitP50} min`} /><Stat label="90th percentile" value={`${MONTH.waitP90} min`} tone={MONTH.waitP90 > 60 ? 'warn' : undefined} note="Limit: 60 minutes" /></div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
