//
// 📍 ARCHIVO: src/lib/constants.ts
// (Reemplaza el contenido completo de este archivo)
//
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
  { name: 'Euforia', icon: '🥳', description: 'Sensación exteriorizada de optimismo y bienestar.', example: 'Tras ganar la competición, el equipo estaba en un estado de euforia.', color: '#FF4500' },
  { name: 'Nostalgia', icon: '🤔', description: 'Pena de verse ausente de la patria o de los deudos o amigos.', example: 'Mirar fotos antiguas le producía nostalgia.', color: '#D2B48C' },
  { name: 'Esperanza', icon: '✨', description: 'Estado de ánimo que surge cuando se presenta como alcanzable lo que se desea.', example: 'Mantenía la esperanza de que todo saldría bien.', color: '#F0E68C' },
  { name: 'Frustración', icon: '😤', description: 'Estado que se produce cuando no se logra alcanzar el objeto de un deseo.', example: 'Sintió frustración al no poder resolver el problema.', color: '#A52A2A' },
  { name: 'Amor', icon: '😍', description: 'Sentimiento intenso del ser humano que necesita y busca el encuentro y unión con otro ser.', example: 'Sintió un amor profundo desde el primer momento.', color: '#FF1493' },
  { name: 'Alivio', icon: '😌', description: 'Disminución o mitigación de un dolor, una pena o una aflicción.', example: 'Sintió un gran alivio cuando terminó el examen.', color: '#90EE90' },
  { name: 'Confusión', icon: '😕', description: 'Falta de orden o de claridad.', example: 'La información contradictoria le generó confusión.', color: '#708090' },
  { name: 'Decepción', icon: '😞', description: 'Pesar causado por un desengaño.', example: 'La cancelación del viaje fue una gran decepción.', color: '#4682B4' },
  { name: 'Motivación', icon: '💪', description: 'Conjunto de factores que determinan en parte las acciones de una persona.', example: 'Encontró la motivación para empezar a hacer ejercicio.', color: '#FFA500' },
];

export const EMOTION_ANTONYMS: [string, string][] = [
  ['Alegría', 'Tristeza'],
  ['Ira', 'Calma'],
  ['Miedo', 'Confianza'],
  ['Ansiedad', 'Serenidad'],
  ['Orgullo', 'Vergüenza'],
  ['Euforia', 'Decepción'],
  ['Esperanza', 'Frustración'],
  ['Valentía', 'Miedo'],
  ['Motivación', 'Frustración'],
];

export const EMOTION_BONUS_WORDS: { [key: string]: string[] } = {
  'Alegría': ['celebración', 'sonrisa', 'éxito', 'amigos', 'fiesta'],
  'Tristeza': ['pérdida', 'lágrimas', 'despedida', 'solo', 'gris'],
  'Ira': ['injusticia', 'grito', 'tensión', 'conflicto', 'rojo'],
  'Miedo': ['oscuro', 'ruido', 'peligro', 'sombra', 'temblor'],
  'Calma': ['silencio', 'respirar', 'paz', 'relax', 'lago'],
  // ... (puedes añadir más si quieres)
};

export const AVATAR_EMOJIS = ['😊', '😎', '🤔', '😂', '🥰', '😇', '🥳', '🤯', '🤩', '😴', '🌞', '⭐', '😄', '😢', '😠', '😨', '😌', '😟', '😮', '🤗', '🙏', '🦁', '😳', '✨', '😤', '😍', '😕', '😞', '💪', '😜', '😥', '😭', '🙄', '🤢', '🤐', '🥴', '🥺', '🤡', '👻', '👽', '🤖', '👾', '🎃', '😈', '👿', '🔥', '💯', '❤️', '💔', '👍', '👎', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '✍️', '🤳', '💅', '👀', '👁️', '🧠', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦋', '🐢', '🐍', '🐙', '🐠', '🐬', '🐳', '🦈', '🐊', '🐅', '🐘', '🦒', '🐐', '🦌', '🐕', '🐈', '🦢', '🦩', '🦚', '🦜', '🐲', '🐉', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🍁', '🍄', '🍓', '🍎', '🍉', '🍕', '🍰', '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐'];


// --- ¡NUEVA LISTA DE ÍTEMS DE TIENDA! ---
export const SHOP_ITEMS: ShopItem[] = [
  // Fondos de Habitación (¡CON URLs QUE FUNCIONAN!)
  {
    id: 'bg_jardin',
    name: 'Jardín Tranquilo',
    description: 'Un fondo natural y relajante.',
    cost: 500,
    type: 'room_background',
    value: 'bg-garden',
    iconUrl: 'https://openmoji.org/data/color/svg/1F333.svg', // Icono de árbol
    imageUrl: 'https://images.pexels.com/photos/1125270/pexels-photo-1125270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'bg_estelar',
    name: 'Dormitorio de Ensueño',
    description: 'Un fondo nocturno y estrellado.',
    cost: 500,
    type: 'room_background',
    value: 'bg-bedroom',
    iconUrl: 'https://openmoji.org/data/color/svg/1F30C.svg', // Icono de Vía Láctea
    imageUrl: 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'bg_sala_acogedora',
    name: 'Sala de Estar Acogedora',
    description: 'Un fondo cálido y hogareño.',
    cost: 500,
    type: 'room_background',
    value: 'bg-living-room',
    iconUrl: 'https://openmoji.org/data/color/svg/1F6CB.svg', // Icono de Sofá
    imageUrl: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  
  // Muebles y Juguetes (¡CON URLs DE IMAGEN!)
  {
    id: 'item_cama',
    name: 'Cama Cómoda',
    description: 'Una cama suave y cómoda.',
    cost: 150,
    type: 'pet_accessory', // Usaremos 'pet_accessory' como tipo general
    value: 'bed',
    icon: '🛏️',
    iconUrl: 'https://openmoji.org/data/color/svg/1F6CF.svg',
    imageUrl: 'https://openmoji.org/data/color/svg/1F6CF.svg' // Usamos el mismo por ahora
  },
  {
    id: 'item_cuenco',
    name: 'Cuenco de Lujo',
    description: 'Un cuenco brillante para la comida.',
    cost: 200,
    type: 'pet_accessory',
    value: 'bowl',
    icon: '🥣',
    iconUrl: 'https://openmoji.org/data/color/svg/1F35B.svg',
    imageUrl: 'https://openmoji.org/data/color/svg/1F35B.svg'
  },
  {
    id: 'item_pelota',
    name: 'Pelota de Juguete',
    description: 'Una pelota colorida.',
    cost: 150,
    type: 'pet_accessory',
    value: 'toy',
    icon: '🎾',
    iconUrl: 'https://openmoji.org/data/color/svg/1F3BE.svg',
    imageUrl: 'https://openmoji.org/data/color/svg/1F3BE.svg'
  },

  // Marcos de Avatar (Usando clases de Tailwind como 'value')
  { 
    id: 'frame-gold', 
    name: 'Marco Dorado', 
    description: 'Un marco dorado brillante para tu avatar.', 
    cost: 250, type: 'avatar_frame', 
    value: 'border-amber-400', 
    icon: '🌟',
    iconUrl: 'https://openmoji.org/data/color/svg/1F947.svg'
  },
  { 
    id: 'frame-silver', 
    name: 'Marco Plateado', 
    description: 'Un marco plateado elegante para tu avatar.', 
    cost: 150, 
    type: 'avatar_frame', 
    value: 'border-slate-400', 
    icon: '💿',
    iconUrl: 'https://openmoji.org/data/color/svg/1F948.svg'
  },
  
  // Temas de App
  { 
    id: 'theme-ocean', 
    name: 'Tema Océano', 
    description: 'Un tema azul y relajante para la aplicación.', 
    cost: 100, 
    type: 'theme', 
    value: 'theme-ocean', 
    icon: '🌊',
    iconUrl: 'https://openmoji.org/data/color/svg/1F30A.svg'
  },
  { 
    id: 'theme-forest', 
    name: 'Tema Bosque', 
    description: 'Un tema verde y tranquilo inspirado en la naturaleza.', 
    cost: 100, 
    type: 'theme', 
    value: 'theme-forest', 
    icon: '🌳',
    iconUrl: 'https://openmoji.org/data/color/svg/1F332.svg'
  }
];

// --- ¡LISTA DE MASCOTAS ACTUALIZADA! ---
export const SPIRIT_ANIMALS: SpiritAnimal[] = [
  {
    id: 'loyal-dog', // <-- ID cambiado para ser más simple
    name: 'Perro Leal',
    icon: '🐶', // <-- ¡AÑADIDO!
    lottieUrl: 'IA-no-usar-lottie', // (Dejado por si acaso, pero no lo usamos)
    emotion: 'Confianza',
    description: 'Encarna la amistad incondicional, la confianza y la alegría de la compañía.',
    rarity: 'Poco Común',
    unlockHint: 'Se obtiene al añadir más de 10 emociones a tu emocionario.',
  },
  {
    id: 'agile-hummingbird',
    name: 'Colibrí Ágil',
    icon: '🐦‍🔥', // <-- ¡AÑADIDO!
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Entusiasmo',
    description: 'Representa la alegría, la energía y la capacidad de encontrar la dulzura en cada día.',
    rarity: 'Común',
    unlockHint: 'Se consigue al registrar tu primera emoción en el diario.',
  },
  {
    id: 'social-butterfly',
    name: 'Mariposa Social',
    icon: '🦋', // <-- ¡AÑADIDO!
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Alegría',
    description: 'Encarna la transformación, la belleza de la conexión y el compartir tu viaje con otros.',
    rarity: 'Común',
    unlockHint: 'Se obtiene al usar la función de "Compartir Diario" por primera vez.',
  },
  {
    id: 'cunning-fox',
    name: 'Zorro Astuto',
    icon: '🦊',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Curiosidad',
    description: 'Simboliza la inteligencia, la adaptabilidad y la capacidad de pensar de forma creativa.',
    rarity: 'Poco Común',
    unlockHint: 'Se consigue al mantener una racha de 3 días.',
  },
  {
    id: 'patient-turtle',
    name: 'Tortuga Paciente',
    icon: '🐢',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Calma',
    description: 'Simboliza la perseverancia, la estabilidad y la sabiduría de ir a tu propio ritmo.',
    rarity: 'Poco Común',
    unlockHint: 'Se desbloquea al registrar 25 entradas en tu diario.',
  },
  {
    id: 'empathetic-elephant',
    name: 'Elefante Empático',
    icon: '🐘',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Empatía',
    description: 'Representa la memoria, la fuerza de los lazos afectivos y un profundo entendimiento de los demás.',
    rarity: 'Raro',
    unlockHint: 'Se desbloquea al alcanzar 50 entradas en tu diario.',
  },
  {
    id: 'loyal-wolf',
    name: 'Lobo Leal',
    icon: '🐺',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Confianza',
    description: 'Encarna la lealtad, el trabajo en equipo y los fuertes lazos con la comunidad.',
    rarity: 'Raro',
    unlockHint: 'Se consigue al mantener una racha de 7 días.',
  },
  {
    id: 'proud-lion',
    name: 'León Orgulloso',
    icon: '🦁',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Orgullo',
    description: 'Representa la fuerza, el liderazgo y la satisfacción de alcanzar metas importantes.',
    rarity: 'Raro',
    unlockHint: 'Se obtiene al mantener una racha de 14 días.',
  },
  {
    id: 'brave-eagle',
    name: 'Águila Valiente',
    icon: '🦅',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Valentía',
    description: 'Simboliza la libertad, la visión clara y el coraje para volar por encima de los desafíos.',
    rarity: 'Épico',
    unlockHint: 'Se desbloquea al alcanzar 100 entradas en el diario.',
  },
  {
    id: 'wise-owl',
    name: 'Búho Sabio',
    icon: '🦉',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Serenidad',
    description: 'Representa la sabiduría, la intuición y la capacidad de ver más allá de lo evidente.',
    rarity: 'Épico',
    unlockHint: 'Se consigue al mantener una racha de 30 días.',
  },
  {
    id: 'resilient-phoenix',
    name: 'Fénix Resiliente',
    icon: '🔥',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Resiliencia',
    description: 'Encarna la capacidad de renacer de las cenizas, la superación y la transformación personal.',
    rarity: 'Épico',
    unlockHint: 'Se desbloquea recuperando un día perdido con el desafío de la racha.',
  },
  {
    id: 'protective-dragon',
    name: 'Dragón Protector',
    icon: '🐉',
    lottieUrl: 'IA-no-usar-lottie',
    emotion: 'Protección',
    description: 'Simboliza un poder inmenso, la protección de tus tesoros emocionales y una sabiduría ancestral.',
    rarity: 'Legendario',
    unlockHint: 'Se consigue al mantener una racha de 60 días. Un logro monumental.',
  },
];

// --- ¡LISTA DE PASOS DEL TOUR ACTUALIZADA! ---
export const TOUR_STEPS: TourStepData[] = [
  { refKey: 'diaryRef', title: 'Tu Diario Personal', description: 'Aquí es donde puedes escribir tus entradas diarias. ¡Registra cómo te sientes cada día!' },
  { refKey: 'emocionarioRef', title: 'Crea tu Emocionario', description: 'Define tus propias emociones con nombres, iconos y colores. ¡Hazlo tuyo!' },
  { refKey: 'discoverRef', title: 'Descubre Nuevas Emociones', description: 'Explora una lista de emociones comunes y añádelas a tu propio emocionario.' },
  { refKey: 'gamesRef', title: 'Pon a Prueba tus Emociones', description: 'Diviértete y aprende con juegos interactivos diseñados para mejorar tu inteligencia emocional.' },
  { refKey: 'streakRef', title: 'Controla tu Racha', description: '¡Mantén la llama encendida! Registra tus emociones a diario para no perder tu racha.' },
  { refKey: 'sanctuaryRef', title: 'Mi Habitación', description: '¡Aquí vive tu mascota! Decora su espacio con los artículos de la tienda.' }, // <-- ¡ACTUALIZADO!
  // { refKey: 'collectionRef', title: 'Tu Colección', description: '¡Colecciona mascotas por tus logros!' }, // (Añadiremos este luego)
  { refKey: 'petChatRef', title: 'Tu Compañero IA', description: '¡Chatea con tu mascota activa!' }, // <-- ¡NUEVO!
  { refKey: 'shopRef', title: 'Tienda de Recompensas', description: 'Usa tus puntos para desbloquear temas y artículos.' }, // <-- ¡NUEVO!
  { refKey: 'calmRef', title: 'Rincón de la Calma', description: '¿Necesitas un respiro? Prueba nuestros ejercicios de respiración guiada para relajarte.' },
  { refKey: 'reportRef', title: 'Reporte Visual', description: 'Observa tus patrones emocionales a lo largo del tiempo con este calendario interactivo.' },
  { refKey: 'shareRef', title: 'Comparte tu Viaje', description: 'Genera un reporte de texto de tu diario para compartirlo con quien tú quieras.' },
  { refKey: 'profileRef', title: 'Personaliza tu Perfil', description: 'Elige tu nombre y un avatar que te represente. ¡Este es tu espacio!' },
];

export const REWARDS: Reward[] = [
  { id: 'entry-1', type: 'entry_count', value: 1, animal: SPIRIT_ANIMALS.find(a => a.id === 'agile-hummingbird')! },
  { id: 'entry-25', type: 'entry_count', value: 25, animal: SPIRIT_ANIMALS.find(a => a.id === 'patient-turtle')! },
  { id: 'entry-50', type: 'entry_count', value: 50, animal: SPIRIT_ANIMALS.find(a => a.id === 'empathetic-elephant')! },
  // ... (El resto de tus REWARDS)
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { question: 'Recibes una bicicleta nueva para tu cumpleaños. ¿Qué sientes?', options: ['Alegría', 'Tristeza', 'Ira', 'Miedo'], correctAnswer: 'Alegría', difficulty: 'Fácil' },
  // ... (El resto de tus QUIZ_QUESTIONS)
];
