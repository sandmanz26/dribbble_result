import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/schibsted-grotesk'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './styles.css'
import App from './App.jsx'
import { StoreProvider } from './store.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode><HashRouter><StoreProvider><App /></StoreProvider></HashRouter></React.StrictMode>,
)
