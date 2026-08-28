import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DATA_DIR, DB_FILE } from './paths.js';
import { seedCategories } from './seed.js';
import type { Catalogue, Category, Part, Settings, Vehicle } from '../types.js';
import { VEHICLES } from '../types.js';

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(dirname(DB_FILE), { recursive: true });

export const db = new DatabaseSync(DB_FILE);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS categories (
    id       TEXT PRIMARY KEY,
    code     TEXT NOT NULL,
    name     TEXT NOT NULL,
    vehicles TEXT NOT NULL DEFAULT '[]',
    seq      INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS parts (
    id          TEXT PRIMARY KEY,
    ref         TEXT NOT NULL DEFAULT '',
    name        TEXT NOT NULL DEFAULT '',
    cat_id      TEXT NOT NULL DEFAULT '',
    vehicles    TEXT NOT NULL DEFAULT '[]',
    state       TEXT NOT NULL DEFAULT '',
    oem         TEXT NOT NULL DEFAULT '',
    price_new   TEXT NOT NULL DEFAULT '',
    price_used  TEXT NOT NULL DEFAULT '',
    fit         TEXT NOT NULL DEFAULT '',
    stock       TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    seq         INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

/* ---------------------------------------------------------------- meta ---- */

export function metaGet(key: string): string | null {
  const row = db.prepare('SELECT value FROM meta WHERE key = ?').get(key) as
    | { value: string }
    | undefined;
  return row ? row.value : null;
}

export function metaSet(key: string, value: string): void {
  db.prepare(
    'INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  ).run(key, value);
}

/** Horodate la dernière modification du catalogue (affichée dans l'en-tête admin). */
export function touchUpdated(): string {
  const now = new Date().toISOString();
  metaSet('updated', now);
  return now;
}

/* ------------------------------------------------------------ sequences ---- */

function nextSeq(table: 'categories' | 'parts'): number {
  const row = db.prepare(`SELECT COALESCE(MAX(seq), 0) AS m FROM ${table}`).get() as { m: number };
  return Number(row.m) + 1;
}

/* ------------------------------------------------------------ mapping ---- */

function parseVehicles(raw: string): Vehicle[] {
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.filter((v): v is Vehicle => (VEHICLES as readonly string[]).includes(v));
  } catch {
    return [];
  }
}

interface CategoryRow {
  id: string;
  code: string;
  name: string;
  vehicles: string;
}

interface PartRow {
  id: string;
  ref: string;
  name: string;
  cat_id: string;
  vehicles: string;
  state: string;
  oem: string;
  price_new: string;
  price_used: string;
  fit: string;
  stock: string;
  image: string;
  description: string;
}

function toCategory(r: CategoryRow): Category {
  return { id: r.id, code: r.code, name: r.name, vehicles: parseVehicles(r.vehicles) };
}

function toPart(r: PartRow): Part {
  return {
    id: r.id,
    ref: r.ref,
    name: r.name,
    catId: r.cat_id,
    vehicles: parseVehicles(r.vehicles),
    state: r.state,
    oem: r.oem,
    priceNew: r.price_new,
    priceUsed: r.price_used,
    fit: r.fit,
    stock: r.stock,
    image: r.image,
    desc: r.description,
  };
}

/* --------------------------------------------------------- catégories ---- */

export function listCategories(): Category[] {
  const rows = db
    .prepare('SELECT id, code, name, vehicles FROM categories ORDER BY seq ASC')
    .all() as unknown as CategoryRow[];
  return rows.map(toCategory);
}

export function getCategory(id: string): Category | null {
  const row = db
    .prepare('SELECT id, code, name, vehicles FROM categories WHERE id = ?')
    .get(id) as unknown as CategoryRow | undefined;
  return row ? toCategory(row) : null;
}

export function insertCategory(cat: Category): Category {
  db.prepare('INSERT INTO categories (id, code, name, vehicles, seq) VALUES (?, ?, ?, ?, ?)').run(
    cat.id,
    cat.code,
    cat.name,
    JSON.stringify(cat.vehicles),
    nextSeq('categories'),
  );
  touchUpdated();
  return cat;
}

export function updateCategory(
  id: string,
  patch: Partial<Pick<Category, 'name' | 'vehicles'>>,
): Category | null {
  const current = getCategory(id);
  if (!current) return null;
  const next: Category = {
    ...current,
    name: patch.name ?? current.name,
    vehicles: patch.vehicles ?? current.vehicles,
  };
  db.prepare('UPDATE categories SET name = ?, vehicles = ? WHERE id = ?').run(
    next.name,
    JSON.stringify(next.vehicles),
    id,
  );
  touchUpdated();
  return next;
}

export function deleteCategory(id: string): void {
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  touchUpdated();
}

export function countPartsInCategory(catId: string): number {
  const row = db.prepare('SELECT COUNT(*) AS n FROM parts WHERE cat_id = ?').get(catId) as {
    n: number;
  };
  return Number(row.n);
}

/* -------------------------------------------------------------- pièces ---- */

/** Les pièces les plus récentes en tête — le prototype empile les ajouts en haut du tableau. */
export function listParts(): Part[] {
  const rows = db
    .prepare(
      `SELECT id, ref, name, cat_id, vehicles, state, oem, price_new, price_used,
              fit, stock, image, description
         FROM parts ORDER BY seq DESC`,
    )
    .all() as unknown as PartRow[];
  return rows.map(toPart);
}

export function getPart(id: string): Part | null {
  const row = db
    .prepare(
      `SELECT id, ref, name, cat_id, vehicles, state, oem, price_new, price_used,
              fit, stock, image, description
         FROM parts WHERE id = ?`,
    )
    .get(id) as unknown as PartRow | undefined;
  return row ? toPart(row) : null;
}

export function insertPart(part: Part): Part {
  db.prepare(
    `INSERT INTO parts (id, ref, name, cat_id, vehicles, state, oem, price_new,
                        price_used, fit, stock, image, description, seq)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    part.id,
    part.ref,
    part.name,
    part.catId,
    JSON.stringify(part.vehicles),
    part.state,
    part.oem,
    part.priceNew,
    part.priceUsed,
    part.fit,
    part.stock,
    part.image,
    part.desc,
    nextSeq('parts'),
  );
  touchUpdated();
  return part;
}

/** Met à jour une pièce sans toucher à sa position dans le tableau. */
export function updatePart(part: Part): Part {
  db.prepare(
    `UPDATE parts SET ref = ?, name = ?, cat_id = ?, vehicles = ?, state = ?, oem = ?,
                      price_new = ?, price_used = ?, fit = ?, stock = ?, image = ?, description = ?
      WHERE id = ?`,
  ).run(
    part.ref,
    part.name,
    part.catId,
    JSON.stringify(part.vehicles),
    part.state,
    part.oem,
    part.priceNew,
    part.priceUsed,
    part.fit,
    part.stock,
    part.image,
    part.desc,
    part.id,
  );
  touchUpdated();
  return part;
}

export function deletePart(id: string): void {
  db.prepare('DELETE FROM parts WHERE id = ?').run(id);
  touchUpdated();
}

/** Nombre de pièces qui pointent encore vers ce fichier image. */
export function countImageUses(image: string): number {
  const row = db.prepare('SELECT COUNT(*) AS n FROM parts WHERE image = ?').get(image) as {
    n: number;
  };
  return Number(row.n);
}

/* ------------------------------------------------------------ réglages ---- */

export function getSettings(): Settings {
  return { whatsapp: metaGet('whatsapp') ?? '' };
}

export function setSettings(patch: Partial<Settings>): Settings {
  if (patch.whatsapp !== undefined) metaSet('whatsapp', patch.whatsapp);
  return getSettings();
}

/* ----------------------------------------------------------- catalogue ---- */

export function readCatalogue(): Catalogue {
  return {
    categories: listCategories(),
    parts: listParts(),
    settings: getSettings(),
    updated: metaGet('updated'),
  };
}

/**
 * Remet la structure du catalogue de référence : 12 catégories, aucune pièce.
 * Les réglages du site (numéro WhatsApp) sont conservés — ce ne sont pas des
 * données de catalogue.
 */
export function resetCatalogue(): Catalogue {
  db.exec('DELETE FROM parts');
  db.exec('DELETE FROM categories');
  const stmt = db.prepare(
    'INSERT INTO categories (id, code, name, vehicles, seq) VALUES (?, ?, ?, ?, ?)',
  );
  seedCategories().forEach((c, i) => {
    stmt.run(c.id, c.code, c.name, JSON.stringify(c.vehicles), i + 1);
  });
  touchUpdated();
  return readCatalogue();
}

/** Premier démarrage : on pose la structure du catalogue, sans aucune pièce. */
export function ensureSeeded(): void {
  const row = db.prepare('SELECT COUNT(*) AS n FROM categories').get() as { n: number };
  if (Number(row.n) > 0) return;
  const stmt = db.prepare(
    'INSERT INTO categories (id, code, name, vehicles, seq) VALUES (?, ?, ?, ?, ?)',
  );
  seedCategories().forEach((c, i) => {
    stmt.run(c.id, c.code, c.name, JSON.stringify(c.vehicles), i + 1);
  });
}
