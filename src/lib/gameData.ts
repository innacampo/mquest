// ============ TYPES ============
export type BiomeId = 'fever-peaks' | 'fog-marshes' | 'mood-tides' | 'crystal-caverns' | 'heartland' | 'bloom-garden';
export type QuestionFormat = 'mc' | 'visual_id' | 'sort';

export interface Question {
  id: string;
  biome: BiomeId;
  monster: string; // monster id this question belongs to
  format: QuestionFormat;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: string[];
  correctAnswer: number;
  correctSort?: Record<string, string[]>;
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
  type: 'fact' | 'myth' | 'bestiary' | 'bio';
  title: string;
  content: string;
  biome?: BiomeId;
  monsterId?: string;  // links bestiary entries to monsters
  npcName?: string;    // links bio entries to NPCs
  sealOnly?: boolean;  // only unlockable via Compendium Seal
  unlocked: boolean;
}

export interface CompendiumMilestone {
  id: string;
  title: string;
  description: string;
  requiredCount: number; // total unlocked entries needed
  reward: { type: 'item'; item: keyof GameState['inventory']; amount: number } | { type: 'xp'; amount: number };
  claimed: boolean;
}

export type CharacterBackground = 'caregiver' | 'scholar' | 'advocate' | 'explorer';
export type Specialty = 'thermoregulation' | 'neuroscience' | 'cardiology' | 'endocrinology';

export interface CharacterProfile {
  background: CharacterBackground;
  specialty: Specialty;
  name: string; // display name override, defaults to "Lyra"
}

export interface GameState {
  level: number;
  xp: number;
  estraBond: number;
  wellness: number;
  currentBiome: BiomeId | null;
  biomesCleared: BiomeId[];
  compendium: CompendiumEntry[];
  compendiumMilestones: CompendiumMilestone[];
  monstersDefeated: string[];
  npcsMet: string[];  // NPC names the player has spoken to
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
  character: CharacterProfile | null;
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
    mechanic: 'None',
    mechanicDescription: 'A fearsome dragon — no special battle mechanic, but hits hard!',
    hp: 100,
  },
  {
    id: 'dismissal-wraith',
    name: 'The Dismissal Wraith',
    emoji: '🌑',
    biome: 'fever-peaks',
    myth: 'Hot flashes are just stress — not medical.',
    truth: 'Hot flashes are a direct physiological result of hypothalamic confusion caused by declining estrogen.',
    mechanic: 'Dismissive Haste',
    mechanicDescription: 'Dismissive Haste — timer reduced to 10 seconds!',
    hp: 100,
  },
  {
    id: 'silence-specter',
    name: 'The Silence Specter',
    emoji: '👻',
    biome: 'fog-marshes',
    myth: 'Just push through it alone. Don\'t complain.',
    truth: 'Menopause is manageable with the right support. Medical treatment, community, and open conversation are tools, not weaknesses.',
    mechanic: 'Spectral Silence',
    mechanicDescription: 'Spectral Silence — blurs the question text, clearing gradually!',
    hp: 100,
  },
  {
    id: 'confusion-cyclone',
    name: 'The Confusion Cyclone',
    emoji: '🌀',
    biome: 'fog-marshes',
    myth: 'Brain fog is just aging — nothing you can do.',
    truth: 'Cognitive changes during perimenopause are hormone-mediated, often temporary, and treatable.',
    mechanic: 'Whirlwind Scramble',
    mechanicDescription: 'Whirlwind Scramble — answer options are randomly shuffled each turn!',
    hp: 100,
  },
  {
    id: 'shame-tide',
    name: 'The Shame Tide',
    emoji: '🌊',
    biome: 'mood-tides',
    myth: 'Mood swings mean you\'re irrational.',
    truth: 'Mood changes in perimenopause are neurological responses to hormonal shifts, not character flaws.',
    mechanic: 'Tidal Drain',
    mechanicDescription: 'Tidal Drain — each turn may consume one of your potions automatically!',
    hp: 100,
  },
  {
    id: 'minimizer',
    name: 'The Minimizer',
    emoji: '😶',
    biome: 'mood-tides',
    myth: 'Everyone goes through it. Stop making it a big deal.',
    truth: 'Menopause symptoms affect daily life, relationships, and work for many women. Minimising them delays care.',
    mechanic: 'Minimizing Gaze',
    mechanicDescription: 'Minimizing Gaze — answer text shrinks over time, act fast!',
    hp: 100,
  },
  {
    id: 'brittle-giant',
    name: 'The Brittle Giant',
    emoji: '🧊',
    biome: 'crystal-caverns',
    myth: 'Bone loss is inevitable. Nothing helps.',
    truth: 'Weight-bearing exercise, calcium, Vitamin D, and medication can significantly reduce bone loss.',
    mechanic: 'Crumbling Choices',
    mechanicDescription: 'Crumbling Choices — answers fade away over time, including the right one!',
    hp: 100,
  },
  {
    id: 'cold-certainty',
    name: 'The Cold Certainty',
    emoji: '❄️',
    biome: 'crystal-caverns',
    myth: 'HRT is dangerous — never take it.',
    truth: 'Modern HRT formulations have been updated. For most healthy women under 60, benefits outweigh risks.',
    mechanic: 'Frozen Deceit',
    mechanicDescription: 'Frozen Deceit — one wrong answer glows like the correct one!',
    hp: 100,
  },
  {
    id: 'fog-of-shame',
    name: 'The Fog of Shame',
    emoji: '💨',
    biome: 'heartland',
    myth: 'Don\'t talk about menopause in public. It\'s private.',
    truth: 'Silence around menopause perpetuates myths and delays care. Open, accurate conversation saves lives.',
    mechanic: 'Creeping Fog',
    mechanicDescription: 'Creeping Fog — the screen fills with fog as the timer runs down!',
    hp: 100,
  },
  {
    id: 'heartbreak-myth',
    name: 'The Heartbreak Myth',
    emoji: '💔',
    biome: 'heartland',
    myth: 'Heart disease is a man\'s problem.',
    truth: 'Cardiovascular disease is the leading cause of death in postmenopausal women.',
    mechanic: 'Heartbreak',
    mechanicDescription: 'Heartbreak — your combo decays each turn, keep the streak alive!',
    hp: 100,
  },
  {
    id: 'grand-silencer',
    name: 'The Grand Silencer',
    emoji: '👑',
    biome: 'bloom-garden',
    myth: 'All myths combined — the sum of systemic silence.',
    truth: 'The greatest myth is that menopause must be suffered in silence. Knowledge is power.',
    mechanic: 'Grand Silence',
    mechanicDescription: 'Grand Silence — blurred questions AND scrambled answers combined!',
    hp: 100,
  },
];

// ============ QUESTIONS ============
export const questions: Question[] = [
  // ========== FEVER PEAKS — SHAME DRAGON ==========
  { id: 'sd-1', biome: 'fever-peaks', monster: 'shame-dragon', format: 'mc', difficulty: 'easy',
    text: 'Which organ produces most of the body\'s estrogen?',
    options: ['Adrenal glands', 'Thyroid', 'Ovaries', 'Pituitary gland'], correctAnswer: 2,
    explanation: 'The ovaries are the primary source of estrogen in premenopausal women.' },
  { id: 'sd-2', biome: 'fever-peaks', monster: 'shame-dragon', format: 'mc', difficulty: 'easy',
    text: 'What is the average age at which menopause occurs?',
    options: ['Around 40', 'Around 45', 'Around 51', 'Around 60'], correctAnswer: 2,
    explanation: 'The average age of menopause is 51, though it can occur from the late 30s to mid-50s.' },
  { id: 'sd-3', biome: 'fever-peaks', monster: 'shame-dragon', format: 'mc', difficulty: 'medium',
    text: 'Perimenopause typically begins how many years before the final period?',
    options: ['1–2 years', '4–8 years', '10–15 years', 'Only a few months'], correctAnswer: 1,
    explanation: 'Perimenopause can begin 4 to 8 years before menopause.' },
  { id: 'sd-4', biome: 'fever-peaks', monster: 'shame-dragon', format: 'mc', difficulty: 'hard',
    text: 'Which hormone\'s decline is primarily responsible for menopausal symptoms?',
    options: ['Progesterone', 'Testosterone', 'Estrogen', 'Cortisol'], correctAnswer: 2,
    explanation: 'Declining estrogen is the primary driver of most menopausal symptoms.' },
  { id: 'sd-5', biome: 'fever-peaks', monster: 'shame-dragon', format: 'mc', difficulty: 'easy',
    text: 'Menopause is officially confirmed after how many months without a period?',
    options: ['3 months', '6 months', '12 months', '24 months'], correctAnswer: 2,
    explanation: 'Menopause is confirmed after 12 consecutive months without a menstrual period.' },
  { id: 'sd-6', biome: 'fever-peaks', monster: 'shame-dragon', format: 'mc', difficulty: 'medium',
    text: 'Menopause is a natural biological process that:',
    options: ['Only affects unhealthy women', 'Every woman with ovaries will experience', 'Can be prevented with diet', 'Is a modern disease'], correctAnswer: 1,
    explanation: 'Menopause is universal for all women with functioning ovaries — it is not a disease or disorder.' },
  { id: 'sd-7', biome: 'fever-peaks', monster: 'shame-dragon', format: 'mc', difficulty: 'hard',
    text: 'Premature menopause occurs before age:',
    options: ['45', '40', '50', '35'], correctAnswer: 1,
    explanation: 'Menopause before age 40 is considered premature ovarian insufficiency and affects about 1% of women.' },

  // ========== FEVER PEAKS — DISMISSAL WRAITH ==========
  { id: 'dw-1', biome: 'fever-peaks', monster: 'dismissal-wraith', format: 'mc', difficulty: 'medium',
    text: 'What causes hot flashes during menopause?',
    options: ['High blood pressure', 'Hypothalamus dysfunction from estrogen decline', 'Anxiety and stress', 'Excess body heat'], correctAnswer: 1,
    explanation: 'Declining estrogen affects the hypothalamus, causing it to misread body temperature and trigger a hot flash.' },
  { id: 'dw-2', biome: 'fever-peaks', monster: 'dismissal-wraith', format: 'mc', difficulty: 'easy',
    text: 'How long can a single hot flash typically last?',
    options: ['1–2 seconds', '30 seconds to 5 minutes', 'About an hour', 'All day'], correctAnswer: 1,
    explanation: 'Most hot flashes last between 30 seconds and 5 minutes.' },
  { id: 'dw-3', biome: 'fever-peaks', monster: 'dismissal-wraith', format: 'mc', difficulty: 'medium',
    text: 'Night sweats are:',
    options: ['Unrelated to menopause', 'Hot flashes that occur during sleep', 'Caused by too many blankets', 'Only psychological'], correctAnswer: 1,
    explanation: 'Night sweats are hot flashes that happen during sleep, disrupting sleep quality.' },
  { id: 'dw-4', biome: 'fever-peaks', monster: 'dismissal-wraith', format: 'mc', difficulty: 'hard',
    text: 'Which part of the brain acts as the body\'s thermostat?',
    options: ['Cerebellum', 'Amygdala', 'Hypothalamus', 'Hippocampus'], correctAnswer: 2,
    explanation: 'The hypothalamus regulates body temperature. Estrogen decline makes it more sensitive.' },
  { id: 'dw-5', biome: 'fever-peaks', monster: 'dismissal-wraith', format: 'mc', difficulty: 'medium',
    text: 'Which lifestyle change can help reduce hot flash frequency?',
    options: ['Eating spicy food', 'Avoiding triggers like caffeine and alcohol', 'Wearing heavy layers', 'Taking very hot baths'], correctAnswer: 1,
    explanation: 'Common triggers include caffeine, alcohol, spicy foods, and hot environments.' },
  { id: 'dw-6', biome: 'fever-peaks', monster: 'dismissal-wraith', format: 'mc', difficulty: 'easy',
    text: 'Hot flashes affect approximately what percentage of menopausal women?',
    options: ['About 10%', 'About 25%', 'About 50%', 'About 75%'], correctAnswer: 3,
    explanation: 'Up to 75% of menopausal women experience hot flashes, making it the most common symptom.' },
  { id: 'dw-7', biome: 'fever-peaks', monster: 'dismissal-wraith', format: 'mc', difficulty: 'hard',
    text: 'The thermoneutral zone narrows during menopause, meaning:',
    options: ['Women tolerate all temperatures', 'Small temperature changes trigger hot flashes', 'Body temperature drops permanently', 'Sweating stops'], correctAnswer: 1,
    explanation: 'A narrowed thermoneutral zone means even minor temperature shifts trigger the body\'s cooling response.' },

  // ========== FOG MARSHES — SILENCE SPECTER ==========
  { id: 'ss-1', biome: 'fog-marshes', monster: 'silence-specter', format: 'mc', difficulty: 'easy',
    text: 'What can help manage brain fog during perimenopause?',
    options: ['Ignoring it completely', 'Regular exercise and good sleep', 'Drinking more coffee', 'Working harder'], correctAnswer: 1,
    explanation: 'Exercise improves blood flow to the brain, and quality sleep supports cognitive function.' },
  { id: 'ss-2', biome: 'fog-marshes', monster: 'silence-specter', format: 'mc', difficulty: 'easy',
    text: 'Which best describes "brain fog"?',
    options: ['A medical diagnosis', 'Difficulty concentrating, forgetfulness, and mental cloudiness', 'A type of headache', 'Loss of consciousness'], correctAnswer: 1,
    explanation: 'Brain fog refers to cognitive symptoms like poor concentration and difficulty thinking clearly.' },
  { id: 'ss-3', biome: 'fog-marshes', monster: 'silence-specter', format: 'mc', difficulty: 'medium',
    text: 'Seeking medical help for menopause symptoms is:',
    options: ['Unnecessary drama', 'A sign of strength and self-advocacy', 'Only for severe cases', 'Wasting the doctor\'s time'], correctAnswer: 1,
    explanation: 'Seeking help is proactive healthcare. Menopause symptoms are treatable and deserve medical attention.' },
  { id: 'ss-4', biome: 'fog-marshes', monster: 'silence-specter', format: 'mc', difficulty: 'easy',
    text: 'Word-finding difficulty during perimenopause is:',
    options: ['A sign of serious decline', 'Very common and usually temporary', 'Extremely rare', 'Only in women over 60'], correctAnswer: 1,
    explanation: 'Tip-of-the-tongue moments are well-documented and usually temporary during perimenopause.' },
  { id: 'ss-5', biome: 'fog-marshes', monster: 'silence-specter', format: 'mc', difficulty: 'hard',
    text: 'Research suggests perimenopausal brain fog is most similar to:',
    options: ['Permanent brain damage', 'The cognitive effects of sleep deprivation', 'Schizophrenia', 'Concussion'], correctAnswer: 1,
    explanation: 'Studies show perimenopausal cognitive symptoms resemble sleep deprivation — temporary and reversible.' },
  { id: 'ss-6', biome: 'fog-marshes', monster: 'silence-specter', format: 'mc', difficulty: 'medium',
    text: 'Support groups and peer communities during menopause:',
    options: ['Are a waste of time', 'Can significantly reduce isolation and improve outcomes', 'Only help severe cases', 'Are not evidence-based'], correctAnswer: 1,
    explanation: 'Peer support reduces isolation, provides practical tips, and improves emotional wellbeing.' },
  { id: 'ss-7', biome: 'fog-marshes', monster: 'silence-specter', format: 'mc', difficulty: 'medium',
    text: 'Talking about menopause openly in the workplace:',
    options: ['Is unprofessional', 'Can improve policies and reduce stigma', 'Should always be avoided', 'Only benefits older women'], correctAnswer: 1,
    explanation: 'Open workplace conversations lead to better support, accommodations, and reduced stigma for all.' },

  // ========== FOG MARSHES — CONFUSION CYCLONE ==========
  { id: 'cc2-1', biome: 'fog-marshes', monster: 'confusion-cyclone', format: 'mc', difficulty: 'easy',
    text: '"Brain fog" during perimenopause is caused by:',
    options: ['Not enough sleep', 'Hormonal changes affecting the brain', 'Early dementia', 'Laziness'], correctAnswer: 1,
    explanation: 'Brain fog is linked to fluctuating estrogen levels which affect neurotransmitter function.' },
  { id: 'cc2-2', biome: 'fog-marshes', monster: 'confusion-cyclone', format: 'mc', difficulty: 'medium',
    text: 'Cognitive changes during perimenopause are typically:',
    options: ['Permanent and worsening', 'A sign of Alzheimer\'s', 'Temporary and hormone-mediated', 'Imaginary'], correctAnswer: 2,
    explanation: 'Most cognitive symptoms improve after the menopausal transition as the brain adapts.' },
  { id: 'cc2-3', biome: 'fog-marshes', monster: 'confusion-cyclone', format: 'mc', difficulty: 'medium',
    text: 'Which neurotransmitter is affected by estrogen decline, impacting memory?',
    options: ['Dopamine', 'Serotonin', 'Acetylcholine', 'GABA'], correctAnswer: 2,
    explanation: 'Acetylcholine, crucial for memory and learning, is influenced by estrogen levels.' },
  { id: 'cc2-4', biome: 'fog-marshes', monster: 'confusion-cyclone', format: 'mc', difficulty: 'medium',
    text: 'Estrogen receptors in the brain are concentrated in areas responsible for:',
    options: ['Vision and hearing', 'Memory and executive function', 'Taste and smell', 'Reflexes only'], correctAnswer: 1,
    explanation: 'The hippocampus and prefrontal cortex are rich in estrogen receptors.' },
  { id: 'cc2-5', biome: 'fog-marshes', monster: 'confusion-cyclone', format: 'mc', difficulty: 'medium',
    text: 'Which activity has been shown to improve cognitive function during perimenopause?',
    options: ['Watching more TV', 'Aerobic exercise', 'Reducing all mental stimulation', 'Eating more sugar'], correctAnswer: 1,
    explanation: 'Aerobic exercise increases blood flow to the brain and promotes neuroplasticity.' },
  { id: 'cc2-6', biome: 'fog-marshes', monster: 'confusion-cyclone', format: 'mc', difficulty: 'hard',
    text: 'Neuroplasticity during perimenopause means the brain can:',
    options: ['No longer change', 'Rewire and adapt to new hormone levels', 'Only deteriorate', 'Grow new bones'], correctAnswer: 1,
    explanation: 'The brain retains its ability to form new neural connections and adapt even during hormonal changes.' },
  { id: 'cc2-7', biome: 'fog-marshes', monster: 'confusion-cyclone', format: 'mc', difficulty: 'easy',
    text: 'Multitasking difficulty during perimenopause is:',
    options: ['A sign of laziness', 'Related to hormonal effects on attention', 'Not a real symptom', 'Only in your imagination'], correctAnswer: 1,
    explanation: 'Hormonal changes affect attention and working memory, making multitasking harder temporarily.' },

  // ========== MOOD TIDES — SHAME TIDE ==========
  { id: 'st-1', biome: 'mood-tides', monster: 'shame-tide', format: 'mc', difficulty: 'easy',
    text: 'Mood changes during perimenopause are primarily caused by:',
    options: ['Personal weakness', 'Neurological responses to hormonal shifts', 'Too much free time', 'Bad attitude'], correctAnswer: 1,
    explanation: 'Mood changes are biological, caused by hormonal fluctuations affecting neurotransmitter systems.' },
  { id: 'st-2', biome: 'mood-tides', monster: 'shame-tide', format: 'mc', difficulty: 'hard',
    text: 'Perimenopausal depression risk increases because estrogen influences:',
    options: ['Blood sugar levels', 'Serotonin and norepinephrine regulation', 'Muscle mass', 'Skin elasticity'], correctAnswer: 1,
    explanation: 'Estrogen plays a role in regulating serotonin and norepinephrine, key mood neurotransmitters.' },
  { id: 'st-3', biome: 'mood-tides', monster: 'shame-tide', format: 'mc', difficulty: 'easy',
    text: 'Irritability during perimenopause is:',
    options: ['A character flaw', 'A well-documented symptom with biological causes', 'Only for some personalities', 'Not a real symptom'], correctAnswer: 1,
    explanation: 'Irritability is one of the most commonly reported perimenopausal symptoms.' },
  { id: 'st-4', biome: 'mood-tides', monster: 'shame-tide', format: 'mc', difficulty: 'medium',
    text: 'Anxiety during perimenopause can be caused by:',
    options: ['Only life stress', 'Fluctuating progesterone and its effect on GABA', 'Overthinking', 'Lack of willpower'], correctAnswer: 1,
    explanation: 'Progesterone has a calming effect through GABA receptors. When it fluctuates, anxiety increases.' },
  { id: 'st-5', biome: 'mood-tides', monster: 'shame-tide', format: 'mc', difficulty: 'hard',
    text: 'Which is NOT typically associated with perimenopausal mood changes?',
    options: ['Anxiety', 'Irritability', 'Persistent hallucinations', 'Tearfulness'], correctAnswer: 2,
    explanation: 'Persistent hallucinations are not a perimenopause symptom and should be evaluated separately.' },
  { id: 'st-6', biome: 'mood-tides', monster: 'shame-tide', format: 'mc', difficulty: 'medium',
    text: 'Crying more easily during perimenopause is:',
    options: ['A sign of mental illness', 'Linked to estrogen\'s effect on emotional processing', 'Something to be ashamed of', 'Completely unrelated to hormones'], correctAnswer: 1,
    explanation: 'Estrogen affects the amygdala and emotional regulation centres, making emotional responses more intense.' },
  { id: 'st-7', biome: 'mood-tides', monster: 'shame-tide', format: 'mc', difficulty: 'easy',
    text: 'Feeling "not like yourself" during perimenopause is:',
    options: ['Rare and unusual', 'Extremely common and has biological roots', 'A sign you need to try harder', 'All in your head'], correctAnswer: 1,
    explanation: 'Many women report feeling different during perimenopause — this is a well-documented hormonal effect.' },

  // ========== MOOD TIDES — MINIMIZER ==========
  { id: 'mn-1', biome: 'mood-tides', monster: 'minimizer', format: 'mc', difficulty: 'medium',
    text: 'Which is a valid treatment approach for perimenopausal mood changes?',
    options: ['Just trying harder', 'Cognitive behavioral therapy', 'Ignoring symptoms', 'Avoiding all social contact'], correctAnswer: 1,
    explanation: 'CBT is evidence-based and can help manage mood changes during perimenopause.' },
  { id: 'mn-2', biome: 'mood-tides', monster: 'minimizer', format: 'mc', difficulty: 'easy',
    text: 'Women with a history of depression have:',
    options: ['No increased risk during perimenopause', 'A higher risk of mood symptoms during the transition', 'Guaranteed severe depression', 'Nothing to worry about'], correctAnswer: 1,
    explanation: 'Previous depression is a risk factor for perimenopausal mood symptoms.' },
  { id: 'mn-3', biome: 'mood-tides', monster: 'minimizer', format: 'mc', difficulty: 'medium',
    text: 'Social support during perimenopause:',
    options: ['Has no proven benefit', 'Is a sign of weakness', 'Is strongly linked to better mental health outcomes', 'Should be avoided'], correctAnswer: 2,
    explanation: 'Research consistently shows social connection improves mental health during the menopausal transition.' },
  { id: 'mn-4', biome: 'mood-tides', monster: 'minimizer', format: 'mc', difficulty: 'medium',
    text: 'Minimizing menopause symptoms ("everyone goes through it") is harmful because:',
    options: ['It encourages resilience', 'It delays women from seeking proper medical care', 'It has no effect', 'It\'s actually helpful'], correctAnswer: 1,
    explanation: 'Minimization leads to suffering in silence and delays treatment that could significantly improve quality of life.' },
  { id: 'mn-5', biome: 'mood-tides', monster: 'minimizer', format: 'mc', difficulty: 'easy',
    text: 'The impact of menopause on daily life:',
    options: ['Is always minimal', 'Varies greatly and can be significant for many women', 'Is the same for everyone', 'Only affects mood'], correctAnswer: 1,
    explanation: 'Menopause affects women differently — some have mild symptoms while others experience significant disruption.' },
  { id: 'mn-6', biome: 'mood-tides', monster: 'minimizer', format: 'mc', difficulty: 'hard',
    text: 'Menopause-related sleep disruption can lead to:',
    options: ['No real problems', 'Increased anxiety, depression, and reduced cognitive function', 'Better rest overall', 'Only mild inconvenience'], correctAnswer: 1,
    explanation: 'Poor sleep compounds other symptoms, creating a cycle of fatigue, mood changes, and cognitive difficulties.' },
  { id: 'mn-7', biome: 'mood-tides', monster: 'minimizer', format: 'mc', difficulty: 'easy',
    text: 'A woman says "my menopause symptoms are really affecting my work." The best response is:',
    options: ['"Everyone deals with it"', '"That\'s valid — have you spoken to your doctor?"', '"It\'s not that bad"', '"Just push through"'], correctAnswer: 1,
    explanation: 'Validating the experience and encouraging medical support is the most helpful response.' },

  // ========== CRYSTAL CAVERNS — BRITTLE GIANT ==========
  { id: 'bg2-1', biome: 'crystal-caverns', monster: 'brittle-giant', format: 'mc', difficulty: 'easy',
    text: 'What type of exercise is best for bone health?',
    options: ['Swimming', 'Weight-bearing exercise', 'Stretching only', 'Bed rest'], correctAnswer: 1,
    explanation: 'Weight-bearing exercises like walking, dancing, and resistance training stimulate bone formation.' },
  { id: 'bg2-2', biome: 'crystal-caverns', monster: 'brittle-giant', format: 'mc', difficulty: 'medium',
    text: 'After menopause, bone density loss accelerates because:',
    options: ['Gravity increases', 'Estrogen that protected bones declines', 'Calcium stops working', 'Bones naturally dissolve'], correctAnswer: 1,
    explanation: 'Estrogen helps maintain bone density. When it declines, bone resorption increases.' },
  { id: 'bg2-3', biome: 'crystal-caverns', monster: 'brittle-giant', format: 'mc', difficulty: 'easy',
    text: 'Osteoporosis means:',
    options: ['Strong bones', 'Porous, weakened bones', 'Inflamed joints', 'Muscle deterioration'], correctAnswer: 1,
    explanation: 'Osteoporosis literally means "porous bone" — fragile and prone to fracture.' },
  { id: 'bg2-4', biome: 'crystal-caverns', monster: 'brittle-giant', format: 'mc', difficulty: 'hard',
    text: 'In the first 5 years after menopause, women can lose up to what percentage of bone density?',
    options: ['1–2%', '5–10%', 'Up to 20%', 'Over 50%'], correctAnswer: 2,
    explanation: 'Women can lose up to 20% of bone density in the 5–7 years following menopause.' },
  { id: 'bg2-5', biome: 'crystal-caverns', monster: 'brittle-giant', format: 'mc', difficulty: 'easy',
    text: 'A DEXA scan measures:',
    options: ['Blood pressure', 'Bone mineral density', 'Hormone levels', 'Muscle mass'], correctAnswer: 1,
    explanation: 'DEXA is the standard test for measuring bone mineral density.' },
  { id: 'bg2-6', biome: 'crystal-caverns', monster: 'brittle-giant', format: 'mc', difficulty: 'medium',
    text: 'Which of these increases the risk of osteoporosis?',
    options: ['Regular strength training', 'Smoking and excessive alcohol', 'Eating dairy products', 'Walking daily'], correctAnswer: 1,
    explanation: 'Smoking and excessive alcohol both accelerate bone loss and increase fracture risk.' },
  { id: 'bg2-7', biome: 'crystal-caverns', monster: 'brittle-giant', format: 'mc', difficulty: 'medium',
    text: 'The most common fracture sites in osteoporosis are:',
    options: ['Fingers and toes', 'Hip, spine, and wrist', 'Skull and ribs', 'Knees only'], correctAnswer: 1,
    explanation: 'The hip, spine, and wrist are the most vulnerable sites for osteoporotic fractures.' },

  // ========== CRYSTAL CAVERNS — COLD CERTAINTY ==========
  { id: 'ck-1', biome: 'crystal-caverns', monster: 'cold-certainty', format: 'mc', difficulty: 'medium',
    text: 'Which nutrients are most important for bone health?',
    options: ['Iron and zinc', 'Calcium and Vitamin D', 'Vitamin C and B12', 'Omega-3 and fiber'], correctAnswer: 1,
    explanation: 'Calcium is the building block of bone, and Vitamin D is essential for calcium absorption.' },
  { id: 'ck-2', biome: 'crystal-caverns', monster: 'cold-certainty', format: 'mc', difficulty: 'medium',
    text: 'How much calcium per day do postmenopausal women typically need?',
    options: ['200 mg', '500 mg', '1,200 mg', '3,000 mg'], correctAnswer: 2,
    explanation: 'Most guidelines recommend 1,200 mg of calcium daily for postmenopausal women.' },
  { id: 'ck-3', biome: 'crystal-caverns', monster: 'cold-certainty', format: 'mc', difficulty: 'hard',
    text: 'Modern HRT for bone protection:',
    options: ['Is always dangerous', 'Can help maintain bone density when benefits outweigh risks', 'Has no effect on bones', 'Is only for men'], correctAnswer: 1,
    explanation: 'For most healthy women under 60, HRT can help maintain bone density with benefits often outweighing risks.' },
  { id: 'ck-4', biome: 'crystal-caverns', monster: 'cold-certainty', format: 'mc', difficulty: 'easy',
    text: 'Vitamin D is important for bones because it:',
    options: ['Makes bones harder', 'Helps the body absorb calcium', 'Replaces estrogen', 'Has no real effect'], correctAnswer: 1,
    explanation: 'Without adequate Vitamin D, the body cannot effectively absorb calcium from food.' },
  { id: 'ck-5', biome: 'crystal-caverns', monster: 'cold-certainty', format: 'mc', difficulty: 'medium',
    text: 'The claim "HRT is always dangerous" is:',
    options: ['Completely true', 'An outdated oversimplification based on one flawed study', 'Backed by current science', 'Only true for young women'], correctAnswer: 1,
    explanation: 'The WHI study was widely misinterpreted. Modern evidence shows HRT is safe for most women when started appropriately.' },
  { id: 'ck-6', biome: 'crystal-caverns', monster: 'cold-certainty', format: 'mc', difficulty: 'hard',
    text: 'Bisphosphonates are medications that:',
    options: ['Speed up bone breakdown', 'Slow down bone loss by inhibiting osteoclasts', 'Only treat pain', 'Replace lost calcium'], correctAnswer: 1,
    explanation: 'Bisphosphonates work by reducing the activity of osteoclasts, the cells that break down bone.' },
  { id: 'ck-7', biome: 'crystal-caverns', monster: 'cold-certainty', format: 'mc', difficulty: 'easy',
    text: 'Bone health is best maintained by:',
    options: ['Avoiding all activity', 'A combination of exercise, nutrition, and medical care', 'Calcium supplements alone', 'Accepting bone loss as inevitable'], correctAnswer: 1,
    explanation: 'A multi-pronged approach combining exercise, nutrition, and medical oversight is most effective.' },

  // ========== HEARTLAND — FOG OF SHAME ==========
  { id: 'fs-1', biome: 'heartland', monster: 'fog-of-shame', format: 'mc', difficulty: 'easy',
    text: 'How does menopause affect cardiovascular risk?',
    options: ['It reduces risk', 'It has no effect', 'Risk increases as estrogen\'s protective effect declines', 'It only affects men'], correctAnswer: 2,
    explanation: 'Estrogen has protective effects on the cardiovascular system. After menopause, risk rises.' },
  { id: 'fs-2', biome: 'heartland', monster: 'fog-of-shame', format: 'mc', difficulty: 'easy',
    text: 'Estrogen helps blood vessels by:',
    options: ['Making them rigid', 'Keeping them flexible and dilated', 'Shrinking them', 'Having no effect'], correctAnswer: 1,
    explanation: 'Estrogen promotes blood vessel elasticity and healthy blood flow.' },
  { id: 'fs-3', biome: 'heartland', monster: 'fog-of-shame', format: 'mc', difficulty: 'easy',
    text: 'Which lifestyle factor most reduces cardiovascular risk after menopause?',
    options: ['Taking more naps', 'Regular physical activity', 'Eating more red meat', 'Avoiding sunlight'], correctAnswer: 1,
    explanation: 'Regular exercise strengthens the heart and helps maintain healthy blood pressure.' },
  { id: 'fs-4', biome: 'heartland', monster: 'fog-of-shame', format: 'mc', difficulty: 'medium',
    text: 'Talking openly about menopause and heart health:',
    options: ['Is embarrassing', 'Saves lives by encouraging proactive screening', 'Has no benefit', 'Only matters for doctors'], correctAnswer: 1,
    explanation: 'Open conversation leads to earlier screening, diagnosis, and life-saving prevention.' },
  { id: 'fs-5', biome: 'heartland', monster: 'fog-of-shame', format: 'mc', difficulty: 'medium',
    text: 'The Mediterranean diet is recommended for heart health because it:',
    options: ['Eliminates all fat', 'Is rich in healthy fats, fiber, and antioxidants', 'Focuses on red meat', 'Avoids all carbs'], correctAnswer: 1,
    explanation: 'The Mediterranean diet emphasizes olive oil, fish, vegetables, and whole grains.' },
  { id: 'fs-6', biome: 'heartland', monster: 'fog-of-shame', format: 'mc', difficulty: 'hard',
    text: 'Women who discuss menopause with their doctor are more likely to:',
    options: ['Be dismissed', 'Receive preventive heart screenings', 'Waste time', 'Get unnecessary medication'], correctAnswer: 1,
    explanation: 'Women who raise menopause in medical consultations are more likely to receive comprehensive cardiovascular screening.' },
  { id: 'fs-7', biome: 'heartland', monster: 'fog-of-shame', format: 'mc', difficulty: 'easy',
    text: 'Shame about menopause can lead to:',
    options: ['Better outcomes', 'Delayed medical care and worse health', 'No real consequence', 'Faster recovery'], correctAnswer: 1,
    explanation: 'Shame prevents women from seeking help, leading to delayed diagnosis and treatment.' },

  // ========== HEARTLAND — HEARTBREAK MYTH ==========
  { id: 'hm-1', biome: 'heartland', monster: 'heartbreak-myth', format: 'mc', difficulty: 'medium',
    text: 'Cardiovascular disease is the leading cause of death in:',
    options: ['Only men over 60', 'Postmenopausal women', 'Teenagers', 'Pre-menopausal women only'], correctAnswer: 1,
    explanation: 'Heart disease is the #1 killer of postmenopausal women, yet widely misperceived as a "men\'s disease."' },
  { id: 'hm-2', biome: 'heartland', monster: 'heartbreak-myth', format: 'mc', difficulty: 'hard',
    text: 'Which lipid change commonly occurs after menopause?',
    options: ['LDL decreases', 'HDL increases', 'LDL cholesterol increases', 'Triglycerides decrease'], correctAnswer: 2,
    explanation: 'After menopause, LDL ("bad") cholesterol often increases while HDL may decrease.' },
  { id: 'hm-3', biome: 'heartland', monster: 'heartbreak-myth', format: 'mc', difficulty: 'medium',
    text: 'Heart disease symptoms in women often differ from men. Women may experience:',
    options: ['Only chest pain', 'Jaw pain, nausea, and unusual fatigue', 'No symptoms ever', 'Only arm pain'], correctAnswer: 1,
    explanation: 'Women\'s heart attack symptoms can be subtler — including jaw pain, nausea, and extreme fatigue.' },
  { id: 'hm-4', biome: 'heartland', monster: 'heartbreak-myth', format: 'mc', difficulty: 'hard',
    text: 'Blood pressure after menopause tends to:',
    options: ['Decrease significantly', 'Stay exactly the same', 'Rise due to loss of estrogen\'s vasodilating effect', 'Become random'], correctAnswer: 2,
    explanation: 'Without estrogen\'s vasodilating effect, blood vessels become less flexible, often raising blood pressure.' },
  { id: 'hm-5', biome: 'heartland', monster: 'heartbreak-myth', format: 'mc', difficulty: 'easy',
    text: 'The myth that heart disease is a "man\'s problem" is dangerous because:',
    options: ['It\'s actually true', 'Women delay seeking help, leading to worse outcomes', 'It doesn\'t affect treatment', 'Men are more at risk'], correctAnswer: 1,
    explanation: 'This myth causes women to underestimate their risk and delay life-saving medical attention.' },
  { id: 'hm-6', biome: 'heartland', monster: 'heartbreak-myth', format: 'mc', difficulty: 'medium',
    text: 'After menopause, metabolic syndrome risk increases due to:',
    options: ['Better metabolism', 'Changes in fat distribution and insulin resistance', 'Improved diet', 'Less stress'], correctAnswer: 1,
    explanation: 'Hormonal changes shift fat distribution to the abdomen and increase insulin resistance.' },
  { id: 'hm-7', biome: 'heartland', monster: 'heartbreak-myth', format: 'mc', difficulty: 'easy',
    text: 'Regular blood pressure monitoring after menopause is:',
    options: ['Unnecessary', 'An important preventive measure', 'Only for those with symptoms', 'A waste of time'], correctAnswer: 1,
    explanation: 'Regular monitoring catches hypertension early, when it\'s most treatable.' },

  // ========== BLOOM GARDEN — GRAND SILENCER ==========
  { id: 'gs-1', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'easy',
    text: 'Hormone Replacement Therapy (HRT) can help manage:',
    options: ['Only hot flashes', 'Multiple symptoms including hot flashes, bone loss, and mood changes', 'No symptoms', 'Only weight gain'], correctAnswer: 1,
    explanation: 'HRT can treat hot flashes, vaginal dryness, bone loss, and mood symptoms.' },
  { id: 'gs-2', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'medium',
    text: 'Self-care during menopause is:',
    options: ['Selfish and indulgent', 'A medically supported strategy', 'Only for severe symptoms', 'A waste of time'], correctAnswer: 1,
    explanation: 'Exercise, sleep hygiene, nutrition, and stress management are evidence-based strategies.' },
  { id: 'gs-3', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'easy',
    text: 'After the menopausal transition, many women report:',
    options: ['Only negative changes', 'A sense of freedom and renewed purpose', 'Complete loss of identity', 'Nothing changes'], correctAnswer: 1,
    explanation: 'Many postmenopausal women feel more confident and purposeful — the "second spring."' },
  { id: 'gs-4', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'medium',
    text: 'Which is an evidence-based complementary approach for menopause symptoms?',
    options: ['Mindfulness meditation', 'Ignoring all symptoms', 'Extreme calorie restriction', 'Avoiding all activity'], correctAnswer: 0,
    explanation: 'Mindfulness meditation has shown benefits for hot flashes, anxiety, and sleep.' },
  { id: 'gs-5', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'hard',
    text: 'The concept of "postmenopausal zest" was coined by:',
    options: ['Sigmund Freud', 'Margaret Mead', 'Florence Nightingale', 'Marie Curie'], correctAnswer: 1,
    explanation: 'Anthropologist Margaret Mead described the increase in energy many women feel after menopause.' },
  { id: 'gs-6', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'easy',
    text: 'Good sleep hygiene during menopause includes:',
    options: ['Scrolling phone in bed', 'Keeping a cool, dark room and consistent schedule', 'Sleeping whenever', 'Wine before bed'], correctAnswer: 1,
    explanation: 'A cool room helps with night sweats, darkness promotes melatonin, consistency trains your rhythm.' },
  { id: 'gs-7', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'medium',
    text: 'Talking openly about menopause is important because:',
    options: ['It\'s trendy', 'It reduces stigma and helps others seek support', 'It doesn\'t matter', 'It makes things worse'], correctAnswer: 1,
    explanation: 'Breaking silence reduces shame and encourages women to seek help.' },
  { id: 'gs-8', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'hard',
    text: 'The endocrine system during menopause:',
    options: ['Shuts down completely', 'Reorganizes — adrenals and fat tissue take over some hormone production', 'Functions identically', 'Only affects reproduction'], correctAnswer: 1,
    explanation: 'After menopause, the adrenal glands and adipose tissue become important estrogen sources.' },
  { id: 'gs-9', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'easy',
    text: 'The greatest myth about menopause is:',
    options: ['It\'s treatable', 'That it must be suffered in silence', 'That it affects hormones', 'That it\'s biological'], correctAnswer: 1,
    explanation: 'Silence is the enemy. Knowledge, community, and medical care transform the experience.' },
  { id: 'gs-10', biome: 'bloom-garden', monster: 'grand-silencer', format: 'mc', difficulty: 'medium',
    text: 'A comprehensive menopause care plan should include:',
    options: ['Only medication', 'Lifestyle changes, medical care, emotional support, and education', 'Just exercise', 'Waiting it out'], correctAnswer: 1,
    explanation: 'The best outcomes come from a holistic approach combining multiple strategies.' },
];

// ============ COMPENDIUM ============
export const initialCompendium: CompendiumEntry[] = [
  // Facts (unlocked at shrines)
  { id: 'fact-1', type: 'fact', title: 'What is Menopause?', content: 'Menopause is the permanent cessation of menstruation, confirmed after 12 consecutive months without a period. It marks the end of reproductive years but not the end of vitality.', biome: 'fever-peaks', unlocked: false },
  { id: 'fact-2', type: 'fact', title: 'The Hypothalamus & Hot Flashes', content: 'The hypothalamus acts as the body\'s thermostat. When estrogen declines, it becomes confused and triggers hot flashes as a false alarm response.', biome: 'fever-peaks', unlocked: false },
  { id: 'fact-3', type: 'fact', title: 'Brain Fog is Real', content: 'Cognitive changes during perimenopause are hormone-mediated and typically temporary. The brain adapts to new hormone levels over time.', biome: 'fog-marshes', unlocked: false },
  { id: 'fact-4', type: 'fact', title: 'Emotions & Hormones', content: 'Mood changes are neurological responses to hormonal shifts, not character flaws. Serotonin and norepinephrine are directly affected by estrogen levels.', biome: 'mood-tides', unlocked: false },
  { id: 'fact-5', type: 'fact', title: 'Bone Health Matters', content: 'After menopause, bone density loss accelerates. Weight-bearing exercise, calcium, and Vitamin D are essential preventive measures.', biome: 'crystal-caverns', unlocked: false },
  { id: 'fact-6', type: 'fact', title: 'Heart Health After Menopause', content: 'Estrogen had protective effects on the cardiovascular system. After menopause, heart disease risk rises significantly.', biome: 'heartland', unlocked: false },
  // Myth cards (unlocked on monster defeat)
  { id: 'myth-1', type: 'myth', title: 'The Shame Dragon\'s Lie', content: 'MYTH: Menopause makes you old and irrelevant. TRUTH: Menopause is a biological transition, not an ending.', biome: 'fever-peaks', monsterId: 'shame-dragon', unlocked: false },
  { id: 'myth-2', type: 'myth', title: 'The Dismissal Wraith\'s Lie', content: 'MYTH: Hot flashes are just stress. TRUTH: Hot flashes are a direct physiological result of hypothalamic changes.', biome: 'fever-peaks', monsterId: 'dismissal-wraith', unlocked: false },
  { id: 'myth-3', type: 'myth', title: 'The Silence Specter\'s Lie', content: 'MYTH: Push through it alone. TRUTH: Support, community, and medical care are tools of strength.', biome: 'fog-marshes', monsterId: 'silence-specter', unlocked: false },
  { id: 'myth-4', type: 'myth', title: 'The Confusion Cyclone\'s Lie', content: 'MYTH: Brain fog is just aging. TRUTH: Cognitive changes are hormone-mediated and often temporary.', biome: 'fog-marshes', monsterId: 'confusion-cyclone', unlocked: false },
  { id: 'myth-5', type: 'myth', title: 'The Shame Tide\'s Lie', content: 'MYTH: Mood swings make you irrational. TRUTH: Mood changes are neurological, not emotional weakness.', biome: 'mood-tides', monsterId: 'shame-tide', unlocked: false },
  { id: 'myth-6', type: 'myth', title: 'The Minimizer\'s Lie', content: 'MYTH: Everyone goes through it, stop making it a big deal. TRUTH: Menopause symptoms affect daily life and deserve proper care.', biome: 'mood-tides', monsterId: 'minimizer', unlocked: false },
  { id: 'myth-7', type: 'myth', title: 'The Brittle Giant\'s Lie', content: 'MYTH: Bone loss is inevitable. TRUTH: Exercise, nutrition, and medication can significantly reduce bone loss.', biome: 'crystal-caverns', monsterId: 'brittle-giant', unlocked: false },
  { id: 'myth-8', type: 'myth', title: 'The Cold Certainty\'s Lie', content: 'MYTH: HRT is dangerous — never take it. TRUTH: Modern HRT is safe for most healthy women under 60.', biome: 'crystal-caverns', monsterId: 'cold-certainty', unlocked: false },
  { id: 'myth-9', type: 'myth', title: 'The Fog of Shame\'s Lie', content: 'MYTH: Don\'t talk about menopause in public. TRUTH: Open conversation saves lives and breaks stigma.', biome: 'heartland', monsterId: 'fog-of-shame', unlocked: false },
  { id: 'myth-10', type: 'myth', title: 'The Heartbreak Myth\'s Lie', content: 'MYTH: Heart disease is a man\'s problem. TRUTH: It\'s the leading cause of death in postmenopausal women.', biome: 'heartland', monsterId: 'heartbreak-myth', unlocked: false },
  { id: 'myth-11', type: 'myth', title: 'The Grand Silencer\'s Lie', content: 'MYTH: Menopause must be suffered in silence. TRUTH: Knowledge is power. Speaking up changes everything.', biome: 'bloom-garden', monsterId: 'grand-silencer', unlocked: false },
  // Bestiary entries (unlocked on monster defeat)
  { id: 'best-1', type: 'bestiary', title: 'The Shame Dragon', content: 'A fearsome dragon born from internalised shame. No special battle mechanic, but its raw power is unforgiving. Weakness: factual knowledge about what menopause actually is.', biome: 'fever-peaks', monsterId: 'shame-dragon', unlocked: false },
  { id: 'best-2', type: 'bestiary', title: 'The Dismissal Wraith', content: 'A spectral entity that feeds on dismissed symptoms. Its Dismissive Haste shortens your response timer to just 10 seconds. Weakness: acknowledging hot flashes as real medical events.', biome: 'fever-peaks', monsterId: 'dismissal-wraith', unlocked: false },
  { id: 'best-3', type: 'bestiary', title: 'The Silence Specter', content: 'A ghost that thrives in unspoken suffering. Its Spectral Silence blurs your questions, clearing gradually. Weakness: breaking the silence by seeking support.', biome: 'fog-marshes', monsterId: 'silence-specter', unlocked: false },
  { id: 'best-4', type: 'bestiary', title: 'The Confusion Cyclone', content: 'A swirling vortex of misinformation. Its Whirlwind Scramble randomly shuffles your answer options. Weakness: clear, evidence-based understanding of cognitive changes.', biome: 'fog-marshes', monsterId: 'confusion-cyclone', unlocked: false },
  { id: 'best-5', type: 'bestiary', title: 'The Shame Tide', content: 'A relentless wave of emotional suppression. Its Tidal Drain may consume your potions automatically each turn. Weakness: understanding that mood changes are biological, not personal failure.', biome: 'mood-tides', monsterId: 'shame-tide', unlocked: false },
  { id: 'best-6', type: 'bestiary', title: 'The Minimizer', content: 'A creature that shrinks everything — your words, your pain, your reality. Its Minimizing Gaze makes answer text shrink before your eyes. Weakness: refusing to minimize real symptoms.', biome: 'mood-tides', monsterId: 'minimizer', unlocked: false },
  { id: 'best-7', type: 'bestiary', title: 'The Brittle Giant', content: 'A towering colossus with crumbling bones. Its Crumbling Choices cause answers to fade away over time — even the correct one. Weakness: knowledge about bone health and prevention.', biome: 'crystal-caverns', monsterId: 'brittle-giant', unlocked: false },
  { id: 'best-8', type: 'bestiary', title: 'The Cold Certainty', content: 'An icy figure speaking absolute falsehoods with perfect confidence. Its Frozen Deceit makes one wrong answer glow like the correct one. Weakness: nuanced understanding of HRT.', biome: 'crystal-caverns', monsterId: 'cold-certainty', unlocked: false },
  { id: 'best-9', type: 'bestiary', title: 'The Fog of Shame', content: 'A creeping mist that obscures everything in taboo. Its Creeping Fog fills the screen as the timer runs down. Weakness: open, honest conversation about menopause.', biome: 'heartland', monsterId: 'fog-of-shame', unlocked: false },
  { id: 'best-10', type: 'bestiary', title: 'The Heartbreak Myth', content: 'A throbbing entity of cardiovascular misinformation. Its Heartbreak ability decays your combo each turn. Weakness: knowing that heart disease is the #1 killer of postmenopausal women.', biome: 'heartland', monsterId: 'heartbreak-myth', unlocked: false },
  { id: 'best-11', type: 'bestiary', title: 'The Grand Silencer', content: 'The final boss — the embodiment of all systemic silence. Combines blurred questions with scrambled answers. Weakness: the accumulated knowledge from every biome.', biome: 'bloom-garden', monsterId: 'grand-silencer', unlocked: false },
  // NPC bios (unlocked by talking to NPCs)
  { id: 'bio-elena', type: 'bio', title: 'Elena — The Early Discoverer', content: 'Elena, 48, from Fever Peaks. She spent years being told her symptoms were "just stress." Learning the truth gave her the words to advocate for herself.', biome: 'fever-peaks', npcName: 'Elena', unlocked: false },
  { id: 'bio-mira', type: 'bio', title: 'Dr. Mira — The Scholar', content: 'Dr. Mira runs the Hearth Village study. A former researcher who now dedicates her life to making menopause knowledge accessible to all.', npcName: 'Dr. Mira', unlocked: false },
  { id: 'bio-yuki', type: 'bio', title: 'Yuki — The Word-Finder', content: 'Yuki, 52, from Fog Marshes. She feared she was losing herself to brain fog. Understanding the science gave her back her identity.', biome: 'fog-marshes', npcName: 'Yuki', unlocked: false },
  { id: 'bio-priya', type: 'bio', title: 'Priya — The Early Warrior', content: 'Priya, 38, from Mood Tides. She thought she was "too young" for perimenopause. Learning the truth erased her shame.', biome: 'mood-tides', npcName: 'Priya', unlocked: false },
  { id: 'bio-saoirse', type: 'bio', title: 'Saoirse — The Bone Guardian', content: 'Saoirse, 45, from Crystal Caverns. Family history of osteoporosis drove her fear. Now armed with prevention knowledge, she feels in control.', biome: 'crystal-caverns', npcName: 'Saoirse', unlocked: false },
  { id: 'bio-rosa', type: 'bio', title: 'Rosa — The Heart Advocate', content: 'Rosa, 55, from Heartland. A cardiac event shocked her into action. Now she champions heart health awareness for menopausal women.', biome: 'heartland', npcName: 'Rosa', unlocked: false },
  // Hidden entries (unlocked via Compendium Seal)
  { id: 'seal-1', type: 'fact', title: 'Perimenopause: The Hidden Chapter', content: 'Perimenopause can begin up to 10 years before menopause, often in a woman\'s late 30s or 40s. Symptoms like irregular periods, mood changes, and sleep disruption can appear years before periods stop entirely.', sealOnly: true, unlocked: false },
  { id: 'seal-2', type: 'fact', title: 'The Gut-Hormone Connection', content: 'The gut microbiome contains a collection of bacteria called the estrobolome, which helps metabolise estrogen. During menopause, gut changes can amplify hormonal imbalance, making digestive health a hidden factor in symptom severity.', sealOnly: true, unlocked: false },
  { id: 'seal-3', type: 'fact', title: 'Sleep & Menopause', content: 'Up to 61% of postmenopausal women report insomnia. Declining progesterone — a natural sleep promoter — combined with night sweats and anxiety creates a perfect storm for disrupted rest.', sealOnly: true, unlocked: false },
];

export const initialMilestones: CompendiumMilestone[] = [
  { id: 'ms-1', title: 'First Discovery', description: 'Unlock 3 compendium entries', requiredCount: 3, reward: { type: 'item', item: 'hormoneCrystals', amount: 5 }, claimed: false },
  { id: 'ms-2', title: 'Knowledge Seeker', description: 'Unlock 10 compendium entries', requiredCount: 10, reward: { type: 'item', item: 'knowledgeScrolls', amount: 3 }, claimed: false },
  { id: 'ms-3', title: 'Monster Scholar', description: 'Unlock 15 compendium entries', requiredCount: 15, reward: { type: 'item', item: 'remedyPotionBasic', amount: 2 }, claimed: false },
  { id: 'ms-4', title: 'Myth Breaker', description: 'Unlock 25 compendium entries', requiredCount: 25, reward: { type: 'xp', amount: 500 }, claimed: false },
  { id: 'ms-5', title: 'Grand Archivist', description: 'Unlock all compendium entries', requiredCount: 37, reward: { type: 'item', item: 'compendiumSeal', amount: 3 }, claimed: false },
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
  compendiumMilestones: initialMilestones.map(m => ({ ...m })),
  monstersDefeated: [],
  npcsMet: [],
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
  character: null,
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

// ============ CHARACTER BONUS HELPERS ============
const specialtyBiomeMap: Record<Specialty, BiomeId[]> = {
  thermoregulation: ['fever-peaks'],
  neuroscience: ['fog-marshes', 'mood-tides'],
  cardiology: ['heartland'],
  endocrinology: ['crystal-caverns', 'bloom-garden'],
};

export const getSpecialtyDamageMultiplier = (character: CharacterProfile | null, biomeId: BiomeId): number => {
  if (!character) return 1;
  const bonusBiomes = specialtyBiomeMap[character.specialty] || [];
  return bonusBiomes.includes(biomeId) ? 1.5 : 1;
};

export const getXpMultiplier = (character: CharacterProfile | null): number => {
  if (!character) return 1;
  return character.background === 'scholar' ? 1.15 : 1;
};

export const getShrineDiscoveryMultiplier = (character: CharacterProfile | null): number => {
  if (!character) return 1;
  return character.background === 'explorer' ? 1.2 : 1;
};

export const getStartingBonuses = (character: CharacterProfile): Partial<{
  estraBond: number;
  inventory: Partial<GameState['inventory']>;
}> => {
  switch (character.background) {
    case 'caregiver':
      return { inventory: { wellnessHerbs: 5 } };
    case 'scholar':
      return { inventory: { knowledgeScrolls: 3 } };
    case 'advocate':
      return { estraBond: 1 };
    case 'explorer':
      return { inventory: { hormoneCrystals: 3 } };
    default:
      return {};
  }
};
