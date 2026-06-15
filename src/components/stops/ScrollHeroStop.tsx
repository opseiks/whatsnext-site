import { useEffect, useRef, useState } from 'react';

interface ScrollHeroStopProps {
  onSetMode: (m: 'capital' | 'operator') => void;
  modeChosen: boolean;
}

export default function ScrollHeroStop({ onSetMode, modeChosen }: ScrollHeroStopProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [dissolving, setDissolving] = useState(false);

  const handleSelect = (m: 'capital' | 'operator') => {
    onSetMode(m);
    setDissolving(true);
    const proofEl = document.querySelectorAll('.stop')[1];
    if (proofEl) {
      proofEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll-driven panel dissolve when user scrolls without choosing
  useEffect(() => {
    if (modeChosen) return;
    const section = sectionRef.current;
    const panel = panelRef.current;
    const chip = chipRef.current;
    if (!section || !panel || !chip) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const sectionH = rect.height;
      if (scrolled <= 0) {
        panel.style.opacity = '';
        panel.style.transform = '';
        chip.style.opacity = '';
        chip.style.transform = '';
        return;
      }
      // Panel fades out in the first 50% of scroll-out
      const panelProgress = Math.min(scrolled / (sectionH * 0.5), 1);
      panel.style.opacity = String(1 - panelProgress);
      panel.style.transform = `translateY(${panelProgress * 20}px) scale(${1 - panelProgress * 0.15})`;
      // Chip fades and shrinks in the first 70% of scroll-out
      const chipProgress = Math.min(scrolled / (sectionH * 0.7), 1);
      chip.style.opacity = String(1 - chipProgress);
      chip.style.transform = `scale(${1 - chipProgress * 0.6})`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [modeChosen]);

  const panelHidden = modeChosen || dissolving;

  return (
    <section className="stop scroll-hero" ref={sectionRef}>
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
          We bet on the people<br />building <span className="sh-wn">what's next.</span>
        </p>
      </div>

      <div className={`sh-panel-area${panelHidden ? ' sh-dissolve' : ''}`}>
        <div className="sh-chip" ref={chipRef}>
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

        <div className="sh-panel-box" ref={panelRef}>
          <div className="sh-panel-accent" />
          <h3 className="sh-headline">
            First — <span className="aword">what brings you in?</span>
          </h3>
          <div className="sh-choices">
            <button className="sh-choice" onClick={() => handleSelect('capital')}>
              <span className="sh-choice-inner">
                <span className="sh-choice-title">I'm raising capital</span>
                <span className="sh-choice-sub">Pre-seed $50K-$250K · Series rounds up to $2M</span>
              </span>
              <span className="sh-choice-arrow">→</span>
            </button>
            <button className="sh-choice" onClick={() => handleSelect('operator')}>
              <span className="sh-choice-inner">
                <span className="sh-choice-title">I need a product and operator partner</span>
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
