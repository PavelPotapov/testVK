import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/app'

const root = document.getElementById('root')

if (!root) {
  throw new Error('root not found')
}

const container = createRoot(root)
container.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
