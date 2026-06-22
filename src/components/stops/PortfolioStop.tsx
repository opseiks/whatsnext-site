import { useEffect, useRef } from 'react';
import { DOMAINS } from '../../data';

export default function PortfolioStop() {
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const videos = videosRef.current.filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const video = entry.target as HTMLVideoElement;
          observer.unobserve(video);
          video.preload = 'auto';
          video.load();
          video.play().catch(() => {});
        }
      },
      { rootMargin: '200px' },
    );

    for (const v of videos) observer.observe(v);
    return () => observer.disconnect();
  }, []);

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
              <video
                ref={(el) => { videosRef.current[i] = el; }}
                className="pcard-video"
                src={d.video}
                preload="none"
                muted loop playsInline
                onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
              />
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
