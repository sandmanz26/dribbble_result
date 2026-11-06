import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOMENTS } from '../data.js'
import { useReveal } from '../App.jsx'

const TAGS = ['All', 'Dates', 'Work', 'Weddings', 'Travel', 'Everyday']

export default function Moments() {
  const [tag, setTag] = useState('All')
  const [sent, setSent] = useState(false)
  const [len, setLen] = useState(0)
  const ref = useReveal([tag])
  const list = MOMENTS.filter((m) => tag === 'All' || m.tag === tag)
  return (
    <div ref={ref} className="wrap page-pad">
      <header className="page-head"><h1 data-r>Everyone has a story.</h1><p data-r>Real moments. Real people. Some went better than others.</p></header>
      <div className="tags" role="tablist" aria-label="Moment">{TAGS.map((t) => <button key={t} role="tab" aria-selected={tag === t} onClick={() => setTag(t)}>{t}</button>)}</div>
      {list.length ? (
        <ul className="mgrid" key={tag}>{list.map((m, i) => <li key={m.t} className="mcard" data-r style={{ '--i': i }}><img src={`img/${m.img}.webp`} alt="" loading="lazy" /><span className="mtag">{m.tag}</span><p>{m.t}</p></li>)}</ul>
      ) : <p className="empty-line">No {tag.toLowerCase()} stories yet. Be the first.</p>}
      <p className="note">Cards stand in for 9:16 creator videos (muted, looping, with a pause control).</p>
      <section className="submit" aria-labelledby="sub-h">
        <h2 id="sub-h">Share your moment.</h2>
        {sent ? <p className="ok">Thank you. We read every one. Prototype: nothing was sent.</p> : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="form">
            <label className="field"><span>Name</span><input required autoComplete="name" /></label>
            <label className="field"><span>Email</span><input type="email" required autoComplete="email" /></label>
            <label className="field full"><span>Your story ({500 - len} characters left)</span><textarea required maxLength={500} rows={5} onChange={(e) => setLen(e.target.value.length)} /></label>
            <label className="field full"><span>Video (optional)</span><input type="text" placeholder="Paste a link to your clip" /></label>
            <label className="check full"><input type="checkbox" required /><span>I agree BRTH may share my story.</span></label>
            <button className="btn">Share your moment</button>
          </form>
        )}
      </section>
      <section className="ctaband in"><h2>Ready for yours?</h2><Link to="/shop" className="btn accent">Shop BRTH</Link></section>
    </div>
  )
}
