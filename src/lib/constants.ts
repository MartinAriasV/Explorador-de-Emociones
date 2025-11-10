
import type { PredefinedEmotion, TourStepData, SpiritAnimal, Reward, QuizQuestion, ShopItem } from './types';

export const PREDEFINED_EMOTIONS: PredefinedEmotion[] = [
  { name: 'Alegría', icon: '😄', description: 'Sentimiento de vivo placer y contentamiento.', example: 'Sentí una gran alegría al ver a mi familia.', color: '#FFD700' },
  { name: 'Tristeza', icon: '😢', description: 'Estado de ánimo melancólico y apesadumbrado.', example: 'La película me dejó una profunda tristeza.', color: '#6495ED' },
  { name: 'Ira', icon: '😠', description: 'Sentimiento de enfado muy grande y violento.', example: 'La injusticia le provocó un ataque de ira.', color: '#DC143C' },
  { name: 'Miedo', icon: '😨', description: 'Sensación de angustia por un riesgo o daño real o imaginario.', example: 'Sintió miedo al caminar solo por la noche.', color: '#800080' },
  { name: 'Calma', icon: '😌', description: 'Estado de tranquilidad y serenidad.', example: 'Después de la meditación, sintió una calma total.', color: '#87CEEB' },
  { name: 'Ansiedad', icon: '😟', description: 'Estado de agitación, inquietud o zozobra del ánimo.', example: 'La espera le generaba mucha ansiedad.', color: '#FFA500' },
  { name: 'Sorpresa', icon: '😮', description: 'Asombro o extrañeza por algo imprevisto.', example: 'Su regalo fue una grata sorpresa.', color: '#ADFF2F' },
  { name: 'Confianza', icon: '🤗', description: 'Seguridad y esperanza firme que se tiene de alguien o algo.', example: 'Tengo plena confianza en tus habilidades.', color: '#32CD32' },
  { name: 'Gratitud', icon: '🙏', description: 'Sentimiento de estima y reconocimiento hacia quien ha hecho un favor.', example: 'Expresó su gratitud por la ayuda recibida.', color: '#FFB6C1' },
  { name: 'Orgullo', icon: '🦁', description: 'Satisfacción por los logros, capacidades o méritos propios o de alguien.', example: 'Sintió orgullo de su trabajo al ver el resultado final.', color: '#E5B80B' },
  { name: 'Vergüenza', icon: '😳', description: 'Sentimiento de pérdida de la dignidad por una falta cometida o por una humillación sufrida.', example: 'Sintió vergüenza al tropezar en público.', color: '#FF6347' },
  { name: 'Euforia', icon: '🥳', description: 'Sensación exteriorizada de optimismo y bienestar, producida a menudo por la administración de fármacos o drogas, o por alguna satisfacción.', example: 'Tras ganar la competición, el equipo estaba en un estado de euforia.', color: '#FF4500' },
  { name: 'Nostalgia', icon: '🤔', description: 'Pena de verse ausente de la patria o de los deudos o amigos.', example: 'Mirar fotos antiguas le producía nostalgia.', color: '#D2B48C' },
  { name: 'Esperanza', icon: '✨', description: 'Estado de ánimo que surge cuando se presenta como alcanzable lo que se desea.', example: 'Mantenía la esperanza de que todo saldría bien.', color: '#F0E68C' },
  { name: 'Frustración', icon: '😤', description: 'Estado que se produce cuando no se logra alcanzar el objeto de un deseo.', example: 'Sintió frustración al no poder resolver el problema.', color: '#A52A2A' },
  { name: 'Amor', icon: '😍', description: 'Sentimiento intenso del ser humano que, partiendo de su propia insuficiencia, necesita y busca el encuentro y unión con otro ser.', example: 'Sintió un amor profundo desde el primer momento.', color: '#FF1493' },
  { name: 'Alivio', icon: '😌', description: 'Disminución o mitigación de un dolor, una pena o una aflicción.', example: 'Sintió un gran alivio cuando terminó el examen.', color: '#90EE90' },
  { name: 'Confusión', icon: '😕', description: 'Falta de orden o de claridad cuando se tienen o se barajan muchas posibilidades.', example: 'La información contradictoria le generó confusión.', color: '#708090' },
  { name: 'Decepción', icon: '😞', description: 'Pesar causado por un desengaño.', example: 'La cancelación del viaje fue una gran decepción.', color: '#4682B4' },
  { name: 'Motivación', icon: '💪', description: 'Conjunto de factores internos o externos que determinan en parte las acciones de una persona.', example: 'Encontró la motivación para empezar a hacer ejercicio.', color: '#FFA500' },
  { name: 'Entusiasmo', icon: '🤩', description: 'Exaltación y fogosidad del ánimo, excitado por algo que lo admire o cautive.', example: 'Recibió la noticia con mucho entusiasmo.', color: '#FFD700' },
  { name: 'Serenidad', icon: '🧘', description: 'Cualidad de sereno, apacible y tranquilo.', example: 'La serenidad del atardecer en la playa era incomparable.', color: '#B0C4DE' },
  { name: 'Curiosidad', icon: '🧐', description: 'Deseo de saber o averiguar cosas.', example: 'La curiosidad lo llevó a abrir la misteriosa caja.', color: '#DAA520' },
  { name: 'Valentía', icon: '🦸', description: 'Determinación para enfrentarse a situaciones arriesgadas o difíciles.', example: 'Demostró gran valentía al defender sus ideas.', color: '#B22222' },
  { name: 'Soledad', icon: '🚶', description: 'Carencia voluntaria o involuntaria de compañía.', example: 'A veces, disfrutaba de la soledad para reflexionar.', color: '#778899' },
  { name: 'Inspiración', icon: '💡', description: 'Estímulo o lucidez repentina que siente una persona.', example: 'La naturaleza fue su mayor fuente de inspiración.', color: '#FFFF00' }
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

export const EMOTION_BONUS_WORDS: { [key: string]: string[] } = {
    'Alegría': ['celebración', 'sonrisa', 'éxito', 'amigos', 'fiesta'],
    'Tristeza': ['pérdida', 'lágrimas', 'despedida', 'solo', 'gris'],
    'Ira': ['injusticia', 'grito', 'tensión', 'conflicto', 'rojo'],
    'Miedo': ['oscuro', 'ruido', 'peligro', 'sombra', 'temblor'],
    'Calma': ['silencio', 'respirar', 'paz', 'relax', 'lago'],
    'Ansiedad': ['futuro', 'examen', 'espera', 'preocupación', 'corazón'],
    'Sorpresa': ['regalo', 'inesperado', 'fiesta', 'noticia', 'abrir'],
    'Confianza': ['abrazo', 'equipo', 'apoyo', 'promesa', 'seguro'],
    'Gratitud': ['gracias', 'favor', 'ayuda', 'regalo', 'aprecio'],
    'Orgullo': ['logro', 'meta', 'esfuerzo', 'medalla', 'aplauso'],
    'Vergüenza': ['error', 'público', 'esconder', 'mejillas', 'rojo'],
    'Euforia': ['victoria', 'concierto', 'cima', 'grito', 'celebrar'],
    'Nostalgia': ['recuerdo', 'infancia', 'foto', 'ayer', 'pasado'],
    'Esperanza': ['mañana', 'luz', 'deseo', 'sueño', 'creer'],
    'Frustración': ['imposible', 'atasco', 'error', 'intentar', 'fallo'],
    'Amor': ['corazón', 'juntos', 'beso', 'familia', 'cariño'],
    'Alivio': ['final', 'suspiro', 'descanso', 'solución', 'paz'],
    'Confusión': ['mapa', 'niebla', 'duda', 'preguntas', 'laberinto'],
    'Decepción': ['promesa', 'esperaba', 'fallo', 'triste', 'cancelado'],
    'Motivación': ['empezar', 'gimnasio', 'meta', 'fuerza', 'impulso'],
    'Entusiasmo': ['nuevo', 'viaje', 'proyecto', 'energía', 'ganas'],
    'Serenidad': ['atardecer', 'meditar', 'equilibrio', 'paz', 'silencio'],
    'Curiosidad': ['misterio', 'caja', 'explorar', 'secreto', 'pregunta'],
    'Valentía': ['defender', 'enfrentar', 'riesgo', 'héroe', 'fuerza'],
    'Soledad': ['silencio', 'reflexión', 'paseo', 'solo', 'calma'],
    'Inspiración': ['idea', 'chispa', 'musa', 'crear', 'arte']
};


export const AVATAR_EMOJIS = ['😊', '😎', '🤔', '😂', '🥰', '😇', '🥳', '🤯', '🤩', '😴', '🌞', '⭐', '😄', '😢', '😠', '😨', '😌', '😟', '😮', '🤗', '🙏', '🦁', '😳', '✨', '😤', '😍', '😕', '😞', '💪', '😜', '😥', '😭', '🙄', '🤢', '🤐', '🥴', '🥺', '🤡', '👻', '👽', '🤖', '👾', '🎃', '😈', '👿', '🔥', '💯', '❤️', '💔', '👍', '👎', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '✍️', '🤳', '💅', '👀', '👁️', '🧠', '🦴', '🦷', '🗣️', '👤', '👥', '🫂', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️', '🧕', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '💂‍♀️', '💂', '💂‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍🏭', '🧑‍🏭', '👨‍🏭', '👩‍💻', '🧑‍💻', '👨‍💻', '👩‍💼', '🧑‍💼', '👨‍💼', '👩‍🔧', '🧑‍🔧', '👨‍🔧', '👩‍🔬', '🧑‍🔬', '👨‍🔬', '👩‍🎨', '🧑‍🎨', '👨‍🎨', '👩‍🚒', '🧑‍🚒', '👨‍🚒', '👩‍✈️', '🧑‍✈️', '👨‍✈️', '👩‍🚀', '🧑‍🚀', '👨‍🚀', '👩‍⚖️', '🧑‍⚖️', '👨‍⚖️', '🦸‍♀️', '🦸', '🦸‍♂️', '🦹‍♀️', '🦹', '🦹‍♂️', '🤶', '🧑‍🎄', '🎅', '🧙‍♀️', '🧙', '🧙‍♂️', '🧝‍♀️', '🧝', '𝓅', '🧛‍♀️', '🧛', '🧛‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🧞‍♀️', '🧞', '🧞‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️', '🧚‍♀️', '🧚', '🧚‍♂️', '👼', '🤰', '🤱', '👩‍🍼', '🧑‍🍼', '👨‍🍼', '🙇‍♀️', '🙇', '🙇‍♂️', '💁‍♀️', '💁', '💁‍♂️', '🙅‍♀️', '🙅', '🙅‍♂️', '🙆‍♀️', '🙆', '🙆‍♂️', '🙋‍♀️', '🙋', '🙋‍♂️', '🧏‍♀️', '🧏', '🧏‍♂️', '🤦‍♀️', '🤦', '🤦‍♂️', '🤷‍♀️', '🤷', '🤷‍♂️', '🙎‍♀️', '🙎', '🙎‍♂️', '🙍‍♀️', '🙍', '🙍‍♂️', '💇‍♀️', '💇', '💇‍♂️', '💆‍♀️', '💆', '💆‍♂️', '🧖‍♀️', '🧖', '🧖‍♂️', '💃', '🕺', '🕴️', '👩‍🦽', '🧑‍🦽', '👨‍🦽', '👩‍🦼', '🧑‍🦼', '👨‍🦼', '🚶‍♀️', '🚶', '🚶‍♂️', '👩‍🦯', '🧑‍🦯', '👨‍🦯', '🧎‍♀️', '🧎', '🧎‍♂️', '🏃‍♀️', '🏃', '🏃‍♂️', '🧍‍♀️', '🧍', '🧍‍♂️', '👫', '👭', '👬', '👩‍❤️‍👨', '👩‍❤️‍👩', '💑', '👨‍❤️‍👨', '👩‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💏', '👨‍❤️‍💋‍👨', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧', '👨‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🦢', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🕸️', '🌎', '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌚', '🌝', '🌞', '🪐', '💫', '🌟', '🌠', '🌌', '☁️', '⛅️', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌈', '☂️', '💧', '🌊', '🍓', '🍎', '🍉', '🍕', '🍰', '⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️'];


export const TOUR_STEPS: TourStepData[] = [
    { refKey: 'diaryRef', title: 'Tu Diario Personal', description: 'Aquí es donde puedes escribir tus entradas diarias. ¡Registra cómo te sientes cada día!' },
    { refKey: 'emocionarioRef', title: 'Crea tu Emocionario', description: 'Define tus propias emociones con nombres, iconos y colores. ¡Hazlo tuyo!' },
    { refKey: 'discoverRef', title: 'Descubre Nuevas Emociones', description: 'Explora una lista de emociones comunes y añádelas a tu propio emocionario.' },
    { refKey: 'gamesRef', title: 'Pon a Prueba tus Emociones', description: 'Diviértete y aprende con juegos interactivos diseñados para mejorar tu inteligencia emocional.' },
    { refKey: 'streakRef', title: 'Controla tu Racha', description: '¡Mantén la llama encendida! Registra tus emociones a diario para no perder tu racha.' },
    { refKey: 'sanctuaryRef', title: 'Tu Santuario de Recompensas', description: 'Alcanza hitos y desbloquea "animales espirituales" como recompensa por tu constancia.' },
    { refKey: 'petChatRef', title: 'Tu Compañero IA', description: 'Chatea con tus animales espirituales desbloqueados. ¡Están aquí para escucharte!' },
    { refKey: 'shopRef', title: 'Tienda de Recompensas', description: 'Usa tus puntos para desbloquear temas, marcos y otros artículos cosméticos.' },
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
    // --- Fácil ---
    { question: 'Recibes una bicicleta nueva para tu cumpleaños. ¿Qué sientes?', options: ['Alegría', 'Tristeza', 'Ira', 'Miedo'], correctAnswer: 'Alegría', difficulty: 'Fácil' },
    { question: 'Estás en la cama por la noche y escuchas un ruido extraño en la casa. ¿Qué sientes?', options: ['Calma', 'Aburrimiento', 'Miedo', 'Sorpresa'], correctAnswer: 'Miedo', difficulty: 'Fácil' },
    { question: 'Tu mejor amigo te dice que se va a mudar a otra ciudad. ¿Qué sientes?', options: ['Euforia', 'Tristeza', 'Orgullo', 'Alivio'], correctAnswer: 'Tristeza', difficulty: 'Fácil' },
    { question: 'Alguien se salta la fila delante de ti en el supermercado. ¿Qué sientes?', options: ['Gratitud', 'Ira', 'Amor', 'Nostalgia'], correctAnswer: 'Ira', difficulty: 'Fácil' },
    { question: 'Estás sentado en la playa, escuchando las olas y sintiendo la brisa. ¿Qué sientes?', options: ['Ansiedad', 'Confusión', 'Calma', 'Frustración'], correctAnswer: 'Calma', difficulty: 'Fácil' },
    { question: 'Tu equipo de fútbol favorito gana un partido importante en el último minuto. ¿Qué sientes?', options: ['Alegría', 'Decepción', 'Miedo', 'Tristeza'], correctAnswer: 'Alegría', difficulty: 'Fácil' },
    { question: 'Se te cae el helado al suelo justo después de comprarlo. ¿Qué sientes?', options: ['Frustración', 'Calma', 'Sorpresa', 'Alegría'], correctAnswer: 'Frustración', difficulty: 'Fácil' },
    { question: 'Abres un regalo y es justo lo que querías. ¿Qué sientes?', options: ['Sorpresa', 'Decepción', 'Miedo', 'Tristeza'], correctAnswer: 'Sorpresa', difficulty: 'Fácil' },

    // --- Medio ---
    { question: 'Has estudiado mucho para un examen y obtienes una nota excelente. ¿Qué sientes?', options: ['Decepción', 'Orgullo', 'Vergüenza', 'Soledad'], correctAnswer: 'Orgullo', difficulty: 'Medio' },
    { question: 'Tienes que hablar en público y sientes mariposas en el estómago. ¿Qué sientes?', options: ['Serenidad', 'Ansiedad', 'Curiosidad', 'Valentía'], correctAnswer: 'Ansiedad', difficulty: 'Medio' },
    { question: 'Un amigo te ayuda con un problema difícil sin que se lo pidas. ¿Qué sientes?', options: ['Ira', 'Gratitud', 'Envidia', 'Miedo'], correctAnswer: 'Gratitud', difficulty: 'Medio' },
    { question: 'Te caes delante de mucha gente. ¿Qué sientes?', options: ['Orgullo', 'Valentía', 'Vergüenza', 'Confianza'], correctAnswer: 'Vergüenza', difficulty: 'Medio' },
    { question: 'Llegas a casa y tus amigos te han preparado una fiesta sorpresa. ¿Qué sientes?', options: ['Tristeza', 'Sorpresa', 'Aburrimiento', 'Decepción'], correctAnswer: 'Sorpresa', difficulty: 'Medio' },
    { question: 'Ves una película que te recuerda a tus vacaciones de verano pasadas. ¿Qué sientes?', options: ['Nostalgia', 'Euforia', 'Ira', 'Confusión'], correctAnswer: 'Nostalgia', difficulty: 'Medio' },
    { question: 'Un plan que tenías muchas ganas de hacer se cancela en el último momento. ¿Qué sientes?', options: ['Decepción', 'Alivio', 'Alegría', 'Sorpresa'], correctAnswer: 'Decepción', difficulty: 'Medio' },
    { question: 'Ves a un amigo que no veías hace mucho tiempo. ¿Qué sientes?', options: ['Alegría', 'Tristeza', 'Ira', 'Miedo'], correctAnswer: 'Alegría', difficulty: 'Medio' },
    { question: 'Intentas armar un juguete nuevo, pero las piezas no encajan. ¿Qué sientes?', options: ['Frustración', 'Calma', 'Alegría', 'Confianza'], correctAnswer: 'Frustración', difficulty: 'Medio' },
    { question: 'Vas a montar en una montaña rusa por primera vez. ¿Qué sientes?', options: ['Miedo', 'Calma', 'Tristeza', 'Aburrimiento'], correctAnswer: 'Miedo', difficulty: 'Medio' },

    // --- Difícil ---
    { question: 'Llevas semanas esperando un paquete y te notifican que se ha perdido. ¿Qué sientes?', options: ['Alivio', 'Euforia', 'Frustración', 'Esperanza'], correctAnswer: 'Frustración', difficulty: 'Difícil' },
    { question: 'Estás trabajando en un proyecto creativo y de repente se te ocurre una idea genial. ¿Qué sientes?', options: ['Confusión', 'Inspiración', 'Soledad', 'Nostalgia'], correctAnswer: 'Inspiración', difficulty: 'Difícil' },
    { question: 'Alguien a quien admiras reconoce tu trabajo y te felicita delante de otros. ¿Qué sientes?', options: ['Orgullo', 'Valentía', 'Confianza', 'Gratitud'], correctAnswer: 'Orgullo', difficulty: 'Difícil' },
    { question: 'Creías que habías perdido la cartera con todo tu dinero, pero la encuentras en tu bolsillo. ¿Qué sientes?', options: ['Decepción', 'Alivio', 'Ansiedad', 'Tristeza'], correctAnswer: 'Alivio', difficulty: 'Difícil' },
    { question: 'Te enfrentas a un gran desafío, pero crees firmemente en tu capacidad para superarlo. ¿Qué sientes?', options: ['Miedo', 'Valentía', 'Confusión', 'Ira'], correctAnswer: 'Valentía', difficulty: 'Difícil' },
    { question: 'Después de un día difícil, tu mascota se acurruca a tu lado. ¿Qué sientes?', options: ['Amor', 'Ira', 'Miedo', 'Decepción'], correctAnswer: 'Amor', difficulty: 'Difícil' },
    { question: 'Te dan instrucciones complicadas y no estás seguro de entenderlas. ¿Qué sientes?', options: ['Confusión', 'Confianza', 'Calma', 'Alegría'], correctAnswer: 'Confusión', difficulty: 'Difícil' },
    { question: 'Quieres empezar un nuevo hobby que te apasiona. ¿Qué sientes?', options: ['Motivación', 'Tristeza', 'Miedo', 'Ira'], correctAnswer: 'Motivación', difficulty: 'Difícil' },
    { question: 'Ves un documental sobre un lugar que siempre has soñado visitar. ¿Qué sientes?', options: ['Curiosidad', 'Decepción', 'Tristeza', 'Calma'], correctAnswer: 'Curiosidad', difficulty: 'Difícil' },
    { question: 'Te enteras de una noticia muy positiva sobre el futuro del planeta. ¿Qué sientes?', options: ['Esperanza', 'Miedo', 'Tristeza', 'Ira'], correctAnswer: 'Esperanza', difficulty: 'Difícil' },
    { question: 'Un amigo te cuenta un secreto muy importante. ¿Qué sientes?', options: ['Confianza', 'Miedo', 'Sorpresa', 'Alegría'], correctAnswer: 'Confianza', difficulty: 'Difícil' },
    
    // --- Experto ---
    { question: 'Ganas una competición importante después de meses de duro entrenamiento. Sientes una alegría inmensa y energética. ¿Qué sientes?', options: ['Serenidad', 'Euforia', 'Calma', 'Alivio'], correctAnswer: 'Euforia', difficulty: 'Experto' },
    { question: 'A pesar de los contratiempos, sigues creyendo firmemente que tu situación mejorará. ¿Qué sientes?', options: ['Decepción', 'Esperanza', 'Frustración', 'Tristeza'], correctAnswer: 'Esperanza', difficulty: 'Experto' },
    { question: 'Pasas tiempo con una persona que es muy importante para ti y sientes una conexión profunda y afectuosa. ¿Qué sientes?', options: ['Gratitud', 'Amor', 'Confianza', 'Alegría'], correctAnswer: 'Amor', difficulty: 'Experto' },
    { question: 'Te proponen un nuevo proyecto que despierta tu interés y te impulsa a empezar a trabajar en él inmediatamente. ¿Qué sientes?', options: ['Entusiasmo', 'Ansiedad', 'Curiosidad', 'Motivación'], correctAnswer: 'Motivación', difficulty: 'Experto' },
    { question: 'Recibes varias instrucciones contradictorias y no estás seguro de qué hacer a continuación. ¿Qué sientes?', options: ['Ansiedad', 'Confusión', 'Frustración', 'Ira'], correctAnswer: 'Confusión', difficulty: 'Experto' },
    { question: 'Tras un día ajetreado, te sientas en silencio y sientes una profunda paz interior, aceptando el momento presente. ¿Qué sientes?', options: ['Serenidad', 'Soledad', 'Tristeza', 'Calma'], correctAnswer: 'Serenidad', difficulty: 'Experto' },
    { question: 'Un amigo cercano te traiciona, rompiendo la confianza que tenías en él. ¿Qué sientes?', options: ['Decepción', 'Ira', 'Tristeza', 'Frustración'], correctAnswer: 'Decepción', difficulty: 'Experto' },
    { question: 'Comienzas un nuevo proyecto con una energía vibrante y una gran sonrisa. ¿Qué sientes?', options: ['Entusiasmo', 'Ansiedad', 'Calma', 'Orgullo'], correctAnswer: 'Entusiasmo', difficulty: 'Experto' },
    { question: 'Un desconocido realiza un acto de bondad inesperado hacia ti. ¿Qué sientes?', options: ['Gratitud', 'Sorpresa', 'Confianza', 'Alegría'], correctAnswer: 'Gratitud', difficulty: 'Experto' },
    { question: 'Defiendes a un amigo a pesar de que te da miedo hacerlo. ¿Qué sientes?', options: ['Valentía', 'Orgullo', 'Miedo', 'Confianza'], correctAnswer: 'Valentía', difficulty: 'Experto' }
];

export const SHOP_ITEMS: ShopItem[] = [
    { id: 'theme-ocean', name: 'Tema Océano', description: 'Un tema azul y relajante para la aplicación.', cost: 100, type: 'theme', value: 'theme-ocean', icon: '🌊' },
    { id: 'theme-forest', name: 'Tema Bosque', description: 'Un tema verde y tranquilo inspirado en la naturaleza.', cost: 100, type: 'theme', value: 'theme-forest', icon: '🌳' },
    { id: 'frame-gold', name: 'Marco Dorado', description: 'Un marco dorado brillante para tu avatar.', cost: 250, type: 'avatar_frame', value: 'border-amber-400', icon: '🖼️' },
    { id: 'frame-silver', name: 'Marco Plateado', description: 'Un marco plateado elegante para tu avatar.', cost: 150, type: 'avatar_frame', value: 'border-slate-400', icon: '🖼️' },
    { id: 'pet-bed', name: 'Cama Cómoda', description: 'Una cama suave y cómoda para que tu compañero descanse.', cost: 300, type: 'pet_accessory', value: 'bed', icon: '🛏️' },
    { id: 'pet-bowl', name: 'Cuenco de Lujo', description: 'Un cuenco brillante para la comida y el agua de tu mascota.', cost: 200, type: 'pet_accessory', value: 'bowl', icon: '🥣' },
    { id: 'pet-toy', name: 'Pelota de Juguete', description: 'Una pelota colorida para que tu compañero se divierta.', cost: 150, type: 'pet_accessory', value: 'toy', icon: '🎾' },
];

    