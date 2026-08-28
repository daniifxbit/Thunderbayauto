import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Tolère une adresse collée sans `https://` ou avec une barre oblique finale. */
function normalizeUrl(raw: string): string {
  const trimmed = raw.replace(/\/+$/, '');
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
}

export const SUPABASE_URL = normalizeUrl(clean(import.meta.env.VITE_SUPABASE_URL));
const anonKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY);

/** Compte administrateur Supabase derrière l'écran de déverrouillage à un seul champ. */
export const ADMIN_EMAIL = clean(import.meta.env.VITE_ADMIN_EMAIL);

export const IMAGE_BUCKET = 'pieces';

/** Sans clés, l'application affiche un écran de configuration plutôt qu'une page cassée. */
export const supabaseConfigured = Boolean(SUPABASE_URL && anonKey);

/* --------------------------------------------------------------- la clé ---- */

export type KeyKind = 'publishable' | 'legacy' | 'secret' | 'inconnue';

function decodeRole(jwt: string): string | null {
  const payload = jwt.split('.')[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const role = (JSON.parse(json) as { role?: unknown }).role;
    return typeof role === 'string' ? role : null;
  } catch {
    return null;
  }
}

export function keyKind(): KeyKind {
  if (!anonKey) return 'inconnue';
  if (anonKey.startsWith('sb_secret_')) return 'secret';
  if (anonKey.startsWith('sb_publishable_')) return 'publishable';
  if (anonKey.startsWith('eyJ')) {
    return decodeRole(anonKey) === 'service_role' ? 'secret' : 'legacy';
  }
  return 'inconnue';
}

/**
 * Une clé secrète dans le navigateur donne à n'importe quel visiteur les pleins
 * pouvoirs sur la base : on refuse de s'en servir.
 */
export const secretKeyMisused = keyKind() === 'secret';

/* ------------------------------------------------------- erreurs de saisie ---- */

/** Décrit une adresse ou une clé manifestement fausse, avant même tout appel. */
export function configIssue(): string | null {
  if (secretKeyMisused) {
    return "LA CLÉ ENREGISTRÉE EST UNE CLÉ SECRÈTE. IL FAUT CELLE DU CADRE « PUBLISHABLE KEY ».";
  }
  if (/supabase\.(com|io)\/dashboard/i.test(SUPABASE_URL)) {
    return "L'ADRESSE ENREGISTRÉE EST CELLE DU TABLEAU DE BORD. IL FAUT CELLE DU PROJET, DU GENRE HTTPS://ABCDEFGH.SUPABASE.CO";
  }
  if (SUPABASE_URL && !/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(SUPABASE_URL)) {
    return 'ADRESSE DU PROJET INHABITUELLE — VÉRIFIEZ : ' + SUPABASE_URL.toUpperCase();
  }
  if (keyKind() === 'inconnue') {
    return "LA CLÉ N'A PAS LE FORMAT ATTENDU — ELLE COMMENCE NORMALEMENT PAR SB_PUBLISHABLE_.";
  }
  if (!ADMIN_EMAIL) {
    return "AUCUNE ADRESSE ADMINISTRATEUR ENREGISTRÉE (VITE_ADMIN_EMAIL).";
  }
  return null;
}

/**
 * La session administrateur vit dans le `sessionStorage` : elle se ferme avec
 * l'onglet, comme le prévoyait la maquette.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || 'https://exemple.supabase.co',
  secretKeyMisused ? 'cle-refusee' : anonKey || 'cle-absente',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: typeof window === 'undefined' ? undefined : window.sessionStorage,
      storageKey: 'tba.admin.session',
    },
  },
);
