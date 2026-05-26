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
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const delay = index * 0.1

  const handleCoverClick = () => {
    if (project.caseStudyPath) {
      navigate(project.caseStudyPath)
    } else if (project.videoSrc) {
      setVideoModalOpen(true)
    }
  }

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (project.caseStudyPath) {
      navigate(project.caseStudyPath)
    } else if (project.videoSrc) {
      setVideoModalOpen(true)
    }
  }

  return (
    <>
      <div
        ref={cardRef}
        className={`project-card${visible ? ' visible' : ''}`}
        style={{
          boxShadow: `0 0 0 4px ${project.accentColor}, 0 20px 60px rgba(0,0,0,0.1)`,
          transitionDelay: `${delay}s`,
        }}
      >
        {/* Pills */}
        <div className="card-pills">
          <span className="card-pill">{project.dateRange}</span>
          <span className="card-pill">{project.category}</span>
        </div>

        {/* Cover */}
        <div
          className={`card-cover${project.caseStudyPath || project.videoSrc ? ' card-cover--clickable' : ''}`}
          onClick={handleCoverClick}
          role={project.caseStudyPath || project.videoSrc ? 'button' : undefined}
          tabIndex={project.caseStudyPath || project.videoSrc ? 0 : undefined}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCoverClick()}
          aria-label={project.caseStudyPath ? `Open ${project.title} case study` : undefined}
        >
          <div className="card-cover-inner">
            {project.coverComponent ? (
              project.coverComponent
            ) : project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="card-cover-img"
              />
            ) : null}
          </div>

          {/* Play button for video-only cards */}
          {!project.caseStudyPath && project.videoSrc && (
            <div className="card-video-overlay">
              <div className="play-btn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* View case study hover overlay */}
          {project.caseStudyPath && (
            <div className="card-cs-overlay">
              <span className="card-cs-overlay-text">
                View Case Study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          )}
        </div>

        {/* Accent bar */}
        <div
          className="card-accent-bar"
          style={{ background: project.accentColor }}
        />

        {/* Info section */}
        <div className="card-info">
          <p className="card-company">{project.company} · {project.role}</p>
          <h2 className="card-title">{project.title}</h2>
          <p className="card-desc">{project.description}</p>

          <div className="card-tags">
            {project.tags.map(tag => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
          </div>

          <div className="card-footer">
            <span className="card-url">{project.url}</span>
            <a href="#" className="card-cta" onClick={handleCtaClick}>
              {project.caseStudyPath ? 'View Case Study' : 'View Project'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Video modal (non-case-study cards) */}
      {videoModalOpen && project.videoSrc && (
        <div
          className="video-modal-backdrop"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="video-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <video ref={videoRef} autoPlay controls playsInline>
              <source src={project.videoSrc} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  )
}
