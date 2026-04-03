import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CharacterBackground, Specialty } from '@/lib/gameData';
import { Heart, BookOpen, Megaphone, Compass, Flame, Brain, HeartPulse, Sparkles } from 'lucide-react';

interface CharacterCreationProps {
  onComplete: (background: CharacterBackground, specialty: Specialty, name: string) => void;
}

const CharacterCreation = ({ onComplete }: CharacterCreationProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'name' | 'background' | 'specialty' | 'confirm'>('name');
  const [name, setName] = useState('Lyra');
  const [selectedBg, setSelectedBg] = useState<CharacterBackground | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<Specialty | null>(null);
  const [exiting, setExiting] = useState(false);

  const backgrounds: { id: CharacterBackground; label: string; icon: React.ReactNode; desc: string; flavor: string }[] = [
    { id: 'caregiver', label: t('bg.caregiver'), icon: <Heart className="h-6 w-6" />, desc: t('bg.caregiver.desc'), flavor: t('bg.caregiver.flavor') },
    { id: 'scholar', label: t('bg.scholar'), icon: <BookOpen className="h-6 w-6" />, desc: t('bg.scholar.desc'), flavor: t('bg.scholar.flavor') },
    { id: 'advocate', label: t('bg.advocate'), icon: <Megaphone className="h-6 w-6" />, desc: t('bg.advocate.desc'), flavor: t('bg.advocate.flavor') },
    { id: 'explorer', label: t('bg.explorer'), icon: <Compass className="h-6 w-6" />, desc: t('bg.explorer.desc'), flavor: t('bg.explorer.flavor') },
  ];

  const specialties: { id: Specialty; label: string; icon: React.ReactNode; desc: string; biomeBonus: string }[] = [
    { id: 'thermoregulation', label: t('spec.thermoregulation'), icon: <Flame className="h-5 w-5" />, desc: t('spec.thermoregulation.desc'), biomeBonus: t('spec.thermoregulation.biome') },
    { id: 'neuroscience', label: t('spec.neuroscience'), icon: <Brain className="h-5 w-5" />, desc: t('spec.neuroscience.desc'), biomeBonus: t('spec.neuroscience.biome') },
    { id: 'cardiology', label: t('spec.cardiology'), icon: <HeartPulse className="h-5 w-5" />, desc: t('spec.cardiology.desc'), biomeBonus: t('spec.cardiology.biome') },
    { id: 'endocrinology', label: t('spec.endocrinology'), icon: <Sparkles className="h-5 w-5" />, desc: t('spec.endocrinology.desc'), biomeBonus: t('spec.endocrinology.biome') },
  ];

  const handleConfirm = () => {
    if (!selectedBg || !selectedSpec) return;
    setExiting(true);
    setTimeout(() => onComplete(selectedBg, selectedSpec, name || 'Lyra'), 800);
  };

  const bg = backgrounds.find(b => b.id === selectedBg);
  const spec = specialties.find(s => s.id === selectedSpec);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto py-8"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, hsl(230 25% 14%), hsl(230 25% 4%))' }}
      animate={exiting ? { opacity: 0, scale: 1.05 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${280 + Math.random() * 80} 50% 70%)`,
            }}
            animate={{ opacity: [0.05, 0.3, 0.05] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="flex justify-center gap-3 mb-8">
          {['name', 'background', 'specialty', 'confirm'].map((s, i) => (
            <div
              key={s}
              className="w-2.5 h-2.5 rounded-full transition-all duration-500"
              style={{
                background: ['name', 'background', 'specialty', 'confirm'].indexOf(step) >= i
                  ? 'hsl(35 90% 55%)'
                  : 'hsl(230 15% 25%)',
                boxShadow: ['name', 'background', 'specialty', 'confirm'].indexOf(step) >= i
                  ? '0 0 8px hsla(35 90% 55% / 0.5)'
                  : 'none',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'name' && (
            <motion.div key="name" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6">
              <h2 className="font-display text-3xl" style={{ color: 'hsl(35 90% 60%)' }}>{t('char.who')}</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">{t('char.name_prompt')}</p>
              <div className="max-w-xs mx-auto">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lyra" maxLength={16}
                  className="w-full text-center font-display text-2xl bg-transparent border-b-2 py-3 focus:outline-none transition-colors"
                  style={{ borderColor: 'hsl(35 90% 55%)', color: 'hsl(40 30% 92%)' }} />
                <p className="text-xs text-muted-foreground mt-2">{t('char.leave_blank')}</p>
              </div>
              <motion.button onClick={() => setStep('background')}
                className="px-8 py-3 rounded-full font-display text-sm tracking-wider"
                style={{ background: 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))', color: 'hsl(230 25% 8%)', boxShadow: '0 0 20px hsla(35 90% 55% / 0.3)' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                {t('char.continue')}
              </motion.button>
            </motion.div>
          )}

          {step === 'background' && (
            <motion.div key="background" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-3xl" style={{ color: 'hsl(35 90% 60%)' }}>{t('char.choose_bg')}</h2>
                <p className="text-muted-foreground text-sm mt-2">{t('char.bg_subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {backgrounds.map((b) => (
                  <motion.button key={b.id} onClick={() => setSelectedBg(b.id)}
                    className="text-left p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedBg === b.id ? 'hsl(35 90% 55%)' : 'hsl(230 15% 20%)',
                      background: selectedBg === b.id ? 'linear-gradient(135deg, hsla(35 90% 55% / 0.1), hsla(280 40% 50% / 0.05))' : 'hsla(230 20% 12% / 0.8)',
                      boxShadow: selectedBg === b.id ? '0 0 20px hsla(35 90% 55% / 0.15)' : 'none',
                    }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg"
                        style={{ background: selectedBg === b.id ? 'hsla(35 90% 55% / 0.2)' : 'hsla(230 15% 25% / 0.5)', color: selectedBg === b.id ? 'hsl(35 90% 60%)' : 'hsl(230 10% 55%)' }}>
                        {b.icon}
                      </div>
                      <span className="font-display text-sm" style={{ color: 'hsl(40 30% 92%)' }}>{b.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{b.flavor}</p>
                    <p className="text-xs font-medium" style={{ color: 'hsl(180 45% 55%)' }}>{b.desc}</p>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <motion.button onClick={() => setStep('name')} className="px-6 py-2.5 rounded-full text-sm"
                  style={{ color: 'hsl(230 10% 55%)', border: '1px solid hsl(230 15% 25%)' }} whileHover={{ scale: 1.05 }}>
                  {t('char.back')}
                </motion.button>
                <motion.button onClick={() => selectedBg && setStep('specialty')}
                  className="px-8 py-2.5 rounded-full font-display text-sm tracking-wider"
                  style={{
                    background: selectedBg ? 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))' : 'hsl(230 15% 20%)',
                    color: selectedBg ? 'hsl(230 25% 8%)' : 'hsl(230 10% 40%)',
                    boxShadow: selectedBg ? '0 0 20px hsla(35 90% 55% / 0.3)' : 'none',
                  }}
                  whileHover={selectedBg ? { scale: 1.05 } : {}} whileTap={selectedBg ? { scale: 0.97 } : {}}>
                  {t('char.continue')}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'specialty' && (
            <motion.div key="specialty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-3xl" style={{ color: 'hsl(35 90% 60%)' }}>{t('char.choose_spec')}</h2>
                <p className="text-muted-foreground text-sm mt-2">{t('char.spec_subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specialties.map((s) => (
                  <motion.button key={s.id} onClick={() => setSelectedSpec(s.id)}
                    className="text-left p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedSpec === s.id ? 'hsl(280 40% 55%)' : 'hsl(230 15% 20%)',
                      background: selectedSpec === s.id ? 'linear-gradient(135deg, hsla(280 40% 50% / 0.1), hsla(35 90% 55% / 0.05))' : 'hsla(230 20% 12% / 0.8)',
                      boxShadow: selectedSpec === s.id ? '0 0 20px hsla(280 40% 55% / 0.15)' : 'none',
                    }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg"
                        style={{ background: selectedSpec === s.id ? 'hsla(280 40% 55% / 0.2)' : 'hsla(230 15% 25% / 0.5)', color: selectedSpec === s.id ? 'hsl(280 40% 65%)' : 'hsl(230 10% 55%)' }}>
                        {s.icon}
                      </div>
                      <span className="font-display text-sm" style={{ color: 'hsl(40 30% 92%)' }}>{s.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{s.desc}</p>
                    <p className="text-xs font-medium" style={{ color: 'hsl(35 90% 60%)' }}>⚔ {s.biomeBonus}</p>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <motion.button onClick={() => setStep('background')} className="px-6 py-2.5 rounded-full text-sm"
                  style={{ color: 'hsl(230 10% 55%)', border: '1px solid hsl(230 15% 25%)' }} whileHover={{ scale: 1.05 }}>
                  {t('char.back')}
                </motion.button>
                <motion.button onClick={() => selectedSpec && setStep('confirm')}
                  className="px-8 py-2.5 rounded-full font-display text-sm tracking-wider"
                  style={{
                    background: selectedSpec ? 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))' : 'hsl(230 15% 20%)',
                    color: selectedSpec ? 'hsl(230 25% 8%)' : 'hsl(230 10% 40%)',
                    boxShadow: selectedSpec ? '0 0 20px hsla(35 90% 55% / 0.3)' : 'none',
                  }}
                  whileHover={selectedSpec ? { scale: 1.05 } : {}} whileTap={selectedSpec ? { scale: 0.97 } : {}}>
                  {t('char.continue')}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && bg && spec && (
            <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8">
              <div>
                <h2 className="font-display text-3xl mb-2" style={{ color: 'hsl(35 90% 60%)' }}>{t('char.journey_awaits')}</h2>
                <p className="text-muted-foreground text-sm">{t('char.realm_stirs')}</p>
              </div>
              <motion.div className="max-w-sm mx-auto rounded-2xl p-6 space-y-4"
                style={{ background: 'linear-gradient(135deg, hsla(230 20% 15% / 0.9), hsla(280 20% 12% / 0.9))', border: '1px solid hsl(35 60% 40%)', boxShadow: '0 0 40px hsla(35 90% 55% / 0.1), inset 0 1px 0 hsla(0 0% 100% / 0.05)' }}
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                <motion.div className="w-12 h-12 rounded-full mx-auto"
                  style={{ background: 'radial-gradient(circle at 35% 35%, hsl(45 95% 75%), hsl(35 90% 55%))', boxShadow: '0 0 20px hsla(35 90% 55% / 0.4)' }}
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                <div>
                  <h3 className="font-display text-xl" style={{ color: 'hsl(40 30% 92%)' }}>{name || 'Lyra'}</h3>
                  <div className="flex justify-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1.5" style={{ color: 'hsl(35 90% 60%)' }}>{bg.icon}<span>{bg.label}</span></div>
                    <div className="flex items-center gap-1.5" style={{ color: 'hsl(280 40% 65%)' }}>{spec.icon}<span>{spec.label}</span></div>
                  </div>
                </div>
                <div className="text-xs space-y-1 pt-2" style={{ borderTop: '1px solid hsl(230 15% 22%)' }}>
                  <p style={{ color: 'hsl(180 45% 55%)' }}>{bg.desc}</p>
                  <p style={{ color: 'hsl(35 90% 60%)' }}>⚔ {spec.biomeBonus}</p>
                </div>
              </motion.div>
              <div className="flex justify-center gap-3">
                <motion.button onClick={() => setStep('specialty')} className="px-6 py-2.5 rounded-full text-sm"
                  style={{ color: 'hsl(230 10% 55%)', border: '1px solid hsl(230 15% 25%)' }} whileHover={{ scale: 1.05 }}>
                  {t('char.back')}
                </motion.button>
                <motion.button onClick={handleConfirm}
                  className="px-10 py-3 rounded-full font-display text-sm tracking-wider relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, hsl(35 90% 50%), hsl(280 40% 45%))', color: 'hsl(40 30% 95%)', boxShadow: '0 0 30px hsla(35 90% 55% / 0.3)' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px hsla(35 90% 55% / 0.5)' }} whileTap={{ scale: 0.97 }}>
                  <span className="relative z-10 flex items-center gap-2"><Sparkles className="h-4 w-4" />{t('char.enter_realm')}</span>
                  <motion.div className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, transparent, hsla(0 0% 100% / 0.15), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CharacterCreation;
