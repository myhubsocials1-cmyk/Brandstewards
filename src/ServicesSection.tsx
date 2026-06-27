import { Compass, ShieldCheck, GraduationCap, Megaphone } from 'lucide-react';
import { useRevealOnView } from './useRevealOnView';
import MagneticIcon from './MagneticIcon';
import AnimatedText from './AnimatedText';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4';

const services = [
  { icon: Compass, label: 'Brand Management' },
  { icon: ShieldCheck, label: 'Public Relations & Reputation Management' },
  { icon: GraduationCap, label: 'Employee Training & Professional Development' },
  { icon: Megaphone, label: 'Digital Marketing' },
];

export default function ServicesSection() {
  const headRef = useRevealOnView<HTMLDivElement>();
  const leftRef = useRevealOnView<HTMLDivElement>();
  const videoRef = useRevealOnView<HTMLDivElement>();
  const rightRef = useRevealOnView<HTMLDivElement>();

  return (
    <section id="services" className="relative w-full bg-[#070907]/82 py-20 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div ref={headRef} className="reveal text-center mb-12 sm:mb-20 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/55 mb-4">Our Services</p>
          <div
            className="text-white text-3xl sm:text-4xl md:text-5xl font-normal flex flex-wrap justify-center text-balance"
            style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            <AnimatedText text="Unity is strength." motionProfile="headline" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-[1400px] mx-auto">
          <div ref={leftRef} className="reveal service-glass-card service-card-orange relative h-[380px] sm:h-[460px] overflow-hidden p-6 sm:p-8">
            <div className="relative z-10 flex flex-col h-full">
              <p className="text-xs uppercase tracking-[0.25em] text-white/42 mb-6">Philosophy</p>
              <h3 className="text-white text-xl sm:text-2xl font-light leading-tight">
                When there is teamwork<br />and collaboration,
              </h3>
              <p className="mt-auto text-[13px] sm:text-[14px] leading-relaxed text-white/72 font-light max-w-[280px]">
                wonderful things can be achieved - for the brands we steward, and the people behind them.
              </p>
            </div>
          </div>

          <div ref={videoRef} className="reveal relative h-[380px] sm:h-[460px] rounded-2xl bg-neutral-950/85 overflow-hidden group border border-white/10">
            <video
              src={VIDEO_URL}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-75 transition duration-700 group-hover:scale-[1.035] group-hover:opacity-100"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
          </div>

          <div ref={rightRef} className="reveal service-glass-card service-card-green relative h-[380px] sm:h-[460px] overflow-hidden p-6 sm:p-8">
            <div className="relative z-10 flex flex-col h-full">
              <p className="text-xs uppercase tracking-[0.25em] text-white/42 mb-6">What We Do</p>
              <ul className="flex flex-col gap-1">
                {services.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    data-cursor="hover"
                    className="group flex items-center gap-3 py-3 border-b border-white/10 last:border-b-0 transition-colors hover:border-white/30"
                  >
                    <MagneticIcon>
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-white/70 group-hover:text-[#7eb622] group-hover:bg-white/10 transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                    </MagneticIcon>
                    <span className="text-[13px] sm:text-sm text-white/82 group-hover:text-white transition-colors leading-snug">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
