import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: number
  dateRange: string
  category: string
  accentColor: string
  coverImage?: string
  coverComponent?: React.ReactNode
  videoSrc?: string
  caseStudyPath?: string
  company: string
  role: string
  title: string
  description: string
  tags: string[]
  url: string
}

interface ProjectCardProps {
  project: Project
  index: number
  onActive?: (id: number) => void
  activeId?: number
}

export function ProjectCard({ project, index, onActive, activeId }: ProjectCardProps) {
  const rowRef   = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (rowRef.current) obs.observe(rowRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!onActive) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) onActive(project.id) },
      { threshold: 0.3, rootMargin: '0px 0px -30% 0px' }
    )
    if (rowRef.current) obs.observe(rowRef.current)
    return () => obs.disconnect()
  }, [project.id, onActive])

  const year = project.dateRange.split('–').pop()?.trim() ?? project.dateRange
  const isActive = activeId === project.id

  const handleCoverClick = () => {
    if (project.caseStudyPath) navigate(project.caseStudyPath)
    else if (project.videoSrc) setVideoModalOpen(true)
  }

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (project.caseStudyPath) navigate(project.caseStudyPath)
    else if (project.videoSrc) setVideoModalOpen(true)
  }

  return (
    <>
      <div
        ref={rowRef}
        className={`tl-row${visible ? ' tl-row--visible' : ''}`}
        style={{ transitionDelay: `${index * 0.08}s` }}
      >
        {/* Left: year + dot */}
        <div className="tl-left">
          <span className={`tl-year${isActive ? ' tl-year--active' : ''}`}>{year}</span>
          <div className={`tl-dot${isActive ? ' tl-dot--active' : ''}`} />
        </div>

        {/* Right: content */}
        <div className="tl-card">
          <div className="tl-card-header">
            <div className="tl-meta">
              <span className="tl-company">{project.company}</span>
              <span className="tl-separator">·</span>
              <span className="tl-role">{project.role}</span>
            </div>
            <span className="tl-category">{project.category}</span>
          </div>

          <h2 className="tl-title">{project.title}</h2>
          <p className="tl-desc">{project.description}</p>

          <div
            className={`tl-cover${project.caseStudyPath || project.videoSrc ? ' tl-cover--clickable' : ''}`}
            style={{ '--accent': project.accentColor } as React.CSSProperties}
            onClick={handleCoverClick}
            role={project.caseStudyPath || project.videoSrc ? 'button' : undefined}
            tabIndex={project.caseStudyPath || project.videoSrc ? 0 : undefined}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCoverClick()}
          >
            <div className="tl-cover-inner">
              {project.coverComponent ? project.coverComponent
                : project.coverImage ? <img src={project.coverImage} alt={project.title} className="tl-cover-img" />
                : null}
            </div>
            {project.caseStudyPath && (
              <div className="tl-cover-overlay">
                <span>View Case Study <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
              </div>
            )}
          </div>

          <div className="tl-footer">
            <div className="tl-tags">
              {project.tags.map(tag => <span key={tag} className="tl-tag">{tag}</span>)}
            </div>
            {(project.caseStudyPath || project.videoSrc) && (
              <a href="#" className="tl-cta" onClick={handleCtaClick}>
                {project.caseStudyPath ? 'View Case Study' : 'Watch Demo'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {videoModalOpen && project.videoSrc && (
        <div className="video-modal-backdrop" onClick={() => setVideoModalOpen(false)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setVideoModalOpen(false)} aria-label="Close">✕</button>
            <video ref={videoRef} autoPlay controls playsInline>
              <source src={project.videoSrc} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  )
}
