import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Trip from './pages/Trip.jsx'
import Post from './pages/Post.jsx'
import Journal from './pages/Journal.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import SubscribePage from './pages/SubscribePage.jsx'
import Credits from './pages/Credits.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/trip/:slug" element={<Trip />} />
          <Route path="/trip/:slug/:postId" element={<Post />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
