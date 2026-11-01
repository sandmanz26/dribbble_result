import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack, BiBookmark, BiSolidBookmark } from 'react-icons/bi'
import { jobs } from '../data/jobs.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Button, Frame, HoldButton, HoldHint, IconButton, Section, gbp } from '../ui/kit.jsx'
import { Fit } from './Calls.jsx'

export default function Job() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s, toggleSave, offer, withdraw, toast } = useStore()
  const j = jobs.find((x) => x.id === id)

  if (!j) {
    return (
      <div className="page">
        <div className="empty"><p className="display display--sm">This call has wrapped</p><Link to="/calls" className="textbtn">Back to calls</Link></div>
      </div>
    )
  }

  const hod = people[j.hod]
  const sent = s.offers[j.id]
  const saved = s.saved.includes(j.id)
  const known = j.booked.filter((x) => ['june', 'ruben', 'dele', 'milo', 'noor', 'arlo'].includes(x))

  return (
    <div className="page page--flush">
      <div className="jobhero">
        <Frame name={j.photo} alt={`Set photo for ${j.title}`} className="jobhero__frame" />
        <div className="jobhero__bar">
          <IconButton icon={BiArrowBack} label="Back" onClick={() => nav(-1)} />
          <IconButton icon={saved ? BiSolidBookmark : BiBookmark} label={saved ? 'Remove from saved' : 'Save'} aria-pressed={saved} onClick={() => toggleSave(j.id)} />
        </div>
        <div className="jobhero__title">
          <p className="mono">{j.title} / {j.format}</p>
          <h1 className="display">{j.role}</h1>
        </div>
      </div>

      <div className="page__in">
        <Fit job={j} offered={sent} />
        <blockquote className="pull">
          <p>{j.pitch}</p>
          <footer><Avatar id={j.hod} size={28} /> {hod.name}, {hod.role.toLowerCase()}</footer>
        </blockquote>

        <Section no="01" title="The job" id="spec">
          <dl className="table">
            <div><dt>Dates</dt><dd>{j.dates}, {j.days} days</dd></div>
            <div><dt>Where</dt><dd>{j.where}</dd></div>
            <div><dt>Rate</dt><dd>{gbp(j.rate)} a day</dd></div>
            <div><dt>Terms</dt><dd>{j.terms}</dd></div>
          </dl>
        </Section>

        <Section no="02" title="Already on it" id="on" aside={<span className="mono">{known.length} you know</span>}>
          {j.booked.length ? (
            <div className="billing billing--page">
              {j.booked.map((x) => <p key={x}><span>{people[x].role}</span><b>{people[x].name}</b></p>)}
            </div>
          ) : <p className="row__s">Nobody booked yet. You would be one of the first.</p>}
        </Section>

        <p className="small row__s">Posted {j.posted}. {j.replies} crew replied. Rates are samples.</p>
      </div>

      <div className="cta">
        <HoldHint />
        {sent ? (
          <div className="cta__sent">
            <p className="small"><b>Avails sent{sent === 'pencil2' ? ' as 2nd pencil' : ''}.</b> Nothing is booked until they confirm.</p>
            <Button variant="line" size="sm" onClick={() => { withdraw(j.id); toast('Avails withdrawn') }}>Withdraw</Button>
          </div>
        ) : (
          <>
            <p className="cta__note small">
              {j.fit === 'clash'
                ? <>You are booked on <b>{j.clashWith}</b>. This goes in as <b>2nd pencil</b>.</>
                : <>You are free for these dates. If they pencil you, you hold them first.</>}
            </p>
            <HoldButton onDone={() => { offer(j.id, j.fit === 'clash' ? 'pencil2' : 'sent'); toast(`Avails sent to ${hod.name.split(' ')[0]}`) }}>
              Offer my avails
            </HoldButton>
          </>
        )}
      </div>
    </div>
  )
}
