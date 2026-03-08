import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---- FLOATING DAMAGE NUMBER ----
interface DamageNumberProps {
  value: number;
  type: 'dealt' | 'taken' | 'heal';
  id: string;
}

export const DamageNumber: React.FC<DamageNumberProps> = ({ value, type, id }) => {
  const color = type === 'dealt' ? 'text-primary' : type === 'taken' ? 'text-destructive' : 'text-glow-green';
  const prefix = type === 'dealt' ? '-' : type === 'taken' ? '-' : '+';

  return (
    <motion.div
      key={id}
      className={`absolute font-display text-3xl font-bold ${color} pointer-events-none z-50`}
      style={{ left: '50%', top: '30%' }}
      initial={{ opacity: 1, y: 0, x: '-50%', scale: 0.5 }}
      animate={{ opacity: 0, y: -80, scale: 1.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {prefix}{value}
    </motion.div>
  );
};

// ---- SCREEN FLASH ----
interface ScreenFlashProps {
  color: 'red' | 'gold' | 'green' | 'white';
  trigger: number; // increment to trigger
}

export const ScreenFlash: React.FC<ScreenFlashProps> = ({ color, trigger }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  const bgMap = {
    red: 'bg-destructive/30',
    gold: 'bg-primary/25',
    green: 'bg-glow-green/25',
    white: 'bg-foreground/20',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`absolute inset-0 ${bgMap[color]} pointer-events-none z-40`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
};

// ---- IMPACT BURST (radial particles) ----
interface ImpactBurstProps {
  trigger: number;
  color: string; // tailwind color class like 'bg-primary' or 'bg-destructive'
  x?: string;
  y?: string;
}

export const ImpactBurst: React.FC<ImpactBurstProps> = ({ trigger, color, x = '50%', y = '40%' }) => {
  const [particles, setParticles] = useState<{ id: number; angle: number; dist: number; size: number }[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i / 12) * 360 + Math.random() * 30,
        dist: 40 + Math.random() * 60,
        size: 3 + Math.random() * 5,
      }));
      setParticles(newParticles);
      const t = setTimeout(() => setParticles([]), 800);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30" style={{ overflow: 'hidden' }}>
      <AnimatePresence>
        {particles.map(p => {
          const rad = (p.angle * Math.PI) / 180;
          const dx = Math.cos(rad) * p.dist;
          const dy = Math.sin(rad) * p.dist;
          return (
            <motion.div
              key={p.id}
              className={`absolute rounded-full ${color}`}
              style={{ left: x, top: y, width: p.size, height: p.size }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x: dx, y: dy, scale: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// ---- ENERGY AURA ----
interface EnergyAuraProps {
  intensity: number; // 0-1
  color: 'amber' | 'red' | 'teal' | 'violet';
}

const auraColors = {
  amber: { ring: 'border-primary/40', glow: 'shadow-[0_0_30px_hsl(35_90%_55%/0.3)]' },
  red: { ring: 'border-destructive/40', glow: 'shadow-[0_0_30px_hsl(0_70%_50%/0.3)]' },
  teal: { ring: 'border-secondary/40', glow: 'shadow-[0_0_30px_hsl(180_60%_50%/0.3)]' },
  violet: { ring: 'border-accent/40', glow: 'shadow-[0_0_30px_hsl(280_40%_50%/0.3)]' },
};

export const EnergyAura: React.FC<EnergyAuraProps> = ({ intensity, color }) => {
  const c = auraColors[color];
  if (intensity <= 0) return null;
  return (
    <motion.div
      className={`absolute inset-0 rounded-full border-2 ${c.ring} ${c.glow} pointer-events-none`}
      animate={{
        scale: [1, 1.05 + intensity * 0.1, 1],
        opacity: [0.3 + intensity * 0.4, 0.6 + intensity * 0.3, 0.3 + intensity * 0.4],
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
};

// ---- SLASH EFFECT ----
interface SlashEffectProps {
  trigger: number;
  variant: 'player' | 'monster';
}

export const SlashEffect: React.FC<SlashEffectProps> = ({ trigger, variant }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  if (!show) return null;

  const isPlayer = variant === 'player';

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.svg
        width="200" height="200" viewBox="0 0 200 200"
        className={isPlayer ? 'text-primary' : 'text-destructive'}
        initial={{ scale: 0.3, rotate: isPlayer ? -45 : 45, opacity: 0 }}
        animate={{ scale: 1.2, rotate: isPlayer ? 0 : 0, opacity: [0, 1, 0] }}
        transition={{ duration: 0.4 }}
      >
        {isPlayer ? (
          <>
            <line x1="30" y1="170" x2="170" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="150" x2="150" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="70" y1="170" x2="170" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          </>
        ) : (
          <>
            <line x1="40" y1="100" x2="160" y2="100" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <line x1="60" y1="80" x2="140" y2="120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          </>
        )}
      </motion.svg>
    </motion.div>
  );
};

// ---- VICTORY FIREWORKS ----
export const VictoryFireworks: React.FC = () => {
  const colors = ['bg-primary', 'bg-glow-green', 'bg-glow-teal', 'bg-accent', 'bg-glow-rose'];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60 + 10,
    color: colors[i % colors.length],
    delay: Math.random() * 1.5,
    size: 3 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.color}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            y: [50, -20, -40, -60],
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
};

// ---- KNOCKOUT SHATTER ----
export const KnockoutShatter: React.FC = () => {
  const shards = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 45 + Math.random() * 10,
    y: 30 + Math.random() * 10,
    dx: (Math.random() - 0.5) * 200,
    dy: (Math.random() - 0.5) * 200,
    rotation: Math.random() * 360,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {shards.map(s => (
        <motion.div
          key={s.id}
          className="absolute bg-destructive/80"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: s.dx, y: s.dy, rotate: s.rotation }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

// ---- COMBO SPARKS (around combo bar) ----
export const ComboSparks: React.FC<{ rating: 'perfect' | 'good' | 'light' | 'miss' | null }> = ({ rating }) => {
  if (!rating || rating === 'miss') return null;

  const count = rating === 'perfect' ? 16 : rating === 'good' ? 10 : 5;
  const color = rating === 'perfect' ? 'bg-primary' : rating === 'good' ? 'bg-glow-green' : 'bg-secondary';

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${color}`}
          style={{
            left: '50%',
            top: '50%',
            width: 3 + Math.random() * 3,
            height: 3 + Math.random() * 3,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 150,
            y: (Math.random() - 0.5) * 150,
            scale: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: Math.random() * 0.1 }}
        />
      ))}
    </div>
  );
};
