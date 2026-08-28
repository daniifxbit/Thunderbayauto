/** Le site public et l'espace administrateur vivent dans la même application. */
export const PUBLIC_PATH = '/';
export const ADMIN_PATH = '/admin';

export type Route = 'public' | 'admin';

export function routeFor(pathname: string): Route {
  return pathname.replace(/\/+$/, '') === ADMIN_PATH ? 'admin' : 'public';
}

/** Navigation interne sans rechargement, en préservant les ancres du site public. */
export function navigate(path: string): void {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
