// Phosphor scope, drawn entirely in code. CRT_SPEC is the single source for the widget style
// spec page, so the numbers handed to the egui developer are the ones running here.
import { useEffect, useRef } from 'react'

export const CRT_SPEC = {
  background: '#0D0A07',
  graticule: { color: 'rgba(255,178,92,0.10)', major: 'rgba(255,178,92,0.18)', divisionsX: 10, divisionsY: 6, width: 1 },
  trace: { color: '#FFB25C', width: 1.6 },
  glow: { color: 'rgba(242,98,15,0.35)', width: 6 },
  core: { color: '#FFE2BD', width: 0.6, threshold: 0.6 },
  persistence: 0.22, // alpha of the background wash each frame; lower keeps old frames longer
  gain: 1.6,
  samples: 512,
  vignette: 0.55,
  scanlines: { every: 3, alpha: 0.12 },
  idle: { amplitude: 0.015, hz: 0.6 },
}

function drawGraticule(c, w, h, s) {
  c.lineWidth = s.graticule.width
  for (let i = 1; i < s.graticule.divisionsX; i++) {
    c.strokeStyle = i === s.graticule.divisionsX / 2 ? s.graticule.major : s.graticule.color
    const x = Math.round((w * i) / s.graticule.divisionsX) + 0.5
    c.beginPath()
    c.moveTo(x, 0)
    c.lineTo(x, h)
    c.stroke()
  }
  for (let i = 1; i < s.graticule.divisionsY; i++) {
    c.strokeStyle = i === s.graticule.divisionsY / 2 ? s.graticule.major : s.graticule.color
    const y = Math.round((h * i) / s.graticule.divisionsY) + 0.5
    c.beginPath()
    c.moveTo(0, y)
    c.lineTo(w, y)
    c.stroke()
  }
}

// read() returns { samples } or null (engine stopped). Without audio the trace idles as a
// faint slow sine so the screen never looks dead.
export function Crt({ read, wear = 'mint', spec = CRT_SPEC, label = 'Signal scope' }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const c = canvas.getContext('2d')
    let raf
    let t = 0
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fit = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.max(1, Math.round(r.width * dpr))
      canvas.height = Math.max(1, Math.round(r.height * dpr))
      c.fillStyle = spec.background
      c.fillRect(0, 0, canvas.width, canvas.height)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)

    const frame = () => {
      const w = canvas.width
      const h = canvas.height
      c.globalCompositeOperation = 'source-over'
      c.fillStyle = spec.background
      c.globalAlpha = reduce ? 1 : spec.persistence
      c.fillRect(0, 0, w, h)
      c.globalAlpha = 1
      drawGraticule(c, w, h, spec)

      const data = read?.()
      const pts = []
      const n = spec.samples
      if (data) {
        // Trigger on a rising zero crossing so the trace holds still.
        const s = data.samples
        let start = 0
        for (let i = 1; i < s.length - n; i++) if (s[i - 1] < 0 && s[i] >= 0) { start = i; break }
        for (let i = 0; i < n; i++) pts.push(s[start + i] * spec.gain)
      } else {
        t += 1 / 60
        for (let i = 0; i < n; i++) pts.push(Math.sin((i / n) * Math.PI * 4 + t * spec.idle.hz * 6) * spec.idle.amplitude)
      }
      const path = () => {
        c.beginPath()
        pts.forEach((v, i) => {
          const x = (i / (n - 1)) * w
          const y = h / 2 - Math.max(-1, Math.min(1, v)) * (h * 0.42)
          i ? c.lineTo(x, y) : c.moveTo(x, y)
        })
      }
      const dpr = w / canvas.getBoundingClientRect().width || 1
      c.globalCompositeOperation = 'lighter'
      c.lineJoin = 'round'
      path()
      c.strokeStyle = spec.glow.color
      c.lineWidth = spec.glow.width * dpr
      c.stroke()
      path()
      c.strokeStyle = spec.trace.color
      c.lineWidth = spec.trace.width * dpr
      c.stroke()
      const loud = pts.reduce((m, v) => Math.max(m, Math.abs(v)), 0) > spec.core.threshold
      if (loud) {
        path()
        c.strokeStyle = spec.core.color
        c.lineWidth = spec.core.width * dpr
        c.stroke()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [read, spec])

  return (
    <div className={`crt crt-${wear}`}>
      <canvas ref={ref} role="img" aria-label={label} />
      <div className="crt-scan" aria-hidden />
      <div className="crt-glass" aria-hidden />
    </div>
  )
}
