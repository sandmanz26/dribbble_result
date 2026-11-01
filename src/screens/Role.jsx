import { useNavigate } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { gafferReplies } from '../data/crewup.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, Button, IconButton, Stack, gbp } from '../ui/kit.jsx'

export default function Role() {
  const nav = useNavigate()
  const { s, crewAct, toast } = useStore()
  const bookedId = Object.entries(s.crew).find(([, v]) => v === 'booked')?.[0]

  return (
    <div className="page">
      <header className="top top--back">
        <IconButton icon={BiArrowBack} label="Back" onClick={() => nav(-1)} />
        <div>
          <h1 className="h1">Gaffer</h1>
          <p className="muted">Northlight, 30 days from 11 Jan</p>
        </div>
      </header>
      <p className="small muted">Ranked by who is free for your dates, then by who has worked with your heads of department.</p>

      <ul className="replies">
        {gafferReplies.map((r) => {
          const p = people[r.who]
          const state = s.crew[r.who]
          const disabled = r.avail === 'booked' || (bookedId && bookedId !== r.who)
          return (
            <li key={r.who} className={`reply${disabled ? ' reply--dim' : ''}`}>
              <div className="reply__head">
                <Avatar id={r.who} size={48} />
                <div className="reply__who">
                  <p className="reply__name">{p.name}</p>
                  <p className="small muted">{r.credits}</p>
                </div>
                <span className="mono">{gbp(r.rate)}</span>
              </div>
              <p className="small"><Badge tone={r.avail === 'free' ? 'free' : r.avail === 'pencil' ? 'pencil2' : 'confirmed'}>{r.avail === 'free' ? 'Free' : r.avail === 'pencil' ? 'On pencil' : 'Booked'}</Badge> {r.note}</p>
              {r.worked.length > 0 && (
                <div className="crewrow crewrow--static crewrow--tight">
                  <Stack ids={r.worked} size={24} />
                  <span className="small">Worked with {r.worked.map((w) => people[w].name.split(' ')[0]).join(', ')}</span>
                </div>
              )}
              <div className="reply__actions">
                {state === 'booked' ? (
                  <p className="small"><b>Booked.</b> Deal memo sent to {p.name.split(' ')[0]}.</p>
                ) : state === 'pencil' ? (
                  <>
                    <p className="small"><b>Pencilled.</b> {r.avail === 'pencil' ? 'You are their 2nd pencil.' : 'You are their 1st pencil.'}</p>
                    <Button size="sm" disabled={disabled} onClick={() => { crewAct(r.who, 'booked'); toast(`${p.name} booked for Northlight`) }}>Book</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" disabled={disabled} onClick={() => { crewAct(r.who, 'pencil'); toast(`${p.name.split(' ')[0]} pencilled. Their diary updates now`) }}>Pencil</Button>
                    <Button size="sm" disabled={disabled} onClick={() => { crewAct(r.who, 'booked'); toast(`${p.name} booked for Northlight`) }}>Book</Button>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
