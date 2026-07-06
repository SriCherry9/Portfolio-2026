import { useEffect, useRef, useState } from 'react'

interface CaseStudyNarratorProps {
  texts: string[]
  activeIndex: number
}

export function CaseStudyNarrator({ texts, activeIndex }: CaseStudyNarratorProps) {
  const [enabled, setEnabled] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (!supported) return

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current =
        voices.find((v) => /Google US English|Samantha|Natural/i.test(v.name) && v.lang.startsWith('en')) ??
        voices.find((v) => v.lang.startsWith('en')) ??
        voices[0] ??
        null
    }

    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [supported])

  const speak = (text: string) => {
    if (!supported || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    if (voiceRef.current) utterance.voice = voiceRef.current
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (!enabled) return
    const timer = setTimeout(() => speak(texts[activeIndex]), 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, enabled])

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported])

  const toggle = () => {
    if (enabled) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
    setEnabled(!enabled)
  }

  if (!supported) return null

  return (
    <button
      className={`case-narrator-btn${enabled ? ' case-narrator-btn--active' : ''}`}
      onClick={toggle}
      aria-pressed={enabled}
    >
      <span className={`case-narrator-dot${speaking ? ' case-narrator-dot--speaking' : ''}`} />
      {enabled ? 'Narrating' : 'AI Narration'}
    </button>
  )
}
