"""
Flask Backend for Flint Spark Civic Engagement App

This is the main Flask application that handles API requests from the React frontend.
It provides endpoints for tracking issue frequencies and managing social proof data.

Learning objectives:
- Understand Flask application structure
- Learn about HTTP methods and JSON responses
- Practice CORS configuration for frontend-backend communication
- Implement in-memory data storage patterns
"""

# Import Flask and related modules
from flask import Flask, request, jsonify
from flask_cors import CORS
import os, re
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
# Specify the path to the backend .env file explicitly
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# Import your data store modules
from data_store import IssueDataStore, create_data_store  # Legacy support
from supabase_client import SupabaseDataStore, create_supabase_data_store  # New Supabase client
from config import get_config

# ============================================================================
# APPLICATION FACTORY PATTERN
# ============================================================================

def create_app():
    """
    Application factory function.

    This pattern allows you to create multiple app instances with different
    configurations (development, testing, production).

    Returns:
        Flask: Configured Flask application instance
    """
    # Create Flask application instance
    app = Flask(__name__)

    # ========================================================================
    # CONFIGURATION
    # ========================================================================

    # Set debug mode for development (auto-reload on code changes)
    app.config['DEBUG'] = True

    # TODO: Add any other configuration you need
    # Examples:
    # app.config['SECRET_KEY'] = 'your-secret-key-here'
    # app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

    # ========================================================================
    # CORS CONFIGURATION
    # ========================================================================

    # CORS (Cross-Origin Resource Sharing) allows your React app (port 8080)
    # to make requests to your Flask app (port 5000)

    # Configure CORS with proper settings including Vercel deployment support
    origins = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8081"
    ]
    # Allow all Vercel preview & prod for this project
    vercel_regex = re.compile(r"https://.*\.vercel\.app")
    CORS(app, resources={r"/*": {"origins": origins + [vercel_regex]}})

    # ========================================================================
    # DATA STORE INITIALIZATION
    # ========================================================================

    # Initialize your data store - try Supabase first, fallback to in-memory
    try:
        # Load configuration to get Supabase credentials
        config = get_config()

        if config.SUPABASE_URL and config.SUPABASE_KEY:
            # Use Supabase for persistent storage
            app.issue_store = create_supabase_data_store(config.SUPABASE_URL, config.SUPABASE_KEY)
            print("✅ Supabase data store initialized successfully")
        else:
            # Fallback to in-memory storage if Supabase not configured
            print("⚠️  Supabase credentials not found, falling back to in-memory storage")
            app.issue_store = create_data_store()
            print("✅ In-memory data store initialized successfully")
    except Exception as e:
        # If Supabase fails, fallback to in-memory storage
        print(f"⚠️  Supabase initialization failed: {e}")
        print("📝 Falling back to in-memory storage")
        app.issue_store = create_data_store()
        print("✅ In-memory data store initialized successfully")

    # ========================================================================
    # UTILITY FUNCTIONS
    # ========================================================================

    def log_request(endpoint, method, data=None):
        """
        Log incoming requests for debugging.

        Args:
            endpoint (str): The API endpoint being called
            method (str): HTTP method (GET, POST, etc.)
            data (dict, optional): Request data if applicable
        """
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {method} {endpoint}")
        if data:
            print(f"    Data: {data}")

    # ========================================================================
    # API ROUTES
    # ========================================================================

    @app.route('/')
    def health_check():
        """
        Basic health check endpoint.

        This is useful for testing if your server is running.
        Try visiting http://localhost:5000 in your browser.
        """
        return jsonify({
            "status": "healthy",
            "message": "Flint Spark Backend is running!",
            "timestamp": datetime.now().isoformat()
        })

    @app.route('/api/issues/frequencies', methods=['GET'])
    def get_issue_frequencies():
        """
        Get current frequency counts for all issues.

        This endpoint returns the current "social proof" data showing
        how many people have selected each issue.

        Returns:
            JSON: Dictionary with issue frequencies

        Example response:
        {
            "frequencies": {
                "housing": 1247,
                "education": 982,
                "healthcare": 1156
            },
            "total_users": 3385
        }
        """
        log_request('/api/issues/frequencies', 'GET')
        frequencies = app.issue_store.get_frequencies()
        total_users = app.issue_store.get_total_users()

        # TODO: Implement this endpoint
        # You need to:
        # 1. Get frequency data from your data store
        # 2. Format it as JSON
        # 3. Return the response

        # Placeholder response (replace with real implementation)
        return jsonify({
            "frequencies": frequencies,
            "total_users": total_users
        })

    @app.route('/api/issues', methods=['GET'])
    def get_all_issues():
        """
        Get complete issue definitions with current counts.

        NEW ENDPOINT: This is the primary endpoint for the frontend to fetch
        all issue data. It returns complete issue objects (metadata + counts)
        making the backend the single source of truth for issue definitions.

        This replaces the previous approach where issue metadata was hardcoded
        in the frontend and only frequencies were fetched from the backend.

        Returns:
            JSON: Array of complete issue objects

        Example response:
        {
            "issues": [
                {
                    "id": "housing",
                    "name": "Housing",
                    "icon": "Home",
                    "description": "Affordable housing, rent control, and homeownership programs",
                    "count": 1247
                },
                {
                    "id": "education",
                    "name": "Education",
                    "icon": "GraduationCap",
                    "description": "School funding, curriculum, and educational opportunities",
                    "count": 982
                }
            ],
            "total_users": 3385,
            "timestamp": "2025-01-20T10:30:00Z"
        }
        """
        log_request('/api/issues', 'GET')

        # Get complete issue objects from data store
        issues = app.issue_store.get_all_issues()
        total_users = app.issue_store.get_total_users()

        return jsonify({
            "issues": issues,
            "total_users": total_users,
            "timestamp": datetime.now().isoformat()
        })

    @app.route('/api/issues/increment', methods=['POST'])
    def increment_issue_counts():
        """
        Increment the count for selected issues.

        This endpoint is called when a user selects their issues on the
        IssueSelectionScreen. It increases the frequency count for each
        selected issue.

        Expected request body:
        {
            "issueIds": ["housing", "education", "healthcare"],
            "userId": "optional-user-identifier"  # for preventing duplicates
        }

        Returns:
            JSON: Success response with updated counts
        """
        log_request('/api/issues/increment', 'POST', request.get_json())

        # TODO: Implement this endpoint
        # You need to:
        # 1. Get the JSON data from the request
        # 2. Validate that issueIds is provided and is a list
        # 3. Update your data store with the new counts
        # 4. Return a success response

        # Get JSON data from request
        data = request.get_json()

        # TODO: Add validation
        # Check if 'issueIds' is in the data
        # Check if it's a list
        # Check if the issue IDs are valid
        if not data or "issueIds" not in data:
            return jsonify({
                "error":"issueIds is required."
            }), 400

        # TODO: Update your data store
        # Increment the count for each issue in issueIds
        success = app.issue_store.increment_issues(data["issueIds"], data.get("userId"))
        if not success:
            return jsonify({"error": "Failed to  increment - duplicate user or invalid data"}), 400

        return jsonify({
            "success": True,
            "message": "Issue counts updated successfully",
            "updated_issues": data.get('issueIds', []) if data else []
        })

    @app.route('/api/issues/reset', methods=['POST'])
    def reset_issue_counts():
        """
        Reset all issue counts to initial demo values.

        This is useful for demo purposes - you can reset the data between
        demonstrations to show fresh social proof numbers.

        Returns:
            JSON: Success response
        """
        log_request('/api/issues/reset', 'POST')

        # TODO: Implement this endpoint
        # You need to:
        # 1. Reset your data store to initial demo values
        # 2. Return a success response
        app.issue_store.reset_to_demo_data()

        # Placeholder response (replace with real implementation)
        return jsonify({
            "success": True,
            "message": "All civic data has been reset to demo values"
        })

    # ========================================================================
    # NEW CIVIC ENTITY ENDPOINTS - Offices, Ballot Measures, Candidates
    # ========================================================================

    @app.route('/api/offices', methods=['GET'])
    def get_offices():
        """
        Get offices filtered by user's selected issues.

        QUERY PARAMETER FILTERING:
        =========================
        This endpoint supports filtering offices by the issues a user has selected:
        - ?issues=housing,education → Returns offices that handle housing OR education
        - No issues parameter → Returns all available offices

        FRONTEND INTEGRATION:
        ====================
        This endpoint replaces the hardcoded office mapping logic in OfficeMappingScreen.tsx.
        The frontend can now get dynamically filtered office data based on user selections.

        Query Parameters:
            issues (optional): Comma-separated list of issue IDs to filter by

        Returns:
            JSON: Array of office objects relevant to the specified issues

        Example requests:
            GET /api/offices?issues=housing,education
            GET /api/offices (all offices)

        Example response:
        {
            "offices": [
                {
                    "id": "city-council",
                    "name": "City Council",
                    "description": "District Representative",
                    "explanation": "City Council members vote on zoning laws...",
                    "level": "local",
                    "related_issues": ["housing"]
                },
                {
                    "id": "school-board",
                    "name": "School Board",
                    "description": "District Trustee",
                    "explanation": "School Board members decide on curriculum...",
                    "level": "local",
                    "related_issues": ["education"]
                }
            ],
            "total_offices": 2,
            "filtered_by_issues": ["housing", "education"],
            "timestamp": "2025-01-20T10:30:00Z"
        }
        """
        log_request('/api/offices', 'GET', request.args.to_dict())

        # Extract issues filter from query parameters
        issues_param = request.args.get('issues', '')
        if issues_param:
            # Parse comma-separated issue IDs
            selected_issues = [issue.strip() for issue in issues_param.split(',') if issue.strip()]
            # Get offices that handle any of the selected issues
            offices = app.issue_store.get_offices_by_issues(selected_issues)
            filtered_by = selected_issues
        else:
            # Return all offices if no filter specified
            offices = app.issue_store.get_all_offices()
            filtered_by = None

        return jsonify({
            "offices": offices,
            "total_offices": len(offices),
            "filtered_by_issues": filtered_by,
            "timestamp": datetime.now().isoformat()
        })

    @app.route('/api/ballot-measures', methods=['GET'])
    def get_ballot_measures():
        """
        Get ballot measures filtered by user's selected issues.

        QUERY PARAMETER FILTERING:
        =========================
        Similar to the offices endpoint, this supports filtering ballot measures
        by the issues they address:
        - ?issues=education,transportation → Returns measures addressing these issues
        - No issues parameter → Returns all available ballot measures

        FRONTEND INTEGRATION:
        ====================
        This endpoint replaces hardcoded ballot measure data in both
        OfficeMappingScreen.tsx and CandidatesScreen.tsx, providing a single
        source of truth for ballot measure information.

        Query Parameters:
            issues (optional): Comma-separated list of issue IDs to filter by

        Returns:
            JSON: Array of ballot measure objects addressing the specified issues

        Example requests:
            GET /api/ballot-measures?issues=education,transportation
            GET /api/ballot-measures (all measures)

        Example response:
        {
            "ballot_measures": [
                {
                    "id": "measure-edu-1",
                    "title": "School Bond Initiative - Measure A",
                    "description": "Authorizes $500 million in bonds...",
                    "category": "Education",
                    "impact": "Would increase property taxes...",
                    "related_issues": ["education"]
                },
                {
                    "id": "measure-trans-1",
                    "title": "Public Transit Expansion - Measure B",
                    "description": "Funds the extension of light rail...",
                    "category": "Transportation",
                    "impact": "Would provide improved transit access...",
                    "related_issues": ["transportation"]
                }
            ],
            "total_measures": 2,
            "filtered_by_issues": ["education", "transportation"],
            "timestamp": "2025-01-20T10:30:00Z"
        }
        """
        log_request('/api/ballot-measures', 'GET', request.args.to_dict())

        # Extract issues filter from query parameters
        issues_param = request.args.get('issues', '')
        if issues_param:
            # Parse comma-separated issue IDs
            selected_issues = [issue.strip() for issue in issues_param.split(',') if issue.strip()]
            # Get ballot measures that address any of the selected issues
            ballot_measures = app.issue_store.get_ballot_measures_by_issues(selected_issues)
            filtered_by = selected_issues
        else:
            # Return all ballot measures if no filter specified
            ballot_measures = app.issue_store.get_all_ballot_measures()
            filtered_by = None

        return jsonify({
            "ballot_measures": ballot_measures,
            "total_measures": len(ballot_measures),
            "filtered_by_issues": filtered_by,
            "timestamp": datetime.now().isoformat()
        })

    @app.route('/api/candidates', methods=['GET'])
    def get_candidates():
        """
        Get candidates filtered by user's selected issues.

        QUERY PARAMETER FILTERING:
        =========================
        This endpoint filters candidates based on issue relevance through two pathways:
        1. **Direct Issue Alignment**: Candidates whose platform addresses the selected issues
        2. **Office-Based Relevance**: Candidates running for offices that handle the selected issues

        FRONTEND INTEGRATION:
        ====================
        This endpoint replaces hardcoded candidate data in CandidatesScreen.tsx,
        enabling dynamic candidate filtering based on user issue preferences.

        Query Parameters:
            issues (optional): Comma-separated list of issue IDs to filter by

        Returns:
            JSON: Array of candidate objects relevant to the specified issues

        Example requests:
            GET /api/candidates?issues=housing,environment
            GET /api/candidates (all candidates)

        Example response:
        {
            "candidates": [
                {
                    "id": "candidate-1",
                    "name": "Sarah Chen",
                    "party": "Democratic",
                    "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                    "positions": [
                        "Supports affordable housing initiatives...",
                        "Champions climate action..."
                    ],
                    "office_id": "city-council",
                    "related_issues": ["housing", "education", "environment"]
                },
                {
                    "id": "candidate-3",
                    "name": "Elena Rodriguez",
                    "party": "Independent",
                    "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
                    "positions": [
                        "Supports sustainable transportation..."
                    ],
                    "office_id": "mayor",
                    "related_issues": ["transportation", "infrastructure", "rights"]
                }
            ],
            "total_candidates": 2,
            "filtered_by_issues": ["housing", "environment"],
            "timestamp": "2025-01-20T10:30:00Z"
        }
        """
        log_request('/api/candidates', 'GET', request.args.to_dict())

        # Extract filters from query parameters
        issues_param = request.args.get('issues', '')
        offices_param = request.args.get('offices', '')

        # Prioritize office filtering since that's the primary use case for CandidatesScreen
        if offices_param:
            # Parse comma-separated office IDs
            selected_offices = [office.strip() for office in offices_param.split(',') if office.strip()]
            # Get candidates running for any of the specified offices
            candidates = app.issue_store.get_candidates_by_offices(selected_offices)
            filtered_by = {"offices": selected_offices}
        elif issues_param:
            # Parse comma-separated issue IDs (legacy behavior)
            selected_issues = [issue.strip() for issue in issues_param.split(',') if issue.strip()]
            # Get candidates relevant to any of the selected issues
            candidates = app.issue_store.get_candidates_by_issues(selected_issues)
            filtered_by = {"issues": selected_issues}
        else:
            # Return all candidates if no filter specified
            candidates = app.issue_store.get_all_candidates()
            filtered_by = None

        return jsonify({
            "candidates": candidates,
            "total_candidates": len(candidates),
            "filtered_by": filtered_by,
            "timestamp": datetime.now().isoformat()
        })

    # ========================================================================
    # COMPREHENSIVE CIVIC DATA ENDPOINT - All entities in one call
    # ========================================================================

    @app.route('/api/civic-data', methods=['GET'])
    def get_civic_data():
        """
        Get all civic data (issues, offices, ballot measures, candidates) in a single request.

        COMPREHENSIVE DATA ENDPOINT:
        ===========================
        This endpoint provides all civic data in one API call, with optional filtering
        by selected issues. This is useful for:
        1. Initial app loading (get everything at once)
        2. Reducing API calls for screens that need multiple entity types
        3. Ensuring data consistency across all entities

        QUERY PARAMETER FILTERING:
        =========================
        When issues are specified, all entities are filtered by relevance:
        - Issues: Always included (needed for relationships)
        - Offices: Filtered to those handling the specified issues
        - Ballot Measures: Filtered to those addressing the specified issues
        - Candidates: Filtered to those relevant to the specified issues

        Query Parameters:
            issues (optional): Comma-separated list of issue IDs to filter by

        Returns:
            JSON: Complete civic dataset with optional filtering

        Example requests:
            GET /api/civic-data?issues=housing,education
            GET /api/civic-data (all data)

        Example response:
        {
            "issues": [...],
            "offices": [...],
            "ballot_measures": [...],
            "candidates": [...],
            "total_users": 1200,
            "filtered_by_issues": ["housing", "education"],
            "timestamp": "2025-01-20T10:30:00Z"
        }
        """
        log_request('/api/civic-data', 'GET', request.args.to_dict())

        # Extract issues filter from query parameters
        issues_param = request.args.get('issues', '')

        # Always include all issues (needed for relationships and display)
        issues = app.issue_store.get_all_issues()

        if issues_param:
            # Parse comma-separated issue IDs for filtering
            selected_issues = [issue.strip() for issue in issues_param.split(',') if issue.strip()]

            # Filter all entity types by the selected issues
            offices = app.issue_store.get_offices_by_issues(selected_issues)
            ballot_measures = app.issue_store.get_ballot_measures_by_issues(selected_issues)
            candidates = app.issue_store.get_candidates_by_issues(selected_issues)
            filtered_by = selected_issues
        else:
            # Return all data if no filter specified
            offices = app.issue_store.get_all_offices()
            ballot_measures = app.issue_store.get_all_ballot_measures()
            candidates = app.issue_store.get_all_candidates()
            filtered_by = None

        total_users = app.issue_store.get_total_users()

        return jsonify({
            "issues": issues,
            "offices": offices,
            "ballot_measures": ballot_measures,
            "candidates": candidates,
            "total_users": total_users,
            "filtered_by_issues": filtered_by,
            "timestamp": datetime.now().isoformat()
        })

    # ========================================================================
    # USER COMPLETION AND EMAIL ENDPOINTS
    # ========================================================================

    @app.route('/api/user-completion', methods=['POST'])
    def store_user_completion():
        """
        Store complete user journey data including readiness response and selections.

        This endpoint captures the full user experience when they complete the
        ReadyToCastScreen, regardless of their response (yes/no/still-thinking).

        Expected JSON payload:
        {
            "user_profile": {
                "selectedIssues": ["housing", "education"],
                "ageGroup": "25-34",
                "communityRole": ["parent"],
                "zipCode": "90210"
            },
            "starred_candidates": ["candidate-1", "candidate-2"],
            "starred_measures": ["measure-edu-1"],
            "readiness_response": "yes" | "no" | "still-thinking",
            "session_id": "unique-session-id"
        }

        Returns:
            JSON: Success/error response with stored data confirmation
        """
        log_request('/api/user-completion', 'POST')

        try:
            # Get request data
            data = request.get_json()
            if not data:
                return jsonify({
                    "success": False,
                    "error": "No JSON data provided"
                }), 400

            # Add completion timestamp
            completion_data = {
                **data,
                "completed_at": datetime.now().isoformat()
            }

            # Store the completion data
            success = app.issue_store.store_user_completion(completion_data)

            if success:
                return jsonify({
                    "success": True,
                    "message": "User completion data stored successfully",
                    "readiness_response": data.get("readiness_response"),
                    "timestamp": completion_data["completed_at"]
                })
            else:
                return jsonify({
                    "success": False,
                    "error": "Failed to store user completion data"
                }), 500

        except Exception as e:
            print(f"❌ Error in /api/user-completion: {e}")
            return jsonify({
                "success": False,
                "error": f"Server error: {str(e)}"
            }), 500

    @app.route('/api/email-signup', methods=['POST'])
    def store_email_signup():
        """
        Store email signup data from various screens (ThankYou, Cast).

        This endpoint handles email signups from both the ThankYouScreen and
        CastItScreen, tracking the source and user consent preferences.

        Expected JSON payload:
        {
            "email": "user@example.com",
            "source": "thankyou" | "cast",
            "wants_updates": true | false,
            "user_profile": {...},      // Optional: user demographic data
            "ballot_data": {...},       // Optional: for cast screen signups
            "session_id": "unique-session-id"
        }

        Returns:
            JSON: Success/error response with email confirmation
        """
        log_request('/api/email-signup', 'POST')

        try:
            # Get request data
            data = request.get_json()
            if not data:
                return jsonify({
                    "success": False,
                    "error": "No JSON data provided"
                }), 400

            # Add signup timestamp
            email_data = {
                **data,
                "timestamp": datetime.now().isoformat()
            }

            # Store the email signup
            success = app.issue_store.store_email_signup(email_data)

            if success:
                return jsonify({
                    "success": True,
                    "message": "Email signup stored successfully",
                    "email": data.get("email"),
                    "source": data.get("source"),
                    "timestamp": email_data["timestamp"]
                })
            else:
                return jsonify({
                    "success": False,
                    "error": "Failed to store email signup"
                }), 500

        except Exception as e:
            print(f"❌ Error in /api/email-signup: {e}")
            return jsonify({
                "success": False,
                "error": f"Server error: {str(e)}"
            }), 500

    @app.route('/api/readiness-stats', methods=['GET'])
    def get_readiness_stats():
        """
        Get statistics on user readiness responses for analytics.

        This endpoint provides insights into how users respond to the
        "Are you ready to cast your vote?" question.

        Returns:
            JSON: Count of each readiness response type

        Example response:
        {
            "stats": {
                "yes": 45,
                "no": 12,
                "still-thinking": 8
            },
            "total_responses": 65,
            "timestamp": "2024-01-15T10:30:00"
        }
        """
        log_request('/api/readiness-stats', 'GET')

        try:
            # Get readiness statistics
            stats = app.issue_store.get_readiness_stats()
            total_responses = sum(stats.values())

            return jsonify({
                "success": True,
                "stats": stats,
                "total_responses": total_responses,
                "timestamp": datetime.now().isoformat()
            })

        except Exception as e:
            print(f"❌ Error in /api/readiness-stats: {e}")
            return jsonify({
                "success": False,
                "error": f"Server error: {str(e)}"
            }), 500
        
    
    # ========================================================================
    # TESTING AND DEBUG ENDPOINTS
    # ========================================================================

    @app.route('/api/debug/emails', methods=['GET'])
    def get_stored_emails():
        """
        Debug endpoint to view all stored email signups.

        Query Parameters:
            limit (optional): Maximum number of emails to return
            source (optional): Filter by source ('thankyou', 'cast')

        Returns:
            JSON: List of stored email signups for testing
        """
        log_request('/api/debug/emails', 'GET')

        try:
            # Get query parameters
            limit = request.args.get('limit', type=int)
            source = request.args.get('source')

            # Get stored email signups
            emails = app.issue_store.get_email_signups(limit=limit, source=source)

            return jsonify({
                "success": True,
                "emails": emails,
                "total_count": len(emails),
                "timestamp": datetime.now().isoformat()
            })

        except Exception as e:
            print(f"❌ Error in /api/debug/emails: {e}")
            return jsonify({
                "success": False,
                "error": f"Server error: {str(e)}"
            }), 500

    @app.route('/api/debug/completions', methods=['GET'])
    def get_stored_completions():
        """
        Debug endpoint to view all stored user completions.

        Query Parameters:
            limit (optional): Maximum number of completions to return

        Returns:
            JSON: List of stored user completion data for testing
        """
        log_request('/api/debug/completions', 'GET')

        try:
            # Get query parameters
            limit = request.args.get('limit', type=int)

            # Get stored user completions
            completions = app.issue_store.get_user_completions(limit=limit)

            return jsonify({
                "success": True,
                "completions": completions,
                "total_count": len(completions),
                "timestamp": datetime.now().isoformat()
            })

        except Exception as e:
            print(f"❌ Error in /api/debug/completions: {e}")
            return jsonify({
                "success": False,
                "error": f"Server error: {str(e)}"
            }), 500

    # ========================================================================
    # ERROR HANDLERS
    # ========================================================================

    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors with a JSON response."""
        return jsonify({
            "error": "Not Found",
            "message": "The requested endpoint does not exist"
        }), 404

    @app.errorhandler(400)
    def bad_request(error):
        """Handle 400 errors with a JSON response."""
        return jsonify({
            "error": "Bad Request",
            "message": "Invalid request data"
        }), 400

    # TODO: Add more error handlers as needed
    # - 500 Internal Server Error
    # - 405 Method Not Allowed

    return app

# ============================================================================
# APPLICATION ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    """
    This block runs when you execute: python app.py

    It creates the Flask app and starts the development server.
    """

    # Create the Flask application
    app = create_app()

    # TODO: Configure the development server
    # You might want to specify:
    # - host: '0.0.0.0' to allow external connections
    # - port: 5000 (default) or another port if 5000 is busy
    # - debug: True for development (auto-reload)

    print("🚀 Starting Flint Spark Backend...")
    print("📍 API will be available at: http://localhost:5000")
    print("🔧 Debug mode enabled - server will restart on code changes")
    print("💡 Visit http://localhost:5000 to test the health check")
    print("---")

    # Start the development server
    app.run(
        host='127.0.0.1',  # localhost only for security
        port=5001,         # using 5001 to avoid macOS AirPlay conflict
        debug=True  # Enable debug mode for development
    )