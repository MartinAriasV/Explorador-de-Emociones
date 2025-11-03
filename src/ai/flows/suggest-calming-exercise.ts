'use server';
/**
 * @fileOverview An AI agent that suggests a calming exercise based on the user's emotional state.
 *
 * - suggestCalmingExercise - A function that suggests a calming exercise.
 * - SuggestCalmingExerciseInput - The input type for the suggestCalmingExercise function.
 * - SuggestCalmingExerciseOutput - The return type for the suggestCalmingExercise function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCalmingExerciseInputSchema = z.object({
  emotionalState: z
    .string()
    .describe('The user\u2019s current emotional state as described in their diary entry.'),
});
export type SuggestCalmingExerciseInput = z.infer<typeof SuggestCalmingExerciseInputSchema>;

const SuggestCalmingExerciseOutputSchema = z.object({
  exerciseSuggestion: z
    .string()
    .describe('A personalized calming exercise suggestion based on the user\u2019s emotional state.'),
});
export type SuggestCalmingExerciseOutput = z.infer<typeof SuggestCalmingExerciseOutputSchema>;

export async function suggestCalmingExercise(
  input: SuggestCalmingExerciseInput
): Promise<SuggestCalmingExerciseOutput> {
  return suggestCalmingExerciseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCalmingExercisePrompt',
  input: {schema: SuggestCalmingExerciseInputSchema},
  output: {schema: SuggestCalmingExerciseOutputSchema},
  prompt: `Basado en el estado emocional del usuario: {{{emotionalState}}}, sugiere un ejercicio de calma breve y útil que pueda ayudarle a relajarse. La respuesta debe ser en español y no más de 2 o 3 frases.`,
});

const suggestCalmingExerciseFlow = ai.defineFlow(
  {
    name: 'suggestCalmingExerciseFlow',
    inputSchema: SuggestCalmingExerciseInputSchema,
    outputSchema: SuggestCalmingExerciseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
