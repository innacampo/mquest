import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { BookOpen, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompendiumViewProps {
  onClose: () => void;
}

const CompendiumView: React.FC<CompendiumViewProps> = ({ onClose }) => {
  const { state } = useGame();
  const facts = state.compendium.filter(e => e.type === 'fact');
  const myths = state.compendium.filter(e => e.type === 'myth');

  const unlockedCount = state.compendium.filter(e => e.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-glow-teal" />
          <h2 className="font-display text-2xl text-foreground">Compendium</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{unlockedCount}/{state.compendium.length} entries</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-glow-teal transition-all"
          style={{ width: `${(unlockedCount / state.compendium.length) * 100}%` }}
        />
      </div>

      {/* Facts */}
      <div className="space-y-3">
        <h3 className="font-display text-lg text-primary flex items-center gap-2">
          <Star className="h-4 w-4" /> Fact Cards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {facts.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-lg border p-4 transition-all ${
                entry.unlocked
                  ? 'border-glow-teal/30 bg-glow-teal/5'
                  : 'border-border bg-muted/30 opacity-50'
              }`}
            >
              <h4 className="font-display text-sm text-foreground">{entry.unlocked ? entry.title : '???'}</h4>
              <p className="text-xs text-foreground/60 mt-1">
                {entry.unlocked ? entry.content : 'Explore the Inner Realm to unlock this entry.'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Myths */}
      <div className="space-y-3">
        <h3 className="font-display text-lg text-destructive flex items-center gap-2">
          🐉 Myth Cards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {myths.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-lg border p-4 transition-all ${
                entry.unlocked
                  ? 'border-destructive/30 bg-destructive/5'
                  : 'border-border bg-muted/30 opacity-50'
              }`}
            >
              <h4 className="font-display text-sm text-foreground">{entry.unlocked ? entry.title : '???'}</h4>
              <p className="text-xs text-foreground/60 mt-1">
                {entry.unlocked ? entry.content : 'Defeat the monster to reveal the truth.'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CompendiumView;
