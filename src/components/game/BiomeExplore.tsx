import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { BiomeId, biomes, monsters, questions, npcs, getShrineDiscoveryMultiplier, getXpMultiplier } from '@/lib/gameData';
import TacticalBattle from './tactical/TacticalBattle';
import { ArrowLeft, Swords, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BiomeExploreProps {
  biomeId: BiomeId;
  onExit: () => void;
}

const BiomeExplore: React.FC<BiomeExploreProps> = ({ biomeId, onExit }) => {
  const { state, addXp, clearBiome, unlockCompendiumEntry, addInventory } = useGame();
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
      // Unlock fact card for this biome
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
        <BattleScreen
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
            {biomeId !== 'fever-peaks' && biomeId !== 'fog-marshes' && (
              <p className="text-sm text-foreground/80">Ancient knowledge flows through this shrine, revealing truths about {biome.bodySystem.toLowerCase()}.</p>
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
          <h3 className="font-display text-xl text-foreground">{biomeNpc.name}{biomeNpc.age ? `, ${biomeNpc.age}` : ''}</h3>
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
          {/* Biome header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{biome.emoji}</span>
              <div>
                <h2 className="font-display text-xl text-foreground">{biome.name}</h2>
                <p className="text-xs text-muted-foreground">{biome.bodySystem}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onExit}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Leave Biome
            </Button>
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

            {/* NPC */}
            {biomeNpc && (
              <button
                onClick={handleTalkToNpc}
                className="text-left rounded-lg border-2 border-border hover:border-primary/50 bg-card/30 p-4 transition-all"
              >
                <MessageCircle className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-display text-sm">{biomeNpc.name}{biomeNpc.age ? `, ${biomeNpc.age}` : ''}</h3>
                <p className="text-xs text-muted-foreground mt-1">
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

          {/* Monsters */}
          <div className="space-y-3">
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider">Myth Monsters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {biomeMonsters.map(m => {
                const defeated = state.monstersDefeated.includes(m.id);
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
                      <span className="text-2xl">{m.emoji}</span>
                      <div>
                        <h4 className="font-display text-sm">{m.name}</h4>
                        <p className="text-xs text-muted-foreground italic">"{m.myth}"</p>
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
