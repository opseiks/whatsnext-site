import type { Mode } from '../../types';

interface ConnectStopProps {
  mode: Mode;
}

export default function ConnectStop({ mode }: ConnectStopProps) {
  const isOp = mode === 'operator';

  return (
    <section className="stop">
      <div className="cn-bg" />
      <div className="cn-full">
        <div className="eyebrow cn-eyebrow"><span className="tick" /><b>07 / Connect</b><span>Building what's next</span></div>
        <h2 className="cn-title">Building <em>something</em> that shouldn't exist <em>yet?</em></h2>
        <p className="cn-sub">
          We answer every email. Tell us what you're working on — early stage or in market.
          We'll get back inside two business days.
        </p>
        <div className="cn-cta">
          {isOp ? (
            <>
              <a className="cn-btn" href="mailto:info@whatsnext.digital?subject=Operator%20Engagement">
                Engage with us
              </a>
              <a className="cn-btn book" href="https://calendly.com/whatsnext" target="_blank" rel="noreferrer">
                Book a call
              </a>
            </>
          ) : (
            <a className="cn-btn" href="mailto:info@whatsnext.digital?subject=Pitch%20via%20WND">
              Pitch us
            </a>
          )}
        </div>
      </div>
      <div className="cn-tagline">Betting on the people building what's next.</div>
    </section>
  );
}
