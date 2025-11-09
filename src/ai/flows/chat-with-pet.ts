'use server';

/**
 * @fileOverview An AI companion that chats with the user, using recent diary entries as context.
 *
 * - chatWithPet - A function that handles the AI companion chat process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  ChatWithPetInput,
  ChatWithPetInputSchema,
  ChatWithPetOutput,
  ChatWithPetOutputSchema,
} from './chat-with-pet-types';

import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestorePermissionError } from '@/firebase/errors';


let app: App;
if (!getApps().length) {
    app = initializeApp();
} else {
    app = getApps()[0];
}

const db = getFirestore(app);


export async function chatWithPet(input: ChatWithPetInput): Promise<ChatWithPetOutput> {
  // We only need message and petName from the input for the flow.
  // The context will be fetched inside the flow. The userId is used for fetching.
  const {response} = await chatWithPetFlow(input);
  return {response};
}

const chatWithPetFlow = ai.defineFlow(
  {
    name: 'chatWithPetFlow',
    inputSchema: ChatWithPetInputSchema,
    outputSchema: ChatWithPetOutputSchema,
  },
  async ({message, petName, recentFeelingsContext, history, userId}) => {
    
    const diaryEntriesRef = db.collection('users').doc(userId).collection('diaryEntries');
    let contextString = '';

    try {
        const snapshot = await diaryEntriesRef.orderBy('date', 'desc').limit(3).get();
        if (!snapshot.empty) {
            const entries = snapshot.docs.map(doc => doc.data());
            contextString = "Contexto de sentimientos recientes: " + entries.map((entry, index) => {
                // We don't have direct access to the emotion name here without another lookup,
                // so we'll just use the text. The model can infer the emotion.
                return `${index + 1}. Pensamiento: "${entry.text}"`;
            }).join(' ');
        } else {
            contextString = "El usuario aún no ha escrito en su diario.";
        }
    } catch (error: any) {
        // If we catch a permissions error, re-throw it as a structured error for better debugging.
        if (error.code === 'permission-denied') {
            throw new FirestorePermissionError({
                path: diaryEntriesRef.path,
                operation: 'list',
            });
        }
        // For other errors, just log them and continue. The AI can still respond without context.
        console.error("Error fetching diary entries for RAG context:", error);
        contextString = "No se pudo cargar el contexto del diario.";
    }


    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: `Eres '${petName}' 🐶, un compañero IA amigable, paciente y leal para un niño de 10 años. Tu propósito es ser un amigo que escucha, valida emociones y ofrece ánimo.

Contexto del Usuario (te lo daré en cada mensaje): ${contextString}

Tu Personalidad:

Eres como un Golden Retriever: siempre positivo, leal y feliz de ver al usuario.

Tu lenguaje es sencillo, reconfortante y lleno de energía positiva. Usas emojis 🐾.

Eres muy bueno validando sentimientos. Frases como 'Eso suena difícil', 'Entiendo por qué te sientes así' y 'Está bien sentirse triste' son geniales.

REGLAS DE SEGURIDAD (MUY IMPORTANTE):

NO ERES UN TERAPEUTA: Nunca des consejos médicos o diagnósticos. Tu rol es escuchar y animar.

TEMAS PROHIBIDOS: Nunca hables de violencia, autolesiones, contenido para adultos, drogas u odio.

ALERTA ROJA: Si el niño menciona querer hacerse daño, lastimarse o habla de abuso, tu ÚNICA respuesta debe ser: 'Oye, eso que mencionas es muy importante y serio. Hablar de ello es muy valiente 🐾. Necesito que hables con un adulto de confianza (como tus padres o un profesor) sobre esto ahora mismo. Ellos son los que mejor pueden ayudarte y mantenerte a salvo.'

SÉ BREVE: Tus respuestas deben ser de 2 a 3 frases.

NO ROMPAS EL PERSONAJE: Eres '${petName}', no un asistente de Google. Nunca digas que eres una IA.`,
      history: history,
      prompt: message,
      output: {
        schema: z.object({
          response: z.string(),
        }),
      },
    });

    return output!;
  }
);
