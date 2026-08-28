import { useCallback, useEffect, useState } from 'react';
import { AdminFooter } from './components/AdminFooter';
import { AdminHeader } from './components/AdminHeader';
import { CategoriesView } from './components/CategoriesView';
import { LockScreen } from './components/LockScreen';
import { PartEditor } from './components/PartEditor';
import { PartsView } from './components/PartsView';
import { SettingsView } from './components/SettingsView';
import { StatStrip } from './components/StatStrip';
import { ApiError, api } from './lib/api';
import type { Tab } from './lib/tabs';
import type { Catalogue, Category, Part, PartForm, Vehicle } from './lib/types';
import { blankForm, formFromPart } from './lib/types';

export function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>('produits');
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterVeh, setFilterVeh] = useState('all');

  const [form, setForm] = useState<PartForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmDelPart, setConfirmDelPart] = useState<string | null>(null);
  const [confirmDelCat, setConfirmDelCat] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  /* ------------------------------------------------------------ données ---- */

  const loadCatalogue = useCallback(async () => {
    try {
      setCatalogue(await api.catalogue());
    } catch (err) {
      setBanner(err instanceof ApiError ? err.message : 'chargement impossible');
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { authenticated } = await api.session();
        setAuthed(authenticated);
        if (authenticated) await loadCatalogue();
      } catch {
        setBanner('serveur injoignable');
      } finally {
        setReady(true);
      }
    })();
  }, [loadCatalogue]);

  // Le catalogue peut être modifié depuis un autre poste : on se resynchronise
  // dès que l'onglet reprend la main.
  useEffect(() => {
    if (!authed) return;
    const onFocus = () => void loadCatalogue();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [authed, loadCatalogue]);

  /**
   * Toute écriture passe par ici : une session expirée reverrouille l'écran,
   * le reste s'affiche en bandeau sans faire perdre la saisie en cours.
   */
  const mutate = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T | null> => {
      try {
        const result = await action();
        setBanner(null);
        return result;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setAuthed(false);
          setCatalogue(null);
          setBanner('session expirée — reconnectez-vous');
          return null;
        }
        setBanner(err instanceof ApiError ? err.message : 'enregistrement impossible');
        return null;
      }
    },
    [],
  );

  /* ---------------------------------------------------------- ouverture ---- */

  async function unlock(password: string): Promise<string | null> {
    try {
      await api.login(password);
      setAuthed(true);
      setBanner(null);
      await loadCatalogue();
      return null;
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        return 'TROP DE TENTATIVES — RÉESSAYEZ DANS QUELQUES MINUTES.';
      }
      if (err instanceof ApiError && err.status === 0) {
        return 'SERVEUR INJOIGNABLE — VÉRIFIEZ LA CONNEXION.';
      }
      return 'MOT DE PASSE INCORRECT — RÉESSAYEZ.';
    }
  }

  async function lock() {
    await api.logout().catch(() => undefined);
    setAuthed(false);
    setCatalogue(null);
    setForm(null);
    setTab('produits');
  }

  /* -------------------------------------------------------------- pièces ---- */

  function openNewPart() {
    setTab('produits');
    setConfirmDelPart(null);
    setFormError(null);
    setForm(blankForm(catalogue ? catalogue.categories : []));
  }

  function openPart(part: Part) {
    setConfirmDelPart(null);
    setFormError(null);
    setForm(formFromPart(part));
  }

  async function savePart() {
    if (!form) return;
    if (!form.name.trim()) {
      setFormError('LE NOM DE LA PIÈCE EST OBLIGATOIRE.');
      return;
    }

    setSaving(true);
    const result = await mutate(() =>
      form.id ? api.updatePart(form.id, form) : api.createPart(form),
    );
    setSaving(false);

    if (!result) {
      setFormError('ENREGISTREMENT IMPOSSIBLE — LA FICHE RESTE OUVERTE.');
      return;
    }
    setCatalogue(result.catalogue);
    setForm(null);
    setFormError(null);
  }

  async function deletePart(part: Part) {
    if (confirmDelPart !== part.id) {
      setConfirmDelPart(part.id);
      return;
    }
    setConfirmDelPart(null);
    const result = await mutate(() => api.deletePart(part.id));
    if (result) setCatalogue(result.catalogue);
  }

  /* ---------------------------------------------------------- catégories ---- */

  async function addCategory() {
    const name = newCatName.trim();
    if (!name) return;
    setNewCatName('');
    const result = await mutate(() => api.createCategory(name));
    if (result) setCatalogue(result.catalogue);
  }

  async function renameCategory(id: string, name: string) {
    const result = await mutate(() => api.patchCategory(id, { name }));
    if (result) setCatalogue(result.catalogue);
  }

  async function toggleCategoryVehicle(category: Category, vehicle: Vehicle) {
    const vehicles = category.vehicles.includes(vehicle)
      ? category.vehicles.filter((v) => v !== vehicle)
      : [...category.vehicles, vehicle];
    const result = await mutate(() => api.patchCategory(category.id, { vehicles }));
    if (result) setCatalogue(result.catalogue);
  }

  async function deleteCategory(category: Category, partCount: number) {
    if (partCount > 0) return;
    if (confirmDelCat !== category.id) {
      setConfirmDelCat(category.id);
      return;
    }
    setConfirmDelCat(null);
    const result = await mutate(() => api.deleteCategory(category.id));
    if (result) setCatalogue(result.catalogue);
  }

  /* ------------------------------------------------------------ réglages ---- */

  async function saveWhatsapp(value: string) {
    const result = await mutate(() => api.saveSettings({ whatsapp: value }));
    if (result) {
      setCatalogue((current) => (current ? { ...current, settings: result.settings } : current));
    }
  }

  async function resetCatalogue() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setConfirmReset(false);
    const result = await mutate(() => api.resetCatalogue());
    if (result) setCatalogue(result);
  }

  /* ---------------------------------------------------------------- vue ---- */

  if (!ready) return <div className="app" />;

  if (!authed) {
    return (
      <div className="app">
        <LockScreen onUnlock={unlock} />
      </div>
    );
  }

  const updatedLabel = catalogue?.updated
    ? new Date(catalogue.updated).toLocaleString('fr-CA')
    : 'CATALOGUE DE RÉFÉRENCE';

  return (
    <div className="app">
      <AdminHeader
        tab={tab}
        updatedLabel={updatedLabel}
        onTab={setTab}
        onNewPart={openNewPart}
      />

      {banner ? (
        <div className="banner">
          <span>{banner.toUpperCase()}</span>
          <button type="button" onClick={() => void loadCatalogue()}>
            RECHARGER
          </button>
        </div>
      ) : null}

      <StatStrip catalogue={catalogue} />

      {tab === 'produits' ? (
        <PartsView
          catalogue={catalogue}
          query={query}
          filterCat={filterCat}
          filterVeh={filterVeh}
          confirmDelete={confirmDelPart}
          confirmReset={confirmReset}
          onQuery={setQuery}
          onFilterCat={setFilterCat}
          onFilterVeh={setFilterVeh}
          onEdit={openPart}
          onDelete={(part) => void deletePart(part)}
          onReset={() => void resetCatalogue()}
        />
      ) : null}

      {tab === 'categories' ? (
        <CategoriesView
          catalogue={catalogue}
          newCatName={newCatName}
          confirmDelete={confirmDelCat}
          onNewCatName={setNewCatName}
          onAdd={() => void addCategory()}
          onRename={(id, name) => void renameCategory(id, name)}
          onToggleVehicle={(category, vehicle) => void toggleCategoryVehicle(category, vehicle)}
          onDelete={(category, count) => void deleteCategory(category, count)}
        />
      ) : null}

      {tab === 'reglages' ? (
        <SettingsView catalogue={catalogue} onSaveWhatsapp={(v) => void saveWhatsapp(v)} />
      ) : null}

      {form ? (
        <PartEditor
          form={form}
          categories={catalogue ? catalogue.categories : []}
          saving={saving}
          error={formError}
          onChange={(patch) => setForm((current) => (current ? { ...current, ...patch } : current))}
          onSave={() => void savePart()}
          onClose={() => {
            setForm(null);
            setFormError(null);
          }}
        />
      ) : null}

      <AdminFooter onLock={() => void lock()} />
    </div>
  );
}
