// Spanish translations for all game data content
// Keyed by ID for biomes, monsters, questions, NPCs, compendium entries

export const biomeTranslations: Record<string, {
  name: string;
  bodySystem: string;
  description: string;
}> = {
  'fever-peaks': {
    name: 'Picos de Fiebre',
    bodySystem: 'Hipotálamo / Sofocos',
    description: 'Montañas volcánicas con resplandor de calor, ríos de magma y terreno cambiante. Los picos de temperatura hacen que las plataformas desaparezcan momentáneamente.',
  },
  'fog-marshes': {
    name: 'Marismas de Niebla',
    bodySystem: 'Cerebro / Función Cognitiva',
    description: 'Niebla densa, caminos cambiantes, voces resonantes. Los puntos de referencia desaparecen y reaparecen. Mecánicas de memoria desafían la navegación.',
  },
  'mood-tides': {
    name: 'Mareas del Ánimo',
    bodySystem: 'Hormonas / Salud Mental',
    description: 'Acantilados oceánicos dramáticos con tormentas impredecibles. PNJs emocionales cuyo diálogo cambia según las respuestas del cuestionario de ánimo.',
  },
  'crystal-caverns': {
    name: 'Cavernas de Cristal',
    bodySystem: 'Densidad Ósea / Salud Esquelética',
    description: 'Cuevas de hielo con formaciones cristalinas parecidas a huesos. Las estructuras se desmoronan a menos que se refuercen recolectando Cristales de Calcio.',
  },
  'heartland': {
    name: 'Llanuras del Corazón',
    bodySystem: 'Sistema Cardiovascular',
    description: 'Praderas ondulantes cruzadas por ríos que pulsan como un latido. La velocidad del flujo indica la salud cardiovascular.',
  },
  'bloom-garden': {
    name: 'Jardín de la Floración',
    bodySystem: 'Postmenopausia / Restauración',
    description: 'Zona final. Mundo completamente restaurado. Exuberante, vibrante, radiante. Sin combate — exploración y reflexión puras.',
  },
};

export const monsterTranslations: Record<string, {
  name: string;
  myth: string;
  truth: string;
  mechanicDescription: string;
}> = {
  'shame-dragon': {
    name: 'El Dragón de la Vergüenza',
    myth: 'La menopausia significa que eres vieja e irrelevante.',
    truth: 'La menopausia es una transición biológica, no un final. Millones de mujeres la experimentan desde los 30 y siguen prosperando.',
    mechanicDescription: 'Un dragón temible — ¡sin mecánica especial de batalla, pero golpea fuerte!',
  },
  'dismissal-wraith': {
    name: 'El Espectro del Desdén',
    myth: 'Los sofocos son solo estrés — no son médicos.',
    truth: 'Los sofocos son un resultado fisiológico directo de la confusión hipotalámica causada por la disminución del estrógeno.',
    mechanicDescription: 'Apresuramiento Desdeñoso — ¡el temporizador se reduce a 10 segundos!',
  },
  'silence-specter': {
    name: 'El Espectro del Silencio',
    myth: 'Solo aguanta sola. No te quejes.',
    truth: 'La menopausia es manejable con el apoyo adecuado. El tratamiento médico, la comunidad y la conversación abierta son herramientas, no debilidades.',
    mechanicDescription: 'Silencio Espectral — ¡difumina el texto de la pregunta, aclarándose gradualmente!',
  },
  'confusion-cyclone': {
    name: 'El Ciclón de la Confusión',
    myth: 'La niebla mental es solo envejecimiento — no puedes hacer nada.',
    truth: 'Los cambios cognitivos durante la perimenopausia son mediados por hormonas, a menudo temporales y tratables.',
    mechanicDescription: 'Revuelta del Torbellino — ¡las opciones de respuesta se barajan aleatoriamente cada turno!',
  },
  'shame-tide': {
    name: 'La Marea de la Vergüenza',
    myth: 'Los cambios de humor significan que eres irracional.',
    truth: 'Los cambios de humor en la perimenopausia son respuestas neurológicas a cambios hormonales, no defectos de carácter.',
    mechanicDescription: 'Drenaje de la Marea — ¡cada turno puede consumir una de tus pociones automáticamente!',
  },
  'minimizer': {
    name: 'El Minimizador',
    myth: 'Todas pasan por eso. Deja de exagerar.',
    truth: 'Los síntomas de la menopausia afectan la vida diaria, las relaciones y el trabajo de muchas mujeres. Minimizarlos retrasa la atención.',
    mechanicDescription: 'Mirada Minimizadora — ¡el texto de las respuestas se encoge con el tiempo, actúa rápido!',
  },
  'brittle-giant': {
    name: 'El Gigante Frágil',
    myth: 'La pérdida ósea es inevitable. Nada ayuda.',
    truth: 'El ejercicio con carga de peso, calcio, Vitamina D y medicación pueden reducir significativamente la pérdida ósea.',
    mechanicDescription: 'Opciones Desmoronándose — ¡las respuestas se desvanecen con el tiempo, incluyendo la correcta!',
  },
  'cold-certainty': {
    name: 'La Certeza Fría',
    myth: 'La TRH es peligrosa — nunca la tomes.',
    truth: 'Las formulaciones modernas de TRH han sido actualizadas. Para la mayoría de las mujeres sanas menores de 60, los beneficios superan los riesgos.',
    mechanicDescription: 'Engaño Congelado — ¡una respuesta incorrecta brilla como si fuera la correcta!',
  },
  'fog-of-shame': {
    name: 'La Niebla de la Vergüenza',
    myth: 'No hables de la menopausia en público. Es privado.',
    truth: 'El silencio alrededor de la menopausia perpetúa mitos y retrasa la atención. La conversación abierta y precisa salva vidas.',
    mechanicDescription: 'Niebla Creciente — ¡la pantalla se llena de niebla mientras el temporizador baja!',
  },
  'heartbreak-myth': {
    name: 'El Mito del Corazón Roto',
    myth: 'Las enfermedades del corazón son problema de hombres.',
    truth: 'La enfermedad cardiovascular es la principal causa de muerte en mujeres postmenopáusicas.',
    mechanicDescription: 'Corazón Roto — ¡tu combo decae cada turno, mantén la racha viva!',
  },
  'grand-silencer': {
    name: 'El Gran Silenciador',
    myth: 'Todos los mitos combinados — la suma del silencio sistémico.',
    truth: 'El mayor mito es que la menopausia debe sufrirse en silencio. El conocimiento es poder.',
    mechanicDescription: 'Gran Silencio — ¡preguntas difuminadas Y respuestas barajadas combinadas!',
  },
};

// Monster mechanic translations
export const mechanicTranslations: Record<string, { name: string; description: string }> = {
  'confusion-cyclone': { name: 'Revuelta del Torbellino', description: '¡Las opciones de respuesta se barajan aleatoriamente cada vez!' },
  'silence-specter': { name: 'Silencio Espectral', description: '¡Las preguntas están difuminadas — lee con cuidado!' },
  'dismissal-wraith': { name: 'Apresuramiento Desdeñoso', description: '¡El temporizador se reduce a 10 segundos!' },
  'minimizer': { name: 'Mirada Minimizadora', description: '¡El texto de las respuestas se encoge con el tiempo — actúa rápido!' },
  'shame-tide': { name: 'Drenaje de la Marea', description: '¡Cada turno puede consumir una poción automáticamente!' },
  'brittle-giant': { name: 'Opciones Desmoronándose', description: '¡Las respuestas incorrectas se desvanecen... ¡pero la correcta también podría!' },
  'cold-certainty': { name: 'Engaño Congelado', description: '¡Una respuesta incorrecta brilla como la correcta!' },
  'fog-of-shame': { name: 'Niebla Creciente', description: '¡La pantalla se llena de niebla mientras el temporizador baja!' },
  'heartbreak-myth': { name: 'Corazón Roto', description: '¡El combo decae cada turno — mantén la racha viva!' },
  'grand-silencer': { name: 'Gran Silencio', description: '¡Preguntas difuminadas Y respuestas barajadas combinadas!' },
};

// Question translations (by question ID)
export const questionTranslations: Record<string, {
  text: string;
  options: string[];
  explanation: string;
}> = {
  // ========== FEVER PEAKS — SHAME DRAGON ==========
  'sd-1': { text: '¿Qué órgano produce la mayor parte del estrógeno del cuerpo?', options: ['Glándulas suprarrenales', 'Tiroides', 'Ovarios', 'Glándula pituitaria'], explanation: 'Los ovarios son la fuente principal de estrógeno en las mujeres premenopáusicas.' },
  'sd-2': { text: '¿Cuál es la edad promedio en la que ocurre la menopausia?', options: ['Alrededor de 40', 'Alrededor de 45', 'Alrededor de 51', 'Alrededor de 60'], explanation: 'La edad promedio de la menopausia es 51, aunque puede ocurrir desde los 30 tardíos hasta los 55.' },
  'sd-3': { text: '¿La perimenopausia típicamente comienza cuántos años antes del último período?', options: ['1–2 años', '4–8 años', '10–15 años', 'Solo unos meses'], explanation: 'La perimenopausia puede comenzar de 4 a 8 años antes de la menopausia.' },
  'sd-4': { text: '¿La disminución de qué hormona es la principal responsable de los síntomas menopáusicos?', options: ['Progesterona', 'Testosterona', 'Estrógeno', 'Cortisol'], explanation: 'La disminución del estrógeno es el principal impulsor de la mayoría de los síntomas menopáusicos.' },
  'sd-5': { text: '¿La menopausia se confirma oficialmente después de cuántos meses sin período?', options: ['3 meses', '6 meses', '12 meses', '24 meses'], explanation: 'La menopausia se confirma después de 12 meses consecutivos sin período menstrual.' },
  'sd-6': { text: 'La menopausia es un proceso biológico natural que:', options: ['Solo afecta a mujeres no saludables', 'Toda mujer con ovarios experimentará', 'Se puede prevenir con dieta', 'Es una enfermedad moderna'], explanation: 'La menopausia es universal para todas las mujeres con ovarios funcionales — no es una enfermedad ni un trastorno.' },
  'sd-7': { text: 'La menopausia prematura ocurre antes de la edad:', options: ['45', '40', '50', '35'], explanation: 'La menopausia antes de los 40 se considera insuficiencia ovárica prematura y afecta a aproximadamente el 1% de las mujeres.' },

  // ========== FEVER PEAKS — DISMISSAL WRAITH ==========
  'dw-1': { text: '¿Qué causa los sofocos durante la menopausia?', options: ['Presión arterial alta', 'Disfunción del hipotálamo por la disminución del estrógeno', 'Ansiedad y estrés', 'Exceso de calor corporal'], explanation: 'La disminución del estrógeno afecta al hipotálamo, haciendo que lea mal la temperatura corporal y desencadene un sofoco.' },
  'dw-2': { text: '¿Cuánto puede durar típicamente un solo sofoco?', options: ['1–2 segundos', '30 segundos a 5 minutos', 'Aproximadamente una hora', 'Todo el día'], explanation: 'La mayoría de los sofocos duran entre 30 segundos y 5 minutos.' },
  'dw-3': { text: 'Los sudores nocturnos son:', options: ['No relacionados con la menopausia', 'Sofocos que ocurren durante el sueño', 'Causados por demasiadas mantas', 'Solo psicológicos'], explanation: 'Los sudores nocturnos son sofocos que ocurren durante el sueño, alterando la calidad del sueño.' },
  'dw-4': { text: '¿Qué parte del cerebro actúa como termostato del cuerpo?', options: ['Cerebelo', 'Amígdala', 'Hipotálamo', 'Hipocampo'], explanation: 'El hipotálamo regula la temperatura corporal. La disminución del estrógeno lo hace más sensible.' },
  'dw-5': { text: '¿Qué cambio de estilo de vida puede ayudar a reducir la frecuencia de los sofocos?', options: ['Comer comida picante', 'Evitar desencadenantes como cafeína y alcohol', 'Usar capas pesadas', 'Tomar baños muy calientes'], explanation: 'Los desencadenantes comunes incluyen cafeína, alcohol, comidas picantes y ambientes calurosos.' },
  'dw-6': { text: '¿Los sofocos afectan aproximadamente a qué porcentaje de mujeres menopáusicas?', options: ['Aproximadamente 10%', 'Aproximadamente 25%', 'Aproximadamente 50%', 'Aproximadamente 75%'], explanation: 'Hasta el 75% de las mujeres menopáusicas experimentan sofocos, siendo el síntoma más común.' },
  'dw-7': { text: 'La zona termoneutral se estrecha durante la menopausia, lo que significa:', options: ['Las mujeres toleran todas las temperaturas', 'Pequeños cambios de temperatura desencadenan sofocos', 'La temperatura corporal baja permanentemente', 'La sudoración se detiene'], explanation: 'Una zona termoneutral estrechada significa que incluso cambios menores de temperatura activan la respuesta de enfriamiento del cuerpo.' },

  // ========== FOG MARSHES — SILENCE SPECTER ==========
  'ss-1': { text: '¿Qué puede ayudar a manejar la niebla mental durante la perimenopausia?', options: ['Ignorarla completamente', 'Ejercicio regular y buen sueño', 'Beber más café', 'Trabajar más duro'], explanation: 'El ejercicio mejora el flujo sanguíneo al cerebro, y el sueño de calidad apoya la función cognitiva.' },
  'ss-2': { text: '¿Cuál describe mejor la "niebla mental"?', options: ['Un diagnóstico médico', 'Dificultad para concentrarse, olvidos y confusión mental', 'Un tipo de dolor de cabeza', 'Pérdida de conciencia'], explanation: 'La niebla mental se refiere a síntomas cognitivos como mala concentración y dificultad para pensar con claridad.' },
  'ss-3': { text: 'Buscar ayuda médica para los síntomas de la menopausia es:', options: ['Drama innecesario', 'Una señal de fortaleza y autodefensa', 'Solo para casos severos', 'Una pérdida de tiempo del médico'], explanation: 'Buscar ayuda es atención médica proactiva. Los síntomas de la menopausia son tratables y merecen atención médica.' },
  'ss-4': { text: 'La dificultad para encontrar palabras durante la perimenopausia es:', options: ['Una señal de deterioro grave', 'Muy común y generalmente temporal', 'Extremadamente raro', 'Solo en mujeres mayores de 60'], explanation: 'Los momentos de "en la punta de la lengua" están bien documentados y son generalmente temporales durante la perimenopausia.' },
  'ss-5': { text: 'La investigación sugiere que la niebla mental perimenopáusica es más similar a:', options: ['Daño cerebral permanente', 'Los efectos cognitivos de la privación de sueño', 'Esquizofrenia', 'Conmoción cerebral'], explanation: 'Los estudios muestran que los síntomas cognitivos perimenopáusicos se asemejan a la privación de sueño — temporales y reversibles.' },
  'ss-6': { text: 'Los grupos de apoyo y comunidades de pares durante la menopausia:', options: ['Son una pérdida de tiempo', 'Pueden reducir significativamente el aislamiento y mejorar los resultados', 'Solo ayudan en casos severos', 'No están basados en evidencia'], explanation: 'El apoyo entre pares reduce el aislamiento, proporciona consejos prácticos y mejora el bienestar emocional.' },
  'ss-7': { text: 'Hablar abiertamente de la menopausia en el trabajo:', options: ['Es poco profesional', 'Puede mejorar las políticas y reducir el estigma', 'Siempre debe evitarse', 'Solo beneficia a las mujeres mayores'], explanation: 'Las conversaciones abiertas en el trabajo llevan a mejor apoyo, adaptaciones y reducción del estigma para todas.' },

  // ========== FOG MARSHES — CONFUSION CYCLONE ==========
  'cc2-1': { text: 'La "niebla mental" durante la perimenopausia es causada por:', options: ['Falta de sueño', 'Cambios hormonales que afectan el cerebro', 'Demencia temprana', 'Pereza'], explanation: 'La niebla mental está vinculada a niveles fluctuantes de estrógeno que afectan la función de los neurotransmisores.' },
  'cc2-2': { text: 'Los cambios cognitivos durante la perimenopausia son típicamente:', options: ['Permanentes y empeoran', 'Una señal de Alzheimer', 'Temporales y mediados por hormonas', 'Imaginarios'], explanation: 'La mayoría de los síntomas cognitivos mejoran después de la transición menopáusica a medida que el cerebro se adapta.' },
  'cc2-3': { text: '¿Qué neurotransmisor es afectado por la disminución del estrógeno, impactando la memoria?', options: ['Dopamina', 'Serotonina', 'Acetilcolina', 'GABA'], explanation: 'La acetilcolina, crucial para la memoria y el aprendizaje, es influenciada por los niveles de estrógeno.' },
  'cc2-4': { text: 'Los receptores de estrógeno en el cerebro se concentran en áreas responsables de:', options: ['Visión y audición', 'Memoria y función ejecutiva', 'Gusto y olfato', 'Solo reflejos'], explanation: 'El hipocampo y la corteza prefrontal son ricos en receptores de estrógeno.' },
  'cc2-5': { text: '¿Qué actividad ha demostrado mejorar la función cognitiva durante la perimenopausia?', options: ['Ver más televisión', 'Ejercicio aeróbico', 'Reducir toda estimulación mental', 'Comer más azúcar'], explanation: 'El ejercicio aeróbico aumenta el flujo sanguíneo al cerebro y promueve la neuroplasticidad.' },
  'cc2-6': { text: 'La neuroplasticidad durante la perimenopausia significa que el cerebro puede:', options: ['Ya no puede cambiar', 'Recablearse y adaptarse a nuevos niveles hormonales', 'Solo deteriorarse', 'Hacer crecer huesos nuevos'], explanation: 'El cerebro retiene su capacidad de formar nuevas conexiones neuronales y adaptarse incluso durante cambios hormonales.' },
  'cc2-7': { text: 'La dificultad para realizar múltiples tareas durante la perimenopausia es:', options: ['Una señal de pereza', 'Relacionada con efectos hormonales en la atención', 'No es un síntoma real', 'Solo en tu imaginación'], explanation: 'Los cambios hormonales afectan la atención y la memoria de trabajo, dificultando temporalmente la multitarea.' },

  // ========== MOOD TIDES — SHAME TIDE ==========
  'st-1': { text: 'Los cambios de humor durante la perimenopausia son causados principalmente por:', options: ['Debilidad personal', 'Respuestas neurológicas a cambios hormonales', 'Demasiado tiempo libre', 'Mala actitud'], explanation: 'Los cambios de humor son biológicos, causados por fluctuaciones hormonales que afectan los sistemas de neurotransmisores.' },
  'st-2': { text: 'El riesgo de depresión perimenopáusica aumenta porque el estrógeno influye en:', options: ['Niveles de azúcar en sangre', 'Regulación de serotonina y norepinefrina', 'Masa muscular', 'Elasticidad de la piel'], explanation: 'El estrógeno juega un papel en la regulación de la serotonina y la norepinefrina, neurotransmisores clave del ánimo.' },
  'st-3': { text: 'La irritabilidad durante la perimenopausia es:', options: ['Un defecto de carácter', 'Un síntoma bien documentado con causas biológicas', 'Solo para algunas personalidades', 'No es un síntoma real'], explanation: 'La irritabilidad es uno de los síntomas perimenopáusicos más comúnmente reportados.' },
  'st-4': { text: 'La ansiedad durante la perimenopausia puede ser causada por:', options: ['Solo estrés de la vida', 'Progesterona fluctuante y su efecto en GABA', 'Pensar demasiado', 'Falta de voluntad'], explanation: 'La progesterona tiene un efecto calmante a través de los receptores GABA. Cuando fluctúa, la ansiedad aumenta.' },
  'st-5': { text: '¿Cuál NO está típicamente asociado con cambios de humor perimenopáusicos?', options: ['Ansiedad', 'Irritabilidad', 'Alucinaciones persistentes', 'Tendencia al llanto'], explanation: 'Las alucinaciones persistentes no son un síntoma de la perimenopausia y deben evaluarse por separado.' },
  'st-6': { text: 'Llorar más fácilmente durante la perimenopausia es:', options: ['Una señal de enfermedad mental', 'Vinculado al efecto del estrógeno en el procesamiento emocional', 'Algo de lo que avergonzarse', 'Completamente no relacionado con las hormonas'], explanation: 'El estrógeno afecta la amígdala y los centros de regulación emocional, haciendo las respuestas emocionales más intensas.' },
  'st-7': { text: 'Sentirse "no como tú misma" durante la perimenopausia es:', options: ['Raro e inusual', 'Extremadamente común y tiene raíces biológicas', 'Una señal de que necesitas esforzarte más', 'Todo está en tu cabeza'], explanation: 'Muchas mujeres reportan sentirse diferentes durante la perimenopausia — este es un efecto hormonal bien documentado.' },

  // ========== MOOD TIDES — MINIMIZER ==========
  'mn-1': { text: '¿Cuál es un enfoque de tratamiento válido para los cambios de humor perimenopáusicos?', options: ['Solo esforzarse más', 'Terapia cognitivo-conductual', 'Ignorar los síntomas', 'Evitar todo contacto social'], explanation: 'La TCC está basada en evidencia y puede ayudar a manejar los cambios de humor durante la perimenopausia.' },
  'mn-2': { text: 'Las mujeres con antecedentes de depresión tienen:', options: ['Sin riesgo aumentado durante la perimenopausia', 'Un mayor riesgo de síntomas de ánimo durante la transición', 'Depresión severa garantizada', 'Nada de qué preocuparse'], explanation: 'La depresión previa es un factor de riesgo para los síntomas de ánimo perimenopáusicos.' },
  'mn-3': { text: 'El apoyo social durante la perimenopausia:', options: ['No tiene beneficio comprobado', 'Es una señal de debilidad', 'Está fuertemente vinculado a mejores resultados de salud mental', 'Debe evitarse'], explanation: 'La investigación muestra consistentemente que la conexión social mejora la salud mental durante la transición menopáusica.' },
  'mn-4': { text: 'Minimizar los síntomas de la menopausia ("todas pasan por eso") es dañino porque:', options: ['Fomenta la resiliencia', 'Retrasa a las mujeres en buscar atención médica adecuada', 'No tiene efecto', 'En realidad es útil'], explanation: 'La minimización lleva a sufrir en silencio y retrasa tratamientos que podrían mejorar significativamente la calidad de vida.' },
  'mn-5': { text: 'El impacto de la menopausia en la vida diaria:', options: ['Siempre es mínimo', 'Varía mucho y puede ser significativo para muchas mujeres', 'Es igual para todas', 'Solo afecta el ánimo'], explanation: 'La menopausia afecta a las mujeres de manera diferente — algunas tienen síntomas leves mientras otras experimentan una disrupción significativa.' },
  'mn-6': { text: 'La alteración del sueño relacionada con la menopausia puede llevar a:', options: ['Ningún problema real', 'Aumento de ansiedad, depresión y reducción de la función cognitiva', 'Mejor descanso en general', 'Solo inconvenientes menores'], explanation: 'El mal sueño agrava otros síntomas, creando un ciclo de fatiga, cambios de ánimo y dificultades cognitivas.' },
  'mn-7': { text: 'Una mujer dice "mis síntomas de menopausia están afectando mi trabajo." La mejor respuesta es:', options: ['"Todas lidian con eso"', '"Eso es válido — ¿has hablado con tu médico?"', '"No es para tanto"', '"Solo sigue adelante"'], explanation: 'Validar la experiencia y alentar el apoyo médico es la respuesta más útil.' },

  // ========== CRYSTAL CAVERNS — BRITTLE GIANT ==========
  'bg2-1': { text: '¿Qué tipo de ejercicio es mejor para la salud ósea?', options: ['Natación', 'Ejercicio con carga de peso', 'Solo estiramientos', 'Reposo en cama'], explanation: 'Los ejercicios con carga de peso como caminar, bailar y entrenamiento de resistencia estimulan la formación ósea.' },
  'bg2-2': { text: 'Después de la menopausia, la pérdida de densidad ósea se acelera porque:', options: ['La gravedad aumenta', 'El estrógeno que protegía los huesos disminuye', 'El calcio deja de funcionar', 'Los huesos se disuelven naturalmente'], explanation: 'El estrógeno ayuda a mantener la densidad ósea. Cuando disminuye, la resorción ósea aumenta.' },
  'bg2-3': { text: 'Osteoporosis significa:', options: ['Huesos fuertes', 'Huesos porosos y debilitados', 'Articulaciones inflamadas', 'Deterioro muscular'], explanation: 'Osteoporosis literalmente significa "hueso poroso" — frágil y propenso a fracturas.' },
  'bg2-4': { text: 'En los primeros 5 años después de la menopausia, las mujeres pueden perder hasta qué porcentaje de densidad ósea?', options: ['1–2%', '5–10%', 'Hasta 20%', 'Más del 50%'], explanation: 'Las mujeres pueden perder hasta el 20% de densidad ósea en los 5–7 años siguientes a la menopausia.' },
  'bg2-5': { text: 'Una densitometría DEXA mide:', options: ['Presión arterial', 'Densidad mineral ósea', 'Niveles hormonales', 'Masa muscular'], explanation: 'La DEXA es la prueba estándar para medir la densidad mineral ósea.' },
  'bg2-6': { text: '¿Cuál de estos aumenta el riesgo de osteoporosis?', options: ['Entrenamiento de fuerza regular', 'Fumar y consumo excesivo de alcohol', 'Comer productos lácteos', 'Caminar diariamente'], explanation: 'Fumar y el exceso de alcohol aceleran la pérdida ósea y aumentan el riesgo de fracturas.' },
  'bg2-7': { text: 'Los sitios de fractura más comunes en la osteoporosis son:', options: ['Dedos de manos y pies', 'Cadera, columna y muñeca', 'Cráneo y costillas', 'Solo rodillas'], explanation: 'La cadera, columna y muñeca son los sitios más vulnerables para fracturas osteoporóticas.' },

  // ========== CRYSTAL CAVERNS — COLD CERTAINTY ==========
  'ck-1': { text: '¿Qué nutrientes son más importantes para la salud ósea?', options: ['Hierro y zinc', 'Calcio y Vitamina D', 'Vitamina C y B12', 'Omega-3 y fibra'], explanation: 'El calcio es el bloque de construcción del hueso, y la Vitamina D es esencial para la absorción de calcio.' },
  'ck-2': { text: '¿Cuánto calcio por día necesitan típicamente las mujeres postmenopáusicas?', options: ['200 mg', '500 mg', '1.200 mg', '3.000 mg'], explanation: 'La mayoría de las guías recomiendan 1.200 mg de calcio diario para mujeres postmenopáusicas.' },
  'ck-3': { text: 'La TRH moderna para la protección ósea:', options: ['Siempre es peligrosa', 'Puede ayudar a mantener la densidad ósea cuando los beneficios superan los riesgos', 'No tiene efecto en los huesos', 'Es solo para hombres'], explanation: 'Para la mayoría de las mujeres sanas menores de 60, la TRH puede ayudar a mantener la densidad ósea con beneficios que a menudo superan los riesgos.' },
  'ck-4': { text: 'La Vitamina D es importante para los huesos porque:', options: ['Hace los huesos más duros', 'Ayuda al cuerpo a absorber calcio', 'Reemplaza el estrógeno', 'No tiene efecto real'], explanation: 'Sin Vitamina D adecuada, el cuerpo no puede absorber calcio de los alimentos de manera efectiva.' },
  'ck-5': { text: 'La afirmación "la TRH siempre es peligrosa" es:', options: ['Completamente cierta', 'Una simplificación obsoleta basada en un estudio defectuoso', 'Respaldada por la ciencia actual', 'Solo cierta para mujeres jóvenes'], explanation: 'El estudio WHI fue ampliamente malinterpretado. La evidencia moderna muestra que la TRH es segura para la mayoría de las mujeres cuando se inicia apropiadamente.' },
  'ck-6': { text: 'Los bifosfonatos son medicamentos que:', options: ['Aceleran la degradación ósea', 'Ralentizan la pérdida ósea inhibiendo los osteoclastos', 'Solo tratan el dolor', 'Reemplazan el calcio perdido'], explanation: 'Los bifosfonatos funcionan reduciendo la actividad de los osteoclastos, las células que degradan el hueso.' },
  'ck-7': { text: 'La salud ósea se mantiene mejor mediante:', options: ['Evitar toda actividad', 'Una combinación de ejercicio, nutrición y atención médica', 'Solo suplementos de calcio', 'Aceptar la pérdida ósea como inevitable'], explanation: 'Un enfoque múltiple que combina ejercicio, nutrición y supervisión médica es lo más efectivo.' },

  // ========== HEARTLAND — FOG OF SHAME ==========
  'fs-1': { text: '¿Cómo afecta la menopausia al riesgo cardiovascular?', options: ['Lo reduce', 'No tiene efecto', 'El riesgo aumenta a medida que el efecto protector del estrógeno disminuye', 'Solo afecta a los hombres'], explanation: 'El estrógeno tiene efectos protectores en el sistema cardiovascular. Después de la menopausia, el riesgo aumenta.' },
  'fs-2': { text: 'El estrógeno ayuda a los vasos sanguíneos al:', options: ['Hacerlos rígidos', 'Mantenerlos flexibles y dilatados', 'Encogerlos', 'No tener efecto'], explanation: 'El estrógeno promueve la elasticidad de los vasos sanguíneos y un flujo sanguíneo saludable.' },
  'fs-3': { text: '¿Qué factor de estilo de vida reduce más el riesgo cardiovascular después de la menopausia?', options: ['Tomar más siestas', 'Actividad física regular', 'Comer más carne roja', 'Evitar la luz solar'], explanation: 'El ejercicio regular fortalece el corazón y ayuda a mantener una presión arterial saludable.' },
  'fs-4': { text: 'Hablar abiertamente sobre la menopausia y la salud cardíaca:', options: ['Es vergonzoso', 'Salva vidas al alentar exámenes proactivos', 'No tiene beneficio', 'Solo importa a los médicos'], explanation: 'La conversación abierta lleva a exámenes más tempranos, diagnóstico y prevención que salva vidas.' },
  'fs-5': { text: 'La dieta mediterránea se recomienda para la salud cardíaca porque:', options: ['Elimina toda grasa', 'Es rica en grasas saludables, fibra y antioxidantes', 'Se enfoca en la carne roja', 'Evita todos los carbohidratos'], explanation: 'La dieta mediterránea enfatiza aceite de oliva, pescado, verduras y granos integrales.' },
  'fs-6': { text: 'Las mujeres que discuten la menopausia con su médico tienen más probabilidades de:', options: ['Ser ignoradas', 'Recibir exámenes cardíacos preventivos', 'Perder el tiempo', 'Recibir medicación innecesaria'], explanation: 'Las mujeres que mencionan la menopausia en consultas médicas tienen más probabilidades de recibir exámenes cardiovasculares completos.' },
  'fs-7': { text: 'La vergüenza sobre la menopausia puede llevar a:', options: ['Mejores resultados', 'Atención médica retrasada y peor salud', 'Ninguna consecuencia real', 'Recuperación más rápida'], explanation: 'La vergüenza impide que las mujeres busquen ayuda, llevando a diagnósticos y tratamientos retrasados.' },

  // ========== HEARTLAND — HEARTBREAK MYTH ==========
  'hm-1': { text: 'La enfermedad cardiovascular es la principal causa de muerte en:', options: ['Solo hombres mayores de 60', 'Mujeres postmenopáusicas', 'Adolescentes', 'Solo mujeres pre-menopáusicas'], explanation: 'La enfermedad cardíaca es la causa #1 de muerte en mujeres postmenopáusicas, pero se percibe erróneamente como una "enfermedad de hombres."' },
  'hm-2': { text: '¿Qué cambio lipídico ocurre comúnmente después de la menopausia?', options: ['El LDL disminuye', 'El HDL aumenta', 'El colesterol LDL aumenta', 'Los triglicéridos disminuyen'], explanation: 'Después de la menopausia, el colesterol LDL ("malo") a menudo aumenta mientras el HDL puede disminuir.' },
  'hm-3': { text: 'Los síntomas de enfermedad cardíaca en mujeres a menudo difieren de los hombres. Las mujeres pueden experimentar:', options: ['Solo dolor de pecho', 'Dolor de mandíbula, náuseas y fatiga inusual', 'Ningún síntoma nunca', 'Solo dolor de brazo'], explanation: 'Los síntomas de ataque cardíaco en mujeres pueden ser más sutiles — incluyendo dolor de mandíbula, náuseas y fatiga extrema.' },
  'hm-4': { text: 'La presión arterial después de la menopausia tiende a:', options: ['Disminuir significativamente', 'Permanecer exactamente igual', 'Subir debido a la pérdida del efecto vasodilatador del estrógeno', 'Volverse aleatoria'], explanation: 'Sin el efecto vasodilatador del estrógeno, los vasos sanguíneos se vuelven menos flexibles, a menudo elevando la presión arterial.' },
  'hm-5': { text: 'El mito de que la enfermedad cardíaca es un "problema de hombres" es peligroso porque:', options: ['En realidad es cierto', 'Las mujeres retrasan la búsqueda de ayuda, llevando a peores resultados', 'No afecta el tratamiento', 'Los hombres están más en riesgo'], explanation: 'Este mito hace que las mujeres subestimen su riesgo y retrasen la atención médica que salva vidas.' },
  'hm-6': { text: 'Después de la menopausia, el riesgo de síndrome metabólico aumenta debido a:', options: ['Mejor metabolismo', 'Cambios en la distribución de grasa y resistencia a la insulina', 'Dieta mejorada', 'Menos estrés'], explanation: 'Los cambios hormonales desplazan la distribución de grasa al abdomen y aumentan la resistencia a la insulina.' },
  'hm-7': { text: 'El monitoreo regular de la presión arterial después de la menopausia es:', options: ['Innecesario', 'Una medida preventiva importante', 'Solo para quienes tienen síntomas', 'Una pérdida de tiempo'], explanation: 'El monitoreo regular detecta la hipertensión temprano, cuando es más tratable.' },

  // ========== BLOOM GARDEN — GRAND SILENCER ==========
  'gs-1': { text: 'La Terapia de Reemplazo Hormonal (TRH) puede ayudar a manejar:', options: ['Solo sofocos', 'Múltiples síntomas incluyendo sofocos, pérdida ósea y cambios de ánimo', 'Ningún síntoma', 'Solo aumento de peso'], explanation: 'La TRH puede tratar sofocos, sequedad vaginal, pérdida ósea y síntomas de ánimo.' },
  'gs-2': { text: 'El autocuidado durante la menopausia es:', options: ['Egoísta e indulgente', 'Una estrategia apoyada médicamente', 'Solo para síntomas severos', 'Una pérdida de tiempo'], explanation: 'El ejercicio, la higiene del sueño, la nutrición y el manejo del estrés son estrategias basadas en evidencia.' },
  'gs-3': { text: 'Después de la transición menopáusica, muchas mujeres reportan:', options: ['Solo cambios negativos', 'Un sentido de libertad y propósito renovado', 'Pérdida total de identidad', 'Nada cambia'], explanation: 'Muchas mujeres postmenopáusicas se sienten más seguras y con propósito — la "segunda primavera."' },
  'gs-4': { text: '¿Cuál es un enfoque complementario basado en evidencia para los síntomas de la menopausia?', options: ['Meditación de atención plena', 'Ignorar todos los síntomas', 'Restricción calórica extrema', 'Evitar toda actividad'], explanation: 'La meditación de atención plena ha mostrado beneficios para sofocos, ansiedad y sueño.' },
  'gs-5': { text: 'El concepto de "vitalidad postmenopáusica" fue acuñado por:', options: ['Sigmund Freud', 'Margaret Mead', 'Florence Nightingale', 'Marie Curie'], explanation: 'La antropóloga Margaret Mead describió el aumento de energía que muchas mujeres sienten después de la menopausia.' },
  'gs-6': { text: 'La buena higiene del sueño durante la menopausia incluye:', options: ['Usar el teléfono en la cama', 'Mantener una habitación fresca y oscura con horario consistente', 'Dormir cuando sea', 'Vino antes de dormir'], explanation: 'Una habitación fresca ayuda con los sudores nocturnos, la oscuridad promueve la melatonina, la consistencia entrena tu ritmo.' },
  'gs-7': { text: 'Hablar abiertamente sobre la menopausia es importante porque:', options: ['Está de moda', 'Reduce el estigma y ayuda a otros a buscar apoyo', 'No importa', 'Empeora las cosas'], explanation: 'Romper el silencio reduce la vergüenza y anima a las mujeres a buscar ayuda.' },
  'gs-8': { text: 'El sistema endocrino durante la menopausia:', options: ['Se apaga completamente', 'Se reorganiza — las suprarrenales y el tejido graso asumen parte de la producción hormonal', 'Funciona idénticamente', 'Solo afecta la reproducción'], explanation: 'Después de la menopausia, las glándulas suprarrenales y el tejido adiposo se convierten en fuentes importantes de estrógeno.' },
  'gs-9': { text: 'El mayor mito sobre la menopausia es:', options: ['Es tratable', 'Que debe sufrirse en silencio', 'Que afecta las hormonas', 'Que es biológica'], explanation: 'El silencio es el enemigo. El conocimiento, la comunidad y la atención médica transforman la experiencia.' },
  'gs-10': { text: 'Un plan integral de atención para la menopausia debe incluir:', options: ['Solo medicación', 'Cambios de estilo de vida, atención médica, apoyo emocional y educación', 'Solo ejercicio', 'Esperar a que pase'], explanation: 'Los mejores resultados vienen de un enfoque holístico que combina múltiples estrategias.' },
};

// NPC translations
export const npcTranslations: Record<string, { preRemedy: string; postRemedy: string }> = {
  'Elena': {
    preRemedy: 'Pensé que era solo estrés... todos me decían que me relajara.',
    postRemedy: 'Tiene un nombre. No me lo estoy imaginando. Gracias por ayudarme a verlo.',
  },
  'Dr. Mira': {
    preRemedy: 'Bienvenida a mi estudio. El conocimiento es la medicina más poderosa.',
    postRemedy: 'Te estás convirtiendo en toda una guardiana.',
  },
  'Yuki': {
    preRemedy: 'Sigo perdiendo mis palabras... tengo miedo de estar perdiéndome a mí misma.',
    postRemedy: 'Ahora tengo el lenguaje para ello. Eso cambia todo.',
  },
  'Priya': {
    preRemedy: 'Soy demasiado joven para esto... ¿verdad? La ansiedad apareció de la nada.',
    postRemedy: 'No soy demasiado joven. Y no estoy rota. Solo no tenía las palabras antes.',
  },
  'Saoirse': {
    preRemedy: 'Mi madre tenía osteoporosis. Siento que viene por mí también.',
    postRemedy: 'Ahora tengo un plan. Ejercicio, calcio, chequeos. Me siento en control.',
  },
  'Rosa': {
    preRemedy: 'Nadie me dijo que la menopausia podía afectar mi corazón. Tuve un evento el año pasado.',
    postRemedy: 'Ahora lo sé. Ahora me reviso. Ahora soy proactiva con mi salud cardíaca.',
  },
};

// Compendium entry translations
export const compendiumTranslations: Record<string, { title: string; content: string }> = {
  'fact-1': { title: '¿Qué es la Menopausia?', content: 'La menopausia es el cese permanente de la menstruación, confirmado después de 12 meses consecutivos sin período. Marca el fin de los años reproductivos pero no el fin de la vitalidad.' },
  'fact-2': { title: 'El Hipotálamo y los Sofocos', content: 'El hipotálamo actúa como el termostato del cuerpo. Cuando el estrógeno disminuye, se confunde y desencadena sofocos como una falsa alarma.' },
  'fact-3': { title: 'La Niebla Mental es Real', content: 'Los cambios cognitivos durante la perimenopausia son mediados por hormonas y típicamente temporales. El cerebro se adapta a los nuevos niveles hormonales con el tiempo.' },
  'fact-4': { title: 'Emociones y Hormonas', content: 'Los cambios de ánimo son respuestas neurológicas a cambios hormonales, no defectos de carácter. La serotonina y la norepinefrina son directamente afectadas por los niveles de estrógeno.' },
  'fact-5': { title: 'La Salud Ósea Importa', content: 'Después de la menopausia, la pérdida de densidad ósea se acelera. El ejercicio con carga de peso, calcio y Vitamina D son medidas preventivas esenciales.' },
  'fact-6': { title: 'Salud Cardíaca Después de la Menopausia', content: 'El estrógeno tenía efectos protectores en el sistema cardiovascular. Después de la menopausia, el riesgo de enfermedad cardíaca aumenta significativamente.' },
  'myth-1': { title: 'La Mentira del Dragón de la Vergüenza', content: 'MITO: La menopausia te hace vieja e irrelevante. VERDAD: La menopausia es una transición biológica, no un final.' },
  'myth-2': { title: 'La Mentira del Espectro del Desdén', content: 'MITO: Los sofocos son solo estrés. VERDAD: Los sofocos son un resultado fisiológico directo de cambios hipotalámicos.' },
  'myth-3': { title: 'La Mentira del Espectro del Silencio', content: 'MITO: Aguanta sola. VERDAD: El apoyo, la comunidad y la atención médica son herramientas de fortaleza.' },
  'myth-4': { title: 'La Mentira del Ciclón de la Confusión', content: 'MITO: La niebla mental es solo envejecimiento. VERDAD: Los cambios cognitivos son mediados por hormonas y a menudo temporales.' },
  'myth-5': { title: 'La Mentira de la Marea de la Vergüenza', content: 'MITO: Los cambios de humor te hacen irracional. VERDAD: Los cambios de ánimo son neurológicos, no debilidad emocional.' },
  'myth-6': { title: 'La Mentira del Minimizador', content: 'MITO: Todas pasan por eso, deja de exagerar. VERDAD: Los síntomas de la menopausia afectan la vida diaria y merecen atención adecuada.' },
  'myth-7': { title: 'La Mentira del Gigante Frágil', content: 'MITO: La pérdida ósea es inevitable. VERDAD: El ejercicio, la nutrición y la medicación pueden reducir significativamente la pérdida ósea.' },
  'myth-8': { title: 'La Mentira de la Certeza Fría', content: 'MITO: La TRH es peligrosa — nunca la tomes. VERDAD: La TRH moderna es segura para la mayoría de las mujeres sanas menores de 60.' },
  'myth-9': { title: 'La Mentira de la Niebla de la Vergüenza', content: 'MITO: No hables de la menopausia en público. VERDAD: La conversación abierta salva vidas y rompe el estigma.' },
  'myth-10': { title: 'La Mentira del Mito del Corazón Roto', content: 'MITO: La enfermedad cardíaca es problema de hombres. VERDAD: Es la principal causa de muerte en mujeres postmenopáusicas.' },
  'myth-11': { title: 'La Mentira del Gran Silenciador', content: 'MITO: La menopausia debe sufrirse en silencio. VERDAD: El conocimiento es poder. Hablar cambia todo.' },
  'best-1': { title: 'El Dragón de la Vergüenza', content: 'Un dragón temible nacido de la vergüenza interiorizada. Sin mecánica especial de batalla, pero su poder bruto es implacable. Debilidad: conocimiento factual sobre lo que realmente es la menopausia.' },
  'best-2': { title: 'El Espectro del Desdén', content: 'Una entidad espectral que se alimenta de síntomas descartados. Su Apresuramiento Desdeñoso acorta tu temporizador de respuesta a solo 10 segundos. Debilidad: reconocer los sofocos como eventos médicos reales.' },
  'best-3': { title: 'El Espectro del Silencio', content: 'Un fantasma que prospera en el sufrimiento no expresado. Su Silencio Espectral difumina tus preguntas, aclarándose gradualmente. Debilidad: romper el silencio buscando apoyo.' },
  'best-4': { title: 'El Ciclón de la Confusión', content: 'Un vórtice arremolinado de desinformación. Su Revuelta del Torbellino baraja aleatoriamente tus opciones de respuesta. Debilidad: comprensión clara y basada en evidencia de los cambios cognitivos.' },
  'best-5': { title: 'La Marea de la Vergüenza', content: 'Una ola implacable de supresión emocional. Su Drenaje de la Marea puede consumir tus pociones automáticamente cada turno. Debilidad: entender que los cambios de ánimo son biológicos, no fracaso personal.' },
  'best-6': { title: 'El Minimizador', content: 'Una criatura que encoge todo — tus palabras, tu dolor, tu realidad. Su Mirada Minimizadora hace que el texto de las respuestas se encoja ante tus ojos. Debilidad: negarse a minimizar los síntomas reales.' },
  'best-7': { title: 'El Gigante Frágil', content: 'Un coloso imponente con huesos desmoronándose. Sus Opciones Desmoronándose hacen que las respuestas se desvanezcan con el tiempo — incluso la correcta. Debilidad: conocimiento sobre salud ósea y prevención.' },
  'best-8': { title: 'La Certeza Fría', content: 'Una figura helada que dice falsedades absolutas con perfecta confianza. Su Engaño Congelado hace que una respuesta incorrecta brille como la correcta. Debilidad: comprensión matizada de la TRH.' },
  'best-9': { title: 'La Niebla de la Vergüenza', content: 'Una niebla rastrera que oscurece todo en tabú. Su Niebla Creciente llena la pantalla mientras el temporizador baja. Debilidad: conversación abierta y honesta sobre la menopausia.' },
  'best-10': { title: 'El Mito del Corazón Roto', content: 'Una entidad palpitante de desinformación cardiovascular. Su habilidad Corazón Roto decae tu combo cada turno. Debilidad: saber que la enfermedad cardíaca es la causa #1 de muerte en mujeres postmenopáusicas.' },
  'best-11': { title: 'El Gran Silenciador', content: 'El jefe final — la encarnación de todo el silencio sistémico. Combina preguntas difuminadas con respuestas barajadas. Debilidad: el conocimiento acumulado de cada bioma.' },
  'bio-elena': { title: 'Elena — La Descubridora Temprana', content: 'Elena, 48, de Picos de Fiebre. Pasó años escuchando que sus síntomas eran "solo estrés." Aprender la verdad le dio las palabras para abogar por sí misma.' },
  'bio-mira': { title: 'Dra. Mira — La Erudita', content: 'La Dra. Mira dirige el estudio de la Aldea del Hogar. Una ex investigadora que ahora dedica su vida a hacer el conocimiento sobre la menopausia accesible para todas.' },
  'bio-yuki': { title: 'Yuki — La Buscadora de Palabras', content: 'Yuki, 52, de Marismas de Niebla. Temía perderse a sí misma por la niebla mental. Entender la ciencia le devolvió su identidad.' },
  'bio-priya': { title: 'Priya — La Guerrera Temprana', content: 'Priya, 38, de Mareas del Ánimo. Pensaba que era "demasiado joven" para la perimenopausia. Aprender la verdad borró su vergüenza.' },
  'bio-saoirse': { title: 'Saoirse — La Guardiana de los Huesos', content: 'Saoirse, 45, de Cavernas de Cristal. El historial familiar de osteoporosis impulsó su miedo. Ahora armada con conocimiento de prevención, se siente en control.' },
  'bio-rosa': { title: 'Rosa — La Defensora del Corazón', content: 'Rosa, 55, de Llanuras del Corazón. Un evento cardíaco la impulsó a actuar. Ahora defiende la conciencia de la salud cardíaca para las mujeres menopáusicas.' },
  'seal-1': { title: 'Perimenopausia: El Capítulo Oculto', content: 'La perimenopausia puede comenzar hasta 10 años antes de la menopausia, a menudo a finales de los 30 o en los 40 de una mujer. Síntomas como períodos irregulares, cambios de ánimo y alteración del sueño pueden aparecer años antes de que los períodos se detengan completamente.' },
  'seal-2': { title: 'La Conexión Intestino-Hormona', content: 'El microbioma intestinal contiene una colección de bacterias llamada estroboloma, que ayuda a metabolizar el estrógeno. Durante la menopausia, los cambios intestinales pueden amplificar el desequilibrio hormonal, haciendo de la salud digestiva un factor oculto en la severidad de los síntomas.' },
  'seal-3': { title: 'Sueño y Menopausia', content: 'Hasta el 61% de las mujeres postmenopáusicas reportan insomnio. La disminución de la progesterona — un promotor natural del sueño — combinada con sudores nocturnos y ansiedad crea una tormenta perfecta para el descanso alterado.' },
};

// Shrine content translations
export const shrineTranslations: Record<string, string[]> = {
  'fever-peaks': [
    'El hipotálamo es el termostato del cuerpo. Ubicado en lo profundo del cerebro, regula la temperatura, el hambre y las señales hormonales.',
    'Cuando los niveles de estrógeno disminuyen durante la perimenopausia, el hipotálamo se confunde. Lee mal la temperatura del cuerpo, desencadenando sofocos — una ola repentina e intensa de calor.',
    'Los sofocos no son "solo estrés." Son un evento fisiológico con una causa biológica.',
  ],
  'fog-marshes': [
    'El estrógeno juega un papel crucial en la función cerebral, particularmente en áreas relacionadas con la memoria y la concentración.',
    'Durante la perimenopausia, los niveles fluctuantes de estrógeno pueden afectar neurotransmisores como la acetilcolina, llevando a lo que muchas mujeres describen como "niebla mental."',
    'Estos cambios cognitivos son típicamente temporales y mejoran a medida que el cerebro se adapta a los nuevos niveles hormonales.',
  ],
  'mood-tides': [
    'El estrógeno y la progesterona influyen directamente en la serotonina y la norepinefrina — dos neurotransmisores clave que regulan el ánimo, el sueño y la resiliencia emocional.',
    'Durante la perimenopausia, las fluctuaciones hormonales rápidas pueden desencadenar ansiedad, irritabilidad y episodios depresivos que se sienten repentinos e inexplicables.',
    'Estos cambios de ánimo son respuestas neurológicas, no defectos de carácter. La terapia, los ajustes de estilo de vida y a veces la medicación pueden hacer una diferencia significativa.',
  ],
  'crystal-caverns': [
    'El estrógeno juega un papel vital en la remodelación ósea — el proceso donde el hueso viejo se descompone y se reemplaza con tejido nuevo. Cuando el estrógeno disminuye, la destrucción ósea supera la reconstrucción.',
    'En los primeros 5–7 años después de la menopausia, las mujeres pueden perder hasta el 20% de su densidad ósea, aumentando significativamente el riesgo de osteoporosis y fracturas.',
    'El ejercicio con carga de peso, calcio y Vitamina D adecuados, y densitometrías óseas regulares son herramientas poderosas para la prevención.',
  ],
  'heartland': [
    'Antes de la menopausia, el estrógeno ayuda a mantener los vasos sanguíneos flexibles y apoya niveles saludables de colesterol. Después de la menopausia, esa protección se desvanece.',
    'La enfermedad cardíaca es la principal causa de muerte en mujeres postmenopáusicas — sin embargo, muchas mujeres no saben que su riesgo aumenta en esta etapa de la vida.',
    'Chequeos cardiovasculares regulares, mantener una dieta saludable para el corazón, mantenerse físicamente activa y controlar la presión arterial son pasos esenciales que toda mujer debe tomar.',
  ],
  'bloom-garden': [
    'El sistema endocrino es una red de glándulas — incluyendo los ovarios, la tiroides y las glándulas suprarrenales — que producen hormonas que gobiernan casi todas las funciones del cuerpo.',
    'Durante la menopausia, los ovarios gradualmente dejan de producir estrógeno y progesterona. Sin embargo, las glándulas suprarrenales y el tejido graso continúan produciendo pequeñas cantidades, y el cuerpo aprende a encontrar un nuevo equilibrio.',
    'Entender tu paisaje hormonal te empodera para trabajar con profesionales de la salud en planes de tratamiento personalizados — desde TRH hasta estrategias de estilo de vida — que honren el viaje único de tu cuerpo.',
  ],
};

// World state translations
export const worldStateTranslations: Record<string, string> = {
  'Flux': 'Fluctuación',
  'Aware': 'Consciencia',
  'Healing': 'Sanando',
  'Bloom': 'Floración',
};
