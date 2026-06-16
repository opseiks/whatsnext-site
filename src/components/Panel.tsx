import { useState, useRef, useEffect, useCallback } from 'react';
import type { Mode, Stop } from '../types';
import { PCOPY, PANEL_TAGS } from '../data';
import { askChippy } from '../utils/chippy-chat';

interface ChatMessage {
  role: 'user' | 'chippy';
  text: string;
}

interface PanelProps {
  mode: Mode;
  stop: Stop;
  onSetMode: (m: 'capital' | 'operator') => void;
  onAsk: () => void;
}

export default function Panel({ mode, stop, onSetMode, onAsk }: PanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatActive = messages.length > 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    onAsk();

    const response = await askChippy(text, mode, stop);
    setMessages(prev => [...prev, { role: 'chippy', text: response }]);
    setLoading(false);
  }, [input, loading, onAsk, stop, mode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAsk();
    }
  }, [handleAsk]);

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

      {copy.choices ? (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: copy.h }} />
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
        </>
      ) : chatActive ? (
        <>
          <div className="chat-history">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-msg chat-msg-chippy chat-loading">
                <span className="chat-dot" />
                <span className="chat-dot" />
                <span className="chat-dot" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Chippy anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleAsk}>ASK</button>
          </div>
        </>
      ) : (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: copy.h }} />
          <ul className="bullets">
            {copy.b?.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <div className="statline">
            <span className="live" />
            <b>{copy.s}</b>
          </div>
          <div className="chat">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Chippy anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleAsk}>ASK</button>
          </div>
          <div className="chatnote">POWERED BY CLAUDE</div>
        </>
      )}
    </>
  );
}
