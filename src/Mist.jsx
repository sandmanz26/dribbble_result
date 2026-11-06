import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// A canvas of soft mist particles.
// burst(x, y, n, power, dir): x and y are 0 to 1 of the canvas. dir: 'out' sprays toward the viewer
// (expands in every direction and grows), 'left' or 'right' sprays across the screen, 'up' is a small puff.
// haze(v) sets a steady veil (0 to 1); clear(speed) lets the veil thin out on its own.
const Mist = forwardRef(function Mist({ tint = '#d9f5e3', className = '' }, ref) {
  const cv = useRef(null)
  const st = useRef({ parts: [], haze: 0, fade: 0, raf: 0, tint })
  st.current.tint = tint

  useEffect(() => {
    const c = cv.current, g = c.getContext('2d')
    const size = () => { const r = c.getBoundingClientRect(); c.width = Math.max(1, r.width * devicePixelRatio); c.height = Math.max(1, r.height * devicePixelRatio) }
    size(); addEventListener('resize', size)
    const loop = () => {
      const s = st.current
      g.clearRect(0, 0, c.width, c.height)
      if (s.fade) { s.haze = Math.max(0, s.haze - s.fade); if (!s.haze) s.fade = 0 }
      if (s.haze > 0) { g.fillStyle = `rgba(246,245,241,${s.haze})`; g.fillRect(0, 0, c.width, c.height) }
      s.parts = s.parts.filter((p) => p.life > 0)
      for (const p of s.parts) {
        p.x += p.vx; p.y += p.vy; p.vx *= p.drag; p.vy = p.vy * p.drag - p.lift; p.r += p.gr; p.life -= p.decay
        g.globalAlpha = Math.max(0, p.life) * p.a
        g.drawImage(p.t ? s.spT : s.spW, p.x - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4)
      }
      g.globalAlpha = 1
      s.raf = s.parts.length || s.haze ? requestAnimationFrame(loop) : 0
    }
    // Soft round sprites (white and tinted): mist has no hard edge.
    const sprite = (rgb) => { const o = document.createElement('canvas'); o.width = o.height = 64; const x = o.getContext('2d'); const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.45, `rgba(${rgb},.55)`); gr.addColorStop(1, `rgba(${rgb},0)`); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return o }
    st.current.spW = sprite('255,255,255')
    st.current.sprite = sprite
    st.current.kick = () => { if (!st.current.raf) st.current.raf = requestAnimationFrame(loop) }
    return () => { cancelAnimationFrame(st.current.raf); removeEventListener('resize', size) }
  }, [])

  useImperativeHandle(ref, () => ({
    burst(xf, yf, n = 180, power = 1, dir = 'up') {
      const c = cv.current, s = st.current, d = devicePixelRatio
      const t = s.tint
      if (s.spTint !== t) { s.spT = s.sprite([1, 3, 5].map((i) => parseInt(t.slice(i, i + 2), 16)).join(',')); s.spTint = t }
      const base = { up: -Math.PI / 2, left: Math.PI + 0.12, right: -0.12 }[dir]
      const out = dir === 'out'
      for (let i = 0; i < n; i++) {
        const ang = out ? Math.random() * Math.PI * 2 : base + (Math.random() - 0.5) * (dir === 'up' ? 2.4 : 0.9)
        const sp = (out ? 1.5 + Math.random() * 10 : 2 + Math.random() * 7) * power * d
        s.parts.push({
          x: xf * c.width, y: yf * c.height, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * (out ? 0.8 : 1),
          r: (1 + Math.random() * 2.5) * d, gr: (out ? 0.2 + Math.random() * 0.5 : 0.2 + Math.random() * 0.6) * d * Math.min(2.4, power),
          drag: out ? 0.955 : 0.982, lift: 0.004 * d, life: 1, decay: 0.007 + Math.random() * 0.012, a: out ? 0.14 + Math.random() * 0.3 : 0.28 + Math.random() * 0.4,
          t: Math.random() > 0.8,
        })
      }
      s.kick()
    },
    haze(v) { st.current.haze = Math.max(0, Math.min(1, v)); st.current.fade = 0; st.current.kick() },
    clear(speed = 0.012) { st.current.fade = speed; st.current.kick() },
  }), [])

  return <canvas ref={cv} className={`mist ${className}`} aria-hidden="true" />
})
export default Mist
