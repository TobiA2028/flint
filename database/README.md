# Database Setup for Flint Spark

This directory contains the database schema, seed data, and migration scripts for the Supabase PostgreSQL database.

## Quick Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and service role key

2. **Set Environment Variables**
   ```bash
   # In backend/.env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=your-service-role-key
   ```

3. **Run Database Schema**
   - Open Supabase SQL Editor in your dashboard
   - Copy and run `schema.sql`
   - Copy and run `functions.sql`

4. **Seed Initial Data**
   ```bash
   cd database
   python migrate.py --seed
   ```

## Files Overview

- **`schema.sql`** - Complete database schema with tables, indexes, and RLS policies
- **`functions.sql`** - PostgreSQL functions for atomic operations
- **`seed_data.sql`** - Initial demo data (can be run in SQL Editor)
- **`migrate.py`** - Python migration script for seeding data via API
- **`README.md`** - This file

## Database Structure

### Core Tables
- `issues` - Civic issues with counts and relationships
- `offices` - Political offices with issue mappings
- `ballot_measures` - Ballot propositions with issue relationships
- `candidates` - Political candidates with office and issue connections

### User Data Tables
- `user_completions` - Complete user journey data
- `email_signups` - Email signups from various screens

## Migration Commands

```bash
# Complete setup (after running SQL files manually)
python migrate.py --setup

# Seed data only
python migrate.py --seed

# Reset all data
python migrate.py --reset

# Verify setup
python migrate.py --verify
```

## Security

The database uses Row Level Security (RLS) policies:
- **Public Read**: Civic data (issues, offices, measures, candidates)
- **Service Role**: Full access for backend operations
- **Authenticated Users**: Can insert user data (completions, signups)

## Development vs Production

- **Development**: Use the same Supabase project or create a separate dev project
- **Production**: Use separate Supabase project with production environment variables

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check SUPABASE_URL and SUPABASE_KEY in .env
   - Ensure you're using the service role key, not the anon key

2. **Permission Denied**
   - Verify RLS policies are set up correctly
   - Check that you're using the service role key for backend operations

3. **Data Not Appearing**
   - Run `python migrate.py --verify` to check table contents
   - Check Supabase dashboard logs for errors

### Reset Everything
```bash
# In Supabase SQL Editor, run:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Then re-run schema.sql, functions.sql, and migrate.py --seed
```