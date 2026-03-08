import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { getWorldState } from '@/lib/gameData';

const EstraCompanion = () => {
  const { state } = useGame();
  const worldState = getWorldState(state.estraGlow);
  const glowIntensity = 0.3 + state.estraGlow * 0.7;

  return (
    <motion.div
      className="relative flex items-center gap-3"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Estra sprite */}
      <div className="relative">
        <motion.div
          className="w-10 h-10 rounded-full bg-estra"
          style={{ opacity: glowIntensity }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 w-10 h-10 rounded-full bg-estra blur-md"
          style={{ opacity: glowIntensity * 0.5 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="text-xs">
        <p className="font-display text-estra">Estra</p>
        <p className="text-muted-foreground">{worldState}</p>
      </div>
    </motion.div>
  );
};

export default EstraCompanion;
