import { useEffect, useRef } from 'react'

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

      {/* ── Past / Present / Future — stacked rows ──────────────────── */}
      <div className="about-eras">

        <div className="about-era-row about-reveal" style={{ '--delay': '0ms' } as React.CSSProperties}>
          <div className="about-era-meta">
            <span className="about-era-tag">Past</span>
            <span className="about-era-year">2021 – 2024</span>
          </div>
          <p className="about-era-body">
            I explored the frontier of embodied and multimodal interaction through
            projects like <strong>Museo</strong> — a gesture-based TV bidding
            experience showcased at <strong>CES 2024</strong> — and a social robot
            designed to reduce loneliness in patients, where I pushed the boundaries
            of gesture, speech, and emotionally resonant design.
          </p>
        </div>

        <div className="about-era-row about-reveal" style={{ '--delay': '100ms' } as React.CSSProperties}>
          <div className="about-era-meta">
            <span className="about-era-tag about-era-tag--present">Present</span>
            <span className="about-era-year">Now</span>
          </div>
          <p className="about-era-body">
            At <strong>Qapita</strong>, I'm transforming complex, compliance-heavy
            equity workflows into intuitive experiences, identifying AI opportunities
            that shape product roadmaps, and growing into design leadership through
            mentorship and outcome-driven strategy.
          </p>
        </div>

        <div className="about-era-row about-reveal" style={{ '--delay': '200ms' } as React.CSSProperties}>
          <div className="about-era-meta">
            <span className="about-era-tag about-era-tag--future">Future</span>
            <span className="about-era-year">Next</span>
          </div>
          <p className="about-era-body">
            Working toward designing the next generation of human-technology
            interactions — across spatial, embodied, and multimodal systems — where
            I can bridge deep user empathy with strategic impact at the frontier of
            emerging technology.
          </p>
        </div>

      </div>

    </section>
  )
}
