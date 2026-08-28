import type { Catalogue } from '../lib/types';
import { hasNumber } from '../lib/types';

interface Props {
  catalogue: Catalogue | null;
}

export function StatStrip({ catalogue }: Props) {
  const parts = catalogue ? catalogue.parts : [];
  const priced = parts.filter((p) => hasNumber(p.priceNew) || hasNumber(p.priceUsed)).length;
  const value = (n: number) => (catalogue ? String(n) : '—');

  const stats = [
    { label: 'PIÈCES AU CATALOGUE', value: value(parts.length), alert: false },
    { label: 'CATÉGORIES', value: value(catalogue ? catalogue.categories.length : 0), alert: false },
    { label: 'RÉFÉRENCES CHIFFRÉES', value: value(priced), alert: false },
    { label: 'PRIX À RENSEIGNER', value: value(parts.length - priced), alert: true },
  ];

  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <div className="stat__label">{s.label}</div>
          <div className={'stat__value' + (s.alert ? ' stat__value--alert' : '')}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}
