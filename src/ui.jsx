import { useEffect, useId, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LiaUndoAltSolid, LiaListOlSolid } from 'react-icons/lia'
import { catOf, jurorOf, scoreOf } from './data/awards.js'

export const photo = (key) => `photos/${key}.webp`

// The ceremony room, three ways. Used where a page needs the evening around its people.
export function Night({ caption = true }) {
  return (
    <div className="night">
      <figure data-rise><img src={photo('hall')} alt="A ceremony hall with a lit stage" width="1024" height="1024" loading="lazy" />{caption && <figcaption>The stage before the names are read</figcaption>}</figure>
      <figure data-rise><img src={photo('front-row')} alt="Guests in the front rows" width="1024" height="810" loading="lazy" />{caption && <figcaption>The front rows</figcaption>}</figure>
      <figure data-rise><img src={photo('auditorium')} alt="A full auditorium" width="1024" height="768" loading="lazy" />{caption && <figcaption>Watching from the back</figcaption>}</figure>
    </div>
  )
}

// The award's ribbon: laurel bars on paper, built from filled blocks.
export function Ribbon({ thin = false, bars = 40 }) {
  return <div className={`ribbon${thin ? ' thin' : ''}`} aria-hidden="true" data-unfurl>{Array.from({ length: bars }, (_, i) => <span key={i} style={{ '--i': i }} />)}</div>
}

// The mark: a medal ribbon cut with a V, five stripes. Proposed in the design notes as the logo refinement.
export function Mark({ size = 28 }) {
  const w = size * 0.72
  return (
    <svg width={w} height={size} viewBox="0 0 18 25" aria-hidden="true">
      <defs><clipPath id="tla-v"><path d="M0 0H18V25L9 19L0 25Z" /></clipPath></defs>
      <g clipPath="url(#tla-v)">
        <rect width="18" height="25" fill="var(--accent)" />
        <rect x="3.6" width="3.6" height="25" fill="var(--paper)" />
        <rect x="10.8" width="3.6" height="25" fill="var(--paper)" />
      </g>
    </svg>
  )
}

// Parts of each section rise in once, staggered; content is visible without script.
export function useRise() {
  const loc = useLocation()
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-rise]:not(.is-in), [data-unfurl]:not(.is-in)')]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return }
    document.documentElement.classList.add('js')
    const io = new IntersectionObserver((list) => list.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target) } }), { rootMargin: '0px 0px -6% 0px' })
    els.forEach((e) => { const sibs = [...e.parentElement.querySelectorAll(':scope > [data-rise]')]; if (e.hasAttribute('data-rise')) e.style.setProperty('--d', `${Math.max(0, sibs.indexOf(e)) * 80}ms`); io.observe(e) })
    return () => io.disconnect()
  }, [loc.pathname])
}

export function Scorecard({ w }) {
  const c = catOf(w.cat)
  const r = scoreOf(w)
  return (
    <table className="sheet">
      <caption className="sr-only">Scores for {w.name}, {c.name}</caption>
      <thead>
        <tr><th scope="col">Criterion</th><th scope="col">Weight</th>{r.jurors.map((j) => <th key={j} scope="col">{jurorOf(j).name.split(' ')[0]}</th>)}<th scope="col">Points</th></tr>
      </thead>
      <tbody>
        {c.criteria.map(([name, wt], i) => (
          <tr key={name}><td>{name}</td><td className="w">{wt}%</td>{r.jurors.map((j) => <td key={j}>{w.scores[j][i]}</td>)}<td>{((r.means[i] * wt) / 10).toFixed(1)}</td></tr>
        ))}
      </tbody>
      <tfoot><tr><td colSpan={2 + r.jurors.length}>Weighted total, out of 100</td><td>{r.total.toFixed(1)}</td></tr></tfoot>
    </table>
  )
}

// The citation card. Front: what is read on stage. Back: how the jury scored it.
export function Citation({ w, headingLevel = 3, compact = false }) {
  const [turned, setTurned] = useState(false)
  const id = useId()
  const c = catOf(w.cat)
  const r = scoreOf(w)
  const H = `h${headingLevel}`
  return (
    <article className={`cite${turned ? ' turned' : ''}`} aria-labelledby={`${id}-n`}>
      <div className="flip">
        <div className="face" inert={turned ? '' : undefined}>
          <Ribbon />
          <div className="in">
            <H id={`${id}-n`} className="name" data-title={`${w.name}, ${c.name} 2026`}><span className="cat">{c.name}, 2026</span><span className="sr-only">: </span>{w.name}</H>
            <p className="org">{w.role}, {w.company}, {w.city}</p>
            <blockquote>{w.citation[0].toUpperCase() + w.citation.slice(1)}</blockquote>
            <div className="foot-row">
              <p className="total">Jury score <b>{r.total.toFixed(1)}</b> of 100, from {r.jurors.length} jurors</p>
              <button className="turn" aria-pressed={turned} onClick={() => setTurned(true)}><LiaListOlSolid size={20} aria-hidden="true" />Read the scorecard</button>
            </div>
          </div>
        </div>
        <div className="face backside" inert={turned ? undefined : ''} aria-hidden={!turned}>
          <Ribbon thin />
          <div className="in">
            <p className="cat" style={{ fontSize: 'var(--step-lead)', letterSpacing: '-0.015em' }}>Scorecard, {c.name}</p>
            {!compact && <p className="muted" style={{ marginTop: 6 }}>Each juror scores every criterion out of 10. Points are the mean score times the weight.</p>}
            <Scorecard w={w} />
            <div className="foot-row">
              <p className="small muted">Published with the citation on 3 June 2026.</p>
              <button className="turn" onClick={() => setTurned(false)}><LiaUndoAltSolid size={20} aria-hidden="true" />Back to the citation</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
