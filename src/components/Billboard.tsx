import { useEffect, useRef, useCallback } from 'react';
import type { Mode } from '../types';
import { BB, GHOST_NUM } from '../data';

const SCRAMBLE = '0123456789ABCDEFXYZ!?#@$%±∞►■';
const BB_DUR = 10000;

function scrambleTo(el: HTMLElement, final: string, dur: number, onDone?: () => void) {
  if ((el as HTMLElement & { _st?: ReturnType<typeof setInterval> })._st) {
    clearInterval((el as HTMLElement & { _st?: ReturnType<typeof setInterval> })._st);
  }
  const steps = Math.ceil(dur / 40);
  let i = 0;
  const timer = setInterval(() => {
    const p = i / steps;
    let out = '';
    for (let j = 0; j < final.length; j++) {
      const cp = (p - (j / (final.length + 1)) * 0.6) / 0.6;
      if (/[ .$+]/.test(final[j])) out += final[j];
      else if (cp >= 1) out += final[j];
      else out += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
    }
    el.textContent = out;
    i++;
    if (i >= steps) {
      clearInterval(timer);
      el.textContent = final;
      onDone?.();
    }
  }, 40);
  (el as HTMLElement & { _st?: ReturnType<typeof setInterval> })._st = timer;
}

function countUp(el: HTMLElement, num: number, pre: string, suf: string, dec: number) {
  const t0 = performance.now();
  const dur = 1300;
  const tick = (now: number) => {
    const t = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - t, 3);
    const v = num * e;
    el.textContent = pre + (dec > 0 ? v.toFixed(dec) : Math.round(v)) + suf;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

interface BillboardProps {
  mode: Mode;
  active: boolean;
  onChipSync?: (src: string) => void;
}

export default function Billboard({ mode, active, onChipSync }: BillboardProps) {
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const transitRef = useRef(false);
  const da1Ref = useRef<Animation | null>(null);
  const da2Ref = useRef<Animation | null>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const lblRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<HTMLDivElement>(null);
  const hudLRef = useRef<HTMLSpanElement>(null);
  const hudRRef = useRef<HTMLSpanElement>(null);
  const hudSecRef = useRef(0);
  const hudTimerRef = useRef<ReturnType<typeof setInterval>>();

  const cancelAnims = useCallback(() => {
    da1Ref.current?.cancel(); da1Ref.current = null;
    da2Ref.current?.cancel(); da2Ref.current = null;
    if (displayRef.current) {
      displayRef.current.style.transform = '';
      displayRef.current.style.opacity = '';
      displayRef.current.style.filter = '';
    }
  }, []);

  const startProg = useCallback(() => {
    const p = progRef.current;
    if (!p) return;
    p.classList.remove('ticking');
    void p.offsetWidth;
    p.style.setProperty('--dur', BB_DUR + 'ms');
    p.classList.add('ticking');
  }, []);

  const renderQueue = useCallback((currentIdx: number) => {
    const q = queueRef.current;
    if (!q || mode === 'neutral') { if (q) q.innerHTML = ''; return; }
    const stats = BB[mode as 'capital' | 'operator'] || [];
    q.innerHTML = stats.map((s, i) =>
      `<button class="bb-tile${i === currentIdx ? ' active' : ''}" data-i="${i}">
        <div class="tv">${s.val}</div>
        <div class="tl">${s.lbl}</div>
      </button>`
    ).join('');
    q.querySelectorAll('.bb-tile').forEach(b => {
      b.addEventListener('click', () => {
        const i = +(b as HTMLElement).dataset.i!;
        if (i === idxRef.current) return;
        clearInterval(timerRef.current);
        idxRef.current = i;
        showStat(i, true);
        timerRef.current = setInterval(() => {
          idxRef.current = (idxRef.current + 1) % stats.length;
          showStat(idxRef.current, true);
        }, BB_DUR);
      });
    });
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const showStat = useCallback((idx: number, animate: boolean) => {
    if (mode === 'neutral') return;
    const stats = BB[mode as 'capital' | 'operator'] || [];
    const stat = stats[idx];
    if (!stat) return;

    if (hudLRef.current) hudLRef.current.textContent = stat.val;
    if (stat.chip && !transitRef.current) onChipSync?.(stat.chip);
    renderQueue(idx);

    const valEl = valRef.current;
    const descEl = descRef.current;
    const lblEl = lblRef.current;
    const scanEl = scanRef.current;
    const dispEl = displayRef.current;
    if (!valEl || !descEl || !lblEl || !dispEl) return;

    if (!animate) {
      cancelAnims();
      transitRef.current = false;
      valEl.textContent = stat.val;
      descEl.textContent = stat.desc;
      lblEl.textContent = stat.lbl;
      lblEl.classList.add('vis');
      setTimeout(() => {
        if (mode === 'operator') scrambleTo(valEl, stat.val, 600);
        else countUp(valEl, stat.num, stat.pre, stat.suf, stat.dec);
      }, 200);
      startProg();
      return;
    }

    if (transitRef.current) return;
    transitRef.current = true;

    if (scanEl) { scanEl.classList.remove('run'); void scanEl.offsetWidth; scanEl.classList.add('run'); }

    if (mode === 'capital') {
      cancelAnims();
      da1Ref.current = dispEl.animate(
        [{ transform: 'perspective(500px) rotateX(0) translateY(0)', opacity: 1 },
         { transform: 'perspective(500px) rotateX(26deg) translateY(36px)', opacity: 0 }],
        { duration: 360, easing: 'cubic-bezier(.6,0,1,.6)', fill: 'forwards' }
      );
      setTimeout(() => {
        lblEl.textContent = stat.lbl; lblEl.classList.add('vis');
        valEl.textContent = '—'; descEl.textContent = stat.desc;
        cancelAnims();
        da2Ref.current = dispEl.animate(
          [{ transform: 'perspective(500px) rotateX(-24deg) translateY(-32px)', opacity: 0 },
           { transform: 'perspective(500px) rotateX(0) translateY(0)', opacity: 1 }],
          { duration: 420, easing: 'cubic-bezier(0,.6,.3,1)', fill: 'forwards' }
        );
        da2Ref.current.onfinish = () => {
          dispEl.style.transform = ''; dispEl.style.opacity = '';
          transitRef.current = false;
          countUp(valEl, stat.num, stat.pre, stat.suf, stat.dec);
        };
        startProg();
      }, 380);
    } else {
      valEl.classList.add('glitching');
      valEl.addEventListener('animationend', () => valEl.classList.remove('glitching'), { once: true });
      cancelAnims();
      da1Ref.current = dispEl.animate(
        [{ transform: 'scaleX(1)', filter: 'brightness(1)' },
         { transform: 'scaleX(.04)', filter: 'brightness(2.5) saturate(2)' }],
        { duration: 220, easing: 'cubic-bezier(.7,0,1,.7)', fill: 'forwards' }
      );
      setTimeout(() => {
        lblEl.textContent = stat.lbl; lblEl.classList.add('vis');
        valEl.textContent = '########'; descEl.textContent = stat.desc;
        cancelAnims();
        da2Ref.current = dispEl.animate(
          [{ transform: 'scaleX(.04)', filter: 'brightness(2.5) saturate(2)' },
           { transform: 'scaleX(1)', filter: 'brightness(1)' }],
          { duration: 260, easing: 'cubic-bezier(0,.7,.3,1)', fill: 'forwards' }
        );
        da2Ref.current.onfinish = () => {
          dispEl.style.transform = ''; dispEl.style.filter = '';
          transitRef.current = false;
          scrambleTo(valEl, stat.val, 620);
        };
        startProg();
      }, 230);
    }
  }, [mode, cancelAnims, startProg, renderQueue, onChipSync]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    clearInterval(timerRef.current);
    clearInterval(hudTimerRef.current);
    cancelAnims();
    transitRef.current = false;
    idxRef.current = 0;

    if (!active || mode === 'neutral') {
      if (valRef.current) valRef.current.textContent = '—';
      if (descRef.current) descRef.current.textContent = 'Select a track to unlock the numbers.';
      if (lblRef.current) { lblRef.current.textContent = ''; lblRef.current.classList.remove('vis'); }
      renderQueue(0);
      return;
    }

    showStat(0, false);
    const stats = BB[mode as 'capital' | 'operator'] || [];
    timerRef.current = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % stats.length;
      showStat(idxRef.current, true);
    }, BB_DUR);

    hudSecRef.current = 0;
    hudTimerRef.current = setInterval(() => {
      hudSecRef.current++;
      if (hudRRef.current) {
        const h = String(Math.floor(hudSecRef.current / 3600)).padStart(2, '0');
        const m = String(Math.floor((hudSecRef.current % 3600) / 60)).padStart(2, '0');
        const s = String(hudSecRef.current % 60).padStart(2, '0');
        hudRRef.current.textContent = `${h}:${m}:${s}`;
      }
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(hudTimerRef.current);
    };
  }, [mode, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const ghostNum = mode !== 'neutral' ? GHOST_NUM[mode] : '';

  return (
    <>
      <div className="proof-ghost">{ghostNum}</div>
      <div className="proof-copy">
        <div className="eyebrow"><span className="tick" /><b>01 / Proof</b><span>The numbers that earn trust</span></div>
        <h2>Numbers we earned.<br />Not managed. <em>Earned.</em></h2>
        <div className="billboard">
          <div className="bb-frame">
            <div className="bb-hud">
              <span>BASE_STAT :: <span ref={hudLRef}>—</span></span>
              <span className="ts">TIMESTAMP :: <span ref={hudRRef}>00:00:00</span></span>
            </div>
            <span className="bbc tl" /><span className="bbc tr" />
            <span className="bbc bl" /><span className="bbc br" />
            <div className="bb-scan" ref={scanRef} />
            <div className="bb-lbl" ref={lblRef} />
            <div className="bb-display" ref={displayRef}>
              <div className="bb-val" ref={valRef}>—</div>
              <div className="bb-desc" ref={descRef}>Select a track to unlock the numbers.</div>
            </div>
            <div className="bb-prog" ref={progRef} />
          </div>
          <div className="bb-queue" ref={queueRef} />
        </div>
      </div>
    </>
  );
}
