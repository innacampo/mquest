import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { GameState, createInitialGameState, getLevelFromXp, BiomeId, CharacterProfile, getStartingBonuses } from '@/lib/gameData';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { trackEvent } from '@/lib/analytics';

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
  meetNpc: (npcName: string) => void;
  claimMilestone: (milestoneId: string) => void;
  isLoading: boolean;
}

const defaultContext: GameContextType = {
  state: createInitialGameState(),
  addXp: () => {},
  defeatMonster: () => {},
  clearBiome: () => {},
  unlockCompendiumEntry: () => {},
  addInventory: () => {},
  updateEstraGlow: () => {},
  updateEstraBond: () => {},
  resetGame: () => {},
  enterBiome: () => {},
  leaveBiome: () => {},
  setCharacter: () => {},
  meetNpc: () => {},
  claimMilestone: () => {},
  isLoading: true,
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGame = () => {
  return useContext(GameContext);
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(createInitialGameState());
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced save to DB
  const saveToDb = useCallback((newState: GameState, uid: string) => {
    // Also keep localStorage as fallback
    localStorage.setItem('menopause-quest-save', JSON.stringify(newState));

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      await supabase
        .from('game_saves')
        .upsert({
          user_id: uid,
          game_state: newState as unknown as Json,
        }, { onConflict: 'user_id' });
    }, 500);
  }, []);

  // Auth + load
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // Check existing session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        if (mounted) {
          setUserId(session.user.id);
          await loadGameState(session.user.id);
        }
      } else {
        // Sign in anonymously
        const { data, error } = await supabase.auth.signInAnonymously();
        if (data?.user && mounted) {
          setUserId(data.user.id);
          // Create initial save
          const initial = createInitialGameState();
          // Check localStorage for existing progress to migrate
          const localSave = localStorage.getItem('menopause-quest-save');
          const gameState = localSave ? JSON.parse(localSave) : initial;
          if (mounted) setState(gameState);
          await supabase.from('game_saves').upsert({
            user_id: data.user.id,
            game_state: gameState as unknown as Json,
          }, { onConflict: 'user_id' });
          if (mounted) setIsLoading(false);
        } else {
          // Fallback to localStorage if auth fails
          const localSave = localStorage.getItem('menopause-quest-save');
          if (localSave && mounted) setState(JSON.parse(localSave));
          if (mounted) setIsLoading(false);
        }
      }
    };

    const loadGameState = async (uid: string) => {
      const { data } = await supabase
        .from('game_saves')
        .select('game_state')
        .eq('user_id', uid)
        .maybeSingle();

      if (data?.game_state && mounted) {
        const defaults = createInitialGameState();
        const saved = data.game_state as unknown as GameState;
        // Deep-merge inventory so new keys aren't lost from older saves
        setState({
          ...defaults,
          ...saved,
          inventory: { ...defaults.inventory, ...(saved.inventory || {}) },
        });
      } else {
        // No save in DB — check localStorage for migration, else fresh state
        const localSave = localStorage.getItem('menopause-quest-save');
        const gameState = localSave ? JSON.parse(localSave) : createInitialGameState();
        if (mounted) setState(gameState);
        // Persist to DB
        await supabase.from('game_saves').upsert({
          user_id: uid,
          game_state: gameState as unknown as Json,
        }, { onConflict: 'user_id' });
      }
      if (mounted) setIsLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && mounted) {
        setUserId(session.user.id);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const save = useCallback((newState: GameState) => {
    if (userId) {
      saveToDb(newState, userId);
    } else {
      localStorage.setItem('menopause-quest-save', JSON.stringify(newState));
    }
  }, [userId, saveToDb]);

  const addXp = useCallback((amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = getLevelFromXp(newXp);
      const next = { ...prev, xp: newXp, level: newLevel };
      save(next);
      if (newLevel > prev.level) trackEvent('level_up', { newLevel, xp: newXp });
      return next;
    });
  }, [save]);

  const defeatMonster = useCallback((monsterId: string) => {
    setState(prev => {
      if (prev.monstersDefeated.includes(monsterId)) return prev;
      // Auto-unlock bestiary and myth entries for this monster
      const updatedCompendium = prev.compendium.map(e =>
        (e.monsterId === monsterId && (e.type === 'bestiary' || e.type === 'myth'))
          ? { ...e, unlocked: true }
          : e
      );
      const next = {
        ...prev,
        monstersDefeated: [...prev.monstersDefeated, monsterId],
        compendium: updatedCompendium,
        inventory: {
          ...prev.inventory,
          hormoneCrystals: prev.inventory.hormoneCrystals + 3,
          knowledgeScrolls: prev.inventory.knowledgeScrolls + 1,
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
      const newGlow = Math.min(1, (newCleared.length / 5));
      const next = {
        ...prev,
        biomesCleared: newCleared,
        estraGlow: newGlow,
        currentBiome: null,
      };
      save(next);
      trackEvent('biome_cleared', { biomeId, totalCleared: newCleared.length });
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
      trackEvent('biome_entered', { biomeId });
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

  const resetGame = useCallback(async () => {
    const fresh = createInitialGameState();
    localStorage.removeItem('menopause-quest-save');
    setState(fresh);
    trackEvent('game_reset');
    if (userId) {
      await supabase.from('game_saves').upsert({
        user_id: userId,
        game_state: fresh as unknown as Json,
      }, { onConflict: 'user_id' });
    }
  }, [userId]);

  const setCharacter = useCallback((profile: CharacterProfile) => {
    setState(prev => {
      const bonuses = getStartingBonuses(profile);
      const next = {
        ...prev,
        character: profile,
        estraBond: prev.estraBond + (bonuses.estraBond || 0),
        inventory: {
          ...prev.inventory,
          ...(bonuses.inventory || {}),
        },
      };
      save(next);
      trackEvent('character_created', { background: profile.background, specialty: profile.specialty, name: profile.name });
      return next;
    });
  }, [save]);

  const meetNpc = useCallback((npcName: string) => {
    setState(prev => {
      if ((prev.npcsMet || []).includes(npcName)) return prev;
      const updatedCompendium = prev.compendium.map(e =>
        (e.npcName === npcName && e.type === 'bio') ? { ...e, unlocked: true } : e
      );
      const next = {
        ...prev,
        npcsMet: [...(prev.npcsMet || []), npcName],
        compendium: updatedCompendium,
      };
      save(next);
      return next;
    });
  }, [save]);

  const claimMilestone = useCallback((milestoneId: string) => {
    setState(prev => {
      const milestone = prev.compendiumMilestones.find(m => m.id === milestoneId);
      if (!milestone || milestone.claimed) return prev;
      const unlockedCount = prev.compendium.filter(e => e.unlocked).length;
      if (unlockedCount < milestone.requiredCount) return prev;

      let newInventory = { ...prev.inventory };
      let newXp = prev.xp;
      if (milestone.reward.type === 'item') {
        newInventory = {
          ...newInventory,
          [milestone.reward.item]: newInventory[milestone.reward.item] + milestone.reward.amount,
        };
      } else {
        newXp += milestone.reward.amount;
      }

      const next = {
        ...prev,
        xp: newXp,
        level: getLevelFromXp(newXp),
        inventory: newInventory,
        compendiumMilestones: prev.compendiumMilestones.map(m =>
          m.id === milestoneId ? { ...m, claimed: true } : m
        ),
      };
      save(next);
      return next;
    });
  }, [save]);

  return (
    <GameContext.Provider value={{
      state, addXp, defeatMonster, clearBiome, unlockCompendiumEntry,
      addInventory, updateEstraGlow, updateEstraBond, resetGame, enterBiome, leaveBiome, setCharacter,
      meetNpc, claimMilestone,
      isLoading,
    }}>
      {children}
    </GameContext.Provider>
  );
};
