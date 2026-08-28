import type { Dict } from './i18n';
import type { VehicleFilter } from './SiteApp';
import type { Category, Part, Vehicle } from '../lib/types';
import { hasNumber } from '../lib/types';

interface Props {
  t: Dict;
  loading: boolean;
  categories: Category[];
  visible: Part[];
  rows: Part[];
  activeCatId: string | null;
  vehicle: VehicleFilter;
  query: string;
  totalParts: number;
  searching: boolean;
  categoryName: (id: string) => string;
  inCart: (id: string) => boolean;
  onVehicle: (vehicle: VehicleFilter) => void;
  onCategory: (id: string) => void;
  onQuery: (value: string) => void;
  onAdd: (part: Part) => void;
  onOpen: (part: Part) => void;
}

const FILTERS: VehicleFilter[] = ['Tous', 'Auto', 'Camion', 'Moto', 'Bateau'];

export function CatalogueSection({
  t,
  loading,
  categories,
  visible,
  rows,
  activeCatId,
  vehicle,
  query,
  totalParts,
  searching,
  categoryName,
  inCart,
  onVehicle,
  onCategory,
  onQuery,
  onAdd,
  onOpen,
}: Props) {
  const title = searching ? t.resultsTitle : (categoryName(activeCatId ?? '') || t.catalogueWord);
  const meta =
    (loading ? t.loading : `${rows.length} ${rows.length > 1 ? t.familiesMany : t.familiesOne}`) +
    (vehicle === 'Tous' ? '' : ' · ' + t.veh[vehicle].toUpperCase());

  return (
    <section id="catalogue" className="s-section s-section--cat">
      <div className="s-wrap">
        <div className="s-head s-head--stack">
          <div>
            <span className="s-kicker">{t.kCat}</span>
            <h2 className="s-h2 s-h2--big">
              {t.catT1}
              <br />
              <em>
                {totalParts > 0 ? `${totalParts} ${t.catSubtitleN}` : t.catSubtitleEmpty}
              </em>
            </h2>
          </div>

          <div className="s-catfilters">
            <div className="s-vfilters">
              {FILTERS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={'s-vfilter' + (vehicle === v ? ' s-vfilter--on' : '')}
                  aria-pressed={vehicle === v}
                  onClick={() => onVehicle(v)}
                >
                  {v === 'Tous' ? t.vAll : t.veh[v as Vehicle].toUpperCase()}
                </button>
              ))}
            </div>
            <input
              type="search"
              className="s-search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder={t.searchPh}
              aria-label={t.searchPh}
            />
          </div>
        </div>

        <div className="s-catgrid">
          <div className="s-catlist">
            {categories.map((c) => {
              const count = visible.filter((p) => p.catId === c.id).length;
              const on = !searching && c.id === activeCatId;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={'s-cat' + (on ? ' s-cat--on' : '')}
                  onClick={() => onCategory(c.id)}
                >
                  <span className="s-cat__title">
                    <span className="s-cat__code">{c.code}</span>
                    <span className="s-cat__name">{c.name}</span>
                  </span>
                  <span className="s-cat__meta">
                    <span>{c.vehicles.map((v) => t.veh[v]).join(' · ').toUpperCase()}</span>
                    <span>
                      {count} {t.refsWord}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="s-table">
            <div className="s-table__head">
              <h3 className="s-table__title">{title}</h3>
              <span className="s-table__meta">{meta}</span>
            </div>

            <div className="s-table__scroll">
              <div className="s-table__inner">
                <div className="s-table__row s-table__row--head">
                  <span>{t.thImage}</span>
                  <span>{t.thRef}</span>
                  <span>{t.thPart}</span>
                  <span>{t.thState}</span>
                  <span>{t.thOem}</span>
                  <span>{t.thNew}</span>
                  <span>{t.thUsed}</span>
                  <span className="s-table__cart-head">{t.thCart}</span>
                </div>

                {rows.map((p) => {
                  const held = inCart(p.id);
                  return (
                    <div key={p.id} className="s-table__row" onClick={() => onOpen(p)}>
                      <span className="s-thumb">{p.image ? <img src={p.image} alt="" /> : null}</span>
                      <span className="s-cell-ref">{p.ref}</span>
                      <span className="s-cell-part">
                        <span className="s-cell-part__name">{p.name}</span>
                        <span className="s-cell-part__sub">
                          {(searching ? categoryName(p.catId) + ' · ' : '') + (p.fit || '—')}
                        </span>
                      </span>
                      <span
                        className={
                          's-cell-state' +
                          (/dépose|second/i.test(p.state) ? ' s-cell-state--special' : '')
                        }
                      >
                        {p.state || '—'}
                      </span>
                      <span className="s-cell-oem">{p.oem || '—'}</span>
                      <span
                        className={'s-cell-price' + (hasNumber(p.priceNew) ? '' : ' s-cell-price--empty')}
                      >
                        {p.priceNew || '—'}
                      </span>
                      <span
                        className={
                          's-cell-price' + (hasNumber(p.priceUsed) ? '' : ' s-cell-price--empty')
                        }
                      >
                        {p.priceUsed || '—'}
                      </span>
                      <span className="s-cell-cart">
                        <button
                          type="button"
                          className={'s-add' + (held ? ' s-add--held' : '')}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdd(p);
                          }}
                        >
                          {held ? t.inShort : t.addShort}
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {!loading && rows.length === 0 ? (
              <div className="s-empty">
                <span className="s-empty__title">{t.noRowsTitle}</span>
                <p className="s-empty__text">{t.noRowsText}</p>
                <a href="#recherche" className="s-outline">
                  {t.askThis}
                </a>
              </div>
            ) : null}

            <div className="s-table__foot">
              <span className="s-table__note">{t.catNote}</span>
              <a href="#recherche" className="s-outline">
                {t.askPriceShort}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
