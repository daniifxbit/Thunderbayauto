import { useEffect, useRef } from 'react';

/**
 * Deux éléments de mise en scène de la direction artistique : la grille de quatre
 * colonnes visible en permanence, et le curseur chrome sur poste de travail.
 */
export function StageLayers() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover:hover) and (min-width:1024px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const dot = cursor.current;
    if (!dot) return;

    const move = (event: PointerEvent) => {
      // Le disque n'apparaît qu'au premier mouvement, pas au centre de l'écran.
      dot.style.display = 'block';
      dot.style.left = event.clientX + 'px';
      dot.style.top = event.clientY + 'px';
      const target = event.target as Element | null;
      const interactive = Boolean(target?.closest?.('a,button,input,textarea,[data-gloss]'));
      dot.style.width = interactive ? '48px' : '26px';
      dot.style.height = interactive ? '48px' : '26px';
      dot.style.borderColor = interactive ? '#D8121F' : 'rgba(255,255,255,.72)';
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <>
      <div aria-hidden="true" className="s-grid">
        <div />
        <div />
        <div />
        <div />
      </div>
      <div aria-hidden="true" ref={cursor} className="s-cursor" />
    </>
  );
}
