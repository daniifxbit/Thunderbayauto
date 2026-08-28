import { useMemo } from 'react';
import type { Catalogue, Part, Vehicle } from '../lib/types';
import { VEHICLES, hasNumber } from '../lib/types';

interface Props {
  catalogue: Catalogue | null;
  query: string;
  filterCat: string;
  filterVeh: string;
  confirmDelete: string | null;
  confirmReset: boolean;
  onQuery: (value: string) => void;
  onFilterCat: (value: string) => void;
  onFilterVeh: (value: string) => void;
  onEdit: (part: Part) => void;
  onDelete: (part: Part) => void;
  onReset: () => void;
}

export function PartsView({
  catalogue,
  query,
  filterCat,
  filterVeh,
  confirmDelete,
  confirmReset,
  onQuery,
  onFilterCat,
  onFilterVeh,
  onEdit,
  onDelete,
  onReset,
}: Props) {
  const categories = catalogue ? catalogue.categories : [];
  const parts = catalogue ? catalogue.parts : [];

  const categoryLabel = useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c.code + ' · ' + c.name]));
    return (id: string) => byId.get(id) ?? '—';
  }, [categories]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parts.filter((p) => {
      if (filterCat !== 'all' && p.catId !== filterCat) return false;
      if (filterVeh !== 'all' && !p.vehicles.includes(filterVeh as Vehicle)) return false;
      if (!q) return true;
      const haystack = `${p.name} ${p.ref} ${p.oem} ${p.fit}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [parts, query, filterCat, filterVeh]);

  const plural = rows.length > 1 ? 'S' : '';
  const meta = catalogue
    ? `${rows.length} PIÈCE${plural} AFFICHÉE${plural} SUR ${parts.length}`
    : 'CHARGEMENT DU CATALOGUE…';

  return (
    <main className="main">
      <div className="main__inner main__inner--wide">
        <div className="view-head">
          <div className="view-head__titles">
            <span className="kicker">// INVENTAIRE</span>
            <h1 className="page-title">Pièces du catalogue</h1>
          </div>

          <div className="view-head__tools">
            <input
              className="boxed-input"
              style={{ minWidth: 220 }}
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Rechercher…"
              aria-label="Rechercher une pièce"
            />
            <select
              className="boxed-input"
              value={filterCat}
              onChange={(e) => onFilterCat(e.target.value)}
              aria-label="Filtrer par catégorie"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
            <select
              className="boxed-input"
              value={filterVeh}
              onChange={(e) => onFilterVeh(e.target.value)}
              aria-label="Filtrer par univers"
            >
              <option value="all">Tous les univers</option>
              {VEHICLES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table">
          <div className="table__scroll">
            <div className="table__head">
              <span>IMAGE</span>
              <span>RÉFÉRENCE</span>
              <span>PIÈCE</span>
              <span>CATÉGORIE</span>
              <span>ÉTAT</span>
              <span>PRIX NEUF</span>
              <span>PRIX OCC.</span>
              <span>STOCK</span>
              <span>ACTIONS</span>
            </div>

            {rows.map((p) => {
              const armed = confirmDelete === p.id;
              return (
                <div className="table__row" key={p.id}>
                  <span className="thumb">{p.image ? <img src={p.image} alt="" /> : null}</span>
                  <span className="cell-ref">{p.ref}</span>
                  <span className="cell-part">
                    <span className="cell-part__name">{p.name}</span>
                    <span className="cell-part__sub">
                      {p.vehicles.join(' · ')} — {p.fit || '—'}
                    </span>
                  </span>
                  <span className="cell-cat">{categoryLabel(p.catId)}</span>
                  <span className="cell-state">{p.state || '—'}</span>
                  <span
                    className={'cell-price' + (hasNumber(p.priceNew) ? '' : ' cell-price--empty')}
                  >
                    {p.priceNew || '—'}
                  </span>
                  <span
                    className={'cell-price' + (hasNumber(p.priceUsed) ? '' : ' cell-price--empty')}
                  >
                    {p.priceUsed || '—'}
                  </span>
                  <span className="cell-stock">{p.stock || '—'}</span>
                  <span className="cell-actions">
                    <button type="button" className="row-btn btn-outline" onClick={() => onEdit(p)}>
                      MODIFIER
                    </button>
                    <button
                      type="button"
                      className={'row-btn ' + (armed ? 'row-btn--armed' : 'row-btn--danger')}
                      onClick={() => onDelete(p)}
                    >
                      {armed ? 'CONFIRMER' : 'RETIRER'}
                    </button>
                  </span>
                </div>
              );
            })}

            <div className="table__meta">{meta}</div>
          </div>
        </div>

        <div className="notice">
          <span>
            LES MODIFICATIONS SONT ENREGISTRÉES SUR LE SERVEUR ET S'AFFICHENT IMMÉDIATEMENT SUR LE
            SITE PUBLIC.
          </span>
          <button
            type="button"
            className={'notice__btn ' + (confirmReset ? 'row-btn--armed' : 'row-btn--danger')}
            onClick={onReset}
          >
            {confirmReset ? 'CONFIRMER LA RÉINITIALISATION' : 'RÉINITIALISER DEPUIS LE CATALOGUE'}
          </button>
        </div>
      </div>
    </main>
  );
}
