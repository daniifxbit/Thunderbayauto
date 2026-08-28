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
    <div className="sheet" role="dialog" aria-modal="true" aria-label={part.name}>
      <button type="button" className="sheet__scrim" aria-label={t.close} onClick={onClose} />

      <div className="sheet__panel">
        <div className="sheet__media">
          {part.image ? <img src={part.image} alt={part.name} /> : null}
          {!part.image ? (
            <span className="sheet__soon">
              {t.photoSoon}
              <i>{part.ref}</i>
            </span>
          ) : null}
          <span className="sheet__state">{(part.state || '—').toUpperCase()}</span>
        </div>

        <div className="sheet__body">
          <div className="sheet__top">
            <span className="tag">
              {t.detailKicker}
              <br />
              {categoryName.toUpperCase()}
            </span>
            <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
              {t.close}
            </button>
          </div>

          <h2 className="sheet__name">{part.name}</h2>
          <p className="sheet__desc">{part.desc.trim() || t.noDesc}</p>

          <div className="specs">
            {specs.map(([label, value, filled]) => (
              <div key={label} className="spec">
                <span className="spec__label">{label}</span>
                <span className={'spec__value' + (filled ? '' : ' spec__value--none')}>{value}</span>
              </div>
            ))}
          </div>

          <div className="sheet__actions">
            <button type="button" className="btn btn--red btn--wide" onClick={onAdd}>
              {inCart ? t.inCart : t.addCart}
            </button>
            <a href="#recherche" className="btn btn--ghost" onClick={onClose}>
              {t.askPriceShort}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
