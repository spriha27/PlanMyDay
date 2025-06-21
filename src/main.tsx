// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PlanMyDayApp from './App.tsx' // Import the new main component

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlanMyDayApp />
  </StrictMode>,
)