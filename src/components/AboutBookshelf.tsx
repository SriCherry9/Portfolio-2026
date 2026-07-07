import { useRef, useState } from 'react'

interface Book {
  title: string
  subtitle?: string
  author: string
  mark: string
  bg: string
  fg: string
  thickness: number
}

// Real books from my shelf — spines recreated to match their actual covers.
const INITIAL_BOOKS: Book[] = [
  { title: 'Universal Principles of Design', author: '',                              mark: 'Rockport',    bg: '#1B3A6B', fg: '#ffffff', thickness: 60 },
  { title: 'Start With Why',                 author: 'Simon Sinek',                   mark: 'Portfolio',   bg: '#6E1423', fg: '#ffffff', thickness: 56 },
  { title: 'Zero to One',                    author: 'Peter Thiel',                   mark: 'Virgin Books', bg: '#FFD400', fg: '#171717', thickness: 44 },
  { title: 'Creative Confidence',            author: 'Tom Kelley & David Kelley',     mark: 'William Collins', bg: '#F3EFE2', fg: '#171717', thickness: 50 },
  { title: 'Hooked', subtitle: 'How to Build Habit-Forming Products', author: 'Nir Eyal', mark: 'Portfolio', bg: '#FFD400', fg: '#171717', thickness: 48 },
  { title: '100 More Things Every Designer Needs to Know About People', author: 'Susan Weinschenk', mark: 'New Riders', bg: '#C7D62B', fg: '#171717', thickness: 52 },
  { title: "Don't Make Me Think, Revisited", subtitle: 'A Common Sense Approach to Web Usability', author: 'Steve Krug', mark: 'New Riders', bg: '#F6B26B', fg: '#171717', thickness: 46 },
  { title: 'A Project Guide to UX Design',   subtitle: 'For User Experience Designers in the Field or in the Making', author: 'Russ Unger & Carolyn Chandler', mark: 'New Riders', bg: '#14213D', fg: '#ffffff', thickness: 54 },
  { title: 'Smashing UX Design',             author: 'Jesmond Allen & James Chudley', mark: 'Wiley', bg: '#ffffff', fg: '#171717', thickness: 50 },
  { title: 'The Lean Startup',                author: 'Eric Ries',                     mark: 'Portfolio',   bg: '#1C6EA4', fg: '#ffffff', thickness: 58 },
]

const amazonSearchUrl = (book: Book) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}`

export function AboutBookshelf() {
  const [books, setBooks] = useState(INITIAL_BOOKS)
  const [dragging, setDragging] = useState<number | null>(null)
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
        {books.map((book, i) => (
          <div
            key={book.title}
            className={`about-spine${dragging === i ? ' about-spine--dragging' : ''}`}
            style={{
              '--bg': book.bg,
              '--fg': book.fg,
              width: `${book.thickness}px`,
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
            <div className="about-spine-edge" />
            <div className="about-spine-text">
              <span className="about-spine-title">{book.title}</span>
              {book.subtitle && <span className="about-spine-subtitle">{book.subtitle}</span>}
            </div>
            <div className="about-spine-meta">
              {book.author && <span className="about-spine-author">{book.author}</span>}
              <span className="about-spine-mark">{book.mark}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="about-shelf-ledge" />
      <p className="about-shelf-hint">Drag a book to rearrange the shelf · Click one to look it up</p>
    </div>
  )
}
