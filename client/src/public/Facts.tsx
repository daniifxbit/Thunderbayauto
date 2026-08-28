import { useEffect, useRef } from 'react';
import type { Dict } from './i18n';

const DURATION = 1400;

function format(value: number): string {
  return Math.round(value).toLocaleString('fr-CA').replace(/,/g, ' ');
}

/** Le chiffre se compose à l'entrée dans le cadre, puis reste tel quel. */
function Counter({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const settle = () => {
      node.textContent = format(target) + (suffix ? ' ' + suffix : '');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      settle();
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const start = performance.now();
          const step = (now: number) => {
            const k = Math.min(1, (now - start) / DURATION);
            node.textContent =
              format(target * (1 - Math.pow(1 - k, 3))) + (suffix ? ' ' + suffix : '');
            if (k < 1) frame = requestAnimationFrame(step);
          };
          frame = requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, suffix]);

  return (
    <div ref={ref} className="s-fact__value">
      {format(target) + (suffix ? ' ' + suffix : '')}
    </div>
  );
}

export function Facts({ t }: { t: Dict }) {
  return (
    <section className="s-section">
      <div className="s-wrap">
        <div className="s-head">
          <span className="s-kicker">{t.kFacts}</span>
          <span className="s-head__note">{t.factsNote}</span>
        </div>

        <div className="s-facts">
          <div className="s-fact">
            <Counter target={720000} />
            <div className="s-fact__label">{t.fact1}</div>
          </div>
          <div className="s-fact">
            <Counter target={150} suffix="$" />
            <div className="s-fact__label">{t.fact2}</div>
          </div>
          <div className="s-fact">
            <Counter target={30} suffix="j" />
            <div className="s-fact__label">
              {t.fact3} <span className="s-fact__tbc">{t.tbc}</span>
            </div>
          </div>
          <div className="s-fact">
            <div className="s-fact__value s-fact__value--short">AM. DU N.</div>
            <div className="s-fact__label">{t.fact4}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
