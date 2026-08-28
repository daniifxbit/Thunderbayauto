import { ChapterHead } from './Chapter';
import type { Dict } from './i18n';
import { useReveal } from './motion';

/** La localisation est traitée comme une information de premier plan, pas une note. */
export function LocationSection({ t }: { t: Dict }) {
  const ref = useReveal<HTMLDivElement>(0.2);

  return (
    <section id="localisation" className="band">
      <div className="hold">
        <ChapterHead
          index="06"
          kicker={t.kLoc}
          title={t.locHq}
          aside={<span className="tag tag--red">{t.locNote}</span>}
        />

        <div className="loc" ref={ref}>
          <div className="loc__address">
            <span className="loc__street chrome">520 Squier St</span>
            <span className="loc__city">Thunder Bay, ON P7B 4A8 · Canada</span>
            <a href="tel:+15482582104" className="loc__tel">
              {t.telLabel} · +1 548-258-2104
            </a>
          </div>

          <div className="loc__zone">
            <span className="tag">{t.locZone}</span>
            <ul>
              {[t.zone1, t.zone2, t.zone3, t.zone4].map((zone) => (
                <li key={zone}>{zone}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
