import type { Mode } from '../../types';

interface EngageStopProps {
  mode: Mode;
}

const CAPITAL_PITCH = 'mailto:info@whatsnext.digital?subject=Pitch%20via%20WND';
const OPERATOR_PITCH = 'mailto:info@whatsnext.digital?subject=Operator%20Engagement';
const OPERATOR_CALENDLY = 'https://calendly.com/larry-pacey/30-minute-strategy-call';

interface IconDef {
  key: string;
  label: string;
  svg: JSX.Element;
}

const OPERATOR_ICONS: IconDef[] = [
  {
    key: 'corp-strategy',
    label: 'Corporate Strategy',
    svg: (
      <svg width="36" height="36" viewBox="-26 -26 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="0" cy="0" r="22" />
        <circle cx="0" cy="0" r="4" />
        <line x1="0" y1="-22" x2="0" y2="-8" />
        <line x1="0" y1="8" x2="0" y2="22" />
        <line x1="-22" y1="0" x2="-8" y2="0" />
        <line x1="8" y1="0" x2="22" y2="0" />
        <polygon points="0,-22 -5,-12 0,-8 5,-12" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'product-mgmt',
    label: 'Product Management',
    svg: (
      <svg width="36" height="36" viewBox="-26 -26 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="-22" y="-18" width="44" height="9" rx="2" />
        <rect x="-22" y="-4" width="44" height="9" rx="2" />
        <rect x="-22" y="10" width="44" height="9" rx="2" />
        <circle cx="-8" cy="-13" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="4" cy="1" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="-2" cy="14.5" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'game-design',
    label: 'Game Design',
    svg: (
      <svg width="36" height="36" viewBox="-26 -26 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="-8" y="-22" width="16" height="16" rx="2" />
        <rect x="-8" y="6" width="16" height="16" rx="2" />
        <rect x="-22" y="-8" width="16" height="16" rx="2" />
        <rect x="6" y="-8" width="16" height="16" rx="2" />
        <circle cx="0" cy="0" r="5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'live-ops',
    label: 'Live Ops',
    svg: (
      <svg width="36" height="36" viewBox="-26 -26 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="-22,0 -12,0 -8,-16 -4,16 0,-8 4,8 8,0 22,0" />
        <circle cx="22" cy="0" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'ai-transformation',
    label: 'AI Transformation',
    svg: (
      <svg width="36" height="36" viewBox="-26 -26 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="0" cy="0" r="5" />
        <circle cx="-18" cy="-12" r="4" />
        <circle cx="18" cy="-12" r="4" />
        <circle cx="-18" cy="12" r="4" />
        <circle cx="18" cy="12" r="4" />
        <line x1="-14" y1="-10" x2="-4" y2="-3" />
        <line x1="14" y1="-10" x2="4" y2="-3" />
        <line x1="-14" y1="10" x2="-4" y2="3" />
        <line x1="14" y1="10" x2="4" y2="3" />
        <line x1="-18" y1="-8" x2="-18" y2="8" />
        <line x1="18" y1="-8" x2="18" y2="8" />
      </svg>
    ),
  },
  {
    key: 'gtm',
    label: 'Go-To-Market',
    svg: (
      <svg width="36" height="36" viewBox="-26 -26 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="0" cy="0" r="18" strokeDasharray="4 3" />
        <line x1="-14" y1="0" x2="14" y2="0" />
        <polyline points="8,-6 14,0 8,6" />
        <line x1="18" y1="-10" x2="18" y2="10" strokeWidth="2" />
        <polyline points="14,-6 22,0 14,6" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'exec-sparring',
    label: 'Executive Sparring',
    svg: (
      <svg width="36" height="36" viewBox="-26 -26 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="-14" y1="16" x2="-4" y2="16" />
        <line x1="-9" y1="16" x2="-9" y2="6" />
        <rect x="-13" y="2" width="8" height="5" rx="1" />
        <circle cx="-9" cy="-2" r="4" />
        <line x1="4" y1="16" x2="14" y2="16" />
        <line x1="9" y1="16" x2="9" y2="6" />
        <rect x="5" y="2" width="8" height="5" rx="1" />
        <circle cx="9" cy="-2" r="4" />
        <line x1="-4" y1="8" x2="4" y2="8" strokeDasharray="2 2" />
      </svg>
    ),
  },
];

export default function EngageStop({ mode }: EngageStopProps) {
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

        <div className="eg-stage">
          {mode === 'operator' ? (
            <div className="eg-op-box">
              <span className="eg-op-nameplate">AS OPERATORS &amp; PARTNERS</span>
              <h3 className="eg-op-stmt">We roll up our sleeves.</h3>
              <p className="eg-op-model">Fractional, project, or retainer.</p>

              <div className="eg-op-icons">
                {OPERATOR_ICONS.map(({ key, label, svg }) => (
                  <div key={key} className="eg-op-icon">
                    <span className="eg-op-icon-glyph">{svg}</span>
                    <span className="eg-op-icon-label">{label}</span>
                  </div>
                ))}
              </div>

              <div className="eg-op-ctas">
                <a className="eg-op-btn eg-op-btn-primary" href={OPERATOR_PITCH}>Engage with us</a>
                <a className="eg-op-btn eg-op-btn-ghost" href={OPERATOR_CALENDLY}>Schedule 30 min kickoff</a>
              </div>
            </div>
          ) : (
            <article className="eg-cap">
              <div className="eg-cap-label">AS INVESTORS</div>
              <h3 className="eg-cap-stmt">We write checks.</h3>
              <div className="eg-cap-rule" />
              <div className="eg-cap-check">Angel through Series B. $50K to $2M.</div>
              <p className="eg-cap-body">We only back what we would build ourselves.</p>
              <a className="eg-cap-btn" href={CAPITAL_PITCH}>Pitch us</a>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
