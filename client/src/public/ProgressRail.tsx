import { useActiveChapter } from './motion';

export interface Chapter {
  id: string;
  label: string;
}

/** Rail de chapitres : où l'on est dans la descente, et comment sauter ailleurs. */
export function ProgressRail({ chapters }: { chapters: Chapter[] }) {
  const active = useActiveChapter(chapters.map((c) => c.id));

  return (
    <nav className="rail" aria-label="Chapitres">
      {chapters.map((chapter, i) => {
        const on = chapter.id === active;
        return (
          <a
            key={chapter.id}
            href={'#' + chapter.id}
            className={'rail__item' + (on ? ' rail__item--on' : '')}
            aria-current={on ? 'true' : undefined}
          >
            <span className="rail__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="rail__tick" />
            <span className="rail__label">{chapter.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
