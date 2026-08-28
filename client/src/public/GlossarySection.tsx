import { useState } from 'react';
import type { Dict } from './i18n';
import { useReveal } from './motion';

/** Survolez un terme, sa définition s'inscrit sous le filet rouge. */
export function GlossarySection({ t }: { t: Dict }) {
  const [definition, setDefinition] = useState<string | null>(null);
  const ref = useReveal<HTMLDivElement>(0.2);

  return (
    <section className="band">
      <div className="hold">
        <div className="gloss" ref={ref}>
          <div className="gloss__left">
            <span className="tag">{t.kGloss}</span>
            <h2 className="gloss__title">{t.glossTitle}</h2>
            <p className="gloss__desc">{t.glossDesc}</p>
          </div>

          <div className="gloss__right">
            <div className="gloss__terms">
              {t.glossary.map(([term, def]) => (
                <button
                  key={term}
                  type="button"
                  data-gloss
                  className="gloss__term"
                  onMouseEnter={() => setDefinition(def)}
                  onMouseLeave={() => setDefinition(null)}
                  onFocus={() => setDefinition(def)}
                  onBlur={() => setDefinition(null)}
                >
                  {term}
                </button>
              ))}
            </div>
            <p className="gloss__def">{definition ?? t.glossHint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
