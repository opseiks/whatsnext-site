import { PRACTICE } from '../../data';

export default function PracticeStop() {
  return (
    <section className="stop">
      <div className="practice-bg" />
      <div className="practice-full">
        <div className="pr-head">
          <div className="eyebrow"><span className="tick" /><b>04 / Practice</b><span>Where we get our hands dirty</span></div>
          <h2 className="pr-title">Where we get our <em>hands dirty.</em></h2>
        </div>
        <div className="pr-list">
          {PRACTICE.map((p, i) => (
            <div key={i} className="pr-item">
              <div className="pr-num">/{p.num}</div>
              <div className="pr-name">{p.name} <em>{p.em}</em></div>
              <button className="pr-arrow">→</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
