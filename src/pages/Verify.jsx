import { useState } from 'react'
import { useStore } from '../store.jsx'
import { CREDIT_ROLES } from '../data/bridge.js'
import { Empty, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

export default function Verify() {
  const { s } = useStore()
  return (
    <div className="page">
      <header className="title-row"><div><h1>Verify contributions</h1><p className="sub">Students ask you to sign what they did on your projects. Your signature puts it in their passport for good.</p></div></header>
      <div className="stack">
        {s.verify.length ? s.verify.map((v) => <Request key={v.id} v={v} />) : <Empty title="Nothing waiting for your signature"><p>Signed contributions are listed below.</p></Empty>}
      </div>
      {s.verified.length > 0 && (
        <section className="panel" aria-labelledby="done-h">
          <div className="panel-head"><h2 id="done-h">Signed today <span className="chip-count">{s.verified.length}</span></h2></div>
          <ul className="rows">{s.verified.map((v) => <li key={v.id} className="row-card"><I.Verified size={16} aria-hidden="true" /><span><b>{v.who}, {v.project}</b><small>{v.hours} h · {v.roles.join(', ')}</small></span></li>)}</ul>
        </section>
      )}
    </div>
  )
}

function Request({ v }) {
  const { dispatch } = useStore()
  const [roles, setRoles] = useState(v.roles)
  const [hours, setHours] = useState(v.hours)
  const [words, setWords] = useState('')
  const toggle = (r) => setRoles(roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r])
  return (
    <section className="panel verify" aria-labelledby={`v-${v.id}`}>
      <div className="panel-head"><h2 id={`v-${v.id}`}>{v.who}, {v.project}</h2><span className="muted">{fmtDate(v.from, { day: 'numeric', month: 'short', year: 'numeric' })} to {fmtDate(v.to, { day: 'numeric', month: 'short', year: 'numeric' })} · asked {fmtDate(v.asked)}</span></div>
      <fieldset className="field"><legend>Roles, as CRediT names them. The student proposed {v.roles.length}; adjust if needed.</legend>
        <div className="role-picks">{CREDIT_ROLES.map((r) => <label key={r} className={roles.includes(r) ? 'is-on' : ''}><input type="checkbox" checked={roles.includes(r)} onChange={() => toggle(r)} />{r}</label>)}</div>
      </fieldset>
      <div className="two">
        <label className="field"><span>Hours</span><input type="number" min="1" value={hours} onChange={(e) => setHours(+e.target.value)} /></label>
        <label className="field"><span>One sentence in your words (optional)</span><input value={words} onChange={(e) => setWords(e.target.value)} placeholder="What they did that you would vouch for" /></label>
      </div>
      <div className="dlg-foot">
        <button className="btn" onClick={() => dispatch({ type: 'toast', text: `Asked ${v.who} for changes` })}>Ask for changes</button>
        <button className="btn is-primary" disabled={!roles.length || !(hours > 0)} onClick={() => dispatch({ type: 'verify', id: v.id, roles, hours, toast: `Signed. ${v.who}’s passport now shows ${roles.length} roles.` })}><I.Verified size={16} /> Sign and verify</button>
      </div>
    </section>
  )
}
