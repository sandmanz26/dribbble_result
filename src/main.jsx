import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/work-sans'
import './styles.css'
import App from './App.jsx'
import { StoreProvider } from './store.jsx'

createRoot(document.getElementById('root')).render(<HashRouter><StoreProvider><App /></StoreProvider></HashRouter>)
