-- ============================================================================
-- Supabase Database Schema for Flint Spark Civic Engagement App
-- ============================================================================

-- Enable Row Level Security (RLS) for all tables
-- This ensures data security and proper access control

-- ============================================================================
-- CIVIC ENTITIES TABLES
-- ============================================================================

-- Issues Table - Central entity connecting all civic data
CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  related_offices TEXT[] DEFAULT '{}',
  related_measures TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Offices Table - Political positions voters elect candidates for
CREATE TABLE IF NOT EXISTS offices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  explanation TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('local', 'state', 'federal')),
  related_issues TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ballot Measures Table - Propositions and initiatives voters decide on
CREATE TABLE IF NOT EXISTS ballot_measures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  impact TEXT NOT NULL,
  related_issues TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Candidates Table - People running for political offices
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  party TEXT NOT NULL,
  photo TEXT NOT NULL,
  positions TEXT[] DEFAULT '{}',
  office_id TEXT NOT NULL,
  related_issues TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
);

-- ============================================================================
-- USER DATA TABLES
-- ============================================================================

-- User Completions Table - Store complete user journey data
CREATE TABLE IF NOT EXISTS user_completions (
  id SERIAL PRIMARY KEY,
  user_profile JSONB NOT NULL,
  starred_candidates TEXT[] DEFAULT '{}',
  starred_measures TEXT[] DEFAULT '{}',
  readiness_response TEXT NOT NULL CHECK (readiness_response IN ('yes', 'no', 'still-thinking')),
  session_id TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Email Signups Table - Store email signups from various screens
CREATE TABLE IF NOT EXISTS email_signups (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('thankyou', 'cast')),
  wants_updates BOOLEAN DEFAULT false,
  user_profile JSONB,
  ballot_data JSONB,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for efficient querying by related issues
CREATE INDEX IF NOT EXISTS idx_issues_count ON issues(count);
CREATE INDEX IF NOT EXISTS idx_offices_related_issues ON offices USING GIN(related_issues);
CREATE INDEX IF NOT EXISTS idx_ballot_measures_related_issues ON ballot_measures USING GIN(related_issues);
CREATE INDEX IF NOT EXISTS idx_candidates_related_issues ON candidates USING GIN(related_issues);
CREATE INDEX IF NOT EXISTS idx_candidates_office_id ON candidates(office_id);

-- Indexes for user data queries
CREATE INDEX IF NOT EXISTS idx_user_completions_session_id ON user_completions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_completions_readiness ON user_completions(readiness_response);
CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);
CREATE INDEX IF NOT EXISTS idx_email_signups_source ON email_signups(source);

-- ============================================================================
-- FUNCTIONS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offices_updated_at BEFORE UPDATE ON offices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ballot_measures_updated_at BEFORE UPDATE ON ballot_measures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ballot_measures ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Civic data tables: Allow read access to everyone, write access for service role only
CREATE POLICY "Allow read access to civic data" ON issues FOR SELECT USING (true);
CREATE POLICY "Allow read access to offices" ON offices FOR SELECT USING (true);
CREATE POLICY "Allow read access to ballot measures" ON ballot_measures FOR SELECT USING (true);
CREATE POLICY "Allow read access to candidates" ON candidates FOR SELECT USING (true);

-- User data tables: Allow insert for everyone (for form submissions),
-- read/update/delete for service role only
CREATE POLICY "Allow insert user completions" ON user_completions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert email signups" ON email_signups FOR INSERT WITH CHECK (true);

-- Service role can do everything (for backend operations)
CREATE POLICY "Service role full access to issues" ON issues FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access to offices" ON offices FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access to ballot measures" ON ballot_measures FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access to candidates" ON candidates FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access to user completions" ON user_completions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access to email signups" ON email_signups FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');