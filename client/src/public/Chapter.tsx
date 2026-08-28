import type { ReactNode } from 'react';
import { useReveal } from './motion';

interface Props {
  index: string;
  kicker: string;
  title: ReactNode;
  aside?: ReactNode;
}

/**
 * Ouverture de chapitre : numéro, intitulé, titre d'affichage. Le même bloc
 * revient à chaque section pour donner son rythme à la descente.
 */
export function ChapterHead({ index, kicker, title, aside }: Props) {
  const ref = useReveal<HTMLDivElement>(0.35);

  return (
    <div className="chapter" ref={ref}>
      <div className="chapter__rule" />
      <div className="chapter__row">
        <div className="chapter__left">
          <span className="chapter__index">{index}</span>
          <span className="tag">{kicker}</span>
        </div>
        {aside ? <div className="chapter__aside">{aside}</div> : null}
      </div>
      <h2 className="chapter__title">{title}</h2>
    </div>
  );
}
