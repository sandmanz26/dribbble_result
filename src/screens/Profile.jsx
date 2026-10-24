import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Avatar, Trust } from '../ui/kit.jsx'
import { PEOPLE } from '../data/people.js'

export default function Profile() {
  const { s, set } = useStore()
  const nav = useNavigate()
  const me = PEOPLE.nadia
  const level = s.account?.id === 'done' ? 'id' : 'contact'
  return (
    <div className="page">
      <header className="pagehead"><div><h1>You</h1></div></header>
      <div className="me-card">
        <Avatar id="nadia" size={64} />
        <div>
          <strong>{me.name}</strong>
          <span className="meta small">{me.home} · {me.trips} trips</span>
          <Trust level={level} />
        </div>
      </div>
      {level !== 'id' && (
        <button className="note warn as-button" onClick={() => set({ account: { ...(s.account || {}), id: 'done' } })}>
          <Icon name="id" /><span><strong>Verify your ID</strong> to join groups that ask for it. About two minutes.</span>
        </button>
      )}
      <ul className="rows menu-list">
        <li><Link to="/me/safety" className="row"><Icon name="shield" /><span className="row-main"><strong>Safety</strong><span className="meta small">Who can message you, blocked people, trip sharing</span></span><Icon name="next" /></Link></li>
        <li><Link to="/notifications" className="row"><Icon name="bell" /><span className="row-main"><strong>Notifications</strong><span className="meta small">{s.prefs.push ? 'Push on' : 'Push off'}{s.prefs.emailNotes ? ', email on' : ''}</span></span><Icon name="next" /></Link></li>
        <li><Link to="/me/guidelines" className="row"><Icon name="book" /><span className="row-main"><strong>Community guidelines</strong><span className="meta small">How we travel together</span></span><Icon name="next" /></Link></li>
        <li>
          <div className="row">
            <Icon name={s.theme === 'dark' ? 'moon' : 'sun'} />
            <span className="row-main"><strong>Appearance</strong></span>
            <select aria-label="Appearance" value={s.theme} onChange={(e) => set({ theme: e.target.value })}>
              <option value="system">Match phone</option><option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </div>
        </li>
        <li><button className="row" onClick={() => { set({ onboarded: false }); nav('/welcome') }}><Icon name="logout" /><span className="row-main"><strong>Sign out</strong></span></button></li>
      </ul>
    </div>
  )
}
