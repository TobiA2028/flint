// ============================================================================
// CORE CIVIC ENTITY INTERFACES - Updated for Backend Integration
// ============================================================================

/**
 * Issue Interface - Central entity connecting all civic data
 *
 * RELATIONSHIP STRUCTURE:
 * ======================
 * Issues serve as the central hub connecting users' interests to:
 * - related_offices: Array of office IDs that handle this issue
 * - related_measures: Array of ballot measure IDs that address this issue
 *
 * This structure enables efficient querying for frontend screens like
 * OfficeMappingScreen and CandidatesScreen based on user issue selections.
 */
export interface Issue {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  // NEW: Relationship fields for backend integration
  related_offices: string[];    // Office IDs that handle this issue
  related_measures: string[];   // Ballot measure IDs that address this issue
}

/**
 * Office Interface - Political positions voters elect candidates for
 *
 * RELATIONSHIP STRUCTURE:
 * ======================
 * Offices define which issues they have authority over through related_issues array.
 * This enables the frontend to:
 * 1. Show relevant offices for user's selected issues (OfficeMappingScreen)
 * 2. Filter candidates by issue relevance through their target office
 *
 * LEVEL HIERARCHY:
 * ===============
 * - local: City Council, School Board, County Commissioner, Mayor, Sheriff
 * - state: State Legislature, Governor, State Attorney General
 * - federal: Congress, Senate, President
 */
export interface Office {
  id: string;
  name: string;
  description: string;
  explanation: string;          // Detailed explanation of office's impact on issues
  level: 'local' | 'state' | 'federal';
  // NEW: Relationship field for backend integration
  related_issues: string[];     // Issue IDs this office has authority over
}

/**
 * BallotMeasure Interface - Propositions and initiatives voters decide on
 *
 * RELATIONSHIP STRUCTURE:
 * ======================
 * Ballot measures specify which issues they address through related_issues array.
 * This enables the frontend to:
 * 1. Show relevant measures for user's selected issues (OfficeMappingScreen)
 * 2. Display measures alongside candidates (CandidatesScreen)
 * 3. Group measures by issue category for better organization
 *
 * DISPLAY NOTES:
 * =============
 * - isStarred is managed by frontend state for user preferences
 * - category provides grouping for display (Education, Transportation, etc.)
 * - impact explains the real-world effect if measure passes
 */
export interface BallotMeasure {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  // NEW: Relationship field for backend integration
  related_issues: string[];     // Issue IDs this measure addresses
  // Frontend-only field for user preferences
  isStarred: boolean;
}

/**
 * Candidate Interface - People running for political offices
 *
 * RELATIONSHIP STRUCTURE:
 * ======================
 * Candidates relate to issues through two pathways:
 * 1. office_id: The office they're running for (which has related_issues)
 * 2. related_issues: Direct issue alignment based on their platform positions
 *
 * This dual relationship enables sophisticated filtering:
 * - Show candidates for offices that handle user's selected issues
 * - Show candidates whose platform directly addresses user's selected issues
 *
 * DISPLAY NOTES:
 * =============
 * - positions: Array of policy position statements for display
 * - photo: Avatar URL for visual identification
 * - party: Political party affiliation
 * - isStarred: Frontend-only field for user preferences
 */
export interface Candidate {
  id: string;
  name: string;
  party: string;
  photo: string;
  positions: string[];
  // UPDATED: Changed from officeId to office_id for backend consistency
  office_id: string;            // Office ID they're running for
  // NEW: Relationship field for backend integration
  related_issues: string[];     // Issue IDs their platform addresses
  // Frontend-only field for user preferences
  isStarred: boolean;
}

// ============================================================================
// USER AND APPLICATION STATE INTERFACES
// ============================================================================

/**
 * UserProfile Interface - User's demographic and preference data
 *
 * This interface remains unchanged as it's purely frontend state management
 * for tracking user selections throughout the 7-step flow.
 */
export interface UserProfile {
  selectedIssues: string[];
  ageGroup: string;
  communityRole: string[];
  zipCode: string;
}

/**
 * AppState Interface - Global application state
 *
 * BACKEND INTEGRATION FIELDS:
 * ===========================
 * - issues: Complete issue objects loaded from backend with relationships
 * - issuesLoading/issuesError: Loading state management for issue data
 *
 * CIVIC DATA CACHING:
 * ==================
 * The app state serves as a cache for civic data loaded from the backend.
 * This prevents unnecessary API calls when navigating between screens.
 *
 * FUTURE ENHANCEMENT:
 * ==================
 * Could be extended to cache offices, ballot_measures, and candidates
 * for even better performance and offline capability.
 */
export interface AppState {
  currentStep: number;
  userProfile: UserProfile;
  starredCandidates: string[];
  starredMeasures: string[];
  feedback: string;
  finalScreenType: 'cast' | 'thankyou' | null;
  // Backend-driven civic data management
  issues: Issue[];
  issuesLoading: boolean;
  issuesError: string | null;
  // Office tracking for candidates display
  displayedOffices: string[];
  // Email and readiness response tracking
  userEmail: string;
  emailOptIn: boolean;
  readinessResponse: 'yes' | 'no' | 'still-thinking' | null;
}

// ============================================================================
// API RESPONSE INTERFACES - For Backend Communication
// ============================================================================

/**
 * API Response Interfaces for Backend Endpoints
 *
 * These interfaces define the expected structure of responses from the
 * Flask backend API endpoints. They include metadata like timestamps
 * and filtering information for better debugging and user experience.
 */

/**
 * OfficesResponse - Response from /api/offices endpoint
 */
export interface OfficesResponse {
  offices: Office[];
  total_offices: number;
  filtered_by_issues: string[] | null;
  timestamp: string;
}

/**
 * BallotMeasuresResponse - Response from /api/ballot-measures endpoint
 */
export interface BallotMeasuresResponse {
  ballot_measures: BallotMeasure[];
  total_measures: number;
  filtered_by_issues: string[] | null;
  timestamp: string;
}

/**
 * CandidatesResponse - Response from /api/candidates endpoint
 */
export interface CandidatesResponse {
  candidates: Candidate[];
  total_candidates: number;
  filtered_by_issues: string[] | null;
  timestamp: string;
}

/**
 * CivicDataResponse - Response from /api/civic-data endpoint
 *
 * This comprehensive response includes all civic entity types in one call,
 * useful for initial app loading or screens that need multiple data types.
 */
export interface CivicDataResponse {
  issues: Issue[];
  offices: Office[];
  ballot_measures: BallotMeasure[];
  candidates: Candidate[];
  total_users: number;
  filtered_by_issues: string[] | null;
  timestamp: string;
}

/**
 * IssuesResponse - Response from /api/issues endpoint (existing, updated for consistency)
 */
export interface IssuesResponse {
  issues: Issue[];
  total_users: number;
  timestamp: string;
}

// ============================================================================
// UTILITY TYPES - For component props and filtering
// ============================================================================

/**
 * Utility types for component props and data manipulation
 */

/**
 * IssueMapping - For organizing entities by their related issues
 * Used in screens like OfficeMappingScreen to group offices and measures by issue
 */
export interface IssueMapping<T> {
  issue: Issue;
  entities: T[];
}

/**
 * EntityWithIssueContext - For components that need both entity data and issue context
 * Useful for displaying entities with their issue relevance highlighted
 */
export interface EntityWithIssueContext<T> {
  entity: T;
  relevantIssues: Issue[];
  selectedIssueIds: string[];
}