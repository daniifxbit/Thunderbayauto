import { ADMIN_EMAIL, supabase } from './supabase';

export type SignInFailure = 'invalid' | 'rate' | 'network' | 'config';

export async function isSignedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

/**
 * L'écran de déverrouillage ne demande qu'un mot de passe : l'adresse du compte
 * administrateur est fixée en configuration (`VITE_ADMIN_EMAIL`).
 */
export async function signIn(password: string): Promise<SignInFailure | null> {
  if (!ADMIN_EMAIL) return 'config';

  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
  if (!error) return null;

  if (error.status === 429) return 'rate';
  if (error.status === 400 || error.status === 401) return 'invalid';
  return 'network';
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Prévient quand la session s'ouvre, se ferme ou expire. */
export function onAuthChange(callback: (signedIn: boolean) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(Boolean(session));
  });
  return () => data.subscription.unsubscribe();
}
