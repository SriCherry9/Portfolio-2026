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
      {/* ── Cashless Exercise Section ── */}
      <section className="cs-slides">
        <img src="/images/cashless-slide-01.png" alt="Cashless Exercise Platform — project overview, role, platform, timeline, and scale" className="cs-slide-image" />
      </section>

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
        <img src="/images/cashless-slide-02.png" alt="Cashless Exercise settlement dashboard product screenshot" className="cs-slide-image" />
        <img src="/images/cashless-slide-03.png" alt="Context and problem — a broken equity exercise experience, and why it became a top-priority initiative" className="cs-slide-image" />
        <img src="/images/cashless-slide-04.png" alt="Problem space — pain felt by employees, admins, and the business at every layer" className="cs-slide-image" />
        <img src="/images/cashless-slide-05.png" alt="Objectives — what success looked like across product, business, and design" className="cs-slide-image" />
        <img src="/images/cashless-slide-06.png" alt="Role-based personas — designing for five distinct roles" className="cs-slide-image" />
        <img src="/images/cashless-slide-07.png" alt="Research — understanding the full reconciliation workflow, interviews, artifact analysis, and key insights" className="cs-slide-image" />
        <img src="/images/cashless-slide-08.png" alt="Define — building the configurable system across eight core flows" className="cs-slide-image" />
        <img src="/images/cashless-slide-09.png" alt="Ideate and implement — activating cashless for exercise, and creating an SPV linked to a plan with terminology tooltips" className="cs-slide-image" />
        <img src="/images/cashless-slide-10.png" alt="Ideate and implement — broker creation and charges configuration, exploring two mental models" className="cs-slide-image" />
        <img src="/images/cashless-slide-11.png" alt="Ideate and implement — enabling cashless payment for exercise, before and after redesign" className="cs-slide-image" />
        <img src="/images/cashless-slide-12.png" alt="Ideate and implement — employee exercise request flow with tentative cashless calculations" className="cs-slide-image" />
        <img src="/images/cashless-slide-13.png" alt="Ideate and implement — cashless exercise processing with multi-level, attribute-based approval" className="cs-slide-image" />
        <img src="/images/cashless-slide-14.png" alt="Ideate and implement — lot creation and management, before and after cashless" className="cs-slide-image" />
        <img src="/images/cashless-slide-15.png" alt="Design iterations — how the lot creation flow evolved" className="cs-slide-image" />
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
