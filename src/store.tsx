import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { LOG, ME, PATRICK, TASKS } from '@/data/demo'
import type { LogEntry, Task } from '@/data/types'

// Client-side stand-in for the API. Every action follows the same contract the real one would:
// optimistic state first ('approving'), then the server's answer (done or failed), and an undo
// window for anything reversible. Timings are short so a reviewer sees each state.
export const SEND_MS = 1400
export const UNDO_MS = 10000

export type Rule = { id: string; action: string; detail: string; mode: 'auto' | 'ask' | 'never'; risk: 'low' | 'medium' | 'high'; locked?: boolean }
const RULES: Rule[] = [
  { id: 'r1', action: 'File a referral to a patient chart', detail: 'When the patient match is 90% or higher.', mode: 'auto', risk: 'low' },
  { id: 'r2', action: 'Run insurance checks', detail: 'Before every visit, the day before, and when a referral arrives.', mode: 'auto', risk: 'low' },
  { id: 'r3', action: 'Book follow-up visits', detail: 'Inside an approved plan of care and authorization.', mode: 'auto', risk: 'medium' },
  { id: 'r4', action: 'Book initial evaluations', detail: 'First visit for a new referral.', mode: 'ask', risk: 'medium' },
  { id: 'r5', action: 'Submit prior authorization requests', detail: 'With the documents the payer lists.', mode: 'ask', risk: 'medium' },
  { id: 'r6', action: 'Message patients about money', detail: 'Coverage, balances, copays.', mode: 'ask', risk: 'high', locked: true },
  { id: 'r7', action: 'Cancel or hold a visit', detail: 'Any reason.', mode: 'ask', risk: 'high' },
  { id: 'r8', action: 'Write or change clinical notes', detail: 'Patrick never writes clinical content.', mode: 'never', risk: 'high', locked: true },
]

type Toast = { id: number; text: string; undoTaskId?: string; tone?: 'ok' | 'err' }
type Ctx = {
  tasks: Task[]; log: LogEntry[]; rules: Rule[]; toasts: Toast[]
  task: (id: string) => Task | undefined
  approve: (id: string, note?: string) => void
  reject: (id: string, reason: string) => void
  takeOver: (id: string) => void
  recover: (id: string, option: string) => void
  undo: (id: string) => void
  setRule: (id: string, mode: Rule['mode']) => void
  dismiss: (id: number) => void
  choice: Record<string, string>
  choose: (taskId: string, value: string) => void
}
const C = createContext<Ctx | null>(null)

let seq = 100
const entry = (e: Omit<LogEntry, 'id' | 'min'>): LogEntry => ({ id: `n${seq++}`, min: 0, ...e })

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [log, setLog] = useState<LogEntry[]>(LOG)
  const [rules, setRules] = useState<Rule[]>(RULES)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [choice, setChoice] = useState<Record<string, string>>({ 'T-2088': 'p1' })
  const conflictShown = useRef(false)

  const patch = useCallback((id: string, p: Partial<Task>) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t))), [])
  const addLog = (e: Omit<LogEntry, 'id' | 'min'>) => setLog((l) => [entry(e), ...l])
  const toast = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((ts) => [...ts.slice(-2), { id, ...t }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), t.undoTaskId ? UNDO_MS : 5000)
  }
  const task = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])

  // Running jobs make progress on their own.
  useEffect(() => {
    const t = setInterval(() => setTasks((ts) => ts.map((x) => {
      if (x.state !== 'running' || !x.progress) return x
      const done = Math.min(x.progress.total, x.progress.done + 1)
      return done === x.progress.total ? { ...x, state: 'done', progress: { ...x.progress, done } } : { ...x, progress: { ...x.progress, done } }
    })), 3500)
    return () => clearInterval(t)
  }, [])

  const approve = (id: string, note?: string) => {
    const t = task(id); if (!t) return
    patch(id, { state: 'approving' })
    setTimeout(() => {
      // The first approval of Ana Torres's booking meets a real-world conflict, to show recovery.
      if (id === 'T-2086' && !conflictShown.current) {
        conflictShown.current = true
        patch(id, { state: 'failed', owner: ME, failure: { code: 'SLOT_TAKEN', message: 'The 09:30 slot was booked by another user 2 minutes ago', attempts: 1, maxAttempts: 1,
          options: [
            { id: 'slot-1030', label: 'Book 10:30 the same day', detail: 'Tue 3 Nov, 10:30 to 11:30, Sam Whitaker, Room 2', primary: true },
            { id: 'slot-wed', label: 'Book Wed 4 Nov, 09:00', detail: 'Same therapist, still before the 6 Nov deadline' },
            { id: 'manual', label: 'Pick a time myself', detail: 'Opens the schedule with Sam\'s free slots highlighted' },
          ] } })
        addLog({ actor: PATRICK, verb: 'could not book', object: 'Tue 3 Nov 09:30 for Ana Torres (slot taken)', result: 'failed', taskId: id })
        toast({ text: 'That slot was just taken. Pick another below.', tone: 'err' })
        return
      }
      patch(id, { state: 'done', owner: ME })
      addLog({ actor: ME, verb: 'approved', object: `${t.proposal?.verb ?? t.title}${note ? ` (note: ${note})` : ''}`, result: 'ok', undo: t.proposal?.reversible, taskId: id })
      toast({ text: `Done: ${t.title}`, undoTaskId: t.proposal?.reversible ? id : undefined })
    }, SEND_MS)
  }

  const reject = (id: string, reason: string) => {
    const t = task(id); if (!t) return
    patch(id, { state: 'cancelled', owner: ME })
    addLog({ actor: ME, verb: 'declined', object: `${t.title} (${reason})`, result: 'ok', taskId: id })
    toast({ text: 'Declined. Patrick will not try this again for this patient.', undoTaskId: id })
  }

  const takeOver = (id: string) => {
    const t = task(id); if (!t) return
    patch(id, { owner: ME, state: t.state === 'failed' ? 'needs_review' : t.state })
    addLog({ actor: ME, verb: 'took over', object: t.title, result: 'ok', taskId: id })
    toast({ text: 'It\'s yours. Patrick will not act on it until you hand it back.' })
  }

  const recover = (id: string, option: string) => {
    const t = task(id); if (!t) return
    if (option.startsWith('slot-')) {
      patch(id, { state: 'approving', failure: undefined })
      const when = option === 'slot-1030' ? 'Tue 3 Nov, 10:30' : 'Wed 4 Nov, 09:00'
      setTimeout(() => {
        patch(id, { state: 'done', proposal: t.proposal && { ...t.proposal, verb: `Book ${when} with Sam Whitaker, Room 2, and text Ana a confirmation` } })
        addLog({ actor: ME, verb: 'booked', object: `Initial evaluation for Ana Torres, ${when}`, result: 'ok', undo: true, taskId: id })
        toast({ text: `Booked ${when}. Ana gets a text now.`, undoTaskId: id })
      }, SEND_MS)
      return
    }
    if (option === 'retry') {
      patch(id, { state: 'running', failure: undefined, progress: undefined })
      addLog({ actor: ME, verb: 'retried', object: t.title, result: 'ok', taskId: id })
      setTimeout(() => { patch(id, { state: 'done' }); addLog({ actor: PATRICK, verb: 'confirmed coverage', object: 'Daniel Okoro, UnitedHealthcare, copay $40', result: 'ok', taskId: id }); toast({ text: 'Coverage confirmed for Daniel Okoro.' }) }, 2600)
      return
    }
    if (option === 'resend') {
      patch(id, { state: 'waiting', failure: undefined, waitingOn: 'Northgate Family Medicine to fax pages 2 and 3 again' })
      addLog({ actor: PATRICK, verb: 'faxed a resend request', object: 'Northgate Family Medicine, pages 2 and 3', result: 'ok', taskId: id })
      toast({ text: 'Request faxed. Patrick will match the new pages when they arrive.' })
      return
    }
    if (option === 'skip') {
      patch(id, { state: 'done', failure: undefined })
      addLog({ actor: ME, verb: 'marked unverified', object: `${t.title}, check card at arrival`, result: 'ok', taskId: id })
      toast({ text: 'Marked unverified. The front desk sees a reminder at check-in.' })
      return
    }
    takeOver(id)
  }

  const undo = (id: string) => {
    const t = task(id); if (!t) return
    patch(id, { state: 'needs_review', failure: undefined })
    addLog({ actor: ME, verb: 'undid', object: t.title, result: 'undone', taskId: id })
    setToasts((ts) => ts.filter((x) => x.undoTaskId !== id))
    toast({ text: 'Undone. Nothing was sent to the patient.' })
  }

  const setRule = (id: string, mode: Rule['mode']) => {
    const r = rules.find((x) => x.id === id); if (!r || r.locked) return
    setRules((rs) => rs.map((x) => (x.id === id ? { ...x, mode } : x)))
    addLog({ actor: ME, verb: 'changed rule', object: `"${r.action}" to ${mode === 'auto' ? 'Do it' : mode === 'ask' ? 'Ask first' : 'Never'}`, result: 'ok' })
  }

  const value: Ctx = { tasks, log, rules, toasts, task, approve, reject, takeOver, recover, undo, setRule, dismiss: (id) => setToasts((ts) => ts.filter((x) => x.id !== id)), choice, choose: (k, v) => setChoice((c) => ({ ...c, [k]: v })) }
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useStore() {
  const c = useContext(C)
  if (!c) throw new Error('useStore outside StoreProvider')
  return c
}
