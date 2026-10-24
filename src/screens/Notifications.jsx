import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Toggle, TopBar } from '../ui/kit.jsx'
import { NOTIFICATIONS } from '../data/trip.js'

const ICON = { poll: 'calendar', cost: 'wallet', safety: 'shield', group: 'groups' }

export default function Notifications() {
  const { s, set } = useStore()
  const unread = NOTIFICATIONS.filter((n) => !s.read.includes(n.id)).map((n) => n.id)
  // Opening the list marks everything read, but the dots stay for this visit.
  useEffect(() => { if (unread.length) set((c) => ({ read: [...new Set([...c.read, ...unread])] })) }, []) // eslint-disable-line
  return (
    <div className="page detail">
      <TopBar title="Notifications" />
      <ul className="rows notes">
        {NOTIFICATIONS.map((n) => (
          <li key={n.id}>
            <Link to={n.to} className={`row ${unread.includes(n.id) ? 'unread' : ''}`}>
              <span className={`note-ic k-${n.kind}`}><Icon name={ICON[n.kind]} size={18} /></span>
              <span className="row-main"><strong className="normal">{n.text}</strong><span className="meta small">{n.at}</span></span>
            </Link>
          </li>
        ))}
      </ul>
      <section aria-labelledby="how-h">
        <div className="sechead"><h2 id="how-h">How to reach you</h2></div>
        <ul className="switches">
          <li><label htmlFor="n1"><strong>Push notifications</strong><span className="meta small">Chats, join answers, polls closing</span></label><Toggle id="n1" checked={s.prefs.push} onChange={(v) => set({ prefs: { ...s.prefs, push: v } })} label="Push notifications" /></li>
          <li><label htmlFor="n2"><strong>Email digest</strong><span className="meta small">One email a day, only if something changed</span></label><Toggle id="n2" checked={s.prefs.emailNotes} onChange={(v) => set({ prefs: { ...s.prefs, emailNotes: v } })} label="Email digest" /></li>
        </ul>
        <p className="meta small">Safety alerts always reach you, whatever you choose here.</p>
      </section>
    </div>
  )
}
