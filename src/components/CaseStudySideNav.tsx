import { useEffect, useState } from 'react'

interface CaseStudySideNavProps {
  sections: { id: string; label: string }[]
}

export function CaseStudySideNav({ sections }: CaseStudySideNavProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = elements.findIndex((el) => el === entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={`case-toc${collapsed ? ' case-toc--collapsed' : ''}`} aria-label="Section navigation">
      <button
        className="case-toc-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand section navigation' : 'Collapse section navigation'}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      {sections.map((section, index) => (
        <button
          key={section.id}
          className={`case-toc-item${index === activeIndex ? ' case-toc-item--active' : ''}`}
          onClick={() => scrollToSection(section.id)}
          title={collapsed ? section.label : undefined}
        >
          <span className="case-toc-dot" />
          <span className="case-toc-label">{section.label}</span>
        </button>
      ))}
    </nav>
  )
}
