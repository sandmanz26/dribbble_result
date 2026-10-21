import { useNavigate } from 'react-router-dom'
import { IconChevronRight, IconCreditCard, IconBell, IconHelpCircle, IconPhoto, IconLogout, IconSwitchHorizontal } from '@tabler/icons-react'
import { TopBar, TabBar } from '../components/ui.jsx'
import { useStore } from '../app/store.jsx'

export default function Me() {
  const nav = useNavigate()
  const { user, signOut, setRole, bookings } = useStore()
  const initials = (user?.name || 'Guest').split(' ').map((w) => w[0]).slice(0, 2).join('')
  const rows = [
    [IconCreditCard, 'Payment methods', 'Visa ending 4242'],
    [IconBell, 'Notifications', 'Booking updates and messages'],
    [IconHelpCircle, 'Help and safety', 'Cancellations, refunds, disputes'],
  ]
  return (
    <>
      <div className="screen has-tabs">
        <TopBar title="Profile" left back={false} />
        <div className="pad" style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '12px 0 24px' }}>
          <span style={{ width: 64, height: 64, borderRadius: 99, background: 'var(--ink)', color: 'var(--on-ink)', display: 'grid', placeItems: 'center', fontWeight: 650, fontSize: 22 }}>{initials}</span>
          <div>
            <h2>{user?.name || 'Guest'}</h2>
            <p className="small muted">{user?.guest ? 'Browsing without an account' : `${user?.email}, ${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`}</p>
          </div>
        </div>
        {user?.guest ? (
          <div className="pad"><button className="btn block" onClick={() => nav('/signup')}>Create an account</button></div>
        ) : (
          <div className="group">
            <button className="list-item" onClick={() => { setRole(user.role === 'creator' ? 'client' : 'creator'); nav(user.role === 'creator' ? '/' : '/studio') }}>
              <IconSwitchHorizontal size={22} stroke={1.6} />
              <span className="grow">{user.role === 'creator' ? 'Switch to hiring' : 'Switch to creator mode'}<br /><span className="small muted">{user.role === 'creator' ? 'Browse and book other creators' : 'Show your work and take bookings'}</span></span>
              <IconChevronRight size={18} />
            </button>
          </div>
        )}
        <div className="group" style={{ marginTop: 16 }}>
          {rows.map(([Icon, label, sub]) => (
            <button key={label} className="list-item"><Icon size={22} stroke={1.6} /><span className="grow">{label}<br /><span className="small muted">{sub}</span></span><IconChevronRight size={18} /></button>
          ))}
          <button className="list-item" onClick={() => nav('/credits')}><IconPhoto size={22} stroke={1.6} /><span className="grow">Photo credits</span><IconChevronRight size={18} /></button>
        </div>
        <div className="group" style={{ marginTop: 16 }}>
          <button className="list-item" style={{ color: 'var(--danger)' }} onClick={() => { signOut(); nav('/welcome', { replace: true }) }}><IconLogout size={22} stroke={1.6} /><span className="grow">Sign out</span></button>
        </div>
      </div>
      <TabBar />
    </>
  )
}
