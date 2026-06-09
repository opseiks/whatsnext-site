export default function HeroStop() {
  return (
    <section className="stop">
      <div className="hero-bg">
        <video src="/assets/hero-loop.mp4" autoPlay muted loop playsInline />
        <div className="hero-tint" />
      </div>
      <div className="copy-l">
        <div className="eyebrow">
          <span className="tick" />
          <b>00 / Hero</b>
          <span>What's Next Digital</span>
        </div>
        <h1>The <span className="it">future</span> isn't waiting for permission.</h1>
        <p className="sub">
          An operator-led investment &amp; advisory firm for games, AI, and interactive entertainment.
          Twenty years shipped. One serious room — for founders raising, and operators who need a
          partner who's actually built it.
        </p>
      </div>
    </section>
  );
}
