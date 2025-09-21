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

from typing import Dict, List, Optional, Any
import json
from datetime import datetime

class IssueDataStore:
    """
    In-memory data store for complete issue management.

    This class now serves as the single source of truth for all issue data,
    storing complete issue objects (metadata + counts) instead of just frequencies.
    This eliminates data duplication between frontend and backend.
    """

    def __init__(self):
        """
        Initialize the data store with complete issue objects.

        Now stores full issue metadata (id, name, icon, description, count)
        making the backend the authoritative source for all issue data.
        """
        # Store complete issue objects instead of just frequencies
        # This becomes our single source of truth for issue data
        self.issues = {}  # Dict[str, Dict] - issue_id -> complete issue object
        self.total_users = 0
        self.user_sessions = set()  # Track user sessions to prevent duplicates

        # Initialize with demo data that includes full issue definitions
        self._load_demo_data()

    def _load_demo_data(self):
        """
        Load complete issue definitions with realistic demo frequencies.

        This replaces the previous approach of storing just frequencies.
        Now we store the complete issue objects that were previously
        hardcoded in the frontend, making the backend the single source of truth.
        """
        # Complete issue definitions with metadata + demo counts
        # This data was previously split between frontend (metadata) and backend (counts)
        demo_issues = {
            "housing": {
                "id": "housing",
                "name": "Housing",
                "icon": "Home",
                "description": "Affordable housing, rent control, and homeownership programs",
                "count": 1247
            },
            "education": {
                "id": "education",
                "name": "Education",
                "icon": "GraduationCap",
                "description": "School funding, curriculum, and educational opportunities",
                "count": 982
            },
            "healthcare": {
                "id": "healthcare",
                "name": "Healthcare",
                "icon": "Heart",
                "description": "Healthcare access, costs, and public health initiatives",
                "count": 1156
            },
            "environment": {
                "id": "environment",
                "name": "Environment",
                "icon": "Leaf",
                "description": "Climate change, pollution, and environmental protection",
                "count": 891
            },
            "transportation": {
                "id": "transportation",
                "name": "Transportation",
                "icon": "Car",
                "description": "Public transit, roads, and transportation infrastructure",
                "count": 743
            },
            "safety": {
                "id": "safety",
                "name": "Public Safety",
                "icon": "Shield",
                "description": "Police reform, crime prevention, and community safety",
                "count": 1089
            },
            "economy": {
                "id": "economy",
                "name": "Economy",
                "icon": "DollarSign",
                "description": "Jobs, minimum wage, and economic development",
                "count": 1298
            },
            "infrastructure": {
                "id": "infrastructure",
                "name": "Infrastructure",
                "icon": "Construction",
                "description": "Roads, bridges, water systems, and public facilities",
                "count": 567
            },
            "immigration": {
                "id": "immigration",
                "name": "Immigration",
                "icon": "Users",
                "description": "Immigration policy and immigrant services",
                "count": 432
            },
            "taxes": {
                "id": "taxes",
                "name": "Taxes",
                "icon": "Calculator",
                "description": "Tax policy, rates, and government spending",
                "count": 789
            },
            "rights": {
                "id": "rights",
                "name": "Civil Rights",
                "icon": "Scale",
                "description": "Equality, discrimination, and civil liberties",
                "count": 923
            },
            "seniors": {
                "id": "seniors",
                "name": "Senior Services",
                "icon": "UserCheck",
                "description": "Elder care, social security, and senior programs",
                "count": 445
            }
        }

        self.issues = demo_issues
        self.total_users = len(demo_issues) * 100  # Roughly estimate

        print("📊 Complete issue data loaded successfully!")
        print(f"   Loaded {len(self.issues)} issues with full metadata")

    def get_frequencies(self) -> Dict[str, int]:
        """
        Get current frequency counts for all issues.

        LEGACY METHOD: Maintained for backwards compatibility with existing API endpoints.
        New code should use get_all_issues() to get complete issue objects.

        Returns:
            Dict[str, int]: Mapping of issue_id to frequency count
        """
        # Extract just the counts from the complete issue objects
        return {issue_id: issue_data["count"] for issue_id, issue_data in self.issues.items()}

    def get_all_issues(self) -> List[Dict[str, Any]]:
        """
        Get all complete issue objects with metadata and current counts.

        This is the new primary method for retrieving issue data,
        providing everything the frontend needs in one call.

        Returns:
            List[Dict]: Complete issue objects matching frontend TypeScript interface

        Example:
            [
                {
                    "id": "housing",
                    "name": "Housing",
                    "icon": "Home",
                    "description": "Affordable housing, rent control, and homeownership programs",
                    "count": 1247
                },
                ...
            ]
        """
        return list(self.issues.values())

    def get_issue_by_id(self, issue_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific issue object by its ID.

        Args:
            issue_id (str): The issue identifier

        Returns:
            Optional[Dict]: Issue object if found, None otherwise
        """
        return self.issues.get(issue_id)

    def increment_issues(self, issue_ids: List[str], user_id: Optional[str] = None) -> bool:
        """
        Increment the frequency count for specified issues.

        Updated to work with the new complete issue object structure.
        Now increments the 'count' field within each issue object.

        Args:
            issue_ids (List[str]): List of issue IDs to increment
            user_id (Optional[str]): User identifier to prevent duplicates

        Returns:
            bool: True if successful, False if user already counted
        """
        # Validation
        if not issue_ids or not isinstance(issue_ids, list):
            print("❌ Invalid issue_ids provided")
            return False

        # Check for duplicate users
        if user_id and user_id in self.user_sessions:
            print(f"❌ User {user_id} has already been counted")
            return False

        # Increment counts in the complete issue objects
        updated_issues = []
        for issue_id in issue_ids:
            if issue_id in self.issues:
                self.issues[issue_id]["count"] += 1
                updated_issues.append(issue_id)
            else:
                print(f"⚠️  Issue ID '{issue_id}' not found in data store")

        # Track user and update total
        if user_id:
            self.user_sessions.add(user_id)
        self.total_users += 1

        print(f"✅ Incremented counts for: {updated_issues}")
        return len(updated_issues) > 0

    def reset_to_demo_data(self) -> None:
        """
        Reset all data back to initial demo values.

        This is useful for demo purposes - you can reset between
        demonstrations to show fresh social proof numbers.
        """
        # Clear existing data
        self.issues.clear()
        self.user_sessions.clear()
        self.total_users = 0

        # Reload demo data with complete issue objects
        self._load_demo_data()

        print("🔄 Complete issue data reset to demo values")

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
        return list(self.issues.keys())

    # ============================================================================
    # ADVANCED FEATURES (Optional for later phases)
    # ============================================================================

    def export_data(self) -> Dict:
        """
        Export all data as a dictionary for backup or analysis.

        Now exports complete issue objects instead of just frequencies.

        Returns:
            Dict: All data in exportable format
        """
        return {
            "issues": self.issues,
            "total_users": self.total_users,
            "user_sessions_count": len(self.user_sessions),
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