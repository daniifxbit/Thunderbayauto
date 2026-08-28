import { useCallback, useEffect, useState } from 'react';
import { AdminFooter } from './AdminFooter';
import { AdminHeader } from './AdminHeader';
import { CategoriesView } from './CategoriesView';
import { LockScreen, type UnlockError } from './LockScreen';
import { PartEditor } from './PartEditor';
import { PartsView } from './PartsView';
import { SettingsView } from './SettingsView';
import { StatStrip } from './StatStrip';
import * as db from '../lib/catalogue';
import { isSignedIn, onAuthChange, signIn, signOut, type SignInFailure } from '../lib/auth';
import {
  ADMIN_EMAIL,
  SUPABASE_URL,
  configIssue,
  secretKeyMisused,
  supabaseConfigured,
} from '../lib/supabase';
import { MissingConfig } from '../MissingConfig';
import type { Tab } from '../lib/tabs';
import type { Catalogue, Category, Part, PartForm, Vehicle } from '../lib/types';
import { blankForm, formFromPart } from '../lib/types';
import './admin.css';

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>('produits');
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterVeh, setFilterVeh] = useState('all');

  const [form, setForm] = useState<PartForm | null>(null);
  const [editingImage, setEditingImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmDelPart, setConfirmDelPart] = useState<string | null>(null);
  const [confirmDelCat, setConfirmDelCat] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  /* ------------------------------------------------------------ données ---- */

  const reload = useCallback(async () => {
    try {
      setCatalogue(await db.fetchCatalogue());
      setBanner(null);
    } catch (err) {
      setBanner(err instanceof Error ? err.message : 'chargement impossible');
    }
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) {
      setReady(true);
      return;
    }
    (async () => {
      const signed = await isSignedIn();
      setAuthed(signed);
      if (signed) await reload();
      setReady(true);
    })();
  }, [reload]);

  // Une session expirée ou fermée ailleurs reverrouille l'écran.
  useEffect(() => {
    if (!supabaseConfigured) return;
    return onAuthChange((signed) => {
      setAuthed(signed);
      if (!signed) {
        setCatalogue(null);
        setForm(null);
      }
    });
  }, []);

  // Le catalogue peut changer depuis un autre poste : resynchronisation au retour.
  useEffect(() => {
    if (!authed) return;
    const onFocus = () => void reload();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [authed, reload]);

  /** Toute écriture passe par ici : on recharge après coup, on signale sinon. */
  const mutate = useCallback(
    async (action: () => Promise<void>): Promise<boolean> => {
      try {
        await action();
        await reload();
        return true;
      } catch (err) {
        setBanner(err instanceof Error ? err.message : 'enregistrement impossible');
        return false;
      }
    },
    [reload],
  );

  /* --------------------------------------------------------- ouverture ---- */

  async function unlock(password: string): Promise<UnlockError | null> {
    const error = await signIn(password);
    if (!error) {
      setAuthed(true);
      await reload();
      return null;
    }

    const messages: Record<SignInFailure, string> = {
      invalid: 'MOT DE PASSE INCORRECT — RÉESSAYEZ.',
      rate: 'TROP DE TENTATIVES — RÉESSAYEZ DANS QUELQUES MINUTES.',
      badKey: 'CLÉ SUPABASE REFUSÉE PAR LE PROJET.',
      emailDisabled:
        "LA CONNEXION PAR E-MAIL EST DÉSACTIVÉE DANS SUPABASE — RÉACTIVEZ LE FOURNISSEUR « EMAIL ».",
      unconfirmed: "L'ADRESSE DU COMPTE N'EST PAS CONFIRMÉE DANS SUPABASE.",
      unreachable: "PROJET SUPABASE INJOIGNABLE — VÉRIFIEZ L'ADRESSE DU PROJET.",
      noAdminEmail: 'AUCUNE ADRESSE ADMINISTRATEUR CONFIGURÉE (VITE_ADMIN_EMAIL).',
    };

    // Sur les pannes de configuration, un défaut de saisie repéré à l'avance
    // explique mieux la panne que le message générique.
    const configFailures: SignInFailure[] = ['unreachable', 'badKey', 'noAdminEmail'];
    const hint = configFailures.includes(error.failure) ? configIssue() : null;

    return {
      message: hint ?? messages[error.failure],
      detail:
        error.failure === 'invalid'
          ? undefined
          : `${error.detail} · projet ${SUPABASE_URL || '(vide)'} · compte ${ADMIN_EMAIL || '(vide)'}`,
    };
  }

  async function lock() {
    await signOut();
    setAuthed(false);
    setCatalogue(null);
    setForm(null);
    setTab('produits');
  }

  /* ------------------------------------------------------------- pièces ---- */

  function openNewPart() {
    setTab('produits');
    setConfirmDelPart(null);
    setFormError(null);
    setEditingImage('');
    setForm(blankForm(catalogue ? catalogue.categories : []));
  }

  function openPart(part: Part) {
    setConfirmDelPart(null);
    setFormError(null);
    setEditingImage(part.image);
    setForm(formFromPart(part));
  }

  async function savePart() {
    if (!form) return;
    if (!form.name.trim()) {
      setFormError('LE NOM DE LA PIÈCE EST OBLIGATOIRE.');
      return;
    }

    setSaving(true);
    const id = form.id;
    const done = await mutate(() =>
      id ? db.updatePart(id, form, editingImage) : db.createPart(form),
    );
    setSaving(false);

    if (!done) {
      setFormError('ENREGISTREMENT IMPOSSIBLE — LA FICHE RESTE OUVERTE.');
      return;
    }
    setForm(null);
    setFormError(null);
    setEditingImage('');
  }

  async function deletePart(part: Part) {
    if (confirmDelPart !== part.id) {
      setConfirmDelPart(part.id);
      return;
    }
    setConfirmDelPart(null);
    await mutate(() => db.deletePart(part));
  }

  /* --------------------------------------------------------- catégories ---- */

  async function addCategory() {
    const name = newCatName.trim();
    if (!name || !catalogue) return;
    setNewCatName('');
    await mutate(() => db.createCategory(name, catalogue.categories.length + 1));
  }

  async function renameCategory(id: string, name: string) {
    await mutate(() => db.patchCategory(id, { name }));
  }

  async function toggleCategoryVehicle(category: Category, vehicle: Vehicle) {
    const vehicles = category.vehicles.includes(vehicle)
      ? category.vehicles.filter((v) => v !== vehicle)
      : [...category.vehicles, vehicle];
    await mutate(() => db.patchCategory(category.id, { vehicles }));
  }

  async function deleteCategory(category: Category, partCount: number) {
    if (partCount > 0) return;
    if (confirmDelCat !== category.id) {
      setConfirmDelCat(category.id);
      return;
    }
    setConfirmDelCat(null);
    await mutate(() => db.deleteCategory(category.id));
  }

  /* ----------------------------------------------------------- réglages ---- */

  async function saveWhatsapp(value: string) {
    await mutate(() => db.saveWhatsapp(value));
  }

  async function reset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setConfirmReset(false);
    await mutate(() => db.resetCatalogue());
  }

  /* --------------------------------------------------------------- vue ---- */

  if (!supabaseConfigured || secretKeyMisused) return <MissingConfig issue={configIssue()} />;
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
      <AdminHeader tab={tab} updatedLabel={updatedLabel} onTab={setTab} onNewPart={openNewPart} />

      {banner ? (
        <div className="banner">
          <span>{banner.toUpperCase()}</span>
          <button type="button" onClick={() => void reload()}>
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
          onReset={() => void reset()}
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
            setEditingImage('');
          }}
        />
      ) : null}

      <AdminFooter onLock={() => void lock()} />
    </div>
  );
}
