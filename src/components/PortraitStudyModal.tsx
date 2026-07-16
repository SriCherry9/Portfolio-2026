import { useEffect, useState } from 'react'

interface PortraitStudyModalProps {
  onClose: () => void
}

export function PortraitStudyModal({ onClose }: PortraitStudyModalProps) {
  const [state, setState] = useState<'mono' | 'color'>('mono')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const toggle = () => setState(s => (s === 'mono' ? 'color' : 'mono'))

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
            <div className="ps-index">FIG.&nbsp;07<br />REV.&nbsp;002</div>
          </div>

          <h2 className="ps-h1">A portrait re-inked in eight measured planes</h2>
          <p className="ps-dek">
            Eight construction points trace the jaw from crown to chin. Each was surveyed once in
            grayscale, then again with pigment — click the plate to compare the two readings.
          </p>

          <button
            className="ps-plate"
            type="button"
            data-state={state}
            aria-pressed={state === 'color'}
            onClick={toggle}
          >
            <div className="ps-plate-inner">
              <svg
                className="ps-art"
                viewBox="0 0 480 620"
                role="img"
                aria-label="Angular cubist portrait, monochrome by default, colorized on click"
              >
                <circle cx="404" cy="118" r="92" fill="none" stroke="var(--ps-bg-arc)" strokeWidth="1" opacity="0.18" />
                <polygon points="0,0 96,0 34,98 0,64" fill="var(--ps-shoulder-a)" opacity="0.35" />
                <polygon points="480,600 480,480 420,560" fill="var(--ps-shoulder-b)" opacity="0.18" />

                <g className="ps-facets">
                  <polygon points="0,600 190,560 220,600 60,620 0,620" fill="var(--ps-shoulder-a)" />
                  <polygon points="480,600 290,560 260,600 420,620 480,620" fill="var(--ps-shoulder-b)" />
                  <polygon points="205,500 275,500 290,560 260,600 220,600 190,560" fill="var(--ps-neck)" />

                  <polygon points="240,60 315,90 350,145 360,220 350,300 320,365 290,420 260,470 240,520 210,495 180,455 155,405 135,340 128,260 138,180 175,110 205,80" fill="var(--ps-skin)" />

                  <polygon points="205,80 240,60 315,90 330,130 300,110 260,95 225,100 190,115 170,140 155,120" fill="var(--ps-hair)" />

                  <polygon points="205,80 260,95 300,110 315,150 300,190 250,195 210,180 185,150 175,110" fill="var(--ps-skin-light)" />

                  <polygon points="128,260 172,266 200,274 210,330 190,380 155,405 135,340" fill="var(--ps-cheek-dark)" />
                  <polygon points="300,256 328,250 350,300 340,360 315,365 300,320 295,280" fill="var(--ps-skin-light)" />

                  <polygon points="165,225 210,215 235,222 232,235 195,240 160,238" fill="#241b13" />
                  <polygon points="270,215 320,222 335,235 330,245 285,240 265,230" fill="#241b13" />

                  <polygon points="170,250 205,242 235,250 232,266 200,274 172,266" fill="var(--ps-eye)" />
                  <circle cx="202" cy="258" r="7" fill="#241b13" />
                  <polygon points="270,235 305,230 330,238 328,250 300,256 275,248" fill="var(--ps-eye)" />
                  <circle cx="303" cy="243" r="6" fill="#241b13" />

                  <polygon points="235,255 252,255 262,340 250,360 228,355 220,335" fill="var(--ps-skin-mid)" />
                  <polygon points="228,355 250,360 262,340 275,350 258,378 235,378 220,368" fill="var(--ps-skin-shadow)" />
                  <circle cx="234" cy="366" r="3" fill="#241b13" />
                  <circle cx="258" cy="366" r="3" fill="#241b13" />

                  <polygon points="205,400 240,392 275,398 285,415 260,432 225,430 195,420" fill="var(--ps-lips)" />

                  <polygon points="195,420 225,430 260,432 250,470 240,520 210,495 185,455" fill="var(--ps-cheek-dark)" />
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
                <span className="ps-state">{state === 'color' ? 'Color' : 'Monochrome'}</span>
                <span>
                  {state === 'color' ? 'Click plate to reset ' : 'Click plate to colorize'}
                  <span className="ps-cursor" aria-hidden="true" />
                </span>
              </div>
            </div>
          </button>

          <p className="ps-caption">
            Plate 07 of an ongoing series surveying the same sitter from eight fixed angles.{' '}
            <b>Grayscale</b> is the plate as filed; <b>color</b> is the pigment key recorded
            alongside it but printed separately.
          </p>

          <div className="ps-footer">
            <span>Study&nbsp;/&nbsp;Portraiture</span>
            <span>08&nbsp;points&nbsp;&mdash;&nbsp;2&nbsp;states</span>
          </div>
        </div>
      </div>
    </div>
  )
}
