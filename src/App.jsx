import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter, SiteHeader } from './pages/Chrome.jsx'
import { PrototypePanel, ProtoProvider } from './pages/PrototypePanel.jsx'
import Home from './pages/Home.jsx'
import HomeV2 from './pages/HomeV2.jsx'
import { useBrand } from './brand/BrandContext.jsx'
import Services from './pages/Services.jsx'
import ServicePage from './pages/ServicePage.jsx'
import QuoteFlow from './flows/QuoteFlow.jsx'
import Booking from './pages/Booking.jsx'
import Bookings from './pages/Bookings.jsx'
import System from './pages/System.jsx'
import Notes from './pages/Notes.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollReset() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    if (state?.scrollTo) {
      requestAnimationFrame(() => document.getElementById(state.scrollTo)?.scrollIntoView({ block: 'start' }))
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, state])
  return null
}

function HomeForStyle() {
  const { style } = useBrand()
  return style === 'v2' ? <HomeV2 /> : <Home />
}

function Site({ children }) {
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </>
  )
}

export default function App() {
  return (
    <ProtoProvider>
      <ScrollReset />
      <Routes>
        <Route path="/" element={<Site><HomeForStyle /></Site>} />
        <Route path="/services" element={<Site><Services /></Site>} />
        <Route path="/services/:id" element={<Site><ServicePage /></Site>} />
        <Route path="/quote" element={<QuoteFlow />} />
        <Route path="/quote/:step" element={<QuoteFlow />} />
        <Route path="/booking/:id" element={<Site><Booking /></Site>} />
        <Route path="/bookings" element={<Site><Bookings /></Site>} />
        <Route path="/system" element={<Site><System /></Site>} />
        <Route path="/notes" element={<Site><Notes /></Site>} />
        <Route path="*" element={<Site><NotFound /></Site>} />
      </Routes>
      <PrototypePanel />
    </ProtoProvider>
  )
}
