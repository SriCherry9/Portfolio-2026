import { useEffect } from 'react'

interface PortraitStudyModalProps {
  onClose: () => void
}

export function PortraitStudyModal({ onClose }: PortraitStudyModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="ps-modal-backdrop" onClick={onClose}>
      <div className="ps-modal-content" onClick={e => e.stopPropagation()}>
        <button className="ps-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="ps-sheet">
          <div className="ps-masthead">
            <div className="ps-mark">
              <span className="ps-glyph" aria-hidden="true">&#10021;</span>
              <span className="ps-word">Field&nbsp;Plates</span>
            </div>
            <div className="ps-index">FIG.&nbsp;07<br />REV.&nbsp;003</div>
          </div>

          <h2 className="ps-h1">A portrait typed in eight measured planes</h2>
          <p className="ps-dek">
            No pigment, no wash — every plane is built from struck characters, denser where the
            plate reads darker. Eight points, surveyed once, in ink only.
          </p>

          <figure className="ps-plate">
            <div className="ps-plate-inner">
              <svg
                className="ps-art"
                viewBox="0 0 480 620"
                role="img"
                aria-label="Angular portrait rendered entirely from typed characters, in black and white"
              >
                <defs>
                  <pattern id="ps-tone1" width="14" height="14" patternUnits="userSpaceOnUse">
                    <rect width="14" height="14" fill="var(--ps-paper)" />
                    <text x="7" y="10.5" textAnchor="middle" fontSize="7" fill="var(--ps-ink)">.</text>
                  </pattern>
                  <pattern id="ps-tone2" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
                    <rect width="13" height="13" fill="var(--ps-paper)" />
                    <text x="6.5" y="10" textAnchor="middle" fontSize="8" fill="var(--ps-ink)">+</text>
                  </pattern>
                  <pattern id="ps-tone3" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
                    <rect width="11" height="11" fill="var(--ps-paper)" />
                    <text x="5.5" y="9" textAnchor="middle" fontSize="8.5" fill="var(--ps-ink)">=</text>
                  </pattern>
                  <pattern id="ps-tone4" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(4)">
                    <rect width="10" height="10" fill="var(--ps-paper)" />
                    <text x="5" y="8.5" textAnchor="middle" fontSize="9" fill="var(--ps-ink)">%</text>
                  </pattern>
                  <pattern id="ps-tone5" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
                    <rect width="9" height="9" fill="var(--ps-paper)" />
                    <text x="4.5" y="7.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ps-ink)">@</text>
                  </pattern>
                </defs>

                <circle cx="404" cy="118" r="92" fill="none" stroke="var(--ps-ink-faint)" strokeWidth="1" opacity="0.5" />
                <polygon points="0,0 96,0 34,98 0,64" fill="none" stroke="var(--ps-ink-faint)" strokeWidth="1" opacity="0.5" />
                <polygon points="480,600 480,480 420,560" fill="none" stroke="var(--ps-ink-faint)" strokeWidth="1" opacity="0.5" />

                <g className="ps-facets">
                  <polygon points="0,600 190,560 220,600 60,620 0,620" fill="var(--ps-ink)" />
                  <polygon points="480,600 290,560 260,600 420,620 480,620" fill="url(#ps-tone3)" />
                  <polygon points="205,500 275,500 290,560 260,600 220,600 190,560" fill="url(#ps-tone2)" />

                  <polygon points="240,60 315,90 350,145 360,220 350,300 320,365 290,420 260,470 240,520 210,495 180,455 155,405 135,340 128,260 138,180 175,110 205,80" fill="url(#ps-tone2)" />

                  <polygon points="205,80 240,60 315,90 330,130 300,110 260,95 225,100 190,115 170,140 155,120" fill="var(--ps-ink)" />

                  <polygon points="205,80 260,95 300,110 315,150 300,190 250,195 210,180 185,150 175,110" fill="url(#ps-tone1)" />

                  <polygon points="128,260 172,266 200,274 210,330 190,380 155,405 135,340" fill="url(#ps-tone4)" />
                  <polygon points="300,256 328,250 350,300 340,360 315,365 300,320 295,280" fill="url(#ps-tone1)" />

                  <polygon points="165,225 210,215 235,222 232,235 195,240 160,238" fill="var(--ps-ink)" />
                  <polygon points="270,215 320,222 335,235 330,245 285,240 265,230" fill="var(--ps-ink)" />

                  <polygon points="170,250 205,242 235,250 232,266 200,274 172,266" fill="var(--ps-paper)" />
                  <circle cx="202" cy="258" r="7" fill="var(--ps-ink)" />
                  <polygon points="270,235 305,230 330,238 328,250 300,256 275,248" fill="var(--ps-paper)" />
                  <circle cx="303" cy="243" r="6" fill="var(--ps-ink)" />

                  <polygon points="235,255 252,255 262,340 250,360 228,355 220,335" fill="url(#ps-tone2)" />
                  <polygon points="228,355 250,360 262,340 275,350 258,378 235,378 220,368" fill="url(#ps-tone4)" />
                  <circle cx="234" cy="366" r="3" fill="var(--ps-ink)" />
                  <circle cx="258" cy="366" r="3" fill="var(--ps-ink)" />

                  <polygon points="205,400 240,392 275,398 285,415 260,432 225,430 195,420" fill="var(--ps-ink)" />

                  <polygon points="195,420 225,430 260,432 250,470 240,520 210,495 185,455" fill="url(#ps-tone4)" />

                  {/* contour ink, laid over every plane */}
                  <g fill="none" stroke="var(--ps-ink)" strokeWidth="1.4" strokeLinejoin="round">
                    <polygon points="240,60 315,90 350,145 360,220 350,300 320,365 290,420 260,470 240,520 210,495 180,455 155,405 135,340 128,260 138,180 175,110 205,80" />
                    <polygon points="205,80 260,95 300,110 315,150 300,190 250,195 210,180 185,150 175,110" />
                    <polygon points="128,260 172,266 200,274 210,330 190,380 155,405 135,340" />
                    <polygon points="170,250 205,242 235,250 232,266 200,274 172,266" />
                    <polygon points="270,235 305,230 330,238 328,250 300,256 275,248" />
                    <polygon points="235,255 252,255 262,340 250,360 228,355 220,335" />
                    <polygon points="205,400 240,392 275,398 285,415 260,432 225,430 195,420" />
                  </g>
                </g>

                <line className="ps-guide" x1="240" y1="36" x2="240" y2="600" />
                <line className="ps-guide" x1="330" y1="80" x2="330" y2="400" />

                <g>
                  <circle className="ps-dot" cx="315" cy="90" r="3.4" />
                  <text className="ps-coord" x="323" y="87">01&#183;315,090</text>

                  <circle className="ps-dot" cx="350" cy="145" r="3.4" />
                  <text className="ps-coord" x="358" y="142">02&#183;350,145</text>

                  <circle className="ps-dot" cx="360" cy="220" r="3.4" />
                  <text className="ps-coord" x="368" y="217">03&#183;360,220</text>

                  <circle className="ps-dot" cx="350" cy="300" r="3.4" />
                  <text className="ps-coord" x="358" y="297">04&#183;350,300</text>

                  <circle className="ps-dot" cx="320" cy="365" r="3.4" />
                  <text className="ps-coord" x="328" y="362">05&#183;320,365</text>

                  <circle className="ps-dot" cx="290" cy="420" r="3.4" />
                  <text className="ps-coord" x="298" y="417">06&#183;290,420</text>

                  <circle className="ps-dot" cx="260" cy="470" r="3.4" />
                  <text className="ps-coord" x="268" y="467">07&#183;260,470</text>

                  <circle className="ps-dot" cx="240" cy="520" r="3.4" />
                  <text className="ps-coord" x="248" y="533">08&#183;240,520</text>
                </g>
              </svg>

              <div className="ps-readout">
                <span className="ps-state">8 points, typed</span>
                <span className="ps-key">Density key: <span className="ps-key-chars">. + = % @</span></span>
              </div>
            </div>
          </figure>

          <p className="ps-caption">
            Plate 07 of an ongoing series surveying the same sitter from eight fixed angles —
            <b> struck once</b>, never re-inked. The character set above stands in for a
            grayscale: <b>.</b> where the plate is lightest, <b>@</b> where the ribbon struck
            hardest.
          </p>

          <div className="ps-footer">
            <span>Study&nbsp;/&nbsp;Portraiture</span>
            <span>Monochrome&nbsp;&mdash;&nbsp;typed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
