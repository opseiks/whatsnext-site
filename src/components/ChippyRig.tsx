import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { Mode, Stop, ChippyRef } from '../types';
import { CHIPS, TURNS } from '../data';
import Panel from './Panel';

interface ChippyRigProps {
  mode: Mode;
  stop: Stop;
  traveling: boolean;
  onSetMode: (m: 'capital' | 'operator') => void;
  chipSrc: string;
  onChipSrcChange: (src: string) => void;
}

const ChippyRig = forwardRef<ChippyRef, ChippyRigProps>(
  ({ mode, stop, traveling, onSetMode, chipSrc, onChipSrcChange }, ref) => {
    const chipImgRef = useRef<HTMLImageElement>(null);
    const coinBobRef = useRef<HTMLDivElement>(null);
    const coinWrapRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const idleFlippingRef = useRef(false);
    const idleTimerRef = useRef<ReturnType<typeof setInterval>>();
    const faceIdxRef = useRef(0);

    const flipChipTo = useCallback((src: string) => {
      if (idleFlippingRef.current || traveling) return;
      const el = chipImgRef.current;
      if (!el) return;
      idleFlippingRef.current = true;
      const half = 300;
      const a1 = el.animate(
        [{ transform: 'scaleX(1)', filter: 'brightness(1)' },
         { transform: 'scaleX(.06)', filter: 'brightness(1.7)' }],
        { duration: half, easing: 'cubic-bezier(.55,0,.9,.45)', fill: 'forwards' }
      );
      a1.onfinish = () => {
        el.src = src;
        onChipSrcChange(src);
        const a2 = el.animate(
          [{ transform: 'scaleX(.06)', filter: 'brightness(1.7)' },
           { transform: 'scaleX(1)', filter: 'brightness(1)' }],
          { duration: half, easing: 'cubic-bezier(.1,.55,.3,1)', fill: 'forwards' }
        );
        a2.onfinish = () => {
          el.style.transform = ''; el.style.filter = '';
          idleFlippingRef.current = false;
        };
      };
    }, [traveling, onChipSrcChange]);

    const doFlip = useCallback(() => {
      if (idleFlippingRef.current || traveling) return;
      const chips = CHIPS[mode];
      faceIdxRef.current = (faceIdxRef.current + 1) % chips.length;
      flipChipTo(chips[faceIdxRef.current]);
    }, [mode, traveling, flipChipTo]);

    const resetIdle = useCallback(() => {
      clearInterval(idleTimerRef.current);
      idleTimerRef.current = setInterval(doFlip, 4200);
    }, [doFlip]);

    const playTravel = useCallback(() => {
      const seq = [0, 1, 2, 3, 2, 1, 0];
      let i = 0;
      const el = chipImgRef.current;
      if (!el) return;
      const step = () => {
        el.src = TURNS[seq[i++]];
        if (i < seq.length) setTimeout(step, 150);
      };
      step();

      coinBobRef.current?.animate(
        [{ transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)' },
         { transform: 'translateY(-24px) rotateX(1deg) rotateZ(16deg)', offset: 0.28 },
         { transform: 'translateY(-8px) rotateX(9deg) rotateZ(-8deg)', offset: 0.70 },
         { transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)' }],
        { duration: 1060, easing: 'cubic-bezier(.4,0,.2,1)' }
      );
      chipImgRef.current?.animate(
        [{ transform: 'scale(1)' },
         { transform: 'scale(1.08)', offset: 0.18 },
         { transform: 'scale(1.38)', offset: 0.50 },
         { transform: 'scale(1.07)', offset: 0.80 },
         { transform: 'scale(1)' }],
        { duration: 1060, easing: 'ease-in-out' }
      );
    }, []);

    useImperativeHandle(ref, () => ({
      triggerTravel() {
        const panel = panelRef.current;
        if (panel) {
          panel.animate(
            [{ transform: 'scale(1)', opacity: 1 },
             { transform: 'scale(0.05)', opacity: 0 }],
            { duration: 320, easing: 'cubic-bezier(.55,0,.9,.5)', fill: 'forwards' }
          );
        }
        coinWrapRef.current?.animate(
          [{ transform: 'scale(1)' },
           { transform: 'scale(1.22)', offset: 0.35 },
           { transform: 'scale(1)' }],
          { duration: 960, easing: 'cubic-bezier(.28,0,.2,1)' }
        );
        playTravel();
      },
      revealPanel() {
        const panel = panelRef.current;
        if (!panel) return;
        const a = panel.animate(
          [{ transform: 'scale(0.05)', opacity: 0 },
           { transform: 'scale(1)', opacity: 1 }],
          { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
        );
        a.onfinish = () => { panel.style.transform = ''; panel.style.opacity = ''; };
      }
    }));

    useEffect(() => {
      const el = chipImgRef.current;
      if (!el) return;
      faceIdxRef.current = 0;
      el.src = CHIPS[mode][0];
    }, [mode]);

    useEffect(() => {
      if (!traveling) {
        resetIdle();
        return () => clearInterval(idleTimerRef.current);
      }
    }, [traveling, resetIdle]);

    const handleCoinClick = () => {
      if (traveling) return;
      clearInterval(idleTimerRef.current);
      doFlip();
      resetIdle();
    };

    const handleAsk = () => {
      const input = document.querySelector('.chat input') as HTMLInputElement;
      if (input) { input.value = ''; input.placeholder = 'Chippy\'s LLM lands soon — noted.'; }
    };

    return (
      <div className="rig" data-stop={stop}>
        <div className="coin-wrap" ref={coinWrapRef} onClick={handleCoinClick}>
          <div className="coin-bob" ref={coinBobRef}>
            <img
              ref={chipImgRef}
              className="chip-img"
              src={chipSrc}
              alt="Chippy"
            />
            <div className="coin-spec" />
          </div>
          <div className="coin-shadow" />
        </div>
        <div className="panel" ref={panelRef}>
          <Panel
            mode={mode}
            stop={stop}
            onSetMode={onSetMode}
            onAsk={handleAsk}
          />
        </div>
      </div>
    );
  }
);

ChippyRig.displayName = 'ChippyRig';
export default ChippyRig;
