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
import FeedbackButton from '@/components/game/FeedbackButton';
import GameRules from '@/components/game/GameRules';
import LanguageToggle from '@/components/game/LanguageToggle';
import CharacterCreation from '@/components/game/CharacterCreation';
import EndingScreen from '@/components/game/EndingScreen';
import { useAudio } from '@/hooks/useAudio';
import { useLanguage } from '@/contexts/LanguageContext';
import { Map, RotateCcw, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GameView = 'title' | 'character' | 'map' | 'biome' | 'village' | 'ending';

const GameScreen = () => {
  const { state, resetGame, enterBiome, leaveBiome, setCharacter, isLoading } = useGame();
  const { t } = useLanguage();
  const [view, setView] = useState<GameView>('title');
  const [viewInitialized, setViewInitialized] = useState(false);
  const [activeBiome, setActiveBiome] = useState<BiomeId | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audio = useAudio();

  // Set initial view once loading completes
  useEffect(() => {
    if (!isLoading && !viewInitialized) {
      setView(state.character ? 'map' : 'title');
      setViewInitialized(true);
    }
  }, [isLoading, viewInitialized, state.character]);

  // Switch ambient audio based on view
  useEffect(() => {
    if (view === 'title') audio.setScene('none');
    else if (view === 'map') audio.setScene('map');
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
    const exitedBiome = activeBiome;
    setActiveBiome(null);
    const ALL_BIOMES: BiomeId[] = ['fever-peaks', 'fog-marshes', 'mood-tides', 'crystal-caverns', 'heartland', 'bloom-garden'];
    const clearedSet = new Set([...state.biomesCleared, ...(exitedBiome ? [exitedBiome] : [])]);
    const allCleared = ALL_BIOMES.every(b => clearedSet.has(b));
    if (allCleared) {
      setView('ending');
    } else {
      setView('village');
    }
    audio.playVictory();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-mystical flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl">✨</motion.div>
        <p className="font-display text-lg text-primary text-glow-amber">{t('loading')}</p>
      </div>
    );
  }

  if (view === 'title') {
    return <TitleScreen onStart={() => { setView(state.character ? 'map' : 'character'); audio.playChime(); }} />;
  }

  if (view === 'ending') {
    return <EndingScreen onRestart={() => setView('map')} />;
  }

  if (view === 'character') {
    return (
      <CharacterCreation
        onComplete={(background, specialty, name) => {
          setCharacter({ background, specialty, name: name || 'Lyra' });
          setView('map');
          audio.playVictory();
        }}
      />
    );
  }

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

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-3xl text-primary text-glow-amber truncate">
              {t('header.title')}
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {t('header.subtitle')}
            </p>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
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
              <Map className="h-4 w-4 mr-1" /> {t('header.realm')}
            </Button>
            <Button
              variant={view === 'village' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setView('village'); setActiveBiome(null); leaveBiome(); }}
            >
              <Home className="h-4 w-4 mr-1" /> {t('header.village')}
            </Button>
            <GameRules />
            <Button variant="ghost" size="sm" onClick={resetGame} title="Reset Game">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => { setView('map'); setActiveBiome(null); leaveBiome(); }}
            >
              <Map className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'village' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => { setView('village'); setActiveBiome(null); leaveBiome(); }}
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden rounded-lg bg-card/90 backdrop-blur-md border border-border p-3 flex flex-wrap items-center gap-2 overflow-hidden"
            >
              <LanguageToggle />
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
              <GameRules />
              <Button variant="ghost" size="sm" onClick={resetGame} title="Reset Game">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

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
    <FeedbackButton />
  </GameProvider>
);

export default Index;
