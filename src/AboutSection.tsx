import { useRevealOnView } from './useRevealOnView';
import GlassCard from './GlassCard';
import AnimatedText from './AnimatedText';

const stats = [
  {
    value: '35+',
    label: 'YEARS IN PRACTICE',
    text: 'Three decades and more of hands-on brand and reputation work, from Lagos to London.',
    offset: false,
  },
  {
    value: '02',
    label: 'SISTER VENTURES',
    text: 'Brand Stewards and the Nigerian Brand Academy — one philosophy, two platforms.',
    offset: true,
  },
  {
    value: '03',
    label: 'BRANDING DISCIPLINES',
    text: 'Personal, corporate, and destination branding — under one roof.',
    offset: false,
  },
];

const CLIP = [
  'polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)',
  'polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 64px 100%, 0 calc(100% - 64px))',
  'polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 64px), calc(100% - 64px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px))',
];

const TEXT_POS = ['left-6 right-6 bottom-6', 'left-6 bottom-20', 'left-6 right-28 bottom-6'];

function StatCard({ s, clip, textPos, index }: { s: (typeof stats)[number]; clip: string; textPos: string; index: number }) {
  const ref = useRevealOnView<HTMLDivElement>();

  return (
    <div ref={ref} className={`reveal w-full ${s.offset ? 'lg:mt-24' : ''}`}>
      <GlassCard className="about-stat-card relative w-full h-[280px] sm:h-[340px] group cursor-pointer" data-cursor="hover">
        <div className="absolute inset-[1px] z-10" style={{ clipPath: clip }}>
          <div className="relative w-full h-full overflow-hidden bg-white/88 backdrop-blur-xl">
            <div className="about-stat-sheen absolute inset-0" />
            <div className={`absolute ${textPos} max-w-[82%] z-10`}>
              <span className="about-stat-value font-semibold uppercase leading-none text-[36px] sm:text-[52px]" style={{ color: '#1f2a1d' }}>
                {s.value}
              </span>
              <p className="mt-1 text-[10px] tracking-[0.22em] font-semibold" style={{ color: 'rgba(31, 42, 29, 0.58)' }}>
                {s.label}
              </p>
              <p className="mt-3 text-[13px] leading-[1.48] font-medium" style={{ color: 'rgba(31, 42, 29, 0.88)' }}>
                {s.text}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden" style={{ clipPath: clip, backgroundColor: 'rgba(31, 42, 29, 0.1)' }}>
          <div
            className="about-stat-border absolute inset-[-50%] w-[200%] h-[200%] liquid-card-border bg-[conic-gradient(from_0deg,transparent_0%,#7eb622_10%,transparent_30%,#f39200_50%,transparent_70%)] opacity-35 group-hover:opacity-95 group-hover:brightness-150 transition-all duration-700"
            style={{ animationDelay: `${index * -1.5}s` }}
          />
        </div>
      </GlassCard>
    </div>
  );
}

export default function AboutSection() {
  const headRef = useRevealOnView<HTMLDivElement>();

  return (
    <section id="about" className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="premium-glass-panel w-full rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20">
          <div ref={headRef} className="reveal flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-20 text-[#1f2a1d]">
            <div
              className="text-[36px] sm:text-[48px] lg:text-[54px] font-semibold uppercase tracking-tight leading-[0.95]"
              style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              <AnimatedText text="About" motionProfile="headline" />
              <AnimatedText text="Who We Are" delay={0.2} motionProfile="headline" />
            </div>

            <div className="flex flex-col max-w-xl">
              <p className="text-[17px] sm:text-[18px] leading-[1.55]">
                BrandStewards Limited is a Digital Marketing, Brand and Reputation Management
                consultancy operating from Nigeria and the United Kingdom.
              </p>
              <p className="text-[17px] sm:text-[18px] leading-[1.55] mt-4">
                We thrive on the strategic development and management of the brands of
                individuals, organisations, and destinations — cities included.
              </p>
              <div className="mt-8">
                <a
                  href="#about"
                  data-cursor="hover"
                  className="liquid-button relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-500 text-[#1f2a1d] bg-white/85 shadow-[0_10px_35px_rgba(31,42,29,0.13)] hover:-translate-y-0.5 hover:bg-white"
                >
                  <span className="relative z-10">Learn More</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.map((s, i) => (
              <StatCard key={s.label} s={s} clip={CLIP[i]} textPos={TEXT_POS[i]} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
