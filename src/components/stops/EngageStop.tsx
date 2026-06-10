import type { Mode } from '../../types';

interface EngageStopProps {
  mode: Mode;
}

export default function EngageStop({ mode }: EngageStopProps) {
  const opActive = mode === 'operator';
  const capActive = mode === 'capital';

  return (
    <section className="stop">
      <div className="engage-bg" />
      <div className="engage-full">
        <div className="eg-head">
          <div className="eyebrow"><span className="tick" /><b>05 / Engage</b><span>How we work with you</span></div>
          <h2 className="eg-title">We invest <em>time</em> before we invest capital.</h2>
          <p className="eg-body">
            Every engagement starts the same way. We get close to the work. Game design, product
            strategy, go-to-market, live ops. If we see something worth backing with capital, we go
            deeper. If not, you still walk away with senior operator attention that most firms charge
            fund fees for.
          </p>
        </div>
        <div className="eg-cards">
          <div className={`eg-card op-card${opActive ? ' eg-active' : capActive ? ' eg-inactive' : ''}`}>
            <div className="eg-card-role">as <em>operators &amp; partners</em></div>
            <div className="eg-card-stmt">We roll up our sleeves.</div>
            <div className="eg-card-desc">
              Fractional, project, or retainer. Corporate strategy,
              product management, game design, live ops, AI transformation,
              go-to-market, executive sparring.
            </div>
            <button className="eg-card-btn">Engage with us</button>
          </div>
          <div className={`eg-card cap-card${capActive ? ' eg-active' : opActive ? ' eg-inactive' : ''}`}>
            <div className="eg-card-role">as <em>investors</em></div>
            <div className="eg-card-stmt">We write checks.</div>
            <div className="eg-card-desc">
              Angel through Series B. $50K to $2M.
              We only back what we would build ourselves.
            </div>
            <button className="eg-card-btn">Pitch us</button>
          </div>
        </div>
      </div>
    </section>
  );
}
