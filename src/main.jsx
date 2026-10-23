import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource-variable/noto-sans-sinhala'
import '@fontsource-variable/gemunu-libre'
import '@fontsource-variable/yaldevi'
import './base.css'
import { PortalProvider } from './store.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <PortalProvider>
        <App />
      </PortalProvider>
    </HashRouter>
  </React.StrictMode>,
)
