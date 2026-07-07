import { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'
import { Hero } from './components/Hero'
import { ProjectCard } from './components/ProjectCard'
import { GardenFooter } from './components/GardenFooter'

const PROJECTS = [
  {
    id: 0,
    dateRange: '2026',
    category: 'AI · Product Strategy',
    accentColor: '#7B68EE',
    coverImage: '/images/ai-product-strategy-cover.png',
    caseStudyPath: '/case-study/ai-product-strategy',
    company: 'INDEPENDENT',
    role: 'Lead Product Strategist',
    title: 'AI Product Strategy',
    description:
      'Strategic framework and roadmap for AI product development, focusing on user-centric design and market positioning. Comprehensive analysis of AI capabilities, competitive landscape, and product-market fit opportunities.',
    tags: ['AI', 'Strategy', 'Product Management', 'Research'],
    url: 'ai-strategy.design',
    readTime: '5 min read',
  },
  {
    id: 7,
    dateRange: '2025',
    category: 'HRI · Robot Design',
    accentColor: '#5B8CFF',
    coverImage: '/images/luna-cover.png',
    caseStudyPath: '/case-study/luna',
    company: 'INDEPENDENT',
    role: 'HRI & UX Researcher',
    title: 'Luna — Human Robot Interaction',
    description:
      'A research-driven exploration into alleviating loneliness for hospitalized in-patients through social robotics. Combined field studies, personas, and robot design to shape a companion aimed at improving mental wellbeing and recovery.',
    tags: ['HRI', 'Robot Design', 'UX Research', 'Mental Wellbeing'],
    url: 'NDA',
    readTime: '6 min read',
  },
  {
    id: 1,
    dateRange: '2025',
    category: 'Fintech · B2B SaaS',
    accentColor: '#B8E4C9',
    coverImage: '/images/cashless-cover.png',
    videoSrc: '/videos/product-tour.mov',
    caseStudyPath: '/case-study/cashless',
    locked: true,
    company: 'QAPITA',
    role: 'Lead Product Designer',
    title: 'Cashless Equity Ownership',
    description:
      'Designed the end-to-end workflow enabling employees to own equity through cashless methods. Scaled a complex fintech platform from India to global markets — applying deep systems thinking to simplify equity management for both companies and their people.',
    tags: ['B2B', 'SaaS', 'Fintech', 'Systems Thinking'],
    url: 'qapita.com',
    readTime: '7 min read',
  },
  {
    id: 2,
    dateRange: '2023 – 2024',
    category: 'B2B2C · Design System',
    accentColor: '#C4A96A',
    coverImage: '/images/museo-cover.png',
    caseStudyPath: '/case-study/museo',
    company: 'GAIAN SOLUTIONS',
    role: 'Lead Product Designer',
    title: 'Museo — Broadcast Auction Platform',
    description:
      "Designed the end-to-end product for the US market — a CES'24 Badge-winning auction platform powered by ATSC 3.0. Built a cohesive design system for a B2B2C experience that lets viewers bid on products right from where they watch.",
    tags: ['B2B2C', 'Design System', 'ATSC 3.0', "CES'24", 'TV Experience Design', 'Lean-back Experience'],
    url: 'gaian.solutions',
    readTime: '8 min read',
  },
  {
    id: 6,
    dateRange: '2022 – 2023',
    category: 'Consumer · Product Design',
    accentColor: '#840FF1',
    coverImage: '/images/incite-cover.png',
    caseStudyPath: '/case-study/incite',
    company: 'INDEPENDENT',
    role: 'Lead UX/UI Designer',
    title: 'In;cite — Ingredient Intelligence',
    description:
      'Designed an intelligent product scanner that empowers consumers to make informed choices about ingredients. A human-centered design approach to make ingredient transparency accessible to everyone.',
    tags: ['Consumer', 'Product Design', 'User Research', 'UX/UI'],
    url: 'incite.design',
    readTime: '9 min read',
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
