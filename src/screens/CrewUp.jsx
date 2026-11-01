import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiChevronRight, BiPlus, BiSend } from 'react-icons/bi'
import { board, crewProduction as cp } from '../data/crewup.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, Button, Photo, Sheet } from '../ui/kit.jsx'

export default function CrewUp() {
  const { s, toast } = useStore()
  const [post, setPost] = useState(false)
  const gafferDone = Object.entries(s.crew).find(([, v]) => v === 'booked')
  const roles = board.flatMap((d) => d.roles)
  const filled = roles.filter((r) => r.status === 'booked').length + (gafferDone ? 1 : 0)

  return (
    <div className="page">
      <header className="top">
        <div>
          <h1 className="h1">Crew up</h1>
          <p className="muted">{cp.title}, {cp.kind.toLowerCase()}</p>
        </div>
      </header>

      <section className="prod prod--big">
        <Photo name={cp.photo} small className="prod__img" alt="" />
        <div className="prod__text">
          <p className="prod__title">{cp.dates}</p>
          <p className="small muted">{cp.where}. {cp.prep}</p>
        </div>
        <div className="prod__bar" role="img" aria-label={`${filled} of ${roles.length} roles booked`}>
          <span style={{ width: `${(filled / roles.length) * 100}%` }} />
        </div>
        <p className="small prod__count"><span className="mono">{filled}</span> of <span className="mono">{roles.length}</span> roles booked</p>
      </section>

      <Button className="btn--block" variant="ghost" icon={BiPlus} onClick={() => setPost(true)}>Post a call</Button>

      {board.map((d) => (
        <section key={d.dept} className="block" aria-labelledby={`d-${d.dept}`}>
          <h2 id={`d-${d.dept}`} className="h2">{d.dept}</h2>
          <ul className="roles">
            {d.roles.map((r) => {
              let who = r.who
              let status = r.status
              if (r.key === 'gaffer' && gafferDone) { who = gafferDone[0]; status = 'booked' }
              const body = (
                <>
                  {who ? <Avatar id={who} size={40} /> : <span className="role__open" aria-hidden="true"><BiPlus /></span>}
                  <div className="role__text">
                    <p className="role__name">{r.role}</p>
                    <p className="small muted">{who ? people[who].name : `${r.replies} ${r.replies === 1 ? 'reply' : 'replies'}`}</p>
                  </div>
                  <Badge tone={status === 'booked' ? 'confirmed' : status === 'pencil' ? 'pencil1' : 'open'}>
                    {status === 'booked' ? 'Booked' : status === 'pencil' ? 'Pencilled' : 'Open'}
                  </Badge>
                </>
              )
              return (
                <li key={r.role}>
                  {r.key ? <Link to={`/crew/${r.key}`} className="role">{body}<BiChevronRight aria-hidden="true" /></Link> : <div className="role">{body}</div>}
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <Sheet
        open={post}
        onClose={() => setPost(false)}
        title="Post a call"
        footer={<Button className="btn--block" icon={BiSend} onClick={() => { setPost(false); toast('Call posted to Lighting and Grip in Scotland') }}>Post to crew</Button>}
      >
        <label className="input"><span>Role</span><input defaultValue="Dolly grip" /></label>
        <label className="input"><span>Dates</span><input defaultValue="11 Jan to 19 Feb 2027" /></label>
        <label className="input"><span>Day rate</span><input defaultValue="£420" inputMode="numeric" /></label>
        <label className="input"><span>What the job is like</span><textarea rows={3} defaultValue="Long dolly moves on location in Leith. Track and a Fisher 11 on the truck." /></label>
        <p className="small muted">Crew who are free for every date see it first. People on 1st pencil elsewhere can still reply as 2nd pencil.</p>
      </Sheet>
    </div>
  )
}
