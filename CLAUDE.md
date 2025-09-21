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

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for styling
- **TanStack Query** for state management
- **React Router DOM** for routing
- **Zod** for schema validation
- **React Hook Form** with resolvers
- **Supabase JS** for optional real-time features

### Backend
- **Flask** web framework with Python
- **Supabase** PostgreSQL database (with in-memory fallback)
- **Flask-CORS** for cross-origin requests
- **python-dotenv** for environment configuration

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
│   │   └── issues.ts        # Legacy: Moved to backend/Supabase
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── lib/                 # Utility functions and API clients
│   │   ├── utils.ts
│   │   ├── api.ts           # Flask API client
│   │   └── supabase.ts      # Supabase client configuration
│   ├── pages/               # Route-based pages
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── assets/              # Static assets
│   │   └── flint-mascot.png
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── backend/                 # Flask backend
│   ├── app.py              # Flask application
│   ├── config.py           # Configuration management
│   ├── data_store.py       # Legacy in-memory storage
│   ├── supabase_client.py  # Supabase database client
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── database/               # Database setup and migration
│   ├── schema.sql          # PostgreSQL database schema
│   ├── functions.sql       # PostgreSQL functions
│   ├── seed_data.sql       # Demo data for manual seeding
│   ├── migrate.py          # Python migration script
│   └── README.md           # Database setup instructions
├── public/                 # Public assets
├── package.json            # Frontend dependencies and scripts
├── .env.example            # Frontend environment variables template
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── components.json         # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Commands

### Frontend
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

### Backend
```bash
# Install Python dependencies
cd backend && pip install -r requirements.txt

# Start Flask development server (port 5001)
cd backend && python3 app.py

# Run database migration (after Supabase setup)
cd database && python migrate.py --seed
```

## Supabase Setup

### Quick Start
1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get Credentials**: Copy your project URL and service role key
3. **Set Environment Variables**:
   ```bash
   # Frontend (.env)
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Backend (backend/.env)
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=your-service-role-key
   ```
4. **Setup Database**:
   - Run `database/schema.sql` in Supabase SQL Editor
   - Run `database/functions.sql` in Supabase SQL Editor
   - Run `cd database && python migrate.py --seed` to populate data

### Fallback Behavior
- **Without Supabase**: App automatically falls back to in-memory storage
- **With Supabase**: App uses PostgreSQL for persistent data storage
- **Real-time Features**: Available only with Supabase (optional enhancement)

## Application Architecture

### Core State Management
The app uses a centralized state pattern via `useAppState` hook located at `src/hooks/useAppState.ts`:
- Persists to localStorage with key `'flint-app-state'`
- Manages 7-step flow progression (`currentStep`)
- Tracks user profile data (issues, demographics, zipCode)
- Handles starred candidates and ballot measures
- **UPDATED**: Manages dynamic issue loading from Supabase/Flask backend with loading/error states

### Data Architecture
- **Frontend State**: React state management for UI flow and user selections
- **Backend API**: Flask REST API serving civic data from Supabase or in-memory storage
- **Database**: PostgreSQL via Supabase for persistent data storage
- **Real-time**: Optional Supabase real-time subscriptions for live updates
- **Fallback**: Graceful degradation to in-memory storage when Supabase unavailable

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
- **Data**: ~~Static data in `src/data/`~~ **MIGRATED**: Now loaded dynamically from Supabase via backend
- **API Layer**: Located in `src/lib/api.ts` (Flask API) and `src/lib/supabase.ts` (direct Supabase access)

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

**Supabase Integration**: All civic data (issues, offices, ballot measures, candidates) is now loaded from Supabase PostgreSQL via the Flask backend. The database serves as the single source of truth for civic definitions and user interaction counts.

**Data Flow**:
1. **Frontend** ↔ **Flask API** ↔ **Supabase PostgreSQL**
2. **Optional**: Frontend ↔ **Supabase JS Client** (for real-time features)
3. **Fallback**: Frontend ↔ **Flask API** ↔ **In-memory Storage** (when Supabase unavailable)