import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconX, IconChevronLeft, IconChevronRight, IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-react'
import { getCreator } from '../data/creators.js'
import { creatorMedia } from '../data/media.js'

// Full-screen portfolio viewer. Swipe or use arrows; videos show a still with
// simulated playback (the prototype has no hosted video files).
export default function Viewer() {
  const { id, index } = useParams()
  const nav = useNavigate()
  const reduce = useReducedMotion()
  const c = getCreator(id)
  const media = c ? creatorMedia(c, 960) : []
  const [i, setI] = useState(Math.min(+index || 0, media.length - 1))
  const [dir, setDir] = useState(1)
  const [playing, setPlaying] = useState(false)
  const go = (d) => { const n = i + d; if (n < 0 || n >= media.length) return; setDir(d); setI(n); setPlaying(false) }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); if (e.key === 'Escape') nav(-1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  if (!c) return null
  const m = media[i]

  return (
    <div className="viewer" role="dialog" aria-label={`${c.name} portfolio`}>
      <div className="bar">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Close"><IconX size={24} stroke={1.6} /></button>
        <span className="small num" style={{ opacity: 0.8 }}>{i + 1} of {media.length}</span>
        <span style={{ width: 44 }} />
      </div>
      <div className="stagewrap">
        <AnimatePresence initial={false} custom={dir}>
          <motion.img
            key={m.key} src={m.src} alt={`Work by ${c.name}`} custom={dir}
            initial={{ opacity: 0, x: reduce ? 0 : dir * 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : dir * -60 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.4}
            onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1) }}
          />
        </AnimatePresence>
        {m.duration && (
          <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}
            style={{ position: 'absolute', inset: 0, margin: 'auto', width: 72, height: 72, borderRadius: 99, background: 'rgb(255 255 255 / 0.16)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', color: '#fff', opacity: playing ? 0 : 1, transition: 'opacity .2s' }}>
            {playing ? <IconPlayerPauseFilled size={28} /> : <IconPlayerPlayFilled size={28} />}
          </button>
        )}
      </div>
      <div className="foot">
        {m.duration && (
          <div style={{ display: 'grid', gap: 6 }}>
            <div className="progress"><motion.i key={`${m.key}-${playing}`} initial={{ scaleX: 0 }} animate={{ scaleX: playing ? 1 : 0 }} transition={{ duration: playing ? 12 : 0, ease: 'linear' }} /></div>
            <span className="small" style={{ opacity: 0.7 }}>Video preview, {m.duration}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="icon-btn" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous" style={{ opacity: i === 0 ? 0.3 : 1 }}><IconChevronLeft size={26} stroke={1.6} /></button>
          <span style={{ fontWeight: 600 }}>{c.name}</span>
          <button className="icon-btn" onClick={() => go(1)} disabled={i === media.length - 1} aria-label="Next" style={{ opacity: i === media.length - 1 ? 0.3 : 1 }}><IconChevronRight size={26} stroke={1.6} /></button>
        </div>
      </div>
    </div>
  )
}
