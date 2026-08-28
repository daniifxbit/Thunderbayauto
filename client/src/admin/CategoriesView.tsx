import { useEffect, useRef, useState } from 'react';
import type { Catalogue, Category, Vehicle } from '../lib/types';
import { VEHICLES } from '../lib/types';

interface Props {
  catalogue: Catalogue | null;
  newCatName: string;
  confirmDelete: string | null;
  onNewCatName: (value: string) => void;
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
  onToggleVehicle: (category: Category, vehicle: Vehicle) => void;
  onDelete: (category: Category, partCount: number) => void;
}

/** Le renommage se fait au fil de la frappe : on n'écrit au serveur qu'une fois la
 *  saisie retombée, mais rien ne se perd si l'on quitte l'onglet entre-temps. */
const RENAME_DEBOUNCE_MS = 400;

export function CategoriesView({
  catalogue,
  newCatName,
  confirmDelete,
  onNewCatName,
  onAdd,
  onRename,
  onToggleVehicle,
  onDelete,
}: Props) {
  const categories = catalogue ? catalogue.categories : [];
  const parts = catalogue ? catalogue.parts : [];

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const pending = useRef(new Map<string, { timer: number; value: string }>());
  const renameRef = useRef(onRename);
  renameRef.current = onRename;

  // Le brouillon disparaît dès que le serveur renvoie la même valeur.
  useEffect(() => {
    setDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const c of categories) {
        if (next[c.id] !== undefined && next[c.id] === c.name) {
          delete next[c.id];
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [categories]);

  useEffect(() => {
    const map = pending.current;
    return () => {
      map.forEach(({ timer, value }, id) => {
        clearTimeout(timer);
        renameRef.current(id, value);
      });
      map.clear();
    };
  }, []);

  function editName(id: string, value: string) {
    setDrafts((d) => ({ ...d, [id]: value }));
    const entry = pending.current.get(id);
    if (entry) clearTimeout(entry.timer);
    const timer = window.setTimeout(() => {
      pending.current.delete(id);
      renameRef.current(id, value);
    }, RENAME_DEBOUNCE_MS);
    pending.current.set(id, { timer, value });
  }

  return (
    <main className="main">
      <div className="main__inner main__inner--medium">
        <div className="view-head">
          <div className="view-head__titles">
            <span className="kicker">// STRUCTURE DU CATALOGUE</span>
            <h1 className="page-title">Catégories</h1>
          </div>

          <div className="view-head__tools">
            <input
              className="boxed-input new-cat-input"
              type="text"
              value={newCatName}
              onChange={(e) => onNewCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onAdd();
              }}
              placeholder="Nom de la nouvelle catégorie"
              aria-label="Nom de la nouvelle catégorie"
            />
            <button type="button" className="btn-red new-cat-btn" onClick={onAdd}>
              Ajouter
            </button>
          </div>
        </div>

        <div className="cat-list">
          {categories.map((c) => {
            const count = parts.filter((p) => p.catId === c.id).length;
            const armed = confirmDelete === c.id;
            const locked = count > 0;

            return (
              <div className="cat-row" key={c.id}>
                <span className="cat-row__code">{c.code}</span>
                <input
                  className="cat-row__name"
                  type="text"
                  value={drafts[c.id] ?? c.name}
                  onChange={(e) => editName(c.id, e.target.value)}
                  aria-label={'Nom de la catégorie ' + c.code}
                />
                <span className="cat-row__vehicles">
                  {VEHICLES.map((v) => {
                    const on = c.vehicles.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        className={'veh veh--sm' + (on ? ' veh--on' : '')}
                        aria-pressed={on}
                        onClick={() => onToggleVehicle(c, v)}
                      >
                        {v.toUpperCase()}
                      </button>
                    );
                  })}
                </span>
                <span className="cat-row__right">
                  <span className="cat-row__count">{count} PIÈCES</span>
                  <button
                    type="button"
                    className={
                      'row-btn ' +
                      (locked ? 'row-btn--locked' : armed ? 'row-btn--armed' : 'row-btn--danger')
                    }
                    onClick={() => onDelete(c, count)}
                    disabled={locked}
                  >
                    {locked ? 'VERROUILLÉ' : armed ? 'CONFIRMER' : 'SUPPRIMER'}
                  </button>
                </span>
              </div>
            );
          })}
        </div>

        <p className="cat-note">
          Une catégorie qui contient encore des pièces ne peut pas être supprimée : déplacez ou
          retirez ses pièces d'abord. Les univers cochés déterminent dans quel filtre la catégorie
          apparaît sur le site public.
        </p>
      </div>
    </main>
  );
}
