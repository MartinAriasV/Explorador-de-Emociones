'use server';

/**
 * @fileOverview An AI agent that provides a definition and example of an emotion.
 *
 * - defineEmotionMeaning - A function that handles the process of defining an emotion.
 * - DefineEmotionMeaningInput - The input type for the defineEmotionMeaning function.
 * - DefineEmotionMeaningOutput - The return type for the defineEmotionMeaning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineEmotionMeaningInputSchema = z.object({
  emotion: z.string().describe('The emotion to define.'),
});
export type DefineEmotionMeaningInput = z.infer<typeof DefineEmotionMeaningInputSchema>;

const DefineEmotionMeaningOutputSchema = z.object({
  definition: z.string().describe('The definition of the emotion.'),
  example: z.string().describe('An example of the emotion in a sentence.'),
  includeDetails: z.boolean().describe('Whether or not to include the definition and example in the saved emotions.'),
});
export type DefineEmotionMeaningOutput = z.infer<typeof DefineEmotionMeaningOutputSchema>;

export async function defineEmotionMeaning(input: DefineEmotionMeaningInput): Promise<DefineEmotionMeaningOutput> {
  return defineEmotionMeaningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'defineEmotionMeaningPrompt',
  input: {schema: DefineEmotionMeaningInputSchema},
  output: {schema: DefineEmotionMeaningOutputSchema},
  prompt: `You are an AI assistant that provides definitions and examples of emotions. The user will provide an emotion and you should define it, and give an example of it in a sentence.

Emotion: {{{emotion}}}

Output a JSON object that contains the keys 'definition', 'example', and 'includeDetails'. The 'includeDetails' boolean should be true if the definition and example are helpful and well-formed, and false if including them would make the saved data too verbose.`,
});

const defineEmotionMeaningFlow = ai.defineFlow(
  {
    name: 'defineEmotionMeaningFlow',
    inputSchema: DefineEmotionMeaningInputSchema,
    outputSchema: DefineEmotionMeaningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
