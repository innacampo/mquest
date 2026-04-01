import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { titleBackground } from '@/lib/battleAssets';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen = ({ onStart }: TitleScreenProps) => {
  const [exiting, setExiting] = useState(false);
  const { t } = useLanguage();

  const handleStart = () => {
    setExiting(true);
    setTimeout(onStart, 1200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      animate={exiting ? { opacity: 0, scale: 1.1 } : {}}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      {/* Language toggle on title screen */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageToggle />
      </div>

      {/* Background image */}
      <img
        src={titleBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.6) saturate(1.2)' }}
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${35 + Math.random() * 30} ${60 + Math.random() * 30}% ${70 + Math.random() * 25}%)`,
            }}
            animate={{
              opacity: [0.1, 0.6 + Math.random() * 0.4, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Estra — floating orb */}
        <motion.div
          className="relative mb-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-6 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsla(35 90% 60% / 0.25), hsla(280 40% 50% / 0.1), transparent 70%)',
              }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Core orb */}
            <motion.div
              className="w-20 h-20 rounded-full relative"
              style={{
                background: 'radial-gradient(circle at 35% 35%, hsl(45 95% 75%), hsl(35 90% 55%), hsl(25 80% 40%))',
                boxShadow: '0 0 40px 10px hsla(35 90% 55% / 0.4), 0 0 80px 20px hsla(35 90% 55% / 0.15), inset 0 -8px 20px hsla(280 40% 50% / 0.3)',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute w-3 h-3 rounded-full"
                style={{
                  top: '20%',
                  left: '28%',
                  background: 'radial-gradient(circle, hsla(0 0% 100% / 0.9), transparent 70%)',
                }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>
            {/* Trailing particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3 + Math.random() * 3,
                  height: 3 + Math.random() * 3,
                  background: `hsl(${30 + i * 10} 80% 65%)`,
                  left: `${30 + Math.random() * 40}%`,
                  bottom: -8 - i * 6,
                }}
                animate={{
                  y: [0, 15 + Math.random() * 20],
                  opacity: [0.7, 0],
                  scale: [1, 0.3],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </motion.div>
          <motion.p
            className="text-center mt-6 font-display text-sm tracking-widest"
            style={{ color: 'hsl(35 90% 65%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            {t('title.estra')}
          </motion.p>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h1
            className="font-display text-5xl md:text-7xl tracking-wide leading-tight"
            style={{
              background: 'linear-gradient(135deg, hsl(35 90% 65%), hsl(35 90% 50%), hsl(280 40% 60%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px hsla(35 90% 55% / 0.3))',
            }}
          >
            The M-QUEST
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-sm md:text-base mb-12 text-center max-w-md px-4 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          {t('title.subtitle')}
          <br />
          <span style={{ color: 'hsl(35 70% 60%)' }}>
            {t('title.subtitle2')}
          </span>
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={handleStart}
          className="group relative px-10 py-4 rounded-full font-display text-lg tracking-wider overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
          style={{
            background: 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))',
            color: 'hsl(230 25% 8%)',
            boxShadow: '0 0 30px hsla(35 90% 55% / 0.3), inset 0 1px 0 hsla(0 0% 100% / 0.2)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 50px hsla(35 90% 55% / 0.5)' }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t('title.start')}
          </span>
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(90deg, transparent, hsla(0 0% 100% / 0.2), transparent)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 3, repeatDelay: 2 }}
          />
        </motion.button>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <div className="w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, hsl(35 60% 45%))' }} />
        <Sparkles className="h-3 w-3" style={{ color: 'hsl(35 60% 50%)' }} />
        <div className="w-16 h-px" style={{ background: 'linear-gradient(to left, transparent, hsl(35 60% 45%))' }} />
      </motion.div>
    </motion.div>
  );
};

export default TitleScreen;
