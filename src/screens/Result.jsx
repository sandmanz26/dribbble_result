import { useMemo, useRef, useState } from 'react'
import { packList } from '../data/exercises.js'
import { dist, fmtM } from '../lib/geo.js'
import Overlay from '../ui/Overlay.jsx'
import * as I from '../ui/icons.js'

// The setup drawn on the photo: what goes where, why there, what to carry, and the controls to
// adjust it, try the other option, save it or send the picture.
export default function Result({ area, photo, cam, exercise, variant, setVariant, overrides, setOverrides, actions }) {
  const [mode, setMode] = useState('layout')
  const [moving, setMoving] = useState(false)
  const shot = useRef(null)
  const out = useMemo(() => exercise.layout(area, variant), [exercise, area, variant])
  const markers = out.markers
  const variants = exercise.options > 1
  const pack = packList(markers)
  const moved = Object.keys(overrides).length

  // One line per numbered item, with the distance a coach would pace out.
  const legend = []
  const seen = new Set()
  markers.forEach((m, i) => {
    if (!m.n || seen.has(m.n)) return
    seen.add(m.n)
    const at = overrides[i] || m.at || m.c || m.from
    const ref = area.hole || area.ball
    const d = at && ref && m.kind !== 'stick' ? dist(at, ref) : null
    const count = markers.filter((x) => x.n === m.n).length
    legend.push({ n: m.n, label: count > 1 ? `${m.label} ×${count}` : m.label, note: d && d > 0.05 ? `${fmtM(d)} from the ${area.hole ? 'hole' : 'ball'}` : m.kind === 'stick' ? '1.2 m stick, flat on the ground' : 'Start here' })
  })

  return (
    <div className="result">
      <div className="photo-wrap" ref={shot}>
        <Overlay area={area.id} photo={photo} cam={cam} markers={mode === 'layout' ? markers : []} seen={mode === 'seen'} overrides={overrides} interactive={moving}
          onMove={(i, g) => setOverrides({ ...overrides, [i]: g })} />
        {!moving && <div className="seg on-photo" role="tablist" aria-label="Show">
          <button role="tab" aria-selected={mode === 'layout'} onClick={() => setMode('layout')}><I.Layers aria-hidden="true" /> Setup</button>
          <button role="tab" aria-selected={mode === 'seen'} onClick={() => { setMode('seen'); setMoving(false) }}><I.Eye aria-hidden="true" /> What it saw</button>
        </div>}
        {moving && <p className="moving-hint"><I.Hand aria-hidden="true" /> Drag a ball, tee or cone. It stays on the ground.</p>}
      </div>

      <div className="tools">
        <button className={`tool ${moving ? 'is-on' : ''}`} aria-pressed={moving} onClick={() => { setMoving(!moving); setMode('layout') }}><I.Move aria-hidden="true" />{moving ? 'Done moving' : 'Move'}</button>
        {variants && <button className="tool" onClick={() => { setVariant(variant ? 0 : 1); setOverrides({}) }}><I.Again aria-hidden="true" />Other option</button>}
        {moved > 0 && <button className="tool" onClick={() => setOverrides({})}><I.Undo aria-hidden="true" />Undo moves</button>}
        <button className="tool" onClick={() => exportImage(shot.current, `${exercise.name}.png`)}><I.Download aria-hidden="true" />Image</button>
      </div>

      {mode === 'seen' ? (
        <section className="block">
          <h2>What the AI read from this photo</h2>
          <ul className="seen-list">{area.seen.map((x) => <li key={x.what}><span><b>{x.what}</b><small>{x.how}</small></span><span className={`sure ${x.sure === 'Sure' ? '' : 'is-est'}`}>{x.sure}</span></li>)}</ul>
          <p className="fine">Anything marked as an estimate is worth a glance on the ground before the players arrive.</p>
        </section>
      ) : (
        <>
          <section className="block">
            <h2>{exercise.name}</h2>
            <p className="goal">{exercise.goal}</p>
            <ol className="legend">{legend.map((l) => <li key={l.n}><span className="num-badge">{l.n}</span><span><b>{l.label}</b><small>{l.note}</small></span></li>)}</ol>
          </section>
          <section className="block">
            <h2>Why it is set up like this</h2>
            <ul className="why">{out.why.map((w) => <li key={w}>{w}</li>)}</ul>
            {moved > 0 && <p className="fine">You moved {moved} {moved === 1 ? 'marker' : 'markers'}. The saved setup keeps your positions.</p>}
          </section>
          <section className="block">
            <h2>Bring</h2>
            <div className="pack">{pack.map(([k, n]) => <span key={k} className="chip-pack"><b className="mono">{n}</b> {k.toLowerCase()}</span>)}</div>
          </section>
        </>
      )}
      {actions}
    </div>
  )
}

// Save what is on screen as a picture to send to players: the photo with the markers, at full size.
async function exportImage(wrap, name) {
  const img = wrap.querySelector('img'); const svg = wrap.querySelector('svg')
  if (!img || !svg) return
  const c = document.createElement('canvas'); c.width = 1200; c.height = 900
  const ctx = c.getContext('2d')
  const base = await load(img.src)
  ctx.drawImage(base, 0, 0, 1200, 900)
  const clone = svg.cloneNode(true)
  clone.setAttribute('width', 1200); clone.setAttribute('height', 900)
  const src = svg.querySelectorAll('*'); const dst = clone.querySelectorAll('*')
  src.forEach((el, i) => { const cs = getComputedStyle(el); ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'opacity', 'fill-opacity', 'font-family', 'font-size', 'font-weight', 'text-anchor', 'paint-order', 'stroke-linecap'].forEach((p) => dst[i].style.setProperty(p, cs.getPropertyValue(p))) })
  const data = new XMLSerializer().serializeToString(clone)
  const over = await load(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`)
  ctx.drawImage(over, 0, 0)
  const a = document.createElement('a'); a.download = name; a.href = c.toDataURL('image/png'); a.click()
}
const load = (src) => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src })
