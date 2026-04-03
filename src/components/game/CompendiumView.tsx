import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { biomes, monsters } from '@/lib/gameData';
import { biomeTranslations, compendiumTranslations } from '@/lib/gameDataTranslations';
import { monsterSprites, npcPortraits } from '@/lib/battleAssets';
import { BookOpen, Star, X, Skull, Users, Trophy, Search, Gift, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompendiumViewProps {
  onClose: () => void;
}

type Tab = 'facts' | 'myths' | 'bestiary' | 'bios' | 'milestones';

const CompendiumView: React.FC<CompendiumViewProps> = ({ onClose }) => {
  const { state, claimMilestone } = useGame();
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('bestiary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBiome, setSelectedBiome] = useState<string | null>(null);

  const unlockedCount = state.compendium.filter(e => e.unlocked).length;
  const totalCount = state.compendium.length;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  const getEntryTitle = (entry: any) => {
    if (lang === 'es' && compendiumTranslations[entry.id]) return compendiumTranslations[entry.id].title;
    return entry.title;
  };
  const getEntryContent = (entry: any) => {
    if (lang === 'es' && compendiumTranslations[entry.id]) return compendiumTranslations[entry.id].content;
    return entry.content;
  };
  const getBiomeName = (biomeId: string) => {
    if (lang === 'es' && biomeTranslations[biomeId]) return biomeTranslations[biomeId].name;
    return biomes.find(b => b.id === biomeId)?.name || biomeId;
  };

  const filteredEntries = useMemo(() => {
    const typeMap: Record<Tab, string> = {
      facts: 'fact', myths: 'myth', bestiary: 'bestiary', bios: 'bio', milestones: '',
    };
    return state.compendium
      .filter(e => e.type === typeMap[activeTab])
      .filter(e => !selectedBiome || e.biome === selectedBiome)
      .filter(e => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const title = getEntryTitle(e);
        const content = e.unlocked ? getEntryContent(e) : '';
        return title.toLowerCase().includes(q) || content.toLowerCase().includes(q);
      });
  }, [state.compendium, activeTab, selectedBiome, searchQuery, lang]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'bestiary', label: t('comp.bestiary'), icon: <Skull className="h-3.5 w-3.5" />, count: state.compendium.filter(e => e.type === 'bestiary').length },
    { id: 'facts', label: t('comp.facts'), icon: <Star className="h-3.5 w-3.5" />, count: state.compendium.filter(e => e.type === 'fact').length },
    { id: 'myths', label: t('comp.myths'), icon: <BookOpen className="h-3.5 w-3.5" />, count: state.compendium.filter(e => e.type === 'myth').length },
    { id: 'bios', label: t('comp.npcs'), icon: <Users className="h-3.5 w-3.5" />, count: state.compendium.filter(e => e.type === 'bio').length },
    { id: 'milestones', label: t('comp.milestones'), icon: <Trophy className="h-3.5 w-3.5" />, count: state.compendiumMilestones?.length || 0 },
  ];

  const getMonsterForEntry = (monsterId?: string) => monsterId ? monsters.find(m => m.id === monsterId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-secondary" />
          <h2 className="font-display text-2xl text-foreground">{t('comp.title')}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-mono">{unlockedCount}/{totalCount}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-3 rounded-full bg-muted overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--primary)))' }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-mono text-foreground/70">{percent}% {t('comp.complete')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const tabUnlocked = tab.id === 'milestones'
            ? (state.compendiumMilestones?.filter(m => m.claimed).length || 0)
            : state.compendium.filter(e => e.type === (tab.id === 'facts' ? 'fact' : tab.id === 'myths' ? 'myth' : tab.id === 'bestiary' ? 'bestiary' : 'bio') && e.unlocked).length;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedBiome(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="font-mono text-[10px] opacity-70">{tabUnlocked}/{tab.count}</span>
            </button>
          );
        })}
      </div>

      {activeTab !== 'milestones' && (
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('comp.search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary/50"
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedBiome(null)}
              className={`px-2 py-1 rounded text-[10px] ${!selectedBiome ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}
            >{t('comp.all')}</button>
            {biomes.filter(b => b.id !== 'bloom-garden').map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBiome(b.id)}
                className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${selectedBiome === b.id ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}
                title={getBiomeName(b.id)}
              >
                {b.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'milestones' ? (
          <motion.div key="milestones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-2">
            {(state.compendiumMilestones || []).map((ms, i) => {
              const canClaim = unlockedCount >= ms.requiredCount && !ms.claimed;
              const progressPct = Math.min(100, (unlockedCount / ms.requiredCount) * 100);
              return (
                <motion.div
                  key={ms.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-xl border p-4 space-y-2 ${
                    ms.claimed ? 'border-primary/30 bg-primary/5' : canClaim ? 'border-secondary/40 bg-secondary/5' : 'border-border bg-card/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ms.claimed ? <Check className="h-4 w-4 text-primary" /> : <Trophy className="h-4 w-4 text-muted-foreground" />}
                      <h4 className="font-display text-sm text-foreground">{ms.title}</h4>
                    </div>
                    {canClaim && (
                      <Button size="sm" onClick={() => claimMilestone(ms.id)}
                        className="bg-primary text-primary-foreground font-display gap-1 text-xs h-7">
                        <Gift className="h-3 w-3" /> {t('comp.claim')}
                      </Button>
                    )}
                    {ms.claimed && <span className="text-[10px] text-primary font-display">{t('comp.claimed')}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{ms.description}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{Math.min(unlockedCount, ms.requiredCount)}/{ms.requiredCount} {t('comp.entries')}</span>
                    <span className="text-primary/70">
                      {t('comp.reward')}: {ms.reward.type === 'xp' ? `${ms.reward.amount} XP` : `${ms.reward.amount}× ${ms.reward.item.replace(/([A-Z])/g, ' $1').trim()}`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredEntries.map((entry, i) => {
              const monster = getMonsterForEntry(entry.monsterId);
              const spriteUrl = entry.monsterId ? monsterSprites[entry.monsterId] : null;
              const npcUrl = entry.npcName ? npcPortraits[entry.npcName] : null;
              const imageUrl = spriteUrl || npcUrl;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-xl border p-4 transition-all ${
                    entry.unlocked
                      ? entry.type === 'bestiary' ? 'border-destructive/30 bg-destructive/5'
                      : entry.type === 'myth' ? 'border-primary/30 bg-primary/5'
                      : entry.type === 'bio' ? 'border-accent/30 bg-accent/5'
                      : 'border-secondary/30 bg-secondary/5'
                      : 'border-border bg-muted/20 opacity-60'
                  }`}
                >
                  <div className="flex gap-3">
                    {entry.unlocked && imageUrl ? (
                      <div className="flex-shrink-0">
                        <img src={imageUrl} alt={getEntryTitle(entry)}
                          className={`w-12 h-12 object-contain rounded-lg ${entry.type === 'bestiary' ? 'drop-shadow-[0_0_8px_hsl(0_60%_40%/0.4)]' : ''}`} />
                      </div>
                    ) : !entry.unlocked ? (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Lock className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    ) : null}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm text-foreground truncate">
                        {entry.unlocked ? getEntryTitle(entry) : '???'}
                      </h4>
                      {entry.unlocked && entry.biome && (
                        <span className="text-[10px] text-muted-foreground">
                          {getBiomeName(entry.biome)}
                        </span>
                      )}
                      <p className="text-xs text-foreground/60 mt-1 line-clamp-3">
                        {entry.unlocked ? getEntryContent(entry) : (
                          entry.type === 'bestiary' ? t('comp.defeat_unlock')
                          : entry.type === 'myth' ? t('comp.myth_unlock')
                          : entry.type === 'bio' ? t('comp.bio_unlock')
                          : t('comp.explore_unlock')
                        )}
                      </p>
                      {entry.unlocked && monster && entry.type === 'bestiary' && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-display">
                            {monster.mechanic}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{monster.hp} HP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filteredEntries.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                {t('comp.no_entries')}{searchQuery ? ` ${t('comp.for')} "${searchQuery}"` : ''}.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompendiumView;
