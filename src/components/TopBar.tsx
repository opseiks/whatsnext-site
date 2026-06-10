import type { Mode, Stop } from '../types';
import { STOP_NAMES } from '../data';

interface TopBarProps {
  mode: Mode;
  stop: Stop;
  heroPhase: 1 | 2;
  onSetMode: (m: 'capital' | 'operator') => void;
  onNavigate: (s: Stop) => void;
}

export default function TopBar({ mode, stop, heroPhase, onSetMode, onNavigate }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="wordmark">WHATS<span className="sl">/</span>NEXT</div>
      <nav className="nav">
        {STOP_NAMES.map((name, i) => (
          <a
            key={i}
            className={stop === i ? 'on' : ''}
            onClick={() => onNavigate(i as Stop)}
          >
            {name.replace(' ', ' ')}
          </a>
        ))}
      </nav>
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
    </header>
  );
}
