import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { patientOf, useStore } from '@/store'
import { age } from '@/data/clinic'
import type { Vitals as V } from '@/data/visits'
import { Empty, Field, Input, PageHead, Panel, PatientLine, PayerPill } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Normal adult ranges used to flag values as they are typed. Triage is suggested from the flags
// and can be changed by the nurse; red goes to the front of the doctor queue.
const RANGE = { sys: [90, 139], dia: [60, 89], hr: [60, 100], rr: [12, 20], temp: [36, 37.5], spo2: [95, 100] } as const
const flag = (k: keyof typeof RANGE, v: number) => (Number.isFinite(v) && v > 0 ? (v < RANGE[k][0] ? 'L' : v > RANGE[k][1] ? 'H' : null) : null)
function suggest(v: Partial<V>): V['triage'] {
  if ((v.spo2 ?? 99) < 92 || (v.sys ?? 120) >= 180 || (v.sys ?? 120) < 85 || (v.hr ?? 80) > 130 || (v.temp ?? 37) >= 40) return 'red'
  if ((v.spo2 ?? 99) < 95 || (v.sys ?? 120) >= 140 || (v.temp ?? 37) >= 38 || (v.pain ?? 0) >= 6 || (v.hr ?? 80) > 100) return 'yellow'
  return 'green'
}

export default function Vitals() {
  const { id } = useParams()
  const nav = useNavigate()
  const { visits, patients } = useStore()
  const waiting = visits.filter((v) => v.stage === 'vitals').sort((a, b) => b.arrivedMin - a.arrivedMin)
  const sel = visits.find((v) => v.id === id) ?? (id ? undefined : waiting[0])
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title="Vitals and triage" sub="Measure, flag what is out of range, and set triage. Red triage goes to the front of the doctor's queue." />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Panel title={`Waiting (${waiting.length})`} pad={false}>
          {waiting.length === 0 ? <Empty title="Nobody waiting">New arrivals appear here after registration.</Empty> : (
            <ul>{waiting.map((v) => (
              <li key={v.id}><button onClick={() => nav(`/vitals/${v.id}`)} className={cn('flex w-full items-center justify-between gap-3 border-b border-rule px-4 py-3 text-left last:border-0 hover:bg-raised', sel?.id === v.id && 'bg-active hover:bg-active')}>
                <span className="flex min-w-0 items-center gap-3"><span className="font-mono text-[13px] font-semibold">{v.no}</span><span className="truncate text-[13.5px] font-medium">{patientOf(patients, v.patientId).name}</span></span>
                <span className={cn('tnum text-[12.5px]', v.arrivedMin >= 40 ? 'font-medium text-warning' : 'text-muted')}>{v.arrivedMin} min</span>
              </button></li>
            ))}</ul>
          )}
        </Panel>
        {sel && sel.stage === 'vitals' ? <VitalsForm key={sel.id} id={sel.id} /> : <Panel><Empty title={sel ? `${patientOf(patients, sel.patientId).name} is past this station` : 'Choose a patient'}>{sel ? <Link className="text-accent hover:underline" to={`/visits/${sel.id}`}>Open the visit</Link> : 'Pick a patient on the left to record vital signs.'}</Empty></Panel>}
      </div>
    </div>
  )
}

function VitalsForm({ id }: { id: string }) {
  const { visit, patients, saveVitals } = useStore()
  const nav = useNavigate()
  const v = visit(id)!
  const p = patientOf(patients, v.patientId)
  const [f, setF] = useState<Record<string, string>>({ sys: '', dia: '', hr: '', rr: '', temp: '', spo2: '', weight: '', height: '', pain: '0' })
  const num = (k: string) => parseFloat(f[k])
  const vals: Partial<V> = { sys: num('sys'), dia: num('dia'), hr: num('hr'), rr: num('rr'), temp: num('temp'), spo2: num('spo2'), pain: num('pain') }
  const [triage, setTriage] = useState<V['triage']>('green')
  const [touched, setTouched] = useState(false)
  const auto = suggest(vals)
  useEffect(() => { if (!touched) setTriage(auto) }, [auto, touched])
  const required = ['sys', 'dia', 'hr', 'rr', 'temp', 'spo2', 'weight']
  const missing = required.filter((k) => !(num(k) > 0))
  const bmi = num('weight') > 0 && num('height') > 0 ? num('weight') / (num('height') / 100) ** 2 : null
  const [tried, setTried] = useState(false)
  const box = (k: string, label: string, unit: string, r?: keyof typeof RANGE) => {
    const fl = r ? flag(r, num(k)) : null
    return (
      <Field label={label} error={tried && required.includes(k) && !(num(k) > 0) ? 'Required' : undefined}>
        <div className="relative">
          <Input inputMode="decimal" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value.replace(/[^\d.]/g, '') })} className={cn('tnum pr-14 text-[16px] font-medium', fl && 'border-[#e3a39c] bg-neg-bg/40')} aria-invalid={tried && required.includes(k) && !(num(k) > 0)} />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted">{fl ? <b className="text-negative">{fl === 'H' ? 'High' : 'Low'}</b> : unit}</span>
        </div>
      </Field>
    )
  }
  return (
    <Panel title={<span className="flex items-center gap-3">{v.no}<span className="font-normal text-muted">·</span><span className="font-normal">{v.complaint}</span></span>}>
      <div className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><PatientLine p={p} /><span className="flex items-center gap-2"><PayerPill payer={v.payer} check={v.bpjsCheck} />{p.allergies.length > 0 && <span className="rounded-full bg-negative px-2 text-[12px] font-semibold leading-5 text-white">Allergy: {p.allergies.join(', ')}</span>}</span></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {box('sys', 'Systolic', 'mmHg', 'sys')}{box('dia', 'Diastolic', 'mmHg', 'dia')}{box('hr', 'Pulse', '/min', 'hr')}{box('rr', 'Breathing', '/min', 'rr')}
          {box('temp', 'Temperature', '°C', 'temp')}{box('spo2', 'SpO2', '%', 'spo2')}{box('weight', 'Weight', 'kg')}{box('height', 'Height', 'cm')}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <Field label={`Pain score: ${f.pain} of 10`}>
            <input type="range" min={0} max={10} value={f.pain} onChange={(e) => setF({ ...f, pain: e.target.value })} className="accent-[var(--color-accent)]" aria-label="Pain score" />
          </Field>
          <div className="grid content-end gap-1 text-[13px]"><span className="text-muted">BMI</span><b className="tnum text-[16px] font-medium">{bmi ? `${bmi.toFixed(1)}${bmi >= 25 ? ' (over)' : bmi < 18.5 ? ' (under)' : ''}` : '-'}</b></div>
        </div>
        <Field label={`Triage${!touched ? ' (suggested from the values)' : ''}`}>
          <div className="flex flex-wrap gap-2">
            {(['green', 'yellow', 'red'] as const).map((t) => (
              <button key={t} onClick={() => { setTriage(t); setTouched(true) }} aria-pressed={triage === t} className={cn('flex h-9 items-center gap-2 rounded-control border px-3 text-[13.5px] font-medium', triage === t ? 'border-ink bg-ink text-white' : 'border-control')}>
                <span className={cn('size-2.5 rounded-full', t === 'green' ? 'bg-positive' : t === 'yellow' ? 'bg-[#d29a1a]' : 'bg-negative')} />{t === 'green' ? 'Green, routine' : t === 'yellow' ? 'Yellow, see soon' : 'Red, see now'}
              </button>
            ))}
          </div>
        </Field>
        {age(p.dob) < 12 && <p className="flex items-center gap-2 rounded-control bg-raised p-3 text-[13px] text-muted"><ExclamationTriangleIcon />Child: adult ranges do not apply to pulse and breathing; the flags are a guide only.</p>}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="lg" onClick={() => { setTried(true); if (missing.length) return; saveVitals(id, { sys: num('sys'), dia: num('dia'), hr: num('hr'), rr: num('rr'), temp: num('temp'), spo2: num('spo2'), weight: num('weight'), height: num('height') || 0, pain: num('pain'), triage }); nav('/vitals') }}>Save and send to the doctor</Button>
          {tried && missing.length > 0 && <span className="text-[13px] text-negative">{missing.length} required values missing</span>}
        </div>
      </div>
    </Panel>
  )
}
