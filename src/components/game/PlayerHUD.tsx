import { useGame } from '@/contexts/GameContext';
import { xpForLevel } from '@/lib/gameData';
import EstraCompanion from './EstraCompanion';
import { Flame, BookOpen, Heart, Shield } from 'lucide-react';

const PlayerHUD = () => {
  const { state } = useGame();
  const xpNeeded = xpForLevel(state.level + 1);
  const xpCurrent = state.xp - xpForLevel(state.level);
  const xpRange = xpNeeded - xpForLevel(state.level);
  const xpPercent = Math.min(100, (xpCurrent / xpRange) * 100);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card/80 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center gap-4">
        <EstraCompanion />
        
        <div className="h-8 w-px bg-border" />
        
        {/* Level & XP */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-display text-sm text-primary">{state.character?.name || 'Lyra'} — Level {state.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{state.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1" title="Estra Bond">
          <Heart className="h-3.5 w-3.5 text-glow-rose" />
          <span>{state.estraBond}/5</span>
        </div>
        <div className="flex items-center gap-1" title="Hormone Crystals">
          <span>💎</span>
          <span>{state.inventory.hormoneCrystals}</span>
        </div>
        <div className="flex items-center gap-1" title="Wellness Herbs">
          <span>🌿</span>
          <span>{state.inventory.wellnessHerbs}</span>
        </div>
        <div className="flex items-center gap-1" title="Knowledge Scrolls">
          <span>📜</span>
          <span>{state.inventory.knowledgeScrolls}</span>
        </div>
        <div className="flex items-center gap-1" title="Compendium">
          <BookOpen className="h-3.5 w-3.5 text-glow-teal" />
          <span>{state.compendium.filter(e => e.unlocked).length}/{state.compendium.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerHUD;
