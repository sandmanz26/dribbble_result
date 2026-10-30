import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { BRANDS, DEMO_PIN } from '../data/school.js'
import { Segmented } from './kit.jsx'

// Reviewer panel, desktop only. Lets a client try roles, brands and failure cases
// without hunting through the app.
export default function Panel() {
  const { state, dispatch, brand } = useStore()
  const nav = useNavigate()
  const set = (patch) => dispatch({ type: 'set', patch })
  const go = (to, patch) => { if (patch) set(patch); set({ locked: false }); nav(to) }

  return (
    <aside className="panel" aria-label="Prototype controls">
      <div className="panel-brand">
        <span className="crest">{brand.crest}</span>
        <div>
          <strong>Roll</strong>
          <p>Student records app for school office staff and teachers. Clickable prototype with sample data.</p>
        </div>
      </div>

      <section>
        <h3>Signed in as</h3>
        <Segmented label="Role" value={state.role} onChange={(role) => set({ role })} options={[{ value: 'registrar', label: 'Registrar' }, { value: 'teacher', label: 'Teacher' }]} />
        <p className="panel-note">{state.role === 'registrar' ? 'Full access. Edits records, sees health details, approves marks.' : 'Sees own classes only (9A, 9B, 10B). Enters marks, suggests corrections, sees health alerts but not details.'}</p>
      </section>

      <section>
        <h3>School brand</h3>
        <div className="panel-brands">
          {BRANDS.map((b) => (
            <button key={b.id} className={state.brandId === b.id ? 'is-on' : ''} onClick={() => set({ brandId: b.id })} aria-pressed={state.brandId === b.id}>
              <span className="swatch" style={{ background: b.accent }} />{b.short}
            </button>
          ))}
        </div>
        <p className="panel-note">Name, crest and one accent come from the school's guidelines. Everything else stays neutral so any brand fits.</p>
      </section>

      <section>
        <h3>Appearance</h3>
        <Segmented label="Theme" value={state.theme} onChange={(theme) => set({ theme })} options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
      </section>

      <section>
        <h3>Network</h3>
        <Segmented label="Network" value={state.online ? 'on' : 'off'} onChange={(v) => set({ online: v === 'on' })} options={[{ value: 'on', label: 'Online' }, { value: 'off', label: 'Offline' }]} />
        <p className="panel-note">Go offline, enter some marks, then come back online to see the sync queue.</p>
      </section>

      <section>
        <h3>Try these</h3>
        <ul className="panel-links">
          <li><button onClick={() => go('/search')}>Search "amara okafor", "amra", "9B" or a phone ending like "0918"</button></li>
          <li><button onClick={() => go('/students/new', { role: 'registrar' })}>Add a student named Amara Okafor (duplicate check)</button></li>
          <li><button onClick={() => go('/marks/9B-math', { role: 'teacher' })}>Enter 9B maths marks as the teacher</button></li>
          <li><button onClick={() => go('/marks', { role: 'registrar' })}>Approve submitted marks as the registrar</button></li>
          <li><button onClick={() => go('/activity', { role: 'registrar' })}>Who looked at what (access log)</button></li>
          <li><button onClick={() => set({ locked: true })}>Lock the app (PIN {DEMO_PIN})</button></li>
        </ul>
      </section>

      <button className="panel-reset" onClick={() => { dispatch({ type: 'reset' }); nav('/') }}>Reset sample data</button>
    </aside>
  )
}
