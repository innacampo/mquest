import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GameRules = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} title="How to Play">
        <HelpCircle className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl bg-card border border-border shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-primary">How to Play</h3>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-foreground/80">
                <div>
                  <h4 className="font-display text-foreground mb-1">🗺 Explore Biomes</h4>
                  <p>Travel across 6 biomes, each tied to a body system affected by menopause. Biomes unlock sequentially — clear one to access the next.</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">⚔ Battle Monsters</h4>
                  <p>Each biome has myth-monsters that spread misinformation. Battle them in real-time ATB combat by answering quiz questions correctly. Build combos for bonus damage!</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">✨ Visit Knowledge Shrines</h4>
                  <p>Shrines teach you real medical facts and reward XP + Knowledge Scrolls. Explorers earn double scrolls and bonus Bloom Essence.</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">💬 Talk to NPCs</h4>
                  <p>Each biome has a character with a personal story. Talking earns Wellness Herbs and unlocks their bio in the Compendium. Advocates earn bonus XP from conversations.</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">🧪 Craft Remedies</h4>
                  <p>Visit the Crafting Station in Hearth Village to combine resources into potions, elixirs, and seals. Use them in battle or to unlock hidden knowledge.</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">📖 Fill the Compendium</h4>
                  <p>Unlock facts, myth-busters, bestiary entries, and NPC bios. Hit milestones for bonus rewards. Craft Compendium Seals to reveal hidden entries!</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">🌟 Restore the Inner Realm</h4>
                  <p>Clearing biomes restores Estra's glow and heals the world. Clear all 6 biomes to reach the ending and complete your journey.</p>
                </div>
                <div className="pt-2 border-t border-border">
                  <h4 className="font-display text-foreground mb-1">🎭 Backgrounds & Specialties</h4>
                  <p><strong>Caregiver:</strong> +5 starting herbs, +1 bonus herb from NPCs</p>
                  <p><strong>Scholar:</strong> +15% XP from all sources, +3 starting scrolls</p>
                  <p><strong>Advocate:</strong> +1 Estra Bond, bonus XP & herbs from NPCs</p>
                  <p><strong>Explorer:</strong> +3 starting crystals, double shrine scrolls + bloom essence</p>
                  <p className="mt-1"><strong>Specialties</strong> give 1.5× damage in their associated biomes.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameRules;