// Shapes the prototype assumes for the Laravel API. Every async thing Patrick does is a Job with a
// state; a Task is the unit people see in the queue; a Run is the ordered list of jobs for one
// workflow. See docs/handoff.md for the JSON these map to.

export type JobState =
  | 'queued' // accepted, not started
  | 'running' // a worker has it; progress may be known
  | 'waiting' // blocked on someone outside the clinic (payer, fax sender, patient)
  | 'needs_review' // Patrick stopped and asked a person
  | 'approving' // a person approved; the action is being sent (optimistic, not yet confirmed)
  | 'failed' // stopped with an error; may retry by itself
  | 'done'
  | 'cancelled'

export type Actor = { kind: 'agent'; name: 'Patrick' } | { kind: 'human'; id: string; name: string; role: string }

export type Workflow = 'referral' | 'eligibility' | 'scheduling' | 'prior_auth' | 'reminders'

export type Patient = { id: string; name: string; dob: string; mrn: string; payer?: string }

export type Evidence = { label: string; value: string; source: string; confidence?: number }

export type Proposal = {
  verb: string // what Patrick will do, as a sentence starting with a verb
  effects: string[] // what changes, outside Flow Director included
  reversible: boolean
  risk: 'low' | 'medium' | 'high'
  rule: string // the autonomy rule that made Patrick ask
}

export type Failure = { code: string; message: string; attempts: number; maxAttempts: number; nextRetryInMin?: number; options: { id: string; label: string; detail: string; primary?: boolean }[] }

export type Task = {
  id: string
  workflow: Workflow
  title: string
  patient?: Patient
  state: JobState
  owner: Actor
  createdMin: number // minutes ago
  slaMin?: number // minutes left before the clinic's target, negative when late
  priority: 'normal' | 'high' | 'urgent'
  summary: string
  confidence?: number
  progress?: { done: number; total: number; label: string }
  waitingOn?: string
  proposal?: Proposal
  evidence?: Evidence[]
  candidates?: { id: string; name: string; dob: string; mrn: string; match: number; why: string }[]
  failure?: Failure
  runId?: string
}

export type Step = {
  id: string
  name: string
  state: JobState
  startedMin?: number // minutes ago
  durationSec?: number
  detail: string
  attempts?: { at: string; result: string; ok: boolean }[]
  output?: { label: string; value: string }[]
}

export type Run = { id: string; taskId: string; workflow: Workflow; title: string; source: string; patientId?: string; steps: Step[] }

export type LogEntry = { id: string; min: number; actor: Actor; verb: string; object: string; result: 'ok' | 'failed' | 'asked' | 'undone'; undo?: boolean; taskId?: string }
