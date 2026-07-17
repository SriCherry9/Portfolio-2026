export interface PeekMail {
  id: string
  color: string
  rotate: number
  offset: number
  shape: 'envelope' | 'postcard'
  seal?: boolean
}

interface MailboxGraphicProps {
  peeks: PeekMail[]
  onSelect?: (id: string) => void
}

export function MailboxGraphic({ peeks, onSelect }: MailboxGraphicProps) {
  return (
    <div className="mb-box">
      <div className="mb-post" />
      <div className="mb-body">
        <div className="mb-slot" />
        {peeks.map(p => {
          const className = `mb-peek mb-peek-${p.shape}`
          const style = { background: p.color, left: `${p.offset}%`, '--mb-rot': `${p.rotate}deg` } as React.CSSProperties
          const inner = (
            <>
              {p.shape === 'postcard' && <span className="mb-peek-stripe" />}
              {p.seal && <span className="mb-peek-seal" />}
            </>
          )
          return onSelect ? (
            <button
              key={p.id}
              className={className}
              style={style}
              type="button"
              onClick={() => onSelect(p.id)}
              aria-label="Open this piece of mail"
            >
              {inner}
            </button>
          ) : (
            <div key={p.id} className={className} style={style}>{inner}</div>
          )
        })}
        <div className="mb-flag" />
      </div>
    </div>
  )
}
