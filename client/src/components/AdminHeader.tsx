import logo from '../assets/logo-tba.png';
import { PUBLIC_SITE_URL } from '../lib/config';
import type { Tab } from '../lib/tabs';

interface Props {
  tab: Tab;
  updatedLabel: string;
  onTab: (tab: Tab) => void;
  onNewPart: () => void;
}

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'produits', label: 'PIÈCES' },
  { id: 'categories', label: 'CATÉGORIES' },
  { id: 'reglages', label: 'RÉGLAGES' },
];

export function AdminHeader({ tab, updatedLabel, onTab, onNewPart }: Props) {
  return (
    <header className="header">
      <div className="header__strip">
        <span className="header__strip-left">
          <span className="dot" />
          ESPACE ADMINISTRATEUR — GESTION DU CATALOGUE
        </span>
        <span>DERNIÈRE MODIFICATION — {updatedLabel}</span>
      </div>

      <div className="header__row">
        <div className="header__brand">
          <img className="header__logo" src={logo} alt="Thunder Bay Auto" />
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={'tab' + (tab === t.id ? ' tab--active' : '')}
                onClick={() => onTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="header__actions">
          <a className="header__link" href={PUBLIC_SITE_URL}>
            Voir le site
          </a>
          <button type="button" className="btn-red header__add" onClick={onNewPart}>
            + Ajouter une pièce
          </button>
        </div>
      </div>
    </header>
  );
}
