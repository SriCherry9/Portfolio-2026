import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: number
  dateRange: string
  category: string
  accentColor: string
  coverImage?: string
  /** Autoplaying, looping, muted cover video — rendered edge-to-edge exactly like coverImage. */
  coverVideo?: string
  /** Optional webm source, preferred by the browser when supported. */
  coverVideoWebm?: string
  /** When 'contain', the cover video letterboxes to show its full frame instead of cropping to fill. */
  coverVideoFit?: 'cover' | 'contain'
  coverComponent?: React.ReactNode
  /** Set when coverComponent already renders its own hover interaction (e.g. hover-to-play video),
   *  so the card's default "View Case Study" dark overlay doesn't cover it. */
  coverHasOwnHover?: boolean
  videoSrc?: string
  caseStudyPath?: string
  company: string
  role: string
  title: string
  description: string
  tags: string[]
  cesLogo?: string
  url: string
  readTime?: string
  locked?: { password: string; storageKey: string }
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
  const [lockCursor, setLockCursor] = useState<{ x: number; y: number } | null>(null)
  const [pwPromptOpen, setPwPromptOpen] = useState(false)
  const [pwValue, setPwValue] = useState('')
  const [pwError, setPwError] = useState(false)
  const pwInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleLockMouseMove = (e: React.MouseEvent) => {
    if (!project.locked) return
    if ((e.target as HTMLElement).closest('.tl-cta')) {
      setLockCursor(null)
      return
    }
    setLockCursor({ x: e.clientX, y: e.clientY })
  }
  const handleLockMouseLeave = () => setLockCursor(null)

  const isUnlocked = () => {
    if (!project.locked) return true
    try {
      return localStorage.getItem(project.locked.storageKey) === 'true'
    } catch {
      return false
    }
  }

  useEffect(() => {
    if (pwPromptOpen) pwInputRef.current?.focus()
  }, [pwPromptOpen])

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

  const goToCaseStudy = () => {
    if (project.caseStudyPath) {
      if (project.caseStudyPath.startsWith('http')) {
        window.open(project.caseStudyPath, '_blank', 'noopener,noreferrer')
      } else {
        navigate(project.caseStudyPath)
      }
    } else if (project.videoSrc) setVideoModalOpen(true)
  }

  const handleActivate = () => {
    if (project.locked && !isUnlocked()) {
      setPwValue('')
      setPwError(false)
      setPwPromptOpen(true)
      return
    }
    goToCaseStudy()
  }

  const handleCoverClick = () => handleActivate()

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleActivate()
  }

  const handlePwSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!project.locked) return
    if (pwValue === project.locked.password) {
      try {
        localStorage.setItem(project.locked.storageKey, 'true')
      } catch {
        // localStorage unavailable — unlock still holds for this navigation
      }
      setPwPromptOpen(false)
      goToCaseStudy()
    } else {
      setPwError(true)
      setPwValue('')
    }
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
        <div
          className={`tl-card${project.locked ? ' tl-card--locked' : ''}`}
          onMouseMove={handleLockMouseMove}
          onMouseLeave={handleLockMouseLeave}
        >
          <div className="tl-card-header">
            <div className="tl-meta">
              {project.url && project.url !== 'NDA' ? (
                <a
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tl-company tl-company--link"
                  onClick={e => e.stopPropagation()}
                >
                  {project.company}
                </a>
              ) : (
                <span className="tl-company">{project.company}</span>
              )}
              <span className="tl-separator">·</span>
              <span className="tl-role">{project.role}</span>
            </div>
            <span className="tl-category">
              {project.category}
              {project.readTime && <span className="tl-readtime"> · {project.readTime}</span>}
            </span>
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
                : project.coverVideo ? (
                  <video
                    className={`tl-cover-img${project.coverVideoFit === 'contain' ? ' tl-cover-img--contain' : ''}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    {project.coverVideoWebm && <source src={project.coverVideoWebm} type="video/webm" />}
                    <source src={project.coverVideo} type="video/mp4" />
                  </video>
                )
                : project.coverImage ? <img src={project.coverImage} alt={project.title} className="tl-cover-img" />
                : null}
            </div>
            {project.caseStudyPath && !project.locked && !project.coverHasOwnHover && (
              <div className="tl-cover-overlay">
                <span>View Case Study <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
              </div>
            )}
          </div>

          <div className="tl-footer">
            <div className="tl-tags">
              {project.cesLogo && <img src={project.cesLogo} alt="CES Logo" className="tl-tag-logo" />}
              {project.tags.map(tag => <span key={tag} className="tl-tag">{tag}</span>)}
            </div>
            {(project.caseStudyPath || project.videoSrc) && (
              <a href="#" className="tl-cta" onClick={handleCtaClick}>
                {project.locked ? 'Enter password to View' : project.caseStudyPath ? 'View Case Study' : 'Watch Demo'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {project.locked && lockCursor && (
        <div className="tl-lock-cursor" style={{ left: lockCursor.x, top: lockCursor.y }}>
          password required to read<span className="tl-lock-cursor-caret" />
        </div>
      )}

      {pwPromptOpen && project.locked && (
        <div className="pw-modal-backdrop" onClick={() => setPwPromptOpen(false)}>
          <div className="pw-gate-card pw-modal-card" onClick={e => e.stopPropagation()}>
            <button className="pw-modal-close" onClick={() => setPwPromptOpen(false)} aria-label="Close">✕</button>
            <div className="pw-gate-lock">🔒</div>
            <h2 className="pw-gate-title">{project.title} is password protected</h2>
            <p className="pw-gate-desc">Enter the password to view this project.</p>
            <form className="pw-gate-form" onSubmit={handlePwSubmit}>
              <input
                ref={pwInputRef}
                type="password"
                className={`pw-gate-input${pwError ? ' pw-gate-input--error' : ''}`}
                value={pwValue}
                onChange={e => { setPwValue(e.target.value); setPwError(false) }}
                placeholder="Password"
                autoComplete="off"
              />
              <button type="submit" className="pw-gate-submit">Unlock</button>
            </form>
            {pwError && <p className="pw-gate-error">Incorrect password — try again.</p>}
          </div>
        </div>
      )}

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
