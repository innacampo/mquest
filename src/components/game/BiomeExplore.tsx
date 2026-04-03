import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { BiomeId, biomes, monsters, questions, npcs, getShrineDiscoveryMultiplier, getXpMultiplier } from '@/lib/gameData';
import { biomeTranslations, monsterTranslations, npcTranslations, shrineTranslations } from '@/lib/gameDataTranslations';
import { battleBackgrounds, monsterSprites, npcPortraits } from '@/lib/battleAssets';
import ATBBattle from './tactical/ATBBattle';
import { ArrowLeft, Swords, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BiomeExploreProps {
  biomeId: BiomeId;
  onExit: () => void;
}

const BiomeExplore: React.FC<BiomeExploreProps> = ({ biomeId, onExit }) => {
  const { state, addXp, clearBiome, unlockCompendiumEntry, addInventory, meetNpc } = useGame();
  const { lang, t } = useLanguage();
  const xpMult = getXpMultiplier(state.character);
  const shrineMult = getShrineDiscoveryMultiplier(state.character);
  const [currentView, setCurrentView] = useState<'explore' | 'battle' | 'npc' | 'shrine'>('explore');
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);
  const [justVisitedShrine, setJustVisitedShrine] = useState(false);
  const [justTalkedNpc, setJustTalkedNpc] = useState(false);

  const biome = biomes.find(b => b.id === biomeId)!;
  const biomeMonsters = monsters.filter(m => m.biome === biomeId);
  const biomeNpc = npcs.find(n => n.biome === biomeId);
  const allMonstersDefeated = biomeMonsters.every(m => state.monstersDefeated.includes(m.id));

  const shrineVisited = justVisitedShrine || state.compendium.some(e => e.type === 'fact' && e.biome === biomeId && e.unlocked);
  const npcTalkedTo = justTalkedNpc || (biomeNpc ? (state.npcsMet || []).includes(biomeNpc.name) : false);

  const getBiomeName = () => lang === 'es' && biomeTranslations[biomeId] ? biomeTranslations[biomeId].name : biome.name;
  const getBiomeSystem = () => lang === 'es' && biomeTranslations[biomeId] ? biomeTranslations[biomeId].bodySystem : biome.bodySystem;
  const getMonsterName = (m: typeof monsters[0]) => lang === 'es' && monsterTranslations[m.id] ? monsterTranslations[m.id].name : m.name;
  const getMonsterMyth = (m: typeof monsters[0]) => lang === 'es' && monsterTranslations[m.id] ? monsterTranslations[m.id].myth : m.myth;
  const getNpcPreRemedy = (npc: typeof npcs[0]) => lang === 'es' && npcTranslations[npc.name] ? npcTranslations[npc.name].preRemedy : npc.preRemedy;
  const getNpcPostRemedy = (npc: typeof npcs[0]) => lang === 'es' && npcTranslations[npc.name] ? npcTranslations[npc.name].postRemedy : npc.postRemedy;

  const handleMonsterSelect = (monsterId: string) => {
    setSelectedMonster(monsterId);
    setCurrentView('battle');
  };

  const handleBattleVictory = () => {
    setCurrentView('explore');
    setSelectedMonster(null);
  };

  const handleVisitShrine = () => {
    if (!shrineVisited) {
      setJustVisitedShrine(true);
      addXp(Math.round(50 * xpMult));
      const isExplorer = state.character?.background === 'explorer';
      addInventory('knowledgeScrolls', isExplorer ? 2 : 1);
      if (isExplorer) {
        addInventory('bloomEssence', 1);
      }
      const factEntry = state.compendium.find(e => e.type === 'fact' && e.biome === biomeId && !e.unlocked);
      if (factEntry) unlockCompendiumEntry(factEntry.id);
    }
    setCurrentView('shrine');
  };

  const handleTalkToNpc = () => {
    if (!npcTalkedTo && biomeNpc) {
      setJustTalkedNpc(true);
      const isAdvocate = state.character?.background === 'advocate';
      const isCaregiver = state.character?.background === 'caregiver';
      const herbCount = isCaregiver ? 3 : 2;
      addInventory('wellnessHerbs', herbCount);
      if (isAdvocate) {
        addXp(Math.round(30 * xpMult));
        addInventory('wellnessHerbs', 1);
      }
      meetNpc(biomeNpc.name);
    }
    setCurrentView('npc');
  };

  const handleClearBiome = () => {
    clearBiome(biomeId);
    addXp(Math.round(500 * xpMult));
    onExit();
  };

  const getShrineContent = (): string[] => {
    if (lang === 'es' && shrineTranslations[biomeId]) return shrineTranslations[biomeId];
    // English defaults
    const content: Record<string, string[]> = {
      'fever-peaks': [
        'The hypothalamus is the body\'s thermostat. Located deep in the brain, it regulates temperature, hunger, and hormonal signals.',
        'When estrogen levels decline during perimenopause, the hypothalamus becomes confused. It misreads the body\'s temperature, triggering hot flashes — a sudden, intense wave of heat.',
        'Hot flashes are not "just stress." They are a physiological event with a biological cause.',
      ],
      'fog-marshes': [
        'Estrogen plays a crucial role in brain function, particularly in areas related to memory and concentration.',
        'During perimenopause, fluctuating estrogen levels can affect neurotransmitters like acetylcholine, leading to what many women describe as "brain fog."',
        'These cognitive changes are typically temporary and improve as the brain adapts to new hormone levels.',
      ],
      'mood-tides': [
        'Estrogen and progesterone directly influence serotonin and norepinephrine — two key neurotransmitters that regulate mood, sleep, and emotional resilience.',
        'During perimenopause, rapid hormonal fluctuations can trigger anxiety, irritability, and depressive episodes that feel sudden and unexplainable.',
        'These mood changes are neurological responses, not character flaws. Therapy, lifestyle adjustments, and sometimes medication can make a significant difference.',
      ],
      'crystal-caverns': [
        'Estrogen plays a vital role in bone remodelling — the process where old bone is broken down and replaced with new tissue. When estrogen declines, bone breakdown outpaces rebuilding.',
        'In the first 5–7 years after menopause, women can lose up to 20% of their bone density, significantly increasing the risk of osteoporosis and fractures.',
        'Weight-bearing exercise, adequate calcium and Vitamin D, and regular bone density screenings are powerful tools for prevention.',
      ],
      'heartland': [
        'Before menopause, estrogen helps keep blood vessels flexible and supports healthy cholesterol levels. After menopause, that protection fades.',
        'Heart disease is the leading cause of death in postmenopausal women — yet many women don\'t know their risk increases at this stage of life.',
        'Regular cardiovascular check-ups, maintaining a heart-healthy diet, staying physically active, and managing blood pressure are essential steps every woman should take.',
      ],
      'bloom-garden': [
        'The endocrine system is a network of glands — including the ovaries, thyroid, and adrenal glands — that produce hormones governing nearly every function in the body.',
        'During menopause, the ovaries gradually stop producing estrogen and progesterone. However, the adrenal glands and fat tissue continue to produce small amounts, and the body learns to find a new equilibrium.',
        'Understanding your hormonal landscape empowers you to work with healthcare providers on personalised treatment plans — from HRT to lifestyle strategies — that honour your body\'s unique journey.',
      ],
    };
    return content[biomeId] || [];
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'battle' && selectedMonster ? (
        <ATBBattle
          key="battle"
          monster={monsters.find(m => m.id === selectedMonster)!}
          onVictory={handleBattleVictory}
          onRetreat={() => { setCurrentView('explore'); setSelectedMonster(null); }}
          onKnockout={() => { setCurrentView('explore'); setSelectedMonster(null); }}
        />
      ) : currentView === 'shrine' ? (
        <motion.div
          key="shrine"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-xl bg-card/60 border border-glow-teal/20 p-6 space-y-4"
        >
          <h3 className="font-display text-xl text-glow-teal flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> {t('biome.shrine')}
          </h3>
          <div className="rounded-lg bg-glow-teal/5 border border-glow-teal/10 p-4 space-y-3">
            {getShrineContent().map((paragraph, i) => (
              <p key={i} className="text-sm text-foreground/80">{paragraph}</p>
            ))}
          </div>
          {shrineVisited && <p className="text-xs text-glow-teal">{t('biome.shrine_reward')}</p>}
          <Button variant="outline" onClick={() => setCurrentView('explore')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {t('biome.return')}
          </Button>
        </motion.div>
      ) : currentView === 'npc' && biomeNpc ? (
        <motion.div
          key="npc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-xl bg-card/60 border border-border p-6 space-y-4"
        >
          <div className="flex items-center gap-4">
            {npcPortraits[biomeNpc.name] && (
              <img
                src={npcPortraits[biomeNpc.name]}
                alt={biomeNpc.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                style={{ boxShadow: '0 0 15px hsla(35 90% 55% / 0.2)' }}
              />
            )}
            <div>
              <h3 className="font-display text-xl text-foreground">{biomeNpc.name}{biomeNpc.age ? `, ${biomeNpc.age}` : ''}</h3>
              <p className="text-xs text-muted-foreground">{t('biome.resident')}</p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-sm text-foreground/80 italic">
              "{allMonstersDefeated ? getNpcPostRemedy(biomeNpc) : getNpcPreRemedy(biomeNpc)}"
            </p>
          </div>
          {npcTalkedTo && <p className="text-xs text-glow-green">{t('biome.npc_reward')}</p>}
          <Button variant="outline" onClick={() => setCurrentView('explore')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {t('biome.return')}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="explore"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-5"
        >
          {/* Biome header with background art */}
          <div className="relative rounded-xl overflow-hidden border-2 border-border">
            <img
              src={battleBackgrounds[biomeId]}
              alt={getBiomeName()}
              className="w-full h-40 md:h-52 object-cover"
              style={{ filter: 'brightness(0.7) saturate(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{biome.emoji}</span>
                <div>
                  <h2 className="font-display text-xl text-foreground drop-shadow-lg">{getBiomeName()}</h2>
                  <p className="text-xs text-muted-foreground drop-shadow">{getBiomeSystem()}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onExit} className="bg-background/60 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> {t('biome.leave')}
              </Button>
            </div>
          </div>

          {/* Actions grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleVisitShrine}
              className="text-left rounded-lg border-2 border-glow-teal/30 hover:border-glow-teal bg-glow-teal/5 p-4 transition-all"
            >
              <Sparkles className="h-5 w-5 text-glow-teal mb-2" />
              <h3 className="font-display text-sm">{t('biome.shrine')}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {shrineVisited ? t('biome.shrine_visited') : t('biome.shrine_learn') + getBiomeSystem().toLowerCase()}
              </p>
            </button>

            {biomeNpc && (
              <button
                onClick={handleTalkToNpc}
                className="text-left rounded-lg border-2 border-border hover:border-primary/50 bg-card/30 p-4 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  {npcPortraits[biomeNpc.name] ? (
                    <img
                      src={npcPortraits[biomeNpc.name]}
                      alt={biomeNpc.name}
                      className="w-10 h-10 rounded-full object-cover border border-primary/30"
                    />
                  ) : (
                    <MessageCircle className="h-5 w-5 text-primary" />
                  )}
                  <h3 className="font-display text-sm">{biomeNpc.name}{biomeNpc.age ? `, ${biomeNpc.age}` : ''}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {npcTalkedTo ? t('biome.npc_spoken') : t('biome.npc_talk')}
                </p>
              </button>
            )}

            {allMonstersDefeated && (
              <button
                onClick={handleClearBiome}
                className="text-left rounded-lg border-2 border-glow-green/30 hover:border-glow-green bg-glow-green/5 p-4 transition-all"
              >
                <span className="text-xl mb-2 block">🌟</span>
                <h3 className="font-display text-sm text-glow-green">{t('biome.clear')}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t('biome.clear_desc')}</p>
              </button>
            )}
          </div>

          {/* Monsters with sprite art */}
          <div className="space-y-3">
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider">{t('biome.monsters')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {biomeMonsters.map(m => {
                const defeated = state.monstersDefeated.includes(m.id);
                const sprite = monsterSprites[m.id];
                return (
                  <motion.button
                    key={m.id}
                    whileHover={!defeated ? { scale: 1.02 } : {}}
                    onClick={() => !defeated && handleMonsterSelect(m.id)}
                    disabled={defeated}
                    className={`text-left rounded-lg border-2 p-4 transition-all ${
                      defeated
                        ? 'border-border opacity-50 cursor-default'
                        : 'border-destructive/30 hover:border-destructive bg-destructive/5 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {sprite ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-destructive/20 flex-shrink-0">
                          <img
                            src={sprite}
                            alt={getMonsterName(m)}
                            className="w-full h-full object-cover"
                            style={{
                              filter: defeated ? 'grayscale(1) brightness(0.5)' : 'none',
                            }}
                          />
                          {defeated && (
                            <div className="absolute inset-0 bg-glow-green/20 flex items-center justify-center">
                              <span className="text-lg">✓</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-2xl">{m.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm">{getMonsterName(m)}</h4>
                        <p className="text-xs text-muted-foreground italic truncate">"{getMonsterMyth(m)}"</p>
                        {defeated && <p className="text-xs text-glow-green mt-1">{t('biome.defeated')}</p>}
                      </div>
                    </div>
                    {!defeated && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                        <Swords className="h-3 w-3" />
                        <span>{t('biome.challenge')}</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BiomeExplore;
