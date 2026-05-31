import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ShredderLanding } from '../components/ShredderLanding'
import { AboutSection } from '../components/AboutSection'

export function AboutPage() {
  const location = useLocation()
  const [shredderDone, setShredderDone] = useState(false)

  useEffect(() => {
    if ((location.state as any)?.reset) {
      setShredderDone(false)
      document.body.style.overflow = ''
    }
  }, [location.key])

  const handleComplete = () => {
    document.body.style.overflow = ''
    setShredderDone(true)
  }

  if (shredderDone) {
    return <AboutSection />
  }

  return <ShredderLanding onComplete={handleComplete} />
}
