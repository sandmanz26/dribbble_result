import { useParams } from 'react-router-dom'
import { CgCheck, CgArrowRight } from 'react-icons/cg'
import { TYPES, UNITS } from '../data.js'
import { WLink } from '../App.jsx'
import { useReveal, useScroll } from '../motion.js'

export default function Space() {
  const { type } = useParams()
  const t = TYPES[type] || TYPES.shelf
  const free = UNITS.filter((u) => u.type === t.id && u.free)
  const others = Object.values(TYPES).filter((x) => x.id !== t.id)
  const ref = useReveal([type])
  const hero = useScroll()
  return (
    <div ref={ref}>
      <section className="sp-hero" style={{ '--c': t.colour, '--ink-c': t.ink }} ref={hero}>
        <div className="wrap sp-grid">
          <div>
            <h1>{t.name}</h1>
            <p className="sp-lede">{t.fits}</p>
            <p className="sp-price"><b>${t.from}</b> {t.unit}</p>
            <WLink to={`/tour${free[0] ? `?unit=${free[0].id}` : ''}`} colour="var(--ink)" className="btn">Book a tour<CgArrowRight aria-hidden="true" /></WLink>
          </div>
          <div className="sp-pic"><img src={`${t.img}.webp`} alt={t.name} /></div>
        </div>
      </section>
      <section className="wrap sp-body">
        <div>
          <h2 data-r>What you get</h2>
          <p className="sp-size" data-r>{t.size}</p>
          <ul className="incl">{t.incl.map((x, i) => <li key={x} data-r style={{ '--i': i }}><CgCheck aria-hidden="true" />{x}</li>)}</ul>
        </div>
        <div>
          <h2 data-r>Free right now</h2>
          <ul className="free-units">{free.map((u, i) => <li key={u.id} data-r style={{ '--i': i, '--c': t.colour }}><b>{u.id}</b>{u.m2 ? <span>{u.m2} m²</span> : null}<WLink to={`/tour?unit=${u.id}`} colour={t.colour}>Tour it</WLink></li>)}</ul>
          {!free.length && <p>Nothing free in this type today. Join the list and we will message you.</p>}
        </div>
      </section>
      <section className="wrap sp-others">
        <h2 data-r>Or take space another way</h2>
        <div className="others">{others.map((o, i) => <WLink key={o.id} to={`/spaces/${o.id}`} colour={o.colour} className="other" style={{ '--c': o.colour, '--ink-c': o.ink, '--i': i }} data-r><b>{o.name}</b><span>from ${o.from}</span></WLink>)}</div>
      </section>
    </div>
  )
}
