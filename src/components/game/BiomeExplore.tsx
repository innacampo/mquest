import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { BiomeId, biomes, monsters, questions, npcs, getShrineDiscoveryMultiplier, getXpMultiplier } from '@/lib/gameData';
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
  const xpMult = getXpMultiplier(state.character);
  const shrineMult = getShrineDiscoveryMultiplier(state.character);
  const [currentView, setCurrentView] = useState<'explore' | 'battle' | 'npc' | 'shrine'>('explore');
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);
  const [shrineVisited, setShrineVisited] = useState(false);
  const [npcTalkedTo, setNpcTalkedTo] = useState(false);

  const biome = biomes.find(b => b.id === biomeId)!;
  const biomeMonsters = monsters.filter(m => m.biome === biomeId);
  const biomeNpc = npcs.find(n => n.biome === biomeId);
  const allMonstersDefeated = biomeMonsters.every(m => state.monstersDefeated.includes(m.id));

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
      setShrineVisited(true);
      addXp(Math.round(50 * xpMult));
      const factEntry = state.compendium.find(e => e.type === 'fact' && e.biome === biomeId && !e.unlocked);
      if (factEntry) unlockCompendiumEntry(factEntry.id);
    }
    setCurrentView('shrine');
  };

  const handleTalkToNpc = () => {
    if (!npcTalkedTo && biomeNpc) {
      setNpcTalkedTo(true);
      const herbCount = state.character?.background === 'caregiver' ? 3 : 2;
      addInventory('wellnessHerbs', herbCount);
      meetNpc(biomeNpc.name);
    }
    setCurrentView('npc');
  };

  const handleClearBiome = () => {
    clearBiome(biomeId);
    addXp(Math.round(500 * xpMult));
    onExit();
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
            <Sparkles className="h-5 w-5" /> Knowledge Shrine
          </h3>
          <div className="rounded-lg bg-glow-teal/5 border border-glow-teal/10 p-4 space-y-3">
            {biomeId === 'fever-peaks' && (
              <>
                <p className="text-sm text-foreground/80">The hypothalamus is the body's thermostat. Located deep in the brain, it regulates temperature, hunger, and hormonal signals.</p>
                <p className="text-sm text-foreground/80">When estrogen levels decline during perimenopause, the hypothalamus becomes confused. It misreads the body's temperature, triggering hot flashes — a sudden, intense wave of heat.</p>
                <p className="text-sm text-foreground/80">Hot flashes are not "just stress." They are a physiological event with a biological cause.</p>
              </>
            )}
            {biomeId === 'fog-marshes' && (
              <>
                <p className="text-sm text-foreground/80">Estrogen plays a crucial role in brain function, particularly in areas related to memory and concentration.</p>
                <p className="text-sm text-foreground/80">During perimenopause, fluctuating estrogen levels can affect neurotransmitters like acetylcholine, leading to what many women describe as "brain fog."</p>
                <p className="text-sm text-foreground/80">These cognitive changes are typically temporary and improve as the brain adapts to new hormone levels.</p>
              </>
            )}
            {biomeId === 'mood-tides' && (
              <>
                <p className="text-sm text-foreground/80">Estrogen and progesterone directly influence serotonin and norepinephrine — two key neurotransmitters that regulate mood, sleep, and emotional resilience.</p>
                <p className="text-sm text-foreground/80">During perimenopause, rapid hormonal fluctuations can trigger anxiety, irritability, and depressive episodes that feel sudden and unexplainable.</p>
                <p className="text-sm text-foreground/80">These mood changes are neurological responses, not character flaws. Therapy, lifestyle adjustments, and sometimes medication can make a significant difference.</p>
              </>
            )}
            {biomeId === 'crystal-caverns' && (
              <>
                <p className="text-sm text-foreground/80">Estrogen plays a vital role in bone remodelling — the process where old bone is broken down and replaced with new tissue. When estrogen declines, bone breakdown outpaces rebuilding.</p>
                <p className="text-sm text-foreground/80">In the first 5–7 years after menopause, women can lose up to 20% of their bone density, significantly increasing the risk of osteoporosis and fractures.</p>
                <p className="text-sm text-foreground/80">Weight-bearing exercise, adequate calcium and Vitamin D, and regular bone density screenings are powerful tools for prevention.</p>
              </>
            )}
            {biomeId === 'heartland' && (
              <>
                <p className="text-sm text-foreground/80">Before menopause, estrogen helps keep blood vessels flexible and supports healthy cholesterol levels. After menopause, that protection fades.</p>
                <p className="text-sm text-foreground/80">Heart disease is the leading cause of death in postmenopausal women — yet many women don't know their risk increases at this stage of life.</p>
                <p className="text-sm text-foreground/80">Regular cardiovascular check-ups, maintaining a heart-healthy diet, staying physically active, and managing blood pressure are essential steps every woman should take.</p>
              </>
            )}
            {biomeId === 'bloom-garden' && (
              <>
                <p className="text-sm text-foreground/80">The endocrine system is a network of glands — including the ovaries, thyroid, and adrenal glands — that produce hormones governing nearly every function in the body.</p>
                <p className="text-sm text-foreground/80">During menopause, the ovaries gradually stop producing estrogen and progesterone. However, the adrenal glands and fat tissue continue to produce small amounts, and the body learns to find a new equilibrium.</p>
                <p className="text-sm text-foreground/80">Understanding your hormonal landscape empowers you to work with healthcare providers on personalised treatment plans — from HRT to lifestyle strategies — that honour your body's unique journey.</p>
              </>
            )}
          </div>
          {shrineVisited && <p className="text-xs text-glow-teal">✨ +50 XP • Compendium entry unlocked</p>}
          <Button variant="outline" onClick={() => setCurrentView('explore')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Return
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
              <p className="text-xs text-muted-foreground">Biome resident</p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-sm text-foreground/80 italic">
              "{allMonstersDefeated ? biomeNpc.postRemedy : biomeNpc.preRemedy}"
            </p>
          </div>
          {npcTalkedTo && <p className="text-xs text-glow-green">🌿 +2 Wellness Herbs</p>}
          <Button variant="outline" onClick={() => setCurrentView('explore')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Return
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
              alt={biome.name}
              className="w-full h-40 md:h-52 object-cover"
              style={{ filter: 'brightness(0.7) saturate(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{biome.emoji}</span>
                <div>
                  <h2 className="font-display text-xl text-foreground drop-shadow-lg">{biome.name}</h2>
                  <p className="text-xs text-muted-foreground drop-shadow">{biome.bodySystem}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onExit} className="bg-background/60 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Leave
              </Button>
            </div>
          </div>

          {/* Actions grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Knowledge Shrine */}
            <button
              onClick={handleVisitShrine}
              className="text-left rounded-lg border-2 border-glow-teal/30 hover:border-glow-teal bg-glow-teal/5 p-4 transition-all"
            >
              <Sparkles className="h-5 w-5 text-glow-teal mb-2" />
              <h3 className="font-display text-sm">Knowledge Shrine</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {shrineVisited ? '✓ Visited' : 'Learn about ' + biome.bodySystem.toLowerCase()}
              </p>
            </button>

            {/* NPC with portrait */}
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
                  {npcTalkedTo ? '✓ Spoken to' : 'Talk to this character'}
                </p>
              </button>
            )}

            {/* Clear biome button */}
            {allMonstersDefeated && (
              <button
                onClick={handleClearBiome}
                className="text-left rounded-lg border-2 border-glow-green/30 hover:border-glow-green bg-glow-green/5 p-4 transition-all"
              >
                <span className="text-xl mb-2 block">🌟</span>
                <h3 className="font-display text-sm text-glow-green">Clear Biome</h3>
                <p className="text-xs text-muted-foreground mt-1">All monsters defeated! +500 XP</p>
              </button>
            )}
          </div>

          {/* Monsters with sprite art */}
          <div className="space-y-3">
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider">Myth Monsters</h3>
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
                            alt={m.name}
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
                        <h4 className="font-display text-sm">{m.name}</h4>
                        <p className="text-xs text-muted-foreground italic truncate">"{m.myth}"</p>
                        {defeated && <p className="text-xs text-glow-green mt-1">✓ Defeated</p>}
                      </div>
                    </div>
                    {!defeated && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                        <Swords className="h-3 w-3" />
                        <span>Challenge</span>
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
