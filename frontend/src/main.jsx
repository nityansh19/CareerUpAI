import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App2 from './App2.jsx'
import CloudGate from './cloud/CloudGate.jsx'
// Added: validate the cloud session before mounting the existing app.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CloudGate><App2 /></CloudGate>
    {/* Changed: refresh account data from the server on each full page load. */}
  </StrictMode>,
)
