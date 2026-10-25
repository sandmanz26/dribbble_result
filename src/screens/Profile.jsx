import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { FLAGS } from '../data/library.js'

const GOALS = [['calm', 'Feel calmer'], ['sleep', 'Sleep better'], ['focus', 'Focus'], ['energy', 'More energy']]

export default function Profile() {
  const { s, set, notify } = useStore()
  const toggle = (id) => set({ flags: s.flags.includes(id) ? s.flags.filter((f) => f !== id) : [...s.flags, id] })
  return (
    <div className="page">
      <header className="pagehead"><div><h1>{s.name}</h1><p className="meta">With Tend since 2 September</p></div></header>

      <section className="sec" aria-labelledby="g-h">
        <div className="sec-head"><h2 id="g-h">What you want more of</h2></div>
        <div className="chips" role="radiogroup" aria-label="Goal">
          {GOALS.map(([id, l]) => <button key={id} role="radio" aria-checked={s.goal === id} className="chip" onClick={() => set({ goal: id })}>{l}</button>)}
        </div>
      </section>

      <section className="sec" aria-labelledby="f-h">
        <div className="sec-head"><h2 id="f-h">Herbs should avoid</h2><span className="meta num">{s.flags.length} set</span></div>
        <p className="meta">Used only to leave out herbs that do not suit you. Stored on this phone.</p>
        <ul className="flags">
          {FLAGS.map((f) => <li key={f.id}><label className="flag"><input type="checkbox" checked={s.flags.includes(f.id)} onChange={() => toggle(f.id)} />{f.label}</label></li>)}
        </ul>
      </section>

      <section className="sec" aria-labelledby="r-h">
        <div className="sec-head"><h2 id="r-h">Reminder and sound</h2></div>
        <div className="rows">
          <div className="row"><Icon name="bell" /><label htmlFor="rt">Every day at</label><input id="rt" type="time" value={s.reminder} onChange={(e) => { set({ reminder: e.target.value }); notify({ text: `Reminder moved to ${e.target.value}.` }) }} /></div>
          <div className="row"><Icon name="sound" /><label htmlFor="sd">Sound for sitting</label>
            <select id="sd" value={s.sound} onChange={(e) => set({ sound: e.target.value })}><option value="rain">Rain</option><option value="hum">Low hum</option><option value="none">Silence</option></select>
          </div>
          <div className="row"><Icon name="swatch" /><label htmlFor="th">Appearance</label>
            <select id="th" value={s.theme} onChange={(e) => set({ theme: e.target.value })}><option value="system">Match phone</option><option value="light">Light</option><option value="dark">Dark</option></select>
          </div>
        </div>
      </section>

      <p className="note"><Icon name="shield" /> Tend supports everyday wellbeing and is not medical advice. If you are struggling, talk to someone you trust or a professional.</p>
    </div>
  )
}
