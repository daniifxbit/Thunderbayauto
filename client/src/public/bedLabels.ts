import type { Lang } from './i18n';

/**
 * Nomenclature de la vue éclatée, reprise du plan de la remorque benne
 * basculante. Texte neuf, tenu à l'écart des dictionnaires de la maquette
 * pour que ceux-ci restent repris mot pour mot.
 */
export interface BedLabels {
  caption: string;
  hint: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  p7: string;
  p8: string;
  p9: string;
  p10: string;
  p11: string;
  p12: string;
  p13: string;
  p14: string;
}

export const BED_LABELS: Record<Lang, BedLabels> = {
  fr: {
    caption: 'Vue éclatée — remorque benne basculante, assemblée au défilement',
    hint: 'DÉFILEZ POUR ASSEMBLER',
    p1: 'Ridelle arrière supérieure',
    p2: 'Ridelles latérales',
    p3: 'Plancher bois',
    p4: 'Face avant',
    p5: 'Hayon arrière',
    p6: 'Vérin hydraulique',
    p7: 'Axe de basculement',
    p8: 'Châssis',
    p9: 'Timon / attelage',
    p10: 'Roue jockey',
    p11: 'Essieux tandem',
    p12: 'Suspension à lames',
    p13: 'Garde-boue',
    p14: 'Feux arrière',
  },
  en: {
    caption: 'Exploded view — tipping trailer, assembled as you scroll',
    hint: 'SCROLL TO ASSEMBLE',
    p1: 'Upper tailboard',
    p2: 'Side boards',
    p3: 'Timber floor',
    p4: 'Front panel',
    p5: 'Rear tailgate',
    p6: 'Hydraulic ram',
    p7: 'Tipping pivot',
    p8: 'Chassis',
    p9: 'Drawbar / coupling',
    p10: 'Jockey wheel',
    p11: 'Tandem axles',
    p12: 'Leaf suspension',
    p13: 'Mudguards',
    p14: 'Rear lights',
  },
  es: {
    caption: 'Despiece — remolque basculante, montado al desplazar',
    hint: 'DESPLACE PARA MONTAR',
    p1: 'Tablero trasero superior',
    p2: 'Tableros laterales',
    p3: 'Piso de madera',
    p4: 'Panel frontal',
    p5: 'Portón trasero',
    p6: 'Cilindro hidráulico',
    p7: 'Eje de basculación',
    p8: 'Chasis',
    p9: 'Lanza / enganche',
    p10: 'Rueda jockey',
    p11: 'Ejes tándem',
    p12: 'Suspensión de ballestas',
    p13: 'Guardabarros',
    p14: 'Luces traseras',
  },
};
