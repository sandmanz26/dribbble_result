import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/big-shoulders-display'
import '@fontsource-variable/figtree'
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <App />
      </HashRouter>
    </MotionConfig>
  </React.StrictMode>
)
