import { useRef, useState } from 'react'

interface Book {
  title: string
  author: string
  isbn: string
  color: string
}

// Covers served from the Open Library Covers API (covers.openlibrary.org),
// keyed by each book's real ISBN-13 — actual cover art, not stock art.
const INITIAL_BOOKS: Book[] = [
  { title: 'The Design of Everyday Things', author: 'Don Norman',    isbn: '9780465050659', color: '#C4A96A' },
  { title: "Don't Make Me Think",           author: 'Steve Krug',    isbn: '9780321965516', color: '#7B68EE' },
  { title: 'Sprint',                        author: 'Jake Knapp',    isbn: '9781501121746', color: '#5B8CFF' },
  { title: 'Hooked',                        author: 'Nir Eyal',      isbn: '9781591847786', color: '#B8E4C9' },
  { title: 'Laws of UX',                    author: 'Jon Yablonski', isbn: '9781492055310', color: '#840FF1' },
]

const coverUrl = (isbn: string) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

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
    <div className="about-shelf-wrap">
      <div className="about-shelf-row">
        {books.map((book, i) => (
          <div
            key={book.title}
            className={`about-book${dragging === i ? ' about-book--dragging' : ''}`}
            style={{ '--spine': book.color } as React.CSSProperties}
            draggable
            onDragStart={() => { dragIndex.current = i; setDragging(i) }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => setDragging(null)}
            onClick={() => window.open(amazonSearchUrl(book), '_blank', 'noopener,noreferrer')}
            title={`${book.title} — ${book.author}`}
          >
            <img
              src={coverUrl(book.isbn)}
              alt={`${book.title} cover`}
              className="about-book-cover"
              loading="lazy"
              draggable={false}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <span className="about-book-caption">
              <span className="about-book-title">{book.title}</span>
              <span className="about-book-author">{book.author}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="about-shelf-ledge" />
      <p className="about-shelf-hint">Drag a book to rearrange · Click one to look it up</p>
    </div>
  )
}
