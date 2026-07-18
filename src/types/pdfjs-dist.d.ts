declare module 'pdfjs-dist/build/pdf.mjs' {
  const pdfjsLib: any
  export = pdfjsLib
}

declare module 'pdfjs-dist/web/pdf_viewer.mjs' {
  const pdfjsViewer: any
  export = pdfjsViewer
}

declare module 'pdfjs-dist/web/pdf_viewer.css?url' {
  const url: string
  export default url
}
