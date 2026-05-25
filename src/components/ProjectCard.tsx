import { useEffect, useRef, useState } from 'react'

interface Project {
  id: number
  dateRange: string
  category: string
  accentColor: string
  coverImage?: string
  videoSrc?: string
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
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

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

        {/* Dark cover with video placeholder */}
        <div
          className="card-cover"
          onClick={() => project.videoSrc && setModalOpen(true)}
          style={{ cursor: project.videoSrc ? 'pointer' : 'default' }}
        >
          <div className="card-cover-inner">
            {project.coverImage && (
              <img
                src={project.coverImage}
                alt={project.title}
                className="card-cover-img"
              />
            )}
          </div>
          {project.videoSrc && (
            <div className="card-video-overlay">
              <div className="play-btn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
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
            <a href="#" className="card-cta">
              View Case Study
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Video modal */}
      {modalOpen && project.videoSrc && (
        <div
          className="video-modal-backdrop"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="video-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="video-modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <video
              autoPlay
              controls
              playsInline
            >
              <source src={project.videoSrc} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  )
}
