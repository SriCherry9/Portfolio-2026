import { useEffect, useRef, useState } from 'react'
import { GardenFooter } from '../components/GardenFooter'

interface PdfViewerHandle {
  increaseScale: (options?: { steps?: number }) => void
  decreaseScale: (options?: { steps?: number }) => void
  currentScaleValue: string
}

export function ResumePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const pdfViewerRef = useRef<PdfViewerHandle | null>(null)
  const [zoomPercent, setZoomPercent] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const viewer = viewerRef.current
    if (!container || !viewer) return

    let cancelled = false
    let cleanup = () => {}

    ;(async () => {
      // pdf_viewer.mjs (generic build) reads the main library off
      // globalThis.pdfjsLib at import time, so it must be set first.
      const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')
      ;(globalThis as unknown as { pdfjsLib: unknown }).pdfjsLib = pdfjsLib
      const [pdfjsViewer, cssUrlModule] = await Promise.all([
        import('pdfjs-dist/web/pdf_viewer.mjs'),
        import('pdfjs-dist/web/pdf_viewer.css?url'),
      ])
      if (cancelled) return

      const cssHref = (cssUrlModule as { default: string }).default
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = cssHref
      document.head.appendChild(link)

      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'

      const eventBus = new pdfjsViewer.EventBus()
      const linkService = new pdfjsViewer.PDFLinkService({
        eventBus,
        externalLinkTarget: pdfjsViewer.LinkTarget.BLANK,
        externalLinkRel: 'noopener noreferrer',
      })
      const pdfViewer = new pdfjsViewer.PDFViewer({
        container,
        viewer,
        eventBus,
        linkService,
      })
      linkService.setViewer(pdfViewer)
      pdfViewerRef.current = pdfViewer

      const loadingTask = pdfjsLib.getDocument({ url: '/resume.pdf' })
      loadingTask.promise.then((pdfDocument: unknown) => {
        if (cancelled) return
        pdfViewer.setDocument(pdfDocument)
        linkService.setDocument(pdfDocument, null)
      })

      const onPagesInit = () => { pdfViewer.currentScaleValue = 'page-fit' }
      const onScaleChanging = (evt: { scale: number }) => {
        setZoomPercent(Math.round(evt.scale * 100))
      }
      eventBus.on('pagesinit', onPagesInit)
      eventBus.on('scalechanging', onScaleChanging)

      cleanup = () => {
        eventBus.off('pagesinit', onPagesInit)
        eventBus.off('scalechanging', onScaleChanging)
        pdfViewerRef.current = null
        loadingTask.destroy()
        link.remove()
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  const zoomOut = () => pdfViewerRef.current?.decreaseScale()
  const zoomIn = () => pdfViewerRef.current?.increaseScale()
  const zoomFit = () => {
    const pdfViewer = pdfViewerRef.current
    if (pdfViewer) pdfViewer.currentScaleValue = 'page-fit'
  }

  return (
    <>
      <section className="resume-section">
        <div className="resume-header-row">
          <p className="resume-kicker">Resume</p>
          <div className="resume-controls">
            <div className="resume-zoom" role="group" aria-label="Zoom resume">
              <button type="button" className="resume-zoom-btn" onClick={zoomOut} aria-label="Zoom out">−</button>
              <button type="button" className="resume-zoom-value" onClick={zoomFit} aria-label="Reset zoom to fit">
                {zoomPercent !== null ? `${zoomPercent}%` : '—'}
              </button>
              <button type="button" className="resume-zoom-btn" onClick={zoomIn} aria-label="Zoom in">+</button>
            </div>
            <a href="/resume.pdf" download className="resume-download">Download PDF</a>
          </div>
        </div>
        <div className="resume-frame-wrap">
          <div className="resume-pdf-container" ref={containerRef}>
            <div className="pdfViewer" ref={viewerRef} />
          </div>
        </div>
      </section>
      <GardenFooter />
    </>
  )
}
