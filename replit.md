# Ultimate AI Study Tool

## Overview

This is an AI-powered educational platform designed to enhance the learning experience through personalized study plans, interactive quizzes, progress tracking, and an intelligent AI tutor chatbot. The application is built as a modern, mobile-first web application with a focus on user engagement and learning outcomes.

**Core Purpose**: Provide students with a comprehensive study companion that leverages artificial intelligence to create personalized learning experiences, track progress, and offer real-time tutoring assistance.

**Target Platform**: Cross-platform web application optimized for mobile devices (iOS, Android, Mobile Web) with responsive design for desktop usage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Rationale**: React provides a component-based architecture ideal for building interactive UIs, while TypeScript adds type safety to reduce runtime errors. Vite offers fast hot module replacement and optimized builds.

**UI Component Library**: shadcn/ui built on Radix UI primitives with Tailwind CSS for styling.

**Design System**:
- Dark theme by default with light theme support via `next-themes`
- Glass morphism effects and gradient-based color schemes
- Custom CSS variables for consistent theming (primary: purple/blue gradient, secondary: cyan/teal)
- Mobile-first responsive design with bottom navigation for mobile and top navigation for all screens

**Routing**: React Router DOM for client-side navigation with the following route structure:
- `/` - Dashboard (home page with stats and progress overview)
- `/study` - Study materials and feature showcase
- `/tutor` - AI Tutor chat interface
- `/progress` - Progress tracking (currently maps to Dashboard)
- `/profile` - User profile (currently maps to Index)

**State Management**: TanStack Query (React Query) for server state management and data fetching.

**Pros**: 
- Modular component architecture promotes reusability
- TypeScript catches errors at compile time
- Shadcn/ui provides accessible, customizable components
- Fast development with Vite's HMR

**Cons**: 
- Client-side routing requires proper 404 handling on the server
- No server-side rendering (SSR) may impact initial load performance and SEO

### Component Structure

**Layout Components**:
- `TopNav`: Sticky header with title, notifications, and settings
- `BottomNav`: Mobile navigation bar with 5 main sections
- Responsive design that hides bottom nav on desktop (md breakpoint)

**Feature Components**:
- `ProgressRing`: Circular progress indicator with gradient animations
- `StatCard`: Dashboard statistics cards with icons, trends, and gradient accents
- `Dashboard`: Main landing page with user stats, study hours, quiz completion, and achievements
- `AITutor`: Chat interface for AI-powered tutoring (demo implementation)
- `Index`: Marketing/feature showcase page

**UI Primitives**: Comprehensive component library including buttons, cards, dialogs, forms, inputs, and data visualization components from shadcn/ui.

### Styling Architecture

**Tailwind CSS Configuration**:
- Custom color palette with CSS variables for theme switching
- Extended color system including success, warning, info states
- Chart-specific colors for data visualization
- Custom animations and transitions (scale-in, fade-in, slide-up)
- Glass morphism effects via custom CSS classes

**Design Tokens**:
- Consistent spacing, border radius (1rem default), and shadow systems
- Gradient utilities for primary, secondary, and accent colors
- Responsive breakpoint at 768px (md) for mobile/desktop switching

### External Dependencies

**UI & Styling**:
- `@radix-ui/*` - Accessible, unstyled UI primitives (18+ packages for various components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe variant management for components
- `lucide-react` - Icon library with 460+ icons
- `next-themes` - Theme switching (dark/light mode)

**Forms & Validation**:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation resolvers
- `zod` (implied by resolver usage) - Schema validation

**Data Fetching**:
- `@tanstack/react-query` - Server state management, caching, and synchronization

**UI Enhancements**:
- `embla-carousel-react` - Carousel/slider component
- `react-day-picker` - Date picker component
- `cmdk` - Command palette component
- `sonner` - Toast notification library
- `vaul` - Drawer component library

**Development Tools**:
- `vite` - Build tool and dev server
- `typescript-eslint` - TypeScript linting
- `@vitejs/plugin-react-swc` - Fast React refresh with SWC
- `lovable-tagger` - Component tagging for development mode

### Data Architecture

**Current State**: The application currently operates with mock/static data. No database integration is implemented yet.

**Future Considerations**: 
- User authentication and profile management
- Study plan and quiz data persistence
- Progress tracking and analytics storage
- Chat history for AI tutor conversations
- The architecture is prepared for backend integration through React Query's data fetching patterns

### Authentication & Authorization

**Current State**: No authentication system is implemented. The application displays a static user ("Alex") with hardcoded data.

**Future Requirements**: Will need user authentication, session management, and protected routes for personalized features.

### Performance Optimizations

**Code Splitting**: Vite handles automatic code splitting for dynamic imports.

**Asset Optimization**: 
- Image optimization through Vite's asset pipeline
- CSS purging via Tailwind for production builds
- Tree-shaking for unused code removal

**Development Features**:
- Hot Module Replacement (HMR) for instant updates during development
- Component tagging in development mode for debugging

### Mobile Responsiveness

**Breakpoint Strategy**: Single major breakpoint at 768px (md) for mobile/desktop switching.

**Mobile-First Features**:
- Bottom navigation visible only on mobile
- Touch-optimized component sizes
- Responsive typography and spacing
- Adaptive layouts using Tailwind's responsive utilities

**Accessibility**: Built on Radix UI primitives which provide ARIA attributes, keyboard navigation, and screen reader support out of the box.

### Build & Deployment

**Development**: `npm run dev` runs Vite dev server on port 5000, bound to 0.0.0.0 for network access.

**Production Build**: `vite build` creates optimized production bundle with minification and code splitting.

**Build Modes**: Separate development build available via `npm run build:dev` for debugging production issues.

**TypeScript Configuration**: 
- Strict mode disabled for faster development
- Path aliases configured (`@/*` maps to `./src/*`)
- Multiple tsconfig files for app and node environments