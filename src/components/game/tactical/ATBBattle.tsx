import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import {
  Monster, Question, questions, getSpecialtyDamageMultiplier, getXpMultiplier,
} from '@/lib/gameData';
import { battleBackgrounds, monsterSprites, playerSprite } from '@/lib/battleAssets';
import { Swords, ArrowLeft, Heart, Timer, FlaskConical, Shield, Zap, EyeOff, Shuffle, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DamageNumber, ScreenFlash, VictoryFireworks, KnockoutShatter, ImpactBurst, SlashEffect } from '../BattleEffects';

// ---- MONSTER MECHANIC DEFINITIONS ----
type MonsterMechanic = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  // Which part of battle it affects
  effect: 'fake_damage' | 'potion_drain' | 'scramble_answers' | 'blur_question' |
          'shorter_timer' | 'shrink_text' | 'fade_answers' | 'freeze_answer' |
          'screen_fog' | 'combo_decay' | 'multi';
};

const MONSTER_MECHANICS: Record<string, MonsterMechanic> = {
  'shame-dragon': {
    id: 'shame-dragon', name: 'Phantom Pain',
    description: 'Spawns fake damage numbers to confuse you!',
    icon: <EyeOff className="h-3.5 w-3.5" />,
    effect: 'fake_damage',
  },
  'confusion-cyclone': {
    id: 'confusion-cyclone', name: 'Whirlwind Scramble',
    description: 'Answer options are randomly shuffled each time!',
    icon: <Shuffle className="h-3.5 w-3.5" />,
    effect: 'scramble_answers',
  },
  'silence-specter': {
    id: 'silence-specter', name: 'Spectral Silence',
    description: 'Questions are blurred — read carefully!',
    icon: <VolumeX className="h-3.5 w-3.5" />,
    effect: 'blur_question',
  },
  'dismissal-wraith': {
    id: 'dismissal-wraith', name: 'Dismissive Haste',
    description: 'Timer reduced to 10 seconds!',
    icon: <Timer className="h-3.5 w-3.5" />,
    effect: 'shorter_timer',
  },
  'minimizer': {
    id: 'minimizer', name: 'Minimizing Gaze',
    description: 'Answer text shrinks over time — act fast!',
    icon: <EyeOff className="h-3.5 w-3.5" />,
    effect: 'shrink_text',
  },
  'shame-tide': {
    id: 'shame-tide', name: 'Tidal Drain',
    description: 'Each turn may consume a potion automatically!',
    icon: <FlaskConical className="h-3.5 w-3.5" />,
    effect: 'potion_drain',
  },
  'brittle-giant': {
    id: 'brittle-giant', name: 'Crumbling Choices',
    description: 'Wrong answers fade away... but so might the right one!',
    icon: <EyeOff className="h-3.5 w-3.5" />,
    effect: 'fade_answers',
  },
  'cold-certainty': {
    id: 'cold-certainty', name: 'Frozen Deceit',
    description: 'One wrong answer glows like the correct one!',
    icon: <EyeOff className="h-3.5 w-3.5" />,
    effect: 'freeze_answer',
  },
  'fog-of-shame': {
    id: 'fog-of-shame', name: 'Creeping Fog',
    description: 'Screen fills with fog as the timer runs down!',
    icon: <EyeOff className="h-3.5 w-3.5" />,
    effect: 'screen_fog',
  },
  'heartbreak-myth': {
    id: 'heartbreak-myth', name: 'Heartbreak',
    description: 'Combo decays each turn — keep the streak alive!',
    icon: <Heart className="h-3.5 w-3.5" />,
    effect: 'combo_decay',
  },
  'grand-silencer': {
    id: 'grand-silencer', name: 'Grand Silence',
    description: 'Blurred questions AND scrambled answers!',
    icon: <VolumeX className="h-3.5 w-3.5" />,
    effect: 'multi',
  },
};

interface ATBBattleProps {
  monster: Monster;
  onVictory: () => void;
  onRetreat: () => void;
  onKnockout: () => void;
}

type BattlePhase =
  | 'intro'
  | 'active'
  | 'player_menu'
  | 'quiz'
  | 'player_attack'
  | 'monster_attack'
  | 'victory'
  | 'knockout';

const PLAYER_MAX_HP = 100;
const PLAYER_BASE_DAMAGE = 28;
const MONSTER_BASE_DAMAGE = 15;
const PLAYER_ATB_SPEED = 1.8;
const MONSTER_ATB_SPEED = 1.2;
const ATB_MAX = 100;
const ATB_TICK_MS = 50;

const ATBBattle: React.FC<ATBBattleProps> = ({ monster, onVictory, onRetreat, onKnockout }) => {
  const { state, addXp, defeatMonster, unlockCompendiumEntry, updateEstraBond, addInventory } = useGame();
  const damageMultiplier = getSpecialtyDamageMultiplier(state.character, monster.biome);
  const xpMultiplier = getXpMultiplier(state.character);
  const mechanic = MONSTER_MECHANICS[monster.id] || null;

  const [phase, setPhase] = useState<BattlePhase>('intro');
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [playerAtb, setPlayerAtb] = useState(0);
  const [monsterAtb, setMonsterAtb] = useState(0);
  const [combo, setCombo] = useState(0);
  const [defending, setDefending] = useState(false);

  // Quiz
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [scrambledOptions, setScrambledOptions] = useState<{ text: string; originalIndex: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [blurAmount, setBlurAmount] = useState(0);
  const [shrinkScale, setShrinkScale] = useState(1);
  const [fadedAnswers, setFadedAnswers] = useState<Set<number>>(new Set());
  const [frozenDeceitIndex, setFrozenDeceitIndex] = useState<number | null>(null);
  const [fogOpacity, setFogOpacity] = useState(0);

  // VFX triggers
  const [flashRed, setFlashRed] = useState(0);
  const [flashGold, setFlashGold] = useState(0);
  const [playerSlash, setPlayerSlash] = useState(0);
  const [monsterSlash, setMonsterSlash] = useState(0);
  const [impactTrigger, setImpactTrigger] = useState(0);
  const [damageNumbers, setDamageNumbers] = useState<{ id: string; value: number; type: 'dealt' | 'taken' | 'heal'; x: string }[]>([]);

  // Stats
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Animation state
  const [playerAnim, setPlayerAnim] = useState<'idle' | 'attack' | 'hit' | 'defend' | 'victory' | 'defeated'>('idle');
  const [monsterAnim, setMonsterAnim] = useState<'idle' | 'attack' | 'hit' | 'defeated'>('idle');

  const biomeQuestions = useMemo(() => questions.filter(q => q.monster === monster.id), [monster.id]);
  const atbRunning = useRef(false);

  // Helper: does this monster use scrambled answers?
  const shouldScramble = mechanic?.effect === 'scramble_answers' || mechanic?.effect === 'multi';
  const shouldBlur = mechanic?.effect === 'blur_question' || mechanic?.effect === 'multi';
  const shouldShortenTimer = mechanic?.effect === 'shorter_timer';
  const shouldShrink = mechanic?.effect === 'shrink_text';
  const shouldFadeAnswers = mechanic?.effect === 'fade_answers';
  const shouldFreezeAnswer = mechanic?.effect === 'freeze_answer';
  const shouldFog = mechanic?.effect === 'screen_fog';
  const shouldDecayCombo = mechanic?.effect === 'combo_decay';
  const shouldFakeDamage = mechanic?.effect === 'fake_damage';
  const shouldDrainPotions = mechanic?.effect === 'potion_drain';

  const addDmgNumber = (value: number, type: 'dealt' | 'taken' | 'heal', x = '50%') => {
    const id = `${Date.now()}-${Math.random()}`;
    setDamageNumbers(prev => [...prev, { id, value, type, x }]);
    setTimeout(() => setDamageNumbers(prev => prev.filter(d => d.id !== id)), 1500);
  };

  // ---- ATB TICK ----
  useEffect(() => {
    if (phase !== 'active') {
      atbRunning.current = false;
      return;
    }
    atbRunning.current = true;

    const interval = setInterval(() => {
      if (!atbRunning.current) return;

      setPlayerAtb(prev => {
        const next = Math.min(ATB_MAX, prev + PLAYER_ATB_SPEED);
        if (next >= ATB_MAX) {
          atbRunning.current = false;
          setTimeout(() => setPhase('player_menu'), 0);
        }
        return next;
      });

      setMonsterAtb(prev => {
        const next = Math.min(ATB_MAX, prev + MONSTER_ATB_SPEED);
        if (next >= ATB_MAX && atbRunning.current) {
          atbRunning.current = false;
          setTimeout(() => triggerMonsterAttack(), 0);
        }
        return next;
      });
    }, ATB_TICK_MS);

    return () => clearInterval(interval);
  }, [phase]);

  // ---- QUIZ TIMER ----
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleQuizAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // ---- ACTIONS ----
  const startBattle = () => {
    setPhase('active');
    setPlayerAtb(0);
    setMonsterAtb(30); // Monster gets a head start
  };

  const getDefaultTimer = () => shouldShortenTimer ? 10 : 15;

  const openQuiz = useCallback(() => {
    const available = biomeQuestions.filter(q => !usedQuestionIds.has(q.id));
    const q = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : biomeQuestions[Math.floor(Math.random() * biomeQuestions.length)];
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setTimeLeft(getDefaultTimer());
    setTimerActive(true);
    setUsedQuestionIds(prev => new Set([...prev, q.id]));
    setBlurAmount(shouldBlur ? 8 : 0);
    setShrinkScale(1);
    setFadedAnswers(new Set());
    setFogOpacity(0);
    setFrozenDeceitIndex(null);

    // Scramble answers if mechanic applies
    const opts = q.options.map((text, i) => ({ text, originalIndex: i }));
    if (shouldScramble) {
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
    }
    setScrambledOptions(opts);

    // Frozen deceit: pick a random wrong answer to glow green
    if (shouldFreezeAnswer) {
      const wrongIndices = opts
        .map((o, i) => ({ i, orig: o.originalIndex }))
        .filter(o => o.orig !== q.correctAnswer);
      if (wrongIndices.length > 0) {
        setFrozenDeceitIndex(wrongIndices[Math.floor(Math.random() * wrongIndices.length)].i);
      }
    }

    // Combo decay mechanic
    if (shouldDecayCombo) {
      setCombo(prev => Math.max(0, prev - 1));
    }

    // Potion drain mechanic — 40% chance to auto-consume a potion
    if (shouldDrainPotions && Math.random() < 0.4) {
      if (state.inventory.remedyPotionBasic > 0) {
        addInventory('remedyPotionBasic', -1);
        setTimeout(() => addDmgNumber(1, 'taken', '15%'), 200);
      }
    }

    setPhase('quiz');
  }, [biomeQuestions, usedQuestionIds, shouldScramble, shouldBlur, shouldShortenTimer, shouldFreezeAnswer, shouldDecayCombo, shouldDrainPotions, state.inventory.remedyPotionBasic]);

  // Mechanic effects during quiz (blur fades, text shrinks, fog grows, answers fade)
  useEffect(() => {
    if (phase !== 'quiz' || !timerActive) return;
    const interval = setInterval(() => {
      // Blur gradually clears (reward patience)
      if (shouldBlur) {
        setBlurAmount(prev => Math.max(0, prev - 0.6));
      }
      // Shrink text over time
      if (shouldShrink) {
        setShrinkScale(prev => Math.max(0.55, prev - 0.03));
      }
      // Fog grows
      if (shouldFog) {
        setFogOpacity(prev => Math.min(0.7, prev + 0.04));
      }
      // Fade random answers
      if (shouldFadeAnswers && currentQuestion) {
        setFadedAnswers(prev => {
          if (prev.size >= scrambledOptions.length - 1) return prev;
          const available = scrambledOptions
            .map((_, i) => i)
            .filter(i => !prev.has(i));
          if (available.length > 0 && Math.random() < 0.15) {
            const next = new Set(prev);
            next.add(available[Math.floor(Math.random() * available.length)]);
            return next;
          }
          return prev;
        });
      }
    }, 500);
    return () => clearInterval(interval);
  }, [phase, timerActive, shouldBlur, shouldShrink, shouldFog, shouldFadeAnswers, currentQuestion, scrambledOptions]);

  const handleQuizAnswer = (scrambledIndex: number) => {
    if (showResult || !currentQuestion) return;
    setTimerActive(false);
    setBlurAmount(0);
    setFogOpacity(0);

    // Map scrambled index back to original
    const originalIndex = scrambledIndex === -1 ? -1 : scrambledOptions[scrambledIndex]?.originalIndex ?? -1;
    setSelectedAnswer(scrambledIndex);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);

    const correct = originalIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setTotalCorrect(prev => prev + 1);
      setCombo(prev => prev + 1);
      setTimeout(() => executePlayerAttack(), 1000);
    } else {
      setCombo(0);
      setTimeout(() => {
        setPlayerAtb(0);
        setMonsterAtb(prev => Math.min(ATB_MAX, prev + 30));
        setPhase('active');
      }, 1500);
    }
  };

  const executePlayerAttack = useCallback(() => {
    setPhase('player_attack');
    setPlayerAnim('attack');
    setDefending(false);

    const comboMultiplier = 1 + combo * 0.15;
    const damage = Math.round(PLAYER_BASE_DAMAGE * damageMultiplier * comboMultiplier);

    // Stagger VFX
    setTimeout(() => {
      setPlayerSlash(prev => prev + 1);
      setFlashGold(prev => prev + 1);
      setImpactTrigger(prev => prev + 1);
    }, 300);

    setTimeout(() => {
      setMonsterAnim('hit');
      addDmgNumber(damage, 'dealt', '72%');
    }, 400);

    setTimeout(() => {
      setMonsterHp(prev => {
        const newHp = Math.max(0, prev - damage);
        if (newHp <= 0) {
          setMonsterAnim('defeated');
          setTimeout(() => setPhase('victory'), 1200);
        } else {
          setPlayerAnim('idle');
          setMonsterAnim('idle');
          setPlayerAtb(0);
          setPhase('active');
        }
        return newHp;
      });
      // Fake damage mechanic — spawn 2-3 decoy numbers alongside real damage
      if (shouldFakeDamage) {
        const fakeCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < fakeCount; i++) {
          const fakeVal = Math.round(damage * (0.4 + Math.random() * 1.2));
          const fakeX = `${55 + Math.round((Math.random() - 0.5) * 30)}%`;
          const fakeType = Math.random() > 0.3 ? 'dealt' : 'heal';
          setTimeout(() => addDmgNumber(fakeVal, fakeType as 'dealt' | 'heal', fakeX), 100 + i * 150);
        }
      }
    }, 800);
  }, [combo, damageMultiplier, shouldFakeDamage]);

  const triggerMonsterAttack = useCallback(() => {
    setPhase('monster_attack');
    setMonsterAnim('attack');

    const damage = defending
      ? Math.round(MONSTER_BASE_DAMAGE * 0.4)
      : MONSTER_BASE_DAMAGE + Math.floor(totalQuestions / 4) * 3;

    setTimeout(() => {
      setMonsterSlash(prev => prev + 1);
      setFlashRed(prev => prev + 1);
    }, 300);

    setTimeout(() => {
      setPlayerAnim('hit');
      addDmgNumber(damage, 'taken', '28%');
    }, 400);

    setTimeout(() => {
      setPlayerHp(prev => {
        const newHp = Math.max(0, prev - damage);
        if (newHp <= 0) {
          setPlayerAnim('defeated');
          setTimeout(() => setPhase('knockout'), 1200);
        } else {
          setPlayerAnim('idle');
          setMonsterAnim('idle');
          setMonsterAtb(0);
          setDefending(false);
          setPhase('active');
        }
        return newHp;
      });
    }, 800);
  }, [defending, totalQuestions]);

  const usePotion = () => {
    if (state.inventory.remedyPotionBasic <= 0) return;
    addInventory('remedyPotionBasic', -1);
    const heal = 30;
    setPlayerHp(prev => Math.min(PLAYER_MAX_HP, prev + heal));
    addDmgNumber(heal, 'heal', '28%');
    setPlayerAtb(0);
    setPhase('active');
  };

  const defend = () => {
    setDefending(true);
    setPlayerAnim('defend');
    setPlayerAtb(0);
    setPhase('active');
  };

  const handleVictory = () => {
    const baseXp = 150;
    const comboBonus = combo * 20;
    const perfectBonus = totalCorrect === totalQuestions ? 100 : 0;
    const hpBonus = Math.round(playerHp * 0.5);
    const totalXp = Math.round((baseXp + comboBonus + perfectBonus + hpBonus) * xpMultiplier);
    addXp(totalXp);
    defeatMonster(monster.id);
    onVictory();
  };

  // ---- DERIVED ----
  const playerHpPercent = (playerHp / PLAYER_MAX_HP) * 100;
  const monsterHpPercent = (monsterHp / monster.hp) * 100;
  const playerHpColor = playerHpPercent > 60 ? 'bg-glow-green' : playerHpPercent > 30 ? 'bg-primary' : 'bg-destructive';
  const playerAtbPercent = (playerAtb / ATB_MAX) * 100;
  const monsterAtbPercent = (monsterAtb / ATB_MAX) * 100;

  return (
    <div className="space-y-4 relative">
      {/* VFX Layer */}
      <ScreenFlash color="red" trigger={flashRed} />
      <ScreenFlash color="gold" trigger={flashGold} />
      <AnimatePresence>
        {damageNumbers.map(d => (
          <motion.div key={d.id}
            className={`absolute font-display text-3xl font-bold pointer-events-none z-50 ${
              d.type === 'dealt' ? 'text-primary' : d.type === 'taken' ? 'text-destructive' : 'text-glow-green'
            }`}
            style={{ left: d.x, top: '30%' }}
            initial={{ opacity: 1, y: 0, x: '-50%', scale: 0.5 }}
            animate={{ opacity: 0, y: -80, scale: 1.4 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            {d.type === 'heal' ? '+' : '-'}{d.value}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ====== INTRO ====== */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative rounded-xl overflow-hidden" style={{ minHeight: 400 }}>
            {/* Background */}
            <img src={battleBackgrounds[monster.biome]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            
            <div className="relative z-10 text-center space-y-4 py-10 px-6">
              <motion.img 
                src={monsterSprites[monster.id]} 
                alt={monster.name}
                className="mx-auto h-40 w-40 object-contain drop-shadow-[0_0_20px_hsl(0_70%_50%/0.5)]"
                initial={{ scale: 0, rotate: -10 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ type: 'spring', bounce: 0.5 }}
              />
              <h2 className="font-display text-2xl text-foreground">{monster.name}</h2>
              <p className="text-sm text-destructive italic max-w-md mx-auto">"{monster.myth}"</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">{monster.mechanicDescription}</p>
              {mechanic && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/15 border border-destructive/30 text-destructive text-xs font-display mx-auto">
                  {mechanic.icon}
                  <span className="font-bold">{mechanic.name}:</span> {mechanic.description}
                </motion.div>
              )}
              <motion.p className="text-xs text-secondary mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                ⚡ Active Time Battle — React fast, answer smart!
              </motion.p>
              <div className="flex gap-3 justify-center">
                <Button onClick={startBattle} className="bg-primary text-primary-foreground font-display">
                  <Swords className="h-4 w-4 mr-2" /> Begin Battle
                </Button>
                <Button variant="outline" onClick={onRetreat}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Retreat
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ====== BATTLE ARENA ====== */}
        {!['intro', 'quiz', 'victory', 'knockout'].includes(phase) && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3">

            {/* HP Bars */}
            <div className="flex items-stretch justify-between gap-4">
              {/* Player HP */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <img src={playerSprite} alt="Player" className="w-6 h-6 object-contain rounded-full border border-secondary/40" />
                  <span className="font-display text-xs">{state.character?.name || 'Lyra'}</span>
                </div>
                <>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div className={`h-full rounded-full ${playerHpColor}`}
                      animate={{ width: `${playerHpPercent}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] text-muted-foreground">{playerHp}/{PLAYER_MAX_HP} HP</p>
                    {shouldDrainPotions && (
                      <span className="text-[9px] text-destructive/70 italic">🌊 draining</span>
                    )}
                  </div>
                </>
              </div>

              {/* Combo indicator */}
              {combo > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex flex-col items-center justify-center px-3">
                  <motion.span className="font-display text-lg text-primary"
                    animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                    {combo}x
                  </motion.span>
                  <span className="text-[9px] text-primary/70">COMBO</span>
                  {shouldDecayCombo && <span className="text-[8px] text-destructive/60">decaying</span>}
                </motion.div>
              )}

              {/* Monster HP */}
              <div className="flex-1 space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-display text-xs">{monster.name}</span>
                  <img src={monsterSprites[monster.id]} alt={monster.name} className="w-6 h-6 object-contain rounded-full border border-destructive/40" />
                </div>
                <>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full bg-destructive"
                      animate={{ width: `${monsterHpPercent}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <p className="text-[10px] text-muted-foreground">{monsterHp}/{monster.hp} HP</p>
                    {shouldFakeDamage && (
                      <span className="text-[9px] text-destructive/70 italic">👻 phantom</span>
                    )}
                  </div>
                </>
              </div>
            </div>

            {/* Battle Stage */}
            <div className="relative w-full rounded-xl overflow-hidden border border-border"
              style={{ height: 300 }}>
              {/* Battle background */}
              <img src={battleBackgrounds[monster.biome]} alt="" 
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
              
              {/* Battle vignette */}
              <div className="absolute inset-0 battle-vignette" />

              {/* Impact burst VFX */}
              <ImpactBurst trigger={impactTrigger} color="bg-primary" x="70%" y="45%" />
              <SlashEffect trigger={playerSlash} variant="player" />
              <SlashEffect trigger={monsterSlash} variant="monster" />

              {/* Ground shadow */}
              <div className="absolute bottom-8 left-[15%] w-24 h-4 rounded-full bg-black/30 blur-md" />
              <div className="absolute bottom-8 right-[15%] w-28 h-5 rounded-full bg-black/30 blur-md" />

              {/* Player sprite */}
              <motion.div
                className="absolute"
                style={{ left: '12%', bottom: '12%' }}
                animate={
                  playerAnim === 'idle' ? { y: [0, -6, 0] } :
                  playerAnim === 'attack' ? { x: [0, 80, 140, 0], scale: [1, 1.05, 1.15, 1] } :
                  playerAnim === 'hit' ? { x: [0, -12, 10, -6, 0], rotate: [0, -4, 4, -2, 0] } :
                  playerAnim === 'defend' ? { scale: [1, 0.92], y: [0, 4] } :
                  playerAnim === 'defeated' ? { opacity: [1, 0.2], y: [0, 30], rotate: [0, -20] } :
                  {}
                }
                transition={
                  playerAnim === 'idle' ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } :
                  playerAnim === 'attack' ? { duration: 0.6, ease: 'easeOut' } :
                  playerAnim === 'hit' ? { duration: 0.4 } :
                  playerAnim === 'defend' ? { duration: 0.3 } :
                  { duration: 1.5 }
                }
              >
                {/* Defend aura */}
                {defending && (
                  <motion.div className="absolute -inset-4 rounded-full border-2 border-secondary/40"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ boxShadow: '0 0 30px hsl(180 60% 50% / 0.4)' }}
                  />
                )}
                <img src={playerSprite} alt="Player" 
                  className="h-44 w-auto object-contain drop-shadow-[0_0_12px_hsl(180_50%_40%/0.4)]"
                  style={{ transform: 'scaleX(1)' }}
                />
              </motion.div>

              {/* Monster sprite */}
              <motion.div
                className="absolute"
                style={{ right: '8%', bottom: '10%' }}
                animate={
                  monsterAnim === 'idle' ? { y: [0, -8, 0], rotate: [0, 1, 0, -1, 0] } :
                  monsterAnim === 'attack' ? { x: [0, -80, -140, 0], scale: [1, 1.1, 1.2, 1] } :
                  monsterAnim === 'hit' ? { x: [0, 15, -10, 8, 0], scale: [1, 0.88, 1.05, 0.95, 1] } :
                  monsterAnim === 'defeated' ? { opacity: [1, 0], scale: [1, 0.2], rotate: [0, 25], y: [0, 60] } :
                  {}
                }
                transition={
                  monsterAnim === 'idle' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } :
                  monsterAnim === 'attack' ? { duration: 0.5, ease: 'easeOut' } :
                  monsterAnim === 'hit' ? { duration: 0.4 } :
                  { duration: 1.2 }
                }
              >
                <img src={monsterSprites[monster.id]} alt={monster.name}
                  className="h-48 w-auto object-contain drop-shadow-[0_0_16px_hsl(0_60%_40%/0.5)]"
                  style={{}}
                />
              </motion.div>

              {/* Ambient particles */}
              {[...Array(10)].map((_, i) => (
                <motion.div key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
                  style={{ left: `${10 + Math.random() * 80}%`, top: `${15 + Math.random() * 55}%` }}
                  animate={{ y: [0, -25, 0], opacity: [0.1, 0.5, 0.1] }}
                  transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                />
              ))}
            </div>

            {/* ATB Gauges */}
            <div className="space-y-2">
              {/* Player ATB */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-display w-14">ATB</span>
                <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: playerAtbPercent >= 100
                        ? 'linear-gradient(90deg, hsl(180 60% 50%), hsl(35 90% 55%))'
                        : 'hsl(180 60% 50%)',
                    }}
                    animate={{ width: `${playerAtbPercent}%` }}
                    transition={{ duration: 0.05 }}
                  />
                  {playerAtbPercent >= 100 && (
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ background: 'hsl(35 90% 55% / 0.2)' }}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-secondary font-mono w-6 text-right">
                  {playerAtbPercent >= 100 ? '⚡' : `${Math.round(playerAtbPercent)}%`}
                </span>
              </div>

              {/* Monster ATB */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-display w-14">Enemy</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full rounded-full bg-destructive/60"
                    animate={{ width: `${monsterAtbPercent}%` }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono w-6 text-right">
                  {Math.round(monsterAtbPercent)}%
                </span>
              </div>
            </div>

            {/* Action Menu */}
            <AnimatePresence>
              {phase === 'player_menu' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="flex items-center gap-2 justify-center"
                >
                  <Button size="sm" onClick={openQuiz}
                    className="bg-primary text-primary-foreground font-display gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> Attack
                  </Button>
                  <Button variant="outline" size="sm" onClick={usePotion}
                    disabled={state.inventory.remedyPotionBasic <= 0}
                    className="gap-1.5">
                    <FlaskConical className="h-3.5 w-3.5" /> Potion ({state.inventory.remedyPotionBasic})
                  </Button>
                  <Button variant="outline" size="sm" onClick={defend} className="gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> Defend
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onRetreat} className="text-xs">
                    Retreat
                  </Button>
                </motion.div>
              )}

              {(phase === 'active') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center text-xs text-muted-foreground italic">
                  {defending ? '🛡 Defending... waiting for gauge...' : 'Gauges filling...'}
                </motion.div>
              )}

              {(phase === 'player_attack' || phase === 'monster_attack') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center text-xs text-muted-foreground italic">
                  {phase === 'player_attack' ? '⚔ Striking!' : `${monster.name} attacks!`}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ====== QUIZ PHASE ====== */}
        {phase === 'quiz' && currentQuestion && (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="space-y-4 relative">

            {/* Fog overlay for fog-of-shame mechanic */}
            {shouldFog && fogOpacity > 0 && (
              <div className="absolute inset-0 z-20 pointer-events-none rounded-xl"
                style={{
                  background: `radial-gradient(ellipse at center, transparent 20%, hsl(var(--muted)) ${Math.round(fogOpacity * 100)}%)`,
                  opacity: fogOpacity,
                }} />
            )}

            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm text-secondary flex items-center gap-2">
                <Zap className="h-4 w-4" /> Knowledge Strike — Answer to Attack!
              </h3>
              <div className="flex items-center gap-2">
                {mechanic && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-display">
                    {mechanic.icon} {mechanic.name}
                  </span>
                )}
                <motion.div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    timeLeft <= 5 ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'
                  }`}
                  animate={timeLeft <= 5 ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Timer className="h-3 w-3" />
                  <span className="text-sm font-mono">{timeLeft}s</span>
                </motion.div>
              </div>
            </div>

            {combo > 0 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="text-xs text-primary font-display">
                🔥 {combo}x Combo — damage boosted by {Math.round(combo * 15)}%!
              </motion.div>
            )}

            <div className="rounded-xl bg-card/60 border border-border p-5 space-y-4">
              {/* Question text with optional blur */}
              <p className="text-foreground text-sm leading-relaxed transition-all duration-300"
                style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none' }}>
                {currentQuestion.text}
              </p>
              {blurAmount > 0 && !showResult && (
                <p className="text-[10px] text-destructive/60 italic">Spectral Silence — question is clearing...</p>
              )}

              {/* Answer options using scrambled order */}
              <div className="grid grid-cols-1 gap-2">
                {scrambledOptions.map((opt, i) => {
                  const origIdx = opt.originalIndex;
                  let style = 'border-border hover:border-secondary/60 hover:bg-secondary/5';

                  // Frozen deceit: make a wrong answer look green-ish before reveal
                  if (!showResult && frozenDeceitIndex === i) {
                    style = 'border-secondary/50 bg-secondary/5';
                  }

                  if (showResult) {
                    if (origIdx === currentQuestion.correctAnswer) style = 'border-glow-green bg-glow-green/10';
                    else if (i === selectedAnswer && !isCorrect) style = 'border-destructive bg-destructive/10';
                    else style = 'border-border opacity-40';
                  }

                  // Fade mechanic
                  const isFaded = fadedAnswers.has(i) && !showResult;

                  return (
                    <motion.button key={i}
                      onClick={() => handleQuizAnswer(i)} disabled={showResult || isFaded}
                      className={`text-left rounded-lg border-2 px-4 py-2.5 text-sm transition-all ${style} ${isFaded ? 'opacity-20 pointer-events-none' : ''}`}
                      style={{
                        fontSize: shouldShrink ? `${Math.max(0.65, shrinkScale) * 0.875}rem` : undefined,
                      }}
                      whileHover={!showResult && !isFaded ? { scale: 1.01, x: 4 } : {}}
                      whileTap={!showResult && !isFaded ? { scale: 0.98 } : {}}
                    >
                      <span className="text-muted-foreground mr-2 font-mono text-xs">{String.fromCharCode(65 + i)}</span>
                      {opt.text}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-3 text-sm ${
                  isCorrect
                    ? 'bg-glow-green/10 border border-glow-green/30 text-glow-green'
                    : 'bg-destructive/10 border border-destructive/30 text-destructive'
                }`}>
                {isCorrect ? `✅ Correct! Striking for ${Math.round(PLAYER_BASE_DAMAGE * damageMultiplier * (1 + combo * 0.15))} damage!` : `❌ Wrong — ${monster.name} gains momentum!`}
                <p className="text-xs text-foreground/60 mt-1">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ====== VICTORY ====== */}
        {phase === 'victory' && (
          <motion.div key="victory" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 space-y-5 relative">
            <VictoryFireworks />
            <motion.img src={monsterSprites[monster.id]} alt={monster.name}
              className="h-24 w-24 object-contain opacity-30 grayscale"
              animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.6 }}
            />
            <h2 className="font-display text-2xl text-glow-green">Myth Defeated!</h2>
            <div className="text-center space-y-1">
              <p className="text-sm text-foreground/70 italic">"{monster.myth}"</p>
              <p className="text-sm text-glow-green font-medium">{monster.truth}</p>
            </div>
            <div className="text-center space-y-1 text-xs text-muted-foreground">
              <p>Accuracy: {totalCorrect}/{totalQuestions} • Max Combo: {combo}x</p>
              <p>Remaining HP: {playerHp}/{PLAYER_MAX_HP}</p>
            </div>
            <Button onClick={handleVictory} className="bg-primary text-primary-foreground font-display">
              Claim Victory
            </Button>
          </motion.div>
        )}

        {/* ====== KNOCKOUT ====== */}
        {phase === 'knockout' && (
          <motion.div key="knockout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 space-y-5 relative">
            <KnockoutShatter />
            <motion.img src={playerSprite} alt="Player"
              className="h-20 w-20 object-contain"
              animate={{ opacity: [1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            />
            <h2 className="font-display text-2xl text-destructive">Knocked Out!</h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {monster.name} was too powerful. Retreat and return stronger.
            </p>
            <Button onClick={() => { addXp(Math.round(totalCorrect * 20 * xpMultiplier)); onKnockout(); }}
              variant="outline" className="font-display">
              Retreat to Village
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ATBBattle;
