import { Repeat, Pause, Play } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { HABITS, PROPOSALS, PEOPLE, fmt } from '../data/myelin.js'
import { Card, CardHead } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Avatar } from '../ui/kit.jsx'
import { Tip } from '../components/ui/tooltip.jsx'

export default function Habits() {
  const { s, dispatch } = useStore()
  const waiting = PROPOSALS.filter((p) => !s.approved.includes(p.id) && !s.declined.includes(p.id))
  const active = [...HABITS, ...PROPOSALS.filter((p) => s.approved.includes(p.id)).map((p) => ({ id: p.id, name: p.name, trigger: 'Approved today', runs: 0, accuracy: null, saved: 0, since: '2026-10-30', owner: p.owner, steps: p.steps }))]
  const monthSave = active.reduce((t, h) => t + h.saved, 0)
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-[26px] font-semibold">Habits</h1>
        <p className="mt-1 max-w-[72ch] text-[14px] text-muted">Work the workspace first solved by thinking, then learned to do on its own. A habit runs on Reflex: no model call, near zero cost. Nothing becomes a habit until a person approves it.</p>
      </header>

      <section aria-labelledby="wait-h" className="grid gap-4">
        <h2 id="wait-h" className="text-[18px] text-muted">Proposed <span className="num">{waiting.length}</span></h2>
        {waiting.length ? waiting.map((p) => (
          <Card key={p.id} className="grid gap-4 md:grid-cols-[1fr_280px]">
            <div>
              <p className="flex items-center gap-2 text-[16px] font-semibold"><Repeat width={16} height={16} className="text-reflex" />{p.name}</p>
              <p className="mt-2 max-w-[62ch] text-[14px]">{p.evidence}</p>
              <ol className="mt-3 grid gap-1 text-[13px] text-muted">{p.steps.map((x, i) => <li key={x}><span className="num mr-2">{i + 1}.</span>{x}</li>)}</ol>
            </div>
            <div className="grid content-between gap-4 md:border-l md:border-rule md:pl-5">
              <dl className="grid grid-cols-2 gap-3 text-[13px]">
                <div><dt className="text-muted">Now, each run</dt><dd className="num text-[18px]">{fmt.usd(p.perRun.now)}</dd></div>
                <div><dt className="text-muted">As a habit</dt><dd className="num text-[18px]">{fmt.usd(p.perRun.then)}</dd></div>
                <div className="col-span-2"><dt className="text-muted">Saves a month</dt><dd className="num text-[18px]">{fmt.usd((p.perRun.now - p.perRun.then) * p.perMonth)} <span className="font-sans text-[13px] text-muted">over about {p.perMonth} runs</span></dd></div>
              </dl>
              <div className="flex flex-wrap gap-2"><Button variant="primary" onClick={() => dispatch({ type: 'approve', id: p.id, name: p.name })}>Approve</Button><Button variant="ghost" onClick={() => dispatch({ type: 'decline', id: p.id })}>Not now</Button></div>
            </div>
          </Card>
        )) : <p className="rounded-card border border-dashed border-line p-6 text-[13.5px] text-muted">No proposals waiting. Repeated work is checked each night; new ones appear here in the morning.</p>}
      </section>

      <section aria-labelledby="act-h" className="grid gap-3">
        <div className="flex items-baseline justify-between"><h2 id="act-h" className="text-[18px] text-muted">Active <span className="num">{active.length}</span></h2><p className="text-[13px] text-muted">Saved this month <span className="num text-ink">{fmt.usd(monthSave)}</span></p></div>
        <div className="relative min-w-0 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead className="text-[12px] text-muted"><tr><th className="pb-2 pr-4 font-normal">Habit</th><th className="pb-2 pr-4 font-normal">Owner</th><th className="pb-2 pr-4 text-right font-normal">Runs</th><th className="pb-2 pr-4 text-right font-normal">Accepted</th><th className="pb-2 pr-4 text-right font-normal">Saved</th><th className="pb-2 pr-4 font-normal">State</th></tr></thead>
            <tbody>
              {active.map((h) => {
                const paused = s.paused.includes(h.id)
                return (
                  <tr key={h.id} className="border-t border-rule">
                    <td className="py-3 pr-4"><b className="font-semibold">{h.name}</b><span className="block text-[12.5px] text-muted">{h.trigger}</span></td>
                    <td className="py-3 pr-4"><span className="flex items-center gap-2"><Avatar who={h.owner} size={20} />{PEOPLE[h.owner].name.split(' ')[0]}</span></td>
                    <td className="num py-3 pr-4 text-right">{h.runs}</td>
                    <td className="num py-3 pr-4 text-right">{h.accuracy == null ? '-' : fmt.pct(h.accuracy)}</td>
                    <td className="num py-3 pr-4 text-right">{h.saved ? fmt.usd(h.saved) : '-'}</td>
                    <td className="py-3"><span className="flex items-center gap-2">{paused ? <Badge tone="warn">Paused</Badge> : <Badge tone="good">Running</Badge>}<Tip label={paused ? 'Resume' : 'Pause'}><Button size="icon" variant="ghost" aria-label={paused ? `Resume ${h.name}` : `Pause ${h.name}`} onClick={() => dispatch({ type: 'pause', id: h.id })}>{paused ? <Play /> : <Pause />}</Button></Tip></span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[12.5px] text-muted">Accepted is the share of runs that people used without changing the answer. Under 90%, a habit pauses itself and asks its owner.</p>
      </section>
    </div>
  )
}
