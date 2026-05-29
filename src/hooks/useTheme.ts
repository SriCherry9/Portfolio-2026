import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Default is always light — user can toggle after landing
    const stored = localStorage.getItem('theme') as Theme | null
    const resolved = stored ?? 'light'
    document.documentElement.setAttribute('data-theme', resolved)
    return resolved
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return { theme, toggleTheme }
}
