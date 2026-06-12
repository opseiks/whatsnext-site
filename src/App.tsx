import { useState, useEffect, useRef, useCallback } from 'react';
import type { Mode, Stop, ChippyRef } from './types';
import { CHIPS, STOP_NAMES, MAX_STOP, BB } from './data';
import TopBar from './components/TopBar';
import World from './components/World';
import ChippyRig from './components/ChippyRig';
import Rail from './components/Rail';

export default function App() {
  const [mode, setModeState] = useState<Mode>('neutral');
  const [stop, setStopState] = useState<Stop>(0);
  const [traveling, setTraveling] = useState(true);
  const [heroPhase, setHeroPhase] = useState<1 | 2>(1);
  const chippyRef = useRef<ChippyRef>(null);
  const wheelLockRef = useRef(false);
  const stopRef = useRef<Stop>(0);
  const travelingRef = useRef(true);
  const heroPhaseRef = useRef<1 | 2>(1);
  const modeRef = useRef<Mode>('neutral');

  useEffect(() => { travelingRef.current = traveling; }, [traveling]);
  useEffect(() => { heroPhaseRef.current = heroPhase; }, [heroPhase]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-stop', stop.toString());
  }, [stop]);

  const setMode = useCallback((m: 'capital' | 'operator') => {
    setModeState(m);
  }, []);

  const goToStop = useCallback((n: Stop) => {
    n = Math.max(0, Math.min(MAX_STOP, n)) as Stop;
    if (n === stopRef.current || travelingRef.current) return;

    travelingRef.current = true;
    setTraveling(true);
    stopRef.current = n;
    setStopState(n);

    chippyRef.current?.triggerTravel();

    setTimeout(() => {
      const m = document.documentElement.getAttribute('data-mode') as Mode || 'neutral';
      let face = CHIPS[m === 'neutral' ? 'neutral' : m][0];
      if (n === 1 && m !== 'neutral') {
        const bbData = BB[m as 'capital' | 'operator'];
        if (bbData?.[0]?.chip) face = bbData[0].chip;
      }
      chippyRef.current?.setFace(face);
      chippyRef.current?.revealPanel();
      travelingRef.current = false;
      setTraveling(false);
    }, 1160);
  }, []);

  const handleSetMode = useCallback((m: 'capital' | 'operator') => {
    if (stopRef.current === 0 && !travelingRef.current) {
      travelingRef.current = true;
      setTraveling(true);
      chippyRef.current?.hidePanel();
      setMode(m);
      setTimeout(() => {
        travelingRef.current = false;
        goToStop(1 as Stop);
      }, 460);
    } else {
      setMode(m);
    }
  }, [setMode, goToStop]);

  // Hero phase 1 → 2: click anywhere on hero to advance
  const advanceHero = useCallback(() => {
    if (heroPhaseRef.current !== 1) return;
    setHeroPhase(2);
    heroPhaseRef.current = 2;
    chippyRef.current?.enterHero();
    setTimeout(() => {
      travelingRef.current = false;
      setTraveling(false);
    }, 1700);
  }, []);

  // Billboard chip sync via turn-sequence flip
  const handleChipSync = useCallback((src: string) => {
    chippyRef.current?.flipTo(src);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      // Phase 1: first downward scroll advances to phase 2
      if (heroPhaseRef.current === 1 && e.deltaY > 0) {
        wheelLockRef.current = true;
        setTimeout(() => { wheelLockRef.current = false; }, 1200);
        advanceHero();
        return;
      }

      if (travelingRef.current) return;

      wheelLockRef.current = true;
      setTimeout(() => { wheelLockRef.current = false; }, 1200);

      // Phase 2: downward scroll without mode selection defaults to operator
      if (heroPhaseRef.current === 2 && stopRef.current === 0 && e.deltaY > 0 && modeRef.current === 'neutral') {
        handleSetMode('operator');
        return;
      }

      goToStop((stopRef.current + (e.deltaY > 0 ? 1 : -1)) as Stop);
    };
    const onKey = (e: KeyboardEvent) => {
      if (travelingRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToStop((stopRef.current + 1) as Stop);
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goToStop((stopRef.current - 1) as Stop);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [goToStop, advanceHero, handleSetMode]);

  const fnote = `Stop ${String(stop).padStart(2, '0')} · ${STOP_NAMES[stop].toLowerCase()}`;

  return (
    <>
      <TopBar
        mode={mode}
        stop={stop}
        heroPhase={heroPhase}
        onSetMode={handleSetMode}
        onNavigate={goToStop}
      />
      <div className="fnote">{fnote}</div>

      <World
        mode={mode}
        stop={stop}
        heroPhase={heroPhase}
        onHeroAdvance={advanceHero}
        onChipSync={handleChipSync}
      />

      <ChippyRig
        ref={chippyRef}
        mode={mode}
        stop={stop}
        traveling={traveling}
        heroPhase={heroPhase}
        onSetMode={handleSetMode}
      />

      <Rail stop={stop} onNavigate={goToStop} />

      <div className="cue" style={{ opacity: stop >= MAX_STOP ? 0 : 1 }}>
        <span className="ln" />
        Choose your track to descend
      </div>

      <div className="grain" />
      <div className="vignette" />
    </>
  );
}
