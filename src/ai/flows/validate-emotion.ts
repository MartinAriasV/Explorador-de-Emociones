'use server';

/**
 * @fileOverview An AI agent that validates if a given string is a real human emotion.
 *
 * - validateEmotion - A function that handles the emotion validation process.
 * - ValidateEmotionInput - The input type for the validateEmotion function.
 * - ValidateEmotionOutput - The return type for the validateEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateEmotionInputSchema = z.object({
  emotion: z.string().describe('The string to validate as an emotion.'),
});
export type ValidateEmotionInput = z.infer<typeof ValidateEmotionInputSchema>;

const ValidateEmotionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether or not the input string is a valid human emotion.'),
  reason: z.string().describe('A brief explanation in Spanish of why the input is or is not a valid emotion. For example, "La alegría es una emoción fundamental que..." or "Un coche no es una emoción, es un objeto."'),
});
export type ValidateEmotionOutput = z.infer<typeof ValidateEmotionOutputSchema>;

export async function validateEmotion(input: ValidateEmotionInput): Promise<ValidateEmotionOutput> {
  return validateEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateEmotionPrompt',
  input: {schema: ValidateEmotionInputSchema},
  output: {schema: ValidateEmotionOutputSchema},
  prompt: `You are an AI expert in psychology and linguistics. Your task is to determine if a given string represents a real, recognized human emotion.

The user will provide a string. You must determine if it's a valid emotion.

- If it is a valid emotion (e.g., 'Alegría', 'Saudade', 'Schadenfreude'), set isValid to true.
- If it is not a valid emotion (e.g., 'Coche', 'asdfghjkl', 'Saltando'), set isValid to false.

Provide a brief, one-sentence reason for your decision in Spanish.

Emotion to validate: {{{emotion}}}
`,
});

const validateEmotionFlow = ai.defineFlow(
  {
    name: 'validateEmotionFlow',
    inputSchema: ValidateEmotionInputSchema,
    outputSchema: ValidateEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
