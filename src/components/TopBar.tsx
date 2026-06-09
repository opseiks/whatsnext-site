import type { Mode, Stop } from '../types';
import { STOP_NAMES } from '../data';

interface TopBarProps {
  mode: Mode;
  stop: Stop;
  onSetMode: (m: 'capital' | 'operator') => void;
  onNavigate: (s: Stop) => void;
}

export default function TopBar({ mode, stop, onSetMode, onNavigate }: TopBarProps) {
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
      <div className="mode-toggle">
        <button
          data-set="capital"
          className={mode === 'capital' ? 'active' : ''}
          onClick={() => onSetMode('capital')}
        >
          <span className="dot" />Capital
        </button>
        <button
          data-set="operator"
          className={mode === 'operator' ? 'active' : ''}
          onClick={() => onSetMode('operator')}
        >
          <span className="dot" />Operator
        </button>
      </div>
    </header>
  );
}
