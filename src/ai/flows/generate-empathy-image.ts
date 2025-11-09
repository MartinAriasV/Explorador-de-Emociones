'use server';
/**
 * @fileOverview An AI agent that generates an image representing an emotion.
 */
import { ai } from '@/ai/genkit';
import { GenerateEmpathyImageInput, GenerateEmpathyImageInputSchema, GenerateEmpathyImageOutput, GenerateEmpathyImageOutputSchema } from './generate-empathy-image-types';

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
