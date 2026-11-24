import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import { unlockXyloAudio } from '../utils/xyloSound'

export function Layout() {
  // Hoverable-xylophone text (headline, project titles, name, footer) needs a
  // real user gesture to unlock Web Audio, which a bare hover doesn't count as.
  // Registered once here, at the routed-page level, so it covers every route —
  // not just the pages that happen to render the hero.
  useEffect(() => {
    const unlock = () => unlockXyloAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
    </>
  )
}
