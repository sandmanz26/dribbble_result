import { forwardRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as SelectP from '@radix-ui/react-select'
import * as DialogP from '@radix-ui/react-dialog'
import { CheckIcon, ChevronDownIcon, Cross2Icon, ExclamationTriangleIcon, PauseIcon, PersonIcon, ReloadIcon } from '@radix-ui/react-icons'
import { age, maskNik, type Patient, type Payer, PAYER } from '@/data/clinic'
import { STAGES, type Stage } from '@/data/visits'
import type { JobState } from '@/data/ops'
import { cn } from '@/lib/utils'
import { Pill, Tip } from './ui/misc'
import { Button } from './ui/button'
import { useStore } from '@/store'

// ---------- Job states: one vocabulary for every background job and every ask ----------
export const STATE: Record<JobState, { label: string; tone: 'pos' | 'neg' | 'warn' | 'neu' | 'info'; hint: string }> = {
  queued: { label: 'Queued', tone: 'neu', hint: 'Accepted, waits for a worker or an earlier step' },
  running: { label: 'Sending', tone: 'info', hint: 'Being sent now' },
  waiting: { label: 'Waiting', tone: 'neu', hint: 'Blocked on someone outside the clinic' },
  needs_review: { label: 'Needs you', tone: 'warn', hint: 'Asa stopped and asked a person' },
  approving: { label: 'Applying', tone: 'info', hint: 'Approved; being applied and not yet confirmed' },
  failed: { label: 'Failed', tone: 'neg', hint: 'Stopped with an error; see how to fix it' },
  done: { label: 'Done', tone: 'pos', hint: 'Finished and confirmed by the other system' },
  cancelled: { label: 'Declined', tone: 'neu', hint: 'Stopped by a person' },
}
export function StateGlyph({ state, size = 16 }: { state: JobState; size?: number }) {
  const s = { width: size, height: size }
  const c = 'grid shrink-0 place-items-center rounded-full'
  if (state === 'done') return <span style={s} className={cn(c, 'bg-positive text-white')}><CheckIcon width={size - 4} height={size - 4} /></span>
  if (state === 'failed') return <span style={s} className={cn(c, 'bg-negative text-white')}><Cross2Icon width={size - 6} height={size - 6} /></span>
  if (state === 'needs_review') return <span style={s} className={cn(c, 'bg-[#b8650f] text-white')}><PersonIcon width={size - 6} height={size - 6} /></span>
  if (state === 'running' || state === 'approving') return <span style={s} className={cn(c, 'border-2 border-accent border-r-transparent fd-spin')} />
  if (state === 'waiting') return <span style={s} className={cn(c, 'border-2 border-dashed border-faint text-faint')}><PauseIcon width={size - 8} height={size - 8} /></span>
  return <span style={s} className={cn(c, 'border-2 border-control')} />
}
export function StatePill({ state }: { state: JobState }) {
  const m = STATE[state]
  return <Tip label={m.hint}><span><Pill tone={m.tone}>{m.label}</Pill></span></Tip>
}

// ---------- People ----------
export function Avatar({ name, size = 28, asa }: { name: string; size?: number; asa?: boolean }) {
  if (asa || name === 'Asa') return <span title="Asa, the clinic's AI assistant" style={{ width: size, height: size, fontSize: size * 0.46 }} className="grid shrink-0 place-items-center rounded-[7px] bg-accent font-bold text-white">A</span>
  const clean = name.replace(/^(dr\.|drg\.|apt\.|Bdn\.)\s*/i, '')
  const ini = clean.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return <span title={name} style={{ width: size, height: size, fontSize: size * 0.4 }} className="grid shrink-0 place-items-center rounded-full bg-neu-bg font-semibold text-neu-ink">{ini}</span>
}
export function PatientLine({ p, sub }: { p: Patient; sub?: React.ReactNode }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={p.name} size={30} />
      <span className="min-w-0">
        <b className="block truncate text-[14px] font-semibold">{p.name}</b>
        <span className="block truncate text-[12.5px] text-muted">{sub ?? <>{p.sex === 'L' ? 'M' : 'F'}, {age(p.dob)} y · <span className="font-mono text-[12px]">{p.rm}</span></>}</span>
      </span>
    </span>
  )
}
export function PayerPill({ payer, check }: { payer: Payer; check?: 'active' | 'inactive' | 'other_fktp' | 'pending' }) {
  if (payer !== 'bpjs') return <Pill tone="neu">{PAYER[payer]}</Pill>
  if (check === 'pending') return <Pill tone="info"><span className="size-2.5 rounded-full border-[1.5px] border-current border-r-transparent fd-spin" />BPJS checking</Pill>
  if (check === 'inactive') return <Pill tone="neg">BPJS inactive</Pill>
  if (check === 'other_fktp') return <Pill tone="warn">BPJS other FKTP</Pill>
  return <Pill tone="pos">BPJS active</Pill>
}

// ---------- The patient's path through the clinic (the product's signature) ----------
const PATH: Stage[] = ['vitals', 'doctor_queue', 'consult', 'lab', 'pharmacy', 'cashier', 'done']
export function StagePath({ stage, compact }: { stage: Stage; compact?: boolean }) {
  const i = PATH.indexOf(stage)
  return (
    <ol className="flex items-center gap-1" aria-label={`Now: ${STAGES.find((s) => s.id === stage)?.name}`}>
      {PATH.map((s, k) => (
        <li key={s} className="flex items-center gap-1">
          <Tip label={STAGES.find((x) => x.id === s)!.name}>
            <span className={cn('block rounded-full transition-colors', compact ? 'h-1.5 w-4' : 'h-2 w-7', k < i ? 'bg-accent/55' : k === i ? 'bg-accent' : 'bg-active')} />
          </Tip>
        </li>
      ))}
    </ol>
  )
}

// ---------- Page structure and screen states ----------
export function useScreenState(ms = 380): 'loading' | 'empty' | 'error' | 'ready' {
  const q = new URLSearchParams(useLocation().search).get('state')
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), ms); return () => clearTimeout(t) }, [ms])
  if (q === 'loading' || q === 'empty' || q === 'error') return q
  return ready ? 'ready' : 'loading'
}
export function PageHead({ title, sub, children }: { title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="grid gap-1">
        <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em]">{title}</h1>
        {sub && <p className="max-w-[80ch] text-[13.5px] text-muted">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
export function Panel({ title, action, children, className, pad = true }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cn('rounded-card border border-edge bg-sheet', className)}>
      {title && <header className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3"><h2 className="text-[14.5px] font-semibold">{title}</h2>{action}</header>}
      <div className={pad ? 'p-4' : ''}>{children}</div>
    </section>
  )
}
export function Stat({ label, value, note, tone }: { label: string; value: React.ReactNode; note?: React.ReactNode; tone?: 'neg' | 'pos' | 'warn' }) {
  return (
    <div className="grid content-start gap-1">
      <p className="text-[12.5px] font-medium text-muted">{label}</p>
      <p className={cn('tnum text-[26px] font-medium leading-tight tracking-[-0.02em]', tone === 'neg' && 'text-negative', tone === 'warn' && 'text-warning')}>{value}</p>
      {note && <p className="text-[12.5px] text-muted">{note}</p>}
    </div>
  )
}
export function ErrorBlock({ what }: { what: string }) {
  return (
    <div className="grid justify-items-start gap-2 rounded-card bg-neg-bg p-4 text-neg-ink" role="alert">
      <p className="flex items-center gap-2 font-semibold"><ExclamationTriangleIcon />Couldn&apos;t load {what}</p>
      <p className="text-[13.5px]">The server did not answer within 10 seconds. Work you already saved is safe; new entries wait on this device and send when the connection is back.</p>
      <Button size="sm" onClick={() => window.location.replace(window.location.href.replace(/[?&]state=error/, ''))}><ReloadIcon />Try again</Button>
    </div>
  )
}
export function Empty({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="grid justify-items-center gap-2 px-6 py-12 text-center">
      <p className="text-[15px] font-semibold">{title}</p>
      {children && <p className="max-w-[46ch] text-[13.5px] text-muted">{children}</p>}
      {action}
    </div>
  )
}
export const Rows = ({ n = 6 }: { n?: number }) => <div className="grid gap-2">{Array.from({ length: n }, (_, i) => <span key={i} className="block h-11 fd-skel" />)}</div>

// ---------- Form controls ----------
export function Field({ label, hint, error, children, className }: { label: string; hint?: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('grid content-start gap-1.5', className)}>
      <span className="text-[12.5px] font-medium text-muted">{label}</span>
      {children}
      {error ? <span className="text-[12.5px] font-medium text-negative">{error}</span> : hint && <span className="text-[12px] text-faint">{hint}</span>}
    </label>
  )
}
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn('h-9 w-full rounded-control border border-control bg-sheet px-3 text-[14px] outline-none placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/15 aria-[invalid=true]:border-negative', className)} {...p} />
))
Input.displayName = 'Input'
export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={cn('min-h-[72px] w-full rounded-control border border-control bg-sheet px-3 py-2 text-[14px] leading-relaxed outline-none placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/15', p.className)} />
}
export function Select({ value, onChange, options, placeholder, className, label }: { value: string; onChange: (v: string) => void; options: { value: string; label: string; hint?: string }[]; placeholder?: string; className?: string; label?: string }) {
  return (
    <SelectP.Root value={value} onValueChange={onChange}>
      <SelectP.Trigger aria-label={label} className={cn('flex h-9 w-full items-center justify-between gap-2 rounded-control border border-control bg-sheet px-3 text-left text-[14px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 data-[placeholder]:text-faint', className)}>
        <SelectP.Value placeholder={placeholder} /><SelectP.Icon><ChevronDownIcon className="text-muted" /></SelectP.Icon>
      </SelectP.Trigger>
      <SelectP.Portal>
        <SelectP.Content position="popper" sideOffset={4} className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-card border border-edge bg-sheet p-1 fd-in">
          <SelectP.Viewport>
            {options.map((o) => (
              <SelectP.Item key={o.value} value={o.value} className="relative flex cursor-pointer select-none flex-col rounded-[6px] py-1.5 pl-7 pr-3 text-[13.5px] outline-none data-[highlighted]:bg-raised">
                <SelectP.ItemIndicator className="absolute left-2 top-2"><CheckIcon /></SelectP.ItemIndicator>
                <SelectP.ItemText>{o.label}</SelectP.ItemText>
                {o.hint && <span className="text-[12px] text-muted">{o.hint}</span>}
              </SelectP.Item>
            ))}
          </SelectP.Viewport>
        </SelectP.Content>
      </SelectP.Portal>
    </SelectP.Root>
  )
}
export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-control border border-edge bg-raised p-0.5">
      {options.map((o) => <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} className={cn('h-8 rounded-[6px] px-3 text-[13px] font-medium text-muted', value === o.value && 'bg-sheet text-ink outline outline-1 outline-edge')}>{o.label}</button>)}
    </div>
  )
}
export function Sheet({ open, onOpenChange, title, description, children, wide }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <DialogP.Root open={open} onOpenChange={onOpenChange}>
      <DialogP.Portal>
        <DialogP.Overlay className="fixed inset-0 z-40 bg-[#0b1412]/35" />
        <DialogP.Content className={cn('fixed inset-y-2 right-2 z-50 flex w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[14px] border border-edge bg-sheet fd-in', wide ? 'max-w-[760px]' : 'max-w-[520px]')} aria-describedby={description ? undefined : undefined}>
          <header className="flex items-start justify-between gap-4 border-b border-rule px-5 py-4">
            <div><DialogP.Title className="text-[17px] font-semibold tracking-[-0.01em]">{title}</DialogP.Title>{description && <DialogP.Description className="mt-0.5 text-[13px] text-muted">{description}</DialogP.Description>}</div>
            <DialogP.Close className="grid size-8 place-items-center rounded-control text-muted hover:bg-raised" aria-label="Close"><Cross2Icon /></DialogP.Close>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </DialogP.Content>
      </DialogP.Portal>
    </DialogP.Root>
  )
}

// ---------- Toasts with undo ----------
export function Toaster() {
  const { toasts, dismiss } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-14 right-4 z-50 grid w-[min(380px,calc(100vw-32px))] gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-card bg-ink p-3 text-[13.5px] text-white fd-in">
          <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', t.tone === 'err' ? 'bg-[#ff8a80]' : 'bg-[#7fd1a6]')} aria-hidden="true" />
          <p className="min-w-0 flex-1">{t.text}</p>
          {t.undo && <UndoButton onUndo={() => { t.undo!(); dismiss(t.id) }} />}
          <button className="text-white/60 hover:text-white" onClick={() => dismiss(t.id)} aria-label="Dismiss"><Cross2Icon /></button>
        </div>
      ))}
    </div>
  )
}
function UndoButton({ onUndo }: { onUndo: () => void }) {
  const [left, setLeft] = useState(8)
  useEffect(() => { const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000); return () => clearInterval(t) }, [])
  return <button className="tnum shrink-0 rounded-control bg-white/15 px-2 py-0.5 text-[12.5px] font-semibold hover:bg-white/25" onClick={onUndo}>Undo {left}s</button>
}

export const nikLine = (p: Patient) => maskNik(p.nik)
