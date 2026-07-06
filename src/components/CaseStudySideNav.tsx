import { useEffect, useState } from 'react'

interface CaseStudySideNavProps {
  sections: { id: string; label: string }[]
}

export function CaseStudySideNav({ sections }: CaseStudySideNavProps) {
  const [activeIndex, setActiveIndex] = useState(0)

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
    <nav className="case-toc" aria-label="Section navigation">
      {sections.map((section, index) => (
        <button
          key={section.id}
          className={`case-toc-item${index === activeIndex ? ' case-toc-item--active' : ''}`}
          onClick={() => scrollToSection(section.id)}
        >
          <span className="case-toc-dot" />
          <span className="case-toc-label">{section.label}</span>
        </button>
      ))}
    </nav>
  )
}
