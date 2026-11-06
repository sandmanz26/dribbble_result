import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// A canvas of soft mist particles. burst() sprays from a point; fill() sets a steady haze (0 to 1).
const Mist = forwardRef(function Mist({ tint = '#c8f04b', className = '' }, ref) {
  const cv = useRef(null)
  const st = useRef({ parts: [], haze: 0, raf: 0, tint })
  st.current.tint = tint

  useEffect(() => {
    const c = cv.current, g = c.getContext('2d')
    const size = () => { const r = c.getBoundingClientRect(); c.width = r.width * devicePixelRatio; c.height = r.height * devicePixelRatio }
    size(); addEventListener('resize', size)
    const loop = () => {
      const s = st.current
      g.clearRect(0, 0, c.width, c.height)
      if (s.haze > 0) { g.fillStyle = `rgba(246,245,241,${s.haze})`; g.fillRect(0, 0, c.width, c.height) }
      s.parts = s.parts.filter((p) => p.life > 0)
      for (const p of s.parts) {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.vy *= 0.985; p.r += p.gr; p.life -= p.decay
        const a = Math.max(0, p.life) * p.a
        g.beginPath(); g.fillStyle = p.c.replace('A', a.toFixed(3)); g.arc(p.x, p.y, p.r, 0, Math.PI * 2); g.fill()
      }
      s.raf = s.parts.length || s.haze ? requestAnimationFrame(loop) : 0
    }
    st.current.kick = () => { if (!st.current.raf) st.current.raf = requestAnimationFrame(loop) }
    return () => { cancelAnimationFrame(st.current.raf); removeEventListener('resize', size) }
  }, [])

  useImperativeHandle(ref, () => ({
    burst(xf, yf, n = 180, power = 1) {
      const c = cv.current, s = st.current, d = devicePixelRatio
      const t = s.tint, rgb = [parseInt(t.slice(1, 3), 16), parseInt(t.slice(3, 5), 16), parseInt(t.slice(5, 7), 16)]
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.4
        const sp = (1.5 + Math.random() * 5) * power * d
        const mix = Math.random() < 0.8 ? [255, 255, 255] : rgb
        s.parts.push({ x: xf * c.width, y: yf * c.height, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.5 * d, r: (1 + Math.random() * 3) * d, gr: (0.15 + Math.random() * 0.5) * d * power, life: 1, decay: 0.008 + Math.random() * 0.012, a: 0.25 + Math.random() * 0.35, c: `rgba(${mix[0]},${mix[1]},${mix[2]},A)` })
      }
      s.kick()
    },
    haze(v) { st.current.haze = Math.max(0, Math.min(1, v)); st.current.kick() },
  }), [])

  return <canvas ref={cv} className={`mist ${className}`} aria-hidden="true" />
})
export default Mist
