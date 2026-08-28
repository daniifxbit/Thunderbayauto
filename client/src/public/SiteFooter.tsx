import logo from '../assets/logo-tba.png';
import { ADMIN_PATH, navigate } from '../lib/routes';
import type { Dict } from './i18n';

interface Props {
  t: Dict;
  whatsappDigits: string;
  whatsappRaw: string;
}

export function SiteFooter({ t, whatsappDigits, whatsappRaw }: Props) {
  const waHref = whatsappDigits ? 'https://wa.me/' + whatsappDigits : '#recherche';

  return (
    <footer className="s-footer">
      <div className="s-wrap s-footer__grid">
        <div>
          <img className="s-footer__logo" src={logo} alt="Thunder Bay Auto" />
          <div className="s-footer__tagline">{t.footTagline}</div>
        </div>

        <div className="s-footer__col">
          <span className="s-footer__col-title">{t.fCatalogue}</span>
          <a href="#catalogue">{t.fCatLink1}</a>
          <a href="#recherche">{t.fCatLink2}</a>
        </div>

        <div className="s-footer__col">
          <span className="s-footer__col-title">{t.fHouse}</span>
          <a href="#services">{t.fServices}</a>
          <a href="#localisation">{t.fLocation}</a>
          <a href="#recherche">{t.fContact}</a>
          <a href="#recherche">{t.fLegal}</a>
          <a href="#recherche">{t.fTerms}</a>
        </div>

        <div className="s-footer__col s-footer__col--mono">
          <span className="s-footer__col-title">{t.fContactTitle}</span>
          <span>520 Squier St, Thunder Bay, ON P7B 4A8</span>
          <a href="tel:+15482582104">+1 548-258-2104</a>
          <span>
            {t.fWhatsapp} · <a href={waHref}>{whatsappRaw || t.tbc}</a>
          </span>
        </div>
      </div>

      <div className="s-wrap s-footer__base">
        <span>{t.copyright}</span>
        <span>{t.pricesUsd}</span>
        <a
          href={ADMIN_PATH}
          className="s-footer__admin"
          onClick={(e) => {
            e.preventDefault();
            navigate(ADMIN_PATH);
          }}
        >
          <span className="s-dot" />
          {t.adminLink}
        </a>
      </div>
    </footer>
  );
}
