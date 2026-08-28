import type { Dict } from './i18n';

export function ServicesSection({ t }: { t: Dict }) {
  return (
    <section id="services" className="s-section">
      <div className="s-wrap">
        <div className="s-head">
          <span className="s-kicker">{t.kServices}</span>
          <h2 className="s-h2">{t.servicesTitle}</h2>
        </div>

        <div className="s-services">
          {t.services.map(([title, text], i) => (
            <div key={title} className="s-service">
              <span className="s-service__num">0{i + 1}</span>
              <h3 className="s-service__title">{title}</h3>
              <p className="s-service__text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
