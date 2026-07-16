import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'

const SECTIONS = [
  { id: 'comic-section-cover', label: 'Cover' },
  { id: 'comic-section-1', label: 'Oh No!' },
  { id: 'comic-section-2', label: 'Overview' },
  { id: 'comic-section-3', label: 'Challenge & Plan' },
  { id: 'comic-section-4', label: 'Character Bible' },
  { id: 'comic-section-5', label: "Parents' Characteristics" },
  { id: 'comic-section-6', label: 'Process — Dialogues' },
  { id: 'comic-section-7', label: 'Storyboarding' },
  { id: 'comic-section-8', label: 'Comic Strip — Pages 1–2' },
  { id: 'comic-section-9', label: 'Comic Strip — Pages 3–4' },
  { id: 'comic-section-10', label: 'Comic Strip — Page 5 & Learnings' },
]

export function ComicStripPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="cs-page cs-comic-strip">
      <CaseStudySideNav sections={SECTIONS} />

      <section className="cs-slides">
        <img id="comic-section-cover" src="/images/comic-strip-cover.png" alt="Oh No! — Comic Strip cover" className="cs-slide-image" />
        <img id="comic-section-1" src="/images/C1.png" alt="Oh No! — a comic strip where I am the protagonist" className="cs-slide-image" />
        <img id="comic-section-2" src="/images/C2.png" alt="Overview — a story about Indian parents and their reluctance to let their children explore unconventional fields of study" className="cs-slide-image" />
        <img id="comic-section-3" src="/images/C3.png" alt="Challenge and plan of action for sketching the comic under time pressure" className="cs-slide-image" />
        <img id="comic-section-4" src="/images/C4.png" alt="Protagonist's character bible — internal and external characteristics, wants, needs, obstacle, and stakes" className="cs-slide-image" />
        <img id="comic-section-5" src="/images/C5.png" alt="Mom's and Dad's characteristics used to write the parent characters" className="cs-slide-image" />
        <img id="comic-section-6" src="/images/C6.png" alt="Process — handwritten dialogue notes for each frame" className="cs-slide-image" />
        <img id="comic-section-7" src="/images/C7.png" alt="Storyboarding sketches for the comic strip" className="cs-slide-image" />
        <img id="comic-section-8" src="/images/C8.png" alt="Comic strip pages 1 and 2" className="cs-slide-image" />
        <img id="comic-section-9" src="/images/C9.png" alt="Comic strip pages 3 and 4" className="cs-slide-image" />
        <img id="comic-section-10" src="/images/C10.png" alt="Comic strip page 5, back cover, and my learnings from the project" className="cs-slide-image" />
      </section>

      <CaseStudyFooter
        nextPath="/case-study/hfe-inhaler"
        nextTitle="Human Factors & Ergonomics"
        nextCover="/images/hfe-inhaler-cover.png"
      />
    </div>
  )
}
