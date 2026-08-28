import { useEffect } from 'react';
import type { Dict } from './i18n';
import type { CartItem } from './cart';

interface Props {
  t: Dict;
  cart: CartItem[];
  message: string;
  whatsappDigits: string;
  onChange: (cart: CartItem[]) => void;
  onClose: () => void;
}

/**
 * Panier : quantités, récapitulatif exact du message, puis confirmation sur
 * WhatsApp. Sans numéro enregistré, la demande repart par le formulaire.
 */
export function CartDrawer({ t, cart, message, whatsappDigits, onChange, onClose }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const empty = cart.length === 0;
  const title = empty
    ? t.cartTitleEmpty
    : `${cart.length} ${cart.length > 1 ? t.cartTitleMany : t.cartTitleOne}`;

  const href = empty
    ? '#catalogue'
    : whatsappDigits
      ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`
      : '#recherche';

  const note = empty ? t.cartNoteEmpty : whatsappDigits ? t.cartNoteWa : t.cartNoteNo;
  const label = empty ? t.browseCat : whatsappDigits ? t.confirmWa : t.confirmForm;

  function setQty(index: number, qty: number) {
    const next = cart.slice();
    if (qty <= 0) next.splice(index, 1);
    else next[index] = { ...next[index]!, qty };
    onChange(next);
  }

  return (
    <div className="s-drawer">
      <button type="button" className="s-drawer__scrim" aria-label={t.close} onClick={onClose} />

      <aside className="s-drawer__panel" aria-label={t.cartBtn}>
        <div className="s-drawer__head">
          <div className="s-drawer__titles">
            <span className="s-drawer__kicker">{t.cartKicker}</span>
            <h2 className="s-drawer__title">{title}</h2>
          </div>
          <button type="button" className="s-outline s-outline--sm" onClick={onClose}>
            {t.close}
          </button>
        </div>

        <div className="s-drawer__list">
          {cart.map((item, index) => (
            <div key={item.id} className="s-line">
              <span className="s-thumb">{item.image ? <img src={item.image} alt="" /> : null}</span>
              <span className="s-line__text">
                <span className="s-line__name">{item.name}</span>
                <span className="s-line__meta">
                  {item.ref} · {item.price}
                </span>
              </span>
              <span className="s-line__qty">
                <button type="button" className="s-step" onClick={() => setQty(index, item.qty - 1)}>
                  −
                </button>
                <span className="s-step__value">{item.qty}</span>
                <button type="button" className="s-step" onClick={() => setQty(index, item.qty + 1)}>
                  +
                </button>
                <button type="button" className="s-remove" onClick={() => setQty(index, 0)}>
                  {t.remove}
                </button>
              </span>
            </div>
          ))}

          {empty ? (
            <div className="s-drawer__empty">
              <span className="s-drawer__empty-title">{t.cartEmptyTitle}</span>
              <p className="s-drawer__empty-text">{t.cartEmptyText}</p>
            </div>
          ) : null}
        </div>

        <div className="s-drawer__foot">
          <div className="s-drawer__msg-label">{t.waMsgLabel}</div>
          <div className="s-drawer__msg">{message}</div>
          <a
            href={href}
            className={'s-confirm' + (empty ? ' s-confirm--muted' : '')}
            target={!empty && whatsappDigits ? '_blank' : undefined}
            rel={!empty && whatsappDigits ? 'noopener' : undefined}
            onClick={onClose}
          >
            {label}
          </a>
          <span className="s-drawer__note">{note}</span>
        </div>
      </aside>
    </div>
  );
}
