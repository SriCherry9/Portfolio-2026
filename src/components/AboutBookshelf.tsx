import { useRef, useState } from 'react'

interface Book {
  title: string
  author: string
  color: string
}

const INITIAL_BOOKS: Book[] = [
  { title: 'The Design of Everyday Things', author: 'Don Norman',    color: '#C4A96A' },
  { title: "Don't Make Me Think",           author: 'Steve Krug',    color: '#7B68EE' },
  { title: 'Sprint',                        author: 'Jake Knapp',    color: '#5B8CFF' },
  { title: 'Hooked',                        author: 'Nir Eyal',      color: '#B8E4C9' },
  { title: 'Laws of UX',                    author: 'Jon Yablonski', color: '#840FF1' },
]

const amazonSearchUrl = (book: Book) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}`

export function AboutBookshelf() {
  const [books, setBooks] = useState(INITIAL_BOOKS)
  const [dragging, setDragging] = useState<number | null>(null)
  const dragIndex = useRef<number | null>(null)
  const movedRef = useRef(false)

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
            onDragStart={() => { dragIndex.current = i; movedRef.current = false; setDragging(i) }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { movedRef.current = true; handleDrop(i) }}
            onDragEnd={() => setDragging(null)}
            onClick={() => {
              if (movedRef.current) { movedRef.current = false; return }
              window.open(amazonSearchUrl(book), '_blank', 'noopener,noreferrer')
            }}
            title={`${book.title} — ${book.author}`}
          >
            <span className="about-book-title">{book.title}</span>
            <span className="about-book-author">{book.author}</span>
          </div>
        ))}
      </div>
      <div className="about-shelf-ledge" />
      <p className="about-shelf-hint">Drag a spine to rearrange · Click a book to look it up</p>
    </div>
  )
}
