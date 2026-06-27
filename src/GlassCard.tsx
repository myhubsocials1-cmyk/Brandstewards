import { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'motion/react';

type GlassCardProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      {...props}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className={`${className} relative`}
    >
      {/* 3D floating content container */}
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="w-full h-full"
      >
        {children}
      </div>
      
      {/* Dynamic specular highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]"
        style={{
          background: useTransform(
            () => `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
          )
        }}
      />
    </motion.div>
  );
}
