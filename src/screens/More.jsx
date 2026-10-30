import { Link } from 'react-router-dom'
import { Activity as ActivityIcon, Lock1, Moon, Brush2, ShieldTick, ArrowRight2, Logout, People } from 'iconsax-react'
import { useStore } from '../store.jsx'
import { BRANDS } from '../data/school.js'
import { Segmented } from '../ui/kit.jsx'

export default function More() {
  const { state, dispatch, user, brand, toast } = useStore()
  const set = (patch) => dispatch({ type: 'set', patch })
  return (
    <div className="page">
      <header className="page-head"><h1>More</h1></header>

      <div className="me">
        <span className="crest crest-lg">{brand.crest}</span>
        <div><strong>{user.name}</strong><small>{user.title}, {brand.name}</small></div>
      </div>

      <section className="block">
        <h2 className="block-title">Your access</h2>
        <ul className="access">
          {[
            ['Open student records', user.classes ? `Your classes: ${user.classes.join(', ')}` : 'Whole school'],
            ['Edit personal details', user.can.editRecords ? 'Yes' : 'Suggest corrections to the office'],
            ['Health details and IDs', user.can.viewSensitive ? 'Yes, with a reason each time' : 'Alerts only'],
            ['Enter marks', user.subject ? `${user.subject} for your classes` : 'Review and publish'],
            ['Export data', user.can.exportData ? 'Yes, logged' : 'No'],
          ].map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}
        </ul>
      </section>

      <section className="block">
        <h2 className="block-title">Security</h2>
        <div className="menu-list">
          {user.role === 'registrar' && <Link to="/activity"><ActivityIcon size={20} color="currentColor" />Access log<ArrowRight2 size={16} color="currentColor" /></Link>}
          <button onClick={() => set({ locked: true })}><Lock1 size={20} color="currentColor" />Lock now</button>
          <div className="menu-static"><ShieldTick size={20} color="currentColor" /><span>Locks after 5 minutes away. Records are encrypted on this phone and removed if you sign out.</span></div>
        </div>
      </section>

      <section className="block">
        <h2 className="block-title"><Moon size={18} color="currentColor" /> Appearance</h2>
        <Segmented label="Theme" value={state.theme} onChange={(theme) => set({ theme })} options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
      </section>

      {user.role === 'registrar' && (
        <section className="block">
          <h2 className="block-title"><Brush2 size={18} color="currentColor" /> School brand</h2>
          <p className="quiet small">Set once by the school. Name, crest and one colour from the brand guidelines.</p>
          <div className="brand-pick">
            {BRANDS.map((b) => (
              <button key={b.id} className={state.brandId === b.id ? 'is-on' : ''} onClick={() => set({ brandId: b.id })} aria-pressed={state.brandId === b.id}>
                <span className="crest" style={{ background: b.accent }}>{b.crest}</span>{b.name}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="block">
        <div className="menu-list">
          <button onClick={() => { set({ role: user.role === 'registrar' ? 'teacher' : 'registrar' }); toast(`Switched to ${user.role === 'registrar' ? 'Tomasz Wilk, teacher' : 'Marisol Ventura, registrar'}`, 'info') }}><People size={20} color="currentColor" />Switch demo account</button>
          <button className="is-danger" onClick={() => toast('Sign out is turned off in the prototype', 'info')}><Logout size={20} color="currentColor" />Sign out</button>
        </div>
      </section>
      <p className="quiet small center">Prototype with sample data. No real student information.</p>
    </div>
  )
}
