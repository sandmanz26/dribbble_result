import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconCalendarOff, IconMapPin } from '@tabler/icons-react'
import { TopBar, TabBar, Img, Empty, Sheet } from '../components/ui.jsx'
import { getCreator, money } from '../data/creators.js'
import { coverOf } from '../data/media.js'
import { useStore } from '../app/store.jsx'

const nice = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
const LABEL = { confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' }

export default function Bookings() {
  const { bookings, cancelBooking } = useStore()
  const [tab, setTab] = useState('upcoming')
  const [open, setOpen] = useState(null)
  const list = bookings.filter((b) => (tab === 'upcoming' ? b.status === 'confirmed' : b.status !== 'confirmed'))
  const sel = open && bookings.find((b) => b.id === open)
  const selC = sel && getCreator(sel.creatorId)

  return (
    <>
      <div className="screen has-tabs">
        <TopBar title="Bookings" left back={false} />
        <div className="pad" style={{ marginTop: 8 }}>
          <div className="seg" role="tablist" aria-label="Bookings">
            <button role="tab" aria-selected={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Upcoming</button>
            <button role="tab" aria-selected={tab === 'past'} onClick={() => setTab('past')}>Past</button>
          </div>
        </div>
        {list.length ? (
          <div className="pad" style={{ display: 'grid', gap: 10, marginTop: 20 }}>
            {list.map((b) => {
              const c = getCreator(b.creatorId)
              const p = c.packages.find((x) => x.id === b.packageId)
              return (
                <button key={b.id} className="booking" style={{ textAlign: 'left' }} onClick={() => setOpen(b.id)}>
                  <Img src={coverOf(c, 330)} />
                  <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
                    <b>{c.name}</b>
                    <span className="small muted">{p.name}, {nice(b.date)} at {b.time}</span>
                  </span>
                  <span className={`status ${b.status}`}>{LABEL[b.status]}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <Empty icon={IconCalendarOff} title={tab === 'upcoming' ? 'No upcoming bookings' : 'Nothing here yet'}
            text={tab === 'upcoming' ? 'When you book a creator, the details will show up here.' : 'Completed and cancelled bookings appear here.'}
            action={tab === 'upcoming' && <Link to="/" className="btn sm">Find a creator</Link>} />
        )}
      </div>
      <TabBar />
      <Sheet open={!!sel} onClose={() => setOpen(null)} label="Booking details">
        {sel && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>{selC.name}</h2><span className={`status ${sel.status}`}>{LABEL[sel.status]}</span></div>
            <div className="summary">
              <div className="row"><span className="muted">Booking</span><b className="num">{sel.id}</b></div>
              <div className="row"><span className="muted">When</span><span>{nice(sel.date)}, {sel.time}</span></div>
              <div className="row"><span className="muted">Where</span><span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', textAlign: 'right' }}><IconMapPin size={15} stroke={1.6} />{sel.location}</span></div>
              <div className="row total"><span>Paid</span><span className="num">{money(sel.total)}</span></div>
            </div>
            <Link to={`/creator/${selC.id}`} className="btn ghost block">View {selC.name.split(' ')[0]}’s profile</Link>
            {sel.status === 'confirmed' && (
              <button className="text-btn" style={{ color: 'var(--danger)', justifySelf: 'center' }} onClick={() => { cancelBooking(sel.id); setOpen(null) }}>Cancel booking (free until 48 hours before)</button>
            )}
          </div>
        )}
      </Sheet>
    </>
  )
}
