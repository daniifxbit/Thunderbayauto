import { ChapterHead } from './Chapter';
import type { Dict } from './i18n';
import { useReveal } from './motion';

/** Les services en rangées numérotées : la séquence d'un achat, dans l'ordre. */
export function ServicesSection({ t }: { t: Dict }) {
  return (
    <section id="services" className="band">
      <div className="hold">
        <ChapterHead index="05" kicker={t.kServices} title={t.servicesTitle} />

        <div className="services">
          {t.services.map(([title, text], i) => (
            <ServiceRow key={title} index={i} title={title} text={text} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ index, title, text }: { index: number; title: string; text: string }) {
  const ref = useReveal<HTMLDivElement>(0.3);

  return (
    <div className="service" ref={ref} style={{ '--i': index % 3 } as React.CSSProperties}>
      <span className="service__num">{String(index + 1).padStart(2, '0')}</span>
      <h3 className="service__title">{title}</h3>
      <p className="service__text">{text}</p>
    </div>
  );
}
