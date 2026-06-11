import type { Mode } from '../../types';

const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/whatsnextdigi' },
  { name: 'Twitter', href: 'https://www.twitter.com/whatsnextsocial' },
  { name: 'LinkedIn', href: 'http://www.linkedin.com/company/whatsnextdigital' },
  { name: 'Facebook', href: 'https://www.facebook.com/whatsnextsocial' },
];

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

        {isOp ? (
          <div className="cn-op-stack">
            <h2 className="cn-op-l1">Firsts are our comfort zone.</h2>
            <p className="cn-op-l2">We are most useful when there is no roadmap.</p>
            <p className="cn-op-l2">
              If you are building something that has never existed, you are in the right room.
            </p>
          </div>
        ) : (
          <>
            <h2 className="cn-title">Building <em>something</em> that shouldn't exist yet?</h2>
            <p className="cn-sub">
              We answer every email. Tell us what you are working on.
              Early stage or in market. We will get back inside two business days.
            </p>
          </>
        )}

        <div className="cn-tagline-big">
          Betting on the people building <em>what's next.</em>
        </div>

        <div className="cn-cta">
          {isOp ? (
            <>
              <a className="cn-btn" href="mailto:info@whatsnext.digital?subject=Operator%20Engagement">
                Engage with us
              </a>
              <a
                className="cn-btn book"
                href="https://calendly.com/larry-pacey/30-minute-strategy-call"
                target="_blank"
                rel="noreferrer"
              >
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

      <footer className="cn-footer">
        <span>© 2026 What's Next Digital · Los Angeles, CA</span>
        <nav className="cn-foot-social">
          {SOCIALS.map(s => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer">{s.name}</a>
          ))}
        </nav>
        <a className="cn-foot-right" href="mailto:info@whatsnext.digital">info@whatsnext.digital</a>
      </footer>
    </section>
  );
}
