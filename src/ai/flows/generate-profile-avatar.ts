'use server';

/**
 * @fileOverview Flow to generate a profile avatar using GenAI based on user interests.
 *
 * - generateProfileAvatar - Generates a profile avatar based on user interests.
 * - GenerateProfileAvatarInput - The input type for the generateProfileAvatar function.
 * - GenerateProfileAvatarOutput - The return type for the generateProfileAvatar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfileAvatarInputSchema = z.object({
  interests: z
    .string()
    .describe('A description of the user interests to generate the profile avatar.'),
});
export type GenerateProfileAvatarInput = z.infer<typeof GenerateProfileAvatarInputSchema>;

const GenerateProfileAvatarOutputSchema = z.object({
  avatarDataUri: z
    .string()
    .describe(
      'The generated profile avatar as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // cspell:disable-line
    ),
});
export type GenerateProfileAvatarOutput = z.infer<typeof GenerateProfileAvatarOutputSchema>;

export async function generateProfileAvatar(
  input: GenerateProfileAvatarInput
): Promise<GenerateProfileAvatarOutput> {
  return generateProfileAvatarFlow(input);
}

const generateProfileAvatarFlow = ai.defineFlow(
  {
    name: 'generateProfileAvatarFlow',
    inputSchema: GenerateProfileAvatarInputSchema,
    outputSchema: GenerateProfileAvatarOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: `Generate an image of profile avatar based on the following interests: ${input.interests}. The avatar should be a square image.`,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate avatar.');
    }

    return {avatarDataUri: media.url};
  }
);
