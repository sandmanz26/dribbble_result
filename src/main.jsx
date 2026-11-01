import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sofia-sans-extra-condensed'
import '@fontsource-variable/sofia-sans'
import '@fontsource-variable/azeret-mono'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
