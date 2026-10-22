import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/public-sans'
import './styles/app.css'
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
