# Ultimate AI Study Tool

## Overview
This project is an AI-powered educational platform designed to provide a comprehensive study companion for students. It leverages artificial intelligence to create personalized learning experiences, track progress, and offer real-time tutoring assistance. The application includes personalized study plans, interactive quizzes, progress tracking, flashcards with spaced repetition, and an intelligent AI tutor chatbot. It's built as a modern, mobile-first fullstack web application focusing on user engagement and learning outcomes.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
The backend is built with Express 5.x and TypeScript, running on Node.js. It features a modular API structure for user management, progress tracking, study plans, quizzes, flashcards, and AI tutor messages. Currently, it uses in-memory storage with an `IStorage` interface, designed for easy migration to a persistent database. AI functionalities, including generating study plans, quizzes, flashcards, and powering the AI tutor, are integrated via the OpenAI GPT-4 API.

### Frontend Architecture
The frontend is a React 18 application built with TypeScript and Vite. It uses `shadcn/ui` based on Radix UI primitives and Tailwind CSS for styling, adopting a dark theme by default with glass morphism effects and gradient-based color schemes. React Router DOM handles client-side navigation, and TanStack Query (React Query) manages server state and data fetching. The design is mobile-first, with a responsive layout featuring a bottom navigation bar for mobile and a top navigation for desktop.

### UI/UX Decisions
The application features a professional UI redesign with gradient themes and glass morphism effects. It includes custom CSS variables for consistent theming and a mobile-first responsive design with a bottom tab bar. Key components include `TopNav`, `BottomNav`, and feature-specific pages like `Dashboard`, `Quizzes`, `Flashcards`, `StudyPlanner`, and `AITutor`.

### Data Architecture
The application currently uses in-memory storage with a defined `IStorage` interface. Data models include User, StudyPlan, Quiz, QuizResult, Flashcard, FlashcardReview, Message, Progress, and Achievement, all defined with Zod schemas for validation.

## External Dependencies

### Backend Dependencies
- `express`: Web server framework.
- `cors`: For handling cross-origin resource sharing.
- `openai`: OpenAI API client for AI features (GPT-4).
- `zod`: Schema validation.
- `tsx`: TypeScript execution for the server.

### Frontend Dependencies
- **UI & Styling**: `@radix-ui/*`, `tailwindcss`, `class-variance-authority`, `lucide-react`, `next-themes`.
- **Forms & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`.
- **Data Fetching**: `@tanstack/react-query`.
- **UI Enhancements**: `embla-carousel-react`, `react-day-picker`, `cmdk`, `sonner`, `vaul`.
- **Development Tools**: `vite`, `typescript-eslint`, `@vitejs/plugin-react-swc`.