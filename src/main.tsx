import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Layout } from './components/Layout.tsx'
import { PlaygroundPage } from './pages/PlaygroundPage.tsx'
import { CashlessPage } from './pages/CashlessPage.tsx'
import { MuseoPage } from './pages/MuseoPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Route>
        {/* Case study pages keep their own contextual nav */}
        <Route path="/case-study/cashless" element={<CashlessPage />} />
        <Route path="/case-study/museo" element={<MuseoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
