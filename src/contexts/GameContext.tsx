import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, createInitialGameState, getLevelFromXp, BiomeId, biomes, CharacterProfile } from '@/lib/gameData';

interface GameContextType {
  state: GameState;
  addXp: (amount: number) => void;
  defeatMonster: (monsterId: string) => void;
  clearBiome: (biomeId: BiomeId) => void;
  unlockCompendiumEntry: (entryId: string) => void;
  addInventory: (item: keyof GameState['inventory'], amount: number) => void;
  updateEstraGlow: (delta: number) => void;
  updateEstraBond: (delta: number) => void;
  resetGame: () => void;
  enterBiome: (biomeId: BiomeId) => void;
  leaveBiome: () => void;
  setCharacter: (profile: CharacterProfile) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('menopause-quest-save');
    return saved ? JSON.parse(saved) : createInitialGameState();
  });

  const save = useCallback((newState: GameState) => {
    localStorage.setItem('menopause-quest-save', JSON.stringify(newState));
  }, []);

  const addXp = useCallback((amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = getLevelFromXp(newXp);
      const next = { ...prev, xp: newXp, level: newLevel };
      save(next);
      return next;
    });
  }, [save]);

  const defeatMonster = useCallback((monsterId: string) => {
    setState(prev => {
      if (prev.monstersDefeated.includes(monsterId)) return prev;
      const next = {
        ...prev,
        monstersDefeated: [...prev.monstersDefeated, monsterId],
        inventory: {
          ...prev.inventory,
          hormoneCrystals: prev.inventory.hormoneCrystals + 3,
        },
      };
      save(next);
      return next;
    });
  }, [save]);

  const clearBiome = useCallback((biomeId: BiomeId) => {
    setState(prev => {
      if (prev.biomesCleared.includes(biomeId)) return prev;
      const newCleared = [...prev.biomesCleared, biomeId];
      // Unlock next biome
      const biomeOrder: BiomeId[] = ['fever-peaks', 'fog-marshes', 'mood-tides', 'crystal-caverns', 'heartland', 'bloom-garden'];
      const idx = biomeOrder.indexOf(biomeId);
      const newGlow = Math.min(1, (newCleared.length / 5));
      const next = {
        ...prev,
        biomesCleared: newCleared,
        estraGlow: newGlow,
        currentBiome: null,
      };
      save(next);
      return next;
    });
  }, [save]);

  const unlockCompendiumEntry = useCallback((entryId: string) => {
    setState(prev => {
      const next = {
        ...prev,
        compendium: prev.compendium.map(e =>
          e.id === entryId ? { ...e, unlocked: true } : e
        ),
      };
      save(next);
      return next;
    });
  }, [save]);

  const addInventory = useCallback((item: keyof GameState['inventory'], amount: number) => {
    setState(prev => {
      const next = {
        ...prev,
        inventory: { ...prev.inventory, [item]: prev.inventory[item] + amount },
      };
      save(next);
      return next;
    });
  }, [save]);

  const updateEstraGlow = useCallback((delta: number) => {
    setState(prev => {
      const next = { ...prev, estraGlow: Math.max(0, Math.min(1, prev.estraGlow + delta)) };
      save(next);
      return next;
    });
  }, [save]);

  const updateEstraBond = useCallback((delta: number) => {
    setState(prev => {
      const next = { ...prev, estraBond: Math.max(0, Math.min(5, prev.estraBond + delta)) };
      save(next);
      return next;
    });
  }, [save]);

  const enterBiome = useCallback((biomeId: BiomeId) => {
    setState(prev => {
      const next = { ...prev, currentBiome: biomeId };
      save(next);
      return next;
    });
  }, [save]);

  const leaveBiome = useCallback(() => {
    setState(prev => {
      const next = { ...prev, currentBiome: null };
      save(next);
      return next;
    });
  }, [save]);

  const resetGame = useCallback(() => {
    const fresh = createInitialGameState();
    localStorage.removeItem('menopause-quest-save');
    setState(fresh);
  }, []);

  return (
    <GameContext.Provider value={{
      state, addXp, defeatMonster, clearBiome, unlockCompendiumEntry,
      addInventory, updateEstraGlow, updateEstraBond, resetGame, enterBiome, leaveBiome,
    }}>
      {children}
    </GameContext.Provider>
  );
};
