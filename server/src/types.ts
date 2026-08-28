export const VEHICLES = ['Auto', 'Camion', 'Moto', 'Bateau'] as const;
export type Vehicle = (typeof VEHICLES)[number];

export const STATES = [
  'Neuf',
  'Occasion',
  'Neuf / Occasion',
  "Dépose d'origine",
  "Second choix d'usine",
] as const;

export interface Category {
  id: string;
  code: string;
  name: string;
  vehicles: Vehicle[];
}

export interface Part {
  id: string;
  ref: string;
  name: string;
  catId: string;
  vehicles: Vehicle[];
  state: string;
  oem: string;
  priceNew: string;
  priceUsed: string;
  fit: string;
  stock: string;
  image: string;
  desc: string;
}

export interface Settings {
  whatsapp: string;
}

export interface Catalogue {
  categories: Category[];
  parts: Part[];
  settings: Settings;
  updated: string | null;
}

/** Champs modifiables d'une pièce, tels qu'ils arrivent de l'éditeur. */
export type PartInput = Omit<Part, 'id'>;
