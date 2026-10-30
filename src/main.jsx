import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource/red-hat-text/400.css'
import '@fontsource/red-hat-text/500.css'
import '@fontsource/red-hat-text/600.css'
import '@fontsource/red-hat-text/700.css'
import '@fontsource/red-hat-mono/400.css'
import '@fontsource/red-hat-mono/500.css'
import '@fontsource/red-hat-display/700.css'
import '@fontsource/red-hat-display/900.css'
import './styles.css'
import { StoreProvider } from './store.jsx'
import { TooltipProvider } from './components/ui/tooltip.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <StoreProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </StoreProvider>
    </HashRouter>
  </StrictMode>,
)
