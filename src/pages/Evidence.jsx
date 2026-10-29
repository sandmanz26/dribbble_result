import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { SKILLS, LEVEL, STRENGTH, CLOSERS } from '../data/bridge.js'
import { Strength, Dialog, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const KINDS = ['Course', 'Code', 'Notebook', 'Lab report', 'Certificate', 'Bridge task', 'Publication', 'Statement']

export default function Evidence() {
  const { s, dispatch } = useStore()
  const loc = useLocation()
  const want = new URLSearchParams(loc.search).get('skill')
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ skill: want || 'stats', kind: 'Code', title: '', link: '', level: 1, verifier: '' })
  const [err, setErr] = useState({})
  useEffect(() => { if (want) { setF((x) => ({ ...x, skill: want })); setOpen(true) } }, [want])
  const groups = Object.keys(SKILLS).map((k) => ({ k, items: s.evidence.filter((e) => e.skill === k) })).filter((g) => g.items.length)
  const without = Object.keys(SKILLS).filter((k) => !s.evidence.some((e) => e.skill === k))
  const save = (e) => {
    e.preventDefault()
    const x = {}
    if (f.title.trim().length < 3) x.title = 'Give it a name a researcher would recognise.'
    if (f.link && !/^https?:\/\/\S+\.\S+/.test(f.link)) x.link = 'Links start with https:// and point at the work itself.'
    if (f.verifier && !/^\S+@\S+\.\S+$/.test(f.verifier)) x.verifier = 'That email address looks incomplete.'
    setErr(x); if (Object.keys(x).length) return
    const strength = f.link ? 'linked' : 'claimed'
    dispatch({ type: 'addEvidence', item: { id: `e${Date.now()}`, skill: f.skill, level: +f.level, strength, kind: f.kind, title: f.title.trim(), detail: f.link ? 'Link added' : 'No file attached', by: f.verifier ? `Waiting for ${f.verifier} to verify` : 'You', date: '2026-10-29', pending: !!f.verifier } })
    setOpen(false); setF({ ...f, title: '', link: '', verifier: '' })
  }
  return (
    <div className="page">
      <header className="title-row">
        <div><h1>Evidence</h1><p className="sub">{s.evidence.length} items across {groups.length} skills. Verified items count in full; linked work counts 70%, a claim 30%.</p></div>
        <button className="btn is-primary" onClick={() => setOpen(true)}><I.Plus size={16} /> Add evidence</button>
      </header>
      <div className="row r-8-4">
        <div className="col">
          {groups.map((g) => (
            <section key={g.k} className="panel" aria-labelledby={`g-${g.k}`}>
              <div className="panel-head"><h2 id={`g-${g.k}`}>{SKILLS[g.k]} <span className="chip-count">{g.items.length}</span></h2></div>
              <ul className="rows">
                {g.items.map((e) => (
                  <li key={e.id} className="row-card ev">
                    <Strength s={e.strength} />
                    <span><b>{e.title}</b><small>{e.kind} · {LEVEL[e.level]} level · {e.detail} · {e.by} · {fmtDate(e.date, { day: 'numeric', month: 'short', year: 'numeric' })}</small></span>
                    {e.pending && <span className="state is-sent">Asked to verify</span>}
                    <button className="icon-btn" onClick={() => dispatch({ type: 'removeEvidence', id: e.id })} aria-label={`Remove ${e.title}`}><I.Trash size={16} /></button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <aside className="col">
          <section className="panel" aria-labelledby="how-h">
            <div className="panel-head"><h2 id="how-h">How evidence counts</h2></div>
            <dl className="strengths">{Object.entries(STRENGTH).map(([k, v]) => <div key={k}><dt><Strength s={k} /></dt><dd>{Math.round(v.v * 100)}%. {v.note}.</dd></div>)}</dl>
            <p className="fine">Evidence below the level a project asks for counts half.</p>
          </section>
          <section className="panel" aria-labelledby="no-h">
            <div className="panel-head"><h2 id="no-h">No evidence yet <span className="chip-count">{without.length}</span></h2></div>
            <ul className="plain">{without.map((k) => <li key={k}><button className="link" onClick={() => { setF({ ...f, skill: k }); setOpen(true) }}>{SKILLS[k]}</button><small className="muted block">{CLOSERS[k].what}</small></li>)}</ul>
          </section>
        </aside>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Add evidence">
        <form className="form" onSubmit={save} noValidate>
          <div className="two">
            <label className="field"><span>Skill</span><select value={f.skill} onChange={(e) => setF({ ...f, skill: e.target.value })}>{Object.entries(SKILLS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <label className="field"><span>Kind</span><select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></label>
          </div>
          <label className="field"><span>Name</span><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} aria-invalid={!!err.title} aria-describedby={err.title ? 'err-t' : undefined} placeholder="Mixed-effects model of campus temperatures" />{err.title && <span className="err" id="err-t">{err.title}</span>}</label>
          <label className="field"><span>Link to the work (optional)</span><input value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} inputMode="url" aria-invalid={!!err.link} aria-describedby={err.link ? 'err-l' : 'hint-l'} placeholder="https://" /><small id="hint-l" className="muted">With a link it counts as linked (70%); without, as a claim (30%).</small>{err.link && <span className="err" id="err-l">{err.link}</span>}</label>
          <fieldset className="field"><legend>Level you showed</legend><div className="seg">{[1, 2, 3].map((l) => <label key={l} className={+f.level === l ? 'is-on' : ''}><input type="radio" name="lvl" value={l} checked={+f.level === l} onChange={() => setF({ ...f, level: l })} />{LEVEL[l]}</label>)}</div></fieldset>
          <label className="field"><span>Ask someone to verify it (optional)</span><input type="email" value={f.verifier} onChange={(e) => setF({ ...f, verifier: e.target.value })} aria-invalid={!!err.verifier} aria-describedby={err.verifier ? 'err-v' : 'hint-v'} placeholder="ta.name@northgate.edu" /><small id="hint-v" className="muted">A TA, supervisor or lecturer. Once they confirm, it counts in full.</small>{err.verifier && <span className="err" id="err-v">{err.verifier}</span>}</label>
          <div className="dlg-foot"><button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn is-primary">Save evidence</button></div>
        </form>
      </Dialog>
    </div>
  )
}
