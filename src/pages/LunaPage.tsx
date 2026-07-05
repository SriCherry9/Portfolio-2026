import { useEffect, useRef, useState } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import '../styles/luna.css'

const SLIDES: { src: string; alt: string; label: string }[] = [
  { src: '/images/luna/1.png', label: 'Intro', alt: 'Luna — Human Robot Interaction and Robot Design, a research-driven exploration into alleviating loneliness for hospitalized in-patients' },
  { src: '/images/luna/2.png', label: 'Problem', alt: 'Problem — loneliness during hospitalization undermines recovery, broken down with the 5W framework' },
  { src: '/images/luna/3.png', label: 'Goal & Hypothesis', alt: 'Goal statement and hypothesis — introducing a social robot companion to enhance mental health and recovery' },
  { src: '/images/luna/4.png', label: 'Research Objectives', alt: 'Research objectives — exploring social interaction, interventions, feasibility, and causes of loneliness' },
  { src: '/images/luna/5.png', label: 'Research Process', alt: 'Research process — primary and secondary research, synthesis, and ideation' },
  { src: '/images/luna/6.png', label: 'Key Insights', alt: 'Key insights — social robots must be relational rather than transactional, and movement design builds companionship' },
  { src: '/images/luna/7.png', label: 'Field Studies', alt: 'Secondary research and field studies — literature review and quantitative data on patient loneliness' },
  { src: '/images/luna/8.png', label: 'Competitor Takeaways', alt: 'Competitor takeaways on relational social robots and expressive movement' },
  { src: '/images/luna/9.png', label: 'Technical Considerations', alt: 'Technical consideration — how to build a robot, tech research synthesis across AI, ML, NLP, and sensors' },
  { src: '/images/luna/10.png', label: 'Pain Points', alt: 'Pain points and insights for hospitalized patients — limited social interaction, separation from family, unfamiliar environment' },
  { src: '/images/luna/11.png', label: 'Personas', alt: 'Personas — Vyasa and Abhinay, who we are designing for' },
  { src: '/images/luna/12.png', label: 'Ideation', alt: 'Ideation — How Might We brainstorming, and areas of intervention for the robot' },
  { src: '/images/luna/13.png', label: 'Robot Design', alt: 'Robot design — designing Luna, success criteria, sketches, material and aesthetic analysis' },
  { src: '/images/luna/14.png', label: 'User Journey', alt: 'User journey mapping through arrival, routine, intellectual stimulation, emotional support, and transition' },
  { src: '/images/luna/15.png', label: 'High-Fidelity Screens', alt: 'Introducing Luna — high-fidelity screens for home, storytelling, and mind-stimulating games' },
  { src: '/images/luna/16.png', label: 'Usability Testing', alt: 'Usability testing — experience sampling method and aspects tested' },
  { src: '/images/luna/17.png', label: 'Reflection', alt: 'Reflection — learnings and future directions' },
]

export function LunaPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((el) => el === entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="luna-page">
      <nav className="luna-toc" aria-label="Section navigation">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.label}
            className={`luna-toc-item${index === activeIndex ? ' luna-toc-item--active' : ''}`}
            onClick={() => scrollToSection(index)}
          >
            <span className="luna-toc-dot" />
            <span className="luna-toc-label">{slide.label}</span>
          </button>
        ))}
      </nav>

      <div className="luna-slides-container">
        {SLIDES.map((slide, index) => (
          <section
            key={index}
            id={`luna-section-${index + 1}`}
            className="luna-slide"
            ref={(el) => { sectionRefs.current[index] = el }}
          >
            <img src={slide.src} alt={slide.alt} />
          </section>
        ))}
      </div>

      <CaseStudyFooter
        nextPath="/case-study/cashless"
        nextTitle="Cashless Equity Ownership"
        nextCover="/images/cashless-cover.png"
      />
    </div>
  )
}
