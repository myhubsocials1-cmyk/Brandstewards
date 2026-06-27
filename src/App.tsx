import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import GlassNav from './GlassNav';
import { useGlassShine } from './useGlassShine';
import AnimatedText from './AnimatedText';
import { motion } from 'motion/react';
import Preloader from './Preloader';
import UnifiedWebGLScene from './UnifiedWebGLScene';
import BrandAudio from './BrandAudio';

const AboutSection = lazy(() => import('./AboutSection'));
const ServicesSection = lazy(() => import('./ServicesSection'));
const CoreValuesSection = lazy(() => import('./CoreValuesSection'));
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const FooterSection = lazy(() => import('./FooterSection'));

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';
const ABOUT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_191657_800d4e1f-7ab3-41af-90b6-9bd3039eb294.mp4';
const SERVICES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4';
const FOOTER_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#board', label: 'Board' },
  { href: '#academy', label: 'Nigerian Brand Academy' },
  { href: '#contact', label: 'Contact' },
];

const THEMES = {
  hero: { colors: ['#7eb622', '#f39200', '#172314', '#ffffff'], opacity: 0.18 },
  about: { colors: ['#7eb622', '#f2c456', '#253520', '#ffffff'], opacity: 0.16 },
  services: { colors: ['#f39200', '#7eb622', '#080b08', '#ffffff'], opacity: 0.28 },
  'core-values': { colors: ['#f39200', '#7eb622', '#162213', '#ffffff'], opacity: 0.24 },
  testimonials: { colors: ['#7eb622', '#f39200', '#eef4e7', '#1f2a1d'], opacity: 0.14 },
  contact: { colors: ['#7eb622', '#f39200', '#10180e', '#ffffff'], opacity: 0.32 },
};

const SECTION_VIDEOS: Record<keyof typeof THEMES, string> = {
  hero: BG_VIDEO,
  about: ABOUT_VIDEO,
  services: SERVICES_VIDEO,
  'core-values': BG_VIDEO,
  testimonials: ABOUT_VIDEO,
  contact: FOOTER_VIDEO,
};

const SECTION_CHROME: Record<keyof typeof THEMES, { tint: string; tintSoft: string; accent: string; theme: string }> = {
  hero: { tint: '126, 182, 34', tintSoft: '243, 146, 0', accent: '#7eb622', theme: '#10170f' },
  about: { tint: '126, 182, 34', tintSoft: '242, 196, 86', accent: '#7eb622', theme: '#172314' },
  services: { tint: '243, 146, 0', tintSoft: '126, 182, 34', accent: '#f39200', theme: '#080b08' },
  'core-values': { tint: '243, 146, 0', tintSoft: '126, 182, 34', accent: '#f39200', theme: '#162213' },
  testimonials: { tint: '126, 182, 34', tintSoft: '243, 146, 0', accent: '#7eb622', theme: '#eef4e7' },
  contact: { tint: '126, 182, 34', tintSoft: '243, 146, 0', accent: '#7eb622', theme: '#10180e' },
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState<keyof typeof THEMES>('hero');
  const mainRef = useRef<HTMLElement>(null);
  const sectionChangeTimeoutRef = useRef<number | null>(null);
  useGlassShine();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const scrollRoot = mainRef.current;
    if (!scrollRoot) return;
    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const sections = ['hero', 'about', 'services', 'core-values', 'testimonials', 'contact'] as const;
        let current: keyof typeof THEMES = 'hero';
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.52) current = sec;
          }
        }
        setActiveSection(current);
      });
    };

    scrollRoot.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    return () => {
      scrollRoot.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const chrome = SECTION_CHROME[activeSection];
    const setThemeVar = (name: string, value: string) => {
      root.style.setProperty(name, value);
      document.body.style.setProperty(name, value);
    };

    root.dataset.activeSection = activeSection;
    setThemeVar('--section-tint', chrome.tint);
    setThemeVar('--section-tint-soft', chrome.tintSoft);
    setThemeVar('--section-accent', chrome.accent);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', chrome.theme);

    root.classList.add('is-section-changing');
    if (sectionChangeTimeoutRef.current) window.clearTimeout(sectionChangeTimeoutRef.current);
    sectionChangeTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove('is-section-changing');
    }, 920);

    return () => {
      if (sectionChangeTimeoutRef.current) window.clearTimeout(sectionChangeTimeoutRef.current);
    };
  }, [activeSection]);

  return (
    <main ref={mainRef} className="relative h-screen overflow-y-auto scroll-smooth bg-[#10170f]">
      <Preloader onComplete={() => setSiteReady(true)} onSoundChange={setAudioEnabled} />
      <BrandAudio activeSection={activeSection} enabled={audioEnabled} />
      <UnifiedWebGLScene
        activeSection={activeSection}
        themes={THEMES}
        videoUrl={SECTION_VIDEOS[activeSection]}
      />
      
      <section id="hero" className="relative w-full min-h-[100svh] overflow-hidden flex flex-col pt-32 pb-16 px-4 sm:px-6 md:px-10 justify-center">
      <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6">
        <a href="#" className="flex items-center">
          <img src="/logo.png" alt="Brand Stewards" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
        </a>

        <GlassNav navLinks={navLinks} />

        <div className="flex items-center text-[#2d3a2a]">
          <button
            data-cursor="hover"
            onClick={() => setMenuOpen((v) => !v)}
            className="mobile-nav-sigil lg:hidden relative flex items-center justify-center w-11 h-11 rounded-full text-[#1f2a1d]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`nav-sigil-blade nav-sigil-blade-a ${menuOpen ? 'is-open' : ''}`} />
            <span className={`nav-sigil-blade nav-sigil-blade-b ${menuOpen ? 'is-open' : ''}`} />
            <span className={`nav-sigil-core ${menuOpen ? 'is-open' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu-backdrop lg:hidden fixed inset-0 z-20 transition-opacity duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`mobile-menu-panel lg:hidden fixed top-0 right-0 bottom-0 z-20 w-[88%] max-w-sm transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="relative z-10 flex flex-col h-full pt-24 px-8 pb-8">
          <div className="mb-10 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/52">Menu</span>
            <span className="h-px flex-1 ml-5 bg-gradient-to-r from-[#7eb622]/70 via-white/30 to-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                data-cursor="hover"
                className={`mobile-menu-link text-2xl font-semibold text-white py-4 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                style={{ transitionDelay: menuOpen ? `${150 + i * 70}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div
            className={`mt-8 flex flex-col gap-4 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
            style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}
          >
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full mb-8 sm:mb-12">
        <div className="premium-glass-panel w-full rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20 flex flex-col items-center text-center">
          <div
            className="font-normal leading-[0.95] text-[#1e351d] text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-5xl flex flex-wrap justify-center text-balance"
            style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif', letterSpacing: '-0.035em' }}
          >
            <AnimatedText text="We build brands " play={siteReady} motionProfile="hero" />
            <AnimatedText text="people trust." className="text-[#f39200]" delay={0.4} play={siteReady} motionProfile="heroAccent" />
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-6 sm:mt-8 text-[#1f2a1d]/90 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl px-2 drop-shadow-sm"
          >
            Brand, reputation, and digital marketing strategy for the individuals, organisations, and cities building something worth protecting.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 sm:mt-10 flex items-center justify-center gap-4"
          >
            <button 
              data-cursor="hover" 
              className="liquid-button relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-500 text-[#172314] hover:text-[#172314] bg-white/45 tracking-[-0.01em]"
            >
              <span>Learn More</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>

    <Suspense fallback={<div className="section-lazy-placeholder" aria-hidden="true" />}>
      <div><AboutSection /></div>
      <div><ServicesSection /></div>
      <div><CoreValuesSection /></div>
      <div><TestimonialsSection /></div>
      <div><FooterSection /></div>
    </Suspense>
    </main>
  );
}

export default App;
