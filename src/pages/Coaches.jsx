import { useMemo } from 'react'
import { FiStar, FiShuffle } from 'react-icons/fi'
import { useStore } from '../store.jsx'
import { Card, Avatar, Progress, Badge } from '../ui.jsx'
import { COACHES, SESSIONS, coach } from '../data.js'

export default function Coaches() {
  const { people, assign, toast } = useStore()
  const rows = useMemo(() => COACHES.map((c) => {
    const mine = people.filter((p) => p.coach === c.id && !p.landed)
    const wk = SESSIONS.filter((s) => s.coach === c.id)
    return { c, load: mine.length, pct: Math.round((mine.length / c.cap) * 100), wk: wk.length, noshow: wk.filter((s) => s.status === 'No-show').length, landed: people.filter((p) => p.coach === c.id && p.landed).length }
  }), [people])
  const over = rows.filter((r) => r.pct > 100).sort((a, b) => b.pct - a.pct)
  const under = rows.filter((r) => r.pct < 75).sort((a, b) => a.pct - b.pct)
  const move = over.length && under.length ? { from: over[0], to: under[0], n: Math.min(over[0].load - over[0].c.cap, under[0].c.cap - under[0].load) } : null
  const doMove = () => {
    const ids = people.filter((p) => p.coach === move.from.c.id && !p.landed).sort((a, b) => a.stage - b.stage).slice(0, move.n).map((p) => p.id)
    assign(ids, move.to.c.id); toast(`${ids.length} people moved from ${move.from.c.name} to ${move.to.c.name}`)
  }
  return (
    <>
      <div className="page-head"><div><h1>Coaches</h1><p>Caseloads, ratings and this week's sessions. Keep every coach under their limit.</p></div></div>
      {move && move.n > 0 && (
        <div className="suggest card">
          <span className="kpi-ico amber"><FiShuffle aria-hidden="true" /></span>
          <div className="grow"><b>{move.from.c.name} is over their limit ({move.from.load} of {move.from.c.cap}).</b><p>Suggested: move {move.n} people in early stages to {move.to.c.name}, who has room and the same languages.</p></div>
          <button className="btn sm" onClick={doMove}>Rebalance</button>
        </div>
      )}
      <Card pad={false}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Coach</th><th>Focus</th><th>Caseload</th><th>Sessions this week</th><th>Landed</th><th>Rating</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.c.id}>
                <td><span className="who"><Avatar name={r.c.name} size={36} /><span><b>{r.c.name}</b><small>{r.c.langs}</small></span></span></td>
                <td>{r.c.focus}</td>
                <td><span className="score wide"><Progress value={Math.min(100, r.pct)} tone={r.pct > 100 ? 'red' : r.pct > 85 ? 'amber' : 'blue'} /><b>{r.load}/{r.c.cap}</b></span></td>
                <td>{r.wk}{r.noshow > 0 && <Badge tone="red">{r.noshow} no-show</Badge>}</td>
                <td>{r.landed}</td>
                <td><span className="rating"><FiStar aria-hidden="true" />{r.c.rating.toFixed(1)}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
