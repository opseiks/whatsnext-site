import { useState, useEffect, useRef, useCallback } from 'react';
import type { Mode } from '../../types';
import { THESIS } from '../../data';

const CARD_POS = [
  { tx: '-50%', ty: '-50%', rz: 0, sc: 1, z: 10, op: 1 },
  { tx: 'calc(-50% + 40px)', ty: 'calc(-50% + 12px)', rz: 12, sc: 0.87, z: 7, op: 0.88 },
  { tx: 'calc(-50% + 74px)', ty: 'calc(-50% + 26px)', rz: 23, sc: 0.74, z: 4, op: 0.76 },
  { tx: 'calc(-50% - 26px)', ty: 'calc(-50% + 6px)', rz: -8, sc: 0.93, z: 8, op: 0.94 },
];

// Hover spread: pull each card out so every face is partially visible and individually clickable.
const CARD_POS_SPREAD = [
  { tx: '-50%', ty: 'calc(-50% - 6px)', rz: 0, sc: 1, z: 10, op: 1 },
  { tx: 'calc(-50% + 150px)', ty: 'calc(-50% - 4px)', rz: 6, sc: 0.94, z: 7, op: 1 },
  { tx: 'calc(-50% + 268px)', ty: 'calc(-50% + 6px)', rz: 12, sc: 0.88, z: 4, op: 1 },
  { tx: 'calc(-50% - 170px)', ty: 'calc(-50% - 4px)', rz: -6, sc: 0.94, z: 8, op: 1 },
];

const TH_DUR = 12000;

interface ThesisStopProps {
  mode: Mode;
  active: boolean;
}

export default function ThesisStop({ mode, active }: ThesisStopProps) {
  const [thIdx, setThIdx] = useState(0);
  const [cardOrder, setCardOrder] = useState([0, 1, 2, 3]);
  const [cardExiting, setCardExiting] = useState(false);
  const [fanHovered, setFanHovered] = useState(false);
  const thTimerRef = useRef<ReturnType<typeof setInterval>>();
  const editRef = useRef<HTMLDivElement>(null);

  const arr = THESIS[mode === 'neutral' ? 'capital' : mode] || THESIS.capital;

  const advanceCard = useCallback(() => {
    if (cardExiting) return;
    if (mode !== 'operator') {
      setThIdx(i => (i + 1) % arr.length);
      return;
    }
    setCardExiting(true);
    setTimeout(() => {
      setCardOrder(prev => [...prev.slice(1), prev[0]]);
      setCardExiting(false);
    }, 420);
  }, [cardExiting, mode, arr.length]);

  useEffect(() => {
    clearInterval(thTimerRef.current);
    setThIdx(0);
    setCardOrder([0, 1, 2, 3]);
    setCardExiting(false);
    if (active && mode !== 'neutral') {
      thTimerRef.current = setInterval(advanceCard, TH_DUR);
    }
    return () => clearInterval(thTimerRef.current);
  }, [mode, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDotClick = (i: number) => {
    if (i === thIdx) return;
    clearInterval(thTimerRef.current);
    setThIdx(i);
    setCardOrder([i, (i + 1) % 4, (i + 2) % 4, (i + 3) % 4]);
    if (active && mode !== 'neutral') {
      thTimerRef.current = setInterval(advanceCard, TH_DUR);
    }
  };

  // Bring any back card to the front without an exit animation; the CSS
  // transition on .belief-card slides every card into its new slot.
  const jumpToCard = useCallback((dataIdx: number) => {
    if (cardExiting) return;
    setCardOrder(prev => {
      const idx = prev.indexOf(dataIdx);
      if (idx <= 0) return prev;
      return [...prev.slice(idx), ...prev.slice(0, idx)];
    });
    clearInterval(thTimerRef.current);
    if (active && mode !== 'neutral') {
      thTimerRef.current = setInterval(advanceCard, TH_DUR);
    }
  }, [cardExiting, active, mode, advanceCard]);

  const stmt = arr[thIdx];
  const positions = fanHovered ? CARD_POS_SPREAD : CARD_POS;
  const capImg = `thesis-cap-${String(thIdx + 1).padStart(2, '0')}.png`;

  return (
    <section className="stop">
      <div className="thesis-bg" />
      <div className="thesis-full">
        <div className="th-head">
          <div className="eyebrow"><span className="tick" /><b>02 / Thesis</b><span>What we believe</span></div>
          <h2 className="th-title">Principles we don't <em>negotiate.</em></h2>
        </div>

        {/* Capital: editorial unified card. Image fills the card; headline overlays the bottom. */}
        <div className="th-edit" ref={editRef}>
          <article className="th-card">
            <div className="th-card-media">
              <img
                src={`/assets/thesis/${capImg}`}
                alt=""
                className="th-card-img-asset"
              />
            </div>
            <div className="th-card-overlay">
              <div className="th-key">{mode === 'neutral' ? '—' : stmt?.key}</div>
              <div
                className="th-stmt"
                dangerouslySetInnerHTML={{ __html: mode === 'neutral' ? 'Select a track to reveal the thesis.' : (stmt?.stmt ?? '') }}
              />
            </div>
          </article>
          <div className="th-sub">{stmt?.sub}</div>
          <div className="th-nav">
            {arr.map((_, i) => (
              <button
                key={i}
                className={`th-dot${i === thIdx ? ' on' : ''}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </div>

        {/* Operator: card fan. Hover spreads all 4 cards; clicking any card brings it to the front. */}
        <div
          className="th-cards-wrap"
          onMouseEnter={() => setFanHovered(true)}
          onMouseLeave={() => setFanHovered(false)}
        >
          <div className="th-cards">
            {[...cardOrder].reverse().map((dataIdx, visualPos) => {
              const posIdx = cardOrder.length - 1 - visualPos;
              const p = positions[posIdx];
              const isTop = posIdx === 0;
              const s = arr[dataIdx] || arr[0];
              return (
                <div
                  key={dataIdx}
                  className="belief-card"
                  data-pos={posIdx}
                  style={{
                    transform: isTop && cardExiting
                      ? 'translate(calc(-50% - 90%), calc(-50% + 18%)) rotateZ(-22deg) scale(0.65)'
                      : `translate(${p.tx}, ${p.ty}) rotateZ(${p.rz}deg) scale(${p.sc})`,
                    zIndex: p.z,
                    opacity: isTop && cardExiting ? 0 : p.op,
                    transition: cardExiting && isTop ? 'transform .38s cubic-bezier(.6,0,1,.6), opacity .38s ease' : undefined,
                  }}
                  onClick={isTop ? advanceCard : () => jumpToCard(dataIdx)}
                >
                  <div className="card-img">
                    <img
                      src={`/assets/thesis/thesis-op-${String(dataIdx + 1).padStart(2, '0')}.png`}
                      alt=""
                      className="card-img-asset"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null;
                        if (sibling) sibling.removeAttribute('style');
                      }}
                    />
                    <div className="card-img-hint" style={{ display: 'none' }}>{`thesis-op-${String(dataIdx + 1).padStart(2, '0')}.png`}</div>
                  </div>
                  <div className="card-content">
                    <div className="card-key">{s.key}</div>
                    <div className="card-stmt">{s.stmt.replace(/<[^>]*>/g, '')}</div>
                    <div className="card-sub">{s.sub}</div>
                    {isTop && <div className="card-ctr">TAP TO DEAL ►</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
