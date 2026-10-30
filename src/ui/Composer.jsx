import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Send, Lightbulb, Attachment as Attach } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { PREDICT, route } from '../engine.js'
import { PATHS, NOW } from '../data/myelin.js'
import { Button } from '../components/ui/button.jsx'
import { Switch } from '../components/ui/switch.jsx'
import { PathMark } from './kit.jsx'
import { cn } from '../lib/utils.js'

let seq = 3000
// One way to hand work over, on every surface. Before sending, attention shows the path it expects to take.
export function useAsk(base = '/app/tasks/') {
  const { s, dispatch } = useStore()
  const nav = useNavigate()
  return (text, force = false, opts = {}) => {
    const r = route(text, { budget: s.budget, approved: s.approved, force })
    const id = `T-${seq++}`
    dispatch({ type: 'add', task: { id, at: new Date(NOW.getTime() + (seq - 3000) * 60000), who: 'maya', type: 'Replies', ask: text, ...r, started: Date.now(), force } })
    if (!opts.stay) nav(base + id)
    return id
  }
}

export default function Composer({ compact = false, autoFocus = false, base, onSent, placeholder = 'Ask a question or hand over a task, for example: draft the reply to Lindgren Timber about the oak delay' }) {
  const { s } = useStore()
  const loc = useLocation()
  const ask = useAsk(base)
  const [text, setText] = useState('')
  const [force, setForce] = useState(false)
  const ref = useRef(null)
  useEffect(() => { if (autoFocus || new URLSearchParams(loc.search).get('focus')) ref.current?.focus() }, [autoFocus, loc.search])
  const guess = PREDICT(text, { budget: s.budget, approved: s.approved, force })
  const send = (e) => { e?.preventDefault(); if (text.trim().length < 3) return; const id = ask(text.trim(), force, { stay: !!onSent }); setText(''); setForce(false); onSent?.(id) }
  return (
    <form onSubmit={send} className={cn('rounded-card border border-line bg-surface focus-within:border-control', compact ? 'p-2.5' : 'p-3')}>
      <label htmlFor="composer" className="sr-only">Ask or hand over a task</label>
      <textarea id="composer" ref={ref} value={text} onChange={(e) => setText(e.target.value)} rows={compact ? 2 : 3} placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) send(e) }}
        className="w-full resize-none bg-transparent px-1 text-[15px] leading-relaxed text-ink outline-none placeholder:text-faint" />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" className="grid size-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink" aria-label="Attach a file"><Attach width={16} height={16} /></button>
        <label className="flex items-center gap-2 text-[12.5px] text-muted"><Switch checked={force} onCheckedChange={setForce} aria-label="Think it through" /><Lightbulb width={14} height={14} />Think it through</label>
        <span className="min-w-0 flex-1 truncate text-[12.5px] text-muted" aria-live="polite">
          {guess ? <span className="inline-flex items-center gap-1.5">Likely <PathMark path={guess.path} /> <b className="font-semibold text-ink">{guess.escalated ? 'Recall, then Reason' : PATHS[guess.path].name}</b> <span className="hidden sm:inline">· {guess.habit ? 'a habit matches' : guess.used.length ? `${guess.used.length} memories match` : 'nothing familiar'}</span></span> : <span>Enter to send, Shift Enter for a new line</span>}
        </span>
        <Button type="submit" variant="primary" size="sm" disabled={text.trim().length < 3}><Send />Send</Button>
      </div>
    </form>
  )
}
