import { CheckIcon, Cross2Icon, ClockIcon, PauseIcon, ExclamationTriangleIcon, DotsHorizontalIcon, PersonIcon, UpdateIcon } from '@radix-ui/react-icons'
import type { Actor, JobState } from '@/data/types'
import { cn } from '@/lib/utils'
import { Pill, Tip } from './ui/misc'

// One vocabulary for every async state, used in the queue, the run timeline, the log and the spec.
export const STATE: Record<JobState, { label: string; tone: 'pos' | 'neg' | 'warn' | 'neu' | 'info'; hint: string }> = {
  queued: { label: 'Queued', tone: 'neu', hint: 'Accepted, waiting for a worker or an earlier step' },
  running: { label: 'Running', tone: 'info', hint: 'Patrick is working on it now' },
  waiting: { label: 'Waiting on others', tone: 'neu', hint: 'Blocked on someone outside the clinic' },
  needs_review: { label: 'Needs you', tone: 'warn', hint: 'Patrick stopped and asked a person' },
  approving: { label: 'Sending', tone: 'info', hint: 'Approved; the action is being sent and not yet confirmed' },
  failed: { label: 'Failed', tone: 'neg', hint: 'Stopped with an error; see the recovery options' },
  done: { label: 'Done', tone: 'pos', hint: 'Finished and confirmed' },
  cancelled: { label: 'Cancelled', tone: 'neu', hint: 'Stopped by a person' },
}

// The state glyph: a ring that fills as work moves on. Shape carries the state, not colour alone.
export function StateGlyph({ state, size = 16 }: { state: JobState; size?: number }) {
  const s = { width: size, height: size }
  const ring = 'grid shrink-0 place-items-center rounded-full'
  switch (state) {
    case 'done': return <span style={s} className={cn(ring, 'bg-positive text-white')}><CheckIcon width={size - 4} height={size - 4} /></span>
    case 'failed': return <span style={s} className={cn(ring, 'bg-negative text-white')}><Cross2Icon width={size - 6} height={size - 6} /></span>
    case 'needs_review': return <span style={s} className={cn(ring, 'bg-[#c26a12] text-white')}><PersonIcon width={size - 6} height={size - 6} /></span>
    case 'running': return <span style={s} className={cn(ring, 'border-2 border-accent border-r-transparent fd-spin')} />
    case 'approving': return <span style={s} className={cn(ring, 'border-2 border-accent border-r-transparent fd-spin')} />
    case 'waiting': return <span style={s} className={cn(ring, 'border-2 border-dashed border-faint text-faint')}><PauseIcon width={size - 8} height={size - 8} /></span>
    case 'cancelled': return <span style={s} className={cn(ring, 'border-2 border-control')} />
    default: return <span style={s} className={cn(ring, 'border-2 border-control')} />
  }
}

export function StatePill({ state }: { state: JobState }) {
  const m = STATE[state]
  return <Tip label={m.hint}><span><Pill tone={m.tone}>{m.label}</Pill></span></Tip>
}

// Patrick is always a square mark with a P; people are round initials. A reader can tell who did
// something without reading the name.
export function ActorMark({ actor, size = 22 }: { actor: Actor; size?: number }) {
  if (actor.kind === 'agent') {
    return <span aria-label="Patrick (AI)" title="Patrick, AI employee" style={{ width: size, height: size, fontSize: size * 0.5 }} className="grid shrink-0 place-items-center rounded-[6px] bg-accent font-semibold text-white">P</span>
  }
  const ini = actor.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return <span aria-label={actor.name} title={`${actor.name}, ${actor.role}`} style={{ width: size, height: size, fontSize: size * 0.42 }} className="grid shrink-0 place-items-center rounded-full bg-neu-bg font-semibold text-neu-ink">{ini}</span>
}

export function ActorName({ actor }: { actor: Actor }) {
  return <span className="inline-flex items-center gap-1.5"><ActorMark actor={actor} size={18} />{actor.kind === 'agent' ? <span>Patrick <span className="text-faint">(AI)</span></span> : actor.name}</span>
}

export function Progress({ done, total, label }: { done: number; total: number; label: string }) {
  return (
    <div className="grid gap-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-active" role="progressbar" aria-valuenow={done} aria-valuemax={total} aria-label={label}>
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <span className="tnum text-[12px] text-muted">{done} of {total} {label}</span>
    </div>
  )
}

export function Indeterminate() {
  return <div className="h-1 overflow-hidden rounded-full bg-active" aria-hidden="true"><div className="h-full w-2/5 rounded-full bg-accent fd-indeterminate" /></div>
}

export const icons = { ClockIcon, ExclamationTriangleIcon, DotsHorizontalIcon, UpdateIcon }
