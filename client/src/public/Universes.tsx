import { ChapterHead } from './Chapter';
import type { Dict } from './i18n';
import { useReveal } from './motion';
import type { Part, Vehicle } from '../lib/types';
import { VEHICLES } from '../lib/types';

interface Props {
  t: Dict;
  parts: Part[];
  onPick: (vehicle: Vehicle) => void;
}

/** Quatre univers en rangées pleine largeur : le rouge balaie la ligne au survol. */
export function Universes({ t, parts, onPick }: Props) {
  return (
    <section id="univers" className="band">
      <div className="hold">
        <ChapterHead index="01" kicker={t.kUnivers} title={t.universTitle} />

        <div className="univers">
          {VEHICLES.map((vehicle, i) => (
            <UniverseRow
              key={vehicle}
              index={i}
              vehicle={vehicle}
              t={t}
              count={parts.filter((p) => p.vehicles.includes(vehicle)).length}
              onPick={onPick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function UniverseRow({
  index,
  vehicle,
  t,
  count,
  onPick,
}: {
  index: number;
  vehicle: Vehicle;
  t: Dict;
  count: number;
  onPick: (vehicle: Vehicle) => void;
}) {
  const ref = useReveal<HTMLAnchorElement>(0.25);

  return (
    <a
      href="#catalogue"
      className="univers__row"
      ref={ref}
      style={{ '--i': index } as React.CSSProperties}
      onClick={() => onPick(vehicle)}
    >
      <span className="univers__wipe" aria-hidden="true" />
      <span className="univers__index">UNIV-0{index + 1}</span>
      <span className="univers__name">{t.veh[vehicle]}</span>
      <span className="univers__text">{t.univDesc[vehicle]}</span>
      <span className="univers__count">
        {count} {t.refsWord}
      </span>
      <span className="univers__go" aria-hidden="true">
        →
      </span>
    </a>
  );
}
