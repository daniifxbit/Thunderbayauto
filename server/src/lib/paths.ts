import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

/** Racine du workspace `server/` (que l'on tourne depuis `src/` ou `dist/`). */
export const SERVER_ROOT = resolve(here, '..', '..');

export const DATA_DIR = process.env.TBA_DATA_DIR
  ? resolve(process.env.TBA_DATA_DIR)
  : join(SERVER_ROOT, 'data');

export const DB_FILE = join(DATA_DIR, 'catalogue.db');
export const UPLOADS_DIR = join(DATA_DIR, 'uploads');

/** Build du client servi en production. */
export const CLIENT_DIST = resolve(SERVER_ROOT, '..', 'client', 'dist');
