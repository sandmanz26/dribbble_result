import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

// The globe inside the moon gate: a dotted earth that turns between Ghana and southern China and
// marks both ends of the route. Ghana in gold, China in red. Holds still with reduced motion.
const ACCRA = [5.6, -0.19], TEMA = [5.67, 0.0], GUANGZHOU = [23.13, 113.26], YIWU = [29.3, 120.07]
const toPhi = (lon) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2)

export default function Globe({ className = '', focus }) {
  const ref = useRef(null)
  const focusRef = useRef(focus)
  focusRef.current = focus
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let size = canvas.offsetWidth
    let phi = toPhi(55), theta = 0.28, t = 0
    const onResize = () => { size = canvas.offsetWidth }
    window.addEventListener('resize', onResize)
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr, width: size * dpr, height: size * dpr,
      phi, theta, dark: 1, diffuse: 1.15, mapSamples: 22000, mapBrightness: 5.2, mapBaseBrightness: 0.06,
      baseColor: [0.1, 0.36, 0.27], markerColor: [0.86, 0.66, 0.27], glowColor: [0.06, 0.26, 0.19],
      markers: [
        { location: ACCRA, size: 0.07 }, { location: TEMA, size: 0.04 },
        { location: GUANGZHOU, size: 0.07 }, { location: YIWU, size: 0.04 },
      ],
      onRender: (state) => {
        t += reduce ? 0 : 0.004
        // Drift slowly between the two ends of the route, or turn to the one being pointed at.
        const f = focusRef.current
        const target = f === 'gh' ? toPhi(0) : f === 'cn' ? toPhi(113) : toPhi(56 + Math.sin(t) * 62)
        phi += (target - phi) * (reduce ? 1 : 0.04)
        state.phi = phi
        state.theta = theta
        state.width = size * dpr
        state.height = size * dpr
      },
    })
    requestAnimationFrame(() => canvas.classList.add('is-ready'))
    return () => { globe.destroy(); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} className={`globe ${className}`} role="img" aria-label="Globe turning between Ghana and southern China" />
}
