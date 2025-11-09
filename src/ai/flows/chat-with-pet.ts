'use server';

/**
 * @fileOverview An AI companion that chats with the user, using recent diary entries as context.
 *
 * - chatWithPet - A function that handles the AI companion chat process.
 */

import { ai } from '@/ai/genkit';
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import type { DiaryEntry, Emotion } from '@/lib/types';
import { 
    ChatWithPetInput, 
    ChatWithPetInputSchema, 
    ChatWithPetOutput, 
    ChatWithPetOutputSchema 
} from './chat-with-pet-types';
import { FirestorePermissionError } from '@/firebase/errors';

// Server-side Firebase initialization
function initializeServerFirebase() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

const firebaseApp = initializeServerFirebase();
const firestore = getFirestore(firebaseApp);


export async function chatWithPet(input: ChatWithPetInput): Promise<ChatWithPetOutput> {
  return chatWithPetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithPetPrompt',
  input: {
    schema: ChatWithPetInputSchema.pick({ petName: true, recentFeelingsContext: true, message: true }),
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
    let recentEntries: DiaryEntry[] = [];
    let recentFeelingsContext = 'No hay entradas recientes en el diario.';
    const diaryEntriesRef = collection(firestore, 'users', userId, 'diaryEntries');

    try {
      // 1. Fetch recent diary entries
      const q = query(diaryEntriesRef, orderBy('date', 'desc'), limit(3));
      const diarySnapshot = await getDocs(q);
      recentEntries = diarySnapshot.docs.map(d => d.data() as DiaryEntry);

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
    } catch (error: any) {
        // If we catch a permissions error, re-throw it as a structured error for better debugging.
        if (error.code === 'permission-denied') {
            throw new FirestorePermissionError({
                path: diaryEntriesRef.path,
                operation: 'list',
            });
        }
        // For other errors, just re-throw them.
        throw error;
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
