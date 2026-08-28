import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CLIENT_DIST, UPLOADS_DIR } from './lib/paths.js';
import { ensureSeeded } from './lib/db.js';
import { initPassword } from './lib/auth.js';
import { authRouter } from './routes/auth.js';
import { catalogueRouter } from './routes/catalogue.js';
import { uploadsRouter } from './routes/uploads.js';
import { sweepOrphanUploads } from './lib/uploads.js';
import { HttpError } from './lib/validate.js';

ensureSeeded();
initPassword();

// Les images qu'aucune pièce ne référence plus sont balayées au démarrage,
// puis à intervalle régulier.
const SWEEP_INTERVAL_MS = 6 * 60 * 60 * 1000;
sweepOrphanUploads();
setInterval(sweepOrphanUploads, SWEEP_INTERVAL_MS).unref();

const app = express();
const PORT = Number(process.env.PORT ?? 8787);

app.disable('x-powered-by');
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 0));
app.use(cookieParser());

app.use((_req, res, next) => {
  // Une image envoyée par l'administrateur ne doit jamais être réinterprétée
  // comme du HTML, et l'espace d'administration n'a rien à faire dans une iframe.
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});

// Les images arrivent en corps brut : elles ont leur propre routeur, monté avant
// le parseur JSON pour qu'il ne tente pas de les lire.
app.use('/api', uploadsRouter);
app.use('/api/auth', express.json({ limit: '16kb' }), authRouter);
app.use('/api', express.json({ limit: '256kb' }), catalogueRouter);

app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    maxAge: '30d',
    immutable: true,
    index: false,
    dotfiles: 'deny',
  }),
);

// En production, le serveur sert aussi le build du client : une seule origine,
// donc pas de CORS et un cookie de session strictement same-site.
if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next();
      return;
    }
    res.sendFile(join(CLIENT_DIST, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'not_found', path: req.path });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err instanceof Error && 'type' in err && err.type === 'entity.too.large') {
    res.status(413).json({ error: 'fichier trop volumineux' });
    return;
  }
  console.error('[server]', err);
  res.status(500).json({ error: 'erreur interne' });
});

app.listen(PORT, () => {
  console.log(`[server] Thunder Bay Auto — API sur http://localhost:${PORT}`);
});
