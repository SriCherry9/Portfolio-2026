import { useEffect, useRef } from 'react'
import { AboutCollage } from './AboutCollage'
import { AboutBookshelf } from './AboutBookshelf'

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
    return () => obs.disconnect()
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
          <p className="about-body">
            This philosophy guides my understanding of interaction design: every era
            of technological innovation reflects how our hands think — from type and
            click to tap and gesture.
          </p>
          <p className="about-body">
            We are at that point in history where the canvas is open again to explore
            new kinds of interaction possible with emerging technologies. I aim to
            shape this history through design that endures across generations.
          </p>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="about-divider about-reveal" />

      {/* ── Who I am ─────────────────────────────────────────────────── */}
      <div className="about-bio about-reveal">
        <p className="about-kicker">Who I am</p>
        <p className="about-body about-bio-body">
          I'm <strong>Cherry</strong>, a product designer who moves fluidly between
          two very different kinds of complexity:{' '}
          <strong>compliance-heavy enterprise systems and expressive, multimodal
          consumer experiences</strong>. At <strong>Qapita</strong>, I redesigned
          core workflows for a platform managing <strong>$55B</strong> in{' '}
          <strong>equity</strong> across <strong>2,400+ companies</strong>, cutting
          setup time by <strong>25%</strong> and abandonment by{' '}
          <strong>20%</strong>. I ran an accessibility audit and built the
          execution plan to bring the platform to <strong>WCAG 2.2</strong>{' '}
          compliance, and I identified <strong>AI opportunities</strong> that
          shaped the <strong>product roadmap</strong>. At{' '}
          <strong>NinjaHire</strong>, I designed{' '}
          <strong>AI-native workflows</strong> end-to-end — prompt inputs,
          agent outputs, confidence signals, and trust cues — and redesigned{' '}
          <strong>onboarding and monetization</strong> flows, cutting
          time-to-first-result and surfacing pricing, credit usage, and
          upgrade paths clearly to <strong>drive adoption</strong>.
          On the other end of the spectrum, I designed{' '}
          <strong>Museo</strong> — a{' '}
          <strong>gesture-based TV bidding experience</strong> for art auctions —
          shown at <strong>CES 2024</strong> to{' '}
          <strong>138,700 attendees</strong>. That range is the point: whether
          the challenge is simplifying a dense financial workflow or designing a
          natural gesture interaction for a new medium, I bring the same{' '}
          <strong>research-first, systems-level thinking</strong>. For teams
          building the next generation of experiences — B2B or B2C — I bring{' '}
          <strong>empathy, multimodal fluency,</strong> and the ability to{' '}
          <strong>align design with real business and human outcomes</strong>.
        </p>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="about-divider about-reveal" />

      <div className="about-collage-section about-reveal">
        {/* ── Beyond the work ─────────────────────────────────────────── */}
        <div className="about-beyond">
          <p className="about-kicker">Beyond the work</p>
          <p className="about-body about-beyond-body">
            So, who am I when I'm not designing? Punctual, assertive, and
            endlessly curious, with an all-rounder streak that goes back to
            childhood. I played basketball at the national level and tennis
            alongside it, danced, did karate — if there was a way to try
            something new, I was in. That same instinct still drives me: I've
            gone skydiving, scuba diving, surfing, and ziplining, and I'm always
            adding to the list. But I balance that with real stillness — I
            protect time to just play, read, or do absolutely nothing. I lead
            the way I always have: organizing, showing up, mentoring without
            micromanaging. I'm a team player with strong opinions, someone who
            values peace and real relationships over just chasing the next
            thing — even while chasing quite a lot of things. Hover on a photo
            below to get to know me a little better.
          </p>
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
