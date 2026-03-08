import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterBackground, Specialty } from '@/lib/gameData';
import { Heart, BookOpen, Megaphone, Compass, Flame, Brain, HeartPulse, Sparkles } from 'lucide-react';

interface CharacterCreationProps {
  onComplete: (background: CharacterBackground, specialty: Specialty, name: string) => void;
}

const backgrounds: { id: CharacterBackground; label: string; icon: React.ReactNode; desc: string; flavor: string }[] = [
  {
    id: 'caregiver',
    label: 'The Caregiver',
    icon: <Heart className="h-6 w-6" />,
    desc: 'Bonus wellness herbs at start',
    flavor: 'You spent years tending to others. Now it\'s time to understand yourself.',
  },
  {
    id: 'scholar',
    label: 'The Scholar',
    icon: <BookOpen className="h-6 w-6" />,
    desc: '+15% XP from questions, bonus knowledge scrolls at start',
    flavor: 'Your curiosity led you to libraries and labs. The Inner Realm is your greatest subject.',
  },
  {
    id: 'advocate',
    label: 'The Advocate',
    icon: <Megaphone className="h-6 w-6" />,
    desc: '+1 starting Estra Bond, NPC dialogue unlocks faster',
    flavor: 'You\'ve always spoken up for others. Now you carry that fire inward.',
  },
  {
    id: 'explorer',
    label: 'The Explorer',
    icon: <Compass className="h-6 w-6" />,
    desc: 'Reveals hidden paths, +20% loot from shrine discoveries',
    flavor: 'Every new horizon calls. The Inner Realm is vast — and you intend to see it all.',
  },
];

const specialties: { id: Specialty; label: string; icon: React.ReactNode; desc: string; biomeBonus: string }[] = [
  {
    id: 'thermoregulation',
    label: 'Thermoregulation',
    icon: <Flame className="h-5 w-5" />,
    desc: 'Expertise in heat regulation & the hypothalamus',
    biomeBonus: 'Bonus damage in Fever Peaks',
  },
  {
    id: 'neuroscience',
    label: 'Neuroscience',
    icon: <Brain className="h-5 w-5" />,
    desc: 'Expertise in cognition, memory & brain chemistry',
    biomeBonus: 'Bonus damage in Fog Marshes & Mood Tides',
  },
  {
    id: 'cardiology',
    label: 'Cardiology',
    icon: <HeartPulse className="h-5 w-5" />,
    desc: 'Expertise in cardiovascular health & lipid profiles',
    biomeBonus: 'Bonus damage in Heartland Plains',
  },
  {
    id: 'endocrinology',
    label: 'Endocrinology',
    icon: <Sparkles className="h-5 w-5" />,
    desc: 'Expertise in hormones, HRT & the endocrine system',
    biomeBonus: 'Bonus damage in Crystal Caverns & Bloom Garden',
  },
];

const CharacterCreation = ({ onComplete }: CharacterCreationProps) => {
  const [step, setStep] = useState<'name' | 'background' | 'specialty' | 'confirm'>('name');
  const [name, setName] = useState('Lyra');
  const [selectedBg, setSelectedBg] = useState<CharacterBackground | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<Specialty | null>(null);
  const [exiting, setExiting] = useState(false);

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
      {/* Ambient particles */}
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
        {/* Progress dots */}
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
          {/* Step 1: Name */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <h2 className="font-display text-3xl" style={{ color: 'hsl(35 90% 60%)' }}>
                Who enters the Inner Realm?
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Every healer has a name. Choose yours, or keep the name the realm already knows.
              </p>
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lyra"
                  maxLength={16}
                  className="w-full text-center font-display text-2xl bg-transparent border-b-2 py-3 focus:outline-none transition-colors"
                  style={{
                    borderColor: 'hsl(35 90% 55%)',
                    color: 'hsl(40 30% 92%)',
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2">Leave blank for "Lyra"</p>
              </div>
              <motion.button
                onClick={() => setStep('background')}
                className="px-8 py-3 rounded-full font-display text-sm tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))',
                  color: 'hsl(230 25% 8%)',
                  boxShadow: '0 0 20px hsla(35 90% 55% / 0.3)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Continue →
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Background */}
          {step === 'background' && (
            <motion.div
              key="background"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-display text-3xl" style={{ color: 'hsl(35 90% 60%)' }}>
                  Choose Your Background
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Your past shapes how you navigate the Inner Realm
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {backgrounds.map((b) => (
                  <motion.button
                    key={b.id}
                    onClick={() => setSelectedBg(b.id)}
                    className="text-left p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedBg === b.id ? 'hsl(35 90% 55%)' : 'hsl(230 15% 20%)',
                      background: selectedBg === b.id
                        ? 'linear-gradient(135deg, hsla(35 90% 55% / 0.1), hsla(280 40% 50% / 0.05))'
                        : 'hsla(230 20% 12% / 0.8)',
                      boxShadow: selectedBg === b.id ? '0 0 20px hsla(35 90% 55% / 0.15)' : 'none',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: selectedBg === b.id ? 'hsla(35 90% 55% / 0.2)' : 'hsla(230 15% 25% / 0.5)',
                          color: selectedBg === b.id ? 'hsl(35 90% 60%)' : 'hsl(230 10% 55%)',
                        }}
                      >
                        {b.icon}
                      </div>
                      <span className="font-display text-sm" style={{ color: 'hsl(40 30% 92%)' }}>
                        {b.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{b.flavor}</p>
                    <p className="text-xs font-medium" style={{ color: 'hsl(180 45% 55%)' }}>
                      {b.desc}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  onClick={() => setStep('name')}
                  className="px-6 py-2.5 rounded-full text-sm"
                  style={{ color: 'hsl(230 10% 55%)', border: '1px solid hsl(230 15% 25%)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  onClick={() => selectedBg && setStep('specialty')}
                  className="px-8 py-2.5 rounded-full font-display text-sm tracking-wider"
                  style={{
                    background: selectedBg
                      ? 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))'
                      : 'hsl(230 15% 20%)',
                    color: selectedBg ? 'hsl(230 25% 8%)' : 'hsl(230 10% 40%)',
                    boxShadow: selectedBg ? '0 0 20px hsla(35 90% 55% / 0.3)' : 'none',
                  }}
                  whileHover={selectedBg ? { scale: 1.05 } : {}}
                  whileTap={selectedBg ? { scale: 0.97 } : {}}
                >
                  Continue →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Specialty */}
          {step === 'specialty' && (
            <motion.div
              key="specialty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-display text-3xl" style={{ color: 'hsl(35 90% 60%)' }}>
                  Choose Your Specialty
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Your medical knowledge gives you an edge in certain biomes
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specialties.map((s) => (
                  <motion.button
                    key={s.id}
                    onClick={() => setSelectedSpec(s.id)}
                    className="text-left p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedSpec === s.id ? 'hsl(280 40% 55%)' : 'hsl(230 15% 20%)',
                      background: selectedSpec === s.id
                        ? 'linear-gradient(135deg, hsla(280 40% 50% / 0.1), hsla(35 90% 55% / 0.05))'
                        : 'hsla(230 20% 12% / 0.8)',
                      boxShadow: selectedSpec === s.id ? '0 0 20px hsla(280 40% 55% / 0.15)' : 'none',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: selectedSpec === s.id ? 'hsla(280 40% 55% / 0.2)' : 'hsla(230 15% 25% / 0.5)',
                          color: selectedSpec === s.id ? 'hsl(280 40% 65%)' : 'hsl(230 10% 55%)',
                        }}
                      >
                        {s.icon}
                      </div>
                      <span className="font-display text-sm" style={{ color: 'hsl(40 30% 92%)' }}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{s.desc}</p>
                    <p className="text-xs font-medium" style={{ color: 'hsl(35 90% 60%)' }}>
                      ⚔ {s.biomeBonus}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  onClick={() => setStep('background')}
                  className="px-6 py-2.5 rounded-full text-sm"
                  style={{ color: 'hsl(230 10% 55%)', border: '1px solid hsl(230 15% 25%)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  onClick={() => selectedSpec && setStep('confirm')}
                  className="px-8 py-2.5 rounded-full font-display text-sm tracking-wider"
                  style={{
                    background: selectedSpec
                      ? 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))'
                      : 'hsl(230 15% 20%)',
                    color: selectedSpec ? 'hsl(230 25% 8%)' : 'hsl(230 10% 40%)',
                    boxShadow: selectedSpec ? '0 0 20px hsla(35 90% 55% / 0.3)' : 'none',
                  }}
                  whileHover={selectedSpec ? { scale: 1.05 } : {}}
                  whileTap={selectedSpec ? { scale: 0.97 } : {}}
                >
                  Continue →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirm' && bg && spec && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div>
                <h2 className="font-display text-3xl mb-2" style={{ color: 'hsl(35 90% 60%)' }}>
                  Your Journey Awaits
                </h2>
                <p className="text-muted-foreground text-sm">The Inner Realm stirs at your approach</p>
              </div>

              {/* Character card */}
              <motion.div
                className="max-w-sm mx-auto rounded-2xl p-6 space-y-4"
                style={{
                  background: 'linear-gradient(135deg, hsla(230 20% 15% / 0.9), hsla(280 20% 12% / 0.9))',
                  border: '1px solid hsl(35 60% 40%)',
                  boxShadow: '0 0 40px hsla(35 90% 55% / 0.1), inset 0 1px 0 hsla(0 0% 100% / 0.05)',
                }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                {/* Estra orb mini */}
                <motion.div
                  className="w-12 h-12 rounded-full mx-auto"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, hsl(45 95% 75%), hsl(35 90% 55%))',
                    boxShadow: '0 0 20px hsla(35 90% 55% / 0.4)',
                  }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div>
                  <h3 className="font-display text-xl" style={{ color: 'hsl(40 30% 92%)' }}>
                    {name || 'Lyra'}
                  </h3>
                  <div className="flex justify-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1.5" style={{ color: 'hsl(35 90% 60%)' }}>
                      {bg.icon}
                      <span>{bg.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: 'hsl(280 40% 65%)' }}>
                      {spec.icon}
                      <span>{spec.label}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-2" style={{ borderTop: '1px solid hsl(230 15% 22%)' }}>
                  <p style={{ color: 'hsl(180 45% 55%)' }}>{bg.desc}</p>
                  <p style={{ color: 'hsl(35 90% 60%)' }}>⚔ {spec.biomeBonus}</p>
                </div>
              </motion.div>

              <div className="flex justify-center gap-3">
                <motion.button
                  onClick={() => setStep('specialty')}
                  className="px-6 py-2.5 rounded-full text-sm"
                  style={{ color: 'hsl(230 10% 55%)', border: '1px solid hsl(230 15% 25%)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="px-10 py-3 rounded-full font-display text-sm tracking-wider relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(35 90% 50%), hsl(280 40% 45%))',
                    color: 'hsl(40 30% 95%)',
                    boxShadow: '0 0 30px hsla(35 90% 55% / 0.3)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px hsla(35 90% 55% / 0.5)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Enter the Inner Realm
                  </span>
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, transparent, hsla(0 0% 100% / 0.15), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                  />
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
