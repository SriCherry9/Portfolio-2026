import { useRef, useState } from 'react'

interface Book {
  title: string
  subtitle?: string
  author: string
  mark: string
  bg: string
  fg: string
  /** Direct cover image URL — takes priority over every catalog lookup below when set. */
  cover?: string
  /** Google Books volume ID — checked first; Google's catalog has near-complete cover coverage for trade books. */
  gbid?: string
  /** Open Library edition key — a confirmed edition, tried if Google Books has no image. */
  olid?: string
  /** ISBN-13, last resort before the styled fallback card. */
  isbn?: string
}

// Real cover art, tried across three independent catalogs (Google Books,
// then Open Library by edition, then Open Library by ISBN) with a
// hand-styled fallback if every source 404s or a book has no catalog
// record at all (e.g. the self-published OKR guide).
const INITIAL_BOOKS: Book[] = [
  { title: 'The Design of Everyday Things', author: 'Don Norman',                       mark: 'Basic Books',   bg: '#F2EDE4', fg: '#171717', gbid: 'nVQPAAAAQBAJ', olid: 'OL25726927M', isbn: '9780465050659' },
  { title: 'The Midnight Library',           author: 'Matt Haig',                       mark: 'Viking',         bg: '#1B2A4A', fg: '#ffffff', gbid: '63fYDwAAQBAJ', olid: 'OL31856078M', isbn: '9780525559474' },
  { title: 'The Rosie Effect',                author: 'Graeme Simsion',                 mark: 'Simon & Schuster', bg: '#F28C8C', fg: '#171717', gbid: 'lt8GBgAAQBAJ', olid: 'OL27169091M', isbn: '9781476767321' },
  { title: 'No Rules Rules', subtitle: 'Netflix and the Culture of Reinvention', author: 'Reed Hastings & Erin Meyer', mark: 'Penguin Press', bg: '#E50914', fg: '#ffffff', gbid: '1u6_DwAAQBAJ', olid: 'OL29849756M', isbn: '9781984877864' },
  { title: 'No Filter', subtitle: 'The Inside Story of Instagram', author: 'Sarah Frier', mark: 'Simon & Schuster', bg: '#C13584', fg: '#ffffff', gbid: 'e9qeDwAAQBAJ', isbn: '9781982126803' },
  { title: 'Range', subtitle: 'Why Generalists Triumph in a Specialized World', author: 'David Epstein', mark: 'Riverhead Books', bg: '#F4A300', fg: '#171717', gbid: '6nsmEAAAQBAJ', olid: 'OL27311259M', isbn: '9780735214484' },
  { title: 'Universal Methods of Design',    author: 'Bella Martin & Bruce Hanington',  mark: 'Rockport',      bg: '#F5C518', fg: '#171717', gbid: 'uZ8uzWAcdxEC', olid: 'OL25054866M', isbn: '9781592537563' },
  { title: 'Articulating Design Decisions',  author: 'Tom Greever',                     mark: "O'Reilly Media", bg: '#00857C', fg: '#ffffff', gbid: 'z0CgCgAAQBAJ', olid: 'OL26498984M', isbn: '9781491921562' },
  { title: 'UX Strategy',                     author: 'Jaime Levy',                     mark: "O'Reilly Media", bg: '#C0392B', fg: '#ffffff', gbid: '-BUjEAAAQBAJ', olid: 'OL27186851M', isbn: '9781449372866' },
  { title: "The Beginner's Guide to OKR",    author: 'Felipe Castro',                   mark: 'Self-Published', bg: '#2E86AB', fg: '#ffffff' },
  { title: 'Rich Dad Poor Dad',               author: 'Robert Kiyosaki',                mark: 'Plata Publishing', bg: '#0E3B36', fg: '#ffffff', olid: 'OL47304048M', isbn: '9781612680194' },
  { title: 'The Power of Your Subconscious Mind', author: 'Joseph Murphy',              mark: 'Fingerprint! Publishing', bg: '#241C4E', fg: '#F5C518', isbn: '9788172345662' },
  { title: 'The Unexpected Guest',            author: 'Agatha Christie',                mark: 'HarperCollins', bg: '#5C1A1A', fg: '#F2EDE4', isbn: '9780008196677' },
]

const amazonSearchUrl = (book: Book) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}`

const coverSources = (book: Book) => [
  book.cover,
  book.gbid && `https://books.google.com/books/content?id=${book.gbid}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
  book.olid && `https://covers.openlibrary.org/b/olid/${book.olid}-L.jpg?default=false`,
  book.isbn && `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`,
].filter((src): src is string => Boolean(src))

export function AboutBookshelf() {
  const [books, setBooks] = useState(INITIAL_BOOKS)
  const [dragging, setDragging] = useState<number | null>(null)
  const [attempt, setAttempt] = useState<Record<string, number>>({})
  const dragIndex = useRef<number | null>(null)

  const handleDrop = (index: number) => {
    const from = dragIndex.current
    if (from === null || from === index) return
    setBooks((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      return next
    })
    dragIndex.current = null
    setDragging(null)
  }

  return (
    <div className="about-stack-wrap">
      <div className="about-stack">
        {books.map((book, i) => {
          const sources = coverSources(book)
          const currentAttempt = attempt[book.title] ?? 0
          const coverSrc = sources[currentAttempt]
          return (
            <div
              key={book.title}
              className={`about-book${dragging === i ? ' about-book--dragging' : ''}`}
              style={{
                '--tilt': `${((i * 37) % 5 - 2) * 0.4}deg`,
              } as React.CSSProperties}
              draggable
              onDragStart={() => { dragIndex.current = i; setDragging(i) }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragging(null)}
              onClick={() => window.open(amazonSearchUrl(book), '_blank', 'noopener,noreferrer')}
              title={`${book.title}${book.author ? ' — ' + book.author : ''}`}
            >
              <div className="about-book-cover">
                {coverSrc ? (
                  <img
                    className="about-book-img"
                    src={coverSrc}
                    alt={`${book.title} cover`}
                    loading="lazy"
                    onError={() => setAttempt((prev) => ({ ...prev, [book.title]: currentAttempt + 1 }))}
                  />
                ) : (
                  <div
                    className="about-book-fallback"
                    style={{ '--bg': book.bg, '--fg': book.fg } as React.CSSProperties}
                  >
                    <span className="about-book-fallback-title">{book.title}</span>
                    {book.subtitle && <span className="about-book-fallback-subtitle">{book.subtitle}</span>}
                    {book.author && <span className="about-book-fallback-author">{book.author}</span>}
                    <span className="about-book-fallback-mark">{book.mark}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className="about-shelf-hint">
        <span className="about-shelf-hint-drag">Drag a book to rearrange the shelf · </span>
        Tap one to look it up
      </p>
    </div>
  )
}
