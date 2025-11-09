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
      
      // Allow updates if the user is the owner and the update does not try to change the points directly
      // except by an authorized amount (e.g. +10 for a diary entry).
      // This is a simplified rule; a production app might use Cloud Functions for point updates.
      function isUpdatingAllowedFields() {
        let newPoints = request.resource.data.points;
        let oldPoints = resource.data.points;
        let pointsAreValid = (newPoints == oldPoints - 100 || newPoints == oldPoints - 150 || newPoints == oldPoints - 250 || newPoints == oldPoints - 500 || newPoints == oldPoints - 750 || newPoints == oldPoints) ;
        
        return request.resource.data.keys().diff(resource.data.keys()).hasOnly(['name', 'avatar', 'avatarType', 'unlockedAnimalIds', 'purchasedItemIds', 'equippedItems', 'points'])
        && pointsAreValid;
      }
      
      allow get: if isOwner(userId);
      allow list: if false; // User listing is not allowed for privacy.
      allow create: if isOwner(userId) && request.resource.data.id == userId;
      allow update: if isExistingOwner(userId) && isUpdatingAllowedFields();
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
      
      // A diary entry creation must be accompanied by a 10-point increase.
      function isPointIncreaseCorrect() {
          let userProfile = get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
          let expectedPoints = userProfile.points + 10;
          let actualPoints = getAfter(/databases/$(database)/documents/users/$(request.auth.uid)).data.points;
          return actualPoints == expectedPoints;
      }

      allow get: if isOwner(userId);
      // Allow the app service (Genkit flow) to list entries for the RAG functionality.
      allow list: if isOwner(userId) || isAppService();
      allow create: if isOwner(userId) && isPointIncreaseCorrect();
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
import { BookOpen, Smile, Sparkles, Heart, BarChart, Share2, UserCircle, Menu, Flame, LogOut, Moon, Sun, PawPrint, Gamepad2, MessageCircle, Star, Store } from 'lucide-react';
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
  { id: 'shop', icon: Store, text: 'Tienda', refKey: 'shopRef' },
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
import type { Emotion, View, TourStepData, UserProfile, DiaryEntry, Reward, SpiritAnimal, ShopItem } from '@/lib/types';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, MobileMenuButton } from './app-sidebar';
import { DiaryView } from './views/diary-view';
import { EmocionarioView } from './views/emocionario-view';
import { DiscoverView } from './views/discover-view';
import { CalmView } from './views/calm-view';
import { ReportView } from './views/report-view';
import { ShareView } from './views/share-view';
import { ProfileView } from './views/profile-view';
import { ShopView } from './views/shop-view';
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
import { collection, doc, writeBatch, query, where, getDocs, setDoc, getDoc, updateDoc, deleteDoc, runTransaction, arrayUnion } from 'firebase/firestore';
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
        purchasedItemIds: [],
        equippedItems: {},
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
  
  const handlePurchaseItem = async (item: ShopItem) => {
      if (!user || !userProfile || !firestore) return;
      if ((userProfile.points || 0) < item.cost) {
          toast({ variant: "destructive", title: "Puntos insuficientes", description: "¡No tienes suficientes puntos para comprar esto!" });
          return;
      }

      const userDocRef = doc(firestore, 'users', user.uid);

      try {
          await runTransaction(firestore, async (transaction) => {
              const userDoc = await transaction.get(userDocRef);
              if (!userDoc.exists()) {
                  throw "User profile does not exist!";
              }

              const currentPoints = userDoc.data().points || 0;
              if (currentPoints < item.cost) {
                  throw "Puntos insuficientes";
              }

              const newPoints = currentPoints - item.cost;
              transaction.update(userDocRef, {
                  points: newPoints,
                  purchasedItemIds: arrayUnion(item.id)
              });
          });

          toast({ title: "¡Compra exitosa!", description: `Has comprado "${item.name}".` });
      } catch (error: any) {
          console.error("Transaction failed: ", error);
          toast({
              variant: "destructive",
              title: "Error en la compra",
              description: error === "Puntos insuficientes" ? "¡No tienes suficientes puntos!" : "No se pudo completar la compra.",
          });
      }
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
            case 'shop':
                return <ShopView 
                          userProfile={userProfile!}
                          onPurchaseItem={handlePurchaseItem}
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
