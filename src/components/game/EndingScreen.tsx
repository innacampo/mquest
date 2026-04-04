import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { biomeTranslations } from '@/lib/gameDataTranslations';
import endingBg from '@/assets/ending-screen-bg.jpg';
import { Star, Heart, BookOpen, Shield, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { biomes } from '@/lib/gameData';

interface EndingScreenProps {
  onRestart: () => void;
}

const EndingScreen: React.FC<EndingScreenProps> = ({ onRestart }) => {
  const { state, resetGame } = useGame();
  const { lang, t } = useLanguage();
  const [phase, setPhase] = useState<'fade_in' | 'title' | 'stats' | 'message' | 'credits'>('fade_in');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('title'), 1500),
      setTimeout(() => setPhase('stats'), 5000),
      setTimeout(() => setPhase('message'), 9000),
      setTimeout(() => setPhase('credits'), 13000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const monstersDefeated = state.monstersDefeated.length;
  const compendiumUnlocked = (state.compendium || []).filter(e => e.unlocked).length;
  const compendiumTotal = (state.compendium || []).length;
  const biomesCleared = state.biomesCleared.length;

  const stats = [
    { icon: <Shield className="h-5 w-5" />, label: t('ending.biomes_restored'), value: `${biomesCleared}`, color: 'text-glow-teal' },
    { icon: <Star className="h-5 w-5" />, label: t('ending.level_reached'), value: `${state.level}`, color: 'text-primary' },
    { icon: <Heart className="h-5 w-5" />, label: t('ending.monsters_vanquished'), value: `${monstersDefeated}`, color: 'text-glow-rose' },
    { icon: <BookOpen className="h-5 w-5" />, label: t('ending.compendium'), value: `${compendiumUnlocked}/${compendiumTotal}`, color: 'text-glow-violet' },
    { icon: <Sparkles className="h-5 w-5" />, label: t('ending.estra_bond'), value: `${state.estraBond}/5`, color: 'text-estra' },
  ];

  const getBiomeName = (biome: typeof biomes[0]) => {
    if (lang === 'es' && biomeTranslations[biome.id]) return biomeTranslations[biome.id].name;
    return biome.name;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 3, ease: 'easeOut' }}>
        <img src={endingBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: 2 + Math.random() * 4, height: 2 + Math.random() * 4,
              background: i % 3 === 0 ? 'hsl(var(--primary))' : i % 3 === 1 ? 'hsl(var(--glow-teal))' : 'hsl(var(--estra))',
            }}
            animate={{ y: [0, -40 - Math.random() * 60, 0], opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center">
        <AnimatePresence mode="wait">
          {(phase === 'title' || phase === 'stats' || phase === 'message' || phase === 'credits') && (
            <motion.div key="title-block" className="absolute top-[12%]"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase === 'title' ? 1 : 0.6, y: 0, scale: phase === 'title' ? 1 : 0.85 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}>
              <motion.div className="text-4xl sm:text-6xl md:text-8xl mb-4" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>🌸</motion.div>
              <h1 className="font-display text-2xl sm:text-4xl md:text-6xl text-primary text-glow-amber mb-3">{t('ending.bloom')}</h1>
              <motion.p className="text-lg md:text-xl text-foreground/80 max-w-md mx-auto leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
                {state.character?.name || 'Lyra'}{t('ending.restored')}
              </motion.p>
            </motion.div>
          )}

          {(phase === 'stats' || phase === 'message' || phase === 'credits') && (
            <motion.div key="stats-block" className="absolute top-[42%] w-full max-w-lg px-4"
              initial={{ opacity: 0 }} animate={{ opacity: phase === 'stats' ? 1 : 0.7 }} transition={{ duration: 1 }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stats.map((stat, i) => (
                  <motion.div key={stat.label} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.3, duration: 0.6, ease: 'backOut' }}>
                    <div className={`${stat.color} mb-1 flex justify-center`}>{stat.icon}</div>
                    <p className="font-display text-2xl text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(phase === 'message' || phase === 'credits') && (
            <motion.div key="message-block" className="absolute bottom-[22%] max-w-xl px-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
              <div className="bg-black/50 backdrop-blur-md border border-primary/20 rounded-2xl p-6">
                <p className="text-foreground/90 text-sm md:text-base leading-relaxed italic">{t('ending.quote')}</p>
                <p className="text-primary/80 text-xs mt-3 font-display">{t('ending.quote_author')}</p>
              </div>
            </motion.div>
          )}

          {phase === 'credits' && (
            <motion.div key="credits-block" className="absolute bottom-8 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                {biomes.filter(b => b.id !== 'bloom-garden').map((b, i) => (
                  <motion.span key={b.id}
                    className="text-xs bg-white/10 backdrop-blur-sm text-white/70 px-3 py-1 rounded-full border border-white/10"
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}>
                    {b.emoji} {getBiomeName(b)}
                  </motion.span>
                ))}
              </div>
              <p className="text-white/40 text-xs">{t('ending.thank_you')}</p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => { resetGame(); onRestart(); }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <RotateCcw className="h-4 w-4 mr-1" /> {t('ending.new_journey')}
                </Button>
                <Button size="sm" onClick={onRestart} className="bg-primary/80 hover:bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4 mr-1" /> {t('ending.continue')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EndingScreen;
