import { BiomeId } from './gameData';

// Battle backgrounds
import bgFeverPeaks from '@/assets/battle-bg-fever-peaks.jpg';
import bgFogMarshes from '@/assets/battle-bg-fog-marshes.jpg';
import bgMoodTides from '@/assets/battle-bg-mood-tides.jpg';
import bgCrystalCaverns from '@/assets/battle-bg-crystal-caverns.jpg';
import bgHeartland from '@/assets/battle-bg-heartland.jpg';
import bgBloomGarden from '@/assets/battle-bg-bloom-garden.jpg';

// Title screen
import titleScreenBg from '@/assets/title-screen-bg.jpg';

// Player
import charPlayer from '@/assets/char-player.png';

// Monsters
import monsterShameDragon from '@/assets/monster-shame-dragon.png';
import monsterDismissalWraith from '@/assets/monster-dismissal-wraith.png';
import monsterSilenceSpecter from '@/assets/monster-silence-specter.png';
import monsterConfusionCyclone from '@/assets/monster-confusion-cyclone.png';
import monsterShameTide from '@/assets/monster-shame-tide.png';
import monsterMinimizer from '@/assets/monster-minimizer.png';
import monsterBrittleGiant from '@/assets/monster-brittle-giant.png';
import monsterColdCertainty from '@/assets/monster-cold-certainty.png';
import monsterFogOfShame from '@/assets/monster-fog-of-shame.png';
import monsterHeartbreakMyth from '@/assets/monster-heartbreak-myth.png';
import monsterGrandSilencer from '@/assets/monster-grand-silencer.png';

// NPC portraits
import npcElena from '@/assets/npc-elena.png';
import npcDrMira from '@/assets/npc-dr-mira.png';
import npcYuki from '@/assets/npc-yuki.png';
import npcPriya from '@/assets/npc-priya.png';
import npcSaoirse from '@/assets/npc-saoirse.png';
import npcRosa from '@/assets/npc-rosa.png';

export const battleBackgrounds: Record<BiomeId, string> = {
  'fever-peaks': bgFeverPeaks,
  'fog-marshes': bgFogMarshes,
  'mood-tides': bgMoodTides,
  'crystal-caverns': bgCrystalCaverns,
  'heartland': bgHeartland,
  'bloom-garden': bgBloomGarden,
};

export const monsterSprites: Record<string, string> = {
  'shame-dragon': monsterShameDragon,
  'dismissal-wraith': monsterDismissalWraith,
  'silence-specter': monsterSilenceSpecter,
  'confusion-cyclone': monsterConfusionCyclone,
  'shame-tide': monsterShameTide,
  'minimizer': monsterMinimizer,
  'brittle-giant': monsterBrittleGiant,
  'cold-certainty': monsterColdCertainty,
  'fog-of-shame': monsterFogOfShame,
  'heartbreak-myth': monsterHeartbreakMyth,
  'grand-silencer': monsterGrandSilencer,
};

export const npcPortraits: Record<string, string> = {
  'Elena': npcElena,
  'Dr. Mira': npcDrMira,
  'Yuki': npcYuki,
  'Priya': npcPriya,
  'Saoirse': npcSaoirse,
  'Rosa': npcRosa,
};

export const playerSprite = charPlayer;
export const titleBackground = titleScreenBg;
