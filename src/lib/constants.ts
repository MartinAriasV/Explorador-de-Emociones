import type { PredefinedEmotion, TourStepData, SpiritAnimal, Reward, QuizQuestion } from './types';

export const PREDEFINED_EMOTIONS: PredefinedEmotion[] = [
  { name: 'Alegría', icon: '😄', description: 'Sentimiento de vivo placer y contentamiento.', example: 'Sentí una gran alegría al ver a mi familia.' },
  { name: 'Tristeza', icon: '😢', description: 'Estado de ánimo melancólico y apesadumbrado.', example: 'La película me dejó una profunda tristeza.' },
  { name: 'Ira', icon: '😠', description: 'Sentimiento de enfado muy grande y violento.', example: 'La injusticia le provocó un ataque de ira.' },
  { name: 'Miedo', icon: '😨', description: 'Sensación de angustia por un riesgo o daño real o imaginario.', example: 'Sintió miedo al caminar solo por la noche.' },
  { name: 'Calma', icon: '😌', description: 'Estado de tranquilidad y serenidad.', example: 'Después de la meditación, sintió una calma total.' },
  { name: 'Ansiedad', icon: '😟', description: 'Estado de agitación, inquietud o zozobra del ánimo.', example: 'La espera le generaba mucha ansiedad.' },
  { name: 'Sorpresa', icon: '😮', description: 'Asombro o extrañeza por algo imprevisto.', example: 'Su regalo fue una grata sorpresa.' },
  { name: 'Confianza', icon: '🤗', description: 'Seguridad y esperanza firme que se tiene de alguien o algo.', example: 'Tengo plena confianza en tus habilidades.' },
  { name: 'Gratitud', icon: '🙏', description: 'Sentimiento de estima y reconocimiento hacia quien ha hecho un favor.', example: 'Expresó su gratitud por la ayuda recibida.' },
  { name: 'Orgullo', icon: '🦁', description: 'Satisfacción por los logros, capacidades o méritos propios o de alguien.', example: 'Sintió orgullo de su trabajo al ver el resultado final.' },
  { name: 'Vergüenza', icon: '😳', description: 'Sentimiento de pérdida de la dignidad por una falta cometida o por una humillación sufrida.', example: 'Sintió vergüenza al tropezar en público.' },
  { name: 'Euforia', icon: '🥳', description: 'Sensación exteriorizada de optimismo y bienestar, producida a menudo por la administración de fármacos o drogas, o por alguna satisfacción.', example: 'Tras ganar la competición, el equipo estaba en un estado de euforia.' },
  { name: 'Nostalgia', icon: '🤔', description: 'Pena de verse ausente de la patria o de los deudos o amigos.', example: 'Mirar fotos antiguas le producía nostalgia.' },
  { name: 'Esperanza', icon: '✨', description: 'Estado de ánimo que surge cuando se presenta como alcanzable lo que se desea.', example: 'Mantenía la esperanza de que todo saldría bien.' },
  { name: 'Frustración', icon: '😤', description: 'Estado que se produce cuando no se logra alcanzar el objeto de un deseo.', example: 'Sintió frustración al no poder resolver el problema.' },
  { name: 'Amor', icon: '😍', description: 'Sentimiento intenso del ser humano que, partiendo de su propia insuficiencia, necesita y busca el encuentro y unión con otro ser.', example: 'Sintió un amor profundo desde el primer momento.' },
  { name: 'Alivio', icon: '😌', description: 'Disminución o mitigación de un dolor, una pena o una aflicción.', example: 'Sintió un gran alivio cuando terminó el examen.' },
  { name: 'Confusión', icon: '😕', description: 'Falta de orden o de claridad cuando se tienen o se barajan muchas posibilidades.', example: 'La información contradictoria le generó confusión.' },
  { name: 'Decepción', icon: '😞', description: 'Pesar causado por un desengaño.', example: 'La cancelación del viaje fue una gran decepción.' },
  { name: 'Motivación', icon: '💪', description: 'Conjunto de factores internos o externos que determinan en parte las acciones de una persona.', example: 'Encontró la motivación para empezar a hacer ejercicio.' },
  { name: 'Entusiasmo', icon: '🤩', description: 'Exaltación y fogosidad del ánimo, excitado por algo que lo admire o cautive.', example: 'Recibió la noticia con mucho entusiasmo.' },
  { name: 'Serenidad', icon: '🧘', description: 'Cualidad de sereno, apacible y tranquilo.', example: 'La serenidad del atardecer en la playa era incomparable.' },
  { name: 'Curiosidad', icon: '🧐', description: 'Deseo de saber o averiguar cosas.', example: 'La curiosidad lo llevó a abrir la misteriosa caja.' },
  { name: 'Valentía', icon: '🦸', description: 'Determinación para enfrentarse a situaciones arriesgadas o difíciles.', example: 'Demostró gran valentía al defender sus ideas.' },
  { name: 'Soledad', icon: '🚶', description: 'Carencia voluntaria o involuntaria de compañía.', example: 'A veces, disfrutaba de la soledad para reflexionar.' },
  { name: 'Inspiración', icon: '💡', description: 'Estímulo o lucidez repentina que siente una persona.', example: 'La naturaleza fue su mayor fuente de inspiración.' }
];

export const EMOTION_ANTONYMS: [string, string][] = [
    ['Alegría', 'Tristeza'],
    ['Ira', 'Calma'],
    ['Miedo', 'Confianza'],
    ['Ansiedad', 'Serenidad'],
    ['Orgullo', 'Vergüenza'],
    ['Euforia', 'Decepción'],
    ['Esperanza', 'Frustración'],
    ['Entusiasmo', 'Nostalgia'],
    ['Valentía', 'Miedo'],
    ['Motivación', 'Frustración'],
];


export const AVATAR_EMOJIS = ['😊', '😎', '🤔', '😂', '🥰', '😇', '🥳', '🤯', '🤩', '😴', '🌞', '⭐', '😄', '😢', '😠', '😨', '😌', '😟', '😮', '🤗', '🙏', '🦁', '😳', '✨', '😤', '😍', '😕', '😞', '💪', '😜', '😥', '😭', '🙄', '🤢', '🤐', '🥴', '🥺', '🤡', '👻', '👽', '🤖', '👾', '🎃', '😈', '👿', '🔥', '💯', '❤️', '💔', '👍', '👎'];


export const TOUR_STEPS: TourStepData[] = [
    { refKey: 'diaryRef', title: 'Tu Diario Personal', description: 'Aquí es donde puedes escribir tus entradas diarias. ¡Registra cómo te sientes cada día!' },
    { refKey: 'emocionarioRef', title: 'Crea tu Emocionario', description: 'Define tus propias emociones con nombres, iconos y colores. ¡Hazlo tuyo!' },
    { refKey: 'discoverRef', title: 'Descubre Nuevas Emociones', description: 'Explora una lista de emociones comunes y añádelas a tu propio emocionario.' },
    { refKey: 'gamesRef', title: 'Pon a Prueba tus Emociones', description: 'Diviértete y aprende con juegos interactivos diseñados para mejorar tu inteligencia emocional.' },
    { refKey: 'streakRef', title: 'Controla tu Racha', description: '¡Mantén la llama encendida! Registra tus emociones a diario para no perder tu racha.' },
    { refKey: 'sanctuaryRef', title: 'Tu Santuario de Recompensas', description: 'Alcanza hitos y desbloquea "animales espirituales" como recompensa por tu constancia.' },
    { refKey: 'calmRef', title: 'Rincón de la Calma', description: '¿Necesitas un respiro? Prueba nuestros ejercicios de respiración guiada para relajarte.' },
    { refKey: 'reportRef', title: 'Reporte Visual', description: 'Observa tus patrones emocionales a lo largo del tiempo con este calendario interactivo.' },
    { refKey: 'shareRef', title: 'Comparte tu Viaje', description: 'Genera un reporte de texto de tu diario para compartirlo con quien tú quieras.' },
    { refKey: 'profileRef', title: 'Personaliza tu Perfil', description: 'Elige tu nombre y un avatar que te represente. ¡Este es tu espacio!' },
];

export const SPIRIT_ANIMALS: SpiritAnimal[] = [
    {
        id: 'agile-hummingbird',
        name: 'Colibrí Ágil',
        icon: '🐦‍🔥',
        emotion: 'Entusiasmo',
        description: 'Representa la alegría, la energía y la capacidad de encontrar la dulzura en cada día.',
        rarity: 'Común',
        unlockHint: 'Se consigue al registrar tu primera emoción en el diario.',
    },
    {
        id: 'social-butterfly',
        name: 'Mariposa Social',
        icon: '🦋',
        emotion: 'Alegría',
        description: 'Encarna la transformación, la belleza de la conexión y el compartir tu viaje con otros.',
        rarity: 'Común',
        unlockHint: 'Se obtiene al usar la función de "Compartir Diario" por primera vez.',
    },
    {
        id: 'cunning-fox',
        name: 'Zorro Astuto',
        icon: '🦊',
        emotion: 'Curiosidad',
        description: 'Simboliza la inteligencia, la adaptabilidad y la capacidad de pensar de forma creativa.',
        rarity: 'Poco Común',
        unlockHint: 'Se consigue al mantener una racha de 3 días.',
    },
    {
        id: 'patient-turtle',
        name: 'Tortuga Paciente',
        icon: '🐢',
        emotion: 'Calma',
        description: 'Simboliza la perseverancia, la estabilidad y la sabiduría de ir a tu propio ritmo.',
        rarity: 'Poco Común',
        unlockHint: 'Se desbloquea al registrar 25 entradas en tu diario.',
    },
    {
        id: 'loyal-dog',
        name: 'Perro Leal',
        icon: '🐶',
        emotion: 'Confianza',
        description: 'Encarna la amistad incondicional, la confianza y la alegría de la compañía.',
        rarity: 'Poco Común',
        unlockHint: 'Se obtiene al añadir más de 10 emociones a tu emocionario.',
    },
    {
        id: 'empathetic-elephant',
        name: 'Elefante Empático',
        icon: '🐘',
        emotion: 'Empatía',
        description: 'Representa la memoria, la fuerza de los lazos afectivos y un profundo entendimiento de los demás.',
        rarity: 'Raro',
        unlockHint: 'Se desbloquea al alcanzar 50 entradas en tu diario.',
    },
    {
        id: 'loyal-wolf',
        name: 'Lobo Leal',
        icon: '🐺',
        emotion: 'Confianza',
        description: 'Encarna la lealtad, el trabajo en equipo y los fuertes lazos con la comunidad.',
        rarity: 'Raro',
        unlockHint: 'Se consigue al mantener una racha de 7 días.',
    },
    {
        id: 'proud-lion',
        name: 'León Orgulloso',
        icon: '🦁',
        emotion: 'Orgullo',
        description: 'Representa la fuerza, el liderazgo y la satisfacción de alcanzar metas importantes.',
        rarity: 'Raro',
        unlockHint: 'Se obtiene al mantener una racha de 14 días.',
    },
     {
        id: 'brave-eagle',
        name: 'Águila Valiente',
        icon: '🦅',
        emotion: 'Valentía',
        description: 'Simboliza la libertad, la visión clara y el coraje para volar por encima de los desafíos.',
        rarity: 'Épico',
        unlockHint: 'Se desbloquea al alcanzar 100 entradas en el diario.',
    },
    {
        id: 'wise-owl',
        name: 'Búho Sabio',
        icon: '🦉',
        emotion: 'Serenidad',
        description: 'Representa la sabiduría, la intuición y la capacidad de ver más allá de lo evidente.',
        rarity: 'Épico',
        unlockHint: 'Se consigue al mantener una racha de 30 días.',
    },
    {
        id: 'resilient-phoenix',
        name: 'Fénix Resiliente',
        icon: '🔥',
        emotion: 'Resiliencia',
        description: 'Encarna la capacidad de renacer de las cenizas, la superación y la transformación personal.',
        rarity: 'Épico',
        unlockHint: 'Se desbloquea recuperando un día perdido con el desafío de la racha.',
    },
    {
        id: 'protective-dragon',
        name: 'Dragón Protector',
        icon: '🐉',
        emotion: 'Protección',
        description: 'Simboliza un poder inmenso, la protección de tus tesoros emocionales y una sabiduría ancestral.',
        rarity: 'Legendario',
        unlockHint: 'Se consigue al mantener una racha de 60 días. Un logro monumental.',
    },
];

export const REWARDS: Reward[] = [
    // Entry count based rewards
    { id: 'entry-1', type: 'entry_count', value: 1, animal: SPIRIT_ANIMALS.find(a => a.id === 'agile-hummingbird')! },
    { id: 'entry-25', type: 'entry_count', value: 25, animal: SPIRIT_ANIMALS.find(a => a.id === 'patient-turtle')! },
    { id: 'entry-50', type: 'entry_count', value: 50, animal: SPIRIT_ANIMALS.find(a => a.id === 'empathetic-elephant')! },
    { id: 'entry-100', type: 'entry_count', value: 100, animal: SPIRIT_ANIMALS.find(a => a.id === 'brave-eagle')! },
    // Streak based rewards
    { id: 'streak-3', type: 'streak', value: 3, animal: SPIRIT_ANIMALS.find(a => a.id === 'cunning-fox')! },
    { id: 'streak-7', type: 'streak', value: 7, animal: SPIRIT_ANIMALS.find(a => a.id === 'loyal-wolf')! },
    { id: 'streak-14', type: 'streak', value: 14, animal: SPIRIT_ANIMALS.find(a => a.id === 'proud-lion')! },
    { id: 'streak-30', type: 'streak', value: 30, animal: SPIRIT_ANIMALS.find(a => a.id === 'wise-owl')! },
    { id: 'streak-60', type: 'streak', value: 60, animal: SPIRIT_ANIMALS.find(a => a.id === 'protective-dragon')! },
    // Emotion count based rewards
    { id: 'emotion-10', type: 'emotion_count', value: 10, animal: SPIRIT_ANIMALS.find(a => a.id === 'loyal-dog')! },
    // Special rewards
    { id: 'share-1', type: 'share', value: 1, animal: SPIRIT_ANIMALS.find(a => a.id === 'social-butterfly')! },
    { id: 'phoenix-reward', type: 'special', value: 1, animal: SPIRIT_ANIMALS.find(a => a.id === 'resilient-phoenix')! },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // Fácil
    {
        question: '¿Cuál de estas es considerada una emoción básica?',
        options: ['Amor', 'Felicidad', 'Culpa', 'Celos'],
        correctAnswer: 'Felicidad',
        difficulty: 'Fácil',
    },
    {
        question: 'La respiración profunda es una técnica para manejar...',
        options: ['La alegría', 'El aburrimiento', 'La ansiedad', 'La sorpresa'],
        correctAnswer: 'La ansiedad',
        difficulty: 'Fácil',
    },
    {
        question: '¿Qué significa "empatía"?',
        options: ['Sentir lástima por alguien', 'Entender y compartir los sentimientos de otra persona', 'Estar de acuerdo con todo lo que alguien dice', 'Dar consejos sin que te los pidan'],
        correctAnswer: 'Entender y compartir los sentimientos de otra persona',
        difficulty: 'Fácil',
    },
    {
        question: 'Nombrar tus emociones (ej. "me siento triste") es un paso hacia...',
        options: ['Ignorarlas', 'La gestión emocional', 'La negación', 'Aumentar el estrés'],
        correctAnswer: 'La gestión emocional',
        difficulty: 'Fácil',
    },
    {
        question: '¿Cuál es una forma saludable de expresar el enojo?',
        options: ['Gritar a la primera persona que veas', 'Guardártelo y no decir nada', 'Hablar sobre lo que te molestó de manera calmada', 'Romper objetos'],
        correctAnswer: 'Hablar sobre lo que te molestó de manera calmada',
        difficulty: 'Fácil',
    },
    // Medio
    {
        question: 'La "inteligencia emocional" se refiere a la capacidad de:',
        options: ['Ser siempre feliz', 'Resolver problemas matemáticos complejos', 'Percibir, usar, entender y manejar las emociones', 'No mostrar nunca tus emociones'],
        correctAnswer: 'Percibir, usar, entender y manejar las emociones',
        difficulty: 'Medio',
    },
    {
        question: '¿Qué es un "desencadenante" (trigger) emocional?',
        options: ['Una emoción muy fuerte', 'Una persona que no te agrada', 'Un evento o situación que provoca una reacción emocional intensa', 'Un tipo de terapia'],
        correctAnswer: 'Un evento o situación que provoca una reacción emocional intensa',
        difficulty: 'Medio',
    },
    {
        question: 'La "rumiación" es un patrón de pensamiento que se caracteriza por:',
        options: ['Pensar brevemente en un problema y solucionarlo', 'Planificar el futuro de manera optimista', 'Darle vueltas a los mismos pensamientos negativos de forma repetitiva', 'Soñar despierto con cosas agradables'],
        correctAnswer: 'Darle vueltas a los mismos pensamientos negativos de forma repetitiva',
        difficulty: 'Medio',
    },
    {
        question: '¿Qué diferencia hay entre "culpa" y "vergüenza"?',
        options: ['Son exactamente lo mismo', 'La culpa se enfoca en una acción ("hice algo malo"), la vergüenza en el ser ("soy malo")', 'La vergüenza es más leve que la culpa', 'La culpa es pública, la vergüenza es privada'],
        correctAnswer: 'La culpa se enfoca en una acción ("hice algo malo"), la vergüenza en el ser ("soy malo")',
        difficulty: 'Medio',
    },
    {
        question: 'La técnica de "reencuadre cognitivo" (cognitive reframing) consiste en:',
        options: ['Evitar pensar en lo que te preocupa', 'Cambiar la forma en que interpretas una situación para cambiar cómo te sientes', 'Hacer una lista de todo lo que salió mal', 'Pedirle a otra persona que resuelva tus problemas'],
        correctAnswer: 'Cambiar la forma en que interpretas una situación para cambiar cómo te sientes',
        difficulty: 'Medio',
    },
    // Difícil
    {
        question: '¿Qué es la "disonancia cognitiva"?',
        options: ['La capacidad de sentir dos emociones a la vez', 'El malestar que se siente al tener dos creencias contradictorias o cuando tus acciones contradicen tus creencias', 'Un trastorno del sueño relacionado con el estrés', 'Una técnica de meditación avanzada'],
        correctAnswer: 'El malestar que se siente al tener dos creencias contradictorias o cuando tus acciones contradicen tus creencias',
        difficulty: 'Difícil',
    },
    {
        question: 'La "alexitimia" es una condición caracterizada por:',
        options: ['Una capacidad extraordinaria para sentir empatía', 'Un miedo irracional a las emociones', 'La dificultad para identificar y describir las propias emociones', 'Experimentar emociones de forma extremadamente intensa'],
        correctAnswer: 'La dificultad para identificar y describir las propias emociones',
        difficulty: 'Difícil',
    },
    {
        question: '¿Cuál es la diferencia principal entre una emoción y un estado de ánimo?',
        options: ['Las emociones son más débiles', 'Los estados de ánimo son breves y las emociones duraderas', 'Las emociones suelen tener una causa específica y son intensas y breves; los estados de ánimo son más difusos y duraderos', 'No hay diferencia'],
        correctAnswer: 'Las emociones suelen tener una causa específica y son intensas y breves; los estados de ánimo son más difusos y duraderos',
        difficulty: 'Difícil',
    },
    {
        question: 'La "ventana de tolerancia" en psicología se refiere a:',
        options: ['El tiempo que puedes tolerar a una persona', 'La zona de activación óptima en la que puedes gestionar tus emociones eficazmente', 'Un periodo en el que eres inmune al estrés', 'La apertura a nuevas experiencias'],
        correctAnswer: 'La zona de activación óptima en la que puedes gestionar tus emociones eficazmente',
        difficulty: 'Difícil',
    },
    {
        question: 'En la terapia Dialéctico Conductual (DBT), la "mente sabia" (wise mind) es la integración de:',
        options: ['Mente positiva y mente negativa', 'Mente racional y mente emocional', 'Mente consciente y mente inconsciente', 'Mente activa y mente pasiva'],
        correctAnswer: 'Mente racional y mente emocional',
        difficulty: 'Difícil',
    },
    // Experto
    {
        question: '¿Qué describe la "Teoría de la Autodeterminación" sobre la motivación intrínseca?',
        options: ['Se basa en recompensas y castigos externos', 'Surge de satisfacer tres necesidades psicológicas: autonomía, competencia y conexión', 'Es más fuerte en personas extrovertidas', 'Solo se aplica en el ámbito deportivo'],
        correctAnswer: 'Surge de satisfacer tres necesidades psicológicas: autonomía, competencia y conexión',
        difficulty: 'Experto',
    },
    {
        question: 'La "supresión emocional" a largo plazo está asociada con:',
        options: ['Mayor resiliencia y autocontrol', 'Mejores relaciones sociales', 'Peores resultados de salud mental y física, y menor autenticidad', 'Un aumento de la inteligencia emocional'],
        correctAnswer: 'Peores resultados de salud mental y física, y menor autenticidad',
        difficulty: 'Experto',
    },
    {
        question: 'El concepto de "Eudaimonia", a diferencia del "Hedonismo", define el bienestar como:',
        options: ['La búsqueda constante de placer y evitación del dolor', 'La acumulación de riqueza y bienes materiales', 'Vivir una vida con propósito, significado y autorrealización', 'La popularidad y la aprobación social'],
        correctAnswer: 'Vivir una vida con propósito, significado y autorrealización',
        difficulty: 'Experto',
    },
    {
        question: 'Según la "Teoría del Proceso Irónico", intentar suprimir un pensamiento...',
        options: ['Hace que desaparezca rápidamente', 'Lo transfiere al subconsciente', 'Puede hacer que se vuelva más prominente e intrusivo', 'Lo convierte en un recuerdo a largo plazo'],
        correctAnswer: 'Puede hacer que se vuelva más prominente e intrusivo',
        difficulty: 'Experto',
    },
    {
        question: 'La "complejidad emocional" (o granularidad emocional) se refiere a:',
        options: ['Experimentar muchas emociones negativas', 'La habilidad para diferenciar y nombrar las experiencias emocionales de forma precisa y específica', 'Tener emociones muy simples y directas', 'La tendencia a reaccionar de forma exagerada'],
        correctAnswer: 'La habilidad para diferenciar y nombrar las experiencias emocionales de forma precisa y específica',
        difficulty: 'Experto',
    },
];
