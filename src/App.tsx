import { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'
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

export default function App() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id)
  const handleActive = useCallback((id: number) => setActiveId(id), [])
  const listRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const list = listRef.current
      const fill = lineRef.current
      if (!list || !fill) return

      const listRect = list.getBoundingClientRect()
      const dots = list.querySelectorAll<HTMLElement>('.tl-dot')
      const lefts = list.querySelectorAll<HTMLElement>('.tl-left')
      if (!dots.length) return

      // Line top anchored to first dot's centre, relative to list
      const firstDotRect = dots[0].getBoundingClientRect()
      const lineTop = firstDotRect.top - listRect.top + firstDotRect.height / 2
      fill.style.top = `${lineTop}px`

      // Line tip tracks a point 55% down the viewport
      const tipViewport = window.innerHeight * 0.55
      const tipInList = tipViewport - listRect.top
      const fillHeight = Math.max(0, Math.min(tipInList - lineTop, list.offsetHeight - lineTop))
      fill.style.height = `${fillHeight}px`

      // Reveal each year when the line tip reaches its dot
      dots.forEach((dot, i) => {
        const dotMid = dot.getBoundingClientRect().top + dot.offsetHeight / 2
        if (dotMid <= tipViewport + 12) {
          lefts[i]?.classList.add('tl-left--reached')
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Hero />
      <section id="work" className="cards-section">
        <p className="section-label">Selected Work</p>
        <div className="tl-list" ref={listRef}>
          <div className="tl-line-fill" ref={lineRef} />
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onActive={handleActive}
              activeId={activeId}
            />
          ))}
        </div>
      </section>
      <GardenFooter />
    </>
  )
}
