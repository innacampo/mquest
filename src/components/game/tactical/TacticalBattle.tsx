import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import {
  Monster, Question, questions, getSpecialtyDamageMultiplier, getXpMultiplier,
} from '@/lib/gameData';
import {
  TacticalUnit, GridPosition, Tile, TurnPhase, CameraState,
  GRID_COLS, GRID_ROWS, gridToScreen, gridDistance, getTilesInRange,
  generateGrid, getMonsterMove,
} from './types';
import IsometricGrid from './IsometricGrid';
import { Swords, ArrowLeft, Heart, Timer, FlaskConical, Footprints, Clock, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DamageNumber, ScreenFlash, VictoryFireworks, KnockoutShatter } from '../BattleEffects';

interface TacticalBattleProps {
  monster: Monster;
  onVictory: () => void;
  onRetreat: () => void;
  onKnockout: () => void;
}

const PLAYER_MAX_HP = 100;
const PLAYER_MOVE_RANGE = 3;
const PLAYER_ATTACK_RANGE = 2;
const PLAYER_BASE_DAMAGE = 25;
const MONSTER_MOVE_RANGE = 2;
const MONSTER_ATTACK_RANGE = 2;
const MONSTER_BASE_DAMAGE = 18;

const TacticalBattle: React.FC<TacticalBattleProps> = ({ monster, onVictory, onRetreat, onKnockout }) => {
  const { state, addXp, defeatMonster, unlockCompendiumEntry, updateEstraBond, addInventory } = useGame();
  const damageMultiplier = getSpecialtyDamageMultiplier(state.character, monster.biome);
  const xpMultiplier = getXpMultiplier(state.character);

  // Grid
  const [grid] = useState<Tile[][]>(() => generateGrid(monster.biome));

  // Units
  const [playerUnit, setPlayerUnit] = useState<TacticalUnit>({
    id: 'player',
    name: state.character?.name || 'Lyra',
    emoji: state.character?.background === 'caregiver' ? '🩺' : state.character?.background === 'scholar' ? '📚' : state.character?.background === 'advocate' ? '⚖️' : '🧭',
    position: { col: 1, row: GRID_ROWS - 2 },
    hp: PLAYER_MAX_HP,
    maxHp: PLAYER_MAX_HP,
    moveRange: PLAYER_MOVE_RANGE,
    attackRange: PLAYER_ATTACK_RANGE,
    attackDamage: PLAYER_BASE_DAMAGE,
    isPlayer: true,
  });
  const [monsterUnit, setMonsterUnit] = useState<TacticalUnit>({
    id: 'monster',
    name: monster.name,
    emoji: monster.emoji,
    position: { col: GRID_COLS - 2, row: 1 },
    hp: monster.hp,
    maxHp: monster.hp,
    moveRange: MONSTER_MOVE_RANGE,
    attackRange: MONSTER_ATTACK_RANGE,
    attackDamage: MONSTER_BASE_DAMAGE,
    isPlayer: false,
  });

  // Turn state
  const [phase, setPhase] = useState<TurnPhase>('intro');
  const [turnCount, setTurnCount] = useState(0);
  const [highlightedTiles, setHighlightedTiles] = useState<GridPosition[]>([]);
  const [attackRangeTiles, setAttackRangeTiles] = useState<GridPosition[]>([]);
  const [selectedTile, setSelectedTile] = useState<GridPosition | null>(null);
  const [unitAnimations, setUnitAnimations] = useState<Record<string, { type: 'idle' | 'move' | 'attack' | 'hit' | 'defeated' }>>({});

  // Camera
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, zoom: 1 });

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  // VFX
  const [flashRed, setFlashRed] = useState(0);
  const [flashGold, setFlashGold] = useState(0);
  const [damageNumbers, setDamageNumbers] = useState<{ id: string; value: number; type: 'dealt' | 'taken' | 'heal' }[]>([]);

  // Stats
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [hasMovedThisTurn, setHasMovedThisTurn] = useState(false);

  const units = useMemo(() => [playerUnit, monsterUnit], [playerUnit, monsterUnit]);
  const biomeQuestions = useMemo(() => questions.filter(q => q.monster === monster.id), [monster.id]);

  const addDmgNumber = (value: number, type: 'dealt' | 'taken' | 'heal') => {
    const id = `${Date.now()}-${Math.random()}`;
    setDamageNumbers(prev => [...prev, { id, value, type }]);
    setTimeout(() => setDamageNumbers(prev => prev.filter(d => d.id !== id)), 1500);
  };

  // Focus camera on a grid position
  const focusCamera = useCallback((pos: GridPosition, zoom = 1) => {
    const screen = gridToScreen(pos.col, pos.row);
    setCamera({ x: screen.x, y: screen.y, zoom });
  }, []);

  // Reset camera to see both units
  const resetCamera = useCallback(() => {
    const midCol = (playerUnit.position.col + monsterUnit.position.col) / 2;
    const midRow = (playerUnit.position.row + monsterUnit.position.row) / 2;
    const screen = gridToScreen(midCol, midRow);
    setCamera({ x: screen.x, y: screen.y, zoom: 0.9 });
  }, [playerUnit.position, monsterUnit.position]);

  // ---- PHASE TRANSITIONS ----

  const startPlayerTurn = useCallback(() => {
    setTurnCount(prev => prev + 1);
    setHasMovedThisTurn(false);
    resetCamera();
    // Show movement range
    const walkable = getTilesInRange(playerUnit.position, playerUnit.moveRange, grid)
      .filter(p => !(p.col === monsterUnit.position.col && p.row === monsterUnit.position.row));
    setHighlightedTiles(walkable);
    setAttackRangeTiles([]);
    setPhase('player_move');
  }, [playerUnit.position, monsterUnit.position, grid, resetCamera]);

  const showActionMenu = useCallback(() => {
    setHighlightedTiles([]);
    setPhase('player_action');
  }, []);

  const startQuiz = useCallback(() => {
    const available = biomeQuestions.filter(q => !usedQuestionIds.has(q.id));
    const q = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : biomeQuestions[Math.floor(Math.random() * biomeQuestions.length)];
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setTimeLeft(15);
    setTimerActive(true);
    setUsedQuestionIds(prev => new Set([...prev, q.id]));
    setPhase('quiz');
  }, [biomeQuestions, usedQuestionIds]);

  const showAttackRange = useCallback(() => {
    const range = getTilesInRange(playerUnit.position, playerUnit.attackRange, grid)
      .filter(p => !(p.col === playerUnit.position.col && p.row === playerUnit.position.row));
    setAttackRangeTiles(range);
    setHighlightedTiles([]);
    setPhase('select_target');
    focusCamera(playerUnit.position, 1.1);
  }, [playerUnit.position, grid, focusCamera]);

  const executePlayerAttack = useCallback(() => {
    // Camera pan to monster
    focusCamera(monsterUnit.position, 1.3);
    setAttackRangeTiles([]);
    setUnitAnimations({ player: { type: 'attack' }, monster: { type: 'hit' } });
    setFlashGold(prev => prev + 1);

    const damage = Math.round(playerUnit.attackDamage * damageMultiplier);
    addDmgNumber(damage, 'dealt');

    setTimeout(() => {
      setMonsterUnit(prev => {
        const newHp = Math.max(0, prev.hp - damage);
        if (newHp <= 0) {
          setUnitAnimations(a => ({ ...a, monster: { type: 'defeated' } }));
          setTimeout(() => setPhase('victory'), 1500);
        } else {
          // Monster turn
          setTimeout(() => startMonsterTurn(), 1000);
        }
        return { ...prev, hp: newHp };
      });
      setUnitAnimations({ player: { type: 'idle' }, monster: { type: 'idle' } });
    }, 600);

    setPhase('attack_anim');
  }, [monsterUnit.position, playerUnit.attackDamage, damageMultiplier, focusCamera]);

  const startMonsterTurn = useCallback(() => {
    setPhase('monster_turn');
    resetCamera();

    // Monster AI: move toward player
    const moveTarget = getMonsterMove(monsterUnit, playerUnit, grid);
    if (moveTarget) {
      focusCamera(moveTarget, 1);
      setTimeout(() => {
        setMonsterUnit(prev => ({ ...prev, position: moveTarget }));
      }, 400);
    }

    // After move, check if can attack
    setTimeout(() => {
      setMonsterUnit(prev => {
        const pos = moveTarget || prev.position;
        const dist = gridDistance(pos, playerUnit.position);
        if (dist <= prev.attackRange) {
          // Attack player
          focusCamera(playerUnit.position, 1.3);
          setUnitAnimations({ monster: { type: 'attack' }, player: { type: 'hit' } });
          setFlashRed(p => p + 1);
          const damage = prev.attackDamage + Math.floor(turnCount / 3) * 3;
          addDmgNumber(damage, 'taken');

          setTimeout(() => {
            setPlayerUnit(pu => {
              const newHp = Math.max(0, pu.hp - damage);
              if (newHp <= 0) {
                setUnitAnimations(a => ({ ...a, player: { type: 'defeated' } }));
                setTimeout(() => setPhase('knockout'), 1500);
              } else {
                setUnitAnimations({ player: { type: 'idle' }, monster: { type: 'idle' } });
                setTimeout(() => startPlayerTurn(), 800);
              }
              return { ...pu, hp: newHp };
            });
          }, 600);

          setPhase('monster_attack_anim');
        } else {
          // Can't reach, end turn
          setUnitAnimations({ player: { type: 'idle' }, monster: { type: 'idle' } });
          setTimeout(() => startPlayerTurn(), 600);
        }
        return { ...prev, position: moveTarget || prev.position };
      });
    }, moveTarget ? 800 : 200);
  }, [monsterUnit, playerUnit, grid, focusCamera, resetCamera, turnCount]);

  // ---- TILE CLICK ----
  const handleTileClick = useCallback((pos: GridPosition) => {
    if (phase === 'player_move') {
      // Move player
      setPlayerUnit(prev => ({ ...prev, position: pos }));
      setHighlightedTiles([]);
      setHasMovedThisTurn(true);
      focusCamera(pos, 1);
      setTimeout(() => showActionMenu(), 500);
    } else if (phase === 'select_target') {
      // Check if monster is on this tile or in range
      const dist = gridDistance(pos, monsterUnit.position);
      if (dist <= 1) { // Clicked near monster
        setSelectedTile(pos);
        executePlayerAttack();
      }
    }
  }, [phase, monsterUnit.position, focusCamera, showActionMenu, executePlayerAttack]);

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

  // ---- QUIZ ANSWER ----
  const handleQuizAnswer = (index: number) => {
    if (showResult || !currentQuestion) return;
    setTimerActive(false);
    setSelectedAnswer(index);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);

    const correct = index === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setTotalCorrect(prev => prev + 1);
      // Correct answer = attack lands directly
      setTimeout(() => executePlayerAttack(), 1200);
    } else {
      // Skip turn
      setTimeout(() => startMonsterTurn(), 1500);
    }
  };

  // ---- ITEMS ----
  const usePotion = () => {
    if (state.inventory.remedyPotionBasic <= 0) return;
    addInventory('remedyPotionBasic', -1);
    setPlayerUnit(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 30) }));
    addDmgNumber(30, 'heal');
    // End turn after item
    setTimeout(() => startMonsterTurn(), 800);
  };

  // ---- VICTORY ----
  const handleVictory = () => {
    const baseXp = 150;
    const perfectBonus = totalCorrect === totalQuestions ? 100 : 0;
    const hpBonus = Math.round(playerUnit.hp * 0.5);
    const totalXp = Math.round((baseXp + perfectBonus + hpBonus) * xpMultiplier);
    addXp(totalXp);
    defeatMonster(monster.id);
    onVictory();
  };

  // ---- HP DISPLAY ----
  const playerHpPercent = (playerUnit.hp / PLAYER_MAX_HP) * 100;
  const monsterHpPercent = (monsterUnit.hp / monsterUnit.maxHp) * 100;
  const playerHpColor = playerHpPercent > 60 ? 'bg-glow-green' : playerHpPercent > 30 ? 'bg-primary' : 'bg-destructive';
  const monsterHpColor = 'bg-destructive';

  return (
    <div className="space-y-4 relative">
      {/* VFX */}
      <ScreenFlash color="red" trigger={flashRed} />
      <ScreenFlash color="gold" trigger={flashGold} />
      <AnimatePresence>
        {damageNumbers.map(d => (
          <DamageNumber key={d.id} id={d.id} value={d.value} type={d.type} />
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ====== INTRO ====== */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center space-y-4 py-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              className="text-6xl">{monster.emoji}</motion.div>
            <h2 className="font-display text-2xl text-foreground">{monster.name}</h2>
            <p className="text-sm text-destructive italic max-w-md mx-auto">"{monster.myth}"</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">{monster.mechanicDescription}</p>
            <p className="text-xs text-secondary mt-2">Tactical Battle — Move, Answer, Attack!</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={startPlayerTurn} className="bg-primary text-primary-foreground font-display">
                <Swords className="h-4 w-4 mr-2" /> Begin Battle
              </Button>
              <Button variant="outline" onClick={onRetreat}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Retreat
              </Button>
            </div>
          </motion.div>
        )}

        {/* ====== TACTICAL GRID PHASES ====== */}
        {['player_move', 'player_action', 'select_target', 'attack_anim', 'monster_turn', 'monster_attack_anim'].includes(phase) && (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3">
            {/* HUD */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">{monsterUnit.emoji}</span>
                <div className="flex-1 max-w-[140px]">
                  <p className="font-display text-[10px]">{monsterUnit.name}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div className={`h-full rounded-full ${monsterHpColor}`}
                      animate={{ width: `${monsterHpPercent}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground">{monsterUnit.hp}/{monsterUnit.maxHp}</p>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground font-display">Turn {turnCount}</div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <div className="flex-1 max-w-[140px] text-right">
                  <p className="font-display text-[10px]">{playerUnit.name}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden ml-auto">
                    <motion.div className={`h-full rounded-full ${playerHpColor}`}
                      animate={{ width: `${playerHpPercent}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground">{playerUnit.hp}/{PLAYER_MAX_HP}</p>
                </div>
                <span className="text-lg">{playerUnit.emoji}</span>
              </div>
            </div>

            {/* Grid */}
            <IsometricGrid
              grid={grid}
              biome={monster.biome}
              units={units}
              highlightedTiles={highlightedTiles}
              attackRangeTiles={attackRangeTiles}
              selectedTile={selectedTile}
              onTileClick={handleTileClick}
              cameraX={camera.x}
              cameraY={camera.y}
              cameraZoom={camera.zoom}
              unitAnimations={unitAnimations}
            />

            {/* Phase-specific UI */}
            <div className="flex items-center justify-between">
              {phase === 'player_move' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2">
                  <Footprints className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-secondary font-display">Click a tile to move</span>
                  <Button variant="ghost" size="sm" onClick={showActionMenu} className="text-xs ml-2">
                    Skip move →
                  </Button>
                </motion.div>
              )}
              {phase === 'player_action' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2">
                  <Button size="sm" onClick={startQuiz} className="bg-primary text-primary-foreground font-display">
                    <Crosshair className="h-3 w-3 mr-1" /> Attack
                  </Button>
                  <Button variant="outline" size="sm" onClick={usePotion}
                    disabled={state.inventory.remedyPotionBasic <= 0}>
                    <FlaskConical className="h-3 w-3 mr-1" /> Potion ({state.inventory.remedyPotionBasic})
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => startMonsterTurn()}>
                    <Clock className="h-3 w-3 mr-1" /> Wait
                  </Button>
                </motion.div>
              )}
              {phase === 'select_target' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive font-display">Select target in range</span>
                  {gridDistance(playerUnit.position, monsterUnit.position) <= playerUnit.attackRange && (
                    <Button size="sm" onClick={executePlayerAttack}
                      className="bg-destructive text-destructive-foreground font-display ml-2">
                      Attack {monsterUnit.name}
                    </Button>
                  )}
                </motion.div>
              )}
              {(phase === 'attack_anim' || phase === 'monster_turn' || phase === 'monster_attack_anim') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground italic">
                  {phase === 'attack_anim' ? '⚔ Attacking...' :
                   phase === 'monster_attack_anim' ? `${monsterUnit.name} strikes!` :
                   `${monsterUnit.name} is moving...`}
                </motion.div>
              )}
              <Button variant="ghost" size="sm" onClick={onRetreat} className="text-xs">
                Retreat
              </Button>
            </div>
          </motion.div>
        )}

        {/* ====== QUIZ PHASE ====== */}
        {phase === 'quiz' && currentQuestion && (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm text-secondary">🎯 Knowledge Check — Answer to Attack!</h3>
              <div className={`flex items-center gap-1 ${timeLeft <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Timer className="h-3 w-3" />
                <span className="text-sm font-mono">{timeLeft}s</span>
              </div>
            </div>

            <div className="rounded-lg bg-card/60 border border-border p-4 space-y-3">
              <p className="text-foreground">{currentQuestion.text}</p>
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((option, i) => {
                  let style = 'border-border hover:border-primary/50';
                  if (showResult) {
                    if (i === currentQuestion.correctAnswer) style = 'border-glow-green bg-glow-green/10';
                    else if (i === selectedAnswer && !isCorrect) style = 'border-destructive bg-destructive/10';
                    else style = 'border-border opacity-40';
                  }
                  return (
                    <motion.button key={i}
                      onClick={() => handleQuizAnswer(i)} disabled={showResult}
                      className={`text-left rounded border-2 px-3 py-2 text-sm transition-colors ${style}`}
                      whileHover={!showResult ? { scale: 1.01 } : {}}
                    >
                      <span className="text-muted-foreground mr-1.5">{String.fromCharCode(65 + i)})</span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-3 text-sm ${isCorrect ? 'bg-glow-green/10 border border-glow-green/30 text-glow-green' : 'bg-destructive/10 border border-destructive/30 text-destructive'}`}>
                {isCorrect ? '✅ Correct! Choose your target...' : `❌ Wrong — ${monsterUnit.name} seizes the initiative!`}
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
            <motion.div className="text-5xl opacity-30"
              animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.6 }}>
              {monster.emoji}
            </motion.div>
            <h2 className="font-display text-2xl text-glow-green">Myth Defeated!</h2>
            <div className="text-center space-y-1">
              <p className="text-sm text-foreground/70 italic">"{monster.myth}"</p>
              <p className="text-sm text-glow-green font-medium">{monster.truth}</p>
            </div>
            <div className="text-center space-y-1 text-xs text-muted-foreground">
              <p>Accuracy: {totalCorrect}/{totalQuestions} • Turns: {turnCount}</p>
              <p>Remaining HP: {playerUnit.hp}/{PLAYER_MAX_HP}</p>
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
            <motion.div animate={{ opacity: [1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="text-5xl">💔</motion.div>
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

export default TacticalBattle;
