import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { biomes, BiomeId } from '@/lib/gameData';
import { Lock, CheckCircle, ChevronRight } from 'lucide-react';

interface WorldMapProps {
  onSelectBiome: (biomeId: BiomeId) => void;
}

const biomeGradients: Record<BiomeId, string> = {
  'fever-peaks': 'from-orange-600/30 to-red-900/30',
  'fog-marshes': 'from-teal-700/30 to-slate-800/30',
  'mood-tides': 'from-violet-700/30 to-indigo-900/30',
  'crystal-caverns': 'from-cyan-600/30 to-blue-900/30',
  'heartland': 'from-rose-600/30 to-red-900/30',
  'bloom-garden': 'from-emerald-500/30 to-green-900/30',
};

const biomeBorderColors: Record<BiomeId, string> = {
  'fever-peaks': 'border-glow-amber/40 hover:border-glow-amber',
  'fog-marshes': 'border-glow-teal/40 hover:border-glow-teal',
  'mood-tides': 'border-glow-violet/40 hover:border-glow-violet',
  'crystal-caverns': 'border-glow-teal/40 hover:border-glow-teal',
  'heartland': 'border-glow-rose/40 hover:border-glow-rose',
  'bloom-garden': 'border-glow-green/40 hover:border-glow-green',
};

const WorldMap: React.FC<WorldMapProps> = ({ onSelectBiome }) => {
  const { state } = useGame();

  const isBiomeUnlocked = (biomeId: BiomeId) => {
    const order: BiomeId[] = ['fever-peaks', 'fog-marshes', 'mood-tides', 'crystal-caverns', 'heartland', 'bloom-garden'];
    const idx = order.indexOf(biomeId);
    if (idx === 0) return true;
    return state.biomesCleared.includes(order[idx - 1]);
  };

  const isCleared = (biomeId: BiomeId) => state.biomesCleared.includes(biomeId);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl text-primary text-glow-amber">The Inner Realm</h2>
        <p className="text-sm text-muted-foreground">
          Explore the mystical world within. Each region maps to a real biological system.
        </p>
        {/* Estra Glow Bar */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {biomes.map((biome, i) => {
          const unlocked = isBiomeUnlocked(biome.id);
          const cleared = isCleared(biome.id);

          return (
            <motion.button
              key={biome.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => unlocked && !cleared && onSelectBiome(biome.id)}
              disabled={!unlocked || cleared}
              className={`relative group text-left rounded-lg border-2 p-5 transition-all duration-300
                bg-gradient-to-br ${biomeGradients[biome.id]}
                ${biomeBorderColors[biome.id]}
                ${!unlocked ? 'opacity-40 cursor-not-allowed' : cleared ? 'opacity-70 cursor-default' : 'cursor-pointer'}
              `}
            >
              {/* Status badge */}
              <div className="absolute top-3 right-3">
                {cleared ? (
                  <CheckCircle className="h-5 w-5 text-glow-green" />
                ) : !unlocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{biome.emoji}</span>
                  <h3 className="font-display text-lg text-foreground">{biome.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{biome.bodySystem}</p>
                <p className="text-sm text-foreground/70 line-clamp-2">{biome.description}</p>
                
                {cleared && (
                  <p className="text-xs text-glow-green font-medium">✓ Biome Cleared</p>
                )}
                {unlocked && !cleared && (
                  <p className="text-xs text-primary font-medium">Ready to explore →</p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default WorldMap;
