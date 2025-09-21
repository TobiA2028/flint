"""
Supabase Client for Flint Spark Civic Engagement App

This module replaces the in-memory data_store.py with a Supabase-backed
PostgreSQL database client. It maintains the same interface as IssueDataStore
to ensure compatibility with existing Flask routes.

Key improvements over in-memory storage:
- Data persistence across server restarts
- Real-time capabilities
- Scalable concurrent access
- Built-in security with RLS
- Admin dashboard for data management

Learning objectives:
- Understand database client patterns
- Learn Supabase Python SDK usage
- Practice async/await with database operations
- Implement proper error handling for database operations
"""

import os
from typing import Dict, List, Optional, Any
from datetime import datetime
from supabase import create_client, Client
import json
from dotenv import load_dotenv

class SupabaseDataStore:
    """
    Supabase-backed data store for complete civic engagement data management.

    DATABASE DESIGN:
    ===============
    This implementation uses PostgreSQL with Supabase for:
    - Complete document storage (JSON support for complex fields)
    - Array relationships (using PostgreSQL arrays for related IDs)
    - Real-time subscriptions (future enhancement)
    - Row Level Security for data protection

    COMPATIBILITY:
    =============
    This class maintains the same public interface as IssueDataStore
    to ensure seamless integration with existing Flask routes.
    All methods return the same data structures and handle errors gracefully.
    """

    def __init__(self, supabase_url: str, supabase_key: str):
        """
        Initialize the Supabase data store.

        Args:
            supabase_url (str): Supabase project URL
            supabase_key (str): Supabase service role key (for backend operations)
        """
        try:
            # Initialize Supabase client
            self.supabase: Client = create_client(supabase_url, supabase_key)
            print("✅ Supabase client initialized successfully")

            # Test connection
            self._test_connection()

        except Exception as e:
            print(f"❌ Failed to initialize Supabase client: {e}")
            raise e

    def _test_connection(self):
        """Test the Supabase connection by querying a table."""
        try:
            # Simple query to test connection - just get one row
            result = self.supabase.table('issues').select('id').limit(1).execute()
            print(f"🔗 Database connection verified")
        except Exception as e:
            print(f"❌ Database connection test failed: {e}")
            raise e

    # ============================================================================
    # ISSUES METHODS - Core civic issue management
    # ============================================================================

    def get_all_issues(self) -> List[Dict[str, Any]]:
        """
        Get all complete issue objects with metadata and current counts.

        Returns:
            List[Dict]: Complete issue objects from database
        """
        try:
            result = self.supabase.table('issues').select('*').execute()
            issues = result.data

            # Convert PostgreSQL arrays back to Python lists for consistency
            for issue in issues:
                if issue.get('related_offices') is None:
                    issue['related_offices'] = []
                if issue.get('related_measures') is None:
                    issue['related_measures'] = []

            print(f"📊 Retrieved {len(issues)} issues from database")
            return issues

        except Exception as e:
            print(f"❌ Error retrieving issues: {e}")
            return []

    def get_issue_by_id(self, issue_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific issue object by its ID.

        Args:
            issue_id (str): The issue identifier

        Returns:
            Optional[Dict]: Issue object if found, None otherwise
        """
        try:
            result = self.supabase.table('issues').select('*').eq('id', issue_id).execute()

            if result.data:
                issue = result.data[0]
                # Convert PostgreSQL arrays back to Python lists
                if issue.get('related_offices') is None:
                    issue['related_offices'] = []
                if issue.get('related_measures') is None:
                    issue['related_measures'] = []
                return issue

            return None

        except Exception as e:
            print(f"❌ Error retrieving issue {issue_id}: {e}")
            return None

    def get_frequencies(self) -> Dict[str, int]:
        """
        Get current frequency counts for all issues.

        LEGACY METHOD: Maintained for backwards compatibility.

        Returns:
            Dict[str, int]: Mapping of issue_id to count
        """
        try:
            result = self.supabase.table('issues').select('id, count').execute()

            frequencies = {}
            for issue in result.data:
                frequencies[issue['id']] = issue['count']

            return frequencies

        except Exception as e:
            print(f"❌ Error retrieving frequencies: {e}")
            return {}

    def increment_issues(self, issue_ids: List[str], user_id: Optional[str] = None) -> bool:
        """
        Increment the frequency count for specified issues.

        Args:
            issue_ids (List[str]): List of issue IDs to increment
            user_id (Optional[str]): User identifier to prevent duplicates

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Validation
            if not issue_ids or not isinstance(issue_ids, list):
                print("❌ Invalid issue_ids provided")
                return False

            # For now, we'll increment without duplicate checking
            # TODO: Implement user session tracking table for duplicate prevention

            updated_issues = []
            for issue_id in issue_ids:
                # Use PostgreSQL's atomic increment
                result = self.supabase.rpc(
                    'increment_issue_count',
                    {'issue_id_param': issue_id}
                ).execute()

                if result.data:
                    updated_issues.append(issue_id)
                else:
                    print(f"⚠️  Issue ID '{issue_id}' not found in database")

            print(f"✅ Incremented counts for: {updated_issues}")
            return len(updated_issues) > 0

        except Exception as e:
            print(f"❌ Error incrementing issue counts: {e}")
            return False

    def get_total_users(self) -> int:
        """
        Get the total number of users who have participated.

        This can be calculated from the sum of all issue counts
        or from a separate user tracking mechanism.

        Returns:
            int: Total user count
        """
        try:
            # Get all issue counts and calculate total
            # Note: This is a simplified approach. In practice, you might want
            # a separate user tracking table to avoid double-counting users
            # who selected multiple issues.

            result = self.supabase.table('issues').select('count').execute()

            if result.data:
                # Use the maximum count as an approximation of total users
                # since users typically select multiple issues
                counts = [issue['count'] for issue in result.data]
                return max(counts) if counts else 0

            return 0

        except Exception as e:
            print(f"❌ Error calculating total users: {e}")
            return 0

    # ============================================================================
    # CIVIC ENTITY QUERY METHODS - For filtering by issue relationships and getting all entities
    # ============================================================================

    def get_all_offices(self) -> List[Dict[str, Any]]:
        """
        Get all office objects from the database.

        Returns:
            List[Dict[str, Any]]: All office objects from database
        """
        try:
            result = self.supabase.table('offices').select('*').execute()
            offices = result.data

            print(f"🏛️  Retrieved {len(offices)} offices from database")
            return offices

        except Exception as e:
            print(f"❌ Error retrieving all offices: {e}")
            return []

    def get_all_ballot_measures(self) -> List[Dict[str, Any]]:
        """
        Get all ballot measure objects from the database.

        Returns:
            List[Dict[str, Any]]: All ballot measure objects from database
        """
        try:
            result = self.supabase.table('ballot_measures').select('*').execute()
            ballot_measures = result.data

            print(f"🗳️  Retrieved {len(ballot_measures)} ballot measures from database")
            return ballot_measures

        except Exception as e:
            print(f"❌ Error retrieving all ballot measures: {e}")
            return []

    def get_all_candidates(self) -> List[Dict[str, Any]]:
        """
        Get all candidate objects from the database.

        Returns:
            List[Dict[str, Any]]: All candidate objects from database
        """
        try:
            result = self.supabase.table('candidates').select('*').execute()
            candidates = result.data

            print(f"👥 Retrieved {len(candidates)} candidates from database")
            return candidates

        except Exception as e:
            print(f"❌ Error retrieving all candidates: {e}")
            return []

    def get_offices_by_issues(self, issue_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get all offices that handle any of the specified issues.

        Args:
            issue_ids (List[str]): List of issue IDs to find related offices for

        Returns:
            List[Dict[str, Any]]: Complete office objects handling the specified issues
        """
        try:
            if not issue_ids:
                return []

            # Use PostgreSQL array overlap operator to find offices
            # that have any of the specified issues in their related_issues array
            # Format: related_issues && ARRAY['issue1','issue2']
            result = self.supabase.table('offices').select('*').filter(
                'related_issues', 'ov', f"{{{','.join(issue_ids)}}}"
            ).execute()

            print(f"🏛️  Found {len(result.data)} offices for issues: {issue_ids}")
            return result.data

        except Exception as e:
            print(f"❌ Error retrieving offices by issues: {e}")
            return []

    def get_ballot_measures_by_issues(self, issue_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get all ballot measures that address any of the specified issues.

        Args:
            issue_ids (List[str]): List of issue IDs to find related ballot measures for

        Returns:
            List[Dict[str, Any]]: Complete ballot measure objects addressing the specified issues
        """
        try:
            if not issue_ids:
                return []

            # Use PostgreSQL array overlap operator
            # Format: related_issues && ARRAY['issue1','issue2']
            result = self.supabase.table('ballot_measures').select('*').filter(
                'related_issues', 'ov', f"{{{','.join(issue_ids)}}}"
            ).execute()

            print(f"🗳️  Found {len(result.data)} ballot measures for issues: {issue_ids}")
            return result.data

        except Exception as e:
            print(f"❌ Error retrieving ballot measures by issues: {e}")
            return []

    def get_candidates_by_issues(self, issue_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get all candidates whose positions align with any of the specified issues.

        Args:
            issue_ids (List[str]): List of issue IDs to find related candidates for

        Returns:
            List[Dict[str, Any]]: Complete candidate objects relevant to the specified issues
        """
        try:
            if not issue_ids:
                return []

            # Get candidates with direct issue relationships
            # Format: related_issues && ARRAY['issue1','issue2']
            direct_candidates = self.supabase.table('candidates').select('*').filter(
                'related_issues', 'ov', f"{{{','.join(issue_ids)}}}"
            ).execute()

            # Get candidates through their office relationships
            # First get offices that handle these issues
            relevant_offices = self.get_offices_by_issues(issue_ids)
            office_ids = [office['id'] for office in relevant_offices]

            office_candidates = []
            if office_ids:
                office_candidates_result = self.supabase.table('candidates').select('*').filter(
                    'office_id', 'in', office_ids
                ).execute()
                office_candidates = office_candidates_result.data

            # Combine and deduplicate candidates
            all_candidates = direct_candidates.data + office_candidates
            seen_ids = set()
            unique_candidates = []

            for candidate in all_candidates:
                if candidate['id'] not in seen_ids:
                    seen_ids.add(candidate['id'])
                    unique_candidates.append(candidate)

            print(f"👥 Found {len(unique_candidates)} candidates for issues: {issue_ids}")
            return unique_candidates

        except Exception as e:
            print(f"❌ Error retrieving candidates by issues: {e}")
            return []

    def get_candidates_by_offices(self, office_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get all candidates running for any of the specified offices.

        Args:
            office_ids (List[str]): List of office IDs to find candidates for

        Returns:
            List[Dict[str, Any]]: Complete candidate objects running for the specified offices
        """
        try:
            if not office_ids:
                return []

            # Get candidates directly by their office_id
            candidates_result = (
                self.supabase.table("candidates")
                .select("*")
                .in_("office_id", office_ids)  # ✅ use .in_() helper
                .execute()
            )

            candidates = candidates_result.data
            print(f"👥 Found {len(candidates)} candidates for offices: {office_ids}")
            return candidates

        except Exception as e:
            print(f"❌ Error retrieving candidates by offices: {e}")
            return []

    # ============================================================================
    # DATA MANAGEMENT METHODS
    # ============================================================================

    def reset_to_demo_data(self) -> None:
        """
        Reset all civic data back to initial demo values.

        This method will truncate tables and re-insert demo data.
        Use with caution - this will delete all existing data!
        """
        try:
            print("🔄 Resetting all civic data to demo values...")

            # This would typically involve running the seed_data.sql script
            # For now, we'll implement a simplified version

            # Note: In a production environment, you'd want more sophisticated
            # data management tools. This is simplified for demo purposes.

            print("⚠️  Demo data reset not yet implemented for Supabase")
            print("   Please run the seed_data.sql script manually in Supabase dashboard")

        except Exception as e:
            print(f"❌ Error resetting data: {e}")

    # ============================================================================
    # USER COMPLETION AND EMAIL TRACKING METHODS
    # ============================================================================

    def store_user_completion(self, completion_data: Dict[str, Any]) -> bool:
        """
        Store complete user journey data including readiness response and selections.

        Args:
            completion_data (Dict[str, Any]): Complete user journey data

        Returns:
            bool: True if successfully stored, False otherwise
        """
        try:
            # Insert into user_completions table
            result = self.supabase.table('user_completions').insert({
                'user_profile': completion_data.get('user_profile', {}),
                'starred_candidates': completion_data.get('starred_candidates', []),
                'starred_measures': completion_data.get('starred_measures', []),
                'readiness_response': completion_data.get('readiness_response'),
                'session_id': completion_data.get('session_id'),
                'completed_at': completion_data.get('completed_at', datetime.now().isoformat())
            }).execute()

            if result.data:
                print(f"✅ Stored user completion data")
                return True

            return False

        except Exception as e:
            print(f"❌ Error storing user completion data: {e}")
            return False

    def store_email_signup(self, email_data: Dict[str, Any]) -> bool:
        """
        Store email signup data from various screens.

        Args:
            email_data (Dict[str, Any]): Email signup data

        Returns:
            bool: True if successfully stored, False otherwise
        """
        try:
            # Insert into email_signups table
            result = self.supabase.table('email_signups').insert({
                'email': email_data.get('email'),
                'source': email_data.get('source'),
                'wants_updates': email_data.get('wants_updates', False),
                'user_profile': email_data.get('user_profile'),
                'ballot_data': email_data.get('ballot_data'),
                'session_id': email_data.get('session_id'),
                'timestamp': email_data.get('timestamp', datetime.now().isoformat())
            }).execute()

            if result.data:
                print(f"✅ Stored email signup: {email_data.get('email')}")
                return True

            return False

        except Exception as e:
            print(f"❌ Error storing email signup: {e}")
            return False

    def get_user_completions(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Get stored user completion data.

        Args:
            limit (Optional[int]): Maximum number of entries to return

        Returns:
            List[Dict[str, Any]]: User completion data entries
        """
        try:
            query = self.supabase.table('user_completions').select('*').order('created_at', desc=True)

            if limit:
                query = query.limit(limit)

            result = query.execute()
            return result.data

        except Exception as e:
            print(f"❌ Error retrieving user completions: {e}")
            return []

    def get_email_signups(self, limit: Optional[int] = None, source: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get stored email signup data.

        Args:
            limit (Optional[int]): Maximum number of entries to return
            source (Optional[str]): Filter by source ('thankyou', 'cast')

        Returns:
            List[Dict[str, Any]]: Email signup data entries
        """
        try:
            query = self.supabase.table('email_signups').select('*').order('created_at', desc=True)

            if source:
                query = query.eq('source', source)

            if limit:
                query = query.limit(limit)

            result = query.execute()
            return result.data

        except Exception as e:
            print(f"❌ Error retrieving email signups: {e}")
            return []

    def get_readiness_stats(self) -> Dict[str, int]:
        """
        Get statistics on user readiness responses.

        Returns:
            Dict[str, int]: Count of each readiness response type
        """
        try:
            # Use PostgreSQL aggregation to count responses
            result = self.supabase.rpc('get_readiness_stats').execute()

            if result.data:
                return result.data[0]

            return {"yes": 0, "no": 0, "still-thinking": 0}

        except Exception as e:
            print(f"❌ Error retrieving readiness stats: {e}")
            return {"yes": 0, "no": 0, "still-thinking": 0}


# ============================================================================
# FACTORY FUNCTION
# ============================================================================

def create_supabase_data_store(supabase_url: str = None, supabase_key: str = None) -> SupabaseDataStore:
    """
    Factory function to create and initialize a Supabase data store.

    Args:
        supabase_url (str): Supabase project URL (defaults to environment variable)
        supabase_key (str): Supabase service role key (defaults to environment variable)

    Returns:
        SupabaseDataStore: Initialized Supabase data store instance
    """
    # Get credentials from environment if not provided
    if not supabase_url:
        supabase_url = os.environ.get('SUPABASE_URL')
    if not supabase_key:
        supabase_key = os.environ.get('SUPABASE_KEY')

    if not supabase_url or not supabase_key:
        raise ValueError(
            "Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_KEY environment variables."
        )

    store = SupabaseDataStore(supabase_url, supabase_key)
    print("🗄️  Supabase data store created successfully")
    return store


# ============================================================================
# TESTING AND DEBUGGING
# ============================================================================

if __name__ == "__main__":
    """
    Test the Supabase data store functionality.

    Run this file directly to test your implementation:
    python supabase_client.py
    """
    # Load environment variables from .env file
    load_dotenv()

    print("🧪 Testing SupabaseDataStore...")

    try:
        # Create a data store
        store = create_supabase_data_store()

        # Test getting issues
        issues = store.get_all_issues()
        print(f"📊 Retrieved {len(issues)} issues")

        # Test getting offices by issues
        if issues:
            first_issue_id = issues[0]['id']
            offices = store.get_offices_by_issues([first_issue_id])
            print(f"🏛️  Found {len(offices)} offices for issue: {first_issue_id}")

        print("🎉 Testing complete!")

    except Exception as e:
        print(f"❌ Testing failed: {e}")
        print("Make sure your SUPABASE_URL and SUPABASE_KEY environment variables are set correctly.")
