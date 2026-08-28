import hero from '../assets/hero-atelier.png';
import type { Dict } from './i18n';

export function Hero({ t }: { t: Dict }) {
  return (
    <section id="accueil" className="s-hero">
      <div className="s-wrap">
        <div className="s-hero__frame">
          <img
            className="s-hero__image"
            src={hero}
            alt="Plaque d'acier brossée traversée d'une ligne rouge — identité Thunder Bay Auto"
          />
          <div className="s-hero__veil" />
          <div className="s-hero__content">
            <div className="s-hero__top">
              <span>{t.heroKicker}</span>
              <span className="s-hero__rule" />
              <span className="s-hero__stock">
                <span className="s-dot s-dot--bright" />
                {t.heroStock}
              </span>
            </div>

            <h1 className="s-hero__title">
              <span>{t.heroT1}</span>
              <span className="s-hero__title-em">{t.heroT2}</span>
            </h1>

            <div className="s-hero__bottom">
              <div className="s-hero__meta">
                {t.heroMeta1}
                <br />
                {t.heroMeta2}
              </div>
              <div className="s-hero__ctas">
                <a href="#catalogue" className="s-btn s-btn--red">
                  {t.heroCta1}
                  <span className="s-arrow">→</span>
                </a>
                <a href="#recherche" className="s-btn s-btn--ghost">
                  {t.heroCta2}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="s-intro">
          <p className="s-intro__lead">{t.heroLead}</p>

          <div className="s-intro__questions">
            <span className="s-kicker">{t.q3Kicker}</span>
            <div className="s-intro__list">
              <span>
                <span className="s-intro__num">01</span>
                {t.q1}
              </span>
              <span>
                <span className="s-intro__num">02</span>
                {t.q2}
              </span>
              <span>
                <span className="s-intro__num">03</span>
                {t.q3}
              </span>
            </div>
          </div>

          <div className="s-intro__ctas">
            <a href="#catalogue" className="s-plate s-plate--filled">
              {t.ctaBrowse}
              <span className="s-arrow s-arrow--dim">→</span>
            </a>
            <a href="#recherche" className="s-plate">
              {t.ctaForm}
              <span className="s-arrow s-arrow--dim">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
