import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { useStore } from '@/store'
import { Avatar, PageHead, Panel, StateGlyph, StatePill } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Pill, Tab, TabList, Tabs } from '@/components/ui/misc'
import { cn } from '@/lib/utils'

const RULES = [
  { a: 'Check BPJS participant status on arrival', mode: 'auto', risk: 'low' },
  { a: 'Send finished visits to PCare and SATUSEHAT', mode: 'auto', risk: 'low' },
  { a: 'Flag near-expiry batches and low stock', mode: 'auto', risk: 'low' },
  { a: 'Draft SOAP notes from nurse entries', mode: 'auto', risk: 'medium', note: 'Drafts only; the doctor edits and signs' },
  { a: 'Create purchase orders', mode: 'ask', risk: 'medium' },
  { a: 'Change how a patient pays', mode: 'ask', risk: 'high' },
  { a: 'Message patients (reminders, results)', mode: 'ask', risk: 'medium' },
  { a: 'Write diagnoses, prescriptions or referrals', mode: 'never', risk: 'high', locked: true },
  { a: 'Change or delete a signed medical record', mode: 'never', risk: 'high', locked: true },
] as const

// Asa works in the background (checks, syncs, stock) and asks a person whenever a rule says so.
// Every ask shows what Asa will do, what changes, and which rule made it stop.
export default function Asa() {
  const { asa, decideAsa } = useStore()
  const [tab, setTab] = useState('ask')
  const asks = asa.filter((a) => a.state === 'needs_review' || a.state === 'failed' || a.state === 'approving')
  const done = asa.filter((a) => a.state === 'done' || a.state === 'cancelled')
  const [modes, setModes] = useState<Record<string, string>>(Object.fromEntries(RULES.map((r) => [r.a, r.mode])))
  return (
    <div className="grid gap-6 p-5 md:p-7">
      <PageHead title={<span className="flex items-center gap-3"><Avatar name="Asa" size={30} />Asa, the clinic assistant</span>} sub="Asa handles routine administration and stops to ask where a mistake would reach a patient's money, messages or care. It never writes clinical content." />
      <Tabs value={tab} onValueChange={setTab}><TabList><Tab value="ask">Asking you <span className="tnum text-faint">{asks.length}</span></Tab><Tab value="done">Done today <span className="tnum text-faint">{done.length}</span></Tab><Tab value="rules">Rules</Tab></TabList></Tabs>
      {tab === 'ask' && (asks.length === 0 ? <p className="text-[13.5px] text-muted">Nothing waiting.</p> : (
        <div className="grid gap-4">{asks.map((a) => (
          <Panel key={a.id}>
            <div className="grid gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3"><StateGlyph state={a.state} size={18} /><div><h2 className="text-[15.5px] font-semibold">{a.title}</h2><p className="mt-0.5 max-w-[80ch] text-[13.5px] text-muted">{a.detail}</p></div></div>
                <span className="flex items-center gap-2"><Pill tone={a.risk === 'high' ? 'neg' : a.risk === 'medium' ? 'warn' : 'neu'}>{a.risk} risk</Pill><StatePill state={a.state} /></span>
              </div>
              {a.proposal && (
                <div className="grid gap-2 rounded-control bg-raised p-3 pl-9">
                  <p className="text-[12.5px] text-muted">If you approve, Asa will</p>
                  <p className="text-[14px] font-semibold">{a.proposal}</p>
                  <ul className="grid gap-1 text-[13px]">{a.effects?.map((e) => <li key={e} className="flex gap-2"><CheckIcon className="mt-0.5 shrink-0 text-muted" />{e}</li>)}</ul>
                </div>
              )}
              <p className="pl-9 text-[12.5px] text-muted">Asked because: {a.rule} · <Link to={a.link} className="text-accent hover:underline">Open in {a.module}</Link></p>
              <div className="flex flex-wrap gap-2 pl-9">
                {a.proposal ? <>
                  <Button variant="primary" pending={a.state === 'approving'} onClick={() => decideAsa(a.id, 'approve')}>{a.state === 'approving' ? 'Applying' : 'Approve'}</Button>
                  <Button disabled={a.state === 'approving'} onClick={() => decideAsa(a.id, 'decline')}>Decline</Button>
                  <Button variant="ghost" disabled={a.state === 'approving'} onClick={() => decideAsa(a.id, 'mine')}>I&apos;ll handle it</Button>
                </> : <Button asChild variant="primary"><Link to={a.link}>Fix in {a.module}</Link></Button>}
              </div>
            </div>
          </Panel>
        ))}</div>
      ))}
      {tab === 'done' && (
        <Panel pad={false}><ul>{done.map((a) => <li key={a.id} className="flex items-start gap-3 border-b border-rule px-4 py-3 last:border-0"><StateGlyph state={a.state} /><div><b className="text-[14px] font-semibold">{a.title}</b><p className="text-[13px] text-muted">{a.detail}</p></div></li>)}</ul></Panel>
      )}
      {tab === 'rules' && (
        <Panel pad={false}>
          <ul>{RULES.map((r) => (
            <li key={r.a} className="grid gap-2 border-b border-rule px-4 py-3 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><p className="flex flex-wrap items-center gap-2 text-[14px] font-medium">{r.a}<Pill tone={r.risk === 'high' ? 'neg' : r.risk === 'medium' ? 'warn' : 'neu'}>{r.risk} risk</Pill>{'locked' in r && <span className="flex items-center gap-1 text-[12px] text-muted"><LockClosedIcon />Clinic policy</span>}</p>{'note' in r && <p className="text-[12.5px] text-muted">{r.note}</p>}</div>
              <div className="inline-flex rounded-control border border-edge bg-raised p-0.5" role="radiogroup" aria-label={r.a}>
                {[['auto', 'Do it'], ['ask', 'Ask first'], ['never', 'Never']].map(([m, l]) => <button key={m} role="radio" aria-checked={modes[r.a] === m} disabled={'locked' in r} onClick={() => setModes({ ...modes, [r.a]: m })} className={cn('h-7 rounded-[6px] px-3 text-[12.5px] text-muted disabled:cursor-not-allowed', modes[r.a] === m && 'bg-ink font-medium text-white', 'locked' in r && modes[r.a] !== m && 'opacity-40')}>{l}</button>)}
              </div>
            </li>
          ))}</ul>
        </Panel>
      )}
    </div>
  )
}
