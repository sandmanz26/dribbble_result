import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack, BiBookmark, BiSolidBookmark, BiCalendar, BiMap, BiTime, BiSend } from 'react-icons/bi'
import { jobs } from '../data/jobs.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Button, IconButton, Photo, Sheet, Stack, gbp } from '../ui/kit.jsx'
import { Fit } from './Calls.jsx'

export default function Job() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s, toggleSave, offer, withdraw, toast } = useStore()
  const [open, setOpen] = useState(false)
  const j = jobs.find((x) => x.id === id)

  if (!j) {
    return (
      <div className="page">
        <div className="empty"><p className="h3">This call has closed</p><Link to="/calls" className="link">Back to calls</Link></div>
      </div>
    )
  }

  const hod = people[j.hod]
  const sent = s.offers[j.id]
  const saved = s.saved.includes(j.id)
  const known = j.booked.filter((x) => ['june', 'ruben', 'dele', 'milo', 'noor', 'arlo'].includes(x))

  const send = () => {
    offer(j.id, j.fit === 'clash' ? 'pencil2' : 'sent')
    setOpen(false)
    toast(`Avails sent to ${hod.name.split(' ')[0]}. You will hear back here`)
  }

  return (
    <div className="page page--flush">
      <div className="hero">
        <Photo name={j.photo} className="hero__img" alt={`Set photo for ${j.title}`} />
        <div className="hero__bar">
          <IconButton icon={BiArrowBack} label="Back" className="iconbtn--float" onClick={() => nav(-1)} />
          <IconButton
            icon={saved ? BiSolidBookmark : BiBookmark}
            label={saved ? 'Remove from saved' : 'Save'}
            className="iconbtn--float"
            aria-pressed={saved}
            onClick={() => toggleSave(j.id)}
          />
        </div>
      </div>

      <div className="page__in">
        <p className="eyebrowless muted">{j.title}, {j.kind.toLowerCase()}</p>
        <h1 className="h1">{j.role}</h1>
        <p className="muted">{j.format}</p>
        <Fit job={j} offered={sent} />

        <figure className="quote">
          <blockquote>{j.pitch}</blockquote>
          <figcaption><Avatar id={j.hod} size={32} /> <span><b>{hod.name}</b>, {hod.role.toLowerCase()}</span></figcaption>
        </figure>

        <dl className="spec">
          <div><dt><BiCalendar aria-hidden="true" /> Dates</dt><dd>{j.dates} <span className="muted">({j.days} days)</span></dd></div>
          <div><dt><BiMap aria-hidden="true" /> Where</dt><dd>{j.where}</dd></div>
          <div><dt><span className="pound" aria-hidden="true">£</span> Rate</dt><dd><span className="mono">{gbp(j.rate)}</span> a day</dd></div>
          <div><dt><BiTime aria-hidden="true" /> Terms</dt><dd>{j.terms}</dd></div>
        </dl>

        {j.booked.length > 0 && (
          <section className="block">
            <h2 className="h2">Already on the crew</h2>
            <div className="crewrow crewrow--static">
              <Stack ids={j.booked} size={32} />
              <span className="crewrow__text">{known.length ? <><b>You have worked with {known.length}</b> of them</> : 'No one you know yet'}</span>
            </div>
          </section>
        )}

        <p className="small muted fine">Posted {j.posted}, {j.replies} crew have replied. Rates are samples.</p>
      </div>

      <div className="cta">
        {sent ? (
          <>
            <p className="cta__note small"><b>Avails sent</b>{sent === 'pencil2' ? ' as 2nd pencil' : ''}. Nothing is booked until they confirm.</p>
            <Button variant="ghost" onClick={() => { withdraw(j.id); toast('Avails withdrawn') }}>Withdraw</Button>
          </>
        ) : (
          <Button className="btn--block" icon={BiSend} onClick={() => setOpen(true)}>Offer my avails</Button>
        )}
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Offer your avails"
        footer={<Button className="btn--block" icon={BiSend} onClick={send}>Send to {hod.name.split(' ')[0]}</Button>}
      >
        {j.fit === 'clash' ? (
          <p>You are booked on <b>{j.clashWith}</b> until 11 Dec. You can still offer these dates as <b>2nd pencil</b>. If {j.clashWith} wraps early, you move up.</p>
        ) : (
          <p>You are free for <b>{j.dates}</b>. If {j.title} pencils you, they hold those days first and anyone after them goes on 2nd pencil.</p>
        )}
        <ul className="facts">
          <li><span className="mono">{gbp(j.rate)}</span><span>a day, as posted. You can talk rate after they pencil you</span></li>
          <li><span className="mono">1</span><span>credit list and reel shared from your profile</span></li>
        </ul>
      </Sheet>
    </div>
  )
}
