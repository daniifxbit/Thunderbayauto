// Structure issue du catalogue général de pièces (12 systèmes).
// Reprise à l'identique du prototype `catalogue-data.js`.
import type { Category, Vehicle } from '../types.js';

const A: Vehicle = 'Auto';
const C: Vehicle = 'Camion';
const M: Vehicle = 'Moto';
const B: Vehicle = 'Bateau';

type Section = [code: string, name: string, vehicles: Vehicle[]];

const SECTIONS: Section[] = [
  ['01', 'Moteur & distribution', [A, C, M, B]],
  ['02', 'Transmission', [A, C, M, B]],
  ['03', 'Freinage', [A, C, M]],
  ['04', 'Suspension & direction', [A, C, M, B]],
  ['05', 'Électricité & électronique', [A, C, M, B]],
  ['06', 'Refroidissement & climatisation', [A, C, B]],
  ['07', 'Carrosserie, éclairage & habitacle', [A, C, M, B]],
  ['08', 'Alimentation & échappement', [A, C, M, B]],
  ['09', 'Roues, pneus & train roulant', [A, C, M]],
  ['10', 'Pièces spécifiques camions', [C]],
  ['11', 'Pièces spécifiques motos', [M]],
  ['12', 'Pièces spécifiques bateaux', [B]],
];

export function seedCategories(): Category[] {
  return SECTIONS.map(([code, name, vehicles]) => ({
    id: 'c' + code,
    code,
    name,
    vehicles: vehicles.slice(),
  }));
}
