const CALENDLY_URL = 'https://calendly.com/sricherry-tweety/30min'

/** A standing invite to book time directly — shown once per page, right
 *  before the footer, on the home, about, and resume pages. */
export function LetsTalk() {
  return (
    <section className="lets-talk-section">
      <p className="lt-eyebrow">Got something in mind?</p>
      <h2 className="lt-heading">Let&rsquo;s Talk</h2>
      <p className="lt-sub">
        Grab 30 minutes on my calendar — I&rsquo;d love to hear what you&rsquo;re working on.
      </p>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="lt-calendly-btn"
      >
        <span className="lt-calendly-btn-inner">
          Book a Call
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1.5 5.5h11" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4 1v2.2M10 1v2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
      </a>
    </section>
  )
}
