import { useRef, useState } from 'react'

interface Book {
  title: string
  subtitle?: string
  author: string
  mark: string
  bg: string
  fg: string
  isbn: string
}

// Real cover art pulled by ISBN, with a hand-styled fallback (matching the
// actual cover colors) if an image 404s or a book has no ISBN on record.
const INITIAL_BOOKS: Book[] = [
  { title: 'The Design of Everyday Things', author: 'Don Norman',                       mark: 'Basic Books',   bg: '#F2EDE4', fg: '#171717', isbn: '9780465050659' },
  { title: 'The Midnight Library',           author: 'Matt Haig',                       mark: 'Viking',         bg: '#1B2A4A', fg: '#ffffff', isbn: '9780525559474' },
  { title: 'The Rosie Effect',                author: 'Graeme Simsion',                 mark: 'Simon & Schuster', bg: '#F28C8C', fg: '#171717', isbn: '9781476767677' },
  { title: 'No Rules Rules', subtitle: 'Netflix and the Culture of Reinvention', author: 'Reed Hastings & Erin Meyer', mark: 'Penguin Press', bg: '#E50914', fg: '#ffffff', isbn: '9781984877864' },
  { title: 'No Filter', subtitle: 'The Inside Story of Instagram', author: 'Sarah Frier', mark: 'Simon & Schuster', bg: '#C13584', fg: '#ffffff', isbn: '9781982126806' },
  { title: 'Range', subtitle: 'Why Generalists Triumph in a Specialized World', author: 'David Epstein', mark: 'Riverhead Books', bg: '#F4A300', fg: '#171717', isbn: '9780735214484' },
  { title: 'Universal Methods of Design',    author: 'Bella Martin & Bruce Hanington',  mark: 'Rockport',      bg: '#F5C518', fg: '#171717', isbn: '9781592537563' },
  { title: 'Articulating Design Decisions',  author: 'Tom Greever',                     mark: "O'Reilly Media", bg: '#00857C', fg: '#ffffff', isbn: '9781491921560' },
  { title: 'UX Strategy',                     author: 'Jaime Levy',                     mark: "O'Reilly Media", bg: '#C0392B', fg: '#ffffff', isbn: '9781491955179' },
  { title: "The Beginner's Guide to OKR",    author: 'Felipe Castro',                   mark: 'Self-Published', bg: '#2E86AB', fg: '#ffffff', isbn: '' },
]

const amazonSearchUrl = (book: Book) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}`

const coverUrl = (book: Book) => `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`

export function AboutBookshelf() {
  const [books, setBooks] = useState(INITIAL_BOOKS)
  const [dragging, setDragging] = useState<number | null>(null)
  const [failedCovers, setFailedCovers] = useState<Set<string>>(new Set())
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
          const coverFailed = !book.isbn || failedCovers.has(book.isbn)
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
                {!coverFailed ? (
                  <img
                    className="about-book-img"
                    src={coverUrl(book)}
                    alt={`${book.title} cover`}
                    loading="lazy"
                    onError={() => setFailedCovers((prev) => new Set(prev).add(book.isbn))}
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
      <p className="about-shelf-hint">Drag a book to rearrange the shelf · Click one to look it up</p>
    </div>
  )
}
