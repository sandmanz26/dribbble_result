import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource/commit-mono/400.css'
import './index.css'
import App from './App'
import { StoreProvider } from './store'
import { TooltipProvider } from './components/ui/misc'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <StoreProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>,
)
