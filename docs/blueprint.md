# **App Name**: Emotion Explorer

## Core Features:

- Diary Entry: Create diary entries to record daily emotions and experiences, including date, emotion selection, and textual descriptions.
- Emotion Lexicon: Personalize emotions, select name, associated emoji and color coding for better identification and mood tracking.
- Emotion Discovery: Add new emotions from a predefined set, and incorporate a way to define an emotion that's new to the user. Uses a tool that makes decisions to include the definition and example in the saved emotions, but might choose to exclude those details to keep the saved data clean and compact.
- Calm Corner: Use calming exercises with visual aids, like breathing circles. 
- Visual Report: Track emotions with a report view. Each report has a visualization to summarize trends and track mood across days and months.
- Share Diary: Copy and share diary report as a formatted text.
- User Profile: Set the user's personal information such as name and avatar to allow a minimal degree of personalization

## Style Guidelines:

- Primary color: Teal (#008080) to create a calming effect.
- Background color: Very light cyan (#F0FFFF) for a gentle and unobtrusive backdrop.
- Accent color: Orange (#FFA500) to highlight interactive elements and primary action buttons.
- Body and headline font: 'PT Sans', a modern sans-serif typeface, will be used for both headers and body text for legibility and a friendly feel.
- Heroicons: The application will utilize Heroicons, implemented as inline SVG components. Specific icons will be selected based on relevance to different app features. Heroicons include BookOpenIcon, FaceSmileIcon, SparklesIcon, HeartIcon, ChartBarIcon, ShareIcon, UserCircleIcon, XMarkIcon, Bars3Icon, ChevronLeftIcon, ChevronRightIcon, ClipboardIcon, PlusCircleIcon.
- All the components must make use of a flex-box layout that occupies the entire screen (h-screen).
- Breathing circle animation will gently change the scale and opacity over a 4-second loop to indicate to the user to synchronize the inhale and exhale with the visualization. 