import { useState } from 'react'
import { ShredderLanding } from '../components/ShredderLanding'
import { AboutSection } from '../components/AboutSection'

export function AboutPage() {
  const [shredderDone, setShredderDone] = useState(false)

  const handleComplete = () => {
    document.body.style.overflow = ''
    setShredderDone(true)
  }

  if (shredderDone) {
    return <AboutSection />
  }

  return <ShredderLanding onComplete={handleComplete} />
}
