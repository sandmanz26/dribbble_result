import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { CLINIC, ROLE_LABEL, staff } from '@/data/clinic'
import { KBK, MONTH } from '@/data/ops'
import { stockOf } from '@/data/pharmacy'
import { FloorLine } from '@/components/floor'
import { Avatar, PageHead, Panel, PatientLine, PayerPill, Rows, Stat, StateGlyph, ErrorBlock, useScreenState } from '@/components/kit'
import { Pill } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { bill, rp } from '@/lib/billing'
import { can } from '@/lib/access'
import { cn } from '@/lib/utils'

export default function Today() {
  const { visits, asa, jobs, drugs, role, me, patients } = useStore()
  const screen = useScreenState()
  const onFloor = visits.filter((v) => v.stage !== 'done' && v.stage !== 'booked')
  const done = visits.filter((v) => v.stage === 'done')
  const over60 = onFloor.filter((v) => v.arrivedMin >= 60)
  const waits = onFloor.map((v) => v.arrivedMin).sort((a, b) => a - b)
  const median = waits.length ? waits[Math.floor(waits.length / 2)] : 0
  const takings = done.reduce((s, v) => s + (v.paid?.method === 'cash' || v.paid?.method === 'qris' || v.paid?.method === 'debit' ? v.paid.amount : 0), 0)
  const asks = asa.filter((a) => a.state === 'needs_review' || a.state === 'failed')
  const failedJobs = jobs.filter((j) => j.state === 'failed')
  const low = drugs.filter((d) => stockOf(d) < d.min)
  const h = new Date().getHours()
  const first = me.name.replace(/^(dr\.|drg\.|apt\.|Bdn\.)\s*/, '').split(' ')[0]

  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title={`${h < 11 ? 'Good morning' : h < 15 ? 'Good afternoon' : 'Good evening'}, ${first}`} sub={<>{onFloor.length} patients in the clinic now, {visits.filter((v) => v.stage === 'booked').length} booked on Mobile JKN and on their way. {over60.length ? <b className="font-semibold text-negative">{over60.length} waiting longer than 60 minutes.</b> : 'Nobody has waited longer than 60 minutes.'}</>}>
        {can(role, 'registration') && <Button asChild variant="primary"><Link to="/registration">Register a patient</Link></Button>}
      </PageHead>

      {screen === 'error' && <ErrorBlock what="today's summary" />}
      {screen === 'loading' && <Rows n={5} />}
      {screen === 'ready' && <>
        <FloorLine visits={visits} />

        <div className="grid grid-cols-2 gap-6 rounded-card border border-edge p-5 lg:grid-cols-4">
          <Stat label="Patients today" value={done.length + onFloor.length} note={`${done.length} finished, ${onFloor.length} in the clinic`} />
          <Stat label="Median wait so far" value={`${median} min`} note="Arrival to now, people still in the clinic" tone={median >= 60 ? 'neg' : undefined} />
          <Stat label="Taken at the cashier" value={rp(takings)} note={`Self-pay only. BPJS visits are covered by capitation`} />
          <Stat label="This month's contact rate" value={`${KBK.ak.toFixed(0)}‰`} note={`Target ≥150‰ for full capitation (${MONTH.contacts.toLocaleString('en')} of ${CLINIC.registeredBpjs.toLocaleString('en')})`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <RoleWork />
          <div className="grid content-start gap-6">
            <Panel title="Asa is asking" action={<Link to="/asa" className="flex items-center gap-1 text-[13px] text-accent hover:underline">All<ArrowRightIcon /></Link>} pad={false}>
              {asks.length === 0 ? <p className="p-4 text-[13.5px] text-muted">Nothing waiting. Asa asks here when a rule says so.</p> : (
                <ul>{asks.slice(0, 4).map((a) => (
                  <li key={a.id} className="border-b border-rule last:border-0">
                    <Link to="/asa" className="flex gap-3 px-4 py-3 hover:bg-raised">
                      <StateGlyph state={a.state} />
                      <span className="min-w-0"><b className="block text-[13.5px] font-semibold">{a.title}</b><span className="line-clamp-1 text-[12.5px] text-muted">{a.detail}</span></span>
                    </Link>
                  </li>
                ))}</ul>
              )}
            </Panel>
            <Panel title="Systems" pad={false}>
              <ul className="text-[13.5px]">
                <SysRow label="BPJS PCare" ok={!failedJobs.some((j) => j.kind.startsWith('pcare'))} note={failedJobs.some((j) => j.kind.startsWith('pcare')) ? 'Slow: 1 participant check retrying' : 'Connected'} />
                <SysRow label="Mobile JKN queue" ok note="Connected, 3 bookings today" />
                <SysRow label="SATUSEHAT" ok={!failedJobs.some((j) => j.kind.startsWith('ss'))} note={failedJobs.some((j) => j.kind.startsWith('ss')) ? `${failedJobs.filter((j) => j.kind.startsWith('ss')).length} rejected: missing practitioner IHS number` : 'Connected'} link="/integrations" />
                <SysRow label="Drug stock" ok={!low.length} note={low.length ? `${low.length} below minimum: ${low.map((d) => d.name.split(' ')[0]).join(', ')}` : 'All above minimum'} link="/inventory" />
              </ul>
            </Panel>
          </div>
        </div>
        {over60.length > 0 && (
          <Panel title={`Waiting longer than 60 minutes (${over60.length})`} pad={false}>
            <ul>{over60.map((v) => <li key={v.id} className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3 last:border-0"><PatientLine p={patientOf(patients, v.patientId)} /><span className="tnum text-[13px] font-medium text-negative">{v.arrivedMin} min</span></li>)}</ul>
          </Panel>
        )}
      </>}
    </div>
  )
}

function SysRow({ label, ok, note, link }: { label: string; ok: boolean; note: string; link?: string }) {
  const inner = <><span className={cn('size-2 shrink-0 rounded-full', ok ? 'bg-positive' : 'bg-negative')} /><span className="w-36 shrink-0 font-medium">{label}</span><span className={cn('min-w-0 truncate', ok ? 'text-muted' : 'text-negative')}>{note}</span></>
  return <li className="border-b border-rule last:border-0">{link ? <Link to={link} className="flex items-center gap-3 px-4 py-2.5 hover:bg-raised">{inner}</Link> : <div className="flex items-center gap-3 px-4 py-2.5">{inner}</div>}</li>
}

// The work that belongs to the person signed in, by role.
function RoleWork() {
  const { role, visits, patients, me } = useStore()
  const list = (() => {
    switch (role) {
      case 'frontdesk': return { title: 'Booked on Mobile JKN, not checked in', to: '/registration', items: visits.filter((v) => v.stage === 'booked') }
      case 'nurse': return { title: 'Waiting for vital signs', to: '/vitals', items: visits.filter((v) => v.stage === 'vitals') }
      case 'doctor': return { title: 'Your queue', to: '/consult', items: visits.filter((v) => v.doctorId === me.id && (v.stage === 'doctor_queue' || v.stage === 'consult')) }
      case 'pharmacist': return { title: 'Prescriptions to prepare', to: '/pharmacy', items: visits.filter((v) => v.stage === 'pharmacy') }
      case 'cashier': return { title: 'Ready to pay', to: '/cashier', items: visits.filter((v) => v.stage === 'cashier') }
      default: return { title: 'In the clinic, longest wait first', to: '/queue', items: visits.filter((v) => v.stage !== 'done' && v.stage !== 'booked').sort((a, b) => b.arrivedMin - a.arrivedMin) }
    }
  })()
  return (
    <Panel title={<span className="flex items-center gap-2">{list.title}<Pill>{list.items.length}</Pill></span>} action={<Link to={list.to} className="flex items-center gap-1 text-[13px] text-accent hover:underline">Open<ArrowRightIcon /></Link>} pad={false}>
      {list.items.length === 0 ? <p className="p-4 text-[13.5px] text-muted">Nothing here right now. New patients appear without refreshing.</p> : (
        <ul>{list.items.slice(0, 8).map((v) => {
          const p = patientOf(patients, v.patientId)
          return (
            <li key={v.id} className="border-b border-rule last:border-0">
              <Link to={`/visits/${v.id}`} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 px-4 py-2.5 hover:bg-raised">
                <span className="font-mono text-[13px] font-medium">{v.no}</span>
                <PatientLine p={p} sub={<>{v.complaint}</>} />
                <span className="flex items-center gap-2">
                  {role === 'cashier' ? <span className="tnum text-[13px] font-medium">{rp(bill(v).due)}</span> : <span className="hidden sm:inline-flex"><PayerPill payer={v.payer} check={v.bpjsCheck} /></span>}
                  <span className={cn('tnum w-14 text-right text-[12.5px]', v.arrivedMin >= 60 ? 'font-medium text-negative' : 'text-muted')}>{v.stage === 'booked' ? `in ${-v.arrivedMin}m` : `${v.arrivedMin} min`}</span>
                </span>
              </Link>
            </li>
          )
        })}</ul>
      )}
      <p className="flex items-center gap-2 border-t border-rule px-4 py-2.5 text-[12px] text-muted"><Avatar name={me.name} size={18} />Signed in as {me.name}, {ROLE_LABEL[role].toLowerCase()}. {staff(me.id).poli ? '' : ''}</p>
    </Panel>
  )
}
