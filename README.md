# Flint Spark 🗳️

A civic engagement application that helps users navigate the voting process by providing personalized candidate and ballot measure recommendations based on their issue preferences and demographics.

## Overview

Flint Spark guides users through a 7-step flow from welcome to ballot preview, making civic participation more accessible and informed. Users select issues they care about, provide basic demographics, and receive tailored recommendations for candidates and ballot measures.

## Features

- **Issue-Based Matching**: Users select civic issues they care about and get matched with relevant candidates
- **Personalized Recommendations**: Tailored suggestions based on user demographics and preferences
- **Ballot Preview**: Complete preview of starred candidates and measures before voting
- **Progressive Flow**: Intuitive 7-step guided experience with progress tracking
- **Real-time Data**: Dynamic content loading from Supabase database with fallback support

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- shadcn/ui component library with Radix UI
- Tailwind CSS for styling
- TanStack Query for state management
- React Router DOM for routing

### Backend
- Flask web framework with Python
- Supabase PostgreSQL database
- Flask-CORS for cross-origin requests
- Graceful fallback to in-memory storage

## Quick Start

### Prerequisites
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Python 3.x
- Supabase account (optional - app works without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd flint-spark-civic
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up environment variables** (optional)
   ```bash
   # Frontend (.env)
   cp .env.example .env
   # Add your Supabase credentials if using

   # Backend (backend/.env)
   cp backend/.env.example backend/.env
   # Add your Supabase credentials if using
   ```

### Development

1. **Start the backend server**
   ```bash
   cd backend
   python3 app.py
   # Runs on http://localhost:5001
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   # Runs on http://localhost:8080
   ```

3. **Open your browser** to `http://localhost:8080`

## Application Flow

1. **Welcome Screen** - Introduction with mascot guide
2. **Issue Selection** - Choose civic issues you care about
3. **Demographics** - Provide age group, community role, and zip code
4. **Social Proof** - View community engagement data
5. **Office Mapping** - See how issues map to political offices
6. **Candidates & Measures** - Review and star candidates/ballot measures
7. **Ballot Preview** - Final preview of your selections

## Database Setup (Optional)

The app works out-of-the-box with in-memory storage, but for persistent data:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL files in the `database/` directory:
   - `schema.sql` - Database structure
   - `functions.sql` - Database functions
   - `seed_data.sql` - Sample data
3. Run the migration script:
   ```bash
   cd database
   python migrate.py --seed
   ```

## Build Commands

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
flint-spark-civic/
├── src/
│   ├── components/     # React components
│   ├── screens/        # Main application screens
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and API clients
│   └── types/          # TypeScript definitions
├── backend/            # Flask backend application
├── database/           # Database schema and migrations
└── public/             # Static assets
```

## Contributing

This project follows a simple development workflow:
1. Plan your changes
2. Keep changes simple and focused
3. Test your implementation
4. Run linting before submitting

## License

MIT License - see LICENSE file for details