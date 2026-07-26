import { useEffect, useRef, useState } from 'react'

interface CaseStudySideNavProps {
  sections: { id: string; label: string }[]
}

export function CaseStudySideNav({ sections }: CaseStudySideNavProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [collapsed, setCollapsed] = useState(false)
  const [tooltip, setTooltip] = useState<{ label: string; y: number } | null>(null)
  const navRef = useRef<HTMLElement>(null)

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

  const showTooltip = (e: React.MouseEvent<HTMLButtonElement>, label: string) => {
    if (!collapsed || !navRef.current) return
    const navRect = navRef.current.getBoundingClientRect()
    const itemRect = e.currentTarget.getBoundingClientRect()
    setTooltip({ label, y: itemRect.top - navRect.top + itemRect.height / 2 })
  }

  return (
    <nav ref={navRef} className={`case-toc${collapsed ? ' case-toc--collapsed' : ''}`} aria-label="Section navigation">
      <button
        className="case-toc-toggle"
        onClick={() => { setCollapsed(!collapsed); setTooltip(null) }}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand section navigation' : 'Collapse section navigation'}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      <div className="case-toc-list">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`case-toc-item${index === activeIndex ? ' case-toc-item--active' : ''}`}
            onClick={() => scrollToSection(section.id)}
            onMouseEnter={(e) => showTooltip(e, section.label)}
            onMouseLeave={() => setTooltip(null)}
            onFocus={(e) => showTooltip(e as unknown as React.MouseEvent<HTMLButtonElement>, section.label)}
            onBlur={() => setTooltip(null)}
            aria-current={index === activeIndex ? 'location' : undefined}
          >
            <span className="case-toc-dot" />
            <span className="case-toc-label">{section.label}</span>
          </button>
        ))}
      </div>
      {collapsed && tooltip && (
        <span className="case-toc-tooltip" style={{ top: tooltip.y }} role="tooltip">
          {tooltip.label}
        </span>
      )}
    </nav>
  )
}
