import { useEffect, useState } from 'react'
import { MailboxGraphic, type PeekMail } from './MailboxGraphic'

interface LetterContent {
  kind: 'letter'
  title: string
  lines: string[]
  signature: string
}

interface PostcardContent {
  kind: 'postcard'
  title: string
  frontStyle: React.CSSProperties
  from: string
  to: string
  message: string
}

interface MailPiece {
  peek: PeekMail
  content: LetterContent | PostcardContent
}

const MAIL_PIECES: MailPiece[] = [
  {
    peek: { id: 'letter-1', color: '#cda86c', rotate: -9, offset: 22, shape: 'envelope', seal: true },
    content: {
      kind: 'letter',
      title: 'For Whoever Finds This',
      lines: [
        "If you're reading this, you've wandered further into the Playground than most people bother to. Thank you for that.",
        'Everything back here started as a way to keep playing after the case studies were done — a ball pit, a dusty window, a typewriter, and now, apparently, a postbox. I never quite know where an idea is going before I start it. I just start.',
        'Hope something in here made you smile.',
      ],
      signature: '— Sri',
    },
  },
  {
    peek: { id: 'postcard-1', color: '#f4ede1', rotate: 5, offset: 40, shape: 'postcard' },
    content: {
      kind: 'postcard',
      title: 'Postcard from the Playground',
      frontStyle: {
        background: 'conic-gradient(from 0deg at 50% 50%, #ffeaa7, #fd79a8, #a29bfe, #74b9ff, #55efc4, #ffeaa7)',
      },
      from: 'Sri',
      to: 'You',
      message:
        "Every tile in this playground started as 'what if I tried—' and got a little out of hand in the best way. This postbox was the same. Glad you found it.",
    },
  },
  {
    peek: { id: 'letter-2', color: '#eef3f6', rotate: -3, offset: 56, shape: 'envelope' },
    content: {
      kind: 'letter',
      title: 'A Small Thank-You',
      lines: [
        'Most people close the tab after the first fold. You kept going.',
        "This whole site is a bit of an experiment in how much personality a portfolio can hold before it stops feeling like one. Consider this postbox the answer.",
        'Thanks for sticking around.',
      ],
      signature: '— Sri',
    },
  },
  {
    peek: { id: 'postcard-2', color: '#dfeaec', rotate: 9, offset: 72, shape: 'postcard' },
    content: {
      kind: 'postcard',
      title: 'Currently Exploring',
      frontStyle: { background: 'linear-gradient(160deg, #89f7fe 0%, #4a7bd8 55%, #1c2e6b 100%)' },
      from: 'Sri',
      to: 'You',
      message:
        'Still building, still tinkering. If you liked this corner of the site, the rest of the playground has a ball pit and a dusty window worth wiping clean too.',
    },
  },
]

export const POSTBOX_PEEKS = MAIL_PIECES.map(m => m.peek)

interface PostboxModalProps {
  onClose: () => void
}

export function PostboxModal({ onClose }: PostboxModalProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (openId) setOpenId(null)
      else onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [openId, onClose])

  const openPiece = MAIL_PIECES.find(m => m.peek.id === openId) ?? null

  return (
    <div className="pb-modal-backdrop" onClick={onClose}>
      <div className="pb-modal-content" onClick={e => e.stopPropagation()}>
        <button className="pb-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {!openPiece && (
          <>
            <div className="pb-mailbox-wrap">
              <MailboxGraphic
                peeks={MAIL_PIECES.map(m => m.peek)}
                onSelect={id => { setOpenId(id); setFlipped(false) }}
              />
            </div>
            <p className="pb-hint">Click a letter or postcard to open it</p>
          </>
        )}

        {openPiece && (
          <div className="pb-opened">
            <button className="pb-back-btn" onClick={() => setOpenId(null)}>‹ back to the postbox</button>

            {openPiece.content.kind === 'letter' && (
              <div className="pb-letter-paper">
                <p className="pb-letter-title">{openPiece.content.title}</p>
                {openPiece.content.lines.map((line, i) => (
                  <p key={i} className="pb-letter-line">{line}</p>
                ))}
                <p className="pb-letter-sign">{openPiece.content.signature}</p>
              </div>
            )}

            {openPiece.content.kind === 'postcard' && (
              <>
                <div
                  className={`pb-postcard${flipped ? ' pb-postcard-flipped' : ''}`}
                  onClick={() => setFlipped(f => !f)}
                >
                  <div className="pb-postcard-inner">
                    <div className="pb-postcard-front" style={openPiece.content.frontStyle}>
                      <span className="pb-postcard-tag">postcard</span>
                      <span className="pb-postcard-front-title">{openPiece.content.title}</span>
                    </div>
                    <div className="pb-postcard-back">
                      <p className="pb-postcard-message">{openPiece.content.message}</p>
                      <div className="pb-postcard-meta">
                        <p><span>FROM</span> {openPiece.content.from}</p>
                        <p><span>TO</span> {openPiece.content.to}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="pb-hint">Tap the postcard to flip it over</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
