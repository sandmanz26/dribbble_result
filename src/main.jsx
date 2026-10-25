import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/besley'
import '@fontsource-variable/besley/wght-italic.css'
import '@fontsource-variable/hanken-grotesk'
import './styles.css'
import { Store } from './store.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Store>
        <App />
      </Store>
    </HashRouter>
  </React.StrictMode>,
)
