import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Img, Wordmark } from '../components/ui.jsx'
import { creators } from '../data/creators.js'
import { mediaSrc } from '../data/media.js'
import { useStore } from '../app/store.jsx'

const cols = [
  [['wedding', 0, 260], ['food', 0, 180], ['concert', 0, 220]],
  [['portrait', 2, 200], ['architecture', 0, 240], ['sport', 0, 210]],
]

export default function Welcome() {
  const nav = useNavigate()
  const { signUp } = useStore()
  return (
    <div className="welcome">
      <div className="mosaic" aria-hidden="true">
        {cols.map((col, c) => (
          <motion.div key={c} initial={{ y: c ? -40 : 40 }} animate={{ y: 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
            {col.map(([cat, i, h]) => <Img key={cat + i} src={mediaSrc(cat, i, 500)} style={{ height: h }} eager />)}
          </motion.div>
        ))}
      </div>
      <div className="copy">
        <Wordmark />
        <h1>Hire the person behind the photos you love.</h1>
        <p className="muted">Browse {creators.length} vetted photographers and videographers in London, see real prices and book in minutes.</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          <button className="btn light block" onClick={() => nav('/signup')}>Create an account</button>
          <button className="btn block" style={{ background: 'rgb(246 246 244 / 0.12)', color: '#f6f6f4' }}
            onClick={() => { signUp({ name: null, email: null, role: 'client', guest: true }); nav('/') }}>
            Browse as a guest
          </button>
        </div>
      </div>
    </div>
  )
}
