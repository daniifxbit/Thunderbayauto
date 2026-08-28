import { useEffect, useRef } from 'react';
import { ChapterHead } from './Chapter';
import type { Dict } from './i18n';
import { prefersReducedMotion, useReveal } from './motion';

const DURATION = 1600;

function format(value: number): string {
  return Math.round(value).toLocaleString('fr-CA').replace(/,/g, ' ');
}

/** Le chiffre se compose à l'entrée dans le cadre, puis reste tel quel. */
function Counter({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const settle = () => {
      node.textContent = format(target) + (suffix ? ' ' + suffix : '');
    };

    if (prefersReducedMotion()) {
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
              format(target * (1 - Math.pow(1 - k, 4))) + (suffix ? ' ' + suffix : '');
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
    <span ref={ref} className="fact__value chrome">
      {format(target) + (suffix ? ' ' + suffix : '')}
    </span>
  );
}

export function Facts({ t }: { t: Dict }) {
  const ref = useReveal<HTMLDivElement>(0.15);

  return (
    <section id="faits" className="band">
      <div className="hold">
        <ChapterHead
          index="02"
          kicker={t.kFacts}
          title={t.factsNote}
          aside={<span className="tag">USD</span>}
        />

        <div className="facts" ref={ref}>
          <div className="fact">
            <Counter target={720000} />
            <p className="fact__label">{t.fact1}</p>
          </div>
          <div className="fact">
            <Counter target={150} suffix="$" />
            <p className="fact__label">{t.fact2}</p>
          </div>
          <div className="fact">
            <Counter target={30} suffix="j" />
            <p className="fact__label">
              {t.fact3} <span className="fact__tbc">{t.tbc}</span>
            </p>
          </div>
          <div className="fact">
            <span className="fact__value fact__value--word chrome">AM. DU N.</span>
            <p className="fact__label">{t.fact4}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
