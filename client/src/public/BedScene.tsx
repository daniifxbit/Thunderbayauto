import type { BedLabels } from './bedLabels';
import { easeInOut, range } from './motion';

/**
 * Benne de pick-up en vue éclatée, qui se monte au fil de la descente.
 * Projection oblique tracée en polygones : nette à toute résolution, aucun
 * fichier à charger, et chaque pièce porte sa référence comme sur un plan.
 */

interface Label {
  x: number;
  y: number;
  anchor: 'start' | 'end';
  /** Trait de rappel, de l'étiquette vers la pièce. */
  leader: [number, number, number, number];
  ref: string;
  key: keyof BedLabels;
}

interface Piece {
  id: string;
  /** Contour simple, ou tracé à trou pour les pièces ajourées. */
  points?: string;
  path?: string;
  /** Écart de la pièce à l'état éclaté. */
  offset: [number, number];
  /** Fenêtre d'assemblage : les pièces se posent l'une après l'autre. */
  from: number;
  to: number;
  fill: string;
  label?: Label;
}

const PIECES: Piece[] = [
  {
    id: 'far',
    points: '390,465 1030,465 1030,315 390,315',
    offset: [118, -92],
    from: 0,
    to: 0.42,
    fill: 'url(#acierSombre)',
    label: {
      x: 1075,
      y: 292,
      anchor: 'start',
      leader: [1068, 288, 1012, 330],
      ref: 'TBA-07-05',
      key: 'far',
    },
  },
  {
    id: 'floor',
    points: '240,560 880,560 1030,465 390,465',
    offset: [0, 176],
    from: 0.06,
    to: 0.5,
    fill: 'url(#acierTranche)',
    label: {
      x: 185,
      y: 636,
      anchor: 'end',
      leader: [193, 630, 300, 566],
      ref: 'TBA-07-02',
      key: 'floor',
    },
  },
  {
    id: 'front',
    points: '240,560 240,410 390,315 390,465',
    offset: [-200, 24],
    from: 0.12,
    to: 0.58,
    fill: 'url(#acierSombre)',
    label: {
      x: 34,
      y: 348,
      anchor: 'start',
      leader: [150, 356, 252, 422],
      ref: 'TBA-07-06',
      key: 'front',
    },
  },
  {
    id: 'side',
    points: '240,560 880,560 880,410 240,410',
    offset: [-108, 100],
    from: 0.18,
    to: 0.66,
    fill: 'url(#acier)',
    label: {
      x: 185,
      y: 664,
      anchor: 'end',
      leader: [193, 658, 332, 540],
      ref: 'TBA-07-04',
      key: 'side',
    },
  },
  {
    id: 'gate',
    points: '880,560 1030,465 1030,315 880,410',
    offset: [222, -16],
    from: 0.26,
    to: 0.76,
    fill: 'url(#acier)',
    label: {
      x: 1080,
      y: 508,
      anchor: 'start',
      leader: [1073, 502, 1002, 452],
      ref: 'TBA-07-01',
      key: 'gate',
    },
  },
  {
    id: 'rail',
    // Cadre : le bord supérieur de la benne, pas un couvercle.
    path:
      'M 240,410 L 880,410 L 1030,315 L 390,315 Z ' +
      'M 269.5,401.4 L 877.5,401.4 L 1000.5,323.6 L 392.5,323.6 Z',
    offset: [0, -196],
    from: 0.34,
    to: 0.86,
    fill: 'url(#acierTranche)',
    label: {
      x: 690,
      y: 240,
      anchor: 'start',
      leader: [686, 246, 652, 306],
      ref: 'TBA-07-11',
      key: 'rail',
    },
  },
];

/** Passages de roue, découpés dans le panneau : ils voyagent avec lui. */
const ARCHES = ['M 322 560 a 66 66 0 0 1 132 0 Z', 'M 686 560 a 66 66 0 0 1 132 0 Z'];

export function BedScene({ progress, labels }: { progress: number; labels: BedLabels }) {
  const seated = easeInOut(progress);

  return (
    <svg
      className="bed"
      viewBox="0 0 1280 820"
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
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* L'ombre se forme à mesure que la benne se pose. */}
      <ellipse cx="640" cy="612" rx="430" ry="46" fill="url(#ombre)" opacity={seated * 0.9} />

      {PIECES.map((piece) => {
        const travel = 1 - easeInOut(range(progress, piece.from, piece.to));
        const dx = piece.offset[0] * travel;
        const dy = piece.offset[1] * travel;
        // Visible dès l'arrêt sur la scène, effacée quand la pièce se pose.
        const labelOpacity = (1 - range(progress, piece.to - 0.24, piece.to)) * 0.92;

        return (
          <g key={piece.id} transform={`translate(${dx.toFixed(2)} ${dy.toFixed(2)})`}>
            {piece.path ? (
              <path
                d={piece.path}
                fillRule="evenodd"
                fill={piece.fill}
                stroke="rgba(255,255,255,.22)"
                strokeWidth="1.25"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <polygon
                points={piece.points}
                fill={piece.fill}
                stroke="rgba(255,255,255,.22)"
                strokeWidth="1.25"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {piece.id === 'side'
              ? ARCHES.map((d) => (
                  <path
                    key={d}
                    d={d}
                    fill="#0A0D11"
                    stroke="rgba(255,255,255,.22)"
                    strokeWidth="1.25"
                    vectorEffect="non-scaling-stroke"
                  />
                ))
              : null}

            {piece.label && labelOpacity > 0.01 ? (
              <g opacity={labelOpacity} className="bed__label">
                <line
                  x1={piece.label.leader[0]}
                  y1={piece.label.leader[1]}
                  x2={piece.label.leader[2]}
                  y2={piece.label.leader[3]}
                  stroke="#D8121F"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx={piece.label.leader[2]} cy={piece.label.leader[3]} r="3" fill="#D8121F" />
                <text
                  x={piece.label.x}
                  y={piece.label.y}
                  textAnchor={piece.label.anchor}
                  className="bed__ref"
                >
                  {piece.label.ref}
                </text>
                <text
                  x={piece.label.x}
                  y={piece.label.y + 19}
                  textAnchor={piece.label.anchor}
                  className="bed__name"
                >
                  {labels[piece.label.key]}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}

      {/* Le feu arrière se pose en dernier : la benne est complète. */}
      <g
        transform={`translate(${(300 * (1 - easeInOut(range(progress, 0.44, 0.94)))).toFixed(2)} ${(
          -64 * (1 - easeInOut(range(progress, 0.44, 0.94)))
        ).toFixed(2)})`}
      >
        <polygon
          points="892,548 926,548 926,472 892,472"
          fill="#D8121F"
          stroke="rgba(255,255,255,.3)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          opacity={0.55 + 0.45 * range(progress, 0.7, 1)}
        />
      </g>

      {/* Filet rouge : il se trace quand tout est en place. */}
      <rect
        x={640 - 430 * seated}
        y="626"
        width={860 * seated}
        height="2"
        fill="url(#lueur)"
        opacity={seated}
      />
    </svg>
  );
}
