import { useEffect, useState } from 'react';
import logo from '../assets/logo-tba.png';
import type { Dict } from './i18n';

interface Props {
  t: Dict;
  onOpenMenu: () => void;
}

export function SiteHeader({ t, onOpenMenu }: Props) {
  const [solid, setSolid] = useState(false);

  // L'en-tête reste transparent sur la scène d'ouverture, puis se pose.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={'top' + (solid ? ' top--solid' : '')}>
      <a href="#accueil" className="top__brand">
        <img src={logo} alt="Thunder Bay Auto" />
      </a>

      <div className="top__right">
        <span className="top__hq">520 SQUIER ST · THUNDER BAY, ON</span>
        <a href="#recherche" className="btn btn--red btn--sm">
          {t.askPrice}
        </a>
        <button type="button" className="top__menu" onClick={onOpenMenu}>
          <span className="top__bars" aria-hidden="true">
            <i />
            <i />
          </span>
          Menu
        </button>
      </div>
    </header>
  );
}
