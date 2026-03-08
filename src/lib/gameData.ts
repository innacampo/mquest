// ============ TYPES ============
export type BiomeId = 'fever-peaks' | 'fog-marshes' | 'mood-tides' | 'crystal-caverns' | 'heartland' | 'bloom-garden';
export type QuestionFormat = 'mc' | 'visual_id' | 'sort';

export interface Question {
  id: string;
  biome: BiomeId;
  format: QuestionFormat;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: string[];
  correctAnswer: number; // index for mc/visual_id
  correctSort?: Record<string, string[]>; // for sorting
  explanation: string;
}

export interface Monster {
  id: string;
  name: string;
  emoji: string;
  biome: BiomeId;
  myth: string;
  truth: string;
  mechanic: string;
  mechanicDescription: string;
  hp: number;
}

export interface Biome {
  id: BiomeId;
  name: string;
  emoji: string;
  bodySystem: string;
  description: string;
  color: string;
  monsters: string[];
  unlocked: boolean;
}

export interface NPC {
  name: string;
  age?: number;
  biome: BiomeId | 'hub';
  preRemedy: string;
  postRemedy: string;
}

export interface CompendiumEntry {
  id: string;
  type: 'fact' | 'myth' | 'bio';
  title: string;
  content: string;
  biome?: BiomeId;
  unlocked: boolean;
}

export interface GameState {
  level: number;
  xp: number;
  estraBond: number;
  wellness: number;
  currentBiome: BiomeId | null;
  biomesCleared: BiomeId[];
  compendium: CompendiumEntry[];
  monstersDefeated: string[];
  inventory: {
    hormoneCrystals: number;
    wellnessHerbs: number;
    knowledgeScrolls: number;
    bloomEssence: number;
    remedyPotionBasic: number;
    remedyPotionEnhanced: number;
    clarityElixir: number;
    estraBoost: number;
    compendiumSeal: number;
  };
  estraGlow: number; // 0.0 - 1.0
}

// ============ BIOMES ============
export const biomes: Biome[] = [
  {
    id: 'fever-peaks',
    name: 'Fever Peaks',
    emoji: '🌋',
    bodySystem: 'Hypothalamus / Hot Flashes',
    description: 'Volcanic mountains with heat shimmer, magma rivers, and shifting terrain. Temperature spikes cause platforms to vanish momentarily.',
    color: 'glow-amber',
    monsters: ['shame-dragon', 'dismissal-wraith'],
    unlocked: true,
  },
  {
    id: 'fog-marshes',
    name: 'Fog Marshes',
    emoji: '🌫️',
    bodySystem: 'Brain / Cognitive Function',
    description: 'Dense mist, shifting paths, echoing voices. Landmarks vanish and reappear. Memory-check mechanics challenge navigation.',
    color: 'glow-teal',
    monsters: ['silence-specter', 'confusion-cyclone'],
    unlocked: false,
  },
  {
    id: 'mood-tides',
    name: 'Mood Tides',
    emoji: '💜',
    bodySystem: 'Hormones / Mental Health',
    description: 'Dramatic ocean cliffs with unpredictable storms. Emotional NPCs whose dialogue changes based on mood-related quiz responses.',
    color: 'glow-violet',
    monsters: ['shame-tide', 'minimizer'],
    unlocked: false,
  },
  {
    id: 'crystal-caverns',
    name: 'Crystal Caverns',
    emoji: '🦴',
    bodySystem: 'Bone Density / Skeletal Health',
    description: 'Ice caves with bone-like crystal formations. Structures crumble unless reinforced by collecting Calcium Crystals.',
    color: 'glow-teal',
    monsters: ['brittle-giant', 'cold-certainty'],
    unlocked: false,
  },
  {
    id: 'heartland',
    name: 'Heartland Plains',
    emoji: '❤️',
    bodySystem: 'Cardiovascular System',
    description: 'Rolling grasslands crossed by rivers that pulse like a heartbeat. Flow speed indicates cardiovascular health.',
    color: 'glow-rose',
    monsters: ['fog-of-shame', 'heartbreak-myth'],
    unlocked: false,
  },
  {
    id: 'bloom-garden',
    name: 'Bloom Garden',
    emoji: '🌸',
    bodySystem: 'Postmenopause / Restoration',
    description: 'Endgame zone. Fully restored world. Lush, vibrant, radiant. No combat — pure exploration and reflection.',
    color: 'glow-green',
    monsters: ['grand-silencer'],
    unlocked: false,
  },
];

// ============ MONSTERS ============
export const monsters: Monster[] = [
  {
    id: 'shame-dragon',
    name: 'The Shame Dragon',
    emoji: '🐉',
    biome: 'fever-peaks',
    myth: 'Menopause means you are old and irrelevant.',
    truth: 'Menopause is a biological transition, not an ending. Millions of women experience it from their late 30s onward and go on to thrive.',
    mechanic: 'Invisibility',
    mechanicDescription: 'Casts Invisibility — your HP bar vanishes for 2 turns!',
    hp: 100,
  },
  {
    id: 'dismissal-wraith',
    name: 'The Dismissal Wraith',
    emoji: '🌑',
    biome: 'fever-peaks',
    myth: 'Hot flashes are just stress — not medical.',
    truth: 'Hot flashes are a direct physiological result of hypothalamic confusion caused by declining estrogen.',
    mechanic: 'Steal Options',
    mechanicDescription: 'Steals correct answer slots — removes one option per turn!',
    hp: 100,
  },
  {
    id: 'silence-specter',
    name: 'The Silence Specter',
    emoji: '👻',
    biome: 'fog-marshes',
    myth: 'Just push through it alone. Don\'t complain.',
    truth: 'Menopause is manageable with the right support. Medical treatment, community, and open conversation are tools, not weaknesses.',
    mechanic: 'Muffle',
    mechanicDescription: 'Muffles the interface — blurs question text for 8 seconds!',
    hp: 100,
  },
  {
    id: 'confusion-cyclone',
    name: 'The Confusion Cyclone',
    emoji: '🌀',
    biome: 'fog-marshes',
    myth: 'Brain fog is just aging — nothing you can do.',
    truth: 'Cognitive changes during perimenopause are hormone-mediated, often temporary, and treatable.',
    mechanic: 'Scramble',
    mechanicDescription: 'Scrambles answer order every turn!',
    hp: 100,
  },
  {
    id: 'shame-tide',
    name: 'The Shame Tide',
    emoji: '🌊',
    biome: 'mood-tides',
    myth: 'Mood swings mean you\'re irrational.',
    truth: 'Mood changes in perimenopause are neurological responses to hormonal shifts, not character flaws.',
    mechanic: 'Reverse',
    mechanicDescription: 'Reverses damage — wrong answers now heal the monster!',
    hp: 100,
  },
  {
    id: 'minimizer',
    name: 'The Minimizer',
    emoji: '😶',
    biome: 'mood-tides',
    myth: 'Everyone goes through it. Stop making it a big deal.',
    truth: 'Menopause symptoms affect daily life, relationships, and work for many women. Minimising them delays care.',
    mechanic: 'Weaken',
    mechanicDescription: 'Reduces Knowledge Strike damage by 50% for 3 turns!',
    hp: 100,
  },
  {
    id: 'brittle-giant',
    name: 'The Brittle Giant',
    emoji: '🧊',
    biome: 'crystal-caverns',
    myth: 'Bone loss is inevitable. Nothing helps.',
    truth: 'Weight-bearing exercise, calcium, Vitamin D, and medication can significantly reduce bone loss.',
    mechanic: 'Shatter',
    mechanicDescription: 'Shatters the platform — must answer mid-fall!',
    hp: 100,
  },
  {
    id: 'cold-certainty',
    name: 'The Cold Certainty',
    emoji: '❄️',
    biome: 'crystal-caverns',
    myth: 'HRT is dangerous — never take it.',
    truth: 'Modern HRT formulations have been updated. For most healthy women under 60, benefits outweigh risks.',
    mechanic: 'Freeze Timer',
    mechanicDescription: 'Freezes the timer — question must be answered in 8s!',
    hp: 100,
  },
  {
    id: 'fog-of-shame',
    name: 'The Fog of Shame',
    emoji: '💨',
    biome: 'heartland',
    myth: 'Don\'t talk about menopause in public. It\'s private.',
    truth: 'Silence around menopause perpetuates myths and delays care. Open, accurate conversation saves lives.',
    mechanic: 'Silence NPCs',
    mechanicDescription: 'Silences allies — erases visible Compendium progress temporarily!',
    hp: 100,
  },
  {
    id: 'heartbreak-myth',
    name: 'The Heartbreak Myth',
    emoji: '💔',
    biome: 'heartland',
    myth: 'Heart disease is a man\'s problem.',
    truth: 'Cardiovascular disease is the leading cause of death in postmenopausal women.',
    mechanic: 'Drain Bond',
    mechanicDescription: 'Drains Estra Bond by 1 on each wrong answer!',
    hp: 100,
  },
  {
    id: 'grand-silencer',
    name: 'The Grand Silencer',
    emoji: '👑',
    biome: 'bloom-garden',
    myth: 'All myths combined — the sum of systemic silence.',
    truth: 'The greatest myth is that menopause must be suffered in silence. Knowledge is power.',
    mechanic: 'All Phases',
    mechanicDescription: '6-phase boss using different monster mechanics each phase!',
    hp: 100,
  },
];

// ============ QUESTIONS ============
export const questions: Question[] = [
  // FEVER PEAKS
  {
    id: 'fp-1', biome: 'fever-peaks', format: 'mc', difficulty: 'easy',
    text: 'Which organ produces most of the body\'s estrogen?',
    options: ['Adrenal glands', 'Thyroid', 'Ovaries', 'Pituitary gland'],
    correctAnswer: 2,
    explanation: 'The ovaries are the primary source of estrogen in premenopausal women. During menopause, production decreases significantly.',
  },
  {
    id: 'fp-2', biome: 'fever-peaks', format: 'mc', difficulty: 'easy',
    text: 'What is the average age at which menopause occurs?',
    options: ['Around 40', 'Around 45', 'Around 51', 'Around 60'],
    correctAnswer: 2,
    explanation: 'The average age of menopause is 51, though it can occur anywhere from the late 30s to mid-50s.',
  },
  {
    id: 'fp-3', biome: 'fever-peaks', format: 'mc', difficulty: 'medium',
    text: 'What causes hot flashes during menopause?',
    options: ['High blood pressure', 'Hypothalamus dysfunction from estrogen decline', 'Anxiety and stress', 'Excess body heat'],
    correctAnswer: 1,
    explanation: 'Declining estrogen affects the hypothalamus (the body\'s thermostat), causing it to misread body temperature and trigger a hot flash.',
  },
  {
    id: 'fp-4', biome: 'fever-peaks', format: 'mc', difficulty: 'medium',
    text: 'Perimenopause typically begins how many years before the final period?',
    options: ['1–2 years', '4–8 years', '10–15 years', 'Only a few months'],
    correctAnswer: 1,
    explanation: 'Perimenopause can begin 4 to 8 years before menopause, usually starting in the mid-40s but sometimes as early as the mid-30s.',
  },
  {
    id: 'fp-5', biome: 'fever-peaks', format: 'mc', difficulty: 'hard',
    text: 'Which hormone\'s decline is primarily responsible for menopausal symptoms?',
    options: ['Progesterone', 'Testosterone', 'Estrogen', 'Cortisol'],
    correctAnswer: 2,
    explanation: 'While multiple hormones change, declining estrogen is the primary driver of most menopausal symptoms.',
  },
  // FOG MARSHES
  {
    id: 'fm-1', biome: 'fog-marshes', format: 'mc', difficulty: 'easy',
    text: '"Brain fog" during perimenopause is caused by:',
    options: ['Not enough sleep', 'Hormonal changes affecting the brain', 'Early dementia', 'Laziness'],
    correctAnswer: 1,
    explanation: 'Brain fog during perimenopause is linked to fluctuating estrogen levels which affect neurotransmitter function.',
  },
  {
    id: 'fm-2', biome: 'fog-marshes', format: 'mc', difficulty: 'medium',
    text: 'Cognitive changes during perimenopause are typically:',
    options: ['Permanent and worsening', 'A sign of Alzheimer\'s', 'Temporary and hormone-mediated', 'Imaginary'],
    correctAnswer: 2,
    explanation: 'Most cognitive symptoms improve after the menopausal transition as the brain adapts to new hormone levels.',
  },
  {
    id: 'fm-3', biome: 'fog-marshes', format: 'mc', difficulty: 'medium',
    text: 'Which neurotransmitter is affected by estrogen decline, impacting memory?',
    options: ['Dopamine', 'Serotonin', 'Acetylcholine', 'GABA'],
    correctAnswer: 2,
    explanation: 'Acetylcholine, crucial for memory and learning, is influenced by estrogen levels in the brain.',
  },
  {
    id: 'fm-4', biome: 'fog-marshes', format: 'mc', difficulty: 'easy',
    text: 'What can help manage brain fog during perimenopause?',
    options: ['Ignoring it completely', 'Regular exercise and good sleep', 'Drinking more coffee', 'Working harder'],
    correctAnswer: 1,
    explanation: 'Exercise improves blood flow to the brain, and quality sleep supports cognitive function during hormonal changes.',
  },
  // MOOD TIDES
  {
    id: 'mt-1', biome: 'mood-tides', format: 'mc', difficulty: 'easy',
    text: 'Mood changes during perimenopause are primarily caused by:',
    options: ['Personal weakness', 'Neurological responses to hormonal shifts', 'Too much free time', 'Bad attitude'],
    correctAnswer: 1,
    explanation: 'Mood changes are biological, caused by hormonal fluctuations affecting neurotransmitter systems in the brain.',
  },
  {
    id: 'mt-2', biome: 'mood-tides', format: 'mc', difficulty: 'medium',
    text: 'Which is a valid treatment approach for perimenopausal mood changes?',
    options: ['Just trying harder', 'Cognitive behavioral therapy', 'Ignoring symptoms', 'Avoiding all social contact'],
    correctAnswer: 1,
    explanation: 'CBT is an evidence-based treatment that can help manage mood changes during perimenopause, alongside other approaches.',
  },
  {
    id: 'mt-3', biome: 'mood-tides', format: 'mc', difficulty: 'hard',
    text: 'Perimenopausal depression risk increases because estrogen influences:',
    options: ['Blood sugar levels', 'Serotonin and norepinephrine regulation', 'Muscle mass', 'Skin elasticity'],
    correctAnswer: 1,
    explanation: 'Estrogen plays a role in regulating serotonin and norepinephrine, key neurotransmitters involved in mood regulation.',
  },
  // CRYSTAL CAVERNS
  {
    id: 'cc-1', biome: 'crystal-caverns', format: 'mc', difficulty: 'easy',
    text: 'What type of exercise is best for bone health?',
    options: ['Swimming', 'Weight-bearing exercise', 'Stretching only', 'Bed rest'],
    correctAnswer: 1,
    explanation: 'Weight-bearing exercises like walking, dancing, and resistance training stimulate bone formation.',
  },
  {
    id: 'cc-2', biome: 'crystal-caverns', format: 'mc', difficulty: 'medium',
    text: 'After menopause, bone density loss accelerates because:',
    options: ['Gravity increases', 'Estrogen that protected bones declines', 'Calcium stops working', 'Bones naturally dissolve'],
    correctAnswer: 1,
    explanation: 'Estrogen helps maintain bone density. When estrogen declines during menopause, bone resorption increases.',
  },
  {
    id: 'cc-3', biome: 'crystal-caverns', format: 'mc', difficulty: 'medium',
    text: 'Which nutrients are most important for bone health?',
    options: ['Iron and zinc', 'Calcium and Vitamin D', 'Vitamin C and B12', 'Omega-3 and fiber'],
    correctAnswer: 1,
    explanation: 'Calcium is the building block of bone, and Vitamin D is essential for calcium absorption.',
  },
  // HEARTLAND
  {
    id: 'hl-1', biome: 'heartland', format: 'mc', difficulty: 'easy',
    text: 'How does menopause affect cardiovascular risk?',
    options: ['It reduces risk', 'It has no effect', 'Risk increases as estrogen\'s protective effect declines', 'It only affects men'],
    correctAnswer: 2,
    explanation: 'Estrogen has protective effects on the cardiovascular system. After menopause, heart disease risk rises significantly.',
  },
  {
    id: 'hl-2', biome: 'heartland', format: 'mc', difficulty: 'medium',
    text: 'Cardiovascular disease is the leading cause of death in:',
    options: ['Only men over 60', 'Postmenopausal women', 'Teenagers', 'Pre-menopausal women only'],
    correctAnswer: 1,
    explanation: 'Heart disease is the #1 cause of death in postmenopausal women, yet it\'s widely misperceived as a "men\'s disease."',
  },
  {
    id: 'hl-3', biome: 'heartland', format: 'mc', difficulty: 'hard',
    text: 'Which lipid change commonly occurs after menopause?',
    options: ['LDL cholesterol decreases', 'HDL cholesterol increases', 'LDL cholesterol increases', 'Triglycerides decrease'],
    correctAnswer: 2,
    explanation: 'After menopause, LDL ("bad") cholesterol often increases while HDL ("good") cholesterol may decrease.',
  },
];

// ============ COMPENDIUM ============
export const initialCompendium: CompendiumEntry[] = [
  { id: 'fact-1', type: 'fact', title: 'What is Menopause?', content: 'Menopause is the permanent cessation of menstruation, confirmed after 12 consecutive months without a period. It marks the end of reproductive years but not the end of vitality.', biome: 'fever-peaks', unlocked: false },
  { id: 'fact-2', type: 'fact', title: 'The Hypothalamus & Hot Flashes', content: 'The hypothalamus acts as the body\'s thermostat. When estrogen declines, it becomes confused and triggers hot flashes as a false alarm response.', biome: 'fever-peaks', unlocked: false },
  { id: 'fact-3', type: 'fact', title: 'Brain Fog is Real', content: 'Cognitive changes during perimenopause are hormone-mediated and typically temporary. The brain adapts to new hormone levels over time.', biome: 'fog-marshes', unlocked: false },
  { id: 'fact-4', type: 'fact', title: 'Emotions & Hormones', content: 'Mood changes are neurological responses to hormonal shifts, not character flaws. Serotonin and norepinephrine are directly affected by estrogen levels.', biome: 'mood-tides', unlocked: false },
  { id: 'fact-5', type: 'fact', title: 'Bone Health Matters', content: 'After menopause, bone density loss accelerates. Weight-bearing exercise, calcium, and Vitamin D are essential preventive measures.', biome: 'crystal-caverns', unlocked: false },
  { id: 'fact-6', type: 'fact', title: 'Heart Health After Menopause', content: 'Estrogen had protective effects on the cardiovascular system. After menopause, heart disease risk rises significantly.', biome: 'heartland', unlocked: false },
  // Myth cards
  { id: 'myth-1', type: 'myth', title: 'The Shame Dragon\'s Lie', content: 'MYTH: Menopause makes you old and irrelevant. TRUTH: Menopause is a biological transition, not an ending.', biome: 'fever-peaks', unlocked: false },
  { id: 'myth-2', type: 'myth', title: 'The Dismissal Wraith\'s Lie', content: 'MYTH: Hot flashes are just stress. TRUTH: Hot flashes are a direct physiological result of hypothalamic changes.', biome: 'fever-peaks', unlocked: false },
  { id: 'myth-3', type: 'myth', title: 'The Silence Specter\'s Lie', content: 'MYTH: Push through it alone. TRUTH: Support, community, and medical care are tools of strength.', biome: 'fog-marshes', unlocked: false },
  { id: 'myth-4', type: 'myth', title: 'The Confusion Cyclone\'s Lie', content: 'MYTH: Brain fog is just aging. TRUTH: Cognitive changes are hormone-mediated and often temporary.', biome: 'fog-marshes', unlocked: false },
  { id: 'myth-5', type: 'myth', title: 'The Shame Tide\'s Lie', content: 'MYTH: Mood swings make you irrational. TRUTH: Mood changes are neurological, not emotional weakness.', biome: 'mood-tides', unlocked: false },
  { id: 'myth-6', type: 'myth', title: 'The Brittle Giant\'s Lie', content: 'MYTH: Bone loss is inevitable. TRUTH: Exercise, nutrition, and medication can significantly reduce bone loss.', biome: 'crystal-caverns', unlocked: false },
];

// ============ NPCs ============
export const npcs: NPC[] = [
  { name: 'Elena', age: 48, biome: 'fever-peaks', preRemedy: 'I thought it was just stress... everyone kept telling me to relax.', postRemedy: 'It has a name. I\'m not imagining it. Thank you for helping me see that.' },
  { name: 'Dr. Mira', biome: 'hub', preRemedy: 'Welcome to my study. Knowledge is the most powerful medicine.', postRemedy: 'You\'re becoming quite the guardian yourself.' },
  { name: 'Yuki', age: 52, biome: 'fog-marshes', preRemedy: 'I keep losing my words... I\'m afraid I\'m losing myself.', postRemedy: 'I have language for it now. That changes everything.' },
  { name: 'Priya', age: 38, biome: 'mood-tides', preRemedy: 'I\'m too young for this... aren\'t I? The anxiety came out of nowhere.', postRemedy: 'I\'m not too young. And I\'m not broken. I just didn\'t have the words before.' },
  { name: 'Saoirse', age: 45, biome: 'crystal-caverns', preRemedy: 'My mum had osteoporosis. I can feel it coming for me too.', postRemedy: 'I have a plan now. Exercise, calcium, check-ups. I feel in control.' },
  { name: 'Rosa', age: 55, biome: 'heartland', preRemedy: 'Nobody told me menopause could affect my heart. I had an event last year.', postRemedy: 'Now I know. Now I check. Now I\'m proactive about my heart health.' },
];

// ============ INITIAL STATE ============
export const createInitialGameState = (): GameState => ({
  level: 1,
  xp: 0,
  estraBond: 1,
  wellness: 3,
  currentBiome: null,
  biomesCleared: [],
  compendium: initialCompendium.map(e => ({ ...e })),
  monstersDefeated: [],
  inventory: {
    hormoneCrystals: 0,
    wellnessHerbs: 0,
    knowledgeScrolls: 0,
    bloomEssence: 0,
    remedyPotionBasic: 0,
    remedyPotionEnhanced: 0,
    clarityElixir: 0,
    estraBoost: 0,
    compendiumSeal: 0,
  },
  estraGlow: 0.05,
});

// ============ XP / LEVEL HELPERS ============
export const xpForLevel = (level: number): number => {
  // ~8500 XP to reach level 20
  return Math.floor(level * level * 22);
};

export const getLevelFromXp = (xp: number): number => {
  let level = 1;
  while (xpForLevel(level + 1) <= xp && level < 20) {
    level++;
  }
  return level;
};

export const getWorldState = (glow: number): string => {
  if (glow < 0.25) return 'Flux';
  if (glow < 0.5) return 'Aware';
  if (glow < 0.75) return 'Healing';
  return 'Bloom';
};
