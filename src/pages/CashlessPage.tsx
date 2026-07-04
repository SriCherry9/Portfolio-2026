import { useEffect, useRef, useState } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'

export function CashlessPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setVideoPlaying(true)
      } else {
        videoRef.current.pause()
        setVideoPlaying(false)
      }
    }
  }

  return (
    <div className="cs-page cs-cashless-design">
      {/* ── Video Section ── */}
      <section className="cs-design-video-section">
        <div className="cs-design-video-inner">
          <div className="cs-section-tag">Product Walkthrough</div>
          <h2 className="cs-section-title">See it in action</h2>
          <p className="cs-section-desc">
            A walkthrough of the Cashless Exercise settlement flow — from request initiation to shares issued.
          </p>
          <div className="cs-video-wrap" onClick={handlePlayVideo}>
            <video
              ref={videoRef}
              className="cs-video"
              playsInline
              onEnded={() => setVideoPlaying(false)}
              poster="/images/card1-cover.png"
            >
              <source src="/videos/product-tour.mov" type="video/mp4" />
            </video>
            {!videoPlaying && (
              <div className="cs-video-overlay">
                <button className="cs-play-btn" aria-label="Play video">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <span className="cs-video-hint">Watch the product demo</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Case Study Slides ── */}
      <section className="cs-slides">
        <img
          src="/images/cashless-slide-overview.png"
          alt="Cashless Exercise Platform case study overview — problem, research, roles, workflow, and system design"
          className="cs-slide-image"
        />
        <img
          src="/images/cashless-slide-constraints-metrics.png"
          alt="How constraints shaped the design, and the metrics framework used to measure success"
          className="cs-slide-image"
        />
        <img
          src="/images/cashless-slide-results-next-steps.png"
          alt="Results, lessons learnt, and areas of future improvement"
          className="cs-slide-image"
        />
      </section>

      <CaseStudyFooter
        nextPath="/case-study/museo"
        nextTitle="Museo — Broadcast Auction Platform"
        nextCover="/images/museo-cover.png"
      />
    </div>
  )
}
