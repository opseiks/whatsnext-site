import { DOMAINS } from '../../data';

export default function PortfolioStop() {
  return (
    <section className="stop">
      <div className="portfolio-bg" />
      <div className="portfolio-full">
        <div className="pf-head">
          <div className="eyebrow"><span className="tick" /><b>03 / Portfolio</b><span>What we are into</span></div>
          <h2 className="pf-title">Things we're <em>into.</em></h2>
        </div>
        <div className="pcards">
          {DOMAINS.map((d, i) => (
            <div key={i} className="pcard" style={{ background: d.bg }}>
              <div className="ptag-pill"><span className="pdot" />{d.tag}</div>
              <div className="pcard-inner">
                <div className="pname">{d.name}</div>
                <div className="pdesc">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
