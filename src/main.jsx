import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/geist'
import { StoreProvider } from './app/store.jsx'
import App from './App.jsx'
import './styles/app.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </StoreProvider>
    </MotionConfig>
  </React.StrictMode>
)
