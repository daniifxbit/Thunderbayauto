import type { Dict } from './i18n';

export function LocationSection({ t }: { t: Dict }) {
  return (
    <section id="localisation" className="s-section">
      <div className="s-wrap">
        <div className="s-head">
          <span className="s-kicker">{t.kLoc}</span>
          <span className="s-head__flag">{t.locNote}</span>
        </div>

        <div className="s-loc">
          <div className="s-panel">
            <h3 className="s-panel__title">{t.locHq}</h3>
            <div className="s-loc__address">
              520 Squier St
              <br />
              Thunder Bay, ON P7B 4A8
              <br />
              Canada
            </div>
            <div className="s-loc__contact">
              <span>
                {t.telLabel} · <a href="tel:+15482582104">+1 548-258-2104</a>
              </span>
            </div>
          </div>

          <div className="s-panel">
            <h3 className="s-panel__title">{t.locZone}</h3>
            <div className="s-loc__zones">
              {[t.zone1, t.zone2, t.zone3, t.zone4].map((zone) => (
                <span key={zone}>
                  <span className="s-loc__bullet">·</span>
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
