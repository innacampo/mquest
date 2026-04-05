import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { GameState } from '@/lib/gameData';
import { FlaskConical, X, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recipe {
  id: string;
  nameKey: string;
  emoji: string;
  descKey: string;
  effectKey: string;
  ingredients: { item: keyof GameState['inventory']; labelKey: string; amount: number }[];
  output: keyof GameState['inventory'];
  xpReward: number;
}

const recipes: Recipe[] = [
  {
    id: 'remedy-basic',
    nameKey: 'recipe.remedy_basic',
    emoji: '🧪',
    descKey: 'recipe.remedy_basic_desc',
    effectKey: 'recipe.remedy_basic_effect',
    ingredients: [{ item: 'wellnessHerbs', labelKey: 'ing.wellnessHerbs', amount: 2 }],
    output: 'remedyPotionBasic',
    xpReward: 75,
  },
  {
    id: 'remedy-enhanced',
    nameKey: 'recipe.remedy_enhanced',
    emoji: '✨',
    descKey: 'recipe.remedy_enhanced_desc',
    effectKey: 'recipe.remedy_enhanced_effect',
    ingredients: [
      { item: 'wellnessHerbs', labelKey: 'ing.wellnessHerbs', amount: 4 },
      { item: 'hormoneCrystals', labelKey: 'ing.hormoneCrystals', amount: 1 },
    ],
    output: 'remedyPotionEnhanced',
    xpReward: 150,
  },
  {
    id: 'clarity-elixir',
    nameKey: 'recipe.clarity',
    emoji: '💧',
    descKey: 'recipe.clarity_desc',
    effectKey: 'recipe.clarity_effect',
    ingredients: [
      { item: 'wellnessHerbs', labelKey: 'ing.wellnessHerbs', amount: 3 },
      { item: 'knowledgeScrolls', labelKey: 'ing.knowledgeScrolls', amount: 1 },
    ],
    output: 'clarityElixir',
    xpReward: 50,
  },
  {
    id: 'estra-boost',
    nameKey: 'recipe.estra_boost',
    emoji: '🌟',
    descKey: 'recipe.estra_boost_desc',
    effectKey: 'recipe.estra_boost_effect',
    ingredients: [
      { item: 'hormoneCrystals', labelKey: 'ing.hormoneCrystals', amount: 5 },
      { item: 'bloomEssence', labelKey: 'ing.bloomEssence', amount: 2 },
    ],
    output: 'estraBoost',
    xpReward: 200,
  },
  {
    id: 'compendium-seal',
    nameKey: 'recipe.seal',
    emoji: '📖',
    descKey: 'recipe.seal_desc',
    effectKey: 'recipe.seal_effect',
    ingredients: [
      { item: 'knowledgeScrolls', labelKey: 'ing.knowledgeScrolls', amount: 1 },
      { item: 'hormoneCrystals', labelKey: 'ing.hormoneCrystals', amount: 2 },
    ],
    output: 'compendiumSeal',
    xpReward: 100,
  },
];

interface CraftingStationProps {
  onClose: () => void;
}

const CraftingStation: React.FC<CraftingStationProps> = ({ onClose }) => {
  const { state, addInventory, addXp, updateEstraBond, unlockCompendiumEntry } = useGame();
  const { t } = useLanguage();
  const [craftedId, setCraftedId] = useState<string | null>(null);

  const canCraft = (recipe: Recipe) => {
    return recipe.ingredients.every(
      ing => state.inventory[ing.item] >= ing.amount
    );
  };

  const handleCraft = (recipe: Recipe) => {
    if (!canCraft(recipe)) return;
    trackEvent('item_crafted', { recipeId: recipe.id, output: recipe.output });
    recipe.ingredients.forEach(ing => {
      addInventory(ing.item, -ing.amount);
    });
    addInventory(recipe.output, 1);
    addXp(recipe.xpReward);
    if (recipe.id === 'estra-boost') {
      updateEstraBond(1);
    }
    if (recipe.id === 'compendium-seal') {
      const sealEntry = state.compendium.find(e => e.sealOnly && !e.unlocked);
      if (sealEntry) {
        unlockCompendiumEntry(sealEntry.id);
        addInventory('compendiumSeal', -1);
      }
    }
    setCraftedId(recipe.id);
    setTimeout(() => setCraftedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h2 className="font-display text-2xl text-foreground">{t('craft.title')}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg bg-card/60 border border-border p-3">
        <span className="text-xs text-muted-foreground mr-1 self-center">{t('craft.resources')}</span>
        <span className="text-xs">🌿 {state.inventory.wellnessHerbs} {t('craft.herbs')}</span>
        <span className="text-xs">💎 {state.inventory.hormoneCrystals} {t('craft.crystals')}</span>
        <span className="text-xs">📜 {state.inventory.knowledgeScrolls} {t('craft.scrolls')}</span>
        <span className="text-xs">🌸 {state.inventory.bloomEssence} {t('craft.bloom')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => {
          const craftable = canCraft(recipe);
          const justCrafted = craftedId === recipe.id;

          return (
            <motion.div
              key={recipe.id}
              layout
              className={`rounded-lg border-2 p-4 transition-all ${
                craftable
                  ? 'border-primary/40 hover:border-primary bg-primary/5'
                  : 'border-border bg-muted/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{recipe.emoji}</span>
                  <div>
                    <h3 className="font-display text-sm">{t(recipe.nameKey)}</h3>
                    <p className="text-xs text-muted-foreground">{t(recipe.descKey)}</p>
                  </div>
                </div>
                {state.inventory[recipe.output] > 0 && (
                  <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5">
                    ×{state.inventory[recipe.output]}
                  </span>
                )}
              </div>

              <p className="text-xs text-glow-teal mt-2">{t(recipe.effectKey)}</p>

              <div className="mt-3 space-y-1">
                {recipe.ingredients.map((ing, i) => {
                  const hasEnough = state.inventory[ing.item] >= ing.amount;
                  return (
                    <div key={i} className={`flex items-center gap-2 text-xs ${hasEnough ? 'text-foreground/70' : 'text-destructive'}`}>
                      <span>{hasEnough ? '✓' : '✗'}</span>
                      <span>{ing.amount}× {t(ing.labelKey)}</span>
                      <span className="text-muted-foreground">({state.inventory[ing.item]} {t('craft.owned')})</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3">
                <AnimatePresence mode="wait">
                  {justCrafted ? (
                    <motion.div
                      key="crafted"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1 text-xs text-glow-green font-medium"
                    >
                      <Check className="h-3 w-3" /> {t('craft.crafted')} +{recipe.xpReward} XP
                    </motion.div>
                  ) : (
                    <Button
                      key="btn"
                      size="sm"
                      disabled={!craftable}
                      onClick={() => handleCraft(recipe)}
                      className={craftable ? 'bg-primary text-primary-foreground' : ''}
                    >
                      {craftable ? (
                        <>
                          <FlaskConical className="h-3 w-3 mr-1" /> {t('craft.craft')}
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 mr-1" /> {t('craft.need_resources')}
                        </>
                      )}
                    </Button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CraftingStation;
