import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync, unlinkSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { UPLOADS_DIR } from './paths.js';
import { countImageUses } from './db.js';
import { HttpError } from './validate.js';

mkdirSync(UPLOADS_DIR, { recursive: true });

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const ACCEPTED_TYPES = Object.keys(EXTENSIONS);

/** Écrit l'image reçue et renvoie l'adresse publique à stocker sur la pièce. */
export function storeUpload(buffer: Buffer, contentType: string): string {
  const ext = EXTENSIONS[contentType.split(';')[0]?.trim().toLowerCase() ?? ''];
  if (!ext) throw new HttpError(415, "format d'image non pris en charge");
  if (!buffer.length) throw new HttpError(400, 'image vide');

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}.${ext}`;
  writeFileSync(join(UPLOADS_DIR, name), buffer);
  return `/uploads/${name}`;
}

/**
 * Supprime le fichier d'une image locale dès qu'aucune pièce ne s'y réfère plus.
 * Les adresses externes (https://…) ne sont évidemment pas touchées.
 */
export function removeUploadIfUnused(image: string): void {
  if (!image.startsWith('/uploads/')) return;
  if (countImageUses(image) > 0) return;

  const file = basename(image);
  if (!file || file.includes('..')) return;
  try {
    unlinkSync(join(UPLOADS_DIR, file));
  } catch {
    /* fichier déjà absent : rien à faire */
  }
}

/**
 * Balayage des images orphelines : fichiers qu'aucune pièce ne référence, laissés
 * par une fiche abandonnée ou par une réinitialisation. On épargne les fichiers
 * récents, qui peuvent appartenir à une fiche encore ouverte dans un éditeur.
 */
const ORPHAN_GRACE_MS = 6 * 60 * 60 * 1000;

export function sweepOrphanUploads(): number {
  let removed = 0;
  let files: string[];
  try {
    files = readdirSync(UPLOADS_DIR);
  } catch {
    return 0;
  }

  const cutoff = Date.now() - ORPHAN_GRACE_MS;
  for (const file of files) {
    const path = join(UPLOADS_DIR, file);
    try {
      if (statSync(path).mtimeMs > cutoff) continue;
      if (countImageUses('/uploads/' + file) > 0) continue;
      unlinkSync(path);
      removed += 1;
    } catch {
      /* fichier illisible ou déjà supprimé : on passe */
    }
  }
  return removed;
}
