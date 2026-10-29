import { useStore } from '../store.jsx'
import { RULES, LEVELS, LOG, TRUST } from '../data/ai.js'
import { PEOPLE, idr } from '../data/world.js'
import { AiTag, Pill, Toast, useToast } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const WHO = { ratna: 'Ratna', dimas: 'Store managers', manager: 'Store managers', advisor: 'The advisor' }

export default function Autopilot() {
  const { s, dispatch, role, me } = useStore()
  const [toast, show] = useToast()
  const owner = role.id === 'owner'
  const levelOf = (r) => s.rules[r.id] || r.level
  const log = [...s.log, ...LOG]
  const acts = LOG.filter((l) => l.kind === 'act').length
  return (
    <div className="page">
      <header className="title-row">
        <div><h1>Autopilot</h1><p>How much Selvedge may do on its own, per kind of decision. {owner ? 'Only you can raise a level.' : 'Only Ratna can change these.'} Every change and every action is logged.</p></div>
      </header>
      <section className="kpis" aria-label="Trust, last 30 days">
        <div className="kpi is-lead"><p className="kpi-l">Proposals accepted, 30 days</p><p className="kpi-v">{TRUST.a}<span className="unit"> of {TRUST.n}</span></p><p className="kpi-s">{Math.round((TRUST.a / TRUST.n) * 100)}%, some after edits</p></div>
        <div className="kpi"><p className="kpi-l">Acted on its own, this week</p><p className="kpi-v">{acts}</p><p className="kpi-s">All inside a limit</p></div>
        <div className="kpi"><p className="kpi-l">Undone by people, 30 days</p><p className="kpi-v">{s.undone.length}</p><p className="kpi-s">{s.undone.length ? 'This session' : 'None'}</p></div>
        <div className="kpi"><p className="kpi-l">Contacted a client</p><p className="kpi-v">0</p><p className="kpi-s">It cannot: drafts only</p></div>
      </section>

      <section className="card is-flush rules" aria-labelledby="h-rules">
        <div className="card-head"><h2 id="h-rules">What it may do</h2><span className="meta">Suggest, ask first, or act within a limit and tell</span></div>
        <table className="tbl">
          <thead><tr><th>Decision</th><th>Level</th><th>Limit</th><th>Decides above it</th><th className="num">Accepted</th></tr></thead>
          <tbody>
            {RULES.map((r) => {
              const lv = levelOf(r)
              return (
                <tr key={r.id}>
                  <td><span className="cell-2">{r.name}<small>{r.locked || r.note}</small></span></td>
                  <td>
                    {r.locked ? <span className="locked"><I.Lock /> {LEVELS.find((l) => l.id === lv).name}</span> : (
                      <div className="seg is-sm" role="radiogroup" aria-label={`${r.name} level`}>
                        {LEVELS.map((l) => (
                          <button key={l.id} role="radio" aria-checked={lv === l.id} disabled={!owner} title={l.note}
                            onClick={() => { if (lv === l.id) return; dispatch({ type: 'rule', id: r.id, level: l.id, name: r.name, levelName: l.name, by: me.name }); show(`${r.name}: now “${l.name}”. Logged.`) }}>{l.name}</button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="num">{r.limit ? `${idr(r.limit)} each` : '-'}</td>
                  <td>{WHO[r.who] || PEOPLE[r.who]?.short}</td>
                  <td className="num">{r.accepted[0]} of {r.accepted[1]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="card is-flush" aria-labelledby="h-log">
        <div className="card-head"><h2 id="h-log">Activity log</h2><AiTag text="Kept by Selvedge" /></div>
        <ul className="log">
          {log.map((l) => {
            const undone = s.undone.includes(l.id)
            return (
              <li key={l.id} className={undone ? 'is-undone' : ''}>
                <span className="num muted when">{l.when}</span>
                <span className="cell-2"><span>{l.what}</span><small>{undone ? 'Undone by you. Nothing shipped.' : l.detail}</small></span>
                <Pill tone={l.kind === 'act' ? 'ai' : ''}>{{ act: 'Acted', write: 'Wrote', flag: 'Flagged', decision: 'Decision', rule: 'Rule change', undo: 'Undo' }[l.kind]}</Pill>
                {l.undo && !undone ? <button className="btn is-sm" onClick={() => { dispatch({ type: 'undoLog', id: l.id }); show('Undone. Cikarang will not ship the card holders.') }} title={l.undo}><I.Undo /> Undo</button> : <span />}
              </li>
            )
          })}
        </ul>
      </section>
      <Toast toast={toast} />
    </div>
  )
}
