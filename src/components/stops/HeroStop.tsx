import { useState, useEffect } from 'react';

interface HeroStopProps {
  heroPhase: 1 | 2;
  onAdvance: () => void;
}

export default function HeroStop({ heroPhase, onAdvance }: HeroStopProps) {
  const [l1Vis, setL1Vis] = useState(false);
  const [l2Vis, setL2Vis] = useState(false);
  const [l3Vis, setL3Vis] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setL1Vis(true), 300);
    const t2 = setTimeout(() => setL2Vis(true), 700);
    const t3 = setTimeout(() => setL3Vis(true), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section
      className="stop"
      onClick={heroPhase === 1 ? onAdvance : undefined}
      style={{ cursor: heroPhase === 1 ? 'pointer' : undefined }}
    >
      <div className="hero-bg">
        <video src="/assets/hero-loop.mp4" autoPlay muted loop playsInline />
      </div>
      <div className={`hero-copy${heroPhase === 2 ? ' hero-copy--p2' : ''}`}>
        <div className="hero-l1" style={{ opacity: l1Vis ? 1 : 0 }}>
          AN OPERATOR-LED INVESTMENT &amp; ADVISORY FIRM
        </div>
        <h1 className="hero-l2" style={{ opacity: l2Vis ? 1 : 0 }}>
          The <span className="it">future</span> isn't waiting for permission.
        </h1>
        <p className="hero-l3" style={{ opacity: l3Vis ? 1 : 0 }}>
          We bet on the people building <span className="hero-wn">what's next.</span>
        </p>
      </div>
    </section>
  );
}
