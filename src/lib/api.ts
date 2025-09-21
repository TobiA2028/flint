/**
 * API Client for Flint Spark Civic Engagement Backend
 *
 * This module creates a centralized API client that handles all communication
 * between the React frontend and the Flask backend. It provides a clean
 * interface for making HTTP requests with proper error handling and TypeScript support.
 *
 * Learning objectives:
 * - Understand separation of concerns in frontend architecture
 * - Learn TypeScript interface design for API responses
 * - Practice async/await and Promise handling
 * - Implement proper error handling for network requests
 * - Create reusable code patterns for API communication
 */

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

/**
 * Standard API response wrapper
 *
 * This interface ensures all our API responses have a consistent structure,
 * making it easier to handle success/error cases throughout the application.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Issue frequencies response from /api/issues/frequencies
 *
 * This matches the structure returned by our Flask backend.
 */
export interface IssueFrequencies {
  frequencies: Record<string, number>;  // issue_id -> count mapping
  total_users: number;                  // total users who have participated
}

/**
 * Complete issue object returned by /api/issues
 *
 * This matches the Issue interface from the frontend types and includes
 * both metadata and current count from the backend.
 */
export interface IssueFromApi {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

/**
 * Response from /api/issues endpoint
 *
 * This returns all issue definitions with current counts,
 * making the backend the single source of truth.
 */
export interface IssuesResponse {
  issues: IssueFromApi[];
  total_users: number;
  timestamp: string;
}

/**
 * Request body for /api/issues/increment
 *
 * This defines what data we need to send when a user selects their issues.
 */
export interface IncrementIssuesRequest {
  issueIds: string[];      // Array of selected issue IDs
  userId?: string;         // Optional user session ID to prevent duplicates
}

/**
 * Success response from /api/issues/increment
 */
export interface IncrementIssuesResponse {
  success: boolean;
  message: string;
  updated_issues: string[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * API Configuration
 *
 * Centralized configuration makes it easy to change the backend URL
 * for different environments (development, production, testing).
 */
const API_CONFIG = {
  // Base URL for our Flask backend
  BASE_URL: 'http://localhost:5001',

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers for all requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique session ID for user tracking
 *
 * This creates a simple session identifier to help prevent duplicate
 * counting when users submit their issue selections multiple times.
 *
 * In a production app, you might use a more sophisticated approach
 * like JWT tokens or server-generated session IDs.
 */
export function generateSessionId(): string {
  // TODO: This is a simple implementation - you could improve it!
  // Consider using:
  // - Browser fingerprinting
  // - More sophisticated random ID generation
  // - Server-generated session tokens

  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2);
  return `session_${timestamp}_${randomPart}`;
}

/**
 * Create a timeout promise for request timeouts
 *
 * This helper allows us to cancel requests that take too long,
 * providing better user experience.
 */
function createTimeoutPromise(timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

/**
 * Enhanced fetch wrapper with timeout and error handling
 *
 * This wrapper adds timeout support and consistent error handling
 * to the standard fetch API.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = API_CONFIG.TIMEOUT
): Promise<Response> {
  // TODO: Learn about Promise.race and how it enables timeout functionality
  // Promise.race returns the first promise that resolves or rejects

  const fetchPromise = fetch(url, {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
  });

  const timeoutPromise = createTimeoutPromise(timeoutMs);

  return Promise.race([fetchPromise, timeoutPromise]);
}

// ============================================================================
// API CLIENT CLASS
// ============================================================================

/**
 * Main API Client Class
 *
 * This class encapsulates all API communication logic, providing
 * a clean interface for components to interact with the backend.
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all issue definitions with current counts
   *
   * NEW PRIMARY METHOD: This fetches complete issue objects (metadata + counts)
   * from the backend, making it the single source of truth for issue data.
   *
   * This replaces the previous approach where issue metadata was hardcoded
   * in the frontend and only frequencies were fetched separately.
   *
   * Usage in components:
   * ```typescript
   * const api = new ApiClient();
   * const response = await api.getIssues();
   * if (response.success) {
   *   console.log('Complete issue data:', response.data.issues);
   * }
   * ```
   */
  async getIssues(): Promise<ApiResponse<IssuesResponse>> {
    try {
      console.log('🔄 Fetching complete issue definitions from backend...');

      const response = await fetchWithTimeout(`${this.baseUrl}/api/issues`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: IssuesResponse = await response.json();

      console.log('✅ Successfully fetched issue definitions:', {
        count: data.issues.length,
        total_users: data.total_users,
        timestamp: data.timestamp
      });

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Failed to fetch issue definitions:', error);

      return {
        data: { issues: [], total_users: 0, timestamp: new Date().toISOString() },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get current issue frequencies and total user count
   *
   * LEGACY METHOD: This method is maintained for backwards compatibility
   * with existing social proof functionality. New code should use getIssues()
   * which provides complete issue data in one call.
   *
   * Usage in components:
   * ```typescript
   * const api = new ApiClient();
   * const response = await api.getIssueFrequencies();
   * if (response.success) {
   *   console.log('Issue data:', response.data);
   * }
   * ```
   */
  async getIssueFrequencies(): Promise<ApiResponse<IssueFrequencies>> {
    try {
      // TODO: Add logging for debugging
      console.log('🔄 Fetching issue frequencies from backend...');

      const response = await fetchWithTimeout(`${this.baseUrl}/api/issues/frequencies`);

      // TODO: Learn about HTTP status codes and how to handle them
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: IssueFrequencies = await response.json();

      console.log('✅ Successfully fetched issue frequencies:', data);

      return {
        data,
        success: true
      };

    } catch (error) {
      // TODO: Learn about different types of errors and how to handle them
      console.error('❌ Failed to fetch issue frequencies:', error);

      return {
        data: { frequencies: {}, total_users: 0 },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Increment the count for selected issues
   *
   * This method is called when a user completes the issue selection
   * screen, sending their choices to the backend for tracking.
   *
   * Usage in components:
   * ```typescript
   * const api = new ApiClient();
   * const sessionId = generateSessionId();
   * const response = await api.incrementIssues({
   *   issueIds: ['housing', 'education', 'healthcare'],
   *   userId: sessionId
   * });
   * ```
   */
  async incrementIssues(request: IncrementIssuesRequest): Promise<ApiResponse<IncrementIssuesResponse>> {
    try {
      console.log('🔄 Incrementing issue counts:', request);

      const response = await fetchWithTimeout(`${this.baseUrl}/api/issues/increment`, {
        method: 'POST',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: IncrementIssuesResponse = await response.json();

      console.log('✅ Successfully incremented issue counts:', data);

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Failed to increment issue counts:', error);

      return {
        data: { success: false, message: 'Failed to update', updated_issues: [] },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Reset all issue counts to demo data
   *
   * This is useful for demo purposes - you can reset the data
   * between demonstrations to show fresh social proof numbers.
   *
   * Note: In a production app, this endpoint would likely be
   * protected and only available to administrators.
   */
  async resetIssues(): Promise<ApiResponse<{ success: boolean; message: string }>> {
    try {
      console.log('🔄 Resetting issue counts to demo data...');

      const response = await fetchWithTimeout(`${this.baseUrl}/api/issues/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Successfully reset issue counts:', data);

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Failed to reset issue counts:', error);

      return {
        data: { success: false, message: 'Reset failed' },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ============================================================================
  // NEW CIVIC ENTITY ENDPOINTS - Offices, Ballot Measures, Candidates
  // ============================================================================

  /**
   * Get offices filtered by user's selected issues
   *
   * FRONTEND INTEGRATION:
   * ====================
   * This method replaces the hardcoded office mapping logic in OfficeMappingScreen.tsx.
   * The frontend can now get dynamically filtered office data based on user selections.
   *
   * QUERY FILTERING:
   * ===============
   * - Pass issueIds to get only offices that handle those issues
   * - Pass empty array or undefined to get all offices
   *
   * Usage in components:
   * ```typescript
   * const api = new ApiClient();
   * const response = await api.getOffices(['housing', 'education']);
   * if (response.success) {
   *   console.log('Relevant offices:', response.data.offices);
   * }
   * ```
   */
  async getOffices(issueIds?: string[]): Promise<ApiResponse<import('@/types').OfficesResponse>> {
    try {
      console.log('🔄 Fetching offices from backend...', { issueIds });

      // Build URL with optional issue filtering
      const url = new URL(`${this.baseUrl}/api/offices`);
      if (issueIds && issueIds.length > 0) {
        url.searchParams.set('issues', issueIds.join(','));
      }

      const response = await fetchWithTimeout(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Successfully fetched offices:', {
        count: data.offices.length,
        filtered_by: data.filtered_by_issues,
        timestamp: data.timestamp
      });

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Failed to fetch offices:', error);

      return {
        data: {
          offices: [],
          total_offices: 0,
          filtered_by_issues: null,
          timestamp: new Date().toISOString()
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get ballot measures filtered by user's selected issues
   *
   * FRONTEND INTEGRATION:
   * ====================
   * This method replaces hardcoded ballot measure data in both
   * OfficeMappingScreen.tsx and CandidatesScreen.tsx, providing a single
   * source of truth for ballot measure information.
   *
   * QUERY FILTERING:
   * ===============
   * - Pass issueIds to get only measures that address those issues
   * - Pass empty array or undefined to get all ballot measures
   *
   * Usage in components:
   * ```typescript
   * const api = new ApiClient();
   * const response = await api.getBallotMeasures(['education', 'transportation']);
   * if (response.success) {
   *   console.log('Relevant ballot measures:', response.data.ballot_measures);
   * }
   * ```
   */
  async getBallotMeasures(issueIds?: string[]): Promise<ApiResponse<import('@/types').BallotMeasuresResponse>> {
    try {
      console.log('🔄 Fetching ballot measures from backend...', { issueIds });

      // Build URL with optional issue filtering
      const url = new URL(`${this.baseUrl}/api/ballot-measures`);
      if (issueIds && issueIds.length > 0) {
        url.searchParams.set('issues', issueIds.join(','));
      }

      const response = await fetchWithTimeout(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Successfully fetched ballot measures:', {
        count: data.ballot_measures.length,
        filtered_by: data.filtered_by_issues,
        timestamp: data.timestamp
      });

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Failed to fetch ballot measures:', error);

      return {
        data: {
          ballot_measures: [],
          total_measures: 0,
          filtered_by_issues: null,
          timestamp: new Date().toISOString()
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get candidates filtered by user's selected issues
   *
   * FRONTEND INTEGRATION:
   * ====================
   * This method replaces hardcoded candidate data in CandidatesScreen.tsx,
   * enabling dynamic candidate filtering based on user issue preferences.
   *
   * QUERY FILTERING:
   * ===============
   * Candidates are filtered based on issue relevance through two pathways:
   * 1. Direct Issue Alignment: Candidates whose platform addresses the selected issues
   * 2. Office-Based Relevance: Candidates running for offices that handle the selected issues
   *
   * Usage in components:
   * ```typescript
   * const api = new ApiClient();
   * const response = await api.getCandidates(['housing', 'environment']);
   * if (response.success) {
   *   console.log('Relevant candidates:', response.data.candidates);
   * }
   * ```
   */
  async getCandidates(issueIds?: string[]): Promise<ApiResponse<import('@/types').CandidatesResponse>> {
    try {
      console.log('🔄 Fetching candidates from backend...', { issueIds });

      // Build URL with optional issue filtering
      const url = new URL(`${this.baseUrl}/api/candidates`);
      if (issueIds && issueIds.length > 0) {
        url.searchParams.set('issues', issueIds.join(','));
      }

      const response = await fetchWithTimeout(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Successfully fetched candidates:', {
        count: data.candidates.length,
        filtered_by: data.filtered_by_issues,
        timestamp: data.timestamp
      });

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Failed to fetch candidates:', error);

      return {
        data: {
          candidates: [],
          total_candidates: 0,
          filtered_by_issues: null,
          timestamp: new Date().toISOString()
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all civic data (issues, offices, ballot measures, candidates) in a single request
   *
   * COMPREHENSIVE DATA ENDPOINT:
   * ===========================
   * This method provides all civic data in one API call, with optional filtering
   * by selected issues. This is useful for:
   * 1. Initial app loading (get everything at once)
   * 2. Reducing API calls for screens that need multiple entity types
   * 3. Ensuring data consistency across all entities
   *
   * PERFORMANCE BENEFITS:
   * ====================
   * - Reduces network roundtrips from 4 separate calls to 1
   * - Ensures all data is from the same moment in time
   * - Simplifies loading state management
   * - Reduces backend load
   *
   * Usage in components:
   * ```typescript
   * const api = new ApiClient();
   * const response = await api.getCivicData(['housing', 'education']);
   * if (response.success) {
   *   console.log('All civic data:', response.data);
   *   // Access: data.issues, data.offices, data.ballot_measures, data.candidates
   * }
   * ```
   */
  async getCivicData(issueIds?: string[]): Promise<ApiResponse<import('@/types').CivicDataResponse>> {
    try {
      console.log('🔄 Fetching comprehensive civic data from backend...', { issueIds });

      // Build URL with optional issue filtering
      const url = new URL(`${this.baseUrl}/api/civic-data`);
      if (issueIds && issueIds.length > 0) {
        url.searchParams.set('issues', issueIds.join(','));
      }

      const response = await fetchWithTimeout(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Successfully fetched comprehensive civic data:', {
        issues: data.issues.length,
        offices: data.offices.length,
        ballot_measures: data.ballot_measures.length,
        candidates: data.candidates.length,
        total_users: data.total_users,
        filtered_by: data.filtered_by_issues,
        timestamp: data.timestamp
      });

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Failed to fetch comprehensive civic data:', error);

      return {
        data: {
          issues: [],
          offices: [],
          ballot_measures: [],
          candidates: [],
          total_users: 0,
          filtered_by_issues: null,
          timestamp: new Date().toISOString()
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Store user completion data including readiness response
   *
   * Sends complete user journey data to the backend when user completes
   * the ReadyToCastScreen, regardless of their response.
   */
  async storeUserCompletion(completionData: {
    user_profile: any;
    starred_candidates: string[];
    starred_measures: string[];
    readiness_response: 'yes' | 'no' | 'still-thinking';
    session_id?: string;
  }): Promise<ApiResponse<{ message: string; readiness_response: string; timestamp: string }>> {
    try {
      console.log('📨 Storing user completion data...');

      const response = await fetchWithTimeout(`${this.baseUrl}/api/user-completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('✅ User completion data stored successfully');
        return {
          data: {
            message: data.message,
            readiness_response: data.readiness_response,
            timestamp: data.timestamp
          },
          success: true
        };
      } else {
        throw new Error(data.error || 'Failed to store user completion data');
      }

    } catch (error) {
      console.error('❌ Failed to store user completion data:', error);

      return {
        data: {
          message: 'Failed to store completion data',
          readiness_response: completionData.readiness_response,
          timestamp: new Date().toISOString()
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Store email signup data from various screens
   *
   * Handles email signups from both ThankYouScreen and CastItScreen
   * with proper source tracking and consent preferences.
   */
  async storeEmailSignup(emailData: {
    email: string;
    source: 'thankyou' | 'cast';
    wants_updates?: boolean;
    user_profile?: any;
    ballot_data?: any;
    session_id?: string;
  }): Promise<ApiResponse<{ message: string; email: string; source: string; timestamp: string }>> {
    try {
      console.log('📧 Storing email signup...');

      const response = await fetchWithTimeout(`${this.baseUrl}/api/email-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('✅ Email signup stored successfully');
        return {
          data: {
            message: data.message,
            email: data.email,
            source: data.source,
            timestamp: data.timestamp
          },
          success: true
        };
      } else {
        throw new Error(data.error || 'Failed to store email signup');
      }

    } catch (error) {
      console.error('❌ Failed to store email signup:', error);

      return {
        data: {
          message: 'Failed to store email signup',
          email: emailData.email,
          source: emailData.source,
          timestamp: new Date().toISOString()
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Test backend connectivity
   *
   * This method can be used to check if the backend is reachable
   * and responding. Useful for debugging connection issues.
   */
  async testConnection(): Promise<ApiResponse<{ status: string; message: string }>> {
    try {
      console.log('🔄 Testing backend connection...');

      const response = await fetchWithTimeout(`${this.baseUrl}/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Backend connection successful:', data);

      return {
        data,
        success: true
      };

    } catch (error) {
      console.error('❌ Backend connection failed:', error);

      return {
        data: { status: 'error', message: 'Connection failed' },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Default API client instance
 *
 * We export a default instance so components can easily import and use
 * the API client without creating new instances everywhere.
 *
 * Usage in components:
 * ```typescript
 * import { apiClient } from '@/lib/api';
 *
 * const data = await apiClient.getIssueFrequencies();
 * ```
 */
export const apiClient = new ApiClient();

// ============================================================================
// SUPABASE INTEGRATION (OPTIONAL)
// ============================================================================

/**
 * Optional Supabase Client for Real-time Features
 *
 * This provides direct database access for features like:
 * - Real-time issue count updates
 * - Live social proof data
 * - Instant data synchronization
 *
 * Note: The Flask API remains the primary interface for most operations.
 * This is for advanced features that benefit from real-time capabilities.
 */

import { supabase, typedSupabase } from './supabase';

export class SupabaseApiClient {
  /**
   * Get all issues with real-time subscription capability
   */
  async getIssuesRealtime(callback?: (issues: any[]) => void) {
    try {
      // Initial fetch
      const { data: issues, error } = await typedSupabase
        .from('issues')
        .select('*')
        .order('name');

      if (error) throw error;

      // Set up real-time subscription if callback provided
      if (callback) {
        const subscription = typedSupabase
          .channel('issues_changes')
          .on('postgres_changes',
              { event: '*', schema: 'public', table: 'issues' },
              (payload) => {
                console.log('📡 Real-time issue update:', payload);
                // Re-fetch all issues on any change
                this.getIssuesRealtime().then(({ data }) => {
                  if (data) callback(data);
                });
              }
          )
          .subscribe();

        // Return unsubscribe function
        return {
          data: issues,
          unsubscribe: () => subscription.unsubscribe()
        };
      }

      return { data: issues };

    } catch (error) {
      console.error('❌ Error fetching issues from Supabase:', error);
      return { data: null, error };
    }
  }

  /**
   * Increment issue counts directly in Supabase
   * (Alternative to Flask API for real-time updates)
   */
  async incrementIssuesDirect(issueIds: string[], userId?: string) {
    try {
      const updates = await Promise.all(
        issueIds.map(async (issueId) => {
          const { data, error } = await typedSupabase.rpc('increment_issue_count', {
            issue_id_param: issueId
          });

          if (error) throw error;
          return data;
        })
      );

      console.log('✅ Issues incremented directly via Supabase');
      return { success: true, data: updates };

    } catch (error) {
      console.error('❌ Error incrementing issues via Supabase:', error);
      return { success: false, error };
    }
  }

  /**
   * Store user completion directly in Supabase
   */
  async storeUserCompletionDirect(completionData: any) {
    try {
      const { data, error } = await typedSupabase
        .from('user_completions')
        .insert({
          user_profile: completionData.user_profile,
          starred_candidates: completionData.starred_candidates,
          starred_measures: completionData.starred_measures,
          readiness_response: completionData.readiness_response,
          session_id: completionData.session_id,
          completed_at: completionData.completed_at || new Date().toISOString()
        });

      if (error) throw error;

      console.log('✅ User completion stored directly via Supabase');
      return { success: true, data };

    } catch (error) {
      console.error('❌ Error storing user completion via Supabase:', error);
      return { success: false, error };
    }
  }
}

// Export Supabase client instance
export const supabaseApiClient = new SupabaseApiClient();

// Export Supabase client for direct use
export { supabase, typedSupabase };

// ============================================================================
// REACT HOOKS (OPTIONAL ADVANCED FEATURE)
// ============================================================================

/**
 * TODO: Advanced Learning Exercise
 *
 * You could create custom React hooks that encapsulate API calls
 * and provide loading/error states automatically. For example:
 *
 * ```typescript
 * export function useIssueFrequencies() {
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = useState(false);
 *   const [error, setError] = useState(null);
 *
 *   const fetchData = async () => {
 *     setLoading(true);
 *     const response = await apiClient.getIssueFrequencies();
 *     if (response.success) {
 *       setData(response.data);
 *     } else {
 *       setError(response.error);
 *     }
 *     setLoading(false);
 *   };
 *
 *   return { data, loading, error, refetch: fetchData };
 * }
 * ```
 *
 * This would make components even cleaner by handling state management
 * automatically. Consider implementing this as a learning exercise!
 */

// ============================================================================
// LEARNING EXERCISES AND NEXT STEPS
// ============================================================================

/**
 * TODO Exercise 1: Test the API Client
 *
 * Try these in the browser console:
 * 1. Import the API client
 * 2. Test connection: await apiClient.testConnection()
 * 3. Get frequencies: await apiClient.getIssueFrequencies()
 * 4. Make sure your Flask backend is running on port 5000!
 */

/**
 * TODO Exercise 2: Error Handling
 *
 * Test error scenarios:
 * 1. Stop your Flask backend and try API calls
 * 2. Modify the BASE_URL to an invalid address
 * 3. See how the error handling works
 * 4. Think about how to improve user experience during errors
 */

/**
 * TODO Exercise 3: Enhancement Ideas
 *
 * Consider implementing:
 * 1. Request caching to avoid duplicate API calls
 * 2. Retry logic for failed requests
 * 3. Request cancellation for component unmounting
 * 4. Progress tracking for slow requests
 * 5. Request deduplication for rapid successive calls
 */

/**
 * TODO Exercise 4: TypeScript Learning
 *
 * Experiment with:
 * 1. Adding new interfaces for additional API endpoints
 * 2. Using generic types for reusable API patterns
 * 3. Creating union types for different response formats
 * 4. Adding optional vs required fields in interfaces
 */