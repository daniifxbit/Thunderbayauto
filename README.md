# Thunder Bay Auto — Espace administrateur

Implémentation de la maquette `project/Thunder Bay Auto - Administration.dc.html`
(Claude Design) : gestion du catalogue de pièces — pièces, catégories, réglages —
adossée à un vrai serveur.

- `client/` — interface React + TypeScript (Vite), reprise pixel par pixel de la maquette.
- `server/` — API Express + SQLite : authentification, catalogue, envoi d'images.
- `project/`, `chats/`, `HANDOFF.md` — le lot de conception d'origine, laissé intact
  comme référence visuelle.

## Démarrer

```bash
npm install
npm run dev          # client sur :5173, API sur :8787 (proxy /api et /uploads)
```

En production, le serveur sert aussi le build du client — une seule origine, donc
pas de CORS et un cookie de session strictement same-site :

```bash
npm run build
ADMIN_PASSWORD='…' NODE_ENV=production npm start   # tout sur :8787
```

## Configuration

| Variable | Rôle | Défaut |
|---|---|---|
| `ADMIN_PASSWORD` | Mot de passe de l'espace administrateur (haché au démarrage) | celui de la maquette, avec avertissement au démarrage |
| `ADMIN_PASSWORD_HASH` | Empreinte déjà calculée, `scrypt$<sel hex>$<clé hex>` | — |
| `PORT` | Port du serveur | `8787` |
| `TBA_DATA_DIR` | Emplacement de la base et des images | `server/data` |
| `TRUST_PROXY` | Valeur `trust proxy` d'Express, derrière un reverse proxy | `0` |
| `NODE_ENV` | `production` pose le cookie de session en `secure` | — |
| `VITE_PUBLIC_SITE_URL` | Cible des liens « Voir le site » et « Retour au site public » | `/` |

**Avant toute mise en ligne : définir `ADMIN_PASSWORD` et servir le site en HTTPS.**
Sans variable d'environnement, le mot de passe retenu pendant la conception reste
actif et le serveur le signale à chaque démarrage.

## Données

- SQLite (`node:sqlite`, intégré à Node 22 — aucune dépendance native à compiler) :
  `server/data/catalogue.db`.
- Images : `server/data/uploads/`, servies sur `/uploads/`. L'éditeur ramène chaque
  image à 1000 px sur son plus grand côté avant l'envoi. Les fichiers qu'aucune pièce
  ne référence plus sont balayés au démarrage puis toutes les six heures.
- Au premier démarrage, la structure du catalogue est posée : 12 catégories, aucune
  pièce — conformément à la demande faite en conception.
- Sauvegarde : copier le dossier `server/data`.

## API

Lecture publique, écriture authentifiée par cookie de session.

| Méthode | Route | Accès |
|---|---|---|
| `GET` | `/api/catalogue` | public — c'est ce que consommera la façade client |
| `GET` | `/api/auth/session` | public |
| `POST` | `/api/auth/login` · `/api/auth/logout` | public |
| `POST` `PUT` `DELETE` | `/api/parts` · `/api/parts/:id` | session |
| `POST` `PATCH` `DELETE` | `/api/categories` · `/api/categories/:id` | session |
| `PUT` | `/api/settings` | session |
| `POST` | `/api/uploads` (corps brut `image/jpeg`, `image/png`, `image/webp`) | session |
| `POST` | `/api/catalogue/reset` | session |

Une catégorie encore rattachée à des pièces renvoie `409` : elle ne peut pas être
supprimée, exactement comme le prévoit la maquette.

## Sécurité

- Mot de passe haché en `scrypt` (sel aléatoire, comparaison à temps constant).
- Session : jeton de 32 octets en base, cookie `httpOnly` `sameSite=lax`, `secure`
  en production, expirant à la fermeture du navigateur côté client et après 12 h côté
  serveur.
- Huit tentatives ratées verrouillent la connexion cinq minutes pour cette adresse.
- Envois d'images : types acceptés en liste blanche, 8 Mo maximum, nom de fichier
  généré côté serveur, en-tête `X-Content-Type-Options: nosniff`.
- Adresses d'image restreintes à `/uploads/…` ou `http(s)://…`.

## Écarts assumés par rapport à la maquette

- **Stockage** : la maquette écrivait dans le `localStorage` du navigateur. Tout passe
  désormais par le serveur ; le bandeau du bas dit « enregistrées sur le serveur » au
  lieu de « sur cet appareil ».
- **Réinitialisation** : elle rétablit les 12 catégories et vide les pièces, mais
  conserve le numéro WhatsApp — c'est un réglage du site, pas une donnée de catalogue.
- **Renommage de catégorie et numéro WhatsApp** : écriture différée de quelques
  centaines de millisecondes après la frappe, au lieu d'un enregistrement par
  caractère. Rien n'est perdu si l'on change d'onglet entre-temps.
- **Ajouts** : bandeau d'erreur réseau, bouton « Recharger », touche `Échap` pour
  fermer l'éditeur, et reverrouillage automatique si la session expire.

## Reste à faire

- Le site public (`project/Thunder Bay Auto - Accueil.dc.html`) n'est pas implémenté :
  les liens « Voir le site » pointent sur `VITE_PUBLIC_SITE_URL`. La façade client
  pourra lire `GET /api/catalogue` telle quelle.
- Les polices Archivo et IBM Plex Mono sont chargées depuis Google Fonts, comme dans
  la maquette. Les héberger avec le site supprimerait cette dépendance externe.
