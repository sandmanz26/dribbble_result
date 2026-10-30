import { Link } from 'react-router-dom'
import { ArrowLeft } from 'pixelarticons/react'
import { useStore } from '../store.jsx'
import { SLEEP, MEMORY, PROPOSALS, fmt } from '../data/myelin.js'
import { Card, CardHead } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'

export default function Sleep() {
  const { s, dispatch } = useStore()
  const a = MEMORY.find((m) => m.id === SLEEP.conflict.a); const b = MEMORY.find((m) => m.id === SLEEP.conflict.b)
  return (
    <div className="grid max-w-[880px] gap-6">
      <Link to="/app" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink"><ArrowLeft width={14} height={14} />Today</Link>
      <header>
        <h1 className="text-[26px] font-semibold">Last night</h1>
        <p className="mt-1 text-[14px] text-muted">Consolidation ran from <span className="num text-ink">{SLEEP.from}</span> to <span className="num text-ink">{SLEEP.to}</span>, while nobody was working. Like sleep, it sorted the day: merged what repeats, let go of what nobody uses, and noticed patterns worth turning into habits.</p>
      </header>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {[['Merged', SLEEP.merged], ['Faded', SLEEP.faded], ['Strengthened', SLEEP.strengthened], ['Habits proposed', SLEEP.proposed]].map(([l, v]) => <div key={l}><dt className="text-[12.5px] text-muted">{l}</dt><dd className="num mt-1 text-[26px]">{v}</dd></div>)}
      </dl>
      <Card aria-labelledby="c-h">
        <CardHead id="c-h" title={s.conflict ? 'Conflict settled' : 'One conflict needs you'} />
        <p className="text-[14px]">{SLEEP.conflict.text}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[a, b].map((m) => (
            <div key={m.id} className={`rounded-[6px] bg-ground p-4 ${s.conflict === m.id ? 'outline outline-1 outline-amber' : ''}`}>
              <p className="num text-[12.5px] text-muted">{m.id} · used {m.uses} times · {m.source}</p>
              <p className="mt-1 text-[14px]">{m.text}</p>
              {!s.conflict && <Button size="sm" variant={m.id === a.id ? 'primary' : 'outline'} className="mt-3" onClick={() => dispatch({ type: 'conflict', keep: m.id })}>Keep this one</Button>}
              {s.conflict === m.id && <p className="mt-2 text-[12.5px] text-amber">Kept</p>}
            </div>
          ))}
        </div>
      </Card>
      <Card aria-labelledby="n-h">
        <CardHead id="n-h" title="What changed" />
        <ul className="grid gap-2 text-[14px]">{SLEEP.notes.map((n) => <li key={n} className="border-t border-rule pt-2 first:border-0 first:pt-0">{n}</li>)}</ul>
      </Card>
      <Card aria-labelledby="p-h">
        <CardHead id="p-h" title="Habits proposed"><Link to="/app/habits" className="text-[12.5px] text-muted underline underline-offset-4 hover:text-ink">Review</Link></CardHead>
        <ul className="grid gap-2 text-[14px]">{PROPOSALS.map((p) => <li key={p.id} className="flex justify-between gap-3"><span>{p.name}</span><span className="num text-muted">{fmt.usd(p.perRun.now)} → {fmt.usd(p.perRun.then)} a run</span></li>)}</ul>
      </Card>
    </div>
  )
}
