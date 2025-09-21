-- ============================================================================
-- PostgreSQL Functions for Flint Spark Civic Engagement App
-- ============================================================================

-- Function to increment issue count atomically
CREATE OR REPLACE FUNCTION increment_issue_count(issue_id_param TEXT)
RETURNS TABLE(success BOOLEAN, new_count INTEGER) AS $$
BEGIN
    UPDATE issues
    SET count = count + 1, updated_at = timezone('utc'::text, now())
    WHERE id = issue_id_param;

    IF FOUND THEN
        SELECT TRUE, issues.count INTO success, new_count
        FROM issues WHERE id = issue_id_param;
    ELSE
        SELECT FALSE, 0 INTO success, new_count;
    END IF;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to get readiness statistics
CREATE OR REPLACE FUNCTION get_readiness_stats()
RETURNS TABLE(yes INTEGER, no INTEGER, still_thinking INTEGER) AS $$
BEGIN
    SELECT
        COUNT(*) FILTER (WHERE readiness_response = 'yes') as yes_count,
        COUNT(*) FILTER (WHERE readiness_response = 'no') as no_count,
        COUNT(*) FILTER (WHERE readiness_response = 'still-thinking') as still_thinking_count
    FROM user_completions
    INTO yes, no, still_thinking;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to get total unique users (estimation based on user_completions)
CREATE OR REPLACE FUNCTION get_total_users()
RETURNS INTEGER AS $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT session_id) INTO total_count FROM user_completions WHERE session_id IS NOT NULL;

    -- If no user completions yet, use maximum issue count as fallback
    IF total_count = 0 THEN
        SELECT COALESCE(MAX(count), 0) INTO total_count FROM issues;
    END IF;

    RETURN total_count;
END;
$$ LANGUAGE plpgsql;