import { useEffect, useRef, useState } from 'react';

type TrailPoint = {
  x: number;
  y: number;
  life: number;
  size: number;
};

type Ripple = {
  x: number;
  y: number;
  life: number;
  size: number;
  alpha: number;
};

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const visibleRef = useRef(false);
  const hoveringRef = useRef(false);
  const pressedRef = useRef(false);
  const lastRippleRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let targetX = width / 2;
    let targetY = height / 2;
    let currentX = targetX;
    let currentY = targetY;

    const trail: TrailPoint[] = [];
    const ripples: Ripple[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const addRipple = (x: number, y: number, intensity = 1) => {
      ripples.push({
        x,
        y,
        life: 1,
        size: pressedRef.current ? 28 : hoveringRef.current ? 22 : 16,
        alpha: 0.14 + intensity * 0.08,
      });
      if (ripples.length > 24) ripples.shift();
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      if (visibleRef.current) {
        trail.push({
          x: currentX,
          y: currentY,
          life: 1,
          size: pressedRef.current ? 24 : hoveringRef.current ? 19 : 15,
        });
        if (trail.length > 18) trail.shift();
      }

      ctx.clearRect(0, 0, width, height);
      if (!visibleRef.current) {
        window.requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = trail.length - 1; i >= 0; i -= 1) {
        const point = trail[i];
        point.life *= 0.9;
        if (point.life <= 0.03) {
          trail.splice(i, 1);
          continue;
        }

        const alpha = point.life * 0.18;
        const radius = point.size * (0.8 + point.life * 0.7);
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        glow.addColorStop(0, `rgba(126, 182, 34, ${alpha * 0.8})`);
        glow.addColorStop(0.3, `rgba(126, 182, 34, ${alpha * 0.25})`);
        glow.addColorStop(1, 'rgba(126, 182, 34, 0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.life *= 0.92;
        if (ripple.life <= 0.04) {
          ripples.splice(i, 1);
          continue;
        }

        const radius = ripple.size * (0.4 + ripple.life * 1.35);
        ctx.strokeStyle = `rgba(31, 42, 29, ${ripple.alpha * ripple.life})`;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      const mainRadius = pressedRef.current ? 16 : hoveringRef.current ? 20 : 15;
      const mainGlow = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, mainRadius * 2.8);
      mainGlow.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
      mainGlow.addColorStop(0.25, 'rgba(126, 182, 34, 0.2)');
      mainGlow.addColorStop(0.55, 'rgba(31, 42, 29, 0.08)');
      mainGlow.addColorStop(1, 'rgba(31, 42, 29, 0)');

      ctx.fillStyle = mainGlow;
      ctx.beginPath();
      ctx.arc(currentX, currentY, mainRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(31, 42, 29, 0.78)';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      window.requestAnimationFrame(render);
    };

    resize();
    document.body.style.cursor = 'none';
    render();

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const dx = targetX - lastRippleRef.current.x;
      const dy = targetY - lastRippleRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 10) {
        addRipple(targetX, targetY, 0.9);
        lastRippleRef.current = { x: targetX, y: targetY };
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const hover = Boolean(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor="hover"]') ||
        target.closest('.liquid-button')
      );

      hoveringRef.current = hover;
      setIsHovering(hover);

      if (hover) {
        addRipple(targetX, targetY, 1.15);
      }
    };

    const handlePointerDown = () => {
      pressedRef.current = true;
      setIsPressed(true);
      addRipple(currentX, currentY, 1.2);
    };

    const handlePointerUp = () => {
      pressedRef.current = false;
      setIsPressed(false);
    };

    const handlePointerLeave = () => {
      visibleRef.current = false;
      hoveringRef.current = false;
      pressedRef.current = false;
      trail.length = 0;
      ripples.length = 0;
      setIsVisible(false);
      setIsHovering(false);
      setIsPressed(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerover', handlePointerOver);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerLeave);
    window.addEventListener('pointerout', handlePointerLeave);
    window.addEventListener('resize', resize);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerLeave);
      window.removeEventListener('pointerout', handlePointerLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[10000]" />;
}
