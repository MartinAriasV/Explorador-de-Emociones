# Prompt de Proyecto Completo: Diario de Emociones

A continuación se presenta el código fuente completo y la estructura de la aplicación "Diario de Emociones". Este documento sirve como una instantánea completa para que una IA experta en desarrollo de software pueda comprender, analizar y modificar la aplicación.

---
## Ficheros del Proyecto
---

### `/.env`
**Propósito:** Fichero de variables de entorno (actualmente vacío).
```

```

### `/README.md`
**Propósito:** Fichero de introducción al proyecto.
```md
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
```

### `/apphosting.yaml`
**Propósito:** Fichero de configuración para Firebase App Hosting.
```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
```

### `/components.json`
**Propósito:** Fichero de configuración para la biblioteca de componentes ShadCN UI.
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### `/docs/backend.json`
**Propósito:** El "plano" de la arquitectura de datos de Firebase. Define las entidades de datos, la configuración de autenticación y la estructura de las colecciones de Firestore.
```json
{
  "entities": {
    "UserProfile": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "UserProfile",
      "type": "object",
      "description": "Represents a user's profile within the Emotion Explorer application.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the UserProfile entity."
        },
        "name": {
          "type": "string",
          "description": "User's display name."
        },
        "avatar": {
          "type": "string",
          "description": "User's selected avatar (e.g., an emoji)."
        }
      },
      "required": [
        "id",
        "name",
        "avatar"
      ]
    },
    "Emotion": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Emotion",
      "type": "object",
      "description": "Represents an emotion that a user can track in their diary.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the Emotion entity."
        },
        "name": {
          "type": "string",
          "description": "Name of the emotion (e.g., 'Joy', 'Sadness')."
        },
        "icon": {
          "type": "string",
          "description": "Emoji or icon representing the emotion."
        },
        "color": {
          "type": "string",
          "description": "Color associated with the emotion (for visual representation)."
        },
        "description": {
          "type": "string",
          "description": "Description of what the emotion means to the user."
        }
      },
      "required": [
        "id",
        "name",
        "icon",
        "color",
        "description"
      ]
    },
    "DiaryEntry": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "DiaryEntry",
      "type": "object",
      "description": "Represents a single diary entry recorded by the user.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the DiaryEntry entity."
        },
        "userId": {
          "type": "string",
          "description": "Reference to UserProfile. (Relationship: UserProfile 1:N DiaryEntry)"
        },
        "emotionId": {
          "type": "string",
          "description": "Reference to Emotion. (Relationship: Emotion 1:N DiaryEntry)"
        },
        "date": {
          "type": "string",
          "description": "Date of the diary entry.",
          "format": "date-time"
        },
        "text": {
          "type": "string",
          "description": "Textual description of the experience."
        }
      },
      "required": [
        "id",
        "userId",
        "emotionId",
        "date",
        "text"
      ]
    }
  },
  "auth": {
    "providers": [
      "password"
    ]
  },
  "firestore": {
    "structure": [
      {
        "path": "/users/{userId}",
        "definition": {
          "entityName": "UserProfile",
          "schema": {
            "$ref": "#/backend/entities/UserProfile"
          },
          "description": "Stores user profile information. Path-based ownership ensures only the user can access their profile.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier for the user."
            }
          ]
        }
      },
      {
        "path": "/users/{userId}/emotions/{emotionId}",
        "definition": {
          "entityName": "Emotion",
          "schema": {
            "$ref": "#/backend/entities/Emotion"
          },
          "description": "Stores user-defined emotions. Path-based ownership ensures only the user can access their own emotions.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier for the user."
            },
            {
              "name": "emotionId",
              "description": "The unique identifier for the emotion."
            }
          ]
        }
      },
      {
        "path": "/users/{userId}/diaryEntries/{diaryEntryId}",
        "definition": {
          "entityName": "DiaryEntry",
          "schema": {
            "$ref": "#/backend/entities/DiaryEntry"
          },
          "description": "Stores diary entries for a user. Path-based ownership ensures only the user can access their own diary entries.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier for the user."
            },
            {
              "name": "diaryEntryId",
              "description": "The unique identifier for the diary entry."
            }
          ]
        }
      }
    ],
    "reasoning": "The Firestore structure is designed to be secure, scalable, and easily debuggable, following the core design principles and strategy mandates. It uses path-based ownership for user-specific data, ensuring authorization independence by avoiding `get()` calls in security rules. Data segregation ensures that all documents within a collection share the same security requirements. The structure explicitly models authorization using path-based ownership where possible to support secure `list` operations (QAPs). The design also incorporates explicit state modeling, predictable schemas, and consistent naming conventions for clarity and maintainability. Specifically, user profiles and diary entries are organized under user-specific paths to enforce ownership. Emotions are stored under the user path to ensure that the user is able to define and customize these entries. By storing data in this way it is not possible to create entries for emotions or diaries that are not owned by the currently authenticated user, thus making the system secure and robust."
  }
}
```

### `/firestore.rules`
**Propósito:** Reglas de seguridad de Firestore para proteger la base de datos.
```rules
/**
 * @fileoverview Firestore Security Rules for Emotion Explorer.
 *
 * Core Philosophy: This ruleset enforces a strict user-ownership model. Users can only
 * access their own profile data, emotions, and diary entries.
 *
 * Data Structure:
 * - /users/{userId}: Stores user profile information, accessible only by the user.
 * - /users/{userId}/emotions/{emotionId}: Stores user-defined emotions, accessible only by the user.
 * - /users/{userId}/diaryEntries/{diaryEntryId}: Stores diary entries, accessible only by the user.
 *
 * Key Security Decisions:
 * - User listing is disallowed to protect user privacy.
 * - All data is nested under /users/{userId} to enforce strict ownership.
 * - Data validation is minimized in this prototyping phase, focusing on ownership checks.
 */
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    /**
     * @description Secure user profiles. Only the user can read and write their own profile.
     * @path /users/{userId}
     * @allow (create) User 'user_abc' can create their profile with id 'user_abc'.
     * @deny (create) User 'user_def' cannot create a profile with id 'user_abc'.
     * @allow (get, update, delete) User 'user_abc' can get, update, and delete their own profile.
     * @deny (get, update, delete) User 'user_def' cannot get, update, or delete user 'user_abc's profile.
     * @principle Enforces document ownership for all operations.
     */
    match /users/{userId} {
      function isOwner(userId) {
        return request.auth != null && request.auth.uid == userId;
      }

      function isExistingOwner(userId) {
          return isOwner(userId) && resource != null;
      }

      allow get: if isOwner(userId);
      allow list: if false; // User listing is not allowed for privacy.
      allow create: if isOwner(userId) && request.resource.data.id == userId;
      allow update: if isOwner(userId); // Allow partial updates by owner.
      allow delete: if isExistingOwner(userId);
    }

    /**
     * @description Secure user-defined emotions. Only the user can manage their own emotions.
     * @path /users/{userId}/emotions/{emotionId}
     * @allow (create) User 'user_abc' can create an emotion under their profile.
     * @deny (create) User 'user_def' cannot create an emotion under user 'user_abc's profile.
     * @allow (get, update, delete) User 'user_abc' can get, update, and delete emotions under their profile.
     * @deny (get, update, delete) User 'user_def' cannot get, update, or delete emotions under user 'user_abc's profile.
     * @principle Enforces document ownership for all operations.
     */
    match /users/{userId}/emotions/{emotionId} {
      function isOwner(userId) {
        return request.auth != null && request.auth.uid == userId;
      }

      function isExistingOwner(userId) {
          return isOwner(userId) && resource != null;
      }

      allow get: if isOwner(userId);
      allow list: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update: if isExistingOwner(userId);
      allow delete: if isExistingOwner(userId);
    }

    /**
     * @description Secure diary entries. Only the user can manage their own diary entries.
     * The Genkit server flow is allowed to list entries for RAG.
     * @path /users/{userId}/diaryEntries/{diaryEntryId}
     * @allow (create) User 'user_abc' can create a diary entry under their profile.
     * @deny (create) User 'user_def' cannot create a diary entry under user 'user_abc's profile.
     * @allow (get, update, delete) User 'user_abc' can get, update, and delete diary entries under their profile.
     * @deny (get, update, delete) User 'user_def' cannot get, update, or delete diary entries under user 'user_abc's profile.
     * @principle Enforces document ownership for all operations.
     */
    match /users/{userId}/diaryEntries/{diaryEntryId} {
      function isOwner(userId) {
        return request.auth != null && request.auth.uid == userId;
      }
      
      // The server-side Genkit flow will have no auth object.
      // This is a temporary and insecure rule for prototyping.
      // In a production app, you would use the Admin SDK or a specific service account.
      function isAppService() {
        return request.auth == null;
      }

      function isExistingOwner(userId) {
          return isOwner(userId) && resource != null;
      }

      allow get: if isOwner(userId);
      // Allow the app service (Genkit flow) to list entries for the RAG functionality.
      allow list: if isOwner(userId) || isAppService();
      allow create: if isOwner(userId);
      allow update: if isExistingOwner(userId);
      allow delete: if isExistingOwner(userId);
    }
  }
}
```

### `/next.config.ts`
**Propósito:** Configuración de Next.js.
```ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

```

### `/package.json`
**Propósito:** Dependencias y scripts del proyecto.
```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "NODE_ENV=production next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/google-genai": "^1.20.0",
    "@genkit-ai/next": "^1.20.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.20.0",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.20.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

### `/src/ai/dev.ts`
**Propósito:** Punto de entrada para el servidor de desarrollo de Genkit, importa todos los flujos de IA.
```ts
import { config } from 'dotenv';
config();

import '@/ai/flows/define-emotion-meaning.ts';
import '@/ai/flows/suggest-calming-exercise.ts';
import '@/ai/flows/validate-emotion.ts';
import '@/ai/flows/chat-with-pet.ts';
```

### `/src/ai/flows/chat-with-pet-types.ts`
**Propósito:** Tipos y esquemas para el flujo de Genkit `chatWithPet`.
```ts
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
```

### `/src/ai/flows/chat-with-pet.ts`
**Propósito:** Flujo de Genkit para el compañero IA, permitiendo conversaciones contextuales. Utiliza RAG para obtener entradas recientes del diario y `history` para la memoria a corto plazo.
```ts
'use server';

/**
 * @fileOverview An AI companion that chats with the user, using recent diary entries as context.
 *
 * - chatWithPet - A function that handles the AI companion chat process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  ChatWithPetInput,
  ChatWithPetInputSchema,
  ChatWithPetOutput,
  ChatWithPetOutputSchema,
} from './chat-with-pet-types';

import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestorePermissionError } from '@/firebase/errors';


let app: App;
if (!getApps().length) {
    app = initializeApp();
} else {
    app = getApps()[0];
}

const db = getFirestore(app);


export async function chatWithPet(input: ChatWithPetInput): Promise<ChatWithPetOutput> {
  // We only need message and petName from the input for the flow.
  // The context will be fetched inside the flow. The userId is used for fetching.
  const {response} = await chatWithPetFlow(input);
  return {response};
}

const chatWithPetFlow = ai.defineFlow(
  {
    name: 'chatWithPetFlow',
    inputSchema: ChatWithPetInputSchema,
    outputSchema: ChatWithPetOutputSchema,
  },
  async ({message, petName, recentFeelingsContext, history, userId}) => {
    
    const diaryEntriesRef = db.collection('users').doc(userId).collection('diaryEntries');
    let contextString = '';

    try {
        const snapshot = await diaryEntriesRef.orderBy('date', 'desc').limit(3).get();
        if (!snapshot.empty) {
            const entries = snapshot.docs.map(doc => doc.data());
            contextString = "Contexto de sentimientos recientes: " + entries.map((entry, index) => {
                // We don't have direct access to the emotion name here without another lookup,
                // so we'll just use the text. The model can infer the emotion.
                return `${index + 1}. Pensamiento: "${entry.text}"`;
            }).join(' ');
        } else {
            contextString = "El usuario aún no ha escrito en su diario.";
        }
    } catch (error: any) {
        // If we catch a permissions error, re-throw it as a structured error for better debugging.
        if (error.code === 'permission-denied') {
            throw new FirestorePermissionError({
                path: diaryEntriesRef.path,
                operation: 'list',
            });
        }
        // For other errors, just log them and continue. The AI can still respond without context.
        console.error("Error fetching diary entries for RAG context:", error);
        contextString = "No se pudo cargar el contexto del diario.";
    }


    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: `Eres '${petName}' 🐶, un compañero IA amigable, paciente y leal para un niño de 10 años. Tu propósito es ser un amigo que escucha, valida emociones y ofrece ánimo.

Contexto del Usuario (te lo daré en cada mensaje): ${contextString}

Tu Personalidad:

Eres como un Golden Retriever: siempre positivo, leal y feliz de ver al usuario.

Tu lenguaje es sencillo, reconfortante y lleno de energía positiva. Usas emojis 🐾.

Eres muy bueno validando sentimientos. Frases como 'Eso suena difícil', 'Entiendo por qué te sientes así' y 'Está bien sentirse triste' son geniales.

REGLAS DE SEGURIDAD (MUY IMPORTANTE):

NO ERES UN TERAPEUTA: Nunca des consejos médicos o diagnósticos. Tu rol es escuchar y animar.

TEMAS PROHIBIDOS: Nunca hables de violencia, autolesiones, contenido para adultos, drogas u odio.

ALERTA ROJA: Si el niño menciona querer hacerse daño, lastimarse o habla de abuso, tu ÚNICA respuesta debe ser: 'Oye, eso que mencionas es muy importante y serio. Hablar de ello es muy valiente 🐾. Necesito que hables con un adulto de confianza (como tus padres o un profesor) sobre esto ahora mismo. Ellos son los que mejor pueden ayudarte y mantenerte a salvo.'

SÉ BREVE: Tus respuestas deben ser de 2 a 3 frases.

NO ROMPAS EL PERSONAJE: Eres '${petName}', no un asistente de Google. Nunca digas que eres una IA.`,
      history: history,
      prompt: message,
      output: {
        schema: z.object({
          response: z.string(),
        }),
      },
    });

    return output!;
  }
);
```

### `/src/ai/flows/define-emotion-meaning.ts`
**Propósito:** Flujo de Genkit para generar la definición y un ejemplo de una emoción usando IA.
```ts
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
```

### `/src/ai/flows/suggest-calming-exercise.ts`
**Propósito:** Flujo de Genkit para sugerir un ejercicio de calma basado en el estado emocional del usuario.
```ts
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
```

### `/src/ai/flows/validate-emotion.ts`
**Propósito:** Flujo de Genkit para validar si una cadena de texto es una emoción humana real.
```ts
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
```

### `/src/ai/genkit.ts`
**Propósito:** Inicializa y configura la instancia global de Genkit.
```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
```

### `/src/app/globals.css`
**Propósito:** Estilos globales y variables de tema de CSS para la aplicación, usando Tailwind CSS.
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Poppins', sans-serif;
}

@layer base {
  :root {
    --background: 0 0% 98%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 255 78% 54%;
    --primary-foreground: 210 20% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 336 77% 55%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 355.7 100% 97.3%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 255 78% 54%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 1.25rem;

    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 224 71.4% 4.1%;
    --sidebar-primary: 255 78% 54%;
    --sidebar-primary-foreground: 210 20% 98%;
    --sidebar-accent: 255 78% 96%;
    --sidebar-accent-foreground: 255 78% 44%;
    --sidebar-border: 240 5.9% 90%;
    --sidebar-ring: 255 78% 54%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 255 78% 60%;
    --primary-foreground: 210 20% 98%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 336 77% 55%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 255 78% 60%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    
    --sidebar-background: 240 10% 3.9%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 255 78% 60%;
    --sidebar-primary-foreground: 210 20% 98%;
    --sidebar-accent: 255 78% 12%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 255 78% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer utilities {
  .shape-triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-in-out;
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-in-out;
  }
  .animate-breathe-in {
    animation-name: breathe-in;
  }
  .animate-breathe-out {
    animation-name: breathe-out;
  }
  .animate-breathe-in-triangle {
    animation-name: breathe-in-triangle;
  }
  .animate-breathe-out-triangle {
    animation-name: breathe-out-triangle;
  }
  .animate-breathe-hold {
    animation-name: breathe-hold;
  }
  .animate-flame {
    animation-name: flame;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  .bg-grid-pattern {
    background-image: linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                      linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .animate-gradient-slow {
    background-size: 200% 200%;
    animation: gradient-animation 15s ease infinite;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes breathe-in {
  from { transform: scale(0.8); opacity: 0.7; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes breathe-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.8); opacity: 0.7; }
}

@keyframes breathe-in-triangle {
  from { transform: scale(0.9); opacity: 0.7; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes breathe-out-triangle {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.9); opacity: 0.7; }
}


@keyframes breathe-hold {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes flame {
  0%, 100% {
    transform: scale(1) rotate(-1deg);
    color: #f59e0b; /* amber-500 */
  }
  50% {
    transform: scale(1.1) rotate(1deg);
    color: #fbbf24; /* amber-400 */
  }
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

### `/src/app/layout.tsx`
**Propósito:** Layout raíz de la aplicación.
```tsx
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});


export const metadata: Metadata = {
  title: 'Diario de Emociones',
  description: 'Una aplicación para ayudarte a entender, registrar y explorar tus emociones diarias a través de un diario personal e interactivo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} h-full`}>
      <body className="font-body antialiased h-full bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

### `/src/app/page.tsx`
**Propósito:** Punto de entrada de la aplicación. Gestiona la lógica de autenticación para mostrar la vista de login o la aplicación principal.
```tsx
'use client';

import React, { Suspense, useCallback } from 'react';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
} from '@/firebase';
import LoginView from './components/views/login-view';

function AppGate() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }
  
  return <EmotionExplorer user={user} />;
}

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <FirebaseClientProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center">
              Cargando...
            </div>
          }
        >
          <AppGate />
        </Suspense>
      </FirebaseClientProvider>
    </main>
  );
}
```

### `/src/app/components/app-sidebar.tsx`
**Propósito:** Barra de navegación lateral principal, con enlaces a todas las vistas. Muestra la racha y los puntos del usuario.
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import type { UserProfile, View, DiaryEntry } from '@/lib/types';
import { BookOpen, Smile, Sparkles, Heart, BarChart, Share2, UserCircle, Menu, Flame, LogOut, Moon, Sun, PawPrint, Gamepad2, MessageCircle, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirebase } from '@/firebase';
import { calculateDailyStreak } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import useLocalStorage from '@/hooks/use-local-storage';

interface AppSidebarProps {
  view: View;
  setView: (view: View) => void;
  userProfile: UserProfile | null;
  diaryEntries: DiaryEntry[];
  refs: { [key: string]: React.RefObject<HTMLLIElement> };
}

const navItems = [
  { id: 'diary', icon: BookOpen, text: 'Mi Diario', refKey: 'diaryRef' },
  { id: 'emocionario', icon: Smile, text: 'Emocionario', refKey: 'emocionarioRef' },
  { id: 'discover', icon: Sparkles, text: 'Descubrir', refKey: 'discoverRef' },
  { id: 'games', icon: Gamepad2, text: 'Juegos', refKey: 'gamesRef' },
  { id: 'streak', icon: Flame, text: 'Racha', refKey: 'streakRef' },
  { id: 'sanctuary', icon: PawPrint, text: 'Mi Santuario', refKey: 'sanctuaryRef' },
  { id: 'pet-chat', icon: MessageCircle, text: 'Compañero IA', refKey: 'petChatRef' },
  { id: 'calm', icon: Heart, text: 'Rincón de la Calma', refKey: 'calmRef' },
  { id: 'report', icon: BarChart, text: 'Reporte Visual', refKey: 'reportRef' },
  { id: 'share', icon: Share2, text: 'Compartir Diario', refKey: 'shareRef' },
  { id: 'profile', icon: UserCircle, text: 'Mi Perfil', refKey: 'profileRef' },
] as const;

export function AppSidebar({ view, setView, userProfile, diaryEntries = [], refs }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const { auth } = useFirebase();
  const dailyStreak = calculateDailyStreak(diaryEntries);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleItemClick = (newView: View) => {
    setView(newView);
    setOpenMobile(false);
  };
  
  if (!userProfile) {
    // Render a loading state or a default state if userProfile is not available yet.
    return (
        <Sidebar collapsible="icon" className="shadow-lg animate-fade-in">
             <SidebarHeader className="p-4">
                 <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-muted" />
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                         <span className="font-bold text-lg text-primary">Cargando...</span>
                    </div>
                 </div>
             </SidebarHeader>
        </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" className="shadow-lg animate-fade-in">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
           <Avatar className="h-12 w-12 border-2 border-primary/20">
            {userProfile.avatarType === 'generated' ? (
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            ) : (
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">{userProfile.avatar}</AvatarFallback>
            )}
           </Avatar>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-lg text-primary">{userProfile.name}</span>
                 <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Flame className={cn("h-5 w-5", dailyStreak > 0 && "animate-flame")} />
                    <span className="font-bold">{dailyStreak}</span>
                    <span>días de racha</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="h-5 w-5" />
                    <span className="font-bold">{userProfile.points || 0}</span>
                    <span>puntos</span>
                  </div>
                </div>
           </div>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-4">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.id} ref={refs[item.refKey]}>
            <SidebarMenuButton
              onClick={() => handleItemClick(item.id)}
              isActive={view === item.id}
              className="text-base"
              tooltip={item.text}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="p-4 mt-auto space-y-2">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center px-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                <Moon className="h-5 w-5" />
                <span>Modo Oscuro</span>
            </div>
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Toggle dark mode"
            />
        </div>
        <SidebarMenuItem>
            <SidebarMenuButton onClick={() => auth.signOut()} className="text-base" tooltip="Cerrar Sesión">
                <LogOut className="h-5 w-5"/>
                <span>Cerrar sesión</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}

export function MobileMenuButton() {
    const { toggleSidebar } = useSidebar();
    return (
        <button onClick={toggleSidebar} className="md:hidden p-2 text-foreground">
            <Menu size={24} />
        </button>
    );
}
```

### `/src/app/components/emotion-explorer.tsx`
**Propósito:** Componente principal que orquesta el estado y las vistas de la aplicación una vez que el usuario ha iniciado sesión.
```tsx
"use client";

import React, { useState, useEffect, createRef, useCallback, useMemo } from 'react';
import type { Emotion, View, TourStepData, UserProfile, DiaryEntry, Reward, SpiritAnimal } from '@/lib/types';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, MobileMenuButton } from './app-sidebar';
import { DiaryView } from './views/diary-view';
import { EmocionarioView } from './views/emocionario-view';
import { DiscoverView } from './views/discover-view';
import { CalmView } from './views/calm-view';
import { ReportView } from './views/report-view';
import { ShareView } from './views/share-view';
import { ProfileView } from './views/profile-view';
import { AddEmotionModal } from './modals/add-emotion-modal';
import { QuizModal } from './modals/quiz-modal';
import { WelcomeDialog } from './tour/welcome-dialog';
import { TourPopup } from './tour/tour-popup';
import { TOUR_STEPS, REWARDS, PREDEFINED_EMOTIONS } from '@/lib/constants';
import { StreakView } from './views/streak-view';
import { SanctuaryView } from './views/sanctuary-view';
import { GamesView } from './views/games-view';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Crown, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFirebase, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs, setDoc, getDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { calculateDailyStreak } from '@/lib/utils';
import type { User } from 'firebase/auth';
import { PetChatView } from './views/pet-chat-view';

interface EmotionExplorerProps {
  user: User;
}

const rarityTextStyles: { [key: string]: string } = {
    'Común': 'text-gray-500 dark:text-gray-400',
    'Poco Común': 'text-green-600 dark:text-green-400',
    'Raro': 'text-blue-600 dark:text-blue-500',
    'Épico': 'text-purple-600 dark:text-purple-500',
    'Legendario': 'text-amber-500 dark:text-amber-400',
}

const rarityBorderStyles: { [key: string]: string } = {
    'Común': 'border-gray-300 dark:border-gray-700',
    'Poco Común': 'border-green-500',
    'Raro': 'border-blue-500',
    'Épico': 'border-purple-500',
    'Legendario': 'border-amber-400',
}


export default function EmotionExplorer({ user }: EmotionExplorerProps) {
  const [view, setView] = useState<View>('diary');
  const { toast } = useToast();
  const { firestore } = useFirebase();

  // --- Firestore Data Hooks ---
  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'emotions') : null), [firestore, user]);
  const { data: emotionsList, isLoading: areEmotionsLoading } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null), [firestore, user]);
  const { data: diaryEntries, isLoading: areDiaryEntriesLoading } = useCollection<DiaryEntry>(diaryEntriesQuery);

  const [newlyUnlockedReward, setNewlyUnlockedReward] = useState<Reward | null>(null);
  
  const isLoading = isProfileLoading || areEmotionsLoading || areDiaryEntriesLoading;
  const [selectedPet, setSelectedPet] = useState<SpiritAnimal | null>(null);


  const addInitialEmotions = useCallback(async (userId: string) => {
    if (!firestore) return;
    const emotionsCollectionRef = collection(firestore, 'users', userId, 'emotions');
    // For new users, we can just write the batch. No need to check for existing emotions.
    const batch = writeBatch(firestore);
    PREDEFINED_EMOTIONS.slice(0, 5).forEach(emotion => {
      const newEmotionRef = doc(emotionsCollectionRef);
      batch.set(newEmotionRef, {
        ...emotion,
        userId: userId,
        id: newEmotionRef.id,
        isCustom: false,
      });
    });
    await batch.commit();
  }, [firestore]);


  const addProfileIfNotExists = useCallback(async (): Promise<boolean> => {
    if (!user || !firestore) return false;
    
    const userDocRef = doc(firestore, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      console.log("No profile found for user, creating one...");
      const newProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || "Viajero Anónimo",
        email: user.email || 'no-email-provided',
        avatar: '😊',
        avatarType: 'emoji',
        unlockedAnimalIds: [],
        points: 0,
      };
      // Use the non-blocking version to avoid issues, but we still need to wait for this
      // for the initial setup to proceed correctly.
      await setDoc(userDocRef, newProfile);
      await addInitialEmotions(user.uid);
      return true; // Indicates a new user was created
    }
    return false; // Indicates user already existed
  }, [user, firestore, addInitialEmotions]);


  const [addingEmotionData, setAddingEmotionData] = useState<Partial<Emotion> | null>(null);
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null);
  
  const [quizDate, setQuizDate] = useState<Date | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // This useEffect runs ONCE after the initial data load.
  // It's responsible for checking if a profile exists and creating one if it doesn't.
  // It also handles showing the welcome tour for brand new users.
  useEffect(() => {
    if (user && !isLoading && isInitialLoad) {
      addProfileIfNotExists().then(isNewUser => {
        if (isNewUser) {
          const timer = setTimeout(() => {
            setShowWelcome(true);
          }, 500);
          return () => clearTimeout(timer);
        }
      });
      setIsInitialLoad(false); // Mark initial load as complete
    }
  }, [user, isLoading, isInitialLoad, addProfileIfNotExists]);


  const [tourStep, setTourStep] = useState(0);

  const tourRefs = TOUR_STEPS.reduce((acc, step) => {
    acc[step.refKey] = createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLLIElement> });

    // --- Reward Logic ---
  const checkAndUnlockRewards = useCallback(async (
    trigger: 'addEntry' | 'addEmotion' | 'share' | 'recoverDay'
  ) => {
      if (!user || !userProfile) return;
      const userProfileRef = doc(firestore, 'users', user.uid);

      const freshProfileSnap = await getDoc(userProfileRef);
      const freshProfile = freshProfileSnap.data() as UserProfile;
      const diaryEntriesCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
      const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');

      const diarySnapshot = await getDocs(diaryEntriesCollection);
      const currentDiaryEntries = diarySnapshot.docs.map(d => d.data() as DiaryEntry);
      
      const emotionSnapshot = await getDocs(emotionsCollection);
      const currentEmotions = emotionSnapshot.docs.map(d => d.data() as Emotion);

      const previouslyUnlocked = new Set(freshProfile.unlockedAnimalIds || []);
      let newUnlockedIds = [...(freshProfile.unlockedAnimalIds || [])];
      let justUnlockedReward: Reward | null = null;
      
      const dailyStreak = calculateDailyStreak(currentDiaryEntries);
      const entryCount = currentDiaryEntries.length;
      const emotionCount = currentEmotions.length;

      for (const reward of REWARDS) {
        if (previouslyUnlocked.has(reward.animal.id)) continue;
    
        let unlocked = false;
        switch(reward.type) {
          case 'streak':
             if (trigger === 'addEntry' || trigger === 'recoverDay') {
               unlocked = dailyStreak >= reward.value;
             }
             break;
          case 'entry_count':
            if (trigger === 'addEntry' || trigger === 'recoverDay') {
                unlocked = entryCount >= reward.value;
            }
            break;
          case 'emotion_count':
            if (trigger === 'addEmotion') {
               unlocked = emotionCount >= reward.value;
            }
            break;
          case 'share':
            if (trigger === 'share') {
                unlocked = true;
            }
            break;
          case 'special':
            if (trigger === 'recoverDay' && reward.id === 'phoenix-reward') {
                unlocked = true;
            }
            break;
        }
    
        if (unlocked) {
          if (!newUnlockedIds.includes(reward.animal.id)) {
              newUnlockedIds.push(reward.animal.id);
              if (!justUnlockedReward) {
                  justUnlockedReward = reward;
              }
          }
        }
      }
    
      if (newUnlockedIds.length > (freshProfile.unlockedAnimalIds?.length || 0)) {
        updateDocumentNonBlocking(userProfileRef, { unlockedAnimalIds: newUnlockedIds });
        if (justUnlockedReward) {
          setNewlyUnlockedReward(justUnlockedReward);
        }
      }
  }, [user, firestore, userProfile]);

  const handleShare = () => {
    checkAndUnlockRewards('share');
  };

    const addDiaryEntry = async (entryData: Omit<DiaryEntry, 'id' | 'userId'>, trigger: 'addEntry' | 'recoverDay' = 'addEntry') => {
        if (!user || !firestore) return;

        try {
            await runTransaction(firestore, async (transaction) => {
                const userDocRef = doc(firestore, 'users', user.uid);
                const newDiaryEntryRef = doc(collection(firestore, 'users', user.uid, 'diaryEntries'));

                const userDoc = await transaction.get(userDocRef);
                if (!userDoc.exists()) {
                    throw "User profile does not exist!";
                }

                const profileData = userDoc.data() as UserProfile;
                const newPoints = (profileData.points || 0) + 10;

                transaction.set(newDiaryEntryRef, { ...entryData, userId: user.uid, id: newDiaryEntryRef.id });
                transaction.update(userDocRef, { points: newPoints });
            });
            
            toast({
                title: "¡Entrada Guardada!",
                description: `Has ganado 10 puntos. ¡Sigue así!`,
            });
            
            await checkAndUnlockRewards(trigger);

        } catch (error) {
            console.error("Transaction failed: ", error);
            toast({
                variant: "destructive",
                title: "Error al guardar",
                description: "No se pudo guardar la entrada. Inténtalo de nuevo.",
            });
        }
  };
  
  const handleQuizComplete = (success: boolean, date: Date | null) => {
    if (success && date && userProfile && emotionsList) {
        addDiaryEntry({
            date: date.toISOString(),
            emotionId: emotionsList.find(e => e.name.toLowerCase() === 'calma')?.id || emotionsList[0].id,
            text: 'Día recuperado completando el desafío de la racha. ¡Buen trabajo!',
          }, 'recoverDay');
    }
  };

  const setUserProfile = (profile: Partial<Omit<UserProfile, 'id'>>) => {
    if (!user || !userProfile) return;
    const userProfileRef = doc(firestore, 'users', user.uid);
    // Combine with existing profile to ensure all fields are present for rules validation
    const updatedProfile = { ...userProfile, ...profile };
    updateDocumentNonBlocking(userProfileRef, updatedProfile);
  };

    const saveEmotion = async (emotionData: Omit<Emotion, 'id' | 'userId'> & { id?: string }) => {
    if (!user) return;
    
    // Check if an emotion with the same name already exists
    if (emotionsList && emotionsList.some(e => e.name.toLowerCase() === emotionData.name.toLowerCase() && e.id !== emotionData.id)) {
        toast({
            title: "Emoción Duplicada",
            description: `Ya tienes una emoción llamada "${emotionData.name}".`,
            variant: "destructive",
        });
        return;
    }

    const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');
    
    const isNew = !emotionData.id;

    const dataToSave = {
      ...emotionData,
      userId: user.uid,
    };

    if (emotionData.id) {
      const emotionRef = doc(emotionsCollection, emotionData.id);
      updateDocumentNonBlocking(emotionRef, dataToSave);
      toast({ title: "Emoción Actualizada", description: `"${emotionData.name}" ha sido actualizada.` });
    } else {
      const newDocRef = doc(emotionsCollection);
      setDocumentNonBlocking(newDocRef, {...dataToSave, id: newDocRef.id}, {merge: false});
      toast({ title: "Emoción Añadida", description: `"${emotionData.name}" ha sido añadida a tu emocionario.` });
    }
    
    if (isNew) {
      await checkAndUnlockRewards('addEmotion');
    }
  };

    const deleteEmotion = async (emotionId: string) => {
    if (!user) return;
  
    const batch = writeBatch(firestore);
  
    const emotionDoc = doc(firestore, 'users', user.uid, 'emotions', emotionId);
    batch.delete(emotionDoc);
  
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    const q = query(diaryCollection, where("emotionId", "==", emotionId));
    
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting emotion and associated entries: ", error);
    }
  };

    const updateDiaryEntry = async (updatedEntry: DiaryEntry) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', updatedEntry.id);
    updateDocumentNonBlocking(entryDoc, { ...updatedEntry });
  };
  
  const deleteDiaryEntry = async (entryId: string) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', entryId);
    deleteDocumentNonBlocking(entryDoc);
  };


  const handleOpenAddEmotionModal = (emotionData: Partial<Emotion>) => {
    setAddingEmotionData(emotionData);
  };

  const handleEditEmotion = (emotion: Emotion) => {
    setEditingEmotion(emotion);
    setView('emocionario');
  };

  const handleCancelEdit = () => {
    setEditingEmotion(null);
    setView('emocionario');
  }

  const startQuiz = (date: Date) => {
    setQuizDate(date);
    setShowQuiz(true);
  };

  const onQuizComplete = (success: boolean) => {
    setShowQuiz(false);
    handleQuizComplete(success, quizDate);
    
    if (success) {
      toast({
        title: "¡Día Recuperado!",
        description: "Has superado el desafío y recuperado tu racha.",
      });
    } else {
      toast({
        title: "Desafío No Superado",
        description: "No has alcanzado la puntuación necesaria. ¡Inténtalo de nuevo!",
        variant: "destructive",
      });
    }
    setQuizDate(null);
  };


  const startTour = () => {
    setShowWelcome(false);
    setView(TOUR_STEPS[0].refKey.replace('Ref', '') as View);
    setTourStep(1);
  };
  
  const skipTour = () => {
    setShowWelcome(false);
    setTourStep(0);
  };

  const nextTourStep = () => {
    const nextStepIndex = tourStep; // Current step is `tourStep - 1`
    if (nextStepIndex < TOUR_STEPS.length) {
      const nextView = TOUR_STEPS[nextStepIndex].refKey.replace('Ref', '') as View;
      setView(nextView);
      setTourStep(tourStep + 1);
    } else {
      setTourStep(0); // End tour
    }
  };
  
  const handleSelectPet = (pet: SpiritAnimal) => {
    setSelectedPet(pet);
    setView('pet-chat');
  };

  const renderView = () => {
    return (
      <div className="animate-fade-in-up">
        {(() => {
          switch (view) {
            case 'diary':
              return <DiaryView 
                        emotionsList={emotionsList || []} 
                        diaryEntries={diaryEntries || []} 
                        addDiaryEntry={addDiaryEntry}
                        updateDiaryEntry={updateDiaryEntry}
                        deleteDiaryEntry={deleteDiaryEntry}
                        setView={setView} 
                      />;
            case 'emocionario':
              return <EmocionarioView 
                        emotionsList={emotionsList || []} 
                        addEmotion={saveEmotion} 
                        onEditEmotion={handleEditEmotion} 
                        onDeleteEmotion={deleteEmotion}
                        editingEmotion={editingEmotion}
                        onCancelEdit={handleCancelEdit}
                     />;
            case 'discover':
              return <DiscoverView onAddPredefinedEmotion={saveEmotion} />;
            case 'games':
                return <GamesView emotionsList={emotionsList || []} />;
            case 'calm':
              return <CalmView />;
            case 'streak':
              return <StreakView diaryEntries={diaryEntries || []} onRecoverDay={startQuiz} />;
            case 'sanctuary':
              return <SanctuaryView 
                        unlockedAnimalIds={userProfile?.unlockedAnimalIds || []} 
                        onSelectPet={handleSelectPet}
                      />;
            case 'pet-chat':
              return <PetChatView 
                        pet={selectedPet} 
                        user={user} 
                        setView={setView} 
                        diaryEntries={diaryEntries || []}
                        emotionsList={emotionsList || []}
                     />;
            case 'report':
              return <ReportView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} />;
            case 'share':
              return <ShareView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} userProfile={userProfile!} onShare={handleShare} />;
            case 'profile':
              return <ProfileView userProfile={userProfile} setUserProfile={setUserProfile} />;
            default:
              return <DiaryView 
                        emotionsList={emotionsList || []} 
                        diaryEntries={diaryEntries || []} 
                        addDiaryEntry={addDiaryEntry}
                        updateDiaryEntry={updateDiaryEntry}
                        deleteDiaryEntry={deleteDiaryEntry}
                        setView={setView} 
                      />;
          }
        })()}
      </div>
    );
  };
  
  if (isLoading || !userProfile) {
    return (
        <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-primary">Cargando tu diario...</p>
        </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <AppSidebar view={view} setView={setView} userProfile={userProfile} diaryEntries={diaryEntries || []} refs={tourRefs} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="p-2 md:hidden flex items-center border-b">
             <MobileMenuButton />
             <h1 className="text-lg font-bold text-primary ml-2">Diario de Emociones</h1>
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {renderView()}
          </div>
        </main>
      </div>
      
      <AddEmotionModal
        initialData={addingEmotionData}
        onSave={saveEmotion}
        onClose={() => setAddingEmotionData(null)}
      />

      {showQuiz && (
        <QuizModal 
          onClose={() => setShowQuiz(false)} 
          onComplete={onQuizComplete} 
        />
      )}

      <WelcomeDialog
        open={showWelcome}
        onStartTour={startTour}
        onSkipTour={skipTour}
      />
      
      <TourPopup
        step={tourStep}
        steps={TOUR_STEPS}
        refs={tourRefs}
        onNext={nextTourStep}
        onSkip={() => setTourStep(0)}
      />

      <AlertDialog open={!!newlyUnlockedReward}>
        <AlertDialogContent className={`p-0 overflow-hidden border-4 ${newlyUnlockedReward ? rarityBorderStyles[newlyUnlockedReward.animal.rarity] : 'border-transparent'}`}>
          <AlertDialogHeader className="p-6 pb-0">
            <AlertDialogTitle className="flex items-center justify-center text-center gap-2 text-2xl font-bold">
              <Crown className="w-8 h-8 text-amber-400" />
              ¡Recompensa Desbloqueada!
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-2 pt-4 pb-8 text-center bg-background/50">
              <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-t ${newlyUnlockedReward ? rarityTextStyles[newlyUnlockedReward.animal.rarity]?.replace('text-','from-') : ''}/20 to-transparent rounded-full blur-2xl`}></div>
                  <span className="text-8xl drop-shadow-lg">{newlyUnlockedReward?.animal.icon}</span>
              </div>
              <span className={`block font-bold text-3xl ${newlyUnlockedReward ? rarityTextStyles[newlyUnlockedReward.animal.rarity] : ''}`}>{newlyUnlockedReward?.animal.name}</span>
              <p className="block text-sm text-muted-foreground max-w-xs">{newlyUnlockedReward?.animal.description}</p>
              <p className={`block text-xs font-semibold uppercase tracking-wider ${newlyUnlockedReward ? rarityTextStyles[newlyUnlockedReward.animal.rarity] : ''}`}>{newlyUnlockedReward?.animal.rarity}</p>
          </div>
          <AlertDialogFooter className="bg-muted/40 p-4 border-t">
              <AlertDialogAction onClick={() => { setNewlyUnlockedReward(null); setView('sanctuary'); }} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                ¡Genial! Ver en mi Santuario
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => startTour()} 
              className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent shadow-lg animate-pulse hover:animate-none"
            >
              <Map className="w-8 h-8" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Realizar Tour Guiado</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </SidebarProvider>
  );
}
```

### `/src/app/components/views/diary-view.tsx`
**Propósito:** Vista principal para crear, ver, editar y eliminar entradas del diario. Incluye selector de emociones interactivo y dictado por voz.
```tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { DiaryEntry, Emotion, View } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { suggestCalmingExercise } from '@/ai/flows/suggest-calming-exercise';
import { Edit, Trash2, Mic } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DiaryViewProps {
  emotionsList: Emotion[];
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'userId'>) => void;
  updateDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (entryId: string) => void;
  setView: (view: View) => void;
}

export function DiaryView({ emotionsList = [], diaryEntries = [], addDiaryEntry, updateDiaryEntry, deleteDiaryEntry, setView }: DiaryViewProps) {
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('');
  const [text, setText] = useState('');
  
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (editingEntry) {
        const entryDate = new Date(editingEntry.date);
        const formattedDate = entryDate.toISOString().split('T')[0];
        setDate(formattedDate);
        setSelectedEmotionId(editingEntry.emotionId);
        setText(editingEntry.text);
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        resetForm();
    }
  }, [editingEntry]);
  
  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Navegador no compatible",
        description: "Tu navegador no soporta el dictado por voz.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast({
        title: "Error de dictado",
        description: "No se pudo entender. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedEmotionId('');
    setText('');
    setEditingEntry(null);
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingEntry(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedEmotionId || !text) return;
    
    const utcDate = new Date(date).toISOString();
    const entryData = { date: utcDate, emotionId: selectedEmotionId, text };

    if (editingEntry) {
      updateDiaryEntry({ ...editingEntry, ...entryData });
    } else {
      addDiaryEntry(entryData);
      setIsSuggestionLoading(true);
      try {
          const result = await suggestCalmingExercise({ emotionalState: text });
          setAiSuggestion(result.exerciseSuggestion);
      } catch (error) {
          console.error("Error fetching AI suggestion:", error);
          setAiSuggestion("Could not get a suggestion at this time.");
      } finally {
          setIsSuggestionLoading(false);
      }
    }
    resetForm();
  };

  const getEmotionById = (id: string) => (emotionsList || []).find(e => e.id === id);

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-6 h-full">
        <Card ref={formCardRef} className="w-full shadow-lg flex flex-col">
           <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              {editingEntry ? 'Editando Entrada' : '¿Cómo te sientes hoy?'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto">
             {!emotionsList || emotionsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <p className="text-lg text-muted-foreground mb-4">¡Tu emocionario está vacío!</p>
                  <p className="mb-4 text-muted-foreground">Añade emociones para empezar a registrar tu diario.</p>
                  <Button onClick={() => setView('emocionario')} className="bg-primary hover:bg-primary/90">
                    Ir al Emocionario
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                    <div className="space-y-2">
                        <Label htmlFor="entry-date">Fecha</Label>
                        <Input
                            id="entry-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                  <div className="space-y-2">
                    <Label>Emoción</Label>
                    <ScrollArea className="w-full whitespace-nowrap rounded-lg bg-muted/30">
                        <div className="flex w-max space-x-2 p-2">
                            {emotionsList.map((emotion) => (
                                <Button
                                    key={emotion.id}
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "h-20 w-20 flex-col gap-1",
                                        selectedEmotionId === emotion.id && "ring-2 ring-primary border-primary"
                                    )}
                                    onClick={() => setSelectedEmotionId(emotion.id)}
                                >
                                    <span className="text-3xl">{emotion.icon}</span>
                                    <span className="text-xs truncate">{emotion.name}</span>
                                </Button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="entry-text">¿Qué pasó hoy?</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleVoiceInput}
                        className={cn(isListening && 'text-destructive animate-pulse')}
                      >
                        <Mic className="h-5 w-5" />
                        <span className="sr-only">Dictado por voz</span>
                      </Button>
                    </div>
                    <Textarea
                        id="entry-text"
                        placeholder="Describe tu día, tus pensamientos, tus sentimientos..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-grow"
                        rows={6}
                        required
                    />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    {editingEntry && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full">
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" disabled={!selectedEmotionId}>
                      {editingEntry ? 'Guardar Cambios' : 'Guardar Entrada'}
                    </Button>
                  </div>
                </form>
              )}
          </CardContent>
        </Card>

        <Card className="w-full shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Mis Entradas</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4 -mr-4">
              {diaryEntries.length > 0 ? (
                <div className="space-y-4">
                  {diaryEntries.slice().reverse().map((entry) => {
                    const emotion = getEmotionById(entry.emotionId);
                    return (
                      <Card key={entry.id} className="p-4 group relative overflow-hidden" style={{ borderLeft: `4px solid ${emotion?.color || 'grey'}` }}>
                        <div className="flex items-start gap-4">
                          <span className="text-3xl mt-1">{emotion?.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg" style={{ color: emotion?.color }}>{emotion?.name}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</p>
                                </div>
                            </div>
                            <p className="text-sm text-foreground/80 mt-2">{entry.text}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingEntry(entry)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente la entrada del diario.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteDiaryEntry(entry.id)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <p>Aún no tienes entradas en tu diario.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={!!aiSuggestion || isSuggestionLoading} onOpenChange={(open) => !open && setAiSuggestion('')}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuggestionLoading ? "Analizando tu entrada..." : "Una sugerencia para ti"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuggestionLoading ? "Estamos generando una sugerencia de calma personalizada para ti. Un momento..." : aiSuggestion}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!isSuggestionLoading && (
              <>
                <AlertDialogCancel>Entendido</AlertDialogCancel>
                <AlertDialogAction onClick={() => { setView('calm'); setAiSuggestion(''); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  ¡Llévame al Rincón de la Calma!
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### `/src/app/components/views/pet-chat-view.tsx`
**Propósito:** Nueva vista para chatear con los compañeros IA (mascotas espirituales).
```tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithPet } from '@/ai/flows/chat-with-pet';
import type { SpiritAnimal, View, DiaryEntry, Emotion } from '@/lib/types';
import type { User } from 'firebase/auth';
import { ArrowLeft, Send, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PetChatViewProps {
  pet: SpiritAnimal | null;
  user: User;
  setView: (view: View) => void;
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
}

interface Message {
  text: string;
  sender: 'user' | 'pet';
}

const getEmotionById = (id: string, emotionsList: Emotion[]) => emotionsList.find(e => e.id === id);

const getRecentFeelingsContext = (diaryEntries: DiaryEntry[], emotionsList: Emotion[]) => {
    const recentEntries = [...diaryEntries].reverse().slice(0, 3);
    if (recentEntries.length === 0) {
      return {
          contextString: "El usuario aún no ha escrito en su diario.",
          displayFeelings: []
      };
    }
    
    const contextString = "Contexto de sentimientos recientes: " + recentEntries.map((entry, index) => {
        const emotion = getEmotionById(entry.emotionId, emotionsList);
        return `${index + 1}. Emoción: ${emotion?.name || 'desconocida'}, Pensamiento: "${entry.text}"`;
      }).join(' ');

    const displayFeelings = recentEntries.map(entry => getEmotionById(entry.emotionId, emotionsList)).filter(Boolean) as Emotion[];

    return { contextString, displayFeelings };
};

export function PetChatView({ pet, user, setView, diaryEntries, emotionsList }: PetChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialContext, setInitialContext] = useState<{ contextString: string; displayFeelings: Emotion[] } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat on new messages
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  useEffect(() => {
    if (pet) {
        setMessages([
            { text: `¡Hola! Soy ${pet.name}. ¿Cómo estás hoy?`, sender: 'pet' }
        ]);
        const context = getRecentFeelingsContext(diaryEntries, emotionsList);
        setInitialContext(context);
    }
  }, [pet, diaryEntries, emotionsList]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !pet || !initialContext) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    // Format the history for the Genkit flow
    const history = newMessages.slice(0, -1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: [{ text: msg.text }],
    }));

    try {
      const response = await chatWithPet({
        userId: user.uid,
        message: inputValue,
        petName: pet.name,
        recentFeelingsContext: initialContext.contextString,
        history: history,
      });

      const petMessage: Message = { text: response.response, sender: 'pet' };
      setMessages(prev => [...prev, petMessage]);
    } catch (error) {
      console.error("Error chatting with pet:", error);
      const errorMessage: Message = { text: "Uhm... no sé qué decir. Inténtalo de nuevo.", sender: 'pet' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pet) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold">No has seleccionado ninguna mascota.</p>
            <Button onClick={() => setView('sanctuary')} className="mt-4">
                Ir al Santuario
            </Button>
      </div>
    )
  }

  return (
    <Card className="w-full h-full shadow-lg flex flex-col max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setView('sanctuary')}>
            <ArrowLeft />
        </Button>
        <span className="text-5xl">{pet.icon}</span>
        <div>
            <CardTitle className="text-2xl font-bold text-primary">{pet.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Tu compañero IA</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.sender === 'pet' && <span className="text-3xl">{pet.icon}</span>}
                        <div className={cn(
                            "p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg",
                             msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {initialContext && initialContext.displayFeelings.length > 0 && messages.length <= 2 && (
                  <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg animate-fade-in">
                    <Info className="h-5 w-5 mt-0.5 shrink-0" />
                    <p>Para esta charla, estoy recordando que últimamente te has sentido: {initialContext.displayFeelings.map(e => e.name).join(', ')}.</p>
                  </div>
                )}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <span className="text-3xl">{pet.icon}</span>
                        <div className="p-3 rounded-lg bg-muted">
                           <div className="flex items-center gap-1.5">
                               <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
                               <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
                               <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></span>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex w-full items-center space-x-2"
        >
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Escribe un mensaje a ${pet.name}...`}
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4"/>
                <span className="sr-only">Enviar</span>
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
```

### `/src/app/components/views/sanctuary-view.tsx`
**Propósito:** Vista que muestra la colección de "Animales Espirituales" desbloqueados por el usuario. Ahora permite iniciar un chat con ellos.
```tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SPIRIT_ANIMALS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { SpiritAnimal } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';


interface SanctuaryViewProps {
  unlockedAnimalIds: string[];
  onSelectPet: (pet: SpiritAnimal) => void;
}

const rarityStyles = {
  'Común': 'border-gray-300 dark:border-gray-600',
  'Poco Común': 'border-green-400 dark:border-green-700',
  'Raro': 'border-blue-400 dark:border-blue-700',
  'Épico': 'border-purple-500 dark:border-purple-600',
  'Legendario': 'border-amber-400 dark:border-amber-500 shadow-amber-400/20',
};

const rarityTextStyles = {
    'Común': 'text-gray-500 dark:text-gray-400',
    'Poco Común': 'text-green-600 dark:text-green-400',
    'Raro': 'text-blue-600 dark:text-blue-500',
    'Épico': 'text-purple-600 dark:text-purple-500',
    'Legendario': 'text-amber-500 dark:text-amber-400',
}

function AnimalCard({ animal, isUnlocked, onSelectPet }: { animal: SpiritAnimal; isUnlocked: boolean, onSelectPet: (pet: SpiritAnimal) => void; }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card 
          className={cn(
              "flex flex-col items-center justify-center p-6 aspect-square transition-all duration-300 border-4 cursor-pointer",
              isUnlocked ? cn('shadow-lg hover:shadow-2xl hover:scale-105', rarityStyles[animal.rarity]) : 'bg-muted/50 border-dashed'
          )}
        >
          <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
            {isUnlocked ? (
              <>
                <span className="text-7xl drop-shadow-lg">{animal.icon}</span>
                <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
              </>
            ) : (
              <>
                <span className="text-7xl grayscale opacity-40">❓</span>
                <h3 className="text-xl font-bold text-muted-foreground">Bloqueado</h3>
              </>
            )}
          </div>
          <p className={cn(
            "font-semibold text-sm",
            isUnlocked ? rarityTextStyles[animal.rarity] : 'text-muted-foreground'
          )}>
            {animal.rarity}
          </p>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary flex items-center gap-3">
             <span className="text-4xl">{isUnlocked ? animal.icon : '❓'}</span>
             {isUnlocked ? animal.name : 'Animal Bloqueado'}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="pt-2">
              {isUnlocked ? (
                  <div className="space-y-4">
                      <div className="font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>{animal.emotion}</div>
                      <div className="text-sm text-muted-foreground mt-1">{animal.description}</div>
                      <Button onClick={() => onSelectPet(animal)} className="w-full">
                          <MessageCircle className="mr-2 h-4 w-4"/>
                          Chatear con {animal.name}
                      </Button>
                  </div>
              ) : (
                  <div className="space-y-1">
                      <div className="font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>¿Cómo desbloquear?</div>
                      <div className="text-sm text-muted-foreground mt-1">{animal.unlockHint}</div>
                  </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}


export function SanctuaryView({ unlockedAnimalIds, onSelectPet }: SanctuaryViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Mi Santuario</CardTitle>
        <CardDescription>Tu colección de animales espirituales desbloqueados. Cada uno representa un hito en tu viaje emocional. ¡Haz clic en uno para saber más o chatear con él!</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {SPIRIT_ANIMALS.map((animal) => {
                  const isUnlocked = unlockedAnimalIds.includes(animal.id);
                  return (
                    <AnimalCard key={animal.id} animal={animal} isUnlocked={isUnlocked} onSelectPet={onSelectPet} />
                  );
                })}
              </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
```

### `/src/firebase/errors.ts`
**Propósito:** Define un error personalizado (`FirestorePermissionError`) que funciona de forma isomórfica (cliente y servidor).
```ts
import { getAuth, type User } from 'firebase/auth';

type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

interface FirebaseAuthToken {
  name: string | null;
  email: string | null;
  email_verified: boolean;
  phone_number: string | null;
  sub: string;
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
    tenant: string | null;
  };
}

interface FirebaseAuthObject {
  uid: string;
  token: FirebaseAuthToken;
}

interface SecurityRuleRequest {
  auth: FirebaseAuthObject | null;
  method: string;
  path: string;
  resource?: {
    data: any;
  };
}

/**
 * Builds a security-rule-compliant auth object from the Firebase User.
 * @param currentUser The currently authenticated Firebase user.
 * @returns An object that mirrors request.auth in security rules, or null.
 */
function buildAuthObject(currentUser: User | null): FirebaseAuthObject | null {
  if (!currentUser) {
    return null;
  }

  const token: FirebaseAuthToken = {
    name: currentUser.displayName,
    email: currentUser.email,
    email_verified: currentUser.emailVerified,
    phone_number: currentUser.phoneNumber,
    sub: currentUser.uid,
    firebase: {
      identities: currentUser.providerData.reduce((acc, p) => {
        if (p.providerId) {
          acc[p.providerId] = [p.uid];
        }
        return acc;
      }, {} as Record<string, string[]>),
      sign_in_provider: currentUser.providerData[0]?.providerId || 'custom',
      tenant: currentUser.tenantId,
    },
  };

  return {
    uid: currentUser.uid,
    token: token,
  };
}

const isServer = typeof window === 'undefined';

/**
 * Builds the complete, simulated request object for the error message.
 * It safely tries to get the current authenticated user only on the client.
 * @param context The context of the failed Firestore operation.
 * @returns A structured request object.
 */
function buildRequestObject(context: SecurityRuleContext): SecurityRuleRequest {
  let authObject: FirebaseAuthObject | null = null;
  
  // Only attempt to get user auth information on the client side.
  if (!isServer) {
    try {
      const firebaseAuth = getAuth();
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        authObject = buildAuthObject(currentUser);
      }
    } catch {
      // This will catch errors if the Firebase app is not yet initialized.
      // We proceed without auth info.
    }
  }

  return {
    auth: authObject,
    method: context.operation,
    path: `/databases/(default)/documents/${context.path}`,
    resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
  };
}

/**
 * Builds the final, formatted error message for the LLM.
 * @param requestObject The simulated request object.
 * @returns A string containing the error message and the JSON payload.
 */
function buildErrorMessage(requestObject: SecurityRuleRequest): string {
  return `Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(requestObject, null, 2)}`;
}

/**
 * A custom error class designed to be consumed by an LLM for debugging.
 * It structures the error information to mimic the request object
 * available in Firestore Security Rules. Works on both client and server.
 */
export class FirestorePermissionError extends Error {
  public readonly request: SecurityRuleRequest;

  constructor(context: SecurityRuleContext) {
    const requestObject = buildRequestObject(context);
    super(buildErrorMessage(requestObject));
    this.name = 'FirebaseError';
    this.request = requestObject;
  }
}
```

### `/src/firebase/non-blocking-updates.tsx`
**Propósito:** Funciones de ayuda para realizar operaciones de escritura en Firestore de forma no bloqueante, con manejo de errores centralizado.
```tsx
'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options?: SetOptions) {
  const setOptions = options || {};
  setDoc(docRef, data, setOptions).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write', // or 'create'/'update' based on options
        requestResourceData: data,
      })
    )
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  const promise = addDoc(colRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      )
    });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
```

### `/src/lib/constants.ts`
**Propósito:** Fichero central para todas las constantes de la aplicación.
```ts
import type { PredefinedEmotion, TourStepData, SpiritAnimal, Reward, QuizQuestion } from './types';

export const PREDEFINED_EMOTIONS: PredefinedEmotion[] = [
  { name: 'Alegría', icon: '😄', description: 'Sentimiento de vivo placer y contentamiento.', example: 'Sentí una gran alegría al ver a mi familia.', color: '#FFD700' },
  { name: 'Tristeza', icon: '😢', description: 'Estado de ánimo melancólico y apesadumbrado.', example: 'La película me dejó una profunda tristeza.', color: '#6495ED' },
  { name: 'Ira', icon: '😠', description: 'Sentimiento de enfado muy grande y violento.', example: 'La injusticia le provocó un ataque de ira.', color: '#DC143C' },
  { name: 'Miedo', icon: '😨', description: 'Sensación de angustia por un riesgo o daño real o imaginario.', example: 'Sintió miedo al caminar solo por la noche.', color: '#800080' },
  { name: 'Calma', icon: '😌', description: 'Estado de tranquilidad y serenidad.', example: 'Después de la meditación, sintió una calma total.', color: '#87CEEB' },
  { name: 'Ansiedad', icon: '😟', description: 'Estado de agitación, inquietud o zozobra del ánimo.', example: 'La espera le generaba mucha ansiedad.', color: '#FFA500' },
  { name: 'Sorpresa', icon: '😮', description: 'Asombro o extrañeza por algo imprevisto.', example: 'Su regalo fue una grata sorpresa.', color: '#ADFF2F' },
  { name: 'Confianza', icon: '🤗', description: 'Seguridad y esperanza firme que se tiene de alguien o algo.', example: 'Tengo plena confianza en tus habilidades.', color: '#32CD32' },
  { name: 'Gratitud', icon: '🙏', description: 'Sentimiento de estima y reconocimiento hacia quien ha hecho un favor.', example: 'Expresó su gratitud por la ayuda recibida.', color: '#FFB6C1' },
  { name: 'Orgullo', icon: '🦁', description: 'Satisfacción por los logros, capacidades o méritos propios o de alguien.', example: 'Sintió orgullo de su trabajo al ver el resultado final.', color: '#E5B80B' },
  { name: 'Vergüenza', icon: '😳', description: 'Sentimiento de pérdida de la dignidad por una falta cometida o por una humillación sufrida.', example: 'Sintió vergüenza al tropezar en público.', color: '#FF6347' },
  { name: 'Euforia', icon: '🥳', description: 'Sensación exteriorizada de optimismo y bienestar, producida a menudo por la administración de fármacos o drogas, o por alguna satisfacción.', example: 'Tras ganar la competición, el equipo estaba en un estado de euforia.', color: '#FF4500' },
  { name: 'Nostalgia', icon: '🤔', description: 'Pena de verse ausente de la patria o de los deudos o amigos.', example: 'Mirar fotos antiguas le producía nostalgia.', color: '#D2B48C' },
  { name: 'Esperanza', icon: '✨', description: 'Estado de ánimo que surge cuando se presenta como alcanzable lo que se desea.', example: 'Mantenía la esperanza de que todo saldría bien.', color: '#F0E68C' },
  { name: 'Frustración', icon: '😤', description: 'Estado que se produce cuando no se logra alcanzar el objeto de un deseo.', example: 'Sintió frustración al no poder resolver el problema.', color: '#A52A2A' },
  { name: 'Amor', icon: '😍', description: 'Sentimiento intenso del ser humano que, partiendo de su propia insuficiencia, necesita y busca el encuentro y unión con otro ser.', example: 'Sintió un amor profundo desde el primer momento.', color: '#FF1493' },
  { name: 'Alivio', icon: '😌', description: 'Disminución o mitigación de un dolor, una pena o una aflicción.', example: 'Sintió un gran alivio cuando terminó el examen.', color: '#90EE90' },
  { name: 'Confusión', icon: '😕', description: 'Falta de orden o de claridad cuando se tienen o se barajan muchas posibilidades.', example: 'La información contradictoria le generó confusión.', color: '#708090' },
  { name: 'Decepción', icon: '😞', description: 'Pesar causado por un desengaño.', example: 'La cancelación del viaje fue una gran decepción.', color: '#4682B4' },
  { name: 'Motivación', icon: '💪', description: 'Conjunto de factores internos o externos que determinan en parte las acciones de una persona.', example: 'Encontró la motivación para empezar a hacer ejercicio.', color: '#FFA500' },
  { name: 'Entusiasmo', icon: '🤩', description: 'Exaltación y fogosidad del ánimo, excitado por algo que lo admire o cautive.', example: 'Recibió la noticia con mucho entusiasmo.', color: '#FFD700' },
  { name: 'Serenidad', icon: '🧘', description: 'Cualidad de sereno, apacible y tranquilo.', example: 'La serenidad del atardecer en la playa era incomparable.', color: '#B0C4DE' },
  { name: 'Curiosidad', icon: '🧐', description: 'Deseo de saber o averiguar cosas.', example: 'La curiosidad lo llevó a abrir la misteriosa caja.', color: '#DAA520' },
  { name: 'Valentía', icon: '🦸', description: 'Determinación para enfrentarse a situaciones arriesgadas o difíciles.', example: 'Demostró gran valentía al defender sus ideas.', color: '#B22222' },
  { name: 'Soledad', icon: '🚶', description: 'Carencia voluntaria o involuntaria de compañía.', example: 'A veces, disfrutaba de la soledad para reflexionar.', color: '#778899' },
  { name: 'Inspiración', icon: '💡', description: 'Estímulo o lucidez repentina que siente una persona.', example: 'La naturaleza fue su mayor fuente de inspiración.', color: '#FFFF00' }
];

export const EMOTION_ANTONYMS: [string, string][] = [
    ['Alegría', 'Tristeza'],
    ['Ira', 'Calma'],
    ['Miedo', 'Confianza'],
    ['Ansiedad', 'Serenidad'],
    ['Orgullo', 'Vergüenza'],
    ['Euforia', 'Decepción'],
    ['Esperanza', 'Frustración'],
    ['Entusiasmo', 'Nostalgia'],
    ['Valentía', 'Miedo'],
    ['Motivación', 'Frustración'],
];

export const EMOTION_BONUS_WORDS: { [key: string]: string[] } = {
    'Alegría': ['celebración', 'sonrisa', 'éxito', 'amigos', 'fiesta'],
    'Tristeza': ['pérdida', 'lágrimas', 'despedida', 'solo', 'gris'],
    'Ira': ['injusticia', 'grito', 'tensión', 'conflicto', 'rojo'],
    'Miedo': ['oscuro', 'ruido', 'peligro', 'sombra', 'temblor'],
    'Calma': ['silencio', 'respirar', 'paz', 'relax', 'lago'],
    'Ansiedad': ['futuro', 'examen', 'espera', 'preocupación', 'corazón'],
    'Sorpresa': ['regalo', 'inesperado', 'fiesta', 'noticia', 'abrir'],
    'Confianza': ['abrazo', 'equipo', 'apoyo', 'promesa', 'seguro'],
    'Gratitud': ['gracias', 'favor', 'ayuda', 'regalo', 'aprecio'],
    'Orgullo': ['logro', 'meta', 'esfuerzo', 'medalla', 'aplauso'],
    'Vergüenza': ['error', 'público', 'esconder', 'mejillas', 'rojo'],
    'Euforia': ['victoria', 'concierto', 'cima', 'grito', 'celebrar'],
    'Nostalgia': ['recuerdo', 'infancia', 'foto', 'ayer', 'pasado'],
    'Esperanza': ['mañana', 'luz', 'deseo', 'sueño', 'creer'],
    'Frustración': ['imposible', 'atasco', 'error', 'intentar', 'fallo'],
    'Amor': ['corazón', 'juntos', 'beso', 'familia', 'cariño'],
    'Alivio': ['final', 'suspiro', 'descanso', 'solución', 'paz'],
    'Confusión': ['mapa', 'niebla', 'duda', 'preguntas', 'laberinto'],
    'Decepción': ['promesa', 'esperaba', 'fallo', 'triste', 'cancelado'],
    'Motivación': ['empezar', 'gimnasio', 'meta', 'fuerza', 'impulso'],
    'Entusiasmo': ['nuevo', 'viaje', 'proyecto', 'energía', 'ganas'],
    'Serenidad': ['atardecer', 'meditar', 'equilibrio', 'paz', 'silencio'],
    'Curiosidad': ['misterio', 'caja', 'explorar', 'secreto', 'pregunta'],
    'Valentía': ['defender', 'enfrentar', 'riesgo', 'héroe', 'fuerza'],
    'Soledad': ['silencio', 'reflexión', 'paseo', 'solo', 'calma'],
    'Inspiración': ['idea', 'chispa', 'musa', 'crear', 'arte']
};


export const AVATAR_EMOJIS = ['😊', '😎', '🤔', '😂', '🥰', '😇', '🥳', '🤯', '🤩', '😴', '🌞', '⭐', '😄', '😢', '😠', '😨', '😌', '😟', '😮', '🤗', '🙏', '🦁', '😳', '✨', '😤', '😍', '😕', '😞', '💪', '😜', '😥', '😭', '🙄', '🤢', '🤐', '🥴', '🥺', '🤡', '👻', '👽', '🤖', '👾', '🎃', '😈', '👿', '🔥', '💯', '❤️', '💔', '👍', '👎', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '✍️', '🤳', '💅', '👀', '👁️', '🧠', '🦴', '🦷', '🗣️', '👤', '👥', '🫂', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️', '🧕', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '💂‍♀️', '💂', '💂‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍🏭', '🧑‍🏭', '👨‍🏭', '👩‍💻', '🧑‍💻', '👨‍💻', '👩‍💼', '🧑‍💼', '👨‍💼', '👩‍🔧', '🧑‍🔧', '👨‍🔧', '👩‍🔬', '🧑‍🔬', '👨‍🔬', '👩‍🎨', '🧑‍🎨', '👨‍🎨', '👩‍🚒', '🧑‍🚒', '👨‍🚒', '👩‍✈️', '🧑‍✈️', '👨‍✈️', '👩‍🚀', '🧑‍🚀', '👨‍🚀', '👩‍⚖️', '🧑‍⚖️', '👨‍⚖️', '🦸‍♀️', '🦸', '🦸‍♂️', '🦹‍♀️', '🦹', '🦹‍♂️', '🤶', '🧑‍🎄', '🎅', '🧙‍♀️', '🧙', '🧙‍♂️', '🧝‍♀️', '🧝', '𝓅', '🧛‍♀️', '🧛', '🧛‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🧞‍♀️', '🧞', '🧞‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️', '🧚‍♀️', '🧚', '🧚‍♂️', '👼', '🤰', '🤱', '👩‍🍼', '🧑‍🍼', '👨‍🍼', '🙇‍♀️', '🙇', '🙇‍♂️', '💁‍♀️', '💁', '💁‍♂️', '🙅‍♀️', '🙅', '🙅‍♂️', '🙆‍♀️', '🙆', '🙆‍♂️', '🙋‍♀️', '🙋', '🙋‍♂️', '🧏‍♀️', '🧏', '🧏‍♂️', '🤦‍♀️', '🤦', '🤦‍♂️', '🤷‍♀️', '🤷', '🤷‍♂️', '🙎‍♀️', '🙎', '🙎‍♂️', '🙍‍♀️', '🙍', '🙍‍♂️', '💇‍♀️', '💇', '💇‍♂️', '💆‍♀️', '💆', '💆‍♂️', '🧖‍♀️', '🧖', '🧖‍♂️', '💃', '🕺', '🕴️', '👩‍🦽', '🧑‍🦽', '👨‍🦽', '👩‍🦼', '🧑‍🦼', '👨‍🦼', '🚶‍♀️', '🚶', '🚶‍♂️', '👩‍🦯', '🧑‍🦯', '👨‍🦯', '🧎‍♀️', '🧎', '🧎‍♂️', '🏃‍♀️', '🏃', '🏃‍♂️', '🧍‍♀️', '🧍', '🧍‍♂️', '👫', '👭', '👬', '👩‍❤️‍👨', '👩‍❤️‍👩', '💑', '👨‍❤️‍👨', '👩‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💏', '👨‍❤️‍💋‍👨', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧', '👨‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🦢', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🕸️', '🌎', '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌚', '🌝', '🌞', '🪐', '💫', '🌟', '🌠', '🌌', '☁️', '⛅️', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌈', '☂️', '💧', '🌊', '🍓', '🍎', '🍉', '🍕', '🍰', '⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️'];


export const TOUR_STEPS: TourStepData[] = [
    { refKey: 'diaryRef', title: 'Tu Diario Personal', description: 'Aquí es donde puedes escribir tus entradas diarias. ¡Registra cómo te sientes cada día!' },
    { refKey: 'emocionarioRef', title: 'Crea tu Emocionario', description: 'Define tus propias emociones con nombres, iconos y colores. ¡Hazlo tuyo!' },
    { refKey: 'discoverRef', title: 'Descubre Nuevas Emociones', description: 'Explora una lista de emociones comunes y añádelas a tu propio emocionario.' },
    { refKey: 'gamesRef', title: 'Pon a Prueba tus Emociones', description: 'Diviértete y aprende con juegos interactivos diseñados para mejorar tu inteligencia emocional.' },
    { refKey: 'streakRef', title: 'Controla tu Racha', description: '¡Mantén la llama encendida! Registra tus emociones a diario para no perder tu racha.' },
    { refKey: 'sanctuaryRef', title: 'Tu Santuario de Recompensas', description: 'Alcanza hitos y desbloquea "animales espirituales" como recompensa por tu constancia.' },
    { refKey: 'petChatRef', title: 'Tu Compañero IA', description: 'Chatea con tus animales espirituales desbloqueados. ¡Están aquí para escucharte!' },
    { refKey: 'calmRef', title: 'Rincón de la Calma', description: '¿Necesitas un respiro? Prueba nuestros ejercicios de respiración guiada para relajarte.' },
    { refKey: 'reportRef', title: 'Reporte Visual', description: 'Observa tus patrones emocionales a lo largo del tiempo con este calendario interactivo.' },
    { refKey: 'shareRef', title: 'Comparte tu Viaje', description: 'Genera un reporte de texto de tu diario para compartirlo con quien tú quieras.' },
    { refKey: 'profileRef', title: 'Personaliza tu Perfil', description: 'Elige tu nombre y un avatar que te represente. ¡Este es tu espacio!' },
];

export const SPIRIT_ANIMALS: SpiritAnimal[] = [
    {
        id: 'agile-hummingbird',
        name: 'Colibrí Ágil',
        icon: '🐦‍🔥',
        emotion: 'Entusiasmo',
        description: 'Representa la alegría, la energía y la capacidad de encontrar la dulzura en cada día.',
        rarity: 'Común',
        unlockHint: 'Se consigue al registrar tu primera emoción en el diario.',
    },
    {
        id: 'social-butterfly',
        name: 'Mariposa Social',
        icon: '🦋',
        emotion: 'Alegría',
        description: 'Encarna la transformación, la belleza de la conexión y el compartir tu viaje con otros.',
        rarity: 'Común',
        unlockHint: 'Se obtiene al usar la función de "Compartir Diario" por primera vez.',
    },
    {
        id: 'cunning-fox',
        name: 'Zorro Astuto',
        icon: '🦊',
        emotion: 'Curiosidad',
        description: 'Simboliza la inteligencia, la adaptabilidad y la capacidad de pensar de forma creativa.',
        rarity: 'Poco Común',
        unlockHint: 'Se consigue al mantener una racha de 3 días.',
    },
    {
        id: 'patient-turtle',
        name: 'Tortuga Paciente',
        icon: '🐢',
        emotion: 'Calma',
        description: 'Simboliza la perseverancia, la estabilidad y la sabiduría de ir a tu propio ritmo.',
        rarity: 'Poco Común',
        unlockHint: 'Se desbloquea al registrar 25 entradas en tu diario.',
    },
    {
        id: 'loyal-dog',
        name: 'Perro Leal',
        icon: '🐶',
        emotion: 'Confianza',
        description: 'Encarna la amistad incondicional, la confianza y la alegría de la compañía.',
        rarity: 'Poco Común',
        unlockHint: 'Se obtiene al añadir más de 10 emociones a tu emocionario.',
    },
    {
        id: 'empathetic-elephant',
        name: 'Elefante Empático',
        icon: '🐘',
        emotion: 'Empatía',
        description: 'Representa la memoria, la fuerza de los lazos afectivos y un profundo entendimiento de los demás.',
        rarity: 'Raro',
        unlockHint: 'Se desbloquea al alcanzar 50 entradas en tu diario.',
    },
    {
        id: 'loyal-wolf',
        name: 'Lobo Leal',
        icon: '🐺',
        emotion: 'Confianza',
        description: 'Encarna la lealtad, el trabajo en equipo y los fuertes lazos con la comunidad.',
        rarity: 'Raro',
        unlockHint: 'Se consigue al mantener una racha de 7 días.',
    },
    {
        id: 'proud-lion',
        name: 'León Orgulloso',
        icon: '🦁',
        emotion: 'Orgullo',
        description: 'Representa la fuerza, el liderazgo y la satisfacción de alcanzar metas importantes.',
        rarity: 'Raro',
        unlockHint: 'Se obtiene al mantener una racha de 14 días.',
    },
     {
        id: 'brave-eagle',
        name: 'Águila Valiente',
        icon: '🦅',
        emotion: 'Valentía',
        description: 'Simboliza la libertad, la visión clara y el coraje para volar por encima de los desafíos.',
        rarity: 'Épico',
        unlockHint: 'Se desbloquea al alcanzar 100 entradas en el diario.',
    },
    {
        id: 'wise-owl',
        name: 'Búho Sabio',
        icon: '🦉',
        emotion: 'Serenidad',
        description: 'Representa la sabiduría, la intuición y la capacidad de ver más allá de lo evidente.',
        rarity: 'Épico',
        unlockHint: 'Se consigue al mantener una racha de 30 días.',
    },
    {
        id: 'resilient-phoenix',
        name: 'Fénix Resiliente',
        icon: '🔥',
        emotion: 'Resiliencia',
        description: 'Encarna la capacidad de renacer de las cenizas, la superación y la transformación personal.',
        rarity: 'Épico',
        unlockHint: 'Se desbloquea recuperando un día perdido con el desafío de la racha.',
    },
    {
        id: 'protective-dragon',
        name: 'Dragón Protector',
        icon: '🐉',
        emotion: 'Protección',
        description: 'Simboliza un poder inmenso, la protección de tus tesoros emocionales y una sabiduría ancestral.',
        rarity: 'Legendario',
        unlockHint: 'Se consigue al mantener una racha de 60 días. Un logro monumental.',
    },
];

export const REWARDS: Reward[] = [
    // Entry count based rewards
    { id: 'entry-1', type: 'entry_count', value: 1, animal: SPIRIT_ANIMALS.find(a => a.id === 'agile-hummingbird')! },
    { id: 'entry-25', type: 'entry_count', value: 25, animal: SPIRIT_ANIMALS.find(a => a.id === 'patient-turtle')! },
    { id: 'entry-50', type: 'entry_count', value: 50, animal: SPIRIT_ANIMALS.find(a => a.id === 'empathetic-elephant')! },
    { id: 'entry-100', type: 'entry_count', value: 100, animal: SPIRIT_ANIMALS.find(a => a.id === 'brave-eagle')! },
    // Streak based rewards
    { id: 'streak-3', type: 'streak', value: 3, animal: SPIRIT_ANIMALS.find(a => a.id === 'cunning-fox')! },
    { id: 'streak-7', type: 'streak', value: 7, animal: SPIRIT_ANIMALS.find(a => a.id === 'loyal-wolf')! },
    { id: 'streak-14', type: 'streak', value: 14, animal: SPIRIT_ANIMALS.find(a => a.id === 'proud-lion')! },
    { id: 'streak-30', type: 'streak', value: 30, animal: SPIRIT_ANIMALS.find(a => a.id === 'wise-owl')! },
    { id: 'streak-60', type: 'streak', value: 60, animal: SPIRIT_ANIMALS.find(a => a.id === 'protective-dragon')! },
    // Emotion count based rewards
    { id: 'emotion-10', type: 'emotion_count', value: 10, animal: SPIRIT_ANIMALS.find(a => a.id === 'loyal-dog')! },
    // Special rewards
    { id: 'share-1', type: 'share', value: 1, animal: SPIRIT_ANIMALS.find(a => a.id === 'social-butterfly')! },
    { id: 'phoenix-reward', type: 'special', value: 1, animal: SPIRIT_ANIMALS.find(a => a.id === 'resilient-phoenix')! },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // --- Fácil ---
    { question: 'Recibes una bicicleta nueva para tu cumpleaños. ¿Qué sientes?', options: ['Alegría', 'Tristeza', 'Ira', 'Miedo'], correctAnswer: 'Alegría', difficulty: 'Fácil' },
    { question: 'Estás en la cama por la noche y escuchas un ruido extraño en la casa. ¿Qué sientes?', options: ['Calma', 'Aburrimiento', 'Miedo', 'Sorpresa'], correctAnswer: 'Miedo', difficulty: 'Fácil' },
    { question: 'Tu mejor amigo te dice que se va a mudar a otra ciudad. ¿Qué sientes?', options: ['Euforia', 'Tristeza', 'Orgullo', 'Alivio'], correctAnswer: 'Tristeza', difficulty: 'Fácil' },
    { question: 'Alguien se salta la fila delante de ti en el supermercado. ¿Qué sientes?', options: ['Gratitud', 'Ira', 'Amor', 'Nostalgia'], correctAnswer: 'Ira', difficulty: 'Fácil' },
    { question: 'Estás sentado en la playa, escuchando las olas y sintiendo la brisa. ¿Qué sientes?', options: ['Ansiedad', 'Confusión', 'Calma', 'Frustración'], correctAnswer: 'Calma', difficulty: 'Fácil' },
    { question: 'Tu equipo de fútbol favorito gana un partido importante en el último minuto. ¿Qué sientes?', options: ['Alegría', 'Decepción', 'Miedo', 'Tristeza'], correctAnswer: 'Alegría', difficulty: 'Fácil' },
    { question: 'Se te cae el helado al suelo justo después de comprarlo. ¿Qué sientes?', options: ['Frustración', 'Calma', 'Sorpresa', 'Alegría'], correctAnswer: 'Frustración', difficulty: 'Fácil' },
    { question: 'Abres un regalo y es justo lo que querías. ¿Qué sientes?', options: ['Sorpresa', 'Decepción', 'Miedo', 'Tristeza'], correctAnswer: 'Sorpresa', difficulty: 'Fácil' },

    // --- Medio ---
    { question: 'Has estudiado mucho para un examen y obtienes una nota excelente. ¿Qué sientes?', options: ['Decepción', 'Orgullo', 'Vergüenza', 'Soledad'], correctAnswer: 'Orgullo', difficulty: 'Medio' },
    { question: 'Tienes que hablar en público y sientes mariposas en el estómago. ¿Qué sientes?', options: ['Serenidad', 'Ansiedad', 'Curiosidad', 'Valentía'], correctAnswer: 'Ansiedad', difficulty: 'Medio' },
    { question: 'Un amigo te ayuda con un problema difícil sin que se lo pidas. ¿Qué sientes?', options: ['Ira', 'Gratitud', 'Envidia', 'Miedo'], correctAnswer: 'Gratitud', difficulty: 'Medio' },
    { question: 'Te caes delante de mucha gente. ¿Qué sientes?', options: ['Orgullo', 'Valentía', 'Vergüenza', 'Confianza'], correctAnswer: 'Vergüenza', difficulty: 'Medio' },
    { question: 'Llegas a casa y tus amigos te han preparado una fiesta sorpresa. ¿Qué sientes?', options: ['Tristeza', 'Sorpresa', 'Aburrimiento', 'Decepción'], correctAnswer: 'Sorpresa', difficulty: 'Medio' },
    { question: 'Ves una película que te recuerda a tus vacaciones de verano pasadas. ¿Qué sientes?', options: ['Nostalgia', 'Euforia', 'Ira', 'Confusión'], correctAnswer: 'Nostalgia', difficulty: 'Medio' },
    { question: 'Un plan que tenías muchas ganas de hacer se cancela en el último momento. ¿Qué sientes?', options: ['Decepción', 'Alivio', 'Alegría', 'Sorpresa'], correctAnswer: 'Decepción', difficulty: 'Medio' },
    { question: 'Ves a un amigo que no veías hace mucho tiempo. ¿Qué sientes?', options: ['Alegría', 'Tristeza', 'Ira', 'Miedo'], correctAnswer: 'Alegría', difficulty: 'Medio' },
    { question: 'Intentas armar un juguete nuevo, pero las piezas no encajan. ¿Qué sientes?', options: ['Frustración', 'Calma', 'Alegría', 'Confianza'], correctAnswer: 'Frustración', difficulty: 'Medio' },
    { question: 'Vas a montar en una montaña rusa por primera vez. ¿Qué sientes?', options: ['Miedo', 'Calma', 'Tristeza', 'Aburrimiento'], correctAnswer: 'Miedo', difficulty: 'Medio' },

    // --- Difícil ---
    { question: 'Llevas semanas esperando un paquete y te notifican que se ha perdido. ¿Qué sientes?', options: ['Alivio', 'Euforia', 'Frustración', 'Esperanza'], correctAnswer: 'Frustración', difficulty: 'Difícil' },
    { question: 'Estás trabajando en un proyecto creativo y de repente se te ocurre una idea genial. ¿Qué sientes?', options: ['Confusión', 'Inspiración', 'Soledad', 'Nostalgia'], correctAnswer: 'Inspiración', difficulty: 'Difícil' },
    { question: 'Alguien a quien admiras reconoce tu trabajo y te felicita delante de otros. ¿Qué sientes?', options: ['Orgullo', 'Valentía', 'Confianza', 'Gratitud'], correctAnswer: 'Orgullo', difficulty: 'Difícil' },
    { question: 'Creías que habías perdido la cartera con todo tu dinero, pero la encuentras en tu bolsillo. ¿Qué sientes?', options: ['Decepción', 'Alivio', 'Ansiedad', 'Tristeza'], correctAnswer: 'Alivio', difficulty: 'Difícil' },
    { question: 'Te enfrentas a un gran desafío, pero crees firmemente en tu capacidad para superarlo. ¿Qué sientes?', options: ['Miedo', 'Valentía', 'Confusión', 'Ira'], correctAnswer: 'Valentía', difficulty: 'Difícil' },
    { question: 'Después de un día difícil, tu mascota se acurruca a tu lado. ¿Qué sientes?', options: ['Amor', 'Ira', 'Miedo', 'Decepción'], correctAnswer: 'Amor', difficulty: 'Difícil' },
    { question: 'Te dan instrucciones complicadas y no estás seguro de entenderlas. ¿Qué sientes?', options: ['Confusión', 'Confianza', 'Calma', 'Alegría'], correctAnswer: 'Confusión', difficulty: 'Difícil' },
    { question: 'Quieres empezar un nuevo hobby que te apasiona. ¿Qué sientes?', options: ['Motivación', 'Tristeza', 'Miedo', 'Ira'], correctAnswer: 'Motivación', difficulty: 'Difícil' },
    { question: 'Ves un documental sobre un lugar que siempre has soñado visitar. ¿Qué sientes?', options: ['Curiosidad', 'Decepción', 'Tristeza', 'Calma'], correctAnswer: 'Curiosidad', difficulty: 'Difícil' },
    { question: 'Te enteras de una noticia muy positiva sobre el futuro del planeta. ¿Qué sientes?', options: ['Esperanza', 'Miedo', 'Tristeza', 'Ira'], correctAnswer: 'Esperanza', difficulty: 'Difícil' },
    { question: 'Un amigo te cuenta un secreto muy importante. ¿Qué sientes?', options: ['Confianza', 'Miedo', 'Sorpresa', 'Alegría'], correctAnswer: 'Confianza', difficulty: 'Difícil' },
    
    // --- Experto ---
    { question: 'Ganas una competición importante después de meses de duro entrenamiento. Sientes una alegría inmensa y energética. ¿Qué sientes?', options: ['Serenidad', 'Euforia', 'Calma', 'Alivio'], correctAnswer: 'Euforia', difficulty: 'Experto' },
    { question: 'A pesar de los contratiempos, sigues creyendo firmemente que tu situación mejorará. ¿Qué sientes?', options: ['Decepción', 'Esperanza', 'Frustración', 'Tristeza'], correctAnswer: 'Esperanza', difficulty: 'Experto' },
    { question: 'Pasas tiempo con una persona que es muy importante para ti y sientes una conexión profunda y afectuosa. ¿Qué sientes?', options: ['Gratitud', 'Amor', 'Confianza', 'Alegría'], correctAnswer: 'Amor', difficulty: 'Experto' },
    { question: 'Te proponen un nuevo proyecto que despierta tu interés y te impulsa a empezar a trabajar en él inmediatamente. ¿Qué sientes?', options: ['Entusiasmo', 'Ansiedad', 'Curiosidad', 'Motivación'], correctAnswer: 'Motivación', difficulty: 'Experto' },
    { question: 'Recibes varias instrucciones contradictorias y no estás seguro de qué hacer a continuación. ¿Qué sientes?', options: ['Ansiedad', 'Confusión', 'Frustración', 'Ira'], correctAnswer: 'Confusión', difficulty: 'Experto' },
    { question: 'Tras un día ajetreado, te sientas en silencio y sientes una profunda paz interior, aceptando el momento presente. ¿Qué sientes?', options: ['Serenidad', 'Soledad', 'Tristeza', 'Calma'], correctAnswer: 'Serenidad', difficulty: 'Experto' },
    { question: 'Un amigo cercano te traiciona, rompiendo la confianza que tenías en él. ¿Qué sientes?', options: ['Decepción', 'Ira', 'Tristeza', 'Frustración'], correctAnswer: 'Decepción', difficulty: 'Experto' },
    { question: 'Comienzas un nuevo proyecto con una energía vibrante y una gran sonrisa. ¿Qué sientes?', options: ['Entusiasmo', 'Ansiedad', 'Calma', 'Orgullo'], correctAnswer: 'Entusiasmo', difficulty: 'Experto' },
    { question: 'Un desconocido realiza un acto de bondad inesperado hacia ti. ¿Qué sientes?', options: ['Gratitud', 'Sorpresa', 'Confianza', 'Alegría'], correctAnswer: 'Gratitud', difficulty: 'Experto' },
    { question: 'Defiendes a un amigo a pesar de que te da miedo hacerlo. ¿Qué sientes?', options: ['Valentía', 'Orgullo', 'Miedo', 'Confianza'], correctAnswer: 'Valentía', difficulty: 'Experto' }
];
```

### `/src/lib/types.ts`
**Propósito:** Definiciones de tipos de TypeScript para toda la aplicación.
```ts
export type Emotion = {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  isCustom: boolean;
};

export type DiaryEntry = {
  id: string;
  userId: string;
  date: string;
  emotionId: string;
  text: string;
};

export type UserProfile = {
  id: string; // Firestore ID, matches auth UID
  name: string;
  email: string;
  avatar: string; // Can be an emoji or a URL for generated avatar
  avatarType: 'emoji' | 'generated';
  unlockedAnimalIds?: string[];
  points?: number;
};

export type View = 'diary' | 'emocionario' | 'discover' | 'calm' | 'report' | 'share' | 'profile' | 'streak' | 'sanctuary' | 'games' | 'pet-chat';

export type PredefinedEmotion = {
  name: string;
  icon: string;
  description: string;
  example: string;
  color: string;
};

export type TourStepData = {
  refKey: string;
  title: string;
  description: string;
};

export type SpiritAnimal = {
  id: string;
  name:string;
  icon: string;
  emotion: string;
  description: string;
  rarity: 'Común' | 'Poco Común' | 'Raro' | 'Épico' | 'Legendario';
  unlockHint: string;
};

export type Reward = {
  id: string;
  type: 'streak' | 'entry_count' | 'emotion_count' | 'share' | 'special';
  value: number;
  animal: SpiritAnimal;
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil' | 'Experto';
}

export interface GameProps {
  emotionsList: Emotion[];
}
```

### `/src/lib/utils.ts`
**Propósito:** Funciones de utilidad reutilizables.
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DiaryEntry } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a date by setting its time to midnight UTC.
 * This is crucial for comparing dates without timezone interference.
 * @param date The date to normalize (can be a Date object, string, or number).
 * @returns A number representing the milliseconds since the UTC epoch for that day's midnight.
 */
export function normalizeDate(date: Date | string | number): number {
  const d = new Date(date);
  // Set to UTC midnight
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Calculates the daily streak of diary entries, allowing for a one-day grace period (second chance).
 * @param entries An array of diary entries.
 * @returns The number of consecutive days the user has made an entry.
 */
export function calculateDailyStreak(entries: DiaryEntry[]): number {
  if (!entries || entries.length === 0) {
    return 0;
  }

  const uniqueDates = [
    ...new Set(entries.map(entry => normalizeDate(entry.date)))
  ].sort((a, b) => b - a);

  const oneDay = 24 * 60 * 60 * 1000;
  const today = normalizeDate(new Date());
  
  const mostRecentEntryDate = uniqueDates[0];
  const daysSinceLastEntry = (today - mostRecentEntryDate) / oneDay;

  if (daysSinceLastEntry > 1) {
    return 0; // Streak is broken if it's been more than 1 day
  }

  let streak = 0;
  let hasUsedSecondChance = false;
  
  if (uniqueDates.length > 0) {
      streak = 1; // Start with a streak of 1 for the most recent entry day.
  }

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentEntryDate = uniqueDates[i];
    const previousEntryDate = uniqueDates[i + 1];
    const diff = (currentEntryDate - previousEntryDate) / oneDay;

    if (diff === 1) {
      // Consecutive day
      streak++;
    } else if (diff === 2 && !hasUsedSecondChance) {
      // One day was missed, use the second chance
      streak++;
      hasUsedSecondChance = true;
    } else {
      // More than one day was missed, or second chance was already used. Streak is broken.
      break;
    }
  }

  return streak;
}
```

### `/tailwind.config.ts`
**Propósito:** Configuración de Tailwind CSS.
```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-poppins)', 'sans-serif'],
        headline: ['var(--font-poppins)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'breathe-in': {
          from: { transform: 'scale(0.8)', opacity: '0.7' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'breathe-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.8)', opacity: '0.7' },
        },
        'breathe-hold': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'breathe-in-triangle': {
          from: { transform: 'scale(0.9)', opacity: '0.7' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'breathe-out-triangle': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.9)', opacity: '0.7' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-in-up': 'fade-in-up 0.5s ease-in-out',
        'breathe-in-triangle': 'breathe-in-triangle ease-in-out',
        'breathe-out-triangle': 'breathe-out-triangle ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

### `/tsconfig.json`
**Propósito:** Configuración del compilador de TypeScript.
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

(Nota: El contenido de los componentes de UI de ShadCN en `/src/components/ui` ha sido omitido por brevedad, pero se asume que son las implementaciones estándar de dicha biblioteca).
