import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/mona-sans/wdth.css'
import '@fontsource-variable/spline-sans-mono'
import './styles.css'
import { StoreProvider } from './store.jsx'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
)
