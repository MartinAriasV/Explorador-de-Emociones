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

      function isExistingOwner(userId) {
          return isOwner(userId) && resource != null;
      }

      allow get: if isOwner(userId);
      allow list: if isOwner(userId);
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
  font-family: 'PT Sans', sans-serif;
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
    --radius: 0.75rem;

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
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
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
    <html lang="es" className={`${ptSans.variable} h-full`}>
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
**Propósito:** Barra de navegación lateral principal, con enlaces a todas las vistas.
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import type { UserProfile, View, DiaryEntry } from '@/lib/types';
import { BookOpen, Smile, Sparkles, Heart, BarChart, Share2, UserCircle, Menu, Flame, LogOut, Moon, Sun, PawPrint, Gamepad2 } from 'lucide-react';
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
                 <div className="flex items-center gap-1 text-sm text-amber-500">
                  <Flame className={cn("h-5 w-5", dailyStreak > 0 && "animate-flame")} />
                  <span className="font-bold">{dailyStreak}</span>
                  <span>días de racha</span>
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
import type { Emotion, View, TourStepData, UserProfile, DiaryEntry, Reward } from '@/lib/types';
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
import { collection, doc, writeBatch, query, where, getDocs, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { calculateDailyStreak } from '@/lib/utils';
import type { User } from 'firebase/auth';

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
    if (!user) return;
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    await addDocumentNonBlocking(diaryCollection, { ...entryData, userId: user.uid });
    await checkAndUnlockRewards(trigger);
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
      setDocumentNonBlocking(newDocRef, {...dataToSave, id: newDocRef.id});
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
              return <SanctuaryView unlockedAnimalIds={userProfile?.unlockedAnimalIds || []} />;
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

### `/src/app/components/games/antonym-game.tsx`
**Propósito:** Componente para el juego de encontrar la emoción opuesta (antónimo).
```tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { EMOTION_ANTONYMS, PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Zap } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function AntonymGame({ emotionsList }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<{ emotion: Emotion; antonym: Emotion; } | null>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const allEmotions = useMemo(() => {
    const emotionMap = new Map<string, Emotion>();
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);
  
  const generateQuestion = useCallback(() => {
    const verifiedEmotions = allEmotions.filter(e => !e.isCustom);
    if (verifiedEmotions.length < 4) return;

    const availablePairs = shuffleArray(EMOTION_ANTONYMS);
    let questionEmotion: Emotion | undefined;
    let antonymEmotion: Emotion | undefined;

    for (const pair of availablePairs) {
        questionEmotion = verifiedEmotions.find(e => e.name.toLowerCase() === pair[0].toLowerCase());
        antonymEmotion = verifiedEmotions.find(e => e.name.toLowerCase() === pair[1].toLowerCase());
        if (questionEmotion && antonymEmotion) {
            break;
        }
    }
    
    if (!questionEmotion || !antonymEmotion) return;

    const otherEmotions = allEmotions.filter(e => e.id !== questionEmotion!.id && e.id !== antonymEmotion!.id);
    const incorrectOptions = shuffleArray(otherEmotions).slice(0, 3);
    
    const allOptions = shuffleArray([antonymEmotion, ...incorrectOptions]);

    setCurrentQuestion({ emotion: questionEmotion, antonym: antonymEmotion });
    setOptions(allOptions);
    setIsAnswered(false);
    setSelectedAnswer(null);
  }, [allEmotions]);

  useEffect(() => {
    if (isPlaying) {
        generateQuestion();
    }
  }, [generateQuestion, isPlaying]);

  const handleAnswer = (answer: Emotion) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setQuestionsAnswered(prev => prev + 1);

    if (answer.id === currentQuestion?.antonym.id) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (questionsAnswered >= 10) {
      setIsPlaying(false);
    } else {
      generateQuestion();
    }
  };

  const startGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsPlaying(true);
  }
  
  if (allEmotions.filter(e => !e.isCustom).length < 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Faltan Emociones Verificadas!</p>
              <p className="max-w-md">Necesitas al menos 4 emociones no personalizadas con antónimos definidos para jugar.</p>
              <p className="text-sm mt-2">Asegúrate de tener emociones como 'Alegría', 'Tristeza', 'Miedo', 'Confianza' desde la sección "Descubrir".</p>
          </div>
      );
  }

  if (!isPlaying) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
            <h2 className="text-2xl font-bold text-primary">Guerra de Antónimos</h2>
            <p className="text-muted-foreground my-4 max-w-md">Encuentra la emoción opuesta (antónimo) a la que se muestra. Entender los opuestos es clave para el equilibrio.</p>
            {questionsAnswered >= 10 && (
                <>
                    <p className="text-lg my-2">¡Partida terminada!</p>
                    <p className="text-5xl font-bold mb-6">{score} / 10</p>
                </>
            )}
            <Button onClick={startGame} size="lg">
                <Zap className="mr-2" />
                {questionsAnswered >= 10 ? 'Jugar de Nuevo' : 'Empezar'}
            </Button>
        </div>
    );
  }

  if (!currentQuestion) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">Cargando...</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
        <p className="text-lg mt-2">¿Cuál es el antónimo (opuesto) de esta emoción?</p>
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          <div className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <span>{currentQuestion.emotion.icon}</span>
            <span>{currentQuestion.emotion.name}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option) => {
            const isSelected = selectedAnswer?.id === option.id;
            const isCorrect = currentQuestion?.antonym.id === option.id;

            return (
                 <Button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={cn(
                        "h-auto py-3 md:py-4 text-sm md:text-base whitespace-normal",
                        isAnswered && isCorrect && 'bg-green-500 hover:bg-green-600 border-green-500 text-white',
                        isAnswered && isSelected && !isCorrect && 'bg-destructive hover:bg-destructive/90 border-destructive text-destructive-foreground',
                        isAnswered && !isSelected && !isCorrect && 'opacity-50'
                    )}
                 >
                    {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 h-5 w-5" />}
                    {isAnswered && isCorrect && <CheckCircle className="mr-2 h-5 w-5" />}
                    {option.icon} {option.name}
                 </Button>
            );
        })}
      </div>

      {isAnswered && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
             <p className={cn(
                "text-lg font-bold text-center",
                selectedAnswer?.id === currentQuestion?.antonym.id ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.id === currentQuestion?.antonym.id ? '¡Correcto!' : `Incorrecto. El opuesto era: ${currentQuestion?.antonym.name}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= 10 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
```

### `/src/app/components/games/emotion-memory-game.tsx`
**Propósito:** Componente para el juego de memoria de emparejar iconos y nombres de emociones.
```tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw, Zap } from 'lucide-react';

interface MemoryCard {
  id: string;
  type: 'icon' | 'name';
  content: string;
  emotionId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const CARD_COUNT = 8; // Creates 8 pairs, 16 cards total

export function EmotionMemoryGame({ emotionsList }: GameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const availableEmotions = useMemo(() => {
    // Prioritize verified emotions, but allow custom ones if not enough verified ones are available.
    const verified = emotionsList.filter(e => !e.isCustom);
    const custom = emotionsList.filter(e => e.isCustom);
    return [...shuffleArray(verified), ...shuffleArray(custom)];
  }, [emotionsList]);
  
  const setupGame = () => {
    setIsGameOver(false);
    setMoves(0);
    setFlippedCards([]);
    setIsPlaying(true);
    
    if (availableEmotions.length < CARD_COUNT) {
        setCards([]);
        return;
    }
    
    const gameEmotions = availableEmotions.slice(0, CARD_COUNT);

    const gameCards: Omit<MemoryCard, 'id' | 'isFlipped' | 'isMatched'>[] = [];
    gameEmotions.forEach((emotion) => {
      gameCards.push({ type: 'icon', content: emotion.icon, emotionId: emotion.id });
      gameCards.push({ type: 'name', content: emotion.name, emotionId: emotion.id });
    });

    const shuffledCards = shuffleArray(gameCards).map((card, index) => ({
      ...card,
      id: `${card.emotionId}-${card.type}-${index}`,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(shuffledCards);
  };

  useEffect(() => {
    if (isPlaying) {
      setupGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.emotionId === secondCard.emotionId) {
        // It's a match
        setTimeout(() => {
          setCards(prevCards => {
            const updatedCards = [...prevCards];
            updatedCards[firstIndex].isMatched = true;
            updatedCards[secondIndex].isMatched = true;
            return updatedCards;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      } else {
        // Not a match
        setTimeout(() => {
          setCards(prevCards => {
            const updatedCards = [...prevCards];
            updatedCards[firstIndex].isFlipped = false;
            updatedCards[secondIndex].isFlipped = false;
            return updatedCards;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameOver(true);
      setIsPlaying(false);
    }
  }, [cards]);

  if (availableEmotions.length < CARD_COUNT) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">¡Faltan Emociones!</p>
        <p>Necesitas al menos {CARD_COUNT} emociones diferentes para jugar a este juego.</p>
        <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
      </div>
    );
  }

  if (!isPlaying) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-primary">Memoria de Emociones</h2>
            <p className="text-muted-foreground my-4 max-w-md">Encuentra los pares de emojis y sus nombres correspondientes. ¡Pon a prueba tu memoria emocional!</p>
            {isGameOver && (
                <>
                    <p className="text-lg my-2">¡Partida terminada!</p>
                    <p className="text-5xl font-bold mb-6">{moves} movimientos</p>
                </>
            )}
            <Button onClick={() => setIsPlaying(true)} size="lg">
                <Zap className="mr-2" />
                {isGameOver ? 'Jugar de Nuevo' : 'Empezar'}
            </Button>
        </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="flex justify-between items-center w-full max-w-2xl px-2">
        <p className="text-lg font-semibold text-primary">Movimientos: {moves}</p>
        <Button variant="outline" size="icon" onClick={setupGame}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full max-w-2xl [perspective:1000px]">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={cn(
              "relative aspect-square transition-transform duration-500 cursor-pointer [transform-style:preserve-3d]",
              card.isFlipped ? '[transform:rotateY(180deg)]' : ''
            )}
          >
            {/* Card Back */}
            <div className={cn(
              "absolute inset-0 w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-lg",
              "bg-primary/10 border-2 border-primary",
              card.isMatched ? "bg-green-500/20 border-green-500" : ""
            )}>
            </div>
            
            {/* Card Front */}
            <div className={cn(
               "absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center text-center p-2 rounded-lg",
               "bg-background",
               card.isMatched ? "border-2 border-green-500 opacity-70" : "border-2"
            )}>
                {card.type === 'icon' ? (
                    <span className="text-4xl md:text-5xl">{card.content}</span>
                ) : (
                    <span className="text-sm md:text-base font-semibold">{card.content}</span>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `/src/app/components/games/emotion-rain-game.tsx`
**Propósito:** Componente para el juego de "lluvia de emociones".
```tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Drop {
  id: number;
  emotion: Emotion;
  x: number;
  y: number;
  speed: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const MAX_LIVES = 5;
const INITIAL_SPEED_MULTIPLIER = 1.0;
const SPEED_INCREMENT = 0.1;
const INITIAL_DROP_INTERVAL = 1200; // ms
const MIN_DROP_INTERVAL = 250; // ms
const DROP_INTERVAL_DECREMENT = 50; // ms

export function EmotionRainGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [speedMultiplier, setSpeedMultiplier] = useState(INITIAL_SPEED_MULTIPLIER);
  const [dropInterval, setDropInterval] = useState(INITIAL_DROP_INTERVAL);
  
  const gameLoopRef = useRef<number>();
  const dropTimerRef = useRef<NodeJS.Timeout>();

  const availableEmotions = useMemo(() => {
    const uniqueEmotions = Array.from(new Map(emotionsList.map(e => [e.name, e])).values());
    return shuffleArray(uniqueEmotions);
  }, [emotionsList]);
  
  const selectNewTarget = useCallback(() => {
    setTargetEmotion(currentTarget => {
      if (!availableEmotions || availableEmotions.length === 0) return null;
      
      const otherEmotions = availableEmotions.filter(e => e.id !== currentTarget?.id);
      if (otherEmotions.length > 0) {
        return shuffleArray(otherEmotions)[0];
      }
      return availableEmotions[0];
    });
  }, [availableEmotions]);

  const handleDropClick = useCallback((clickedDropId: number) => {
    if (!isPlaying || !targetEmotion) return;
  
    let wasCorrect = false;
    setDrops(prev => {
      const clickedDrop = prev.find(d => d.id === clickedDropId);
      if (clickedDrop) {
        if (clickedDrop.emotion.id === targetEmotion.id) {
          setScore(s => s + 1);
          wasCorrect = true;
        } else {
          setLives(l => l - 1);
        }
      }
      return prev.filter(drop => drop.id !== clickedDropId);
    });
  
    if (wasCorrect) {
      selectNewTarget();
      setSpeedMultiplier(s => s + SPEED_INCREMENT);
      setDropInterval(d => Math.max(MIN_DROP_INTERVAL, d - DROP_INTERVAL_DECREMENT));
    }
  }, [isPlaying, targetEmotion, selectNewTarget]);
  
  const stopGame = useCallback(() => {
      setIsPlaying(false);
      setIsGameOver(true);
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if(dropTimerRef.current) clearTimeout(dropTimerRef.current);
  }, []);
  
  const startGame = useCallback(() => {
    if (availableEmotions.length < 5) return;
    setScore(0);
    setLives(MAX_LIVES);
    setDrops([]);
    setIsGameOver(false);
    setSpeedMultiplier(INITIAL_SPEED_MULTIPLIER);
    setDropInterval(INITIAL_DROP_INTERVAL);
    
    selectNewTarget();
    setIsPlaying(true);
  }, [availableEmotions.length, selectNewTarget]);


  useEffect(() => {
    if (lives <= 0 && isPlaying) {
      stopGame();
    }
  }, [lives, isPlaying, stopGame]);

  useEffect(() => {
    if (!isPlaying) {
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if(dropTimerRef.current) clearTimeout(dropTimerRef.current);
      return;
    }
    
    if (!targetEmotion) return;

    const gameLoop = () => {
      setDrops(prevDrops => {
        const newDrops = prevDrops
            .map(drop => ({
                ...drop,
                y: drop.y + drop.speed * speedMultiplier,
            }))
            .filter(drop => {
                if (drop.y > GAME_HEIGHT) {
                    if (drop.emotion.id === targetEmotion?.id) {
                        setLives(l => Math.max(0, l - 1));
                    }
                    return false;
                }
                return true;
            });
        return newDrops;
      });
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    const createDrop = () => {
        setDrops(prev => {
            if (!targetEmotion || availableEmotions.length === 0) return prev;

            let emotionForDrop: Emotion;
            // Ensure target emotion has a higher chance of appearing
            if (Math.random() < 0.4) {
                emotionForDrop = targetEmotion;
            } else {
                const otherEmotions = availableEmotions.filter(e => e.id !== targetEmotion.id);
                emotionForDrop = otherEmotions.length > 0 ? shuffleArray(otherEmotions)[0] : targetEmotion;
            }
            
            const newDrop: Drop = {
                id: Date.now() + Math.random(),
                emotion: emotionForDrop,
                x: Math.random() * (GAME_WIDTH - 40),
                y: -40,
                speed: 1 + Math.random() * 1.5,
            };
            return [...prev, newDrop];
        });
    }

    const scheduleNextDrop = () => {
      if (!isPlaying) return;
      dropTimerRef.current = setTimeout(() => {
        createDrop();
        scheduleNextDrop();
      }, dropInterval);
    };

    scheduleNextDrop();

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    };
  }, [isPlaying, targetEmotion, availableEmotions, speedMultiplier, dropInterval]);

  if (availableEmotions.length < 5) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">¡Faltan Emociones!</p>
        <p className="max-w-md">Necesitas al menos 5 emociones diferentes para jugar a este juego.</p>
        <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
      </div>
    );
  }

  if (isGameOver) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
            <h2 className="text-2xl font-bold text-primary">Lluvia de Emociones</h2>
            <p className="text-lg my-2">¡Juego terminado!</p>
            <p className="text-5xl font-bold mb-6">{score}</p>
            <p className="text-muted-foreground mb-6 -mt-4">puntos</p>
            <Button onClick={startGame} size="lg">
              <RotateCw className="mr-2" />
              Jugar de Nuevo
            </Button>
          </div>
      )
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
        <h2 className="text-2xl font-bold text-primary">Lluvia de Emociones</h2>
        <p className="text-muted-foreground my-4 max-w-md">El objetivo es hacer clic en el emoji que corresponde a la emoción que se te pide. La velocidad y la cantidad aumentarán con cada acierto. Tienes {MAX_LIVES} vidas.</p>
        <Button onClick={startGame} size="lg">
          <Play className="mr-2" />
          Empezar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
       <div className="w-full max-w-[500px] flex justify-between items-center text-lg font-semibold px-2">
           <p>Puntuación: <span className="text-primary">{score}</span></p>
           <p>Vidas: <span className="text-destructive text-xl md:text-2xl">{'❤️'.repeat(Math.max(0, lives))}</span></p>
       </div>

       <div 
         className="relative bg-muted/20 rounded-lg overflow-hidden border-2 w-full max-w-[500px] h-[400px]"
       >
         {drops.map(drop => (
           <div
             key={drop.id}
             className="absolute text-3xl md:text-4xl cursor-pointer hover:scale-110 transition-transform"
             style={{ 
                 left: drop.x, 
                 top: drop.y, 
                 textShadow: `0 0 8px ${drop.emotion.color}90`,
             }}
             onClick={() => handleDropClick(drop.id)}
           >
             {drop.emotion.icon}
           </div>
         ))}
       </div>

        <div className="text-center p-4 rounded-lg bg-muted/50 w-full max-w-[500px]">
            <p className="text-muted-foreground text-sm md:text-base">Busca esta emoción:</p>
            <p className="text-xl md:text-2xl font-bold text-primary flex items-center justify-center gap-2">
                <span>{targetEmotion?.icon}</span>
                <span>{targetEmotion?.name}</span>
            </p>
        </div>
    </div>
  );
}
```

### `/src/app/components/games/guess-emotion-game.tsx`
**Propósito:** Componente para el juego de adivinar la emoción a partir de una situación.
```tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion, GameProps, QuizQuestion } from '@/lib/types';
import { QUIZ_QUESTIONS, PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Zap } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length;
  let randomIndex;
  const newArray = [...array];

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
};

const difficulties: QuizQuestion['difficulty'][] = ['Fácil', 'Medio', 'Difícil', 'Experto'];
const QUESTIONS_PER_GAME = 10;

export function GuessEmotionGame({ emotionsList }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const allUserEmotions = useMemo(() => {
    const emotionMap = new Map<string, Emotion>();
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);
  
  const allPredefinedEmotions = useMemo(() => {
      return PREDEFINED_EMOTIONS.map(p => ({ ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
  }, []);


  const generateQuestion = useCallback(() => {
    const currentDifficulty = difficulties[difficultyIndex];
    
    let possibleQuestions = QUIZ_QUESTIONS.filter(q => {
        const difficultyMatch = q.difficulty === currentDifficulty;
        const answerExists = allPredefinedEmotions.some(e => e.name.toLowerCase() === q.correctAnswer.toLowerCase());
        const notInHistory = !questionHistory.includes(q.question);
        return difficultyMatch && answerExists && notInHistory;
    });

    if (possibleQuestions.length === 0) {
        possibleQuestions = QUIZ_QUESTIONS.filter(q => {
             const difficultyMatch = q.difficulty === currentDifficulty;
             const answerExists = allPredefinedEmotions.some(e => e.name.toLowerCase() === q.correctAnswer.toLowerCase());
             return difficultyMatch && answerExists;
        });
        setQuestionHistory([]); // Reset history if we ran out of unique questions
    }
    
    if (possibleQuestions.length === 0) {
        console.error("No valid quiz questions could be generated.");
        setCurrentQuestion(null);
        return;
    }

    const randomQuestion = shuffleArray(possibleQuestions)[0];
    const correctEmotion = allPredefinedEmotions.find(e => e.name.toLowerCase() === randomQuestion.correctAnswer.toLowerCase());

    if (!correctEmotion) {
        console.error(`Could not find correct emotion "${randomQuestion.correctAnswer}" in predefined list.`);
        generateQuestion();
        return;
    }

    const incorrectOptions = shuffleArray(allUserEmotions.filter(e => e.name.toLowerCase() !== correctEmotion.name.toLowerCase())).slice(0, 3);
    const allOptions = shuffleArray([correctEmotion, ...incorrectOptions]);

    setCurrentQuestion(randomQuestion);
    setOptions(allOptions);
    setIsAnswered(false);
    setSelectedAnswer(null);

    setQuestionHistory(prev => [...prev, randomQuestion.question]);

  }, [difficultyIndex, allUserEmotions, allPredefinedEmotions, questionHistory]);


  useEffect(() => {
    if (isPlaying && questionsAnswered < QUESTIONS_PER_GAME) {
      generateQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsAnswered, isPlaying]);

  const handleAnswer = (answer: Emotion) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer.name.toLowerCase() === currentQuestion?.correctAnswer.toLowerCase()) {
      setScore(prev => prev + 1);
      setDifficultyIndex(prev => Math.min(prev + 1, difficulties.length - 1));
    } else {
      setDifficultyIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => {
    setQuestionsAnswered(prev => prev + 1);
  };

  const startGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setDifficultyIndex(0);
    setQuestionHistory([]);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsPlaying(true);
  };
  
  if (allUserEmotions.length < 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Faltan Emociones!</p>
              <p className="max-w-md">Necesitas al menos 4 emociones diferentes para jugar a este juego.</p>
              <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
          </div>
      )
  }

  if (!isPlaying) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
            <h2 className="text-2xl font-bold text-primary">Adivina la Emoción</h2>
            <p className="text-muted-foreground my-4 max-w-md">Lee la situación y elige la emoción que mejor la describe. ¡Demuestra tu inteligencia emocional!</p>
            {questionsAnswered >= QUESTIONS_PER_GAME && (
                <>
                    <p className="text-lg my-2">¡Partida terminada!</p>
                    <p className="text-5xl font-bold mb-6">{score} / {QUESTIONS_PER_GAME}</p>
                </>
            )}
            <Button onClick={startGame} size="lg">
                <Zap className="mr-2" />
                {questionsAnswered >= QUESTIONS_PER_GAME ? 'Jugar de Nuevo' : 'Empezar'}
            </Button>
        </div>
    );
  }
  
  if (questionsAnswered >= QUESTIONS_PER_GAME) {
    setIsPlaying(false);
    return null; // Will be re-rendered into the start screen
  }
  
  if (!currentQuestion) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">Cargando...</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center w-full max-w-2xl">
        <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
            <p className="text-sm font-semibold text-accent">Dificultad: {currentQuestion.difficulty}</p>
        </div>
        <p className="text-lg mt-4">¿Qué emoción describe mejor esta situación?</p>
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          <blockquote className="text-lg md:text-xl italic font-semibold">
            "{currentQuestion?.question}"
          </blockquote>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option) => {
            const isCorrect = option.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
            const isSelected = selectedAnswer?.name === option.name;

            return (
                 <Button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={cn(
                        "h-auto py-3 md:py-4 text-sm md:text-base whitespace-normal",
                        isAnswered && isCorrect && 'bg-green-500 hover:bg-green-600 border-green-500 text-white',
                        isAnswered && isSelected && !isCorrect && 'bg-destructive hover:bg-destructive/90 border-destructive text-destructive-foreground',
                        isAnswered && !isSelected && !isCorrect && 'opacity-50'
                    )}
                 >
                    {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 h-5 w-5" />}
                    {isAnswered && isCorrect && <CheckCircle className="mr-2 h-5 w-5" />}
                    {option.icon} {option.name}
                 </Button>
            );
        })}
      </div>

      {isAnswered && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
             <p className={cn(
                "text-lg font-bold text-center",
                selectedAnswer?.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? '¡Correcto!' : `Incorrecto. La respuesta era: ${currentQuestion.correctAnswer}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= QUESTIONS_PER_GAME -1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
```

### `/src/app/components/games/quick-journal-game.tsx`
**Propósito:** Componente para el juego de "Diario Rápido".
```tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Zap, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { EMOTION_BONUS_WORDS } from '@/lib/constants';

const GAME_DURATION = 45; // seconds
const TIME_BONUS = 3; // seconds

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function QuickJournalGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [bonusWord, setBonusWord] = useState<string>('');
  const [thought, setThought] = useState('');
  const [showTimeBonus, setShowTimeBonus] = useState(false);
  const timerRef = useRef<number | null>(null);

  const availableEmotions = useMemo(() => {
    // Filter emotions that have bonus words available
    return emotionsList.filter(e => EMOTION_BONUS_WORDS[e.name]);
  }, [emotionsList]);

  const selectNewTarget = useCallback(() => {
    if (availableEmotions.length === 0) return;
    
    let nextEmotion = shuffleArray(availableEmotions)[0];
    // Avoid picking the same emotion twice in a row if possible
    if (nextEmotion.id === targetEmotion?.id && availableEmotions.length > 1) {
      nextEmotion = shuffleArray(availableEmotions.filter(e => e.id !== targetEmotion.id))[0];
    }
    
    setTargetEmotion(nextEmotion);
    const possibleWords = EMOTION_BONUS_WORDS[nextEmotion.name];
    setBonusWord(shuffleArray(possibleWords)[0]);
  }, [availableEmotions, targetEmotion]);

  const stopTimer = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
  }

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft <= 0) {
      setIsPlaying(false);
      stopTimer();
    }
    return stopTimer;
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setThought('');
    selectNewTarget();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought) return;

    if (thought.toLowerCase().includes(bonusWord.toLowerCase())) {
        setTimeLeft(prev => prev + TIME_BONUS);
        setShowTimeBonus(true);
        setTimeout(() => setShowTimeBonus(false), 1000);
    }

    setScore(score + 1);
    setThought('');
    selectNewTarget();
  };

  if (availableEmotions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold">¡Faltan Emociones!</p>
            <p className="max-w-md">Necesitas al menos 1 emoción con palabras clave para jugar.</p>
             <p className="text-sm mt-2">Asegúrate de tener emociones como 'Alegría', 'Tristeza', etc. desde la sección "Descubrir".</p>
        </div>
    )
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
        <h2 className="text-2xl font-bold text-primary">Diario Rápido</h2>
        {score > 0 ? (
          <>
            <p className="text-lg my-2">¡Juego terminado!</p>
            <p className="text-5xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground mb-6">entradas registradas.</p>
          </>
        ) : (
          <p className="text-muted-foreground my-4 max-w-md">El objetivo es escribir un pensamiento rápido sobre la emoción que aparece. Si usas la "Palabra Clave", ¡ganas tiempo extra! Anota tantos como puedas.</p>
        )}
        <Button onClick={startGame} size="lg">
          <Zap className="mr-2" />
          {score > 0 ? 'Jugar de Nuevo' : 'Empezar'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex justify-between items-center w-full px-2 relative">
          <p className="text-lg font-semibold text-primary">Puntuación: {score}</p>
          <div className="flex items-center gap-2 text-xl font-bold text-destructive">
            <Timer />
            <span>{timeLeft}s</span>
          </div>
           {showTimeBonus && (
            <div className="absolute right-0 -top-8 flex items-center gap-1 text-green-500 font-bold animate-fade-in-up">
                <Sparkles className="h-5 w-5" />
                <span>+{TIME_BONUS}s</span>
            </div>
           )}
        </div>
        <Progress value={(timeLeft / GAME_DURATION) * 100} className="w-full h-2" />
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          {targetEmotion ? (
            <div className="text-2xl md:text-3xl font-bold flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-5xl">{targetEmotion.icon}</span>
                <span>{targetEmotion.name}</span>
              </div>
              <div className="text-base md:text-lg mt-2 font-normal text-muted-foreground">
                Palabra clave: <span className="font-bold text-accent">{bonusWord}</span>
              </div>
            </div>
          ) : (
             <p>Cargando emoción...</p>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <Input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Escribe un pensamiento que incluya la palabra clave..."
          className="text-base md:text-lg h-12 text-center"
          required
          autoFocus
        />
        <Button type="submit" className="w-full" disabled={!thought}>
          Registrar y Siguiente
        </Button>
      </form>
    </div>
  );
}
```

### `/src/app/components/modals/add-emotion-modal.tsx`
**Propósito:** Modal para añadir una emoción predefinida al emocionario del usuario, permitiendo personalización.
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Emotion } from '@/lib/types';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface AddEmotionModalProps {
  initialData: (Partial<Emotion>) | null;
  onSave: (emotionData: Omit<Emotion, 'id' | 'userId'> & { id?: string }) => void;
  onClose: () => void;
}

export function AddEmotionModal({ initialData, onSave, onClose }: AddEmotionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#47a2a2');
  const [icon, setIcon] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setColor(initialData.color || '#47a2a2');
      setIcon(initialData.icon || '');
    } else {
      // Reset form when modal is closed
      setName('');
      setDescription('');
      setColor('#47a2a2');
      setIcon('');
    }
  }, [initialData]);

  const handleSave = () => {
    if (!name || !icon) {
        toast({
            title: "Faltan campos",
            description: "Asegúrate de que la emoción tenga un nombre y un icono.",
            variant: "destructive",
        });
        return;
    }
    if (!initialData) return;
    
    const dataToSave = {
        name,
        icon,
        description,
        color,
        isCustom: initialData.isCustom ?? true,
    };

    onSave(dataToSave);
    onClose();
  };

  if (!initialData) return null;

  return (
    <Dialog open={!!initialData} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color }}>
            <span className="text-3xl">{icon || initialData.icon}</span>
            Añadir "{name || initialData.name}"
          </DialogTitle>
          <DialogDescription>
            Personaliza esta emoción antes de añadirla a tu emocionario.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la emoción"
            />
           <div>
                <label className="text-sm font-medium">Icono (emoji)</label>
                <ScrollArea className="h-40">
                  <div className="grid grid-cols-8 gap-2 mt-2 bg-muted/50 p-2 rounded-lg">
                    {AVATAR_EMOJIS.map((emoji, index) => (
                        <button
                            type="button"
                            key={`${emoji}-${index}`}
                            onClick={() => setIcon(emoji)}
                            className={cn(
                                'text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                                icon === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                            )}
                        >
                            {emoji}
                        </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué significa esta emoción para ti?"
            rows={4}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="emotion-color-modal" className="text-sm font-medium">Elige un color:</label>
            <Input
              id="emotion-color-modal"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Guardar en mi Emocionario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### `/src/app/components/modals/quiz-modal.tsx`
**Propósito:** Modal que contiene el cuestionario para recuperar un día perdido en la racha.
```tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '@/lib/constants';
import type { QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizModalProps {
  onClose: () => void;
  onComplete: (success: boolean) => void;
}

const QUESTIONS_PER_QUIZ = 5;
const REQUIRED_SCORE = 3;

// Function to get a random item from an array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function QuizModal({ onClose, onComplete }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Generate a unique set of questions for the quiz
    const difficulties: QuizQuestion['difficulty'][] = ['Fácil', 'Medio', 'Difícil', 'Experto'];
    const selectedQuestions: QuizQuestion[] = [];
    const usedIndexes = new Set<number>();

    // Add one extra question to reach 5 total
    const allDifficulties = [...difficulties, 'Medio']; 

    allDifficulties.forEach(difficulty => {
      const questionsOfDifficulty = QUIZ_QUESTIONS.map((q, i) => ({ ...q, originalIndex: i })).filter(q => q.difficulty === difficulty);
      let question;
      do {
        question = getRandomItem(questionsOfDifficulty);
      } while (question && usedIndexes.has(question.originalIndex));
      
      if(question) {
        selectedQuestions.push(question);
        usedIndexes.add(question.originalIndex);
      }
    });

    setQuestions(selectedQuestions);
  }, []);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      // Quiz finished
      onComplete(score >= REQUIRED_SCORE);
    }
  };
  
  if (questions.length === 0) {
    return <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center">Cargando desafío...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  
  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-primary">Desafío de Recuperación</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <CardDescription>Responde {REQUIRED_SCORE} de {QUESTIONS_PER_QUIZ} preguntas correctamente para recuperar el día.</CardDescription>
          <div className="flex items-center gap-4 pt-2">
             <Progress value={progress} className="w-full" />
             <span className="text-sm font-semibold text-muted-foreground">{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold">{currentQuestion.question}</p>
            <p className="text-sm text-muted-foreground font-semibold" style={{ color: `hsl(var(--accent))` }}>Dificultad: {currentQuestion.difficulty}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map(option => {
                const isSelected = selectedAnswer === option;
                const isTheCorrectAnswer = currentQuestion.correctAnswer === option;

                return (
                    <Button
                        key={option}
                        variant={isAnswered && (isSelected || isTheCorrectAnswer) ? 'default' : 'outline'}
                        className={cn(
                            "h-auto py-3 whitespace-normal justify-start text-left",
                            isAnswered && isTheCorrectAnswer && 'bg-green-500 hover:bg-green-600 border-green-500 text-white',
                            isAnswered && isSelected && !isTheCorrectAnswer && 'bg-destructive hover:bg-destructive/90 border-destructive text-destructive-foreground',
                            isAnswered && !isSelected && !isTheCorrectAnswer && 'opacity-50'
                        )}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                    >
                         {isAnswered && isSelected && !isTheCorrectAnswer && <XCircle className="mr-2 h-5 w-5" />}
                         {isAnswered && isTheCorrectAnswer && <CheckCircle className="mr-2 h-5 w-5" />}
                        {option}
                    </Button>
                )
            })}
          </div>
        </CardContent>
        <CardFooter>
            {isAnswered && (
                <div className="w-full flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                    <p className={cn("text-lg font-bold", isCorrect ? 'text-green-600' : 'text-destructive')}>
                        {isCorrect ? '¡Correcto!' : `Incorrecto. La respuesta era: ${currentQuestion.correctAnswer}`}
                    </p>
                    <Button onClick={handleNext} className="w-full sm:w-auto ml-auto">
                        {currentQuestionIndex === questions.length - 1 ? 'Finalizar Desafío' : 'Siguiente Pregunta'}
                    </Button>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
```

### `/src/app/components/tour/tour-popup.tsx`
**Propósito:** Componente que muestra el popup del tour guiado, resaltando elementos de la UI.
```tsx
"use client";

import React, { useLayoutEffect, useRef, useState, RefObject, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TourStepData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface TourPopupProps {
  step: number;
  steps: TourStepData[];
  refs: { [key: string]: RefObject<HTMLElement> };
  onNext: () => void;
  onSkip: () => void;
}

export function TourPopup({ step, steps, refs, onNext, onSkip }: TourPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const { isMobile, setOpenMobile, openMobile } = useSidebar();
  const animationFrameId = useRef<number>();

  const calculateAndSetPosition = (retries = 0) => {
    if (step === 0) {
      setPosition({ top: 0, left: 0, width: 0, height: 0 });
      return;
    }
  
    const currentStepData = steps[step - 1];
    if (!currentStepData) return;
  
    const targetRef = refs[currentStepData.refKey];
    const targetElement = targetRef?.current;
  
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      
      // On mobile, the collapsed item width is small. We wait for it to expand.
      // An expanded item will be much wider than 60px.
      if (isMobile && rect.width < 60 && retries < 15) {
        animationFrameId.current = requestAnimationFrame(() => calculateAndSetPosition(retries + 1));
        return;
      }
  
      if (rect.width > 0 && rect.height > 0) {
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
  
        const popupElement = popupRef.current;
        if (popupElement) {
          const popupRect = popupElement.getBoundingClientRect();
          let top = rect.bottom + 16;
          let left = rect.left + rect.width / 2 - popupRect.width / 2;
  
          if (top + popupRect.height > window.innerHeight) {
            top = rect.top - popupRect.height - 16;
          }
  
          if (left < 16) left = 16;
          if (left + popupRect.width > window.innerWidth - 16) {
            left = window.innerWidth - popupRect.width - 16;
          }
  
          setPopupPosition({ top, left });
        }
      } else if (retries < 15) {
        animationFrameId.current = requestAnimationFrame(() => calculateAndSetPosition(retries + 1));
      }
    } else if (retries < 15) {
      animationFrameId.current = requestAnimationFrame(() => calculateAndSetPosition(retries + 1));
    }
  };

  useEffect(() => {
    // Cleanup any pending animation frame on unmount or before re-running
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    if (step === 0) {
      setPosition({ top: 0, left: 0, width: 0, height: 0 });
      return;
    }

    const currentStepData = steps[step - 1];
    if (!currentStepData) return;

    if (isMobile && !openMobile && refs[currentStepData.refKey]) {
      setOpenMobile(true);
      // The effect will re-run because openMobile changes, so we wait.
      return;
    }
    
    // Start trying to calculate position
    calculateAndSetPosition();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isMobile, openMobile]);


  const handleNext = () => {
    onNext();
  };

  const handleSkip = () => {
    onSkip();
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (step === 0 || !steps[step - 1] || position.width === 0) {
    return null;
  }

  const { title, description } = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50 z-0 pointer-events-auto" onClick={handleSkip}></div>
      
      {/* Highlight Box */}
      <div
        className="fixed transition-all duration-300 ease-in-out border-2 border-accent rounded-lg bg-background/20"
        style={{
          top: `${position.top - 4}px`,
          left: `${position.left - 4}px`,
          width: `${position.width + 8}px`,
          height: `${position.height + 8}px`,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      />

      {/* Popup Content */}
      <div
        ref={popupRef}
        className={cn(
          "fixed bg-card text-card-foreground p-4 rounded-lg shadow-2xl w-72 transition-all duration-300 ease-in-out pointer-events-auto",
          position.width === 0 ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          top: `${popupPosition.top}px`,
          left: `${popupPosition.left}px`,
          zIndex: 2,
        }}
      >
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-between mt-4">
          <Button variant="ghost" onClick={handleSkip}>Saltar</Button>
          <Button onClick={() => {
            if (step === steps.length) {
              handleSkip();
            } else {
              handleNext();
            }
          }} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {step === steps.length ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### `/src/app/components/tour/welcome-dialog.tsx`
**Propósito:** Diálogo de bienvenida para nuevos usuarios, ofreciendo iniciar el tour guiado.
```tsx
"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface WelcomeDialogProps {
    open: boolean;
    onStartTour: () => void;
    onSkipTour: () => void;
}

export function WelcomeDialog({ open, onStartTour, onSkipTour }: WelcomeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkipTour()}>
            <DialogContent className="sm:max-w-[425px]" hideCloseButton>
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-center text-center gap-2 text-2xl">
                        <Sparkles className="w-10 h-10 text-accent" />
                        ¡Te damos la bienvenida a Diario de Emociones!
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Esta es una herramienta para ayudarte a entender y registrar tus emociones.
                        ¿Te gustaría hacer un tour rápido para conocer las funciones principales?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center pt-4 flex-row gap-2">
                    <Button type="button" variant="ghost" onClick={onSkipTour}>
                        Saltar Tour
                    </Button>
                    <Button type="button" onClick={onStartTour} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Empezar Tour
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

### `/src/app/components/views/calm-view.tsx`
**Propósito:** Vista que proporciona ejercicios de respiración guiados visualmente.
```tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathMode = 'circle' | 'square' | '4-7-8';

interface BreathStep {
  text: string;
  duration: number;
  animation: string;
  gradient: string;
}

const breathCycles: Record<BreathMode, BreathStep[]> = {
  circle: [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in', gradient: 'from-primary/70 to-blue-300/70' },
    { text: 'Exhala', duration: 6000, animation: 'animate-breathe-out', gradient: 'from-accent/70 to-pink-300/70' },
  ],
  square: [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in', gradient: 'from-primary/70 to-blue-300/70' },
    { text: 'Sostén', duration: 4000, animation: 'animate-breathe-hold', gradient: 'from-purple-400/70 to-indigo-400/70' },
    { text: 'Exhala', duration: 4000, animation: 'animate-breathe-out', gradient: 'from-accent/70 to-pink-300/70' },
    { text: 'Sostén', duration: 4000, animation: 'animate-breathe-hold', gradient: 'from-purple-400/70 to-indigo-400/70' },
  ],
  '4-7-8': [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in-triangle', gradient: 'from-primary/70 to-blue-300/70' },
    { text: 'Sostén', duration: 7000, animation: 'animate-breathe-hold', gradient: 'from-purple-400/70 to-indigo-400/70' },
    { text: 'Exhala', duration: 8000, animation: 'animate-breathe-out-triangle', gradient: 'from-accent/70 to-pink-300/70' },
  ],
};

const PREP_TIME = 3000;
const PREP_GRADIENT = 'from-gray-400/70 to-gray-500/70';

export function CalmView() {
  const [mode, setMode] = useState<BreathMode>('circle');
  const [currentStep, setCurrentStep] = useState<BreathStep | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Interval | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const cleanupTimers = () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };

    cleanupTimers();
    setIsPreparing(true);
    setCurrentStep(null);
    setCountdown(PREP_TIME / 1000);

    const prepInterval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    
    const initialTimeout = setTimeout(() => {
      clearInterval(prepInterval);
      setIsPreparing(false);
      let cycleIndex = -1;
      const cycle = breathCycles[mode];

      const runCycle = () => {
        cycleIndex = (cycleIndex + 1) % cycle.length;
        const step = cycle[cycleIndex];
        
        setCurrentStep(step);
        let counter = 1;
        setCountdown(counter);

        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          if(counter < (step.duration / 1000)) {
            counter++;
            setCountdown(counter);
          }
        }, 1000);
        
        stepTimeoutRef.current = setTimeout(() => {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          runCycle();
        }, step.duration);
      };
      runCycle();
    }, PREP_TIME);

    return () => {
      cleanupTimers();
      clearInterval(prepInterval);
      clearTimeout(initialTimeout);
    };
  }, [mode, isClient]);

  const animationStyle = {
    animationName: currentStep?.animation.replace('animate-',''),
    animationDuration: currentStep ? `${currentStep.duration}ms` : 'none',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    animationFillMode: 'forwards',
  } as React.CSSProperties;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Rincón de la Calma</h1>
        <p className="text-muted-foreground mt-2">Elige un ejercicio de respiración y sigue al guía visual.</p>
      </div>

      <div className="flex gap-2 p-1 bg-primary/10 rounded-full mb-12">
        {(['circle', 'square', '4-7-8'] as BreathMode[]).map((m) => (
          <Button
            key={m}
            onClick={() => setMode(m)}
            variant={mode === m ? 'default' : 'ghost'}
            className={cn(mode === m ? 'bg-primary' : 'text-primary', 'capitalize rounded-full')}
          >
            {m === 'circle' ? 'Círculo' : m === 'square' ? 'Cuadrada' : '4-7-8'}
          </Button>
        ))}
      </div>
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <div 
          className={cn(
            "w-full h-full bg-gradient-to-br transition-all duration-1000",
            isPreparing ? PREP_GRADIENT : currentStep?.gradient,
            mode === 'circle' && 'rounded-full',
            mode === 'square' && 'rounded-3xl',
            mode === '4-7-8' && 'shape-triangle',
            'shadow-2xl shadow-primary/20'
          )}
          style={!isPreparing ? animationStyle : {}}
        >
        </div>
         <div className="absolute text-center text-white/90">
            {isPreparing ? (
              <>
                <p className="text-xl">Prepárate...</p>
                <p className="text-5xl font-bold font-mono mt-2">{countdown}</p>
              </>
            ) : (
              <>
                <p className="text-4xl font-semibold">
                    {currentStep ? currentStep.text : "..."}
                </p>
                {currentStep && (
                    <p className="text-2xl font-mono mt-2">{countdown}</p>
                )}
              </>
            )}
          </div>
      </div>
    </div>
  );
}
```

### `/src/app/components/views/diary-view.tsx`
**Propósito:** Vista principal para crear, ver, editar y eliminar entradas del diario.
```tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DiaryEntry, Emotion, View } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { suggestCalmingExercise } from '@/ai/flows/suggest-calming-exercise';
import { Edit, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

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

  useEffect(() => {
    if (editingEntry) {
        // When editing, parse the ISO string and format it to YYYY-MM-DD for the input
        const entryDate = new Date(editingEntry.date);
        const formattedDate = entryDate.toISOString().split('T')[0];
        setDate(formattedDate);
        setSelectedEmotionId(editingEntry.emotionId);
        setText(editingEntry.text);
        
        // Scroll the form into view
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else {
        // When not editing, reset to default values
        resetForm();
    }
  }, [editingEntry]);


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
    
    // Ensure the date is treated as UTC to avoid timezone shifts
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
        {/* Columna del formulario */}
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
                  <div className="grid sm:grid-cols-2 gap-4">
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
                        <Label htmlFor="entry-emotion">Emoción</Label>
                        <Select value={selectedEmotionId} onValueChange={setSelectedEmotionId} required>
                            <SelectTrigger id="entry-emotion" className="w-full">
                            <SelectValue placeholder="Elige una emoción" />
                            </SelectTrigger>
                            <SelectContent>
                            {emotionsList.map((emotion) => (
                                <SelectItem key={emotion.id} value={emotion.id}>
                                <div className="flex items-center gap-2">
                                    <span>{emotion.icon}</span>
                                    <span>{emotion.name}</span>
                                </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col">
                    <Label htmlFor="entry-text">¿Qué pasó hoy?</Label>
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
                    <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                      {editingEntry ? 'Guardar Cambios' : 'Guardar Entrada'}
                    </Button>
                  </div>
                </form>
              )}
          </CardContent>
        </Card>

        {/* Columna de las entradas */}
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
                      <Card key={entry.id} className="p-4 group relative overflow-hidden">
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
      
      <AlertDialog open={!!aiSuggestion || isSuggestionLoading}>
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
              <AlertDialogAction onClick={() => setAiSuggestion('')} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Entendido
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### `/src/app/components/views/discover-view.tsx`
**Propósito:** Vista para explorar y añadir emociones predefinidas.
```tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';
import { PREDEFINED_EMOTIONS } from '@/lib/constants';
import type { Emotion } from '@/lib/types';

interface DiscoverViewProps {
  onAddPredefinedEmotion: (emotionData: Omit<Emotion, 'id' | 'userId'>) => void;
}

export function DiscoverView({ onAddPredefinedEmotion }: DiscoverViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Descubrir Emociones</CardTitle>
        <CardDescription>Explora nuevas emociones y añádelas a tu propio emocionario para un seguimiento más detallado.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREDEFINED_EMOTIONS.map((emotion) => (
              <Card key={emotion.name} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{emotion.icon}</span>
                    <CardTitle className="text-xl text-primary">{emotion.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-2">{emotion.description}</p>
                  <p className="text-sm text-muted-foreground italic">"{emotion.example}"</p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                    <Button 
                        onClick={() => onAddPredefinedEmotion({ 
                          name: emotion.name, 
                          icon: emotion.icon, 
                          description: `${emotion.description} Ejemplo: "${emotion.example}"`,
                          color: emotion.color,
                          isCustom: false,
                        })}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
```

### `/src/app/components/views/emocionario-view.tsx`
**Propósito:** Vista para gestionar el "Emocionario" del usuario, permitiendo crear, editar y eliminar emociones.
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Emotion } from '@/lib/types';
import { Sparkles, Loader, Trash2, Edit, Wand2 } from 'lucide-react';
import { defineEmotionMeaning } from '@/ai/flows/define-emotion-meaning';
import { validateEmotion } from '@/ai/flows/validate-emotion';
import { useToast } from '@/hooks/use-toast';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EmocionarioViewProps {
  emotionsList: Emotion[];
  addEmotion: (emotion: Omit<Emotion, 'id' | 'userId'> & { id?: string }) => void;
  onEditEmotion: (emotion: Emotion) => void;
  onDeleteEmotion: (emotionId: string) => void;
  editingEmotion: Emotion | null;
  onCancelEdit: () => void;
}

export function EmocionarioView({ emotionsList, addEmotion, onEditEmotion, onDeleteEmotion, editingEmotion, onCancelEdit }: EmocionarioViewProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#8B5CF6');
  const [description, setDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setIcon('');
    setColor('#8B5CF6');
    setDescription('');
  }

  useEffect(() => {
    if (editingEmotion) {
      setName(editingEmotion.name);
      setIcon(editingEmotion.icon);
      setColor(editingEmotion.color);
      setDescription(editingEmotion.description || '');
    } else {
      resetForm();
    }
  }, [editingEmotion]);

  const handleGenerateDescription = async () => {
    if (!name) {
      toast({ title: "Falta el nombre", description: "Por favor, introduce un nombre para la emoción.", variant: "destructive" });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await defineEmotionMeaning({ emotion: name });
      if (result.includeDetails) {
        setDescription(`${result.definition} Ejemplo: ${result.example}`);
      } else {
        setDescription(result.definition);
      }
    } catch (error) {
      console.error("Error generating description:", error);
      toast({ title: "Error de IA", description: "No se pudo generar una descripción.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon || !color) {
      toast({ title: "Faltan campos", description: "Asegúrate de que la emoción tenga un nombre y un icono.", variant: "destructive" });
      return;
    };

    setIsSaving(true);
    try {
      const validationResult = await validateEmotion({ emotion: name });
      if (!validationResult.isValid) {
        toast({
          title: "Emoción no válida",
          description: `"${name}" no parece ser una emoción. ${validationResult.reason}`,
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const emotionData: Omit<Emotion, 'id' | 'userId'> & { id?: string } = {
        name,
        icon,
        color,
        description,
        isCustom: true, // Mark as custom when created from this form
      };
      
      if (editingEmotion) {
        emotionData.id = editingEmotion.id;
        // Preserve the original isCustom flag when editing
        emotionData.isCustom = editingEmotion.isCustom; 
      }
      
      addEmotion(emotionData);

      if (editingEmotion) {
        onCancelEdit();
      } else {
        resetForm();
      }
    } catch (error) {
      console.error("Error saving emotion:", error);
      toast({ title: "Error al guardar", description: "No se pudo validar o guardar la emoción.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <Card className="w-full shadow-lg flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: editingEmotion ? color : 'var(--primary)' }}>
            {editingEmotion ? 'Editar Emoción' : 'Añadir Emoción'}
          </CardTitle>
          <CardDescription>{editingEmotion ? `Modificando "${editingEmotion.name}"` : 'Crea una nueva emoción para tu diario.'}</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 md:gap-6 items-start">
              <div className="space-y-4">
                <Input
                  placeholder="Nombre de la Emoción (ej. Euforia)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="relative">
                  <Textarea
                    placeholder="¿Qué significa esta emoción para ti?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-primary hover:bg-primary/10"
                    onClick={handleGenerateDescription}
                    disabled={isAiLoading}
                  >
                    {isAiLoading ? <Loader className="animate-spin" /> : <Sparkles />}
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                 <div>
                    <ScrollArea className="h-32 md:h-40 w-full">
                      <div className="grid grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50">
                        {AVATAR_EMOJIS.map((emoji, index) => (
                            <button
                                type="button"
                                key={`${emoji}-${index}`}
                                onClick={() => setIcon(emoji)}
                                className={cn(
                                    'text-2xl md:text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                                    icon === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                                )}
                            >
                                {emoji}
                            </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="emotion-color" className="text-sm font-medium">Color:</label>
                        <Input
                        id="emotion-color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-16 h-10 p-1"
                        />
                    </div>
                    <div className="flex-grow flex gap-2 w-full">
                        {editingEmotion && (
                        <Button type="button" variant="outline" onClick={onCancelEdit} className="w-full">
                            Cancelar
                        </Button>
                        )}
                        <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" disabled={isSaving}>
                          {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          {isSaving ? (editingEmotion ? 'Actualizando...' : 'Añadiendo...') : (editingEmotion ? 'Actualizar' : 'Añadir')}
                        </Button>
                    </div>
                 </div>
              </div>
            </form>
        </CardContent>
      </Card>
      <Card className="w-full shadow-lg flex flex-col flex-grow min-h-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Tu Emocionario</CardTitle>
          <CardDescription>Las emociones que has añadido.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {emotionsList.length > 0 ? (
                emotionsList.map((em) => (
                  <Card key={em.id} className="group relative w-full overflow-hidden" style={{borderLeft: `4px solid ${em.color}`}}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl mt-1">{em.icon}</span>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-foreground truncate">{em.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{em.description || 'Sin descripción'}</p>
                        </div>
                        {em.isCustom && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="absolute top-2 right-2 bg-accent text-accent-foreground p-1 rounded-full">
                                  <Wand2 className="h-3 w-3" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Emoción Personalizada</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="absolute top-0 right-0 bottom-0 flex items-center justify-end gap-1 p-2 bg-gradient-to-l from-card via-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditEmotion(em)}>
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la emoción y todas las entradas del diario asociadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteEmotion(em.id)}>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <p>Tu emocionario está esperando a que lo llenes.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
```

### `/src/app/components/views/games-view.tsx`
**Propósito:** Vista que contiene la selección de juegos de inteligencia emocional.
```tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GuessEmotionGame } from '../games/guess-emotion-game';
import type { Emotion } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Puzzle, Feather, Contrast, CloudRain } from 'lucide-react';
import { EmotionMemoryGame } from '../games/emotion-memory-game';
import { QuickJournalGame } from '../games/quick-journal-game';
import { AntonymGame } from '../games/antonym-game';
import { EmotionRainGame } from '../games/emotion-rain-game';

interface GamesViewProps {
  emotionsList: Emotion[];
}

export function GamesView({ emotionsList }: GamesViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Juegos de Emociones</CardTitle>
        <CardDescription>Pon a prueba tus conocimientos y agudiza tu inteligencia emocional de una forma divertida.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs defaultValue="guess-emotion" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger value="guess-emotion" className="py-2">
              <Puzzle className="mr-2 h-4 w-4" /> Adivina
            </TabsTrigger>
            <TabsTrigger value="memory" className="py-2">
              <Brain className="mr-2 h-4 w-4" /> Memoria
            </TabsTrigger>
            <TabsTrigger value="quick-journal" className="py-2">
              <Feather className="mr-2 h-4 w-4" /> Diario Rápido
            </TabsTrigger>
            <TabsTrigger value="antonyms" className="py-2">
              <Contrast className="mr-2 h-4 w-4" /> Antónimos
            </TabsTrigger>
             <TabsTrigger value="rain-game" className="py-2">
              <CloudRain className="mr-2 h-4 w-4" /> Lluvia
            </TabsTrigger>
          </TabsList>
          <TabsContent value="guess-emotion" className="flex-grow mt-4">
             <GuessEmotionGame emotionsList={emotionsList} />
          </TabsContent>
          <TabsContent value="memory" className="flex-grow mt-4">
            <EmotionMemoryGame emotionsList={emotionsList} />
          </TabsContent>
          <TabsContent value="quick-journal" className="flex-grow mt-4">
            <QuickJournalGame emotionsList={emotionsList} />
          </TabsContent>
          <TabsContent value="antonyms" className="flex-grow mt-4">
            <AntonymGame emotionsList={emotionsList} />
          </TabsContent>
          <TabsContent value="rain-game" className="flex-grow mt-4">
            <EmotionRainGame emotionsList={emotionsList} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

### `/src/app/components/views/login-view.tsx`
**Propósito:** Vista de inicio de sesión y registro.
```tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Google Icon SVG
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,34.627,44,29.692,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export default function LoginView() {
    const { toast } = useToast();
    const { auth } = useFirebase();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('login');

    const resetForm = () => {
        setEmail('');
        setPassword('');
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        resetForm();
    }

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // The user will be redirected to Google's sign-in page.
            // After successful sign-in, they will be redirected back here,
            // and the onAuthStateChanged listener will handle the app state.
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            if (error.code !== 'auth/popup-closed-by-user') {
                toast({
                    variant: 'destructive',
                    title: 'Error de Autenticación',
                    description: 'No se pudo iniciar el proceso de sesión con Google. Por favor, inténtalo de nuevo.',
                });
            }
        } finally {
             setIsSubmitting(false);
        }
    };

    const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // The onAuthStateChanged listener will handle the redirect
        } catch (error: any) {
             console.error("Sign-Up Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error de Registro',
                description: error.code === 'auth/email-already-in-use' ? 'Este correo electrónico ya está en uso.' : (error.message || 'No se pudo crear la cuenta.'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // The onAuthStateChanged listener will handle the redirect
        } catch (error: any) {
             console.error("Sign-In Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error al Iniciar Sesión',
                description: error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' ? 'Correo o contraseña incorrectos.' : (error.message || 'No se pudo iniciar sesión.'),
            });
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="flex items-center justify-center h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-gradient-slow z-0"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 z-0"></div>
            
            <Card className="w-full max-w-sm mx-auto z-10 bg-card/80 backdrop-blur-lg border-white/20 shadow-2xl animate-fade-in-up">
                <CardHeader className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-primary mx-auto" />
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-primary">Diario de Emociones</CardTitle>
                        <CardDescription>Tu espacio personal para crecer</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                   <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login"><LogIn className="mr-2"/> Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="signup"><UserPlus className="mr-2"/> Registrarse</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login" className="space-y-4 pt-4">
                        <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Correo</Label>
                                <Input id="login-email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Contraseña</Label>
                                <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting && activeTab === 'login' ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="signup" className="space-y-4 pt-4">
                         <form onSubmit={handleEmailPasswordSignUp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Correo</Label>
                                <Input id="signup-email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Contraseña</Label>
                                <Input id="signup-password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting && activeTab === 'signup' ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                        </div>
                    </div>
                     <Button variant="outline" onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full">
                        <GoogleIcon className="mr-2"/>
                        Google
                    </Button>
                </CardContent>
                 <CardFooter className="flex flex-col gap-4">
                    <p className="text-xs text-muted-foreground text-center">Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
```

### `/src/app/components/views/profile-view.tsx`
**Propósito:** Vista para que el usuario edite su nombre y avatar.
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile } from '@/lib/types';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: Partial<Omit<UserProfile, 'id'>>) => void;
}

export function ProfileView({ userProfile, setUserProfile }: ProfileViewProps) {
  // Local state to manage form fields, initialized from userProfile
  const [localName, setLocalName] = useState(userProfile?.name || '');
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || '');
  const [localAvatarType, setLocalAvatarType] = useState(userProfile?.avatarType || 'emoji');
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  // Effect to sync local state if the userProfile prop changes from Firestore
  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
    }
  }, [userProfile]);


  const handleSave = () => {
    if (!localName || !localAvatar) {
      toast({
        title: "Faltan campos",
        description: "Asegúrate de tener un nombre y un avatar seleccionados.",
        variant: "destructive",
      });
      return;
    }
    // This function now handles UPDATING the document in Firestore
    setUserProfile({ name: localName, avatar: localAvatar, avatarType: localAvatarType });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const selectAvatar = (avatar: string, type: 'emoji' | 'generated') => {
    setLocalAvatar(avatar);
    setLocalAvatarType(type);
  };

  if (!userProfile) {
    return (
        <Card className="w-full max-w-2xl mx-auto h-full shadow-lg flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-primary">Cargando perfil...</p>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6 overflow-hidden">
        <div className="space-y-2">
            <label className="text-sm font-medium">Tu Nombre</label>
            <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Usuario"
            />
        </div>

        <div className="flex-grow flex flex-col min-h-0 space-y-2">
            <label className="text-sm font-medium">Elige tu Avatar</label>
            <ScrollArea className="flex-grow rounded-lg border">
                <div className="grid grid-cols-8 gap-2 p-2">
                    {AVATAR_EMOJIS.map((emoji, index) => (
                        <button
                            type="button"
                            key={`${emoji}-${index}`}
                            onClick={() => selectAvatar(emoji, 'emoji')}
                            className={cn(
                                'text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                                localAvatar === emoji && localAvatarType === 'emoji' ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                            )}
                        >
                            {emoji}
                        </button>
                    ))}
                    {userProfile?.avatarType === 'generated' && userProfile?.avatar && (
                        <button onClick={() => selectAvatar(userProfile.avatar, 'generated')} className={cn('relative aspect-square rounded-lg overflow-hidden', localAvatar === userProfile.avatar && localAvatarType === 'generated' ? 'ring-2 ring-primary' : 'hover:opacity-80')}>
                            <Image src={userProfile.avatar} alt="Avatar generado por IA" fill sizes="64px"/>
                        </button>
                    )}
                </div>
            </ScrollArea>
        </div>
      
        <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-auto">
          {saved ? <Check className="mr-2 h-4 w-4" /> : null}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

### `/src/app/components/views/report-view.tsx`
**Propósito:** Vista que muestra un calendario visual de las emociones registradas.
```tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiaryEntry, Emotion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReportViewProps {
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
}

export function ReportView({ diaryEntries, emotionsList }: ReportViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 for Monday

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [startingDayOfWeek, daysInMonth]);
  
  const getEmotionById = (id: string) => (emotionsList || []).find(e => e.id === id);

  const getEntriesForDay = (day: number) => {
    return diaryEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getUTCFullYear() === currentDate.getFullYear() &&
        entryDate.getUTCMonth() === currentDate.getMonth() &&
        entryDate.getUTCDate() === day
      );
    });
  };

  const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft />
          </Button>
          <CardTitle className="text-2xl font-bold text-primary capitalize">
            {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center font-bold text-muted-foreground">
          {weekdays.map(day => <div key={day} className="text-xs md:text-sm">{day}</div>)}
        </div>
        <ScrollArea className="flex-grow mt-2">
            <div className="grid grid-cols-7 gap-1 md:gap-2">
            <TooltipProvider>
            {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;
                
                const dayEntries = getEntriesForDay(day);

                const today = new Date();
                const isToday = today.getFullYear() === currentDate.getFullYear() &&
                                today.getMonth() === currentDate.getMonth() &&
                                today.getDate() === day;
                
                const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                return (
                <Tooltip key={day} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div
                        className={cn(
                        "border rounded-lg p-1 md:p-2 flex flex-col items-center justify-between aspect-square overflow-hidden transition-all duration-200",
                        isToday && "ring-2 ring-primary",
                        dayEntries.length === 0 && isPast && "bg-muted/50",
                        dayEntries.length > 0 && "hover:scale-105 hover:shadow-md cursor-pointer",
                        )}
                        style={dayEntries.length > 0 ? { borderColor: getEmotionById(dayEntries[0].emotionId)?.color } : {}}
                    >
                        <span className={cn("font-bold self-start text-xs md:text-sm", dayEntries.length === 0 && 'text-muted-foreground')}>{day}</span>
                        
                        <div className="flex flex-col items-center justify-center flex-grow">
                          {dayEntries.length > 0 ? (
                            <span className="text-2xl md:text-4xl">{getEmotionById(dayEntries[0].emotionId)?.icon || '❓'}</span>
                          ) : (
                            isPast && <div className="w-2 h-2 rounded-full bg-muted-foreground/20"></div>
                          )}
                        </div>

                        <div className="h-4 flex items-end">
                           {dayEntries.length > 1 && (
                            <div className="flex space-x-1">
                              {dayEntries.slice(0, 3).map((entry, i) => (
                                <div key={entry.id} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: getEmotionById(entry.emotionId)?.color || 'grey'}}></div>
                              ))}
                            </div>
                           )}
                        </div>
                    </div>
                  </TooltipTrigger>
                  {dayEntries.length > 0 && (
                    <TooltipContent className="p-4 bg-card border-primary">
                        <div className="flex flex-col gap-3">
                        {dayEntries.map(entry => {
                            const emotion = getEmotionById(entry.emotionId);
                            return (
                                <div key={entry.id} className="max-w-xs">
                                <p className="font-bold flex items-center gap-2" style={{color: emotion?.color}}>
                                    <span className="text-xl">{emotion?.icon}</span>
                                    {emotion?.name}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{entry.text}</p>
                                </div>
                            );
                        })}
                        </div>
                    </TooltipContent>
                  )}
                </Tooltip>
                );
            })}
            </TooltipProvider>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
```

### `/src/app/components/views/sanctuary-view.tsx`
**Propósito:** Vista que muestra la colección de "Animales Espirituales" desbloqueados por el usuario.
```tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SPIRIT_ANIMALS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { SpiritAnimal } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


interface SanctuaryViewProps {
  unlockedAnimalIds: string[];
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

function AnimalCard({ animal, isUnlocked }: { animal: SpiritAnimal; isUnlocked: boolean }) {
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
          <DialogTitle className="text-2xl text-primary">{isUnlocked ? animal.name : 'Animal Bloqueado'}</DialogTitle>
          <DialogDescription className="pt-2">
            {isUnlocked ? (
                <span className="space-y-1">
                    <span className="block font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>{animal.emotion}</span>
                    <span className="block text-sm text-muted-foreground mt-1">{animal.description}</span>
                </span>
            ) : (
                <span className="space-y-1">
                    <span className="block font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>¿Cómo desbloquear?</span>
                    <span className="block text-sm text-muted-foreground mt-1">{animal.unlockHint}</span>
                </span>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}


export function SanctuaryView({ unlockedAnimalIds }: SanctuaryViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Mi Santuario</CardTitle>
        <CardDescription>Tu colección de animales espirituales desbloqueados. Cada uno representa un hito en tu viaje emocional.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {SPIRIT_ANIMALS.map((animal) => {
                  const isUnlocked = unlockedAnimalIds.includes(animal.id);
                  return (
                    <AnimalCard key={animal.id} animal={animal} isUnlocked={isUnlocked} />
                  );
                })}
              </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
```

### `/src/app/components/views/share-view.tsx`
**Propósito:** Vista para generar y copiar un resumen de texto del diario.
```tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clipboard, Check } from 'lucide-react';
import type { DiaryEntry, Emotion, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShareViewProps {
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
  userProfile: UserProfile | null;
  onShare: () => void;
}

export function ShareView({ diaryEntries, emotionsList, userProfile, onShare }: ShareViewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const getEmotionById = (id: string) => (emotionsList || []).find(e => e.id === id);

  const reportText = useMemo(() => {
    let text = `Diario de Emociones de ${userProfile?.name || 'Usuario'}\n`;
    const hasDateRange = startDate && endDate;

    if (hasDateRange) {
      const start = new Date(startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
      const end = new Date(endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
      text += `Periodo: ${start} - ${end}\n`;
    } else {
      text += `Periodo: Todas las entradas\n`;
    }
    
    text += "========================================\n\n";
    text += "--- Mis Entradas ---\n\n";

    const filteredEntries = diaryEntries.filter(entry => {
        if (!hasDateRange) return true;
        const entryDate = new Date(entry.date);
        const startRangeDate = new Date(startDate);
        const endRangeDate = new Date(endDate);
        endRangeDate.setUTCDate(endRangeDate.getUTCDate() + 1); // Include the end date in the range

        return entryDate >= startRangeDate && entryDate < endRangeDate;
    });

    if (filteredEntries.length > 0) {
        filteredEntries.slice().reverse().forEach(entry => {
            const emotion = getEmotionById(entry.emotionId);
            const date = new Date(entry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
            text += `Fecha: ${date}\n`;
            text += `Emoción: ${emotion?.name || 'Desconocida'} ${emotion?.icon || ''}\n`;
            text += `Reflexión: ${entry.text}\n`;
            text += "----------------------------------------\n";
        });
    } else {
        text += "No hay entradas en el diario para el rango de fechas seleccionado.\n\n";
    }

    text += "\n--- Mi Emocionario ---\n\n";
    (emotionsList || []).forEach(emotion => {
        text += `${emotion.icon} ${emotion.name}: ${emotion.description || 'Sin descripción.'}\n`;
    });

    if (!emotionsList || emotionsList.length === 0) {
        text += "El emocionario está vacío.\n";
    }

    return text;
  }, [diaryEntries, emotionsList, userProfile, startDate, endDate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
        setCopied(true);
        onShare(); // Trigger the share event for reward checking
        toast({ title: "¡Copiado!", description: "El reporte se ha copiado al portapapeles." });
        setTimeout(() => setCopied(false), 2000);
    }, () => {
        toast({ title: "Error", description: "No se pudo copiar el reporte.", variant: "destructive" });
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Compartir Diario</CardTitle>
        <CardDescription>Copia un resumen de tu diario en formato de texto para compartirlo con quien quieras. Puedes filtrar por fechas.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
                <Label htmlFor="start-date">Fecha de inicio</Label>
                <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                />
            </div>
            <div className="flex-1 space-y-2">
                <Label htmlFor="end-date">Fecha de fin</Label>
                <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                />
            </div>
        </div>
        <div className="flex-grow flex flex-col gap-4">
          <Button onClick={handleCopy} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
            {copied ? '¡Reporte Copiado!' : 'Copiar Reporte al Portapapeles'}
          </Button>
          <div className="flex-grow relative">
              <Textarea
                readOnly
                value={reportText}
                className="w-full h-full bg-muted/50 resize-none min-h-[200px] sm:min-h-[300px]"
              />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### `/src/app/components/views/streak-view.tsx`
**Propósito:** Vista para mostrar la racha de entradas del usuario y permitir la recuperación de días perdidos.
```tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flame, RotateCcw } from 'lucide-react';
import type { DiaryEntry } from '@/lib/types';
import { cn, normalizeDate } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakViewProps {
  diaryEntries: DiaryEntry[];
  onRecoverDay: (date: Date) => void;
}

export function StreakView({ diaryEntries, onRecoverDay }: StreakViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const entryDates = useMemo(() => {
    return new Set(diaryEntries.map(entry => normalizeDate(entry.date)));
  }, [diaryEntries]);

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [startingDayOfWeek, daysInMonth]);
  
  const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Mi Racha de Emociones</CardTitle>
        <CardDescription>¡Sigue así! Cada día que registras una emoción, la llama de tu racha se hace más fuerte.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft />
          </Button>
          <h3 className="text-xl font-bold text-primary capitalize">
            {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-muted-foreground mb-2">
          {weekdays.map(day => <div key={day} className="text-xs md:text-sm">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-grow">
          <TooltipProvider>
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="bg-muted/30 rounded-lg" />;
              
              const calendarDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const calendarDate = normalizeDate(calendarDateObj);
              const hasEntry = entryDates.has(calendarDate);

              const today = normalizeDate(new Date());
              const isToday = calendarDate === today;
              const isPast = calendarDate < today;

              let status: 'completed' | 'missed' | 'future' | 'today' = 'future';
              if (isToday) {
                  status = 'today';
              } else if (isPast) {
                  status = hasEntry ? 'completed' : 'missed';
              }

              const canRecover = status === 'missed';

              return (
                <Tooltip key={day}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "border rounded-lg flex flex-col items-center justify-center aspect-square transition-all duration-300 group",
                        status === 'completed' && "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-800",
                        status === 'missed' && "bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100",
                        status === 'today' && "border-primary border-2 ring-4 ring-primary/20",
                        status === 'future' && "bg-background dark:bg-muted/30",
                        canRecover && "cursor-pointer"
                      )}
                      onClick={canRecover ? () => onRecoverDay(calendarDateObj) : undefined}
                    >
                      <span className={cn(
                          "font-bold text-sm md:text-base", 
                          status === 'missed' && 'text-muted-foreground/50 group-hover:text-muted-foreground'
                      )}>{day}</span>
                      
                      <div className="flex-1 flex items-center justify-center">
                        {hasEntry ? (
                            <Flame className="w-8 h-8 text-amber-500 animate-flame transition-transform duration-200 group-hover:scale-125" />
                        ) : isPast ? (
                           <div className="flex flex-col items-center gap-1">
                             <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:hidden" />
                             <RotateCcw className="w-6 h-6 text-primary hidden group-hover:block" />
                           </div>
                        ) : (
                           <div className="w-5 h-5 rounded-full bg-muted-foreground/20 dark:bg-gray-700" /> // Ember for future days
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{new Date(calendarDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {hasEntry && <p className="font-bold text-amber-600 dark:text-amber-400">¡Meta cumplida!</p>}
                    {status === 'missed' && (
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-primary">Recuperar día</p>
                           <RotateCcw className="w-4 h-4 text-primary"/>
                        </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
```

### `/src/components/FirebaseErrorListener.tsx`
**Propósito:** Componente invisible que escucha errores de permisos de Firestore y los lanza para ser capturados por el manejador de errores de Next.js.
```tsx
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It throws any received error to be caught by Next.js's global-error.tsx.
 */
export function FirebaseErrorListener() {
  // Use the specific error type for the state for type safety.
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // The callback now expects a strongly-typed error, matching the event payload.
    const handleError = (error: FirestorePermissionError) => {
      // Set error in state to trigger a re-render.
      setError(error);
    };

    // The typed emitter will enforce that the callback for 'permission-error'
    // matches the expected payload type (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // On re-render, if an error exists in state, throw it.
  if (error) {
    throw error;
  }

  // This component renders nothing.
  return null;
}
```

### `/src/components/ui/**`
**Propósito:** Componentes de UI de bajo nivel de la biblioteca ShadCN. El código no se incluye aquí por brevedad, pero son los componentes estándar.

### `/src/firebase/client-provider.tsx`
**Propósito:** Proveedor de contexto de Firebase para el lado del cliente.
```tsx
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
```

### `/src/firebase/config.ts`
**Propósito:** Configuración del proyecto de Firebase.
```ts
export const firebaseConfig = {
  "projectId": "studio-2040032983-134ea",
  "appId": "1:851535225513:web:1dc9ce8936f7087d01ffb8",
  "apiKey": "AIzaSyBaMToK8ZZPiqP12dncGaedynE2JeiINCQ",
  "authDomain": "studio-2040032983-134ea.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "851535225513"
};
```

### `/src/firebase/error-emitter.ts`
**Propósito:** Emisor de eventos para propagar errores de permisos de Firestore de forma centralizada.
```ts
'use client';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Defines the shape of all possible events and their corresponding payload types.
 * This centralizes event definitions for type safety across the application.
 */
export interface AppEvents {
  'permission-error': FirestorePermissionError;
}

// A generic type for a callback function.
type Callback<T> = (data: T) => void;

/**
 * A strongly-typed pub/sub event emitter.
 * It uses a generic type T that extends a record of event names to payload types.
 */
function createEventEmitter<T extends Record<string, any>>() {
  // The events object stores arrays of callbacks, keyed by event name.
  // The types ensure that a callback for a specific event matches its payload type.
  const events: { [K in keyof T]?: Array<Callback<T[K]>> } = {};

  return {
    /**
     * Subscribe to an event.
     * @param eventName The name of the event to subscribe to.
     * @param callback The function to call when the event is emitted.
     */
    on<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName]?.push(callback);
    },

    /**
     * Unsubscribe from an event.
     * @param eventName The name of the event to unsubscribe from.
     * @param callback The specific callback to remove.
     */
    off<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        return;
      }
      events[eventName] = events[eventName]?.filter(cb => cb !== callback);
    },

    /**
     * Publish an event to all subscribers.
     * @param eventName The name of the event to emit.
     * @param data The data payload that corresponds to the event's type.
     */
    emit<K extends keyof T>(eventName: K, data: T[K]) {
      if (!events[eventName]) {
        return;
      }
      events[eventName]?.forEach(callback => callback(data));
    },
  };
}

// Create and export a singleton instance of the emitter, typed with our AppEvents interface.
export const errorEmitter = createEventEmitter<AppEvents>();
```

### `/src/firebase/errors.ts`
**Propósito:** Define un error personalizado (`FirestorePermissionError`) que estructura los errores de permisos para un mejor debugging.
```ts
'use client';
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

/**
 * Builds the complete, simulated request object for the error message.
 * It safely tries to get the current authenticated user.
 * @param context The context of the failed Firestore operation.
 * @returns A structured request object.
 */
function buildRequestObject(context: SecurityRuleContext): SecurityRuleRequest {
  let authObject: FirebaseAuthObject | null = null;
  try {
    // Safely attempt to get the current user.
    const firebaseAuth = getAuth();
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      authObject = buildAuthObject(currentUser);
    }
  } catch {
    // This will catch errors if the Firebase app is not yet initialized.
    // In this case, we'll proceed without auth information.
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
 * available in Firestore Security Rules.
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

### `/src/firebase/firestore/use-collection.tsx`
**Propósito:** Hook de React para suscribirse a una colección de Firestore en tiempo real.
```tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Directly use memoizedTargetRefOrQuery as it's assumed to be the final query
    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        // This logic extracts the path from either a ref or a query
        const path: string =
          memoizedTargetRefOrQuery.type === 'collection'
            ? (memoizedTargetRefOrQuery as CollectionReference).path
            : (memoizedTargetRefOrQuery as unknown as InternalQuery)._query.path.canonicalString()

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]); // Re-run if the target query/reference changes.
  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error(memoizedTargetRefOrQuery + ' was not properly memoized using useMemoFirebase');
  }
  return { data, isLoading, error };
}
```

### `/src/firebase/firestore/use-doc.tsx`
**Propósito:** Hook de React para suscribirse a un único documento de Firestore en tiempo real.
```tsx
'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Handles nullable references.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * The Firestore DocumentReference. Waits if null/undefined.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    // Optional: setData(null); // Clear previous data instantly

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          // Document does not exist
          setData(null);
        }
        setError(null); // Clear any previous error on successful snapshot (even if doc doesn't exist)
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]); // Re-run if the memoizedDocRef changes.

  return { data, isLoading, error };
}
```

### `/src/firebase/index.ts`
**Propósito:** Fichero "barril" que inicializa Firebase y exporta todos los hooks y proveedores principales.
```ts
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
```

### `/src/firebase/non-blocking-login.tsx`
**Propósito:** Funciones de ayuda para iniciar operaciones de autenticación de forma no bloqueante.
```tsx
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
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
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
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

### `/src/firebase/provider.tsx`
**Propósito:** Proveedor de contexto principal de Firebase que gestiona el estado de autenticación del usuario.
```tsx
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { // Renamed from UserAuthHookResult for consistency if desired, or keep as UserAuthHookResult
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) { // If no Auth service instance, cannot determine user state
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null }); // Reset on auth instance change

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => { // Auth state determined
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => { // Auth listener error
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe(); // Cleanup
  }, [auth]); // Depends on the auth instance

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => { // Renamed from useAuthUser
  const { user, isUserLoading, userError } = useFirebase(); // Leverages the main hook
  return { user, isUserLoading, userError };
};
```

### `/src/hooks/use-local-storage.ts`
**Propósito:** Hook personalizado para sincronizar un estado de React con el `localStorage` del navegador.
```ts
"use client";

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // We need to use a useEffect to read from localStorage.
  // This ensures that the code only runs on the client, after the initial server render.
  useEffect(() => {
    // This check is still good practice.
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      // When the component mounts on the client, we update the state with the value from localStorage.
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    }
  // We only want this to run once on mount, so we pass an empty dependency array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
```

### `/src/hooks/use-mobile.tsx`
**Propósito:** Hook para detectar si el usuario está en un dispositivo móvil basándose en el ancho de la pantalla.
```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

### `/src/hooks/use-toast.ts`
**Propósito:** Hook para mostrar notificaciones (toasts) en la aplicación.
```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

### `/src/lib/constants.ts`
**Propósito:** Fichero central para todas las constantes de la aplicación (emociones predefinidas, pasos del tour, recompensas, preguntas de cuestionario, etc.).
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


export const AVATAR_EMOJIS = ['😊', '😎', '🤔', '😂', '🥰', '😇', '🥳', '🤯', '🤩', '😴', '🌞', '⭐', '😄', '😢', '😠', '😨', '😌', '😟', '😮', '🤗', '🙏', '🦁', '😳', '✨', '😤', '😍', '😕', '😞', '💪', '😜', '😥', '😭', '🙄', '🤢', '🤐', '🥴', '🥺', '🤡', '👻', '👽', '🤖', '👾', '🎃', '😈', '👿', '🔥', '💯', '❤️', '💔', '👍', '👎', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '✍️', '🤳', '💅', '👀', '👁️', '🧠', '🦴', '🦷', '🗣️', '👤', '👥', '🫂', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️', '🧕', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '💂‍♀️', '💂', '💂‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🎓', '🧑‍🎓', '👨‍🎓', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍🏭', '🧑‍🏭', '👨‍🏭', '👩‍💻', '🧑‍💻', '👨‍💻', '👩‍💼', '🧑‍💼', '👨‍💼', '👩‍🔧', '🧑‍🔧', '👨‍🔧', '👩‍🔬', '🧑‍🔬', '👨‍🔬', '👩‍🎨', '🧑‍🎨', '👨‍🎨', '👩‍🚒', '🧑‍🚒', '👨‍🚒', '👩‍✈️', '🧑‍✈️', '👨‍✈️', '👩‍🚀', '🧑‍🚀', '👨‍🚀', '👩‍⚖️', '🧑‍⚖️', '👨‍⚖️', '🦸‍♀️', '🦸', '🦸‍♂️', '🦹‍♀️', '🦹', '🦹‍♂️', '🤶', '🧑‍🎄', '🎅', '🧙‍♀️', '🧙', '🧙‍♂️', '🧝‍♀️', '🧝', '🧝‍♂️', '🧛‍♀️', '🧛', '🧛‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🧞‍♀️', '🧞', '🧞‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️', '🧚‍♀️', '🧚', '🧚‍♂️', '👼', '🤰', '🤱', '👩‍🍼', '🧑‍🍼', '👨‍🍼', '🙇‍♀️', '🙇', '🙇‍♂️', '💁‍♀️', '💁', '💁‍♂️', '🙅‍♀️', '🙅', '🙅‍♂️', '🙆‍♀️', '🙆', '🙆‍♂️', '🙋‍♀️', '🙋', '🙋‍♂️', '🧏‍♀️', '🧏', '🧏‍♂️', '🤦‍♀️', '🤦', '🤦‍♂️', '🤷‍♀️', '🤷', '🤷‍♂️', '🙎‍♀️', '🙎', '🙎‍♂️', '🙍‍♀️', '🙍', '🙍‍♂️', '💇‍♀️', '💇', '💇‍♂️', '💆‍♀️', '💆', '💆‍♂️', '🧖‍♀️', '🧖', '🧖‍♂️', '💃', '🕺', '🕴️', '👩‍🦽', '🧑‍🦽', '👨‍🦽', '👩‍🦼', '🧑‍🦼', '👨‍🦼', '🚶‍♀️', '🚶', '🚶‍♂️', '👩‍🦯', '🧑‍🦯', '👨‍🦯', '🧎‍♀️', '🧎', '🧎‍♂️', '🏃‍♀️', '🏃', '🏃‍♂️', '🧍‍♀️', '🧍', '🧍‍♂️', '👫', '👭', '👬', '👩‍❤️‍👨', '👩‍❤️‍👩', '💑', '👨‍❤️‍👨', '👩‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💏', '👨‍❤️‍💋‍👨', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧', '👨‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🦢', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🕸️', '🌎', '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌚', '🌝', '🌞', '🪐', '💫', '🌟', '🌠', '🌌', '☁️', '⛅️', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌈', '☂️', '💧', '🌊', '🍓', '🍎', '🍉', '🍕', '🍰', '⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️'];


export const TOUR_STEPS: TourStepData[] = [
    { refKey: 'diaryRef', title: 'Tu Diario Personal', description: 'Aquí es donde puedes escribir tus entradas diarias. ¡Registra cómo te sientes cada día!' },
    { refKey: 'emocionarioRef', title: 'Crea tu Emocionario', description: 'Define tus propias emociones con nombres, iconos y colores. ¡Hazlo tuyo!' },
    { refKey: 'discoverRef', title: 'Descubre Nuevas Emociones', description: 'Explora una lista de emociones comunes y añádelas a tu propio emocionario.' },
    { refKey: 'gamesRef', title: 'Pon a Prueba tus Emociones', description: 'Diviértete y aprende con juegos interactivos diseñados para mejorar tu inteligencia emocional.' },
    { refKey: 'streakRef', title: 'Controla tu Racha', description: '¡Mantén la llama encendida! Registra tus emociones a diario para no perder tu racha.' },
    { refKey: 'sanctuaryRef', title: 'Tu Santuario de Recompensas', description: 'Alcanza hitos y desbloquea "animales espirituales" como recompensa por tu constancia.' },
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
};

export type View = 'diary' | 'emocionario' | 'discover' | 'calm' | 'report' | 'share' | 'profile' | 'streak' | 'sanctuary' | 'games';

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
  name: string;
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
        body: ['var(--font-pt-sans)', 'sans-serif'],
        headline: ['var(--font-pt-sans)', 'sans-serif'],
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
