import { useEffect, useState, type ChangeEvent } from 'react';
import type { Category, PartForm, Vehicle } from '../lib/types';
import { STATES, VEHICLES, isUploadedImage } from '../lib/types';
import { resizeImage } from '../lib/image';
import { api, ApiError } from '../lib/api';

interface Props {
  form: PartForm;
  categories: Category[];
  saving: boolean;
  error: string | null;
  onChange: (patch: Partial<PartForm>) => void;
  onSave: () => void;
  onClose: () => void;
}

const FIELDS: Array<{
  key: 'ref' | 'name' | 'oem' | 'priceNew' | 'priceUsed' | 'stock';
  label: string;
  placeholder: string;
}> = [
  { key: 'ref', label: 'RÉFÉRENCE INTERNE', placeholder: 'TBA-07-01' },
  { key: 'name', label: 'PIÈCE / FAMILLE', placeholder: 'Hayon avec caméra' },
  { key: 'oem', label: 'RÉFÉRENCE OEM', placeholder: 'Mopar 68… ou À renseigner' },
  { key: 'priceNew', label: 'PRIX NEUF', placeholder: '1 650 $ US' },
  { key: 'priceUsed', label: 'PRIX OCCASION', placeholder: '850 $ US' },
  { key: 'stock', label: 'QUANTITÉ EN STOCK', placeholder: '2' },
];

const HINT =
  'Un champ de prix laissé vide est publié comme « À renseigner » — jamais comme un prix inventé.';

export function PartEditor({
  form,
  categories,
  saving,
  error,
  onChange,
  onSave,
  onClose,
}: Props) {
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const isNew = form.id === null;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function pickFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImageBusy(true);
    setImageError(null);
    try {
      const blob = await resizeImage(file);
      const { url } = await api.uploadImage(blob);
      onChange({ image: url });
    } catch (err) {
      setImageError(
        err instanceof ApiError || err instanceof Error
          ? err.message.toUpperCase()
          : "ENVOI DE L'IMAGE IMPOSSIBLE",
      );
    } finally {
      setImageBusy(false);
    }
  }

  const imageStatus = imageError
    ? imageError
    : imageBusy
      ? "TRAITEMENT DE L'IMAGE…"
      : form.image
        ? 'IMAGE ENREGISTRÉE — REDIMENSIONNÉE À 1000 PX MAX.'
        : "AUCUNE IMAGE — UN GABARIT NEUTRE S'AFFICHERA SUR LE SITE.";

  return (
    <div className="editor" role="dialog" aria-modal="true" aria-label="Fiche pièce">
      <button
        type="button"
        className="editor__scrim"
        aria-label="Fermer l'éditeur"
        onClick={onClose}
      />

      <aside className="editor__panel">
        <div className="editor__head">
          <div className="editor__titles">
            <span className="editor__kicker">{isNew ? '// NOUVELLE PIÈCE' : '// MODIFICATION'}</span>
            <h2 className="editor__title">
              {isNew ? 'Ajouter au catalogue' : 'Modifier la pièce'}
            </h2>
          </div>
          <button type="button" className="btn-outline editor__close" onClick={onClose}>
            FERMER
          </button>
        </div>

        <div className="editor__body">
          <div className="editor__block">
            <span className="field-label">IMAGE DE LA PIÈCE</span>
            <div className="image-frame">{form.image ? <img src={form.image} alt="" /> : null}</div>

            <div className="image-actions">
              <label className="image-btn image-btn--file">
                CHOISIR UN FICHIER
                <input
                  type="file"
                  accept="image/*"
                  onChange={pickFile}
                  style={{ display: 'none' }}
                />
              </label>
              {form.image ? (
                <button
                  type="button"
                  className="image-btn image-btn--clear"
                  onClick={() => {
                    setImageError(null);
                    onChange({ image: '' });
                  }}
                >
                  RETIRER L'IMAGE
                </button>
              ) : null}
            </div>

            <input
              className="underline-input image-url"
              type="text"
              value={isUploadedImage(form.image) ? '' : form.image}
              onChange={(e) => {
                setImageError(null);
                onChange({ image: e.target.value });
              }}
              placeholder="… ou coller une adresse d'image (https://)"
              aria-label="Adresse d'image"
            />
            <span className="image-status">{imageStatus}</span>
          </div>

          {FIELDS.map((f) => (
            <label className="editor__field" key={f.key}>
              <span className="field-label">{f.label}</span>
              <input
                className="underline-input"
                type="text"
                value={form[f.key]}
                onChange={(e) => onChange({ [f.key]: e.target.value } as Partial<PartForm>)}
                placeholder={f.placeholder}
              />
            </label>
          ))}

          <label className="editor__field">
            <span className="field-label">CATÉGORIE</span>
            <select
              className="editor__select"
              value={form.catId}
              onChange={(e) => onChange({ catId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="editor__field">
            <span className="field-label">ÉTAT</span>
            <select
              className="editor__select"
              value={form.state}
              onChange={(e) => onChange({ state: e.target.value })}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="editor__block">
            <span className="field-label">UNIVERS COMPATIBLES</span>
            <div className="veh-row">
              {VEHICLES.map((v) => {
                const on = form.vehicles.includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    className={'veh veh--md' + (on ? ' veh--on' : '')}
                    aria-pressed={on}
                    onClick={() =>
                      onChange({
                        vehicles: on
                          ? form.vehicles.filter((x) => x !== v)
                          : ([...form.vehicles, v] as Vehicle[]),
                      })
                    }
                  >
                    {v.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="editor__field">
            <span className="field-label">DESCRIPTIF (FICHE PRODUIT)</span>
            <textarea
              className="underline-input"
              rows={4}
              value={form.desc}
              onChange={(e) => onChange({ desc: e.target.value })}
              placeholder="Deux ou trois phrases : état réel, provenance, ce qui est inclus."
            />
          </label>

          <label className="editor__field">
            <span className="field-label">COMPATIBILITÉ / NOTES</span>
            <textarea
              className="underline-input"
              rows={3}
              value={form.fit}
              onChange={(e) => onChange({ fit: e.target.value })}
              placeholder="RAM 1500 · 2019-2024 · 5.7 L"
            />
          </label>

          <div className="editor__actions">
            <button
              type="button"
              className="btn-red editor__save"
              onClick={onSave}
              disabled={saving || imageBusy}
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button type="button" className="btn-outline editor__cancel" onClick={onClose}>
              Annuler
            </button>
          </div>

          {error ? <div className="editor__error">{error}</div> : null}
          <div className="editor__hint">{HINT}</div>
        </div>
      </aside>
    </div>
  );
}
