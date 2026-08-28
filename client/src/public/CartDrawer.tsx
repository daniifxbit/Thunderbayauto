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
    <div className="basket">
      <button type="button" className="basket__scrim" aria-label={t.close} onClick={onClose} />

      <aside className="basket__panel" aria-label={t.cartBtn}>
        <div className="basket__head">
          <div>
            <span className="tag">{t.cartKicker}</span>
            <h2 className="basket__title">{title}</h2>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            {t.close}
          </button>
        </div>

        <div className="basket__list">
          {cart.map((item, index) => (
            <div key={item.id} className="line">
              <span className="thumb">{item.image ? <img src={item.image} alt="" /> : null}</span>
              <span className="line__text">
                <b>{item.name}</b>
                <i>
                  {item.ref} · {item.price}
                </i>
              </span>
              <span className="line__qty">
                <button type="button" className="step" onClick={() => setQty(index, item.qty - 1)}>
                  −
                </button>
                <span className="step__value">{item.qty}</span>
                <button type="button" className="step" onClick={() => setQty(index, item.qty + 1)}>
                  +
                </button>
                <button type="button" className="line__remove" onClick={() => setQty(index, 0)}>
                  {t.remove}
                </button>
              </span>
            </div>
          ))}

          {empty ? (
            <div className="basket__empty">
              <span className="empty__title">{t.cartEmptyTitle}</span>
              <p>{t.cartEmptyText}</p>
            </div>
          ) : null}
        </div>

        <div className="basket__foot">
          <span className="tag">{t.waMsgLabel}</span>
          <pre className="basket__msg">{message}</pre>
          <a
            href={href}
            className={'btn btn--wide ' + (empty ? 'btn--ghost' : 'btn--red')}
            target={!empty && whatsappDigits ? '_blank' : undefined}
            rel={!empty && whatsappDigits ? 'noopener' : undefined}
            onClick={onClose}
          >
            {label}
          </a>
          <span className="basket__note">{note}</span>
        </div>
      </aside>
    </div>
  );
}
