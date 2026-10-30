import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Lightbulb, Close, Repeat, Copy, Check } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { PATHS, PEOPLE, BUDGETS, fmt, memoryOf } from '../data/myelin.js'
import { route } from '../engine.js'
import { Card, CardHead } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Dialog, DialogContent } from '../components/ui/dialog.jsx'
import { PathChip, PathMark, Avatar } from '../ui/kit.jsx'

// How long each stage shows in the prototype. Real Reason takes longer; the stage says so.
const STAGE_MS = { attention: 450, reflex: 300, recall: 900, reason: 2600 }

export function useStages(t) {
  const [now, setNow] = useState(Date.now())
  const live = t?.started && Date.now() - t.started < 8000
  useEffect(() => { if (!live) return; const id = setInterval(() => setNow(Date.now()), 80); return () => clearInterval(id) }, [live])
  if (!t?.started) return { stage: 'done', typed: t?.answer?.length || 0 }
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return { stage: 'done', typed: t.answer.length }
  const el = now - t.started
  const pathMs = t.escalated ? STAGE_MS.recall + STAGE_MS.reason : STAGE_MS[t.path]
  if (el < STAGE_MS.attention) return { stage: 'attention', typed: 0 }
  if (el < STAGE_MS.attention + pathMs) return { stage: t.escalated && el < STAGE_MS.attention + STAGE_MS.recall ? 'recall' : t.path, typed: 0 }
  const typed = Math.min(t.answer.length, Math.floor((el - STAGE_MS.attention - pathMs) / 9))
  return { stage: typed >= t.answer.length ? 'done' : 'writing', typed }
}

export default function TaskView() {
  const { id } = useParams()
  const { s, tasks, dispatch } = useStore()
  const [fixOpen, setFixOpen] = useState(false)
  const [fix, setFix] = useState('')
  const [copied, setCopied] = useState(false)
  const t = tasks.find((x) => x.id === id)
  const st = useStages(t)
  if (!t) return <p className="text-muted">That task is not in this workspace. <Link to="/app/tasks" className="underline">All tasks</Link></p>
  const ask = t.ask || `${t.type} task from ${PEOPLE[t.who].name}`
  const answer = t.answer || { reflex: 'Answered by replaying a habit the team approved. In the prototype, background tasks show this note instead of their full text.', recall: 'Answered from workspace memory and written up by the small model. In the prototype, background tasks show this note instead of their full text.', reason: 'Thought through by the large model. In the prototype, background tasks show this note instead of their full text.' }[t.path]
  const done = st.stage === 'done'
  const threshold = BUDGETS[s.budget].threshold
  const think = () => { const r = route(ask, { budget: s.budget, approved: s.approved, force: true }); const nid = `${t.id}-r`; dispatch({ type: 'add', task: { ...t, ...r, id: nid, at: new Date(t.at.getTime() + 60000), started: Date.now(), escalatedFrom: t.id, ask } }); window.location.hash = `#/app/tasks/${nid}` }
  const steps = [
    { k: 'attention', title: 'Attention', body: t.habit ? `Matched a habit: ${memoryOf(t.habit)?.text}.` : t.used?.length ? `Looked for anything familiar and found ${t.used.length} ${t.used.length === 1 ? 'memory' : 'memories'}.` : 'Looked for anything familiar and found nothing close enough.' },
    ...(t.escalated ? [{ k: 'recall', title: 'Recall', body: `${Math.round(t.conf * 100)}% sure, under your ${Math.round(threshold * 100)}% threshold. Not enough on its own.` }] : []),
    { k: t.path, title: PATHS[t.path].name, body: t.why || PATHS[t.path].what },
  ]
  const order = ['attention', 'recall', 'reflex', 'reason', 'writing', 'done']
  const reached = (k) => order.indexOf(st.stage) >= order.indexOf(k) || done || st.stage === 'writing'
  return (
    <div className="grid gap-6">
      <Link to="/app/tasks" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink"><ArrowLeft width={14} height={14} />Tasks</Link>
      <header className="flex items-start gap-3">
        <Avatar who={t.who} size={32} />
        <div className="min-w-0">
          <h1 className="sr-only">Task {t.id}</h1><p className="text-[19px] font-semibold leading-snug md:text-[22px]">{ask}</p>
          <p className="mt-1 text-[13px] text-muted">{PEOPLE[t.who].name} · <span className="num">{fmt.day(t.at)} {fmt.clock(t.at)}</span> · <span className="num">{t.id}</span>{t.escalatedFrom && <> · thought through again from <Link className="underline" to={`/app/tasks/${t.escalatedFrom}`}>{t.escalatedFrom}</Link></>}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid content-start gap-6">
          <Card aria-labelledby="ans-h">
            <CardHead id="ans-h" title="Answer">{done ? <PathChip t={t} /> : <span className="text-[12.5px] text-amber">{st.stage === 'writing' ? 'Writing' : `${st.stage[0].toUpperCase()}${st.stage.slice(1)}`}…</span>}</CardHead>
            {st.stage === 'attention' || ['reflex', 'recall', 'reason'].includes(st.stage) ? (
              <div className="scan h-20 rounded-[4px] bg-raised/60" role="status" aria-label="Working on it" />
            ) : (
              <p className={`whitespace-pre-line text-[15.5px] leading-relaxed ${st.stage === 'writing' ? 'caret' : ''}`}>{answer.slice(0, st.typed)}</p>
            )}
            {done && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-4">
                {t.path !== 'reason' && <Button variant="primary" onClick={think}><Lightbulb />Think it through</Button>}
                <Button variant="outline" onClick={() => setFixOpen(true)}><Close />That’s wrong</Button>
                {t.path === 'reason' && <Button variant="outline" asChild><Link to="/app/habits"><Repeat />Make it a habit</Link></Button>}
                <Button variant="ghost" onClick={async () => { try { await navigator.clipboard.writeText(answer); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* no clipboard */ } }}>{copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy'}</Button>
                {s.corrected.includes(t.id) && <Badge tone="warn" className="self-center">Corrected</Badge>}
              </div>
            )}
            {done && t.path !== 'reason' && <p className="mt-3 text-[12.5px] text-muted">Thinking it through would take about <span className="num">20 s</span> and <span className="num">{fmt.usd(t.base)}</span>.</p>}
          </Card>
          <Card aria-labelledby="mem-h">
            <CardHead id="mem-h" title={`Memories used`}><span className="num text-[12.5px] text-muted">{t.used?.length || 0}</span></CardHead>
            {t.used?.length ? (
              <ul className="grid gap-3">{t.used.map((m) => { const r = memoryOf(m); return <li key={m}><Link to={`/app/memory?id=${m}`} className="block text-[13px] hover:underline"><span className="num text-muted">{m}</span> {r?.text}</Link></li> })}</ul>
            ) : <p className="text-[13px] text-muted">None. This was new, so it reasoned from scratch. If it repeats, it can become a habit.</p>}
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card aria-labelledby="path-h">
            <CardHead id="path-h" title="How it got here" />
            <ol className="grid gap-4">
              {steps.map((x) => (
                <li key={x.k} className={`grid grid-cols-[14px_1fr] gap-3 transition-opacity ${reached(x.k) ? '' : 'opacity-35'}`}>
                  <span className="mt-1.5">{x.k === 'attention' ? <span className="block size-2 rounded-full border border-muted" /> : <PathMark path={x.k} />}</span>
                  <span><b className="block text-[13.5px] font-semibold">{x.title}</b><span className="text-[13px] text-muted">{x.body}</span></span>
                </li>
              ))}
            </ol>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-rule pt-4 text-[13px]">
              <div><dt className="text-muted">Confidence</dt><dd className="num text-[18px]">{Math.round(t.conf * 100)}%</dd></div>
              <div><dt className="text-muted">Threshold</dt><dd className="num text-[18px]">{Math.round(threshold * 100)}%</dd></div>
              <div><dt className="text-muted">This answer</dt><dd className="num text-[18px]">{fmt.usd(t.cost)}</dd></div>
              <div><dt className="text-muted">If reasoned</dt><dd className="num text-[18px]">{fmt.usd(t.base)}</dd></div>
            </dl>
          </Card>
        </div>
      </div>

      <Dialog open={fixOpen} onOpenChange={setFixOpen}>
        <DialogContent title="What was wrong?" description="Your correction updates the memory it came from, and fast answers use it from now on.">
          <textarea value={fix} onChange={(e) => setFix(e.target.value)} rows={4} placeholder="For example: the refund window is 30 days, not 14" className="w-full rounded-[6px] border border-line bg-ground p-3 text-[14px] outline-none focus:border-amber" />
          <div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={() => setFixOpen(false)}>Cancel</Button><Button variant="primary" disabled={fix.trim().length < 4} onClick={() => { dispatch({ type: 'correct', id: t.id }); setFixOpen(false); setFix('') }}>Save the correction</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
