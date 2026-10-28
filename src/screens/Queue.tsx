import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeftIcon, CheckIcon, ExternalLinkIcon, InfoCircledIcon, LoopIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useStore } from '@/store'
import { RUNS } from '@/data/demo'
import type { Task } from '@/data/types'
import { ActorMark, ActorName, Indeterminate, Progress, StateGlyph, StatePill } from '@/components/flow'
import { Button } from '@/components/ui/button'
import { Kbd, Pill, Skel, Tab, TabList, Tabs } from '@/components/ui/misc'
import { Empty, ErrorBlock, useScreenState } from '@/components/page'
import { ago, cn, pct, sla } from '@/lib/utils'

const VIEWS = {
  people: { label: 'For people', test: (t: Task) => t.state === 'needs_review' || t.state === 'failed' || t.state === 'approving' },
  patrick: { label: 'Patrick working', test: (t: Task) => t.state === 'running' || t.state === 'queued' || t.state === 'waiting' },
  closed: { label: 'Closed', test: (t: Task) => t.state === 'done' || t.state === 'cancelled' },
} as const
type View = keyof typeof VIEWS
const WF: Record<Task['workflow'], string> = { referral: 'Referral', eligibility: 'Insurance', scheduling: 'Scheduling', prior_auth: 'Authorization', reminders: 'Reminders' }

export default function Queue() {
  const { id } = useParams()
  const nav = useNavigate()
  const { tasks, approve } = useStore()
  const screen = useScreenState()
  const [view, setView] = useState<View>('people')
  const [q, setQ] = useState('')
  const list = useMemo(() => tasks.filter((t) => (screen === 'empty' ? false : VIEWS[view].test(t)) && (!q || `${t.title} ${t.patient?.name ?? ''} ${t.id}`.toLowerCase().includes(q.toLowerCase()))), [tasks, view, q, screen])
  const sel = tasks.find((t) => t.id === id) ?? (id ? undefined : list[0])

  // j / k move through the list, a approves when the open item can be approved.
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.metaKey || e.ctrlKey) return
      const i = list.findIndex((t) => t.id === sel?.id)
      if (e.key === 'j' && list[i + 1]) nav(`/queue/${list[i + 1].id}`)
      if (e.key === 'k' && i > 0) nav(`/queue/${list[i - 1].id}`)
      if (e.key === 'a' && sel?.state === 'needs_review' && sel.proposal) approve(sel.id)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [list, sel, nav, approve])

  const count = (v: View) => tasks.filter(VIEWS[v].test).length

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[minmax(300px,384px)_1fr]">
      <section className={cn('flex min-h-0 flex-col border-edge md:border-r', id && 'hidden md:flex')} aria-label="Queue">
        <div className="grid gap-3 px-5 pt-5">
          {sel ? <p className="text-[22px] font-semibold tracking-[-0.01em]">Queue</p> : <h1 className="text-[22px] font-semibold tracking-[-0.01em]">Queue</h1>}
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabList>{(Object.keys(VIEWS) as View[]).map((v) => <Tab key={v} value={v}>{VIEWS[v].label}<span className="tnum text-[12px] font-normal text-faint">{count(v)}</span></Tab>)}</TabList>
          </Tabs>
          <label className="flex h-8 items-center gap-2 rounded-control px-2.5 border border-edge focus-within:border-accent">
            <MagnifyingGlassIcon className="text-faint" /><span className="sr-only">Search the queue</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Patient, task or ID" className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-faint" />
          </label>
        </div>
        <ul className="mt-2 min-h-0 flex-1 overflow-y-auto pb-4" aria-label={VIEWS[view].label}>
          {screen === 'loading' && Array.from({ length: 6 }, (_, i) => <li key={i} className="grid gap-2 px-5 py-3.5"><Skel className="h-3.5 w-3/4" /><Skel className="h-3 w-1/2" /></li>)}
          {screen === 'error' && <li className="p-5"><ErrorBlock what="the queue" /></li>}
          {screen !== 'loading' && screen !== 'error' && list.length === 0 && (
            <li><Empty title={view === 'people' ? 'Nothing needs you right now' : 'Nothing here'}>{view === 'people' ? 'Patrick asks here when a rule says so or when something fails. New items appear without refreshing.' : 'Items move here as their state changes.'}</Empty></li>
          )}
          {screen !== 'loading' && screen !== 'error' && list.map((t) => (
            <li key={t.id}>
              <Link to={`/queue/${t.id}`} aria-current={sel?.id === t.id ? 'true' : undefined} className={cn('relative grid grid-cols-[16px_1fr] gap-x-3 px-5 py-3 hover:bg-raised', sel?.id === t.id && 'bg-active hover:bg-active')}>
                {sel?.id === t.id && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" aria-hidden="true" />}
                <span className="mt-0.5"><StateGlyph state={t.state} /></span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2"><b className="truncate text-[14px] font-semibold">{t.title}</b><span className="ml-auto shrink-0 text-[12px] text-faint">{ago(t.createdMin)}</span></span>
                  <span className="mt-0.5 flex items-center gap-2 text-[13px] text-muted">
                    <span className="truncate">{WF[t.workflow]}{t.patient ? ` · ${t.patient.name}` : ''}</span>
                    <span className="ml-auto flex shrink-0 items-center gap-1.5">
                      {t.priority === 'urgent' && <Pill tone="neg">Urgent</Pill>}
                      {t.priority !== 'urgent' && t.slaMin !== undefined && t.slaMin < 60 && t.state === 'needs_review' && <Pill tone="warn">{sla(t.slaMin)}</Pill>}
                      <ActorMark actor={t.owner} size={18} />
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={cn('min-h-0 overflow-y-auto', !id && 'hidden md:block')} aria-label="Open item">
        {screen === 'loading' ? <DetailSkeleton /> : sel ? <Detail t={sel} key={sel.id} /> : <Empty title="Choose an item">Pick anything on the left to see what Patrick found and what it needs from you.</Empty>}
      </section>
    </div>
  )
}

function DetailSkeleton() {
  return <div className="grid gap-4 p-6"><Skel className="h-6 w-2/3" /><Skel className="h-4 w-1/3" /><Skel className="h-28 w-full" /><Skel className="h-40 w-full" /></div>
}

function Detail({ t }: { t: Task }) {
  const { approve, takeOver, recover, choice, choose } = useStore()
  const [declining, setDeclining] = useState(false)
  const busy = t.state === 'approving'
  const canAct = t.state === 'needs_review' && t.proposal
  return (
    <div className="grid xl:grid-cols-[1fr_320px]">
      <div className="grid content-start gap-6 p-5 md:p-6">
        <Link to="/queue" className="flex items-center gap-1 text-[13px] text-muted md:hidden"><ArrowLeftIcon />Queue</Link>
        <header className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
            <span className="font-mono">{t.id}</span>·<span>{WF[t.workflow]}</span>·<StatePill state={t.state} />
            {t.slaMin !== undefined && (t.state === 'needs_review' || t.state === 'failed') && <span className={cn('tnum', t.slaMin < 60 && 'font-medium text-warning')}>Clinic target: {sla(t.slaMin)}</span>}
          </div>
          <h1 className="text-[20px] font-semibold leading-snug tracking-[-0.01em]">{t.title}</h1>
          <p className="max-w-[68ch] text-[14px]">{t.summary}</p>
        </header>

        {t.state === 'running' && (t.progress ? <Progress {...t.progress} /> : <Indeterminate />)}
        {t.state === 'waiting' && <Callout icon={<LoopIcon />} title="Waiting on someone outside the clinic">{t.waitingOn}</Callout>}
        {t.state === 'queued' && <Callout icon={<InfoCircledIcon />} title="Queued">Starts on its own. You can still take it over before then.</Callout>}

        {t.failure && t.state === 'failed' && <Recovery t={t} onPick={(o) => recover(t.id, o)} />}

        {t.candidates && (
          <fieldset className="grid gap-2" disabled={!canAct}>
            <legend className="mb-2 text-[16px] font-semibold">Which patient is it?</legend>
            {t.candidates.map((c) => (
              <label key={c.id} className={cn('flex cursor-pointer items-start gap-3 rounded-card border border-edge p-3', choice[t.id] === c.id && 'border-accent bg-accent-soft/40')}>
                <input type="radio" name={`cand-${t.id}`} className="mt-1 accent-[var(--color-accent)]" checked={choice[t.id] === c.id} onChange={() => choose(t.id, c.id)} />
                <span className="grid flex-1 gap-0.5">
                  <span className="flex flex-wrap items-baseline gap-x-2"><b className="font-semibold">{c.name}</b><span className="text-muted">born {c.dob}</span><span className="font-mono text-[12.5px] text-muted">{c.mrn}</span><span className="tnum ml-auto text-[13px] text-muted">{pct(c.match)} match</span></span>
                  <span className="text-[13px] text-muted">{c.why}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {t.proposal && (
          <section className="grid gap-3 rounded-card bg-raised p-4" aria-label="What Patrick will do">
            <div className="flex items-start gap-3">
              <ActorMark actor={{ kind: 'agent', name: 'Patrick' }} size={24} />
              <div className="grid gap-1">
                <p className="text-[12.5px] text-muted">{t.state === 'done' ? 'Approved' : t.state === 'failed' ? 'Original plan, not done' : 'If you approve, Patrick will'}</p>
                <p className={cn('text-[15px] font-semibold', t.state === 'failed' && 'text-muted line-through decoration-1')}>{t.proposal.verb}</p>
              </div>
            </div>
            <ul className="grid gap-1.5 pl-9 text-[13.5px]">
              {t.proposal.effects.map((e) => <li key={e} className="flex gap-2"><CheckIcon className="mt-0.5 shrink-0 text-muted" />{e}</li>)}
            </ul>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-9 text-[12.5px] text-muted">
              <span>{t.proposal.reversible ? 'Can be undone for 10 seconds, then from Activity' : 'Cannot be undone'}</span>
              <span>Asked because: {t.proposal.rule}</span>
            </p>
          </section>
        )}

        {(canAct || busy) && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="lg" pending={busy} onClick={() => approve(t.id)}>{busy ? 'Sending' : <><CheckIcon />Approve</>}{!busy && <span className="ml-1 opacity-60"><Kbd>A</Kbd></span>}</Button>
            <Button size="lg" disabled={busy} onClick={() => setDeclining(true)}>Decline</Button>
            <Button size="lg" variant="ghost" disabled={busy} onClick={() => takeOver(t.id)}>I&apos;ll do it myself</Button>
            {busy && <p className="text-[13px] text-muted" role="status">Sent to the schedule. Waiting for it to confirm.</p>}
          </div>
        )}
        {t.state === 'needs_review' && !t.proposal && (
          <Callout icon={<InfoCircledIcon />} title={`Handed to ${t.owner.kind === 'human' ? t.owner.name : 'staff'}`}>Patrick does not write clinical notes. When the notes are attached, Patrick submits them to the payer and tracks the answer.</Callout>
        )}
        {t.state === 'done' && <Callout tone="pos" icon={<CheckIcon />} title="Done">Confirmed by the receiving system. The full trail is in Activity.</Callout>}

        {t.evidence && (
          <section className="grid gap-2">
            <h3 className="text-[16px] font-semibold">What Patrick read</h3>
            <dl className="grid">
              {t.evidence.map((e) => (
                <div key={e.label} className="grid grid-cols-1 gap-x-4 border-b border-rule py-2.5 sm:grid-cols-[180px_1fr_auto]">
                  <dt className="text-[13px] text-muted">{e.label}</dt>
                  <dd className="text-[14px]">{e.value}<span className="block text-[12.5px] text-faint">{e.source}</span></dd>
                  {e.confidence !== undefined && <dd className={cn('tnum text-[13px]', e.confidence < 0.9 ? 'font-medium text-warning' : 'text-muted')}>{pct(e.confidence)} sure</dd>}
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      <aside className="grid content-start gap-4 border-edge p-5 md:p-6 xl:border-l" aria-label="Details">
        <dl className="grid text-[13.5px]">
          {t.patient && <>
            <Row k="Patient" v={t.patient.name} />
            <Row k="Born" v={t.patient.dob} />
            <Row k="Record" v={<span className="font-mono text-[12.5px]">{t.patient.mrn}</span>} />
            <Row k="Insurance" v={t.patient.payer ?? 'None on file'} />
          </>}
          <Row k="Owner" v={<ActorName actor={t.owner} />} />
          <Row k="Opened" v={ago(t.createdMin)} />
          {t.confidence !== undefined && <Row k="Patrick's confidence" v={<span className="tnum">{pct(t.confidence)}</span>} />}
        </dl>
        {t.runId && RUNS.some((r) => r.id === t.runId) && <Button asChild variant="secondary"><Link to={`/runs/${t.runId}`}><ExternalLinkIcon />See every step ({t.runId})</Link></Button>}
        {t.state !== 'done' && t.state !== 'cancelled' && t.owner.kind === 'agent' && <Button variant="ghost" onClick={() => takeOver(t.id)}>Take this over from Patrick</Button>}
      </aside>

      <DeclineDialog open={declining} onOpenChange={setDeclining} t={t} />
    </div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="grid grid-cols-[120px_1fr] items-center gap-3 py-1.5"><dt className="text-muted">{k}</dt><dd className="min-w-0">{v}</dd></div>
}

function Callout({ icon, title, children, tone }: { icon: React.ReactNode; title: string; children: React.ReactNode; tone?: 'pos' }) {
  return (
    <div className={cn('flex gap-3 rounded-card p-3.5 text-[13.5px]', tone === 'pos' ? 'bg-pos-bg text-pos-ink' : 'bg-raised')}>
      <span className="mt-0.5">{icon}</span><div><p className="font-semibold">{title}</p><p className="mt-0.5">{children}</p></div>
    </div>
  )
}

function Recovery({ t, onPick }: { t: Task; onPick: (id: string) => void }) {
  const f = t.failure!
  return (
    <section className="grid gap-3 rounded-card border border-[#f3c6c2] p-4" aria-label="What went wrong">
      <div className="grid gap-1">
        <p className="flex flex-wrap items-center gap-2 font-semibold text-negative"><StateGlyph state="failed" />{f.message}</p>
        <p className="tnum text-[12.5px] text-muted"><span className="font-mono">{f.code}</span> · attempt {f.attempts} of {f.maxAttempts}{f.nextRetryInMin ? ` · Patrick retries by itself in ${f.nextRetryInMin} min` : ''}</p>
      </div>
      <div className="grid gap-2">
        {f.options.map((o) => (
          <button key={o.id} onClick={() => onPick(o.id)} className={cn('grid gap-0.5 rounded-card border border-edge p-3 text-left hover:bg-raised', o.primary && 'border-ink')}>
            <span className="flex items-center gap-2 text-[14px] font-semibold">{o.label}{o.primary && <Pill tone="info">Suggested</Pill>}</span>
            <span className="text-[13px] text-muted">{o.detail}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function DeclineDialog({ open, onOpenChange, t }: { open: boolean; onOpenChange: (o: boolean) => void; t: Task }) {
  const { reject } = useStore()
  const [why, setWhy] = useState('')
  const reasons = ['Wrong patient', 'Wrong time or therapist', 'Patient already contacted', 'Not needed']
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-[min(440px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-card bg-sheet p-5 border border-edge fd-in">
          <Dialog.Title className="text-[16px] font-semibold">Decline this?</Dialog.Title>
          <Dialog.Description className="text-[13.5px] text-muted">Patrick learns from the reason and will not propose the same thing for this patient again.</Dialog.Description>
          <div className="flex flex-wrap gap-2">{reasons.map((r) => <button key={r} onClick={() => setWhy(r)} className={cn('h-7 rounded-full px-3 text-[13px] border border-edge', why === r && 'bg-ink text-white border-ink')}>{r}</button>)}</div>
          <div className="flex justify-end gap-2"><Dialog.Close asChild><Button>Keep it</Button></Dialog.Close><Button variant="danger" disabled={!why} onClick={() => { reject(t.id, why); onOpenChange(false) }}>Decline</Button></div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

