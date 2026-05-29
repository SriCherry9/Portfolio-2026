import { useState, useCallback } from 'react'
import './App.css'
import { ShredderLanding } from './components/ShredderLanding'
import { RippleLanding } from './components/RippleLanding'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProjectCard } from './components/ProjectCard'
import { GardenFooter } from './components/GardenFooter'
import { CashlessCover } from './components/covers/CashlessCover'
import { MuseoCover } from './components/covers/MuseoCover'

const PROJECTS = [
  {
    id: 1,
    dateRange: '2022 – 2024',
    category: 'Fintech · B2B SaaS',
    accentColor: '#B8E4C9',
    coverComponent: <CashlessCover />,
    videoSrc: '/videos/product-tour.mov',
    caseStudyPath: '/case-study/cashless',
    company: 'QAPITA',
    role: 'Lead Product Designer',
    title: 'Cashless Equity Ownership',
    description:
      'Designed the end-to-end workflow enabling employees to own equity through cashless methods. Scaled a complex fintech platform from India to global markets — applying deep systems thinking to simplify equity management for both companies and their people.',
    tags: ['B2B', 'SaaS', 'Fintech', 'Systems Thinking'],
    url: 'qapita.com',
  },
  {
    id: 2,
    dateRange: '2023 – 2024',
    category: 'B2B2C · Design System',
    accentColor: '#C4A96A',
    coverComponent: <MuseoCover />,
    videoSrc: '/videos/product-tour.mov',
    caseStudyPath: '/case-study/museo',
    company: 'GAIAN SOLUTIONS',
    role: 'Lead Product Designer',
    title: 'Museo — Broadcast Auction Platform',
    description:
      "Designed the end-to-end product for the US market — a CES'24 Badge-winning auction platform powered by ATSC 3.0. Built a cohesive design system for a B2B2C experience that lets viewers bid on products right from where they watch.",
    tags: ['B2B2C', 'Design System', 'ATSC 3.0', 'CES 2024'],
    url: 'gaian.solutions',
  },
  {
    id: 3,
    dateRange: '2021 – 2022',
    category: 'Mobile · Consumer',
    accentColor: '#D3D872',
    coverImage: '/images/card3-cover.png',
    videoSrc: '/videos/onboarding.mov',
    company: 'INDEPENDENT',
    role: 'UX Researcher & Designer',
    title: 'Onboarding Experience Redesign',
    description:
      'Redesigned onboarding flows using mixed-methods research — contextual inquiry, usability testing, and data analysis. Achieved 40% improvement in 7-day retention and reduced time-to-value from 12 minutes to under 3.',
    tags: ['Research', 'Mobile', 'Consumer', 'Growth'],
    url: 'case-study.design',
  },
  {
    id: 4,
    dateRange: '2020 – 2021',
    category: 'Accessibility · Gov',
    accentColor: '#FFFBE6',
    videoSrc: '/videos/search.mov',
    company: 'CIVIC TECH',
    role: 'Accessibility Designer',
    title: 'Inclusive Search & Discovery',
    description:
      'Redesigned search and filtering systems for a government digital service, achieving WCAG 2.2 AA compliance. Ran inclusive usability sessions with users who have visual, motor, and cognitive disabilities.',
    tags: ['Accessibility', 'Government', 'Research', 'WCAG'],
    url: 'accessible.design',
  },
  {
    id: 5,
    dateRange: '2019 – 2020',
    category: 'Product · Strategy',
    accentColor: '#E7C1E5',
    company: 'STEALTH',
    role: 'Product Manager & Designer',
    title: 'Zero-to-One Health Platform',
    description:
      'Wore both PM and design hats to take a health-tech product from concept to beta. Defined the product strategy, led discovery research with clinicians, and shipped the MVP in 16 weeks.',
    tags: ['Health Tech', 'Strategy', '0→1', 'PM + Design'],
    url: 'NDA',
  },
]

type Phase = 'shredder' | 'ripple' | 'portfolio'

export default function App() {
  const [phase, setPhase] = useState<Phase>('shredder')

  const onShredDone  = useCallback(() => setPhase('ripple'),     [])
  const onRippleDone = useCallback(() => setPhase('portfolio'),  [])

  return (
    <>
      {/* Portfolio always mounted underneath so it's ready when curtain lifts */}
      <Header />
      <Hero />
      <section className="cards-section">
        <p className="section-label">Selected Work</p>
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </section>
      <GardenFooter />

      {/* Ripple video: pre-mounted during shredder so video is ready */}
      {(phase === 'ripple' || phase === 'shredder') && (
        <RippleLanding
          onComplete={onRippleDone}
          hidden={phase === 'shredder'}
        />
      )}

      {/* Shredder sits on top of everything; shreds to reveal ripple */}
      {phase === 'shredder' && (
        <ShredderLanding onComplete={onShredDone} />
      )}
    </>
  )
}
