import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { npcs, getWorldState } from '@/lib/gameData';
import { npcPortraits } from '@/lib/battleAssets';
import CraftingStation from './CraftingStation';
import CompendiumView from './CompendiumView';
import { FlaskConical, BookOpen, Flower2, Scroll, Home, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

import hearthBg from '@/assets/hearth-village-bg.jpg';

type HubZone = 'main' | 'study' | 'crafting' | 'garden' | 'archive';

interface HearthVillageProps {
  onGoToMap: () => void;
}

const HearthVillage: React.FC<HearthVillageProps> = ({ onGoToMap }) => {
  const { state, addXp, meetNpc } = useGame();
  const [zone, setZone] = useState<HubZone>('main');

  // Auto-meet Dr. Mira on first village visit
  React.useEffect(() => {
    if (!state.npcsMet?.includes('Dr. Mira')) {
      meetNpc('Dr. Mira');
    }
  }, []);
  const worldState = getWorldState(state.estraGlow);

  const drMira = npcs.find(n => n.name === 'Dr. Mira')!;
  const biomesCleared = state.biomesCleared.length;
  const gardenUnlocked = state.estraGlow >= 0.5;
  const npcReflections = npcs.filter(n => state.biomesCleared.includes(n.biome as any));

  const hubZones = [
    {
      id: 'study' as HubZone,
      name: "Dr. Mira's Study",
      emoji: '📚',
      icon: <Scroll className="h-5 w-5" />,
      description: 'Deep-dive medical content and evidence-based knowledge.',
      color: 'border-glow-teal/40 hover:border-glow-teal bg-glow-teal/5',
      glow: '180, 60%, 50%',
      unlocked: true,
    },
    {
      id: 'crafting' as HubZone,
      name: 'Crafting Station',
      emoji: '⚗️',
      icon: <FlaskConical className="h-5 w-5" />,
      description: 'Combine resources into potions, elixirs, and seals.',
      color: 'border-primary/40 hover:border-primary bg-primary/5',
      glow: '35, 90%, 55%',
      unlocked: true,
    },
    {
      id: 'garden' as HubZone,
      name: 'Memory Garden',
      emoji: '🌺',
      icon: <Flower2 className="h-5 w-5" />,
      description: gardenUnlocked ? 'NPC reflections on their healing journeys.' : 'Unlocks at World State: Healing (50% restoration).',
      color: gardenUnlocked ? 'border-glow-green/40 hover:border-glow-green bg-glow-green/5' : 'border-border bg-muted/20 opacity-50',
      glow: '145, 55%, 45%',
      unlocked: gardenUnlocked,
    },
    {
      id: 'archive' as HubZone,
      name: 'The Archive',
      emoji: '📖',
      icon: <BookOpen className="h-5 w-5" />,
      description: "Lyra's personal Compendium. Review all entries.",
      color: 'border-glow-violet/40 hover:border-glow-violet bg-glow-violet/5',
      glow: '270, 50%, 55%',
      unlocked: true,
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {zone === 'crafting' ? (
        <motion.div key="crafting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <CraftingStation onClose={() => setZone('main')} />
        </motion.div>
      ) : zone === 'archive' ? (
        <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <CompendiumView onClose={() => setZone('main')} />
        </motion.div>
      ) : zone === 'study' ? (
        <motion.div key="study" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              📚 Dr. Mira's Study
            </h2>
            <Button variant="outline" size="sm" onClick={() => setZone('main')}>
              <Home className="h-4 w-4 mr-1" /> Back to Village
            </Button>
          </div>

          {/* Dr. Mira NPC with portrait */}
          <div className="rounded-xl bg-card/60 border border-glow-teal/20 p-5 space-y-4">
            <div className="flex items-center gap-4">
              {npcPortraits['Dr. Mira'] ? (
                <img
                  src={npcPortraits['Dr. Mira']}
                  alt="Dr. Mira"
                  className="w-16 h-16 rounded-full object-cover border-2 border-glow-teal/40"
                  style={{ boxShadow: '0 0 15px hsla(180 60% 50% / 0.2)' }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-glow-teal/20 flex items-center justify-center text-2xl">👩‍⚕️</div>
              )}
              <div>
                <h3 className="font-display text-lg">Dr. Mira</h3>
                <p className="text-xs text-muted-foreground">Village Healer • Evidence-Based Medicine</p>
              </div>
            </div>
            <div className="rounded-lg bg-glow-teal/5 border border-glow-teal/10 p-4">
              <p className="text-sm text-foreground/80 italic">
                "{biomesCleared > 2 ? drMira.postRemedy : drMira.preRemedy}"
              </p>
            </div>
          </div>

          {/* Deep-dive content cards */}
          <div className="space-y-3">
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider">Medical Deep-Dives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Hormone Replacement Therapy (HRT)', content: 'Modern HRT is personalized. Types include systemic estrogen, low-dose vaginal estrogen, and combination therapy. Benefits for most healthy women under 60 include relief from vasomotor symptoms, bone protection, and cardiovascular benefits when started early.', unlocked: biomesCleared >= 1 },
                { title: 'The Estrogen-Brain Connection', content: 'Estrogen receptors exist throughout the brain, particularly in the hippocampus and prefrontal cortex. During perimenopause, fluctuating levels affect memory consolidation, attention, and verbal fluency. These changes are typically temporary.', unlocked: biomesCleared >= 2 },
                { title: 'Cardiovascular Risk After Menopause', content: 'Premenopausal estrogen provides cardioprotection through HDL maintenance, arterial flexibility, and anti-inflammatory effects. After menopause, LDL rises, arteries stiffen, and metabolic syndrome risk increases.', unlocked: biomesCleared >= 3 },
                { title: 'Building a Menopause Care Team', content: 'Optimal care may include: a GP or gynecologist trained in menopause medicine, a mental health professional, a dietitian, a physiotherapist for pelvic floor health, and peer support groups. You deserve a team.', unlocked: biomesCleared >= 4 },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-4 transition-all ${
                    card.unlocked ? 'border-glow-teal/20 bg-glow-teal/5' : 'border-border bg-muted/20 opacity-40'
                  }`}
                >
                  <h4 className="font-display text-sm">{card.unlocked ? card.title : '🔒 Locked'}</h4>
                  <p className="text-xs text-foreground/60 mt-1">
                    {card.unlocked ? card.content : `Clear ${i + 1} biome${i > 0 ? 's' : ''} to unlock.`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : zone === 'garden' ? (
        <motion.div key="garden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              🌺 Memory Garden
            </h2>
            <Button variant="outline" size="sm" onClick={() => setZone('main')}>
              <Home className="h-4 w-4 mr-1" /> Back to Village
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            A peaceful space where those you've helped share their reflections. The garden grows with each biome you restore.
          </p>

          {npcReflections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Flower2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">The garden is quiet. Clear biomes to see NPC reflections here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {npcReflections.map((npc, i) => (
                <motion.div
                  key={npc.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-xl bg-glow-green/5 border border-glow-green/20 p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    {npcPortraits[npc.name] ? (
                      <img
                        src={npcPortraits[npc.name]}
                        alt={npc.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-glow-green/30"
                      />
                    ) : (
                      <Heart className="h-4 w-4 text-glow-rose" />
                    )}
                    <h3 className="font-display text-sm">{npc.name}{npc.age ? `, ${npc.age}` : ''}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground italic">Before: "{npc.preRemedy}"</p>
                    </div>
                    <div className="rounded-lg bg-glow-green/10 p-3">
                      <p className="text-xs text-glow-green italic">After: "{npc.postRemedy}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        /* MAIN HUB VIEW */
        <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
          {/* Hub header with background */}
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img
              src={hearthBg}
              alt="Hearth Village"
              className="w-full h-48 md:h-56 object-cover"
              style={{
                filter: `saturate(${0.4 + state.estraGlow * 0.6}) brightness(${0.55 + state.estraGlow * 0.25})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-2xl text-foreground text-glow-amber flex items-center gap-2">
                    🏘️ Hearth Village
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your home between adventures • World State: <span className="text-estra font-medium">{worldState}</span>
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onGoToMap}>
                  <Sparkles className="h-4 w-4 mr-1" /> To the Realm
                </Button>
              </div>
            </div>
          </div>

          {/* Notice Board */}
          {biomesCleared > 0 && (
            <div className="rounded-lg bg-card/40 border border-border p-4">
              <h3 className="font-display text-sm text-primary flex items-center gap-2 mb-2">
                📋 Notice Board
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                  {biomesCleared}/5 biomes cleared
                </span>
                <span className="bg-glow-teal/10 text-glow-teal px-2 py-1 rounded-md">
                  {state.compendium.filter(e => e.unlocked).length}/{state.compendium.length} compendium entries
                </span>
                <span className="bg-glow-rose/10 text-glow-rose px-2 py-1 rounded-md">
                  Estra Bond: {state.estraBond}/5
                </span>
                {state.monstersDefeated.length > 0 && (
                  <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md">
                    {state.monstersDefeated.length} myths defeated
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Hub zones grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hubZones.map((hz, i) => (
              <motion.button
                key={hz.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                onClick={() => hz.unlocked && setZone(hz.id)}
                disabled={!hz.unlocked}
                className={`group text-left rounded-xl border-2 p-5 transition-all duration-300 ${hz.color}`}
                style={{
                  boxShadow: hz.unlocked ? `0 0 15px hsl(${hz.glow} / 0.1)` : 'none',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{hz.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-display text-base text-foreground group-hover:text-primary transition-colors">
                      {hz.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{hz.description}</p>
                    {hz.unlocked && (
                      <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Enter →</p>
                    )}
                    {!hz.unlocked && (
                      <p className="text-xs text-muted-foreground mt-2">🔒 Locked</p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Letters from Mum */}
          {biomesCleared > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl bg-card/40 border border-primary/20 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <h3 className="font-display text-sm text-primary">Letters from Mum</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {biomesCleared} letter{biomesCleared > 1 ? 's' : ''} arrived at the mailbox.
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {state.biomesCleared.slice(0, 5).map((_, i) => (
                  <div key={i} className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                    <p className="text-xs text-foreground/70 italic">
                      {i === 0 && '"I haven\'t been sleeping well lately. I feel a bit all over the place. It\'s probably just stress..." — Mum'}
                      {i === 1 && '"I keep forgetting words in the middle of sentences! Your dad laughs but honestly it frightens me a little..." — Mum'}
                      {i === 2 && '"I had a bad week. I apologised to everyone around me like it was my fault. Maybe it is..." — Mum'}
                      {i === 3 && '"I went to the GP. I used the word \'perimenopause\' out loud. I think you helped me find the words." — Mum'}
                      {i === 4 && '"I wish someone had told me all this when I was your age." — Mum'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HearthVillage;
