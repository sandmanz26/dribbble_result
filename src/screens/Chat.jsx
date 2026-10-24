import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Icon from '../ui/Icon.jsx'
import { Avatar, Sheet, TopBar, Trust } from '../ui/kit.jsx'
import { BlockSheet, ReportSheet } from '../ui/Report.jsx'
import { membersOf } from '../ui/cards.jsx'
import { CHATS } from '../data/trip.js'
import { GROUPS, group } from '../data/groups.js'
import { PEOPLE, firstName } from '../data/people.js'

// Asking for a number, money or to move off the app are the usual first moves of a scam.
const RISKY = /(\+?\d[\d\s-]{7,}\d)|whats\s?app|telegram|send (you )?(my )?number|bank|transfer|western union|crypto|wire/i

export default function Chat() {
  const { id } = useParams()
  const { s, set, messagesFor, send, notify } = useStore()
  const nav = useNavigate()
  const [text, setText] = useState('')
  const [menu, setMenu] = useState(false)
  const [report, setReport] = useState(false)
  const [block, setBlock] = useState(false)
  const [warn, setWarn] = useState(false)
  const end = useRef(null)

  const chat = CHATS[id] || (GROUPS[id] ? { kind: 'group', group: id, messages: [] } : null)
  const msgs = chat ? messagesFor(id) : []
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs.length])
  if (!chat) return <Navigate to="/chats" replace />

  const isGroup = chat.kind === 'group'
  const g = isGroup ? group(chat.group) : null
  if (isGroup && !membersOf(g, s).includes('nadia')) return <Navigate to={`/g/${chat.group}`} replace />
  const other = chat.with
  const isRequest = chat.kind === 'request' && !s.accepted.includes(other)
  if (other && s.blocked.includes(other) && !report) return <Navigate to="/chats" replace />

  const submit = (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    if (RISKY.test(t) && !warn) { setWarn(true); return }
    send(id, t)
    setText('')
    setWarn(false)
    // The demo group answers once, so the thread feels alive.
    if (isGroup && msgs.filter((m) => m.from === 'nadia').length === 0) {
      setTimeout(() => send(id, id === 'kyoto' ? 'Great, see you at the machiya on the 14th!' : 'Welcome! We are planning in this chat.', g.host), 1800)
    }
  }

  return (
    <div className="page chat">
      <TopBar
        title={isGroup ? g.title : PEOPLE[other].name}
        sub={isGroup ? `${membersOf(g, s).length} people` : undefined}
        right={<button className="iconbtn" aria-label="Chat options" onClick={() => setMenu(true)}><Icon name="more" size={22} /></button>}
      />
      {!isGroup && (
        <Link to={`/u/${other}`} className="chat-who">
          <Avatar id={other} size={32} />
          <span>{PEOPLE[other].home} · {PEOPLE[other].trips} trips</span>
          <Trust id={other} />
        </Link>
      )}

      <ol className="thread" aria-label="Messages">
        {msgs.length === 0 && <li className="sys">You joined {g?.title}. Say hello.</li>}
        {msgs.map((m) => (
          <li key={m.id} className={`msg ${m.from === 'nadia' ? 'me' : ''}`}>
            {m.from !== 'nadia' && isGroup && <Avatar id={m.from} size={28} />}
            <div>
              {m.from !== 'nadia' && isGroup && <span className="msg-who">{firstName(m.from)}</span>}
              <p>{m.text}</p>
              <span className="msg-at">{m.at}</span>
              {m.from !== 'nadia' && RISKY.test(m.text) && (
                <span className="msg-flag"><Icon name="shield" size={14} /> Keep chats in Caravan until you have met with the group. Never share payment details.</span>
              )}
            </div>
          </li>
        ))}
        <li ref={end} aria-hidden="true" />
      </ol>

      {isRequest ? (
        <div className="request-bar">
          <p><strong>{firstName(other)} is not in your groups.</strong> Their email is not verified. They cannot see that you read this.</p>
          <div className="row3">
            <button className="btn ghost small" onClick={() => setBlock(true)}>Block</button>
            <button className="btn ghost small" onClick={() => setReport(true)}>Report</button>
            <button className="btn primary small" onClick={() => { set({ accepted: [...s.accepted, other] }); notify({ text: `You can now message ${firstName(other)}.` }) }}>Accept</button>
          </div>
        </div>
      ) : (
        <form className="composer" onSubmit={submit}>
          {warn && <p className="composer-warn" role="alert"><Icon name="alert" size={16} /> This looks like a phone number or a payment. Send it anyway? Tap send again.</p>}
          <label htmlFor="msg" className="sr-only">Message</label>
          <input id="msg" placeholder="Message" value={text} onChange={(e) => { setText(e.target.value); setWarn(false) }} autoComplete="off" />
          <button className="sendbtn" aria-label="Send" disabled={!text.trim()}><Icon name="send" size={20} /></button>
        </form>
      )}

      <Sheet open={menu} onClose={() => setMenu(false)} title="Options">
        <div className="sheet-body menu">
          {isGroup ? (
            <>
              <button onClick={() => { setMenu(false); nav(`/g/${chat.group}`) }}><Icon name="info" /> Group details</button>
              {chat.group === 'kyoto' && <button onClick={() => { setMenu(false); nav('/trip/kyoto') }}><Icon name="plan" /> Trip plan</button>}
              <button onClick={() => { setMenu(false); notify({ text: 'Muted for 8 hours. You still get messages that mention you.' }) }}><Icon name="bell" /> Mute for 8 hours</button>
              <button className="danger" onClick={() => { setMenu(false); nav('/me/safety') }}><Icon name="flag" /> Report someone in this group</button>
            </>
          ) : (
            <>
              <button onClick={() => { setMenu(false); nav(`/u/${other}`) }}><Icon name="me" /> View profile</button>
              <button className="danger" onClick={() => { setMenu(false); setReport(true) }}><Icon name="flag" /> Report {firstName(other)}</button>
              <button className="danger" onClick={() => { setMenu(false); setBlock(true) }}><Icon name="block" /> Block {firstName(other)}</button>
            </>
          )}
        </div>
      </Sheet>
      {other && <ReportSheet who={other} open={report} onClose={() => setReport(false)} />}
      {other && <BlockSheet who={other} open={block} onClose={() => setBlock(false)} onDone={() => nav('/chats', { replace: true })} />}
    </div>
  )
}
