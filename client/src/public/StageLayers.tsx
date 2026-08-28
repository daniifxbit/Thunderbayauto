import { useEffect, useRef } from 'react';

/**
 * Curseur chrome sur poste de travail : un disque qui s'élargit au survol de ce
 * qui se clique. Absent au doigt, absent en mouvement réduit.
 */
export function StageLayers() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover:hover) and (min-width:1024px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const dot = cursor.current;
    if (!dot) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let started = false;

    const draw = () => {
      // Léger retard sur le pointeur : le disque suit, il ne colle pas.
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      if (!started) {
        started = true;
        x = tx;
        y = ty;
        dot.style.opacity = '1';
        raf = requestAnimationFrame(draw);
      }
      const target = event.target as Element | null;
      const hot = Boolean(target?.closest?.('a,button,input,textarea,select,[data-gloss]'));
      dot.dataset.hot = hot ? 'true' : 'false';
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div aria-hidden="true" ref={cursor} className="cursor" />;
}
