import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Avatar, Seg, Toggle, TopBar } from '../ui/kit.jsx'
import { PEOPLE } from '../data/people.js'

// Safety preferences. Every switch says what it changes in plain words.
export default function Safety() {
  const { s, set, notify } = useStore()
  const pr = s.prefs
  const up = (k, v) => set({ prefs: { ...pr, [k]: v } })
  return (
    <div className="page detail">
      <TopBar title="Safety" />
      <section aria-labelledby="msg-h">
        <div className="sechead"><h2 id="msg-h">Who can message you</h2></div>
        <Seg label="Who can message you" value={pr.messages} onChange={(v) => up('messages', v)} options={[['groups', 'My groups'], ['verified', 'Verified'], ['anyone', 'Anyone']]} />
        <p className="meta small">{pr.messages === 'groups' ? 'Only people in a group with you. Everyone else is turned away.' : pr.messages === 'verified' ? 'Your groups, plus verified travellers. Others go to Requests.' : 'Anyone can message you. Unverified people still go to Requests.'}</p>
      </section>

      <section aria-labelledby="see-h">
        <div className="sechead"><h2 id="see-h">What you see and share</h2></div>
        <ul className="switches">
          <li><label htmlFor="t1"><strong>Show ID-verified groups only</strong><span className="meta small">Discover hides groups that do not check ID</span></label><Toggle id="t1" checked={pr.idOnly} onChange={(v) => up('idOnly', v)} label="Show ID-verified groups only" /></li>
          <li><label htmlFor="t2"><strong>Hide me from search</strong><span className="meta small">Only your groups can find your profile</span></label><Toggle id="t2" checked={pr.hideProfile} onChange={(v) => up('hideProfile', v)} label="Hide me from search" /></li>
          <li><label htmlFor="t3"><strong>Share trips with an emergency contact</strong><span className="meta small">{pr.contact} gets your dates, stays and group</span></label><Toggle id="t3" checked={pr.shareTrip} onChange={(v) => up('shareTrip', v)} label="Share trips with an emergency contact" /></li>
          <li><label htmlFor="t4"><strong>Live location during trips</strong><span className="meta small">Visible to your group only, and only between the trip dates</span></label><Toggle id="t4" checked={pr.live} onChange={(v) => up('live', v)} label="Live location during trips" /></li>
        </ul>
      </section>

      <section aria-labelledby="bl-h">
        <div className="sechead"><h2 id="bl-h">Blocked</h2><span className="meta num">{s.blocked.length}</span></div>
        {s.blocked.length === 0 ? <p className="meta">No one. Block someone from their profile or a chat.</p> : (
          <ul className="rows">
            {s.blocked.map((id) => (
              <li key={id} className="row">
                <Avatar id={id} size={36} />
                <span className="row-main"><strong>{PEOPLE[id].name}</strong></span>
                <button className="btn ghost small" onClick={() => { set({ blocked: s.blocked.filter((x) => x !== id) }); notify({ text: `${PEOPLE[id].name.split(' ')[0]} is unblocked.` }) }}>Unblock</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="rp-h">
        <div className="sechead"><h2 id="rp-h">Your reports</h2><span className="meta num">{s.reports.length}</span></div>
        {s.reports.length === 0 ? <p className="meta">Report someone from their profile or from a chat. Reports are read by a person on our safety team.</p> : (
          <ul className="rows">{s.reports.map((r) => <li key={r.ref} className="row"><span className="row-main"><strong>{PEOPLE[r.who].name}</strong><span className="meta small">{r.ref} · In review, answer within 24 hours</span></span></li>)}</ul>
        )}
      </section>

      <Link to="/me/guidelines" className="startrow"><Icon name="book" /><span><strong>Community guidelines</strong><small>What everyone agreed to</small></span><Icon name="next" /></Link>
    </div>
  )
}
