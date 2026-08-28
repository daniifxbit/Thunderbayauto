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
    <div className="s-float">
      <button type="button" className="s-float__cart" onClick={onOpenCart}>
        {t.cartBtn}
        <span className="s-float__count">{count}</span>
      </button>

      <a href={waHref} className="s-float__wa" aria-label="Écrire sur WhatsApp">
        <span className="s-float__pulse" />
        WhatsApp
        <span className="s-float__num">{whatsappRaw || t.tbc}</span>
      </a>
    </div>
  );
}
