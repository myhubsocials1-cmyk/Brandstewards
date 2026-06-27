import { ArrowUpRight, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Send } from 'lucide-react';
import { useRevealOnView } from './useRevealOnView';
import AnimatedText from './AnimatedText';

export default function FooterSection() {
  const contactRef = useRevealOnView<HTMLDivElement>();
  const footerRef = useRevealOnView<HTMLDivElement>();

  return (
    <footer id="contact" className="relative w-full flex flex-col justify-between overflow-hidden bg-[#1f2a1d]/88">
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 py-24 sm:py-32">
        <div ref={contactRef} className="reveal max-w-[1400px] w-full mx-auto">
          <div className="w-full bg-[#1f2a1d]/40 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] p-12 sm:p-20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10 flex flex-col items-center">
            <p className="text-[#7eb622] text-sm uppercase tracking-[0.2em] font-semibold mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#7eb622]" />
              Contact
              <span className="w-8 h-[1px] bg-[#7eb622]" />
            </p>
            <div
              className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] font-medium tracking-tight mb-8 flex flex-wrap justify-center"
              style={{ fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              <AnimatedText text="Want to do " motionProfile="headline" />
              <br className="hidden sm:block" />
              <AnimatedText text="business with us?" className="text-[#f2c456] italic" delay={0.3} motionProfile="headline" />
            </div>
            <p className="text-white/80 text-lg sm:text-xl font-light mb-10 max-w-lg">
              Please, follow this link to fill our engagement form and let's start building your reputation.
            </p>

            <button
              data-cursor="hover"
              className="liquid-button relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 text-white hover:text-[#7eb622]"
            >
              <span>Book a Consultation</span>
              <div className="footer-motion-icon footer-cta-icon w-8 h-8 rounded-full bg-white text-[#1f2a1d] flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 md:pb-10">
        <div
          ref={footerRef}
          className="reveal w-full bg-[#F4F1E8] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 text-[#1f2a1d] shadow-2xl relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(31,42,29,0.58) 1px, transparent 0)',
              backgroundSize: '18px 18px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-4">
              <h3 className="text-2xl font-bold tracking-tight flex">
                <AnimatedText text="Brand Stewards" motionProfile="hero" />
              </h3>
              <p className="text-[#4b5b47] text-sm leading-relaxed max-w-sm">
                BrandStewards Limited is a Digital Marketing, Brand, and Reputation Management consultancy operating from Nigeria and the United Kingdom.
              </p>
              <button
                data-cursor="hover"
                className="liquid-button relative inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 text-white w-max mt-2 bg-[#1f2a1d] !bg-[#1f2a1d]"
              >
                <span>About Us</span>
              </button>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-3">
              <h4 className="font-semibold text-lg tracking-tight">Newsletter</h4>
              <p className="text-[#4b5b47] text-sm leading-relaxed">
                Subscribe to our newsletter to get our latest updates & news.
              </p>
              <form className="relative flex items-center w-full mt-1" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your mail address"
                  className="w-full bg-white border border-[#1f2a1d]/10 rounded-full py-3 pl-5 pr-12 text-sm text-[#1f2a1d] outline-none focus:border-[#7eb622] transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  data-cursor="hover"
                  className="footer-motion-icon footer-submit-icon absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-[#1f2a1d] rounded-full flex items-center justify-center text-white hover:bg-[#7eb622] transition-colors"
                >
                  <Send className="w-3.5 h-3.5 -ml-0.5" />
                </button>
              </form>
              <div className="flex items-center gap-5 mt-4">
                <a href="#" data-cursor="hover" className="footer-motion-icon footer-social-icon text-[#1f2a1d] hover:text-[#f39200] transition-colors"><Facebook className="w-4 h-4" /></a>
                <a href="#" data-cursor="hover" className="footer-motion-icon footer-social-icon text-[#1f2a1d] hover:text-[#f39200] transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="#" data-cursor="hover" className="footer-motion-icon footer-social-icon text-[#1f2a1d] hover:text-[#f39200] transition-colors"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-3 lg:pl-4">
              <h4 className="footer-gradient-heading font-semibold text-lg tracking-tight">Corporate Headquarters</h4>
              <ul className="flex flex-col gap-4 text-[#4b5b47] text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="footer-motion-icon footer-contact-icon w-4 h-4 text-[#7eb622] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">4, Alhaji Shomade Alley, Obanikoro, Lagos, Nigeria, West Africa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="footer-motion-icon footer-contact-icon w-4 h-4 text-[#7eb622] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">+234 803 301 8881<br />+234 803 711 6483</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="footer-motion-icon footer-contact-icon w-4 h-4 text-[#7eb622] shrink-0 mt-0.5" />
                  <a href="mailto:talk2us@yourbrandsteward.com" className="hover:text-[#1f2a1d] transition-colors break-all leading-relaxed">
                    talk2us@yourbrandsteward.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-2">
              <h4 className="footer-gradient-heading font-semibold text-lg tracking-tight">European Regional Office</h4>
              <ul className="flex flex-col gap-4 text-[#4b5b47] text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="footer-motion-icon footer-contact-icon w-4 h-4 text-[#7eb622] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">The Brand Niche, 70, Four Acres, Enfield, London, EN3 5DS, United Kingdom.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="footer-motion-icon footer-contact-icon w-4 h-4 text-[#7eb622] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">+44 7448 946 396</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative z-10 mt-16 pt-8 border-t border-[#1f2a1d]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#4b5b47]">
            <div className="footer-copyright-group">
              <p>&copy; {new Date().getFullYear()} BrandStewards Limited. All rights reserved.</p>
              <a
                href="https://wa.link/3909iw"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="footer-credit-link"
                aria-label="Designed by Tiktalkhub Agency"
              >
                <span>Designed by&nbsp;</span>
                <strong>Tiktalkhub Agency</strong>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#1f2a1d] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1f2a1d] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
