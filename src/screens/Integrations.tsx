import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { SYNC } from '@/data/ops'
import { PageHead, Panel, Segmented, StateGlyph, StatePill } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/misc'
import { cn } from '@/lib/utils'

// Every message to BPJS PCare, Mobile JKN and SATUSEHAT is a job: queued, sending, done, or failed
// with the reason and the fix. Jobs retry by themselves with growing waits (1, 2, 4, 8 minutes).
export default function Integrations() {
  const { jobs, visit, patients, retryJob, role } = useStore()
  const [f, setF] = useState<'all' | 'failed' | 'running'>('all')
  const rows = useMemo(() => jobs.filter((j) => f === 'all' || (f === 'failed' ? j.state === 'failed' : j.state === 'running' || j.state === 'queued')), [jobs, f])
  const failed = jobs.filter((j) => j.state === 'failed')
  const by = (t: string) => jobs.filter((j) => SYNC[j.kind].target === t)
  const systems = ['BPJS PCare', 'Mobile JKN', 'SATUSEHAT'].map((t) => ({ t, all: by(t).length, done: by(t).filter((j) => j.state === 'done').length, failed: by(t).filter((j) => j.state === 'failed').length }))
  const ihsProblem = failed.find((j) => j.error?.code === 'PRACTITIONER_NOT_FOUND')
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="BPJS and SATUSEHAT" sub="Visits, diagnoses, vital signs and prescriptions are sent automatically when the doctor signs. Failures say why and how to fix them." />
      <div className="grid gap-4 md:grid-cols-3">
        {systems.map((s) => (
          <div key={s.t} className="grid gap-2 rounded-card border border-edge p-4">
            <div className="flex items-center justify-between"><b className="text-[14px] font-semibold">{s.t}</b>{s.failed ? <Pill tone="neg">{s.failed} failed</Pill> : <Pill tone="pos">Healthy</Pill>}</div>
            <p className="tnum text-[26px] font-medium">{s.done}<span className="text-[15px] text-muted"> / {s.all} sent today</span></p>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-active"><span className="bg-accent" style={{ width: `${(s.done / Math.max(1, s.all)) * 100}%` }} /><span className="bg-negative" style={{ width: `${(s.failed / Math.max(1, s.all)) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      {ihsProblem && (
        <div className="grid gap-2 rounded-card border border-[#efc2bd] p-4">
          <p className="flex items-center gap-2 font-semibold text-negative"><ExclamationTriangleIcon />{ihsProblem.error!.message}</p>
          <p className="text-[13.5px]">SATUSEHAT rejects any encounter without a registered practitioner. {ihsProblem.error!.fix}</p>
          <div className="flex gap-2">{role === 'manager' || role === 'admin' ? <Button asChild size="sm" variant="primary"><Link to="/settings">Add the IHS number</Link></Button> : <span className="text-[13px] text-muted">Ask the clinic manager to add it in Settings.</span>}<Button size="sm" onClick={() => failed.forEach((j) => retryJob(j.id))}><ReloadIcon />Retry all failed</Button></div>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <Segmented label="Filter" value={f} onChange={setF} options={[{ value: 'all', label: `All (${jobs.length})` }, { value: 'failed', label: `Failed (${failed.length})` }, { value: 'running', label: 'In progress' }]} />
      </div>
      <Panel pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13.5px]">
            <thead><tr className="text-left text-[12px] text-muted"><th className="px-4 py-2.5 font-normal">Job</th><th className="py-2.5 font-normal">Sent to</th><th className="py-2.5 font-normal">Visit</th><th className="py-2.5 font-normal">Attempts</th><th className="py-2.5 font-normal">State</th><th className="px-4 py-2.5" /></tr></thead>
            <tbody>{rows.map((j) => {
              const v = visit(j.visitId)
              return (
                <tr key={j.id} className={cn('border-t border-rule align-top', j.state === 'failed' && 'bg-neg-bg/30')}>
                  <td className="px-4 py-2.5"><span className="flex items-center gap-2"><StateGlyph state={j.state} /><span className="font-mono text-[12.5px]">{j.id}</span></span></td>
                  <td className="py-2.5"><b className="font-medium">{SYNC[j.kind].target}</b><span className="block text-[12.5px] text-muted">{SYNC[j.kind].what}</span>{j.error && <span className="mt-1 block max-w-[46ch] text-[12.5px] text-negative"><span className="font-mono">{j.error.code}</span>: {j.error.message}</span>}</td>
                  <td className="py-2.5">{v ? <Link to={`/visits/${v.id}`} className="hover:underline">{v.no} · {patientOf(patients, v.patientId).name}</Link> : j.visitId}</td>
                  <td className="tnum py-2.5">{j.attempts}</td>
                  <td className="py-2.5"><StatePill state={j.state} /></td>
                  <td className="px-4 py-2.5 text-right">{j.state === 'failed' && <Button size="sm" onClick={() => retryJob(j.id)}><ReloadIcon />Retry</Button>}</td>
                </tr>
              )
            })}</tbody>
          </table>
        </div>
      </Panel>
      <p className="text-[12.5px] text-muted">Credentials for PCare (consumer ID and key), Mobile JKN and SATUSEHAT (OAuth client) are stored server-side and never shown here. Tokens refresh before they expire.</p>
    </div>
  )
}
