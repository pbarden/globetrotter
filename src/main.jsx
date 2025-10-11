import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobeSystem from './systems/multi-globe/GlobeSystem.jsx'
import { LoadingScreen } from './components/LoadingScreen.jsx'
import './index.css'

// Feature flag: set to true to use multi-globe system, false for original App
const USE_MULTI_GLOBE = true

function Main() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        USE_MULTI_GLOBE ? (
          <GlobeSystem onReady={() => console.log('Multi-globe system ready')} />
        ) : (
          <App />
        )
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
