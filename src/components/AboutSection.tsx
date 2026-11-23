import { useEffect, useRef } from 'react'
import { AboutCollage } from './AboutCollage'
import { AboutBookshelf } from './AboutBookshelf'
import { ScrollRevealParagraph, type RevealSegment } from './ScrollRevealParagraph'
import { unlockFontTickAudio } from '../utils/scrollTick'

const BIO_SEGMENTS: RevealSegment[] = [
  { text: "I'm " },
  { text: 'Cherry', strong: true },
  { text: ', a product designer who moves fluidly between two very different kinds of complexity: ' },
  { text: 'compliance-heavy enterprise systems and expressive, multimodal consumer experiences', strong: true },
  { text: '. At ' },
  { text: 'Qapita', strong: true },
  { text: ', I redesigned core workflows for a platform managing ' },
  { text: '$55B', strong: true },
  { text: ' in ' },
  { text: 'equity', strong: true },
  { text: ' across ' },
  { text: '2,400+ companies', strong: true },
  { text: ', cutting setup time by ' },
  { text: '25%', strong: true },
  { text: ' and abandonment by ' },
  { text: '20%', strong: true },
  { text: '. I ran an accessibility audit and built the execution plan to bring the platform to ' },
  { text: 'WCAG 2.2', strong: true },
  { text: ' compliance, and I identified ' },
  { text: 'AI opportunities', strong: true },
  { text: ' that shaped the ' },
  { text: 'product roadmap', strong: true },
  { text: '. At ' },
  { text: 'NinjaHire', strong: true },
  { text: ', I designed ' },
  { text: 'AI-native workflows', strong: true },
  { text: ' end-to-end — prompt inputs, agent outputs, confidence signals, and trust cues — and redesigned ' },
  { text: 'onboarding and monetization', strong: true },
  { text: ' flows, cutting time-to-first-result and surfacing pricing, credit usage, and upgrade paths clearly to ' },
  { text: 'drive adoption', strong: true },
  { text: '. On the other end of the spectrum, I designed ' },
  { text: 'Museo', strong: true },
  { text: ' — a ' },
  { text: 'gesture-based TV bidding experience', strong: true },
  { text: ' for art auctions — shown at ' },
  { text: 'CES 2024', strong: true },
  { text: ' to ' },
  { text: '138,700 attendees', strong: true },
  { text: '. That range is the point: whether the challenge is simplifying a dense financial workflow or designing a natural gesture interaction for a new medium, I bring the same ' },
  { text: 'research-first, systems-level thinking', strong: true },
  { text: '. For teams building the next generation of experiences — B2B or B2C — I bring ' },
  { text: 'empathy, multimodal fluency,', strong: true },
  { text: ' and the ability to ' },
  { text: 'align design with real business and human outcomes', strong: true },
  { text: '.' },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>('.about-reveal')
    if (!els) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))

    // Web Audio needs a real user gesture to start — wheel/touch/click all count,
    // but a bare scroll event (used to drive the word-reveal ticks) does not.
    const unlock = () => unlockFontTickAudio()
    window.addEventListener('wheel', unlock, { once: true, passive: true })
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
    window.addEventListener('click', unlock, { once: true })

    return () => {
      obs.disconnect()
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('click', unlock)
    }
  }, [])

  return (
    <section className="about-section" ref={sectionRef} id="about">

      {/* ── Full-width headline ─────────────────────────────────────── */}
      <div className="about-headline-row about-reveal">
        <p className="about-kicker">What I'm about</p>
        <h2 className="about-headline">
          Expanding the horizon<br />of what design can influence.
        </h2>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="about-divider about-reveal" />

      {/* ── Philosophy — two columns ────────────────────────────────── */}
      <div className="about-two-col about-reveal">
        <div className="about-col-left">
          <blockquote className="about-quote">
            "The hand is the window on the mind"
            <cite>— Immanuel Kant</cite>
          </blockquote>
        </div>
        <div className="about-col-right">
          <ScrollRevealParagraph
            className="about-body"
            text="This philosophy guides my understanding of interaction design: every era of technological innovation reflects how our hands think — from type and click to tap and gesture."
          />
          <ScrollRevealParagraph
            className="about-body"
            text="We are at that point in history where the canvas is open again to explore new kinds of interaction possible with emerging technologies. I aim to shape this history through design that endures across generations."
          />
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="about-divider about-reveal" />

      {/* ── Who I am ─────────────────────────────────────────────────── */}
      <div className="about-bio about-reveal">
        <p className="about-kicker">Who I am</p>
        <ScrollRevealParagraph className="about-body about-bio-body" segments={BIO_SEGMENTS} />
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="about-divider about-reveal" />

      <div className="about-collage-section about-reveal">
        {/* ── Beyond the work ─────────────────────────────────────────── */}
        <div className="about-beyond">
          <p className="about-kicker">Beyond the work</p>
          <ScrollRevealParagraph
            className="about-body about-beyond-body"
            text="So, who am I when I'm not designing? Punctual, assertive, and endlessly curious, with an all-rounder streak that goes back to childhood. I played basketball at the national level and tennis alongside it, danced, did karate — if there was a way to try something new, I was in. That same instinct still drives me: I've gone skydiving, scuba diving, surfing, and ziplining, and I'm always adding to the list. But I balance that with real stillness — I protect time to just play, read, or do absolutely nothing. I lead the way I always have: organizing, showing up, mentoring without micromanaging. I'm a team player with strong opinions, someone who values peace and real relationships over just chasing the next thing — even while chasing quite a lot of things. Hover on a photo below to get to know me a little better."
          />
        </div>

        <AboutCollage />
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="about-divider about-reveal" />

      {/* ── Bookshelf ────────────────────────────────────────────────── */}
      <div className="about-shelf-section about-reveal">
        <p className="about-kicker">On my shelf</p>
        <h3 className="about-shelf-title">Books that shaped how I think</h3>
        <AboutBookshelf />
      </div>

    </section>
  )
}
