import { useEffect } from 'react';
import { initFluid } from './smokeyFluidCursor';

export default function LiquidCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvasId = 'smokey-fluid-canvas';
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
    }

    document.body.style.cursor = 'none';

    const canvasStyle = {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '2147483646',
      pointerEvents: 'none',
      isolation: 'isolate',
      mixBlendMode: 'normal',
      opacity: '0.25',
      background: 'transparent',
    } as const;

    Object.assign(canvas.style, canvasStyle);
    canvas.style.setProperty('z-index', canvasStyle.zIndex, 'important');
    canvas.style.setProperty('mix-blend-mode', canvasStyle.mixBlendMode, 'important');
    canvas.style.setProperty('opacity', canvasStyle.opacity, 'important');

    initFluid({
      transparent: true,
      backColor: { r: 0, g: 0, b: 0 },
      densityDissipation: 8,
      velocityDissipation: 8,
      curl: 3,
      pressureIteration: 20,
      splatRadius: 0.14,
      splatForce: 450,
      colorUpdateSpeed: 0,
      shading: false,
      id: canvasId,
    });

    setTimeout(() => {
      const canvasFinal = document.getElementById(canvasId) as HTMLCanvasElement | null;
      if (canvasFinal) {
        Object.assign(canvasFinal.style, canvasStyle);
        canvasFinal.style.setProperty('z-index', canvasStyle.zIndex, 'important');
        canvasFinal.style.setProperty('mix-blend-mode', canvasStyle.mixBlendMode, 'important');
        canvasFinal.style.setProperty('opacity', canvasStyle.opacity, 'important');
      }
    }, 50);

    return () => {
      document.body.style.cursor = '';
      if (canvas && canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
  }, []);

  return null;
}
