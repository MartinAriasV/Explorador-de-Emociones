/**
 * @fileOverview Types and schemas for the chatWithPet Genkit flow.
 */
import { z } from 'genkit';

export const ChatWithPetInputSchema = z.object({
  userId: z.string().describe('The ID of the user who is chatting.'),
  message: z.string().describe('The message from the user.'),
  petName: z.string().describe('The name of the pet persona to use, e.g., "Zorro Astuto".'),
  recentFeelingsContext: z.string().optional().describe('Context from recent diary entries. This is populated by the flow, not the client.'),
});
export type ChatWithPetInput = z.infer<typeof ChatWithPetInputSchema>;

export const ChatWithPetOutputSchema = z.object({
  response: z.string().describe("The pet's friendly and supportive response."),
});
export type ChatWithPetOutput = z.infer<typeof ChatWithPetOutputSchema>;
