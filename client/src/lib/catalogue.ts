import { IMAGE_BUCKET, supabase } from './supabase';
import type { Catalogue, Category, Part, PartForm, Vehicle } from './types';
import { VEHICLES } from './types';

/* ------------------------------------------------------------- lignes SQL ---- */

interface CategoryRow {
  id: string;
  code: string;
  name: string;
  vehicles: string[] | null;
  position: number;
}

interface PartRow {
  id: string;
  ref: string;
  name: string;
  cat_id: string | null;
  vehicles: string[] | null;
  state: string;
  oem: string;
  price_new: string;
  price_used: string;
  fit: string;
  stock: string;
  image: string;
  description: string;
}

function toVehicles(raw: string[] | null): Vehicle[] {
  if (!raw) return [];
  const kept = new Set(raw.filter((v): v is Vehicle => (VEHICLES as readonly string[]).includes(v)));
  return VEHICLES.filter((v) => kept.has(v));
}

function toCategory(row: CategoryRow): Category {
  return { id: row.id, code: row.code, name: row.name, vehicles: toVehicles(row.vehicles) };
}

function toPart(row: PartRow): Part {
  return {
    id: row.id,
    ref: row.ref,
    name: row.name,
    catId: row.cat_id ?? '',
    vehicles: toVehicles(row.vehicles),
    state: row.state,
    oem: row.oem,
    priceNew: row.price_new,
    priceUsed: row.price_used,
    fit: row.fit,
    stock: row.stock,
    image: row.image,
    desc: row.description,
  };
}

/**
 * Normalisation reprise de la maquette : un prix laissé vide est publié
 * « À renseigner », jamais comme un prix inventé.
 */
function toRow(form: PartForm) {
  return {
    ref: form.ref.trim() || 'TBA-' + Date.now().toString(36).toUpperCase().slice(-5),
    name: form.name.trim(),
    cat_id: form.catId || null,
    vehicles: form.vehicles,
    state: form.state,
    oem: form.oem.trim() || 'À renseigner',
    price_new: form.priceNew.trim() || 'À renseigner',
    price_used: form.priceUsed.trim() || 'À renseigner',
    fit: form.fit.trim() || 'Selon véhicule, moteur et année',
    stock: form.stock.trim(),
    image: form.image.trim(),
    description: form.desc.trim(),
  };
}

export class DataError extends Error {}

function fail(message: string, error: { message: string; code?: string }): never {
  throw new DataError(`${message} (${error.code ?? 'erreur'}) : ${error.message}`);
}

/* ------------------------------------------------------------- catalogue ---- */

export async function fetchCatalogue(): Promise<Catalogue> {
  const [categories, parts, settings] = await Promise.all([
    supabase.from('categories').select('id, code, name, vehicles, position').order('position'),
    supabase
      .from('parts')
      .select(
        'id, ref, name, cat_id, vehicles, state, oem, price_new, price_used, fit, stock, image, description',
      )
      .order('seq', { ascending: false }),
    supabase.from('settings').select('key, value'),
  ]);

  if (categories.error) fail('lecture des catégories impossible', categories.error);
  if (parts.error) fail('lecture des pièces impossible', parts.error);
  if (settings.error) fail('lecture des réglages impossible', settings.error);

  const entries = new Map((settings.data ?? []).map((r) => [r.key as string, r.value as string]));
  const updated = entries.get('catalogue_updated_at') ?? null;

  return {
    categories: ((categories.data ?? []) as CategoryRow[]).map(toCategory),
    parts: ((parts.data ?? []) as PartRow[]).map(toPart),
    settings: { whatsapp: entries.get('whatsapp') ?? '' },
    updated,
  };
}

/* ---------------------------------------------------------------- pièces ---- */

export async function createPart(form: PartForm): Promise<void> {
  const { error } = await supabase.from('parts').insert(toRow(form));
  if (error) fail("ajout de la pièce impossible", error);
}

export async function updatePart(id: string, form: PartForm, previousImage: string): Promise<void> {
  const row = toRow(form);
  const { error } = await supabase.from('parts').update(row).eq('id', id);
  if (error) fail('modification de la pièce impossible', error);
  if (previousImage && previousImage !== row.image) await removeImageIfUnused(previousImage);
}

export async function deletePart(part: Part): Promise<void> {
  const { error } = await supabase.from('parts').delete().eq('id', part.id);
  if (error) fail('suppression de la pièce impossible', error);
  if (part.image) await removeImageIfUnused(part.image);
}

/* ------------------------------------------------------------ catégories ---- */

export async function createCategory(name: string, position: number): Promise<void> {
  const code = String(position).padStart(2, '0');
  const { error } = await supabase.from('categories').insert({
    id: 'c' + code + '-' + Date.now().toString(36),
    code,
    name,
    vehicles: ['Auto'],
    position,
  });
  if (error) fail('ajout de la catégorie impossible', error);
}

export async function patchCategory(
  id: string,
  patch: { name?: string; vehicles?: Vehicle[] },
): Promise<void> {
  const { error } = await supabase.from('categories').update(patch).eq('id', id);
  if (error) fail('modification de la catégorie impossible', error);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    // 23503 : des pièces pointent encore vers cette catégorie.
    if (error.code === '23503') {
      throw new DataError('cette catégorie contient encore des pièces');
    }
    fail('suppression de la catégorie impossible', error);
  }
}

/* -------------------------------------------------------------- réglages ---- */

export async function saveWhatsapp(value: string): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'whatsapp', value }, { onConflict: 'key' });
  if (error) fail('enregistrement du numéro impossible', error);
}

export async function resetCatalogue(): Promise<void> {
  const { error } = await supabase.rpc('reset_catalogue');
  if (error) fail('réinitialisation impossible', error);
}

/* ---------------------------------------------------------------- images ---- */

export async function uploadImage(blob: Blob): Promise<string> {
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}.jpg`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(name, blob, { contentType: blob.type || 'image/jpeg', upsert: false });
  if (error) fail("envoi de l'image impossible", error);

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

/** Nom du fichier dans le bucket, ou `null` pour une adresse externe collée. */
function bucketPath(url: string): string | null {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const at = url.indexOf(marker);
  return at === -1 ? null : decodeURIComponent(url.slice(at + marker.length));
}

export function isUploadedImage(url: string): boolean {
  return bucketPath(url) !== null;
}

/** Supprime le fichier dès qu'aucune pièce ne s'y réfère plus. */
async function removeImageIfUnused(url: string): Promise<void> {
  const path = bucketPath(url);
  if (!path) return;

  const { count, error } = await supabase
    .from('parts')
    .select('id', { count: 'exact', head: true })
    .eq('image', url);
  if (error || (count ?? 0) > 0) return;

  await supabase.storage.from(IMAGE_BUCKET).remove([path]);
}
