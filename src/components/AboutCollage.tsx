interface CollagePhoto {
  src: string
  trait?: string
  color: string
}

const PHOTOS: CollagePhoto[] = [
  { src: '/images/about/collage-1.jpg', trait: 'Adventurous',       color: 'var(--card-1)' },
  { src: '/images/about/collage-2.jpg',                             color: 'var(--card-2)' },
  { src: '/images/about/collage-3.jpg', trait: 'Fun-loving',        color: 'var(--card-3)' },
  { src: '/images/about/collage-4.jpg',                             color: 'var(--card-4)' },
  { src: '/images/about/collage-5.jpg', trait: 'Joyful',            color: 'var(--card-5)' },
  { src: '/images/about/collage-6.jpg',                             color: 'var(--card-1)' },
  { src: '/images/about/collage-7.jpg', trait: 'Curious',           color: 'var(--card-2)' },
  { src: '/images/about/collage-8.jpg',                             color: 'var(--card-3)' },
  { src: '/images/about/collage-9.jpg', trait: 'A little dramatic', color: 'var(--card-4)' },
]

export function AboutCollage() {
  return (
    <div className="about-collage">
      {PHOTOS.map((p, i) => (
        <div
          key={i}
          className="about-photo-card"
          style={{ '--fallback': p.color } as React.CSSProperties}
        >
          <img
            src={p.src}
            alt={p.trait ?? 'A moment from my life'}
            className="about-photo-img"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          {p.trait && <span className="about-photo-trait">{p.trait}</span>}
        </div>
      ))}
    </div>
  )
}
