interface ScrollHeroStopProps {
  onSetMode: (m: 'capital' | 'operator') => void;
}

export default function ScrollHeroStop({ onSetMode }: ScrollHeroStopProps) {
  const handleSelect = (m: 'capital' | 'operator') => {
    onSetMode(m);
    const proofEl = document.querySelectorAll('.stop')[1];
    if (proofEl) {
      proofEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="stop scroll-hero">
      <div className="hero-bg">
        <video src="/assets/hero/hero-loop.mp4" autoPlay muted loop playsInline />
      </div>

      <div className="sh-copy">
        <div className="hero-l1" style={{ opacity: 1 }}>
          AN OPERATOR-LED INVESTMENT &amp; ADVISORY FIRM
        </div>
        <h1 className="hero-l2" style={{ opacity: 1 }}>
          The <span className="it">future</span> isn't waiting for permission.
        </h1>
        <p className="sh-subhead">
          We bet on the people building <span className="sh-wn">what's next.</span>
        </p>
      </div>

      <div className="sh-panel-area">
        <div className="sh-chip">
          <div className="sh-chip-bob">
            <img
              className="sh-chip-img"
              src="assets/chip-wnd-f.png"
              alt="Chippy"
            />
            <div className="sh-chip-spec" />
          </div>
          <div className="sh-chip-shadow" />
        </div>

        <div className="sh-panel-box">
          <div className="sh-panel-accent" />
          <h3 className="sh-headline">
            First — <span className="aword">what brings you in?</span>
          </h3>
          <div className="sh-choices">
            <button className="sh-choice" onClick={() => handleSelect('capital')}>
              <span className="sh-choice-inner">
                <span className="sh-choice-title">I'm raising capital</span>
                <span className="sh-choice-sub">Pre-seed $50K–$250K · Series rounds up to $2M</span>
              </span>
              <span className="sh-choice-arrow">→</span>
            </button>
            <button className="sh-choice" onClick={() => handleSelect('operator')}>
              <span className="sh-choice-inner">
                <span className="sh-choice-title">I need an operator partner</span>
                <span className="sh-choice-sub">Fractional · project · retainer</span>
              </span>
              <span className="sh-choice-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
