import { useState } from 'react'
import { useStore } from '@/store'
import { CLINIC, POLI, ROLE_LABEL, STAFF } from '@/data/clinic'
import { ACCESS } from '@/lib/access'
import { Avatar, Input, PageHead, Panel } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Pill, Switch } from '@/components/ui/misc'

export default function Settings() {
  const { setIhs, jobs } = useStore()
  const [edit, setEdit] = useState<Record<string, string>>({})
  const [, force] = useState(0)
  const failedIhs = jobs.filter((j) => j.state === 'failed' && j.error?.code === 'PRACTITIONER_NOT_FOUND').length
  return (
    <div className="mx-auto grid w-full max-w-[1120px] gap-8 p-5 md:p-7">
      <PageHead title="Settings" sub="Clinic profile, staff and roles, and connections to BPJS and SATUSEHAT." />
      <Row title="Clinic" text="Shown on queue tickets, receipts and referral letters.">
        <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2.5 text-[13.5px]">
          <dt className="text-muted">Name</dt><dd>{CLINIC.name}</dd>
          <dt className="text-muted">Address</dt><dd>{CLINIC.address}</dd>
          <dt className="text-muted">Opening hours</dt><dd>{CLINIC.hours}</dd>
          <dt className="text-muted">BPJS FKTP code</dt><dd className="font-mono text-[13px]">{CLINIC.bpjsCode}</dd>
          <dt className="text-muted">Clinics</dt><dd>{Object.values(POLI).map((p) => p.name).join(', ')}</dd>
        </dl>
      </Row>
      <Row title="Staff" text="Doctors, dentists and midwives need an IHS number (from SATUSEHAT SDMK) so encounters can name them. Without it SATUSEHAT rejects the visit.">
        <ul className="grid gap-0">{STAFF.map((s) => (
          <li key={s.id} className="grid items-center gap-3 border-b border-rule py-3 last:border-0 sm:grid-cols-[1fr_auto]">
            <span className="flex items-center gap-3"><Avatar name={s.name} size={30} /><span><b className="block text-[14px] font-semibold">{s.name}</b><span className="text-[12.5px] text-muted">{s.title} · {ROLE_LABEL[s.role]}</span></span></span>
            {s.role === 'doctor' ? (s.ihs ? <span className="font-mono text-[12.5px] text-muted">IHS {s.ihs}</span> : (
              <span className="flex items-center gap-2">
                <Input value={edit[s.id] ?? ''} onChange={(e) => setEdit({ ...edit, [s.id]: e.target.value.replace(/\D/g, '') })} placeholder="IHS number" className="w-40 font-mono" aria-label={`IHS number for ${s.name}`} />
                <Button size="sm" variant="primary" disabled={(edit[s.id] ?? '').length < 8} onClick={() => { setIhs(s.id, edit[s.id]); force((n) => n + 1) }}>Save</Button>
                <Pill tone="neg">Missing{failedIhs ? `, ${failedIhs} jobs blocked` : ''}</Pill>
              </span>
            )) : <span className="text-[12.5px] text-faint">No IHS needed</span>}
          </li>
        ))}</ul>
      </Row>
      <Row title="Roles and access" text="What each role can open. Medical records are visible only to roles that treat or serve the patient.">
        <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-[13px]">
          <thead><tr className="text-left text-[12px] text-muted"><th className="pb-2 font-normal">Role</th><th className="pb-2 font-normal">Can open</th></tr></thead>
          <tbody>{(['frontdesk', 'nurse', 'doctor', 'pharmacist', 'cashier', 'manager'] as const).map((r) => <tr key={r} className="border-t border-rule align-top"><td className="w-36 py-2.5 font-medium">{ROLE_LABEL[r]}</td><td className="py-2.5 text-muted">{ACCESS[r].join(', ')}</td></tr>)}</tbody>
        </table></div>
      </Row>
      <Row title="Connections" text="Credentials are stored on the server and never shown in the browser.">
        <ul className="grid gap-0 text-[13.5px]">{[['BPJS PCare (bridging)', 'Consumer ID and key, user key', true], ['Mobile JKN online queue', 'Antrean FKTP web service', true], ['SATUSEHAT', 'OAuth client, organization ID 10000004', true], ['Text messages', 'Reminder sender', false]].map(([n, d, on]) => (
          <li key={String(n)} className="flex items-center justify-between gap-3 border-b border-rule py-3 last:border-0"><span><b className="block font-semibold">{n}</b><span className="text-[12.5px] text-muted">{d}</span></span><Switch defaultChecked={Boolean(on)} aria-label={String(n)} /></li>
        ))}</ul>
      </Row>
    </div>
  )
}

function Row({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 border-b border-rule pb-8 last:border-0 lg:grid-cols-[320px_1fr]">
      <div className="grid content-start gap-1.5"><h2 className="text-[16px] font-semibold">{title}</h2><p className="text-[13.5px] text-muted">{text}</p></div>
      <Panel>{children}</Panel>
    </section>
  )
}
