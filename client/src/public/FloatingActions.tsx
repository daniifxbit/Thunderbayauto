import type { Dict } from './i18n';

interface Props {
  t: Dict;
  count: number;
  whatsappDigits: string;
  whatsappRaw: string;
  onOpenCart: () => void;
}

/** Panier et WhatsApp, toujours à portée en bas à droite. */
export function FloatingActions({ t, count, whatsappDigits, whatsappRaw, onOpenCart }: Props) {
  const waHref = whatsappDigits ? 'https://wa.me/' + whatsappDigits : '#recherche';

  return (
    <div className="dock">
      <a href={waHref} className="dock__wa" aria-label="WhatsApp">
        <i className="pulse" />
        WhatsApp
        <span className="dock__num">{whatsappRaw || t.tbc}</span>
      </a>

      <button type="button" className="dock__cart" onClick={onOpenCart}>
        {t.cartBtn}
        <span className="dock__count">{count}</span>
      </button>
    </div>
  );
}
