import { useState, type FormEvent, type ReactNode } from 'react'

interface PasswordGateProps {
  password: string
  storageKey: string
  title?: string
  children: ReactNode
}

export function PasswordGate({ password, storageKey, title = 'This case study is password protected', children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === 'true'
    } catch {
      return false
    }
  })
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value === password) {
      try {
        localStorage.setItem(storageKey, 'true')
      } catch {
        // localStorage unavailable — unlock still holds for this session
      }
      setUnlocked(true)
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="pw-gate">
      <div className="pw-gate-card">
        <div className="pw-gate-lock">🔒</div>
        <h1 className="pw-gate-title">{title}</h1>
        <p className="pw-gate-desc">Enter the password to view this project.</p>
        <form className="pw-gate-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className={`pw-gate-input${error ? ' pw-gate-input--error' : ''}`}
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            autoComplete="off"
          />
          <button type="submit" className="pw-gate-submit">Unlock</button>
        </form>
        {error && <p className="pw-gate-error">Incorrect password — try again.</p>}
      </div>
    </div>
  )
}
