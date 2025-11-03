import type { PredefinedEmotion, TourStepData } from './types';

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
];

export const AVATAR_EMOJIS = ['😊', '😎', '🤔', '😂', '🥰', '😇', '🥳', '🤯', '🤩', '😴', '🌞', '⭐'];


export const TOUR_STEPS: TourStepData[] = [
    { refKey: 'diaryRef', title: 'Tu Diario Personal', description: 'Aquí es donde puedes escribir tus entradas diarias. ¡Registra cómo te sientes cada día!' },
    { refKey: 'emocionarioRef', title: 'Crea tu Emocionario', description: 'Define tus propias emociones con nombres, iconos y colores. ¡Hazlo tuyo!' },
    { refKey: 'discoverRef', title: 'Descubre Nuevas Emociones', description: 'Explora una lista de emociones comunes y añádelas a tu propio emocionario.' },
    { refKey: 'calmRef', title: 'Rincón de la Calma', description: '¿Necesitas un respiro? Prueba nuestros ejercicios de respiración guiada para relajarte.' },
    { refKey: 'reportRef', title: 'Reporte Visual', description: 'Observa tus patrones emocionales a lo largo del tiempo con este calendario interactivo.' },
    { refKey: 'shareRef', title: 'Comparte tu Viaje', description: 'Genera un reporte de texto de tu diario para compartirlo con quien tú quieras.' },
    { refKey: 'profileRef', title: 'Personaliza tu Perfil', description: 'Elige tu nombre y un avatar que te represente. ¡Este es tu espacio!' },
];
