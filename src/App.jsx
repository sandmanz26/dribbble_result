import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Trip from './pages/Trip.jsx'
import Post from './pages/Post.jsx'
import Journal from './pages/Journal.jsx'
import SubscribePage from './pages/SubscribePage.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // HashRouter owns the hash, so only reset scroll on route change.
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/trip/:slug" element={<Trip />} />
          <Route path="/trip/:slug/:postId" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
