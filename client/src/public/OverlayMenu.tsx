import { useEffect } from 'react';
import { LANGS, type Dict, type Lang } from './i18n';

interface Props {
  t: Dict;
  lang: Lang;
  onLang: (lang: Lang) => void;
  onClose: () => void;
}

/** Sommaire plein écran sur fond flouté : la page reste visible derrière. */
export function OverlayMenu({ t, lang, onLang, onClose }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const entries: Array<[string, string]> = [
    ['#catalogue', t.navCatalogue],
    ['#services', t.navServices],
    ['#localisation', t.navLocation],
    ['#recherche', t.navRequest],
  ];

  return (
    <div className="menu" role="dialog" aria-modal="true" aria-label={t.navCatalogue}>
      <button type="button" className="menu__scrim" aria-label={t.close} onClick={onClose} />

      <div className="menu__panel">
        <div className="menu__head">
          <span className="tag">{t.hqLine}</span>
          <button type="button" className="menu__close" onClick={onClose}>
            {t.close}
          </button>
        </div>

        <nav className="menu__list">
          {entries.map(([href, label], i) => (
            <a
              key={href}
              href={href}
              className="menu__item"
              style={{ '--i': i } as React.CSSProperties}
              onClick={onClose}
            >
              <span className="menu__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="menu__label">{label}</span>
            </a>
          ))}
        </nav>

        <div className="menu__foot">
          <div className="menu__contact">
            <span>520 Squier St, Thunder Bay, ON P7B 4A8</span>
            <a href="tel:+15482582104">+1 548-258-2104</a>
          </div>
          <div className="langs">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={'lang' + (lang === l ? ' lang--on' : '')}
                aria-pressed={lang === l}
                onClick={() => onLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
