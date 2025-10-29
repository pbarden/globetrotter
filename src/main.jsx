import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserPreferencesProvider } from './hooks/useUserPreferences.jsx'
import './index.css'

function Main() {
  return (
    <UserPreferencesProvider>
      <App />
    </UserPreferencesProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
