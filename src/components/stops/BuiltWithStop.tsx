import { lazy, Suspense, useState } from 'react';
import type { Mode, PartnerLogo } from '../../types';
import { PARTNER_LOGOS } from '../../data';

/* The Three.js ring only loads when operator mode actually renders it. */
const BuiltWithRing = lazy(() => import('./BuiltWithRing'));

interface BuiltWithStopProps {
  mode: Mode;
  active: boolean;
}

/* Logo image with graceful fallback: if the PNG is missing the company name
   renders as accent-colored text instead. The layout never breaks. */
function Logo({ partner }: { partner: PartnerLogo }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="bwb-fallback">{partner.name}</span>;
  return (
    <img
      className="bwb-logo"
      src={partner.src}
      alt={partner.name}
      onError={() => setFailed(true)}
    />
  );
}

export default function BuiltWithStop({ mode, active }: BuiltWithStopProps) {
  return (
    <section className="stop">
      <div className="bw-bg" />
      <div className="bw-full">
        <div className="bw-head">
          <div className="eyebrow"><span className="tick" /><b>06 / Built With</b><span>People we have built with</span></div>
          <h2 className="bw-title">People we've <em>built with.</em></h2>
          <p className="bw-sub">
            Senior engagements, active partnerships, and companies where we had skin in the game.
          </p>
        </div>

        {mode === 'operator' ? (
          <div className="bw-stage">
            <Suspense fallback={null}>
              <BuiltWithRing active={active} />
            </Suspense>
          </div>
        ) : (
          <div className="bwb-surface">
            <div className="bwb-grid">
              {PARTNER_LOGOS.map(partner => (
                <div className="bwb-cell" key={partner.name}>
                  <div className="bwb-card"><Logo partner={partner} /></div>
                  <div className="bwb-reflect-clip" aria-hidden="true">
                    <div className="bwb-reflect"><Logo partner={partner} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
