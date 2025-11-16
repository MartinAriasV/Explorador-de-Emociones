# ✨ Explorador de Emociones ✨

**Explorador de Emociones** es una aplicación web progresiva (PWA) full-stack diseñada para el bienestar emocional infantil. Actúa como un diario personal interactivo donde los niños pueden registrar, explorar y comprender sus emociones a través de un sistema de gamificación, mini-juegos y un compañero de IA (Inteligencia Artificial).

Este proyecto fue construido desde cero utilizando **Next.js**, **Firebase (App Hosting)** y **Google AI Studio (Genkit)**.

### 🚀 [Ver la Demo en Vivo] https://9000-firebase-studio-1762131263377.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev

---

💡 El Origen: ¿Por qué construí esto?

Este proyecto nació de una necesidad personal y real. Mi hijo de 10 años asiste a terapia psicológica, y como tarea, debía anotar sus emociones diarias en un cuaderno.

Este proceso manual se volvió abrumador:

Para él: Era tedioso y poco motivador.

Para mí: Era difícil organizar y transcribir la información.

Para la psicóloga: Era complicado analizar datos escritos a mano sesión tras sesión.

Como desarrollador, vi un "dolor" claro que podía solucionar con tecnología. Creé esta app para transformar esa tarea en una experiencia interactiva, gamificada y útil para los tres.

## 📸 Galería de la App

| Mi Diario | Chat con Compañero IA | Rincón de la Calma |
| :---: | :---: | :---: |
| ![Diario de Emociones](https://github.com/user-attachments/assets/dd039aea-c07e-4bf5-824a-7a1c7c8a97c3) | ![Chat con Compañero IA](https://github.com/user-attachments/assets/2d74bb90-c318-4efa-a355-8789ea354e12) | ![Rincón de la Calma](https://github.com/user-attachments/assets/7ed9ca69-4b35-450d-a997-a0053abe4d55) |
| **Emocionario** | **Mini-Juegos** | **Tienda de Artículos** |
| ![Emocionario](https://github.com/user-attachments/assets/aa407861-2d5b-4074-afe5-aac3196100ce) | ![Juego Adivina Emoción](https://github.com/user-attachments/assets/b1719a39-0c6f-4b05-b9be-64650811351e) | ![Tienda](https://github.com/user-attachments/assets/fe5b131a-ebfe-4d06-af8b-3b65884c3d42) |

---

## Core Features

La aplicación está diseñada como un ecosistema completo para el bienestar emocional, combinando registro, juego y apoyo de IA.

* **✍️ Diario de Emociones:** Sistema completo de CRUD (Crear, Leer, Actualizar, Eliminar) para entradas del diario.
* **🤖 Compañero IA (Genkit):** Un chat en tiempo real con una mascota IA (`chatWithPet`) que utiliza **RAG (Retrieval-Augmented Generation)** para tomar contexto de las entradas recientes del diario del usuario y ofrecer apoyo personalizado.
* **🎮 Sistema de Gamificación Completo:**
    * **Puntos:** Los usuarios ganan puntos por registrar entradas y jugar.
    * **Tienda:** Una tienda (`shop-view`) donde se pueden gastar puntos en artículos cosméticos (marcos de avatar, fondos de habitación, accesorios para mascotas).
    * **Colección:** Un santuario (`collection-view`) para ver y equipar mascotas espirituales desbloqueadas.
    * **Racha Diaria:** Un calendario (`streak-view`) que rastrea los días consecutivos de uso, con un mini-juego (`quiz-modal`) para recuperar días perdidos.
* **🧠 5+ Mini-Juegos de Inteligencia Emocional:**
    * **Adivina la Emoción:** Quiz sobre escenarios.
    * **Memoria de Emociones:** Juego de memoria (pares de icono/nombre).
    * **Diario Rápido:** Juego de escritura veloz con palabras clave.
    * **Guerra de Antónimos:** Encuentra la emoción opuesta.
    * **Lluvia de Emociones:** Juego de arcade para atrapar la emoción correcta.

| Adivina la Emoción | Memoria | Diario Rápido |
| :---: | :---: | :---: |
| ![Juego Adivina Emoción](https://github.com/user-attachments/assets/b1719a39-0c6f-4b05-b9be-64650811351e) | ![Juego Memoria](https://github.com/user-attachments/assets/7184fb28-9622-434c-b0b4-b0d9cf8900a2) | ![Juego Diario Rápido](https://github.com/user-attachments/assets/fb762395-cee2-44a7-b7e0-5168dc64f8b4) |
| **Antónimos** | **Lluvia de Emociones** | |
| ![Juego Antónimos](https://github.com/user-attachments/assets/c8ee462a-370b-480d-8b2a-1c01f36d82de) | ![Juego Lluvia de Emociones](https://github.com/user-attachments/assets/4bcb39c3-e3d1-4d41-80f8-56f6032b2699) | |

* **🧘 Rincón de la Calma:** Módulo con 3 ejercicios de respiración guiada (Círculo, Cuadrada, 4-7-8).
* **📊 Reportes Visuales:** Un calendario de calor (`report-view`) que muestra las emociones registradas a lo largo del mes.
* **🎨 Personalización de Perfil:** Los usuarios pueden cambiar su nombre, avatar, y equipar los artículos cosméticos comprados.
* **🔐 Autenticación Segura:** Sistema de login y registro con Email/Contraseña y Google (Firebase Auth).

---

## 💡 Flujos de Inteligencia Artificial (Genkit)

La IA es un pilar central de la aplicación, gestionada a través de flujos de Genkit:

1.  **`chatWithPet`:** El flujo de chat principal, que utiliza un prompt de sistema robusto y RAG.
2.  **`suggestCalmingExercise`:** Analiza el texto de una entrada del diario y sugiere un ejercicio de calma relevante.
3.  **`validateEmotion`:** Valida si la emoción personalizada que un usuario intenta crear es una emoción humana real antes de guardarla.
4.  **`defineEmotionMeaning`:** Genera automáticamente una definición y un ejemplo para nuevas emociones.
5.  **`generateEmpathyImage`:** (Flujo para `empathy-gallery-game`) Genera una imagen que representa una emoción.

---

## 🛠️ Stack de Tecnologías

Este proyecto demuestra una arquitectura full-stack moderna, segura y escalable.

### Frontend
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router) con [Turbopack](https://turbo.build/pack)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **UI:** [React 18](https://react.dev/) (Hooks, Context, Server Components)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes:** [ShadCN UI](https://ui.shadcn.com/)
* **Visualización de Datos:** [Recharts](https://recharts.org/)
* **Iconos:** [Lucide React](https://lucide.dev/)

### Backend & Base de Datos
* **Plataforma:** [Firebase](https://firebase.google.com/)
* **Autenticación:** [Firebase Authentication](https://firebase.google.com/docs/auth) (Email/Pass y Google Provider)
* **Base de Datos:** [Cloud Firestore](https://firebase.google.com/docs/firestore) (NoSQL)
* **Hosting:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
* **Reglas de Seguridad:**
    * `firestore.rules` **altamente detalladas** que validan la propiedad de los datos (`isOwner`).
    * **Validación del lado del servidor** para transacciones de puntos en juegos (`isAscentGameUpdateValid`) y compras en la tienda (`isTransactionValid`).
    * Lógica transaccional para garantizar la atomicidad (ej. `isPointIncreaseCorrect` al crear una entrada).

### Inteligencia Artificial
* **Orquestación:** [Google AI (Genkit)](https://firebase.google.com/docs/genkit)
* **Modelo:** [Gemini (googleai/gemini-1.5-flash)](https://deepmind.google/technologies/gemini/)

---

## ⚙️ Instalación y Ejecución Local

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/MartinAriasV/Explorador-de-Emociones.git](https://github.com/MartinAriasV/Explorador-de-Emociones.git)
    cd Explorador-de-Emociones
