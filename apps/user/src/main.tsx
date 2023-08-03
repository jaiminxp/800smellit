import React from 'react'
import { createRoot } from 'react-dom/client'
import './assets/fonts/Furore.woff'
import './assets/fonts/Furore.woff2'
import './assets/fonts/Economica-Regular.woff'
import './assets/fonts/Economica-Regular.woff2'
import './assets/fonts/Galada-Regular.woff'
import './assets/fonts/Galada-Regular.woff2'
import './assets/fonts/FortySecondStreetHB.woff'
import './assets/fonts/FortySecondStreetHB.woff2'
import './styles.css'
import App from './app'
import { MemoryRouter } from 'react-router-dom'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </React.StrictMode>
)
