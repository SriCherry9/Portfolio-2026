import { useRef, useState } from 'react'
import '../../styles/dilution-shock-cover.css'

interface DilutionShockCoverProps {
  /** Poster image — the Figma cover frame export (node 2224:12137). Shown at rest and while the video loads. */
  posterSrc?: string
  /** mp4 source for the prototype walkthrough. Drop the file at this path once available. */
  videoSrc?: string
  /** Optional webm source, preferred by the browser when supported. */
  videoSrcWebm?: string
}

/**
 * Hover-to-play cover for the "Designing for Dilution Shock" case study,
 * matching the Figma cover frame (node 2224:12135). Pass as a project's
 * `coverComponent` (see App.tsx PROJECTS).
 *
 * Resting state is the real exported screenshot — export the frame from
 * Figma as PNG and drop it at the posterSrc path (default
 * /images/dilution-shock-scenario-poster.png). On hover/focus it swaps to
 * a looping muted video of the live prototype. If either asset is missing,
 * it falls back gracefully instead of showing a broken image/video.
 */
export function DilutionShockCover({
  posterSrc = '/images/dilution-shock-scenario-poster.png',
  videoSrc = '/videos/dilution-shock-prototype.mp4',
  videoSrcWebm,
}: DilutionShockCoverProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)
  const [posterAvailable, setPosterAvailable] = useState(true)
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
        {posterAvailable ? (
          <img
            src={posterSrc}
            alt="Fundraising Scenario Tool — AI-guided scenario builder"
            className={`ds-cover-poster-img${videoPlaying ? ' ds-cover-poster-img--hidden' : ''}`}
            aria-hidden={videoPlaying}
            onError={() => setPosterAvailable(false)}
          />
        ) : (
          <div className={`ds-cover-poster-fallback${videoPlaying ? ' ds-cover-poster-img--hidden' : ''}`} aria-hidden={videoPlaying} />
        )}

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
