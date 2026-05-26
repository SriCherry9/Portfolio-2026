export function MuseoCover() {
  return (
    <div className="museo-cover">
      {/* Deep purple background */}
      <div className="museo-cover-bg" />

      {/* Spotlight cone */}
      <div className="museo-spotlight" aria-hidden="true" />

      {/* Star/diamond decorations */}
      <svg className="museo-star museo-star-br" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 0L22.5 17.5L40 20L22.5 22.5L20 40L17.5 22.5L0 20L17.5 17.5L20 0Z" fill="#C9973B" />
      </svg>
      <svg className="museo-star museo-star-sm" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" fill="#C9973B" />
      </svg>

      {/* Top text */}
      <div className="museo-cover-text">
        <p className="museo-cover-eyebrow">Art Auction</p>
        <h3 className="museo-cover-title">MUSEO</h3>
      </div>

      {/* Framed painting */}
      <div className="museo-frame-wrap">
        <div className="museo-frame">
          <div className="museo-frame-inner">
            <img
              src="/images/card1-cover.png"
              alt="Birth of Venus — Botticelli"
              className="museo-painting"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
