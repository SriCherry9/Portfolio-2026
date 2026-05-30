import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { ShredderLanding } from './ShredderLanding'

export function Layout() {
  const [shredderKey, setShredderKey] = useState(0)
  const location = useLocation()

  // Only show the shredder on the home page
  const showShredder = location.pathname === '/'

  return (
    <>
      <Header onAboutClick={() => setShredderKey(k => k + 1)} />
      <Outlet />
      {showShredder && (
        <ShredderLanding
          key={shredderKey}
          onComplete={() => { document.body.style.overflow = '' }}
        />
      )}
    </>
  )
}
