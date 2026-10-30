import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Frame, W, H } from '../engine/gfx.js'

// One canvas per device screen. Draws a Frame at 1x and lets CSS scale it with
// nearest-neighbour, so every panel pixel stays a crisp square.
const Screen = forwardRef(function Screen({ scale = 2, render, overlay, className = '', label }, ref) {
  const canvas = useRef()
  const over = useRef()
  const frame = useRef(new Frame())
  const image = useRef()

  useImperativeHandle(ref, () => ({
    paint(fn) {
      const ctx = canvas.current.getContext('2d')
      if (!image.current) image.current = ctx.createImageData(W, H)
      fn(frame.current)
      const stats = frame.current.present(image.current)
      ctx.putImageData(image.current, 0, 0)
      if (over.current) {
        const o = over.current.getContext('2d')
        o.clearRect(0, 0, W * 2, H * 2)
        if (overlay && stats.box) {
          o.strokeStyle = '#33e0ff'
          o.lineWidth = 2
          o.setLineDash([4, 3])
          o.strokeRect(stats.box.x * 2 + 1, stats.box.y * 2 + 1, stats.box.w * 2 - 2, stats.box.h * 2 - 2)
        }
      }
      return stats
    },
    canvas: () => canvas.current,
  }))

  return (
    <div className={`screen ${className}`} style={{ width: W * scale, height: H * scale }} role="img" aria-label={label}>
      <canvas ref={canvas} width={W} height={H} />
      <canvas ref={over} width={W * 2} height={H * 2} className="overlay" aria-hidden="true" />
    </div>
  )
})

export default Screen

// Static render helper for gallery pages.
export function StaticScreen({ draw, scale = 1, label }) {
  const ref = useRef()
  useEffect(() => { ref.current.paint(draw) }, [draw])
  return <Screen ref={ref} scale={scale} label={label} />
}
