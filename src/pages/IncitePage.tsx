import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/incite.css'

const imgImage287 = "http://localhost:3845/assets/b3da09f776ee9b2deb58d4b45ecd6b81aacd8b00.png"
const imgImage351 = "http://localhost:3845/assets/955f2d7673c78307e4588f4cbcb74c0d45b49042.png"
const imgLayer1 = "http://localhost:3845/assets/b0ad763b8fac71563b2da3ab2f70ea4f385f954a.svg"
const imgEllipse965 = "http://localhost:3845/assets/b74f068aa81534afbf3db9b27f923599956e8bd9.svg"
const imgEllipse964 = "http://localhost:3845/assets/7ee3f28521d6edf7be129095dd4062409cfeacf4.svg"
const imgEllipse963 = "http://localhost:3845/assets/ffc851568e0afce8058d5ca21246b9d8ef0ff31d.svg"
const imgRectangle34626181 = "http://localhost:3845/assets/8ab1235a0be4de80beb3d01a806eaef875cafc76.png"
const imgVector8763 = "http://localhost:3845/assets/31cff0cd4de37711a62f89b5d97996b66bfe5fd2.svg"
const imgRectangle34626179 = "https://www.figma.com/api/mcp/asset/759d61cd-3a28-40b4-8f3a-758cd1c34964"
const imgDecor964 = "https://www.figma.com/api/mcp/asset/95c25c39-6de7-4325-b9d5-034602176ea9"
const imgDecor965 = "https://www.figma.com/api/mcp/asset/c174a646-2da1-479b-bb0a-e23359b96268"
const imgDecor963 = "https://www.figma.com/api/mcp/asset/c145487f-afaa-45a5-a981-ef1cdaef95af"

export function IncitePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="incite-page">
      {/* Section 1: Header */}
      <section className="incite-section-1">
        {/* Left: Logo & Text */}
        <div className="incite-section-1-text">
          <p className="incite-section-1-title">In;cite</p>
          <p className="incite-section-1-subtitle">
            User Experience & User Interface Design
          </p>
        </div>

        {/* Right: Images */}
        <div className="incite-section-1-images">
          {/* Image 287 - Lexus Design Award */}
          <div className="incite-award-1">
            <img
              alt="Lexus Design Award"
              src={imgImage287}
            />
          </div>

          {/* Image 351 */}
          <div className="incite-award-2">
            <img
              alt="Award"
              src={imgImage351}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Challenge */}
      <section className="incite-section-2">
        {/* Left: Headline */}
        <div className="incite-section-2-content">
          <h2 className="incite-section-2-headline">
            Do you check the ingredients of the products you use?
          </h2>
        </div>

        {/* Right: Logo/Badge */}
        <div className="incite-section-2-badge">
          <img
            alt="In;cite"
            src={imgLayer1}
          />
        </div>
      </section>

      {/* Section 3: Timeline/Competition */}
      <section className="incite-section-3">
        <div className="incite-section-3-decorative">
          <img className="incite-ellipse incite-ellipse-1" alt="" src={imgEllipse965} />
          <img className="incite-ellipse incite-ellipse-2" alt="" src={imgEllipse964} />
          <img className="incite-ellipse incite-ellipse-3" alt="" src={imgEllipse963} />
        </div>
        <h3 className="incite-section-3-text">First Design Competition</h3>
      </section>

      {/* Section 4: Image Grid & Text */}
      <section className="incite-section-4">
        <div className="incite-section-4-grid">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="incite-grid-item">
              <img alt="Ingredient" src={imgRectangle34626181} />
            </div>
          ))}
        </div>

        <div className="incite-section-4-text">
          <p className="incite-section-4-text-1">
            We look into what goes in a skincare and beauty products
          </p>

          <img className="incite-section-4-arrow" alt="" src={imgVector8763} />

          <p className="incite-section-4-text-2">
            But, what about what goes inside what we eat and drink ? Have you given it a thought?
          </p>
        </div>
      </section>

      {/* Section 5: Context & Story */}
      <section className="incite-section-5">
        <div className="incite-section-5-left">
          <div className="incite-section-5-block">
            <p className="incite-section-5-label">Setting the context for you</p>
            <p className="incite-section-5-text">
              Our skin conditions led us to the product we were working on
            </p>
          </div>
          <p className="incite-section-5-paragraph">
            We ourselves started looking into the ingredients of skincare and beauty products because of our skin conditions and that changed the way we look at manufactured consumables.
          </p>
        </div>

        <div className="incite-section-5-center">
          <img alt="Skincare product" src={imgRectangle34626179} />
        </div>

        <div className="incite-section-5-right">
          <div className="incite-section-5-accent" />
          <p className="incite-section-5-text-right">
            We realised, even though people want to shift to healthier options, the effort that goes behind research can get taxing
          </p>
        </div>

        <div className="incite-section-5-decorative">
          <img className="incite-ellipse-large" alt="" src={imgDecor964} />
          <img className="incite-ellipse-medium" alt="" src={imgDecor965} />
          <img className="incite-ellipse-small" alt="" src={imgDecor963} />
        </div>
      </section>

      {/* Section 6: Project Overview */}
      <section className="incite-section-6">
        <div className="incite-section-6-left">
          <div className="incite-section-6-item">
            <p className="incite-section-6-label">Submitted For</p>
            <p className="incite-section-6-value">Lexus Design Awards, India</p>
          </div>
          <div className="incite-section-6-item">
            <p className="incite-section-6-label">Project Year</p>
            <p className="incite-section-6-value">2023-24</p>
          </div>
          <div className="incite-section-6-item">
            <p className="incite-section-6-label">Project Duration</p>
            <p className="incite-section-6-value">2 months</p>
          </div>
        </div>

        <div className="incite-section-6-middle">
          <p className="incite-section-6-label">Team & Contribution</p>
          <p className="incite-section-6-team">Sri Cherry - UX | Research</p>
          <p className="incite-section-6-team">Anjani - Research | Branding</p>
        </div>

        <div className="incite-section-6-right">
          <p className="incite-section-6-label">Overview</p>
          <p className="incite-section-6-overview">
            Incite, an AI-based website and app optimised for all kinds of shoppers: online/offline who are willing to bring about a healthy change in life.
          </p>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="incite-footer">
        <Link to="/" className="incite-back-link">
          ← Back to Portfolio
        </Link>
      </footer>
    </div>
  )
}
