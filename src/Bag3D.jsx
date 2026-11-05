import { useEffect, useRef, useState } from 'react'
import { AiOutlineDrag } from 'react-icons/ai'
import { reduced } from './motion.js'

// The bag as a real 3D object. One model: the paper is tinted per coffee and the label is redrawn for it.
let loading = null
const hasWebGL = () => {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  // model-viewer expects linear colour; a light gamma lift keeps the paper close to the swatch
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.pow(v / 255, 2.2) * 0.98).concat(1)
}

// The label is drawn per coffee on a canvas and wrapped onto the round sticker of the model.
let cherryImg = null
const cherry = () => cherryImg || (cherryImg = new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'img/cherry.webp' }))
async function drawLabel(c) {
  await document.fonts?.ready
  const cv = document.createElement('canvas'); cv.width = cv.height = 512
  const g = cv.getContext('2d')
  g.fillStyle = '#fbf5ea'; g.fillRect(0, 0, 512, 512)
  g.strokeStyle = c.colour; g.lineWidth = 26; g.beginPath(); g.arc(256, 256, 236, 0, Math.PI * 2); g.stroke()
  const img = await cherry()
  if (img) g.drawImage(img, 196, 70, 120, 120)
  g.fillStyle = '#2b1b14'; g.textAlign = 'center'
  const [a, ...b] = c.name.split(' ')
  g.font = '64px Caprasimo'; g.fillText(a, 256, 262)
  g.font = '40px Caprasimo'; g.fillText(b.join(' '), 256, 312)
  g.font = '600 26px "Gabarito Variable", sans-serif'; g.fillText(`${c.origin.toUpperCase()} · ${c.roast.toUpperCase()}`, 256, 370)
  g.font = '500 24px "Gabarito Variable", sans-serif'; g.fillStyle = '#6b5647'; g.fillText('RIPE COFFEE CO.', 256, 420)
  return cv.toDataURL('image/png')
}

export default function Bag3D({ coffee, yaw = 0, interactive = false, auto = false, label = true, hint = false, className = '', vt }) {
  const mv = useRef(null)
  const [lib, setLib] = useState(false)
  const [ready, setReady] = useState(false)
  const [can] = useState(() => hasWebGL())

  useEffect(() => {
    if (!can) return
    loading = loading || import('@google/model-viewer')
    loading.then(() => setLib(true)).catch(() => {})
  }, [can])

  useEffect(() => {
    const el = mv.current
    if (!lib || !el) return
    const onLoad = () => {
      setReady(true)
    }
    el.addEventListener('load', onLoad)
    if (el.loaded) onLoad()
    return () => el.removeEventListener('load', onLoad)
  }, [lib])

  useEffect(() => {
    const el = mv.current
    if (!ready || !el?.model) return
    let live = true
    const mats = el.model.materials
    mats.find((m) => m.name === 'paper')?.pbrMetallicRoughness.setBaseColorFactor(rgb(coffee.colour))
    const lab = mats.find((m) => m.name === 'label')
    if (lab && label) {
      drawLabel(coffee).then((url) => el.createTexture(url)).then((tex) => { if (live) lab.pbrMetallicRoughness.baseColorTexture.setTexture(tex) }).catch(() => {})
    }
    return () => { live = false }
  }, [ready, coffee.id]) // eslint-disable-line

  useEffect(() => {
    const el = mv.current
    if (el && ready && yaw) el.cameraOrbit = `${(-yaw).toFixed(1)}deg 82deg 105%`
  }, [yaw, ready])

  return (
    <div className={`bag3d ${ready ? 'is-ready' : ''} ${className}`} style={{ '--c': coffee.colour, viewTransitionName: vt }}>
      <img className="bag3d-poster" src={`img/${coffee.img}.webp`} alt="" width="720" height="900" />
      {lib && (
        <model-viewer
          ref={mv}
          src="3d/bag.glb"
          alt={`${coffee.name} bag, a 3D model you can turn`}
          camera-orbit="0deg 82deg 105%"
          field-of-view="26deg"
          shadow-intensity="1"
          shadow-softness="0.9"
          exposure="1.05"
          environment-image="neutral"
          interaction-prompt="none"
          disable-zoom=""
          disable-pan=""
          {...(interactive ? { 'camera-controls': '' } : {})}
          {...(auto && !reduced() ? { 'auto-rotate': '', 'auto-rotate-delay': '0', 'rotation-per-second': '18deg' } : {})}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
        </model-viewer>
      )}
      {hint && ready && interactive && <span className="bag3d-hint"><AiOutlineDrag aria-hidden="true" />Drag to turn the bag</span>}
    </div>
  )
}
