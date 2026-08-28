# Prompt pour Claude Design — Site Thunder Bay Auto (v2)

> **Avant d'envoyer :** joins le fichier du logo (chrome et rouge sur fond noir) à ton message dans Claude Design. Copie ensuite tout ce qui suit la ligne de séparation.

---

Tu es directeur artistique et développeur front-end senior dans un studio de design primé (niveau Awwwards Site of the Day). Tu conçois des sites où la mise en scène, le rythme typographique et le mouvement font partie intégrante de l'identité de marque — pas des habillages posés après coup.

Ta mission : concevoir intégralement le site web de **Thunder Bay Auto**, spécialiste de la pièce détachée et de l'accessoire pour véhicules. Le site comprend une **façade client** et une **façade administrateur**. Je suis le designer/développeur qui pilote ce projet ; il rejoindra mon portfolio, donc le niveau d'exigence visuel est celui d'une agence, pas celui d'un template.

Toutes les informations d'entreprise ci-dessous proviennent d'un relevé réel de la page Facebook de l'entreprise. **N'invente aucune donnée supplémentaire.** Ce qui est marqué `[À CONFIRMER]` doit apparaître tel quel dans les maquettes, et être listé en fin de réponse.

## 1. Ce que je veux éviter absolument

Points éliminatoires. Relis-les avant de livrer :

- **Aucun emoji, aucune émoticône**, nulle part : ni interface, ni libellés, ni textes, ni commentaires de code. C'est un enjeu particulier ici : la bio Facebook actuelle est entièrement construite sur des emojis-puces. Le site doit produire l'effet exactement inverse.
- Pas d'esthétique « IA générique » : pas de dégradés violet/bleu SaaS, pas de cartes blanches très arrondies à ombre diffuse, pas d'icônes rondes pastel, pas de hero centré avec titre en dégradé et deux boutons pilule, pas d'illustrations vectorielles de personnages.
- Pas de « Lorem ipsum ». Tous les textes rédigés, en français, dans la voix de la marque définie plus bas.
- Pas de photo de stock hors-sujet, et **pas de photo de stock du tout** pour représenter les produits (voir section 6, c'est un point structurant).
- Pas d'animation décorative gratuite : chaque mouvement sert la lecture, la hiérarchie ou la révélation d'une information.

## 2. L'entreprise — données réelles

### Identité

| Champ | Valeur |
|---|---|
| Nom de marque | **Thunder Bay Auto** |
| Activité déclarée | Magasin de pièces automobiles |
| Adresse | 520 Squier St, Thunder Bay, ON P7B 4A8, Canada |
| Téléphone | +1 548-258-2104 |
| E-mail | thunderbayautoparts@gmail.com |
| WhatsApp | `[PLACEHOLDER WHATSAPP]` — prévois l'emplacement et le composant, numéro à injecter plus tard |
| Horaires | `[À CONFIRMER]` |
| Site web existant | Aucun |
| Audience | environ 2 000 abonnés sur Facebook |
| Messagerie active | Facebook Messenger |

**Point de vigilance à traiter dans le design.** La communication actuelle mentionne plusieurs implantations contradictoires (Ontario, Texas, Montana, Toronto) et une clientèle desservie au Québec. Un client a demandé publiquement « où êtes-vous ? » sans obtenir de réponse claire. Le site doit donc traiter la localisation comme une **information de premier plan**, visible dès l'en-tête et reprise en pied de page : une adresse principale affirmée, et une zone de service explicite. Utilise l'adresse de Thunder Bay ci-dessus comme siège, et prévois un bloc `[À CONFIRMER — points de retrait et entrepôts d'expédition]` structurellement intégré, pas bricolé.

### Langue et devise

- **Site intégralement en français.** La communication actuelle est en anglais nord-américain ; tu traduis et réécris tout.
- **Prix en dollars américains (USD)**, affichés avec la devise explicite : `1 600 $ US`. Jamais un dollar nu — l'ambiguïté CAD/USD est un frein d'achat direct.

### Ce que l'entreprise vend réellement

Le cœur de métier, très identifiable, c'est **la pièce de carrosserie de pick-up et de camion**, avec une spécialité marquée sur les bennes. Voici l'offre relevée, à utiliser comme base du catalogue :

**Carrosserie** — Bennes de pick-up (courtes 6'4" et 6.5', longues 8', versions SRW et DRW) · Hayons avec caméra d'origine, faisceau et ouverture assistée · Pare-chocs avant et arrière (chromés, peints, dépose d'origine, seconds choix d'usine) · Portières complètes par jeux de quatre (vitres et serrures électriques, rétroviseurs chauffants, haut-parleurs) · Cabine complète · Capots · Ailes métalliques et élargisseurs · Calandres · Cadre de pare-brise Jeep · Couvercle de coffre · Emblèmes de capot

**Accessoires extérieurs** — Pare-buffles, grilles de protection, arceaux de cabine · Pare-chocs Ranch Hand Summit neufs · Couvre-bennes rigides enroulables · Casquettes LEER · Marchepieds · Bâches souples Jeep

**Roues et pneus** — Jantes 22" Night Edition avec pneus Pirelli Scorpion Verde · Jantes noires d'usine 20" · Jantes chromées 20" avec pneus Hankook Dynapro AT · Jantes d'origine avec pneus 33"

**Mécanique** — Turbocompresseur Holset d'origine pour Cummins ISX15 · Collecteur d'échappement d'origine · Arbre de transmission · Essieu avant Spicer Ultimate 44 avec bloqueur Eaton

**Suspension** — Amortisseurs FOX d'origine · Combinés filetés FOX 2.0 · Kits combinés pour GM A-Body 1964-1967

**Électronique** — Écran Uconnect 8,4" avec navigation · Planche de bord Ram · Boîtier de distribution électrique · Calculateurs moteur testés · Phares LED d'origine

**Intérieur** — Sièges avant cuir avec console · Console centrale d'origine

**Marques de véhicules à faire figurer** : Ford (F-150, F-250, F-350, F-450, Super Duty, Raptor), RAM et Dodge (1500 à 5500, ProMaster, Charger), Chevrolet (Silverado, Chevelle, El Camino), GMC (Sierra), Jeep (Wrangler JL et JK, Gladiator, Grand Cherokee Trackhawk), Pontiac, Oldsmobile, Buick.

**Équipementiers à faire figurer** : Ranch Hand, FOX, Spicer, Eaton, Holset, Cummins, Mopar, Uconnect, LEER, Pirelli, Hankook.

### Moto et bateau

Ces deux gammes font partie du périmètre du site mais **l'entreprise n'a aujourd'hui aucun produit ni aucune photo dans ces univers**. Tu conçois donc leurs rubriques comme des sections à part entière, avec un **état vide traité avec le même soin que le reste** : un écran « gamme en cours de constitution » avec formulaire de recherche de pièce, plutôt qu'une grille de produits fictifs. Ne fabrique aucun produit moto ou bateau imaginaire. Ce parti pris doit être visuellement assumé, pas honteux.

### Services réellement proposés

Expédition dans toute l'Amérique du Nord avec numéro de suivi transmis par e-mail · Retrait sur rendez-vous · Pose en atelier (échange de benne, montage d'essieu avec câblage et géométrie) · Recherche de pièce sur demande à partir de l'année, la marque, le modèle, la dimension de benne, la couleur et la localisation · Vérification de compatibilité · Réservation d'une pièce avant sa mise en vente · Envoi de photos complémentaires sur demande · Garantie 30 jours constatée sur une pièce mécanique — la politique générale est `[À CONFIRMER]`.

### Fourchette de prix réelle

De 150 $ US (ailes métalliques) à 1 650 $ US (benne Silverado). Le gros du catalogue se situe entre 700 et 1 600 $ US. Un exemple d'offre groupée existe : essieu à 5 169 $ US plus 1 160 $ US de pose, vendu avec 660 $ US d'économie. Certains prix sont négociables. **Modes de paiement `[À CONFIRMER]`.**

### Ce que les clients demandent réellement

Les commentaires publics font remonter trois questions récurrentes : *combien ça coûte*, *où êtes-vous situés*, *avez-vous telle pièce pour tel véhicule*. Les deux premières sont aujourd'hui des échecs d'information. **Ces trois questions structurent l'architecture du site** : prix visible sans avoir à écrire, localisation affirmée, sélecteur de compatibilité en évidence.

### Preuve sociale

**Il n'existe aucun avis client à ce jour** : la page n'a pas d'onglet Avis, aucune note, aucun témoignage. Ne fabrique aucun avis, aucune étoile, aucun nom de client. Deux options que tu proposeras :

- remplacer le bloc témoignages par un bloc **faits vérifiables** (nombre de références en stock, expédition nationale, délais, garantie, années d'activité `[À CONFIRMER]`) ;
- concevoir le composant « avis » de façon à ce qu'il puisse être alimenté plus tard depuis l'administration, sans l'afficher en V1.

Un seul élément narratif réel est disponible et exploitable : un client venu de Géorgie pour faire remplacer la benne de son Ford Super Duty 2011 affichant près de 720 000 miles au compteur. C'est une histoire forte — utilise-la.

## 3. Identité visuelle

Le **logo est joint** à ce message : monogramme TBA chrome et rouge sur fond noir, avec silhouette de véhicule, roue dentée et baseline « PIÈCES AUTO · QUALITÉ · PERFORMANCE ». C'est **ce logo qui fait foi**, pas celui de la page Facebook. Tu ne le redessines pas ; tu construis le système visuel autour.

Ce que le logo impose :

- **Fond noir profond** comme socle (pas gris moyen, pas anthracite mou).
- **Chrome et argent brossé** en matière principale : dégradés métalliques directionnels, arêtes claires, biseaux nets. Le chrome, ce sont des transitions de valeur brutales, pas des dégradés doux.
- **Rouge racing** en accent unique : actions, données clés, états actifs. Jamais en grande surface.
- **Blanc cassé** pour le texte courant. Jamais de blanc pur sur noir pur.
- L'**italique inclinée** du logo peut être reprise en titraille, avec parcimonie.
- Le motif **point rouge en séparateur** de la baseline est un élément graphique réutilisable dans l'interface.

**Typographie** : deux familles maximum, en tension délibérée. Une grotesque technique large ou condensée pour la titraille, et une **monospace pour toutes les données techniques** — références, dimensions, années de compatibilité, prix, numéros de commande. La monospace n'est pas un effet de style ici : elle traduit visuellement le fait que ce commerce vend des **références exactes**, et c'est l'argument central du site.

Livre une palette avec valeurs hexadécimales, des règles d'usage explicites, et une échelle typographique complète.

## 4. Voix éditoriale

La communication actuelle est celle d'une annonce Marketplace : urgence permanente (« premier arrivé, premier servi »), majuscules criées, jargon non traduit, appel systématique au message privé. **Le site doit conserver l'expertise et abandonner la précipitation.**

- Ton : professionnel, direct, factuel. La compétence se prouve par la précision technique, pas par l'exclamation.
- Le jargon métier est un **actif**, pas un obstacle — à condition d'être traduit et expliqué. Prévois un **glossaire intégré** : dépose d'origine (*OEM take-off*), second choix d'usine, roues simples et jumelées (SRW/DRW), carrosserie sans corrosion, compatibilité, échange de benne. Un mot technique survolé affiche sa définition dans une infobulle.
- Chaque fiche produit distingue clairement **neuf / dépose d'origine / occasion / second choix d'usine**. C'est le principal facteur de confiance sur ce marché.
- L'appel à l'action n'est plus « écrivez-nous en privé » mais un parcours structuré : prix affiché, compatibilité vérifiable, demande de devis d'expédition qualifiée.

## 5. Références d'inspiration

Trois sites. **Inspiration ne veut pas dire copie** : extrais-en les mécaniques et le niveau de finition, puis réinterprète-les.

### a) https://sstr.tech/en/ — référence dominante

C'est le modèle principal, parce que ce site tire sa force de la donnée et non de l'image — exactement la contrainte de ce projet.

- **Écran de chargement chiffré** : compteur 0 → 100 %, libellés techniques défilants, formes SVG qui s'assemblent.
- **Micro-labels préfixés** `// CATALOGUE`, `// SERVICES` en monospace au-dessus de chaque section. Signature très forte, très peu coûteuse.
- **Chiffres traités en blocs héroïques**, avec valeur avant et après.
- **Listes de bénéfices numérotées** 01 / 02 / 03 avec révélation séquentielle au scroll.
- **Vidéos produit en boucle silencieuse** intégrées à la mise en page.

### b) https://trionn.com/ — audace éditoriale

- **Titre géant sur deux lignes** occupant le viewport, révélé par masque ligne à ligne.
- **Menu plein écran** avec coordonnées intégrées au panneau.
- **Curseur personnalisé** se transformant au survol des zones interactives.
- **Compteurs animés** au scroll, avec préfixe zéro (`050+`, `01.5K+`).
- **Bandeau défilant** en boucle — parfait ici pour les marques de véhicules et les équipementiers.
- **Formulaire segmenté** : sélection par boutons plutôt que menus déroulants, validation en ligne.

### c) https://db-longbow.webflow.io/ — rigueur de mise en page

Attention : ce site repose entièrement sur la photographie, ce que nous n'avons pas. Tu en prends la **structure**, pas la dépendance à l'image.

- **Grille de 4 colonnes visible**, filets fins persistants, en référence aux plans d'ingénierie. Rythme architectural, précision de plan coté. **La grille reste visible et stable à toutes les tailles d'écran** — point d'exigence.
- **Tension typographique assumée** entre une monospace technique et une famille plus classique.
- **Palette volontairement restreinte** pour concentrer l'attention.
- **Animations pilotées par le scroll** : transitions entre sections, mouvement contrôlé plutôt que spectaculaire.
- Traitement **affiche** plutôt que fiche produit.

### Synthèse attendue

La rigueur data et les micro-labels de SSTR, l'audace typographique et les interactions de TRIONN, la grille visible et la retenue de Longbow. Prévois : préchargeur chiffré, révélations par masques au scroll, transformation de la navigation au défilement, transitions entre pages, survols de cartes produit révélant la référence, curseur personnalisé sur desktop, et **au moins une séquence 3D ou pseudo-3D marquante** — par exemple une benne de pick-up en vue éclatée qui se décompose au scroll, ou un pare-chocs qui pivote dans le hero. Ces séquences 3D compensent partiellement l'absence de photographie : c'est une raison de plus de les soigner.

## 6. Contrainte majeure — l'imagerie

**Aucune photo existante n'est utilisable en fiche produit.** L'entreprise ne dispose que de clichés de smartphone pris en cour de stockage : plein soleil, arrière-plans saturés de câbles, palettes et véhicules tiers, pièces posées sur du gravier. Il n'existe aucune photo de façade, d'atelier, d'équipe, d'emballage, ni aucun packshot.

Conséquences, à respecter strictement :

1. **La direction artistique doit pouvoir tenir sans photographie.** Typographie, grille, données, matière chrome, mouvement, 3D. Un site dont la beauté dépendrait d'images que le client n'a pas est un site qui échouera à la mise en ligne.
2. Là où une photo produit est nécessaire, utilise un **emplacement de packshot normalisé** clairement identifié comme tel : cadre fixe, fond neutre, proportion constante. Ne colle pas d'image de banque à la place.
3. Environ **cinq visuels d'ambiance** sont récupérables après retouche (chargements sur remorque en lumière de fin de journée). Réserve-leur des emplacements précis : bandeaux de rubrique, section « notre stock ». **Jamais** en photo produit.
4. Livre en fin de réponse une **fiche technique de reprise de vue** : fond, lumière, nombre de vues par référence, cadrage, proportions, poids et format des fichiers. Je la transmettrai au client.

## 7. Périmètre — façade client

1. **Accueil** — hero à forte présence, entrées par univers (Camion et auto / Moto / Bateau), chiffres clés, sélection de pièces, services, localisation et zone d'expédition, appel à l'action.
2. **Catalogue** — filtres par univers, marque de véhicule, type de pièce, état (neuf, dépose d'origine, occasion, second choix), gamme de prix. Tri, grille dense, chargement progressif.
3. **Fiche produit** — emplacement galerie, référence en monospace, état, compatibilités véhicules, caractéristiques en tableau, prix en USD, demande de devis d'expédition, pièces associées.
4. **Sélecteur de compatibilité** — parcours guidé Univers → Marque → Modèle → Année → Motorisation, avec le cas particulier des bennes (dimension et type de roues).
5. **Recherche de pièce** — formulaire dédié reprenant les champs réellement demandés par l'entreprise : année, marque, modèle, dimension, couleur, localisation.
6. **Services et atelier** — pose, échange de benne, expédition, retrait, garantie.
7. **À propos** — activité, stock, zone desservie, l'histoire du client venu de Géorgie.
8. **Contact** — formulaire, coordonnées réelles, carte, horaires `[À CONFIRMER]`.
9. **Pages légales** — mentions légales, conditions de vente.
10. **États système** — 404, recherche sans résultat, chargement, gamme vide, confirmation d'envoi.

Ajoute un **accès WhatsApp flottant** redessiné dans la charte, câblé sur `[PLACEHOLDER WHATSAPP]`. Pas le widget vert standard.

## 8. Périmètre — façade administrateur

Même langage visuel, densité supérieure, ergonomie de poste de travail. Écrans à concevoir : connexion, tableau de bord, liste et édition des produits, gestion des commandes et statuts, gestion des catégories et compatibilités, saisie des avis clients, médiathèque, paramètres. Données chiffrées en monospace, tableaux réellement lisibles à forte densité. **Fonctionnalités détaillées à venir** — pose une structure et un système de composants extensibles.

## 9. Contraintes techniques

- Français uniquement, prix en USD.
- Responsive vérifié à 360, 768, 1024, 1280 et 1920 px. Sur mobile, les effets desktop coûteux sont désactivés proprement, pas masqués.
- Respect de `prefers-reduced-motion`.
- Contrastes AA, navigation clavier fonctionnelle, textes alternatifs rédigés.
- Images optimisées, animations sur `transform` et `opacity`, chargement différé sous la ligne de flottaison.
- Structure sémantique, un seul `h1` par page.

## 10. Méthode — procède par étapes

**Étape 1 — Direction artistique.** Palette avec valeurs hexadécimales et règles d'usage, couples typographiques et échelle, système de grille, principes de mouvement, ton éditorial, et ta stratégie explicite pour tenir sans photographie. Explique brièvement chaque choix.

**Étape 2 — Preuve visuelle.** La page d'accueil complète, animée, avec les textes définitifs.

**Arrête-toi ici et attends ma validation.**

**Étape 3 — Extension.** Le reste de la façade client.

**Étape 4 — Administration.** La façade administrateur.

Termine chaque étape par la liste des points `[À CONFIRMER]` que tu as rencontrés. Si un choix important reste ambigu, pose la question plutôt que de trancher seul — mais ne me demande pas ce qui figure déjà dans ce brief.

## 11. Critère de réussite

Un directeur artistique qui découvre ce site doit pouvoir supposer qu'il a été conçu par un studio, facturé plusieurs milliers de dollars, et livré par une équipe designer et développeur front-end. S'il devine en trois secondes qu'il s'agit d'une génération automatique, c'est raté.
