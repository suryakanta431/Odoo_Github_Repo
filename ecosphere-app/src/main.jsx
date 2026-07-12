import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ESGProvider } from './context/ESGContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ESGProvider>
      <App />
    </ESGProvider>
  </React.StrictMode>,
)