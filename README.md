# BreatheWise 🌬️

BreatheWise is a minimalist micro-meditation app designed to bring moments of calm and focus to your day. Leveraging the power of generative AI, it creates personalized meditation experiences with guided breathing exercises, mood-based microfiction, and serene background themes.

## ✨ Features

-   **Personalized Sessions**: Choose your mood and visual theme to create a unique 30-second meditation session.
-   **AI Breath Coach**: Get AI-suggested breathing patterns tailored to your current emotional state (e.g., box breathing for anxiety).
-   **Guided Audio**: A calming voice guides you through each breathing exercise, enhancing focus and relaxation.
-   **Microfiction MoodMorph**: Receive a short, AI-generated story that matches your mood to inspire imagination.
-   **Looping Mode**: Extend your session for as long as you need with the seamless looping feature.
-   **Serene Themes**: Immerse yourself in calming environments like oceans, forests, or starlight.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/en) (v20 or later) and npm installed.

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repository-url>
cd <your-repository-name>
npm install
```

### 3. Environment Variables

This project uses Google's Generative AI. You will need an API key from [Google AI Studio](https://aistudio.google.com/).

1.  Create a new file named `.env.local` in the root of the project.
2.  Add your API key to the file:

    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

    > **Important**: Replace `YOUR_API_KEY_HERE` with your actual Google AI API key.

### 4. Running the Development Server

You need to run two separate processes: one for the Next.js frontend and one for the Genkit AI flows.

**Terminal 1: Run the Next.js app**

```bash
npm run dev
```

This will start the frontend on [http://localhost:9002](http://localhost:9002).

**Terminal 2: Run the Genkit AI flows**

```bash
npm run genkit:watch
```

This starts the Genkit development server, which handles the AI-powered features. The `--watch` flag automatically restarts the server when you make changes to the AI flows.

Now, open your browser and navigate to [http://localhost:9002](http://localhost:9002) to use the application.

### 5. Building for Production

To create a production-ready build, run:

```bash
npm run build
```

And to start the production server, run:

```bash
npm start
```

---

## ✍️ Author

AK DINESH   https://github.com/akdinesh2003
