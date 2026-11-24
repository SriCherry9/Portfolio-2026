import { noteFrequencyForIndex, playXyloNote } from '../utils/xyloSound'
import { renderXyloLetters } from '../utils/xyloLetters'

interface XyloTextProps {
  text: string
  className?: string
  as?: 'span' | 'div'
}

/**
 * A self-contained piece of hoverable-xylophone text — each letter bumps up and
 * plays a note on hover, starting its own run from the first letter. Use this
 * for any standalone heading/name/line; for text that should continue one run
 * across multiple lines (like the hero headline), call `renderXyloLetters`
 * directly instead so the note index can carry over between them.
 */
export function XyloText({ text, className, as: As = 'span' }: XyloTextProps) {
  const { nodes } = renderXyloLetters(text, 0, i => playXyloNote(noteFrequencyForIndex(i)))
  return (
    <As className={className} aria-label={text}>
      {nodes}
    </As>
  )
}
