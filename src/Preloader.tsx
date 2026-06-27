import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Preloader({
  onComplete,
  onSoundChange,
}: {
  onComplete?: () => void;
  onSoundChange?: (enabled: boolean) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduceMotion(media.matches);
    updateMotion();
    media.addEventListener?.('change', updateMotion);
    return () => media.removeEventListener?.('change', updateMotion);
  }, []);

  useEffect(() => {
    setProgress(0);
    let cancelled = false;
    let current = 0;

    const tick = () => {
      if (cancelled) return;
      const remaining = 100 - current;
      current = Math.min(100, current + Math.max(0.34, remaining * 0.045));
      setProgress(current);
      if (current < 100) {
        window.setTimeout(() => requestAnimationFrame(tick), reduceMotion ? 24 : 42);
      }
    };

    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (progress < 100) return;
    const timer = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      setIsLoaded(true);
    }, reduceMotion ? 120 : 520);
    return () => window.clearTimeout(timer);
  }, [onComplete, progress, reduceMotion]);

  const progressText = `${Math.round(progress).toString().padStart(2, '0')}%`;
  const toggleSound = () => {
    setSoundEnabled((current) => {
      const next = !current;
      onSoundChange?.(next);
      return next;
    });
  };

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -18,
            transition: { duration: reduceMotion ? 0.18 : 1.05, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#11170f] text-[#edf7df]"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(126,182,34,0.14), transparent 36%), linear-gradient(315deg, rgba(243,146,0,0.12), transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08), transparent 58%)',
            }}
            animate={reduceMotion ? undefined : { filter: ['blur(0px)', 'blur(5px)', 'blur(0px)'] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 w-[30vw] min-w-[18rem] bg-white/10 blur-2xl"
            initial={{ x: '-70vw', skewX: -16, opacity: 0 }}
            animate={reduceMotion ? { opacity: 0.2 } : { x: '74vw', skewX: -16, opacity: [0, 0.28, 0] }}
            transition={{ duration: 2.6, ease: [0.76, 0, 0.24, 1], repeat: Infinity, repeatDelay: 0.65 }}
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div
              className="brand-seal-loader relative grid place-items-center w-32 h-32 sm:w-40 sm:h-40 overflow-hidden"
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-white/24 via-transparent to-[#7eb622]/18"
                style={{ transformOrigin: '50% 100%' }}
                animate={reduceMotion ? undefined : { y: ['-110%', '110%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.img
                src="/logo.png"
                alt="Brand Stewards"
                className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-8 text-[11px] sm:text-xs uppercase tracking-[0.36em] text-white/68"
            >
              Brand Stewards
            </motion.p>

            <div className="mt-5 w-[min(26rem,78vw)]">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/46">
                <span>Loading</span>
                <span>{progressText}</span>
              </div>
              <div className="mt-3 h-px w-full overflow-hidden bg-white/14">
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-[#7eb622] via-white to-[#f39200]"
                  style={{ scaleX: progress / 100 }}
                />
              </div>
            </div>
            <div className="mt-10">
              <button
                type="button"
                data-cursor="hover"
                className={`preloader-sound-toggle ${soundEnabled ? 'is-on' : ''}`}
                onClick={toggleSound}
                aria-pressed={soundEnabled}
              >
                <span>{soundEnabled ? 'Sound on' : 'Sound off'}</span>
                <i aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
