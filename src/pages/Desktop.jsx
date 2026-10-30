import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Lightbulb, ArrowLeft } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { route, PREDICT } from '../engine.js'
import { NOW, PATHS, fmt, totals } from '../data/myelin.js'
import { PathChip, PathMark, Trace } from '../ui/kit.jsx'
import { Mark } from '../App.jsx'

// The desktop app's job: answers without leaving the app you are in. A quick-ask overlay opens over the mail client
// with a shortcut, answers on the cheapest good path, and pastes the answer back. The tray keeps today in view.
const THREAD = {
  from: 'Erik Lindgren', company: 'Lindgren Timber', subject: 'Oak boards: two-week delay',
  body: 'Hi Maya,\n\nUnfortunately the kiln at our Småland mill was down for nine days, so the FSC oak boards for your order 7712 will leave two weeks later than planned. New estimate: arrival in Rotterdam on 18 November.\n\nSorry for the trouble. Let me know if this causes problems on your side.\n\nErik',
}

export default function Desktop() {
  const { s, tasks, dispatch } = useStore()
  const [open, setOpen] = useState(true)
  const [tray, setTray] = useState(false)
  const [text, setText] = useState('Draft the reply to Lindgren Timber about the oak delay')
  const [ans, setAns] = useState(null)
  const [typed, setTyped] = useState(0)
  const [reply, setReply] = useState('')
  const input = useRef(null)
  useEffect(() => {
    const on = (e) => {
      if (e.altKey && (e.code === 'Space' || e.key === ' ')) { e.preventDefault(); setOpen((o) => !o) }
      if (e.key === 'Escape') { setOpen(false); setTray(false) }
    }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  }, [])
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 30) }, [open])
  useEffect(() => {
    if (!ans) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(ans.answer.length); return }
    setTyped(0); const id = setInterval(() => setTyped((n) => { if (n >= ans.answer.length) { clearInterval(id); return n } return n + 4 }), 12)
    return () => clearInterval(id)
  }, [ans])
  const guess = PREDICT(text, { budget: s.budget, approved: s.approved })
  const send = (force = false) => { const r = route(text, { budget: s.budget, approved: s.approved, force }); setAns({ ...r, ask: text }); dispatch({ type: 'add', task: { id: `T-D${Date.now() % 100000}`, at: new Date(NOW), who: 'maya', type: 'Replies', ask: text, ...r } }) }
  const paste = () => { setReply(ans.answer); setOpen(false); setAns(null) }
  const from = new Date(NOW.getTime() - 24 * 3600 * 1000)
  const T = totals(tasks.filter((t) => t.at >= from))

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0b0b0d]">
      {/* Menu bar with the tray item */}
      <div className="flex h-8 items-center gap-4 border-b border-line bg-[#18181b] px-4 text-[12.5px]">
        <Link to="/app" className="inline-flex items-center gap-1 text-muted hover:text-ink"><ArrowLeft width={12} height={12} />Workspace</Link>
        <span className="font-semibold">Mail</span><span className="text-muted">File</span><span className="text-muted">Edit</span><span className="text-muted">View</span>
        <button onClick={() => setTray((v) => !v)} aria-expanded={tray} aria-label="Myelin tray" className="ml-auto flex items-center gap-2 rounded px-2 py-0.5 hover:bg-raised">
          <Mark size={16} /><span className="num">{fmt.pct(T.pct)} saved today</span>
        </button>
        <span className="num text-muted">Fri 09:12</span>
      </div>

      {tray && (
        <div className="absolute right-16 top-9 z-30 w-[360px] rounded-[6px] border border-line bg-surface p-4 shadow-[0_12px_28px_rgba(0,0,0,.5)]" role="dialog" aria-label="Myelin today">
          <p className="text-[13px] font-semibold">Fernwood Studio, last 24 hours</p>
          <div className="mt-3"><Trace tasks={tasks.filter((t) => t.at >= from)} from={from} to={NOW} height={60} labels={false} compact /></div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-[12.5px]">
            <div><dt className="text-muted">Tasks</dt><dd className="num text-[16px]">{T.n}</dd></div>
            <div><dt className="text-muted">Fast paths</dt><dd className="num text-[16px]">{fmt.pct(T.fast)}</dd></div>
            <div><dt className="text-muted">Spent</dt><dd className="num text-[16px]">{fmt.usd(T.cost)}</dd></div>
          </dl>
          <div className="mt-3 grid gap-1 border-t border-rule pt-3 text-[13px]">
            <button className="flex justify-between rounded px-2 py-1 text-left hover:bg-raised" onClick={() => { setTray(false); setOpen(true) }}><span>Quick ask</span><span className="num text-muted">Alt Space</span></button>
            <Link className="flex justify-between rounded px-2 py-1 hover:bg-raised" to="/app/habits"><span>Habits to approve</span><span className="num text-amber">{2 - s.approved.length - s.declined.length}</span></Link>
            <Link className="rounded px-2 py-1 hover:bg-raised" to="/app">Open the workspace</Link>
          </div>
        </div>
      )}

      {/* The app the person is working in: a mail client */}
      <div className="m-6 flex flex-1 overflow-hidden rounded-[8px] border border-line bg-[#f3f2ee] text-[#1b1b1f] md:m-10">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#dedbd3] bg-[#e9e7e1] p-4 text-[13px] md:block">
          <p className="mb-3 font-semibold">Inbox</p>
          {[['Erik Lindgren', THREAD.subject, true], ['Andersen Retail', 'Spring order, two drops'], ['Carrier Hamburg', 'Pickup confirmed Monday'], ['Showroom', 'Saturday bookings']].map(([a, b, on]) => (
            <div key={a} className={`mb-1 rounded-[4px] p-2 ${on ? 'bg-white' : ''}`}><b className="block font-semibold">{a}</b><span className="text-[#5b5b60]">{b}</span></div>
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col p-6">
          <p className="text-[12.5px] text-[#5b5b60]">{THREAD.from}, {THREAD.company}</p>
          <h1 className="mt-1 text-[20px] font-semibold">{THREAD.subject}</h1>
          <p className="mt-4 max-w-[64ch] whitespace-pre-line text-[14px] leading-relaxed">{THREAD.body}</p>
          <div className="mt-6 rounded-[6px] border border-[#dedbd3] bg-white p-4">
            <p className="text-[12.5px] text-[#5b5b60]">Reply</p>
            <label className="sr-only" htmlFor="reply">Reply</label>
            <textarea id="reply" value={reply} onChange={(e) => setReply(e.target.value)} rows={6} placeholder="Press Alt Space to ask Myelin" className="mt-1 w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none placeholder:text-[#8a8a90]" />
          </div>
        </div>
      </div>

      {open && (
        <div className="absolute inset-0 z-20 flex items-start justify-center bg-black/35 px-4 pt-[14vh]" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="rise w-full max-w-[640px] rounded-[8px] border border-line bg-surface shadow-[0_24px_60px_rgba(0,0,0,.6)]" role="dialog" aria-label="Quick ask">
            <form onSubmit={(e) => { e.preventDefault(); if (ans) paste(); else send() }} className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Mark size={20} />
              <label htmlFor="qa" className="sr-only">Ask Myelin</label>
              <input id="qa" ref={input} value={text} onChange={(e) => { setText(e.target.value); setAns(null) }} className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" placeholder="Ask, or hand over a task" />
              <button type="submit" aria-label="Send" className="grid size-8 place-items-center rounded-full bg-amber text-amber-ink"><Send width={16} height={16} /></button>
            </form>
            {!ans ? (
              <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-[12.5px] text-muted">
                {guess && <span className="inline-flex items-center gap-1.5">Likely <PathMark path={guess.path} /><b className="text-ink">{PATHS[guess.path].name}</b>{guess.used?.length ? ` · reads this thread and ${guess.used.length} memories` : ''}</span>}
                <span className="ml-auto">Enter to ask · Esc to close</span>
              </div>
            ) : (
              <div className="px-4 py-4">
                <PathChip t={ans} />
                <p className={`mt-3 whitespace-pre-line text-[14.5px] leading-relaxed ${typed < ans.answer.length ? 'caret' : ''}`}>{ans.answer.slice(0, typed)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-rule pt-3 text-[12.5px]">
                  <button onClick={paste} className="rounded-full bg-amber px-3 py-1.5 font-semibold text-amber-ink">Paste into reply <span className="num ml-1 opacity-70">Enter</span></button>
                  {ans.path !== 'reason' && <button onClick={() => send(true)} className="inline-flex items-center gap-1.5 rounded-full border border-control px-3 py-1.5 font-semibold"><Lightbulb width={14} height={14} />Think it through <span className="num text-muted">{fmt.usd(ans.base)}</span></button>}
                  <Link to="/app/tasks" className="ml-auto text-muted underline underline-offset-4 hover:text-ink">Open in the workspace</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!open && <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[12.5px] text-muted">Press <span className="num rounded border border-control px-1.5 text-ink">Alt Space</span> for quick ask, or use the tray at the top right.</p>}
    </div>
  )
}
