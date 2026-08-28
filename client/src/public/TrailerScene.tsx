import type { ReactNode } from 'react';
import type { BedLabels } from './bedLabels';
import { easeInOut, range } from './motion';

/**
 * Remorque benne basculante en vue éclatée, montée au fil de la descente.
 * Projection oblique tracée en polygones, d'après le plan à quatorze postes :
 * nette à toute résolution, aucun fichier à charger, et chaque pièce porte son
 * numéro de nomenclature comme sur le plan.
 */

interface Label {
  x: number;
  y: number;
  anchor: 'start' | 'end';
  /** Trait de rappel, de la pastille vers la pièce. */
  leader: [number, number, number, number];
  num: number;
  key: keyof BedLabels;
}

interface Piece {
  id: string;
  /** Écart de la pièce à l'état éclaté. */
  offset: [number, number];
  /** Fenêtre d'assemblage : les pièces se posent l'une après l'autre. */
  from: number;
  to: number;
  shapes: ReactNode;
  label?: Label;
}

const EDGE = { stroke: 'rgba(255,255,255,.24)', strokeWidth: 1.25, vectorEffect: 'non-scaling-stroke' } as const;
const STEEL = 'url(#acier)';
const STEEL_DARK = 'url(#acierSombre)';
const STEEL_EDGE = 'url(#acierTranche)';

/* Repère de la scène : profondeur (92, −56), sol à y = 712, benne basculée à 30°. */

function Wheel({ cx, cy, r, rim }: { cx: number; cy: number; r: number; rim: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#12161B" {...EDGE} />
      <circle cx={cx} cy={cy} r={rim} fill={STEEL_EDGE} {...EDGE} />
      <circle cx={cx} cy={cy} r={rim * 0.32} fill="#1A1F25" {...EDGE} />
    </>
  );
}

function Guard({ cx }: { cx: number }) {
  return (
    <path
      d={`M ${cx - 78},656 A 78 78 0 0 1 ${cx + 78},656 L ${cx + 63},656 A 63 63 0 0 0 ${cx - 63},656 Z`}
      fill="#14171B"
      {...EDGE}
    />
  );
}

function Spring({ cx }: { cx: number }) {
  return (
    <>
      <path d={`M ${cx - 66},624 Q ${cx},600 ${cx + 66},624`} fill="none" stroke="#89919B" strokeWidth="7" />
      <path d={`M ${cx - 50},632 Q ${cx},610 ${cx + 50},632`} fill="none" stroke="#646C76" strokeWidth="5" />
    </>
  );
}

function Lamp({ x, y }: { x: number; y: number }) {
  return (
    <>
      <polygon points={`${x},${y} ${x + 30},${y} ${x + 30},${y + 17} ${x},${y + 17}`} fill="#C6121C" {...EDGE} />
      <polygon
        points={`${x},${y + 17} ${x + 30},${y + 17} ${x + 30},${y + 36} ${x},${y + 36}`}
        fill="#C8801A"
        {...EDGE}
      />
    </>
  );
}

const PIECES: Piece[] = [
  /* ---------------------------------------------------- train roulant ---- */
  {
    // Roues opposées : dessinées avant le châssis pour passer derrière.
    id: 'axles-far',
    offset: [0, 150],
    from: 0.06,
    to: 0.36,
    shapes: (
      <>
        <Wheel cx={652} cy={600} r={50} rim={28} />
        <Wheel cx={792} cy={600} r={50} rim={28} />
        <line x1={560} y1={656} x2={652} y2={600} stroke="#6E767F" strokeWidth="13" />
        <line x1={700} y1={656} x2={792} y2={600} stroke="#6E767F" strokeWidth="13" />
      </>
    ),
  },
  {
    id: 'chassis',
    offset: [0, 170],
    from: 0,
    to: 0.3,
    shapes: (
      <>
        <polygon points="330,596 980,596 1072,540 422,540" fill={STEEL_EDGE} {...EDGE} />
        {[430, 640, 850].map((x) => (
          <polygon
            key={x}
            points={`${x},596 ${x + 16},596 ${x + 108},540 ${x + 92},540`}
            fill={STEEL_DARK}
            {...EDGE}
          />
        ))}
        <polygon points="422,560 1072,560 1072,540 422,540" fill={STEEL_DARK} {...EDGE} />
        <polygon points="330,616 980,616 980,596 330,596" fill={STEEL} {...EDGE} />
      </>
    ),
    label: {
      x: 1230,
      y: 690,
      anchor: 'start',
      leader: [1224, 684, 930, 610],
      num: 8,
      key: 'p8',
    },
  },
  {
    id: 'springs',
    offset: [-40, 215],
    from: 0.1,
    to: 0.4,
    shapes: (
      <>
        <Spring cx={560} />
        <Spring cx={700} />
      </>
    ),
  },
  {
    id: 'axles-near',
    offset: [0, 150],
    from: 0.06,
    to: 0.36,
    shapes: (
      <>
        <Wheel cx={560} cy={656} r={56} rim={32} />
        <Wheel cx={700} cy={656} r={56} rim={32} />
      </>
    ),
    label: { x: 812, y: 764, anchor: 'start', leader: [806, 758, 742, 700], num: 11, key: 'p11' },
  },
  {
    id: 'guards',
    offset: [-70, 258],
    from: 0.2,
    to: 0.5,
    shapes: (
      <>
        <Guard cx={560} />
        <Guard cx={700} />
      </>
    ),
  },

  /* ---------------------------------------------------------- attelage ---- */
  {
    id: 'drawbar',
    offset: [-286, 30],
    from: 0.24,
    to: 0.54,
    shapes: (
      <>
        <polygon points="428,544 208,628 208,642 428,558" fill={STEEL_DARK} {...EDGE} />
        <polygon points="336,600 200,632 200,646 336,614" fill={STEEL} {...EDGE} />
        <polygon points="146,620 208,620 208,656 146,656" fill={STEEL_EDGE} {...EDGE} />
        <polygon points="150,612 194,598 198,610 154,624" fill={STEEL} {...EDGE} />
      </>
    ),
  },
  {
    id: 'jockey',
    offset: [-206, 148],
    from: 0.28,
    to: 0.58,
    shapes: (
      <>
        <polygon points="244,598 274,598 274,616 244,616" fill={STEEL_DARK} {...EDGE} />
        <polygon points="252,600 266,600 266,672 252,672" fill={STEEL} {...EDGE} />
        <Wheel cx={259} cy={688} r={21} rim={10} />
      </>
    ),
  },
  {
    id: 'lights',
    offset: [278, 62],
    from: 0.32,
    to: 0.62,
    shapes: (
      <>
        <Lamp x={1078} y={506} />
        <Lamp x={986} y={562} />
      </>
    ),
    label: { x: 1230, y: 500, anchor: 'start', leader: [1224, 494, 1112, 522], num: 14, key: 'p14' },
  },
  {
    id: 'ram',
    offset: [64, 244],
    from: 0.66,
    to: 0.94,
    shapes: (
      <>
        <line x1={742} y1={586} x2={668} y2={470} stroke={STEEL_EDGE} strokeWidth="26" strokeLinecap="round" />
        <line x1={668} y1={470} x2={616} y2={388} stroke="#CFD5DA" strokeWidth="12" strokeLinecap="round" />
        <circle cx={742} cy={588} r={11} fill={STEEL_DARK} {...EDGE} />
        <circle cx={614} cy={386} r={9} fill={STEEL_DARK} {...EDGE} />
      </>
    ),
    label: { x: 892, y: 706, anchor: 'start', leader: [886, 700, 704, 514], num: 6, key: 'p6' },
  },

  /* ------------------------------------------------------------- benne ---- */
  {
    id: 'floor',
    offset: [-84, 146],
    from: 0.38,
    to: 0.68,
    shapes: <polygon points="975,590 438,280 530,224 1067,534" fill="#40241D" {...EDGE} />,
    label: { x: 268, y: 404, anchor: 'end', leader: [276, 410, 618, 432], num: 3, key: 'p3' },
  },
  {
    id: 'side-far',
    offset: [196, -118],
    from: 0.44,
    to: 0.76,
    shapes: <polygon points="1067,534 530,224 573,149 1110,459" fill={STEEL_DARK} {...EDGE} />,
  },
  {
    id: 'front',
    offset: [-172, -100],
    from: 0.48,
    to: 0.78,
    shapes: <polygon points="438,280 530,224 573,149 481,205" fill={STEEL_EDGE} {...EDGE} />,
    label: { x: 372, y: 138, anchor: 'end', leader: [380, 144, 494, 190], num: 4, key: 'p4' },
  },
  {
    id: 'gate',
    offset: [182, 104],
    from: 0.52,
    to: 0.82,
    shapes: <polygon points="975,590 1067,534 1110,459 1018,515" fill={STEEL_EDGE} {...EDGE} />,
    label: { x: 1230, y: 578, anchor: 'start', leader: [1224, 572, 1074, 540], num: 5, key: 'p5' },
  },
  {
    id: 'topboard',
    offset: [212, 58],
    from: 0.56,
    to: 0.86,
    shapes: <polygon points="1018,515 1110,459 1125,433 1033,489" fill={STEEL} {...EDGE} />,
  },
  {
    id: 'side-near',
    offset: [-196, 118],
    from: 0.6,
    to: 0.9,
    shapes: <polygon points="975,590 438,280 481,205 1018,515" fill={STEEL} {...EDGE} />,
    label: { x: 306, y: 232, anchor: 'end', leader: [314, 238, 640, 336], num: 2, key: 'p2' },
  },
  {
    id: 'pivot',
    offset: [136, 172],
    from: 0.72,
    to: 0.98,
    shapes: (
      <>
        <polygon points="960,580 992,580 992,596 960,596" fill="#B9C0C7" {...EDGE} />
        <polygon points="1052,524 1084,524 1084,540 1052,540" fill="#B9C0C7" {...EDGE} />
      </>
    ),
  },
];

/** Les deux moitiés dessinées séparément ne comptent que pour un poste. */
const DOUBLES = new Set(['axles-far', 'side-far']);

/** Fin de course de chacun des quatorze postes, pour le relevé de montage. */
export const SEATING = PIECES.filter((p) => !DOUBLES.has(p.id)).map((p) => p.to);

export function TrailerScene({ progress, labels }: { progress: number; labels: BedLabels }) {
  const seated = easeInOut(progress);

  return (
    <svg
      className="bed"
      viewBox="-330 0 1980 980"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={labels.caption}
    >
      <defs>
        <linearGradient id="acier" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#E9EDF0" />
          <stop offset="28%" stopColor="#A6AEB7" />
          <stop offset="47%" stopColor="#5E666F" />
          <stop offset="66%" stopColor="#D6DCE1" />
          <stop offset="100%" stopColor="#79818A" />
        </linearGradient>
        <linearGradient id="acierSombre" x1="0" y1="0" x2="1" y2="0.8">
          <stop offset="0%" stopColor="#454D57" />
          <stop offset="52%" stopColor="#262C33" />
          <stop offset="100%" stopColor="#4C545E" />
        </linearGradient>
        <linearGradient id="acierTranche" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#828A94" />
          <stop offset="44%" stopColor="#474E57" />
          <stop offset="100%" stopColor="#9AA2AB" />
        </linearGradient>
        <linearGradient id="lueur" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF2231" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF2231" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF2231" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ombre" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* L'ombre se forme à mesure que la remorque se pose. */}
      <ellipse cx="660" cy="726" rx="470" ry="42" fill="url(#ombre)" opacity={seated * 0.95} />

      {PIECES.map((piece) => {
        const travel = 1 - easeInOut(range(progress, piece.from, piece.to));
        const dx = (piece.offset[0] * travel).toFixed(2);
        const dy = (piece.offset[1] * travel).toFixed(2);
        // Visible dès l'arrêt sur la scène, effacée quand la pièce se pose.
        const labelOpacity = (1 - range(progress, piece.to - 0.24, piece.to)) * 0.94;

        return (
          <g key={piece.id} transform={`translate(${dx} ${dy})`}>
            {piece.shapes}

            {piece.label && labelOpacity > 0.01 ? (
              <g opacity={labelOpacity} className="bed__callout">
                <line
                  x1={piece.label.leader[0]}
                  y1={piece.label.leader[1]}
                  x2={piece.label.leader[2]}
                  y2={piece.label.leader[3]}
                  stroke="#D8121F"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx={piece.label.leader[2]} cy={piece.label.leader[3]} r="3.5" fill="#D8121F" />
                <circle
                  cx={piece.label.anchor === 'start' ? piece.label.x - 17 : piece.label.x + 17}
                  cy={piece.label.y - 5}
                  r="14"
                  fill="none"
                  stroke="#D8121F"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={piece.label.anchor === 'start' ? piece.label.x - 17 : piece.label.x + 17}
                  y={piece.label.y}
                  textAnchor="middle"
                  className="bed__num"
                >
                  {piece.label.num}
                </text>
                <text
                  x={piece.label.x}
                  y={piece.label.y}
                  textAnchor={piece.label.anchor}
                  className="bed__name"
                  dx={piece.label.anchor === 'start' ? 8 : -8}
                >
                  {labels[piece.label.key]}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}

      {/* Filet rouge : il se trace quand tout est en place. */}
      <rect
        x={660 - 470 * seated}
        y="742"
        width={940 * seated}
        height="2"
        fill="url(#lueur)"
        opacity={seated}
      />
    </svg>
  );
}
