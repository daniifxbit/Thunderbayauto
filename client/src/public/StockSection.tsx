import { ChapterHead } from './Chapter';
import type { Dict } from './i18n';
import { useReveal } from './motion';
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
export function StockSection({ t, products, total, categoryName, inCart, onAdd, onOpen }: Props) {
  return (
    <section id="stock" className="band">
      <div className="hold">
        <ChapterHead
          index="03"
          kicker={t.kStock}
          title={
            <>
              {t.stockT1}
              <br />
              <em>{t.stockT2}</em>
            </>
          }
          aside={<p className="chapter__desc">{t.stockDesc}</p>}
        />

        <div className="cards">
          {products.map((part, i) => (
            <StockCard
              key={part.id}
              index={i}
              part={part}
              t={t}
              category={categoryName(part.catId)}
              held={inCart(part.id)}
              onAdd={onAdd}
              onOpen={onOpen}
            />
          ))}
        </div>

        <p className="stockline">{t.stockLine(products.length, total)}</p>
      </div>
    </section>
  );
}

function StockCard({
  index,
  part,
  t,
  category,
  held,
  onAdd,
  onOpen,
}: {
  index: number;
  part: Part;
  t: Dict;
  category: string;
  held: boolean;
  onAdd: (part: Part) => void;
  onOpen: (part: Part) => void;
}) {
  const ref = useReveal<HTMLElement>(0.2);

  return (
    <article
      className="card"
      ref={ref}
      style={{ '--i': index % 3 } as React.CSSProperties}
      onClick={() => onOpen(part)}
    >
      <div className="card__media">
        {part.image ? <img src={part.image} alt={part.name} loading="lazy" /> : null}
        <span className="card__state">{part.state.toUpperCase()}</span>
        {!part.image ? (
          <span className="card__soon">
            {t.photoSoon}
            <i>{part.ref}</i>
          </span>
        ) : null}
      </div>

      <div className="card__body">
        <div className="card__meta">
          <span>{part.ref}</span>
          <span>{category.toUpperCase()}</span>
        </div>
        <h3 className="card__name">{part.name}</h3>
        <p className="card__fit">{part.fit.toUpperCase()}</p>

        <div className="card__foot">
          <span className="card__price">
            <i>{t.priceLabel}</i>
            {displayPrice(part, t.priceTbc)}
          </span>
          <button
            type="button"
            className="btn btn--red btn--sm"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(part);
            }}
          >
            {held ? t.inCart : t.addCart}
          </button>
        </div>
      </div>
    </article>
  );
}
