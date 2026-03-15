# 🍅 Pomodoro Focus & Task Manager

A stunning, professional, and fully-featured Pomodoro Timer application built with modern web technologies. Focus on your tasks seamlessly with dynamic background animations, a robust task list, and an automated session queue system.

## ✨ Features

- **🚀 Automated Schedule Generator**: Define your total working hours, focus time, and break limits. The app automatically constructs your entire day's schedule.
- **🕒 Precision Pomodoro Timer**: Custom-built, highly accurate timer using React hooks (`useTimer.ts`) and `requestAnimationFrame` logic.
- **📋 Smart Task Queue (Focus Flow)**: See what's next and stay in the zone. Visual timeline highlights your current active session.
- **✅ Integrated Task List**: Keep track of your micro-tasks within your focus sessions without breaking concentration.
- **🎨 Stunning Animated UI**: Features dynamic, CSS-driven ambient cosmic backgrounds that pulse alongside your workflow.
- **🌓 Dark/Light Mode**: Full responsive theme support using Tailwind CSS v4 and OKLCH color spaces for perfect contrast and eye comfort.
- **🔊 Audio Notifications**: Subtle audio cues alert you when a deep work session ends or a break begins.

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (with native CSS nesting and theming)
- **UI Components**: Custom crafted functional components inspired by Aceternity UI and Shadcn (Buttons, Cards, Forms).
- **Icons & Animation**: Custom CSS Keyframes and Tailwind utilities.

## 💻 Installation and Setup

To run this project locally, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pomodoro-timer.git
   cd pomodoro-timer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(This project uses modern `@tailwindcss/vite` and other cutting-edge libraries).*

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   This will output the optimized static files into the `dist` directory.

## 🧠 Project Architecture

The project is structured following modular and feature-based design patterns:

- `src/App.tsx`: Central hub managing the 3-column layout (Queue, Timer, Task List) and global theme state.
- `src/components/pomodoro/`: Contains business logic components (`PomodoroTimer.tsx`, `Queue.tsx`, `TaskList.tsx`).
- `src/components/ui/`: Contains reusable, highly styled generic components (`Card.tsx`, `Button.tsx`).
- `src/hooks/useTimer.ts`: Robust custom hook managing the exact second intervals, pause, play, and session callbacks.
- `src/index.css`: Tailwind v4 theme configurations, strict CSS variables, and ambient keyframe animations.

## 📜 License

This project is licensed under the MIT License. Feel free to fork, modify, and build upon it!
