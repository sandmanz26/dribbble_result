import { useState } from 'react'
import { Download } from 'iconoir-react'
import { useUi, WearPicker } from '../App.jsx'
import { ASSETS, fileName } from '../data/assets.js'
import { WEAR, WEAR_LABEL } from '../data/controls.js'

const LAYERED = ['knob-lg', 'knob-md', 'knob-sm', 'selector', 'momentary']
const src = (a, wear, scale) => `sprites/${a.id}/${fileName(a.id, wear, scale)}`

// Shows one cell of the real exported sheet, so the strip is proven, not described.
function Scrubber({ a, wear }) {
  const [frame, setFrame] = useState(Math.floor(a.frames / 2))
  const [col, setCol] = useState(0)
  if (a.frames === 1 && a.states.length === 1) {
    return <img className="scrub-img" src={src(a, wear, 2)} width={a.w} height={a.h} alt={`${a.title}, ${wear}`} loading="lazy" />
  }
  const scale = 1
  return (
    <div className="scrub">
      <div
        className="scrub-view"
        role="img"
        aria-label={`${a.title}, frame ${frame + 1} of ${a.frames}, ${a.states[col]}`}
        style={{
          width: a.w * scale,
          height: a.h * scale,
          backgroundImage: `url(${src(a, wear, 2)})`,
          backgroundSize: `${a.w * a.states.length * scale}px ${a.h * a.frames * scale}px`,
          backgroundPosition: `-${col * a.w * scale}px -${frame * a.h * scale}px`,
        }}
      />
      {a.frames > 1 && (
        <label className="scrub-range">
          <span className="mono small">Frame {String(frame + 1).padStart(2, '0')} / {a.frames}</span>
          <input type="range" min={0} max={a.frames - 1} value={frame} onChange={(e) => setFrame(Number(e.target.value))} />
        </label>
      )}
      {a.states.length > 1 && (
        <div className="seg seg-sm" role="radiogroup" aria-label="State column">
          {a.states.map((s, i) => (
            <button key={s} type="button" role="radio" aria-checked={col === i} className={col === i ? 'is-on' : ''} onClick={() => setCol(i)}>{s}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Assets() {
  const { wear } = useUi()
  return (
    <section className="page wrap">
      <div className="page-head">
        <h1 className="h-lg">Production assets</h1>
        <p className="lede">PNG sprite sheets at @1x and @2x for each wear stage, layered SVG sources for the rotating parts, and a layout file with every control position. Rendered from the same components as the live panel, so nothing drifts between design and build.</p>
        <div className="row">
          <a className="btn btn-accent" href="sprites/layout.json" download><Download /> layout.json</a>
          <a className="btn" href="sprites/manifest.json" download><Download /> manifest.json</a>
          <span className="tool-label">Preview wear</span>
          <WearPicker />
        </div>
      </div>

      <div className="rule two">
        <h2 className="h-md">How the sheets work</h2>
        <ul className="dash">
          <li>Rows are frames, top to bottom. Columns are states, left to right, in the order listed for each sheet.</li>
          <li>Frame for a value: <code>round(value * (frames - 1))</code>. Column for a state: its index in the list.</li>
          <li>Cells are centred on the control's pivot. Place the cell centre on the x and y from <code>layout.json</code>; multiply by 2 for @2x.</li>
          <li>Silkscreen, scales and labels live on the panel background, so knob strips only carry the knob, the value arc and the hover ring.</li>
          <li>Files are 256-colour PNGs with alpha (libimagequant, dithered). Re-export with <code>scripts/export-assets.mjs</code> and <code>scripts/optimize-png.py</code>.</li>
        </ul>
      </div>

      <div className="sheets">
        {ASSETS.map((a) => (
          <article key={a.id} className="sheet-row rule">
            <div className="sheet-info">
              <h2 className="h-sm">{a.title}</h2>
              <p className="muted small">{a.note}</p>
              <dl className="specs mono">
                <div><dt>Cell</dt><dd>{a.w} x {a.h} px @1x</dd></div>
                <div><dt>Frames</dt><dd>{a.frames}</dd></div>
                <div><dt>States</dt><dd>{a.states.join(', ')}</dd></div>
              </dl>
            </div>
            <Scrubber a={a} wear={wear} />
            <div className="files">
              {WEAR.map((w) => (
                <div key={w} className="file-row">
                  <span className="small">{WEAR_LABEL[w]}</span>
                  <a href={src(a, w, 1)} download className="mono small">@1x</a>
                  <a href={src(a, w, 2)} download className="mono small">@2x</a>
                  {LAYERED.includes(a.id) && <a href={`sprites/${a.id}/${a.id}-${w}.svg`} download className="mono small">SVG layers</a>}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
