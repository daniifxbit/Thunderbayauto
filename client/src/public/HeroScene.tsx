import { useRef } from 'react';
import { BedScene } from './BedScene';
import { BED_LABELS } from './bedLabels';
import type { Dict, Lang } from './i18n';
import { range, useScrollProgress } from './motion';

/** Nombre de pièces posées, affiché comme un relevé d'atelier. */
const SEATING = [0.42, 0.5, 0.58, 0.66, 0.76, 0.86, 0.94];

export function HeroScene({ t, lang }: { t: Dict; lang: Lang }) {
  const stage = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(stage);
  const labels = BED_LABELS[lang];

  const seated = SEATING.filter((mark) => progress >= mark).length;
  const hintOpacity = 1 - range(progress, 0.04, 0.2);

  return (
    <section id="accueil" className="stage" ref={stage}>
      <div className="stage__pin">
        <div className="stage__scene">
          <BedScene progress={progress} labels={labels} />
        </div>

        <div className="stage__grid">
          <div className="stage__top">
            <span className="tag">{t.heroKicker}</span>
            <span className="tag tag--live">
              <i className="pulse" />
              {t.heroStock}
            </span>
          </div>

          {/* Relevé de montage : la scène dit toujours où elle en est. */}
          <div className="stage__mid">
            <div className="stage__readout" aria-hidden="true">
              <span className="readout__count">
                {String(seated).padStart(2, '0')}
                <i>/07</i>
              </span>
              <span className="readout__label">{labels.caption.split('—')[1]?.trim()}</span>
              <span className="readout__bar">
                <i style={{ transform: `scaleX(${progress})` }} />
              </span>
            </div>
          </div>

          <div className="stage__foot">
            <div className="stage__lead">
              <span className="stage__hint" style={{ opacity: hintOpacity }} aria-hidden="true">
                <i className="hint__rule" />
                {labels.hint}
              </span>

              <h1 className="stage__title">
                <span className="mask">
                  <span className="mask__line">{t.heroT1}</span>
                </span>
                <span className="mask">
                  <span className="mask__line mask__line--alt">{t.heroT2}</span>
                </span>
              </h1>

              <div className="stage__ctas">
                <a href="#catalogue" className="btn btn--red">
                  {t.heroCta1}
                  <i className="btn__arrow">→</i>
                </a>
                <a href="#recherche" className="btn btn--ghost">
                  {t.heroCta2}
                </a>
              </div>

              <div className="stage__meta">
                {t.heroMeta1}
                <br />
                {t.heroMeta2}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
