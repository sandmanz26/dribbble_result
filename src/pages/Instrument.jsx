import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play } from 'iconoir-react'
import { createEngine } from '../audio/engine.js'
import { DEFAULTS } from '../data/controls.js'
import { presetById } from '../data/presets.js'
import { Plugin } from '../panel/Plugin.jsx'
import { useUi, WearPicker } from '../App.jsx'

const KEY = 'bz-session'

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY))
  } catch {
    return null
  }
}

const fromPreset = (id) => {
  const p = presetById(id) || presetById('init')
  return { presetId: p.id, values: { ...DEFAULTS, bypass: 0, ...p.values }, steps: [...p.steps], cables: p.cables.map((c) => [...c]) }
}

export default function Instrument() {
  const { wear } = useUi()
  const engine = useMemo(() => createEngine(), [])
  const [session, setSession] = useState(() => loadSession() || fromPreset('fried-tape'))
  const [running, setRunning] = useState(false)
  const [starting, setStarting] = useState(false)
  const [audioError, setAudioError] = useState(null)
  const [hatchOpen, setHatchOpen] = useState(false)
  const first = useRef(true)

  const { values, steps, cables, presetId } = session
  useEffect(() => engine.set(values), [engine, values])
  useEffect(() => engine.setSteps(steps), [engine, steps])
  useEffect(() => engine.setCables(cables), [engine, cables])
  useEffect(() => () => engine.stop(), [engine])
  useEffect(() => {
    if (first.current) { first.current = false; return }
    try { localStorage.setItem(KEY, JSON.stringify(session)) } catch {}
  }, [session])

  const modified = useMemo(() => {
    const p = fromPreset(presetId)
    return JSON.stringify([p.values, p.steps, p.cables]) !== JSON.stringify([{ ...values, bypass: 0 }, steps, cables])
  }, [presetId, values, steps, cables])

  const setValue = useCallback((id, v) => setSession((s) => ({ ...s, values: { ...s.values, [id]: v } })), [])
  const setSteps = useCallback((fn) => setSession((s) => ({ ...s, steps: typeof fn === 'function' ? fn(s.steps) : fn })), [])
  const setCables = useCallback((c) => setSession((s) => ({ ...s, cables: c })), [])

  async function toggle() {
    if (running) {
      engine.stop()
      setRunning(false)
      return
    }
    setStarting(true)
    setAudioError(null)
    try {
      await engine.start()
      setRunning(true)
    } catch (e) {
      setAudioError('This browser blocked audio. Try Chrome, Firefox or Safari, and check the tab is not muted.')
    }
    setStarting(false)
  }

  return (
    <section className="stage">
      <div className="wrap stage-bar">
        <button type="button" className={`play${running ? ' is-on' : ''}`} onClick={toggle} aria-pressed={running} disabled={starting}>
          {running ? <Pause aria-hidden /> : <Play aria-hidden />}
          <span>{starting ? 'Starting audio' : running ? 'Stop the loop' : 'Play the demo loop'}</span>
        </button>
        <div className="stage-tools">
          <span className="tool-label" id="wear-label">Wear</span>
          <WearPicker />
          <button type="button" className="text-btn" onClick={() => setHatchOpen(!hatchOpen)} aria-pressed={hatchOpen}>
            {hatchOpen ? 'Close the service hatch' : 'Open the service hatch'}
          </button>
        </div>
      </div>
      {audioError && <p className="wrap error" role="alert">{audioError}</p>}
      <p className="wrap scroll-hint">Built for a desktop plugin window. Swipe sideways to reach the whole panel.</p>
      <div className="wrap stage-plugin" role="region" aria-label="Plugin" tabIndex={-1}>
        <Plugin
          engine={engine}
          running={running}
          wear={wear}
          values={values}
          setValue={setValue}
          steps={steps}
          setSteps={setSteps}
          cables={cables}
          setCables={setCables}
          presetId={presetId}
          modified={modified}
          onPreset={(id) => setSession(fromPreset(id))}
          hatchOpen={hatchOpen}
          setHatchOpen={setHatchOpen}
        />
      </div>
      <div className="wrap hints">
        <dl>
          <div><dt>Knobs</dt><dd>Drag up or down. Hold Shift for fine moves. Double-click returns to default. Arrow keys work when focused.</dd></div>
          <div><dt>Steps</dt><dd>Click to switch a step on or off. Drag up or down on a step to set how far it pushes the target.</dd></div>
          <div><dt>Hatch</dt><dd>Click the four screws, or use the button above. Click an output jack, then an input jack, to patch. Click a patched input to pull the cable.</dd></div>
          <div><dt>Hold</dt><dd>Chaos and the three copper contacts act only while held, like touching a bent circuit.</dd></div>
        </dl>
      </div>
    </section>
  )
}
