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

// Base .chip-img filter restated here because the turn-smoothing overlay
// animates filter and would otherwise wipe it during the flip.
const CHIP_FILTER = 'brightness(1.1) contrast(1.03) drop-shadow(0 9px 18px rgba(0,0,0,0.76))';

// Sub-frame smoothing for the 4-frame turn art: between PNG swaps the img
// squeezes through rotateY (no perspective on the parent, so it reads as
// pure cos foreshortening, direction-agnostic) with a touch of blur, and
// the next turn frame takes over exactly at the swap. Turns the discrete
// frame pops into continuous rotation while keeping the thickness detail
// baked into the turn art.
function makeTurnSmoothing(gapCount: number): Keyframe[] {
  const frames: Keyframe[] = [];
  for (let g = 0; g < gapCount; g++) {
    frames.push(
      { transform: 'rotateY(0deg)', filter: CHIP_FILTER, offset: g / gapCount, easing: 'ease-in' },
      { transform: 'rotateY(-46deg)', filter: `${CHIP_FILTER} blur(1.4px)`, offset: (g + 1) / gapCount - 0.001 },
    );
  }
  frames.push({ transform: 'rotateY(0deg)', filter: CHIP_FILTER, offset: 1 });
  return frames;
}

// Idle flips step the turn frames faster than travel: short gaps read as
// momentum and let the smoothing overlay carry the in-betweens.
const FLIP_FRAME_MS = 95;

// Cartoon jump: deep anticipation squash into the ground, launch with a
// stretch, back to a perfect circle hanging at the apex, stretch again on
// the fall, then a hard boing squash on landing with a rebound hop and a
// smaller second squish before settling. translateY during the squashes
// keeps the bottom edge planted so he compresses against the ground rather
// than shrinking in place.
const PERSONALITY_BOUNCE_KEYFRAMES: Keyframe[] = [
  // Rest
  { transform: 'translateY(0) scaleX(1) scaleY(1) rotateX(7deg) rotateZ(-2deg)', easing: 'cubic-bezier(0.45, 0, 0.6, 1)' },
  // Anticipation: exaggerated push down, squishing wide
  { transform: 'translateY(24px) scaleX(1.22) scaleY(0.7) rotateX(7deg) rotateZ(-2deg)', offset: 0.16, easing: 'linear' },
  // Beat at the bottom of the squash
  { transform: 'translateY(24px) scaleX(1.22) scaleY(0.7) rotateX(7deg) rotateZ(-2deg)', offset: 0.21, easing: 'cubic-bezier(0.2, 0.9, 0.35, 1)' },
  // Launch: elongates on the way up
  { transform: 'translateY(-92px) scaleX(0.86) scaleY(1.26) rotateX(7deg) rotateZ(-2deg)', offset: 0.38, easing: 'ease-out' },
  // Apex: back to a circle, hanging for a moment
  { transform: 'translateY(-108px) scaleX(1) scaleY(1) rotateX(7deg) rotateZ(-2deg)', offset: 0.48, easing: 'cubic-bezier(0.55, 0, 0.85, 0.55)' },
  // Falling: stretches toward the ground
  { transform: 'translateY(-12px) scaleX(0.92) scaleY(1.14) rotateX(7deg) rotateZ(-2deg)', offset: 0.6, easing: 'cubic-bezier(0.6, 0, 0.9, 0.6)' },
  // Impact: boing, squashed hard against the ground
  { transform: 'translateY(30px) scaleX(1.34) scaleY(0.58) rotateX(7deg) rotateZ(-2deg)', offset: 0.66, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.3)' },
  // Rebound hop
  { transform: 'translateY(-26px) scaleX(0.95) scaleY(1.1) rotateX(7deg) rotateZ(-2deg)', offset: 0.77, easing: 'cubic-bezier(0.5, 0, 0.8, 0.6)' },
  // Second, smaller squish
  { transform: 'translateY(11px) scaleX(1.14) scaleY(0.86) rotateX(7deg) rotateZ(-2deg)', offset: 0.85, easing: 'cubic-bezier(0.3, 0.9, 0.4, 1)' },
  // Settle wobble
  { transform: 'translateY(-5px) scaleX(0.98) scaleY(1.04) rotateX(7deg) rotateZ(-2deg)', offset: 0.92, easing: 'ease-in-out' },
  { transform: 'translateY(0) scaleX(1) scaleY(1) rotateX(7deg) rotateZ(-2deg)' },
];

// Wheel spin idle: pendulum swings that build energy (left, right, bigger
// left, biggest right), then release into a couple of full in-plane
// revolutions that decelerate, overshoot slightly past upright, teeter at
// the top, and rock to a stop. All rotateZ so the face never leaves the
// camera; -722deg end value is one full lap short of -2deg, i.e. the rest
// pose. rotateX(7deg) baseline preserved so the perspective tilt doesn't pop.
const SPIN_IDLE_KEYFRAMES: Keyframe[] = [
  // Rest
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-2deg)', easing: 'cubic-bezier(0.45,0.05,0.55,0.95)' },
  // Swing left
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-38deg)', offset: 0.08, easing: 'cubic-bezier(0.45,0.05,0.55,0.95)' },
  // Swing right, a little further
  { transform: 'translateY(0) rotateX(7deg) rotateZ(60deg)', offset: 0.18, easing: 'cubic-bezier(0.45,0.05,0.55,0.95)' },
  // Bigger swing left
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-95deg)', offset: 0.29, easing: 'cubic-bezier(0.45,0.05,0.55,0.95)' },
  // Full windup right
  { transform: 'translateY(0) rotateX(7deg) rotateZ(130deg)', offset: 0.4, easing: 'cubic-bezier(0.6, 0, 0.8, 0.4)' },
  // Release: first fast revolution
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-260deg)', offset: 0.5, easing: 'linear' },
  // Second revolution, starting to slow
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-560deg)', offset: 0.62, easing: 'cubic-bezier(0.3, 0.4, 0.6, 0.8)' },
  // Coasting toward upright
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-686deg)', offset: 0.74, easing: 'cubic-bezier(0.25, 0.6, 0.5, 1)' },
  // Overshoot past the top and teeter
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-737deg)', offset: 0.84, easing: 'cubic-bezier(0.4, 0, 0.3, 1)' },
  // Rock back over the top
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-713deg)', offset: 0.91, easing: 'ease-in-out' },
  // Small counter-rock
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-726deg)', offset: 0.96, easing: 'ease-in-out' },
  // Settle at rest (one lap below -2deg)
  { transform: 'translateY(0) rotateX(7deg) rotateZ(-722deg)' },
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

    // Full 360 turn-sequence flip: currentFace → t1 → t2 → t3 → newFace,
    // with a continuous squeeze-and-blur overlay filling the gaps between
    // frame swaps so the rotation reads fluid instead of stepped.
    const flipChipTo = useCallback((newSrc: string) => {
      if (idleFlippingRef.current || travelingRef.current) return;
      const el = chipImgRef.current;
      if (!el) return;
      idleFlippingRef.current = true;

      const frames = [TURNS[1], TURNS[2], TURNS[3], newSrc];
      el.animate(makeTurnSmoothing(frames.length), { duration: FLIP_FRAME_MS * frames.length });
      let i = 0;
      const step = () => {
        el.src = frames[i++];
        if (i < frames.length) {
          setTimeout(step, FLIP_FRAME_MS);
        } else {
          idleFlippingRef.current = false;
        }
      };
      setTimeout(step, FLIP_FRAME_MS);
    }, []);

    const doFlip = useCallback(() => {
      if (idleFlippingRef.current || travelingRef.current || specialIdleRef.current) return;

      idleCountRef.current++;
      if (idleCountRef.current >= 4) {
        idleCountRef.current = 0;
        const bobEl = coinBobRef.current;
        if (bobEl) {
          // Special-idle cycles skip the turn-frame face flip entirely: the
          // PNG turn sequence reads as a sideways pivot that fights the
          // in-plane jump/wheel-spin motion.
          const useSpin = idleBehaviorRef.current === 1;
          idleBehaviorRef.current = useSpin ? 0 : 1;
          specialIdleRef.current = true;
          bobEl.style.animationPlayState = 'paused';
          const anim = useSpin
            ? bobEl.animate(SPIN_IDLE_KEYFRAMES, { duration: 6500 })
            : bobEl.animate(PERSONALITY_BOUNCE_KEYFRAMES, { duration: 2300 });
          anim.onfinish = () => {
            bobEl.style.animationPlayState = '';
            specialIdleRef.current = false;
          };
          return;
        }
      }

      const chips = CHIPS[modeRef.current];
      faceIdxRef.current = (faceIdxRef.current + 1) % chips.length;
      flipChipTo(chips[faceIdxRef.current]);
    }, [flipChipTo]);

    const resetIdle = useCallback(() => {
      clearInterval(idleTimerRef.current);
      idleTimerRef.current = setInterval(doFlip, 4200);
    }, [doFlip]);

    // Travel: 4-frame face turn sequence + forward tilt arc. Same smoothing
    // overlay as idle flips, at travel's 150ms cadence (4 gaps over 600ms).
    const playTravel = useCallback((endFace?: string) => {
      const face = endFace || TURNS[0];
      const frames = [TURNS[0], TURNS[1], TURNS[2], TURNS[3], face];
      let i = 0;
      const el = chipImgRef.current;
      if (!el) return;
      el.animate(makeTurnSmoothing(frames.length - 1), { duration: 150 * (frames.length - 1) });
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
