# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Flint Spark" - a civic engagement application that helps users navigate the voting process by providing personalized candidate and ballot measure recommendations based on their issue preferences and demographics. The app guides users through a 7-step flow from welcome to ballot preview.

## Development Workflow

When working on tasks in this repository, follow these rules:

1. **Think and Plan**: First think through the problem, read the codebase for relevant files, and write a plan to `tasks/todo.md`.
2. **Create Todo List**: The plan should have a list of todo items that you can check off as you complete them.
3. **Get Approval**: Before you begin working, check in with me and I will verify the plan.
4. **Execute with Updates**: Then, begin working on the todo items, marking them as complete as you go.
5. **Communicate Progress**: Please every step of the way just give me a high level explanation of what changes you made.
6. **Keep It Simple**: Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. **Review**: Add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for styling
- **TanStack Query** for state management
- **React Router DOM** for routing
- **Zod** for schema validation
- **React Hook Form** with resolvers

## Project Structure

```
flint-spark-civic/
├── src/
│   ├── components/           # Custom React components
│   │   ├── ui/              # shadcn/ui component library
│   │   ├── BallotMeasureCard.tsx
│   │   ├── CTAButton.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── IssueCard.tsx
│   │   ├── MascotGuide.tsx
│   │   └── ProgressIndicator.tsx
│   ├── screens/             # Main application screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── IssueSelectionScreen.tsx
│   │   ├── DemographicsScreen.tsx
│   │   ├── SocialProofScreen.tsx
│   │   ├── OfficeMappingScreen.tsx
│   │   ├── CandidatesScreen.tsx
│   │   └── BallotPreviewScreen.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAppState.ts   # Main state management hook
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── data/                # Static data and configuration
│   │   └── issues.ts        # Civic issues definitions
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── pages/               # Route-based pages
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── assets/              # Static assets
│   │   └── flint-mascot.png
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Public assets
├── package.json             # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── components.json         # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Commands

```bash
# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Run linter
npm run lint

# Preview production build
npm run preview

# Install dependencies
npm i
```

## Application Architecture

### Core State Management
The app uses a centralized state pattern via `useAppState` hook located at `src/hooks/useAppState.ts`:
- Persists to localStorage with key `'flint-app-state'`
- Manages 7-step flow progression (`currentStep`)
- Tracks user profile data (issues, demographics, zipCode)
- Handles starred candidates and ballot measures
- **NEW**: Manages dynamic issue loading from backend with loading/error states

### Screen Flow Architecture
The app follows a linear 7-step flow managed by `src/App.tsx`:

1. **WelcomeScreen** - Introduction with mascot guide
2. **IssueSelectionScreen** - User selects civic issues they care about
3. **DemographicsScreen** - Collects age group, community role, zip code
4. **SocialProofScreen** - Shows community engagement data
5. **OfficeMappingScreen** - Maps issues to relevant offices
6. **CandidatesScreen** - Shows candidates and ballot measures with starring
7. **BallotPreviewScreen** - Final preview of starred items

### Component Structure
- **UI Components**: Located in `src/components/ui/` (shadcn/ui components)
- **Custom Components**: Located in `src/components/` (app-specific components)
- **Screens**: Located in `src/screens/` (main app screens)
- **Types**: Centralized in `src/types/index.ts`
- **Data**: ~~Static data in `src/data/`~~ **MIGRATED**: Now loaded dynamically from backend
- **API Layer**: Located in `src/lib/api.ts` (backend communication)

### Key Data Models
- `AppState`: Overall app state structure (includes issue loading states)
- `UserProfile`: User demographics and preferences
- `Issue`: Civic issues configuration (now loaded from backend)
- `Candidate`: Political candidates with positions
- `BallotMeasure`: Ballot measures with descriptions
- `Office`: Political offices with relevance mapping
- **NEW**: `IssueFromApi`: Backend response format for issues
- **NEW**: `IssuesResponse`: Complete API response with metadata

### Styling Conventions
- Uses Tailwind CSS with custom CSS variables
- Theme configuration in `tailwind.config.ts`
- Component styling follows shadcn/ui patterns
- Custom animations defined for spark effects

### Path Aliases
The project uses TypeScript path aliases configured in `vite.config.ts`:
- `@/` maps to `./src/`
- All imports use absolute paths from src root

## Testing
No test framework is currently configured. When adding tests, check the codebase for any existing test setup first.

## Build Configuration
- **Vite Config**: `vite.config.ts` - includes React SWC plugin and Lovable tagger for development
- **TypeScript**: Multiple tsconfig files (app, node, base)
- **ESLint**: Modern flat config with React hooks and TypeScript support
- **PostCSS**: Configured for Tailwind CSS processing

## Local Storage & Backend Integration
The app persists state to localStorage and will restore user progress on reload. State is saved automatically on every change via `useAppState` hook.

**Backend Integration**: Issue data is now loaded from the Flask backend on app initialization. The backend serves as the single source of truth for issue definitions and counts, eliminating data synchronization issues between frontend and backend.