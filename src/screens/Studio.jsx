import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconPlus, IconCheck, IconX, IconInbox } from '@tabler/icons-react'
import { TopBar, TabBar, Img, Empty, Toast } from '../components/ui.jsx'
import { getCreator, money } from '../data/creators.js'
import { creatorMedia } from '../data/media.js'
import { useStore } from '../app/store.jsx'

const nice = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

// Creator side: incoming requests, earnings and portfolio management.
// Uploads are local previews only (object URLs), nothing leaves the browser.
export default function Studio() {
  const nav = useNavigate()
  const { user, requests, answerRequest, uploads, addUpload } = useStore()
  const [toast, setToast] = useState(null)
  if (user?.role !== 'creator') {
    return (
      <>
        <div className="screen has-tabs"><TopBar title="Studio" left back={false} />
          <Empty icon={IconInbox} title="Studio is for creators" text="Switch to creator mode from your profile to show your work and take bookings." action={<button className="btn sm" onClick={() => nav('/me')}>Go to profile</button>} />
        </div>
        <TabBar />
      </>
    )
  }
  const sample = creatorMedia(getCreator('lucia-ferreyra'), 330)
  const open = requests.filter((r) => r.status === 'new')
  const accepted = requests.filter((r) => r.status === 'accepted')
  const answer = (id, s) => { answerRequest(id, s); setToast(s === 'accepted' ? 'Request accepted. The client has been notified.' : 'Request declined.'); setTimeout(() => setToast(null), 2000) }
  const onFiles = (e) => {
    Array.from(e.target.files || []).slice(0, 6).forEach((f) => addUpload({ key: `${f.name}-${f.lastModified}`, src: URL.createObjectURL(f) }))
    e.target.value = ''
  }

  return (
    <>
      <div className="screen has-tabs">
        <TopBar title="Studio" left back={false} />
        <div className="kpis" style={{ marginTop: 8 }}>
          <div className="kpi dark"><span className="small muted">Earned in October</span><b className="num">{money(1240 + accepted.reduce((s, r) => s + r.total, 0))}</b></div>
          <div className="kpi"><span className="small muted">Profile views, 7 days</span><b className="num">318</b></div>
        </div>

        <section className="section">
          <div className="section-row"><h2>Requests</h2><span className="small muted">{open.length} waiting</span></div>
          {open.length ? (
            <div className="pad" style={{ display: 'grid', gap: 10 }}>
              {open.map((r) => (
                <article className="request" key={r.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span><b>{r.client}</b><br /><span className="small muted">{r.service}, {nice(r.date)} at {r.time}</span></span>
                    <b className="num">{money(r.total)}</b>
                  </div>
                  <div className="row2">
                    <button className="btn ghost sm" onClick={() => answer(r.id, 'declined')}><IconX size={16} />Decline</button>
                    <button className="btn sm" onClick={() => answer(r.id, 'accepted')}><IconCheck size={16} />Accept</button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="pad muted">You’re all caught up. New requests will appear here.</p>}
        </section>

        <section className="section">
          <div className="section-row"><h2>Portfolio</h2><span className="small muted">{sample.length + uploads.length} items</span></div>
          <div className="upload-grid">
            <label className="add-tile">
              <IconPlus size={22} stroke={1.6} />Add work
              <input type="file" accept="image/*,video/*" multiple onChange={onFiles} />
            </label>
            {uploads.map((u) => <Img key={u.key} src={u.src} />)}
            {sample.map((m) => <Img key={m.key} src={m.src} />)}
          </div>
          <p className="pad small muted" style={{ marginTop: 10 }}>Tip: profiles with 12 or more pieces get booked more often.</p>
        </section>
      </div>
      <TabBar />
      <Toast show={!!toast}><IconCheck size={18} />{toast}</Toast>
    </>
  )
}
