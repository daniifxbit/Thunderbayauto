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

/** État de l'éditeur : une pièce en cours de saisie, `id` nul pour un ajout. */
export interface PartForm extends Omit<Part, 'id'> {
  id: string | null;
}

export function blankForm(categories: Category[]): PartForm {
  return {
    id: null,
    ref: '',
    name: '',
    catId: categories[0] ? categories[0].id : '',
    vehicles: ['Auto'],
    state: 'Neuf / Occasion',
    oem: '',
    priceNew: '',
    priceUsed: '',
    fit: '',
    stock: '',
    image: '',
    desc: '',
  };
}

export function formFromPart(part: Part): PartForm {
  return { ...part, vehicles: part.vehicles.slice() };
}

/** Un prix ne compte comme renseigné que s'il porte un chiffre. */
export function hasNumber(value: string | null | undefined): boolean {
  return /\d/.test(String(value ?? ''));
}

/** Une image déposée sur le serveur, par opposition à une adresse collée. */
export function isUploadedImage(image: string): boolean {
  return image.startsWith('/uploads/');
}
