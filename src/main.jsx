import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/stack-sans-headline'
import '@fontsource-variable/stack-sans-text'
import './site.css'
import './app.css'
import { Prices, Store } from './store.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Store>
        <Prices>
          <App />
        </Prices>
      </Store>
    </HashRouter>
  </React.StrictMode>,
)
