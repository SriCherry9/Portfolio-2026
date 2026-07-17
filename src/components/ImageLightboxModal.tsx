import { useEffect } from 'react'

interface ImageLightboxModalProps {
  src: string
  alt: string
  onClose: () => void
}

export function ImageLightboxModal({ src, alt, onClose }: ImageLightboxModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="ib-modal-backdrop" onClick={onClose}>
      <div className="ib-modal-content" onClick={e => e.stopPropagation()}>
        <button className="ib-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <img src={src} alt={alt} className="ib-modal-img" />
      </div>
    </div>
  )
}
