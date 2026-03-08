import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { GameState } from '@/lib/gameData';
import { FlaskConical, X, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  effect: string;
  ingredients: { item: keyof GameState['inventory']; label: string; amount: number }[];
  output: keyof GameState['inventory'];
  xpReward: number;
}

const recipes: Recipe[] = [
  {
    id: 'remedy-basic',
    name: 'Remedy Potion (Basic)',
    emoji: '🧪',
    description: 'A simple healing remedy crafted from herbs.',
    effect: 'Restores 30 HP in battle. Awards 75 XP.',
    ingredients: [{ item: 'wellnessHerbs', label: 'Wellness Herbs', amount: 2 }],
    output: 'remedyPotionBasic',
    xpReward: 75,
  },
  {
    id: 'remedy-enhanced',
    name: 'Remedy Potion (Enhanced)',
    emoji: '✨',
    description: 'A powerful remedy infused with crystal energy.',
    effect: 'Restores 60 HP in battle. Awards 150 XP + bonus Compendium entry.',
    ingredients: [
      { item: 'wellnessHerbs', label: 'Wellness Herbs', amount: 4 },
      { item: 'hormoneCrystals', label: 'Hormone Crystals', amount: 1 },
    ],
    output: 'remedyPotionEnhanced',
    xpReward: 150,
  },
  {
    id: 'clarity-elixir',
    name: 'Clarity Elixir',
    emoji: '💧',
    description: 'A shimmering elixir that clears the mind.',
    effect: 'During battle: removes one Surge charge from Monster. Single use.',
    ingredients: [
      { item: 'wellnessHerbs', label: 'Wellness Herbs', amount: 3 },
      { item: 'knowledgeScrolls', label: 'Knowledge Scrolls', amount: 1 },
    ],
    output: 'clarityElixir',
    xpReward: 50,
  },
  {
    id: 'estra-boost',
    name: 'Estra Boost',
    emoji: '🌟',
    description: 'Concentrated essence that strengthens Estra\'s bond.',
    effect: 'Permanently increases Estra Bond by 1. Max 3 crafts.',
    ingredients: [
      { item: 'hormoneCrystals', label: 'Hormone Crystals', amount: 5 },
      { item: 'bloomEssence', label: 'Bloom Essence', amount: 2 },
    ],
    output: 'estraBoost',
    xpReward: 200,
  },
  {
    id: 'compendium-seal',
    name: 'Compendium Seal',
    emoji: '📖',
    description: 'A mystical seal that reveals hidden knowledge.',
    effect: 'Unlocks a hidden Compendium entry not accessible via normal gameplay.',
    ingredients: [
      { item: 'knowledgeScrolls', label: 'Knowledge Scrolls', amount: 1 },
      { item: 'hormoneCrystals', label: 'Hormone Crystals', amount: 2 },
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
  const [craftedId, setCraftedId] = useState<string | null>(null);

  const canCraft = (recipe: Recipe) => {
    return recipe.ingredients.every(
      ing => state.inventory[ing.item] >= ing.amount
    );
  };

  const handleCraft = (recipe: Recipe) => {
    if (!canCraft(recipe)) return;

    // Deduct ingredients
    recipe.ingredients.forEach(ing => {
      addInventory(ing.item, -ing.amount);
    });

    // Add output
    addInventory(recipe.output, 1);
    addXp(recipe.xpReward);

    // Special: Estra Boost increases bond
    if (recipe.id === 'estra-boost') {
      updateEstraBond(1);
    }

    // Special: Compendium Seal unlocks a hidden entry immediately
    if (recipe.id === 'compendium-seal') {
      const sealEntry = state.compendium.find(e => e.sealOnly && !e.unlocked);
      if (sealEntry) {
        unlockCompendiumEntry(sealEntry.id);
        addInventory('compendiumSeal', -1); // consume the seal
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
          <h2 className="font-display text-2xl text-foreground">Crafting Station</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Current resources */}
      <div className="flex flex-wrap gap-3 rounded-lg bg-card/60 border border-border p-3">
        <span className="text-xs text-muted-foreground mr-1 self-center">Resources:</span>
        <span className="text-xs">🌿 {state.inventory.wellnessHerbs} Herbs</span>
        <span className="text-xs">💎 {state.inventory.hormoneCrystals} Crystals</span>
        <span className="text-xs">📜 {state.inventory.knowledgeScrolls} Scrolls</span>
        <span className="text-xs">🌸 {state.inventory.bloomEssence} Bloom Essence</span>
      </div>

      {/* Recipes */}
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
                    <h3 className="font-display text-sm">{recipe.name}</h3>
                    <p className="text-xs text-muted-foreground">{recipe.description}</p>
                  </div>
                </div>
                {state.inventory[recipe.output] > 0 && (
                  <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5">
                    ×{state.inventory[recipe.output]}
                  </span>
                )}
              </div>

              <p className="text-xs text-glow-teal mt-2">{recipe.effect}</p>

              {/* Ingredients */}
              <div className="mt-3 space-y-1">
                {recipe.ingredients.map((ing, i) => {
                  const hasEnough = state.inventory[ing.item] >= ing.amount;
                  return (
                    <div key={i} className={`flex items-center gap-2 text-xs ${hasEnough ? 'text-foreground/70' : 'text-destructive'}`}>
                      <span>{hasEnough ? '✓' : '✗'}</span>
                      <span>{ing.amount}× {ing.label}</span>
                      <span className="text-muted-foreground">({state.inventory[ing.item]} owned)</span>
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
                      <Check className="h-3 w-3" /> Crafted! +{recipe.xpReward} XP
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
                          <FlaskConical className="h-3 w-3 mr-1" /> Craft
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 mr-1" /> Need resources
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
