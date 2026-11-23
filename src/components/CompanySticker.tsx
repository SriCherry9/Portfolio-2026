interface CompanyStickerProps {
  logoSrc: string
  company: string
}

/**
 * A small sticker bearing the company's real logo, sitting right before the
 * company name. Its only interaction is a peel: on hover, the sticker's top
 * corner lifts about a quarter of the way, as if someone were about to pull
 * it off, then settles back down.
 */
export function CompanySticker({ logoSrc, company }: CompanyStickerProps) {
  return (
    <span className="company-sticker" aria-hidden="true" title={company}>
      <img src={logoSrc} alt="" className="company-sticker-img" />
      <span className="company-sticker-peel" />
    </span>
  )
}
