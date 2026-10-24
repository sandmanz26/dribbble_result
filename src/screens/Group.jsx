import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import RouteMap from '../map/RouteMap.jsx'
import { Avatar, Sheet, TopBar, Trust } from '../ui/kit.jsx'
import { membersOf, spots } from '../ui/cards.jsx'
import { GROUPS, fmtRange, fmtWeekday, group, nights, untilStart, usd } from '../data/groups.js'
import { PEOPLE, firstName, trust } from '../data/people.js'
import { place } from '../data/places.js'

// Screen question: can I trust these people, and will this trip suit me?
export default function Group() {
  const { id } = useParams()
  const { s, set, notify } = useStore()
  const nav = useNavigate()
  const [sheet, setSheet] = useState(false)
  const [note, setNote] = useState('')
  const [agree, setAgree] = useState(false)
  const [linkSheet, setLinkSheet] = useState(false)
  if (!GROUPS[id]) return <Navigate to="/" replace />

  const g = group(id)
  const p = place(g.place)
  const members = membersOf(g, s)
  const mine = members.includes('nadia')
  const req = s.requests[id]
  const left = spots(g, s)
  const myId = s.account?.id === 'done'
  const blockedIn = members.filter((m) => s.blocked.includes(m))
  const canJoin = !g.idOnly || myId

  const send = () => {
    set({ requests: { ...s.requests, [id]: left <= 0 ? 'waitlist' : 'pending' } })
    setSheet(false)
    if (left <= 0) {
      notify({ text: `You are on the waitlist for ${g.title}.` })
      return
    }
    notify({ text: `Request sent to ${firstName(g.host)}. Hosts usually answer within a day.` })
    // The demo host answers quickly so the whole flow can be seen.
    setTimeout(() => {
      set((c) => ({ requests: { ...c.requests, [id]: 'member' } }))
      notify({ text: `${firstName(g.host)} accepted you into ${g.title}.` })
    }, 3500)
  }

  const linked = s.linked.includes(id)
  const linkTo = g.linkable?.map(group).find(Boolean)

  return (
    <div className="page detail has-cta">
      <TopBar title={g.title} sub={`${p.name}, ${p.country}`} right={
        <button className="iconbtn" aria-label="Share group" onClick={() => notify({ text: 'Link copied. Only verified travellers can open it.' })}><Icon name="share" size={20} /></button>
      } />
      <div className="hero-route">
        <RouteMap dest={p} people={members} w={390} h={230} tone="dark" pad={30} />
        <span className="hero-route-cap"><Icon name="route" size={14} /> {members.length} travellers from {new Set(members.map((m) => PEOPLE[m].home)).size} cities to {p.name}</span>
      </div>

      <div className="facts four">
        <div><span className="meta small">Dates</span><strong>{fmtRange(g.start, g.end)}</strong><span className="meta small">{fmtWeekday(g.start)} to {fmtWeekday(g.end)}</span></div>
        <div><span className="meta small">Nights</span><strong className="num">{nights(g)}</strong><span className="meta small">{untilStart(g) >= 0 ? `starts in ${untilStart(g)} days` : 'under way'}</span></div>
        <div><span className="meta small">Budget</span><strong className="num">{usd(g.budget)}</strong><span className="meta small">per person, no flights</span></div>
        <div><span className="meta small">Spots</span><strong className="num">{Math.max(left, 0)} of {g.cap}</strong><span className="meta small">{left <= 0 ? 'waitlist open' : 'left'}</span></div>
      </div>

      <p className="lede">{g.about}</p>
      <div className="tags"><span className="tag">{g.pace}</span><span className="tag">Ages {g.ages}</span>{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>

      {blockedIn.length > 0 && (
        <div className="note warn">
          <Icon name="block" />
          <p>Someone you blocked is in this group. They cannot see that you looked, and you will not be matched with them.</p>
        </div>
      )}

      <section aria-labelledby="who-h">
        <div className="sechead"><h2 id="who-h">Who is going</h2><span className="meta num">{members.length}</span></div>
        <div className={`req ${g.idOnly ? 'strict' : ''}`}>
          <Icon name={g.idOnly ? 'verified' : 'shield'} />
          <p>{g.idOnly ? 'ID verified travellers only. Everyone here passed an ID check.' : 'Phone and email verified travellers. ID check optional.'}</p>
        </div>
        <ul className="people">
          {members.map((m) => (
            <li key={m}>
              <Link to={`/u/${m}`} className="person-row">
                <Avatar id={m} size={44} />
                <span className="person-main">
                  <strong>{m === 'nadia' ? 'You' : PEOPLE[m].name}{m === g.host && <small className="host">Host</small>}</strong>
                  <span className="meta small">{PEOPLE[m].home} · {PEOPLE[m].trips} trips</span>
                </span>
                <Trust id={m} compact />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {g.rules.length > 0 && (
        <section aria-labelledby="rules-h">
          <div className="sechead"><h2 id="rules-h">House rules</h2></div>
          <ul className="bullets">{g.rules.map((r) => <li key={r}>{r}</li>)}</ul>
        </section>
      )}

      {mine && linkTo && (
        <section aria-labelledby="link-h">
          <div className="linkcard">
            <Icon name="link" />
            <div>
              <strong id="link-h">{linkTo.title} is in {place(linkTo.place).name} the same week</strong>
              <p className="meta">{fmtRange(linkTo.start, linkTo.end)} · {linkTo.members.length} people. Linking shares day plans and a joint chat. Rooms, costs and members stay separate.</p>
              {linked ? <span className="pill ok"><Icon name="tick" size={14} /> Linked</span> : <button className="btn ghost small" onClick={() => setLinkSheet(true)}>Suggest linking</button>}
            </div>
          </div>
        </section>
      )}

      <div className="cta">
        {mine ? (
          <button className="btn primary block" onClick={() => nav(id === 'kyoto' ? '/trip/kyoto' : `/chats/${id}`)}>{id === 'kyoto' ? 'Open the trip plan' : 'Open the group chat'}</button>
        ) : req === 'pending' ? (
          <button className="btn ghost block" disabled><span className="spinner" aria-hidden="true" /> Waiting for {firstName(g.host)}</button>
        ) : req === 'waitlist' ? (
          <button className="btn ghost block" disabled>On the waitlist</button>
        ) : (
          <button className="btn primary block" onClick={() => setSheet(true)}>{left <= 0 ? 'Join the waitlist' : 'Request to join'}</button>
        )}
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title={left <= 0 ? 'Join the waitlist' : `Ask ${firstName(g.host)} to join`}>
        {!canJoin ? (
          <div className="sheet-body">
            <div className="note warn"><Icon name="id" /><p>This group only accepts ID-verified travellers. The check takes about two minutes.</p></div>
            <button className="btn primary block" onClick={() => { set({ account: { ...(s.account || {}), id: 'done' } }); notify({ text: 'ID verified. You can ask to join now.' }) }}>Verify my ID</button>
          </div>
        ) : (
          <div className="sheet-body">
            <ul className="checklist">
              <li><Icon name="tick" /> Your phone and email are verified</li>
              <li><Icon name={myId ? 'tick' : 'info'} /> {myId ? 'Your ID is verified' : 'ID not verified, which this group allows'}</li>
              <li><Icon name="tick" /> {firstName(g.host)} sees your profile and trips, not your phone number</li>
            </ul>
            <label htmlFor="note">A note to {firstName(g.host)}</label>
            <textarea id="note" rows={3} placeholder="Why this trip, and how you like to travel" value={note} onChange={(e) => setNote(e.target.value)} />
            <label className="check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I have read the house rules{g.rules.length ? '' : ' and community guidelines'}</label>
            <button className="btn primary block" disabled={!agree} onClick={send}>{left <= 0 ? 'Join the waitlist' : 'Send request'}</button>
          </div>
        )}
      </Sheet>

      <Sheet open={linkSheet} onClose={() => setLinkSheet(false)} title="Suggest linking groups">
        {linkTo && (
          <div className="sheet-body">
            <p>{firstName(linkTo.host)}, the host of {linkTo.title}, gets the suggestion. If both hosts agree:</p>
            <ul className="checklist">
              <li><Icon name="tick" /> Day plans can be shared between groups</li>
              <li><Icon name="tick" /> A joint chat opens for meet-ups</li>
              <li><Icon name="lock" /> Rooms, costs and member lists stay private to each group</li>
            </ul>
            <button className="btn primary block" onClick={() => { set({ linked: [...s.linked, id] }); setLinkSheet(false); notify({ text: `Suggestion sent to ${firstName(linkTo.host)}. ${firstName(linkTo.host)} agreed, groups linked.` }) }}>Send suggestion</button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
