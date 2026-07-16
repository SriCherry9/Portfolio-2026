import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Layout } from './components/Layout.tsx'
import { PlaygroundPage } from './pages/PlaygroundPage.tsx'
import { AiProductStrategyPage } from './pages/AiProductStrategyPage.tsx'
import { CashlessPage } from './pages/CashlessPage.tsx'
import { DilutionShockPage } from './pages/DilutionShockPage.tsx'
import { IncitePage } from './pages/IncitePage.tsx'
import { MuseoPage } from './pages/MuseoPage.tsx'
import { LunaPage } from './pages/LunaPage.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { HfeInhalerPage } from './pages/HfeInhalerPage.tsx'
import { ComicStripPage } from './pages/ComicStripPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/case-study/ai-product-strategy" element={<AiProductStrategyPage />} />
          <Route path="/case-study/cashless" element={<CashlessPage />} />
          <Route path="/case-study/dilution-shock" element={<DilutionShockPage />} />
          <Route path="/case-study/incite" element={<IncitePage />} />
          <Route path="/case-study/museo" element={<MuseoPage />} />
          <Route path="/case-study/luna" element={<LunaPage />} />
          <Route path="/case-study/hfe-inhaler" element={<HfeInhalerPage />} />
          <Route path="/case-study/comic-strip" element={<ComicStripPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
