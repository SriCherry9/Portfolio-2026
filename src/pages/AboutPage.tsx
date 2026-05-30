import { useState } from 'react'
import { ShredderLanding } from '../components/ShredderLanding'
import { AboutSection } from '../components/AboutSection'

export function AboutPage() {
  const [shredDone, setShredDone] = useState(false)

  return (
    <>
      <AboutSection />
      {!shredDone && (
        <ShredderLanding onComplete={() => setShredDone(true)} />
      )}
    </>
  )
}
