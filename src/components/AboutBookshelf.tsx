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

// Real books from my shelf — real cover art pulled by ISBN, with a
// hand-styled fallback (matching the actual cover colors) if an image 404s.
const INITIAL_BOOKS: Book[] = [
  { title: 'Universal Principles of Design', author: '',                              mark: 'Rockport',       bg: '#1B3A6B', fg: '#ffffff', isbn: '9781592535873' },
  { title: 'Start With Why',                 author: 'Simon Sinek',                   mark: 'Portfolio',      bg: '#6E1423', fg: '#ffffff', isbn: '9781591846444' },
  { title: 'Zero to One',                    author: 'Peter Thiel',                   mark: 'Virgin Books',   bg: '#FFD400', fg: '#171717', isbn: '9780804139298' },
  { title: 'Creative Confidence',            author: 'Tom Kelley & David Kelley',     mark: 'William Collins', bg: '#F3EFE2', fg: '#171717', isbn: '9780385349369' },
  { title: 'Hooked', subtitle: 'How to Build Habit-Forming Products', author: 'Nir Eyal', mark: 'Portfolio',   bg: '#FFD400', fg: '#171717', isbn: '9781591847786' },
  { title: '100 More Things Every Designer Needs to Know About People', author: 'Susan Weinschenk', mark: 'New Riders', bg: '#C7D62B', fg: '#171717', isbn: '9780133577433' },
  { title: "Don't Make Me Think, Revisited", subtitle: 'A Common Sense Approach to Web Usability', author: 'Steve Krug', mark: 'New Riders', bg: '#F6B26B', fg: '#171717', isbn: '9780321965516' },
  { title: 'A Project Guide to UX Design',   subtitle: 'For User Experience Designers in the Field or in the Making', author: 'Russ Unger & Carolyn Chandler', mark: 'New Riders', bg: '#14213D', fg: '#ffffff', isbn: '9780321815380' },
  { title: 'Smashing UX Design',             author: 'Jesmond Allen & James Chudley', mark: 'Wiley', bg: '#ffffff', fg: '#171717', isbn: '9780470666795' },
  { title: 'The Lean Startup',                author: 'Eric Ries',                     mark: 'Portfolio',      bg: '#1C6EA4', fg: '#ffffff', isbn: '9780307887894' },
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
          const coverFailed = failedCovers.has(book.isbn)
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
              <div className="about-book-pages" />
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
      <div className="about-shelf-ledge" />
      <p className="about-shelf-hint">Drag a book to rearrange the shelf · Click one to look it up</p>
    </div>
  )
}
