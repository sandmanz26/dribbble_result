import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { Home, Mic, Camera, Repeat, Moon, ArrowLeft, Lightbulb } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { NOW, PROPOSALS, SLEEP, fmt, totals } from '../data/myelin.js'
import { Trace, PathChip, Avatar } from '../ui/kit.jsx'
import Composer from '../ui/Composer.jsx'
import { Button } from '../components/ui/button.jsx'
import { useStages } from '../app/TaskView.jsx'
import { Mark } from '../App.jsx'

// The phone's job: see what happened, capture work by voice or photo, approve what it wants to learn.
export default function MobileFrame() {
  return (
    <div className="min-h-screen bg-[#0b0b0d] px-6 py-10 lg:grid lg:grid-cols-[400px_360px] lg:items-center lg:justify-center lg:gap-16">
      <div className="mx-auto h-[min(844px,calc(100vh-80px))] min-h-[640px] w-[390px] overflow-hidden rounded-[48px] border border-line bg-black p-[10px]">
        <iframe title="Myelin on a phone" src="#/m" className="h-full w-full rounded-[38px] bg-ground" />
      </div>
      <aside className="mx-auto mt-10 max-w-[360px] lg:mt-0">
        <p className="flex items-center gap-2 text-[15px] font-semibold"><Mark size={20} />Myelin on a phone</p>
        <h1 className="mt-3 text-[24px] font-semibold leading-tight">See the day, capture work, approve what it learns.</h1>
        <p className="mt-3 text-[14px] text-muted">No full workspace on the phone. Three jobs: a glance at today’s trace and spend, handing over a task by voice or photo, and approving habits proposed overnight.</p>
        <div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/app">Web workspace</Link></Button><Button variant="outline" asChild><Link to="/desktop">Desktop</Link></Button></div>
      </aside>
    </div>
  )
}

export function MobileApp() {
  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-12">
        <Routes>
          <Route index element={<MToday />} />
          <Route path="ask" element={<MAsk />} />
          <Route path="t/:id" element={<MTask />} />
          <Route path="approve" element={<MApprove />} />
          <Route path="report" element={<MReport />} />
        </Routes>
      </div>
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-line bg-ground pb-5" aria-label="Screens">
        {[['/m', 'Today', Home], ['/m/ask', 'Ask', Mic], ['/m/approve', 'Approve', Repeat], ['/m/report', 'Report', Moon]].map(([to, l, I]) => (
          <NavLink key={to} to={to} end={to === '/m'} className={({ isActive }) => `sel-under flex flex-col items-center gap-0.5 pt-2.5 text-[11px] ${isActive ? 'active text-ink' : 'text-muted'}`}><I width={20} height={20} />{l}</NavLink>
        ))}
      </nav>
    </div>
  )
}

function MToday() {
  const { tasks } = useStore()
  const from = new Date(NOW.getTime() - 24 * 3600 * 1000)
  const day = tasks.filter((t) => t.at >= from)
  const T = totals(day)
  return (
    <div className="grid gap-5">
      <header><p className="text-[13px] text-muted">Friday 30 October · Fernwood Studio</p><h1 className="mt-1 text-[24px] font-semibold leading-tight">Morning, Ines. <span className="num">{fmt.pct(T.fast)}</span> of yesterday ran on fast paths.</h1></header>
      <div className="rounded-card bg-surface p-4"><Trace tasks={day} from={from} to={NOW} height={84} labels={false} compact /><div className="mt-2 flex justify-between text-[11.5px] text-muted num"><span>{fmt.clock(from)}</span><span className="text-amber">now</span></div></div>
      <dl className="grid grid-cols-2 gap-4">
        <div><dt className="text-[12.5px] text-muted">Tasks</dt><dd className="num text-[22px]">{T.n}</dd></div>
        <div><dt className="text-[12.5px] text-muted">Spent</dt><dd className="num text-[22px]">{fmt.usd(T.cost)}</dd></div>
        <div><dt className="text-[12.5px] text-muted">If all reasoned</dt><dd className="num text-[22px]">{fmt.usd(T.base)}</dd></div>
        <div><dt className="text-[12.5px] text-muted">Saved</dt><dd className="num text-[22px]">−{fmt.pct(T.pct)}</dd></div>
      </dl>
      <Link to="/m/approve" className="flex items-center justify-between rounded-card bg-surface p-4"><span><b className="block text-[15px]">2 habits to approve</b><span className="text-[13px] text-muted">Proposed overnight from repeated work</span></span><Repeat width={20} height={20} className="text-reflex" /></Link>
      <section aria-labelledby="mr-h">
        <h2 id="mr-h" className="mb-2 text-[15px] text-muted">Latest</h2>
        <ul className="grid">{day.filter((t) => t.ask).slice(-4).reverse().map((t) => <li key={t.id} className="border-t border-rule py-3"><Link to={`/m/t/${t.id}`} className="grid gap-1"><span className="text-[14px]">{t.ask}</span><PathChip t={t} /></Link></li>)}</ul>
      </section>
    </div>
  )
}

function MAsk() {
  const nav = useNavigate()
  const [rec, setRec] = useState(false)
  const [heard, setHeard] = useState('')
  const line = 'Weekly sales summary for Monday'
  useEffect(() => {
    if (!rec) return
    let i = 0; const id = setInterval(() => { i += 2; setHeard(line.slice(0, i)); if (i >= line.length) { clearInterval(id); setRec(false) } }, 60)
    return () => clearInterval(id)
  }, [rec])
  return (
    <div className="grid gap-5">
      <header><h1 className="text-[24px] font-semibold">Ask</h1><p className="mt-1 text-[14px] text-muted">Say it, snap it, or type it. It goes down the cheapest path that is good enough.</p></header>
      <button onClick={() => { setHeard(''); setRec(true) }} aria-pressed={rec} className={`mx-auto grid size-28 place-items-center rounded-full border ${rec ? 'border-amber text-amber' : 'border-control text-ink'}`} aria-label={rec ? 'Listening' : 'Hold to talk'}><Mic width={40} height={40} /></button>
      <p className="min-h-6 text-center text-[15px]" aria-live="polite">{rec ? <span className="caret">{heard}</span> : heard || <span className="text-muted">Tap and speak</span>}</p>
      {heard && !rec && <Button variant="primary" size="lg" onClick={() => nav('/m/ask?q=' + encodeURIComponent(heard))}>Send “{heard}”</Button>}
      <div className="flex justify-center gap-3"><Button variant="outline"><Camera />Photo of a document</Button></div>
      <Composer compact base="/m/t/" placeholder="Or type a task" onSent={(id) => nav(`/m/t/${id}`)} />
      <AutoSend />
    </div>
  )
}
function AutoSend() {
  const nav = useNavigate()
  const { s, dispatch } = useStore()
  useEffect(() => {
    const q = new URLSearchParams(window.location.hash.split('?')[1] || '').get('q')
    if (!q) return
    import('../engine.js').then(({ route }) => {
      const r = route(q, { budget: s.budget, approved: s.approved }); const id = `T-M${Date.now() % 100000}`
      dispatch({ type: 'add', task: { id, at: new Date(NOW), who: 'ines', type: 'Reports', ask: q, ...r, started: Date.now() } }); nav(`/m/t/${id}`, { replace: true })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function MTask() {
  const { id } = useParams()
  const { tasks } = useStore()
  const t = tasks.find((x) => x.id === id)
  const st = useStages(t)
  if (!t) return <p className="text-muted">Not found. <Link to="/m" className="underline">Today</Link></p>
  const done = st.stage === 'done'
  return (
    <div className="grid gap-4">
      <Link to="/m" className="inline-flex items-center gap-1 text-[13px] text-muted"><ArrowLeft width={14} height={14} />Today</Link>
      <h1 className="text-[20px] font-semibold leading-snug">{t.ask}</h1>
      <p className="flex items-center gap-2 text-[13px] text-muted"><Avatar who={t.who} size={20} /><span className="num">{fmt.clock(t.at)}</span></p>
      {done ? <PathChip t={t} /> : <p className="text-[13px] text-amber">{st.stage === 'writing' ? 'Writing' : `${st.stage[0].toUpperCase()}${st.stage.slice(1)}`}…</p>}
      {st.stage === 'writing' || done ? <p className={`text-[15px] leading-relaxed ${done ? '' : 'caret'}`}>{(t.answer || 'Answered in the background.').slice(0, st.typed || 999)}</p> : <div className="scan h-16 rounded-[4px] bg-raised/60" />}
      {done && t.why && <p className="rounded-card bg-surface p-3 text-[13px] text-muted">{t.why}</p>}
      {done && t.path !== 'reason' && <Button variant="outline"><Lightbulb />Think it through · {fmt.usd(t.base)}</Button>}
    </div>
  )
}

function MApprove() {
  const { s, dispatch } = useStore()
  const waiting = PROPOSALS.filter((p) => !s.approved.includes(p.id) && !s.declined.includes(p.id))
  return (
    <div className="grid gap-4">
      <header><h1 className="text-[24px] font-semibold">Approve</h1><p className="mt-1 text-[14px] text-muted">Habits it wants to learn. Each one runs without calling a model.</p></header>
      {waiting.length ? waiting.map((p) => (
        <article key={p.id} className="rounded-card bg-surface p-4">
          <h2 className="text-[16px] font-semibold">{p.name}</h2>
          <p className="mt-2 text-[14px]">{p.evidence}</p>
          <p className="num mt-3 text-[13px] text-muted">{fmt.usd(p.perRun.now)} → {fmt.usd(p.perRun.then)} a run</p>
          <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="ghost" onClick={() => dispatch({ type: 'decline', id: p.id })}>Keep thinking</Button><Button variant="primary" onClick={() => dispatch({ type: 'approve', id: p.id, name: p.name })}>Approve</Button></div>
        </article>
      )) : <p className="rounded-card border border-dashed border-line p-6 text-center text-[14px] text-muted">All caught up. New proposals arrive after tonight’s consolidation.</p>}
    </div>
  )
}

function MReport() {
  return (
    <div className="grid gap-4">
      <header><h1 className="text-[24px] font-semibold">Last night</h1><p className="mt-1 text-[14px] text-muted"><span className="num">{SLEEP.from}</span> to <span className="num">{SLEEP.to}</span></p></header>
      <dl className="grid grid-cols-3 gap-3">{[['Merged', SLEEP.merged], ['Faded', SLEEP.faded], ['Stronger', SLEEP.strengthened]].map(([l, v]) => <div key={l}><dt className="text-[12.5px] text-muted">{l}</dt><dd className="num text-[22px]">{v}</dd></div>)}</dl>
      <p className="border-l border-warn pl-3 text-[14px]">{SLEEP.conflict.text}</p>
      <ul className="grid gap-2 text-[14px]">{SLEEP.notes.map((n) => <li key={n} className="border-t border-rule pt-2">{n}</li>)}</ul>
    </div>
  )
}
