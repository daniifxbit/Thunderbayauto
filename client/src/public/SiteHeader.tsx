import logo from '../assets/logo-tba.png';
import { LANGS, type Dict, type Lang } from './i18n';

interface Props {
  t: Dict;
  lang: Lang;
  onLang: (lang: Lang) => void;
}

export function SiteHeader({ t, lang, onLang }: Props) {
  return (
    <header className="s-header">
      <div className="s-header__strip">
        <span className="s-header__hq">
          <span className="s-dot" />
          {t.hqLine}
        </span>
        <span className="s-header__contact">
          <span>{t.shipping}</span>
          <span className="s-header__tel">+1 548-258-2104</span>
        </span>
      </div>

      <div className="s-header__row">
        <a href="#accueil" className="s-header__brand">
          <img
            className="s-header__logo"
            src={logo}
            alt="Thunder Bay Auto — monogramme TBA chrome et rouge"
          />
        </a>

        <nav className="s-nav">
          <a href="#catalogue">{t.navCatalogue}</a>
          <a href="#services">{t.navServices}</a>
          <a href="#localisation">{t.navLocation}</a>
          <a href="#recherche">{t.navRequest}</a>

          <span className="s-langs">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={'s-lang' + (lang === l ? ' s-lang--on' : '')}
                aria-pressed={lang === l}
                onClick={() => onLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </span>

          <a href="#recherche" className="s-nav__cta">
            <span className="s-nav__cta-dot" />
            {t.askPrice}
          </a>
        </nav>
      </div>
    </header>
  );
}
