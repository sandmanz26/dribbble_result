import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/public-sans'
import '@fontsource-variable/ibm-plex-sans/wdth.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/app.css'
import './styles/v2.css'
import { BrandProvider } from './brand/BrandContext.jsx'
import { DraftProvider } from './flows/draft.jsx'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <BrandProvider>
        <DraftProvider>
          <App />
        </DraftProvider>
      </BrandProvider>
    </HashRouter>
  </React.StrictMode>,
)
