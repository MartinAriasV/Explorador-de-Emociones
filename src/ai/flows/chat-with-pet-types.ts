/**
 * @fileOverview Types and schemas for the chatWithPet Genkit flow.
 */
import { z } from 'genkit';

// Define the schema for a single message in the history
const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
});

export const ChatWithPetInputSchema = z.object({
  userId: z.string().describe('The ID of the user who is chatting.'),
  message: z.string().describe('The message from the user.'),
  petName: z.string().describe('The name of the pet persona to use, e.g., "Zorro Astuto".'),
  recentFeelingsContext: z.string().optional().describe('Context from recent diary entries. This is populated by the flow, not the client.'),
  history: z.array(MessageSchema).optional().describe('The history of the current conversation.'),
});
export type ChatWithPetInput = z.infer<typeof ChatWithPetInputSchema>;

export const ChatWithPetOutputSchema = z.object({
  response: z.string().describe("The pet's friendly and supportive response."),
});
export type ChatWithPetOutput = z.infer<typeof ChatWithPetOutputSchema>;
