import { useState, useEffect, useRef, useCallback } from 'react';
import type { Mode } from '../types';
import Panel from './Panel';

interface ScrollChippyProps {
  mode: Mode;
  onSetMode: (m: 'capital' | 'operator') => void;
}

export default function ScrollChippy({ mode, onSetMode }: ScrollChippyProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [face, setFace] = useState('assets/chip-wnd-f.png');
  const [entering, setEntering] = useState(false);
  const prevSectionRef = useRef(0);
  const wasHeroVisibleRef = useRef(true);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const faceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Track hero visibility
  useEffect(() => {
    const heroEl = document.querySelector('.stop');
    if (!heroEl) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.3);
      },
      { threshold: [0.1, 0.3, 0.5] },
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, []);

  // Track all sections for corner chip context
  useEffect(() => {
    const stops = document.querySelectorAll('.stop');
    if (!stops.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(stops).indexOf(entry.target as Element);
            if (idx >= 0 && (!best || entry.intersectionRatio > best.ratio)) {
              best = { idx, ratio: entry.intersectionRatio };
            }
          }
        });
        if (best) setCurrentSection(best.idx);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );

    stops.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Corner chip enter animation when hero scrolls away
  useEffect(() => {
    if (wasHeroVisibleRef.current && !heroVisible) {
      setEntering(true);
      const t = setTimeout(() => setEntering(false), 600);
      wasHeroVisibleRef.current = false;
      return () => clearTimeout(t);
    }
    if (heroVisible) {
      wasHeroVisibleRef.current = true;
      setEntering(false);
    }
  }, [heroVisible]);

  // Pulse + exclaim on section change (corner chip only)
  useEffect(() => {
    if (heroVisible) return;
    if (currentSection === prevSectionRef.current) return;
    prevSectionRef.current = currentSection;
    if (currentSection <= 1) return;

    clearTimeout(pulseTimerRef.current);
    clearTimeout(faceTimerRef.current);

    setPulsing(true);
    setShowNotif(true);
    setFace('assets/chip-exclaim-f.png');

    pulseTimerRef.current = setTimeout(() => setPulsing(false), 400);
    faceTimerRef.current = setTimeout(() => {
      setFace('assets/chip-wnd-f.png');
      setShowNotif(false);
    }, 2000);

    return () => {
      clearTimeout(pulseTimerRef.current);
      clearTimeout(faceTimerRef.current);
    };
  }, [currentSection, heroVisible]);

  const handleChipClick = useCallback(() => {
    setPanelOpen((prev) => !prev);
    setShowNotif(false);
  }, []);

  const handleClose = useCallback(() => {
    setPanelOpen(false);
  }, []);

  // Hero section has its own inline chippy; corner chip hidden
  if (heroVisible) return null;

  const stopIdx = currentSection as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

  return (
    <>
      <div
        className={`scroll-panel-overlay${panelOpen ? ' open' : ''}`}
        onClick={handleClose}
      />

      <div className={`scroll-panel${panelOpen ? ' open' : ''}`}>
        <button className="sp-close" onClick={handleClose} aria-label="Close panel">
          ✕
        </button>
        <Panel
          mode={mode}
          stop={stopIdx}
          onSetMode={onSetMode}
          onAsk={() => {}}
        />
      </div>

      <div
        className={`scroll-chippy${pulsing ? ' sc-pulse' : ''}${entering ? ' sc-entering' : ''}`}
        onClick={handleChipClick}
      >
        <div className="sc-bob">
          <img className="sc-img" src={face} alt="Chippy" />
        </div>
        <div className="sc-shadow" />
        {showNotif && <div className="sc-notif" />}
      </div>
    </>
  );
}
