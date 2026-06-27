import { useEffect, useRef } from "react";

export default function PreloaderNumberArc({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animatedProgressRef = useRef(0);
  const targetProgressRef = useRef(progress);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT = `300 17px "Inter Tight", sans-serif`;

    const draw = (value: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = 550 * dpr;
      canvas.height = 70 * dpr;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, 550, 70);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 550, 70);
      ctx.clip();
      ctx.font = FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let number = 0; number <= 100; number += 1) {
        const distance = number - value;
        const absDistance = Math.abs(distance);
        if (absDistance > 5) continue;
        const angle = -Math.PI / 2 + distance * (Math.PI / 16);
        const x = 275 + Math.cos(angle) * 310;
        const y = 330 + Math.sin(angle) * 310;
        if (x < -80 || x > 630 || y < -20 || y > 90) continue;
        const fade = Math.pow(1 - absDistance / 5, 2.2);
        const opacity = Math.max(0, 0.95 * fade);
        const focal = Math.max(0, 1 - absDistance / 1.2);
        const scale = 1 + focal * 0.35;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        if (focal > 0.05) {
          ctx.shadowColor = `rgba(126, 182, 34, ${focal * 0.9})`; // adapted to green #7eb622
          ctx.shadowBlur = 18 * focal;
        }
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fillText(String(number), 0, 0);
        ctx.restore();
      }
      ctx.restore();
    };

    const tick = () => {
      const current = animatedProgressRef.current;
      const target = targetProgressRef.current;
      const delta = target - current;
      if (Math.abs(delta) < 0.001) {
        animatedProgressRef.current = target;
        draw(target);
        frameRef.current = null;
        return;
      }
      animatedProgressRef.current = current + delta * 0.045;
      draw(animatedProgressRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };

    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        bottom: 123,
        transform: "translateX(-50%)",
        width: 550,
        height: 70,
        zIndex: 4,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 100% at 50% 50%, black 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 55% 100% at 50% 50%, black 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)",
        }}
      />
    </div>
  );
}
