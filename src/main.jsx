import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initTracking } from './analytics'

// Pixels load before the first paint, and do nothing when no ids are set.
initTracking()

// The pages come prerendered, so attach to that markup instead of replacing it.
const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App initialPath={window.location.pathname} />
  </React.StrictMode>
)
if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
