import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import '../styles/luna.css'

const SLIDES: { src: string; alt: string }[] = [
  { src: '/images/luna/1.png', alt: 'Luna — Human Robot Interaction and Robot Design, a research-driven exploration into alleviating loneliness for hospitalized in-patients' },
  { src: '/images/luna/2.png', alt: 'Problem — loneliness during hospitalization undermines recovery, broken down with the 5W framework' },
  { src: '/images/luna/3.png', alt: 'Goal statement and hypothesis — introducing a social robot companion to enhance mental health and recovery' },
  { src: '/images/luna/4.png', alt: 'Research objectives — exploring social interaction, interventions, feasibility, and causes of loneliness' },
  { src: '/images/luna/5.png', alt: 'Research process — primary and secondary research, synthesis, and ideation' },
  { src: '/images/luna/6.png', alt: 'Key insights — social robots must be relational rather than transactional, and movement design builds companionship' },
  { src: '/images/luna/7.png', alt: 'Secondary research and field studies — literature review and quantitative data on patient loneliness' },
  { src: '/images/luna/8.png', alt: 'Competitor takeaways on relational social robots and expressive movement' },
  { src: '/images/luna/9.png', alt: 'Technical consideration — how to build a robot, tech research synthesis across AI, ML, NLP, and sensors' },
  { src: '/images/luna/10.png', alt: 'Pain points and insights for hospitalized patients — limited social interaction, separation from family, unfamiliar environment' },
  { src: '/images/luna/11.png', alt: 'Personas — Vyasa and Abhinay, who we are designing for' },
  { src: '/images/luna/12.png', alt: 'Ideation — How Might We brainstorming, and areas of intervention for the robot' },
  { src: '/images/luna/13.png', alt: 'Robot design — designing Luna, success criteria, sketches, material and aesthetic analysis' },
  { src: '/images/luna/14.png', alt: 'User journey mapping through arrival, routine, intellectual stimulation, emotional support, and transition' },
  { src: '/images/luna/15.png', alt: 'Introducing Luna — high-fidelity screens for home, storytelling, and mind-stimulating games' },
  { src: '/images/luna/16.png', alt: 'Usability testing — experience sampling method and aspects tested' },
  { src: '/images/luna/17.png', alt: 'Reflection — learnings and future directions' },
]

export function LunaPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="luna-page">
      <div className="luna-slides-container">
        {SLIDES.map((slide, index) => (
          <section key={index} className="luna-slide">
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
