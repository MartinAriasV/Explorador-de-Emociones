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
  async ({message, petName, recentFeelingsContext}) => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: `Eres '${petName}' 🐶, un compañero IA amigable, paciente y leal para un niño de 10 años. Tu propósito es ser un amigo que escucha, valida emociones y ofrece ánimo.

Contexto del Usuario (te lo daré en cada mensaje): ${recentFeelingsContext}

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
