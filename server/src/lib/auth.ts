import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { db, metaGet, metaSet } from './db.js';

const COOKIE_NAME = 'tba_admin';
/** Durée de vie côté serveur. Le cookie, lui, expire à la fermeture du navigateur. */
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

/** Mot de passe retenu pendant la conception ; à remplacer par ADMIN_PASSWORD en production. */
const DESIGN_DEFAULT_PASSWORD = '#Capacitor200K#';

const KEYLEN = 64;

function hashPassword(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEYLEN);
}

function encodeHash(password: string): string {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString('hex')}$${hashPassword(password, salt).toString('hex')}`;
}

function verifyHash(password: string, encoded: string): boolean {
  const [scheme, saltHex, keyHex] = encoded.split('$');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, 'hex');
  if (expected.length !== KEYLEN) return false;
  const actual = hashPassword(password, Buffer.from(saltHex, 'hex'));
  return timingSafeEqual(actual, expected);
}

/**
 * Le mot de passe vient de ADMIN_PASSWORD (ou ADMIN_PASSWORD_HASH). Sans variable
 * d'environnement, on retombe sur celui de la maquette et on le signale au démarrage.
 */
export function initPassword(): void {
  const fromHash = process.env.ADMIN_PASSWORD_HASH;
  const fromPlain = process.env.ADMIN_PASSWORD;

  if (fromHash) {
    metaSet('admin_password', fromHash);
    return;
  }
  if (fromPlain) {
    metaSet('admin_password', encodeHash(fromPlain));
    return;
  }
  if (!metaGet('admin_password')) metaSet('admin_password', encodeHash(DESIGN_DEFAULT_PASSWORD));

  console.warn(
    "[auth] ADMIN_PASSWORD n'est pas défini : le mot de passe de la maquette reste actif. " +
      'Définissez ADMIN_PASSWORD avant toute mise en ligne.',
  );
}

export function checkPassword(password: string): boolean {
  const encoded = metaGet('admin_password');
  if (!encoded) return false;
  try {
    return verifyHash(password, encoded);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------- sessions ---- */

function purgeExpired(): void {
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
}

export function createSession(): string {
  purgeExpired();
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  db.prepare('INSERT INTO sessions (token, created_at, expires_at) VALUES (?, ?, ?)').run(
    token,
    now,
    now + SESSION_TTL_MS,
  );
  return token;
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const row = db.prepare('SELECT expires_at FROM sessions WHERE token = ?').get(token) as
    | { expires_at: number }
    | undefined;
  if (!row) return false;
  if (Number(row.expires_at) < Date.now()) {
    destroySession(token);
    return false;
  }
  return true;
}

export function destroySession(token: string | undefined): void {
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

/* -------------------------------------------------------------- cookies ---- */

export function sessionToken(req: Request): string | undefined {
  const raw = (req.cookies as Record<string, unknown> | undefined)?.[COOKIE_NAME];
  return typeof raw === 'string' ? raw : undefined;
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // Pas de maxAge : la session tombe à la fermeture du navigateur,
    // comme le sessionStorage de la maquette.
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (isValidSession(sessionToken(req))) {
    next();
    return;
  }
  res.status(401).json({ error: 'unauthorized' });
}

/* --------------------------------------------------- limitation d'essais ---- */

const MAX_FAILS = 8;
const LOCK_MS = 5 * 60 * 1000;
const attempts = new Map<string, { fails: number; until: number }>();

export function loginLockedUntil(ip: string): number {
  const entry = attempts.get(ip);
  if (!entry) return 0;
  if (entry.until > Date.now()) return entry.until;
  if (entry.until) attempts.delete(ip);
  return 0;
}

export function noteLoginFailure(ip: string): void {
  const entry = attempts.get(ip) ?? { fails: 0, until: 0 };
  entry.fails += 1;
  if (entry.fails >= MAX_FAILS) {
    entry.until = Date.now() + LOCK_MS;
    entry.fails = 0;
  }
  attempts.set(ip, entry);
}

export function noteLoginSuccess(ip: string): void {
  attempts.delete(ip);
}
