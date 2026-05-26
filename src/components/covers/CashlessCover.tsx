export function CashlessCover() {
  return (
    <div className="cashless-cover">
      {/* Dark navy background */}
      <div className="cashless-cover-bg" />

      {/* Title */}
      <div className="cashless-cover-text">
        <h3 className="cashless-cover-title">CASHLESS<br />EXERCISE</h3>
      </div>

      {/* Tablet mockup */}
      <div className="cashless-cover-device">
        <div className="cashless-device-frame">
          <div className="cashless-device-screen">
            {/* Settlement table mockup */}
            <div className="cashless-screen-header">
              <div className="cashless-screen-nav">
                <div className="cashless-nav-dot" />
                <div className="cashless-nav-dot" />
                <div className="cashless-nav-dot" />
              </div>
              <div className="cashless-screen-title">Settlement</div>
            </div>
            <div className="cashless-screen-tabs">
              <span className="cashless-tab cashless-tab--active">Option Award</span>
              <span className="cashless-tab">Share Award</span>
              <span className="cashless-tab">ESAR Award</span>
            </div>
            <div className="cashless-screen-table">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cashless-table-row">
                  <div className="cashless-table-cell cashless-cell-amount">INR 10,000</div>
                  <div className="cashless-table-cell cashless-cell-method">Cashless Sell to Cover</div>
                  <div className={`cashless-table-badge cashless-badge-${i === 2 ? 'green' : i === 3 ? 'red' : 'yellow'}`}>
                    {i === 2 ? 'Shares Issued' : i === 3 ? 'Disapproved' : 'Pending Sale'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Play indicator */}
      <div className="cashless-cover-play">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Watch Demo</span>
      </div>
    </div>
  )
}
