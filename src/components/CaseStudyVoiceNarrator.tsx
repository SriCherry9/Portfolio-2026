import { useEffect, useRef, useState } from 'react'

interface CaseStudyVoiceNarratorProps {
  src: string
  label?: string
}

export function CaseStudyVoiceNarrator({ src, label = 'Hear from the designer' }: CaseStudyVoiceNarratorProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(src)
    audioRef.current = audio

    const handleEnded = () => setPlaying(false)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('ended', handleEnded)
      audioRef.current = null
    }
  }, [src])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }

  return (
    <button
      className={`case-narrator-btn${playing ? ' case-narrator-btn--active' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
    >
      <span className={`case-narrator-dot${playing ? ' case-narrator-dot--speaking' : ''}`} />
      {playing ? 'Pause Walkthrough' : label}
    </button>
  )
}
