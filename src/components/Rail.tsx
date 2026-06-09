import type { Stop } from '../types';
import { STOP_NAMES, MAX_STOP } from '../data';

interface RailProps {
  stop: Stop;
  onNavigate: (s: Stop) => void;
}

export default function Rail({ stop, onNavigate }: RailProps) {
  return (
    <aside className="rail">
      {STOP_NAMES.map((name, i) => (
        <button
          key={i}
          className={`rdot${i === stop ? ' on' : ''}${i > MAX_STOP ? ' locked' : ''}`}
          onClick={() => i <= MAX_STOP && onNavigate(i as Stop)}
        >
          <span className="rn">{name}</span>
          <span>{String(i).padStart(2, '0')}</span>
          <span className="pip" />
        </button>
      ))}
    </aside>
  );
}
