import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { biomes, BiomeId } from '@/lib/gameData';
import { Lock, CheckCircle } from 'lucide-react';

import worldMapBg from '@/assets/world-map-bg.jpg';
import biomeFeverPeaks from '@/assets/biome-fever-peaks.png';
import biomeFogMarshes from '@/assets/biome-fog-marshes.png';
import biomeMoodTides from '@/assets/biome-mood-tides.png';
import biomeCrystalCaverns from '@/assets/biome-crystal-caverns.png';
import biomeHeartland from '@/assets/biome-heartland.png';
import biomeBloomGarden from '@/assets/biome-bloom-garden.png';

interface WorldMapProps {
  onSelectBiome: (biomeId: BiomeId) => void;
}

const biomeImages: Record<BiomeId, string> = {
  'fever-peaks': biomeFeverPeaks,
  'fog-marshes': biomeFogMarshes,
  'mood-tides': biomeMoodTides,
  'crystal-caverns': biomeCrystalCaverns,
  'heartland': biomeHeartland,
  'bloom-garden': biomeBloomGarden,
};

// Positions as percentages on the map (x, y)
const biomePositions: Record<BiomeId, { x: number; y: number }> = {
  'fever-peaks':     { x: 15, y: 18 },
  'fog-marshes':     { x: 42, y: 55 },
  'mood-tides':      { x: 12, y: 72 },
  'crystal-caverns': { x: 72, y: 15 },
  'heartland':       { x: 50, y: 30 },
  'bloom-garden':    { x: 75, y: 65 },
};

const biomeGlowColors: Record<BiomeId, string> = {
  'fever-peaks': '35, 90%, 55%',
  'fog-marshes': '180, 60%, 50%',
  'mood-tides': '270, 50%, 55%',
  'crystal-caverns': '190, 70%, 55%',
  'heartland': '340, 60%, 55%',
  'bloom-garden': '145, 55%, 45%',
};

// Path connections between biomes (sequential)
const pathConnections: [BiomeId, BiomeId][] = [
  ['fever-peaks', 'fog-marshes'],
  ['fog-marshes', 'mood-tides'],
  ['fever-peaks', 'heartland'],
  ['heartland', 'crystal-caverns'],
  ['mood-tides', 'bloom-garden'],
  ['crystal-caverns', 'bloom-garden'],
  ['fog-marshes', 'heartland'],
];

const WorldMap: React.FC<WorldMapProps> = ({ onSelectBiome }) => {
  const { state } = useGame();

  const isBiomeUnlocked = (biomeId: BiomeId) => {
    const order: BiomeId[] = ['fever-peaks', 'fog-marshes', 'mood-tides', 'crystal-caverns', 'heartland', 'bloom-garden'];
    const idx = order.indexOf(biomeId);
    if (idx === 0) return true;
    return state.biomesCleared.includes(order[idx - 1]);
  };

  const isCleared = (biomeId: BiomeId) => state.biomesCleared.includes(biomeId);

  const isPathLit = (from: BiomeId, to: BiomeId) => {
    return isCleared(from) || isCleared(to) || (isBiomeUnlocked(from) && isBiomeUnlocked(to));
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl text-primary text-glow-amber">The Inner Realm</h2>
        <p className="text-sm text-muted-foreground">
          Explore the mystical world within — each region maps to a biological system
        </p>
        <div className="mx-auto max-w-xs space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>World Restoration</span>
            <span>{Math.round(state.estraGlow * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-estra"
              initial={{ width: 0 }}
              animate={{ width: `${state.estraGlow * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full rounded-xl overflow-hidden border-2 border-border" style={{ aspectRatio: '16/9' }}>
        {/* Background */}
        <img
          src={worldMapBg}
          alt="The Inner Realm Map"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: `saturate(${0.3 + state.estraGlow * 0.7}) brightness(${0.5 + state.estraGlow * 0.3})`,
            transition: 'filter 1s ease',
          }}
        />

        {/* Dark overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/40" />

        {/* SVG Path connections */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            {/* Glow filter */}
            <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="pathGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Animated gradient for energy flow */}
            <linearGradient id="energyFlow" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(45, 100%, 70%)" stopOpacity="0.1" />
              <stop offset="40%" stopColor="hsl(45, 100%, 80%)" stopOpacity="0.9" />
              <stop offset="50%" stopColor="hsl(40, 100%, 90%)" stopOpacity="1" />
              <stop offset="60%" stopColor="hsl(45, 100%, 80%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(45, 100%, 70%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {pathConnections.map(([from, to], i) => {
            const fromPos = biomePositions[from];
            const toPos = biomePositions[to];
            const lit = isPathLit(from, to);
            const bothCleared = isCleared(from) && isCleared(to);

            // Calculate control point for a curved path
            const x1 = fromPos.x + 4;
            const y1 = fromPos.y + 4;
            const x2 = toPos.x + 4;
            const y2 = toPos.y + 4;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            // Slight curve offset
            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = mx + dy * 0.15;
            const cy = my - dx * 0.15;

            const pathD = `M ${x1}% ${y1}% Q ${cx}% ${cy}% ${x2}% ${y2}%`;
            const pathId = `path-${i}`;

            return (
              <g key={i}>
                {/* Base dim path (always visible) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={lit ? 'hsl(45, 60%, 40%)' : 'hsl(230, 15%, 20%)'}
                  strokeWidth={lit ? 1.5 : 0.8}
                  strokeDasharray={lit ? 'none' : '4 6'}
                  opacity={lit ? 0.3 : 0.2}
                />

                {lit && (
                  <>
                    {/* Outer glow layer */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="hsl(45, 100%, 65%)"
                      strokeWidth={6}
                      opacity={bothCleared ? 0.15 : 0.08}
                      filter="url(#pathGlow)"
                    >
                      <animate
                        attributeName="opacity"
                        values={bothCleared ? '0.1;0.2;0.1' : '0.05;0.12;0.05'}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Main glowing path */}
                    <path
                      id={pathId}
                      d={pathD}
                      fill="none"
                      stroke="hsl(45, 100%, 70%)"
                      strokeWidth={bothCleared ? 2.5 : 1.8}
                      opacity={bothCleared ? 0.7 : 0.45}
                      filter="url(#pathGlowStrong)"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="opacity"
                        values={bothCleared ? '0.5;0.8;0.5' : '0.3;0.55;0.3'}
                        dur={`${2.5 + i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Flowing energy particle 1 */}
                    <circle r={bothCleared ? 3 : 2} fill="hsl(45, 100%, 85%)" opacity="0.9" filter="url(#pathGlow)">
                      <animateMotion
                        dur={`${3 + i * 0.5}s`}
                        repeatCount="indefinite"
                        path={pathD.replace(/%/g, '')}
                      >
                        {/* SVG animateMotion uses unitless coords, so we approximate with viewBox-relative */}
                      </animateMotion>
                    </circle>

                    {/* Flowing energy particle 2 (offset) */}
                    <circle r={bothCleared ? 2 : 1.5} fill="hsl(40, 100%, 90%)" opacity="0.7">
                      <animateMotion
                        dur={`${3 + i * 0.5}s`}
                        repeatCount="indefinite"
                        path={pathD.replace(/%/g, '')}
                        begin={`${1.5 + i * 0.25}s`}
                      />
                    </circle>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Biome Nodes */}
        {biomes.map((biome, i) => {
          const unlocked = isBiomeUnlocked(biome.id);
          const cleared = isCleared(biome.id);
          const pos = biomePositions[biome.id];
          const glowColor = biomeGlowColors[biome.id];

          return (
            <motion.button
              key={biome.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: 'spring', damping: 12 }}
              onClick={() => unlocked && !cleared && onSelectBiome(biome.id)}
              disabled={!unlocked || cleared}
              className="absolute group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                zIndex: 2,
              }}
              title={`${biome.name} — ${biome.bodySystem}`}
            >
              {/* Glow ring */}
              {(unlocked && !cleared) && (
                <motion.div
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background: `radial-gradient(circle, hsl(${glowColor} / 0.4), transparent 70%)`,
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Biome image node */}
              <div
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  cleared
                    ? 'border-glow-green/70'
                    : unlocked
                    ? 'border-primary/60 group-hover:border-primary cursor-pointer group-hover:scale-110'
                    : 'border-muted-foreground/30 grayscale opacity-50'
                }`}
                style={{
                  boxShadow: unlocked
                    ? `0 0 20px hsl(${glowColor} / ${cleared ? 0.3 : 0.5})`
                    : 'none',
                }}
              >
                <img
                  src={biomeImages[biome.id]}
                  alt={biome.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay for locked/cleared */}
                {!unlocked && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                {cleared && (
                  <div className="absolute inset-0 bg-glow-green/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-glow-green drop-shadow-lg" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className={`absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-all ${
                unlocked ? 'opacity-100' : 'opacity-40'
              }`}>
                <p className="font-display text-[10px] md:text-xs text-foreground drop-shadow-lg leading-tight">
                  {biome.name}
                </p>
                {unlocked && !cleared && (
                  <p className="text-[8px] md:text-[10px] text-primary font-medium">Explore →</p>
                )}
              </div>
            </motion.button>
          );
        })}

        {/* Floating particles on the map */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-estra"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              zIndex: 3,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.6 * state.estraGlow, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WorldMap;
