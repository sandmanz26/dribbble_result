import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource/shippori-mincho-b1/400.css'
import '@fontsource/zen-kaku-gothic-new/400.css'
import '@fontsource/zen-kaku-gothic-new/500.css'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<HashRouter><App /></HashRouter>)
