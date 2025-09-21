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
import os
from datetime import datetime

# Import your data store module
from data_store import IssueDataStore, create_data_store
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

    # Configure CORS with proper settings
    # This allows your React app to communicate with the Flask API
    CORS(app,
         origins=["http://localhost:8080", "http://127.0.0.1:8080"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"])

    # ========================================================================
    # DATA STORE INITIALIZATION
    # ========================================================================

    # Initialize your data store
    # This will hold all the issue frequency data in memory
    app.issue_store = create_data_store()
    print("✅ Data store initialized successfully")

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
            "message": "All issue counts have been reset to demo values"
        })

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