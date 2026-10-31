import { useCallback, useEffect, useState } from 'react'
import { startScroll, scrollToId } from './motion.js'
import { Nav, Hero, Story, useRefreshOnLoad } from './sections/Top.jsx'
import Evening from './sections/Evening.jsx'
import { Menu, Rooms, Reviews } from './sections/Middle.jsx'
import { Reserve, Visit, OrderDrawer } from './sections/Bottom.jsx'

export default function App() {
  const [order, setOrder] = useState(false)
  const [atBooking, setAtBooking] = useState(false)
  useEffect(() => {
    // The booking bar steps aside once you are already at the booking form.
    const el = document.getElementById('reserve')
    const io = new IntersectionObserver(([e]) => setAtBooking(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => { startScroll() }, [])
  useRefreshOnLoad()
  const close = useCallback(() => setOrder(false), [])
  return (
    <>
      <a className="skip" href="#reserve" onClick={(e) => { e.preventDefault(); scrollToId('reserve') }}>Skip to booking</a>
      <Nav onOrder={() => setOrder(true)} />
      <main>
        <Hero />
        <Story />
        <Evening />
        <Menu />
        <Rooms />
        <Reviews />
        <Reserve />
        <Visit />
      </main>
      <div className={`mobile-book ${atBooking ? 'is-away' : ''}`} aria-hidden={atBooking}>
        <button className="btn btn-ghost" onClick={() => setOrder(true)}>Order</button>
        <a href="#reserve" className="btn btn-accent" onClick={(e) => { e.preventDefault(); scrollToId('reserve') }}>Book a table</a>
      </div>
      <OrderDrawer open={order} onClose={close} />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
