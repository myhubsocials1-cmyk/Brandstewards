import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Link = { href: string; label: string };

export default function GlassNav({ navLinks }: { navLinks: Link[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const moveIndicator = (el: HTMLElement) => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({ left: r.left - cRect.left, width: r.width });
  };

  return (
    <div
      ref={containerRef}
      className="glass-pill relative hidden lg:flex items-center gap-1 rounded-full pl-2 pr-1 py-1"
      onMouseLeave={() => setIndicator(null)}
    >
      {indicator && (
        <span
          className="absolute top-1 bottom-1 rounded-full bg-white/70 transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
        />
      )}
      {navLinks.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          data-cursor="hover"
          onMouseEnter={(e) => moveIndicator(e.currentTarget)}
          className={`relative z-10 text-sm px-4 py-2 transition-colors ${i === 0 ? 'font-semibold text-[#1e351d]' : 'font-medium text-[#1e351d]/70 hover:text-[#1e351d]'}`}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
