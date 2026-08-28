// Thunder Bay Auto — source unique du catalogue (structure issue du catalogue général de pièces).
// Les données vivantes sont stockées dans localStorage et modifiables depuis l'espace administrateur.

export const STORE_KEY = 'tba.catalogue.v3';

const A = 'Auto', C = 'Camion', M = 'Moto', B = 'Bateau';

const SECTIONS = [
  ['01', 'Moteur & distribution', [A, C, M, B], ['Moteurs complets', 'Culasses', 'Blocs moteur', 'Pistons et segments', 'Bielles et coussinets', 'Joints moteur', 'Soupapes', 'Arbres à cames', 'Chaînes et courroies de distribution', 'Tendeurs et galets', 'Pompes à huile', 'Injecteurs / carburateurs']],
  ['02', 'Transmission', [A, C, M, B], ['Embrayages', 'Volants moteur', 'Boîtes de vitesses', 'Convertisseurs', 'Cardans', 'Arbres de transmission', 'Différentiels', 'Engrenages', 'Chaînes et pignons moto', 'Inverseurs marins / transmissions bateau']],
  ['03', 'Freinage', [A, C, M], ['Plaquettes', 'Disques', 'Étriers', 'Tambours', 'Mâchoires', 'Maîtres-cylindres', 'Flexibles', 'ABS et capteurs', 'Freins de stationnement', 'Pièces de freinage poids lourd']],
  ['04', 'Suspension & direction', [A, C, M, B], ['Amortisseurs', 'Ressorts', 'Triangles', 'Rotules', 'Biellettes', 'Silentblocs', 'Crémaillères', 'Pompes de direction', 'Roulements', 'Fourches moto', 'Pièces de direction hydraulique marine']],
  ['05', 'Électricité & électronique', [A, C, M, B], ['Batteries', 'Alternateurs', 'Démarreurs', 'Bobines', 'Bougies', 'Faisceaux', 'Fusibles et relais', 'Capteurs', 'ECU / calculateurs', 'Éclairage LED', 'Tableaux de bord', 'Équipements électriques marins']],
  ['06', 'Refroidissement & climatisation', [A, C, B], ['Radiateurs', 'Pompes à eau', 'Thermostats', 'Ventilateurs', 'Durites', 'Condenseurs', 'Compresseurs de climatisation', 'Évaporateurs', 'Échangeurs', 'Pompes et pièces de refroidissement marin']],
  ['07', 'Carrosserie, éclairage & habitacle', [A, C, M, B], ['Pare-chocs', 'Ailes', 'Capots', 'Portes', 'Rétroviseurs', 'Calandres', 'Phares et feux', 'Pare-brise', 'Selles moto', 'Pièces de cabine camion', 'Sellerie et accessoires bateau']],
  ['08', 'Alimentation & échappement', [A, C, M, B], ['Pompes à carburant', 'Filtres', 'Injecteurs', 'Rampes communes', 'Papillons', 'EGR', 'Catalyseurs', 'FAP', 'Silencieux', 'Collecteurs', 'Échappements moto', "Systèmes d'alimentation marine"]],
  ['09', 'Roues, pneus & train roulant', [A, C, M], ['Jantes', 'Pneus', 'Chambres à air', 'Moyeux', 'Roulements', 'Goujons', 'Écrous', 'Pièces de roue poids lourd', 'Pneus et chaînes moto']],
  ['10', 'Pièces spécifiques camions', [C], ['Pièces moteur poids lourd', 'Embrayage et boîte', 'Ponts et différentiels', 'Suspension pneumatique', 'Compresseurs', 'Systèmes de freinage pneumatique', 'Pièces de cabine', 'Rétroviseurs et feux', 'Systèmes hydrauliques', 'Pièces de remorque']],
  ['11', 'Pièces spécifiques motos', [M], ['Moteurs et haut moteur', 'Embrayage', 'Variateurs / transmission', 'Chaînes et kits chaîne', 'Pignons et couronnes', 'Fourches', 'Amortisseurs', 'Freinage', 'Carénages', 'Guidons', 'Batteries et électricité', 'Échappements']],
  ['12', 'Pièces spécifiques bateaux', [B], ['Moteurs hors-bord', 'Moteurs inboard', 'Hélices', 'Pompes à eau', 'Pompes de cale', 'Démarreurs', 'Alternateurs', 'Bougies', 'Filtres', 'Pièces de refroidissement', 'Commandes moteur', 'Pièces de transmission marine']]
];

export function seed() {
  const categories = SECTIONS.map(([code, name, vehicles]) => ({ id: 'c' + code, code, name, vehicles: vehicles.slice() }));
  return { categories, parts: [], settings: { whatsapp: '' }, updated: null };
}

export function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.categories) && Array.isArray(d.parts)) {
        if (!d.settings) d.settings = { whatsapp: '' };
        return d;
      }
    }
  } catch (e) { /* données illisibles : on repart du catalogue de référence */ }
  const s = seed();
  save(s);
  return s;
}

export function save(data) {
  const payload = Object.assign({}, data, { updated: new Date().toISOString() });
  localStorage.setItem(STORE_KEY, JSON.stringify(payload));
  return payload;
}

export const VEHICLES = [A, C, M, B];
export const STATES = ['Neuf', 'Occasion', 'Neuf / Occasion', "Dépose d'origine", "Second choix d'usine"];
export function isPriced(p) {
  const v = (p.priceNew || '') + ' ' + (p.priceUsed || '');
  return /\d/.test(v);
}
