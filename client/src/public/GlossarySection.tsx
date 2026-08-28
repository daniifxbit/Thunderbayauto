import { useState } from 'react';
import type { Dict } from './i18n';

/** Survolez un terme, sa définition s'inscrit sous le filet rouge. */
export function GlossarySection({ t }: { t: Dict }) {
  const [definition, setDefinition] = useState<string | null>(null);

  return (
    <section className="s-section">
      <div className="s-wrap s-wrap--single">
        <div className="s-panel s-panel--gloss">
          <span className="s-kicker">{t.kGloss}</span>
          <h2 className="s-h2 s-h2--panel">{t.glossTitle}</h2>
          <p className="s-panel__text">{t.glossDesc}</p>

          <div className="s-gloss__terms">
            {t.glossary.map(([term, def]) => (
              <span
                key={term}
                data-gloss
                className="s-gloss__term"
                onMouseEnter={() => setDefinition(def)}
                onMouseLeave={() => setDefinition(null)}
                onFocus={() => setDefinition(def)}
                onBlur={() => setDefinition(null)}
                tabIndex={0}
              >
                {term}
              </span>
            ))}
          </div>

          <div className="s-gloss__def">{definition ?? t.glossHint}</div>
        </div>
      </div>
    </section>
  );
}
