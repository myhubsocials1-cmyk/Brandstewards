import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRevealOnView } from './useRevealOnView';
import AnimatedText from './AnimatedText';

const testimonials = [
  {
    text: "When we were launching our new branch in Abuja, the team at Brand Stewards really came through for us. They didn't just give us strategy; they gave us a voice that resonated with our people. Top-notch professionals.",
    name: 'Chinedu Okafor',
    role: 'Director, Apex Logistics',
  },
  {
    text: 'Ah, working with Ademola and his team is a breath of fresh air. They took our scattered ideas and built a reputation management framework that is frankly world-class. We are seeing the results every single day.',
    name: 'Funke Adebayo',
    role: 'Founder, TechTribe Africa',
  },
  {
    text: 'Brand Stewards changed the narrative for our city-state project. Their deep understanding of destination branding is second to none. They know how to tell the Nigerian story with dignity and impact.',
    name: 'Alhaji Tariq Usman',
    role: 'Commissioner for Tourism',
  },
  {
    text: "It's not just the strategy, it's the execution. They hold your hand through the entire process. If you want a brand that will actually stand the test of time in this market, these are the people you call.",
    name: 'Ejiro Onome',
    role: 'CEO, Delta Dynamics',
  },
];

const avatarColors = [
  ['#7eb622', '#1f2a1d'],
  ['#f39200', '#7eb622'],
  ['#1f2a1d', '#f39200'],
  ['#7eb622', '#f39200'],
];

function TestimonialText({ text, isVisible, animKey }: { text: string; isVisible: boolean; animKey: number }) {
  const words = text.split(' ');

  return (
    <h3
      key={animKey}
      className="testimonial-quote text-[1.55rem] sm:text-[2.1rem] md:text-[2.65rem] lg:text-[3.1rem] text-[#1f2a1d] leading-[1.28] font-normal text-balance"
      style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <span
        className={`testimonial-quote-mark inline-block mr-[0.25em] mb-[0.1em] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-15 translate-y-4 blur-md'}`}
      >
        "
      </span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={`inline-block mr-[0.25em] mb-[0.1em] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-10 translate-y-5 blur-md'}`}
          style={{ transitionDelay: isVisible ? `${(i + 1) * 26}ms` : '0ms' }}
        >
          {word}
        </span>
      ))}
    </h3>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRevealOnView<HTMLDivElement>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const changeTestimonial = (direction: 'next' | 'prev') => {
    if (fadeState === 'out') return;
    setFadeState('out');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (direction === 'next') return (prev + 1) % testimonials.length;
        return prev === 0 ? testimonials.length - 1 : prev - 1;
      });
      setFadeState('in');
    }, 420);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const current = testimonials[currentIndex];
  const colors = avatarColors[currentIndex % avatarColors.length];

  return (
    <section id="testimonials" className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div ref={sectionRef} className="reveal max-w-[1400px] mx-auto">
        <div className="testimonials-panel premium-glass-panel w-full rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-20">
            <div className="text-[#4b5b47] text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold flex">
              <AnimatedText text="Testimonials" motionProfile="label" />
            </div>
            <div className="h-[1px] flex-1 bg-[#1f2a1d]/10 ml-0 sm:ml-8" />
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#4b5b47]/70">
              {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </p>
          </div>

          <div className="relative min-h-[390px] sm:min-h-[330px] md:min-h-[290px] lg:min-h-[250px] flex items-center">
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <TestimonialText text={current.text} isVisible={fadeState === 'in'} animKey={currentIndex} />
            </div>
          </div>

          <div className="mt-12 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-8 border-t border-[#1f2a1d]/10">
            <div className={`flex items-center gap-4 transition-all duration-500 ${fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <div
                className="testimonial-avatar relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
              >
                <span className="relative z-10 text-white font-serif italic text-xl sm:text-2xl drop-shadow-sm">
                  {current.name.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#1f2a1d] font-semibold text-sm sm:text-base">{current.name}</span>
                <span className="text-[#4b5b47] text-xs sm:text-sm">{current.role}</span>
              </div>
            </div>

            <div className="testimonial-controls flex items-center gap-3 self-end sm:self-auto">
              <button onClick={() => changeTestimonial('prev')} data-cursor="hover" aria-label="Previous testimonial">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              </button>
              <button onClick={() => changeTestimonial('next')} data-cursor="hover" aria-label="Next testimonial">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
