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
    <footer className="foot">
      <div className="hold">
        <div className="foot__mark">
          <img src={logo} alt="Thunder Bay Auto" />
          <span className="tag">{t.footTagline}</span>
        </div>

        <div className="foot__cols">
          <div className="foot__col">
            <span className="foot__title">{t.fCatalogue}</span>
            <a href="#catalogue">{t.fCatLink1}</a>
            <a href="#recherche">{t.fCatLink2}</a>
          </div>

          <div className="foot__col">
            <span className="foot__title">{t.fHouse}</span>
            <a href="#services">{t.fServices}</a>
            <a href="#localisation">{t.fLocation}</a>
            <a href="#recherche">{t.fContact}</a>
            <a href="#recherche">{t.fLegal}</a>
            <a href="#recherche">{t.fTerms}</a>
          </div>

          <div className="foot__col foot__col--mono">
            <span className="foot__title">{t.fContactTitle}</span>
            <span>520 Squier St, Thunder Bay, ON P7B 4A8</span>
            <a href="tel:+15482582104">+1 548-258-2104</a>
            <span>
              {t.fWhatsapp} · <a href={waHref}>{whatsappRaw || t.tbc}</a>
            </span>
          </div>
        </div>

        <div className="foot__base">
          <span>{t.copyright}</span>
          <span>{t.pricesUsd}</span>
          <a
            href={ADMIN_PATH}
            className="foot__admin"
            onClick={(e) => {
              e.preventDefault();
              navigate(ADMIN_PATH);
            }}
          >
            <i className="pulse" />
            {t.adminLink}
          </a>
        </div>
      </div>
    </footer>
  );
}
