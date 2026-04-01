import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const GameRules = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} title={t('rules.title')}>
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
                <h3 className="font-display text-xl text-primary">{t('rules.title')}</h3>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-foreground/80">
                <div>
                  <h4 className="font-display text-foreground mb-1">{t('rules.biomes_title')}</h4>
                  <p>{t('rules.biomes_desc')}</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">{t('rules.battle_title')}</h4>
                  <p>{t('rules.battle_desc')}</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">{t('rules.shrine_title')}</h4>
                  <p>{t('rules.shrine_desc')}</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">{t('rules.npc_title')}</h4>
                  <p>{t('rules.npc_desc')}</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">{t('rules.craft_title')}</h4>
                  <p>{t('rules.craft_desc')}</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">{t('rules.comp_title')}</h4>
                  <p>{t('rules.comp_desc')}</p>
                </div>
                <div>
                  <h4 className="font-display text-foreground mb-1">{t('rules.restore_title')}</h4>
                  <p>{t('rules.restore_desc')}</p>
                </div>
                <div className="pt-2 border-t border-border">
                  <h4 className="font-display text-foreground mb-1">{t('rules.bg_title')}</h4>
                  <p><strong>{t('rules.bg_caregiver')}</strong></p>
                  <p><strong>{t('rules.bg_scholar')}</strong></p>
                  <p><strong>{t('rules.bg_advocate')}</strong></p>
                  <p><strong>{t('rules.bg_explorer')}</strong></p>
                  <p className="mt-1"><strong>{t('rules.bg_specialty')}</strong></p>
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
