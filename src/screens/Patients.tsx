import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useStore } from '@/store'
import { age, icd, maskBpjs, maskNik, PAYER, POLI, staff } from '@/data/clinic'
import { drug } from '@/data/pharmacy'
import { STAGES } from '@/data/visits'
import { Empty, Input, PageHead, Panel, PatientLine, Segmented, Rows, ErrorBlock, useScreenState } from '@/components/kit'
import { Pill } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'

export default function Patients() {
  const { id } = useParams()
  return id ? <Record id={id} /> : <List />
}

function List() {
  const { patients, visits, addLog, me } = useStore()
  const screen = useScreenState()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [f, setF] = useState<'all' | 'prolanis' | 'bpjs' | 'today'>((params.get('filter') as 'prolanis') || 'all')
  const rows = useMemo(() => patients.filter((p) => {
    if (f === 'prolanis' && !p.chronic?.length) return false
    if (f === 'bpjs' && !p.bpjs) return false
    if (f === 'today' && !visits.some((v) => v.patientId === p.id && v.stage !== 'booked')) return false
    const s = q.toLowerCase().replace(/\s/g, '')
    return !s || p.name.toLowerCase().replace(/\s/g, '').includes(s) || p.nik.includes(s) || p.rm.toLowerCase().includes(s)
  }), [patients, visits, q, f])
  return (
    <div className="grid gap-5 p-5 md:p-7">
      <PageHead title="Patients" sub="Medical records are kept for at least 25 years after the last visit (Permenkes 24/2022). Opening a record is logged." />
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, NIK or RM" className="pl-9" /></div>
        <Segmented label="Filter" value={f} onChange={setF} options={[{ value: 'all', label: 'All' }, { value: 'today', label: 'Here today' }, { value: 'prolanis', label: 'Prolanis' }, { value: 'bpjs', label: 'BPJS' }]} />
        <span className="tnum ml-auto text-[13px] text-muted">{rows.length} patients</span>
      </div>
      {screen === 'loading' && <Rows />}
      {screen === 'error' && <ErrorBlock what="patients" />}
      {screen === 'ready' && (rows.length === 0 ? <Empty title="No patient matches">Check the spelling, or search by NIK. New patients are created at the front desk.</Empty> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13.5px]">
            <thead><tr className="text-left text-[12px] text-muted"><th className="pb-2 font-normal">Patient</th><th className="pb-2 font-normal">NIK</th><th className="pb-2 font-normal">BPJS</th><th className="pb-2 font-normal">Programmes</th><th className="pb-2 font-normal">Allergies</th></tr></thead>
            <tbody>{rows.map((p) => (
              <tr key={p.id} className="border-t border-rule">
                <td className="py-2.5"><Link to={`/patients/${p.id}`} onClick={() => addLog({ who: me.name, verb: 'opened the record of', object: p.name, result: 'ok' })} className="hover:underline"><PatientLine p={p} /></Link></td>
                <td className="font-mono text-[12.5px]">{maskNik(p.nik)}</td>
                <td>{p.bpjs ? <span className="flex items-center gap-2"><span className="font-mono text-[12.5px]">{maskBpjs(p.bpjs.no)}</span>{!p.bpjs.active && <Pill tone="neg">Inactive</Pill>}{p.bpjs.fktp === 'other' && <Pill tone="warn">Other FKTP</Pill>}</span> : p.insurer ? <Pill>{p.insurer}</Pill> : <span className="text-muted">Self-pay</span>}</td>
                <td>{p.chronic?.length ? p.chronic.map((c) => <Pill key={c} tone="info" className="mr-1">{c === 'HT' ? 'Hypertension' : 'Diabetes'}</Pill>) : <span className="text-faint">-</span>}</td>
                <td className={p.allergies.length ? 'font-medium text-negative' : 'text-faint'}>{p.allergies.join(', ') || '-'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

function Record({ id }: { id: string }) {
  const { patients, visits } = useStore()
  const p = patients.find((x) => x.id === id)
  if (!p) return <div className="p-7"><Empty title="Record not found" /></div>
  const vs = visits.filter((v) => v.patientId === p.id)
  const meds = vs.flatMap((v) => v.rx ?? [])
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <Link to="/patients" className="flex items-center gap-1 text-[13px] text-muted hover:text-ink"><ArrowLeftIcon />Patients</Link>
      <PageHead title={p.name} sub={<>{p.sex === 'L' ? 'Male' : 'Female'}, {age(p.dob)} years, born {new Date(p.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · <span className="font-mono">{p.rm}</span></>}>
        <Button asChild><Link to="/registration">New visit</Link></Button>
      </PageHead>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="grid content-start gap-6">
          <Panel title="Identity and cover">
            <dl className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-2.5 text-[13.5px]">
              <dt className="text-muted">NIK</dt><dd className="font-mono text-[13px]">{maskNik(p.nik)}</dd>
              <dt className="text-muted">SATUSEHAT ID</dt><dd className="font-mono text-[13px]">{p.ihs ?? <span className="font-sans text-warning">Not linked yet</span>}</dd>
              <dt className="text-muted">BPJS</dt><dd>{p.bpjs ? <><span className="font-mono text-[13px]">{maskBpjs(p.bpjs.no)}</span> · class {p.bpjs.class} · {p.bpjs.segment} · {p.bpjs.active ? (p.bpjs.fktp === 'here' ? 'registered here' : 'registered at another FKTP') : <b className="text-negative">inactive</b>}</> : 'None'}</dd>
              {p.insurer && <><dt className="text-muted">Insurance</dt><dd>{p.insurer}</dd></>}
              <dt className="text-muted">Phone</dt><dd>{p.phone}</dd>
              <dt className="text-muted">Address</dt><dd>{p.address}</dd>
              <dt className="text-muted">Consent</dt><dd>Treatment and SATUSEHAT sharing, signed at registration</dd>
            </dl>
          </Panel>
          <Panel title="Clinical summary">
            <dl className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-2.5 text-[13.5px]">
              <dt className="text-muted">Allergies</dt><dd className={p.allergies.length ? 'font-semibold text-negative' : ''}>{p.allergies.join(', ') || 'None known'}</dd>
              <dt className="text-muted">Programmes</dt><dd>{p.chronic?.length ? p.chronic.map((c) => (c === 'HT' ? 'Prolanis hypertension' : 'Prolanis diabetes')).join(', ') : 'None'}</dd>
              <dt className="text-muted">Current drugs</dt><dd>{meds.length ? [...new Set(meds.map((m) => drug(m.drugId).name))].join(', ') : 'None recorded'}</dd>
            </dl>
          </Panel>
        </div>
        <Panel title={`Visits (${vs.length})`} pad={false}>
          {vs.length === 0 ? <p className="p-4 text-[13.5px] text-muted">No visits in this prototype&apos;s data.</p> : (
            <ol>{vs.map((v) => (
              <li key={v.id} className="border-b border-rule last:border-0">
                <Link to={`/visits/${v.id}`} className="grid gap-1 px-4 py-3 hover:bg-raised">
                  <span className="flex flex-wrap items-center justify-between gap-2"><b className="text-[14px] font-semibold">Today · {POLI[v.poli].name} clinic</b><Pill tone={v.stage === 'done' ? 'pos' : 'info'}>{STAGES.find((s) => s.id === v.stage)!.short}</Pill></span>
                  <span className="text-[13px] text-muted">{v.complaint} · {staff(v.doctorId).name} · {PAYER[v.payer]}</span>
                  {v.dx && <span className="text-[13px]">{v.dx.map((c) => `${c} ${icd(c).name}`).join(', ')}</span>}
                </Link>
              </li>
            ))}</ol>
          )}
        </Panel>
      </div>
    </div>
  )
}
