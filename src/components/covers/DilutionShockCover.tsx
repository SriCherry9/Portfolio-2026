import { useRef, useState } from 'react'
import '../../styles/dilution-shock-cover.css'

interface DilutionShockCoverProps {
  /** mp4 source for the prototype walkthrough. Drop the file at this path once available. */
  videoSrc?: string
  /** Optional webm source, preferred by the browser when supported. */
  videoSrcWebm?: string
}

/**
 * Standalone hover-to-play cover for the "Designing for Dilution Shock" case study.
 * Not wired into App.tsx yet — pass as a project's `coverComponent` when ready
 * (see MuseoCover / CashlessCover for the existing pattern).
 *
 * Defaults to a coded mockup of the scenario-builder UI (matching the Figma
 * cover frame) as the resting "poster" state, since no video asset exists yet.
 * On hover/focus it swaps to a looping muted video of the live prototype.
 * If the video fails to load (missing file), it silently stays on the poster.
 */
export function DilutionShockCover({
  videoSrc = '/videos/dilution-shock-prototype.mp4',
  videoSrcWebm,
}: DilutionShockCoverProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)
  const [videoAvailable, setVideoAvailable] = useState(true)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const play = () => {
    setHovering(true)
    const video = videoRef.current
    if (!video) return
    // Seeking before metadata has loaded (readyState 0) can reset the
    // element's network state in some engines — only rewind once it's safe.
    if (video.readyState >= 1) {
      video.currentTime = 0
    }
    video.play().catch(() => {
      // Autoplay can be rejected before user gesture settles — safe to ignore.
    })
  }

  const stop = () => {
    setHovering(false)
    setVideoPlaying(false)
    videoRef.current?.pause()
  }

  return (
    <div
      className="ds-cover-frame"
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      tabIndex={0}
      role="group"
      aria-label="Fundraising Scenario Tool — hover to preview the interactive prototype"
    >
      <div className="ds-cover-stage">
        <div className={`ds-cover-poster${videoPlaying ? ' ds-cover-poster--hidden' : ''}`} aria-hidden={videoPlaying}>
          <div className="ds-cover-poster-bar">
            <div className="ds-cover-poster-bar-left">
              <span className="ds-cover-poster-brand">Fundraising</span>
              <span className="ds-cover-poster-whatsnew">✦ What's New?</span>
            </div>
            <div className="ds-cover-poster-bar-right">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </div>
          </div>

          <div className="ds-cover-poster-body">
            <div className="ds-cover-poster-orb">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.8 4.9L18.5 9l-4.7 1.9L12 15l-1.8-4.1L5.5 9l4.7-1.1L12 3z" />
              </svg>
            </div>
            <p className="ds-cover-poster-heading">Let's build your first scenario</p>
            <div className="ds-cover-poster-input">
              <p className="ds-cover-poster-input-text">
                Build a scenario with post money valuation of $20M with all SAFEs and CNs converted along with an
                option pool top up of 15%
              </p>
              <div className="ds-cover-poster-input-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
                <div className="ds-cover-poster-input-actions">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4" />
                  </svg>
                  <svg className="ds-cover-poster-send" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="12" opacity="0.12" />
                    <path d="M8 12l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="ds-cover-poster-pills">
              <span className="ds-cover-poster-pill">🧩 Build</span>
              <span className="ds-cover-poster-pill">🎓 Learn</span>
              <span className="ds-cover-poster-pill">📋 Ask</span>
              <span className="ds-cover-poster-pill">📈 Sensitivity Analysis</span>
            </div>
          </div>
        </div>

        {videoAvailable && (
          <video
            ref={videoRef}
            className={`ds-cover-video${videoPlaying ? ' ds-cover-video--active' : ''}`}
            muted
            loop
            playsInline
            preload="none"
            onPlaying={() => setVideoPlaying(true)}
            onError={() => {
              setVideoAvailable(false)
              setVideoPlaying(false)
            }}
          >
            {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>

      {videoAvailable && (
        <div className={`ds-cover-hint${hovering ? ' ds-cover-hint--hidden' : ''}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Hover to preview
        </div>
      )}
    </div>
  )
}
