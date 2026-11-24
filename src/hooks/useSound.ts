import { useState } from 'react'
import { isXyloSoundEnabled, setXyloSoundEnabled } from '../utils/xyloSound'

/** Controls the site-wide xylophone sound (letter hovers, project-open arpeggio).
 *  Mirrors useTheme's shape — local state backed by the persisted utility state. */
export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(isXyloSoundEnabled)

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev
      setXyloSoundEnabled(next)
      return next
    })
  }

  return { soundEnabled, toggleSound }
}
