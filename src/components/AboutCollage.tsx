import { useRef } from 'react'

interface CollagePhoto {
  type: 'image'
  src: string
  trait?: string
  color: string
  size?: 'lg'
}

interface CollageVideo {
  type: 'video'
  src: string
  trait?: string
  color: string
  size?: 'lg'
}

type CollageItem = CollagePhoto | CollageVideo

const ITEMS: CollageItem[] = [
  { type: 'video', src: '/videos/about/skydive',         trait: 'Adventurous',       color: 'var(--card-1)', size: 'lg' },
  { type: 'image', src: '/images/about/ferrari-f1.jpg',  trait: 'Thrill-seeking',    color: 'var(--card-2)', size: 'lg' },
  { type: 'image', src: '/images/about/casino-night.jpg', trait: 'Fun-loving',       color: 'var(--card-2)' },
  { type: 'video', src: '/videos/about/fireworks',       trait: 'Joyful',            color: 'var(--card-3)' },
  { type: 'image', src: '/images/about/georgia-viewpoint.jpg', trait: 'Curious',     color: 'var(--card-4)' },
  { type: 'image', src: '/images/about/perfume-shop.jpg', trait: 'A little dramatic', color: 'var(--card-5)' },
  { type: 'video', src: '/videos/about/sandboarding',    trait: 'Fearless',          color: 'var(--card-1)', size: 'lg' },
  { type: 'image', src: '/images/about/cave-hike.jpg',   trait: 'Free-spirited',     color: 'var(--card-2)' },
  { type: 'video', src: '/videos/about/immersive-art',   trait: 'Playful',           color: 'var(--card-3)' },
  { type: 'image', src: '/images/about/basketball.jpg', trait: 'Competitive',        color: 'var(--card-4)' },
  { type: 'image', src: '/images/about/ice-cream.jpg',   trait: 'Easily amused',     color: 'var(--card-5)' },
  { type: 'video', src: '/videos/about/night-serve',    trait: 'Determined',         color: 'var(--card-1)', size: 'lg' },
  { type: 'video', src: '/videos/about/disco-mirror',    trait: 'Whimsical',         color: 'var(--card-2)' },
  { type: 'video', src: '/videos/about/concert',         trait: 'Spirited',          color: 'var(--card-3)' },
  { type: 'video', src: '/videos/about/aquarium-shark',  trait: 'Wide-eyed',         color: 'var(--card-4)' },
  { type: 'image', src: '/images/about/fjord-boat.jpg',  trait: 'Grounded',          color: 'var(--card-5)' },
]

function VideoTile({ item }: { item: CollageVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const play = () => videoRef.current?.play()
  const reset = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <video
      ref={videoRef}
      className="about-photo-img"
      poster={`${item.src}-poster.jpg`}
      muted
      loop
      playsInline
      preload="metadata"
      onMouseEnter={play}
      onMouseLeave={reset}
      onTouchStart={play}
    >
      <source src={`${item.src}.mp4`} type="video/mp4" />
      <source src={`${item.src}.webm`} type="video/webm" />
    </video>
  )
}

export function AboutCollage() {
  return (
    <div className="about-collage">
      {ITEMS.map((item, i) => (
        <div
          key={i}
          className={`about-photo-card${item.size === 'lg' ? ' about-photo-card--lg' : ''}`}
          style={{ '--fallback': item.color } as React.CSSProperties}
        >
          {item.type === 'image' ? (
            <img
              src={item.src}
              alt={item.trait ?? 'A moment from my life'}
              className="about-photo-img"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <VideoTile item={item} />
          )}
          {item.trait && <span className="about-photo-trait">{item.trait}</span>}
        </div>
      ))}
    </div>
  )
}
