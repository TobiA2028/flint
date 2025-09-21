"""
In-Memory Data Store for Issue Frequency Tracking

This module manages the storage and retrieval of issue frequency data.
Since this is a learning project, we're using in-memory storage (Python
dictionaries) instead of a real database.

Learning objectives:
- Understand data modeling and storage patterns
- Practice Python class design and methods
- Learn about data persistence and state management
- Explore thread safety considerations

Note: In a production app, this would be replaced with a real database
like PostgreSQL, but the interface would remain similar.
"""

from typing import Dict, List, Optional
import json
from datetime import datetime

class IssueDataStore:
    """
    In-memory data store for issue frequency tracking.

    This class manages all the data for social proof functionality,
    including issue frequencies and user tracking.
    """

    def __init__(self):
        """
        Initialize the data store with demo data.

        Sets up the initial issue frequencies and any other data
        structures needed for the application.
        """
        # TODO: Initialize your data structures
        # - Issue frequencies (dict mapping issue_id -> count)
        # - Total user count
        # - Maybe user tracking to prevent duplicates

        # Example structure:
        self.issue_frequencies = {}
        self.total_users = 0
        self.user_sessions = set()  # Track user sessions to prevent duplicates

        # Initialize with demo data
        self._load_demo_data()

    def _load_demo_data(self):
        """
        Load realistic demo data for social proof.

        This gives us believable numbers for the hackathon demo.
        """
        # TODO: Implement demo data loading
        # You should set realistic frequencies for each issue
        # These should match the issue IDs from your React frontend

        # Hint: Look at src/data/issues.ts to see the issue IDs
        # Example issues: housing, education, healthcare, environment, etc.

        # Demo data (replace with proper implementation)
        demo_frequencies = {
            "housing": 1247,
            "education": 982,
            "healthcare": 1156,
            "environment": 891,
            "transportation": 743,
            "safety": 1089,
            "economy": 1298,
            "infrastructure": 567,
            "immigration": 432,
            "taxes": 789,
            "rights": 923,
            "seniors": 445
        }

        self.issue_frequencies = demo_frequencies
        self.total_users = len(demo_frequencies) * 100  # Roughly estimate

        print("📊 Demo data loaded successfully!")

    def get_frequencies(self) -> Dict[str, int]:
        """
        Get current frequency counts for all issues.

        Returns:
            Dict[str, int]: Mapping of issue_id to frequency count

        Example:
            {
                "housing": 1247,
                "education": 982,
                "healthcare": 1156
            }
        """
        return self.issue_frequencies

    def increment_issues(self, issue_ids: List[str], user_id: Optional[str] = None) -> bool:
        """
        Increment the frequency count for specified issues.

        Args:
            issue_ids (List[str]): List of issue IDs to increment
            user_id (Optional[str]): User identifier to prevent duplicates

        Returns:
            bool: True if successful, False if user already counted

        Example:
            success = store.increment_issues(["housing", "education"], "user123")
        """
        # TODO: Implement this method
        # You need to:
        # 1. Check if user_id has already been counted (if provided)
        # 2. Increment the frequency for each issue in issue_ids
        # 3. Update total_users count
        # 4. Track the user_id to prevent duplicates
        # 5. Return True if successful

        # Validation
        if not issue_ids or not isinstance(issue_ids, list):
            return False

        # Check for duplicate users
        if user_id and user_id in self.user_sessions:
            return False

        # Increment frequencies
        for issue_id in issue_ids:
            if issue_id in self.issue_frequencies:
                self.issue_frequencies[issue_id] += 1

        # Track user and update total
        if user_id:
            self.user_sessions.add(user_id)
        self.total_users += 1

        print(f"✅ Incremented frequencies for: {issue_ids}")
        return True

    def reset_to_demo_data(self) -> None:
        """
        Reset all data back to initial demo values.

        This is useful for demo purposes - you can reset between
        demonstrations to show fresh social proof numbers.
        """
        # TODO: Implement this method
        # You need to:
        # 1. Clear current data
        # 2. Reload demo data
        # 3. Reset user tracking

        # TODO: Clear existing data
        self.issue_frequencies.clear()
        self.user_sessions.clear()
        self.total_users = 0

        # TODO: Reload demo data
        self._load_demo_data()

        print("🔄 Data reset to demo values")

    def get_total_users(self) -> int:
        """
        Get the total number of users who have participated.

        Returns:
            int: Total user count
        """
        return self.total_users

    def get_issue_names(self) -> List[str]:
        """
        Get a list of all tracked issue IDs.

        Returns:
            List[str]: List of issue identifiers
        """
        return list(self.issue_frequencies.keys())

    # ============================================================================
    # ADVANCED FEATURES (Optional for later phases)
    # ============================================================================

    def export_data(self) -> Dict:
        """
        Export all data as a dictionary for backup or analysis.

        This could be useful for saving data between server restarts
        or for analytics purposes.

        Returns:
            Dict: All data in exportable format
        """
        # TODO: Implement this method (optional)
        return {
            "issue_frequencies": self.issue_frequencies,
            "total_users": self.total_users,
            "export_timestamp": datetime.now().isoformat()
        }

    def import_data(self, data: Dict) -> bool:
        """
        Import data from a dictionary (opposite of export_data).

        Args:
            data (Dict): Data to import

        Returns:
            bool: True if successful
        """
        # TODO: Implement this method (optional)
        try:
            # Validate and import data
            pass
        except Exception as e:
            print(f"❌ Import failed: {e}")
            return False

    def get_top_issues(self, limit: int = 5) -> List[Dict]:
        """
        Get the most popular issues sorted by frequency.

        Args:
            limit (int): Maximum number of issues to return

        Returns:
            List[Dict]: Top issues with their frequencies
        """
        # TODO: Implement this method (optional)
        # Sort issues by frequency and return top N
        pass


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def create_data_store() -> IssueDataStore:
    """
    Factory function to create and initialize a data store.

    This pattern makes it easy to create data stores with different
    configurations or test data.

    Returns:
        IssueDataStore: Initialized data store instance
    """
    store = IssueDataStore()
    print("🗄️  Data store created successfully")
    return store


# ============================================================================
# TESTING AND DEBUGGING
# ============================================================================

if __name__ == "__main__":
    """
    Test the data store functionality.

    Run this file directly to test your implementation:
    python data_store.py
    """
    print("🧪 Testing IssueDataStore...")

    # Create a data store
    store = create_data_store()

    # Test getting frequencies
    frequencies = store.get_frequencies()
    print(f"📊 Current frequencies: {frequencies}")

    # Test incrementing issues
    test_issues = ["housing", "education", "healthcare"]
    success = store.increment_issues(test_issues, "test_user_1")
    print(f"✅ Increment test: {success}")

    # Test getting updated frequencies
    updated_frequencies = store.get_frequencies()
    print(f"📈 Updated frequencies: {updated_frequencies}")

    # Test total users
    total = store.get_total_users()
    print(f"👥 Total users: {total}")

    print("🎉 Testing complete!")