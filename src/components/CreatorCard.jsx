import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Img, Rating, SaveButton, PlayBadge } from './ui.jsx'
import { creatorMedia } from '../data/media.js'
import { fromPrice, money } from '../data/creators.js'

const MEDIUM = { photo: 'Photo', video: 'Video', both: 'Photo and video' }

export default function CreatorCard({ c, index = 0 }) {
  const media = creatorMedia(c, 500).slice(0, 3)
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}>
      <Link to={`/creator/${c.id}`} className="ccard">
        <div className="strip">
          {media.map((m, n) => (
            <Img key={m.key} src={m.src} alt={n ? '' : `Work by ${c.name}`}>{m.duration && n === 0 && <PlayBadge duration={m.duration} />}</Img>
          ))}
        </div>
        <div className="who">
          <img className="avatar" src={c.avatar} alt="" width="44" height="44" loading="lazy" />
          <div>
            <h3>{c.name}</h3>
            <p className="line"><Rating value={c.rating} count={c.reviews} /><span>{c.title}, {c.area}</span></p>
            <p className="small muted" style={{ marginTop: 2 }}>{MEDIUM[c.medium]} from <b style={{ color: 'var(--ink)' }}>{money(fromPrice(c))}</b></p>
          </div>
          <SaveButton id={c.id} />
        </div>
      </Link>
    </motion.div>
  )
}
