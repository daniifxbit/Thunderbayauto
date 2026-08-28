import { ADMIN_EMAIL, supabase } from './supabase';

export type SignInFailure =
  /** Le mot de passe ne correspond pas au compte. */
  | 'invalid'
  /** Trop de tentatives, Supabase fait patienter. */
  | 'rate'
  /** La clé publique est refusée par le projet. */
  | 'badKey'
  /** Le fournisseur e-mail est désactivé côté Supabase. */
  | 'emailDisabled'
  /** Le compte existe mais son adresse n'a jamais été confirmée. */
  | 'unconfirmed'
  /** Le projet n'a pas répondu : adresse fausse, projet en pause, réseau coupé. */
  | 'unreachable'
  /** Aucune adresse administrateur n'est configurée. */
  | 'noAdminEmail';

export interface SignInError {
  failure: SignInFailure;
  /** Message brut renvoyé par Supabase, affiché en clair sous l'erreur. */
  detail: string;
}

export async function isSignedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

/**
 * L'écran de déverrouillage ne demande qu'un mot de passe : l'adresse du compte
 * administrateur est fixée en configuration (`VITE_ADMIN_EMAIL`).
 */
export async function signIn(password: string): Promise<SignInError | null> {
  if (!ADMIN_EMAIL) return { failure: 'noAdminEmail', detail: 'VITE_ADMIN_EMAIL' };

  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
  if (!error) return null;

  const detail = error.message || 'erreur inconnue';
  const message = detail.toLowerCase();

  if (/invalid api key|no api key/.test(message)) return { failure: 'badKey', detail };
  if (/logins are disabled|provider is not enabled/.test(message)) {
    return { failure: 'emailDisabled', detail };
  }
  if (/email not confirmed/.test(message)) return { failure: 'unconfirmed', detail };
  if (error.status === 429 || /rate limit/.test(message)) return { failure: 'rate', detail };
  if (/invalid login credentials/.test(message)) return { failure: 'invalid', detail };

  // `AuthRetryableFetchError` — la requête n'a jamais abouti.
  if (!error.status || error.status === 0 || /fetch|network/.test(message)) {
    return { failure: 'unreachable', detail };
  }
  if (error.status === 400 || error.status === 401 || error.status === 422) {
    return { failure: 'invalid', detail };
  }
  return { failure: 'unreachable', detail };
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
