import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/dm-sans'
import './styles.css'
import { StoreProvider } from './store.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<React.StrictMode><HashRouter><StoreProvider><App /></StoreProvider></HashRouter></React.StrictMode>)
