import { motion, useInView, type Variants } from 'motion/react';
import { useRef } from 'react';

export default function AnimatedText({
  text,
  className = '',
  style = {},
  delay = 0,
  gradient = false,
  play = true,
  motionProfile = 'headline',
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  gradient?: boolean;
  play?: boolean;
  motionProfile?: 'hero' | 'heroAccent' | 'headline' | 'label' | 'quote';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const words = text.trim().split(/\s+/);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: motionProfile === 'hero' || motionProfile === 'heroAccent' ? 0.13 : motionProfile === 'label' ? 0.055 : 0.105,
        delayChildren: delay * i,
      },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: motionProfile === 'hero' || motionProfile === 'heroAccent' ? 18 : 20,
        stiffness: motionProfile === 'label' ? 120 : 86,
        mass: motionProfile === 'hero' || motionProfile === 'heroAccent' ? 1.08 : 0.92,
      },
    },
    hidden: {
      opacity: 0,
      y: motionProfile === 'label' ? 10 : motionProfile === 'hero' ? 44 : motionProfile === 'heroAccent' ? 20 : 34,
      x: motionProfile === 'heroAccent' ? -28 : 0,
      rotateX: motionProfile === 'label' ? 0 : motionProfile === 'hero' ? 42 : motionProfile === 'heroAccent' ? 12 : 32,
      rotateY: motionProfile === 'label' ? 0 : motionProfile === 'heroAccent' ? -22 : -9,
      scale: motionProfile === 'hero' || motionProfile === 'heroAccent' ? 0.94 : 0.98,
      filter: motionProfile === 'label' ? 'blur(5px)' : 'blur(16px)',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: motionProfile === 'label' ? 120 : 84,
        mass: motionProfile === 'hero' || motionProfile === 'heroAccent' ? 1.12 : 0.95,
      },
    },
  };

  const accentStyle = gradient
    ? {
        background: 'linear-gradient(90deg, #3f6e1b 0%, #c08b1b 45%, #f2c456 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 10px 30px rgba(63, 110, 27, 0.18)',
      }
    : {};

  return (
    <motion.div
      ref={ref}
      style={{ display: 'flex', flexWrap: 'wrap', ...style }}
      className={className}
      variants={container}
      initial="hidden"
      animate={play && isInView ? 'visible' : 'hidden'}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          data-cursor="hover"
          className={`kinetic-word kinetic-${motionProfile}`}
          variants={child}
          whileHover={{
            y: motionProfile === 'label' ? -1 : -5,
            rotateX: motionProfile === 'label' ? 0 : 5,
            filter: 'blur(0px)',
            transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{
            marginRight: '0.25em',
            paddingBottom: '0.1em',
            display: 'inline-block',
            transformStyle: 'preserve-3d',
            '--word-index': index,
          } as React.CSSProperties & Record<'--word-index', number>}
        >
          <span className="kinetic-word-inner" style={accentStyle}>
            {word}
          </span>
        </motion.span>
      ))}
    </motion.div>
  );
}
