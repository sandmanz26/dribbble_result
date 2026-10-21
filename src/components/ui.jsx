import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  IconChevronLeft, IconPhotoOff, IconStarFilled, IconStar, IconHeart, IconHeartFilled,
  IconCompass, IconCalendarEvent, IconUserCircle, IconLayoutDashboard, IconPlayerPlayFilled,
} from '@tabler/icons-react'
import { useStore } from '../app/store.jsx'

export const ICON = { size: 22, stroke: 1.6 }

// Image with reserved box, shimmer skeleton while loading and a quiet error state.
export function Img({ src, alt = '', className = '', style, eager, children }) {
  const [state, setState] = useState(src ? 'loading' : 'error')
  return (
    <div className={`img ${className}`} style={style}>
      {state !== 'error' && (
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} className={state === 'ready' ? 'ready' : ''}
          onLoad={() => setState('ready')} onError={() => setState('error')} />
      )}
      {state === 'loading' && <span className="shimmer" aria-hidden="true" />}
      {state === 'error' && <span className="fail" aria-label="Image unavailable"><IconPhotoOff size={20} stroke={1.6} /></span>}
      {children}
    </div>
  )
}

export function PlayBadge({ duration }) {
  return <span className="play"><IconPlayerPlayFilled size={12} />{duration}</span>
}

export function TopBar({ title, left, right, back = true }) {
  const nav = useNavigate()
  return (
    <header className={`topbar ${left ? 'left' : ''}`}>
      {back && !left && (
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Back"><IconChevronLeft {...ICON} /></button>
      )}
      <span className="title">{title}</span>
      {right}
    </header>
  )
}

export function Stars({ value, size = 14 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (n <= value ? <IconStarFilled key={n} size={size} /> : <IconStar key={n} size={size} stroke={1.6} />))}
    </span>
  )
}

export function Rating({ value, count }) {
  return <span className="rating num"><IconStarFilled size={13} />{value.toFixed(1)}{count != null && <span className="muted" style={{ fontWeight: 500 }}>&nbsp;({count})</span>}</span>
}

export function SaveButton({ id, className = 'save', iconSize = 22 }) {
  const { saved, toggleSaved } = useStore()
  const on = saved.includes(id)
  return (
    <button className={className} aria-pressed={on} aria-label={on ? 'Remove from saved' : 'Save creator'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaved(id) }}>
      <motion.span key={String(on)} initial={{ scale: on ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} style={{ display: 'grid' }}>
        {on ? <IconHeartFilled size={iconSize} style={{ color: 'var(--accent)' }} /> : <IconHeart size={iconSize} stroke={1.6} />}
      </motion.span>
    </button>
  )
}

export function TabBar() {
  const { user } = useStore()
  const creator = user?.role === 'creator'
  const tabs = [
    { to: '/', label: 'Discover', Icon: IconCompass, end: true },
    { to: '/bookings', label: 'Bookings', Icon: IconCalendarEvent },
    creator ? { to: '/studio', label: 'Studio', Icon: IconLayoutDashboard } : { to: '/saved', label: 'Saved', Icon: IconHeart },
    { to: '/me', label: 'Profile', Icon: IconUserCircle },
  ]
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end}>
          {({ isActive }) => (<><Icon size={24} stroke={isActive ? 2 : 1.6} />{label}</>)}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sheet({ open, onClose, children, label }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="sheet" role="dialog" aria-modal="true" aria-label={label}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
            <div className="grabber" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Toast({ show, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="empty">
      <span className="ring"><Icon size={26} stroke={1.6} /></span>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {action}
    </div>
  )
}

export function Wordmark() {
  return <span className="wordmark"><i aria-hidden="true" />Proof</span>
}

export { Link }
