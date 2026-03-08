import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { BiomeId, getWorldState } from '@/lib/gameData';
import PlayerHUD from '@/components/game/PlayerHUD';
import WorldMap from '@/components/game/WorldMap';
import BiomeExplore from '@/components/game/BiomeExplore';
import CompendiumView from '@/components/game/CompendiumView';
import CraftingStation from '@/components/game/CraftingStation';
import { BookOpen, Map, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GameView = 'map' | 'biome' | 'compendium';

const GameScreen = () => {
  const { state, resetGame, enterBiome, leaveBiome } = useGame();
  const [view, setView] = useState<GameView>('map');
  const [activeBiome, setActiveBiome] = useState<BiomeId | null>(null);

  const handleSelectBiome = (biomeId: BiomeId) => {
    setActiveBiome(biomeId);
    enterBiome(biomeId);
    setView('biome');
  };

  const handleExitBiome = () => {
    leaveBiome();
    setActiveBiome(null);
    setView('map');
  };

  const worldState = getWorldState(state.estraGlow);

  return (
    <div className="min-h-screen bg-gradient-mystical">
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-estra"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.15 + state.estraGlow * 0.2,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-primary text-glow-amber">
              The Menopause Quest
            </h1>
            <p className="text-xs text-muted-foreground">
              A Narrative RPG where Knowledge is Power
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setView('map'); handleExitBiome(); }}
            >
              <Map className="h-4 w-4 mr-1" /> Map
            </Button>
            <Button
              variant={view === 'compendium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('compendium')}
            >
              <BookOpen className="h-4 w-4 mr-1" /> Compendium
            </Button>
            <Button variant="ghost" size="sm" onClick={resetGame} title="Reset Game">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* HUD */}
        <PlayerHUD />

        {/* Main content */}
        <AnimatePresence mode="wait">
          {view === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorldMap onSelectBiome={handleSelectBiome} />
            </motion.div>
          )}
          {view === 'biome' && activeBiome && (
            <motion.div key="biome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BiomeExplore biomeId={activeBiome} onExit={handleExitBiome} />
            </motion.div>
          )}
          {view === 'compendium' && (
            <motion.div key="compendium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CompendiumView onClose={() => setView('map')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Index = () => (
  <GameProvider>
    <GameScreen />
  </GameProvider>
);

export default Index;
