import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/incite.css'

const imgImage287 = "/images/incite/image 287.png"
const imgImage351 = "/images/incite/image 351.png"
const imgLayer1 = "/images/incite/Layer_1.png"
const imgRectangle34626181 = "/images/incite/Rectangle 34626182.png"
const imgVector8763 = "/images/incite/image 357.svg"
const imgRectangle34626179 = "https://www.figma.com/api/mcp/asset/759d61cd-3a28-40b4-8f3a-758cd1c34964"
const imgDecor964 = "https://www.figma.com/api/mcp/asset/95c25c39-6de7-4325-b9d5-034602176ea9"
const imgDecor965 = "https://www.figma.com/api/mcp/asset/c174a646-2da1-479b-bb0a-e23359b96268"
const imgDecor963 = "https://www.figma.com/api/mcp/asset/c145487f-afaa-45a5-a981-ef1cdaef95af"
const imgCornerEllipse965 = "https://www.figma.com/api/mcp/asset/7aa2c854-de76-41f0-8904-2a1feb302024"
const imgCornerEllipse964 = "https://www.figma.com/api/mcp/asset/bfb66dc8-cc86-4b26-8cc5-30d94d131b99"
const imgCornerEllipse963 = "https://www.figma.com/api/mcp/asset/e8f635a7-0f22-42f2-9748-3a8746085f73"
const imgResearch966 = "https://www.figma.com/api/mcp/asset/6bc7d5f6-ee63-45b5-8753-4873125e8b00"
const imgResearch965 = "https://www.figma.com/api/mcp/asset/709920d6-249c-439d-93c4-a19164d7387f"
const imgResearch963 = "https://www.figma.com/api/mcp/asset/40bea66c-d127-4277-9da3-f3bd65a44a41"
const imgProcess965 = "https://www.figma.com/api/mcp/asset/c2ac6055-7ed4-4e44-ab95-a27cddcf8b8c"
const imgProcess964 = "https://www.figma.com/api/mcp/asset/a007f3c2-53ba-4c32-b8a0-e798765dd232"
const imgProcess963 = "https://www.figma.com/api/mcp/asset/bfddee79-9729-4478-89f8-39a6eb64d13e"
const imgDot975 = "https://www.figma.com/api/mcp/asset/c94e606f-776e-4870-b3fb-f977eb22520f"
const imgDot976 = "https://www.figma.com/api/mcp/asset/a9280a70-3aa8-4597-b716-6b29818b569a"
const imgDot977 = "https://www.figma.com/api/mcp/asset/f5809597-59cb-4f74-a69d-20da2650cd71"

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
          <div className="incite-ellipse incite-ellipse-1"></div>
          <div className="incite-ellipse incite-ellipse-2"></div>
          <div className="incite-ellipse incite-ellipse-3"></div>
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

        <div className="incite-section-5-corner">
          <img className="incite-corner-ellipse-large" alt="" src={imgCornerEllipse965} />
          <img className="incite-corner-ellipse-medium" alt="" src={imgCornerEllipse964} />
          <img className="incite-corner-ellipse-small" alt="" src={imgCornerEllipse963} />
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

      {/* Section 7: Problem & Solution */}
      <section className="incite-section-7">
        <div className="incite-section-7-left">
          <p className="incite-section-7-label">Problem</p>
          <p className="incite-section-7-text">
            In today's fast-paced world, people buy products without knowing their contents, leading to health problems. This applies to daily use items, and the consequences can affect health in the short or long term. Achieving a healthy and sustainable lifestyle requires dedication and time. Despite the desire to make better choices, lack of knowledge and effort can be significant barriers.
          </p>
        </div>
        <div className="incite-section-7-right">
          <p className="incite-section-7-solution-label">Solution</p>
          <p className="incite-section-7-solution-text">
            Incite is a platform that facilitates ingredient analysis and note making for research purposes.
          </p>
        </div>
      </section>

      {/* Section 8: Primary Research */}
      <section className="incite-section-8">
        <div className="incite-section-8-header">
          <h2 className="incite-section-8-title">Primary research</h2>
          <p className="incite-section-8-description">
            Primary research guarantees that the information collected is up-to-date and relevant. The process started with secondary research, followed by quantitative research via survey and qualitative research like contextual inquiry
          </p>
        </div>

        <div className="incite-section-8-objectives">
          <h3 className="incite-section-8-subtitle">Key Research Objectives</h3>
          <div className="incite-section-8-cards-grid">
            <div className="incite-section-8-card">
              <p className="incite-section-8-card-text">To understand consumers' awareness and consequences of any form of consumption</p>
              <p className="incite-section-8-card-method">Interview</p>
            </div>
            <div className="incite-section-8-card">
              <p className="incite-section-8-card-text">To understand why people incline towards certain brands</p>
              <p className="incite-section-8-card-method">Triading</p>
            </div>
            <div className="incite-section-8-card">
              <p className="incite-section-8-card-text">To understand what people look for when they purchase a product</p>
              <p className="incite-section-8-card-method">Shadowing</p>
            </div>
            <div className="incite-section-8-card">
              <p className="incite-section-8-card-text">To identify difficulties while going through the product details</p>
              <p className="incite-section-8-card-method">Interview</p>
            </div>
            <div className="incite-section-8-card">
              <p className="incite-section-8-card-text">To identify family memebers who put in an effort to go through the entire product.</p>
              <p className="incite-section-8-card-method">Interview</p>
            </div>
            <div className="incite-section-8-card">
              <p className="incite-section-8-card-text"></p>
              <p className="incite-section-8-card-method"></p>
            </div>
          </div>
        </div>

        <div className="incite-section-8-domains">
          <h3 className="incite-section-8-subtitle">Key Domains of Research</h3>
          <div className="incite-section-8-tags-grid">
            <div className="incite-section-8-tag">Fssai guidelines</div>
            <div className="incite-section-8-tag">Health hazards</div>
            <div className="incite-section-8-tag">Preservatives & Chemicals</div>
            <div className="incite-section-8-tag">Medicated Products</div>
            <div className="incite-section-8-tag">Cosmetics & Medicines</div>
            <div className="incite-section-8-tag">Deceptive Branding</div>
            <div className="incite-section-8-tag">Fortified Foods</div>
            <div className="incite-section-8-tag">Baby Products</div>
            <div className="incite-section-8-tag">Pet Products</div>
            <div className="incite-section-8-tag">Ayurvedic Products</div>
          </div>
        </div>

        <div className="incite-section-8-decorative">
          <img className="incite-section-8-ellipse-large" alt="" src={imgResearch966} />
          <img className="incite-section-8-ellipse-medium" alt="" src={imgResearch965} />
          <img className="incite-section-8-ellipse-small" alt="" src={imgResearch963} />
        </div>
      </section>

      {/* Section 9: Research Process */}
      <section className="incite-section-9">
        <div className="incite-section-9-header">
          <h2 className="incite-section-9-title">Research Process</h2>
          <p className="incite-section-9-description">
            Primary research guarantees that the information collected is up-to-date and relevant. The process started with secondary research, followed by quantitative research via survey and qualitative research like contextual inquiry
          </p>
        </div>

        <div className="incite-section-9-stages">
          <div className="incite-section-9-stage">
            <h3 className="incite-section-9-stage-title">User Research</h3>
            <div className="incite-section-9-circles">
              <img alt="" src={imgProcess965} />
              <img alt="" src={imgProcess964} />
              <img alt="" src={imgProcess963} />
            </div>
            <div className="incite-section-9-items">
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot975} />
                <span>Survey</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot975} />
                <span>Contextual Inquiry</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot975} />
                <span>Shadowing</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot975} />
                <span>Triading</span>
              </div>
            </div>
          </div>

          <div className="incite-section-9-stage">
            <h3 className="incite-section-9-stage-title">Secondary Study</h3>
            <div className="incite-section-9-circles">
              <img alt="" src={imgProcess965} />
              <img alt="" src={imgProcess964} />
              <img alt="" src={imgProcess963} />
            </div>
            <div className="incite-section-9-items">
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot976} />
                <span>Literature Review</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot976} />
                <span>Stakeholder Map</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot976} />
                <span>Competitive Analysis</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot976} />
                <span>Market Analysis</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot976} />
                <span>Technical Considerations</span>
              </div>
            </div>
          </div>

          <div className="incite-section-9-stage">
            <h3 className="incite-section-9-stage-title">Analysis</h3>
            <div className="incite-section-9-circles">
              <img alt="" src={imgProcess965} />
              <img alt="" src={imgProcess964} />
              <img alt="" src={imgProcess963} />
            </div>
            <div className="incite-section-9-items">
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot977} />
                <span>Data Analysis</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot977} />
                <span>Value Opportunity Analysis</span>
              </div>
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot977} />
                <span>Laddering</span>
              </div>
            </div>
          </div>

          <div className="incite-section-9-stage">
            <h3 className="incite-section-9-stage-title">Insights</h3>
            <div className="incite-section-9-circles">
              <img alt="" src={imgProcess965} />
              <img alt="" src={imgProcess964} />
              <img alt="" src={imgProcess963} />
            </div>
            <div className="incite-section-9-items">
              <div className="incite-section-9-item">
                <img alt="" className="incite-section-9-dot" src={imgDot977} />
                <span>Pain Points</span>
              </div>
            </div>
          </div>
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
