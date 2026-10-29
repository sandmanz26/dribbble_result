import { useState } from 'react'
import { useStore } from '../store.jsx'
import { STUDENT, VIEWS } from '../data/bridge.js'
import { Toggle, Dialog, fmtDate } from '../ui/kit.jsx'
import * as I from '../ui/icons.js'

const VIS = [
  ['applied', 'Only labs I apply to', 'Your profile stays hidden until you send an application.'],
  ['campus', 'Any researcher at Northgate', 'Researchers can find you and invite you to apply.'],
]

export default function Privacy() {
  const { s, dispatch } = useStore()
  const pv = s.privacy
  const [del, setDel] = useState(false)
  const [typed, setTyped] = useState('')
  const set = (patch) => dispatch({ type: 'privacy', patch })
  const download = () => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ student: STUDENT, evidence: s.evidence, applications: s.applications, contributions: s.contributions, privacy: pv }, null, 2)], { type: 'application/json' })); a.download = 'bridge-my-data.json'; a.click()
    dispatch({ type: 'toast', text: 'Your data is downloading' })
  }
  return (
    <div className="page settings">
      <header className="title-row"><div><h1>Privacy</h1><p className="sub">Who can see you, and what they see. Changes save as you make them.</p></div></header>

      <section className="set">
        <div className="set-label"><h2>Who can find you</h2><p>Right now: {VIS.find((v) => v[0] === pv.visibility)[1].toLowerCase()}.</p></div>
        <div className="set-panel" role="radiogroup" aria-label="Who can find you">
          {VIS.map(([k, t, d]) => (
            <label key={k} className={`opt ${pv.visibility === k ? 'is-on' : ''}`}><input type="radio" name="vis" checked={pv.visibility === k} onChange={() => set({ visibility: k })} /><span><b>{t}</b><small>{d}</small></span></label>
          ))}
        </div>
      </section>

      <section className="set">
        <div className="set-label"><h2>What labs see when you apply</h2><p>Evidence first. Your name and grades follow only if you allow them.</p></div>
        <div className="set-panel">
          <div className="sw-row"><label htmlFor="p-blind"><b>Hide my name until shortlisting <span className="badge">Recommended</span></b><small>Labs judge the evidence, not the name or the photo.</small></label><Toggle id="p-blind" on={pv.blind} onChange={(v) => set({ blind: v })} label="Hide my name until shortlisting" /></div>
          <div className="sw-row"><label htmlFor="p-grades"><b>Show course grades</b><small>Off: courses show as verified by the registrar, without the grade.</small></label><Toggle id="p-grades" on={pv.grades} onChange={(v) => set({ grades: v })} label="Show course grades" /></div>
        </div>
      </section>

      <section className="set">
        <div className="set-label"><h2>Who opened your profile</h2><p>Every view by a lab or through your passport link, for the last 90 days.</p></div>
        <div className="set-panel">
          <ul className="plain">{VIEWS.map((v) => <li key={v.at}><b>{v.who}</b><small className="muted block">{fmtDate(v.at.slice(0, 10), { day: 'numeric', month: 'long' })}, {v.at.slice(11)} · {v.via}</small></li>)}</ul>
        </div>
      </section>

      <section className="set">
        <div className="set-label"><h2>Your data</h2><p>Everything Bridge holds about you, as a file, or gone for good.</p></div>
        <div className="set-panel">
          <div className="sw-row"><span><b>Download my data</b><small>Evidence, applications, passport and settings as JSON.</small></span><button className="btn" onClick={download}><I.Download size={16} /> Download</button></div>
          <div className="sw-row"><span><b>Delete my account</b><small>Your passport stays with you as the last file you downloaded. Labs keep only what you sent them.</small></span><button className="btn is-danger" onClick={() => setDel(true)}>Delete</button></div>
        </div>
      </section>

      <Dialog open={del} onClose={() => { setDel(false); setTyped('') }} title="Delete your Bridge account?">
        <p className="prose">This removes your evidence, applications and passport from Bridge. It cannot be undone. Download your passport first if you want to keep it.</p>
        <label className="field"><span>Type DELETE to confirm</span><input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" /></label>
        <div className="dlg-foot"><button className="btn" onClick={() => setDel(false)}>Keep my account</button><button className="btn is-danger" disabled={typed !== 'DELETE'} onClick={() => { setDel(false); setTyped(''); dispatch({ type: 'toast', text: 'In the prototype nothing is deleted. In the product, this is final.' }) }}>Delete account</button></div>
      </Dialog>
    </div>
  )
}
