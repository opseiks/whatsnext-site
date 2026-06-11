import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Mode } from '../../types';
import { PRACTICE, PRACTICE_OP } from '../../data';

interface PracticeStopProps {
  mode: Mode;
  active: boolean;
}

const MAX_TILT_X = 6;
const MAX_TILT_Y = 8;
const LERP = 0.08;

export default function PracticeStop({ mode, active }: PracticeStopProps) {
  const [listIn, setListIn] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Capital list: trigger stagger once per arrival (or mode flip into capital).
  useEffect(() => {
    if (active && mode !== 'operator') {
      setListIn(false);
      const t = setTimeout(() => setListIn(true), 50);
      return () => clearTimeout(t);
    }
    setListIn(false);
  }, [active, mode]);

  // Operator parallax: mouse position drives lazy rotateX/rotateY on the grid,
  // returning to neutral when the cursor leaves.
  useEffect(() => {
    if (mode !== 'operator' || !active) return;
    const grid = gridRef.current;
    if (!grid) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;
    let inside = false;

    const onMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      targetX = Math.max(-MAX_TILT_X, Math.min(MAX_TILT_X, -dy * MAX_TILT_X));
      targetY = Math.max(-MAX_TILT_Y, Math.min(MAX_TILT_Y, dx * MAX_TILT_Y));
      inside = true;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      inside = false;
    };

    const tick = () => {
      curX += (targetX - curX) * LERP;
      curY += (targetY - curY) * LERP;
      grid.style.transform = `rotateX(${curX.toFixed(3)}deg) rotateY(${curY.toFixed(3)}deg)`;
      // Keep ticking while inside or while there's residual tilt to settle.
      if (inside || Math.abs(curX) > 0.02 || Math.abs(curY) > 0.02) {
        rafId = requestAnimationFrame(tick);
      } else {
        grid.style.transform = '';
        rafId = 0;
      }
    };
    const startLoop = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

    const wrap = grid.parentElement;
    wrap?.addEventListener('mousemove', onMove);
    wrap?.addEventListener('mouseleave', onLeave);
    wrap?.addEventListener('mouseenter', startLoop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      wrap?.removeEventListener('mousemove', onMove);
      wrap?.removeEventListener('mouseleave', onLeave);
      wrap?.removeEventListener('mouseenter', startLoop);
      grid.style.transform = '';
    };
  }, [mode, active]);

  const showOperatorGrid = mode === 'operator';

  return (
    <section className="stop">
      <div className="practice-bg" />
      <div className="practice-full">
        <div className="pr-head">
          <div className="eyebrow"><span className="tick" /><b>04 / Practice</b><span>Where we get our hands dirty</span></div>
          <h2 className="pr-title">Where we get our <em>hands dirty.</em></h2>
        </div>

        {showOperatorGrid ? (
          <div className="pr-grid-wrap">
            <div className="pr-grid" ref={gridRef}>
              {PRACTICE_OP.map((c, i) => (
                <div key={i} className="pr-card" data-card={i + 1}>
                  <div className="pr-card-status"><span className="pr-card-dot" />{c.status}</div>
                  <div className="pr-card-name">{c.name}</div>
                  <div className="pr-card-proof">{c.proof}</div>
                  <div className="pr-card-detail">{c.detail}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`pr-list${listIn ? ' pr-list-in' : ''}`}>
            {PRACTICE.map((p, i) => (
              <div
                key={i}
                className="pr-item"
                style={{ '--pr-delay': `${i * 60}ms` } as CSSProperties}
              >
                <div className="pr-num">/{p.num}</div>
                <div className="pr-name">{p.name} <em>{p.em}</em></div>
                <button className="pr-arrow">→</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
