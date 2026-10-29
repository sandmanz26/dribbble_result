import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { areaOf } from '../data/areas.js'
import { exerciseOf } from '../data/exercises.js'
import Result from './Result.jsx'
import * as I from '../ui/icons.js'

export default function Saved() {
  const { id } = useParams()
  const { s, dispatch } = useStore()
  const nav = useNavigate()
  const x = s.setups.find((y) => y.id === id)
  const [variant, setVariant] = useState(x?.variant || 0)
  const [overrides, setOverrides] = useState(x?.overrides || {})
  if (!x) return <div className="pane"><h1>Setup not found</h1><Link className="btn" to="/">Back to setups</Link></div>
  const area = areaOf(x.area); const ex = exerciseOf(x.exercise)
  const changed = variant !== x.variant || JSON.stringify(overrides) !== JSON.stringify(x.overrides)
  return (
    <div className="flow">
      <header className="flow-top">
        <button className="icon-btn" onClick={() => nav('/')} aria-label="Back"><I.Back aria-hidden="true" /></button>
        <p className="flow-title"><b>{x.id}</b><small>{area.name}{x.group ? ` · ${x.group}` : ''} · {x.created}</small></p>
        <span />
      </header>
      {x.own && <p className="note is-warn in-flow"><I.Info aria-hidden="true" /> Your own photo stays on the phone that took it; this view uses the area’s sample photo.</p>}
      <Result area={area} photo={area.photo} cam={area.cam} exercise={ex} variant={variant} setVariant={setVariant} overrides={overrides} setOverrides={setOverrides}
        actions={(
          <div className="savebar">
            {changed ? <button className="btn is-primary is-wide" onClick={() => dispatch({ type: 'update', id: x.id, patch: { variant, overrides } })}><I.Save aria-hidden="true" /> Save changes</button>
              : <p className="fine center">Used {x.used} {x.used === 1 ? 'time' : 'times'}. Changes save to this setup.</p>}
            <button className="btn is-quiet is-wide" onClick={() => { dispatch({ type: 'remove', id: x.id }); nav('/') }}><I.Trash aria-hidden="true" /> Delete setup</button>
          </div>
        )} />
    </div>
  )
}
