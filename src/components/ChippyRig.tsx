import { useRef, useEffect, useCallback, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import type { Mode, Stop, ChippyRef } from '../types';
import { CHIPS, TURNS } from '../data';
import Panel from './Panel';

interface ChippyRigProps {
  mode: Mode;
  stop: Stop;
  traveling: boolean;
  heroPhase: 1 | 2;
  onSetMode: (m: 'capital' | 'operator') => void;
}

const IDLE_STOPS = [0, 2, 3];

// Personality bounce: squash on impact, stretch on the overshoot up.
const PERSONALITY_BOUNCE_KEYFRAMES: Keyframe[] = [
  { transform: 'translateY(0) scaleY(1) rotateX(7deg) rotateZ(-2deg)', easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  { transform: 'translateY(50px) scaleY(0.85) rotateX(2deg) rotateZ(-6deg)', offset: 0.5, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { transform: 'translateY(-40px) scaleY(1.15) rotateX(14deg) rotateZ(4deg)', offset: 0.75, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  { transform: 'translateY(0) scaleY(1) rotateX(7deg) rotateZ(-2deg)' },
];

// Spin idle: small wiggle (¼ turn left, back, ¼ turn right), bigger swing
// to 40% left, spring back through upright the long way around to ¼ past
// upright on the right ("missed his stop"), pause ~1s, snap back, then
// damped wobble to rest. rotateX(7deg) baseline preserved throughout so
// the perspective tilt doesn't pop.
const SPIN_IDLE_KEYFRAMES: Keyframe[] = [
  // 0ms — rest
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)', easing: 'cubic-bezier(0.45,0.05,0.55,0.95)' },
  // 600ms — ¼ turn left
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-90deg)', offset: 0.109, easing: 'cubic-bezier(0.45,0.05,0.55,0.95)' },
  // 1000ms — back to upright
  { transform: 'translateY(0) rotateX(7deg) rotateZ(0deg)', offset: 0.182, easing: 'cubic-bezier(0.45,0.05,0.55,0.95)' },
  // 1400ms — continue to ¼ turn right
  { transform: 'translateY(0) rotateX(7deg) rotateZ(90deg)', offset: 0.255, easing: 'cubic-bezier(0.45,0,0.55,1)' },
  // 2300ms — bigger swing to 40% left
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-144deg)', offset: 0.418, easing: 'cubic-bezier(0.22,1,0.36,1)' },
  // 3100ms — spring through upright the long way around to +90° (overshoots his stop)
  { transform: 'translateY(0) rotateX(7deg) rotateZ(90deg)', offset: 0.564, easing: 'linear' },
  // 4100ms — hold for ~1s
  { transform: 'translateY(0) rotateX(7deg) rotateZ(90deg)', offset: 0.745, easing: 'cubic-bezier(0.4,0,0.2,1)' },
  // 4500ms — snap back past upright (overshoot to -10°)
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-10deg)', offset: 0.818, easing: 'ease-in-out' },
  // Damped wobble settle: +6° → -4° → +2° → -1° → rest
  { transform: 'translateY(0) rotateX(7deg) rotateZ(6deg)', offset: 0.854, easing: 'ease-in-out' },
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-4deg)', offset: 0.890, easing: 'ease-in-out' },
  { transform: 'translateY(0) rotateX(7deg) rotateZ(2deg)', offset: 0.927, easing: 'ease-in-out' },
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-1deg)', offset: 0.963, easing: 'ease-in-out' },
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)' },
];

const ChippyRig = forwardRef<ChippyRef, ChippyRigProps>(
  ({ mode, stop, traveling, heroPhase, onSetMode }, ref) => {
    const chipImgRef = useRef<HTMLImageElement>(null);
    const coinBobRef = useRef<HTMLDivElement>(null);
    const coinWrapRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const idleFlippingRef = useRef(false);
    const idleTimerRef = useRef<ReturnType<typeof setInterval>>();
    const faceIdxRef = useRef(0);
    const idleCountRef = useRef(0);
    // Alternates between personality bounce (0) and spin idle (1) on each 4th-cycle trigger.
    const idleBehaviorRef = useRef(0);
    // True while a special idle (bounce or spin) is running; suppresses the 4.2s face-flip
    // so the turn frames don't tear through the rotation in progress.
    const specialIdleRef = useRef(false);

    const modeRef = useRef(mode);
    const stopRef = useRef(stop);
    const travelingRef = useRef(traveling);

    useEffect(() => { modeRef.current = mode; }, [mode]);
    useEffect(() => { stopRef.current = stop; }, [stop]);
    useEffect(() => { travelingRef.current = traveling; }, [traveling]);

    // Reset chip face on mode change
    useLayoutEffect(() => {
      faceIdxRef.current = 0;
      idleFlippingRef.current = false;
      if (chipImgRef.current) chipImgRef.current.src = CHIPS[mode][0];
    }, [mode]);

    // Full 360 turn-sequence flip: currentFace → t1 → t2 → t3 → newFace
    const flipChipTo = useCallback((newSrc: string) => {
      if (idleFlippingRef.current || travelingRef.current) return;
      const el = chipImgRef.current;
      if (!el) return;
      idleFlippingRef.current = true;

      const frames = [TURNS[1], TURNS[2], TURNS[3], newSrc];
      let i = 0;
      const step = () => {
        el.src = frames[i++];
        if (i < frames.length) {
          setTimeout(step, 150);
        } else {
          idleFlippingRef.current = false;
        }
      };
      setTimeout(step, 150);
    }, []);

    const doFlip = useCallback(() => {
      if (idleFlippingRef.current || travelingRef.current || specialIdleRef.current) return;
      const chips = CHIPS[modeRef.current];
      faceIdxRef.current = (faceIdxRef.current + 1) % chips.length;
      flipChipTo(chips[faceIdxRef.current]);

      idleCountRef.current++;
      if (idleCountRef.current >= 4) {
        idleCountRef.current = 0;
        const bobEl = coinBobRef.current;
        if (bobEl) {
          const useSpin = idleBehaviorRef.current === 1;
          idleBehaviorRef.current = useSpin ? 0 : 1;
          specialIdleRef.current = true;
          bobEl.style.animationPlayState = 'paused';
          const anim = useSpin
            ? bobEl.animate(SPIN_IDLE_KEYFRAMES, { duration: 5500 })
            : bobEl.animate(PERSONALITY_BOUNCE_KEYFRAMES, { duration: 1600 });
          anim.onfinish = () => {
            bobEl.style.animationPlayState = '';
            specialIdleRef.current = false;
          };
        }
      }
    }, [flipChipTo]);

    const resetIdle = useCallback(() => {
      clearInterval(idleTimerRef.current);
      idleTimerRef.current = setInterval(doFlip, 4200);
    }, [doFlip]);

    // Travel: 4-frame face turn sequence + forward tilt arc
    const playTravel = useCallback((endFace?: string) => {
      const face = endFace || TURNS[0];
      const frames = [TURNS[0], TURNS[1], TURNS[2], TURNS[3], face];
      let i = 0;
      const el = chipImgRef.current;
      if (!el) return;
      const step = () => {
        el.src = frames[i++];
        if (i < frames.length) setTimeout(step, 150);
      };
      step();

      // Tilt: forward (rotateX 20deg) at peak, side (rotateZ 16deg) mid-arc,
      // settle back to rest by landing.
      coinBobRef.current?.animate(
        [
          { transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)' },
          { transform: 'translateY(-32px) rotateX(20deg) rotateZ(16deg)', offset: 0.32 },
          { transform: 'translateY(-8px) rotateX(12deg) rotateZ(-6deg)', offset: 0.55 },
          { transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)', offset: 0.72 },
          { transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)' },
        ],
        { duration: 1160, easing: 'cubic-bezier(.4,0,.2,1)' }
      );
    }, []);

    // Coin-wrap scale arc: rise to 1.6 at peak, land at 1.0, spring bounce to 1.1, settle.
    // Shadow lives inside coin-wrap so it scales with the chip automatically.
    const playArc = useCallback(() => {
      coinWrapRef.current?.animate(
        [
          { transform: 'scale(1)', easing: 'cubic-bezier(.22,.8,.32,1)' },
          { transform: 'scale(1.6)', offset: 0.40, easing: 'cubic-bezier(.55,.1,.8,.55)' },
          { transform: 'scale(1.0)', offset: 0.72, easing: 'cubic-bezier(.34,1.56,.64,1)' },
          { transform: 'scale(1.1)', offset: 0.84, easing: 'cubic-bezier(.34,1.56,.64,1)' },
          { transform: 'scale(1.0)', offset: 1.0 },
        ],
        { duration: 1160 }
      );
    }, []);

    useImperativeHandle(ref, () => ({
      hidePanel() {
        const panel = panelRef.current;
        if (!panel) return;
        panel.getAnimations().forEach(a => a.cancel());
        panel.style.opacity = '0';
        panel.style.transform = 'scale(0.05)';
      },

      triggerTravel() {
        const panel = panelRef.current;
        if (panel) {
          panel.getAnimations().forEach(a => a.cancel());
          panel.style.opacity = '0';
          panel.style.transform = 'scale(0.05)';
        }
        // Let the rig's CSS position transition begin before the chip moves,
        // so there's no pre-travel scale pop or sideways drift.
        setTimeout(() => {
          playArc();
          playTravel();
        }, 100);
      },

      revealPanel() {
        const panel = panelRef.current;
        if (!panel) return;
        panel.getAnimations().forEach(a => a.cancel());
        panel.style.opacity = '0';
        panel.style.transform = 'scale(0.05)';
        const a = panel.animate(
          [
            { transform: 'scale(0.05)', opacity: '0' },
            { transform: 'scale(1)', opacity: '1' },
          ],
          { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
        );
        a.onfinish = () => {
          panel.style.transform = '';
          panel.style.opacity = '';
        };
      },

      enterHero() {
        const panel = panelRef.current;
        if (panel) {
          panel.style.opacity = '0';
          panel.style.transform = 'scale(0.05)';
        }
        const endFace = CHIPS[modeRef.current][0];
        // Match triggerTravel: small delay so the chip doesn't pop before moving.
        setTimeout(() => {
          playTravel(endFace);
          playArc();
        }, 100);
        setTimeout(() => {
          if (!panel) return;
          const a = panel.animate(
            [
              { transform: 'scale(0.05)', opacity: '0' },
              { transform: 'scale(1)', opacity: '1' },
            ],
            { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
          );
          a.onfinish = () => {
            panel.style.transform = '';
            panel.style.opacity = '';
          };
        }, 1260);
      },

      flipTo(src: string) {
        flipChipTo(src);
      },

      setFace(src: string) {
        faceIdxRef.current = 0;
        if (chipImgRef.current) chipImgRef.current.src = src;
      },
    }), [playTravel, playArc, flipChipTo]);

    // Idle timer: only at stops 0, 2, 3 when not traveling
    useEffect(() => {
      if (!traveling && IDLE_STOPS.includes(stop)) {
        resetIdle();
      } else {
        clearInterval(idleTimerRef.current);
      }
      return () => clearInterval(idleTimerRef.current);
    }, [traveling, stop, resetIdle]);

    // BRIEF-02 Fix 1 diagnostic: log rig CSS top/left when landing on Proof
    // so we can verify the position adjustment applies as expected.
    useEffect(() => {
      if (stop !== 1 || traveling) return;
      const rig = document.querySelector('.rig') as HTMLElement | null;
      if (!rig) return;
      const cs = window.getComputedStyle(rig);
      // eslint-disable-next-line no-console
      console.log('[chippy] stop=1 rig top:', cs.top, 'left:', cs.left);
    }, [stop, traveling]);

    const handleCoinClick = () => {
      if (travelingRef.current) return;
      clearInterval(idleTimerRef.current);
      doFlip();
      if (IDLE_STOPS.includes(stopRef.current)) resetIdle();
    };

    const handleAsk = () => {
      const input = panelRef.current?.querySelector('.chat input') as HTMLInputElement;
      if (input) {
        input.value = '';
        input.placeholder = 'Chippy\'s LLM lands soon — noted.';
      }
    };

    return (
      <div
        className={`rig${heroPhase === 1 ? ' rig-offscreen' : ''}`}
        data-stop={stop}
      >
        <div className="coin-wrap" ref={coinWrapRef} onClick={handleCoinClick}>
          <div className="coin-bob" ref={coinBobRef}>
            <img
              ref={chipImgRef}
              className="chip-img"
              src={CHIPS[mode][0]}
              alt="Chippy"
            />
            <div className="coin-spec" />
          </div>
          <div className="coin-shadow" />
        </div>
        <div className={`panel${traveling ? ' panel-travel' : ''}`} ref={panelRef}>
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
