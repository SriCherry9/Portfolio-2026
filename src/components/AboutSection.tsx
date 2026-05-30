import { useEffect, useRef } from 'react'

export function AboutSection() {
  const highlightRef = useRef<HTMLSpanElement>(null)
  const sectionRef   = useRef<HTMLElement>(null)

  /* Reveal animation on scroll */
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>('.about-reveal')
    if (!els) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="about-section" ref={sectionRef} id="about">

      {/* ── Opening philosophy ─────────────────────────────────────── */}
      <div className="about-philosophy about-reveal">
        <span className="about-label">Philosophy</span>
        <blockquote className="about-quote">
          "The hand is the window on the mind"
          <cite>— Immanuel Kant</cite>
        </blockquote>
        <p className="about-intro">
          This philosophy guides my understanding of interaction design: every era of
          technological innovation reflects how our hands think — from type and click
          to tap and gesture.
        </p>
        <p className="about-intro">
          We are at that point in history where the canvas is open again to explore
          the new kind of interactions that are possible with emerging technologies.
          I aim to shape this history through design that endures across generations.
        </p>
      </div>

      {/* ── Highlighted statement ──────────────────────────────────── */}
      <div className="about-highlight-wrap about-reveal">
        <span
          ref={highlightRef}
          className="about-highlight"
        >
          Expanding the horizon of what design can influence.
        </span>
      </div>

      {/* ── Mission ───────────────────────────────────────────────── */}
      <div className="about-mission about-reveal">
        <p>
          I design intuitive interactions for emerging technologies. In the short-term,
          I seek opportunities at companies like{' '}
          <span className="about-co">LoveFrom</span>,{' '}
          <span className="about-co">Figure AI</span>, and{' '}
          <span className="about-co">Neuralink</span> to gain expertise designing for
          frontier technologies.{' '}
          <span className="about-co">Georgia Tech</span>'s diverse academic ecosystem
          will refine my technical expertise and holistic perspectives, positioning me
          to drive meaningful innovation at the intersection of design and technology.
        </p>
      </div>

      {/* ── Past / Present / Future ───────────────────────────────── */}
      <div className="about-timeline">

        <div className="about-era about-reveal" style={{ '--delay': '0ms' } as React.CSSProperties}>
          <span className="about-era-tag">Past</span>
          <p className="about-era-text">
            I explored the frontier of embodied and multimodal interaction through
            projects like <em>Museo</em> — a gesture-based TV bidding experience
            showcased at <strong>CES 2024</strong> — and a social robot designed to
            reduce loneliness in patients, pushing the boundaries of gesture, speech,
            and emotionally resonant design.
          </p>
        </div>

        <div className="about-era about-reveal" style={{ '--delay': '120ms' } as React.CSSProperties}>
          <span className="about-era-tag about-era-tag--present">Present</span>
          <p className="about-era-text">
            At <em>Qapita</em>, I'm transforming complex, compliance-heavy equity
            workflows into intuitive experiences, identifying AI opportunities that
            shape product roadmaps, and growing into design leadership through
            mentorship and outcome-driven strategy.
          </p>
        </div>

        <div className="about-era about-reveal" style={{ '--delay': '240ms' } as React.CSSProperties}>
          <span className="about-era-tag about-era-tag--future">Future</span>
          <p className="about-era-text">
            I'm working toward designing the next generation of human-technology
            interactions — across spatial, embodied, and multimodal systems — bridging
            deep user empathy with strategic impact at the frontier of emerging
            technology.
          </p>
        </div>

      </div>

    </section>
  )
}
