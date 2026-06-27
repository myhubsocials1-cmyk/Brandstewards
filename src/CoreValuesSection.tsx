import { useState } from 'react';
import { useRevealOnView } from './useRevealOnView';
import coreValueTexture from './assets/images/core_value_texture_1782357431439.jpg';
import AnimatedText from './AnimatedText';

const items = [
  {
    id: 'vision',
    number: '01',
    title: 'Vision',
    seal: 'Vision',
    accent: '#7eb622',
    content: (
      <>
        To be the best-loved brand management consultancy through <span className="text-[#f39200] italic">value-adding and result-focused</span> strategic initiatives.
      </>
    ),
  },
  {
    id: 'mission',
    number: '02',
    title: 'Mission',
    seal: 'Mission',
    accent: '#f39200',
    content: (
      <>
        Partner with our clients to build <span className="text-[#f39200] italic">competitive, world-class brands</span> that exceed customers' expectations.
      </>
    ),
  },
  {
    id: 'values',
    number: '03',
    title: 'Core Values',
    seal: 'Values',
    accent: '#f2c456',
    content: (
      <>
        <span className="text-[#f39200] italic">Excellence, Integrity, Innovation,</span> and an unwavering commitment to the success of the brands we steward.
      </>
    ),
  },
];

export default function CoreValuesSection() {
  const containerRef = useRevealOnView<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const activeItem = items[openIndex ?? 0];

  return (
    <section id="core-values" className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#1f2a1d]/90">
        <img
          src={coreValueTexture}
          alt=""
          className="w-full h-full object-cover opacity-50 mix-blend-screen animate-liquid-drift"
        />
        <div className="absolute inset-0 bg-[#1f2a1d]/66 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div
          ref={containerRef}
          className="reveal core-charter relative w-full overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#151c14]/72 backdrop-blur-2xl p-8 sm:p-12 lg:p-24 flex flex-col items-start border border-white/[0.08]"
          style={{
            boxShadow: '0 20px 80px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.06)',
            '--charter-accent': activeItem.accent,
          } as React.CSSProperties & Record<'--charter-accent', string>}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[#151c14] via-[#151c14]/88 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151c14] via-transparent to-transparent lg:hidden" />
            <div className="core-charter-aura absolute inset-0 opacity-100" />
            <div className="core-charter-seal hidden lg:block absolute right-10 top-10 text-[9rem] xl:text-[12rem] uppercase font-semibold leading-none select-none">
              {activeItem.seal}
            </div>
          </div>

          <div className="relative z-10 w-full max-w-5xl">
            <div className="text-[#7eb622] text-xs sm:text-sm uppercase tracking-[0.3em] mb-12 sm:mb-16 font-semibold flex items-center gap-4">
              <span className="w-8 sm:w-12 h-[1px] bg-[#7eb622]" />
              <AnimatedText text="Our Philosophy" motionProfile="label" />
            </div>

            <div className="flex flex-col gap-0 w-full group/accordion">
              {items.map((item, i) => {
                const isOpen = openIndex === i;
                const isAnyOpen = openIndex !== null;
                return (
                  <div
                    key={item.id}
                    className={`core-charter-row border-b border-white/10 last:border-b-0 py-8 sm:py-10 transition-opacity duration-700 ${isOpen ? 'is-open' : ''} ${isAnyOpen && !isOpen ? 'opacity-[0.42] hover:opacity-70' : 'opacity-100'}`}
                    style={{ '--row-accent': item.accent } as React.CSSProperties & Record<'--row-accent', string>}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex items-center justify-between w-full text-left group outline-none"
                      data-cursor="hover"
                    >
                      <div className="flex items-center gap-6 sm:gap-10">
                        <span className={`font-mono text-sm sm:text-base font-medium tracking-widest transition-colors duration-500 ${isOpen ? 'text-[var(--row-accent)]' : 'text-white/40 group-hover:text-white/70'}`}>
                          {item.number}
                        </span>
                        <h3
                          className={`text-3xl sm:text-4xl lg:text-5xl font-medium transition-colors duration-500 tracking-tight ${isOpen ? 'text-white' : 'text-white/90 group-hover:text-white'}`}
                          style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <div className={`charter-toggle relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 ml-6 ${isOpen ? 'is-open' : ''}`}>
                        <span />
                        <span />
                      </div>
                    </button>
                    <div
                      className="grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-8 sm:pt-10 pb-2 pr-4 sm:pr-12 pl-[52px] sm:pl-[72px]">
                          <p
                            className="charter-statement text-[1.75rem] sm:text-[2.5rem] lg:text-[3.25rem] xl:text-[3.75rem] text-white leading-[1.1] font-normal max-w-4xl text-balance"
                            style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
                          >
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
