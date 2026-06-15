import type { Mode, Stop } from '../types';
import { PCOPY, PANEL_TAGS } from '../data';

interface PanelProps {
  mode: Mode;
  stop: Stop;
  onSetMode: (m: 'capital' | 'operator') => void;
  onAsk: () => void;
}

export default function Panel({ mode, stop, onSetMode, onAsk }: PanelProps) {
  const copy = PCOPY[mode][stop];
  if (!copy) return null;

  const tag = PANEL_TAGS[stop] ?? `CHIPPY · ${String(stop).padStart(2, '0')}`;

  return (
    <>
      <div className="phead">
        <span className="ptag-label">{tag}</span>
        {mode !== 'neutral' && (
          <button className="psw" onClick={() => onSetMode(mode === 'capital' ? 'operator' : 'capital')}>
            ↺ flip
          </button>
        )}
      </div>
      <h3 dangerouslySetInnerHTML={{ __html: copy.h }} />
      {copy.choices ? (
        <div className="choices">
          <button className="choice" onClick={() => onSetMode('capital')}>
            <span>
              <span className="ct">I'm raising capital</span>
              <span className="cs">Pre-seed $50K–$250K · Series rounds up to $2M</span>
            </span>
            <span className="arw">→</span>
          </button>
          <button className="choice" onClick={() => onSetMode('operator')}>
            <span>
              <span className="ct">I need a product and operator partner</span>
              <span className="cs">Fractional · project · retainer</span>
            </span>
            <span className="arw">→</span>
          </button>
        </div>
      ) : (
        <>
          <ul className="bullets">
            {copy.b?.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <div className="statline">
            <span className="live" />
            <b>{copy.s}</b>
          </div>
          <div className="chat">
            <input type="text" placeholder="Ask Chippy anything…" />
            <button onClick={onAsk}>ASK</button>
          </div>
          <div className="chatnote">LLM chat · coming soon</div>
        </>
      )}
    </>
  );
}
