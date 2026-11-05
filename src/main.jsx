import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource/caprasimo'
import '@fontsource-variable/gabarito'
import './styles.css'
import App from './App.jsx'
import { CartProvider } from './store.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <CartProvider><App /></CartProvider>
  </HashRouter>
)
