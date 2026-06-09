import { useState, useEffect, useRef, useCallback } from 'react';
import type { Mode, Stop, ChippyRef } from './types';
import { CHIPS, STOP_NAMES, MAX_STOP } from './data';
import TopBar from './components/TopBar';
import World from './components/World';
import ChippyRig from './components/ChippyRig';
import Rail from './components/Rail';

export default function App() {
  const [mode, setModeState] = useState<Mode>('neutral');
  const [stop, setStopState] = useState<Stop>(0);
  const [traveling, setTraveling] = useState(false);
  const [chipSrc, setChipSrc] = useState('assets/chip-question-f.png');
  const chippyRef = useRef<ChippyRef>(null);
  const wheelLockRef = useRef(false);
  const stopRef = useRef<Stop>(0);
  const travelingRef = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-stop', stop.toString());
  }, [stop]);

  const setMode = useCallback((m: 'capital' | 'operator') => {
    setModeState(m);
    setChipSrc(CHIPS[m][0]);
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
      setChipSrc(CHIPS[m === 'neutral' ? 'neutral' : m][0]);
      chippyRef.current?.revealPanel();
      travelingRef.current = false;
      setTraveling(false);
    }, 1160);
  }, []);

  const handleSetMode = useCallback((m: 'capital' | 'operator') => {
    setMode(m);
    if (stop === 0 && !travelingRef.current) {
      setTimeout(() => goToStop(1), 460);
    }
  }, [stop, setMode, goToStop]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wheelLockRef.current || travelingRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;
      wheelLockRef.current = true;
      setTimeout(() => { wheelLockRef.current = false; }, 1200);
      goToStop((stopRef.current + (e.deltaY > 0 ? 1 : -1)) as Stop);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToStop((stopRef.current + 1) as Stop);
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goToStop((stopRef.current - 1) as Stop);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [goToStop]);

  const fnote = `Stop ${String(stop).padStart(2, '0')} · ${STOP_NAMES[stop].toLowerCase()}`;

  return (
    <>
      <TopBar mode={mode} stop={stop} onSetMode={handleSetMode} onNavigate={goToStop} />
      <div className="fnote">{fnote}</div>

      <World mode={mode} stop={stop} onChipSync={setChipSrc} />

      <ChippyRig
        ref={chippyRef}
        mode={mode}
        stop={stop}
        traveling={traveling}
        onSetMode={handleSetMode}
        chipSrc={chipSrc}
        onChipSrcChange={setChipSrc}
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
