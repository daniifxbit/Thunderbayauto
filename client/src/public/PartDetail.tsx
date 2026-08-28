import { useEffect } from 'react';
import type { Dict } from './i18n';
import type { Part } from '../lib/types';
import { hasNumber } from '../lib/types';

interface Props {
  t: Dict;
  part: Part;
  categoryName: string;
  inCart: boolean;
  onAdd: () => void;
  onClose: () => void;
}

/** Fiche produit : grande image, descriptif, caractéristiques, panier. */
export function PartDetail({ t, part, categoryName, inCart, onAdd, onClose }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const specs: Array<[string, string, boolean]> = [
    [t.specState, part.state || '—', true],
    [t.specOem, part.oem || '—', true],
    [t.specNew, part.priceNew || '—', hasNumber(part.priceNew)],
    [t.specUsed, part.priceUsed || '—', hasNumber(part.priceUsed)],
    [t.specFit, part.fit || '—', true],
    [t.specStock, part.stock || '—', true],
  ];

  return (
    <div className="s-modal" role="dialog" aria-modal="true" aria-label={part.name}>
      <button type="button" className="s-modal__scrim" aria-label={t.close} onClick={onClose} />

      <div className="s-modal__panel">
        <div className="s-modal__media">
          {part.image ? <img src={part.image} alt={part.name} /> : null}
          {!part.image ? (
            <>
              <div className="s-modal__frame" />
              <div className="s-modal__soon">
                {t.photoSoon}
                <br />
                {part.ref}
              </div>
            </>
          ) : null}
          <div className="s-modal__state">{(part.state || '—').toUpperCase()}</div>
        </div>

        <div className="s-modal__body">
          <div className="s-modal__top">
            <span className="s-modal__kicker">
              {t.detailKicker}
              <br />
              {categoryName.toUpperCase()}
            </span>
            <button type="button" className="s-outline s-outline--sm" onClick={onClose}>
              {t.close}
            </button>
          </div>

          <h2 className="s-modal__name">{part.name}</h2>
          <p className="s-modal__desc">{part.desc.trim() || t.noDesc}</p>

          <div className="s-specs">
            {specs.map(([label, value, filled]) => (
              <div key={label} className="s-spec">
                <span className="s-spec__label">{label}</span>
                <span className={'s-spec__value' + (filled ? '' : ' s-spec__value--empty')}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="s-modal__actions">
            <button type="button" className="s-btn s-btn--red s-btn--wide" onClick={onAdd}>
              {inCart ? t.inCart : t.addCart}
            </button>
            <a href="#recherche" className="s-outline s-outline--pad" onClick={onClose}>
              {t.askPriceShort}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
