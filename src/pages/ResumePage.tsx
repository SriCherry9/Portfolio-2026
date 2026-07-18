import { useEffect, useRef } from 'react'
import { GardenFooter } from '../components/GardenFooter'

export function ResumePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

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

      const loadingTask = pdfjsLib.getDocument({ url: '/resume.pdf' })
      loadingTask.promise.then((pdfDocument: unknown) => {
        if (cancelled) return
        pdfViewer.setDocument(pdfDocument)
        linkService.setDocument(pdfDocument, null)
      })

      const onPagesInit = () => { pdfViewer.currentScaleValue = 'page-width' }
      eventBus.on('pagesinit', onPagesInit)

      cleanup = () => {
        eventBus.off('pagesinit', onPagesInit)
        loadingTask.destroy()
        link.remove()
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <>
      <section className="resume-section">
        <div className="resume-header-row">
          <p className="resume-kicker">Resume</p>
          <a href="/resume.pdf" download className="resume-download">Download PDF</a>
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
