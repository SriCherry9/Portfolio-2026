import { useEffect, useRef } from 'react'
import { playFontTick } from '../utils/scrollTick'

export interface RevealSegment {
  text: string
  strong?: boolean
}

interface Word {
  text: string
  strong: boolean
}

/** Tokenizes a run of segments into words, carrying each word's "strong" flag
 *  through from whichever segment(s) it overlaps — so bold phrases that span
 *  multiple words keep their emphasis after re-tokenizing. */
function buildWords(segments: RevealSegment[]): Word[] {
  let full = ''
  const strongRanges: [number, number][] = []
  for (const seg of segments) {
    const start = full.length
    full += seg.text
    if (seg.strong) strongRanges.push([start, start + seg.text.length])
  }
  const words: Word[] = []
  const re = /\S+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(full))) {
    const wStart = m.index
    const wEnd = wStart + m[0].length
    const strong = strongRanges.some(([s, e]) => wStart < e && wEnd > s)
    words.push({ text: m[0], strong })
  }
  return words
}

/** Blend window, in words, over which a word fades from 0 → 1 opacity. */
const REVEAL_WINDOW = 3
/** How far below the viewport top the "reading line" sits — where words finish revealing. */
const READING_LINE_FRAC = 0.58
const MAX_TICKS_PER_FRAME = 4

interface ScrollRevealParagraphProps {
  segments?: RevealSegment[]
  text?: string
  className?: string
  soundEnabled?: boolean
}

/**
 * A paragraph whose words fade in opacity as the page scrolls, brightening in
 * reading order (left-to-right, top-to-bottom) as the text crosses a "reading
 * line" partway down the viewport — and ticking a soft synthesized sound per
 * word as it reveals, mimicking the feel of hearing letters type themselves in.
 */
export function ScrollRevealParagraph({ segments, text, className, soundEnabled = true }: ScrollRevealParagraphProps) {
  const words = buildWords(segments ?? (text ? [{ text }] : []))
  const pRef = useRef<HTMLParagraphElement>(null)
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([])
  const lastFrontRef = useRef(0)
  const tickingRef = useRef(false)
  const firstRunRef = useRef(true)

  useEffect(() => {
    const update = () => {
      tickingRef.current = false
      const el = pRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const readingLine = window.innerHeight * READING_LINE_FRAC
      // Reveal over a scroll distance tied to the viewport, not the paragraph's own
      // rendered height — a short, wide block (few long lines) would otherwise finish
      // revealing within a single scroll tick, which reads as a flash, not scrolltelling.
      const revealDistance = Math.max(rect.height, window.innerHeight * 0.6)
      const progress = Math.max(0, Math.min(1, (readingLine - rect.top) / revealDistance))
      const revealedCount = progress * words.length
      const frontIdx = Math.floor(revealedCount)

      for (let i = 0; i < wordRefs.current.length; i++) {
        const span = wordRefs.current[i]
        if (!span) continue
        const opacity = Math.max(0, Math.min(1, (revealedCount - i) / REVEAL_WINDOW))
        span.style.opacity = opacity.toFixed(3)
        span.style.transform = `translateY(${(1 - opacity) * 3}px)`
      }

      if (!firstRunRef.current && soundEnabled && frontIdx > lastFrontRef.current) {
        const steps = Math.min(frontIdx - lastFrontRef.current, MAX_TICKS_PER_FRAME)
        for (let k = 0; k < steps; k++) {
          playFontTick(((lastFrontRef.current + k) % 5) / 5)
        }
      }
      lastFrontRef.current = frontIdx
      firstRunRef.current = false
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(update)
    }

    update()
    // The surrounding .about-reveal block animates in on its own (transform/opacity
    // transition), which shifts this paragraph's position briefly after mount —
    // resync once that settles so initial opacities land correctly.
    const resyncTimer = setTimeout(update, 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      clearTimeout(resyncTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [words.length, soundEnabled])

  return (
    <p className={className} ref={pRef}>
      {words.map((w, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span
            ref={el => { wordRefs.current[i] = el }}
            className={`wr-word${w.strong ? ' wr-strong' : ''}`}
          >
            {w.text}
          </span>
        </span>
      ))}
    </p>
  )
}
