/** Splits a line of text into per-letter spans. Hovering a letter bumps it up
 *  (pure CSS, see .dh-letter:hover in index.css) and — via onHit — plays the
 *  xylophone note for its position, so sweeping the cursor across the text
 *  plays a little run. Spaces are rendered but skipped as "keys" and don't
 *  consume a note index. `startIndex` lets a later line continue the same
 *  note sequence as an earlier one instead of restarting it. */
export function renderXyloLetters(text: string, startIndex: number, onHit: (i: number) => void) {
  let idx = startIndex
  const nodes = text.split('').map((char, i) => {
    if (char === ' ') {
      return <span key={i} className="dh-letter dh-letter--space">{' '}</span>
    }
    const thisIndex = idx++
    return (
      <span key={i} className="dh-letter" onPointerEnter={() => onHit(thisIndex)} aria-hidden="true">
        {char}
      </span>
    )
  })
  return { nodes, nextIndex: idx }
}
