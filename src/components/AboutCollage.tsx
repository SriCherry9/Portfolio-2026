interface TraitPhoto {
  src: string
  trait: string
  color: string
}

const TRAITS: TraitPhoto[] = [
  { src: '/images/about/trait-adventurous.jpg', trait: 'Adventurous', color: 'var(--card-1)' },
  { src: '/images/about/trait-funloving.jpg',   trait: 'Fun-loving',  color: 'var(--card-2)' },
  { src: '/images/about/trait-joyful.jpg',       trait: 'Joyful',     color: 'var(--card-3)' },
  { src: '/images/about/trait-curious.jpg',      trait: 'Curious',    color: 'var(--card-4)' },
  { src: '/images/about/trait-dramatic.jpg',     trait: 'A little dramatic', color: 'var(--card-5)' },
]

export function AboutCollage() {
  return (
    <div className="about-collage">
      {TRAITS.map((t, i) => (
        <div
          key={t.trait}
          className="about-photo-card"
          style={{ '--rot': `${(i % 2 === 0 ? -1 : 1) * (3 + i)}deg`, '--fallback': t.color } as React.CSSProperties}
        >
          <img
            src={t.src}
            alt={t.trait}
            className="about-photo-img"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <span className="about-photo-trait">{t.trait}</span>
        </div>
      ))}
    </div>
  )
}
