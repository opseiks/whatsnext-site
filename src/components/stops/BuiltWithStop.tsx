import { BUILT, PARTNERS } from '../../data';

export default function BuiltWithStop() {
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
        <div className="bw-grid">
          {BUILT.map((item, i) => (
            <div key={i} className={`bw-card${item.hero ? ' hero' : ''}`}>
              <div className="bw-card-name">{item.name}</div>
              <div className="bw-card-note">{item.note}</div>
            </div>
          ))}
          {PARTNERS.slice(0, 6).map((name, i) => (
            <div key={`p${i}`} className="bw-card">
              <div className="bw-card-name">{name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
