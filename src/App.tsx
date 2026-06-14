import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import type { Mode, LayoutMode, Stop, ChippyRef } from './types';
import { STOP_NAMES, MAX_STOP } from './data';
import { isBot } from './utils/bot';
import TopBar from './components/TopBar';
import World from './components/World';
import ChippyRig from './components/ChippyRig';
import Rail from './components/Rail';
import ScrollWorld from './components/ScrollWorld';
import ScrollChippy from './components/ScrollChippy';

const MOBILE_BREAKPOINT = 768;
const LAYOUT_STORAGE_KEY = 'wnd-layout-mode';

const SSR_INITIAL_LAYOUT: LayoutMode = 'scroll';

export default function App() {
  const [mode, setModeState] = useState<Mode>('neutral');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(SSR_INITIAL_LAYOUT);
  const [stop, setStopState] = useState<Stop>(0);
  const [traveling, setTraveling] = useState(true);
  const [heroPhase, setHeroPhase] = useState<1 | 2>(1);
  const [scrollModeChosen, setScrollModeChosen] = useState(false);
  const chippyRef = useRef<ChippyRef>(null);
  const wheelLockRef = useRef(false);
  const stopRef = useRef<Stop>(0);
  const travelingRef = useRef(true);
  const heroPhaseRef = useRef<1 | 2>(1);
  const modeRef = useRef<Mode>('neutral');

  useEffect(() => { travelingRef.current = traveling; }, [traveling]);
  useEffect(() => { heroPhaseRef.current = heroPhase; }, [heroPhase]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  // Post-hydration upgrade to cinematic for desktop humans.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (isBot()) return;

    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY) as LayoutMode | null;
    if (stored === 'scroll' || stored === 'cinematic') {
      setLayoutMode(stored);
      return;
    }
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      setLayoutMode('cinematic');
    }
  }, []);

  // Downsize only: auto-switch to scroll below 768px, never back to cinematic.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) setLayoutMode('scroll');
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSetLayout = useCallback((l: LayoutMode) => {
    setLayoutMode(l);
    localStorage.setItem(LAYOUT_STORAGE_KEY, l);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-stop', stop.toString());
  }, [stop]);

  useEffect(() => {
    document.documentElement.setAttribute('data-layout', layoutMode);
  }, [layoutMode]);

  // Scroll mode defaults to operator. No neutral state in scroll mode.
  useEffect(() => {
    if (layoutMode === 'scroll' && mode === 'neutral') {
      setModeState('operator');
    }
  }, [layoutMode, mode]);

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
      chippyRef.current?.setFace('assets/chip-wnd-f.png');
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

  const handleChipSync = useCallback((src: string) => {
    chippyRef.current?.flipTo(src);
  }, []);

  useEffect(() => {
    if (layoutMode !== 'cinematic') return;

    const onWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      if (heroPhaseRef.current === 1 && e.deltaY > 0) {
        wheelLockRef.current = true;
        setTimeout(() => { wheelLockRef.current = false; }, 1200);
        advanceHero();
        return;
      }

      if (travelingRef.current) return;

      wheelLockRef.current = true;
      setTimeout(() => { wheelLockRef.current = false; }, 1200);

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
  }, [layoutMode, goToStop, advanceHero, handleSetMode]);

  const handleScrollSetMode = useCallback((m: 'capital' | 'operator') => {
    setModeState(m);
    setScrollModeChosen(true);
  }, []);

  if (layoutMode === 'scroll') {
    return (
      <>
        <TopBar
          mode={mode}
          stop={stop}
          heroPhase={2}
          onSetMode={handleScrollSetMode}
          onNavigate={() => {}}
          layoutMode={layoutMode}
          onSetLayout={handleSetLayout}
        />

        <ScrollWorld
          mode={mode}
          modeChosen={scrollModeChosen}
          onSetMode={handleScrollSetMode}
          onChipSync={() => {}}
        />

        <ScrollChippy mode={mode} onSetMode={handleScrollSetMode} />

        <div className="grain" />
        <div className="vignette" />
      </>
    );
  }

  const fnote = `Stop ${String(stop).padStart(2, '0')} · ${STOP_NAMES[stop].toLowerCase()}`;

  return (
    <>
      <TopBar
        mode={mode}
        stop={stop}
        heroPhase={heroPhase}
        onSetMode={handleSetMode}
        onNavigate={goToStop}
        layoutMode={layoutMode}
        onSetLayout={handleSetLayout}
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
