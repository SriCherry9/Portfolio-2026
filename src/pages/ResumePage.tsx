import { GardenFooter } from '../components/GardenFooter'

export function ResumePage() {
  return (
    <>
      <section className="resume-section">
        <div className="resume-header-row">
          <p className="resume-kicker">Resume</p>
          <a href="/resume.pdf" download className="resume-download">Download PDF</a>
        </div>
        <div className="resume-frame-wrap">
          <iframe src="/resume.pdf" title="Sri Cherry Kotamreddy — Resume" className="resume-frame" />
        </div>
      </section>
      <GardenFooter />
    </>
  )
}
