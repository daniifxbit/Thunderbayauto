import type { Dict } from './i18n';
import type { Part } from '../lib/types';
import { displayPrice } from '../lib/types';

interface Props {
  t: Dict;
  products: Part[];
  total: number;
  categoryName: (id: string) => string;
  inCart: (id: string) => boolean;
  onAdd: (part: Part) => void;
  onOpen: (part: Part) => void;
}

/** Sélection en stock : uniquement les références dont le prix est renseigné. */
export function StockSection({
  t,
  products,
  total,
  categoryName,
  inCart,
  onAdd,
  onOpen,
}: Props) {
  return (
    <section id="stock" className="s-section">
      <div className="s-wrap">
        <div className="s-head s-head--stack">
          <div>
            <span className="s-kicker">{t.kStock}</span>
            <h2 className="s-h2 s-h2--big">
              {t.stockT1}
              <br />
              <em>{t.stockT2}</em>
            </h2>
          </div>
          <div className="s-head__desc">{t.stockDesc}</div>
        </div>

        <div className="s-cards">
          {products.map((p) => (
            <article key={p.id} className="s-card" onClick={() => onOpen(p)}>
              <div className="s-card__media">
                {p.image ? <img src={p.image} alt={p.name} /> : null}
                <div className="s-card__state">{p.state.toUpperCase()}</div>
                {!p.image ? (
                  <>
                    <div className="s-card__frame" />
                    <div className="s-card__soon">
                      {t.photoSoon}
                      <br />
                      {p.ref}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="s-card__body">
                <div className="s-card__meta">
                  <span>{p.ref}</span>
                  <span>{categoryName(p.catId).toUpperCase()}</span>
                </div>
                <h3 className="s-card__name">{p.name}</h3>
                <div className="s-card__fit">{p.fit.toUpperCase()}</div>

                <div className="s-card__foot">
                  <div>
                    <div className="s-card__price-label">{t.priceLabel}</div>
                    <div className="s-card__price">{displayPrice(p, t.priceTbc)}</div>
                  </div>
                  <button
                    type="button"
                    className="s-btn s-btn--red s-btn--sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd(p);
                    }}
                  >
                    {inCart(p.id) ? t.inCart : t.addCart}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="s-stockline">{t.stockLine(products.length, total)}</div>
      </div>
    </section>
  );
}
