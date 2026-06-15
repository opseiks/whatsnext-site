import { useState, useEffect, useRef, useCallback } from 'react';
import type { Mode, LayoutMode, Stop } from '../types';
import { STOP_NAMES } from '../data';

interface TopBarProps {
  mode: Mode;
  stop: Stop;
  heroPhase: 1 | 2;
  onSetMode: (m: 'capital' | 'operator') => void;
  onNavigate: (s: Stop) => void;
  layoutMode: LayoutMode;
  onSetLayout: (l: LayoutMode) => void;
}

function ChipIcon() {
  return (
    <svg width="28" height="28" viewBox="-14 -14 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="13" fill="#c8a24b"/>
      <circle cx="0" cy="0" r="10.5" fill="#0a0a0c"/>
      <circle cx="0" cy="0" r="9.5" fill="none" stroke="#1f9c89" strokeWidth="1"/>
      <polygon points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3" fill="none" stroke="#1f9c89" strokeWidth="1"/>
      <text x="0" y="1.5" fontFamily="monospace" fontWeight="900" fontSize="4" fill="#b9f23a" textAnchor="middle">W/N</text>
      <rect x="-1.5" y="-13.5" width="3" height="2" rx="0.3" fill="#0a0a0c"/>
      <rect x="-1.5" y="11.5" width="3" height="2" rx="0.3" fill="#0a0a0c"/>
    </svg>
  );
}

export default function TopBar({ mode, stop, heroPhase, onSetMode, onNavigate, layoutMode, onSetLayout }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      if (btnRef.current?.contains(e.target as Node)) return;
      closeMenu();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menuOpen, closeMenu]);

  const scrollToSection = (i: number) => {
    const sections = document.querySelectorAll('.stop');
    sections[i]?.scrollIntoView({ behavior: 'smooth' });
    closeMenu();
  };

  const isScroll = layoutMode === 'scroll';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="wordmark">WHATS<span className="sl">/</span>NEXT</div>
        {isScroll && (
          <button
            ref={btnRef}
            className="hamburger-chip"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <ChipIcon />
          </button>
        )}
      </div>
      <nav className="nav">
        {STOP_NAMES.map((name, i) => (
          <a
            key={i}
            className={stop === i ? 'on' : ''}
            onClick={() => onNavigate(i as Stop)}
          >
            {name.replace(' ', ' ')}
          </a>
        ))}
      </nav>
      <div className="topbar-controls">
        <div className="layout-toggle">
          <button
            className={layoutMode === 'scroll' ? 'active' : ''}
            onClick={() => onSetLayout('scroll')}
          >
            SCROLL
          </button>
          <button
            className={layoutMode === 'cinematic' ? 'active' : ''}
            onClick={() => onSetLayout('cinematic')}
          >
            CINEMATIC
          </button>
        </div>
        <div
          className="mode-toggle"
          style={{
            opacity: heroPhase === 1 ? 0 : 1,
            transition: 'opacity 0.6s ease',
            pointerEvents: heroPhase === 1 ? 'none' : 'auto',
          }}
        >
          <button
            className={mode === 'capital' ? 'active' : ''}
            onClick={() => onSetMode('capital')}
          >
            <span className="dot" />Capital
          </button>
          <button
            className={mode === 'operator' ? 'active' : ''}
            onClick={() => onSetMode('operator')}
          >
            <span className="dot" />Operator
          </button>
        </div>
      </div>

      {isScroll && menuOpen && (
        <div className="hamburger-menu" ref={menuRef}>
          {STOP_NAMES.map((name, i) => (
            <button key={i} className="hamburger-link" onClick={() => scrollToSection(i)}>
              {name}
            </button>
          ))}
          <div className="hamburger-divider" />
          <button
            className="hamburger-link hamburger-cinematic"
            onClick={() => { onSetLayout('cinematic'); closeMenu(); }}
          >
            Cinematic Mode
          </button>
        </div>
      )}
    </header>
  );
}
