import { useGame } from '@/contexts/GameContext';
import { xpForLevel } from '@/lib/gameData';
import { playerSprite } from '@/lib/battleAssets';
import EstraCompanion from './EstraCompanion';
import { BookOpen, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PlayerHUD = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const xpNeeded = xpForLevel(state.level + 1);
  const xpCurrent = state.xp - xpForLevel(state.level);
  const xpRange = xpNeeded - xpForLevel(state.level);
  const xpPercent = Math.min(100, (xpCurrent / xpRange) * 100);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card/80 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Player avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 flex-shrink-0"
          style={{ boxShadow: '0 0 10px hsla(35 90% 55% / 0.2)' }}
        >
          <img src={playerSprite} alt="Player" className="w-full h-full object-cover" />
        </div>

        <EstraCompanion />
        
        <div className="h-8 w-px bg-border" />
        
        {/* Level & XP */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-display text-sm text-primary">{state.character?.name || 'Lyra'} — {t('hud.level')} {state.level}</span>
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
      <div className="flex items-center gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-1" title={t('hud.estra_bond')}>
          <span>❤️</span>
          <span>{state.estraBond}/5</span>
        </div>
        <div className="flex items-center gap-1" title={t('hud.hormone_crystals')}>
          <span>💎</span>
          <span>{state.inventory.hormoneCrystals}</span>
        </div>
        <div className="flex items-center gap-1" title={t('hud.wellness_herbs')}>
          <span>🌿</span>
          <span>{state.inventory.wellnessHerbs}</span>
        </div>
        <div className="flex items-center gap-1" title={t('hud.knowledge_scrolls')}>
          <span>📜</span>
          <span>{state.inventory.knowledgeScrolls}</span>
        </div>
        {state.inventory.remedyPotionBasic > 0 && (
          <div className="flex items-center gap-1" title={t('hud.remedy_basic')}>
            <span>🧪</span>
            <span>{state.inventory.remedyPotionBasic}</span>
          </div>
        )}
        {state.inventory.remedyPotionEnhanced > 0 && (
          <div className="flex items-center gap-1" title={t('hud.remedy_enhanced')}>
            <span>✨</span>
            <span>{state.inventory.remedyPotionEnhanced}</span>
          </div>
        )}
        {state.inventory.clarityElixir > 0 && (
          <div className="flex items-center gap-1" title={t('hud.clarity_elixir')}>
            <span>💧</span>
            <span>{state.inventory.clarityElixir}</span>
          </div>
        )}
        {state.inventory.estraBoost > 0 && (
          <div className="flex items-center gap-1" title={t('hud.estra_boost')}>
            <span>🌟</span>
            <span>{state.inventory.estraBoost}</span>
          </div>
        )}
        <div className="flex items-center gap-1" title={t('hud.compendium')}>
          <BookOpen className="h-3.5 w-3.5 text-glow-teal" />
          <span>{state.compendium.filter(e => e.unlocked).length}/{state.compendium.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerHUD;
