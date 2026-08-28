# Thunder Bay Auto

Site public et espace administrateur, implémentés d'après les maquettes Claude Design
du dossier `project/`, adossés à Supabase.

- `client/` — application React + TypeScript (Vite). Deux routes : `/` le site
  client, `/admin` la gestion du catalogue.
- `supabase/migrations/` — schéma, politiques d'accès et bucket d'images.
- `project/`, `chats/`, `HANDOFF.md` — le lot de conception d'origine, laissé intact
  comme référence visuelle.

## Mise en route

**1. Créer le projet Supabase**, puis exécuter `supabase/migrations/0001_catalogue.sql`
dans l'éditeur SQL. La migration crée les tables, les politiques, le bucket `pieces`
et pose la structure du catalogue : 12 catégories, aucune pièce.

**2. Créer le compte administrateur** dans *Authentication → Users → Add user*
(cocher « Auto Confirm User »), puis l'habiliter :

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'admin@exemple.ca';
```

Dans *Authentication → Sign In / Providers*, **désactiver les inscriptions publiques** :
personne ne doit pouvoir se créer un compte.

**3. Renseigner les clés** dans `client/.env` (modèle dans `.env.example`) :

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=…
VITE_ADMIN_EMAIL=admin@exemple.ca
```

**4. Lancer**

```bash
npm install
npm run dev      # http://localhost:5173  et  /admin
npm run build    # client/dist, à déployer sur n'importe quel hébergeur statique
```

`/admin` est une route de l'application : l'hébergeur doit renvoyer `index.html`
pour toutes les URL. `vercel.json` et `client/public/_redirects` (Netlify, Cloudflare
Pages) le font déjà.

## Le site public

Contenu et textes repris de `project/Thunder Bay Auto - Accueil.dc.html`, mise en scène
redessinée : la page est une descente dans l'atelier.

**Scène d'ouverture** — une benne de pick-up en vue éclatée, tracée en SVG, se monte
pièce par pièce au fil du défilement ; chaque élément porte sa référence sur un trait de
rappel, et un relevé compte les pièces posées (`00/07` → `07/07`). Aucun fichier 3D,
aucune photo : le dessin reste net à toute résolution et ne pèse rien.

Puis, dans l'ordre : bandeau de marques, les quatre univers en rangées balayées de rouge,
les faits chiffrés qui se composent à l'entrée dans le cadre, la sélection en stock, le
catalogue par systèmes avec recherche et filtres, le glossaire au survol, les services,
la localisation et la fiche de demande. Un rail de chapitres suit la descente à droite,
un sommaire plein écran sur fond flouté s'ouvre depuis l'en-tête.

Titraille en **Big Shoulders Display** (signalétique industrielle), texte courant en
Archivo, données et références en IBM Plex Mono. Fond charbon `#0A0D11`, acier chromé,
un seul rouge.

**Trois langues** — FR / EN / ES, sélecteur dans l'en-tête, choix mémorisé. Les
dictionnaires sont repris mot pour mot de la maquette (`client/src/public/i18n.ts`).
Les noms de catégories et les libellés de pièces saisis dans l'admin s'affichent tels
quels dans les trois langues : ce sont vos données.

**Commande** — le panier vit dans le navigateur du visiteur ; « Confirmer sur WhatsApp »
ouvre la conversation avec le récapitulatif déjà écrit. La fiche de demande de pièce
part de la même façon. Sans numéro enregistré dans les réglages, les deux renvoient
vers le formulaire.

## L'espace administrateur

`/admin`, protégé par mot de passe. Trois onglets : **Pièces** (tableau dense,
recherche, filtres, ajout et modification en panneau latéral, suppression en deux
temps), **Catégories** (renommage en ligne, univers, suppression bloquée si des pièces
y sont rattachées) et **Réglages** (numéro WhatsApp du site).

Les images sont ramenées à 1000 px dans le navigateur avant d'être déposées dans le
bucket `pieces`. Un fichier qu'aucune pièce ne référence plus est supprimé du bucket.

## Modèle de données

| Table | Rôle | Lecture | Écriture |
|---|---|---|---|
| `categories` | les systèmes du catalogue | tous | administrateurs |
| `parts` | les pièces | tous | administrateurs |
| `settings` | numéro WhatsApp, horodatage | tous | administrateurs |
| `admins` | comptes habilités | soi-même | migration / SQL |
| bucket `pieces` | images des pièces | tous | administrateurs |

Un compte simplement authentifié n'écrit rien : les politiques passent par
`public.is_admin()`, qui vérifie l'appartenance à `admins`. La fonction
`reset_catalogue()` rétablit les 12 catégories et vide les pièces.

## Sécurité

- La clé `anon` est publique par nature ; ce sont les politiques RLS qui protègent
  les données. Ne publiez jamais la clé `service_role`.
- Le mot de passe administrateur est vérifié par Supabase Auth, pas par le navigateur.
  La session vit dans le `sessionStorage` : elle se ferme avec l'onglet.
- Gardez les inscriptions publiques désactivées, et n'ajoutez à `admins` que les
  comptes qui doivent tenir le catalogue.

## Écarts assumés par rapport aux maquettes

- **Stockage** — les maquettes écrivaient dans le `localStorage` du navigateur. Tout
  passe désormais par Supabase, donc par un catalogue partagé entre tous les visiteurs.
  Le panier et la langue restent, eux, dans le navigateur du visiteur.
- **Connexion** — l'écran de déverrouillage garde son champ unique, mais il ouvre une
  vraie session Supabase sur le compte de `VITE_ADMIN_EMAIL`.
- **Fiche produit** — ajouter au panier depuis la fiche la referme. Dans la maquette,
  le tiroir s'ouvrait derrière la fiche, donc invisible.
- **Réinitialisation** — elle rétablit les 12 catégories et vide les pièces, mais
  conserve le numéro WhatsApp : c'est un réglage du site, pas une donnée de catalogue.
- **Renommage de catégorie et numéro WhatsApp** — écriture différée de quelques
  centaines de millisecondes après la frappe, au lieu d'un enregistrement par caractère.
- **Ajouts** — bandeau d'erreur réseau, touche `Échap` pour fermer fiche et panneaux,
  reverrouillage automatique si la session expire.

## Reste à faire

- Les polices Archivo, Archivo Narrow et IBM Plex Mono viennent de Google Fonts, comme
  dans les maquettes. Les héberger avec le site supprimerait cette dépendance externe.
- Les demandes envoyées depuis le site partent sur WhatsApp sans être enregistrées.
  Une table `requests` et un écran de suivi seraient la suite naturelle.
