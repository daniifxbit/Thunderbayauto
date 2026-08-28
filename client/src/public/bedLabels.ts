import type { Lang } from './i18n';

/**
 * Nomenclature de la vue éclatée. Texte neuf, tenu à l'écart des dictionnaires
 * de la maquette pour que ceux-ci restent repris mot pour mot.
 */
export interface BedLabels {
  caption: string;
  hint: string;
  floor: string;
  side: string;
  far: string;
  front: string;
  gate: string;
  rail: string;
}

export const BED_LABELS: Record<Lang, BedLabels> = {
  fr: {
    caption: 'Vue éclatée — benne de pick-up, assemblée au défilement',
    hint: 'DÉFILEZ POUR ASSEMBLER',
    floor: 'PLANCHER',
    side: 'PANNEAU LATÉRAL',
    far: 'PANNEAU OPPOSÉ',
    front: 'PAROI AVANT',
    gate: 'HAYON',
    rail: 'RAIL DE BENNE',
  },
  en: {
    caption: 'Exploded view — pickup bed, assembled as you scroll',
    hint: 'SCROLL TO ASSEMBLE',
    floor: 'BED FLOOR',
    side: 'SIDE PANEL',
    far: 'OFF-SIDE PANEL',
    front: 'FRONT WALL',
    gate: 'TAILGATE',
    rail: 'BED RAIL',
  },
  es: {
    caption: 'Despiece — caja de pick-up, montada al desplazar',
    hint: 'DESPLACE PARA MONTAR',
    floor: 'PISO',
    side: 'PANEL LATERAL',
    far: 'PANEL OPUESTO',
    front: 'PARED FRONTAL',
    gate: 'PORTÓN',
    rail: 'RIEL DE CAJA',
  },
};
