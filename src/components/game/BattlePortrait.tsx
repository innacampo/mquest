import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PortraitState = 'idle' | 'attack' | 'hit' | 'heal' | 'charge' | 'defeated' | 'victory';

interface BattlePortraitProps {
  emoji: string;
  name: string;
  state: PortraitState;
  variant: 'monster' | 'player';
  surgeLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Idle breathing animation per variant
const idleAnimation = {
  monster: {
    y: [0, -4, 0],
    rotate: [0, -1, 1, 0],
    scale: [1, 1.02, 1],
  },
  player: {
    y: [0, -3, 0],
    scale: [1, 1.01, 1],
  },
};

const idleTransition = {
  monster: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
  player: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
};

// State-specific animation overrides
const stateAnimations: Record<PortraitState, { animate: object; transition: object }> = {
  idle: { animate: {}, transition: {} }, // handled by variant
  attack: {
    animate: { x: [0, -20, 30, 0], scale: [1, 0.9, 1.2, 1], rotate: [0, -5, 10, 0] },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  hit: {
    animate: { x: [0, 12, -12, 8, -4, 0], opacity: [1, 0.4, 1, 0.5, 1], scale: [1, 0.9, 1.05, 0.95, 1] },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  heal: {
    animate: { scale: [1, 1.15, 1.05, 1], y: [0, -8, -4, 0] },
    transition: { duration: 0.7, ease: 'easeOut' },
  },
  charge: {
    animate: { scale: [1, 1.1, 1, 1.1, 1], rotate: [0, -2, 2, -2, 0] },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
  defeated: {
    animate: { rotate: [0, -15], scale: [1, 0.7], opacity: [1, 0.3], y: [0, 20] },
    transition: { duration: 1, ease: 'easeIn' },
  },
  victory: {
    animate: { y: [0, -15, 0, -10, 0], scale: [1, 1.15, 1, 1.1, 1], rotate: [0, -5, 5, -3, 0] },
    transition: { duration: 1.2, ease: 'easeOut' },
  },
};

const sizeMap = {
  sm: { container: 'w-12 h-12', emoji: 'text-2xl', ring: 'w-14 h-14' },
  md: { container: 'w-20 h-20', emoji: 'text-5xl', ring: 'w-24 h-24' },
  lg: { container: 'w-28 h-28', emoji: 'text-7xl', ring: 'w-32 h-32' },
};

const BattlePortrait: React.FC<BattlePortraitProps> = ({
  emoji,
  name,
  state: portraitState,
  variant,
  surgeLevel = 0,
  size = 'md',
  className = '',
}) => {
  const [currentState, setCurrentState] = useState<PortraitState>(portraitState);
  const [prevState, setPrevState] = useState<PortraitState>('idle');
  const s = sizeMap[size];

  // When state changes, play the animation then return to idle
  useEffect(() => {
    if (portraitState !== 'idle' && portraitState !== 'charge') {
      setPrevState(currentState);
      setCurrentState(portraitState);
      // Return to idle after action states
      if (['attack', 'hit', 'heal'].includes(portraitState)) {
        const t = setTimeout(() => setCurrentState('idle'), 800);
        return () => clearTimeout(t);
      }
    } else {
      setCurrentState(portraitState);
    }
  }, [portraitState]);

  const isIdle = currentState === 'idle';
  const isMonster = variant === 'monster';

  // Ring color based on variant and state
  const ringColor = currentState === 'hit'
    ? 'border-destructive'
    : currentState === 'heal'
    ? 'border-glow-green'
    : currentState === 'attack'
    ? 'border-primary'
    : currentState === 'defeated'
    ? 'border-muted'
    : isMonster
    ? 'border-destructive/40'
    : 'border-secondary/40';

  // Glow intensity based on surge for monsters
  const glowIntensity = isMonster ? Math.min(1, surgeLevel * 0.25) : 0;
  const monsterGlow = glowIntensity > 0
    ? `0 0 ${12 + glowIntensity * 20}px hsl(0 70% 50% / ${0.15 + glowIntensity * 0.25})`
    : 'none';
  const playerGlow = !isMonster && currentState === 'attack'
    ? '0 0 20px hsl(35 90% 55% / 0.4)'
    : !isMonster && currentState === 'heal'
    ? '0 0 20px hsl(145 55% 45% / 0.4)'
    : 'none';

  const anim = isIdle
    ? { animate: idleAnimation[variant], transition: idleTransition[variant] }
    : stateAnimations[currentState];

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Outer ring */}
      <div className={`${s.ring} rounded-full flex items-center justify-center relative`}>
        {/* Pulsing ring for active states */}
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${ringColor}`}
          style={{
            boxShadow: isMonster ? monsterGlow : playerGlow,
          }}
          animate={
            currentState === 'charge'
              ? { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }
              : currentState === 'hit'
              ? { scale: [1, 1.15, 1], borderColor: ['hsl(0 70% 50%)', 'hsl(0 70% 50% / 0.3)', 'hsl(0 70% 50%)'] }
              : {}
          }
          transition={
            currentState === 'charge'
              ? { duration: 0.8, repeat: Infinity }
              : currentState === 'hit'
              ? { duration: 0.4 }
              : {}
          }
        />

        {/* Background plate */}
        <div
          className={`${s.container} rounded-full flex items-center justify-center overflow-hidden`}
          style={{
            background: isMonster
              ? `radial-gradient(circle, hsl(0 30% 15% / 0.8), hsl(230 25% 10% / 0.9))`
              : `radial-gradient(circle, hsl(230 20% 18% / 0.8), hsl(230 25% 10% / 0.9))`,
          }}
        >
          {/* Emoji sprite */}
          <motion.span
            className={`${s.emoji} select-none`}
            animate={anim.animate as any}
            transition={anim.transition as any}
            style={{
              filter: currentState === 'defeated' ? 'grayscale(0.7)' : 'none',
            }}
          >
            {emoji}
          </motion.span>
        </div>

        {/* Hit flash overlay */}
        <AnimatePresence>
          {currentState === 'hit' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-destructive/30"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
          {currentState === 'heal' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-glow-green/20"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
          {currentState === 'attack' && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* Surge particles for monsters */}
        {isMonster && surgeLevel > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: surgeLevel * 2 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-destructive/60"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -15 - Math.random() * 10],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Name plate */}
      {size !== 'sm' && (
        <motion.p
          className={`font-display text-[10px] mt-1 tracking-wide ${
            currentState === 'defeated' ? 'text-muted-foreground line-through' : 'text-foreground/70'
          }`}
          animate={currentState === 'hit' ? { color: 'hsl(0 70% 60%)' } : undefined}
          transition={{ duration: 0.5 }}
        >
          {name}
        </motion.p>
      )}
    </div>
  );
};

// ---- PLAYER PORTRAIT (with background-based appearance) ----
interface PlayerPortraitProps {
  name: string;
  background?: string;
  state: PortraitState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const backgroundEmojis: Record<string, string> = {
  caregiver: '🩺',
  scholar: '📚',
  advocate: '⚖️',
  explorer: '🧭',
};

export const PlayerBattlePortrait: React.FC<PlayerPortraitProps> = ({
  name,
  background = 'explorer',
  state: portraitState,
  size = 'md',
  className = '',
}) => {
  return (
    <BattlePortrait
      emoji={backgroundEmojis[background] || '✨'}
      name={name}
      state={portraitState}
      variant="player"
      size={size}
      className={className}
    />
  );
};

export default BattlePortrait;
