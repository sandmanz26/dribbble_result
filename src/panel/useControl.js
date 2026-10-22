import { useRef, useState } from 'react'

// Pointer, wheel and keyboard behaviour shared by every continuous control.
// Travel: 200 px of vertical drag covers the full range; Shift gives 10x finer control;
// double-click returns to the default; arrows step 1%, Page keys 10%.
export const TRAVEL_PX = 200

export function useControl({ value, onChange, def = 0, disabled }) {
  const [hover, setHover] = useState(false)
  const [drag, setDrag] = useState(false)
  const [focus, setFocus] = useState(false)
  const start = useRef(null)
  const clamp = (v) => Math.min(1, Math.max(0, v))

  const handlers = disabled
    ? {}
    : {
        onPointerEnter: () => setHover(true),
        onPointerLeave: () => setHover(false),
        onPointerDown: (e) => {
          e.preventDefault()
          e.currentTarget.setPointerCapture(e.pointerId)
          start.current = { y: e.clientY, v: value }
          setDrag(true)
        },
        onPointerMove: (e) => {
          if (!start.current) return
          // Incremental, so pressing Shift mid-drag changes speed without a jump.
          const scale = e.shiftKey ? 0.1 : 1
          const v = clamp(start.current.v + ((start.current.y - e.clientY) / TRAVEL_PX) * scale)
          start.current = { y: e.clientY, v }
          onChange(v)
        },
        onPointerUp: () => {
          start.current = null
          setDrag(false)
        },
        onPointerCancel: () => {
          start.current = null
          setDrag(false)
        },
        onDoubleClick: () => onChange(def),
        onWheel: (e) => onChange(clamp(value - Math.sign(e.deltaY) * 0.02)),
        onKeyDown: (e) => {
          const step = { ArrowUp: 0.01, ArrowRight: 0.01, ArrowDown: -0.01, ArrowLeft: -0.01, PageUp: 0.1, PageDown: -0.1 }[e.key]
          if (step !== undefined) {
            e.preventDefault()
            onChange(clamp(value + step * (e.shiftKey ? 0.1 : 1)))
          } else if (e.key === 'Home') onChange(0)
          else if (e.key === 'End') onChange(1)
          else if (e.key === 'Delete' || e.key === 'Backspace') onChange(def)
        },
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
      }

  const state = disabled ? 'dim' : drag ? 'drag' : hover ? 'hover' : 'idle'
  return { handlers, state, focus }
}
