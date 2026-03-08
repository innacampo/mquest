import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Monster, Question, questions, getSpecialtyDamageMultiplier, getXpMultiplier } from '@/lib/gameData';
import { Swords, Timer, Zap, Heart, ArrowLeft, Sparkles, Shield, FlaskConical, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DamageNumber, ScreenFlash, ImpactBurst, EnergyAura,
  SlashEffect, VictoryFireworks, KnockoutShatter, ComboSparks
} from './BattleEffects';
import BattlePortrait, { PlayerBattlePortrait, PortraitState } from './BattlePortrait';

interface BattleScreenProps {
  monster: Monster;
  onVictory: () => void;
  onRetreat: () => void;
  onKnockout: () => void;
}

// Puzzle mini-game data
const puzzlePairs = [
  { term: 'Estrogen', match: 'Ovaries' },
  { term: 'Hot Flash', match: 'Hypothalamus' },
  { term: 'Brain Fog', match: 'Acetylcholine' },
  { term: 'Bone Loss', match: 'Calcium' },
  { term: 'Mood Shift', match: 'Serotonin' },
  { term: 'Heart Risk', match: 'LDL Cholesterol' },
  { term: 'HRT', match: 'Hormone Therapy' },
  { term: 'Perimenopause', match: '4-8 Years' },
];

const scrambleWords = [
  { scrambled: 'GORESETN', answer: 'ESTROGEN' },
  { scrambled: 'THALPOMAHYUS', answer: 'HYPOTHALAMUS' },
  { scrambled: 'NICREODNE', answer: 'ENDOCRINE' },
  { scrambled: 'TNOSEROISE', answer: 'SEROTONIN' },
  { scrambled: 'MUICLAC', answer: 'CALCIUM' },
  { scrambled: 'GERNOPSTEROE', answer: 'PROGESTERONE' },
];

type BattlePhase = 'intro' | 'question' | 'combo' | 'monster_attack' | 'puzzle' | 'result' | 'victory' | 'knockout' | 'items';
type MonsterEffect = 'none' | 'blur' | 'scramble' | 'hide_option' | 'shrink_timer' | 'invert';

const PLAYER_MAX_HP = 100;
const BASE_MONSTER_DAMAGE = 20;

const BattleScreen: React.FC<BattleScreenProps> = ({ monster, onVictory, onRetreat, onKnockout }) => {
  const { state, addXp, defeatMonster, unlockCompendiumEntry, updateEstraBond, addInventory } = useGame();
  const damageMultiplier = getSpecialtyDamageMultiplier(state.character, monster.biome);
  const xpMultiplier = getXpMultiplier(state.character);

  // Core state
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [phase, setPhase] = useState<BattlePhase>('intro');
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [monsterSurge, setMonsterSurge] = useState(0);
  const [lastDamageDealt, setLastDamageDealt] = useState(0);
  const [lastDamageTaken, setLastDamageTaken] = useState(0);
  const [comboRating, setComboRating] = useState<'miss' | 'light' | 'good' | 'perfect' | null>(null);

  // Portrait states
  const [monsterPortraitState, setMonsterPortraitState] = useState<PortraitState>('idle');
  const [playerPortraitState, setPlayerPortraitState] = useState<PortraitState>('idle');

  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  // Monster effects
  const [activeEffect, setActiveEffect] = useState<MonsterEffect>('none');
  const [hiddenOptionIndex, setHiddenOptionIndex] = useState<number>(-1);
  const [scrambledOptions, setScrambledOptions] = useState<string[]>([]);

  // Combo bar
  const [comboBarActive, setComboBarActive] = useState(false);
  const [comboBarPosition, setComboBarPosition] = useState(0);
  const comboAnimRef = useRef<number>(0);

  // Puzzle state
  const [puzzleType, setPuzzleType] = useState<'match' | 'unscramble'>('match');
  const [puzzlePairData, setPuzzlePairData] = useState<{ term: string; match: string }[]>([]);
  const [puzzleMatched, setPuzzleMatched] = useState<Set<string>>(new Set());
  const [puzzleSelected, setPuzzleSelected] = useState<string | null>(null);
  const [scrambleData, setScrambleData] = useState<{ scrambled: string; answer: string } | null>(null);
  const [scrambleInput, setScrambleInput] = useState('');
  const [puzzleTimer, setPuzzleTimer] = useState(15);
  const [puzzleComplete, setPuzzleComplete] = useState(false);

  // Items state
  const [showItems, setShowItems] = useState(false);

  // VFX triggers
  const [flashRed, setFlashRed] = useState(0);
  const [flashGold, setFlashGold] = useState(0);
  const [flashGreen, setFlashGreen] = useState(0);
  const [playerSlash, setPlayerSlash] = useState(0);
  const [monsterSlash, setMonsterSlash] = useState(0);
  const [impactPlayer, setImpactPlayer] = useState(0);
  const [impactMonster, setImpactMonster] = useState(0);
  const [damageNumbers, setDamageNumbers] = useState<{ id: string; value: number; type: 'dealt' | 'taken' | 'heal' }[]>([]);

  const addDamageNumber = (value: number, type: 'dealt' | 'taken' | 'heal') => {
    const id = `${Date.now()}-${Math.random()}`;
    setDamageNumbers(prev => [...prev, { id, value, type }]);
    setTimeout(() => setDamageNumbers(prev => prev.filter(d => d.id !== id)), 1500);
  };

  const biomeQuestions = questions.filter(q => q.biome === monster.biome);

  // ---- HELPERS ----
  const getNextQuestion = useCallback(() => {
    const available = biomeQuestions.filter(q => !usedQuestionIds.has(q.id));
    if (available.length === 0) {
      setUsedQuestionIds(new Set());
      return biomeQuestions[Math.floor(Math.random() * biomeQuestions.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }, [biomeQuestions, usedQuestionIds]);

  const getMonsterEffect = useCallback((): MonsterEffect => {
    if (monsterSurge < 1) return 'none';
    const effects: MonsterEffect[] = ['blur', 'scramble', 'hide_option', 'shrink_timer', 'invert'];
    // More effects stack as surge increases
    const pool = effects.slice(0, Math.min(effects.length, monsterSurge + 1));
    return pool[Math.floor(Math.random() * pool.length)];
  }, [monsterSurge]);

  const triggerShake = () => {
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 500);
  };

  // ---- PHASE: START QUESTION ----
  const startNextRound = useCallback(() => {
    const newRound = round + 1;
    setRound(newRound);

    // Every 3rd round, insert a puzzle
    if (newRound > 1 && newRound % 3 === 0) {
      initPuzzle();
      return;
    }

    // Apply monster effect
    const effect = getMonsterEffect();
    setActiveEffect(effect);

    const q = getNextQuestion();
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setShowResult(false);
    setComboRating(null);
    setLastDamageDealt(0);
    setLastDamageTaken(0);

    // Effect-specific setup
    if (effect === 'hide_option') {
      // Hide a random wrong answer
      const wrongIndices = q.options.map((_, i) => i).filter(i => i !== q.correctAnswer);
      setHiddenOptionIndex(wrongIndices[Math.floor(Math.random() * wrongIndices.length)]);
    }
    if (effect === 'scramble') {
      // Shuffle options visually
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      setScrambledOptions(shuffled);
    }
    if (effect === 'shrink_timer') {
      setTimeLeft(8);
    } else {
      setTimeLeft(15);
    }
    setTimerActive(true);
    setPhase('question');
    setUsedQuestionIds(prev => new Set([...prev, q.id]));
  }, [round, getMonsterEffect, getNextQuestion]);

  // ---- TIMER ----
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // ---- ANSWER HANDLER ----
  const handleAnswer = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    setTimerActive(false);
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    // For scrambled options, map back to original index
    let actualIndex = answerIndex;
    if (activeEffect === 'scramble' && answerIndex >= 0) {
      const selectedOption = scrambledOptions[answerIndex];
      actualIndex = currentQuestion.options.indexOf(selectedOption);
    }

    const correct = actualIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setStreak(prev => prev + 1);
      setTotalCorrect(prev => prev + 1);
      setFlashGold(prev => prev + 1);
      setPlayerPortraitState('charge');
      // Go to combo phase
      setTimeout(() => {
        setPhase('combo');
        startComboBar();
      }, 800);
    } else {
      setStreak(0);
      setMonsterSurge(prev => prev + 1);
      // Monster attacks player
      const monsterDmg = BASE_MONSTER_DAMAGE + monsterSurge * 5;
      setLastDamageTaken(monsterDmg);
      const newPlayerHp = Math.max(0, playerHp - monsterDmg);
      setPlayerHp(newPlayerHp);
      triggerShake();
      setFlashRed(prev => prev + 1);
      setMonsterSlash(prev => prev + 1);
      setImpactPlayer(prev => prev + 1);
      setMonsterPortraitState('attack');
      setPlayerPortraitState('hit');
      addDamageNumber(monsterDmg, 'taken');

      if (monster.mechanic === 'Drain Bond') {
        updateEstraBond(-1);
      }

      if (newPlayerHp <= 0) {
        setTimeout(() => setPhase('knockout'), 1200);
      } else {
        // Show monster attack phase briefly
        setTimeout(() => setPhase('monster_attack'), 1200);
      }
    }
  };

  // ---- COMBO BAR ----
  const startComboBar = () => {
    setComboBarActive(true);
    setComboBarPosition(0);
    const speed = 2.5 + monsterSurge * 0.5; // Gets faster as monster surges

    const animate = () => {
      setComboBarPosition(prev => {
        const next = prev + speed;
        if (next >= 100) return 0; // Loop
        return next;
      });
      comboAnimRef.current = requestAnimationFrame(animate);
    };
    comboAnimRef.current = requestAnimationFrame(animate);
  };

  const handleComboStrike = () => {
    cancelAnimationFrame(comboAnimRef.current);
    setComboBarActive(false);

    // Determine combo quality based on position
    // Perfect: 45-55, Good: 35-65, Light: 20-80
    let rating: 'miss' | 'light' | 'good' | 'perfect';
    let multiplier: number;
    if (comboBarPosition >= 45 && comboBarPosition <= 55) {
      rating = 'perfect'; multiplier = 2.0;
    } else if (comboBarPosition >= 35 && comboBarPosition <= 65) {
      rating = 'good'; multiplier = 1.5;
    } else if (comboBarPosition >= 20 && comboBarPosition <= 80) {
      rating = 'light'; multiplier = 1.0;
    } else {
      rating = 'miss'; multiplier = 0.5;
    }

    setComboRating(rating);
    const baseDamage = 25;
    const streakBonus = Math.min(streak, 5) * 2;
    const damage = Math.round((baseDamage + streakBonus) * damageMultiplier * multiplier);
    setLastDamageDealt(damage);

    const newMonsterHp = Math.max(0, monsterHp - damage);
    setMonsterHp(newMonsterHp);

    // VFX for player attacking monster
    setPlayerSlash(prev => prev + 1);
    setImpactMonster(prev => prev + 1);
    addDamageNumber(damage, 'dealt');
    setPlayerPortraitState('attack');
    setMonsterPortraitState('hit');
    if (rating === 'perfect') setFlashGold(prev => prev + 1);
    else if (rating === 'good') setFlashGreen(prev => prev + 1);

    if (newMonsterHp <= 0) {
      setTimeout(() => setPhase('victory'), 1500);
    } else {
      setTimeout(() => setPhase('result'), 1200);
    }
  };

  // Auto-miss if combo bar not hit in time
  useEffect(() => {
    if (phase !== 'combo') return;
    const timeout = setTimeout(() => {
      if (comboBarActive) {
        cancelAnimationFrame(comboAnimRef.current);
        setComboBarActive(false);
        setComboRating('miss');
        const damage = Math.round(25 * damageMultiplier * 0.3);
        setLastDamageDealt(damage);
        setMonsterHp(prev => Math.max(0, prev - damage));
        setTimeout(() => setPhase('result'), 1000);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [phase, comboBarActive]);

  // ---- PUZZLE MINI-GAME ----
  const initPuzzle = () => {
    const type = Math.random() > 0.5 ? 'match' : 'unscramble';
    setPuzzleType(type);
    setPuzzleComplete(false);
    setPuzzleTimer(15);

    if (type === 'match') {
      const shuffled = [...puzzlePairs].sort(() => Math.random() - 0.5).slice(0, 4);
      setPuzzlePairData(shuffled);
      setPuzzleMatched(new Set());
      setPuzzleSelected(null);
    } else {
      const word = scrambleWords[Math.floor(Math.random() * scrambleWords.length)];
      setScrambleData(word);
      setScrambleInput('');
    }
    setPhase('puzzle');
  };

  // Puzzle timer
  useEffect(() => {
    if (phase !== 'puzzle' || puzzleComplete) return;
    if (puzzleTimer <= 0) {
      setPuzzleComplete(true);
      setTimeout(() => {
        startNextRound();
      }, 1000);
      return;
    }
    const interval = setInterval(() => setPuzzleTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [phase, puzzleTimer, puzzleComplete]);

  const handleMatchClick = (item: string) => {
    if (puzzleComplete) return;
    if (!puzzleSelected) {
      setPuzzleSelected(item);
      return;
    }
    // Check if it's a valid pair
    const pair = puzzlePairData.find(
      p => (p.term === puzzleSelected && p.match === item) ||
           (p.match === puzzleSelected && p.term === item)
    );
    if (pair) {
      const newMatched = new Set(puzzleMatched);
      newMatched.add(pair.term);
      newMatched.add(pair.match);
      setPuzzleMatched(newMatched);
      if (newMatched.size >= puzzlePairData.length * 2) {
        setPuzzleComplete(true);
        // Bonus for completing puzzle
        const healAmount = 15;
        setPlayerHp(prev => Math.min(PLAYER_MAX_HP, prev + healAmount));
        setTimeout(() => startNextRound(), 1500);
      }
    }
    setPuzzleSelected(null);
  };

  const handleScrambleSubmit = () => {
    if (!scrambleData) return;
    if (scrambleInput.toUpperCase().trim() === scrambleData.answer) {
      setPuzzleComplete(true);
      const healAmount = 20;
      setPlayerHp(prev => Math.min(PLAYER_MAX_HP, prev + healAmount));
      setTimeout(() => startNextRound(), 1500);
    } else {
      setScrambleInput('');
    }
  };

  // ---- ITEMS ----
  const useItem = (item: 'remedyPotionBasic' | 'remedyPotionEnhanced' | 'clarityElixir' | 'knowledgeScrolls') => {
    if (state.inventory[item] <= 0) return;
    addInventory(item, -1);

    switch (item) {
      case 'remedyPotionBasic':
        setPlayerHp(prev => Math.min(PLAYER_MAX_HP, prev + 30));
        setFlashGreen(prev => prev + 1);
        addDamageNumber(30, 'heal');
        setPlayerPortraitState('heal');
        break;
      case 'remedyPotionEnhanced':
        setPlayerHp(prev => Math.min(PLAYER_MAX_HP, prev + 60));
        setFlashGreen(prev => prev + 1);
        addDamageNumber(60, 'heal');
        setPlayerPortraitState('heal');
        break;
      case 'clarityElixir':
        setActiveEffect('none');
        setMonsterSurge(prev => Math.max(0, prev - 1));
        break;
      case 'knowledgeScrolls':
        // Reveal correct answer (handled in render)
        break;
    }
    setShowItems(false);
  };

  // ---- MONSTER ATTACK PHASE ----
  useEffect(() => {
    if (phase !== 'monster_attack') return;
    const timeout = setTimeout(() => {
      startNextRound();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [phase]);

  // ---- VICTORY ----
  const handleVictory = () => {
    const baseXp = 150;
    const perfectBonus = totalCorrect === totalQuestions ? 100 : 0;
    const streakBonus = Math.max(0, (streak - 2)) * 15;
    const hpBonus = Math.round(playerHp * 0.5); // Bonus for remaining HP
    const totalXp = Math.round((baseXp + perfectBonus + streakBonus + hpBonus) * xpMultiplier);

    addXp(totalXp);
    defeatMonster(monster.id);

    const mythIndex = ['shame-dragon', 'dismissal-wraith', 'silence-specter', 'confusion-cyclone',
      'shame-tide', 'minimizer', 'brittle-giant', 'cold-certainty', 'fog-of-shame', 'heartbreak-myth',
      'grand-silencer'].indexOf(monster.id);
    if (mythIndex >= 0 && mythIndex < 6) {
      unlockCompendiumEntry(`myth-${mythIndex + 1}`);
    }

    onVictory();
  };

  // ---- RENDER HELPERS ----
  const getEffectStyle = (): string => {
    switch (activeEffect) {
      case 'blur': return 'blur-[2px]';
      case 'invert': return 'hue-rotate-180';
      default: return '';
    }
  };

  const displayOptions = activeEffect === 'scramble' && scrambledOptions.length > 0
    ? scrambledOptions
    : currentQuestion?.options || [];

  const comboColor = comboRating === 'perfect' ? 'text-primary' :
    comboRating === 'good' ? 'text-glow-green' :
    comboRating === 'light' ? 'text-secondary' : 'text-muted-foreground';

  const playerHpPercent = (playerHp / PLAYER_MAX_HP) * 100;
  const playerHpColor = playerHpPercent > 60 ? 'bg-glow-green' : playerHpPercent > 30 ? 'bg-primary' : 'bg-destructive';

  return (
    <div className={`min-h-[500px] rounded-xl bg-gradient-battle border border-border p-6 relative overflow-hidden ${shakeScreen ? 'animate-shake' : ''} ${playerHpPercent < 30 ? 'battle-vignette-danger' : 'battle-vignette'}`}>
      {/* VFX Overlays */}
      <ScreenFlash color="red" trigger={flashRed} />
      <ScreenFlash color="gold" trigger={flashGold} />
      <ScreenFlash color="green" trigger={flashGreen} />
      <SlashEffect trigger={playerSlash} variant="player" />
      <SlashEffect trigger={monsterSlash} variant="monster" />
      <ImpactBurst trigger={impactMonster} color="bg-primary" x="25%" y="30%" />
      <ImpactBurst trigger={impactPlayer} color="bg-destructive" x="75%" y="30%" />

      {/* Floating damage numbers */}
      <AnimatePresence>
        {damageNumbers.map(d => (
          <DamageNumber key={d.id} id={d.id} value={d.value} type={d.type} />
        ))}
      </AnimatePresence>

      {/* Ambient battle effects */}
      {monsterSurge > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(monsterSurge * 3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-destructive"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 0.5, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ============ INTRO ============ */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <BattlePortrait emoji={monster.emoji} name={monster.name} state="charge" variant="monster" size="lg" surgeLevel={0} />
            <h2 className="font-display text-2xl text-foreground">{monster.name}</h2>
            <p className="text-sm text-destructive italic max-w-md text-center">"{monster.myth}"</p>
            <p className="text-xs text-muted-foreground max-w-sm text-center">{monster.mechanicDescription}</p>

            {/* Player HP preview */}
            <div className="flex items-center gap-3">
              <Heart className="h-4 w-4 text-glow-rose" />
              <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${playerHpColor}`} style={{ width: '100%' }} />
              </div>
              <span className="text-xs text-muted-foreground">{playerHp} HP</span>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => startNextRound()} className="bg-primary text-primary-foreground font-display">
                <Swords className="h-4 w-4 mr-2" /> Begin Duel
              </Button>
              <Button variant="outline" onClick={onRetreat}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retreat
              </Button>
            </div>
          </motion.div>
        )}

        {/* ============ QUESTION PHASE ============ */}
        {phase === 'question' && currentQuestion && (
          <motion.div key="question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            {/* Battle HUD - both HP bars */}
            <div className="flex items-center justify-between gap-4">
              {/* Monster */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{monster.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-xs">{monster.name}</p>
                  <div className="h-2 w-full max-w-[140px] rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full bg-destructive"
                      animate={{ width: `${(monsterHp / monster.hp) * 100}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{monsterHp}/{monster.hp}</p>
                </div>
              </div>

              {/* Center badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {damageMultiplier > 1 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent">⚔ ×{damageMultiplier}</span>
                )}
                {activeEffect !== 'none' && (
                  <motion.span
                    className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {activeEffect === 'blur' ? '🌀 Blur' :
                     activeEffect === 'scramble' ? '🔀 Scrambled' :
                     activeEffect === 'hide_option' ? '👁 Hidden' :
                     activeEffect === 'shrink_timer' ? '⏳ Rush' :
                     activeEffect === 'invert' ? '🔄 Inverted' : ''}
                  </motion.span>
                )}
                {streak >= 2 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                    🔥 ×{streak}
                  </span>
                )}
              </div>

              {/* Player */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-right flex-1">
                  <p className="font-display text-xs">{state.character?.name || 'Lyra'}</p>
                  <div className="h-2 w-full max-w-[140px] rounded-full bg-muted overflow-hidden ml-auto">
                    <motion.div className={`h-full rounded-full ${playerHpColor}`}
                      animate={{ width: `${playerHpPercent}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{playerHp}/{PLAYER_MAX_HP}</p>
                </div>
                <Heart className="h-5 w-5 text-glow-rose" />
              </div>
            </div>

            {/* Timer + Item button */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1 ${timeLeft <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Timer className="h-4 w-4" />
                <span className="text-sm font-mono">{timeLeft}s</span>
                {activeEffect === 'shrink_timer' && <span className="text-[10px] text-destructive ml-1">RUSH!</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowItems(!showItems)} className="h-7 px-2 text-xs">
                  <FlaskConical className="h-3 w-3 mr-1" /> Items
                </Button>
              </div>
            </div>

            {/* Item panel */}
            <AnimatePresence>
              {showItems && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 rounded-lg bg-card/80 border border-border">
                    <button onClick={() => useItem('remedyPotionBasic')} disabled={state.inventory.remedyPotionBasic <= 0}
                      className="text-left p-2 rounded border border-border hover:border-glow-green/50 disabled:opacity-30 transition-colors">
                      <p className="text-xs font-display">🧪 Basic Potion</p>
                      <p className="text-[10px] text-muted-foreground">+30 HP ({state.inventory.remedyPotionBasic})</p>
                    </button>
                    <button onClick={() => useItem('remedyPotionEnhanced')} disabled={state.inventory.remedyPotionEnhanced <= 0}
                      className="text-left p-2 rounded border border-border hover:border-glow-green/50 disabled:opacity-30 transition-colors">
                      <p className="text-xs font-display">⚗️ Enhanced Potion</p>
                      <p className="text-[10px] text-muted-foreground">+60 HP ({state.inventory.remedyPotionEnhanced})</p>
                    </button>
                    <button onClick={() => useItem('clarityElixir')} disabled={state.inventory.clarityElixir <= 0}
                      className="text-left p-2 rounded border border-border hover:border-glow-teal/50 disabled:opacity-30 transition-colors">
                      <p className="text-xs font-display">💧 Clarity Elixir</p>
                      <p className="text-[10px] text-muted-foreground">Clear effects ({state.inventory.clarityElixir})</p>
                    </button>
                    <button onClick={() => useItem('knowledgeScrolls')} disabled={state.inventory.knowledgeScrolls <= 0}
                      className="text-left p-2 rounded border border-border hover:border-primary/50 disabled:opacity-30 transition-colors">
                      <p className="text-xs font-display">📜 Scroll</p>
                      <p className="text-[10px] text-muted-foreground">Hint ({state.inventory.knowledgeScrolls})</p>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question card */}
            <div className={`rounded-lg bg-card/60 border border-border p-5 space-y-4 transition-all ${getEffectStyle()}`}>
              <p className={`font-body text-foreground text-lg ${activeEffect === 'invert' ? 'scale-x-[-1]' : ''}`}>
                {currentQuestion.text}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {displayOptions.map((option, i) => {
                  const isHidden = activeEffect === 'hide_option' && i === hiddenOptionIndex;
                  if (isHidden && !showResult) {
                    return (
                      <div key={i} className="rounded-lg border-2 border-dashed border-muted px-4 py-3 opacity-30">
                        <span className="text-xs text-muted-foreground">??? Hidden by {monster.name}</span>
                      </div>
                    );
                  }

                  let optionStyle = 'border-border hover:border-primary/50 hover:bg-primary/5';
                  if (showResult) {
                    const actualIdx = activeEffect === 'scramble'
                      ? currentQuestion.options.indexOf(option) : i;
                    if (actualIdx === currentQuestion.correctAnswer) {
                      optionStyle = 'border-glow-green bg-glow-green/10';
                    } else if (i === selectedAnswer && !isCorrect) {
                      optionStyle = 'border-destructive bg-destructive/10';
                    } else {
                      optionStyle = 'border-border opacity-50';
                    }
                  }

                  return (
                    <motion.button key={i}
                      whileHover={!showResult ? { scale: 1.01 } : {}} whileTap={!showResult ? { scale: 0.99 } : {}}
                      onClick={() => handleAnswer(i)} disabled={showResult}
                      className={`text-left rounded-lg border-2 px-4 py-3 transition-colors ${optionStyle}`}>
                      <span className="text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)})</span>
                      <span className="text-sm">{option}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Wrong answer feedback inline */}
            <AnimatePresence>
              {showResult && !isCorrect && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg p-4 bg-destructive/10 border border-destructive/30 space-y-2">
                  <p className="font-display text-sm text-destructive">💥 {monster.name} strikes! -{lastDamageTaken} HP</p>
                  <p className="text-xs text-foreground/70">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ============ COMBO STRIKE ============ */}
        {phase === 'combo' && (
          <motion.div key="combo" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
            <h3 className="font-display text-xl text-primary">⚔ Knowledge Strike!</h3>
            <p className="text-sm text-muted-foreground">Hit the bar in the golden zone!</p>

            {/* Combo timing bar */}
            <div className="relative w-full max-w-md h-12 rounded-lg bg-muted border border-border overflow-hidden">
              {/* Zones */}
              <div className="absolute inset-y-0 left-[20%] right-[20%] bg-secondary/20" />
              <div className="absolute inset-y-0 left-[35%] right-[35%] bg-glow-green/20" />
              <div className="absolute inset-y-0 left-[45%] right-[45%] bg-primary/30" />

              {/* Zone labels */}
              <span className="absolute top-0.5 left-[22%] text-[9px] text-secondary/60">Light</span>
              <span className="absolute top-0.5 left-[38%] text-[9px] text-glow-green/60">Good</span>
              <span className="absolute top-0.5 left-[46%] text-[9px] text-primary/80">Perfect</span>

              {/* Moving indicator */}
              <motion.div
                className="absolute top-0 bottom-0 w-1.5 bg-foreground rounded-full shadow-lg"
                style={{ left: `${comboBarPosition}%` }}
              />
            </div>

            <motion.button
              onClick={handleComboStrike}
              className="px-8 py-3 rounded-full font-display text-lg tracking-wider"
              style={{
                background: 'linear-gradient(135deg, hsl(35 90% 50%), hsl(35 80% 40%))',
                color: 'hsl(230 25% 8%)',
                boxShadow: '0 0 20px hsla(35 90% 55% / 0.3)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              ⚔ STRIKE!
            </motion.button>
          </motion.div>
        )}

        {/* ============ RESULT (after combo) ============ */}
        {phase === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[300px] space-y-6 relative">
            <ComboSparks rating={comboRating} />
            {comboRating && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                className="text-center space-y-2">
                <p className={`font-display text-3xl ${comboColor}`}>
                  {comboRating === 'perfect' ? '✨ PERFECT!' :
                   comboRating === 'good' ? '⚡ GOOD!' :
                   comboRating === 'light' ? '💫 Light Hit' : '💨 Miss...'}
                </p>
                <p className="text-lg font-display text-glow-green">-{lastDamageDealt} HP</p>
                <p className="text-xs text-muted-foreground">Monster HP: {monsterHp}/{monster.hp}</p>
              </motion.div>
            )}

            {/* HP bars summary */}
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs w-20">{monster.emoji} Monster</span>
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full rounded-full bg-destructive"
                    animate={{ width: `${(monsterHp / monster.hp) * 100}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-20">❤️ You</span>
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <motion.div className={`h-full rounded-full ${playerHpColor}`}
                    animate={{ width: `${playerHpPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => startNextRound()} className="bg-primary text-primary-foreground font-display">
                Next Round →
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowItems(true)}>
                <FlaskConical className="h-3 w-3 mr-1" /> Items
              </Button>
              <Button variant="outline" size="sm" onClick={onRetreat}>Retreat</Button>
            </div>

            {/* Inline items */}
            <AnimatePresence>
              {showItems && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="w-full max-w-sm overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-card/80 border border-border">
                    <button onClick={() => useItem('remedyPotionBasic')} disabled={state.inventory.remedyPotionBasic <= 0}
                      className="p-2 rounded border border-border hover:border-glow-green/50 disabled:opacity-30 text-xs">
                      🧪 Basic Potion +30HP ({state.inventory.remedyPotionBasic})
                    </button>
                    <button onClick={() => useItem('remedyPotionEnhanced')} disabled={state.inventory.remedyPotionEnhanced <= 0}
                      className="p-2 rounded border border-border hover:border-glow-green/50 disabled:opacity-30 text-xs">
                      ⚗️ Enhanced +60HP ({state.inventory.remedyPotionEnhanced})
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ============ MONSTER ATTACK ============ */}
        {phase === 'monster_attack' && (
          <motion.div key="monster_attack" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[300px] space-y-6 relative">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6 }}
                className="text-7xl"
              >
                {monster.emoji}
              </motion.div>
              <EnergyAura intensity={Math.min(1, monsterSurge * 0.3)} color="red" />
            </div>
            <motion.p
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-2xl text-destructive"
            >
              💥 -{lastDamageTaken} HP!
            </motion.p>
            <p className="text-sm text-muted-foreground">{monster.name} retaliates!</p>

            {/* Player HP */}
            <div className="flex items-center gap-3">
              <Heart className="h-4 w-4 text-glow-rose" />
              <div className="h-3 w-40 rounded-full bg-muted overflow-hidden">
                <motion.div className={`h-full rounded-full ${playerHpColor}`}
                  animate={{ width: `${playerHpPercent}%` }} transition={{ duration: 0.5 }} />
              </div>
              <span className="text-sm">{playerHp}/{PLAYER_MAX_HP}</span>
            </div>

            {monsterSurge > 0 && (
              <p className="text-xs text-destructive">Monster Surge level {monsterSurge} — attacks hit harder, effects get worse!</p>
            )}
          </motion.div>
        )}

        {/* ============ PUZZLE MINI-GAME ============ */}
        {phase === 'puzzle' && (
          <motion.div key="puzzle" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="space-y-5">
            <div className="text-center">
              <h3 className="font-display text-xl text-secondary">
                {puzzleType === 'match' ? '🧩 Match the Pairs!' : '🔤 Unscramble!'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Complete for HP recovery! <span className={puzzleTimer <= 5 ? 'text-destructive' : ''}>{puzzleTimer}s</span>
              </p>
            </div>

            {puzzleType === 'match' ? (
              <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
                {/* Shuffle terms and matches together */}
                {[...puzzlePairData.flatMap(p => [p.term, p.match])].sort(() => 0.5 - Math.random()).map((item, i) => {
                  const isMatched = puzzleMatched.has(item);
                  const isSelected = puzzleSelected === item;
                  return (
                    <motion.button
                      key={`${item}-${i}`}
                      onClick={() => handleMatchClick(item)}
                      disabled={isMatched}
                      className={`p-3 rounded-lg border-2 text-xs text-center transition-all ${
                        isMatched ? 'border-glow-green/50 bg-glow-green/10 opacity-50' :
                        isSelected ? 'border-primary bg-primary/10 scale-105' :
                        'border-border hover:border-secondary/50'
                      }`}
                      whileHover={!isMatched ? { scale: 1.05 } : {}}
                      whileTap={!isMatched ? { scale: 0.95 } : {}}
                    >
                      {item}
                    </motion.button>
                  );
                })}
              </div>
            ) : scrambleData && (
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-2">
                  {scrambleData.scrambled.split('').map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="inline-block w-8 h-10 rounded bg-muted border border-border flex items-center justify-center font-display text-lg"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    value={scrambleInput}
                    onChange={(e) => setScrambleInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleScrambleSubmit()}
                    placeholder="Type the word..."
                    className="bg-transparent border-b-2 border-secondary px-4 py-2 text-center font-display text-lg tracking-widest focus:outline-none"
                    style={{ color: 'hsl(40 30% 92%)' }}
                    maxLength={scrambleData.answer.length}
                    autoFocus
                  />
                  <Button onClick={handleScrambleSubmit} size="sm" className="bg-secondary text-secondary-foreground">
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {puzzleComplete && (
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center font-display text-glow-green">
                ✨ +{puzzleType === 'match' ? 15 : 20} HP recovered!
              </motion.p>
            )}

            <div className="text-center">
              <Button variant="ghost" size="sm" onClick={() => startNextRound()}>
                Skip puzzle →
              </Button>
            </div>
          </motion.div>
        )}

        {/* ============ VICTORY ============ */}
        {phase === 'victory' && (
          <motion.div key="victory" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px] space-y-6 relative">
            <VictoryFireworks />
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6 }} className="text-7xl opacity-30">{monster.emoji}</motion.div>
            <h2 className="font-display text-2xl text-glow-green text-glow-teal">Myth Defeated!</h2>
            <div className="text-center space-y-2">
              <p className="text-sm text-foreground/70 italic">"{monster.myth}"</p>
              <p className="text-sm text-glow-green font-medium">{monster.truth}</p>
            </div>
            <div className="text-center space-y-1 text-xs text-muted-foreground">
              <p>Accuracy: {totalCorrect}/{totalQuestions}</p>
              <p>Remaining HP: {playerHp}/{PLAYER_MAX_HP}</p>
              {totalCorrect === totalQuestions && <p className="text-primary">🌟 Perfect Battle!</p>}
            </div>
            <Button onClick={handleVictory} className="bg-primary text-primary-foreground font-display">
              Claim Victory
            </Button>
          </motion.div>
        )}

        {/* ============ KNOCKOUT ============ */}
        {phase === 'knockout' && (
          <motion.div key="knockout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px] space-y-6 relative">
            <KnockoutShatter />
            <motion.div
              animate={{ opacity: [1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="text-6xl"
            >
              💔
            </motion.div>
            <h2 className="font-display text-2xl text-destructive">Knocked Out!</h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {monster.name} was too powerful this time. Retreat, heal up, and return stronger.
            </p>
            <div className="text-center space-y-1 text-xs text-muted-foreground">
              <p>Accuracy: {totalCorrect}/{totalQuestions}</p>
              <p>You earned partial XP for your efforts.</p>
            </div>
            <Button onClick={() => {
              addXp(Math.round(totalCorrect * 20 * xpMultiplier));
              onKnockout();
            }} variant="outline" className="font-display">
              Retreat to Village
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleScreen;
