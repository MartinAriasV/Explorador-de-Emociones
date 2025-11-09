/**
 * @fileOverview Types and schemas for the generateEmpathyImage Genkit flow.
 */
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
