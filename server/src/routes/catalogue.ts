import { Router } from 'express';
import { requireAuth } from '../lib/auth.js';
import {
  countPartsInCategory,
  deleteCategory,
  deletePart,
  getCategory,
  getPart,
  insertCategory,
  insertPart,
  listCategories,
  readCatalogue,
  resetCatalogue,
  setSettings,
  updateCategory,
  updatePart,
} from '../lib/db.js';
import { HttpError, newId, normalizePart, str, vehicles } from '../lib/validate.js';
import { removeUploadIfUnused } from '../lib/uploads.js';

export const catalogueRouter = Router();

/** Lecture publique : c'est ce que consommera le site client. */
catalogueRouter.get('/catalogue', (_req, res) => {
  res.json(readCatalogue());
});

catalogueRouter.post('/catalogue/reset', requireAuth, (_req, res) => {
  res.json(resetCatalogue());
});

/* -------------------------------------------------------------- pièces ---- */

catalogueRouter.post('/parts', requireAuth, (req, res) => {
  const part = normalizePart(req.body, newId('u'));
  if (part.catId && !getCategory(part.catId)) throw new HttpError(400, 'catégorie inconnue');
  insertPart(part);
  res.status(201).json({ part, catalogue: readCatalogue() });
});

catalogueRouter.put('/parts/:id', requireAuth, (req, res) => {
  const id = req.params.id as string;
  const existing = getPart(id);
  if (!existing) throw new HttpError(404, 'pièce introuvable');

  const part = normalizePart(req.body, id);
  if (part.catId && !getCategory(part.catId)) throw new HttpError(400, 'catégorie inconnue');
  updatePart(part);

  if (existing.image && existing.image !== part.image) removeUploadIfUnused(existing.image);
  res.json({ part, catalogue: readCatalogue() });
});

catalogueRouter.delete('/parts/:id', requireAuth, (req, res) => {
  const id = req.params.id as string;
  const existing = getPart(id);
  if (!existing) throw new HttpError(404, 'pièce introuvable');

  deletePart(id);
  if (existing.image) removeUploadIfUnused(existing.image);
  res.json({ catalogue: readCatalogue() });
});

/* ---------------------------------------------------------- catégories ---- */

catalogueRouter.post('/categories', requireAuth, (req, res) => {
  const name = str((req.body as Record<string, unknown> | undefined)?.name);
  if (!name) throw new HttpError(400, 'le nom de la catégorie est obligatoire');

  const code = String(listCategories().length + 1).padStart(2, '0');
  const requested = vehicles((req.body as Record<string, unknown> | undefined)?.vehicles);
  const category = insertCategory({
    id: newId('c' + code + '-'),
    code,
    name,
    vehicles: requested.length ? requested : ['Auto'],
  });
  res.status(201).json({ category, catalogue: readCatalogue() });
});

catalogueRouter.patch('/categories/:id', requireAuth, (req, res) => {
  const id = req.params.id as string;
  if (!getCategory(id)) throw new HttpError(404, 'catégorie introuvable');

  const body = (req.body ?? {}) as Record<string, unknown>;
  const patch: { name?: string; vehicles?: ReturnType<typeof vehicles> } = {};
  if (body.name !== undefined) patch.name = str(body.name);
  if (body.vehicles !== undefined) patch.vehicles = vehicles(body.vehicles);

  const category = updateCategory(id, patch);
  res.json({ category, catalogue: readCatalogue() });
});

catalogueRouter.delete('/categories/:id', requireAuth, (req, res) => {
  const id = req.params.id as string;
  if (!getCategory(id)) throw new HttpError(404, 'catégorie introuvable');

  const used = countPartsInCategory(id);
  if (used > 0) {
    throw new HttpError(409, 'catégorie encore rattachée à des pièces');
  }
  deleteCategory(id);
  res.json({ catalogue: readCatalogue() });
});

/* ------------------------------------------------------------ réglages ---- */

catalogueRouter.put('/settings', requireAuth, (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const patch: { whatsapp?: string } = {};
  if (body.whatsapp !== undefined) patch.whatsapp = str(body.whatsapp, 40);
  const settings = setSettings(patch);
  res.json({ settings });
});
