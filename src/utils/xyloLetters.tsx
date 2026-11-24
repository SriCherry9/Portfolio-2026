/** Splits a line of text into per-letter spans, grouped by word. Hovering a
 *  letter bumps it up (pure CSS, see .dh-letter:hover in index.css) and — via
 *  onHit — plays the xylophone note for its position, so sweeping the cursor
 *  across the text plays a little run.
 *
 *  Each word's letters are wrapped in a single inline-block span (.dh-letter-word)
 *  so the word can only wrap to the next line as a whole, never split mid-word —
 *  and the actual breakable space between words is a plain space character, not
 *  trapped inside any span, so it collapses normally at a line break instead of
 *  leaving a stray gap at the start of the wrapped line.
 *
 *  `startIndex` lets a later line continue the same note sequence as an earlier
 *  one instead of restarting it. */
export function renderXyloLetters(text: string, startIndex: number, onHit: (i: number) => void) {
  let idx = startIndex
  const words = text.split(' ')
  const nodes: React.ReactNode[] = []

  words.forEach((word, wi) => {
    if (wi > 0) nodes.push(' ')
    nodes.push(
      <span key={`w${wi}`} className="dh-letter-word">
        {word.split('').map((char, ci) => {
          const thisIndex = idx++
          return (
            <span key={ci} className="dh-letter" onPointerEnter={() => onHit(thisIndex)} aria-hidden="true">
              {char}
            </span>
          )
        })}
      </span>
    )
  })

  return { nodes, nextIndex: idx }
}
