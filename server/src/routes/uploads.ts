import express, { Router } from 'express';
import { requireAuth } from '../lib/auth.js';
import { ACCEPTED_TYPES, storeUpload } from '../lib/uploads.js';
import { HttpError } from '../lib/validate.js';

export const uploadsRouter = Router();

/**
 * L'éditeur envoie l'image déjà redimensionnée (1000 px max, JPEG) en corps brut :
 * pas de multipart à analyser, pas de dépendance native pour le traitement d'image.
 */
uploadsRouter.post(
  '/uploads',
  requireAuth,
  express.raw({ type: ACCEPTED_TYPES, limit: '8mb' }),
  (req, res) => {
    if (!Buffer.isBuffer(req.body)) throw new HttpError(415, "format d'image non pris en charge");
    const url = storeUpload(req.body, req.get('content-type') ?? '');
    res.status(201).json({ url });
  },
);
