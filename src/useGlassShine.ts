import { useEffect } from 'react';

export function useGlassShine() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('.glass-pill') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);
}
