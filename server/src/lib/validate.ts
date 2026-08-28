import { VEHICLES, type Part, type Vehicle } from '../types.js';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const MAX_SHORT = 200;
const MAX_LONG = 2000;
const MAX_IMAGE = 4000;

export function str(value: unknown, max = MAX_SHORT): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new HttpError(400, 'champ texte attendu');
  const trimmed = value.trim();
  if (trimmed.length > max) throw new HttpError(400, `champ trop long (max ${max} caractères)`);
  return trimmed;
}

export function vehicles(value: unknown): Vehicle[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<Vehicle>();
  for (const v of value) {
    if (typeof v === 'string' && (VEHICLES as readonly string[]).includes(v)) seen.add(v as Vehicle);
  }
  return VEHICLES.filter((v) => seen.has(v));
}

/**
 * Une image est soit un fichier déposé sur ce serveur (`/uploads/…`),
 * soit une adresse http(s) collée dans l'éditeur.
 */
export function imageRef(value: unknown): string {
  const raw = str(value, MAX_IMAGE);
  if (!raw) return '';
  if (raw.startsWith('/uploads/')) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  throw new HttpError(400, "adresse d'image invalide");
}

export function newId(prefix: string): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Normalisation reprise de la maquette : un prix vide est publié « À renseigner »,
 * jamais comme un prix inventé.
 */
export function normalizePart(body: unknown, id: string): Part {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = str(b.name);
  if (!name) throw new HttpError(400, 'le nom de la pièce est obligatoire');

  return {
    id,
    ref: str(b.ref) || 'TBA-' + Date.now().toString(36).toUpperCase().slice(-5),
    name,
    catId: str(b.catId),
    vehicles: vehicles(b.vehicles),
    state: str(b.state),
    oem: str(b.oem) || 'À renseigner',
    priceNew: str(b.priceNew) || 'À renseigner',
    priceUsed: str(b.priceUsed) || 'À renseigner',
    fit: str(b.fit, MAX_LONG) || 'Selon véhicule, moteur et année',
    stock: str(b.stock, 40),
    image: imageRef(b.image),
    desc: str(b.desc, MAX_LONG),
  };
}
