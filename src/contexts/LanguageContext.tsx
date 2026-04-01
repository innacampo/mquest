import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// UI translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Title Screen
    'title.subtitle': 'A narrative RPG where knowledge is power.',
    'title.subtitle2': 'Guide Lyra through the Inner Realm and restore the light.',
    'title.start': 'Begin Your Journey',
    'title.estra': 'ESTRA',

    // Header
    'header.title': 'The M-QUEST',
    'header.subtitle': 'A Narrative RPG where Knowledge is Power',
    'header.realm': 'Realm',
    'header.village': 'Village',

    // Character Creation
    'char.who': 'Who enters the Inner Realm?',
    'char.name_prompt': 'Every healer has a name. Choose yours, or keep the name the realm already knows.',
    'char.leave_blank': 'Leave blank for "Lyra"',
    'char.continue': 'Continue →',
    'char.back': '← Back',
    'char.choose_bg': 'Choose Your Background',
    'char.bg_subtitle': 'Your past shapes how you navigate the Inner Realm',
    'char.choose_spec': 'Choose Your Specialty',
    'char.spec_subtitle': 'Your medical knowledge gives you an edge in certain biomes',
    'char.journey_awaits': 'Your Journey Awaits',
    'char.realm_stirs': 'The Inner Realm stirs at your approach',
    'char.enter_realm': 'Enter the Inner Realm',

    // Backgrounds
    'bg.caregiver': 'The Caregiver',
    'bg.caregiver.desc': '+5 starting herbs, +1 bonus herb from every NPC',
    'bg.caregiver.flavor': "You spent years tending to others. Now it's time to understand yourself.",
    'bg.scholar': 'The Scholar',
    'bg.scholar.desc': '+15% XP from all sources, +3 starting knowledge scrolls',
    'bg.scholar.flavor': 'Your curiosity led you to libraries and labs. The Inner Realm is your greatest subject.',
    'bg.advocate': 'The Advocate',
    'bg.advocate.desc': '+1 starting Estra Bond, bonus XP & herbs from NPC conversations',
    'bg.advocate.flavor': "You've always spoken up for others. Now you carry that fire inward.",
    'bg.explorer': 'The Explorer',
    'bg.explorer.desc': '+3 starting crystals, double scrolls & bonus bloom essence from shrines',
    'bg.explorer.flavor': 'Every new horizon calls. The Inner Realm is vast — and you intend to see it all.',

    // Specialties
    'spec.thermoregulation': 'Thermoregulation',
    'spec.thermoregulation.desc': 'Expertise in heat regulation & the hypothalamus',
    'spec.thermoregulation.biome': 'Bonus damage in Fever Peaks',
    'spec.neuroscience': 'Neuroscience',
    'spec.neuroscience.desc': 'Expertise in cognition, memory & brain chemistry',
    'spec.neuroscience.biome': 'Bonus damage in Fog Marshes & Mood Tides',
    'spec.cardiology': 'Cardiology',
    'spec.cardiology.desc': 'Expertise in cardiovascular health & lipid profiles',
    'spec.cardiology.biome': 'Bonus damage in Heartland Plains',
    'spec.endocrinology': 'Endocrinology',
    'spec.endocrinology.desc': 'Expertise in hormones, HRT & the endocrine system',
    'spec.endocrinology.biome': 'Bonus damage in Crystal Caverns & Bloom Garden',

    // World Map
    'map.title': 'The Inner Realm',
    'map.subtitle': 'Explore the mystical world within — each region maps to a biological system',
    'map.restoration': 'World Restoration',
    'map.explore': 'Explore →',

    // Biome Explore
    'biome.shrine': 'Knowledge Shrine',
    'biome.shrine_visited': '✓ Visited',
    'biome.shrine_learn': 'Learn about ',
    'biome.npc_spoken': '✓ Spoken to',
    'biome.npc_talk': 'Talk to this character',
    'biome.clear': 'Clear Biome',
    'biome.clear_desc': 'All monsters defeated! +500 XP',
    'biome.leave': 'Leave',
    'biome.return': 'Return',
    'biome.monsters': 'Myth Monsters',
    'biome.challenge': 'Challenge',
    'biome.defeated': '✓ Defeated',
    'biome.resident': 'Biome resident',
    'biome.shrine_reward': '✨ +50 XP • 📜 +1 Scroll • Compendium entry unlocked',
    'biome.npc_reward': '🌿 +2 Wellness Herbs',

    // Battle
    'battle.begin': 'Begin Battle',
    'battle.retreat': 'Retreat',
    'battle.attack': 'Attack',
    'battle.defend': 'Defend',
    'battle.items': 'Items',
    'battle.combo': 'COMBO',
    'battle.decaying': 'decaying',
    'battle.draining': '🌊 draining',
    'battle.atb': 'ATB',
    'battle.enemy': 'Enemy',
    'battle.gauges_filling': 'Gauges filling...',
    'battle.defending': '🛡 Defending... waiting for gauge...',
    'battle.striking': '⚔ Striking!',
    'battle.attacks': 'attacks!',
    'battle.knowledge_strike': 'Knowledge Strike — Answer to Attack!',
    'battle.atb_hint': '⚡ Active Time Battle — React fast, answer smart!',
    'battle.correct': '✅ Correct! Striking for',
    'battle.damage': 'damage!',
    'battle.wrong': '❌ Wrong —',
    'battle.gains_momentum': 'gains momentum!',
    'battle.continue': 'Continue →',
    'battle.victory': 'Myth Defeated!',
    'battle.accuracy': 'Accuracy',
    'battle.max_combo': 'Max Combo',
    'battle.remaining_hp': 'Remaining HP',
    'battle.claim_victory': 'Claim Victory',
    'battle.knockout': 'Knocked Out!',
    'battle.too_powerful': 'was too powerful. Retreat and return stronger.',
    'battle.retreat_village': 'Retreat to Village',
    'battle.spectral_clearing': 'Spectral Silence — question is clearing...',
    'battle.combo_boosted': 'Combo — damage boosted by',

    // Hearth Village
    'village.title': '🏘️ Hearth Village',
    'village.subtitle': 'Your home between adventures • World State: ',
    'village.to_realm': 'To the Realm',
    'village.back': 'Back to Village',
    'village.notice': '📋 Notice Board',
    'village.biomes_cleared': 'biomes cleared',
    'village.compendium_entries': 'compendium entries',
    'village.myths_defeated': 'myths defeated',
    'village.study': "Dr. Mira's Study",
    'village.study_desc': 'Deep-dive medical content and evidence-based knowledge.',
    'village.crafting': 'Crafting Station',
    'village.crafting_desc': 'Combine resources into potions, elixirs, and seals.',
    'village.garden': 'Memory Garden',
    'village.garden_desc': 'NPC reflections on their healing journeys.',
    'village.garden_locked': 'Unlocks at World State: Healing (50% restoration).',
    'village.archive': 'The Archive',
    'village.archive_desc': "Lyra's personal Compendium. Review all entries.",
    'village.enter': 'Enter →',
    'village.locked': '🔒 Locked',
    'village.healer': 'Village Healer • Evidence-Based Medicine',
    'village.deep_dives': 'Medical Deep-Dives',
    'village.letters': 'Letters from Mum',
    'village.letters_arrived': 'arrived at the mailbox.',
    'village.letter': 'letter',
    'village.letters_plural': 'letters',
    'village.garden_quiet': 'The garden is quiet. Clear biomes to see NPC reflections here.',
    'village.garden_subtitle': 'A peaceful space where those you\'ve helped share their reflections. The garden grows with each biome you restore.',
    'village.before': 'Before',
    'village.after': 'After',

    // Deep dive cards
    'dd.hrt': 'Hormone Replacement Therapy (HRT)',
    'dd.hrt_content': 'Modern HRT is personalized. Types include systemic estrogen, low-dose vaginal estrogen, and combination therapy. Benefits for most healthy women under 60 include relief from vasomotor symptoms, bone protection, and cardiovascular benefits when started early.',
    'dd.brain': 'The Estrogen-Brain Connection',
    'dd.brain_content': 'Estrogen receptors exist throughout the brain, particularly in the hippocampus and prefrontal cortex. During perimenopause, fluctuating levels affect memory consolidation, attention, and verbal fluency. These changes are typically temporary.',
    'dd.cardio': 'Cardiovascular Risk After Menopause',
    'dd.cardio_content': 'Premenopausal estrogen provides cardioprotection through HDL maintenance, arterial flexibility, and anti-inflammatory effects. After menopause, LDL rises, arteries stiffen, and metabolic syndrome risk increases.',
    'dd.team': 'Building a Menopause Care Team',
    'dd.team_content': 'Optimal care may include: a GP or gynecologist trained in menopause medicine, a mental health professional, a dietitian, a physiotherapist for pelvic floor health, and peer support groups. You deserve a team.',
    'dd.locked': '🔒 Locked',
    'dd.clear_to_unlock': 'to unlock.',
    'dd.clear_biome': 'Clear',
    'dd.biome_singular': 'biome',
    'dd.biomes_plural': 'biomes',

    // Letters from mum
    'letter.0': "\"I haven't been sleeping well lately. I feel a bit all over the place. It's probably just stress...\" — Mum",
    'letter.1': '"I keep forgetting words in the middle of sentences! Your dad laughs but honestly it frightens me a little..." — Mum',
    'letter.2': '"I had a bad week. I apologised to everyone around me like it was my fault. Maybe it is..." — Mum',
    'letter.3': '"I went to the GP. I used the word \'perimenopause\' out loud. I think you helped me find the words." — Mum',
    'letter.4': '"I wish someone had told me all this when I was your age." — Mum',

    // Crafting
    'craft.title': 'Crafting Station',
    'craft.resources': 'Resources:',
    'craft.herbs': 'Herbs',
    'craft.crystals': 'Crystals',
    'craft.scrolls': 'Scrolls',
    'craft.bloom': 'Bloom Essence',
    'craft.craft': 'Craft',
    'craft.need_resources': 'Need resources',
    'craft.crafted': 'Crafted!',
    'craft.owned': 'owned',

    // Recipe names
    'recipe.remedy_basic': 'Remedy Potion (Basic)',
    'recipe.remedy_basic_desc': 'A simple healing remedy crafted from herbs.',
    'recipe.remedy_basic_effect': 'Restores 30 HP in battle. Awards 75 XP.',
    'recipe.remedy_enhanced': 'Remedy Potion (Enhanced)',
    'recipe.remedy_enhanced_desc': 'A powerful remedy infused with crystal energy.',
    'recipe.remedy_enhanced_effect': 'Restores 60 HP in battle. Awards 150 XP + bonus Compendium entry.',
    'recipe.clarity': 'Clarity Elixir',
    'recipe.clarity_desc': 'A shimmering elixir that clears the mind.',
    'recipe.clarity_effect': 'During battle: removes one Surge charge from Monster. Single use.',
    'recipe.estra_boost': 'Estra Boost',
    'recipe.estra_boost_desc': "Concentrated essence that strengthens Estra's bond.",
    'recipe.estra_boost_effect': 'Permanently increases Estra Bond by 1. Max 3 crafts.',
    'recipe.seal': 'Compendium Seal',
    'recipe.seal_desc': 'A mystical seal that reveals hidden knowledge.',
    'recipe.seal_effect': 'Unlocks a hidden Compendium entry not accessible via normal gameplay.',

    // Ingredient labels
    'ing.wellnessHerbs': 'Wellness Herbs',
    'ing.hormoneCrystals': 'Hormone Crystals',
    'ing.knowledgeScrolls': 'Knowledge Scrolls',
    'ing.bloomEssence': 'Bloom Essence',

    // Compendium
    'comp.title': 'Compendium',
    'comp.complete': 'Complete',
    'comp.bestiary': 'Bestiary',
    'comp.facts': 'Facts',
    'comp.myths': 'Myths',
    'comp.npcs': 'NPCs',
    'comp.milestones': 'Milestones',
    'comp.search': 'Search entries...',
    'comp.all': 'All',
    'comp.claim': 'Claim',
    'comp.claimed': 'Claimed ✓',
    'comp.entries': 'entries',
    'comp.reward': 'Reward',
    'comp.no_entries': 'No entries found',
    'comp.for': 'for',
    'comp.defeat_unlock': 'Defeat this monster to unlock its bestiary entry.',
    'comp.myth_unlock': 'Defeat the monster to reveal the truth.',
    'comp.bio_unlock': 'Talk to this NPC to learn their story.',
    'comp.explore_unlock': 'Explore the Inner Realm to unlock this entry.',

    // Milestone names
    'ms.first_discovery': 'First Discovery',
    'ms.first_discovery_desc': 'Unlock 3 compendium entries',
    'ms.knowledge_seeker': 'Knowledge Seeker',
    'ms.knowledge_seeker_desc': 'Unlock 10 compendium entries',
    'ms.monster_scholar': 'Monster Scholar',
    'ms.monster_scholar_desc': 'Unlock 15 compendium entries',
    'ms.myth_breaker': 'Myth Breaker',
    'ms.myth_breaker_desc': 'Unlock 25 compendium entries',
    'ms.grand_archivist': 'Grand Archivist',
    'ms.grand_archivist_desc': 'Unlock all compendium entries',

    // HUD
    'hud.level': 'Level',
    'hud.estra_bond': 'Estra Bond',
    'hud.hormone_crystals': 'Hormone Crystals',
    'hud.wellness_herbs': 'Wellness Herbs',
    'hud.knowledge_scrolls': 'Knowledge Scrolls',
    'hud.remedy_basic': 'Remedy Potions (Basic)',
    'hud.remedy_enhanced': 'Remedy Potions (Enhanced)',
    'hud.clarity_elixir': 'Clarity Elixirs',
    'hud.estra_boost': 'Estra Boosts',
    'hud.compendium': 'Compendium',

    // Ending
    'ending.bloom': 'The Bloom Awakens',
    'ending.restored': "'s journey has restored balance to the realm",
    'ending.biomes_restored': 'Biomes Restored',
    'ending.level_reached': 'Level Reached',
    'ending.monsters_vanquished': 'Monsters Vanquished',
    'ending.compendium': 'Compendium',
    'ending.estra_bond': 'Estra Bond',
    'ending.quote': '"Menopause is not an ending — it is a transformation. Every hot flash weathered, every fog navigated, every myth shattered has made you stronger. The knowledge you carry is your greatest remedy. You are not alone on this path."',
    'ending.quote_author': '— Dr. Mira, Hearth Village',
    'ending.thank_you': 'Thank you for playing The M-QUEST',
    'ending.new_journey': 'New Journey',
    'ending.continue': 'Continue Exploring',

    // Feedback
    'feedback.title': 'Send Feedback',
    'feedback.placeholder': 'Bug, idea, or thought…',
    'feedback.send': 'Send',
    'feedback.sending': 'Sending…',
    'feedback.error': 'Could not send feedback.',
    'feedback.success': '💜 Thank you! Your feedback has been saved.',

    // Audio
    'audio.settings': 'Audio Settings',
    'audio.test': 'Test',
    'audio.master': 'Master',
    'audio.music': '🎵 Music',
    'audio.sfx': '✨ SFX',

    // Game Rules
    'rules.title': 'How to Play',
    'rules.biomes_title': '🗺 Explore Biomes',
    'rules.biomes_desc': 'Travel across 6 biomes, each tied to a body system affected by menopause. Biomes unlock sequentially — clear one to access the next.',
    'rules.battle_title': '⚔ Battle Monsters',
    'rules.battle_desc': 'Each biome has myth-monsters that spread misinformation. Battle them in real-time ATB combat by answering quiz questions correctly. Build combos for bonus damage!',
    'rules.shrine_title': '✨ Visit Knowledge Shrines',
    'rules.shrine_desc': 'Shrines teach you real medical facts and reward XP + Knowledge Scrolls. Explorers earn double scrolls and bonus Bloom Essence.',
    'rules.npc_title': '💬 Talk to NPCs',
    'rules.npc_desc': 'Each biome has a character with a personal story. Talking earns Wellness Herbs and unlocks their bio in the Compendium. Advocates earn bonus XP from conversations.',
    'rules.craft_title': '🧪 Craft Remedies',
    'rules.craft_desc': 'Visit the Crafting Station in Hearth Village to combine resources into potions, elixirs, and seals. Use them in battle or to unlock hidden knowledge.',
    'rules.comp_title': '📖 Fill the Compendium',
    'rules.comp_desc': 'Unlock facts, myth-busters, bestiary entries, and NPC bios. Hit milestones for bonus rewards. Craft Compendium Seals to reveal hidden entries!',
    'rules.restore_title': '🌟 Restore the Inner Realm',
    'rules.restore_desc': "Clearing biomes restores Estra's glow and heals the world. Clear all 6 biomes to reach the ending and complete your journey.",
    'rules.bg_title': '🎭 Backgrounds & Specialties',
    'rules.bg_caregiver': 'Caregiver: +5 starting herbs, +1 bonus herb from NPCs',
    'rules.bg_scholar': 'Scholar: +15% XP from all sources, +3 starting scrolls',
    'rules.bg_advocate': 'Advocate: +1 Estra Bond, bonus XP & herbs from NPCs',
    'rules.bg_explorer': 'Explorer: +3 starting crystals, double shrine scrolls + bloom essence',
    'rules.bg_specialty': 'Specialties give 1.5× damage in their associated biomes.',

    // World states
    'world.flux': 'Flux',
    'world.aware': 'Aware',
    'world.healing': 'Healing',
    'world.bloom': 'Bloom',

    // Loading
    'loading': 'Loading your quest...',

    // Potion menu
    'potion.basic_hp': '+30 HP',
    'potion.enhanced_hp': '+60 HP',
    'potion.clarity_atb': '-50 ATB',
  },
  es: {
    // Title Screen
    'title.subtitle': 'Un RPG narrativo donde el conocimiento es poder.',
    'title.subtitle2': 'Guía a Lyra a través del Reino Interior y restaura la luz.',
    'title.start': 'Comienza Tu Viaje',
    'title.estra': 'ESTRA',

    // Header
    'header.title': 'The M-QUEST',
    'header.subtitle': 'Un RPG Narrativo donde el Conocimiento es Poder',
    'header.realm': 'Reino',
    'header.village': 'Aldea',

    // Character Creation
    'char.who': '¿Quién entra al Reino Interior?',
    'char.name_prompt': 'Cada sanadora tiene un nombre. Elige el tuyo, o conserva el que el reino ya conoce.',
    'char.leave_blank': 'Deja en blanco para "Lyra"',
    'char.continue': 'Continuar →',
    'char.back': '← Atrás',
    'char.choose_bg': 'Elige Tu Trasfondo',
    'char.bg_subtitle': 'Tu pasado moldea cómo navegas el Reino Interior',
    'char.choose_spec': 'Elige Tu Especialidad',
    'char.spec_subtitle': 'Tu conocimiento médico te da ventaja en ciertos biomas',
    'char.journey_awaits': 'Tu Viaje Te Espera',
    'char.realm_stirs': 'El Reino Interior se agita ante tu llegada',
    'char.enter_realm': 'Entrar al Reino Interior',

    // Backgrounds
    'bg.caregiver': 'La Cuidadora',
    'bg.caregiver.desc': '+5 hierbas iniciales, +1 hierba extra de cada PNJ',
    'bg.caregiver.flavor': 'Pasaste años cuidando a otros. Ahora es tiempo de entenderte a ti misma.',
    'bg.scholar': 'La Erudita',
    'bg.scholar.desc': '+15% XP de todas las fuentes, +3 pergaminos iniciales',
    'bg.scholar.flavor': 'Tu curiosidad te llevó a bibliotecas y laboratorios. El Reino Interior es tu mayor tema de estudio.',
    'bg.advocate': 'La Defensora',
    'bg.advocate.desc': '+1 Vínculo con Estra inicial, XP y hierbas extra de conversaciones con PNJ',
    'bg.advocate.flavor': 'Siempre has alzado la voz por otros. Ahora llevas esa llama hacia adentro.',
    'bg.explorer': 'La Exploradora',
    'bg.explorer.desc': '+3 cristales iniciales, doble pergaminos y esencia de floración en santuarios',
    'bg.explorer.flavor': 'Cada nuevo horizonte te llama. El Reino Interior es vasto — y piensas verlo todo.',

    // Specialties
    'spec.thermoregulation': 'Termorregulación',
    'spec.thermoregulation.desc': 'Experiencia en regulación térmica y el hipotálamo',
    'spec.thermoregulation.biome': 'Daño extra en Picos de Fiebre',
    'spec.neuroscience': 'Neurociencia',
    'spec.neuroscience.desc': 'Experiencia en cognición, memoria y química cerebral',
    'spec.neuroscience.biome': 'Daño extra en Marismas de Niebla y Mareas del Ánimo',
    'spec.cardiology': 'Cardiología',
    'spec.cardiology.desc': 'Experiencia en salud cardiovascular y perfiles lipídicos',
    'spec.cardiology.biome': 'Daño extra en Llanuras del Corazón',
    'spec.endocrinology': 'Endocrinología',
    'spec.endocrinology.desc': 'Experiencia en hormonas, TRH y el sistema endocrino',
    'spec.endocrinology.biome': 'Daño extra en Cavernas de Cristal y Jardín de la Floración',

    // World Map
    'map.title': 'El Reino Interior',
    'map.subtitle': 'Explora el mundo místico interior — cada región se conecta con un sistema biológico',
    'map.restoration': 'Restauración del Mundo',
    'map.explore': 'Explorar →',

    // Biome Explore
    'biome.shrine': 'Santuario del Conocimiento',
    'biome.shrine_visited': '✓ Visitado',
    'biome.shrine_learn': 'Aprende sobre ',
    'biome.npc_spoken': '✓ Has hablado',
    'biome.npc_talk': 'Habla con este personaje',
    'biome.clear': 'Limpiar Bioma',
    'biome.clear_desc': '¡Todos los monstruos derrotados! +500 XP',
    'biome.leave': 'Salir',
    'biome.return': 'Volver',
    'biome.monsters': 'Monstruos Míticos',
    'biome.challenge': 'Desafiar',
    'biome.defeated': '✓ Derrotado',
    'biome.resident': 'Residente del bioma',
    'biome.shrine_reward': '✨ +50 XP • 📜 +1 Pergamino • Entrada del compendio desbloqueada',
    'biome.npc_reward': '🌿 +2 Hierbas de Bienestar',

    // Battle
    'battle.begin': 'Comenzar Batalla',
    'battle.retreat': 'Retirarse',
    'battle.attack': 'Atacar',
    'battle.defend': 'Defender',
    'battle.items': 'Objetos',
    'battle.combo': 'COMBO',
    'battle.decaying': 'decayendo',
    'battle.draining': '🌊 drenando',
    'battle.atb': 'ATB',
    'battle.enemy': 'Enemigo',
    'battle.gauges_filling': 'Llenando medidores...',
    'battle.defending': '🛡 Defendiendo... esperando medidor...',
    'battle.striking': '⚔ ¡Atacando!',
    'battle.attacks': '¡ataca!',
    'battle.knowledge_strike': 'Golpe de Conocimiento — ¡Responde para Atacar!',
    'battle.atb_hint': '⚡ Batalla de Tiempo Activo — ¡Reacciona rápido, responde con inteligencia!',
    'battle.correct': '✅ ¡Correcto! Atacando por',
    'battle.damage': 'de daño!',
    'battle.wrong': '❌ Incorrecto —',
    'battle.gains_momentum': '¡gana impulso!',
    'battle.continue': 'Continuar →',
    'battle.victory': '¡Mito Derrotado!',
    'battle.accuracy': 'Precisión',
    'battle.max_combo': 'Combo Máximo',
    'battle.remaining_hp': 'HP Restante',
    'battle.claim_victory': 'Reclamar Victoria',
    'battle.knockout': '¡Noqueada!',
    'battle.too_powerful': 'fue muy poderoso. Retírate y regresa más fuerte.',
    'battle.retreat_village': 'Retirarse a la Aldea',
    'battle.spectral_clearing': 'Silencio Espectral — la pregunta se está aclarando...',
    'battle.combo_boosted': 'Combo — daño aumentado en',

    // Hearth Village
    'village.title': '🏘️ Aldea del Hogar',
    'village.subtitle': 'Tu hogar entre aventuras • Estado del Mundo: ',
    'village.to_realm': 'Al Reino',
    'village.back': 'Volver a la Aldea',
    'village.notice': '📋 Tablón de Anuncios',
    'village.biomes_cleared': 'biomas limpiados',
    'village.compendium_entries': 'entradas del compendio',
    'village.myths_defeated': 'mitos derrotados',
    'village.study': 'Estudio de Dra. Mira',
    'village.study_desc': 'Contenido médico profundo y conocimiento basado en evidencia.',
    'village.crafting': 'Estación de Fabricación',
    'village.crafting_desc': 'Combina recursos en pociones, elixires y sellos.',
    'village.garden': 'Jardín de la Memoria',
    'village.garden_desc': 'Reflexiones de los PNJ sobre sus procesos de sanación.',
    'village.garden_locked': 'Se desbloquea en Estado del Mundo: Sanando (50% restauración).',
    'village.archive': 'El Archivo',
    'village.archive_desc': 'El Compendio personal de Lyra. Revisa todas las entradas.',
    'village.enter': 'Entrar →',
    'village.locked': '🔒 Bloqueado',
    'village.healer': 'Sanadora de la Aldea • Medicina Basada en Evidencia',
    'village.deep_dives': 'Profundizaciones Médicas',
    'village.letters': 'Cartas de Mamá',
    'village.letters_arrived': 'llegaron al buzón.',
    'village.letter': 'carta',
    'village.letters_plural': 'cartas',
    'village.garden_quiet': 'El jardín está tranquilo. Limpia biomas para ver las reflexiones de los PNJ aquí.',
    'village.garden_subtitle': 'Un espacio pacífico donde quienes has ayudado comparten sus reflexiones. El jardín crece con cada bioma que restauras.',
    'village.before': 'Antes',
    'village.after': 'Después',

    // Deep dive cards
    'dd.hrt': 'Terapia de Reemplazo Hormonal (TRH)',
    'dd.hrt_content': 'La TRH moderna es personalizada. Los tipos incluyen estrógeno sistémico, estrógeno vaginal de baja dosis y terapia combinada. Los beneficios para la mayoría de las mujeres sanas menores de 60 incluyen alivio de síntomas vasomotores, protección ósea y beneficios cardiovasculares cuando se inicia temprano.',
    'dd.brain': 'La Conexión Estrógeno-Cerebro',
    'dd.brain_content': 'Los receptores de estrógeno existen en todo el cerebro, particularmente en el hipocampo y la corteza prefrontal. Durante la perimenopausia, los niveles fluctuantes afectan la consolidación de la memoria, la atención y la fluidez verbal. Estos cambios son típicamente temporales.',
    'dd.cardio': 'Riesgo Cardiovascular Después de la Menopausia',
    'dd.cardio_content': 'El estrógeno premenopáusico proporciona cardioprotección a través del mantenimiento de HDL, la flexibilidad arterial y los efectos antiinflamatorios. Después de la menopausia, el LDL sube, las arterias se endurecen y el riesgo de síndrome metabólico aumenta.',
    'dd.team': 'Formando un Equipo de Atención para la Menopausia',
    'dd.team_content': 'La atención óptima puede incluir: un médico general o ginecólogo capacitado en medicina de la menopausia, un profesional de salud mental, un nutricionista, un fisioterapeuta para la salud del suelo pélvico y grupos de apoyo entre pares. Mereces un equipo.',
    'dd.locked': '🔒 Bloqueado',
    'dd.clear_to_unlock': 'para desbloquear.',
    'dd.clear_biome': 'Limpia',
    'dd.biome_singular': 'bioma',
    'dd.biomes_plural': 'biomas',

    // Letters from mum
    'letter.0': '"No he dormido bien últimamente. Me siento un poco desorientada. Probablemente es solo estrés..." — Mamá',
    'letter.1': '"¡Sigo olvidando palabras a mitad de las frases! Tu padre se ríe pero honestamente me asusta un poco..." — Mamá',
    'letter.2': '"Tuve una mala semana. Me disculpé con todos a mi alrededor como si fuera mi culpa. Quizás lo es..." — Mamá',
    'letter.3': '"Fui al médico. Usé la palabra \'perimenopausia\' en voz alta. Creo que me ayudaste a encontrar las palabras." — Mamá',
    'letter.4': '"Ojalá alguien me hubiera contado todo esto cuando tenía tu edad." — Mamá',

    // Crafting
    'craft.title': 'Estación de Fabricación',
    'craft.resources': 'Recursos:',
    'craft.herbs': 'Hierbas',
    'craft.crystals': 'Cristales',
    'craft.scrolls': 'Pergaminos',
    'craft.bloom': 'Esencia de Floración',
    'craft.craft': 'Fabricar',
    'craft.need_resources': 'Faltan recursos',
    'craft.crafted': '¡Fabricado!',
    'craft.owned': 'tienes',

    // Recipe names
    'recipe.remedy_basic': 'Poción Remedio (Básica)',
    'recipe.remedy_basic_desc': 'Un remedio simple elaborado con hierbas.',
    'recipe.remedy_basic_effect': 'Restaura 30 HP en batalla. Otorga 75 XP.',
    'recipe.remedy_enhanced': 'Poción Remedio (Mejorada)',
    'recipe.remedy_enhanced_desc': 'Un poderoso remedio imbuido con energía cristalina.',
    'recipe.remedy_enhanced_effect': 'Restaura 60 HP en batalla. Otorga 150 XP + entrada extra del Compendio.',
    'recipe.clarity': 'Elixir de Claridad',
    'recipe.clarity_desc': 'Un elixir brillante que aclara la mente.',
    'recipe.clarity_effect': 'En batalla: elimina una carga de Oleada del Monstruo. Un solo uso.',
    'recipe.estra_boost': 'Impulso de Estra',
    'recipe.estra_boost_desc': 'Esencia concentrada que fortalece el vínculo de Estra.',
    'recipe.estra_boost_effect': 'Aumenta permanentemente el Vínculo de Estra en 1. Máximo 3 fabricaciones.',
    'recipe.seal': 'Sello del Compendio',
    'recipe.seal_desc': 'Un sello místico que revela conocimiento oculto.',
    'recipe.seal_effect': 'Desbloquea una entrada oculta del Compendio no accesible por medios normales.',

    // Ingredient labels
    'ing.wellnessHerbs': 'Hierbas de Bienestar',
    'ing.hormoneCrystals': 'Cristales Hormonales',
    'ing.knowledgeScrolls': 'Pergaminos de Conocimiento',
    'ing.bloomEssence': 'Esencia de Floración',

    // Compendium
    'comp.title': 'Compendio',
    'comp.complete': 'Completo',
    'comp.bestiary': 'Bestiario',
    'comp.facts': 'Datos',
    'comp.myths': 'Mitos',
    'comp.npcs': 'PNJs',
    'comp.milestones': 'Logros',
    'comp.search': 'Buscar entradas...',
    'comp.all': 'Todo',
    'comp.claim': 'Reclamar',
    'comp.claimed': 'Reclamado ✓',
    'comp.entries': 'entradas',
    'comp.reward': 'Recompensa',
    'comp.no_entries': 'No se encontraron entradas',
    'comp.for': 'para',
    'comp.defeat_unlock': 'Derrota a este monstruo para desbloquear su entrada del bestiario.',
    'comp.myth_unlock': 'Derrota al monstruo para revelar la verdad.',
    'comp.bio_unlock': 'Habla con este PNJ para conocer su historia.',
    'comp.explore_unlock': 'Explora el Reino Interior para desbloquear esta entrada.',

    // Milestone names
    'ms.first_discovery': 'Primer Descubrimiento',
    'ms.first_discovery_desc': 'Desbloquea 3 entradas del compendio',
    'ms.knowledge_seeker': 'Buscadora de Conocimiento',
    'ms.knowledge_seeker_desc': 'Desbloquea 10 entradas del compendio',
    'ms.monster_scholar': 'Erudita de Monstruos',
    'ms.monster_scholar_desc': 'Desbloquea 15 entradas del compendio',
    'ms.myth_breaker': 'Rompe Mitos',
    'ms.myth_breaker_desc': 'Desbloquea 25 entradas del compendio',
    'ms.grand_archivist': 'Gran Archivista',
    'ms.grand_archivist_desc': 'Desbloquea todas las entradas del compendio',

    // HUD
    'hud.level': 'Nivel',
    'hud.estra_bond': 'Vínculo de Estra',
    'hud.hormone_crystals': 'Cristales Hormonales',
    'hud.wellness_herbs': 'Hierbas de Bienestar',
    'hud.knowledge_scrolls': 'Pergaminos de Conocimiento',
    'hud.remedy_basic': 'Pociones Remedio (Básicas)',
    'hud.remedy_enhanced': 'Pociones Remedio (Mejoradas)',
    'hud.clarity_elixir': 'Elixires de Claridad',
    'hud.estra_boost': 'Impulsos de Estra',
    'hud.compendium': 'Compendio',

    // Ending
    'ending.bloom': 'La Floración Despierta',
    'ending.restored': ' ha restaurado el equilibrio del reino',
    'ending.biomes_restored': 'Biomas Restaurados',
    'ending.level_reached': 'Nivel Alcanzado',
    'ending.monsters_vanquished': 'Monstruos Vencidos',
    'ending.compendium': 'Compendio',
    'ending.estra_bond': 'Vínculo de Estra',
    'ending.quote': '"La menopausia no es un final — es una transformación. Cada sofoco resistido, cada niebla navegada, cada mito destruido te ha hecho más fuerte. El conocimiento que llevas es tu mayor remedio. No estás sola en este camino."',
    'ending.quote_author': '— Dra. Mira, Aldea del Hogar',
    'ending.thank_you': 'Gracias por jugar The M-QUEST',
    'ending.new_journey': 'Nuevo Viaje',
    'ending.continue': 'Seguir Explorando',

    // Feedback
    'feedback.title': 'Enviar Comentario',
    'feedback.placeholder': 'Error, idea o pensamiento…',
    'feedback.send': 'Enviar',
    'feedback.sending': 'Enviando…',
    'feedback.error': 'No se pudo enviar el comentario.',
    'feedback.success': '💜 ¡Gracias! Tu comentario ha sido guardado.',

    // Audio
    'audio.settings': 'Configuración de Audio',
    'audio.test': 'Probar',
    'audio.master': 'General',
    'audio.music': '🎵 Música',
    'audio.sfx': '✨ Efectos',

    // Game Rules
    'rules.title': 'Cómo Jugar',
    'rules.biomes_title': '🗺 Explora Biomas',
    'rules.biomes_desc': 'Viaja por 6 biomas, cada uno ligado a un sistema corporal afectado por la menopausia. Los biomas se desbloquean secuencialmente — limpia uno para acceder al siguiente.',
    'rules.battle_title': '⚔ Combate Monstruos',
    'rules.battle_desc': 'Cada bioma tiene monstruos míticos que difunden desinformación. Combátelos en batalla ATB en tiempo real respondiendo preguntas correctamente. ¡Construye combos para daño extra!',
    'rules.shrine_title': '✨ Visita Santuarios del Conocimiento',
    'rules.shrine_desc': 'Los santuarios te enseñan datos médicos reales y recompensan con XP + Pergaminos de Conocimiento. Las exploradoras ganan doble pergaminos y Esencia de Floración extra.',
    'rules.npc_title': '💬 Habla con PNJs',
    'rules.npc_desc': 'Cada bioma tiene un personaje con una historia personal. Hablar otorga Hierbas de Bienestar y desbloquea su biografía en el Compendio. Las defensoras ganan XP extra de conversaciones.',
    'rules.craft_title': '🧪 Fabrica Remedios',
    'rules.craft_desc': 'Visita la Estación de Fabricación en la Aldea del Hogar para combinar recursos en pociones, elixires y sellos. Úsalos en batalla o para desbloquear conocimiento oculto.',
    'rules.comp_title': '📖 Llena el Compendio',
    'rules.comp_desc': 'Desbloquea datos, desmitificadores, entradas del bestiario y biografías de PNJ. ¡Alcanza logros para recompensas extra. Fabrica Sellos del Compendio para revelar entradas ocultas!',
    'rules.restore_title': '🌟 Restaura el Reino Interior',
    'rules.restore_desc': 'Limpiar biomas restaura el brillo de Estra y sana el mundo. Limpia los 6 biomas para llegar al final y completar tu viaje.',
    'rules.bg_title': '🎭 Trasfondos y Especialidades',
    'rules.bg_caregiver': 'Cuidadora: +5 hierbas iniciales, +1 hierba extra de PNJs',
    'rules.bg_scholar': 'Erudita: +15% XP de todas las fuentes, +3 pergaminos iniciales',
    'rules.bg_advocate': 'Defensora: +1 Vínculo con Estra, XP y hierbas extra de PNJs',
    'rules.bg_explorer': 'Exploradora: +3 cristales iniciales, doble pergaminos + esencia de floración en santuarios',
    'rules.bg_specialty': 'Las especialidades otorgan 1.5× de daño en sus biomas asociados.',

    // World states
    'world.flux': 'Fluctuación',
    'world.aware': 'Consciencia',
    'world.healing': 'Sanando',
    'world.bloom': 'Floración',

    // Loading
    'loading': 'Cargando tu aventura...',

    // Potion menu
    'potion.basic_hp': '+30 HP',
    'potion.enhanced_hp': '+60 HP',
    'potion.clarity_atb': '-50 ATB',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('mquest-lang');
    return (saved === 'es' ? 'es' : 'en') as Language;
  });

  const handleSetLang = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('mquest-lang', newLang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[lang][key] || translations['en'][key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
