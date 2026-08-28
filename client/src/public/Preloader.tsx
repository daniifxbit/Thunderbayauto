import { useEffect, useState } from 'react';
import type { Dict } from './i18n';

/** Préchargeur chiffré : le compteur monte, le filet rouge suit, puis la page s'ouvre. */
export function Preloader({ t }: { t: Dict }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true);
      return;
    }

    let value = 0;
    const timers: number[] = [];
    const tick = window.setInterval(() => {
      value = Math.min(100, value + Math.random() * 9 + 4);
      setPct(Math.round(value));
      if (value >= 100) {
        clearInterval(tick);
        timers.push(window.setTimeout(() => setLeaving(true), 260));
        timers.push(window.setTimeout(() => setDone(true), 1000));
      }
    }, 85);

    return () => {
      clearInterval(tick);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (done) return null;

  const label = t.loaderLabels[Math.min(t.loaderLabels.length - 1, Math.floor(pct / 21))];

  return (
    <div className={'boot' + (leaving ? ' boot--out' : '')}>
      <div className="boot__top">
        <span>// THUNDER BAY AUTO</span>
        <span>520 SQUIER ST · THUNDER BAY · ON</span>
      </div>

      <div className="boot__mid">
        <span className="boot__pct">{String(pct).padStart(3, '0')}</span>
        <span className="boot__label">{label}</span>
      </div>

      <div className="boot__track">
        <i style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  );
}
