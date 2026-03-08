import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Monster, Question, questions, BiomeId, getSpecialtyDamageMultiplier, getXpMultiplier } from '@/lib/gameData';
import { Swords, Timer, Zap, Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BattleScreenProps {
  monster: Monster;
  onVictory: () => void;
  onRetreat: () => void;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ monster, onVictory, onRetreat }) => {
  const { state, addXp, defeatMonster, unlockCompendiumEntry, updateEstraBond } = useGame();
  const damageMultiplier = getSpecialtyDamageMultiplier(state.character, monster.biome);
  const xpMultiplier = getXpMultiplier(state.character);

  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'question' | 'result' | 'victory'>('intro');
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [monsterSurge, setMonsterSurge] = useState(0);
  const [shakeScreen, setShakeScreen] = useState(false);

  const biomeQuestions = questions.filter(q => q.biome === monster.biome);

  const getNextQuestion = useCallback(() => {
    const available = biomeQuestions.filter(q => !usedQuestionIds.has(q.id));
    if (available.length === 0) {
      setUsedQuestionIds(new Set());
      return biomeQuestions[Math.floor(Math.random() * biomeQuestions.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }, [biomeQuestions, usedQuestionIds]);

  const startQuestion = useCallback(() => {
    const q = getNextQuestion();
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(15);
    setTimerActive(true);
    setPhase('question');
    setUsedQuestionIds(prev => new Set([...prev, q.id]));
  }, [getNextQuestion]);

  // Timer
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleAnswer(-1); // time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    setTimerActive(false);
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      const baseDamage = 25;
      const damage = Math.round(baseDamage * damageMultiplier);
      const newHp = Math.max(0, monsterHp - damage);
      setMonsterHp(newHp);
      setStreak(prev => prev + 1);
      setTotalCorrect(prev => prev + 1);

      if (newHp <= 0) {
        setTimeout(() => setPhase('victory'), 1500);
      }
    } else {
      setStreak(0);
      setMonsterSurge(prev => prev + 1);
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);

      // Monster mechanic: drain bond
      if (monster.mechanic === 'Drain Bond') {
        updateEstraBond(-1);
      }
    }
  };

  const handleVictory = () => {
    const baseXp = 150;
    const perfectBonus = totalCorrect === totalQuestions ? 100 : 0;
    const streakBonus = Math.max(0, (streak - 2)) * 15;
    const totalXp = Math.round((baseXp + perfectBonus + streakBonus) * xpMultiplier);

    addXp(totalXp);
    defeatMonster(monster.id);

    // Unlock corresponding myth card
    const mythIndex = ['shame-dragon', 'dismissal-wraith', 'silence-specter', 'confusion-cyclone',
      'shame-tide', 'minimizer', 'brittle-giant', 'cold-certainty', 'fog-of-shame', 'heartbreak-myth',
      'grand-silencer'].indexOf(monster.id);
    if (mythIndex >= 0 && mythIndex < 6) {
      unlockCompendiumEntry(`myth-${mythIndex + 1}`);
    }

    onVictory();
  };

  return (
    <div className={`min-h-[500px] rounded-xl bg-gradient-battle border border-border p-6 ${shakeScreen ? 'animate-shake' : ''}`}>
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-7xl"
            >
              {monster.emoji}
            </motion.div>
            <h2 className="font-display text-2xl text-foreground">{monster.name}</h2>
            <p className="text-sm text-destructive italic max-w-md text-center">"{monster.myth}"</p>
            <p className="text-xs text-muted-foreground max-w-sm text-center">{monster.mechanicDescription}</p>
            <div className="flex gap-3">
              <Button onClick={startQuestion} className="bg-primary text-primary-foreground font-display">
                <Swords className="h-4 w-4 mr-2" /> Begin Duel
              </Button>
              <Button variant="outline" onClick={onRetreat}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retreat
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'question' && currentQuestion && (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Battle HUD */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{monster.emoji}</span>
                <div>
                  <p className="font-display text-sm">{monster.name}</p>
                  <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-destructive"
                      animate={{ width: `${(monsterHp / monster.hp) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{monsterHp}/{monster.hp} HP</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {damageMultiplier > 1 && (
                  <div className="flex items-center gap-1 text-accent">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs">Specialty ×{damageMultiplier}</span>
                  </div>
                )}
                {xpMultiplier > 1 && (
                  <div className="flex items-center gap-1 text-secondary">
                    <span className="text-xs">XP ×{xpMultiplier.toFixed(2)}</span>
                  </div>
                )}
                {monsterSurge > 0 && (
                  <div className="flex items-center gap-1 text-destructive">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs">Surge ×{monsterSurge}</span>
                  </div>
                )}
                <div className={`flex items-center gap-1 ${timeLeft <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-mono">{timeLeft}s</span>
                </div>
                {streak >= 2 && (
                  <div className="flex items-center gap-1 text-primary">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs">Streak ×{streak}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Question */}
            <div className="rounded-lg bg-card/60 border border-border p-5 space-y-4">
              <p className="font-body text-foreground text-lg">{currentQuestion.text}</p>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, i) => {
                  let optionStyle = 'border-border hover:border-primary/50 hover:bg-primary/5';
                  if (showResult) {
                    if (i === currentQuestion.correctAnswer) {
                      optionStyle = 'border-glow-green bg-glow-green/10';
                    } else if (i === selectedAnswer && !isCorrect) {
                      optionStyle = 'border-destructive bg-destructive/10';
                    } else {
                      optionStyle = 'border-border opacity-50';
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!showResult ? { scale: 1.01 } : {}}
                      whileTap={!showResult ? { scale: 0.99 } : {}}
                      onClick={() => handleAnswer(i)}
                      disabled={showResult}
                      className={`text-left rounded-lg border-2 px-4 py-3 transition-colors ${optionStyle}`}
                    >
                      <span className="text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)})</span>
                      <span className="text-sm">{option}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Result feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className={`rounded-lg p-4 ${isCorrect ? 'bg-glow-green/10 border border-glow-green/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                    <p className={`font-display text-sm ${isCorrect ? 'text-glow-green' : 'text-destructive'}`}>
                      {isCorrect ? '✨ Knowledge Strike!' : '💥 Monster Surge!'}
                    </p>
                    <p className="text-xs text-foreground/70 mt-1">{currentQuestion.explanation}</p>
                  </div>
                  {monsterHp > 0 && (
                    <div className="flex gap-3">
                      <Button onClick={startQuestion} className="bg-primary text-primary-foreground">
                        Next Question →
                      </Button>
                      <Button variant="outline" onClick={onRetreat}>Retreat</Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6 }}
              className="text-7xl opacity-30"
            >
              {monster.emoji}
            </motion.div>
            <h2 className="font-display text-2xl text-glow-green text-glow-teal">Myth Defeated!</h2>
            <div className="text-center space-y-2">
              <p className="text-sm text-foreground/70 italic">"{monster.myth}"</p>
              <p className="text-sm text-glow-green font-medium">{monster.truth}</p>
            </div>
            <div className="text-center space-y-1 text-xs text-muted-foreground">
              <p>Accuracy: {totalCorrect}/{totalQuestions}</p>
              {totalCorrect === totalQuestions && <p className="text-primary">🌟 Perfect Battle! +100 XP</p>}
            </div>
            <Button onClick={handleVictory} className="bg-primary text-primary-foreground font-display">
              Claim Victory
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleScreen;
