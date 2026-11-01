import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiChevronRight, BiPlus, BiSend } from 'react-icons/bi'
import { board, crewProduction as cp } from '../data/crewup.js'
import { people } from '../data/people.js'
import { useStore } from '../store.jsx'
import { Avatar, Button, Frame, Section, Sheet } from '../ui/kit.jsx'

export default function CrewUp() {
  const { s, toast } = useStore()
  const [post, setPost] = useState(false)
  const gafferDone = Object.entries(s.crew).find(([, v]) => v === 'booked')
  const roles = board.flatMap((d) => d.roles)
  const filled = roles.filter((r) => r.status === 'booked').length + (gafferDone ? 1 : 0)

  return (
    <div className="page">
      <header className="mast mast--big">
        <h1 className="display">Crew up</h1>
        <p className="mast__sub">{cp.title}, {cp.kind.toLowerCase()}. {cp.dates} in {cp.where}.</p>
      </header>

      <div className="tally-big">
        <Frame name={cp.photo} small alt="" className="tally-big__frame" />
        <div className="tally-big__text"><p className="tally-big__n display"><span>{filled}</span>/{roles.length}</p>
        <p className="mono small">Roles booked</p>
        <p className="small row__s">{cp.prep}</p></div>
      </div>

      <Button variant="line" className="btn--block" icon={BiPlus} onClick={() => setPost(true)}>Post a call</Button>

      {board.map((d, i) => (
        <Section key={d.dept} no={String(i + 1).padStart(2, '0')} title={d.dept} id={`d-${d.dept}`}>
          <ol className="rows">
            {d.roles.map((r) => {
              let who = r.who
              let status = r.status
              if (r.key === 'gaffer' && gafferDone) { who = gafferDone[0]; status = 'booked' }
              const body = (
                <>
                  {who ? <Avatar id={who} size={36} /> : <span className="role__open mono" aria-hidden="true">{r.replies}</span>}
                  <span className="role__main">
                    <span className="row__t">{r.role}</span>
                    <span className="row__s">{who ? people[who].name : `${r.replies} ${r.replies === 1 ? 'reply' : 'replies'}`}</span>
                  </span>
                  <span className={`role__state mono is-${status}`}>{status === 'booked' ? 'Booked' : status === 'pencil' ? 'Pencilled' : 'Open'}</span>
                </>
              )
              return (
                <li key={r.role}>
                  {r.key ? <Link to={`/crew/${r.key}`} className="role">{body}<BiChevronRight aria-hidden="true" /></Link> : <div className="role">{body}<span aria-hidden="true" /></div>}
                </li>
              )
            })}
          </ol>
        </Section>
      ))}

      <Sheet
        open={post}
        onClose={() => setPost(false)}
        title="Post a call"
        footer={<Button variant="green" className="btn--block" icon={BiSend} onClick={() => { setPost(false); toast('Call posted to Lighting and Grip in Scotland') }}>Post to crew</Button>}
      >
        <label className="input"><span>Role</span><input defaultValue="Dolly grip" /></label>
        <label className="input"><span>Dates</span><input defaultValue="11 Jan to 19 Feb 2027" /></label>
        <label className="input"><span>Day rate</span><input defaultValue="£420" inputMode="numeric" /></label>
        <label className="input"><span>What the job is like</span><textarea rows={3} defaultValue="Long dolly moves on location in Leith. Track and a Fisher 11 on the truck." /></label>
        <p className="row__s small">Crew free for every date see it first. People on 1st pencil elsewhere can still reply as 2nd pencil.</p>
      </Sheet>
    </div>
  )
}
