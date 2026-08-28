import { useEffect, useState } from 'react';
import type { Dict } from './i18n';

/** Préchargeur chiffré de la maquette : compteur, libellé d'étape, filet rouge. */
export function Preloader({ t }: { t: Dict }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPct(100);
      setDone(true);
      return;
    }

    let value = 0;
    let hide: number | undefined;
    const tick = window.setInterval(() => {
      value = Math.min(100, value + Math.random() * 9 + 3);
      setPct(Math.round(value));
      if (value >= 100) {
        clearInterval(tick);
        hide = window.setTimeout(() => setDone(true), 480);
      }
    }, 90);

    return () => {
      clearInterval(tick);
      if (hide) clearTimeout(hide);
    };
  }, []);

  if (done) return null;

  const label = t.loaderLabels[Math.min(t.loaderLabels.length - 1, Math.floor(pct / 21))];

  return (
    <div className="s-loader">
      <div className="s-loader__bar-top">
        <span>// THUNDER BAY AUTO</span>
        <span>520 SQUIER ST · THUNDER BAY · ON</span>
      </div>
      <div className="s-loader__mid">
        <div className="s-loader__pct">{String(pct).padStart(3, '0')}</div>
        <div className="s-loader__label">{label}</div>
      </div>
      <div className="s-loader__track">
        <div className="s-loader__fill" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}
