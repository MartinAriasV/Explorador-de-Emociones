'use server';
/**
 * @fileOverview An AI agent that generates an image representing an emotion.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateEmpathyImageInputSchema = z.object({
  emotion: z.string().describe('The emotion to be represented in the image, e.g., "Alegría".'),
  hint: z.string().describe('A simple hint for the image content, e.g., "niño sonriendo".'),
});
export type GenerateEmpathyImageInput = z.infer<typeof GenerateEmpathyImageInputSchema>;

export const GenerateEmpathyImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateEmpathyImageOutput = z.infer<typeof GenerateEmpathyImageOutputSchema>;

export async function generateEmpathyImage(input: GenerateEmpathyImageInput): Promise<GenerateEmpathyImageOutput> {
  return generateEmpathyImageFlow(input);
}

const generateEmpathyImageFlow = ai.defineFlow(
  {
    name: 'generateEmpathyImageFlow',
    inputSchema: GenerateEmpathyImageInputSchema,
    outputSchema: GenerateEmpathyImageOutputSchema,
  },
  async ({ emotion, hint }) => {
    const prompt = `Genera una imagen visualmente atractiva y de estilo de dibujo animado para un niño. La imagen debe representar claramente la emoción de "${emotion}". Utiliza esta pista como guía: "${hint}".`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: prompt,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('No se pudo generar la imagen.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
