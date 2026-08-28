import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Compte administrateur Supabase derrière l'écran de déverrouillage à un seul champ. */
export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? '';

export const IMAGE_BUCKET = 'pieces';

/** Sans clés, l'application affiche un écran de configuration plutôt qu'une page cassée. */
export const supabaseConfigured = Boolean(url && anonKey);

/**
 * La session administrateur vit dans le `sessionStorage` : elle se ferme avec
 * l'onglet, comme le prévoyait la maquette.
 */
export const supabase: SupabaseClient = createClient(
  url ?? 'https://exemple.supabase.co',
  anonKey ?? 'cle-anon-absente',
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
