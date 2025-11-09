'use server';

/**
 * @fileOverview An AI companion that chats with the user, using recent diary entries as context.
 *
 * - chatWithPet - A function that handles the AI companion chat process.
 * - ChatWithPetInput - The input type for the chatWithPet function.
 * - ChatWithPetOutput - The return type for the chatWithPet function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import type { DiaryEntry, Emotion } from '@/lib/types';

// Initialize Firestore through the existing Firebase setup
const { firestore } = initializeFirebase();

export const ChatWithPetInputSchema = z.object({
  userId: z.string().describe('The ID of the user who is chatting.'),
  message: z.string().describe('The message from the user.'),
  petName: z.string().describe('The name of the pet persona to use, e.g., "Zorro Astuto".'),
});
export type ChatWithPetInput = z.infer<typeof ChatWithPetInputSchema>;

export const ChatWithPetOutputSchema = z.object({
  response: z.string().describe("The pet's friendly and supportive response."),
});
export type ChatWithPetOutput = z.infer<typeof ChatWithPetOutputSchema>;

export async function chatWithPet(input: ChatWithPetInput): Promise<ChatWithPetOutput> {
  return chatWithPetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithPetPrompt',
  input: {
    schema: z.object({
      petName: z.string(),
      recentFeelingsContext: z.string(),
      message: z.string(),
    }),
  },
  output: { schema: ChatWithPetOutputSchema },
  prompt: `Eres un compañero IA amigable y solidario llamado {{{petName}}}. Tu trabajo es chatear con un niño de una manera breve, amable y que valide sus sentimientos.

Aquí tienes un resumen de cómo se ha sentido el niño últimamente, basado en su diario:
{{{recentFeelingsContext}}}

El mensaje actual del niño es:
"{{{message}}}"

Por favor, responde al niño. Ten en cuenta sus sentimientos recientes para que sienta que lo recuerdas, pero céntrate en responder a su mensaje actual. Sé breve (2-3 frases como máximo), positivo y de apoyo.`,
});

const chatWithPetFlow = ai.defineFlow(
  {
    name: 'chatWithPetFlow',
    inputSchema: ChatWithPetInputSchema,
    outputSchema: ChatWithPetOutputSchema,
  },
  async ({ userId, message, petName }) => {
    // 1. Fetch recent diary entries
    const diaryEntriesRef = collection(firestore, 'users', userId, 'diaryEntries');
    const q = query(diaryEntriesRef, orderBy('date', 'desc'), limit(3));
    const diarySnapshot = await getDocs(q);
    const recentEntries = diarySnapshot.docs.map(d => d.data() as DiaryEntry);

    let recentFeelingsContext = 'No hay entradas recientes en el diario.';

    if (recentEntries.length > 0) {
      // 2. Fetch corresponding emotions to get their names
      const emotionIds = [...new Set(recentEntries.map(entry => entry.emotionId))];
      const emotionDocs = await Promise.all(
        emotionIds.map(id => getDoc(doc(firestore, 'users', userId, 'emotions', id)))
      );
      const emotionsMap = new Map<string, Emotion>();
      emotionDocs.forEach(d => {
        if (d.exists()) {
          emotionsMap.set(d.id, d.data() as Emotion);
        }
      });

      // 3. Create the context string
      recentFeelingsContext = recentEntries
        .map(entry => {
          const emotion = emotionsMap.get(entry.emotionId);
          const emotionName = emotion ? emotion.name : 'un sentimiento desconocido';
          return `- Sintió ${emotionName}. Reflexión: "${entry.text}"`;
        })
        .join('\n');
    }

    // 4. Call the AI model with the context
    const { output } = await prompt({
      petName,
      recentFeelingsContext,
      message,
    });

    return output!;
  }
);
