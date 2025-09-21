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
    In-memory data store for complete civic engagement data management.

    DATABASE DESIGN EXPLANATION:
    ============================
    This implements a hybrid document-relational database pattern with many-to-many relationships.
    Each entity (Issue, Office, BallotMeasure, Candidate) is stored as a complete document object,
    while relationships between entities are maintained via arrays of IDs.

    RELATIONSHIP STRUCTURE:
    ======================
    - Issues ←→ Offices (Many-to-Many): Issues can relate to multiple offices, offices can relate to multiple issues
    - Issues ←→ BallotMeasures (Many-to-Many): Issues can have multiple ballot measures, measures can address multiple issues
    - Issues ←→ Candidates (Many-to-Many via Offices): Candidates relate to issues through their office positions
    - Candidates → Offices (Many-to-One): Each candidate runs for exactly one office

    DESIGN BENEFITS:
    ===============
    1. **Flexible Content Management**: Easy to add/remove relationships without schema changes
    2. **Query Efficiency**: Can fetch related items by filtering on related_issues arrays
    3. **Denormalized for Read Performance**: Frontend gets complete objects in minimal API calls
    4. **Supabase Ready**: Structure maps directly to PostgreSQL with native array support
    5. **Cache Friendly**: Complete objects can be cached effectively

    STORAGE PATTERN:
    ===============
    Each entity stores relationships as arrays of related entity IDs:
    - issues[issue_id]['related_offices'] = [office_id1, office_id2, ...]
    - offices[office_id]['related_issues'] = [issue_id1, issue_id2, ...]
    This bidirectional storage enables efficient queries in both directions.
    """

    def __init__(self):
        """
        Initialize the comprehensive civic data store.

        STORAGE STRUCTURE:
        =================
        - self.issues: Complete issue objects with metadata + counts + relationships
        - self.offices: Complete office objects with descriptions + issue relationships
        - self.ballot_measures: Complete ballot measure objects with impact + issue relationships
        - self.candidates: Complete candidate objects with positions + office/issue relationships

        RELATIONSHIP TRACKING:
        =====================
        - Each entity maintains arrays of related entity IDs for efficient bidirectional queries
        - This eliminates need for separate junction tables while maintaining referential integrity
        """
        # ============================================================================
        # CORE ENTITY STORAGE - Complete document objects for each entity type
        # ============================================================================

        # Issues: The central entities that connect to all other civic data
        # Structure: {issue_id: {id, name, icon, description, count, related_offices, related_measures}}
        self.issues = {}  # Dict[str, Dict] - issue_id -> complete issue object with relationships

        # Offices: Political positions that voters elect candidates for
        # Structure: {office_id: {id, name, description, explanation, level, related_issues}}
        self.offices = {}  # Dict[str, Dict] - office_id -> complete office object with issue relationships

        # Ballot Measures: Propositions and initiatives that voters decide on
        # Structure: {measure_id: {id, title, description, category, impact, related_issues}}
        self.ballot_measures = {}  # Dict[str, Dict] - measure_id -> complete measure object with issue relationships

        # Candidates: People running for political offices
        # Structure: {candidate_id: {id, name, party, photo, positions, office_id, related_issues}}
        self.candidates = {}  # Dict[str, Dict] - candidate_id -> complete candidate object with relationships

        # ============================================================================
        # USER TRACKING - For social proof and preventing duplicate submissions
        # ============================================================================

        self.total_users = 0  # Total number of users who have participated
        self.user_sessions = set()  # Track user sessions to prevent duplicate counting

        # ============================================================================
        # DATA INITIALIZATION - Load demo data with complete relationships
        # ============================================================================

        # Initialize with comprehensive demo data including all entity types and relationships
        self._load_demo_data()

    def _load_demo_data(self):
        """
        Load comprehensive demo data for all civic entity types with relationships.

        DATA MIGRATION NOTES:
        ====================
        This method migrates hardcoded data from the frontend components and establishes
        the relationships between issues, offices, ballot measures, and candidates.

        RELATIONSHIP MAPPING STRATEGY:
        =============================
        1. Issues are loaded first as the central entities
        2. Offices are created with mappings to related issues (from OfficeMappingScreen.tsx)
        3. Ballot Measures are created with issue relationships (from screens)
        4. Candidates are created with office assignments and issue relationships
        5. Bidirectional relationships are established for efficient querying

        This replaces the previous frontend-only storage and creates a single source of truth.
        """

        # ============================================================================
        # ISSUES - Central entities that connect to all other civic data
        # ============================================================================

        # Complete issue definitions with metadata + demo counts + populated relationships
        # This data was previously split between frontend (metadata) and backend (counts)
        demo_issues = {
            "housing": {
                "id": "housing",
                "name": "Housing",
                "icon": "Home",
                "description": "Affordable housing, rent control, and homeownership programs",
                "count": 1247,
                "related_offices": ["city-council"],
                "related_measures": ["measure-housing-1"]
            },
            "education": {
                "id": "education",
                "name": "Education",
                "icon": "GraduationCap",
                "description": "School funding, curriculum, and educational opportunities",
                "count": 982,
                "related_offices": ["school-board"],
                "related_measures": ["measure-edu-1"]
            },
            "healthcare": {
                "id": "healthcare",
                "name": "Healthcare",
                "icon": "Heart",
                "description": "Healthcare access, costs, and public health initiatives",
                "count": 1156,
                "related_offices": ["county-commissioner"],
                "related_measures": ["measure-healthcare-1"]
            },
            "environment": {
                "id": "environment",
                "name": "Environment",
                "icon": "Leaf",
                "description": "Climate change, pollution, and environmental protection",
                "count": 891,
                "related_offices": ["mayor", "transit-board"],
                "related_measures": ["measure-env-1", "measure-trans-1"]
            },
            "transportation": {
                "id": "transportation",
                "name": "Transportation",
                "icon": "Car",
                "description": "Public transit, roads, and transportation infrastructure",
                "count": 743,
                "related_offices": ["transit-board"],
                "related_measures": ["measure-trans-1"]
            },
            "safety": {
                "id": "safety",
                "name": "Public Safety",
                "icon": "Shield",
                "description": "Police reform, crime prevention, and community safety",
                "count": 1089,
                "related_offices": ["sheriff", "mayor"],
                "related_measures": ["measure-safety-1", "measure-immigration-1"]
            },
            "economy": {
                "id": "economy",
                "name": "Economy",
                "icon": "DollarSign",
                "description": "Jobs, minimum wage, and economic development",
                "count": 1298,
                "related_offices": ["city-council", "mayor"],
                "related_measures": ["measure-env-1", "measure-housing-1", "measure-tax-1"]
            },
            "infrastructure": {
                "id": "infrastructure",
                "name": "Infrastructure",
                "icon": "Construction",
                "description": "Roads, bridges, water systems, and public facilities",
                "count": 567,
                "related_offices": ["city-council", "transit-board"],
                "related_measures": ["measure-edu-1", "measure-trans-1", "measure-tax-1"]
            },
            "immigration": {
                "id": "immigration",
                "name": "Immigration",
                "icon": "Users",
                "description": "Immigration policy and immigrant services",
                "count": 432,
                "related_offices": ["city-council-general"],
                "related_measures": ["measure-immigration-1"]
            },
            "taxes": {
                "id": "taxes",
                "name": "Taxes",
                "icon": "Calculator",
                "description": "Tax policy, rates, and government spending",
                "count": 789,
                "related_offices": ["city-council-general"],
                "related_measures": ["measure-tax-1"]
            },
            "rights": {
                "id": "rights",
                "name": "Civil Rights",
                "icon": "Scale",
                "description": "Equality, discrimination, and civil liberties",
                "count": 923,
                "related_offices": ["sheriff"],
                "related_measures": ["measure-safety-1", "measure-immigration-1"]
            },
            "seniors": {
                "id": "seniors",
                "name": "Senior Services",
                "icon": "UserCheck",
                "description": "Elder care, social security, and senior programs",
                "count": 445,
                "related_offices": ["county-commissioner"],
                "related_measures": ["measure-healthcare-1"]
            }
        }

        # ============================================================================
        # OFFICES - Political positions that handle specific issues
        # ============================================================================

        # Office definitions migrated from OfficeMappingScreen.tsx with issue relationships
        # Each office specifies which issues it directly impacts
        demo_offices = {
            "city-council": {
                "id": "city-council",
                "name": "City Council",
                "description": "District Representative",
                "explanation": "City Council members vote on zoning laws, affordable housing projects, and rent control policies that directly affect housing costs in your neighborhood.",
                "level": "local",
                "related_issues": ["housing", "economy", "infrastructure"]  # Expanded: housing policy, local economy, city infrastructure
            },
            "school-board": {
                "id": "school-board",
                "name": "School Board",
                "description": "District Trustee",
                "explanation": "School Board members decide on curriculum, teacher hiring, school funding allocation, and policies that shape your local schools.",
                "level": "local",
                "related_issues": ["education"]
            },
            "county-commissioner": {
                "id": "county-commissioner",
                "name": "County Commissioner",
                "description": "Public Health District",
                "explanation": "County Commissioners oversee public health departments, mental health services, and healthcare access programs in your area.",
                "level": "local",
                "related_issues": ["healthcare", "seniors"]  # Expanded: healthcare and senior services
            },
            "mayor": {
                "id": "mayor",
                "name": "Mayor",
                "description": "City Executive",
                "explanation": "The Mayor sets environmental policy priorities, oversees sustainability initiatives, and can influence green infrastructure projects.",
                "level": "local",
                "related_issues": ["environment", "safety", "economy"]  # Expanded: environmental policy, public safety oversight, economic development
            },
            "transit-board": {
                "id": "transit-board",
                "name": "Transit Authority Board",
                "description": "Transportation District",
                "explanation": "Transit Board members make decisions about bus routes, subway expansions, bike lanes, and public transportation funding.",
                "level": "local",
                "related_issues": ["transportation", "environment", "infrastructure"]  # Expanded: transportation, environmental impact, transit infrastructure
            },
            "sheriff": {
                "id": "sheriff",
                "name": "County Sheriff",
                "description": "Law Enforcement",
                "explanation": "The Sheriff oversees county law enforcement, jail operations, and community policing strategies that affect public safety.",
                "level": "local",
                "related_issues": ["safety", "rights"]  # Expanded: public safety and civil rights
            },
            "city-council-general": {
                "id": "city-council-general",
                "name": "City Council",
                "description": "At-Large Representative",
                "explanation": "City Council members vote on policies and budgets that affect various community issues.",
                "level": "local",
                "related_issues": ["immigration", "taxes"]  # Streamlined: immigration policy, tax policy
            }
        }

        # ============================================================================
        # BALLOT MEASURES - Propositions and initiatives voters decide on
        # ============================================================================

        # Ballot measure definitions migrated from frontend screens with issue relationships
        demo_ballot_measures = {
            "measure-edu-1": {
                "id": "measure-edu-1",
                "title": "School Bond Initiative - Measure A",
                "description": "Authorizes $500 million in bonds to modernize school facilities, upgrade technology infrastructure, and improve safety systems across all district schools.",
                "category": "Education",
                "impact": "Would increase property taxes by approximately $45 per year for the average homeowner",
                "related_issues": ["education", "infrastructure"]  # Education and infrastructure impact
            },
            "measure-trans-1": {
                "id": "measure-trans-1",
                "title": "Public Transit Expansion - Measure B",
                "description": "Funds the extension of light rail service to underserved communities and increases bus frequency during peak hours.",
                "category": "Transportation",
                "impact": "Would provide improved transit access to 25,000 additional residents",
                "related_issues": ["transportation", "environment", "infrastructure"]  # Transportation, environmental benefits, infrastructure
            },
            "measure-env-1": {
                "id": "measure-env-1",
                "title": "Clean Energy Initiative - Measure C",
                "description": "Requires the city to transition to 100% renewable energy by 2030 and establishes a green jobs training program.",
                "category": "Environment",
                "impact": "Would create an estimated 500 new green jobs over the next 5 years",
                "related_issues": ["environment", "economy"]  # Environmental and economic impacts
            },
            "measure-housing-1": {
                "id": "measure-housing-1",
                "title": "Affordable Housing Development - Measure D",
                "description": "Allocates $300 million for affordable housing construction and first-time homebuyer assistance programs.",
                "category": "Housing",
                "impact": "Would create 2,000 new affordable housing units over 5 years",
                "related_issues": ["housing", "economy"]  # Housing and economic development
            },
            "measure-safety-1": {
                "id": "measure-safety-1",
                "title": "Community Safety Reform - Measure E",
                "description": "Establishes community policing programs, crisis intervention teams, and civilian oversight board for law enforcement accountability.",
                "category": "Public Safety",
                "impact": "Would reallocate 15% of police budget to community safety programs",
                "related_issues": ["safety", "rights"]  # Public safety and civil rights
            },
            "measure-healthcare-1": {
                "id": "measure-healthcare-1",
                "title": "Public Health Expansion - Measure F",
                "description": "Funds community health centers, mental health services, and senior wellness programs in underserved areas.",
                "category": "Healthcare",
                "impact": "Would provide healthcare access to 15,000 additional residents",
                "related_issues": ["healthcare", "seniors"]  # Healthcare and senior services
            },
            "measure-tax-1": {
                "id": "measure-tax-1",
                "title": "Progressive Business Tax - Measure G",
                "description": "Implements graduated tax rate for businesses based on revenue to fund essential city services and infrastructure.",
                "category": "Taxation",
                "impact": "Would generate $50 million annually for city services",
                "related_issues": ["taxes", "economy", "infrastructure"]  # Tax policy, economy, infrastructure funding
            },
            "measure-immigration-1": {
                "id": "measure-immigration-1",
                "title": "Sanctuary City Protection - Measure H",
                "description": "Strengthens protections for immigrant communities and prohibits local cooperation with federal immigration enforcement.",
                "category": "Immigration",
                "impact": "Would provide legal protection and support services for immigrant families",
                "related_issues": ["immigration", "rights", "safety"]  # Immigration, civil rights, community safety
            }
        }

        # ============================================================================
        # CANDIDATES - People running for political offices
        # ============================================================================

        # Candidate definitions migrated from CandidatesScreen.tsx with office and issue relationships
        demo_candidates = {
            "candidate-1": {
                "id": "candidate-1",
                "name": "Sarah Chen",
                "party": "Democratic",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                "positions": [
                    "Supports affordable housing initiatives and rent stabilization",
                    "Advocates for increased funding for public education",
                    "Champions climate action and renewable energy programs"
                ],
                "office_id": "city-council",  # Running for city council
                "related_issues": ["housing", "education", "environment"]  # Issues they focus on
            },
            "candidate-2": {
                "id": "candidate-2",
                "name": "Marcus Johnson",
                "party": "Republican",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
                "positions": [
                    "Focuses on reducing regulations for small businesses",
                    "Supports traditional law enforcement approaches",
                    "Advocates for fiscal responsibility in city budgeting"
                ],
                "office_id": "city-council",  # Also running for city council
                "related_issues": ["economy", "safety", "taxes"]  # Different issue focus
            },
            "candidate-3": {
                "id": "candidate-3",
                "name": "Elena Rodriguez",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
                "positions": [
                    "Prioritizes community-driven solutions to local issues",
                    "Supports sustainable transportation and infrastructure",
                    "Advocates for transparent government and citizen engagement"
                ],
                "office_id": "mayor",  # Running for mayor
                "related_issues": ["transportation", "infrastructure", "rights"]  # Broad reform focus
            }
        }

        # ============================================================================
        # ESTABLISH BIDIRECTIONAL RELATIONSHIPS
        # ============================================================================

        # Store all entities
        self.issues = demo_issues
        self.offices = demo_offices
        self.ballot_measures = demo_ballot_measures
        self.candidates = demo_candidates

        # Establish bidirectional relationships for efficient querying
        self._establish_relationships()

        # Set user tracking
        self.total_users = len(demo_issues) * 100  # Roughly estimate based on issue data

        print("📊 Complete civic data loaded successfully!")
        print(f"   📋 Loaded {len(self.issues)} issues with full metadata and relationships")
        print(f"   🏛️  Loaded {len(self.offices)} offices with issue mappings")
        print(f"   🗳️  Loaded {len(self.ballot_measures)} ballot measures with issue relationships")
        print(f"   👥 Loaded {len(self.candidates)} candidates with office and issue connections")
        print(f"   🔗 Established bidirectional relationships between all entity types")

    def _establish_relationships(self):
        """
        Establish bidirectional relationships between all entity types.

        RELATIONSHIP ESTABLISHMENT STRATEGY:
        ===================================
        This method creates bidirectional links between entities for efficient querying:

        1. **Office → Issue Relationships**: For each office's related_issues, add office_id to issue's related_offices
        2. **Ballot Measure → Issue Relationships**: For each measure's related_issues, add measure_id to issue's related_measures
        3. **Validation**: Ensure all referenced IDs exist to maintain referential integrity

        QUERY EFFICIENCY BENEFITS:
        ==========================
        - **Forward Query**: "What offices handle housing issues?" → issues['housing']['related_offices']
        - **Reverse Query**: "What issues does city council handle?" → offices['city-council']['related_issues']
        - **No Junction Tables**: Relationships stored directly in entity objects for fast access
        - **Array Intersection**: Can efficiently find entities with multiple issue relationships

        This pattern eliminates the need for separate relationship tables while maintaining
        fast bidirectional queries essential for the frontend filtering logic.
        """

        print("🔗 Establishing bidirectional relationships...")

        # ============================================================================
        # OFFICE → ISSUE RELATIONSHIPS
        # ============================================================================

        # For each office, add its ID to all related issues' related_offices arrays
        for office_id, office_data in self.offices.items():
            related_issue_ids = office_data.get('related_issues', [])

            for issue_id in related_issue_ids:
                # Validate that the issue exists before creating relationship
                if issue_id in self.issues:
                    # Add this office to the issue's related_offices array
                    if office_id not in self.issues[issue_id]['related_offices']:
                        self.issues[issue_id]['related_offices'].append(office_id)
                else:
                    print(f"⚠️  Warning: Office '{office_id}' references non-existent issue '{issue_id}'")

        # ============================================================================
        # BALLOT MEASURE → ISSUE RELATIONSHIPS
        # ============================================================================

        # For each ballot measure, add its ID to all related issues' related_measures arrays
        for measure_id, measure_data in self.ballot_measures.items():
            related_issue_ids = measure_data.get('related_issues', [])

            for issue_id in related_issue_ids:
                # Validate that the issue exists before creating relationship
                if issue_id in self.issues:
                    # Add this measure to the issue's related_measures array
                    if measure_id not in self.issues[issue_id]['related_measures']:
                        self.issues[issue_id]['related_measures'].append(measure_id)
                else:
                    print(f"⚠️  Warning: Ballot measure '{measure_id}' references non-existent issue '{issue_id}'")

        # ============================================================================
        # VALIDATION & LOGGING
        # ============================================================================

        # Count total relationships established for logging
        total_office_relationships = sum(len(issue['related_offices']) for issue in self.issues.values())
        total_measure_relationships = sum(len(issue['related_measures']) for issue in self.issues.values())

        print(f"   ✅ Established {total_office_relationships} office-issue relationships")
        print(f"   ✅ Established {total_measure_relationships} measure-issue relationships")
        print("   🔗 Bidirectional relationship establishment complete!")

    # ============================================================================
    # RELATIONSHIP QUERY METHODS - For efficient data retrieval by frontend
    # ============================================================================

    def get_offices_by_issues(self, issue_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get all offices that handle any of the specified issues.

        QUERY STRATEGY:
        ==============
        This method efficiently finds offices relevant to a user's selected issues by:
        1. Looking up each issue's related_offices array
        2. Collecting unique office IDs across all specified issues
        3. Returning complete office objects for frontend display

        This eliminates the need for complex joins and provides the exact data
        structure the frontend needs for the OfficeMappingScreen.

        Args:
            issue_ids (List[str]): List of issue IDs to find related offices for

        Returns:
            List[Dict[str, Any]]: Complete office objects that handle the specified issues

        Example:
            get_offices_by_issues(['housing', 'education'])
            → [
                {
                    "id": "city-council",
                    "name": "City Council",
                    "description": "District Representative",
                    "explanation": "...",
                    "level": "local",
                    "related_issues": ["housing"]
                },
                {
                    "id": "school-board",
                    "name": "School Board",
                    ...
                }
            ]
        """
        if not issue_ids:
            return []

        # Collect unique office IDs that handle any of the specified issues
        relevant_office_ids = set()

        for issue_id in issue_ids:
            if issue_id in self.issues:
                # Add all offices that handle this issue
                office_ids = self.issues[issue_id].get('related_offices', [])
                relevant_office_ids.update(office_ids)

        # Return complete office objects for the collected IDs
        relevant_offices = []
        for office_id in relevant_office_ids:
            if office_id in self.offices:
                relevant_offices.append(self.offices[office_id])

        return relevant_offices

    def get_ballot_measures_by_issues(self, issue_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get all ballot measures that address any of the specified issues.

        QUERY STRATEGY:
        ==============
        Similar to get_offices_by_issues, this method efficiently finds ballot measures
        relevant to a user's selected issues by collecting measure IDs from each
        issue's related_measures array.

        Args:
            issue_ids (List[str]): List of issue IDs to find related ballot measures for

        Returns:
            List[Dict[str, Any]]: Complete ballot measure objects addressing the specified issues

        Example:
            get_ballot_measures_by_issues(['education', 'transportation'])
            → [
                {
                    "id": "measure-edu-1",
                    "title": "School Bond Initiative - Measure A",
                    "description": "...",
                    "category": "Education",
                    "impact": "...",
                    "related_issues": ["education"]
                },
                ...
            ]
        """
        if not issue_ids:
            return []

        # Collect unique ballot measure IDs that address any of the specified issues
        relevant_measure_ids = set()

        for issue_id in issue_ids:
            if issue_id in self.issues:
                # Add all measures that address this issue
                measure_ids = self.issues[issue_id].get('related_measures', [])
                relevant_measure_ids.update(measure_ids)

        # Return complete ballot measure objects for the collected IDs
        relevant_measures = []
        for measure_id in relevant_measure_ids:
            if measure_id in self.ballot_measures:
                relevant_measures.append(self.ballot_measures[measure_id])

        return relevant_measures

    def get_candidates_by_issues(self, issue_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get all candidates whose positions align with any of the specified issues.

        QUERY STRATEGY:
        ==============
        Candidates are related to issues through two pathways:
        1. **Direct Issue Relationship**: Candidates have related_issues arrays based on their platform
        2. **Office-Based Relationship**: Candidates are related to issues through their target office

        This method checks both pathways to provide comprehensive candidate matching.

        Args:
            issue_ids (List[str]): List of issue IDs to find related candidates for

        Returns:
            List[Dict[str, Any]]: Complete candidate objects relevant to the specified issues

        Example:
            get_candidates_by_issues(['housing', 'environment'])
            → [
                {
                    "id": "candidate-1",
                    "name": "Sarah Chen",
                    "party": "Democratic",
                    "photo": "...",
                    "positions": [...],
                    "office_id": "city-council",
                    "related_issues": ["housing", "education", "environment"]
                },
                ...
            ]
        """
        if not issue_ids:
            return []

        relevant_candidates = []

        for candidate_id, candidate_data in self.candidates.items():
            # Check if candidate has direct issue relationships
            candidate_issues = candidate_data.get('related_issues', [])

            # Check if any of the candidate's issues match the requested issues
            if any(issue_id in candidate_issues for issue_id in issue_ids):
                relevant_candidates.append(candidate_data)
                continue

            # Also check if candidate's office handles any of the requested issues
            candidate_office_id = candidate_data.get('office_id')
            if candidate_office_id and candidate_office_id in self.offices:
                office_issues = self.offices[candidate_office_id].get('related_issues', [])
                if any(issue_id in office_issues for issue_id in issue_ids):
                    relevant_candidates.append(candidate_data)

        return relevant_candidates

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
        Reset all civic data back to initial demo values.

        COMPREHENSIVE RESET STRATEGY:
        ============================
        This method performs a complete reset of all entity types and relationships:
        1. Clear all existing data (issues, offices, ballot measures, candidates)
        2. Reset user tracking (sessions, total count)
        3. Reload complete demo dataset with relationships
        4. Re-establish bidirectional relationships

        This is useful for demo purposes - you can reset between demonstrations
        to show fresh social proof numbers and clean civic data.

        RESET SCOPE:
        ===========
        - All civic entities (issues, offices, ballot measures, candidates)
        - All relationship data (bidirectional links)
        - User engagement data (counts, sessions)
        - Social proof statistics (total users, frequencies)
        """
        print("🔄 Resetting all civic data to demo values...")

        # ============================================================================
        # CLEAR ALL EXISTING DATA
        # ============================================================================

        # Clear all entity storage
        self.issues.clear()          # Issues with relationships and counts
        self.offices.clear()         # Political offices with issue mappings
        self.ballot_measures.clear() # Ballot measures with issue relationships
        self.candidates.clear()      # Candidates with office and issue connections

        # Clear user tracking data
        self.user_sessions.clear()   # User session tracking for duplicate prevention
        self.total_users = 0         # Reset total user count

        # ============================================================================
        # RELOAD COMPLETE DEMO DATASET
        # ============================================================================

        # Reload comprehensive demo data with all entity types and relationships
        self._load_demo_data()

        print("🔄 Complete civic data reset to demo values successfully!")
        print(f"   📋 Reset {len(self.issues)} issues")
        print(f"   🏛️  Reset {len(self.offices)} offices")
        print(f"   🗳️  Reset {len(self.ballot_measures)} ballot measures")
        print(f"   👥 Reset {len(self.candidates)} candidates")
        print(f"   🔗 Re-established all relationships")
        print(f"   📊 Reset user engagement data")

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