import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { BiomeId } from '@/lib/gameData';
import PlayerHUD from '@/components/game/PlayerHUD';
import WorldMap from '@/components/game/WorldMap';
import BiomeExplore from '@/components/game/BiomeExplore';
import HearthVillage from '@/components/game/HearthVillage';
import AudioControls from '@/components/game/AudioControls';
import TitleScreen from '@/components/game/TitleScreen';
import { useAudio } from '@/hooks/useAudio';
import { Map, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GameView = 'title' | 'map' | 'biome' | 'village';

const GameScreen = () => {
  const { state, resetGame, enterBiome, leaveBiome } = useGame();
  const [view, setView] = useState<GameView>('map');
  const [activeBiome, setActiveBiome] = useState<BiomeId | null>(null);
  const audio = useAudio();

  // Switch ambient audio based on view
  useEffect(() => {
    if (view === 'map') audio.setScene('map');
    else if (view === 'village') audio.setScene('village');
    else if (view === 'biome') audio.setScene('battle');
  }, [view]);

  const handleSelectBiome = (biomeId: BiomeId) => {
    setActiveBiome(biomeId);
    enterBiome(biomeId);
    setView('biome');
    audio.playChime();
  };

  const handleExitBiome = () => {
    leaveBiome();
    setActiveBiome(null);
    setView('village');
    audio.playVictory();
  };

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
            <AudioControls
              muted={audio.muted}
              masterVolume={audio.masterVolume}
              musicVolume={audio.musicVolume}
              sfxVolume={audio.sfxVolume}
              toggleMute={audio.toggleMute}
              setMasterVolume={audio.setMasterVolume}
              setMusicVolume={audio.setMusicVolume}
              setSfxVolume={audio.setSfxVolume}
              playChime={audio.playChime}
            />
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setView('map'); setActiveBiome(null); leaveBiome(); }}
            >
              <Map className="h-4 w-4 mr-1" /> Realm
            </Button>
            <Button
              variant={view === 'village' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setView('village'); setActiveBiome(null); leaveBiome(); }}
            >
              <Home className="h-4 w-4 mr-1" /> Village
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
          {view === 'village' && (
            <motion.div key="village" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HearthVillage onGoToMap={() => setView('map')} />
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
