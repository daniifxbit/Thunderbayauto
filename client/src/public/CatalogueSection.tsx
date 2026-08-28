import { ChapterHead } from './Chapter';
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
  const title = searching ? t.resultsTitle : categoryName(activeCatId ?? '') || t.catalogueWord;
  const meta =
    (loading ? t.loading : `${rows.length} ${rows.length > 1 ? t.familiesMany : t.familiesOne}`) +
    (vehicle === 'Tous' ? '' : ' · ' + t.veh[vehicle].toUpperCase());

  return (
    <section id="catalogue" className="band">
      <div className="hold">
        <ChapterHead
          index="04"
          kicker={t.kCat}
          title={
            <>
              {t.catT1}
              <br />
              <em>{totalParts > 0 ? `${totalParts} ${t.catSubtitleN}` : t.catSubtitleEmpty}</em>
            </>
          }
        />

        <div className="tools">
          <div className="chips">
            {FILTERS.map((v) => (
              <button
                key={v}
                type="button"
                className={'chip' + (vehicle === v ? ' chip--on' : '')}
                aria-pressed={vehicle === v}
                onClick={() => onVehicle(v)}
              >
                {v === 'Tous' ? t.vAll : t.veh[v as Vehicle].toUpperCase()}
              </button>
            ))}
          </div>
          <input
            type="search"
            className="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t.searchPh}
            aria-label={t.searchPh}
          />
        </div>

        <div className="cat">
          <div className="cat__list">
            {categories.map((c) => {
              const count = visible.filter((p) => p.catId === c.id).length;
              const on = !searching && c.id === activeCatId;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={'cat__item' + (on ? ' cat__item--on' : '')}
                  onClick={() => onCategory(c.id)}
                >
                  <span className="cat__code">{c.code}</span>
                  <span className="cat__name">{c.name}</span>
                  <span className="cat__count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="tablewrap">
            <div className="tablewrap__head">
              <h3 className="tablewrap__title">{title}</h3>
              <span className="tag">{meta}</span>
            </div>

            <div className="tablescroll">
              <div className="tablescroll__inner">
                <div className="trow trow--head">
                  <span>{t.thImage}</span>
                  <span>{t.thRef}</span>
                  <span>{t.thPart}</span>
                  <span>{t.thState}</span>
                  <span>{t.thOem}</span>
                  <span>{t.thNew}</span>
                  <span>{t.thUsed}</span>
                  <span className="trow__right">{t.thCart}</span>
                </div>

                {rows.map((p) => {
                  const held = inCart(p.id);
                  return (
                    <div key={p.id} className="trow" onClick={() => onOpen(p)}>
                      <span className="thumb">
                        {p.image ? <img src={p.image} alt="" loading="lazy" /> : null}
                      </span>
                      <span className="cref">{p.ref}</span>
                      <span className="cpart">
                        <b>{p.name}</b>
                        <i>{(searching ? categoryName(p.catId) + ' · ' : '') + (p.fit || '—')}</i>
                      </span>
                      <span
                        className={
                          'cstate' + (/dépose|second/i.test(p.state) ? ' cstate--special' : '')
                        }
                      >
                        {p.state || '—'}
                      </span>
                      <span className="coem">{p.oem || '—'}</span>
                      <span className={'cprice' + (hasNumber(p.priceNew) ? '' : ' cprice--none')}>
                        {p.priceNew || '—'}
                      </span>
                      <span className={'cprice' + (hasNumber(p.priceUsed) ? '' : ' cprice--none')}>
                        {p.priceUsed || '—'}
                      </span>
                      <span className="trow__right">
                        <button
                          type="button"
                          className={'add' + (held ? ' add--held' : '')}
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
              <div className="empty">
                <span className="empty__title">{t.noRowsTitle}</span>
                <p>{t.noRowsText}</p>
                <a href="#recherche" className="btn btn--ghost btn--sm">
                  {t.askThis}
                </a>
              </div>
            ) : null}

            <div className="tablewrap__foot">
              <span className="tag">{t.catNote}</span>
              <a href="#recherche" className="btn btn--ghost btn--sm">
                {t.askPriceShort}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
