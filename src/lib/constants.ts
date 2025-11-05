import type { PredefinedEmotion, TourStepData, SpiritAnimal, Reward } from './types';

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

export const AVATAR_EMOJIS = ['😊', '😎', '🤔', '😂', '🥰', '😇', '🥳', '🤯', '🤩', '😴', '🌞', '⭐', '😄', '😢', '😠', '😨', '😌', '😟', '😮', '🤗', '🙏', '🦁', '😳', '✨', '😤', '😍', '😕', '😞', '💪', '😜', '😥', '😭', '🙄', '🤢', '🤐', '🥴', '🥺', '🤡', '👻', '👽', '🤖', '👾', '🎃', '😈', '👿', '🔥', '💯', '❤️', '💔', '👍', '👎'];


export const TOUR_STEPS: TourStepData[] = [
    { refKey: 'diaryRef', title: 'Tu Diario Personal', description: 'Aquí es donde puedes escribir tus entradas diarias. ¡Registra cómo te sientes cada día!' },
    { refKey: 'emocionarioRef', title: 'Crea tu Emocionario', description: 'Define tus propias emociones con nombres, iconos y colores. ¡Hazlo tuyo!' },
    { refKey: 'discoverRef', title: 'Descubre Nuevas Emociones', description: 'Explora una lista de emociones comunes y añádelas a tu propio emocionario.' },
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
    },
    {
        id: 'cunning-fox',
        name: 'Zorro Astuto',
        icon: '🦊',
        emotion: 'Curiosidad',
        description: 'Simboliza la inteligencia, la adaptabilidad y la capacidad de pensar de forma creativa.',
        rarity: 'Poco Común',
    },
    {
        id: 'loyal-wolf',
        name: 'Lobo Leal',
        icon: '🐺',
        emotion: 'Confianza',
        description: 'Encarna la lealtad, el trabajo en equipo y los fuertes lazos con la comunidad.',
        rarity: 'Raro',
    },
    {
        id: 'wise-owl',
        name: 'Búho Sabio',
        icon: '🦉',
        emotion: 'Serenidad',
        description: 'Representa la sabiduría, la intuición y la capacidad de ver más allá de lo evidente.',
        rarity: 'Épico',
    },
];

export const REWARDS: Reward[] = [
    {
        id: 'streak-1',
        type: 'streak',
        value: 1,
        animal: SPIRIT_ANIMALS.find(a => a.id === 'agile-hummingbird')!,
        unlockMessage: '¡Has completado tu primer día! El Colibrí Ágil se une a tu santuario.',
    },
    {
        id: 'streak-3',
        type: 'streak',
        value: 3,
        animal: SPIRIT_ANIMALS.find(a => a.id === 'cunning-fox')!,
        unlockMessage: '¡3 días seguidos! El Zorro Astuto admira tu astucia y se une a tu santuario.',
    },
    {
        id: 'streak-7',
        type: 'streak',
        value: 7,
        animal: SPIRIT_ANIMALS.find(a => a.id === 'loyal-wolf')!,
        unlockMessage: '¡Una semana completa! El Lobo Leal reconoce tu compromiso y ahora forma parte de tu manada.',
    },
    {
        id: 'streak-14',
        type: 'streak',
        value: 14,
        animal: SPIRIT_ANIMALS.find(a => a.id === 'wise-owl')!,
        unlockMessage: '¡Dos semanas de introspección! El Búho Sabio te ofrece su sabiduría y se posa en tu santuario.',
    },
];

    