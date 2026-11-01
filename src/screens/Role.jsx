import { useNavigate } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { gafferReplies } from '../data/crewup.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Button, HoldButton, HoldHint, IconButton, gbp } from '../ui/kit.jsx'

const availText = { free: 'Free', pencil: 'On pencil', booked: 'Booked' }

export default function Role() {
  const nav = useNavigate()
  const { s, crewAct, toast } = useStore()
  const bookedId = Object.entries(s.crew).find(([, v]) => v === 'booked')?.[0]

  return (
    <div className="page">
      <header className="mast mast--back">
        <IconButton icon={BiArrowBack} label="Back" onClick={() => nav(-1)} />
        <p className="mono small">Northlight / Lighting</p>
      </header>
      <h1 className="display">Gaffer</h1>
      <p className="mast__sub">30 days from 11 Jan. Ranked by who is free for your dates, then by who has worked with your heads of department.</p>
      <HoldHint />

      <ol className="replies">
        {gafferReplies.map((r, i) => {
          const p = people[r.who]
          const state = s.crew[r.who]
          const disabled = r.avail === 'booked' || Boolean(bookedId && bookedId !== r.who)
          return (
            <li key={r.who} className={`reply${disabled ? ' is-dim' : ''}${state === 'booked' ? ' is-booked' : ''}`}>
              <span className="reply__rank mono">{String(i + 1).padStart(2, '0')}</span>
              <div className="reply__body">
                <div className="reply__head">
                  <Avatar id={r.who} size={44} />
                  <div>
                    <p className="reply__name">{p.name}</p>
                    <p className="mono small"><b className={`avail-${r.avail}`}>{availText[r.avail]}</b> {r.note}</p>
                  </div>
                  <span className="mono reply__rate">{gbp(r.rate)}</span>
                </div>
                <p className="row__s small">{r.credits}{r.worked.length ? `. Worked with ${r.worked.map((w) => people[w].name.split(' ')[0]).join(', ')}` : ''}</p>
                <div className="reply__acts">
                  {state === 'booked' ? (
                    <p className="mono small"><b>Booked.</b> Deal memo sent to {p.name.split(' ')[0]}.</p>
                  ) : (
                    <>
                      {state === 'pencil'
                        ? <p className="mono small"><b>Pencilled</b> as {r.avail === 'pencil' ? '2nd' : '1st'}</p>
                        : <Button variant="line" size="sm" disabled={disabled} onClick={() => { crewAct(r.who, 'pencil'); toast(`${p.name.split(' ')[0]} pencilled. Their diary updates now`) }}>Pencil</Button>}
                      <HoldButton disabled={disabled} className="hold--sm" onDone={() => { crewAct(r.who, 'booked'); toast(`${p.name} booked for Northlight`) }}>Book</HoldButton>
                    </>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
