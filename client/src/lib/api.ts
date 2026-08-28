import type { Catalogue, PartForm, Settings, Vehicle } from './types';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { credentials: 'same-origin', ...init });
  } catch {
    throw new ApiError(0, 'serveur injoignable');
  }

  if (res.status === 204) return undefined as T;

  const payload: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `erreur ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return payload as T;
}

function json(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

/** Corps envoyé au serveur pour une pièce (l'identifiant vit dans l'URL). */
function partPayload(form: PartForm) {
  const { id: _id, ...rest } = form;
  return rest;
}

export const api = {
  session: () => request<{ authenticated: boolean }>('/api/auth/session'),

  login: (password: string) =>
    request<{ authenticated: boolean }>('/api/auth/login', json('POST', { password })),

  logout: () => request<{ authenticated: boolean }>('/api/auth/logout', { method: 'POST' }),

  catalogue: () => request<Catalogue>('/api/catalogue'),

  createPart: (form: PartForm) =>
    request<{ catalogue: Catalogue }>('/api/parts', json('POST', partPayload(form))),

  updatePart: (id: string, form: PartForm) =>
    request<{ catalogue: Catalogue }>(`/api/parts/${id}`, json('PUT', partPayload(form))),

  deletePart: (id: string) =>
    request<{ catalogue: Catalogue }>(`/api/parts/${id}`, { method: 'DELETE' }),

  createCategory: (name: string) =>
    request<{ catalogue: Catalogue }>('/api/categories', json('POST', { name })),

  patchCategory: (id: string, patch: { name?: string; vehicles?: Vehicle[] }) =>
    request<{ catalogue: Catalogue }>(`/api/categories/${id}`, json('PATCH', patch)),

  deleteCategory: (id: string) =>
    request<{ catalogue: Catalogue }>(`/api/categories/${id}`, { method: 'DELETE' }),

  saveSettings: (patch: Partial<Settings>) =>
    request<{ settings: Settings }>('/api/settings', json('PUT', patch)),

  resetCatalogue: () => request<Catalogue>('/api/catalogue/reset', { method: 'POST' }),

  uploadImage: (blob: Blob) =>
    request<{ url: string }>('/api/uploads', {
      method: 'POST',
      headers: { 'Content-Type': blob.type || 'image/jpeg' },
      body: blob,
    }),
};
