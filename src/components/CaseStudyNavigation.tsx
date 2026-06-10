import { Link, useLocation } from 'react-router-dom'

interface CaseStudy {
  id: number
  title: string
  category: string
  accentColor: string
  caseStudyPath: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 0,
    title: 'AI Product Strategy',
    category: 'AI · Product Strategy',
    accentColor: '#7B68EE',
    caseStudyPath: '/case-study/ai-product-strategy',
  },
  {
    id: 1,
    title: 'Cashless Equity Ownership',
    category: 'Fintech · B2B SaaS',
    accentColor: '#B8E4C9',
    caseStudyPath: '/case-study/cashless',
  },
  {
    id: 2,
    title: 'Museo — Broadcast Auction',
    category: 'B2B2C · Design System',
    accentColor: '#C4A96A',
    caseStudyPath: '/case-study/museo',
  },
  {
    id: 6,
    title: 'In;cite — Ingredient Intelligence',
    category: 'Consumer · Product Design',
    accentColor: '#840FF1',
    caseStudyPath: '/case-study/incite',
  },
  {
    id: 3,
    title: 'Onboarding Redesign',
    category: 'Mobile · Consumer',
    accentColor: '#D3D872',
    caseStudyPath: '/case-study/onboarding',
  },
  {
    id: 4,
    title: 'Inclusive Search & Discovery',
    category: 'Accessibility · Gov',
    accentColor: '#FFFBE6',
    caseStudyPath: '/case-study/search-discovery',
  },
  {
    id: 5,
    title: 'Zero-to-One Health Platform',
    category: 'Product · Strategy',
    accentColor: '#E7C1E5',
    caseStudyPath: '/case-study/health-platform',
  },
]

export function CaseStudyNavigation() {
  const location = useLocation()
  const currentPath = location.pathname

  const currentIndex = CASE_STUDIES.findIndex(cs => cs.caseStudyPath === currentPath)
  const nextStudy = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length]
  const prevStudy = CASE_STUDIES[(currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length]

  return (
    <nav className="case-study-navigation">
      <div className="case-study-nav-container">
        {/* Back to Portfolio */}
        <Link to="/" className="case-study-nav-home">
          <span className="case-study-nav-arrow">←</span>
          Back to Portfolio
        </Link>

        {/* Navigation divider */}
        <div className="case-study-nav-divider"></div>

        {/* Previous Case Study */}
        <Link to={prevStudy.caseStudyPath} className="case-study-nav-link case-study-nav-prev">
          <div className="case-study-nav-label">Previous Case Study</div>
          <div className="case-study-nav-title" style={{ color: prevStudy.accentColor }}>
            {prevStudy.title}
          </div>
          <div className="case-study-nav-category">{prevStudy.category}</div>
          <span className="case-study-nav-arrow">←</span>
        </Link>

        {/* Next Case Study */}
        <Link to={nextStudy.caseStudyPath} className="case-study-nav-link case-study-nav-next">
          <div className="case-study-nav-label">Next Case Study</div>
          <div className="case-study-nav-title" style={{ color: nextStudy.accentColor }}>
            {nextStudy.title}
          </div>
          <div className="case-study-nav-category">{nextStudy.category}</div>
          <span className="case-study-nav-arrow">→</span>
        </Link>
      </div>

      {/* All Case Studies Grid */}
      <div className="case-study-nav-all">
        <div className="case-study-nav-grid-label">Explore Other Case Studies</div>
        <div className="case-study-nav-grid">
          {CASE_STUDIES.map((study) => (
            <Link
              key={study.id}
              to={study.caseStudyPath}
              className={`case-study-nav-card ${currentPath === study.caseStudyPath ? 'active' : ''}`}
            >
              <div className="case-study-nav-card-dot" style={{ backgroundColor: study.accentColor }}></div>
              <div className="case-study-nav-card-title">{study.title}</div>
              <div className="case-study-nav-card-category">{study.category}</div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
