import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Avatar, TopBar, Trust } from '../ui/kit.jsx'
import { BlockSheet, ReportSheet } from '../ui/Report.jsx'
import { PEOPLE, trust } from '../data/people.js'
import { GROUPS, group } from '../data/groups.js'
import { membersOf } from '../ui/cards.jsx'

// Screen question: who is this, and what has been checked about them?
export default function Person() {
  const { id } = useParams()
  const { s, set, notify } = useStore()
  const [report, setReport] = useState(false)
  const [block, setBlock] = useState(false)
  if (!PEOPLE[id]) return <Navigate to="/" replace />
  if (id === 'nadia') return <Navigate to="/me" replace />
  const p = PEOPLE[id]
  const blocked = s.blocked.includes(id)
  const shared = Object.keys(GROUPS).map(group).filter((g) => membersOf(g, s).includes('nadia') && g.members.includes(id))
  const level = trust(id)

  return (
    <div className="page detail">
      <TopBar title={p.name} sub={p.home} />
      <div className="profile-head">
        <Avatar id={id} size={84} />
        <Trust id={id} />
        <p className="meta">Member since {p.since} · {p.trips} trips with Caravan</p>
      </div>
      {p.about && <p className="lede center">{p.about}</p>}
      <section aria-labelledby="chk-h">
        <div className="sechead"><h2 id="chk-h">What we checked</h2></div>
        <ul className="checklist big">
          <li className={p.verified.phone ? '' : 'todo'}><Icon name={p.verified.phone ? 'tick' : 'close'} /> Phone number</li>
          <li className={p.verified.email ? '' : 'todo'}><Icon name={p.verified.email ? 'tick' : 'close'} /> Email address</li>
          <li className={p.verified.id ? '' : 'todo'}><Icon name={p.verified.id ? 'verified' : 'close'} /> Government ID, matched to their face</li>
        </ul>
        {level === 'partial' && <p className="note warn"><Icon name="alert" /> {p.name.split(' ')[0]} has not finished verifying. They cannot join groups until they do.</p>}
      </section>
      <section aria-labelledby="lang-h">
        <div className="sechead"><h2 id="lang-h">Speaks</h2></div>
        <div className="tags">{p.languages.map((l) => <span key={l} className="tag">{l}</span>)}</div>
      </section>
      {shared.length > 0 && (
        <section aria-labelledby="sh-h">
          <div className="sechead"><h2 id="sh-h">Trips you share</h2></div>
          <ul className="bullets">{shared.map((g) => <li key={g.id}>{g.title}</li>)}</ul>
        </section>
      )}
      <div className="danger-zone">
        <button className="btn ghost block" onClick={() => setReport(true)}><Icon name="flag" size={18} /> Report</button>
        {blocked ? (
          <button className="btn ghost block" onClick={() => { set({ blocked: s.blocked.filter((x) => x !== id) }); notify({ text: `${p.name.split(' ')[0]} is unblocked.` }) }}>Unblock</button>
        ) : (
          <button className="btn ghost block danger-text" onClick={() => setBlock(true)}><Icon name="block" size={18} /> Block</button>
        )}
      </div>
      <ReportSheet who={id} open={report} onClose={() => setReport(false)} />
      <BlockSheet who={id} open={block} onClose={() => setBlock(false)} />
    </div>
  )
}
