import './App.css'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProjectCard } from './components/ProjectCard'
import { GardenFooter } from './components/GardenFooter'

const PROJECTS = [
  {
    id: 1,
    dateRange: '2022 – Present',
    category: 'Web · Enterprise SaaS',
    accentColor: '#D2D2FF',
    coverImage: '/images/card1-cover.png',
    videoSrc: '/videos/product-tour.mov',
    company: 'SUDOZI',
    role: 'Founding Designer',
    title: 'Procurement Orchestration Platform',
    description:
      'Designed end-to-end procurement workflows that reduced approval cycles by 60%. Led UX strategy from 0→1, building a design system and establishing the visual language for a complex enterprise product.',
    tags: ['Enterprise', 'SaaS', 'B2B', 'Design Systems'],
    url: 'sudozi.com',
  },
  {
    id: 2,
    dateRange: '2023 – 2024',
    category: 'AI · Productivity',
    accentColor: '#ADD6F7',
    coverImage: '/images/card2-cover.png',
    videoSrc: '/videos/ask-hanzo.mov',
    company: 'HANZO',
    role: 'Lead Product Designer',
    title: 'AI-Powered Workflow Assistant',
    description:
      'Designed the core conversation interface and proactive suggestion system for an AI assistant that learns team workflows. Focused on trust, transparency, and progressive disclosure of AI capabilities.',
    tags: ['AI/ML', 'Productivity', 'B2B', 'Conversational UI'],
    url: 'hanzo.ai',
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
    coverImage: undefined,
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
    coverImage: undefined,
    videoSrc: undefined,
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
  return (
    <>
      <Header />
      <Hero />

      <section className="cards-section">
        <p className="section-label">Selected Work</p>
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </section>

      <GardenFooter />
    </>
  )
}
